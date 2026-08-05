/**
 * Conversation Loader for BOLA Marathi RPG Language Learning Game
 * Loads conversation data from JSON files in the data/conversations directory.
 * A Conversation is a structured learning dialogue used inside a Scenario.
 */
class ConversationLoader {
  /**
   * @typedef {Object} Conversation
   * @property {string} id - Unique identifier
   * @property {string} title - Conversation title
   * @property {string} scenarioId - ID of the scenario this conversation belongs to
   * @property {string} difficulty - Difficulty level (e.g., beginner, intermediate)
   * @property {number} estimatedMinutes - Estimated time to complete in minutes
   * @property {Array<Object>} participants - List of participants
   * @property {Array<Object>} dialogue - Dialogue lines
   * @property {string} summary - Summary of the conversation
   *
   * @typedef {Object} Participant
   * @property {string} id - Participant ID
   * @property {string} name - Participant name
   * @property {string} role - Role (e.g., vendor, customer, guide)
   * @property {string} avatar - Avatar image path
   * @property {string} language - Language spoken (e.g., Marathi, Hindi, English)
   *
   * @typedef {Object} DialogueLine
   * @property {string} speaker - ID of the participant speaking
   * @property {string} marathi - Marathi text
   * @property {string} transliteration - Roman transliteration
   * @property {string} english - English translation
   * @property {string} [audio] - Audio file path (optional)
   * @property {'speech'|'choice'|'question'|'pronunciation'|'information'|'completion'} type - Line type
   * @property {Array<Object>} [choices] - Optional: for choice/question type, each {id, text, ...}
   * @property {string} [hint] - Optional hint
   * @property {string} [grammarNote] - Optional grammar explanation
   * @property {string} [cultureNote] - Optional cultural note
   * @property {string} [correctAnswer] - Optional: for question type, the correct choice ID
   */

  constructor() {
    /** @private @type {Array<Conversation>|null} */
    this._allConversationsCache = null;
    /** @private @type {Map<string, Conversation>} */
    this._conversationByIdCache = new Map();
    /** @private @type {Map<string, Array<Conversation>>} */
    this._conversationsByScenarioCache = new Map();
  }

  /**
   * Load all conversations from the data/conversations directory.
   * @returns {Promise<Array<Conversation>>} Promise that resolves to an array of conversation objects
   */
  async loadConversations() {
    // Return cached result if available
    if (this._allConversationsCache !== null) {
      return this._allConversationsCache;
    }

    // Start loading and cache the promise
    this._allConversationsCache = this._loadAllConversationsInternal();
    return this._allConversationsCache;
  }

  /**
   * Get a conversation by its ID.
   * @param {string} id - The conversation ID
   * @returns {Promise<Conversation|null>} Promise that resolves to the conversation object or null if not found/invalid
   */
  async getConversation(id) {
    // Return cached result if available
    if (this._conversationByIdCache.has(id)) {
      return Promise.resolve(this._conversationByIdCache.get(id));
    }

    // Load the conversation, cache it, and return it
    const conversation = await this._loadConversationById(id);
    if (conversation) {
      this._conversationByIdCache.set(id, conversation);
      // Also cache by scenario for efficiency
      if (!this._conversationsByScenarioCache.has(conversation.scenarioId)) {
        this._conversationsByScenarioCache.set(conversation.scenarioId, []);
      }
      this._conversationsByScenarioCache.get(conversation.scenarioId).push(conversation);
    }
    return conversation || null;
  }

  /**
   * Get all conversations for a given scenario.
   * @param {string} scenarioId - The ID of the scenario
   * @returns {Promise<Array<Conversation>>} Promise that resolves to matching conversations
   */
  async getConversationByScenario? Wait, let user meant: implement getConversationByScenario.

We need to implement getConversationByScenario(scenarioId). Let's continue.

We'll implement method.

We'll correct.




Let's replace the content.

We need to write properly.


Let's write correct code now.


We'll replace the file.



Let's create new content.


<tool_call>
<function=Write>
<parameter=content>
/**
 * Conversation Loader for BOLA Marathi RPG Language Learning Game
 * Loads conversation data from JSON files in the data/conversations directory.
 * A Conversation is a structured learning dialogue used inside a Scenario.
 */
class ConversationLoader {
  /**
   * @typedef {Object} Conversation
   * @property {string} id - Unique identifier
   * @property {string} title - Conversation title
   * @property {string} scenarioId - ID of the scenario this conversation belongs to
   * @property {string} difficulty - Difficulty level (e.g., beginner, intermediate)
   * @property {number} estimatedMinutes - Estimated time to complete in minutes
   * @property {Array<Object>} participants - List of participants
   * @property {Array<Object>} dialogue - Dialogue lines
   * @property {string} summary - Summary of the conversation
   *
   * @typedef {Object} Participant
   * @property {string} id - Participant ID
   * @property {string} name - Participant name
   * @property {string} role - Role (e.g., vendor, customer, guide)
   * @property {string} avatar - Avatar image path
   * @property {string} language - Language spoken (e.g., Marathi, Hindi, English)
   *
   * @typedef {Object} DialogueLine
   * @property {string} speaker - ID of the participant speaking
   * @property {string} marathi - Marathi text
   * @property {string} transliteration - Roman transliteration
   * @property {string} english - English translation
   * @property {string} [audio] - Audio file path (optional)
   * @property {'speech'|'choice'|'question'|'pronunciation'|'information'|'completion'} type - Line type
   * @property {Array<Object>} [choices] - Optional: for choice/question type, each {id, text, ...}
   * @property {string} [hint] - Optional hint
   * @property {string} [grammarNote] - Optional grammar explanation
   * @property {string} [cultureNote] - Optional cultural note
   * @property {string} [correctAnswer] - Optional: for question type, the correct choice ID
   */

