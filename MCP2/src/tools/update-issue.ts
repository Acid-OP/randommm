import { z } from "zod";
import type { LinearClient } from "@linear/sdk";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUpdateIssue(server: McpServer, linearClient: LinearClient) {
    server.registerTool(
        "update_issue",
        {
            description: "Update an existing Linear issue",
            inputSchema: {
                issueId: z.string().describe("Issue ID to update"),
                title: z.string().optional().describe("New issue title"),
                description: z.string().optional().describe("New issue description"),
                stateId: z.string().optional().describe("New state ID (status)"),
                priority: z.number().min(0).max(4).optional().describe("New priority: 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low"),
                assigneeId: z.string().optional().describe("New assignee user ID"),
                labelIds: z.array(z.string()).optional().describe("New array of label IDs"),
            },
        },
        async ({ issueId, title, description, stateId, priority, assigneeId, labelIds }) => {
            try {
                const updatePayload: any = {};

                if (title) updatePayload.title = title;
                if (description) updatePayload.description = description;
                if (stateId) updatePayload.stateId = stateId;
                if (priority !== undefined) updatePayload.priority = priority;
                if (assigneeId) updatePayload.assigneeId = assigneeId;
                if (labelIds && labelIds.length > 0) updatePayload.labelIds = labelIds;

                const updateResponse = await linearClient.updateIssue(issueId, updatePayload);
                const issue = await updateResponse.issue;

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            id: issue?.id,
                            title: issue?.title,
                            url: issue?.url,
                            success: true,
                        }, null, 2)
                    }],
                };

            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `Error updating issue: ${error instanceof Error ? error.message : String(error)}`
                    }],
                    isError: true,
                };
            }
        }
    );
}
