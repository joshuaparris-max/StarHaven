import { useEffect, useRef } from "react";
import type { OutputLine } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Trophy, Skull } from "lucide-react";

interface TerminalOutputProps {
  output: OutputLine[];
  gameOver: boolean;
  gameWon: boolean;
}

export function TerminalOutput({ output, gameOver, gameWon }: TerminalOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const getLineClassName = (type: OutputLine['type']) => {
    switch (type) {
      case 'command':
        return 'text-accent-foreground font-semibold';
      case 'error':
        return 'text-destructive';
      case 'success':
        return 'text-chart-3';
      case 'npc':
        return 'text-chart-1';
      case 'system':
        return 'text-accent-foreground';
      case 'room-title':
        return 'text-primary font-bold text-lg mt-3 mb-1';
      case 'warning':
        return 'text-destructive font-semibold animate-pulse';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="flex-1 overflow-hidden relative bg-background">
      {/* Subtle CRT scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-b from-transparent via-primary to-transparent bg-repeat-y animate-[scan_8s_linear_infinite]" 
           style={{ backgroundSize: '100% 4px' }}></div>
      
      <ScrollArea className="h-full">
        <div className="p-6 font-mono text-sm leading-relaxed space-y-1" ref={scrollRef}>
          {output.length === 0 && (
            <div className="text-muted-foreground italic">
              Awaiting input...
            </div>
          )}
          
          {output.map((line) => (
            <div 
              key={line.id} 
              className={`${getLineClassName(line.type)} transition-colors`}
              style={{ textShadow: line.type === 'command' || line.type === 'npc' ? '0 0 8px currentColor' : 'none' }}
              data-testid={`output-line-${line.type}`}
            >
              {line.type === 'command' && '> '}
              {line.text}
            </div>
          ))}
          
          {gameOver && (
            <div className="mt-6 p-6 border-2 rounded-md text-center space-y-3">
              {gameWon ? (
                <>
                  <div className="flex justify-center">
                    <Trophy className="w-16 h-16 text-chart-3" />
                  </div>
                  <div className="text-2xl font-bold text-chart-3" style={{ textShadow: '0 0 12px currentColor' }}>
                    MISSION ACCOMPLISHED
                  </div>
                  <div className="text-muted-foreground">
                    You saved Starhaven and brought the killer to justice.
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <Skull className="w-16 h-16 text-destructive" />
                  </div>
                  <div className="text-2xl font-bold text-destructive" style={{ textShadow: '0 0 12px currentColor' }}>
                    GAME OVER
                  </div>
                  <div className="text-muted-foreground">
                    Starhaven has fallen into the sun...
                  </div>
                </>
              )}
              <div className="text-xs text-muted-foreground pt-2">
                Start a new game to try again
              </div>
            </div>
          )}
          
          <div ref={bottomRef}></div>
        </div>
      </ScrollArea>
    </div>
  );
}