  constructor() {
    /** @private @type {Array<Conversation>|null} */
    this._allConversationsCache = null;
    /** @private @type {Map<string, Conversation>} */
    this._conversationByIdCache = new Map();
    /** @private @type {Map<string, Array<Conversation>>} */
    this._conversationsByScenarioCache = new Map();
  }

  /**
   * Load all conversations from the data/conversations directory.
   * @returns {Promise<Array<Conversation>>} Promise that resolves to an array of conversation objects
   */
  async loadConversations() {
    // Return cached result if available
    if (this._allConversationsCache !== null) {
      return this._allConversationsCache;
    }

    // Start loading and cache the promise
    this._allConversationsCache = this._loadAllConversationsInternal();
    return this._allConversationsCache;
  }

  /**
   * Get a conversation by its ID.
   * @param {string} id - The conversation ID
   * @returns {Promise<Conversation|null>} Promise that resolves to the conversation object or null if not found/invalid
   */
  async getConversation(id) {
    // Return cached result if available
    if (this._conversationByIdCache.has(id)) {
      return Promise.resolve(this._conversationByIdCache.get(id));
    }

    // Load the conversation, cache it, and return it
    const conversation = await this._loadConversationById(id);
    if (conversation) {
      this._conversationByIdCache.set(id, conversation);
      // Also cache by scenario for efficiency
      if (!this._conversationsByScenarioCache.has(conversation.scenarioId)) {
        this._conversationsByScenarioCache.set(conversation.scenarioId, []);
      }
      this._conversationsByScenarioCache.get(conversation.scenarioId).push(conversation);
    }
    return conversation || null;
  }

  /**
   * Get all conversations for a given scenario.
   * @param {string} scenarioId - The ID of the scenario
   * @returns {Promise<Array<Conversation>>} Promise that resolves to matching conversations
   */
  async getConversationByScenario(scenarioId) {
    // Check cache first
    if (this._conversationsByScenarioCache.has(scenarioId)) {
      return Promise.resolve(this._conversationsByScenarioCache.get(scenarioId));
    }

    // Load all conversations and filter by scenarioId
    const allConversations = await this.loadConversations();
    const filtered = allConversations.filter(conv => conv.scenarioId === scenarioId);
    // Cache the result
    this._conversationsByScenarioCache.set(scenarioId, filtered);
    return filtered;
  }

