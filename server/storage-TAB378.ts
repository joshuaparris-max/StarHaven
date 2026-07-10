import type { GameState, Room, Item, NPC, OutputLine } from "@shared/schema";
import { makeUuid } from "@shared/random";
import { SeededRandom, generateCaseCode } from "./seeded-random";

export interface IStorage {
  getGameState(): Promise<GameState | undefined>;
  createGame(caseCode?: string): Promise<GameState>;
  updateGameState(state: GameState): Promise<GameState>;
}

export class MemStorage implements IStorage {
  private gameState: GameState | undefined;

  constructor() {
    this.gameState = undefined;
  }

  async getGameState(): Promise<GameState | undefined> {
    return this.gameState;
  }

  async createGame(caseCode?: string): Promise<GameState> {
    this.gameState = this.initializeGame(caseCode);
    return this.gameState;
  }

  async updateGameState(state: GameState): Promise<GameState> {
    this.gameState = state;
    return this.gameState;
  }

  private initializeGame(caseCode?: string): GameState {
    const code = caseCode || generateCaseCode();
    const rng = new SeededRandom(code);
    const rooms: Record<string, Room> = {
      atrium: {
        id: "atrium",
        name: "Grand Atrium",
        desc: "A vaulted hub of glass and brass. Guests murmur beneath a holographic sun.",
        x: 2, y: 1,
        items: ["cuffs"],
        npcs: ["das"],
        passable: true
      },
      gala: {
        id: "gala",
        name: "Gala Dome",
        desc: "A crystal hemisphere with a view of the star. Tables abandoned mid-toast.",
        x: 2, y: 0,
        items: ["cufflink", "manifest"],
        npcs: ["chen"],
        passable: true
      },
      labs: {
        id: "labs",
        name: "Bio-Labs",
        desc: "Sterile corridors and nutrient fog. Security panels blink amber.",
        x: 1, y: 0,
        items: ["stimulant", "overwritten_log"],
        npcs: ["voss"],
        passable: true
      },
      hangar: {
        id: "hangar",
        name: "Shuttle Hangar",
        desc: "Docked skiffs hum softly. The escape shuttle is locked behind red bars.",
        x: 4, y: 1,
        items: ["forged_card"],
        npcs: [],
        passable: true
      },
      command: {
        id: "command",
        name: "Command Deck",
        desc: "Tiered consoles and a captain's chair. The Master Console awaits.",
        x: 3, y: 0,
        items: ["thruster_invoice"],
        npcs: [],
        passable: true
      },
      brig: {
        id: "brig",
        name: "Security Brig",
        desc: "Energy bars and cold benches. An arrest field projector hums.",
        x: 0, y: 1,
        items: [],
        npcs: [],
        passable: true
      },
      gardens: {
        id: "gardens",
        name: "Starlight Gardens",
        desc: "Bioluminescent vines wind around art installations.",
        x: 1, y: 2,
        items: ["dna_fiber"],
        npcs: [],
        passable: true
      },
      suites: {
        id: "suites",
        name: "VIP Suites",
        desc: "Private doors, hush-fields, and the perfume of old money.",
        x: 3, y: 2,
        items: ["weapon_garrote"],
        npcs: ["vale"],
        passable: true
      },
      service: {
        id: "service",
        name: "Service Ducts",
        desc: "Tight passages. The station's veins and secrets.",
        x: 4, y: 2,
        items: ["maintenance_key"],
        npcs: ["pax"],
        passable: true
      },
      observ: {
        id: "observ",
        name: "Observatory",
        desc: "A darkened lens toward eternity. One pane bears a smeared print.",
        x: 0, y: 0,
        items: ["smeared_print"],
        npcs: ["rourke"],
        passable: true
      }
    };

    const items: Record<string, Item> = {
      cuffs: { id: "cuffs", name: "Restraint Cuffs", desc: "Security-issue restraints. Required to arrest.", portable: true },
      weapon_garrote: { id: "weapon_garrote", name: "Monofilament Garrote", desc: "A deadly, almost invisible wire.", portable: true },
      forged_card: { id: "forged_card", name: "Forged Access Card", desc: "Fake credentials to restricted areas.", portable: true },
      overwritten_log: { id: "overwritten_log", name: "Overwritten Maint Log", desc: "Someone scrubbed a schedule entry.", portable: true },
      cufflink: { id: "cufflink", name: "Bloodied Cufflink", desc: "A luxury cufflink marred by blood.", portable: true },
      stimulant: { id: "stimulant", name: "Stimulant Vial", desc: "Keeps one wired through the night.", portable: true },
      thruster_invoice: { id: "thruster_invoice", name: "Thruster Fuel Invoice", desc: "Large purchase to adjust trajectory.", portable: true },
      manifest: { id: "manifest", name: "Shuttle Manifest", desc: "Lists who booked hangar access windows.", portable: true },
      dna_fiber: { id: "dna_fiber", name: "Microscopic Fiber", desc: "Matches a rare weave—if tested.", portable: true },
      smeared_print: { id: "smeared_print", name: "Smeared Fingerprint", desc: "Partial, odd—like gel gloves were used.", portable: true },
      maintenance_key: { id: "maintenance_key", name: "Maintenance Master Key", desc: "Opens service panels.", portable: true },
      codes_token: { id: "codes_token", name: "Master Codes Token", desc: "Decryption seed for trajectory lockout. Found only on the killer.", portable: false }
    };

    const npcs: Record<string, NPC> = {
      voss: {
        id: "voss",
        name: "Dr. Selene Voss",
        title: "biotech magnate",
        room: "labs",
        alibi: "Was calibrating gene arrays in Bio-Labs.",
        truthWhenInnocent: "You can ask the lab AI—my access badge logged me in at 23:10.",
        lieWhenGuilty: "I never left the gala. Dozens saw me.",
        cooperative: true,
        arrested: false
      },
      rourke: {
        id: "rourke",
        name: "Admiral Kade Rourke",
        title: "retired fleet",
        room: "observ",
        alibi: "Consulting star charts in the Observatory.",
        truthWhenInnocent: "An ensign pinged me there; check the telescope usage logs.",
        lieWhenGuilty: "I was in my suite polishing medals; no one saw me.",
        cooperative: true,
        arrested: false
      },
      chen: {
        id: "chen",
        name: "Minister Lira Chen",
        title: "trade minister",
        room: "gala",
        alibi: "Negotiating a treaty in the Gala Dome.",
        truthWhenInnocent: "Security holo shows me on the dais at 23:40.",
        lieWhenGuilty: "Alone in prayer in the gardens; no recordings.",
        cooperative: true,
        arrested: false
      },
      vale: {
        id: "vale",
        name: "Orin Vale",
        title: "media baron",
        room: "suites",
        alibi: "Interview prep in the VIP Suites.",
        truthWhenInnocent: "My producer ping records prove I stayed in-suite.",
        lieWhenGuilty: "I toured the labs with permission—routine stuff.",
        cooperative: true,
        arrested: false
      },
      das: {
        id: "das",
        name: "Prof. Mira Das",
        title: "AI ethicist",
        room: "atrium",
        alibi: "Debating sentience law by the atrium sculpture.",
        truthWhenInnocent: "The sculpture's mic captured the debate; timestamped.",
        lieWhenGuilty: "I took a quiet walk in the unmonitored ducts.",
        cooperative: true,
        arrested: false
      },
      pax: {
        id: "pax",
        name: "Pax Morita",
        title: "chief engineer",
        room: "service",
        alibi: "Inspecting service ducts after an anomaly.",
        truthWhenInnocent: "Maintenance drone #7 tagged me on route S-Delta.",
        lieWhenGuilty: "Chatting with donors in the Dome all evening.",
        cooperative: true,
        arrested: false
      }
    };

    const suspects = Object.keys(npcs);
    const killerId = suspects[rng.nextInt(suspects.length)];

    const evidencePool: Record<string, string[]> = {
      voss: ["dna_fiber", "stimulant", "forged_card"],
      rourke: ["cufflink", "smeared_print", "thruster_invoice"],
      chen: ["manifest", "forged_card", "weapon_garrote"],
      vale: ["cufflink", "manifest", "stimulant"],
      das: ["overwritten_log", "dna_fiber", "smeared_print"],
      pax: ["maintenance_key", "overwritten_log", "thruster_invoice"]
    };

    const killerEvidence: Record<string, string[]> = {};
    for (const suspect of suspects) {
      const pool = evidencePool[suspect];
      const selected: string[] = [];
      const poolCopy = [...pool];
      
      for (let i = 0; i < 3; i++) {
        const idx = rng.nextInt(poolCopy.length);
        selected.push(poolCopy[idx]);
        poolCopy.splice(idx, 1);
      }
      
      killerEvidence[suspect] = selected;
    }

    const welcomeOutput: OutputLine[] = [
      {
        id: makeUuid(),
        text: "══════════════════════════════════════════════════════════════════════════════",
        type: "system",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "STARHAVEN STATION - CRISIS PROTOCOL ACTIVE",
        type: "system",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "══════════════════════════════════════════════════════════════════════════════",
        type: "system",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "",
        type: "normal",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "A murder has occurred aboard Starhaven. The killer has sabotaged the trajectory controls.",
        type: "normal",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "In 60 minutes, the station will fall into the sun unless you restore control.",
        type: "warning",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "",
        type: "normal",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "Type 'help' for commands. Type 'look' to survey your surroundings.",
        type: "system",
        timestamp: Date.now()
      },
      {
        id: makeUuid(),
        text: "",
        type: "normal",
        timestamp: Date.now()
      }
    ];

    return {
      caseCode: code,
      time: 60,
      playerRoom: "atrium",
      inventory: [],
      rooms,
      items,
      npcs,
      killerId,
      killerEvidence,
      gameOver: false,
      gameWon: false,
      output: welcomeOutput
    };
  }
}

export const storage = new MemStorage();
