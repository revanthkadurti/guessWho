import type { Ack, Category, ClientEvent, ClientGameState } from "./types";

const configuredServerUrl = import.meta.env.VITE_SERVER_URL as string | undefined;
const isLocalServerUrl = configuredServerUrl?.includes("localhost") || configuredServerUrl?.includes("127.0.0.1");

export const serverUrl =
  import.meta.env.DEV && configuredServerUrl
    ? configuredServerUrl
    : configuredServerUrl && !isLocalServerUrl
      ? configuredServerUrl
      : window.location.origin;

type Handlers = {
  onState: (state: ClientGameState) => void;
  onError: (message: string) => void;
};

let socket: WebSocket | null = null;
let handlers: Handlers | null = null;
const pending = new Map<string, (ack: Ack) => void>();

export function setGameHandlers(nextHandlers: Handlers) {
  handlers = nextHandlers;
}

export async function reserveLobby() {
  const response = await fetch(`${serverUrl}/api/lobbies`, { method: "POST" });
  if (!response.ok) {
    throw new Error("Could not create lobby.");
  }
  return (await response.json()) as { code: string };
}

export async function fetchCategories() {
  const response = await fetch(`${serverUrl}/api/categories`);
  if (!response.ok) {
    throw new Error("Could not load categories.");
  }
  return (await response.json()) as { categories: Category[] };
}

export function connectLobby({ code, playerId, playerName, create }: { code: string; playerId: string; playerName: string; create: boolean }) {
  socket?.close();
  pending.clear();

  const url = new URL(`/lobby/${code.toUpperCase()}/websocket`, serverUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.searchParams.set("playerId", playerId);
  url.searchParams.set("playerName", playerName);
  if (create) url.searchParams.set("create", "1");

  return new Promise<void>((resolve, reject) => {
    const ws = new WebSocket(url);
    socket = ws;

    ws.addEventListener("open", () => resolve(), { once: true });
    ws.addEventListener("error", () => {
      handlers?.onError("Could not connect to the lobby.");
      reject(new Error("Could not connect to the lobby."));
    }, { once: true });
    ws.addEventListener("close", () => {
      if (socket === ws) {
        handlers?.onError("Lobby connection closed.");
      }
    });
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data as string) as
        | { type: "gameState"; state: ClientGameState }
        | { type: "gameError"; message: string }
        | { type: "ack"; requestId?: string; ok: boolean; data?: unknown; error?: string };

      if (message.type === "gameState") {
        handlers?.onState(message.state);
      }

      if (message.type === "gameError") {
        handlers?.onError(message.message);
      }

      if (message.type === "ack" && message.requestId) {
        const resolveAck = pending.get(message.requestId);
        pending.delete(message.requestId);
        resolveAck?.({ ok: message.ok, data: message.data, error: message.error });
      }
    });
  });
}

export function sendGameMessage<T>(type: ClientEvent, payload: Record<string, unknown> = {}) {
  return new Promise<T | undefined>((resolve) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      handlers?.onError("Not connected to a lobby.");
      resolve(undefined);
      return;
    }

    const requestId = crypto.randomUUID();
    pending.set(requestId, (ack) => {
      if (!ack.ok) {
        handlers?.onError(ack.error || "Request failed.");
        resolve(undefined);
      } else {
        resolve(ack.data as T);
      }
    });
    socket.send(JSON.stringify({ type, requestId, ...payload }));
  });
}
