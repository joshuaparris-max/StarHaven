import { z } from "zod";

export interface Room {
  id: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  items: string[];
  npcs: string[];
  passable: boolean;
}

export interface Item {
  id: string;
  name: string;
  desc: string;
  portable: boolean;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  room: string;
  alibi: string;
  truthWhenInnocent: string;
  lieWhenGuilty: string;
  cooperative: boolean;
  arrested: boolean;
}

export interface GameState {
  time: number;
  playerRoom: string;
  inventory: string[];
  rooms: Record<string, Room>;
  items: Record<string, Item>;
  npcs: Record<string, NPC>;
  killerId: string;
  killerEvidence: Record<string, string[]>;
  gameOver: boolean;
  gameWon: boolean;
  output: OutputLine[];
}

export interface OutputLine {
  id: string;
  text: string;
  type: 'normal' | 'command' | 'error' | 'success' | 'npc' | 'system' | 'room-title' | 'warning';
  timestamp: number;
}

export interface CommandResult {
  output: OutputLine[];
  gameState: GameState;
}

export const commandSchema = z.object({
  command: z.string(),
});

export type CommandInput = z.infer<typeof commandSchema>;