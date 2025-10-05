import type { GameState, OutputLine, Room } from "@shared/schema";
import { randomUUID } from "crypto";

const DIRS: Record<string, [number, number]> = {
  n: [0, -1],
  s: [0, 1],
  e: [1, 0],
  w: [-1, 0]
};

export class GameEngine {
  private addOutput(state: GameState, text: string, type: OutputLine['type'] = 'normal'): void {
    state.output.push({
      id: randomUUID(),
      text,
      type,
      timestamp: Date.now()
    });
  }

  private getCurrentRoom(state: GameState): Room {
    return state.rooms[state.playerRoom];
  }

  private findRoomAtXY(state: GameState, x: number, y: number): Room | undefined {
    return Object.values(state.rooms).find(r => r.x === x && r.y === y && r.passable);
  }

  private spendTime(state: GameState, minutes: number): void {
    state.time = Math.max(0, state.time - minutes);
    if (state.time === 0 && !state.gameOver) {
      this.addOutput(state, "", "normal");
      this.addOutput(state, "══════════════════════════════════════════════════════════════════════════════", "error");
      this.addOutput(state, "The station groans as safeties fail. Starhaven kisses the sun. All goes white.", "error");
      this.addOutput(state, "══════════════════════════════════════════════════════════════════════════════", "error");
      state.gameOver = true;
      state.gameWon = false;
    }
  }

  private syncNPCs(state: GameState): void {
    for (const roomId in state.rooms) {
      state.rooms[roomId].npcs = Object.values(state.npcs)
        .filter(npc => npc.room === roomId && !npc.arrested)
        .map(npc => npc.id);
    }
  }

  private look(state: GameState): void {
    const room = this.getCurrentRoom(state);
    this.addOutput(state, "", "normal");
    this.addOutput(state, room.name, "room-title");
    this.addOutput(state, room.desc, "normal");
    
    if (room.items.length > 0) {
      const itemNames = room.items.map(iid => state.items[iid].name).join(", ");
      this.addOutput(state, `Items here: ${itemNames}`, "normal");
    }
    
    if (room.npcs.length > 0) {
      const npcNames = room.npcs.map(nid => state.npcs[nid].name).join(", ");
      this.addOutput(state, `You see: ${npcNames}`, "npc");
    }
    
    const exits: string[] = [];
    for (const [dir, [dx, dy]] of Object.entries(DIRS)) {
      if (this.findRoomAtXY(state, room.x + dx, room.y + dy)) {
        exits.push(dir);
      }
    }
    
    if (exits.length > 0) {
      this.addOutput(state, `Exits: ${exits.join(", ")}`, "system");
    } else {
      this.addOutput(state, "No exits.", "system");
    }
    
    this.spendTime(state, 0);
  }

  private showMap(state: GameState): void {
    const rooms = Object.values(state.rooms);
    const maxX = Math.max(...rooms.map(r => r.x));
    const maxY = Math.max(...rooms.map(r => r.y));
    
    this.addOutput(state, "", "normal");
    this.addOutput(state, "STARHAVEN DECK PLAN:", "system");
    
    for (let y = 0; y <= maxY; y++) {
      let line = "";
      for (let x = 0; x <= maxX; x++) {
        const room = rooms.find(r => r.x === x && r.y === y);
        if (room) {
          const label = room.name.split(' ')[0].substring(0, 3).toUpperCase();
          if (state.playerRoom === room.id) {
            line += "[X] ";
          } else {
            line += label + " ";
          }
        } else {
          line += "    ";
        }
      }
      this.addOutput(state, line.trim(), "system");
    }
    
    this.spendTime(state, 0);
  }

  private showTime(state: GameState): void {
    this.addOutput(state, `Time to solar impact: ${state.time} minutes.`, state.time <= 15 ? "warning" : "system");
    this.spendTime(state, 0);
  }

  private showInventory(state: GameState): void {
    if (state.inventory.length > 0) {
      const itemNames = state.inventory.map(iid => state.items[iid].name).join(", ");
      this.addOutput(state, `You carry: ${itemNames}`, "normal");
    } else {
      this.addOutput(state, "You carry nothing.", "normal");
    }
    this.spendTime(state, 0);
  }

  private move(state: GameState, direction: string): void {
    const dir = direction.toLowerCase();
    if (!DIRS[dir]) {
      this.addOutput(state, "Use: go n/e/s/w", "error");
      return;
    }
    
    const [dx, dy] = DIRS[dir];
    const currentRoom = this.getCurrentRoom(state);
    const targetRoom = this.findRoomAtXY(state, currentRoom.x + dx, currentRoom.y + dy);
    
    if (!targetRoom) {
      this.addOutput(state, "Access denied or bulkhead sealed.", "error");
      return;
    }
    
    state.playerRoom = targetRoom.id;
    this.syncNPCs(state);
    this.look(state);
    this.spendTime(state, 2);
  }

