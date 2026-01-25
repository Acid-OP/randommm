import { z } from "zod";
import type { LinearClient } from "@linear/sdk";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCreateIssue(server: McpServer, linearClient: LinearClient) {
    server.registerTool(
        "create_issue",
        {
            description: "Create a new Linear issue",
            inputSchema: {
                title: z.string().describe("Issue title"),
                teamId: z.string().describe("Team ID where issue should be created"),
                description: z.string().optional().describe("Issue description or details"),
                priority: z.number().min(0).max(4).optional().describe("Priority: 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low"),
                assigneeId: z.string().optional().describe("User ID to assign the issue to"),
                stateId: z.string().optional().describe("State ID for initial status"),
                labelIds: z.array(z.string()).optional().describe("Array of label IDs to tag the issue"),
            },
        },
        async ({ title, teamId, description, priority, assigneeId, stateId, labelIds }) => {
            try {
                const issuePayload: any = {
                    title,
                    teamId,
                };

                if (description) issuePayload.description = description;
                if (priority !== undefined) issuePayload.priority = priority;
                if (assigneeId) issuePayload.assigneeId = assigneeId;
                if (stateId) issuePayload.stateId = stateId;
                if (labelIds && labelIds.length > 0) issuePayload.labelIds = labelIds;

                const issueResponse = await linearClient.createIssue(issuePayload);
                const issue = await issueResponse.issue;

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
                        text: `Error creating issue: ${error instanceof Error ? error.message : String(error)}`
                    }],
                    isError: true,
                };
            }
        }
    );
}
