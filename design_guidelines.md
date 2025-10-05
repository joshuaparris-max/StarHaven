# STARHAVEN: Design Guidelines

## Design Approach
**Terminal-Inspired Sci-Fi Interface** - Drawing inspiration from classic terminal interfaces and modern sci-fi games like Cyberpunk 2077's UI, Alien: Isolation's computer terminals, and retro-futuristic command systems. The design balances nostalgic monospace aesthetics with modern UX polish.

## Core Design Principles
- **Retro-Futuristic Terminal**: Authentic command-line feel with modern usability
- **Atmospheric Immersion**: Dark, space-station ambiance with subtle sci-fi elements
- **Information Clarity**: Dense text content must remain highly readable
- **Urgency & Tension**: Visual reinforcement of time-pressure gameplay

## Color Palette

### Dark Mode (Primary)
- **Background**: 222 15% 8% (deep space black with slight warmth)
- **Surface/Panel**: 220 15% 12% (elevated terminal panels)
- **Border/Divider**: 220 20% 20% (subtle panel separation)

### Brand/Accent Colors
- **Primary (Amber Terminal)**: 38 92% 58% (classic terminal amber for text output)
- **Secondary (Cyan Highlight)**: 185 84% 52% (sci-fi cyan for interactive elements, commands)
- **Success**: 142 76% 45% (muted green for confirmations)
- **Danger**: 0 84% 60% (red for warnings, time alerts)
- **Warning**: 38 92% 58% (amber for evidence hints)

### Text Colors
- **Primary Text**: 38 75% 75% (warm amber for main terminal output)
- **Secondary Text**: 38 40% 55% (dimmed amber for descriptions)
- **Command Input**: 185 84% 75% (bright cyan for player commands)
- **System Messages**: 185 60% 65% (cyan for game feedback)
- **NPC Dialogue**: 45 85% 65% (gold for character speech)

## Typography

### Font Families
- **Primary (Terminal)**: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace
- **UI Labels**: 'Inter', system-ui, sans-serif (for non-terminal UI elements)

### Type Scale
- **Terminal Output**: text-sm to text-base (14-16px) - optimal reading for extended gameplay
- **Command Input**: text-base (16px) - clear input visibility
- **Headers/Room Names**: text-lg to text-xl font-bold (18-20px)
- **UI Labels**: text-xs to text-sm (12-14px)
- **Time Display**: text-2xl font-mono font-bold (critical countdown)

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 3, 4, 6, 8** (primary set for consistent rhythm)
- Component padding: p-4, p-6
- Section gaps: gap-4, gap-6
- Margin/spacing: m-2, m-4, mb-8

### Grid Structure
**Three-Panel Layout** (desktop):
- **Left Panel (25%)**: Map, inventory, quick stats - sticky sidebar
- **Center Panel (50%)**: Main terminal output - scrollable game log
- **Right Panel (25%)**: Command input, help, NPC list - sticky sidebar

**Responsive Stacking** (mobile):
- Single column with tabbed navigation
- Terminal output prioritized, collapsible sidebars

## Component Library

### Core UI Elements

**Terminal Output Panel**
- Full-height scrollable container with custom scrollbar
- Monospace text with line-height of 1.6 for readability
- Slight CRT scanline effect overlay (subtle, optional toggle)
- Auto-scroll to latest output with smooth animation
- Text shadow for slight glow effect (mimicking old CRT)

**Command Input**
- Fixed bottom bar with cyan border-t-2
- Large monospace input field with cyan text
- Command history navigation (up/down arrows)
- Auto-suggest dropdown for valid commands
- Blinking cursor animation

**Map Display**
- ASCII-style grid map with labeled rooms
- Current location highlighted with pulsing cyan bracket [X]
- Visited rooms in brighter amber, unvisited dimmed
- Directional indicators (N/E/S/W) for available exits
- Compact 5x3 grid representation

**Inventory Panel**
- List of carried items with monospace formatting
- Evidence items highlighted with warning color
- Item count indicator
- Click to inspect items
- Restraint Cuffs emphasized when present

**Time Countdown**
- Large, prominent display at top
- Color transitions: cyan → amber (30min) → red (10min)
- Pulsing animation when critical (< 10 minutes)
- Format: "TIME REMAINING: XX MINUTES"

**NPC List**
- Names with titles in dimmed text
- Current room location
- Arrested status indicator (if applicable)
- Click to quick-talk command

**Help Panel**
- Collapsible command reference
- Grouped by category (Movement, Actions, Investigation)
- Cyan colored command keywords
- Brief descriptions in amber

### Interactive Elements

**Buttons** (minimal use)
- Outlined style with cyan border
- Hover: background fill with 10% cyan opacity
- Monospace text
- Used only for: New Game, Save, Load, Settings

**Links/Clickable Text**
- Cyan colored, underline on hover
- Used for: item names, NPC names, room names
- Click to auto-populate command input

**Modal Dialogs**
- Dark panel with cyan border glow
- Used for: game over, arrest confirmation, save/load
- Backdrop blur effect
- Terminal-style title bars

## Atmospheric Effects

### Subtle Enhancements
- **Scanline Overlay**: 1px repeating horizontal lines at 5% opacity (optional)
- **Glow Effects**: Subtle text-shadow on cyan/amber text (1px blur)
- **Panel Borders**: 1px solid with slight glow using box-shadow
- **Noise Texture**: Very subtle film grain on background (2-3% opacity)

### Animations
- **Typing Effect**: New text output appears with brief delay (optional performance mode)
- **Cursor Blink**: Standard terminal cursor animation at input
- **Pulse**: Time countdown when critical
- **Fade In**: New panel content appears smoothly
- **NO flashy animations** - maintain focus on text content

## Accessibility

- Maintain WCAG AA contrast ratios (amber/cyan on dark backgrounds)
- Keyboard navigation for all commands
- Screen reader friendly output log
- High-contrast mode toggle (removes glow effects, increases contrast)
- Font size controls (small/medium/large)
- Reduced motion mode (disables typing effects and animations)

## Game-Specific Design

### Room Display
- Room name in large bold amber
- Description in regular amber with proper line wrapping
- Items, NPCs, Exits listed with clear labels and cyan highlights

### Dialogue & Responses
- Player commands echoed in bright cyan with "> " prefix
- System responses in standard amber
- NPC speech in gold with name prefix
- Evidence discoveries highlighted with warning color

### Status Indicators
- Current room in map view
- Inventory count (X/10 capacity - if limited)
- Suspect arrest status
- Game state indicators (can arrest, has cuffs, etc.)

## Layout Specifications

**Desktop (1024px+)**
- Three-column grid with 25/50/25 split
- Terminal output scrolls independently
- Sidebars sticky positioned

**Tablet (768-1023px)**
- Two-column: terminal + collapsible sidebar
- Tabs for switching between map/inventory/help

**Mobile (<768px)**
- Single column stacked layout
- Bottom-fixed command input
- Collapsible drawer navigation for map/inventory
- Terminal output takes full width

## Polish & Details

- Custom scrollbar styling (thin, cyan thumb on dark track)
- Focus states with cyan outline glow
- Error messages in red with terminal-style formatting
- Loading states with retro "PROCESSING..." animation
- Save/Load with terminal-style file browser aesthetic
- Version/credit info in bottom corner in dimmed text

This design creates an immersive, atmospheric detective game that balances nostalgia with modern polish, ensuring players can focus on solving the mystery while feeling truly aboard a doomed space station.