  private take(state: GameState, ...args: string[]): void {
    if (args.length === 0) {
      this.addOutput(state, "Take what?", "error");
      return;
    }
    
    const name = args.join(" ").toLowerCase();
    const room = this.getCurrentRoom(state);
    
    let itemId: string | undefined;
    for (const iid of room.items) {
      if (state.items[iid].name.toLowerCase() === name || iid === name) {
        itemId = iid;
        break;
      }
    }
    
    if (!itemId) {
      this.addOutput(state, "Not here.", "error");
      return;
    }
    
    const item = state.items[itemId];
    if (!item.portable) {
      this.addOutput(state, "It's fixed in place.", "error");
      return;
    }
    
    room.items = room.items.filter(i => i !== itemId);
    state.inventory.push(itemId);
    this.addOutput(state, `You take the ${item.name}.`, "success");
    this.spendTime(state, 1);
  }

  private drop(state: GameState, ...args: string[]): void {
    if (args.length === 0) {
      this.addOutput(state, "Drop what?", "error");
      return;
    }
    
    const name = args.join(" ").toLowerCase();
    
    let itemId: string | undefined;
    for (const iid of state.inventory) {
      if (state.items[iid].name.toLowerCase() === name || iid === name) {
        itemId = iid;
        break;
      }
    }
    
    if (!itemId) {
      this.addOutput(state, "You don't have that.", "error");
      return;
    }
    
    state.inventory = state.inventory.filter(i => i !== itemId);
    this.getCurrentRoom(state).items.push(itemId);
    this.addOutput(state, `You drop the ${state.items[itemId].name}.`, "normal");
    this.spendTime(state, 1);
  }

  private inspect(state: GameState, ...args: string[]): void {
    if (args.length === 0) {
      this.addOutput(state, "Inspect what?", "error");
      return;
    }
    
    const name = args.join(" ").toLowerCase();
    const room = this.getCurrentRoom(state);
    const itemPool = [...state.inventory, ...room.items];
    
    for (const iid of itemPool) {
      const item = state.items[iid];
      if (item.name.toLowerCase() === name || iid === name) {
        let detail = item.desc;
        if (state.killerEvidence[state.killerId].includes(iid)) {
          detail += " (Something about this ties uncomfortably close to the killer.)";
        }
        this.addOutput(state, detail, "normal");
        this.spendTime(state, 1);
        return;
      }
    }
    
    for (const nid of room.npcs) {
      const npc = state.npcs[nid];
      if (npc.name.toLowerCase() === name || nid === name) {
        this.addOutput(state, `${npc.name}, ${npc.title}. ${npc.cooperative ? 'Calm' : 'Guarded'}.`, "normal");
        this.spendTime(state, 1);
        return;
      }
    }
    
    this.addOutput(state, "You find nothing notable.", "normal");
  }

  private talk(state: GameState, ...args: string[]): void {
    if (args.length === 0) {
      this.addOutput(state, "Talk to whom?", "error");
      return;
    }
    
    const who = args.join(" ").toLowerCase();
    const room = this.getCurrentRoom(state);
    
    let targetId: string | undefined;
    for (const nid of room.npcs) {
      const npc = state.npcs[nid];
      if (npc.name.toLowerCase() === who || nid === who) {
        targetId = nid;
        break;
      }
    }
    
    if (!targetId) {
      this.addOutput(state, "They aren't here.", "error");
      return;
    }
    
    const npc = state.npcs[targetId];
    const guilty = targetId === state.killerId;
    const line = guilty ? npc.lieWhenGuilty : npc.truthWhenInnocent;
    
    this.addOutput(state, `${npc.name}: "${line}"`, "npc");
    
    if (!guilty && Math.random() < 0.25) {
      npc.cooperative = true;
    }
    
    this.spendTime(state, 2);
  }

  private accuse(state: GameState, ...args: string[]): void {
    if (args.length === 0) {
      this.addOutput(state, "Accuse whom?", "error");
      return;
    }
    
    let who = args.join(" ").toLowerCase();
    
    if (!state.npcs[who]) {
      const matches = Object.entries(state.npcs).filter(([_, npc]) => 
        npc.name.toLowerCase() === who
      );
      if (matches.length === 0) {
        this.addOutput(state, "Not a listed guest.", "error");
        return;
      }
      who = matches[0][0];
    }
    
    const guilty = who === state.killerId;
    const tips = state.killerEvidence[state.killerId];
    
    this.addOutput(state, `You lay out your case against ${state.npcs[who].name}.`, "normal");
    
    if (guilty) {
      this.addOutput(state, "They blanch. A vein ticks. The room chills.", "success");
      const evidenceNames = tips.map(e => state.items[e].name).join(", ");
      this.addOutput(state, `Key tells: ${evidenceNames}.`, "success");
    } else {
      this.addOutput(state, "They sneer. Those 'clues' don't hold up. Doubt creeps in.", "error");
    }
    
    this.spendTime(state, 3);
  }

