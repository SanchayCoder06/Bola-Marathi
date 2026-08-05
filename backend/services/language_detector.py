import re

class LanguageDetector:
    MARATHI_KEYWORDS = {'आहे', 'नाही', 'आणि', 'कुठे', 'केले', 'आलो', 'जात', 'आहेस', 'आहोत', 'तुम्ही', 'माझे', 'माझं', 'हे', 'ते', 'काय'}
    HINDI_KEYWORDS = {'है', 'हैं', 'और', 'कहाँ', 'किया', 'आया', 'गया', 'रहे', 'हूँ', 'आप', 'मेरा', 'कि', 'क्या', 'यह', 'वह'}

    @classmethod
    def detect(cls, text: str) -> dict:
        if not text or not text.strip():
            return {"language": "en", "confidence": 1.0}

        cleaned = text.strip()

        # Check ASCII / Latin letters count
        latin_chars = len(re.findall(r'[a-zA-Z]', cleaned))
        devanagari_chars = len(re.findall(r'[\u0900-\u097F]', cleaned))

        if latin_chars > devanagari_chars:
            return {"language": "en", "confidence": 0.99}

        if devanagari_chars > 0:
            # Check for Marathi specific characters like 'ळ' (U+0933) or 'ॲ' (U+0972)
            if re.search(r'[\u0933\u0972\u090d\u0911]', cleaned):
                return {"language": "mr", "confidence": 0.95}

            # Check vocabulary
            words = set(re.findall(r'[\u0900-\u097F]+', cleaned))
            mr_matches = len(words.intersection(cls.MARATHI_KEYWORDS))
            hi_matches = len(words.intersection(cls.HINDI_KEYWORDS))

            if mr_matches > hi_matches:
                return {"language": "mr", "confidence": 0.90}
            elif hi_matches > mr_matches:
                return {"language": "hi", "confidence": 0.90}

            # Default Devanagari fallback: assume Marathi for BOLA Marathi app if neutral
            return {"language": "mr", "confidence": 0.75}

        return {"language": "en", "confidence": 0.80}
