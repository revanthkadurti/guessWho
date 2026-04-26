import { categories } from "./categories.js";
import {
  addPlayer,
  chooseTeam,
  clearLids,
  clientState,
  connectedPlayers,
  disconnectPlayer,
  endTurn,
  makeFinalGuess,
  makeLobby,
  normalizeLobby,
  randomizeName,
  restartGame,
  selectSecretItem,
  startGame,
  toggleLid,
  updateCategory,
  updateTeamName
} from "./game.js";
import type { CategoryId, Lobby, TeamId } from "./types.js";

export interface Env {
  LOBBY_OBJECT: DurableObjectNamespace;
  DB: D1Database;
  CLIENT_URL: string;
}

type ClientMessage =
  | { type: "createLobby"; playerName: string; requestId?: string }
  | { type: "joinLobby"; playerName: string; requestId?: string }
  | { type: "chooseTeam"; teamId: TeamId; requestId?: string }
  | { type: "updateTeamName"; teamId: TeamId; name: string; requestId?: string }
  | { type: "randomizeTeamName"; teamId: TeamId; requestId?: string }
  | { type: "updateCategory"; categoryId: CategoryId; requestId?: string }
  | { type: "startGame"; requestId?: string }
  | { type: "selectSecretItem"; itemId: string; requestId?: string }
  | { type: "toggleLid"; itemId: string; requestId?: string }
  | { type: "clearLids"; requestId?: string }
  | { type: "endTurn"; requestId?: string }
  | { type: "makeFinalGuess"; itemId: string; requestId?: string }
  | { type: "restartGame"; requestId?: string };

type ServerMessage =
  | { type: "gameState"; state: unknown }
  | { type: "gameError"; message: string }
  | { type: "ack"; requestId?: string; ok: boolean; data?: unknown; error?: string };

interface SessionAttachment {
  playerId: string;
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (url.pathname === "/health") {
      return json({ ok: true, service: "bollywood-guess-grid-cloudflare" }, env);
    }

    if (url.pathname === "/api/categories") {
      return json({ categories }, env);
    }

    if (url.pathname === "/api/lobbies" && request.method === "POST") {
      const code = await reserveLobbyCode(env);
      return json({ code }, env, 201);
    }

    const match = url.pathname.match(/^\/lobby\/([A-Z0-9]{5})\/websocket$/);
    if (match) {
      const code = match[1].toUpperCase();
      const id = env.LOBBY_OBJECT.idFromName(code);
      return env.LOBBY_OBJECT.get(id).fetch(request);
    }

    return json({ error: "Not found" }, env, 404);
  }
};

export class LobbyDurableObject {
  private sessions = new Map<string, WebSocket>();

