import os
import json
import requests
from typing import List, Dict, Any, Optional

NON_CHAT_KEYWORDS = [
    "tts", "speech", "audio", "live", "preview-tts", "imagen", "embedding", "realtime", "bidi"
]

def is_conversational_chat_model(model_name: str) -> bool:
    if not model_name:
        return False
    lower = model_name.lower()
    for kw in NON_CHAT_KEYWORDS:
        if kw in lower:
            return False
    return True

# World-Class Meera AI System Prompt for BOLA Marathi Application
MEERA_SYSTEM_PROMPT = """
You are Meera (मीरा), the heart and companion of the BOLA Marathi language learning application.
You are a warm, patient, encouraging, friendly, and highly intelligent Marathi language tutor (inspired by Duolingo Max, ChatGPT, and an expert Indian language companion).

CRITICAL RULE:
- NEVER repeat the same phrase or words in multiple formats/languages (such as Devanagari, English, and Romanized guides) in a single response unless the user explicitly asks you to translate a word or phrase.
- Just write normal, single-format conversational text in the language the user is speaking, or a natural blend of English and Marathi. Do not repeat words or sentences.

CORE PERSONALITY:
- Warm, positive, motivating, patient, and approachable.
- Speak naturally and conversationally like a human language tutor. Never sound robotic, overly academic, or formal.
- Always assume the learner is a complete beginner. Teach one concept at a time without overwhelming them.
- EMOJI RULE: Use MAXIMUM ONE emoji per response. Never spam or overuse emojis!

RESPONSE LENGTH RULES:
- Greetings & Casual Chat: Under 40 words.
- Direct Translations: Under 60 words.
- Vocabulary Questions: Under 80 words.
- Grammar Explanations: 100 to 150 words maximum.
- Never produce giant walls of text! Keep paragraphs short (maximum 3 short paragraphs).

TRILINGUAL PRESENTATION FORMAT:
- Speak and respond in natural, single-language conversational text (either Marathi, English, or mixed hinglish/marathish) like a normal human friend. Avoid repeating the same words/sentences in multiple formats or languages.
- ONLY use the trilingual format (1. Devanagari Marathi, 2. Romanized guide in slash brackets, 3. English translation) when the user explicitly asks you to translate a word/phrase, or asks for a vocabulary definition. Otherwise, just output normal, single-format conversational text.

SMART INTENT MODES:
1. CASUAL CHAT & GREETINGS:
   - If the user says "Hi", "Hello", "Thank you", or chats casually, respond warmly as a friendly companion. Do NOT turn casual conversation into a heavy grammar lecture!
2. TRANSLATIONS:
   - Provide the Marathi translation, Romanized pronunciation, and a short usage note. Avoid lengthy unnecessary fluff.
3. TUTORING & LESSONS:
   - Follow the flow: Teach -> Explain -> Example -> Practice -> Encourage.
4. SINGLE FOLLOW-UP QUESTION:
   - ALWAYS end your turn with EXACTLY ONE friendly follow-up question to encourage the learner (e.g., "Would you like to try pronouncing this?", "Shall we try another phrase?"). NEVER ask multiple questions at once!

VOICE / SPEECH OPTIMIZED:
- Keep sentences concise, natural, and easy to pronounce for audio playback.

PROGRESS & ENCOURAGEMENT:
- Celebrate progress, encourage effort, and correct mistakes politely and gently. Never shame or criticize the user.
"""

