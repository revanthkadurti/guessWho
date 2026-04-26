import { categoryItems, categoryName, categorySummaries } from "./categories.js";
import type { CategoryId, ClientGameState, Lobby, Player, Team, TeamId } from "./types.js";

const TEAM_NAMES = [
  "Masala Mavericks",
  "Disco Deewane",
  "Dhoom Detectives",
  "Filmi Fighters",
  "Jhakaas Jasoos",
  "Cinema Sitare",
  "Desi Dramabaaz",
  "Pataka Players",
  "Taal Titans",
  "Jalwa Juniors"
];

export function randomTeamName(currentNames: string[] = []) {
  const available = TEAM_NAMES.filter((name) => !currentNames.includes(name));
  const source = available.length ? available : TEAM_NAMES;
  return source[Math.floor(Math.random() * source.length)];
}

export function makeLobby(code: string, hostId: string, hostName: string): Lobby {
  const teams: Record<TeamId, Team> = {
    teamA: {
      id: "teamA",
      name: "Masala Mavericks",
      leaderId: hostId,
      secretItemId: null,
      locked: false,
      lids: []
    },
    teamB: {
      id: "teamB",
      name: "Disco Deewane",
      leaderId: null,
      secretItemId: null,
      locked: false,
      lids: []
    }
  };

  const lobby: Lobby = {
    code,
    hostId,
    players: {
      [hostId]: {
        id: hostId,
        name: cleanName(hostName),
        teamId: "teamA",
        connected: true
      }
    },
    teams,
    phase: "lobby",
    turn: "teamA",
    winner: null,
    finalGuessWrongLoses: true,
    selectedCategory: "bollywood-actors",
    gameGrid: categoryItems("bollywood-actors"),
    createdAt: Date.now()
  };

  return lobby;
}

export function normalizeLobby(lobby: Lobby) {
  lobby.selectedCategory ||= "bollywood-actors";
  lobby.gameGrid = lobby.gameGrid?.length === 25 ? lobby.gameGrid : categoryItems(lobby.selectedCategory);
  for (const team of Object.values(lobby.teams)) {
    const legacyTeam = team as typeof team & { secretActorId?: string | null };
    team.secretItemId ??= legacyTeam.secretActorId ?? null;
    delete legacyTeam.secretActorId;
  }
  return lobby;
}

export function cleanName(name: string | undefined) {
  const trimmed = (name || "Player").trim().slice(0, 24);
  return trimmed || "Player";
}

export function connectedPlayers(lobby: Lobby) {
  return Object.values(lobby.players).filter((player) => player.connected);
}

export function addPlayer(lobby: Lobby, id: string, name: string) {
  const count = connectedPlayers(lobby).length;
  if (!lobby.players[id] && count >= 10) {
    throw new Error("This lobby already has 10 players.");
  }

  const existing = lobby.players[id];
  if (existing) {
    existing.name = cleanName(name || existing.name);
    existing.connected = true;
    ensureLeaders(lobby);
    return existing;
  }

  const teamId = teamSize(lobby, "teamA") <= teamSize(lobby, "teamB") ? "teamA" : "teamB";
  const player: Player = {
    id,
    name: cleanName(name),
    teamId,
    connected: true
  };
  lobby.players[id] = player;
  ensureLeaders(lobby);
  return player;
}

export function teamSize(lobby: Lobby, teamId: TeamId) {
  return Object.values(lobby.players).filter((player) => player.connected && player.teamId === teamId).length;
}

export function chooseTeam(lobby: Lobby, playerId: string, teamId: TeamId) {
  const player = requirePlayer(lobby, playerId);
  if (lobby.phase !== "lobby" && lobby.phase !== "secret-selection") {
    throw new Error("Teams cannot be changed after selections are locked.");
  }
  player.teamId = teamId;
  ensureLeaders(lobby);
}

export function updateTeamName(lobby: Lobby, playerId: string, teamId: TeamId, name: string) {
  assertLeader(lobby, playerId, teamId);
  const trimmed = name.trim().slice(0, 28);
  if (!trimmed) throw new Error("Team name cannot be empty.");
  lobby.teams[teamId].name = trimmed;
}

export function randomizeName(lobby: Lobby, playerId: string, teamId: TeamId) {
  assertLeader(lobby, playerId, teamId);
  lobby.teams[teamId].name = randomTeamName(Object.values(lobby.teams).map((team) => team.name));
}

export function updateCategory(lobby: Lobby, playerId: string, categoryId: CategoryId) {
  if (lobby.hostId !== playerId) throw new Error("Only the host can change the category.");
  if (lobby.phase !== "lobby") throw new Error("Category is locked after the game starts.");
  const items = categoryItems(categoryId);
  lobby.selectedCategory = categoryId;
  lobby.gameGrid = items;
  for (const team of Object.values(lobby.teams)) {
    team.secretItemId = null;
    team.locked = false;
    team.lids = [];
  }
}

export function startGame(lobby: Lobby, playerId: string) {
  if (lobby.hostId !== playerId) throw new Error("Only the host can start the game.");
  const items = categoryItems(lobby.selectedCategory);
  if (items.length !== 25) throw new Error("Selected category must contain exactly 25 items.");
  if (connectedPlayers(lobby).length < 2) throw new Error("At least 2 players are required.");
  if (teamSize(lobby, "teamA") < 1 || teamSize(lobby, "teamB") < 1) {
    throw new Error("Both teams need at least one player.");
  }
  lobby.gameGrid = items;
  lobby.phase = "secret-selection";
  lobby.teams.teamA.locked = false;
  lobby.teams.teamB.locked = false;
}

