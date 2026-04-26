export type TeamId = "teamA" | "teamB";
export type GamePhase = "lobby" | "secret-selection" | "playing" | "finished";
export type CategoryId =
  | "bollywood-actors"
  | "hollywood-celebrities"
  | "sports-stars"
  | "musicians"
  | "internet-personalities"
  | "mixed-pop-culture";

export interface GameItem {
  id: string;
  name: string;
  imageUrl: string;
  imageSourceUrl?: string;
  imageAttribution?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
}

export interface CategorySummary {
  id: CategoryId;
  name: string;
  description: string;
}

export interface Category extends CategorySummary {
  items: GameItem[];
}

export interface Player {
  id: string;
  name: string;
  teamId: TeamId;
  connected: boolean;
}

export interface PublicTeam {
  id: TeamId;
  name: string;
  leaderId: string | null;
  playerIds: string[];
  locked: boolean;
  lidCount: number;
}

export interface ClientGameState {
  code: string;
  hostId: string;
  selfId: string;
  players: Player[];
  teams: Record<TeamId, PublicTeam>;
  phase: GamePhase;
  turn: TeamId;
  winner: TeamId | null;
  finalGuessWrongLoses: boolean;
  selectedCategory: CategoryId;
  selectedCategoryName: string;
  categories: CategorySummary[];
  gameGrid: GameItem[];
  myTeamId: TeamId;
  myTeamSecretItemId: string | null;
  myTeamLids: string[];
}

export interface Ack<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export type ClientEvent =
  | "createLobby"
  | "joinLobby"
  | "chooseTeam"
  | "updateTeamName"
  | "randomizeTeamName"
  | "updateCategory"
  | "startGame"
  | "selectSecretItem"
  | "toggleLid"
  | "clearLids"
  | "endTurn"
  | "makeFinalGuess"
  | "restartGame";