  constructor(private readonly ctx: DurableObjectState, private readonly env: Env) {
    for (const socket of this.ctx.getWebSockets()) {
      const attachment = socket.deserializeAttachment() as SessionAttachment | undefined;
      if (attachment?.playerId) {
        this.sessions.set(attachment.playerId, socket);
      }
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 426 });
    }

    const code = url.pathname.split("/")[2]?.toUpperCase();
    const playerId = url.searchParams.get("playerId") || crypto.randomUUID();
    const playerName = url.searchParams.get("playerName") || "Player";
    const create = url.searchParams.get("create") === "1";

    let lobby = await this.loadLobby();
    if (!lobby) {
      if (!create || !code) {
        return new Response("Lobby not found", { status: 404 });
      }
      await this.assertReserved(code);
      lobby = makeLobby(code, playerId, playerName);
      await this.saveLobby(lobby);
    } else {
      addPlayer(lobby, playerId, playerName);
      await this.saveLobby(lobby);
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ playerId } satisfies SessionAttachment);
    this.sessions.set(playerId, server);

    this.broadcast(lobby);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(socket: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const attachment = socket.deserializeAttachment() as SessionAttachment | undefined;
    if (!attachment?.playerId) return;

    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(typeof message === "string" ? message : new TextDecoder().decode(message)) as ClientMessage;
    } catch {
      this.send(socket, { type: "gameError", message: "Invalid message." });
      return;
    }

    const lobby = await this.loadLobby();
    if (!lobby) {
      this.send(socket, { type: "gameError", message: "Lobby not found." });
      return;
    }

    try {
      const data = await this.applyMessage(lobby, attachment.playerId, parsed);
      await this.saveLobby(lobby);
      await this.recordResultIfNeeded(lobby);
      this.send(socket, { type: "ack", requestId: parsed.requestId, ok: true, data });
      this.broadcast(lobby);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      this.send(socket, { type: "ack", requestId: parsed.requestId, ok: false, error: message });
      this.send(socket, { type: "gameError", message });
    }
  }

  async webSocketClose(socket: WebSocket): Promise<void> {
    await this.handleSocketGone(socket);
  }

  async webSocketError(socket: WebSocket): Promise<void> {
    await this.handleSocketGone(socket);
  }

  private async applyMessage(lobby: Lobby, playerId: string, message: ClientMessage) {
    switch (message.type) {
      case "createLobby":
      case "joinLobby":
        addPlayer(lobby, playerId, message.playerName);
        return { code: lobby.code };
      case "chooseTeam":
        chooseTeam(lobby, playerId, message.teamId);
        return { ok: true };
      case "updateTeamName":
        updateTeamName(lobby, playerId, message.teamId, message.name);
        return { ok: true };
      case "randomizeTeamName":
        randomizeName(lobby, playerId, message.teamId);
        return { ok: true };
      case "updateCategory":
        updateCategory(lobby, playerId, message.categoryId);
        return { ok: true };
      case "startGame":
        startGame(lobby, playerId);
        return { ok: true };
      case "selectSecretItem":
        selectSecretItem(lobby, playerId, message.itemId);
        return { ok: true };
      case "toggleLid":
        toggleLid(lobby, playerId, message.itemId);
        return { ok: true };
      case "clearLids":
        clearLids(lobby, playerId);
        return { ok: true };
      case "endTurn":
        endTurn(lobby, playerId);
        return { ok: true };
      case "makeFinalGuess":
        return { correct: makeFinalGuess(lobby, playerId, message.itemId) };
      case "restartGame":
        restartGame(lobby, playerId);
        return { ok: true };
      default:
        throw new Error("Unknown action.");
    }
  }

  private async handleSocketGone(socket: WebSocket) {
    const attachment = socket.deserializeAttachment() as SessionAttachment | undefined;
    if (!attachment?.playerId) return;
    this.sessions.delete(attachment.playerId);
    const lobby = await this.loadLobby();
    if (!lobby) return;
    disconnectPlayer(lobby, attachment.playerId);
    await this.saveLobby(lobby);
    this.broadcast(lobby);
  }

  private broadcast(lobby: Lobby) {
    for (const [playerId, socket] of this.sessions) {
      try {
        this.send(socket, { type: "gameState", state: clientState(lobby, playerId) });
      } catch {
        this.sessions.delete(playerId);
      }
    }
  }

  private send(socket: WebSocket, message: ServerMessage) {
    socket.send(JSON.stringify(message));
  }

  private async loadLobby() {
    const lobby = (await this.ctx.storage.get<Lobby>("lobby")) ?? null;
    return lobby ? normalizeLobby(lobby) : null;
  }

  private async saveLobby(lobby: Lobby) {
    await this.ctx.storage.put("lobby", lobby);
  }

  private async recordResultIfNeeded(lobby: Lobby) {
    if (lobby.phase !== "finished" || !lobby.winner || lobby.resultRecorded) return;
    const winner = lobby.teams[lobby.winner];
    await this.env.DB.prepare(
      "INSERT INTO game_results (code, winner_team_id, winner_team_name, finished_at, player_count) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(lobby.code, lobby.winner, winner.name, Date.now(), connectedPlayers(lobby).length)
      .run();
    lobby.resultRecorded = true;
    await this.saveLobby(lobby);
  }

  private async assertReserved(code: string) {
    const row = await this.env.DB.prepare("SELECT code FROM lobby_index WHERE code = ?").bind(code).first<{ code: string }>();
    if (!row) throw new Error("Lobby code is not reserved.");
  }
}

async function reserveLobbyCode(env: Env) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = makeCode();
    try {
      await env.DB.prepare("INSERT INTO lobby_index (code, durable_object_name, created_at) VALUES (?, ?, ?)")
        .bind(code, code, Date.now())
        .run();
      return code;
    } catch {
      continue;
    }
  }
  throw new Error("Could not reserve a lobby code.");
}

function makeCode() {
  return Array.from({ length: 5 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join("");
}

function json(body: unknown, env: Env, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...corsHeaders(env)
    }
  });
}

function corsHeaders(env: Env) {
  return {
    "access-control-allow-origin": env.CLIENT_URL,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}
