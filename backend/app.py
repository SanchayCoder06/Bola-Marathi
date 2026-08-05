import os
import sys
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

    result = translation_service.translate(
        text=text,
        source_lang=source_lang,
        target_lang=target_lang,
        direction=direction
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("==================================================")
    print("Registered Flask Route Table:")
    print(app.url_map)
    print("==================================================")
    print(f"Starting BOLA Multilingual & AI Tutor Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
