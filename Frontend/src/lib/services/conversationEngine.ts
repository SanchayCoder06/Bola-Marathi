/**
 * BOLA Marathi — Conversation Engine
 * Handles dialogue simulation choices, state tracking, and POST /api/ai dynamic tutor insights.
 */

import { DBService } from './db';
import { apiClient } from '../api/client';

export interface ChatHistoryItem {
  speaker: 'user' | 'npc';
  name?: string;
  avatar?: string;
  text: string;
  npcAudioText?: string;
}

export interface ConversationState {
  npcName: string;
  npcAvatar: string;
  npcText: string;
  npcAudioText?: string;
  options: { text: string; reputationImpact?: number; nextId?: string }[];
  isSuccess: boolean;
  isFailure: boolean;
  history: ChatHistoryItem[];
}

export const ConversationEngine = (() => {
  let _currentConversationId: string | null = null;
  let _currentNodeId: string | null = null;
  let _history: ChatHistoryItem[] = [];

  async function startConversation(conversationId: string): Promise<ConversationState | null> {
    _currentConversationId = conversationId;
    _currentNodeId = conversationId;
    _history = [];

    const node = await DBService.get('dialogueTrees', _currentNodeId);
    if (node) {
      _history.push({
        speaker: 'npc',
        name: node.npcName || 'NPC',
        avatar: node.npcAvatar || '👤',
        text: node.npcText,
        npcAudioText: node.npcAudioText
      });
    } else {
      // Fallback node if DB empty
      _history.push({
        speaker: 'npc',
        name: 'Kaka (Shopkeeper)',
        avatar: '👨‍🍳',
        text: 'नमस्कार! तुम्हाला काय हवे आहे? (Namaskar! Tumhala kay have aahe?)'
      });
    }

    return getActiveState();
  }

  async function selectOption(optionIndex: number): Promise<ConversationState | null> {
    if (!_currentNodeId) return null;

    const currentNode = await DBService.get('dialogueTrees', _currentNodeId);
    let selectedText = '';
    let nextId = '';

    if (currentNode && currentNode.options && currentNode.options[optionIndex]) {
      selectedText = currentNode.options[optionIndex].text;
      nextId = currentNode.options[optionIndex].nextId;
    } else {
      selectedText = optionIndex === 0 ? 'एक कप गरम चहा द्या. (One hot tea please)' : 'पाणी हवे आहे. (I want water)';
    }

    _history.push({
      speaker: 'user',
      text: selectedText
    });

    try {
      const aiResponse = await apiClient.ai({
        question: selectedText,
        type: 'doubt'
      });

      if (aiResponse && ('answer' in aiResponse || 'corrected' in aiResponse)) {
        const aiText = (aiResponse as any).answer || (aiResponse as any).corrected || '';
        if (aiText) {
          _history.push({
            speaker: 'npc',
            name: 'AI Tutor',
            avatar: '🤖',
            text: `💡 AI Insight: ${aiText}`
          });
        }
      }
    } catch (err) {
      console.warn('[ConversationEngine] AI call skipped:', err);
    }

    if (nextId) {
      _currentNodeId = nextId;
      const nextNode = await DBService.get('dialogueTrees', _currentNodeId);
      if (nextNode) {
        _history.push({
          speaker: 'npc',
          name: nextNode.npcName || 'NPC',
          avatar: nextNode.npcAvatar || '👤',
          text: nextNode.npcText,
          npcAudioText: nextNode.npcAudioText
        });
      }
    }

    return getActiveState();
  }

  async function getActiveState(): Promise<ConversationState | null> {
    const node = _currentNodeId ? await DBService.get('dialogueTrees', _currentNodeId) : null;

    return {
      npcName: node?.npcName || 'Meera — Chai wali',
      npcAvatar: node?.npcAvatar || '☕',
      npcText: node?.npcText || 'नमस्कार! चहा घेणार का? (Namaskar! Chaha ghenar ka?)',
      npcAudioText: node?.npcAudioText || 'नमस्कार',
      options: node?.options || [
        { text: 'हो, एक कप कटिंग चहा द्या. (Yes, give me one cutting chai.)' },
        { text: 'नाही, मला पाणी हवे आहे. (No, I want water.)' }
      ],
      isSuccess: !!node?.isSuccess,
      isFailure: !!node?.isFailure,
      history: [..._history]
    };
  }

  return {
    startConversation,
    selectOption,
    getActiveState
  };
})();
