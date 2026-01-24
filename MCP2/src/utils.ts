import type { Team } from "./types.js";

export function formatTeam(team: Team) {
    return {
        id: team.id,
        name: team.name,
        key: team.key,
    };
}