class ChatService:
    def __init__(self):
        self.default_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    def _discover_models_dynamically(self, api_key: str, api_version: str = "v1beta") -> List[str]:
        """Dynamically query Gemini API for available generateContent text chat models."""
        url = f"https://generativelanguage.googleapis.com/{api_version}/models?key={api_key}"
        try:
            resp = requests.get(url, timeout=10)
            if resp.ok:
                data = resp.json()
                raw_list = data.get("models", [])
                candidates = []
                for m in raw_list:
                    methods = m.get("supportedGenerationMethods", [])
                    name = m.get("name", "").replace("models/", "")
                    if "generateContent" in methods and is_conversational_chat_model(name):
                        candidates.append(name)
                # Flash models first priority
                flash_models = [c for c in candidates if "flash" in c.lower()]
                pro_models = [c for c in candidates if "pro" in c.lower() and c not in flash_models]
                others = [c for c in candidates if c not in flash_models and c not in pro_models]
                return flash_models + pro_models + others
        except Exception as e:
            print(f"[ChatService] Dynamic model discovery error: {e}")
        return []

    def chat(
        self,
        user_message: str,
        history: Optional[List[Dict[str, Any]]] = None,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        api_version: Optional[str] = None,
        fallback_models: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        active_key = api_key or self.default_api_key
        active_version = api_version or "v1beta"

        raw_candidates: List[str] = []
        if fallback_models and len(fallback_models) > 0:
            raw_candidates = list(fallback_models)
        
        if model and model.strip():
            if model.strip() not in raw_candidates:
                raw_candidates.insert(0, model.strip())

        # Filter out non-conversational TTS / Speech / Audio / Image / Embedding models
        filtered_candidates = [m for m in raw_candidates if is_conversational_chat_model(m)]

        if not filtered_candidates and active_key:
            discovered = self._discover_models_dynamically(active_key, active_version)
            if discovered:
                filtered_candidates = discovered

        active_model = filtered_candidates[0] if filtered_candidates else ""
        reason_for_choosing = (
            f"Selected top Flash text generation model '{active_model}' from {len(filtered_candidates)} verified chat models."
            if active_model else "No supported text chat models found."
        )

        masked_key = (active_key[:4] + "..." + active_key[-4:]) if active_key and len(active_key) > 8 else "NOT_SET"

        print("==================================================")
        print("[ChatService] Incoming AI Request")
        print(f"Loaded API Key: {masked_key}")
        print(f"Raw Available Models: {raw_candidates}")
        print(f"Filtered Text Chat Models: {filtered_candidates}")
        print(f"Chosen Model: {active_model}")
        print(f"Reason for Choosing: {reason_for_choosing}")
        print(f"API Version: {active_version}")
        print(f"Incoming User Prompt: {repr(user_message)}")
        print("==================================================")

        if not user_message or not user_message.strip():
            return {"answer": "Please enter a message.", "status": "error"}

        if not active_key:
            print("[ChatService] Error: No API key provided.")
            return {
                "answer": "Please add your Gemini API key in Settings to enable Meera AI companion features.",
                "status": "missing_key"
            }

        if not active_model:
            return {
                "answer": "No active Gemini text model found. Please check your API key in Settings.",
                "status": "error"
            }

        # Build clean, strictly alternating contents list for Gemini API
        contents: List[Dict[str, Any]] = []

        if history:
            for msg in history[-20:]:
                role = "user" if msg.get("role") == "user" else "model"
                text = (msg.get("answer") or msg.get("text") or msg.get("content") or "").strip()
                if not text:
                    continue

                if contents and contents[-1]["role"] == role:
                    contents[-1]["parts"][0]["text"] += f"\n{text}"
                else:
                    contents.append({
                        "role": role,
                        "parts": [{"text": text}]
                    })

        # Append current user prompt
        clean_user_msg = user_message.strip()
        if contents and contents[-1]["role"] == "user":
            contents[-1]["parts"][0]["text"] += f"\n{clean_user_msg}"
        else:
            contents.append({
                "role": "user",
                "parts": [{"text": clean_user_msg}]
            })

        if contents and contents[0]["role"] != "user":
            contents.pop(0)

        headers = {"Content-Type": "application/json"}
        payload = {
            "systemInstruction": {
                "parts": [{"text": MEERA_SYSTEM_PROMPT}]
            },
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 800
            }
        }

        models_to_try = filtered_candidates if filtered_candidates else [active_model]
        last_error_msg = ""
        last_status_code = 500

        for idx, target_model in enumerate(models_to_try):
            url = f"https://generativelanguage.googleapis.com/{active_version}/models/{target_model}:generateContent?key={active_key}"
            print(f"[ChatService] Attempting model [{idx+1}/{len(models_to_try)}]: {target_model}")

            try:
                resp = requests.post(url, json=payload, headers=headers, timeout=15)
                last_status_code = resp.status_code
                print(f"[ChatService] Model '{target_model}' Status Code: {resp.status_code}")

                if resp.ok:
                    data = resp.json()
                    print(f"[ChatService] Model Actually Used: {target_model}")
                    print(f"[ChatService] Gemini Response Snippet: {json.dumps(data, ensure_ascii=False)[:300]}...")

                    if data.get("candidates") and data["candidates"][0].get("content") and data["candidates"][0]["content"].get("parts"):
                        model_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        print(f"[ChatService] Successfully Extracted Response ({len(model_text)} chars)")
                        return {
                            "answer": model_text,
                            "en": "",
                            "status": "success",
                            "model": target_model,
                            "available_models": filtered_candidates,
                            "reason": f"Matched text generation model '{target_model}'"
                        }

                raw_err = resp.text
                try:
                    err_json = resp.json()
                    err_msg = err_json.get("error", {}).get("message", raw_err)
                except Exception:
                    err_msg = raw_err

                last_error_msg = err_msg
                print(f"[ChatService] Model '{target_model}' Error ({resp.status_code}): {err_msg}")

                is_retryable = (
                    resp.status_code in [400, 404, 429] or
                    "quota" in err_msg.lower() or
                    "resource_exhausted" in err_msg.lower() or
                    "not found" in err_msg.lower() or
                    "unsupported" in err_msg.lower()
                )

                if is_retryable and idx < len(models_to_try) - 1:
                    print(f"[ChatService] Issue on '{target_model}'. Auto-failing over to next candidate '{models_to_try[idx+1]}'...")
                    continue
                else:
                    break

            except Exception as err:
                import traceback
                print(f"[ChatService] Exception on model '{target_model}': {err}")
                last_error_msg = str(err)
                if idx < len(models_to_try) - 1:
                    continue
                break

        # Friendly user-facing error message (never expose raw JSON/stacktraces)
        friendly_error = "I'm having a brief connection hiccup with Gemini right now. Please check your API key in Settings or try again in a moment! 😊"
        return {
            "answer": friendly_error,
            "status": "error",
            "error_details": f"Status {last_status_code}: {last_error_msg}",
            "model": active_model,
            "available_models": filtered_candidates
        }
