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

Run the backend and frontend in separate terminals:

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

## Deploy Backend to Cloudflare

1. Push this repository to GitHub.
2. Install and authenticate Wrangler if needed:

```bash
npx wrangler login
```

3. Create the production D1 database:

```bash
npm exec --workspace server wrangler d1 create bollywood_guess_grid
```

4. Copy the returned `database_id` into [server/wrangler.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.toml).
5. Set `CLIENT_URL` in [server/wrangler.toml](/Users/revanthadurti/projects/Games/GuessWho/server/wrangler.toml) to your deployed frontend URL.
6. Apply the remote D1 migration:

```bash
npm run d1:migrate:remote --workspace server
```

7. Deploy the Worker:

```bash
npm run deploy --workspace server
```

8. Copy the deployed Worker URL. That is your backend URL.

## Deploy Frontend to Vercel

1. In Vercel, import the GitHub repo.
2. Use these settings:
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variable:
   - `VITE_SERVER_URL`: your deployed Cloudflare Worker URL
4. Deploy.
5. Update the backend `CLIENT_URL` to the exact Vercel URL and redeploy the Worker.

## Deploy Frontend to Netlify

1. Import the GitHub repo in Netlify.
2. Use:
   - Base Directory: `client`
   - Build Command: `npm run build`
   - Publish Directory: `client/dist`
3. Add `VITE_SERVER_URL` with your deployed Cloudflare Worker URL.
4. Deploy, then set the backend `CLIENT_URL` to the Netlify URL and redeploy the Worker.

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
