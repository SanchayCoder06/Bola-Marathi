/**
 * BOLA Marathi — JourneyScreen Component
 * Presentation Layer (RPG Exploration & World Map System)
 */

import { AppState } from '../../application/state/appState.js';
import { GameEngine } from '../../core/engines/gameEngine.js';
import { ProgressEngine } from '../../core/engines/progressEngine.js';
import { ConversationEngine } from '../../core/engines/conversationEngine.js';
import { AudioEngine } from '../../core/engines/audioEngine.js';
import { StoryEngine } from '../../core/engines/storyEngine.js';
import { StorageManager } from '../../infrastructure/storage/storageManager.js';
import { DBService } from '../../infrastructure/storage/db.js';

export const JourneyScreen = {
  async render(container) {
    // Initialize engines
    await GameEngine.init();
    AudioEngine.init();

    const state = AppState.getState();
    const rep = ProgressEngine.getLaukikReputation(state.stats.xp);
    const activeLandmark = state.rpg.activeLandmarkId;
    const currentCity = state.rpg.currentCity || 'pune';

    // 1. Dialogue Simulator View
    if (activeLandmark && !activeLandmark.endsWith('-district')) {
      if (activeLandmark === 'pune-restaurant' && JourneyScreen.previewStoryId === 'pune_restaurant') {
        _renderStoryPreview(container, currentCity);
      } else {
        _renderDialogueSimulator(container, activeLandmark, currentCity);
      }
      return;
    }

    // Dispatch sub-route based on location hash
    const hash = window.location.hash;
    if (hash.startsWith('#journey/') && currentCity) {
      const parts = hash.split('/');
      if (parts.length > 2) {
        const districtId = parts[2];
        _renderDistrictExplore(container, currentCity, districtId);
      } else {
        _renderCityLandingPage(container, currentCity);
      }
      return;
    }

    // 3. Regional Animated World Map View
    _renderRegionalMap(container, rep.level, currentCity);
  },
  previewStoryId: null
};

// ============================================================
// STORY PREVIEW
// ============================================================
function _renderStoryPreview(container, cityId) {
  const story = StoryEngine.getStoryMetadata('pune_restaurant');
  if (!story) {
    window.location.hash = `#journey/${cityId}`;
    return;
  }

  container.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; gap: 16px; min-height: 80vh; background: #090B15; padding: 20px;">
      <div class="module-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <button id="btnExitPreview" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer;">←</button>
        <div>
          <div style="font-weight: 800; font-size: 1.35rem; color: var(--text-primary); font-family: 'Poppins', sans-serif;">${story.title}</div>
          <div style="font-size: 0.8rem; color: var(--color-accent); font-weight: 700;">${story.lessonsCompleted} Completed</div>
        </div>
      </div>

      <div class="glass-card" style="padding: 0; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: #171F2E; box-shadow: var(--shadow-lg);">
        <img src="${story.coverImage}" style="width: 100%; height: 180px; object-fit: cover; display: block;" alt="Restaurant Scene" />
        <div style="padding: 20px;">
          <p style="font-size: 1rem; line-height: 1.6; color: var(--text-primary); font-family: 'Noto Sans Marathi', sans-serif; margin: 0;">
            ${story.description}
          </p>
          <div style="font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 12px; line-height: 1.4; font-style: italic;">
            In this chapter, you will learn how to interact in a Marathi restaurant: requesting water, ordering local dishes, and paying the bill.
          </div>
        </div>
      </div>

      <button class="btn btn-primary" id="btnContinueToSim" style="width: 100%; padding: 12px; border-radius: 16px; font-weight: 700; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer; font-size: 1rem; box-shadow: var(--shadow-glow-accent);">
        Continue ➔
      </button>
    </div>
  `;

  document.getElementById('btnExitPreview').addEventListener('click', () => {
    JourneyScreen.previewStoryId = null;
    AppState.update('rpg.activeLandmarkId', null);
    window.location.hash = `#journey/${cityId}`;
  });

  document.getElementById('btnContinueToSim').addEventListener('click', async () => {
    JourneyScreen.previewStoryId = null;
    await ConversationEngine.startConversation('pune_restaurant');
    JourneyScreen.render(container);
  });
}

