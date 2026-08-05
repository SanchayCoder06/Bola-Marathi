/**
 * BOLA Marathi — Journey Engine
 * Handles city milestones, RPG landmark choices, XP progression, and unlocks.
 */

import { DBService } from './db';

export interface CityLandmark {
  id: string;
  name: string;
  marathiName: string;
  type: string;
  dialogueId?: string;
  requiredXp?: number;
}

export interface CityMilestone {
  id: string;
  name: string;
  marathiName: string;
  region: string;
  description: string;
  unlockXp: number;
  landmarks: CityLandmark[];
  coords: { x: number; y: number };
}

export const JourneyEngine = (() => {
  let _cities: CityMilestone[] = [];
  let _isInitialized = false;

  async function init(): Promise<void> {
    if (_isInitialized) return;
    _isInitialized = true;

    try {
      await DBService.seedIfEmpty();
      _cities = await DBService.getAll<CityMilestone>('cities');

      if (_cities.length === 0) {
        _cities = [
          {
            id: 'mumbai',
            name: 'Mumbai',
            marathiName: 'मुंबई',
            region: 'Konkan',
            description: 'Financial capital of India & coastal hub of Konkan Marathi.',
            unlockXp: 0,
            coords: { x: 28, y: 56 },
            landmarks: [
              { id: 'gateway', name: 'Gateway of India', marathiName: 'गेटवे ऑफ इंडिया', type: 'monument', dialogueId: 'mumbai_tourist' },
              { id: 'vada_pav_stall', name: 'Dadaji Vada Pav Stall', marathiName: 'वडापाव स्टॉल', type: 'food', dialogueId: 'mumbai_vada_pav' }
            ]
          },
          {
            id: 'pune',
            name: 'Pune',
            marathiName: 'पुणे',
            region: 'Desh',
            description: 'Cultural capital & heartland of standard Marathi literature.',
            unlockXp: 150,
            coords: { x: 42, y: 64 },
            landmarks: [
              { id: 'shaniwarwada', name: 'Shaniwar Wada', marathiName: 'शनिवार वाडा', type: 'fort', dialogueId: 'pune_fort' },
              { id: 'misal_house', name: 'Kattakar Misal House', marathiName: 'मिसळ हाऊस', type: 'restaurant', dialogueId: 'pune_restaurant' }
            ]
          },
          {
            id: 'nashik',
            name: 'Nashik',
            marathiName: 'नाशिक',
            region: 'Northern Maharashtra',
            description: 'Ancient city on the banks of Godavari, famous for vineyards and temples.',
            unlockXp: 400,
            coords: { x: 46, y: 38 },
            landmarks: [
              { id: 'ramkund', name: 'Godavari Ramkund', marathiName: 'रामकुंड', type: 'temple', dialogueId: 'nashik_temple' }
            ]
          },
          {
            id: 'chhatrapati_sambhajinagar',
            name: 'Chhatrapati Sambhajinagar',
            marathiName: 'छत्रपती संभाजीनगर',
            region: 'Marathwada',
            description: 'Gateway to Ajanta & Ellora caves.',
            unlockXp: 750,
            coords: { x: 62, y: 44 },
            landmarks: [
              { id: 'ellora_caves', name: 'Ellora Rock Caves', marathiName: 'वेूळ लेणी', type: 'caves', dialogueId: 'ellora_guide' }
            ]
          },
          {
            id: 'nagpur',
            name: 'Nagpur',
            marathiName: 'नागपूर',
            region: 'Vidarbha',
            description: 'Winter capital famous for Varhadi Marathi and oranges.',
            unlockXp: 1200,
            coords: { x: 86, y: 32 },
            landmarks: [
              { id: 'orange_market', name: 'Cotton Market Oranges', marathiName: 'नागपुरी संत्री मार्केट', type: 'market', dialogueId: 'nagpur_market' }
            ]
          }
        ];
      }
    } catch (e) {
      console.warn('JourneyEngine failed to initialize cities:', e);
    }
  }

  function getCities(userXp: number): (CityMilestone & { isUnlocked: boolean })[] {
    return _cities.map((city) => ({
      ...city,
      isUnlocked: userXp >= city.unlockXp
    }));
  }

  function getCityById(id: string, userXp: number): (CityMilestone & { isUnlocked: boolean }) | null {
    const city = _cities.find((c) => c.id === id);
    if (!city) return null;
    return {
      ...city,
      isUnlocked: userXp >= city.unlockXp
    };
  }

  return {
    init,
    getCities,
    getCityById
  };
})();
