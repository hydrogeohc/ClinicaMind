# ClinicaMind - Exploring Hybrid UX for Conversational AI

A comprehensive medical clinic management platform combining AI-powered conversation analysis with a modern web interface for clinical workflows.

## Architecture

This is a monorepo containing both frontend and backend components:

- **`fe/`** - React TypeScript frontend with shadcn/ui components
- **`be/`** - Python backend with AI agents for speech processing and medical analysis

## Features

### Frontend (React + TypeScript)
- **Real-time Medical Conversation Analysis** - Dynamic UI components that appear synchronized with actual doctor-patient conversations
- **Dual Audio Support** - Two complete medical encounters (initial visit + 30-day follow-up)
- **Comprehensive Medical Components** - Physical examinations, assessments, treatment plans, EMG tests, lab results
- **Professional Animations** - Framer Motion for smooth, polished interactions
- **Modern UI Stack** - shadcn/ui components with Tailwind CSS and dark mode support

### Backend (Python)
- **Speech Recognition** - Google Cloud Speech-to-Text integration
- **Text-to-Speech** - Google Cloud TTS for audio generation
- **Pain Assessment AI** - Machine learning models for pain classification and regression analysis
- **Security & Ethics Validation** - Automated checks for clinical data handling
- **Audio Processing** - Real medical conversation analysis with timing synchronization

## Getting Started

### Frontend Development

```bash
cd fe
pnpm install
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run code quality checks
pnpm format       # Format code with Prettier
```

### Backend Development

```bash
cd be
pip install -r requirements.txt
python pain_orchestrator.py    # Run main orchestrator
python run_agent_pipeline.py   # Run AI pipeline
```

## Demo Experience

The application showcases a realistic medical conversation analysis system:

1. **Patient Case**: David S with left upper arm pain
2. **Dual Conversations**: Initial visit and 30-day follow-up
3. **Audio Playback**: Press spacebar to start/stop actual medical conversations
4. **Dynamic UI**: Components appear in real-time as topics are discussed
5. **Conversation Switching**: Toggle between visits using header buttons

### Key Components
- **Physical Examination** - Range of motion, neurological findings
- **Assessment** - Chief complaint, pain characteristics, clinical findings
- **Treatment Plan** - Medications, follow-up instructions
- **EMG Testing** - Procedures, patient concerns, expected findings
- **Lab Results** - Color-coded results with clinical interpretation

## Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** with SWC for fast compilation
- **shadcn/ui** comprehensive component library
- **Tailwind CSS** for styling with custom medical theme
- **Framer Motion** for professional animations
- **React Query** for server state management
- **React Hook Form + Zod** for form validation

### Backend
- **Google Cloud Speech API** for speech recognition
- **Google Cloud TTS** for text-to-speech
- **NumPy** for numerical computations
- **scikit-learn** (joblib models) for pain assessment ML
- **Pydub** for audio processing

## Project Structure

```
ClinicMinds/
├── fe/                          # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   └── medical/         # Medical-specific components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript definitions
│   │   └── App.tsx              # Main demo component
│   ├── public/                  # Static assets including audio files
│   ├── package.json
│   └── CLAUDE.md                # Detailed development guide
└── be/                          # Backend services
    ├── pain_orchestrator.py     # Main orchestration logic
    ├── asr_agent.py             # Speech recognition
    ├── tts_agent.py             # Text-to-speech
    ├── pain_assessment_agent.py # ML pain analysis
    ├── security_ethics_agent.py # Data validation
    ├── *.joblib                 # Trained ML models
    ├── *.m4a                    # Audio conversation files
    └── requirements.txt         # Python dependencies
```

## Key Features

- **Real Medical Conversations** - Actual doctor-patient audio with synchronized UI
- **AI-Powered Analysis** - Machine learning for pain assessment and classification
- **Professional Interface** - Modern, accessible design following medical UI patterns
- **Type Safety** - Comprehensive TypeScript coverage with strict configuration
- **Animation System** - Smooth, contextual animations that enhance UX
- **Responsive Design** - Fixed viewport with independent scroll areas
- **Audio Integration** - HTML5 Audio API with playback controls

## Development Guidelines

- **Frontend**: Uses pnpm for package management, strict TypeScript, and shadcn/ui patterns
- **Backend**: Python with Google Cloud APIs and scikit-learn for ML capabilities  
- **Code Style**: ESLint + Prettier for frontend, Python best practices for backend
- **Architecture**: Component-driven frontend with modular Python backend services

---

For detailed frontend development information, see [`fe/CLAUDE.md`](fe/CLAUDE.md).
