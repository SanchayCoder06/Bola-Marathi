/**
 * BOLA Marathi — Conversation Engine
 * Core Engine Layer
 * 
 * Manages active dialogue trees, branching simulation choices, reputation awards,
 * history state tracking, and unlocks, pulling data directly from IndexedDB.
 */

import { DBService } from '../../infrastructure/storage/db.js';
import { AppState } from '../../application/state/appState.js';
import { apiClient } from '../../api/client.js';

export const ConversationEngine = (() => {
  let _currentConversationId = null;
  let _currentNodeId = null;
  let _history = [];

  async function startConversation(conversationId) {
    _currentConversationId = conversationId;
    _currentNodeId = conversationId;
    _history = [];

    // Query dialogue nodes from IndexedDB
    const node = await DBService.get('dialogueTrees', _currentNodeId);
    if (node) {
      _history.push({
        speaker: 'npc',
        name: node.npcName || 'NPC',
        avatar: node.npcAvatar || '👤',
        text: node.npcText,
        npcAudioText: node.npcAudioText
      });
    }

    return getActiveState();
  }

  async function selectOption(optionIndex) {
    if (!_currentConversationId || !_currentNodeId) return null;

    const currentNode = await DBService.get('dialogueTrees', _currentNodeId);
    if (!currentNode || !currentNode.options || !currentNode.options[optionIndex]) return null;

    const selectedOption = currentNode.options[optionIndex];

    _history.push({
      speaker: 'user',
      text: selectedOption.text
    });

    // Update reputation / XP impact
    if (selectedOption.reputationImpact) {
      const state = AppState.getState();
      const nextXp = Math.max(0, state.stats.xp + selectedOption.reputationImpact);
      AppState.update('stats.xp', nextXp);
    }

    _currentNodeId = selectedOption.nextId;
    const nextNode = await DBService.get('dialogueTrees', _currentNodeId);

    // Call POST /api/ai for dynamic AI insights & tutor feedback
    try {
      const aiResponse = await apiClient.ai({
        question: selectedOption.text,
        type: 'doubt'
      });

      if (aiResponse && (aiResponse.answer || aiResponse.corrected)) {
        const aiText = aiResponse.answer || aiResponse.corrected || '';
        if (aiText) {
          _history.push({
            speaker: 'npc',
            name: (nextNode && nextNode.npcName) ? nextNode.npcName : 'AI Tutor',
            avatar: (nextNode && nextNode.npcAvatar) ? nextNode.npcAvatar : '🤖',
            text: `💡 AI Insight: ${aiText}`
          });
        }
      }
    } catch (err) {
      console.warn("[ConversationEngine] POST /api/ai call skipped:", err);
    }

    if (nextNode) {
      _history.push({
        speaker: 'npc',
        name: nextNode.npcName || 'NPC',
        avatar: nextNode.npcAvatar || '👤',
        text: nextNode.npcText,
        npcAudioText: nextNode.npcAudioText
      });

      // Handle dialogue simulation success node rewards
      if (nextNode.isSuccess) {
        const state = AppState.getState();
        const earnedXp = nextNode.xpAward || 50;
        AppState.update('stats.xp', state.stats.xp + earnedXp);

        const completed = [...state.rpg.completedScenarios];
        if (!completed.includes(_currentConversationId)) {
          completed.push(_currentConversationId);
          AppState.update('rpg.completedScenarios', completed);
        }
      }
    }

    return getActiveState();
  }

  async function getActiveState() {
    if (!_currentNodeId) return null;
    const node = await DBService.get('dialogueTrees', _currentNodeId);
    if (!node) return null;

    return {
      npcName: node.npcName,
      npcAvatar: node.npcAvatar,
      npcText: node.npcText,
      npcAudioText: node.npcAudioText,
      options: node.options || [],
      isSuccess: !!node.isSuccess,
      isFailure: !!node.isFailure,
      history: [..._history]
    };
  }

  return {
    startConversation,
    selectOption,
    getActiveState
  };
})();
