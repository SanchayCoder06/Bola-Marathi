import os
import sys
import json
import sqlite3

# Reconfigure stdout for UTF-8 on Windows
sys.stdout.reconfigure(encoding='utf-8')

def build_dictionary():
    dict_map = {}

    def add_entry(marathi, hindi="", english="", meaning="", source="local"):
        if not marathi or not marathi.strip():
            return
        key = marathi.strip()

        if key not in dict_map:
            dict_map[key] = {
                "marathi": key,
                "hindi": hindi.strip(),
                "english": english.strip(),
                "meaning": meaning.strip(),
                "source": source
            }
        else:
            existing = dict_map[key]
            if not existing["hindi"] and hindi:
                existing["hindi"] = hindi.strip()
            if not existing["english"] and english:
                existing["english"] = english.strip()
            if not existing["meaning"] and meaning:
                existing["meaning"] = meaning.strip()
            if source == "curated":
                existing["source"] = "curated"

    # 1. Load curated dictionary entries (333 items)
    curated_path = os.path.join("Frontend", "public", "data", "dictionary", "dictionary.json")
    if os.path.exists(curated_path):
        try:
            with open(curated_path, "r", encoding="utf-8") as f:
                curated_data = json.load(f)
                for item in curated_data:
                    m = item.get("word", "")
                    e = item.get("englishMeaning", "")
                    h = item.get("hindiMeaning", "")
                    exp = item.get("meaningExplanation") or item.get("exampleMarathi") or ""
                    add_entry(m, hindi=h, english=e, meaning=exp, source="curated")
            print(f"Loaded curated dictionary entries. Current count: {len(dict_map)}")
        except Exception as err:
            print(f"Error loading curated dictionary: {err}")

    # 2. Load 38,597 Marathi dictionary entries (words & meanings)
    m_dict_path = "marathi_dictionary1.json"
    if os.path.exists(m_dict_path):
        try:
            with open(m_dict_path, "r", encoding="utf-8") as f:
                m_data = json.load(f)
                for m_word, m_meaning in m_data.items():
                    meaning_str = m_meaning if isinstance(m_meaning, str) else m_meaning.get("अर्थ", "")
                    add_entry(m_word, meaning=meaning_str, source="marathi_dict")
            print(f"Loaded marathi_dictionary1.json entries. Current count: {len(dict_map)}")
        except Exception as err:
            print(f"Error loading marathi_dictionary1.json: {err}")

    # 3. Merge short words/phrases from 155,385 SQLite database records
    db_path = os.path.join("data", "bola_multilingual.db")
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT english, hindi, marathi FROM translations")
            rows = cursor.fetchall()
            db_added = 0
            for e_val, h_val, m_val in rows:
                if m_val and len(m_val.split()) <= 4:
                    clean_m = m_val.strip()
                    if clean_m in dict_map:
                        existing = dict_map[clean_m]
                        if not existing["english"] and e_val:
                            existing["english"] = e_val.strip()
                        if not existing["hindi"] and h_val:
                            existing["hindi"] = h_val.strip()
                    else:
                        add_entry(clean_m, hindi=h_val, english=e_val, source="bola_db")
                        db_added += 1
            print(f"Merged SQLite bola_multilingual.db entries. Total dictionary count: {len(dict_map)} (Added: {db_added})")
        except Exception as err:
            print(f"Error merging SQLite database: {err}")

    output_list = list(dict_map.values())

    out_path = os.path.join("Frontend", "public", "data", "multilingual_dictionary.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output_list, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved {len(output_list)} entries to {out_path}")

if __name__ == "__main__":
    build_dictionary()
