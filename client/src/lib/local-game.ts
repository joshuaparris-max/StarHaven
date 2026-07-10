import type { CommandResult, GameState } from "@shared/schema";
import { MemStorage } from "@server/storage";
import { GameEngine } from "@server/game-engine";
import { getDailyCaseCode } from "@server/seeded-random";

const STORAGE_KEY = "starhaven-mystery.game-state";
const engine = new GameEngine();

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

function saveGameState(state: GameState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function startLocalGame(mode: "random" | "daily" | "custom", caseCode?: string): Promise<GameState> {
  const storage = new MemStorage();
  let selectedCode: string | undefined;

  if (mode === "daily") selectedCode = getDailyCaseCode();
  if (mode === "custom" && caseCode) selectedCode = caseCode.toUpperCase();

  const gameState = await storage.createGame(selectedCode);
  saveGameState(gameState);
  return gameState;
}

export function runLocalCommand(command: string): CommandResult {
  const gameState = loadGameState();
  if (!gameState) {
    throw new Error("No active game");
  }

  engine.processCommand(gameState, command);
  saveGameState(gameState);
  return { output: gameState.output, gameState };
}
