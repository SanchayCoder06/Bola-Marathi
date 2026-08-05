import os
import sqlite3
import unicodedata
from typing import Optional, List, Dict, Any

class DatabaseService:
    def __init__(self, db_path: str = "data/bola_multilingual.db"):
        self.db_path = db_path

    def get_connection(self) -> sqlite3.Connection:
        if not os.path.exists(self.db_path):
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    @staticmethod
    def _normalize(text: str) -> str:
        if not text:
            return ""
        return unicodedata.normalize('NFC', text.strip())

    def get_by_exact_match(self, text: str, lang: str = "en") -> Optional[Dict[str, Any]]:
        norm_text = self._normalize(text)
        if not norm_text:
            return None

        query = """
        SELECT id, english, hindi, marathi FROM translations 
        WHERE LOWER(english) = LOWER(?) OR LOWER(hindi) = LOWER(?) OR LOWER(marathi) = LOWER(?);
        """

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (norm_text, norm_text, norm_text))
            rows = cursor.fetchall()
            for r in rows:
                d = dict(r)
                en = d.get('english', '').strip().lower()
                hi = d.get('hindi', '').strip().lower()
                mr = d.get('marathi', '').strip().lower()
                
                # Reject invalid echo rows where english == hindi == marathi OR english == marathi
                if en == hi == mr or en == mr or (norm_text.isascii() and mr == norm_text.lower()):
                    print(f"[DatabaseService] Rejecting invalid DB record: {d}")
                    continue
                return d
        return None

    def search_full_text(self, search_query: str, limit: int = 30, offset: int = 0) -> List[Dict[str, Any]]:
        norm_query = self._normalize(search_query)
        if not norm_query:
            return self.get_all_paginated(limit=limit, offset=offset)

        results: List[Dict[str, Any]] = []
        seen_ids = set()

        with self.get_connection() as conn:
            cursor = conn.cursor()

            # 1. Exact match query
            cursor.execute("""
            SELECT id, english, hindi, marathi, 100 as match_score
            FROM translations
            WHERE LOWER(english) = LOWER(?) OR LOWER(hindi) = LOWER(?) OR LOWER(marathi) = LOWER(?)
            LIMIT ?;
            """, (norm_query, norm_query, norm_query, limit))
            for row in cursor.fetchall():
                r = dict(row)
                if r['id'] not in seen_ids:
                    seen_ids.add(r['id'])
                    results.append(r)

            # 2. Prefix & Suffix match query
            if len(results) < limit:
                prefix_pattern = f"{norm_query}%"
                suffix_pattern = f"%{norm_query}"
                cursor.execute("""
                SELECT id, english, hindi, marathi, 75 as match_score
                FROM translations
                WHERE (english LIKE ? OR hindi LIKE ? OR marathi LIKE ?)
                   OR (english LIKE ? OR hindi LIKE ? OR marathi LIKE ?)
                LIMIT ?;
                """, (prefix_pattern, prefix_pattern, prefix_pattern, suffix_pattern, suffix_pattern, suffix_pattern, limit - len(results)))
                for row in cursor.fetchall():
                    r = dict(row)
                    if r['id'] not in seen_ids:
                        seen_ids.add(r['id'])
                        results.append(r)

            # 3. FTS5 & Substring Search Fallback
            if len(results) < limit:
                fts_pattern = f'"{norm_query}"*'
                try:
                    cursor.execute("""
                    SELECT t.id, t.english, t.hindi, t.marathi, 50 as match_score
                    FROM translations_fts fts
                    JOIN translations t ON t.id = fts.rowid
                    WHERE translations_fts MATCH ?
                    LIMIT ?;
                    """, (fts_pattern, limit - len(results)))
                    for row in cursor.fetchall():
                        r = dict(row)
                        if r['id'] not in seen_ids:
                            seen_ids.add(r['id'])
                            results.append(r)
                except sqlite3.OperationalError:
                    like_pattern = f"%{norm_query}%"
                    cursor.execute("""
                    SELECT id, english, hindi, marathi, 50 as match_score
                    FROM translations
                    WHERE english LIKE ? OR hindi LIKE ? OR marathi LIKE ?
                    LIMIT ?;
                    """, (like_pattern, like_pattern, like_pattern, limit - len(results)))
                    for row in cursor.fetchall():
                        r = dict(row)
                        if r['id'] not in seen_ids:
                            seen_ids.add(r['id'])
                            results.append(r)

        return results

    def get_all_paginated(self, limit: int = 30, offset: int = 0) -> List[Dict[str, Any]]:
        query = "SELECT id, english, hindi, marathi FROM translations LIMIT ? OFFSET ?;"
        results = []
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (limit, offset))
            for row in cursor.fetchall():
                results.append(dict(row))
        return results

    def add_translation(self, english: str, hindi: str, marathi: str) -> bool:
        norm_en = self._normalize(english)
        norm_hi = self._normalize(hindi)
        norm_mr = self._normalize(marathi)

        if not norm_en or not norm_hi or not norm_mr:
            return False

        if norm_en.strip().lower() == norm_hi.strip().lower() == norm_mr.strip().lower():
            return False

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR IGNORE INTO translations (english, hindi, marathi)
            VALUES (?, ?, ?);
            """, (norm_en, norm_hi, norm_mr))
            conn.commit()
            return cursor.rowcount > 0
