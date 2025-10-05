import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GameEngine } from "./game-engine";
import { commandSchema } from "@shared/schema";
import type { GameState, CommandResult } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const gameEngine = new GameEngine();

  app.post("/api/game/new", async (req, res) => {
    try {
      const gameState = await storage.createGame();
      res.json(gameState);
    } catch (error) {
      console.error("Error creating game:", error);
      res.status(500).json({ error: "Failed to create game" });
    }
  });

  app.get("/api/game/state", async (req, res) => {
    try {
      const gameState = await storage.getGameState();
      if (!gameState) {
        res.status(404).json({ error: "No active game" });
        return;
      }
      res.json(gameState);
    } catch (error) {
      console.error("Error getting game state:", error);
      res.status(500).json({ error: "Failed to get game state" });
    }
  });

  app.post("/api/game/command", async (req, res) => {
    try {
      const parsed = commandSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid command format" });
        return;
      }

      let gameState = await storage.getGameState();
      if (!gameState) {
        res.status(404).json({ error: "No active game" });
        return;
      }

      gameEngine.processCommand(gameState, parsed.data.command);
      
      gameState = await storage.updateGameState(gameState);

      const result: CommandResult = {
        output: gameState.output,
        gameState
      };

      res.json(result);
    } catch (error) {
      console.error("Error processing command:", error);
      res.status(500).json({ error: "Failed to process command" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}