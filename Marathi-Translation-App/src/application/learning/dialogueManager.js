/**
 * BOLA Marathi — Dialogue Manager
 * Application Layer
 * 
 * Manages the state, options, and branches of active offline dialogue simulator 
 * scenarios, updating player XP and Laukik points in AppState.
 */

import { AppState } from '../state/appState.js';
import { ProgressEngine } from '../../core/engines/progressEngine.js';

export const DialogueManager = (() => {
  let _conversations = null;
  let _currentConversationId = null;
  let _currentNodeId = null;
  let _history = []; // Array of { speaker: 'npc'|'user', text: string }

  /**
   * Load dialogue trees from conversations JSON
   */
  async function init() {
    try {
      const res = await fetch('data/conversations.json');
      if (res.ok) {
        _conversations = await res.json();
      }
    } catch (e) {
      console.warn("Failed to load conversations database, using local fallback:", e);
    }
  }

  /**
   * Start a scenario conversation
   * @param {string} conversationId - Entry node ID
   */
  function startConversation(conversationId) {
    if (!_conversations) {
      console.error("Conversations database not loaded yet");
      return null;
    }

    _currentConversationId = conversationId;
    _currentNodeId = conversationId;
    _history = [];

    const node = _conversations[_currentNodeId];
    if (node) {
      _history.push({
        speaker: 'npc',
        name: node.npcName || 'NPC',
        avatar: node.npcAvatar || '👤',
        text: node.npcText
      });
    }

    AppState.update('activeTab', 'journey');
    return getActiveState();
  }

  /**
   * Process user selecting a branching dialogue option
   * @param {number} optionIndex - Index of selected option inside node options
   */
  function selectOption(optionIndex) {
    if (!_conversations || !_currentNodeId) return null;

    const currentNode = _conversations[_currentNodeId];
    if (!currentNode || !currentNode.options || !currentNode.options[optionIndex]) return null;

    const selectedOption = currentNode.options[optionIndex];

    // Log user choice in history
    _history.push({
      speaker: 'user',
      text: selectedOption.text
    });

    // Apply reputation impact to AppState
    if (selectedOption.reputationImpact) {
      const currentState = AppState.getState();
      const currentXp = currentState.stats.xp;
      const nextXp = Math.max(0, currentXp + selectedOption.reputationImpact);
      AppState.update('stats.xp', nextXp);
    }

    // Advance to next dialogue node
    _currentNodeId = selectedOption.nextId;
    const nextNode = _conversations[_currentNodeId];

    if (nextNode) {
      _history.push({
        speaker: 'npc',
        name: nextNode.npcName || 'NPC',
        avatar: nextNode.npcAvatar || '👤',
        text: nextNode.npcText
      });

      // Handle terminal completion states
      if (nextNode.isSuccess) {
        const state = AppState.getState();
        const earnedXp = nextNode.xpAward || 50;
        AppState.update('stats.xp', state.stats.xp + earnedXp);

        // Track completed scenario ID
        const completed = [...state.rpg.completedScenarios];
        if (!completed.includes(_currentConversationId)) {
          completed.push(_currentConversationId);
          AppState.update('rpg.completedScenarios', completed);
        }
      }
    }

    return getActiveState();
  }

  /**
   * Fetch current dialogue simulator state
   * @returns {Object}
   */
  function getActiveState() {
    if (!_conversations || !_currentNodeId) return null;

    const node = _conversations[_currentNodeId];
    return {
      currentNodeId: _currentNodeId,
      npcName: node.npcName || 'NPC',
      npcAvatar: node.npcAvatar || '👤',
      npcText: node.npcText,
      npcAudioText: node.npcAudioText,
      options: node.options || [],
      isSuccess: !!node.isSuccess,
      isFailure: !!node.isFailure,
      history: [..._history]
    };
  }

  return {
    init,
    startConversation,
    selectOption,
    getActiveState
  };
})();