// ============================================================
// PHASE 3: INTERACTIVE WORLD MAP WITH TRAINS & FOG
// ============================================================
function _renderRegionalMap(container, playerLevel, currentCityId) {
  const cities = GameEngine.getCityMetadata();

  container.innerHTML = `
    <div class="screen active" id="screen-journey-map" style="display: flex; flex-direction: column; min-height: 80vh; background: #090B15; padding: 20px 20px 85px;">
      
      <div class="screen-header" style="margin-bottom: 16px;">
        <h1 class="screen-title text-gradient" style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.6rem; margin: 0;">Maharashtra RPG Map</h1>
        <p class="screen-subtitle" style="font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 4px;">Tap cities to open exploration bottom sheets. Locked zones lie under fog.</p>
      </div>

      <!-- RPG Map Container with zoom transitions -->
      <div class="map-board-container" style="position: relative; width: 100%; height: 350px; background: #0c0e1a; border-radius: 24px; border: 1px solid rgba(255, 159, 28, 0.15); overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.55); transition: transform 0.5s ease;">
        
        <!-- Slow floating ambient clouds -->
        <div class="moving-cloud" style="top: 15%; animation-duration: 40s;">☁️</div>
        <div class="moving-cloud" style="top: 50%; animation-duration: 25s; font-size: 3rem;">☁️</div>
        <div class="moving-cloud" style="top: 75%; animation-duration: 35s;">☁️</div>

        <!-- Ambient radial fog -->
        <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 80%); pointer-events: none; z-index: 1;"></div>
        
        <!-- SVG Connections and region paths -->
        <svg style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 2; pointer-events: none;">
          <!-- Glowing roads between coordinate pins -->
          <line x1="50%" y1="60%" x2="30%" y2="45%" stroke="rgba(255, 159, 28, 0.3)" stroke-width="2.5" stroke-dasharray="6"/>
          <line x1="50%" y1="60%" x2="45%" y2="25%" stroke="rgba(255, 159, 28, 0.12)" stroke-width="2.5" stroke-dasharray="6"/>
          <line x1="30%" y1="45%" x2="45%" y2="25%" stroke="rgba(255, 159, 28, 0.12)" stroke-width="2.5" stroke-dasharray="6"/>
        </svg>

        <!-- Train icon animating on road track path -->
        <div class="map-train" style="position: absolute; z-index: 5; font-size: 1.25rem;">🚂</div>

        <style>
          /* Cloud movement keys */
          @keyframes floatClouds {
            0% { transform: translateX(-150px); opacity: 0; }
            10% { opacity: 0.12; }
            90% { opacity: 0.12; }
            100% { transform: translateX(450px); opacity: 0; }
          }
          .moving-cloud {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            z-index: 8;
            animation: floatClouds 30s infinite linear;
          }

          /* Train offset animation paths */
          @keyframes trainTravel {
            0% { left: 50%; top: 60%; transform: translate(-50%, -50%) rotate(205deg); }
            50% { left: 30%; top: 45%; transform: translate(-50%, -50%) rotate(205deg); }
            100% { left: 50%; top: 60%; transform: translate(-50%, -50%) rotate(25deg); }
          }
          .map-train {
            animation: trainTravel 14s infinite linear;
          }

          @keyframes glowPulseMap {
            0% { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 0 0 0 rgba(255, 159, 28, 0.5); }
            70% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 0 12px rgba(255, 159, 28, 0); }
            100% { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 0 0 0 rgba(255, 159, 28, 0); }
          }
          .map-pin-pulse {
            animation: glowPulseMap 2s infinite ease-in-out;
          }
          
          .map-board-container:hover {
            transform: scale(1.015);
          }
        </style>

        <!-- Dynamic Pins Map Overlay -->
        ${Object.values(cities).map(city => {
          const isUnlocked = playerLevel >= city.levelRequired;
          const isActive = currentCityId === city.id;
          
          let pinStyle = `position: absolute; left: ${city.coords.x}%; top: ${city.coords.y}%; transform: translate(-50%, -50%); z-index: 10; cursor: pointer;`;
          
          return `
            <div class="map-pin-anchor" data-city-id="${city.id}" style="${pinStyle}">
              <div class="map-pin-icon ${isActive ? 'map-pin-pulse' : ''}" style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isActive ? 'linear-gradient(135deg, #FF9F1C 0%, #ffbe59 100%)' : isUnlocked ? '#171F2E' : '#222'}; color: #fff; border: 2.5px solid ${isUnlocked ? '#FF9F1C' : 'rgba(255,255,255,0.15)'}; box-shadow: 0 8px 20px rgba(0,0,0,0.5); filter: ${isUnlocked ? 'none' : 'grayscale(100%) opacity(0.7)'}; transition: all 0.2s;">
                <span style="font-size: 1.3rem;">${isUnlocked ? city.icon : '🔒'}</span>
              </div>
              <div class="map-pin-label" style="position: absolute; top: 52px; left: 50%; transform: translateX(-50%); background: rgba(9, 11, 21, 0.9); border: 1px solid rgba(255,255,255,0.06); color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px; white-space: nowrap; font-weight: 800; font-family: 'Poppins', sans-serif;">
                ${city.name}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- RPG Bottom Sheet Overlay Drawer -->
      <div id="cityBottomSheetOverlay" style="position: fixed; inset: 0; background: rgba(9, 11, 21, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1000; display: none; align-items: flex-end; justify-content: center;">
        <div id="cityBottomSheet" style="width: 100%; max-width: 480px; background: #171F2E; border-top-left-radius: 28px; border-top-right-radius: 28px; border: 1px solid rgba(255,255,255,0.08); padding: 24px; box-shadow: 0 -12px 40px rgba(0,0,0,0.6); transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
          <!-- Dynamic Content -->
        </div>
      </div>

    </div>
  `;

  // Bind pin clicks to open bottom sheet
  container.querySelectorAll('.map-pin-anchor').forEach(pin => {
    pin.addEventListener('click', () => {
      const cityId = pin.dataset.cityId;
      _openCityBottomSheet(cityId);
    });
  });

  function _openCityBottomSheet(cityId) {
    const city = cities[cityId];
    if (!city) return;

    const isUnlocked = playerLevel >= city.levelRequired;
    const overlay = document.getElementById('cityBottomSheetOverlay');
    const sheet = document.getElementById('cityBottomSheet');
    if (!overlay || !sheet) return;

    const coverMap = {
      'pune': 'assets/images/pune_sunset_street.png',
      'mumbai': 'assets/images/restaurant_scene.png',
      'nashik': 'assets/images/modak.png'
    };
    const coverImg = coverMap[cityId] || 'assets/images/pune_sunset_street.png';

    if (isUnlocked) {
      sheet.innerHTML = `
        <div style="width: 40px; height: 5px; background: rgba(255,255,255,0.15); border-radius: 3px; margin: 0 auto 16px; cursor: pointer;" id="btnHandleCloseSheet"></div>
        
        <div style="position: relative; height: 130px; border-radius: 20px; overflow: hidden; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.05);">
          <img src="${coverImg}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent, rgba(23,31,46,0.95) 100%);"></div>
          <div style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.65); padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; color: #fff; font-weight: bold;">
            ⛅ ${city.weather}
          </div>
        </div>

        <h2 style="font-family: 'Baloo 2', sans-serif; font-size: 1.55rem; font-weight: 800; color: #fff; margin: 0 0 6px;">${city.name} (${city.nameMarathi})</h2>
        <p style="font-size: 0.85rem; color: rgba(255,255,255,0.55); line-height: 1.45; margin: 0 0 20px;">${city.description}</p>

        <!-- Stats progressions list -->
        <div style="background: rgba(0,0,0,0.2); border-radius: 20px; padding: 16px; border: 1px solid rgba(255,255,255,0.03); margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.78rem;">
          <div>
            <div style="color: rgba(255,255,255,0.4); text-transform: uppercase; font-size: 0.65rem; font-weight: bold;">Quests Completed</div>
            <div style="color: #fff; font-weight: bold; margin-top: 2px;">12 / 20 Quests</div>
          </div>
          <div>
            <div style="color: rgba(255,255,255,0.4); text-transform: uppercase; font-size: 0.65rem; font-weight: bold;">NPCs Inhabiting</div>
            <div style="color: #fff; font-weight: bold; margin-top: 2px;">18 Characters</div>
          </div>
          <div>
            <div style="color: rgba(255,255,255,0.4); text-transform: uppercase; font-size: 0.65rem; font-weight: bold;">Vocabulary Unlocked</div>
            <div style="color: #FF9F1C; font-weight: bold; margin-top: 2px;">143 Words</div>
          </div>
          <div>
            <div style="color: rgba(255,255,255,0.4); text-transform: uppercase; font-size: 0.65rem; font-weight: bold;">City Progress</div>
            <div style="color: #2ED573; font-weight: bold; margin-top: 2px;">72% Completed</div>
          </div>
        </div>

        <button id="btnContinueToCity" style="width: 100%; border: none; border-radius: 16px; padding: 14px; background: linear-gradient(135deg, #FF9F1C 0%, #ffbe59 100%); color: #fff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 8px 24px rgba(255,159,28,0.35);">
          Continue to Explore Hub →
        </button>
      `;

      document.getElementById('btnContinueToCity').addEventListener('click', () => {
        AppState.update('rpg.currentCity', cityId);
        window.location.hash = `#journey/${cityId}`;
        _closeSheet();
      });

    } else {
      // Locked city preview
      sheet.innerHTML = `
        <div style="width: 40px; height: 5px; background: rgba(255,255,255,0.15); border-radius: 3px; margin: 0 auto 16px; cursor: pointer;" id="btnHandleCloseSheet"></div>

        <div style="position: relative; height: 130px; border-radius: 20px; overflow: hidden; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.05); filter: grayscale(100%);">
          <img src="${coverImg}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent, rgba(23,31,46,0.95) 100%);"></div>
        </div>

        <span style="padding: 4px 10px; background: rgba(255, 71, 87, 0.15); color: #ff4757; border-radius: 20px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; border: 1px solid rgba(255, 71, 87, 0.25);">Region Locked</span>
        
        <h2 style="font-family: 'Baloo 2', sans-serif; font-size: 1.55rem; font-weight: 800; color: rgba(255,255,255,0.5); margin: 8px 0 6px;">${city.name} (locked)</h2>
        <p style="font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.45; margin: 0 0 16px;">
          To unlock this region, you must reach **Player Level ${city.levelRequired}**. Complete conversations in Pune to level up!
        </p>

        <!-- Highlights list to build excitement -->
        <div style="background: rgba(0,0,0,0.2); border-radius: 20px; padding: 16px; border: 1px solid rgba(255,255,255,0.03); margin-bottom: 24px; font-size: 0.8rem;">
          <div style="color: rgba(255,255,255,0.45); font-weight: bold; text-transform: uppercase; font-size: 0.65rem; margin-bottom: 8px;">Upcoming City Highlights:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: rgba(255,255,255,0.85); font-weight: 600;">
            <div>🚉 Local Trains</div>
            <div>🎡 Marine Drive</div>
            <div>🕌 Gateway of India</div>
            <div>🍲 Street Vada Pav</div>
          </div>
          <div style="margin-top: 12px; display: flex; justify-content: space-between; font-size: 0.72rem; color: rgba(255,255,255,0.45);">
            <span>📖 32 Quests waiting</span>
            <span>🕒 ~3 Hours playtime</span>
          </div>
        </div>

        <button id="btnUnderstandClose" style="width: 100%; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px; background: rgba(0,0,0,0.25); color: #fff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.95rem; cursor: pointer;">
          I will practice more!
        </button>
      `;

      document.getElementById('btnUnderstandClose').addEventListener('click', _closeSheet);
    }

    // Slide up sheet animations
    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
      sheet.style.transform = 'translateY(0)';
    });

    // Close buttons
    document.getElementById('btnHandleCloseSheet')?.addEventListener('click', _closeSheet);
    
    // Close on overlay backdrop tap
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        _closeSheet();
      }
    };

    function _closeSheet() {
      sheet.style.transform = 'translateY(100%)';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  }
}

