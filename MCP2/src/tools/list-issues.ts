import { z } from "zod";
import type { LinearClient } from "@linear/sdk";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { formatIssue } from "../utils.js";

export function registerListIssues(server: McpServer, linearClient: LinearClient) {
    server.registerTool(
        "list_issues",
        {
            description: "List Linear issues with optional filters",
            inputSchema: {
                assigneeId: z.string().optional().describe("Filter by assignee user ID"),
                teamId: z.string().optional().describe("Filter by team ID"),
                stateType: z.string().optional().describe("Filter by state: started, completed, backlog, canceled"),
                limit: z.number().optional().describe("Max issues to return (default: 10)"),
            },
        },
        async ({ assigneeId, teamId, stateType, limit }) => {
            try {
                const filter: any = {};

                if (assigneeId) {
                    filter.assignee = { id: { eq: assigneeId } };
                }

                if (teamId) {
                    filter.team = { id: { eq: teamId } };
                }

                if (stateType) {
                    filter.state = { type: { eq: stateType } };
                }

                const issues = await linearClient.issues({
                    filter,
                    first: limit || 10,
                });

                if (issues.nodes.length === 0) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: "No issues found matching the filters",
                            },
                        ],
                    };
                }

                const formattedIssues = await Promise.all(issues.nodes.map(formatIssue));

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(formattedIssues, null, 2),
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error fetching issues: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        }
    );
}