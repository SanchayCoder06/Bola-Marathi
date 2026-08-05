/**
 * Conversation Service for BOLA Marathi RPG Language Learning Game
 * Manages the flow of a learning conversation (no UI, no AI, no speech recognition).
 * Depends on ConversationLoader and ScenarioLoader.
 */
class ConversationService {
  constructor() {
    /** @private @type {Conversation|null} */
    this._currentConversation = null;
    /** @private @type {number} */
    this._currentDialogueIndex = 0;
    /** @private @type {number} */
    this._totalDialogueLines = 0;
    /** @private @type {boolean} */
    this._completed = false;
    /** @private @type {number|null} */
    this._startedAt = null;
    /** @private @type {number|null} */
    this._finishedAt = null;

    // Loader instances will be created lazily to avoid circular dependencies and allow dynamic imports
    /** @private @type {import('../core/ConversationLoader.js').ConversationLoader|null} */
    this._conversationLoader = null;
    /** @private @type {import('../core/ScenarioLoader.js').ScenarioLoader|null} */
    this._scenarioLoader = null;
    /** @private @type {Promise<void>|null} */
    this._loadersPromise = null;
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  async _ensureLoaders() {
    if (this._loadersPromise) return this._loadersPromise;
    this._loadersPromise = (async () => {
      try {
        // Dynamically import the loader modules
        const [convMod, scenMod] = await Promise.all([
          import('../core/ConversationLoader.js'),
          import('../core/ScenarioLoader.js')
        ]);
        this._conversationLoader = convMod.conversationLoader || new convMod.ConversationLoader();
        this._scenarioLoader = scenMod.scenarioLoader || new scenMod.ScenarioLoader();
      } catch (error) {
        console.error('Failed to load loader modules for ConversationService:', error);
        this._conversationLoader = null;
        this._scenarioLoader = null;
      }
    })();
    return this._loadersPromise;
  }

  /**
   * Start a conversation by scenario ID.
   * Loads the first conversation associated with the scenario.
   * @param {string} scenarioId - The ID of the scenario
   * @returns {Promise<boolean>} True if conversation started successfully
   */
  async startScenario(scenarioId) {
    await this._ensureLoaders();
    if (!this._conversationLoader) return false;

    // Get conversations for this scenario
    const conversations = await this._conversationLoader.getConversationByScenario(scenarioId);
    if (!conversations || conversations.length === 0) {
      console.warn(`No conversations found for scenario ${scenarioId}`);
      return false;
    }

    // Start with the first conversation
    return this._startConversationInternal(conversations[0]);
  }

  /**
   * Start a conversation by conversation ID.
   * @param {string} conversationId - The ID of the conversation
   * @returns {Promise<boolean>} True if conversation started successfully
   */
  async startConversation(conversationId) {
    await this._ensureLoaders();
    if (!this._conversationLoader) return false;

    const conversation = await this._conversationLoader.getConversation(conversationId);
    if (!conversation) {
      console.warn(`Conversation not found: ${conversationId}`);
      return false;
    }

    return this._startConversationInternal(conversation);
  }

  /**
   * @private
   * @param {import('../core/ConversationLoader.js').Conversation} conversation
   * @returns {boolean}
   */
  _startConversationInternal(conversation) {
    this._currentConversation = conversation;
    this._currentDialogueIndex = 0;
    this._totalDialogueLines = conversation.dialogue.length;
    this._completed = false;
    this._startedAt = Date.now();
    this._finishedAt = null;
    return true;
  }

  /**
   * Get the current dialogue line.
   * @returns {Object|null} The current dialogue line or null if not started/completed
   */
  getCurrentDialogue() {
    if (!this._currentConversation) return null;
    if (this._currentDialogueIndex < 0 || this._currentDialogueIndex >= this._totalDialogueLines) {
      return null;
    }
    return this._currentConversation.dialogue[this._currentDialogueIndex];
  }

  /**
   * Move to the next dialogue line.
   * @returns {boolean} True if moved, false if already at the end
   */
  next() {
    if (!this._currentConversation) return false;
    if (this._currentDialogueIndex >= this._totalDialogueLines - 1) {
      // Already at the last line; moving to next would complete
      this._currentDialogueIndex = this._totalDialogueLines; // set to one past last
      this._completed = true;
      this._finishedAt = Date.now();
      return false; // Did not move to a valid dialogue line
    }
    this._currentDialogueIndex++;
    return true;
  }

  /**
   * Move to the previous dialogue line.
   * @returns {boolean} True if moved, false if already at the beginning
   */
  previous() {
    if (!this._currentConversation) return false;
    if (this._currentDialogueIndex <= 0) return false;
    this._currentDialogueIndex--;
    // If we were completed and move back, we are no longer completed
    if (this._completed) {
      this._completed = false;
      this._finishedAt = null;
    }
    return true;
  }

  /**
   * Restart the conversation from the beginning.
   */
  restart() {
    if (!this._currentConversation) return;
    this._currentDialogueIndex = 0;
    this._completed = false;
    this._startedAt = Date.now();
    this._finishedAt = null;
  }

  /**
   * Check if the conversation is completed.
   * @returns {boolean}
   */
  isCompleted() {
    return this._completed;
  }

  /**
   * Get progress information.
   * @returns {Object}
   */
  getProgress() {
    return {
      currentConversation: this._currentConversation ? this._currentConversation.id : null,
      currentDialogueIndex: this._currentDialogueIndex,
      totalDialogueLines: this._totalDialogueLines,
      completed: this._completed,
      startedAt: this._startedAt,
      finishedAt: this._finishedAt,
      progressPercent: this._totalDialogueLines > 0 ? (this._currentDialogueIndex / this._totalDialogueLines) * 100 : 0
    };
  }
}

// Export a singleton instance
const conversationService = new ConversationService();
export { conversationService };

// Also export the class for direct instantiation if needed
export { ConversationService };