// ============================================================
// PHASE 4: CINEMATIC CITY LANDING PAGE (EXPLORATION PAGE)
// ============================================================
function _renderCityLandingPage(container, cityId) {
  const state = AppState.getState();
  const cities = GameEngine.getCityMetadata();
  const city = cities[cityId];
  if (!city) {
    window.location.hash = '#journey';
    return;
  }

  // Resolve cover image and reputation metrics
  const coverMap = {
    'pune': 'assets/images/pune_sunset_street.png',
    'mumbai': 'assets/images/restaurant_scene.png',
    'nashik': 'assets/images/modak.png'
  };
  const coverImg = coverMap[cityId] || 'assets/images/pune_sunset_street.png';

  const repXp = GameEngine.getCityReputation(state, cityId);
  const repRank = GameEngine.getReputationRank(cityId, repXp);

  container.innerHTML = `
    <div class="screen active" id="screen-city-landing" style="display: flex; flex-direction: column; gap: 26px; background: #090B15; padding: 20px 20px 85px; font-family: 'Outfit', sans-serif;">
      
      <!-- Back Header -->
      <div style="display: flex; align-items: center; gap: 16px;">
        <button id="btnBackToMapBoard" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer; display: flex; align-items: center;">←</button>
        <div>
          <h2 style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.25rem; color: #fff; margin: 0;">${city.name} Map Hub</h2>
          <div style="font-size: 0.78rem; color: rgba(255,255,255,0.45); font-weight: bold; text-transform: uppercase;">Active City Center</div>
        </div>
      </div>

      <!-- Cinematic landing cover banner -->
      <div class="luxury-card" style="padding: 0; overflow: hidden; position: relative;">
        <div style="position: relative; width: 100%; height: 180px;">
          <img src="${coverImg}" style="width: 100%; height: 100%; object-fit: cover;" alt="${city.name} cover" />
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9, 11, 21, 0.1) 0%, rgba(23, 31, 46, 0.98) 100%);"></div>
          
          <!-- Weather / Event Indicator -->
          <div style="position: absolute; top: 14px; left: 14px; background: rgba(0,0,0,0.65); backdrop-filter: blur(8px); padding: 6px 12px; border-radius: 20px; font-size: 0.72rem; color: #fff; border: 1px solid rgba(255,255,255,0.08); font-weight: bold;">
            ⛅ ${city.weather}
          </div>
          <div style="position: absolute; top: 14px; right: 14px; background: rgba(255, 159, 28, 0.2); backdrop-filter: blur(8px); padding: 6px 12px; border-radius: 20px; font-size: 0.72rem; color: #FF9F1C; border: 1px solid rgba(255, 159, 28, 0.3); font-weight: 800;">
            🌺 ${city.festival}
          </div>
        </div>

        <div style="padding: 20px; margin-top: -30px; position: relative; z-index: 5;">
          <h1 style="font-family: 'Baloo 2', sans-serif; font-size: 1.85rem; font-weight: 800; color: #fff; margin: 0 0 6px;">पुणे — ${city.name}</h1>
          <p style="font-size: 0.88rem; color: rgba(255,255,255,0.55); line-height: 1.45; margin: 0 0 16px;">${city.description}</p>
          
          <!-- Reputation Card segment -->
          <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.72rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: bold;">City Reputation</span>
              <div style="font-size: 1.05rem; font-weight: 800; color: #FF9F1C; margin-top: 2px;">${repRank}</div>
            </div>
            <span style="padding: 6px 14px; background: rgba(255, 159, 28, 0.12); color: #FF9F1C; border-radius: 12px; font-size: 0.82rem; font-weight: 800; font-family: 'Inter', sans-serif;">${repXp} Reputation XP</span>
          </div>
        </div>
      </div>

      <!-- City Progression Levels Grid -->
      <div class="luxury-card" style="padding: 20px;">
        <h3 style="font-size: 1rem; font-weight: 800; color: #fff; margin: 0 0 12px; font-family: 'Poppins', sans-serif;">City Progression Matrix</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; font-size: 0.72rem; font-weight: bold;">
          <div style="background: rgba(0,0,0,0.18); padding: 10px; border-radius: 12px;">
            <div style="color: #FF9F1C;">72%</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.65rem; margin-top: 2px;">Story Completion</div>
          </div>
          <div style="background: rgba(0,0,0,0.18); padding: 10px; border-radius: 12px;">
            <div style="color: #8B5CF6;">85%</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.65rem; margin-top: 2px;">District Explore</div>
          </div>
          <div style="background: rgba(0,0,0,0.18); padding: 10px; border-radius: 12px;">
            <div style="color: #2ED573;">60%</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.65rem; margin-top: 2px;">NPC Relationships</div>
          </div>
          <div style="background: rgba(0,0,0,0.18); padding: 10px; border-radius: 12px;">
            <div style="color: #00d2ff;">80%</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.65rem; margin-top: 2px;">Vocabulary Scroll</div>
          </div>
          <div style="background: rgba(0,0,0,0.18); padding: 10px; border-radius: 12px;">
            <div style="color: #ff6b81;">50%</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.65rem; margin-top: 2px;">Achievements</div>
          </div>
          <div style="background: rgba(0,0,0,0.18); padding: 10px; border-radius: 12px;">
            <div style="color: #ff9f43;">100%</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 0.65rem; margin-top: 2px;">Festival Badge</div>
          </div>
        </div>
      </div>

      <!-- RANDOM DISCOVERY EVENTS DRAWER -->
      <div id="randomDiscoveryBanner" class="luxury-card" style="padding: 16px; border: 1.5px dashed rgba(255, 159, 28, 0.4); background: linear-gradient(135deg, #171F2E 0%, #201810 100%) !important;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <span style="font-size: 1.8rem; animation: pulse 1.5s infinite;">🛺</span>
          <div style="flex: 1;">
            <div style="font-size: 0.72rem; color: #FF9F1C; font-weight: bold; text-transform: uppercase;">Discovery Event Alert</div>
            <h4 style="font-size: 0.95rem; font-weight: bold; color: #fff; margin: 2px 0;">Rickshaw Driver needs help!</h4>
            <p style="font-size: 0.78rem; color: rgba(255,255,255,0.6); margin: 0;">Translate directions to earn +20 Coins bonus.</p>
          </div>
          <button id="btnStartDiscovery" style="border: none; border-radius: 10px; padding: 8px 12px; background: #FF9F1C; color: #fff; font-size: 0.75rem; font-weight: 800; cursor: pointer;">Help</button>
        </div>
      </div>

      <!-- Explorable Districts (Districts list) -->
      <div>
        <h3 style="font-family: 'Poppins', sans-serif; font-size: 1.15rem; font-weight: 800; color: #fff; margin: 0 0 14px;">Explorable Districts</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${(city.districts || []).map(dist => {
            let districtIcon = '🚉';
            if (dist.id.includes('market')) districtIcon = '🛍️';
            if (dist.id.includes('heritage')) districtIcon = '🏰';

            return `
              <div class="luxury-card district-explore-card" data-district-id="${dist.id}" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <div style="display: flex; gap: 16px; align-items: center;">
                  <div style="width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; background: rgba(139, 92, 246, 0.12); color: #8B5CF6; border: 1px solid rgba(139, 92, 246, 0.15); font-size: 1.5rem; flex-shrink: 0;">
                    ${districtIcon}
                  </div>
                  <div>
                    <h4 style="font-size: 1.05rem; font-weight: bold; color: #fff; margin: 0 0 3px; font-family: 'Baloo 2', sans-serif;">${dist.name} (${dist.nameMarathi})</h4>
                    <p style="font-size: 0.78rem; color: rgba(255,255,255,0.45); margin: 0; line-height: 1.35;">${dist.description}</p>
                  </div>
                </div>
                <div style="color: #FF9F1C; font-weight: bold; font-size: 1.25rem;">➔</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Story & Side Quests Log with objectives checklist -->
      <div class="luxury-card" style="padding: 24px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin: 0 0 16px; font-family: 'Poppins', sans-serif;">Active Missions & Objectives</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Story Mission -->
          <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 16px; border: 1px solid rgba(255, 159, 28, 0.15);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>
                <span style="font-size: 0.65rem; color: #FF9F1C; font-weight: 800; text-transform: uppercase;">Story Quest</span>
                <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin-top: 2px;">Order Tea in Pune Cafe</div>
              </div>
              <button id="btnTriggerStoryQuest" style="border: none; border-radius: 10px; padding: 6px 12px; background: #FF9F1C; color: #fff; font-size: 0.72rem; font-weight: 800; cursor: pointer;">Start</button>
            </div>
            <!-- Checklist objectives -->
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: bold;">
              <div>✔ Speak Marathi to Cafe Waiter Rohan</div>
              <div>✔ Request water and order a hot special tea</div>
              <div>☐ Pay correct amount (20 Coins)</div>
            </div>
          </div>

          <!-- Side Mission -->
          <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.15);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>
                <span style="font-size: 0.65rem; color: #8B5CF6; font-weight: 800; text-transform: uppercase;">Side Quest</span>
                <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin-top: 2px;">Bargain at Tulshibaug Market</div>
              </div>
              <button id="btnTriggerSideQuest" style="border: none; border-radius: 10px; padding: 6px 12px; background: #8B5CF6; color: #fff; font-size: 0.72rem; font-weight: 800; cursor: pointer;">Start</button>
            </div>
            <!-- Checklist objectives -->
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: bold;">
              <div>☐ Bargain fruit prices with Aunt Sunita</div>
              <div>☐ Learn Maharashtrian recipe components</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Souvenirs & Recipes Chest panel -->
      <div class="luxury-card" style="padding: 24px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin: 0 0 16px; font-family: 'Poppins', sans-serif;">Collectibles & Souvenirs Cabinet</h3>
        
        <!-- Shelf Layout -->
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <!-- Souvenirs Shelf -->
          <div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Souvenirs & Badges</div>
            <div style="display: flex; gap: 12px;">
              ${(city.souvenirs || []).map(souv => {
                const isUnlocked = repXp >= souv.xpRequired;
                const cardStyle = isUnlocked 
                  ? "background: rgba(255, 159, 28, 0.1); border-color: rgba(255, 159, 28, 0.25); color: #FF9F1C;"
                  : "background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); color: rgba(255,255,255,0.25);";
                return `
                  <div class="collectible-item" data-type="souvenir" data-id="${souv.id}" data-unlocked="${isUnlocked}" style="flex: 1; padding: 12px; border-radius: 16px; text-align: center; border: 1.5px solid; cursor: pointer; ${cardStyle}">
                    <div style="font-size: 1.5rem; margin-bottom: 4px;">🏆</div>
                    <div style="font-size: 0.72rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${souv.name}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Recipes Shelf -->
          <div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Culinary Recipes Unlocked</div>
            <div style="display: flex; gap: 12px;">
              ${(city.recipes || []).map(rec => {
                const isUnlocked = repXp >= rec.xpRequired;
                const cardStyle = isUnlocked 
                  ? "background: rgba(46, 213, 115, 0.1); border-color: rgba(46, 213, 115, 0.25); color: #2ED573;"
                  : "background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); color: rgba(255,255,255,0.25);";
                return `
                  <div class="collectible-item" data-type="recipe" data-id="${rec.id}" data-unlocked="${isUnlocked}" style="flex: 1; padding: 12px; border-radius: 16px; text-align: center; border: 1.5px solid; cursor: pointer; ${cardStyle}">
                    <div style="font-size: 1.5rem; margin-bottom: 4px;">🍲</div>
                    <div style="font-size: 0.72rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${rec.name}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  // Bind back buttons
  document.getElementById('btnBackToMapBoard').addEventListener('click', () => {
    window.location.hash = '#journey';
  });

  // Bind District navigate
  container.querySelectorAll('.district-explore-card').forEach(card => {
    card.addEventListener('click', () => {
      const districtId = card.dataset.districtId;
      window.location.hash = `#journey/${cityId}/${districtId}`;
    });
  });

  // Bind Discovery Event
  document.getElementById('btnStartDiscovery')?.addEventListener('click', () => {
    ConversationEngine.startConversation('pune_taxi_ride');
    AppState.update('rpg.activeLandmarkId', 'pune-station');
    JourneyScreen.render(container);
  });

  // Bind Quests direct launch
  document.getElementById('btnTriggerStoryQuest').addEventListener('click', () => {
    JourneyScreen.previewStoryId = 'pune_restaurant';
    AppState.update('rpg.activeLandmarkId', 'pune-restaurant');
    JourneyScreen.render(container);
  });
  document.getElementById('btnTriggerSideQuest').addEventListener('click', () => {
    ConversationEngine.startConversation('pune_market_bargain');
    AppState.update('rpg.activeLandmarkId', 'pune-market');
    JourneyScreen.render(container);
  });

  // Collectibles description popups
  container.querySelectorAll('.collectible-item').forEach(item => {
    item.addEventListener('click', () => {
      const isUnlocked = item.dataset.unlocked === 'true';
      const id = item.dataset.id;
      const type = item.dataset.type;

      if (!isUnlocked) {
        UI.showToast("Locked! Complete conversation scenarios to unlock reputation rewards.");
        return;
      }

      let text = "";
      if (type === 'souvenir') {
        const match = city.souvenirs.find(s => s.id === id);
        text = match ? `${match.name}: ${match.description}` : "Locked souvenir";
      } else {
        const match = city.recipes.find(r => r.id === id);
        text = match ? `${match.name}: ingredients - ${match.ingredients}` : "Locked recipe";
      }
      UI.showToast(text);
    });
  });
}

// ============================================================
// EXPLORABLE DISTRICTS MAP VIEW
// ============================================================
function _renderDistrictExplore(container, cityId, districtId) {
  const state = AppState.getState();
  const cities = GameEngine.getCityMetadata();
  const city = cities[cityId];
  if (!city) {
    window.location.hash = `#journey/${cityId}`;
    return;
  }
  const district = city.districts.find(d => d.id === districtId);
  if (!district) {
    window.location.hash = `#journey/${cityId}`;
    return;
  }

  // Find NPCs located in this district
  const districtLandmarks = city.landmarks.filter(lm => lm.districtId === districtId);

  // Setup district visual backdrop covers
  const districtCovers = {
    'pune-station-district': 'assets/images/shivaji_maharaj.png',
    'pune-market-district': 'assets/images/restaurant_scene.png',
    'pune-heritage-district': 'assets/images/ganesh_chaturthi.png'
  };
  const districtBg = districtCovers[districtId] || 'assets/images/restaurant_scene.png';

  container.innerHTML = `
    <div class="screen active" id="screen-district-view" style="display: flex; flex-direction: column; gap: 24px; background: #090B15; padding: 20px 20px 85px; font-family: 'Outfit', sans-serif;">
      
      <!-- Header back -->
      <div style="display: flex; align-items: center; gap: 16px;">
        <button id="btnBackToLanding" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer; display: flex; align-items: center;">←</button>
        <div>
          <h2 style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.2rem; color: #fff; margin: 0;">${district.name}</h2>
          <div style="font-size: 0.75rem; color: #FF9F1C; font-weight: bold; text-transform: uppercase;">Explore District & Find Chests</div>
        </div>
      </div>

      <!-- District cover stage -->
      <div class="luxury-card" style="height: 140px; background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(23,31,46,0.95) 100%), url('${districtBg}') center/cover; border-radius: 24px; display: flex; align-items: flex-end; padding: 20px;">
        <div>
          <span style="font-size: 0.72rem; color: #FF9F1C; font-weight: 800; text-transform: uppercase;">District Exploration</span>
          <p style="font-size: 0.88rem; color: rgba(255,255,255,0.7); margin: 2px 0 0;">Tap locations below to interact with local inhabitants.</p>
        </div>
      </div>

      <!-- Treasure Nodes Workspace (Mini-game chest finder) -->
      <div class="luxury-card" style="padding: 20px; border-color: rgba(255, 159, 28, 0.15) !important;">
        <h3 style="font-size: 1.05rem; font-weight: 800; color: #fff; margin: 0 0 6px; font-family: 'Poppins', sans-serif;">Chest Nodes Radar</h3>
        <p style="font-size: 0.78rem; color: rgba(255,255,255,0.45); margin: 0 0 16px;">Tap radar nodes to scan for hidden vocabulary chests.</p>
        
        <!-- Node map flex -->
        <div style="display: flex; justify-content: space-around; padding: 14px 0; background: rgba(0,0,0,0.25); border-radius: 20px; border: 1px solid rgba(255,255,255,0.02);">
          ${[1, 2, 3, 4].map(nodeIdx => {
            const nodeKey = `${districtId}_chest_${nodeIdx}`;
            const isOpened = state.rpg.openedChests && state.rpg.openedChests.includes(nodeKey);
            return `
              <div class="radar-node" data-node-key="${nodeKey}" data-index="${nodeIdx}" data-opened="${isOpened}" style="width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isOpened ? '#222' : 'rgba(139, 92, 246, 0.12)'}; border: 2px solid ${isOpened ? 'rgba(255,255,255,0.1)' : '#8B5CF6'}; color: ${isOpened ? 'rgba(255,255,255,0.3)' : '#8B5CF6'}; cursor: pointer; font-size: 1.15rem; transition: transform 0.2s;">
                ${isOpened ? '🫙' : '⚡'}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Inhabitants Listing with custom ratings (NPC system) -->
      <div>
        <h3 style="font-family: 'Poppins', sans-serif; font-size: 1.15rem; font-weight: 800; color: #fff; margin: 0 0 14px;">District Locations & Inhabitants</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${districtLandmarks.map(lm => {
            const portrait = _getNpcPortrait(lm.npcName) || 'assets/icons/icon-192.png';
            const relStars = GameEngine.getNpcRelationship(state, lm.npcName.split(' ').pop().toLowerCase());
            
            // Build rating star emojis
            let starsStr = '';
            const starPoints = Math.round(relStars / 10);
            for (let i = 1; i <= 5; i++) {
              starsStr += (i <= starPoints) ? '⭐' : '☆';
            }

            // NPC Moods details
            const moods = ["Friendly 😊", "Busy 🏃‍♂️", "Cheerful 😃", "Thoughtful 🤔"];
            const npcMood = moods[lm.npcName.length % moods.length];
            const favoriteTopics = ["Street markets", "Hot tea", "Local buses", "Traditional history"];
            const favTopic = favoriteTopics[lm.npcName.length % favoriteTopics.length];

            return `
              <div class="luxury-card" style="padding: 20px; display: flex; gap: 16px; flex-direction: column;">
                <!-- Header details -->
                <div style="display: flex; gap: 16px;">
                  <div style="width: 72px; height: 72px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255, 159, 28, 0.35); flex-shrink: 0; background: rgba(0,0,0,0.25);">
                    <img src="${portrait}" style="width: 100%; height: 100%; object-fit: cover;" alt="${lm.npcName}" />
                  </div>
                  
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                      <h4 style="font-size: 1.1rem; font-weight: bold; color: #fff; margin: 0; font-family: 'Baloo 2', sans-serif;">${lm.npcName}</h4>
                      <span style="font-size: 0.72rem; color: #FF9F1C; font-weight: 800; text-transform: uppercase;">Active</span>
                    </div>
                    
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.45); margin: 3px 0 6px; font-weight: bold;">
                      Relationship: <span style="color: #FF9F1C;">${starsStr}</span>
                    </div>
                    <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6);">
                      Mood: <strong style="color: #fff;">${npcMood}</strong> | Topic: <strong style="color: #FF9F1C;">${favTopic}</strong>
                    </div>
                  </div>
                </div>

                <!-- Mission Objective detail block -->
                <div style="padding: 10px 14px; background: rgba(0,0,0,0.25); border-radius: 12px; font-size: 0.78rem; color: rgba(255,255,255,0.5); border-left: 3px solid #8B5CF6;">
                  <div style="font-weight: 800; color: #a78bfa; text-transform: uppercase; font-size: 0.65rem; margin-bottom: 2px;">Target Mission</div>
                  <div style="color: #fff; font-weight: 600; font-family: 'Baloo 2', sans-serif;">Scenario: ${lm.name}</div>
                  <div style="margin-top: 4px; display: flex; justify-content: space-between; font-size: 0.7rem;">
                    <span>Difficulty: ★☆</span>
                    <span>Reward: +40 XP</span>
                  </div>
                </div>

                <!-- Actions buttons -->
                <div style="display: flex; gap: 8px;">
                  <button class="btn-start-convo" data-landmark-id="${lm.id}" data-dialogue-id="${lm.dialogueId || ''}" style="flex: 2; border: none; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #FF9F1C 0%, #ffbe59 100%); color: #fff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.85rem; cursor: pointer; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <span>🗣️ Speak Marathi</span>
                  </button>
                  <button class="btn-present-gift" data-npc-name="${lm.npcName}" style="flex: 1; border: 1px solid rgba(255,255,255,0.06); padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.25); color: #fff; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                    Gift 🎁
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;

  // Back redirect
  document.getElementById('btnBackToLanding').addEventListener('click', () => {
    window.location.hash = `#journey/${cityId}`;
  });

  // Chest Radar Scanning clicks
  container.querySelectorAll('.radar-node').forEach(node => {
    node.addEventListener('click', async () => {
      const isOpened = node.dataset.opened === 'true';
      if (isOpened) {
        UI.showToast("Node already scanned. Chest is empty.");
        return;
      }

      const nodeKey = node.dataset.nodeKey;
      const idx = parseInt(node.dataset.index);

      // Save opened chest state
      const opened = state.rpg.openedChests || [];
      opened.push(nodeKey);
      AppState.update('rpg.openedChests', opened);

      // Trigger reward
      let xpGain = 15;
      let coinGain = 10;
      
      const vocabularyWords = [
        { word: "अमृततुल्य", trans: "Amruttulya", eng: "Nectar-like / Specialty tea stall branding" },
        { word: "नमस्कार", trans: "Namaskar", eng: "Hello / Salutations" },
        { word: "पुणेकर", trans: "Punekar", eng: "A resident of Pune" },
        { word: "भाकरी", trans: "Bhakri", eng: "Traditional round flatbread" }
      ];
      const wordObj = vocabularyWords[idx - 1] || vocabularyWords[0];

      // Add to vocabulary database dictionary
      try {
        await DBService.put('dictionary', {
          word: wordObj.word,
          transliteration: wordObj.trans,
          english: wordObj.eng,
          unlocked: true,
          correctAttempts: 0
        });
      } catch (e) {
        console.warn(e);
      }

      // Add coins & XP
      const stats = state.stats;
      stats.xp += xpGain;
      stats.coins += coinGain;
      AppState.update('stats', stats);

      // Re-render
      UI.showToast(`🎉 Found Hidden Chest Node! Unlocked Vocabulary Scroll: "${wordObj.word}" (${wordObj.eng}). Reward: +${xpGain} XP, +${coinGain} Coins!`);
      _renderDistrictExplore(container, cityId, districtId);
    });
  });

  // Handle convo trigger
  container.querySelectorAll('.btn-start-convo').forEach(btn => {
    btn.addEventListener('click', async () => {
      const landmarkId = btn.dataset.landmarkId;
      const dialogueId = btn.dataset.dialogueId;

      if (dialogueId) {
        await ConversationEngine.startConversation(dialogueId);
        AppState.update('rpg.activeLandmarkId', landmarkId);
        JourneyScreen.render(container);
      } else {
        UI.showToast("Explore mode scenario: Locked. Continue story quests to unlock subsequent chapters.");
      }
    });
  });

  // Present gift dialog handler
  container.querySelectorAll('.btn-present-gift').forEach(btn => {
    btn.addEventListener('click', () => {
      const npcName = btn.dataset.npcName;
      const npcKey = npcName.split(' ').pop().toLowerCase();
      
      // Update relationship metrics
      const rels = state.rpg.npcRelationships || {};
      const currentPoints = rels[npcKey] || 0;
      rels[npcKey] = Math.min(50, currentPoints + 10);
      AppState.update('rpg.npcRelationships', rels);
      
      UI.showToast(`🎁 Gift presented to ${npcName}! Relationship rating increased by +10 points!`);
      _renderDistrictExplore(container, cityId, districtId);
    });
  });
}

// ============================================================
// VISUAL NOVEL DIALOGUE SIMULATOR VIEW
// ============================================================
async function _renderDialogueSimulator(container, landmarkId, cityId) {
  let dialogueState = await ConversationEngine.getActiveState();
  if (!dialogueState) {
    const city = await DBService.get('cities', cityId);
    if (city && city.landmarks) {
      const landmark = city.landmarks.find(l => l.id === landmarkId);
      if (landmark && landmark.dialogueId) {
        dialogueState = await ConversationEngine.startConversation(landmark.dialogueId);
      }
    }
  }

  if (!dialogueState) {
    window.location.hash = `#journey/${cityId}`;
    return;
  }

  const isTerminal = dialogueState.isSuccess || dialogueState.isFailure;
  const portraitUrl = _getNpcPortrait(dialogueState.npcName) || 'assets/icons/icon-192.png';
  
  let sceneBg = "";
  if (landmarkId === 'pune-restaurant') {
    sceneBg = 'assets/images/restaurant_scene.png';
  } else if (landmarkId === 'pune-market') {
    sceneBg = 'assets/images/modak.png';
  } else if (landmarkId === 'pune-station') {
    sceneBg = 'assets/images/shivaji_maharaj.png';
  } else {
    sceneBg = 'assets/images/ganesh_chaturthi.png';
  }

  container.innerHTML = `
    <div class="screen active dialogue-screen" style="display: flex; flex-direction: column; height: 100%; min-height: 80vh; background: #090B15; padding: 20px;">
      
      <!-- Dialogue Header -->
      <div class="module-header" style="display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 12px;">
        <button class="module-header__back" id="btnExitConversation" style="border: none; background: transparent; color: var(--text-primary); font-size: 1.5rem; cursor: pointer;">←</button>
        <div style="font-size: 1.5rem;">${dialogueState.npcAvatar}</div>
        <div style="flex: 1;">
          <div style="font-weight: 700; color: var(--text-primary); font-family: 'Poppins', sans-serif;">${dialogueState.npcName}</div>
          <div style="font-size: 0.75rem; color: var(--color-success); font-weight: 500;">Dialogue Simulator</div>
        </div>
      </div>

      <!-- RPG Character Immersive Stage -->
      <div class="rpg-stage" style="height: 180px; width: 100%; border-radius: 20px; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(11, 19, 41, 0.95) 100%), url('${sceneBg}') center/cover; position: relative; display: flex; align-items: flex-end; justify-content: center; overflow: hidden; margin-top: 12px; border: 1px solid rgba(255, 123, 0, 0.2); box-shadow: var(--shadow-md);">
        <img src="${portraitUrl}" style="height: 170px; object-fit: contain; filter: drop-shadow(0 4px 15px rgba(0,0,0,0.6)); transform: translateY(5px);" alt="${dialogueState.npcName}" />
        <div style="position: absolute; bottom: 12px; left: 16px; right: 16px; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); border-radius: 12px; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.08); text-align: left;">
          <span style="font-size: 0.7rem; color: var(--color-accent); font-weight: 800; text-transform: uppercase; font-family: 'Poppins', sans-serif;">${dialogueState.npcName}</span>
          <div style="font-family: var(--font-marathi); font-size: 0.85rem; color: #fff; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px;">
            ${dialogueState.npcText.split('(')[0].trim()}
          </div>
        </div>
      </div>

      <!-- Dialogue History -->
      <div id="dialogueChatHistory" style="flex: 1; overflow-y: auto; padding: 16px 0; display: flex; flex-direction: column; gap: 12px; max-height: 240px; padding-right: 4px;">
        ${dialogueState.history.map(h => {
          const isUser = h.speaker === 'user';
          const p = h.text.split('(');
          const primaryText = p[0].trim();
          const trText = p[1] ? p[1].replace(')', '').trim() : '';

          return `
            <div style="display: flex; flex-direction: column; align-items: ${isUser ? 'flex-end' : 'flex-start'}; width: 100%;">
              <div class="chat-bubble ${isUser ? 'user' : 'npc'}" style="max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 0.95rem; line-height: 1.4; background: ${isUser ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)'}; color: #fff; border-bottom-${isUser ? 'right' : 'left'}-radius: 4px;">
                <div style="font-family: var(--font-marathi);">${primaryText}</div>
                ${trText ? `<div style="font-size: 0.75rem; opacity: 0.75; margin-top: 2px;">${trText}</div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Replay Audio trigger below chat feed -->
      <div style="text-align: center; margin-bottom: 12px;">
        <button class="btn btn-secondary btn-speak-npc" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
          🔊 Replay Audio
        </button>
      </div>

      <!-- Options Panel -->
      <div class="options-panel" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
        ${isTerminal ? `
          <div class="terminal-outcome glass-card" style="text-align: center; padding: 24px; border-radius: 20px; border: 1px solid var(--color-success); background: rgba(16, 185, 129, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); margin-bottom: 16px;">
            ${dialogueState.isSuccess ? `
              <h2 style="font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.5rem; color: var(--text-primary); margin-bottom: 4px; margin-top: 0;">Mission Complete! ✅</h2>
              <p style="font-size: 0.95rem; color: var(--color-success); font-weight: 700; margin-bottom: 12px; margin-top: 0;">Great job!</p>
              
              <!-- 3 yellow stars -->
              <div style="display: flex; justify-content: center; gap: 10px; margin: 16px 0;">
                <span style="font-size: 2.6rem; color: #ffae00;">★</span>
                <span style="font-size: 3.2rem; color: #ffae00; transform: translateY(-4px);">★</span>
                <span style="font-size: 2.6rem; color: #ffae00;">★</span>
              </div>

              <!-- Rewards counts -->
              <div style="display: flex; justify-content: center; gap: 16px; margin: 16px 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">
                <span style="padding: 6px 12px; background: rgba(255,255,255,0.06); border-radius: 12px; border: var(--border-glass);">⭐ +50 XP</span>
                <span style="padding: 6px 12px; background: rgba(255,255,255,0.06); border-radius: 12px; border: var(--border-glass);">🪙 +1 Coin</span>
              </div>

              <div style="font-size: 0.9rem; color: var(--text-secondary); margin: 12px 0 20px;">
                Order water and pay the bill
              </div>

              <button class="btn btn-primary" id="btnFinishDialog" style="width: 100%; padding: 12px; border-radius: 16px; font-weight: 700; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer; box-shadow: var(--shadow-glow-accent);">Next Chapter ➔</button>
            ` : `
              <div style="font-size: 3rem; margin-bottom: 8px;">😿</div>
              <h3 style="font-weight: bold; color: var(--text-primary); font-size: 1.25rem; margin-top: 0;">Scenario Failed</h3>
              <p style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 4px; margin-bottom: 16px;">
                Choose appropriate phrasing to ensure outcomes succeed.
              </p>
              <button class="btn btn-primary" id="btnFinishDialog" style="width: 100%; padding: 12px; border-radius: 16px; font-weight: 700; background: var(--gradient-accent); border: none; color: #fff; cursor: pointer;">Try Again 🔄</button>
            `}
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${dialogueState.options.map((opt, idx) => {
              const p = opt.text.split('(');
              const optMarathi = p[0].trim();
              const optTr = p[1] ? p[1].replace(')', '').trim() : '';

              return `
                <div class="dialogue-option-wrapper" style="display: flex; gap: 8px; align-items: stretch;">
                  <button class="btn btn-secondary dialogue-option-btn" data-index="${idx}" style="flex: 1; text-align: left; padding: 12px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: var(--gradient-primary); color: #fff; cursor: pointer; transition: 200ms; box-shadow: var(--shadow-sm);">
                    <div style="font-size: 1rem; font-weight: bold; font-family: var(--font-marathi);">${optMarathi}</div>
                    ${optTr ? `<div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-top: 2px;">${optTr}</div>` : ''}
                  </button>
                  <button class="btn btn-secondary dialogue-mic-btn" data-text="${optMarathi}" data-index="${idx}" style="border-radius: 14px; padding: 0 16px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.08);">
                    🎤
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

    </div>
  `;

  // Bind exit
  document.getElementById('btnExitConversation').addEventListener('click', () => {
    AppState.update('rpg.activeLandmarkId', null);
    window.location.hash = `#journey/${cityId}`;
  });

  // Bind terminal complete
  document.getElementById('btnFinishDialog')?.addEventListener('click', () => {
    AppState.update('rpg.activeLandmarkId', null);
    window.location.hash = `#journey/${cityId}`;
  });

  document.getElementById('btnRetryDialog')?.addEventListener('click', async () => {
    await ConversationEngine.startConversation(dialogueState.treeId);
    _renderDialogueSimulator(container, landmarkId, cityId);
  });

  // Bind text option clicks
  container.querySelectorAll('.btn-text-attempt').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.dataset.index);
      await ConversationEngine.selectOption(idx);
      _renderDialogueSimulator(container, landmarkId, cityId);
    });
  });

  // Bind voice grading attempts
  container.querySelectorAll('.btn-voice-attempt').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const text = btn.dataset.text;
      _triggerVoiceGradingOverlay(container, landmarkId, cityId, idx, text);
    });
  });
}