export function selectSecretItem(lobby: Lobby, playerId: string, itemId: string) {
  if (lobby.phase !== "secret-selection") throw new Error("Secret items can only be selected before play starts.");
  assertItem(lobby, itemId);
  const player = requirePlayer(lobby, playerId);
  const team = lobby.teams[player.teamId];
  team.secretItemId = itemId;
  team.locked = true;

  if (lobby.teams.teamA.locked && lobby.teams.teamB.locked) {
    lobby.phase = "playing";
    lobby.turn = "teamA";
  }
}

export function toggleLid(lobby: Lobby, playerId: string, itemId: string) {
  if (lobby.phase !== "playing") throw new Error("Lids can only be changed during play.");
  assertItem(lobby, itemId);
  const player = requirePlayer(lobby, playerId);
  const lids = lobby.teams[player.teamId].lids;
  const index = lids.indexOf(itemId);
  if (index >= 0) {
    lids.splice(index, 1);
  } else {
    lids.push(itemId);
  }
}

export function clearLids(lobby: Lobby, playerId: string) {
  if (lobby.phase !== "playing") throw new Error("Lids can only be cleared during play.");
  const player = requirePlayer(lobby, playerId);
  lobby.teams[player.teamId].lids = [];
}

export function endTurn(lobby: Lobby, playerId: string) {
  if (lobby.phase !== "playing") throw new Error("Turns can only end during play.");
  const player = requirePlayer(lobby, playerId);
  if (player.teamId !== lobby.turn) throw new Error("Only the current team can end the turn.");
  lobby.turn = lobby.turn === "teamA" ? "teamB" : "teamA";
}

export function makeFinalGuess(lobby: Lobby, playerId: string, itemId: string) {
  if (lobby.phase !== "playing") throw new Error("Final guesses can only be made during play.");
  assertItem(lobby, itemId);
  const player = requirePlayer(lobby, playerId);
  const opponentTeamId = player.teamId === "teamA" ? "teamB" : "teamA";
  const correct = lobby.teams[opponentTeamId].secretItemId === itemId;
  if (correct) {
    lobby.winner = player.teamId;
    lobby.phase = "finished";
  } else if (lobby.finalGuessWrongLoses) {
    lobby.winner = opponentTeamId;
    lobby.phase = "finished";
  } else {
    lobby.turn = opponentTeamId;
  }
  return correct;
}

export function restartGame(lobby: Lobby, playerId: string) {
  if (lobby.hostId !== playerId) throw new Error("Only the host can restart the game.");
  lobby.phase = "lobby";
  lobby.winner = null;
  lobby.resultRecorded = false;
  lobby.turn = "teamA";
  lobby.gameGrid = categoryItems(lobby.selectedCategory);
  for (const team of Object.values(lobby.teams)) {
    team.secretItemId = null;
    team.locked = false;
    team.lids = [];
  }
}

export function disconnectPlayer(lobby: Lobby, playerId: string) {
  const player = lobby.players[playerId];
  if (!player) return;
  player.connected = false;
  if (lobby.hostId === playerId) {
    lobby.hostId = connectedPlayers(lobby)[0]?.id ?? playerId;
  }
  ensureLeaders(lobby);
}

export function clientState(lobby: Lobby, selfId: string): ClientGameState {
  const self = requirePlayer(lobby, selfId);
  const players = Object.values(lobby.players);
  return {
    code: lobby.code,
    hostId: lobby.hostId,
    selfId,
    players,
    teams: {
      teamA: publicTeam(lobby, "teamA"),
      teamB: publicTeam(lobby, "teamB")
    },
    phase: lobby.phase,
    turn: lobby.turn,
    winner: lobby.winner,
    finalGuessWrongLoses: lobby.finalGuessWrongLoses,
    selectedCategory: lobby.selectedCategory,
    selectedCategoryName: categoryName(lobby.selectedCategory),
    categories: categorySummaries,
    gameGrid: lobby.gameGrid,
    myTeamId: self.teamId,
    myTeamSecretItemId: lobby.teams[self.teamId].secretItemId,
    myTeamLids: lobby.teams[self.teamId].lids
  };
}

function publicTeam(lobby: Lobby, teamId: TeamId) {
  const team = lobby.teams[teamId];
  return {
    id: team.id,
    name: team.name,
    leaderId: team.leaderId,
    playerIds: Object.values(lobby.players)
      .filter((player) => player.connected && player.teamId === teamId)
      .map((player) => player.id),
    locked: team.locked,
    lidCount: team.lids.length
  };
}

function ensureLeaders(lobby: Lobby) {
  for (const teamId of ["teamA", "teamB"] as TeamId[]) {
    const team = lobby.teams[teamId];
    const leaderConnected = team.leaderId ? lobby.players[team.leaderId]?.connected && lobby.players[team.leaderId]?.teamId === teamId : false;
    if (!leaderConnected) {
      team.leaderId = connectedPlayers(lobby).find((player) => player.teamId === teamId)?.id ?? null;
    }
  }
}

function requirePlayer(lobby: Lobby, playerId: string) {
  const player = lobby.players[playerId];
  if (!player || !player.connected) throw new Error("Player is not in this lobby.");
  return player;
}

function assertLeader(lobby: Lobby, playerId: string, teamId: TeamId) {
  requirePlayer(lobby, playerId);
  if (lobby.teams[teamId].leaderId !== playerId) throw new Error("Only the team leader can do that.");
}

function assertItem(lobby: Lobby, itemId: string) {
  if (!lobby.gameGrid.some((item) => item.id === itemId)) throw new Error("Unknown item.");
}
