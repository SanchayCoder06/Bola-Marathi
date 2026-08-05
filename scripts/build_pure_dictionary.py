import os
import sys
import json

# Reconfigure stdout for UTF-8 on Windows
sys.stdout.reconfigure(encoding='utf-8')

# High-frequency dictionary lexical mapping for English -> Marathi & Hindi dictionary entries
COMMON_DICTIONARY_MAPPINGS = [
  {"marathi": "मरणे", "english": "Die", "hindi": "मरना", "meaning": "जीवंत राहणे थांबणे, प्राण जाणे किंवा मृत्यू होणे."},
  {"marathi": "मृत्यू", "english": "Death / Die", "hindi": "मृत्यु", "meaning": "जीवनाचा शेवट, मरण किंवा प्राणांत."},
  {"marathi": "पाणी", "english": "Water", "hindi": "पानी", "meaning": "पिण्याचे जीवनोपयोगी द्रव, जल किंवा नीर."},
  {"marathi": "नमस्कार", "english": "Hello / Greetings", "hindi": "नमस्ते", "meaning": "आदरपूर्वक अभिवादन करण्यासाठी वापरला जाणारा शब्द."},
  {"marathi": "मित्र", "english": "Friend", "hindi": "मित्र / दोस्त", "meaning": "सखा, स्नेही किंवा जिवाभावाचा सोबती."},
  {"marathi": "पुस्तक", "english": "Book", "hindi": "किताब / पुस्तक", "meaning": "वाचनासाठी छापलेले किंवा लिहिलेले ग्रंथ."},
  {"marathi": "घर", "english": "House / Home", "hindi": "घर / मकान", "meaning": "राहण्याचे ठिकाण, निवासस्थान किंवा सदन."},
  {"marathi": "सूर्य", "english": "Sun", "hindi": "सूरज / सूर्य", "meaning": "प्रकाश आणि उष्णता देणारा मध्यवर्ती तारा, दिनकर."},
  {"marathi": "चंद्र", "english": "Moon", "hindi": "चाँद / चंद्रमा", "meaning": "पृथ्वीचा नैसर्गिक उपग्रह, शशी."},
  {"marathi": "अन्न", "english": "Food", "hindi": "खाना / अन्न", "meaning": "शरीराच्या पोषणासाठी खाल्ले जाणारे पदार्थ, आहार."},
  {"marathi": "काम", "english": "Work / Job", "hindi": "काम / कार्य", "meaning": "केलेले कार्य, व्यवसाय किंवा कर्तव्य."},
  {"marathi": "शाळा", "english": "School", "hindi": "स्कूल / विद्यालय", "meaning": "शिक्षण घेण्याचे आणि देण्याचे ठिकाण, विद्यालय."},
  {"marathi": "प्रेम", "english": "Love", "hindi": "प्यार / प्रेम", "meaning": "जिव्हाळा, आपुलकी किंवा प्रेमाची भावना."},
  {"marathi": "आनंद", "english": "Happy / Joy", "hindi": "खुशी / आनंद", "meaning": "समाधान, हर्ष किंवा उल्हासाची भावना."},
  {"marathi": "वेळ", "english": "Time", "hindi": "समय / वक्त", "meaning": "काल, तास किंवा वेळ."},
]

def build_pure_dictionary():
    dict_map = {}

    def add_entry(marathi, hindi="", english="", meaning="", source="dictionary"):
        m_clean = marathi.strip()
        # Strictly reject multi-word sentences (keep only dictionary words/terms <= 3 words)
        if not m_clean or len(m_clean.split()) > 3:
            return

        if m_clean not in dict_map:
            dict_map[m_clean] = {
                "marathi": m_clean,
                "hindi": hindi.strip(),
                "english": english.strip(),
                "meaning": meaning.strip(),
                "source": source
            }
        else:
            existing = dict_map[m_clean]
            if not existing["hindi"] and hindi:
                existing["hindi"] = hindi.strip()
            if not existing["english"] and english:
                existing["english"] = english.strip()
            if not existing["meaning"] and meaning:
                existing["meaning"] = meaning.strip()
            if source == "curated":
                existing["source"] = "curated"

    # 1. High frequency word mappings
    for item in COMMON_DICTIONARY_MAPPINGS:
        add_entry(item["marathi"], hindi=item["hindi"], english=item["english"], meaning=item["meaning"], source="curated")

    # 2. Curated dictionary entries (333 items)
    curated_path = os.path.join("Frontend", "public", "data", "dictionary", "dictionary.json")
    if os.path.exists(curated_path):
        try:
            with open(curated_path, "r", encoding="utf-8") as f:
                curated_data = json.load(f)
                for item in curated_data:
                    m = item.get("word", "")
                    e = item.get("englishMeaning", "")
                    h = item.get("hindiMeaning", "")
                    exp = item.get("meaningExplanation") or ""
                    add_entry(m, hindi=h, english=e, meaning=exp, source="curated")
            print(f"Loaded curated dictionary words. Count: {len(dict_map)}")
        except Exception as err:
            print(f"Error loading curated dictionary: {err}")

    # 3. Load 38,597 Marathi dictionary words & meanings (NO SENTENCES)
    m_dict_path = "marathi_dictionary1.json"
    if os.path.exists(m_dict_path):
        try:
            with open(m_dict_path, "r", encoding="utf-8") as f:
                m_data = json.load(f)
                for m_word, m_meaning in m_data.items():
                    meaning_str = m_meaning if isinstance(m_meaning, str) else m_meaning.get("अर्थ", "")
                    add_entry(m_word, meaning=meaning_str, source="dictionary")
            print(f"Loaded pure dictionary words from marathi_dictionary1.json. Total count: {len(dict_map)}")
        except Exception as err:
            print(f"Error loading marathi_dictionary1.json: {err}")

    output_list = list(dict_map.values())

    out_path = os.path.join("Frontend", "public", "data", "multilingual_dictionary.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output_list, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved {len(output_list)} PURE DICTIONARY WORDS (0 sentences) to {out_path}")

if __name__ == "__main__":
    build_pure_dictionary()
