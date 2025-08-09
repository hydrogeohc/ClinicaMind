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
- **Animations**: Framer Motion for smooth component transitions and interactions
- **Routing**: React Router v6 (basic setup in main.tsx)
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Theming**: next-themes for dark mode support
- **Audio Playback**: HTML5 Audio API for conversation playback (.m4a files)

### Project Structure

```
src/
├── components/
│   ├── ui/                 # Complete shadcn/ui component library
│   ├── medical/            # Medical-specific components
│   │   ├── PhysicalExaminationComponent.tsx
│   │   ├── AssessmentComponent.tsx
│   │   ├── TreatmentPlanComponent.tsx
│   │   ├── PainAssessmentComponent.tsx
│   │   ├── EMGTestComponent.tsx
│   │   ├── FollowUpAssessmentComponent.tsx
│   │   ├── MedicationInteractionComponent.tsx
│   │   ├── RecentLabResultsComponent.tsx
│   │   ├── GenericInfoComponent.tsx
│   │   └── index.ts
│   └── DynamicComponentRenderer.tsx  # Maps component types to React components
├── hooks/
│   ├── useConversationDemo.ts       # Demo orchestration and timing logic
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── types/components.ts              # TypeScript definitions for all components
├── lib/utils.ts                     # Utility functions (cn helper for class merging)
├── App.tsx                          # Main demo component with dual conversation support
├── main.tsx                         # App entry point with router setup
└── index.css                        # Global styles and CSS variables
```

### Key Architecture Details

- **Path Aliases**: Uses `~/*` alias pointing to `src/*` (configured in vite.config.ts and tsconfig.json)
- **Component Structure**: Two-column medical interface with conversation switching:
  - Left column: Static patient information with tabbed interface (Overview, Labs, Imaging)
  - Right column: Dynamic scrollable conversation analysis with independent scroll area
  - Header: Conversation switcher buttons ("First Visit" / "Follow-up (30d)")
  - Keyboard interaction: spacebar controls demo playback (start/stop/reset)
- **Layout System**: Fixed viewport with proper scroll containment
  - `h-screen overflow-hidden` prevents page-level scrolling
  - Each column manages its own scrolling independently
  - Right column uses `ScrollArea` with calculated height `h-[calc(100vh-73px)]`
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

The application features a sophisticated dynamic UI system for real-time medical conversation analysis with actual audio conversations:

#### **Component Types**
Union type system supporting comprehensive medical UI components:
- **`physical-examination`**: Range of motion, neurological findings, strength testing
- **`assessment`**: Chief complaint, pain characteristics, onset details, clinical findings
- **`treatment-plan`**: Prescribed medications, follow-up instructions, next steps
- **`pain-assessment`**: Static SVG diagrams with conversation-specific pain location mapping
- **`emg-test`**: EMG/NCV testing procedures, steps, patient concerns, expected findings
- **`follow-up-assessment`**: 30-day follow-up status, treatment effectiveness, clinical decisions
- **`medication-interaction`**: Drug interaction safety checks for medical procedures
- **`recent-lab-result`**: Laboratory results with color-coded status indicators and interpretation
- **`generic-info`**: Flexible fallback component with support for info/warning/success/error types

#### **Real Conversation Integration**
- **Dual Audio Support**: Two actual medical conversations (`first visit.m4a`, `second visit.m4a`)
- **Conversation-Based Data**: All components reflect actual patient encounters (David S)
- **Realistic Timing**: Components appear when topics are mentioned in real conversations
- **Conversation Switching**: Header buttons to switch between initial visit and 30-day follow-up

#### **Demo Orchestration**
`useConversationDemo` hook manages sophisticated timing sequences:
- **Audio Synchronization**: HTML5 Audio API plays actual medical conversations
- **Timing-Based Components**: Generic info messages appear when topics are discussed
- **Summary Components**: Specialized components appear at the end as comprehensive summaries
- **Component Flow**: 
  - Real-time: 8-12 generic info messages following conversation timing
  - Summary: 4 specialized components providing comprehensive overviews
- **Lifecycle Management**: start/stop/reset with proper cleanup and state management
- **Progress Tracking**: Visual feedback and callback system for demo completion

#### **Animation System**
Framer Motion integration for professional UI animations:
- **Card Animations**: Smooth entry with fade, slide, and scale effects
- **Layout Animations**: Automatic repositioning when new components appear
- **Staggered Timing**: 50ms delays between cards for natural sequencing
- **Interactive Effects**: Hover animations with subtle lift effects
- **Component Order**: Newest components appear on top, pushing older ones down
- **Spring Physics**: Natural, bouncy transitions with custom easing curves

#### **Component Rendering**
`DynamicComponentRenderer` with animation integration:
- **Type-Safe Mapping**: Maps component types to React components with full TypeScript safety
- **Reverse Ordering**: `.slice().reverse()` shows newest components first
- **Motion Wrapping**: Each component wrapped in `motion.div` for smooth transitions
- **Error Handling**: Graceful fallback for unknown component types

### Current State

The application demonstrates a complete medical conversation analysis system using real patient conversations:

#### **Patient Case: David S**
- **Initial Visit**: Left upper arm pain following a fall, comprehensive evaluation
- **Follow-up Visit (30 days)**: Treatment failure, EMG testing ordered
- **Real Audio**: Actual doctor-patient conversations with synchronized UI components

#### **User Experience**
- **Conversation Selection**: Switch between first visit and 30-day follow-up using header buttons
- **Audio Playback**: Press spacebar to start/stop/reset conversation demos with actual audio
- **Real-time UI**: Components appear synchronized with conversation topics as they're discussed
- **Professional Animations**: Smooth, polished interface with framer-motion transitions
- **Independent Scrolling**: Each column manages its own scroll area for optimal UX

#### **Technical Implementation**
- **Conversation Flow**: 12-16 timed components per conversation matching actual audio timing
- **Component Hierarchy**: Generic messages during conversation + specialized summaries at the end
- **Data Accuracy**: All component data reflects actual conversation content and medical findings
- **Responsive Layout**: Fixed viewport with proper scroll containment and responsive design

#### **Demo Features**
- **Start Demo**: Spacebar starts audio playback and begins showing timed components
- **Stop Demo**: Spacebar stops audio and component sequence
- **Reset Demo**: Spacebar (when completed) resets to empty state
- **Conversation Switch**: Header buttons switch between conversations and reset current demo
- **Visual Feedback**: Loading states, progress tracking, and smooth state transitions

The system showcases how AI-powered medical conversation analysis could work in real clinical settings, with actual audio conversations driving dynamic, contextual UI components that appear as topics are discussed.