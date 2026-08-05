/**
 * BOLA Marathi — AI Engine
 * Core Engine Layer
 * 
 * Manages queries to the Gemini AI serverless tutor endpoint, handles offline 
 * fallback tutors, and logs histories in the storage layer.
 */

import { AppState } from '../../application/state/appState.js';
import { StorageManager } from '../../infrastructure/storage/storageManager.js';
import { apiClient } from '../../api/client.js';

export const AIEngine = (() => {

  function _getMockCorrectResponse(sentence) {
    const clean = sentence.trim();
    const isCorrect = clean.endsWith('आहे') || clean.endsWith('आहे.') || clean.endsWith('आहेत') || clean.endsWith('आहेत.');
    
    return {
      isCorrect,
      corrected: isCorrect ? sentence : `${clean} आहे.`,
      explanation: isCorrect 
        ? "Looks perfect! The sentence structure matches correct Subject-Object-Verb (SOV) agreement in Marathi." 
        : "In Marathi, standard declarative statements require an auxiliary verb like 'आहे' (is) or 'आहेत' (are) at the end of the sentence.",
      improvements: isCorrect ? null : `Alternative: ${clean} आहे.`
    };
  }

  function _getMockDoubtResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('नमस्कार') || q.includes('hello')) {
      return {
        answer: "नमस्कार (Namaskar) is the traditional Marathi greeting. It shows respect and is used formally and informally to say hello or welcome someone.",
        examples: [
          { marathi: "नमस्कार, कसे आहात?", transliteration: "Namaskaar, kase aahaat?", english: "Hello, how are you?" }
        ]
      };
    }
    if (q.includes('water') || q.includes('पाणी')) {
      return {
        answer: "पाणी (Paani) means 'water' in Marathi. To ask for water politely, you can say: 'कृपया मला पाणी द्या' (Please give me water).",
        examples: [
          { marathi: "मला पाणी हवे आहे.", transliteration: "Mala paani have aahe.", english: "I want water." }
        ]
      };
    }
    if (q.includes('thank') || q.includes('धन्यवाद')) {
      return {
        answer: "धन्यवाद (Dhanyavaad) is the formal word for 'Thank you'. For informal settings, you can also use 'आभारी आहे' (I am grateful).",
        examples: [
          { marathi: "खूप खूप धन्यवाद.", transliteration: "Khoop khoop dhanyavaad.", english: "Thank you very much." }
        ]
      };
    }
    
    return {
      answer: `Offline AI Tutor: You asked about "${question}". Verbs in Marathi change endings based on subject gender and count: masculine -तो (शिकतो), feminine -ते (शिकते), and neuter -ते.`,
      examples: [
        { marathi: "मी शिकतो.", transliteration: "Mee shikto.", english: "I learn (masculine)." },
        { marathi: "मी शिकते.", transliteration: "Mee shikte.", english: "I learn (feminine)." }
      ]
    };
  }

  async function correctSentence(sentence) {
    if (!sentence || sentence.trim() === '') {
      throw new Error("Sentence is empty.");
    }

    const state = AppState.getState();
    let result = null;

    if (state.isOffline) {
      result = _getMockCorrectResponse(sentence);
    } else {
      try {
        result = await apiClient.correct({ sentence });
      } catch (e) {
        console.warn("[AIEngine] apiClient.correct failed, using mock:", e);
        result = _getMockCorrectResponse(sentence);
      }
    }

    await StorageManager.logAIQuery(`Correction: ${sentence}`, result.explanation).catch(() => {});
    return result;
  }

  async function askDoubt(question) {
    if (!question || question.trim() === '') {
      throw new Error("Question is empty.");
    }

    const state = AppState.getState();
    let result = null;

    if (state.isOffline) {
      result = _getMockDoubtResponse(question);
    } else {
      try {
        result = await apiClient.doubt({ question });
      } catch (e) {
        console.warn("[AIEngine] apiClient.doubt failed, using mock:", e);
        result = _getMockDoubtResponse(question);
      }
    }

    await StorageManager.logAIQuery(`Question: ${question}`, result.answer).catch(() => {});
    return result;
  }

  return {
    correctSentence,
    askDoubt
  };
})();
