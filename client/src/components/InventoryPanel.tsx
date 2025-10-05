import type { Item } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface InventoryPanelProps {
  inventory: string[];
  items: Record<string, Item>;
  compact?: boolean;
}

export function InventoryPanel({ inventory, items, compact }: InventoryPanelProps) {
  const EVIDENCE_ITEMS = [
    'weapon_garrote', 'forged_card', 'overwritten_log', 'cufflink',
    'stimulant', 'thruster_invoice', 'manifest', 'dna_fiber', 
    'smeared_print', 'maintenance_key'
  ];

  return (
    <Card className={compact ? 'p-2' : ''}>
      {!compact && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
            <Package className="w-4 h-4" />
            INVENTORY
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? 'p-0' : 'pt-0'}>
        {inventory.length === 0 ? (
          <div className={`text-muted-foreground italic ${compact ? 'text-xs' : 'text-sm'}`}>
            Empty
          </div>
        ) : (
          <div className="space-y-2">
            {inventory.map((itemId) => {
              const item = items[itemId];
              if (!item) return null;
              
              const isEvidence = EVIDENCE_ITEMS.includes(itemId);
              const isCuffs = itemId === 'cuffs';
              
              return (
                <div 
                  key={itemId}
                  className={`font-mono ${compact ? 'text-xs' : 'text-sm'} group`}
                  data-testid={`inventory-item-${itemId}`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`
                      ${isCuffs ? 'text-chart-3 font-semibold' : ''}
                      ${isEvidence && !isCuffs ? 'text-destructive' : ''}
                      ${!isEvidence && !isCuffs ? 'text-foreground' : ''}
                    `}>
                      • {item.name}
                    </span>
                    {isEvidence && !isCuffs && (
                      <Badge variant="destructive" className="text-[10px] py-0 px-1 h-4">
                        EVIDENCE
                      </Badge>
                    )}
                    {isCuffs && (
                      <Badge className="text-[10px] py-0 px-1 h-4 bg-chart-3 text-chart-3-foreground">
                        REQUIRED
                      </Badge>
                    )}
                  </div>
                  {!compact && (
                    <div className="text-xs text-muted-foreground mt-1 pl-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}