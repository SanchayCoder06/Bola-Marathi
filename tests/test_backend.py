import os
import sys

# Reconfigure stdout for UTF-8 on Windows
sys.stdout.reconfigure(encoding='utf-8')

# Ensure backend package can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.language_detector import LanguageDetector
from backend.services.database_service import DatabaseService
from backend.services.translation_memory import TranslationMemory
from backend.services.sentence_search import SentenceSearch
from backend.services.translation_service import TranslationService

def test_language_detector():
    print("\n--- Testing LanguageDetector ---")
    en = LanguageDetector.detect("Where are you going?")
    print("English test:", en)
    assert en["language"] == "en"

    hi = LanguageDetector.detect("तुम कहाँ जा रहे हो?")
    print("Hindi test:", hi)
    assert hi["language"] == "hi"

    mr = LanguageDetector.detect("तू कुठे जात आहेस?")
    print("Marathi test:", mr)
    assert mr["language"] == "mr"
    print("LanguageDetector passed!")

def test_database_service():
    print("\n--- Testing DatabaseService ---")
    db_service = DatabaseService("data/bola_multilingual.db")
    
    # Test adding a sample translation
    added = db_service.add_translation("Hello world", "नमस्ते दुनिया", "नमस्कार जग")
    print("Add translation result:", added)

    # Test exact lookup
    res_en = db_service.get_by_exact_match("Hello world", "en")
    print("Exact match English:", res_en)
    assert res_en is not None
    assert res_en["marathi"] == "नमस्कार जग"

    res_mr = db_service.get_by_exact_match("नमस्कार जग", "mr")
    print("Exact match Marathi:", res_mr)
    assert res_mr is not None
    assert res_mr["english"] == "Hello world"

    # Test full text search
    fts = db_service.search_full_text("Hello", limit=5)
    print("Full text search results:", len(fts))
    print("DatabaseService passed!")

def test_translation_service():
    print("\n--- Testing TranslationService ---")
    db_service = DatabaseService("data/bola_multilingual.db")
    service = TranslationService(db_service)

    # Database lookup test
    res1 = service.translate("Hello world")
    print("Translation result (DB):", res1)
    assert res1["marathi"] == "नमस्कार जग"
    assert res1["source"] == "database"

    # Search test
    s_res = service.search("Hello", limit=5)
    print("Search results count:", len(s_res))
    print("TranslationService passed!")

def main():
    print("==================================================")
    print("Running Multilingual Backend Unit Tests")
    print("==================================================")
    test_language_detector()
    test_database_service()
    test_translation_service()
    print("\nALL BACKEND UNIT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
