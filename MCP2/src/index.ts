import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { LinearClient } from "@linear/sdk";

const apiKey = process.env.LINEAR_API_KEY;
if (!apiKey) {
  throw new Error("LINEAR_API_KEY environment variable is required");
}

const linearClient = new LinearClient({ apiKey });

const server = new McpServer({
    name: "linear",
    version: "1.0.0"
});

async function main(){
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Linear MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
})