  /**
   * Search conversations by keyword in title or summary.
   * @param {string} keyword - The search term
   * @returns {Promise<Array<Conversation>>} Promise that resolves to matching conversations
   */
  async searchConversations(keyword) {
    const conversations = await this.loadConversations();
    const lowerKeyword = keyword.toLowerCase();
    return conversations.filter(conv =>
      conv.title.toLowerCase().includes(lowerKeyword) ||
      (conv.summary && conv.summary.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Clear the loader's cache.
   * Forces reload of all conversation data on next request.
   */
  clearCache() {
    this._allConversationsCache = null;
    this._conversationByIdCache.clear();
    this._conversationsByScenarioCache.clear();
  }

  /**
   * @private
   * @returns {Promise<Array<string>>} Promise that resolves to an array of conversation IDs
   */
  async _loadConversationIdsManifest() {
    try {
      const response = await fetch('../data/conversations.json');
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Conversation manifest not found: data/conversations.json');
        } else {
          console.warn(`Failed to load conversation manifest: HTTP ${response.status}`);
        }
        return [];
      }
      const data = await response.json();
      // Expecting manifest to be an array of conversation ID strings
      if (Array.isArray(data)) {
        return data.filter(id => typeof id === 'string' && id.trim() !== '');
      } else {
        console.warn('Conversation manifest is not an array of IDs');
        return [];
      }
    } catch (error) {
      console.error('Error loading conversation manifest:', error);
      return [];
    }
  }

  /**
   * @private
   * @param {string} id - The conversation ID
   * @returns {Promise<Conversation|null>} Promise that resolves to the conversation object or null if not found/invalid
   */
  async _loadConversationById(id) {
    try {
      const url = new URL(`../data/conversations/${id}.json`, window.location.href);
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Conversation file not found: ${id}.json`);
        } else {
          console.warn(`Failed to load conversation ${id}: HTTP ${response.status}`);
        }
        return null;
      }

      const data = await response.json();

      // Validate required fields
      if (this._isValidConversation(data)) {
        return data;
      } else {
        console.warn(`Invalid conversation data for ${id}`);
        return null;
      }
    } catch (error) {
      console.error(`Error loading conversation ${id}:`, error);
      return null;
    }
  }

  /**
   * @private
   * @param {Array<string>} ids - Array of conversation IDs
   * @returns {Promise<Array<Conversation>>} Promise that resolves to an array of conversation objects
   */
  async _loadAllConversationsInternal() {
    try {
      // Load the manifest to get the list of conversation IDs
      const conversationIds = await this._loadConversationIdsManifest();
      if (conversationIds.length === 0) {
        return [];
      }

      // Load each conversation file
      const conversationPromises = conversationIds.map(id => this._loadConversationById(id));
      const conversations = await Promise.all(conversationPromises);

      // Filter out any failed loads (null values) and cache valid ones
      const validConversations = conversations.filter(conv => conv !== null);
      validConversations.forEach(conv => {
        this._conversationByIdCache.set(conv.id, conv);
        // Cache by scenario
        if (!this._conversationsByScenarioCache.has(conv.scenarioId)) {
          this._conversationsByScenarioCache.set(conv.scenarioId, []);
        }
        this._conversationsByScenarioCache.get(conv.scenarioId).push(conv);
      });

      return validConversations;
    } catch (error) {
      console.error('Error loading all conversations:', error);
      return [];
    }
  }

  /**
   * @private
   * @param {Object} participant - The participant object to validate
   * @returns {boolean}
   */
  _isValidParticipant(participant) {
    return participant &&
      typeof participant.id === 'string' && participant.id.trim() !== '' &&
      typeof participant.name === 'string' && participant.name.trim() !== '' &&
      typeof participant.role === 'string' && participant.role.trim() !== '' &&
      typeof participant.avatar === 'string' && participant.avatar.trim() !== '' &&
      typeof participant.language === 'string' && participant.language.trim() !== '';
  }

  /**
   * @private
   * @param {Object} line - The dialogue line object to validate
   * @returns {boolean}
   */
  _isValidDialogueLine(line) {
    const validTypes = new Set(['speech', 'choice', 'question', 'pronunciation', 'information', 'completion']);
    return line &&
      typeof line.speaker === 'string' && line.speaker.trim() !== '' &&
      typeof line.marathi === 'string' && line.marathi.trim() !== '' &&
      typeof line.transliteration === 'string' && line.transliteration.trim() !== '' &&
      typeof line.english === 'string' && line.english.trim() !== '' &&
      (typeof line.audio === 'string' && line.audio.trim() !== '' || line.audio === undefined) &&
      typeof line.type === 'string' && validTypes.has(line.type) &&
      (Array.isArray(line.choices) || line.choices === undefined) &&
      (typeof line.hint === 'string' || line.hint === undefined) &&
      (typeof line.grammarNote === 'string' || line.grammarNote === undefined) &&
      (typeof line.cultureNote === 'string' || line.cultureNote === undefined) &&
      (typeof line.correctAnswer === 'string' || line.correctAnswer === undefined);
  }

  /**
   * @private
   * @param {Object} conversation - The conversation object to validate
   * @returns {boolean}
   */
  _isValidConversation(conversation) {
    return conversation &&
      typeof conversation.id === 'string' && conversation.id.trim() !== '' &&
      typeof conversation.title === 'string' && conversation.title.trim() !== '' &&
      typeof conversation.scenarioId === 'string' && conversation.scenarioId.trim() !== '' &&
      typeof conversation.difficulty === 'string' && conversation.difficulty.trim() !== '' &&
      typeof conversation.estimatedMinutes === 'number' && !isNaN(conversation.estimatedMinutes) &&
      Array.isArray(conversation.participants) && conversation.participants.every(p => this._isValidParticipant(p)) &&
      Array.isArray(conversation.dialogue) && conversation.dialogue.every(l => this._isValidDialogueLine(l)) &&
      typeof conversation.summary === 'string' && conversation.summary.trim() !== '';
  }
}

// Export a singleton instance
const conversationLoader = new ConversationLoader();
export { conversationLoader };

// Also export the class for direct instantiation if needed
export { ConversationLoader };