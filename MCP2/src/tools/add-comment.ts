import { z } from "zod";
import type { LinearClient } from "@linear/sdk";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerAddComment(server: McpServer, linearClient: LinearClient) {
    server.registerTool(
        "add_comment",
        {
            description: "Add a comment to a Linear issue",
            inputSchema: {
                issueId: z.string().describe("Issue ID to comment on"),
                body: z.string().describe("Comment text"),
            },
        },
        async ({ issueId, body }) => {
            try {
                const commentResponse = await linearClient.createComment({
                    issueId,
                    body,
                });
                const comment = await commentResponse.comment;

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            id: comment?.id,
                            body: comment?.body,
                            success: true,
                        }, null, 2)
                    }],
                };

            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `Error adding comment: ${error instanceof Error ? error.message : String(error)}`
                    }],
                    isError: true,
                };
            }
        }
    );
}