  private arrest(state: GameState, ...args: string[]): void {
    if (args.length === 0) {
      this.addOutput(state, "Arrest whom?", "error");
      return;
    }
    
    if (!state.inventory.includes("cuffs")) {
      this.addOutput(state, "You need Restraint Cuffs to arrest.", "error");
      return;
    }
    
    const who = args.join(" ").toLowerCase();
    const room = this.getCurrentRoom(state);
    
    let targetId: string | undefined;
    for (const nid of room.npcs) {
      const npc = state.npcs[nid];
      if (npc.name.toLowerCase() === who || nid === who) {
        targetId = nid;
        break;
      }
    }
    
    if (!targetId) {
      this.addOutput(state, "They aren't here.", "error");
      return;
    }
    
    const npc = state.npcs[targetId];
    if (npc.arrested) {
      this.addOutput(state, "Already restrained.", "normal");
      return;
    }
    
    npc.arrested = true;
    npc.room = "brig";
    this.syncNPCs(state);
    
    if (targetId === state.killerId) {
      if (!state.rooms.brig.items.includes("codes_token")) {
        state.rooms.brig.items.push("codes_token");
      }
    }
    
    this.addOutput(state, `You restrain ${npc.name}. Security drones escort them to the Brig.`, "success");
    this.spendTime(state, 3);
  }

  private useConsole(state: GameState): void {
    if (state.playerRoom !== "command") {
      this.addOutput(state, "You must be at the Master Console on the Command Deck.", "error");
      return;
    }
    
    const codesInBrig = state.rooms.brig.items.includes("codes_token");
    
    if (codesInBrig) {
      this.addOutput(state, "", "normal");
      this.addOutput(state, "══════════════════════════════════════════════════════════════════════════════", "success");
      this.addOutput(state, "You splice in the Master Codes Token from the Brig. The lockout shudders…", "success");
      this.addOutput(state, "Trajectory control restored. Starhaven veers away from the sun.", "success");
      this.addOutput(state, `The killer was ${state.npcs[state.killerId].name}. Justice will follow.`, "success");
      this.addOutput(state, "", "normal");
      this.addOutput(state, "YOU WIN.", "success");
      this.addOutput(state, "══════════════════════════════════════════════════════════════════════════════", "success");
      state.gameOver = true;
      state.gameWon = true;
    } else {
      this.addOutput(state, "Console flashes: 'DECRYPTION SEED REQUIRED — (ARREST PERPETRATOR)'.", "warning");
      const anyArrested = Object.values(state.npcs).some(n => n.arrested);
      if (anyArrested) {
        this.addOutput(state, "Someone is in the Brig… but the console rejects their credentials.", "error");
        this.addOutput(state, "If you grabbed the wrong person, time is running out.", "warning");
      }
      this.spendTime(state, 1);
    }
  }

  private help(state: GameState): void {
    this.addOutput(state, "", "normal");
    this.addOutput(state, "Commands: help, look, map, go n/e/s/w, take [item], drop [item], inv, inspect [thing],", "system");
    this.addOutput(state, "          talk [name], accuse [name], arrest [name], use console, time", "system");
  }

  public processCommand(state: GameState, command: string): void {
    if (state.gameOver) {
      this.addOutput(state, "Game is over. Start a new game to continue.", "error");
      return;
    }
    
    const trimmed = command.trim();
    if (!trimmed) return;
    
    this.addOutput(state, command, "command");
    
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    switch (cmd) {
      case "help":
        this.help(state);
        break;
      case "look":
        this.look(state);
        break;
      case "map":
        this.showMap(state);
        break;
      case "time":
        this.showTime(state);
        break;
      case "go":
      case "move":
        if (args.length === 0) {
          this.addOutput(state, "Go where? n/e/s/w", "error");
        } else {
          this.move(state, args[0]);
        }
        break;
      case "take":
        this.take(state, ...args);
        break;
      case "drop":
        this.drop(state, ...args);
        break;
      case "inv":
      case "inventory":
        this.showInventory(state);
        break;
      case "inspect":
        this.inspect(state, ...args);
        break;
      case "talk":
        this.talk(state, ...args);
        break;
      case "accuse":
        this.accuse(state, ...args);
        break;
      case "arrest":
        this.arrest(state, ...args);
        break;
      case "use":
        if (args.length > 0 && args[0].toLowerCase() === "console") {
          this.useConsole(state);
        } else {
          this.addOutput(state, "Use what? Try 'use console' at Command Deck.", "error");
        }
        break;
      default:
        this.addOutput(state, "Unrecognized. Try 'help'.", "error");
    }
    
    if (state.time <= 15 && state.time > 0 && !state.gameOver) {
      this.addOutput(state, `(Alarms intensify: ${state.time} minutes left.)`, "warning");
    }
  }
}