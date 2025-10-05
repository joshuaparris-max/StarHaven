import type { NPC } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Handcuffs } from "lucide-react";

interface NPCListProps {
  npcs: Record<string, NPC>;
  currentRoom: string;
}

export function NPCList({ npcs, currentRoom }: NPCListProps) {
  const npcList = Object.values(npcs);
  const inRoomNPCs = npcList.filter(npc => npc.room === currentRoom && !npc.arrested);
  const arrestedNPCs = npcList.filter(npc => npc.arrested);
  const otherNPCs = npcList.filter(npc => npc.room !== currentRoom && !npc.arrested);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
          <Users className="w-4 h-4" />
          SUSPECTS
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {inRoomNPCs.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-accent-foreground font-semibold">IN THIS ROOM:</div>
            {inRoomNPCs.map(npc => (
              <div 
                key={npc.id} 
                className="text-sm font-mono group"
                data-testid={`npc-present-${npc.id}`}
              >
                <div className="text-foreground font-semibold">{npc.name}</div>
                <div className="text-xs text-muted-foreground">{npc.title}</div>
              </div>
            ))}
          </div>
        )}

        {arrestedNPCs.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs text-destructive font-semibold flex items-center gap-1">
              <Handcuffs className="w-3 h-3" />
              ARRESTED:
            </div>
            {arrestedNPCs.map(npc => (
              <div 
                key={npc.id} 
                className="text-sm font-mono"
                data-testid={`npc-arrested-${npc.id}`}
              >
                <div className="text-destructive font-semibold flex items-center gap-2">
                  {npc.name}
                  <Badge variant="destructive" className="text-[10px] py-0 px-1 h-4">
                    BRIG
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{npc.title}</div>
              </div>
            ))}
          </div>
        )}

        {otherNPCs.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground font-semibold">ALL SUSPECTS:</div>
            {otherNPCs.map(npc => (
              <div 
                key={npc.id} 
                className="text-xs font-mono text-muted-foreground"
                data-testid={`npc-other-${npc.id}`}
              >
                <div>{npc.name}</div>
                <div className="text-[10px]">{npc.title}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}