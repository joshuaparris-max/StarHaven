import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { GameState, CommandResult } from "@shared/schema";
import { TerminalOutput } from "@/components/TerminalOutput";
import { CommandInput } from "@/components/CommandInput";
import { MapDisplay } from "@/components/MapDisplay";
import { InventoryPanel } from "@/components/InventoryPanel";
import { TimeCountdown } from "@/components/TimeCountdown";
import { NPCList } from "@/components/NPCList";
import { HelpPanel } from "@/components/HelpPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlayCircle, RotateCcw, Calendar, Shuffle, Hash } from "lucide-react";

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [gameMode, setGameMode] = useState<'random' | 'daily' | 'custom'>('random');
  const [caseCode, setCaseCode] = useState('');

  const { data: gameState, isLoading } = useQuery<GameState>({
    queryKey: ['/api/game/state'],
    enabled: gameStarted,
    refetchInterval: false,
  });

  const startGameMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest<GameState>('POST', '/api/game/new', {
        mode: gameMode,
        caseCode: gameMode === 'custom' ? caseCode : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
      setGameStarted(true);
    },
  });

  const commandMutation = useMutation({
    mutationFn: async (command: string) => {
      return await apiRequest<CommandResult>('POST', '/api/game/command', { command });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
    },
  });

  const handleCommand = (command: string) => {
    if (!command.trim()) return;
    
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    commandMutation.mutate(command);
  };

  const handleNewGame = () => {
    if (gameMode === 'custom' && !caseCode.trim()) {
      return;
    }
    setCommandHistory([]);
    setHistoryIndex(-1);
    startGameMutation.mutate();
  };

  if (!gameStarted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-mono text-primary tracking-wider">
              STARHAVEN
            </h1>
            <p className="text-xl text-accent-foreground font-mono">
              A TEXT MURDER MYSTERY
            </p>
          </div>
          
          <div className="space-y-4 text-left text-muted-foreground text-sm leading-relaxed">
            <p>
              A murder aboard the luxury space station Starhaven. The killer has sabotaged the 
              trajectory controls—in 60 minutes, the station falls into the sun.
            </p>
            <p>
              You must investigate the scene, interrogate six suspects, collect evidence, and 
              arrest the real killer before time runs out.
            </p>
            <div className="border-l-2 border-primary pl-4 space-y-1 text-xs">
              <p className="text-primary font-semibold">HOW TO WIN:</p>
              <p>1. Collect the Restraint Cuffs from the Grand Atrium</p>
              <p>2. Gather evidence and interrogate suspects</p>
              <p>3. Arrest the killer (they'll be taken to the Brig)</p>
              <p>4. Go to Command Deck and "use console" to restore controls</p>
            </div>
            <div className="border-l-2 border-destructive pl-4 space-y-1 text-xs">
              <p className="text-destructive font-semibold">HOW TO LOSE:</p>
              <p>• Arrest the wrong person</p>
              <p>• Let time run out</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-mono text-primary">SELECT CASE MODE</Label>
              <RadioGroup value={gameMode} onValueChange={(value: any) => setGameMode(value)} data-testid="radio-group-game-mode">
                <div className="flex items-center space-x-2 hover-elevate rounded-md p-3 transition-colors">
                  <RadioGroupItem value="random" id="random" data-testid="radio-random" />
                  <Label htmlFor="random" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">Random Case</div>
                        <div className="text-xs text-muted-foreground">Fresh mystery every time</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 hover-elevate rounded-md p-3 transition-colors">
                  <RadioGroupItem value="daily" id="daily" data-testid="radio-daily" />
                  <Label htmlFor="daily" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">Daily Case</div>
                        <div className="text-xs text-muted-foreground">Same case for everyone today</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 hover-elevate rounded-md p-3 transition-colors">
                  <RadioGroupItem value="custom" id="custom" data-testid="radio-custom" />
                  <Label htmlFor="custom" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">Custom Case Code</div>
                        <div className="text-xs text-muted-foreground">Replay or share a specific case</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {gameMode === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="case-code" className="text-sm font-mono text-primary">ENTER CASE CODE</Label>
                <Input
                  id="case-code"
                  value={caseCode}
                  onChange={(e) => setCaseCode(e.target.value.toUpperCase())}
                  placeholder="e.g., A3F2B1C4"
                  className="font-mono uppercase"
                  maxLength={8}
                  data-testid="input-case-code"
                />
              </div>
            )}
          </div>

          <Button 
            size="lg"
            onClick={handleNewGame}
            disabled={startGameMutation.isPending || (gameMode === 'custom' && !caseCode.trim())}
            className="w-full text-base"
            data-testid="button-new-game"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {startGameMutation.isPending ? 'INITIALIZING...' : 'START GAME'}
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading || !gameState) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-primary text-xl font-mono animate-pulse">
            LOADING STARHAVEN SYSTEMS...
          </div>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold font-mono text-primary tracking-wider">
            STARHAVEN
          </h1>
          <div className="h-4 w-px bg-border"></div>
          <TimeCountdown time={gameState.time} />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleNewGame}
          disabled={startGameMutation.isPending}
          data-testid="button-restart-game"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[300px_1fr_300px] h-full">
          {/* Left Panel */}
          <div className="border-r border-border bg-card overflow-y-auto">
            <div className="p-4 space-y-4">
              <MapDisplay gameState={gameState} />
              <InventoryPanel inventory={gameState.inventory} items={gameState.items} />
            </div>
          </div>

          {/* Center Panel - Terminal */}
          <div className="flex flex-col h-full">
            <TerminalOutput 
              output={gameState.output} 
              gameOver={gameState.gameOver}
              gameWon={gameState.gameWon}
            />
            <CommandInput
              onCommand={handleCommand}
              disabled={commandMutation.isPending || gameState.gameOver}
              commandHistory={commandHistory}
              historyIndex={historyIndex}
              onHistoryIndexChange={setHistoryIndex}
            />
          </div>

          {/* Right Panel */}
          <div className="border-l border-border bg-card overflow-y-auto">
            <div className="p-4 space-y-4">
              <NPCList npcs={gameState.npcs} currentRoom={gameState.playerRoom} />
              <HelpPanel />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col h-full">
          <div className="flex-1 flex flex-col overflow-hidden">
            <TerminalOutput 
              output={gameState.output} 
              gameOver={gameState.gameOver}
              gameWon={gameState.gameWon}
            />
            <CommandInput
              onCommand={handleCommand}
              disabled={commandMutation.isPending || gameState.gameOver}
              commandHistory={commandHistory}
              historyIndex={historyIndex}
              onHistoryIndexChange={setHistoryIndex}
            />
          </div>
          
          {/* Mobile Info Panel */}
          <div className="border-t border-border bg-card p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <MapDisplay gameState={gameState} compact />
              <InventoryPanel inventory={gameState.inventory} items={gameState.items} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}