import os
import sys
import json
import time
import requests
from typing import Dict, List, Any, Optional

sys.stdout.reconfigure(encoding='utf-8')

DICTIONARY_PATH = os.path.join("Frontend", "public", "data", "multilingual_dictionary.json")

def load_dictionary() -> List[Dict[str, str]]:
    if os.path.exists(DICTIONARY_PATH):
        try:
            with open(DICTIONARY_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as err:
            print(f"[UpdateDictionary] Load error: {err}")
    return []

def save_dictionary(entries: List[Dict[str, str]]):
    try:
        with open(DICTIONARY_PATH, "w", encoding="utf-8") as f:
            json.dump(entries, f, ensure_ascii=False, indent=2)
        print(f"[UpdateDictionary] Saved {len(entries)} entries to {DICTIONARY_PATH}")
    except Exception as err:
        print(f"[UpdateDictionary] Save error: {err}")

def fetch_wiktionary_translation(word: str) -> Optional[Dict[str, str]]:
    """Query Wiktionary API for Marathi word translations."""
    url = f"https://en.wiktionary.org/w/api.php?action=query&prop=extracts&exintro&titles={requests.utils.quote(word)}&format=json"
    try:
        resp = requests.get(url, timeout=5)
        if resp.ok:
            data = resp.json()
            pages = data.get("query", {}).get("pages", {})
            for page_id, page_data in pages.items():
                if page_id != "-1":
                    extract = page_data.get("extract", "")
                    if extract:
                        return {"english": extract[:100], "source": "wiktionary"}
    except Exception:
        pass
    return None

def fetch_gemini_enrichment(word: str, meaning: str = "") -> Optional[Dict[str, str]]:
    """AI-powered lexical fallback for Marathi -> English & Hindi translations."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    prompt = f"""Provide strict English and Hindi translations for the Marathi word: "{word}".
Context/Meaning in Marathi: "{meaning}"

Return ONLY a JSON object with exact keys "english" and "hindi".
Example: {{"english": "Water", "hindi": "पानी"}}"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"response_mime_type": "application/json"}
    }

    try:
        resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=8)
        if resp.ok:
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            return {
                "english": parsed.get("english", ""),
                "hindi": parsed.get("hindi", ""),
                "source": "online_enrichment"
            }
    except Exception as e:
        print(f"[UpdateDictionary] Gemini enrichment error for '{word}': {e}")
    return None

def update_dictionary(limit: int = 50):
    entries = load_dictionary()
    if not entries:
        print("[UpdateDictionary] Dictionary file is empty or missing.")
        return

    incomplete_count = 0
    enriched_count = 0

    print("==================================================")
    print("BOLA Marathi Dictionary Enrichment Utility")
    print(f"Total entries loaded: {len(entries)}")
    print("Scanning for missing English/Hindi translations...")
    print("==================================================")

    for idx, entry in enumerate(entries):
        marathi_word = entry.get("marathi", "")
        english_val = entry.get("english", "")
        hindi_val = entry.get("hindi", "")

        # Check if incomplete
        if not english_val or not hindi_val:
            incomplete_count += 1
            if enriched_count >= limit:
                break

            print(f"[{idx+1}/{len(entries)}] Enriching '{marathi_word}'...")

            # 1. Try Wiktionary API
            wik_res = fetch_wiktionary_translation(marathi_word)
            if wik_res and wik_res.get("english") and not english_val:
                entry["english"] = wik_res["english"]
                entry["source"] = "wiktionary"

            # 2. Fallback to AI Lexical API if still missing
            if not entry.get("english") or not entry.get("hindi"):
                ai_res = fetch_gemini_enrichment(marathi_word, entry.get("meaning", ""))
                if ai_res:
                    if not entry.get("english") and ai_res.get("english"):
                        entry["english"] = ai_res["english"]
                    if not entry.get("hindi") and ai_res.get("hindi"):
                        entry["hindi"] = ai_res["hindi"]
                    entry["source"] = ai_res.get("source", "online_enrichment")

            if entry.get("english") or entry.get("hindi"):
                enriched_count += 1
                # Save dictionary automatically after every successful lookup
                save_dictionary(entries)
                time.sleep(0.5)

    print("==================================================")
    print(f"Enrichment Complete!")
    print(f"Incomplete entries scanned: {incomplete_count}")
    print(f"Newly enriched entries: {enriched_count}")
    print("==================================================")

if __name__ == "__main__":
    max_count = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    update_dictionary(limit=max_count)
