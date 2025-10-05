import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const commandGroups = [
    {
      title: "Navigation",
      commands: [
        { cmd: "look", desc: "Examine current room" },
        { cmd: "map", desc: "Show station layout" },
        { cmd: "go n/s/e/w", desc: "Move in direction" },
      ]
    },
    {
      title: "Inventory",
      commands: [
        { cmd: "inv", desc: "View inventory" },
        { cmd: "take [item]", desc: "Pick up an item" },
        { cmd: "drop [item]", desc: "Drop an item" },
      ]
    },
    {
      title: "Investigation",
      commands: [
        { cmd: "inspect [item/person]", desc: "Examine closely" },
        { cmd: "talk [name]", desc: "Interrogate suspect" },
        { cmd: "accuse [name]", desc: "Present your case" },
      ]
    },
    {
      title: "Critical Actions",
      commands: [
        { cmd: "arrest [name]", desc: "Arrest suspect (needs cuffs)" },
        { cmd: "use console", desc: "Access Command Deck console" },
        { cmd: "time", desc: "Check remaining time" },
      ]
    }
  ];

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-0 h-auto hover:bg-transparent"
              data-testid="button-toggle-help"
            >
              <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                COMMANDS
              </CardTitle>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {commandGroups.map((group, index) => (
              <div key={index} className="space-y-2">
                <div className="text-xs font-semibold text-accent-foreground">
                  {group.title}:
                </div>
                <div className="space-y-1">
                  {group.commands.map((command, cmdIndex) => (
                    <div 
                      key={cmdIndex} 
                      className="text-xs font-mono"
                      data-testid={`help-command-${command.cmd.replace(/\s+/g, '-')}`}
                    >
                      <span className="text-accent-foreground font-semibold">
                        {command.cmd}
                      </span>
                      <span className="text-muted-foreground"> — {command.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-2 border-t border-border text-xs text-muted-foreground italic">
              Examples: "talk Mira", "inspect cufflink", "go n"
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}