// ============================================================
// SPEECH GRADERS OVERLAYS AND WAVEFORMS
// ============================================================
function _triggerVoiceGradingOverlay(container, landmarkId, cityId, optionIndex, targetText) {
  const overlay = document.createElement('div');
  overlay.id = 'voiceGradingOverlay';
  overlay.style = 'position: fixed; inset: 0; background: rgba(9,11,21,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2000; padding: 24px; text-align: center;';

  overlay.innerHTML = `
    <div class="luxury-card" style="width: 100%; max-width: 340px; padding: 32px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
      
      <div>
        <span style="font-size: 0.72rem; color: #FF9F1C; font-weight: 800; text-transform: uppercase;">Speech Assessment</span>
        <h3 style="font-family: 'Poppins', sans-serif; font-size: 1.15rem; color: #fff; font-weight: 800; margin: 6px 0 0;">Pronounce Out Loud</h3>
      </div>

      <div style="font-size: 1.35rem; font-weight: bold; font-family: var(--font-marathi); color: #fff; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.04); width: 100%;">
        ${targetText}
      </div>

      <canvas id="gradingWaveform" width="240" height="70" style="border-radius: 12px; width: 100%; background: #0c0e1a;"></canvas>

      <button id="btnToggleRecordGrade" class="pulse-glow" style="width: 72px; height: 72px; border-radius: 50%; background: #FF9F1C; border: none; font-size: 1.6rem; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; outline: none;">
        🎤
      </button>

      <p id="gradeStatusPrompt" style="font-size: 0.8rem; color: rgba(255,255,255,0.45); margin: 0; font-weight: 600;">Tap microphone to start speaking</p>

      <button id="btnCancelGrading" style="width: 100%; border: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.25); color: #fff; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 0.88rem;">
        Cancel
      </button>

    </div>
  `;

  document.body.appendChild(overlay);

  const canvas = overlay.querySelector('#gradingWaveform');
  _drawStaticWave(canvas);

  let isRecording = false;
  let recordTimer = null;
  let stopVisualizer = null;

  const btnRecord = overlay.querySelector('#btnToggleRecordGrade');
  const statusPrompt = overlay.querySelector('#gradeStatusPrompt');

  btnRecord.addEventListener('click', async () => {
    if (!isRecording) {
      isRecording = true;
      btnRecord.style.background = '#ff4757';
      btnRecord.style.animation = 'none';
      statusPrompt.textContent = "Listening... speak now.";

      try {
        const stream = await AudioEngine.startListening();
        if (stream) {
          stopVisualizer = _startFrequencyVisualizer(canvas, stream);
        }
      } catch (e) {
        console.warn("Speech initiation issue:", e);
      }

      recordTimer = setTimeout(() => {
        btnRecord.click();
      }, 4000);

    } else {
      isRecording = false;
      clearTimeout(recordTimer);
      btnRecord.style.background = '#FF9F1C';
      statusPrompt.textContent = "Analyzing pronunciation quality...";
      btnRecord.disabled = true;

      try {
        const rawAudioBlob = await AudioEngine.stopListening();
        const score = await AudioEngine.assessRemotePronunciation(rawAudioBlob, targetText);

        const isCorrect = score >= 75;

        if (isCorrect) {
          const state = AppState.getState();
          const xpGained = ProgressEngine.calculateXpGain(score);
          state.stats.xp += xpGained;
          state.stats.coins += 2;
          AppState.update('stats', state.stats);
        } else {
          await StorageManager.saveRevisionItem({
            word: targetText,
            repetitions: 0,
            interval: 1,
            easeFactor: 2.5,
            nextReviewDate: new Date().toISOString()
          });
        }

        if (stopVisualizer) stopVisualizer();
        overlay.remove();

        if (isCorrect) {
          UI.showToast(`Pronunciation Score: ${score}%! (+${ProgressEngine.calculateXpGain(score)} XP)`);
          await ConversationEngine.selectOption(optionIndex);
        } else {
          UI.showToast(`Incorrect pronunciation: ${score}%. Logged to Smart Revision.`);
        }

        _renderDialogueSimulator(container, landmarkId, cityId);

      } catch (e) {
        UI.showToast(`Speech Grader issue: ${e.message}`);
        if (stopVisualizer) stopVisualizer();
        overlay.remove();
      }
    }
  });

  overlay.querySelector('#btnCancelGrading').addEventListener('click', () => {
    AudioEngine.stopListening();
    if (stopVisualizer) stopVisualizer();
    overlay.remove();
  });
}

