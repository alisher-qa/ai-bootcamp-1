import {
  Server,
  StdioServerTransport,
  Tool,
  TextContent,
  ToolUseBlock,
  CallToolRequest,
  CallToolResult,
  ResponseMetadata,
} from "@modelcontextprotocol/sdk/server/index.js";
import { JsonRpcMessage } from "@modelcontextprotocol/sdk/shared/jsonrpc.js";

interface TMSTestCase {
  id: string;
  title: string;
  steps: string[];
  priority: string;
}

const testCases: Record<string, TMSTestCase> = {
  "QA-842": {
    id: "QA-842",
    title: "User login and dashboard verification",
    steps: [
      "Open login page",
      "Enter valid credentials",
      "Click submit button",
      "Verify dashboard is visible",
    ],
    priority: "high",
  },
  "QA-843": {
    id: "QA-843",
    title: "User registration flow",
    steps: [
      "Navigate to sign up page",
      "Fill in email address",
      "Create password",
      "Verify email confirmation",
      "Complete registration",
    ],
    priority: "high",
  },
  "QA-844": {
    id: "QA-844",
    title: "Password reset functionality",
    steps: [
      "Click forgot password link",
      "Enter registered email",
      "Check email for reset link",
      "Click reset link from email",
      "Enter new password",
      "Confirm password change successful",
    ],
    priority: "medium",
  },
};

class TMSMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server({
      name: "tms-mcp-server",
      version: "1.0.0",
    });

    this.setupTools();
    this.setupHandlers();
  }

  private setupTools(): void {
    const getTmsStepsTool: Tool = {
      name: "get_tms_steps",
      description:
        "Retrieve test case steps from Test Management System (TMS) by case ID. Returns the structured test steps that should be automated.",
      inputSchema: {
        type: "object" as const,
        properties: {
          case_id: {
            type: "string",
            description:
              'The test case ID in format QA-XXX (e.g., "QA-842"). Use this to look up the corresponding test steps from the TMS.',
          },
        },
        required: ["case_id"],
      },
    };

    this.server.setRequestHandler(CallToolRequest, async (request) => {
      if (request.params.name === "get_tms_steps") {
        return this.handleGetTmsSteps(request.params.arguments as { case_id: string });
      }

      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${request.params.name}`,
          },
        ],
        isError: true,
      };
    });

    this.server.setRequestHandler(
      { method: "tools/list" } as any,
      async () => {
        return {
          tools: [getTmsStepsTool],
        };
      }
    );
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(
      { method: "initialize" } as any,
      async () => {
        return {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "tms-mcp-server",
            version: "1.0.0",
          },
        };
      }
    );
  }

  private async handleGetTmsSteps(
    args: { case_id: string }
  ): Promise<CallToolResult> {
    const { case_id } = args;

    if (!case_id || typeof case_id !== "string") {
      return {
        content: [
          {
            type: "text",
            text: "Error: case_id is required and must be a string",
          },
        ],
        isError: true,
      };
    }

    const testCase = testCases[case_id];

    if (!testCase) {
      return {
        content: [
          {
            type: "text",
            text: `Test case ${case_id} not found in TMS. Available cases: ${Object.keys(testCases).join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    const result = {
      case_id: testCase.id,
      title: testCase.title,
      steps: testCase.steps,
      priority: testCase.priority,
      total_steps: testCase.steps.length,
      formatted_steps: testCase.steps
        .map((step, index) => `${index + 1}. ${step}`)
        .join("\n"),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("TMS MCP Server started and listening on stdio");
  }
}

// Main entry point
async function main(): Promise<void> {
  try {
    const server = new TMSMCPServer();
    await server.start();
  } catch (error) {
    console.error("Failed to start TMS MCP Server:", error);
    process.exit(1);
  }
}

main();
