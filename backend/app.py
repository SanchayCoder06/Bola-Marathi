import os
import sys
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Reconfigure stdout for UTF-8 on Windows
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.translation_service import TranslationService
from backend.services.database_service import DatabaseService
from backend.services.chat_service import ChatService

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

db_service = DatabaseService(os.path.join("data", "bola_multilingual.db"))
translation_service = TranslationService(db_service)
chat_service = ChatService()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "BOLA Multilingual Translation & AI Tutor Layer"})

@app.route('/translate', methods=['GET', 'POST'])
def translate():
    data = {}
    if request.method == 'GET':
        text = request.args.get('text', '')
        source_lang = request.args.get('sourceLanguage') or request.args.get('source')
        target_lang = request.args.get('targetLanguage') or request.args.get('target')
        direction = request.args.get('direction')
    else: # POST
        data = request.get_json(silent=True) or {}
        text = data.get('text', '')
        source_lang = data.get('sourceLanguage') or data.get('source')
        target_lang = data.get('targetLanguage') or data.get('target')
        direction = data.get('direction')

    if not text:
        return jsonify({"error": "Query parameter 'text' is required"}), 400

    custom_api_key = request.headers.get('x-gemini-key') or data.get('api_key') or data.get('apiKey') or request.args.get('api_key') or request.args.get('apiKey')
    custom_model = request.headers.get('x-gemini-model') or data.get('model') or request.args.get('model')
    custom_version = request.headers.get('x-gemini-version') or data.get('version') or request.args.get('version')

    result = translation_service.translate(
        text=text,
        source_lang=source_lang,
        target_lang=target_lang,
        direction=direction,
        api_key=custom_api_key,
        model=custom_model,
        api_version=custom_version
    )
    return jsonify(result)

@app.route('/api/translate', methods=['GET', 'POST'])
def api_translate():
    return translate()

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'GET':
        query = request.args.get('query', '')
        limit = int(request.args.get('limit', 30))
    else:
        data = request.get_json(silent=True) or {}
        query = data.get('query', '') or data.get('text', '')
        limit = int(data.get('limit', 30))

    if not query:
        return jsonify({"error": "Field 'query' is required"}), 400

    results = translation_service.search(query=query, limit=limit)
    return jsonify({"results": results, "count": len(results)})

@app.route('/api/search', methods=['GET', 'POST'])
def api_search():
    return search()

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    print("==================================================")
    print("[App] 🚀 CHAT REQUEST STARTED")
    print(f"Method: {request.method}")
    print(f"Path: {request.path}")

    if request.method == 'GET':
        return jsonify({
            "status": "ok",
            "message": "Meera AI Chat API endpoint is active. Send a POST request with {'message': 'your question'} to chat."
        })

    data = request.get_json(silent=True) or {}
    user_message = data.get('message') or data.get('question') or data.get('prompt') or ''
    history = data.get('history') or []
    custom_api_key = request.headers.get('x-gemini-key') or data.get('api_key') or data.get('apiKey')
    custom_model = request.headers.get('x-gemini-model') or data.get('model')
    custom_version = request.headers.get('x-gemini-version') or data.get('version')
    raw_fallbacks = request.headers.get('x-gemini-fallback-models') or data.get('fallback_models')
    custom_fallback_models = [m.strip() for m in raw_fallbacks.split(',') if m.strip()] if isinstance(raw_fallbacks, str) else (raw_fallbacks if isinstance(raw_fallbacks, list) else None)

    if not user_message:
        print("[App] ❌ Error: Missing message parameter")
        return jsonify({"error": "Field 'message' or 'question' is required"}), 400

    print(f"[App] 🤖 Gemini Request Started for prompt: {repr(user_message[:50])}...")
    try:
        result = chat_service.chat(
            user_message=user_message,
            history=history,
            api_key=custom_api_key,
            model=custom_model,
            api_version=custom_version,
            fallback_models=custom_fallback_models
        )
        print("[App] ✅ Gemini Finished successfully.")
        print("[App] 📤 Response Returned to Frontend.")
        return jsonify(result)
    except Exception as exc:
        import traceback
        print(f"[App] 💥 Backend Exception during chat execution:\n{traceback.format_exc()}")
        return jsonify({
            "answer": "A server error occurred while processing your message.",
            "status": "error",
            "error_details": str(exc)
        }), 500

