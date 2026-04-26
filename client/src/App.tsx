import { Crown, Dice5, DoorOpen, Eraser, ExternalLink, Eye, EyeOff, Grid2X2, Link2, RefreshCw, Trophy, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { connectLobby, fetchCategories, reserveLobby, sendGameMessage, setGameHandlers } from "./socket";
import type { Category, ClientEvent, ClientGameState, GameItem, TeamId } from "./types";

const teamOrder: TeamId[] = ["teamA", "teamB"];

export default function App() {
  const [state, setState] = useState<ClientGameState | null>(null);
  const [playerName, setPlayerName] = useState(localStorage.getItem("bgg:name") || "");
  const [joinCode, setJoinCode] = useState(new URLSearchParams(window.location.search).get("code") || "");
  const [error, setError] = useState("");
  const [selectedSecretItem, setSelectedSecretItem] = useState("");
  const [guessing, setGuessing] = useState(false);
  const [pendingGuess, setPendingGuess] = useState("");
  const [creditsCategories, setCreditsCategories] = useState<Category[]>([]);
  const showCredits = new URLSearchParams(window.location.search).get("page") === "credits";

  useEffect(() => {
    setGameHandlers({
      onState: (next) => {
        setState(next);
        setError("");
        if (next.code) {
          const url = new URL(window.location.href);
          url.searchParams.set("code", next.code);
          window.history.replaceState({}, "", url);
        }
      },
      onError: (message) => {
        setError(message);
      }
    });
  }, []);

  useEffect(() => {
    if (!showCredits) return;
    fetchCategories()
      .then(({ categories }) => setCreditsCategories(categories))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load image credits."));
  }, [showCredits]);

  useEffect(() => {
    setSelectedSecretItem("");
    setPendingGuess("");
  }, [state?.selectedCategory]);

  const me = state?.players.find((player) => player.id === state.selfId);
  const shareUrl = state ? `${window.location.origin}${window.location.pathname}?code=${state.code}` : "";

  if (showCredits) {
    return <CreditsPage categories={creditsCategories} error={error} />;
  }

  function playerId() {
    const existing = sessionStorage.getItem("bgg:playerId");
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem("bgg:playerId", id);
    return id;
  }

  function emit<T>(event: ClientEvent, payload: Record<string, unknown> = {}) {
    setError("");
    return sendGameMessage<T>(event, payload);
  }

  async function createLobby() {
    const name = playerName.trim();
    if (!name) return setError("Enter your name first.");
    localStorage.setItem("bgg:name", name);
    try {
      const { code } = await reserveLobby();
      await connectLobby({ code, playerName: name, playerId: playerId(), create: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create lobby.");
    }
  }

  async function joinLobby() {
    const name = playerName.trim();
    const code = joinCode.trim().toUpperCase();
    if (!name) return setError("Enter your name first.");
    if (!code) return setError("Enter a lobby code.");
    localStorage.setItem("bgg:name", name);
    try {
      await connectLobby({ code, playerName: name, playerId: playerId(), create: false });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not join lobby.");
    }
  }

  if (!state) {
    return (
      <main className="min-h-screen bg-stone-950 text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8">
          <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Multiplayer party deduction</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
                Bollywood Guess Grid
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-200">
                Split into two teams, secretly pick an item from the chosen category, ask yes/no questions out loud, and use private lids to narrow the grid.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <label className="text-sm font-semibold text-stone-100" htmlFor="playerName">
                Display name
              </label>
              <input
                id="playerName"
                className="mt-2 w-full rounded-md border border-white/20 bg-stone-950/70 px-4 py-3 text-white outline-none focus:border-amber-300"
                value={playerName}
                maxLength={24}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Maya"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  className="rounded-md border border-white/20 bg-stone-950/70 px-4 py-3 uppercase text-white outline-none focus:border-amber-300"
                  value={joinCode}
                  maxLength={5}
                  onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                  placeholder="CODE"
                />
                <button className="btn btn-primary" onClick={joinLobby}>
                  <DoorOpen size={18} /> Join
                </button>
              </div>
              <button className="btn mt-3 w-full justify-center border-amber-300/60 bg-amber-300 text-stone-950 hover:bg-amber-200" onClick={createLobby}>
                <Users size={18} /> Create Lobby
              </button>
              {error && <p className="mt-4 rounded-md bg-rose-500/20 px-3 py-2 text-sm text-rose-100">{error}</p>}
              <CreditsLink />
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-white/10 bg-stone-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Bollywood Guess Grid</h1>
            <p className="text-sm text-stone-400">Lobby {state.code} · {state.phase.replace("-", " ")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={() => navigator.clipboard?.writeText(shareUrl)}>
              <Link2 size={17} /> Copy Link
            </button>
            {state.selfId === state.hostId && state.phase === "lobby" && (
              <button className="btn btn-primary" onClick={() => emit("startGame")}>
                Start Game
              </button>
            )}
            {state.selfId === state.hostId && state.phase === "finished" && (
              <button className="btn btn-primary" onClick={() => emit("restartGame")}>
                <RefreshCw size={17} /> New Game
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <CategorySelector state={state} onEmit={emit} />
          {teamOrder.map((teamId) => (
            <TeamPanel key={teamId} state={state} teamId={teamId} onEmit={emit} />
          ))}
          {error && <p className="rounded-md bg-rose-500/20 px-3 py-2 text-sm text-rose-100">{error}</p>}
        </aside>

        <section className="space-y-4">
          <StatusBar state={state} meTeam={me?.teamId || state.myTeamId} />

          {state.phase === "secret-selection" && (
            <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Choose your team’s secret item</h2>
                  <p className="text-sm text-amber-100">Only your team can see this selection. Both teams must lock before play begins.</p>
                </div>
                <button
                  className="btn btn-primary"
                  disabled={!selectedSecretItem || Boolean(state.myTeamSecretItemId)}
                  onClick={() => emit("selectSecretItem", { itemId: selectedSecretItem })}
                >
                  <Eye size={17} /> Lock Secret
                </button>
              </div>
            </div>
          )}

          {state.phase === "playing" && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-sm text-stone-300">
                Your private lids: <span className="font-bold text-white">{state.myTeamLids.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn" onClick={() => emit("clearLids")}>
                  <Eraser size={17} /> Clear Lids
                </button>
                <button className="btn" disabled={state.turn !== state.myTeamId} onClick={() => emit("endTurn")}>
                  End Turn
                </button>
                <button className="btn btn-primary" onClick={() => setGuessing(true)}>
                  Make Final Guess
                </button>
              </div>
            </div>
          )}

          <GameGrid
            state={state}
            selectedSecretItem={selectedSecretItem}
            onSelectSecretItem={setSelectedSecretItem}
            onToggleLid={(itemId) => emit("toggleLid", { itemId })}
          />
        </section>
      </div>
      <CreditsFooter />

      {guessing && (
        <GuessModal
          items={state.gameGrid}
          pendingGuess={pendingGuess}
          setPendingGuess={setPendingGuess}
          onClose={() => setGuessing(false)}
          onConfirm={async () => {
            if (!pendingGuess) return;
            await emit("makeFinalGuess", { itemId: pendingGuess });
            setGuessing(false);
            setPendingGuess("");
          }}
        />
      )}
    </main>
  );
}

function CreditsLink() {
  return (
    <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-200 hover:text-amber-100" href="?page=credits">
      Image credits <ExternalLink size={15} />
    </a>
  );
}

function CreditsFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-4 pb-6 text-sm text-stone-400">
      Portraits are sourced from Wikimedia Commons, with initials fallback if an image fails to load. <a className="font-bold text-amber-200 hover:text-amber-100" href="?page=credits">View image credits</a>.
    </footer>
  );
}

function CreditsPage({ categories, error }: { categories: Category[]; error: string }) {
  const creditedItems = categories.flatMap((category) =>
    category.items
      .filter((item) => item.imageSourceUrl)
      .map((item) => ({
        ...item,
        categoryName: category.name
      }))
  );

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Attribution</p>
            <h1 className="mt-2 text-4xl font-black">Image Credits</h1>
          </div>
          <a className="btn" href="/">
            Back to Game
          </a>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-300">
          Portraits are sourced from Wikimedia Commons. Follow each source page for complete attribution, license, and reuse terms.
        </p>
        {error && <p className="mt-4 rounded-md bg-rose-500/20 px-3 py-2 text-sm text-rose-100">{error}</p>}
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {creditedItems.map((item) => (
            <article key={`${item.categoryName}-${item.id}`} className="grid grid-cols-[84px_1fr] gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <span className="h-24 w-20 overflow-hidden rounded-md bg-stone-900">
                <FallbackImage item={item} className="h-full w-full object-contain" />
              </span>
              <div className="min-w-0">
                <h2 className="font-black text-white">{item.name}</h2>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{item.categoryName}</p>
                <p className="mt-1 text-sm text-stone-300">Attribution: {item.imageAttribution}</p>
                <p className="text-sm text-stone-300">License: {item.imageLicense}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm font-bold">
                  <a className="text-amber-200 hover:text-amber-100" href={item.imageSourceUrl} target="_blank" rel="noreferrer">
                    Source
                  </a>
                  <a className="text-amber-200 hover:text-amber-100" href={item.imageLicenseUrl} target="_blank" rel="noreferrer">
                    License
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function CategorySelector({ state, onEmit }: { state: ClientGameState; onEmit: (event: ClientEvent, payload?: Record<string, unknown>) => void }) {
  const locked = state.phase !== "lobby";
  const isHost = state.selfId === state.hostId;
  const selectedCategory = state.categories.find((category) => category.id === state.selectedCategory);

  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">Select Category</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">{locked ? "Locked" : isHost ? "Host controls" : "Waiting for host"}</p>
        </div>
        <Grid2X2 className="text-amber-300" size={20} />
      </div>
      <div className="mt-3 rounded-md border border-amber-300/35 bg-amber-300/10 px-3 py-2">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-200">Current</p>
        <p className="font-black text-white">{selectedCategory?.name ?? state.selectedCategoryName}</p>
      </div>
      <div className="mt-3 grid gap-2">
        {state.categories.map((category) => {
          const selected = category.id === state.selectedCategory;
          return (
            <button
              key={category.id}
              type="button"
              className={`category-option ${selected ? "category-option-selected" : ""}`}
              aria-pressed={selected}
              disabled={locked}
              onClick={() => onEmit("updateCategory", { categoryId: category.id })}
            >
              <span className="font-black">{category.name}</span>
              <span className="text-xs leading-5 text-stone-400">{category.description}</span>
              {!isHost && !locked && <span className="text-xs font-bold text-amber-200">Only host can change</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TeamPanel({ state, teamId, onEmit }: { state: ClientGameState; teamId: TeamId; onEmit: (event: ClientEvent, payload?: Record<string, unknown>) => void }) {
  const team = state.teams[teamId];
  const players = team.playerIds.map((id) => state.players.find((player) => player.id === id)).filter(Boolean);
  const [draft, setDraft] = useState(team.name);
  const isLeader = team.leaderId === state.selfId;
  const isMine = state.myTeamId === teamId;

  useEffect(() => setDraft(team.name), [team.name]);

  return (
    <section className={`rounded-lg border p-4 ${isMine ? "border-amber-300/60 bg-amber-300/10" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">{team.name}</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">{team.locked ? "Secret locked" : "Waiting"}</p>
        </div>
        <button className="btn-icon" title="Choose team" disabled={isMine || state.phase === "playing" || state.phase === "finished"} onClick={() => onEmit("chooseTeam", { teamId })}>
          <Users size={17} />
        </button>
      </div>

      {isLeader && (
        <div className="mt-3 flex gap-2">
          <input className="min-w-0 flex-1 rounded-md border border-white/15 bg-stone-950/70 px-3 py-2 text-sm outline-none focus:border-amber-300" value={draft} maxLength={28} onChange={(event) => setDraft(event.target.value)} />
          <button className="btn-icon" title="Save team name" onClick={() => onEmit("updateTeamName", { teamId, name: draft })}>
            <Crown size={17} />
          </button>
          <button className="btn-icon" title="Random team name" onClick={() => onEmit("randomizeTeamName", { teamId })}>
            <Dice5 size={17} />
          </button>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {players.map((player) => (
          <div key={player!.id} className="flex items-center justify-between rounded-md bg-stone-900/80 px-3 py-2 text-sm">
            <span>{player!.name}{player!.id === state.selfId ? " (you)" : ""}</span>
            {team.leaderId === player!.id && <Crown className="text-amber-300" size={15} />}
          </div>
        ))}
        {!players.length && <p className="text-sm text-stone-500">No players yet</p>}
      </div>
    </section>
  );
}

function StatusBar({ state, meTeam }: { state: ClientGameState; meTeam: TeamId }) {
  const winnerName = state.winner ? state.teams[state.winner].name : "";
  const secretItem = useMemo(() => state.gameGrid.find((item) => item.id === state.myTeamSecretItemId), [state.gameGrid, state.myTeamSecretItemId]);
  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:grid-cols-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Category</p>
        <p className="font-bold text-white">{state.selectedCategoryName}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Your team</p>
        <p className="font-bold text-white">{state.teams[meTeam].name}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Turn</p>
        <p className="font-bold text-amber-200">{state.phase === "playing" ? state.teams[state.turn].name : "Not started"}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">{state.phase === "finished" ? "Winner" : "Your secret"}</p>
        <p className="font-bold text-white">{state.phase === "finished" ? winnerName : secretItem?.name || "Hidden until locked"}</p>
      </div>
      {state.phase === "finished" && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-400/15 px-3 py-2 text-emerald-100 sm:col-span-4">
          <Trophy size={18} /> {winnerName} wins.
        </div>
      )}
    </div>
  );
}

function GameGrid({ state, selectedSecretItem, onSelectSecretItem, onToggleLid }: { state: ClientGameState; selectedSecretItem: string; onSelectSecretItem: (itemId: string) => void; onToggleLid: (itemId: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {state.gameGrid.map((item) => {
        const lidded = state.myTeamLids.includes(item.id);
        const isSecret = state.myTeamSecretItemId === item.id;
        const selected = selectedSecretItem === item.id;
        return (
          <button
            key={item.id}
            className={`item-card ${selected ? "ring-2 ring-amber-300" : ""} ${isSecret ? "border-emerald-300" : "border-white/10"}`}
            onClick={() => {
              if (state.phase === "secret-selection" && !state.myTeamSecretItemId) onSelectSecretItem(item.id);
              if (state.phase === "playing") onToggleLid(item.id);
            }}
          >
            <span className="item-media">
              <FallbackImage item={item} />
            </span>
            <span className="block min-h-12 px-2 py-2 text-center text-sm font-bold leading-5">{item.name}</span>
            <span className={`lid ${lidded ? "lid-on" : ""}`}>
              <EyeOff size={28} />
              <span>Eliminated</span>
            </span>
            {isSecret && <span className="secret-badge">Secret</span>}
          </button>
        );
      })}
    </div>
  );
}

function FallbackImage({ item, className = "" }: { item: GameItem; className?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = item.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (failed || !item.imageUrl) {
    return <span className={`fallback-initials ${className}`}>{initials}</span>;
  }

  return <img src={item.imageUrl} alt="" className={className} onError={() => setFailed(true)} />;
}

function GuessModal({ items, pendingGuess, setPendingGuess, onClose, onConfirm }: { items: GameItem[]; pendingGuess: string; setPendingGuess: (itemId: string) => void; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-lg border border-white/15 bg-stone-950 p-5 shadow-2xl">
        <h2 className="text-xl font-black">Make Final Guess</h2>
        <p className="mt-1 text-sm text-stone-400">Default rule: a wrong final guess loses immediately.</p>
        <select className="mt-4 w-full rounded-md border border-white/15 bg-stone-900 px-3 py-3 outline-none focus:border-amber-300" value={pendingGuess} onChange={(event) => setPendingGuess(event.target.value)}>
          <option value="">Select item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!pendingGuess} onClick={onConfirm}>Confirm Guess</button>
        </div>
      </div>
    </div>
  );
}
