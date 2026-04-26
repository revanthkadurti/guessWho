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

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  items: GameItem[];
}

export interface Player {
  id: string;
  name: string;
  teamId: TeamId;
  connected: boolean;
}

export interface Team {
  id: TeamId;
  name: string;
  leaderId: string | null;
  secretItemId: string | null;
  locked: boolean;
  lids: string[];
}

export interface Lobby {
  code: string;
  hostId: string;
  players: Record<string, Player>;
  teams: Record<TeamId, Team>;
  phase: GamePhase;
  turn: TeamId;
  winner: TeamId | null;
  finalGuessWrongLoses: boolean;
  selectedCategory: CategoryId;
  gameGrid: GameItem[];
  createdAt: number;
  resultRecorded?: boolean;
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
  categories: Omit<Category, "items">[];
  gameGrid: GameItem[];
  myTeamId: TeamId;
  myTeamSecretItemId: string | null;
  myTeamLids: string[];
}

export interface ServerErrorPayload {
  message: string;
}
