# Bollywood Guess Grid

A deployable multiplayer party deduction game for 2-10 players. Players join a lobby with a shareable code/link, split into two teams, choose a category, secretly select one item from a shared 5x5 grid, then ask yes/no questions verbally while using private in-app lids to eliminate items.

## Stack

- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Cloudflare Workers
- Real-time: native WebSockets hosted by Cloudflare Durable Objects
- Storage: Durable Object storage for live lobby state, D1 for lobby reservations and completed game results

## Project Structure

```text
.
├── client   # Vite React app
└── server   # Cloudflare Worker + Durable Object + D1 migration
```

## Local Setup

```bash
npm install
cp client/.env.example client/.env
```

Create the D1 database once:

```bash
npm exec --workspace server wrangler d1 create bollywood_guess_grid
```

Copy the returned `database_id` into [server/wrangler.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.toml). Then apply the local migration:

```bash
npm run d1:migrate:local --workspace server
```

Run the backend and frontend in separate terminals for development:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8787/health`

## Environment Variables

Backend Cloudflare variable, configured in [server/wrangler.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.toml) for local/dev:

```toml
[vars]
CLIENT_URL = "http://localhost:5173"
```

For production, set `CLIENT_URL` to the deployed frontend URL, for example `https://bollywood-guess-grid.vercel.app`.

Frontend, in `client/.env` or the hosting provider:

```bash
VITE_SERVER_URL=http://localhost:8787
```

For production, set `VITE_SERVER_URL` to your deployed Cloudflare Worker URL, for example `https://bollywood-guess-grid-api.your-subdomain.workers.dev`.

If the frontend is served by the same Worker in production, `VITE_SERVER_URL` can be omitted and the app will use the current origin.

## Deploy Full App with Wrangler

This is the simplest deployment path: one Cloudflare Worker serves the React frontend, API routes, WebSockets, Durable Object, and D1-backed lobby reservations.

Your real [server/wrangler.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.toml) is ignored by Git so database IDs are not pushed. Use [server/wrangler.example.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.example.toml) as the template.

1. Create your local Wrangler config if needed:

```bash
cp server/wrangler.example.toml server/wrangler.toml
```

2. Install and authenticate Wrangler:

```bash
npm exec --workspace server wrangler login
```

3. Create the production D1 database:

```bash
npm exec --workspace server wrangler d1 create bollywood_guess_grid
```

4. Copy the returned `database_id` into [server/wrangler.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.toml).
5. Set `CLIENT_URL` in [server/wrangler.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.toml) to your Worker URL if you already know it, or keep the placeholder for the first deploy and update it after.
6. Apply the remote D1 migration:

```bash
npm run d1:migrate:remote --workspace server
```

7. Deploy the Worker:

```bash
npm run deploy --workspace server
```

The deploy script builds `client/dist` first, then deploys the Worker with static assets from that folder.

8. Open the Worker URL. That is now the public game URL.

9. If you changed `CLIENT_URL` after seeing the Worker URL, redeploy once more:

```bash
npm run deploy --workspace server
```

## Sharing a Game

1. Open the deployed frontend URL.
2. Enter a display name and click **Create Lobby**.
3. The host chooses a category before starting the game.
4. Use **Copy Link** to share the lobby URL. It includes `?code=ABCDE`.
5. Other players open the link, enter a display name, and click **Join**.

Players can also manually enter the lobby code shown in the header.

## Categories

The host can select one category before the game starts. The selected category is locked after start and becomes the 25-item `gameGrid` for secret selection, lids, and final guesses.

Included categories:

- Bollywood Actors
- Hollywood Celebrities
- Sports Stars
- Musicians
- Internet Personalities
- Mixed Pop Culture

## Image Credits

Portraits are sourced from Wikimedia Commons files. The app links to a built-in credits page at:

```text
/?page=credits
```

The credits page lists each image's Commons source page and license reference. The UI still has an initials fallback if a remote image fails to load.

## Cloudflare Architecture

- `POST /api/lobbies` reserves a short lobby code in D1.
- `GET /api/categories` returns hardcoded category data.
- `/lobby/:code/websocket` upgrades to a WebSocket and routes to the Durable Object named by that lobby code.
- The Durable Object owns the live lobby state and broadcasts sanitized `gameState` messages to each connected player.
- `selectedCategory` and `gameGrid` are stored in lobby state.
- Secret items are only included in `gameState` for players on the same team.
- Lid state is stored per team and only sent to members of that team.
- Completed games are recorded in D1 `game_results`.

## WebSocket Message Types

The client sends JSON messages with a `type` field:

- `chooseTeam`
- `updateTeamName`
- `randomizeTeamName`
- `updateCategory`
- `startGame`
- `selectSecretItem`
- `toggleLid`
- `clearLids`
- `endTurn`
- `makeFinalGuess`
- `restartGame`

The server sends:

- `gameState`
- `gameError`
- `ack`

## Gameplay Notes

- The backend never sends a team secret item to the opposing team.
- Lids are private per team and only synchronize with teammates.
- Only the host can change the category, and only while the lobby is still in the lobby phase.
- Team leaders can rename or randomize their team name.
- If a leader disconnects, another connected teammate is assigned leader automatically.
- The default final-guess rule is: a wrong final guess loses immediately.
