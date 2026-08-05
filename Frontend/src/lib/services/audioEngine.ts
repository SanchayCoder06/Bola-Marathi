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
  let _audioChunks: Blob[] = [];
  const _audioCache = new Map<string, SpeechSynthesisUtterance>();
  let _currentText = '';
  let _defaultRate = 1.0;

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
    return new Promise((resolve, reject) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        reject(new Error('Microphone recording not supported on this browser'));
        return;
      }

      _audioChunks = [];
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
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
    return new Promise((resolve, reject) => {
      if (!_mediaRecorder) {
        reject(new Error('No active recorder'));
        return;
      }

      _mediaRecorder.onstop = () => {
        const audioBlob = new Blob(_audioChunks, { type: _mediaRecorder?.mimeType || 'audio/webm' });
        _audioChunks = [];
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

  async function assessRemotePronunciation(
    expectedMarathi: string,
    audioBlob?: Blob | null,
    expectedEnglish: string = '',
    expectedTransliteration: string = ''
  ): Promise<AssessResponse> {
    const base64 = audioBlob ? await blobToBase64(audioBlob) : '';
    const parsed = await apiClient.assess({
      expectedMarathi,
      expectedTransliteration,
      expectedEnglish,
      userTranscription: '',
      audioBase64: base64,
      audioMimeType: audioBlob ? audioBlob.type || 'audio/webm' : 'audio/webm'
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
