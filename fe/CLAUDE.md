# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Vite and HMR
- `pnpm build` - Build for production (runs TypeScript check and Vite build)
- `pnpm lint` - Run ESLint for code quality checks
- `pnpm format` - Format code with Prettier
- `pnpm preview` - Preview production build locally

Note: This project uses pnpm as the package manager.

## Architecture Overview

This is a React TypeScript application built with Vite for a medical clinic management system called "ClinicaMind". The current implementation shows a patient overview demo interface.

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Comprehensive shadcn/ui component library based on Radix UI primitives
- **Routing**: React Router v6 (basic setup in main.tsx)
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Theming**: next-themes for dark mode support

### Project Structure

```
src/
├── components/ui/          # Complete shadcn/ui component library
├── hooks/                  # Custom React hooks
├── lib/utils.ts           # Utility functions (cn helper for class merging)
├── App.tsx                # Main demo component showing patient interface
├── main.tsx               # App entry point with router setup
└── index.css              # Global styles and CSS variables
```

### Key Architecture Details

- **Path Aliases**: Uses `~/*` alias pointing to `src/*` (configured in vite.config.ts and tsconfig.json)
- **Component Structure**: Main app is currently a demo showing a medical patient interface with:
  - Two-column layout (patient info + clinical notes)
  - Tabbed interface for patient data (Overview, Labs, Imaging)
  - Keyboard interaction (spacebar triggers demo flow)
- **Design System**: Custom Tailwind theme with medical-specific colors:
  - Custom "padel-*" color variants (padel-green, padel-orange, padel-blue)
  - CSS custom properties for theming
  - Comprehensive sidebar color system

### TypeScript Configuration

The project uses a strict TypeScript setup with comprehensive type checking:
- `strict: true` - Enables all strict type checking options
- `noImplicitAny: true` - Error on expressions with implied 'any' type
- `strictNullChecks: true` - Enable strict null checks
- `strictFunctionTypes: true` - Enable strict checking of function types
- `noImplicitReturns: true` - Error when not all code paths return a value
- `noFallthroughCasesInSwitch: true` - Error on fallthrough cases in switch statements
- `noUncheckedIndexedAccess: true` - Add undefined to index signature results
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused parameters
- `exactOptionalPropertyTypes: true` - Interpret optional property types as written

### Styling Guidelines

- Uses Tailwind CSS with a comprehensive design system
- Components follow shadcn/ui patterns with class-variance-authority
- Theme uses CSS custom properties for consistent theming
- Dark mode support through next-themes

### Dynamic Component System

The application features a sophisticated dynamic UI system for real-time medical conversation analysis:

- **Component Types**: Union type system supporting multiple medical UI components:
  - `full-body`: Full body examination components with findings and recommendations
  - `right-hand`: Focused examination components (extendable to other body parts)
  - `recent-lab-result`: Laboratory results with status indicators and interpretation
  - `generic-info`: Fallback component for plain text information with type variants
  
- **Demo Orchestration**: `useConversationDemo` hook manages timed component sequences:
  - Configurable delays between components (mimicking conversation timing)
  - Audio playback integration (prepared for future audio files)
  - Component lifecycle management (start/stop/reset)
  - Progress tracking and callback system

- **Component Rendering**: `DynamicComponentRenderer` maps component types to actual React components with proper TypeScript safety

### Current State

The application demonstrates a complete medical conversation simulation system. The right scrollable area dynamically renders components based on timed sequences, simulating real-time conversation analysis. Users can press spacebar to start/stop/reset the demo sequence. The system is architected to easily integrate with actual conversation AI and audio processing in the future.