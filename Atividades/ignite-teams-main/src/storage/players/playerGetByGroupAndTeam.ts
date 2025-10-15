import playersGetByGroup from "./playersGetByGroup";

export default async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await playersGetByGroup(group);

    const filteredPlayers = storage.filter(player => player.team === team);

    return filteredPlayers;
  } catch (error) {
    throw error;
  }
}