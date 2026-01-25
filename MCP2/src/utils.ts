import type { Team } from "./types.js";

export function formatTeam(team: Team) {
    return {
        id: team.id,
        name: team.name,
        key: team.key,
    };
}

export async function formatIssue(issue: any) {
    const state = await issue.state;
    const assignee = await issue.assignee;
    const team = await issue.team;

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        state: state?.name,
        priority: issue.priority,
        assignee: assignee?.name,
        team: team?.name,
        url: issue.url,
    };
}
