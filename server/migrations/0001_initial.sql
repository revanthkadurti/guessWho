CREATE TABLE IF NOT EXISTS lobby_index (
  code TEXT PRIMARY KEY,
  durable_object_name TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS game_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  winner_team_id TEXT NOT NULL,
  winner_team_name TEXT NOT NULL,
  finished_at INTEGER NOT NULL,
  player_count INTEGER NOT NULL
);
