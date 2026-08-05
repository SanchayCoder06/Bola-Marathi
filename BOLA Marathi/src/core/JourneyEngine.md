# Journey Engine Documentation

## Architecture

The Journey Engine is a singleton class that manages all game state, data loading, and progression systems for the BOLA Marathi RPG language learning game. It follows a modular, data-driven design where all game content (cities, districts, locations, NPCs, quests, etc.) is loaded from JSON files.

### Key Principles

1. **Data-Driven**: No hardcoded game content. Everything is loaded from JSON files in the `data` directory.
2. **Lazy Loading**: City-specific data (districts, locations, NPCs, quests) is loaded only when needed to minimize memory usage.
3. **Event-Driven**: Uses a publish-subscribe pattern for loose coupling between systems.
4. **Persistent State**: Player progress is automatically saved to and loaded from `localStorage`.
5. **Safe Defaults**: Gracefully handles missing or malformed data without crashing.

## Folder Structure

The engine expects the following data folder structure (relative to the web root):

```
data/
├── cities.json                  # Master list of cities with basic info and unlock requirements
├── cities/
│   ├── pune.json               # Data for Pune city (districts, locations, NPCs, quests)
│   ├── mumbai.json             # Data for Mumbai city
│   └── ...                     # One file per city
└── ...                         # Other data files (vocabulary, culture, etc.) used by other systems
```

Each city JSON file should contain:
```json
{
  "districts": [ /* Array of district objects */ ],
  "locations": [ /* Array of location objects */ ],
  "npcs": [ /* Array of NPC objects */ ],
  "quests": [ /* Array of quest objects */ ]
}
```

## Data Flow

1. **Initialization**: 
   - Engine loads `cities.json` to know all available cities and their unlock requirements
   - Player progress is loaded from `localStorage`

2. **On-Demand Loading**:
   - When requesting data for a specific city (e.g., `getDistrict('pune', 'pune-shaniwar-wada')`), the engine loads `data/cities/pune.json` if not already cached
   - Only the requested city's data is loaded into memory

3. **Caching**:
   - Loaded city data is cached in a Map for the duration of the session
   - Cache can be cleared by creating a new engine instance (though the engine is a singleton)

4. **Updates**:
   - When player progress changes (quest completion, location discovery, etc.), the engine saves to `localStorage`
   - Events are emitted to notify other systems of changes

## Adding New Cities

To add a new city without changing any code:

1. Add the city to `data/cities.json` with:
   - Unique `id`
   - `name`, `description`, `coordinates`
   - `unlockRequirement` (xpThreshold or storyProgress)
   - `themeColor` (for UI use)
   - `backgroundImage` and `mapImage` paths (for UI use)

2. Create a data file for the city: `data/cities/{cityId}.json` containing:
   - `districts`: Array of district objects
   - `locations`: Array of location objects
   - `npcs`: Array of NPC objects
   - `quests`: Array of quest objects

3. Each district, location, NPC, and quest should reference the city by ID where appropriate.

## Public API

### Initialization
- `JourneyEngine.getInstance().initialize()` - Initializes the engine and loads player progress

### City Queries
- `getCities()` - Returns all cities from master data
- `getUnlockedCities()` - Returns cities the player has access to
- `getLockedCities()` - Returns cities the player cannot yet access
- `getCity(id)` - Returns city object by ID
- `isCityUnlocked(id)` - Checks if a city is accessible based on player progress

### Location Queries
- `getDistrict(cityId, districtId)` - Returns district object
- `getLocation(cityId, districtId, locationId)` - Returns location object
- `getNPC(id)` - Returns NPC object by ID (loads necessary city data)
- `getQuest(id)` - Returns quest object by ID (loads necessary city data)

### Player Progress
- `getPlayerLocation()` - Returns `{city, district, location}` IDs
- `travelTo(cityId, districtId, locationId)` - Moves player to location and marks as discovered
- `completeQuest(id)` - Marks quest as complete, applies rewards, checks for unlocks
- `unlockCity(id)` - Manually unlock a city (e.g., via story)

### Saving/Loading
- `save()` - Manually save progress to localStorage
- `load()` - Manually load progress from localStorage (called automatically on init)

### Progress Metrics
- `getCompletionPercentage()` - Returns overall completion percentage (0-100)

### Search Functions
- `searchCities(query)` - Find cities by name/description
- `searchNPCs(query)` - Find NPCs by name/profession/description
- `searchLocations(query)` - Find locations by name/description
- `searchQuests(query)` - Find quests by title/description

### Filtered Queries
- `getNearbyNPCs(cityId, districtId)` - NPCs in the same district
- `getNearbyQuests(cityId, districtId)` - Quests in the same district
- `getAvailableQuests(cityId, districtId)` - Quests not completed with prerequisites met
- `getCompletedQuests()` - Array of completed quest objects
- `getLockedLocations(cityId, districtId)` - Locations not yet discovered
- `getUnlockedLocations(cityId, districtId)` - Locations already discovered

### Event System
- `on(eventName, callback)` - Subscribe to an event, returns unsubscribe function
- Events emitted:
  - `initialized` - When engine finishes initializing
  - `cityUnlocked` - When a new city becomes accessible
  - `locationDiscovered` - When player visits a new location
  - `questCompleted` - When player completes a quest
  - `locationChanged` - When player moves to a new location
  - `levelUp` - When player gains a level
  - `citiesUnlocked` - When multiple cities are unlocked at once
  - `locationsUnlocked` - When multiple locations are discovered at once

## Example Usage

```javascript
// Get the engine instance
const journey = JourneyEngine.getInstance();

// Initialize (loads data and player progress)
await journey.initialize();

// Get unlocked cities
const unlockedCities = journey.getUnlockedCities();

// Travel to a location in Pune
await journey.travelTo('pune', 'pune-fc-road', 'pune-fc-road-tea-stall');

// Get the tea stall NPC
const teaStallOwner = await journey.getNPC('pune-tea-stall-owner-kisan');

// Complete a quest
const result = await journey.completeQuest('pune-quest-cutting-chai-order');
if (result.success) {
  console.log(`Earned ${result.rewards.xp} XP and ${result.rewards.coins} coins`);
}

// Subscribe to events
const unsubscribe = journey.on('questCompleted', (data) => {
  console.log(`Quest completed: ${data.questId}`);
});

// Later, to unsubscribe:
// unsubscribe();

// Check completion