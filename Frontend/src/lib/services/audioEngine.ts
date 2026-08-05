/**
 * BOLA Marathi — Audio Engine
 * Provides local SpeechSynthesis (Text-to-Speech), cached utterance playback,
 * Play, Pause, Replay, SpeechRecognition listeners, and POST /api/assess pronunciation scoring.
 */

import { apiClient } from '../api/client';
import type { AssessResponse } from '../api/types';

export const AudioEngine = (() => {
  let _speechSynthesis: SpeechSynthesis | null = null;
  let _selectedVoice: SpeechSynthesisVoice | null = null;
  let _mediaRecorder: MediaRecorder | null = null;
  let _audioStream: MediaStream | null = null;
  let _audioChunks: Blob[] = [];
  const _audioCache = new Map<string, SpeechSynthesisUtterance>();
  let _currentText = '';
  let _defaultRate = 1.0;
  let _recognition: any = null;
  let _lastTranscript = "";

  function init(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      _speechSynthesis = window.speechSynthesis;
      const loadVoices = () => {
        const voices = _speechSynthesis?.getVoices() || [];
        _selectedVoice =
          voices.find((v) => v.lang === 'mr-IN' || v.lang.startsWith('mr')) ||
          voices.find((v) => v.lang.startsWith('hi')) ||
          voices[0] ||
          null;
      };

      loadVoices();
      if (_speechSynthesis && 'onvoiceschanged' in _speechSynthesis) {
        _speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  function setPlaybackRate(rate: number): void {
    _defaultRate = rate;
  }

  function clearCache(): void {
    _audioCache.clear();
    if (_speechSynthesis) {
      _speechSynthesis.cancel();
    }
  }

  function speak(text: string, rate: number = _defaultRate): Promise<void> {
    return new Promise((resolve) => {
      if (!_speechSynthesis) {
        init();
      }
      if (!_speechSynthesis) {
        resolve();
        return;
      }

      if (_speechSynthesis.paused && _currentText === text) {
        _speechSynthesis.resume();
        resolve();
        return;
      }

      _speechSynthesis.cancel();
      _currentText = text;

      let utterance = _audioCache.get(text);
      if (!utterance) {
        if (_audioCache.size >= 20) {
          const firstKey = _audioCache.keys().next().value;
          if (firstKey) _audioCache.delete(firstKey);
        }
        utterance = new SpeechSynthesisUtterance(text);
        if (_selectedVoice) {
          utterance.voice = _selectedVoice;
        }
        utterance.rate = rate;
        utterance.pitch = 1.0;
        _audioCache.set(text, utterance);
      } else {
        utterance.rate = rate;
      }

      utterance.onend = () => {
        _currentText = '';
        resolve();
      };
      utterance.onerror = () => {
        _currentText = '';
        resolve();
      };

      _speechSynthesis.speak(utterance);
    });
  }

  function pause(): void {
    if (_speechSynthesis && _speechSynthesis.speaking && !_speechSynthesis.paused) {
      _speechSynthesis.pause();
    }
  }

  function resume(): void {
    if (_speechSynthesis && _speechSynthesis.paused) {
      _speechSynthesis.resume();
    }
  }

  function replay(text: string, rate: number = _defaultRate): Promise<void> {
    if (_speechSynthesis) {
      _speechSynthesis.cancel();
    }
    return speak(text, rate);
  }

  function isPlaying(): boolean {
    return !!_speechSynthesis?.speaking && !_speechSynthesis?.paused;
  }

  function isPaused(): boolean {
    return !!_speechSynthesis?.paused;
  }

  function startRecording(): Promise<void> {
    _lastTranscript = "";
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          _recognition = new SpeechRecognition();
          _recognition.lang = "mr-IN";
          _recognition.interimResults = false;
          _recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join("");
            _lastTranscript = transcript;
          };
          _recognition.start();
        } catch (e) {
          console.warn("[AudioEngine] SpeechRecognition start failed:", e);
        }
      }
    }

    return new Promise((resolve, reject) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        reject(new Error('Microphone recording not supported on this browser'));
        return;
      }

      _audioChunks = [];
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          _audioStream = stream;
          _mediaRecorder = new MediaRecorder(stream);
          _mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) _audioChunks.push(e.data);
          };
          _mediaRecorder.start();
          resolve();
        })
        .catch(reject);
    });
  }

  function stopRecording(): Promise<Blob> {
    if (_recognition) {
      try {
        _recognition.stop();
      } catch (e) {}
    }

    return new Promise((resolve, reject) => {
      if (!_mediaRecorder) {
        reject(new Error('No active recorder'));
        return;
      }

      _mediaRecorder.onstop = () => {
        const audioBlob = new Blob(_audioChunks, { type: _mediaRecorder?.mimeType || 'audio/webm' });
        _audioChunks = [];

        if (_audioStream) {
          try {
            _audioStream.getTracks().forEach((track) => track.stop());
          } catch (e) {
            console.warn("[AudioEngine] Error stopping audio tracks:", e);
          }
          _audioStream = null;
        }

        resolve(audioBlob);
      };
      _mediaRecorder.stop();
    });
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        const base64data = res.includes(',') ? res.split(',')[1] : res;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function getLevenshteinDistance(a: string, b: string): number {
    const cleanA = a.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।]/g,"").trim().toLowerCase();
    const cleanB = b.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।]/g,"").trim().toLowerCase();

    if (cleanA.length === 0) return cleanB.length;
    if (cleanB.length === 0) return cleanA.length;

    const matrix: number[][] = [];

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

  function scorePronunciation(targetText: string, recognizedText: string): number {
    if (!recognizedText) return 0;
    const distance = getLevenshteinDistance(targetText, recognizedText);
    const maxLen = Math.max(targetText.length, recognizedText.length);
    if (maxLen === 0) return 100;
    
    const ratio = distance / maxLen;
    const percentage = Math.round((1 - ratio) * 100);
    return Math.max(0, percentage);
  }

  async function assessRemotePronunciation(
    expectedMarathi: string,
    audioBlob?: Blob | null,
    expectedEnglish: string = '',
    expectedTransliteration: string = ''
  ): Promise<AssessResponse> {
    const transcription = _lastTranscript;
    const base64 = audioBlob ? await blobToBase64(audioBlob) : '';
    
    try {
      const parsed = await apiClient.assess({
        expectedMarathi,
        expectedTransliteration,
        expectedEnglish,
        userTranscription: transcription,
        audioBase64: base64,
        audioMimeType: audioBlob ? audioBlob.type || 'audio/webm' : 'audio/webm'
      });

      if (parsed.score === 85 && parsed.feedback === "Good effort! Practice reading aloud." && transcription) {
        const localScore = scorePronunciation(expectedMarathi, transcription);
        let accuracy: "excellent" | "good" | "fair" | "poor" = "good";
        let feedback = `You pronounced: "${transcription}"`;
        let encouragement = "Keep practicing to improve matching!";
        if (localScore >= 90) {
          accuracy = "excellent";
          encouragement = "Perfect! Your pronunciation is spot on. 🌟";
        } else if (localScore >= 70) {
          accuracy = "good";
          encouragement = "Great job! Very close to the native pronunciation. 👍";
        } else if (localScore >= 45) {
          accuracy = "fair";
          encouragement = "Good attempt, try speaking more clearly. 😊";
        } else {
          accuracy = "poor";
          encouragement = "Keep learning and try again! 💪";
        }
        return {
          score: localScore,
          accuracy,
          feedback,
          word_scores: [],
          encouragement
        };
      }

      return {
        score: parsed.score ?? 85,
        accuracy: parsed.accuracy ?? 'good',
        feedback: parsed.feedback ?? 'Good pronunciation clarity!',
        word_scores: parsed.word_scores ?? [],
        encouragement: parsed.encouragement ?? 'Keep practicing! 🌟'
      };
    } catch (err: any) {
      console.warn("[AudioEngine] Remote assessment failed, calculating honest local feedback...", err);
      const localScore = transcription ? scorePronunciation(expectedMarathi, transcription) : 0;
      let accuracy: "excellent" | "good" | "fair" | "poor" = "poor";
      let feedback = transcription ? `Heard: "${transcription}"` : "Could not hear your speech. Make sure you speak close to the microphone.";
      let encouragement = "Keep learning and try again! 💪";
      
      if (localScore >= 90) {
        accuracy = "excellent";
        encouragement = "Excellent pronunciation! Spot on. 🌟";
      } else if (localScore >= 70) {
        accuracy = "good";
        encouragement = "Great effort! Very close to native speech. 👍";
      } else if (localScore >= 45) {
        accuracy = "fair";
        encouragement = "Keep practicing. You got a few sounds right. 😊";
      }

      return {
        score: localScore,
        accuracy,
        feedback,
        word_scores: [],
        encouragement
      };
    }
  }

  return {
    init,
    setPlaybackRate,
    clearCache,
    speak,
    pause,
    resume,
    replay,
    isPlaying,
    isPaused,
    startRecording,
    stopRecording,
    assessRemotePronunciation
  };
})();
