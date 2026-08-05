from typing import List, Dict, Any, Optional
from .database_service import DatabaseService

class SentenceSearch:
    def __init__(self, db_service: Optional[DatabaseService] = None):
        self.db_service = db_service or DatabaseService()

    def search(self, query: str, source_lang: str = "en", limit: int = 10) -> List[Dict[str, Any]]:
        # 1. Exact match check
        exact_match = self.db_service.get_by_exact_match(query, source_lang)
        results = []

        if exact_match:
            exact_match["confidence"] = 1.0
            exact_match["match_type"] = "exact"
            results.append(exact_match)

        # 2. Full-text search
        fts_matches = self.db_service.search_full_text(query, limit=limit)
        existing_ids = {r["id"] for r in results}

        for match in fts_matches:
            if match["id"] not in existing_ids:
                match["confidence"] = 0.85
                match["match_type"] = "full_text"
                results.append(match)

        return results
