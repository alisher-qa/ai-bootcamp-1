# Test Automation Framework

Playwright + TypeScript testing framework with MCP-based TMS integration.

## Installation

```bash
npm install
```

## Running Tests

```bash
npx playwright test
npx playwright test --ui
npx playwright test tests/bad_test.spec.ts
```

## MCP Server

The project includes a TMS integration server for retrieving test requirements.

```bash
npm run mcp:tms
```

### Configuration

`.claude.json` configures the MCP server for Claude Code integration.

## Project Structure

```
tests/
├── bad_test.spec.ts           # Test suite
├── pages/                      # Page objects (to be created)
└── services/                   # Service layer (to be created)

tms_mcp_server.ts              # MCP server for TMS integration
```

## Development

```bash
npm run build                  # Type check
npm run format                 # Format code
npm run lint                   # Lint
```
