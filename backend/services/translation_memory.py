from typing import Optional, Dict, Any
from .database_service import DatabaseService

class TranslationMemory:
    def __init__(self, db_service: Optional[DatabaseService] = None):
        self.db_service = db_service or DatabaseService()

    def find_translation(self, text: str, source_lang: str) -> Optional[Dict[str, Any]]:
        return self.db_service.get_by_exact_match(text, source_lang)

    def save_translation(self, english: str, hindi: str, marathi: str) -> bool:
        return self.db_service.add_translation(english, hindi, marathi)
