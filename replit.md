# STARHAVEN: A Text Murder Mystery

## Overview

STARHAVEN is a terminal-inspired text-based murder mystery game set on a doomed space station. Players must interrogate suspects, collect evidence, and arrest the killer before time runs out and the station falls into the sun. The game features a retro-futuristic sci-fi interface with classic terminal aesthetics combined with modern React architecture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React with TypeScript**: Modern component-based UI using functional components and hooks
- **Vite**: Development server and build tool for fast hot module replacement
- **Wouter**: Lightweight routing library for client-side navigation
- **TanStack Query**: Server state management and caching layer

**UI Component System**
- **shadcn/ui**: Radix UI primitives with custom styling using Tailwind CSS
- **Design System**: Terminal-inspired sci-fi interface with monospace fonts (JetBrains Mono, Fira Code)
- **Color Palette**: Dark mode with amber terminal text, cyan accents, and retro-futuristic styling
- **Responsive Layout**: Mobile-first design with breakpoint at 768px

**State Management**
- React Query for server state (game state, mutations)
- Local React state for UI interactions (command history, input state)
- No global state management library needed due to simple data flow

### Backend Architecture

**Server Framework**
- **Express.js**: Lightweight HTTP server handling REST API endpoints
- **TypeScript**: Type-safe server implementation with ESM modules

**Game Engine**
- **In-memory game state**: Session-based storage using custom `MemStorage` class
- **Command processor**: Text-based command parser handling player actions (movement, inventory, investigation)
- **Time-based mechanics**: Countdown timer creating urgency and tension

**API Design**
- RESTful endpoints for game operations:
  - `POST /api/game/new` - Initialize new game
  - `GET /api/game/state` - Retrieve current game state
  - `POST /api/game/command` - Process player commands
- JSON request/response format with Zod schema validation

**Data Model**
- Shared TypeScript schemas between client and server (`@shared/schema.ts`)
- Core entities: GameState, Room, Item, NPC, OutputLine
- Strong typing prevents client-server data mismatches

### Build & Deployment

**Development**
- Vite dev server with Express middleware mode
- Hot module replacement for rapid development
- Replit-specific plugins for error overlay and dev banner

**Production Build**
- Vite bundles frontend to `dist/public`
- esbuild bundles server to `dist/index.js`
- Single Node.js process serves both static assets and API

**Path Aliases**
- `@/*` → `client/src/*` (frontend components)
- `@shared/*` → `shared/*` (shared schemas)
- `@assets/*` → `attached_assets/*` (game assets)

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Asynchronous state management and server caching
- **wouter**: Minimal routing solution (lighter alternative to React Router)
- **zod**: Runtime type validation for API contracts
- **drizzle-orm**: SQL query builder (configured for PostgreSQL via Neon)
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments

### UI Component Libraries
- **@radix-ui/react-***: Unstyled, accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **lucide-react**: Icon library for UI elements
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider functionality
- **vaul**: Drawer component library

### Styling & Design
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **clsx / tailwind-merge**: Conditional className utilities

### Development Tools
- **Drizzle Kit**: Database migration tool (configured but database not yet provisioned)
- **Replit Plugins**: Development tooling for Replit environment (@replit/vite-plugin-*)

### Database Strategy
- Drizzle ORM configured for PostgreSQL connection
- Schema defined in `shared/schema.ts`
- Currently using in-memory storage; database can be added for persistence
- Connection string expected via `DATABASE_URL` environment variable