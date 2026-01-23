import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetAlerts } from "./tools/get-alerts.js";
import { registerGetForecast } from "./tools/get-forecast.js";

// Create MCP server instance
const server = new McpServer({
  name: "weather",
  version: "1.0.0",
});

// Register all tools
registerGetAlerts(server);
registerGetForecast(server);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
