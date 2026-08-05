# BOLA Marathi Journey Data Engine

This directory contains all the data-driven content for the BOLA Marathi Journey Mode RPG language learning game. Everything is stored in JSON files to allow for easy expansion, localization, and modification without touching the game code.

## Directory Structure

```
data/
├── cities.json              # Master cities data with districts
├── districts.json           # Detailed district information and locations
├── locations.json           # Specific locations within districts
├── npcs.json                # 40+ Non-Player Characters with profiles
├── quests/                  # Quest definitions (100+ quests)
│   └── [quest_id].json
├── dialogues/               # Dialogue scripts with branching choices
│   └── [dialogue_id].json
├── vocabulary.json          # 1500+ words organized by category
├── culture.json             # Cultural facts, festivals, food, landmarks, etiquette
├── assets/
│   └── prompts/             # Image generation prompts for all visual assets
│       ├── npcs/            # NPC portrait prompts
│       ├── locations/       # Location illustration prompts
│       ├── cities/          # Cityscape and district banner prompts
│       ├── items/           # Item and collectible icon prompts
│       └── ui/              # User interface element prompts
└── JourneyDataEngine.js     # Data access layer and helper functions
```

## Data Philosophy

- **Everything is data-driven**: No hardcoded cities, NPCs, quests, or dialogues in JavaScript
- **Extensible**: Easy to add new content by adding JSON files
- **Localized**: All text includes Marathi, transliteration, and English
- **Culturally authentic**: Content developed with attention to Marathi/Maharashtrian culture
- **Educational**: Vocabulary and dialogues designed for progressive language learning

## File Formats

### Cities Data (`cities.json`)
Contains master list of cities with:
- Basic info (name, description, coordinates)
- Unlock requirements (XP, story progress)
- Theme colors
- District references

### Districts Data (`districts.json`)
Each district includes:
- Name, description, theme
- Unlock requirements
- Background/ambiant assets
- Location and NPC references
- Time-of-day modifiers

### Locations Data (`locations.json`)
Each location features:
- Title, description, difficulty
- XP/coin rewards
- Associated NPCs, quests, discoveries
- Required vocabulary for completion
- Image references

### NPCs Data (`npcs.json`)
Each NPC contains:
- Personal info (name, age, profession, personality)
- Visual assets (avatars, portraits)
- Language skills and voice
- Location associations
- Available quests
- Rewards for interaction
- Dialogue file reference

### Quests Data (`quests.json`)
Quests include:
- Title and description (trilingual)
- Location and NPC associations
- Required vocabulary
- Difficulty level
- XP/coin/item rewards
- Dialogue file for quest interactions
- Prerequisites and chaining

### Dialogues Data (`dialogues/`)
Each dialogue file contains:
- Structured conversation with multiple parts
- Speaker identification (NPC/player)
- Trilingual text (Marathi/Transliteration/English)
- Pronunciation tips and grammar notes
- Branching options based on player choices
- Cultural notes
- XP rewards
- Completion conditions

### Vocabulary Data (`vocabulary.json`)
Words organized by categories (greetings, food, transport, etc.) with:
- Marathi script
- Roman transliteration
- English translation
- Pronunciation guide
- Part of speech
- Usage examples
- Difficulty rating

### Culture Data (`culture.json`)
Cultural information including:
- Facts about Marathi language, history, traditions
- Festival descriptions and dates
- Traditional food items with ingredients
- Important landmarks and historical sites
- Etiquette tips for social situations

### Assets/Prompts
Text prompts for generating all visual assets:
- NPC portraits (with specific poses/expressions)
- Location illustrations
- Cityscape and district banners
- Item and collectible icons
- UI elements and icons

## Usage

The `JourneyDataEngine.js` file provides methods to access and query this data:

```javascript
// Initialize the data engine
const dataEngine = new JourneyDataEngine();

// Get city information
const pune = await dataEngine.getCity('pune');

// Get available quests for a player
const availableQuests = await dataEngine.getAvailableQuests({
  completedQuests: ['intro_quest'],
  xp: 1500,
  currentCity: 'pune',
  currentDistrict: 'pune-fc-road'
});

// Get vocabulary for a lesson
const foodVocab = await dataEngine.getVocabularyByCategory('food_drink');

// Get cultural facts for display
const festivals = await dataEngine.getCulture('festivals');
```

## Expansion Guidelines

To add new content:

1. **New City**: Add to `cities.json`, then create districts in `districts.json`
2. **New District**: Add to `districts.json` with locations and NPC references
3. **New Location**: Add to `locations.json` with associated NPCs and quests
4. **New NPC**: Add to `npcs.json` with dialogue file reference
5. **New Quest**: Add to `quests.json` with associated dialogue file
6. **New Dialogue**: Create new JSON file in `dialogues/` directory
7. **New Vocabulary**: Add to appropriate category in `vocabulary.json`
8. **New Cultural Info**: Add to relevant section in `culture.json`
9. **New Asset Prompts**: Add to appropriate subfolder in `assets/prompts/`

All new content should follow the existing JSON structures and include trilingual text where applicable.

## Language Learning progression

- Beginner: Basic greetings, numbers, food, simple directions
- Intermediate: Conversations, present/past tense, cultural topics
- Advanced: Complex grammar, idioms, literature, formal situations

## Cultural Authenticity Notes

- All Marathi text reviewed with native speakers where possible
- Cultural information verified with reliable sources
- Regional variations noted (Pune vs Mumbai vs Vidarbha vs Konkan)
- Traditional and contemporary usage both represented
- Religious content presented respectfully and educationally

---
*Data version: 1.0.0*
*Last updated: 2024-01-15*
*Total cities: 5*
*Total districts: 25+*
*Total locations: 100+*
*Total NPCs: 40+*
*Total quests: 100+*
*Total vocabulary words: 1,500+*
*Total culture facts: 200+*