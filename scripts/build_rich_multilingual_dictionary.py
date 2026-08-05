import os
import sys
import json
import re

# Force UTF-8 stdout encoding on Windows shell
sys.stdout.reconfigure(encoding='utf-8')

# High-frequency bilingual lexical dictionary dictionary mappings for English & Hindi translations
MULTILINGUAL_DICTIONARY_LEXICON = [
  {"marathi": "अंगबळ", "english": "Physical Strength", "hindi": "शारीरिक शक्ति", "meaning": "अंगामधील ताकद, शारीरिक शक्ती किंवा बळ."},
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
  {"marathi": "धन्यवाद", "english": "Thank You", "hindi": "धन्यवाद / शुक्रिया", "meaning": "कृतज्ञता व्यक्त करण्यासाठी वापरला जाणारा शब्द."},
  {"marathi": "शुभ सकाळ", "english": "Good Morning", "hindi": "सुप्रभात", "meaning": "सकाळी केला जाणारा शुभेच्छादर्शक नमस्कार."},
  {"marathi": "शुभ रात्री", "english": "Good Night", "hindi": "शुभ रात्रि", "meaning": "रात्री झोपताना दिल्या जाणार्‍या शुभेच्छा."},
  {"marathi": "आई", "english": "Mother", "hindi": "माँ / माता", "meaning": "जन्मदात्री, माता."},
  {"marathi": "बाबा", "english": "Father", "hindi": "पिता / पिता जी", "meaning": "जन्मदाता, पिता."},
  {"marathi": "भाऊ", "english": "Brother", "hindi": "भाई", "meaning": "सहोदर पुरुष, बंधू."},
  {"marathi": "बहीण", "english": "Sister", "hindi": "बहन", "meaning": "सहोदर स्त्री, भगिनी."},
  {"marathi": "मुलगा", "english": "Son / Boy", "hindi": "बेटा / लड़का", "meaning": "पुत्र किंवा पुरुष अपत्य."},
  {"marathi": "मुलगी", "english": "Daughter / Girl", "hindi": "बेटी / लड़की", "meaning": "कन्या किंवा स्त्री अपत्य."}
]

def build_rich_dictionary():
    dict_map = {}

    def add_entry(marathi, english="", hindi="", meaning="", source="dictionary"):
        m_clean = marathi.strip()
        if not m_clean or len(m_clean.split()) > 3:
            return

        if m_clean not in dict_map:
            dict_map[m_clean] = {
                "marathi": m_clean,
                "english": english.strip(),
                "hindi": hindi.strip(),
                "meaning": meaning.strip(),
                "source": source
            }
        else:
            existing = dict_map[m_clean]
            if not existing["english"] and english:
                existing["english"] = english.strip()
            if not existing["hindi"] and hindi:
                existing["hindi"] = hindi.strip()
            if not existing["meaning"] and meaning:
                existing["meaning"] = meaning.strip()
            if source == "curated":
                existing["source"] = "curated"

    # 1. High frequency lexicon mappings
    for item in MULTILINGUAL_DICTIONARY_LEXICON:
        add_entry(item["marathi"], english=item["english"], hindi=item["hindi"], meaning=item["meaning"], source="curated")

    # 2. Curated public dictionary json
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
                    add_entry(m, english=e, hindi=h, meaning=exp, source="curated")
            print(f"Loaded curated dictionary words. Count so far: {len(dict_map)}")
        except Exception as err:
            print(f"Error loading curated dictionary json: {err}")

    # 3. Parse dictionaryCatalog.ts for curated multilingual words
    catalog_path = os.path.join("Frontend", "src", "lib", "data", "dictionaryCatalog.ts")
    if os.path.exists(catalog_path):
        try:
            content = open(catalog_path, "r", encoding="utf-8").read()
            w_list = re.findall(r'word:\s*["\'](.*?)["\']', content)
            e_list = re.findall(r'englishMeaning:\s*["\'](.*?)["\']', content)
            h_list = re.findall(r'hindiMeaning:\s*["\'](.*?)["\']', content)
            m_list = re.findall(r'meaningExplanation:\s*["\'](.*?)["\']', content)

            for i in range(min(len(w_list), len(e_list))):
                w = w_list[i]
                e = e_list[i]
                h = h_list[i] if i < len(h_list) else ""
                exp = m_list[i] if i < len(m_list) else ""
                add_entry(w, english=e, hindi=h, meaning=exp, source="curated")
            print(f"Loaded dictionaryCatalog.ts words. Count so far: {len(dict_map)}")
        except Exception as err:
            print(f"Error reading catalog: {err}")

    # 4. Load 38,597 Marathi definitions from marathi_dictionary1.json (NO OVERWRITING OF ENGLISH/HINDI)
    m_dict_path = "marathi_dictionary1.json"
    if os.path.exists(m_dict_path):
        try:
            with open(m_dict_path, "r", encoding="utf-8") as f:
                m_data = json.load(f)
                for m_word, m_meaning in m_data.items():
                    meaning_str = m_meaning if isinstance(m_meaning, str) else m_meaning.get("अर्थ", "")
                    add_entry(m_word, meaning=meaning_str, source="dictionary")
            print(f"Loaded marathi_dictionary1.json words. Total entries: {len(dict_map)}")
        except Exception as err:
            print(f"Error loading marathi_dictionary1.json: {err}")

    output_list = list(dict_map.values())
    en_count = sum(1 for x in output_list if x["english"])
    hi_count = sum(1 for x in output_list if x["hindi"])
    print(f"Total pure dictionary entries: {len(output_list)}")
    print(f"Entries with English translation: {en_count}")
    print(f"Entries with Hindi translation: {hi_count}")

    out_path = os.path.join("Frontend", "public", "data", "multilingual_dictionary.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output_list, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved merged multilingual dictionary to {out_path}")

if __name__ == "__main__":
    build_rich_dictionary()
