# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in the BOLA Marathi repository.

## Overview

BOLA Marathi is a premium offline-first language learning application designed to help people learn conversational Marathi through experiential, branching RPG gameplay rather than rote memorization. The application is built as a Progressive Web App (PWA) using vanilla HTML/CSS/JavaScript with no build tools or node dependencies.

## Project Structure

The project has undergone architectural refactoring and now follows a clean architecture pattern:

```
Marathi-Translation-App/
├── index.html              # Main entry point
├ manifest.json            # PWA manifest
├── sw.js                  # Service worker for offline caching
├── content-fetcher.js     # Wiktionary scrape utility
├── api/                   # Serverless API functions
│   ├── ai.js              # Gemini AI handler
│   ├── correct.js         # Grammar correction
│   └── doubt.js           # AI doubt resolution
├── assets/                # Static assets (images, audio, illustrations)
├── data/                  # Learning data organized by category
│   ├── chapters/          # Lesson content
│   ├── conversations/     # Dialogue scripts
│   ├── dictionary/        # Vocabulary data
│   ├── lessons/           # Structured lessons
│   ├── missions/          # Real-life mission scenarios
│   └── culture/           # Cultural information
├── src/                   # Source code (clean architecture)
│   ├── core/              # Domain entities and business logic
│   │   └── engines/       # Core engines (AI, audio, game, progress, etc.)
│   ├── application/       # Application use cases
│   │   ├── ai/            # AI-related use cases
│   │   ├── learning/      # Learning-related use cases
│   │   └── state/         # Application state management
│   ├── infrastructure/    # External interfaces and utilities
│   └── presentation/      # UI components and views
└── css/                   # Stylesheets
    └── styles.css         # Design system and styling
```

## Development Commands

### Running the Application

For basic offline functionality:
```bash
# From the Marathi-Translation-App directory
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

For full functionality including AI features:
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Start development server with AI functions
vercel dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

This is a PWA that doesn't require a traditional build process. To deploy:
1. Copy the contents of `Marathi-Translation-App` to your web server
2. Ensure the service worker (`sw.js`) is properly registered
3. The app will work offline thanks to the caching strategy

## Key Technologies

- **Frontend**: HTML5, CSS3, vanilla JavaScript (ES6+)
- **PWA Features**: Service Workers (CacheStorage API), Manifest V3
- **Speech Processing**: Web Speech API (SpeechSynthesis, webkitSpeechRecognition), MediaRecorder API
- **Audio Visualization**: Web Audio API (AudioContext, AnalyserNode)
- **Data Persistence**: LocalStorage API (for user progress, streaks, settings)
- **AI Features**: Google Gemini API (gemini-1.5-flash) for pronunciation assessment, translation, and dictionary lookup
- **Video Content**: YouTube Player Embed API for lesson videos
- **Local Development**: Python http.server or Vercel CLI

## Architecture Overview

### Core Layers
1. **Presentation Layer**: UI components and views that handle DOM manipulation and user interactions
2. **Application Layer**: Use cases and application-specific business rules
3. **Core Layer**: Domain entities and business logic engines (AI, audio, game mechanics, progress tracking)
4. **Infrastructure Layer**: External interfaces (API clients, storage adapters, utility functions)

### Key Systems
- **Offline-First Architecture**: Service worker caches static assets and core data for offline use
- **AI Learning Loop**: Speech input → AI assessment → feedback → progress tracking
- **Progress Tracking**: XP system, streak counter, spaced repetition using SM-2 algorithm
- **Gamification**: RPG elements, mission-based learning, detective minigames
- **Responsive Design**: Glassmorphic UI with adaptive layouts for mobile/desktop

## Common Development Tasks

### Adding New Features
1. For new UI features: Add components in `src/presentation/`
2. For new business logic: Implement in appropriate engine in `src/core/engines/`
3. For new use cases: Add to `src/application/` directory
4. For external integrations: Place in `src/infrastructure/`
5. Update service worker cache list in `sw.js` if adding new static assets

### Working with Data
- Learning data is stored in the `data/` directory organized by category
- JSON format is used for all data files
- To add new lessons/conversations: Create appropriate JSON files in relevant subdirectories
- The application uses a unified data loading pattern through infrastructure layer services

### AI Integration
- AI features are implemented via the `/api/` directory (Vercel serverless functions)
- Core AI logic resides in `src/application/ai/` and `src/core/engines/aiEngine.js`
- API keys are handled through Vercel environment variables (not stored in repo)
- When testing locally with `vercel dev`, ensure environment variables are set in `.vercel/project.json` or similar

### Styling and UI
- All styling is in `css/styles.css` using CSS custom properties (variables)
- The design system includes:
  - Color palette: Marigold Saffron (#ff7b00), Crimson Accent (#ff4757), Royal Indigo Base (#6c5ce7)
  - Fonts: Poppins/Baloo 2 (headings), Noto Sans Marathi (body), Inter (numbers)
  - Glassmorphic effects, smooth animations, and responsive layouts
- To modify appearance: Edit CSS variables and styles in `css/styles.css`

## Important Notes

1. **Service Worker Updates**: When changing static assets, remember to update the cache name in `sw.js` to force cache busting during development.

2. **Data Files**: JSON files in the `data/` directory should be kept valid - use a JSON validator when editing.

3. **API Keys**: The Gemini API key is not stored in the repository. When using Vercel, set it as an environment variable in your project settings.

4. **Offline First**: The application is designed to work completely offline for core learning features. AI features require internet connectivity.

5. **PWA Features**: The app can be installed as a standalone application on supported browsers/devices via the web app manifest.

6. **Testing**: Manual testing in browser is recommended. Test both online and offline functionality to ensure PWA behavior is correct.

7. **Performance**: Keep bundle size small by avoiding large dependencies. Optimize images and audio files in the assets directory.

## Troubleshooting

- **Service Worker Issues**: Unregister service workers in devtools Application tab if caching causes issues during development
- **Audio Permissions**: Ensure microphone permissions are granted for speech features to work
- **API Quotas**: Gemini API has rate limits - use judiciously during development
- **Storage Limits**: LocalStorage has size limits (~5MB per domain) - monitor usage when storing user data

## Directory-Specific Guidelines

### `/src/core/engines/`
Contains the core business logic engines:
- `aiEngine.js`: Handles AI interactions
- `audioEngine.js`: Manages TTS, speech recognition, audio recording
- `gameEngine.js`: Controls RPG map progression and unlocks
- `progressEngine.js`: Handles XP, levels, and player progression
- `revisionEngine.js`: Implements SM-2 spaced repetition algorithm
- `missionEngine.js`: Manages real-life mission logic
- `storyEngine.js`: Handles branching dialogue and conversations
- `cultureEngine.js`: Manages cultural information logs
- `dictionaryEngine.js`: Handles dictionary lookups and vocabulary
- `detectiveManager.js`: Powers the "Find the Impostor" and "Arrange Words" minigames

### `/src/application/`
Contains application use cases:
- `/ai/`: AI-related operations (assessment, translation, dictionary lookup)
- `/learning/`: Learning flow management (lessons, practice, revision)
- `/state/`: Application state management (app state, routing)

### `/src/infrastructure/`
External interfaces and utilities:
- API clients
- Storage adapters
- Utility functions
- Cache management

### `/src/presentation/`
UI components and views:
- View components for different application screens
- UI state management
- DOM manipulation and event handling