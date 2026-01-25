import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LinearClient } from "@linear/sdk";
import { formatTeam } from "../utils.js";

export function registerListTeams(server: McpServer, linearClient: LinearClient) {
    server.registerTool(
        "list_teams",
        {
            description: "Get all teams in your Linear workspace",
            inputSchema: {},
        },
        async () => {
            const teams = await linearClient.teams();
            const formattedTeams = teams.nodes.map(formatTeam);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(formattedTeams, null, 2),
                    },
                ],
            };
        }
    );
}