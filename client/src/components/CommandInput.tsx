import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface CommandInputProps {
  onCommand: (command: string) => void;
  disabled: boolean;
  commandHistory: string[];
  historyIndex: number;
  onHistoryIndexChange: (index: number) => void;
}

const COMMON_COMMANDS = [
  'help', 'look', 'map', 'time', 'inv', 'inventory',
  'go n', 'go s', 'go e', 'go w',
  'take', 'drop', 'inspect', 'talk', 'accuse', 'arrest',
  'use console'
];

export function CommandInput({ 
  onCommand, 
  disabled, 
  commandHistory,
  historyIndex,
  onHistoryIndexChange
}: CommandInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.trim()) {
      const matches = COMMON_COMMANDS.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onCommand(input.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setSelectedSuggestion(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 
          ? historyIndex + 1 
          : commandHistory.length - 1;
        onHistoryIndexChange(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setSelectedSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (historyIndex > -1) {
        const newIndex = historyIndex - 1;
        onHistoryIndexChange(newIndex);
        if (newIndex >= 0) {
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        } else {
          setInput('');
        }
      }
    } else if (e.key === 'Tab' && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[selectedSuggestion]);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t-2 border-accent bg-card p-4 flex-shrink-0 relative">
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-1 bg-popover border border-popover-border rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => selectSuggestion(suggestion)}
              className={`w-full text-left px-3 py-2 font-mono text-sm hover-elevate ${
                index === selectedSuggestion 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-popover-foreground'
              }`}
              data-testid={`suggestion-${suggestion.replace(/\s+/g, '-')}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-foreground font-mono font-bold pointer-events-none">
            &gt;
          </div>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Processing...' : 'Enter command... (try "help")'}
            className="pl-8 font-mono text-accent-foreground bg-background border-border focus:border-accent focus:ring-accent"
            autoFocus
            autoComplete="off"
            data-testid="input-command"
          />
          {!disabled && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-accent-foreground animate-pulse"></div>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={disabled || !input.trim()}
          size="icon"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          data-testid="button-submit-command"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
      
      <div className="mt-2 text-xs text-muted-foreground font-mono">
        Tip: Use ↑/↓ for history, Tab for autocomplete, ESC to dismiss
      </div>
    </div>
  );
}