/**
 * BOLA Marathi — Audio Engine
 * Infrastructure Layer
 * 
 * Provides local SpeechSynthesis (Text-to-Speech) using mr-IN Marathi voice,
 * SpeechRecognition (Speech-to-Text) listeners, background MediaRecorder capture,
 * and remote Gemini-powered assessment fallback integration.
 */

import { AppState } from '../../application/state/appState.js';

export const AudioEngine = (() => {
  let _speechRecognition = null;
  let _isListening = false;
  let _mediaRecorder = null;
  let _audioChunks = [];
  let _audioStream = null;

  function init() {
    const SpeechReg = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechReg) {
      _speechRecognition = new SpeechReg();
      _speechRecognition.continuous = false;
      _speechRecognition.interimResults = false;
      _speechRecognition.lang = 'mr-IN';
    } else {
      console.warn("SpeechRecognition API is not supported by this browser.");
    }
  }

  function _getStringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  function speak(text) {
    if (!text) return;
    
    // Attempt to play pre-recorded audio clip
    const hash = _getStringHash(text.trim());
    const audioUrl = `assets/audio/${hash}.mp3`;
    const audio = new Audio(audioUrl);
    
    audio.play()
      .then(() => {
        console.log(`Playing pre-recorded audio: ${audioUrl}`);
      })
      .catch(() => {
        console.log(`Pre-recorded audio not found, falling back to local SpeechSynthesis: "${text}"`);
        _speakSynthesis(text);
      });
  }

  function _speakSynthesis(text) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const settings = AppState.getState().settings;
    if (settings.playbackSpeed === 'slow') {
      utterance.rate = 0.65;
    } else if (settings.playbackSpeed === 'fast') {
      utterance.rate = 1.2;
    } else {
      utterance.rate = 0.95;
    }

    const voices = window.speechSynthesis.getVoices();
    const marathiVoice = voices.find(v => v.lang === 'mr-IN' || v.lang.startsWith('mr'));
    if (marathiVoice) {
      utterance.voice = marathiVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  async function listen(onResult, onError) {
    _isListening = true;
    _audioChunks = [];

    // 1. Initialize MediaRecorder background capture for fallback
    try {
      _audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      _mediaRecorder = new MediaRecorder(_audioStream);
      _mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          _audioChunks.push(event.data);
        }
      };
      _mediaRecorder.start();
    } catch (e) {
      console.warn("Could not start MediaRecorder:", e);
    }

    // 2. Start Web Speech Recognition if available
    if (_speechRecognition) {
      _speechRecognition.onstart = () => {
        _isListening = true;
      };

      _speechRecognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const text = event.results[0][0].transcript;
          if (onResult) onResult(text);
        } else {
          if (onError) onError("No speech recognized locally.");
        }
      };

      _speechRecognition.onerror = (event) => {
        console.warn("SpeechRecognition error:", event.error);
        // Do not fail immediately, MediaRecorder blob might be used online
      };

      _speechRecognition.onend = () => {
        // Handled in stopListening
      };

      try {
        _speechRecognition.start();
      } catch (e) {
        console.warn("Failed to start SpeechRecognition:", e);
      }
    } else {
      console.log("No native speech recognition available, recording audio blob only.");
    }
  }

  function stopListening() {
    _isListening = false;

    if (_speechRecognition) {
      try {
        _speechRecognition.stop();
      } catch (e) {}
    }

    return new Promise((resolve) => {
      if (_mediaRecorder && _mediaRecorder.state !== 'inactive') {
        _mediaRecorder.onstop = () => {
          const audioBlob = new Blob(_audioChunks, { type: 'audio/webm' });
          if (_audioStream) {
            _audioStream.getTracks().forEach(track => track.stop());
            _audioStream = null;
          }
          resolve(audioBlob);
        };
        _mediaRecorder.stop();
      } else {
        if (_audioStream) {
          _audioStream.getTracks().forEach(track => track.stop());
          _audioStream = null;
        }
        resolve(null);
      }
    });
  }

  function isCurrentlyListening() {
    return _isListening;
  }

  function getLevenshteinDistance(a, b) {
    const cleanA = a.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।]/g,"").trim().toLowerCase();
    const cleanB = b.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।]/g,"").trim().toLowerCase();

    if (cleanA.length === 0) return cleanB.length;
    if (cleanB.length === 0) return cleanA.length;

    const matrix = [];

    for (let i = 0; i <= cleanB.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= cleanA.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= cleanB.length; i++) {
      for (let j = 1; j <= cleanA.length; j++) {
        if (cleanB.charAt(i - 1) === cleanA.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[cleanB.length][cleanA.length];
  }

  function scorePronunciation(targetText, recognizedText) {
    const distance = getLevenshteinDistance(targetText, recognizedText);
    const maxLen = Math.max(targetText.length, recognizedText.length);
    if (maxLen === 0) return 100;
    
    const ratio = distance / maxLen;
    const percentage = Math.round((1 - ratio) * 100);
    return Math.max(0, percentage);
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function assessRemotePronunciation(expectedMarathi, audioBlob, expectedEnglish = "", expectedTransliteration = "") {
    const base64 = audioBlob ? await blobToBase64(audioBlob) : "";
    const parsed = await apiClient.assess({
      expectedMarathi,
      expectedTransliteration,
      expectedEnglish,
      userTranscription: "",
      audioBase64: base64,
      audioMimeType: audioBlob ? (audioBlob.type || 'audio/webm') : 'audio/webm'
    });

    return {
      score: parsed.score ?? 85,
      accuracy: parsed.accuracy ?? 'good',
      feedback: parsed.feedback ?? 'Good pronunciation clarity!',
      word_scores: parsed.word_scores ?? [],
      encouragement: parsed.encouragement ?? 'Keep practicing! 🌟'
    };
  }

  return {
    init,
    speak,
    listen,
    stopListening,
    isCurrentlyListening,
    scorePronunciation,
    assessRemotePronunciation
  };
})();