@app.route('/api/chat', methods=['GET', 'POST'])
def api_chat():
    return chat()

@app.route('/api/doubt', methods=['GET', 'POST'])
def api_doubt():
    return chat()

@app.route('/api/models', methods=['GET', 'POST'])
def api_models():
    api_key = request.headers.get('x-gemini-key')
    data = {}
    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
    
    if not api_key:
        api_key = data.get('api_key') or data.get('apiKey') or request.args.get('api_key') or request.args.get('apiKey')
        
    if not api_key:
        return jsonify({"error": "x-gemini-key header or api_key parameter is required"}), 400

    api_version = request.headers.get('x-gemini-version') or data.get('version') or request.args.get('version') or 'v1beta'
    
    url = f"https://generativelanguage.googleapis.com/{api_version}/models?key={api_key}"
    try:
        resp = requests.get(url, timeout=10)
        if resp.ok:
            return jsonify(resp.json()), 200
        else:
            try:
                err_data = resp.json()
            except Exception:
                err_data = {"error": resp.text}
            return jsonify(err_data), resp.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/assess', methods=['POST'])
def api_assess():
    data = request.get_json(silent=True) or {}
    
    # Extract API key
    api_key = request.headers.get('x-gemini-key') or data.get('api_key') or data.get('apiKey')
    if not api_key:
        api_key = chat_service.default_api_key
        
    if not api_key:
        return jsonify({"error": "Gemini API Key is not configured. Please add it in Settings."}), 400

    expected_marathi = data.get('expectedMarathi', '')
    expected_transliteration = data.get('expectedTransliteration', '')
    expected_english = data.get('expectedEnglish', '')
    user_transcription = data.get('userTranscription', '')
    audio_base64 = data.get('audioBase64', '')
    audio_mime_type = data.get('audioMimeType', 'audio/webm')

    # Construct the prompt
    if audio_base64:
        prompt = f"""You are an expert Marathi language pronunciation coach helping English-speaking learners.

TASK: Listen to the attached audio recording and assess the learner's Marathi pronunciation against the expected phrase.

EXPECTED PHRASE:
- Marathi (Devanagari): {expected_marathi}
- Transliteration: {expected_transliteration}
- English meaning: {expected_english}
{f"\nAUTO-TRANSCRIPTION (may be imperfect): {user_transcription}" if user_transcription else ""}

INSTRUCTIONS:
1. Listen carefully to the audio
2. Compare pronunciation, rhythm, and clarity to native Marathi
3. Identify specific sounds the learner got right or wrong

RESPOND with valid JSON in this exact format:
{{
  "score": <number 0-100>,
  "accuracy": "<excellent|good|fair|poor>",
  "feedback": "<1-2 sentence constructive feedback in English>",
  "word_scores": [
    {{
      "word": "<Marathi word>",
      "transliteration": "<transliteration>",
      "score": <number 0-100>,
      "tip": "<short pronunciation tip or null if good>"
    }}
  ],
  "encouragement": "<short motivational message with emoji>"
}}

SCORING GUIDE:
- 90-100 (excellent): Clear pronunciation, good rhythm, easily understood
- 70-89 (good): Mostly clear, minor accent issues
- 50-69 (fair): Understandable with effort, noticeable errors
- 0-49 (poor): Difficult to understand, needs significant practice

Be encouraging and constructive. Focus on actionable tips."""
    else:
        prompt = f"""You are an expert Marathi language pronunciation coach helping English-speaking learners.

TASK: Assess the learner's spoken Marathi by comparing their transcription to the expected phrase.

EXPECTED PHRASE:
- Marathi (Devanagari): {expected_marathi}
- Transliteration: {expected_transliteration}  
- English meaning: {expected_english}

LEARNER'S TRANSCRIPTION: {user_transcription or '(no transcription available)'}

RESPOND with valid JSON in this exact format:
{{
  "score": <number 0-100>,
  "accuracy": "<excellent|good|fair|poor>",
  "feedback": "<1-2 sentence constructive feedback in English>",
  "word_scores": [
    {{
      "word": "<Marathi word>",
      "transliteration": "<transliteration>",
      "score": <number 0-100>,
      "tip": "<short pronunciation tip or null if good>"
    }}
  ],
  "encouragement": "<short motivational message with emoji>"
}}

SCORING GUIDE:
- 90-100 (excellent): Near-perfect match, all words clear
- 70-89 (good): Most words correct, minor issues
- 50-69 (fair): Several errors but understandable
- 0-49 (poor): Significant difficulties, needs more practice

IMPORTANT:
- If no transcription is available, give a score of 50 with encouraging feedback to try again
- Focus on common English-speaker mistakes with Marathi sounds (retroflex consonants, nasalization, aspirated vs unaspirated)
- Be encouraging and constructive, never discouraging
- Keep tips practical and specific (e.g., "Touch your tongue to the roof of your mouth for ट")"""

    # Build Gemini payload
    parts = []
    if audio_base64:
        parts.append({
            "inlineData": {
                "mimeType": audio_mime_type,
                "data": audio_base64
            }
        })
    parts.append({"text": prompt})

    payload = {
        "contents": [{
            "parts": parts
        }],
        "generationConfig": {
            "temperature": 0.3,
            "topP": 0.8,
            "maxOutputTokens": 1024,
            "responseMimeType": "application/json"
        }
    }

    model = request.headers.get('x-gemini-model') or data.get('model') or 'gemini-1.5-flash'
    version = request.headers.get('x-gemini-version') or data.get('version') or 'v1beta'
    
    raw_fallbacks = request.headers.get('x-gemini-fallback-models') or data.get('fallback_models')
    fallback_models = []
    if isinstance(raw_fallbacks, str):
        fallback_models = [m.strip() for m in raw_fallbacks.split(',') if m.strip()]
    elif isinstance(raw_fallbacks, list):
        fallback_models = raw_fallbacks

    models_to_try = [model]
    for m in fallback_models:
        if m not in models_to_try:
            models_to_try.append(m)

    last_resp = None
    for idx, target_model in enumerate(models_to_try):
        url = f"https://generativelanguage.googleapis.com/{version}/models/{target_model}:generateContent?key={api_key}"
        print(f"[Assess Proxy] Trying model [{idx+1}/{len(models_to_try)}]: {target_model}")
        try:
            resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=20)
            last_resp = resp
            if resp.ok:
                print(f"[Assess Proxy] Model '{target_model}' succeeded.")
                return jsonify(resp.json()), 200
            
            err_msg = ""
            try:
                err_msg = resp.json().get("error", {}).get("message", "")
            except Exception:
                err_msg = resp.text
            
            print(f"[Assess Proxy] Model '{target_model}' failed with status {resp.status_code}: {err_msg}")
            
            # Failover if rate limited or model not found
            if resp.status_code in [404, 429] or "quota" in err_msg.lower() or "resource_exhausted" in err_msg.lower():
                print(f"[Assess Proxy] Attempting failover...")
                continue
            else:
                break
        except Exception as e:
            print(f"[Assess Proxy] Exception on model '{target_model}': {e}")
            continue

    if last_resp is not None:
        try:
            err_data = last_resp.json()
        except Exception:
            err_data = {"error": last_resp.text}
        return jsonify(err_data), last_resp.status_code
    return jsonify({"error": "Failed to contact any Gemini models."}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("==================================================")
    print("Registered Flask Route Table:")
    print(app.url_map)
    print("==================================================")
    print(f"Starting BOLA Multilingual & AI Tutor Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
