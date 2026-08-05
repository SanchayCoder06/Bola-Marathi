import os
import sys
import sqlite3
import pandas as pd

# Reconfigure stdout for Windows unicode printing
sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = os.path.join("data", "bola_multilingual.db")
PARQUET_PATH = os.path.join("data", "hindi_marathi_english.parquet")

def cleanup_old_db():
    for ext in ["", "-journal", "-wal", "-shm"]:
        p = DB_PATH + ext
        if os.path.exists(p):
            try:
                os.remove(p)
                print(f"Cleaned old DB file: {p}")
            except Exception as e:
                print(f"Notice when removing {p}: {e}")

def create_schema(conn):
    cursor = conn.cursor()

    # 1. Main translations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        english TEXT NOT NULL,
        hindi TEXT NOT NULL,
        marathi TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(english, hindi, marathi)
    );
    """)

    # 2. Indexes for fast exact lookup
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_english ON translations(english);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hindi ON translations(hindi);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_marathi ON translations(marathi);")

    # 3. Full-Text Search (FTS5) table
    cursor.execute("""
    CREATE VIRTUAL TABLE IF NOT EXISTS translations_fts USING fts5(
        english,
        hindi,
        marathi
    );
    """)

    conn.commit()
    print("Base schema, indexes, and FTS5 table created successfully.")

def setup_fts_triggers(conn):
    cursor = conn.cursor()

    # Triggers to sync FTS table on dynamic insertions/updates/deletions
    cursor.execute("""
    CREATE TRIGGER IF NOT EXISTS translations_ai AFTER INSERT ON translations BEGIN
        INSERT INTO translations_fts(rowid, english, hindi, marathi) 
        VALUES (new.id, new.english, new.hindi, new.marathi);
    END;
    """)

    cursor.execute("""
    CREATE TRIGGER IF NOT EXISTS translations_ad AFTER DELETE ON translations BEGIN
        INSERT INTO translations_fts(fts5, rowid, english, hindi, marathi) 
        VALUES ('delete', old.id, old.english, old.hindi, old.marathi);
    END;
    """)

    cursor.execute("""
    CREATE TRIGGER IF NOT EXISTS translations_au AFTER UPDATE ON translations BEGIN
        INSERT INTO translations_fts(fts5, rowid, english, hindi, marathi) 
        VALUES ('delete', old.id, old.english, old.hindi, old.marathi);
        INSERT INTO translations_fts(rowid, english, hindi, marathi) 
        VALUES (new.id, new.english, new.hindi, new.marathi);
    END;
    """)

    conn.commit()
    print("FTS5 sync triggers activated.")

def import_merged_dataset(conn, parquet_path):
    if not os.path.exists(parquet_path):
        raise FileNotFoundError(f"Merged dataset file not found at: {parquet_path}")

    print(f"\nReading merged parquet dataset from {parquet_path}...")
    df = pd.read_parquet(parquet_path)
    total_rows = len(df)
    print(f"Total rows in parquet dataset: {total_rows}")

    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM translations;")
    initial_count = cursor.fetchone()[0]

    print("Importing records into main SQLite translations table...")
    records = df[['english', 'hindi', 'marathi']].to_records(index=False)
    batch_size = 10000

    rows_inserted = 0
    for i in range(0, len(records), batch_size):
        batch = list(records[i:i + batch_size])
        cursor.executemany("""
        INSERT OR IGNORE INTO translations (english, hindi, marathi)
        VALUES (?, ?, ?);
        """, batch)
        conn.commit()
        rows_inserted += len(batch)
        if rows_inserted % 30000 == 0 or rows_inserted >= len(records):
            print(f"  Ingested {min(rows_inserted, len(records))}/{len(records)} rows into main table...")

    cursor.execute("SELECT COUNT(*) FROM translations;")
    final_count = cursor.fetchone()[0]
    new_records = final_count - initial_count

    print(f"\nMain table import complete! DB total rows: {final_count} (+{new_records} new)")

    # Build FTS5 index in batches
    print("Building FTS5 full-text search index in batches...")
    cursor.execute("SELECT MAX(id) FROM translations;")
    max_id = cursor.fetchone()[0] or 0

    fts_batch_size = 25000
    for start_id in range(1, max_id + 1, fts_batch_size):
        end_id = start_id + fts_batch_size - 1
        cursor.execute("""
        INSERT INTO translations_fts(rowid, english, hindi, marathi)
        SELECT id, english, hindi, marathi FROM translations
        WHERE id BETWEEN ? AND ?;
        """, (start_id, end_id))
        conn.commit()
        print(f"  Indexed FTS5 rows {start_id} to {min(end_id, max_id)}...")

    print("FTS5 index build complete!")

def main():
    print("=" * 60)
    print("STEP 3 & STEP 4: Creating Multilingual SQLite Database & Ingesting Data")
    print("=" * 60)

    os.makedirs("data", exist_ok=True)
    cleanup_old_db()

    conn = sqlite3.connect(DB_PATH)

    try:
        create_schema(conn)
        import_merged_dataset(conn, PARQUET_PATH)
        setup_fts_triggers(conn)
    finally:
        conn.close()

    print("\nDatabase initialization complete!")

if __name__ == "__main__":
    main()