function _drawStaticWave(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function _startFrequencyVisualizer(canvas, stream) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);

  const ctx = canvas.getContext('2d');
  let animId = null;

  function draw() {
    animId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#0c0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const val = dataArray[i];
      const barHeight = Math.max(4, Math.round((val / 255) * canvas.height * 0.8));
      
      ctx.fillStyle = `rgb(${220 + i * 2}, ${130 + i}, 50)`;
      ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 3, barHeight);
      x += barWidth;
    }
  }

  draw();

  return () => {
    cancelAnimationFrame(animId);
    audioCtx.close();
  };
}

function _getNpcPortrait(npcName) {
  const name = (npcName || "").toLowerCase();
  if (name.includes("rickshaw") || name.includes("रिक्षा") || name.includes("ram")) return "assets/images/ram_portrait.png";
  if (name.includes("waiter") || name.includes("वेटेर") || name.includes("rohan")) return "assets/images/rohan_portrait.png";
  if (name.includes("kaku") || name.includes("काकू") || name.includes("shop") || name.includes("owner") || name.includes("anil")) return "assets/images/anil_portrait.png";
  if (name.includes("student") || name.includes("विद्यार्थी") || name.includes("passerby") || name.includes("amit")) return "assets/images/amit_portrait.png";
  if (name.includes("vahini") || name.includes("वहिनी") || name.includes("neighbor") || name.includes("sunita")) return "assets/images/sunita_portrait.png";
  if (name.includes("fruit") || name.includes("विक्रेता") || name.includes("bhaiya") || name.includes("baburao")) return "assets/images/baburao_portrait.png";
  return null;
}
