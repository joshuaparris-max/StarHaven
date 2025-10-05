import type { GameState } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MapDisplayProps {
  gameState: GameState;
  compact?: boolean;
}

export function MapDisplay({ gameState, compact }: MapDisplayProps) {
  const rooms = Object.values(gameState.rooms);
  const maxX = Math.max(...rooms.map(r => r.x));
  const maxY = Math.max(...rooms.map(r => r.y));
  
  const grid: (string | null)[][] = Array(maxY + 1).fill(null).map(() => 
    Array(maxX + 1).fill(null)
  );
  
  rooms.forEach(room => {
    const label = room.name.split(' ')[0].substring(0, 3).toUpperCase();
    grid[room.y][room.x] = room.id;
  });

  const getCellContent = (roomId: string | null, x: number, y: number) => {
    if (!roomId) return '   ';
    const room = gameState.rooms[roomId];
    const label = room.name.split(' ')[0].substring(0, 3).toUpperCase();
    
    if (gameState.playerRoom === roomId) {
      return `[X]`;
    }
    return label;
  };

  const getCellClassName = (roomId: string | null) => {
    if (!roomId) return 'text-muted-foreground/20';
    if (gameState.playerRoom === roomId) {
      return 'text-accent-foreground font-bold animate-pulse';
    }
    return 'text-primary/80';
  };

  return (
    <Card className={compact ? 'p-2' : ''}>
      {!compact && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-primary">DECK PLAN</CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? 'p-0' : 'pt-0'}>
        <div className={`font-mono ${compact ? 'text-[10px]' : 'text-xs'} leading-tight space-y-1`}>
          {grid.map((row, y) => (
            <div key={y} className="flex gap-2 justify-center" data-testid={`map-row-${y}`}>
              {row.map((roomId, x) => (
                <span 
                  key={`${x}-${y}`}
                  className={`${getCellClassName(roomId)} transition-all`}
                  style={{ 
                    textShadow: gameState.playerRoom === roomId ? '0 0 8px currentColor' : 'none',
                    minWidth: compact ? '24px' : '32px',
                    textAlign: 'center'
                  }}
                  data-testid={roomId ? `map-cell-${roomId}` : undefined}
                >
                  {getCellContent(roomId, x, y)}
                </span>
              ))}
            </div>
          ))}
        </div>
        {!compact && gameState.rooms[gameState.playerRoom] && (
          <div className="mt-3 pt-3 border-t border-border text-xs">
            <div className="text-muted-foreground">Current Location:</div>
            <div className="text-foreground font-semibold" data-testid="text-current-room">
              {gameState.rooms[gameState.playerRoom].name}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}