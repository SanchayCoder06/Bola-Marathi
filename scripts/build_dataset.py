import os
import sys
import unicodedata
import pandas as pd

# Reconfigure stdout for Windows unicode printing
sys.stdout.reconfigure(encoding='utf-8')

def normalize_text(text):
    if not isinstance(text, str):
        return ""
    # Trim whitespace and normalize unicode NFC
    cleaned = unicodedata.normalize('NFC', text.strip())
    return cleaned

def main():
    print("=" * 60)
    print("STEP 1 & STEP 2: Inspecting and Merging Parquet Datasets")
    print("=" * 60)

    file_hi = "train-00000-of-00008.parquet"
    file_mr = "train-00000-of-00002.parquet"

    print(f"Reading Hindi parquet dataset: {file_hi}...")
    df_hi = pd.read_parquet(file_hi)
    print(f"Hindi dataset schema: columns={df_hi.columns.tolist()}, rows={len(df_hi)}")

    print(f"Reading Marathi parquet dataset: {file_mr}...")
    df_mr = pd.read_parquet(file_mr)
    print(f"Marathi dataset schema: columns={df_mr.columns.tolist()}, rows={len(df_mr)}")

    # Step 1 Verification:
    # src is English sentence, tgt is translated sentence in both datasets
    print("\nNormalizing text and trimming whitespace...")
    df_hi['english'] = df_hi['src'].apply(normalize_text)
    df_hi['hindi'] = df_hi['tgt'].apply(normalize_text)

    df_mr['english'] = df_mr['src'].apply(normalize_text)
    df_mr['marathi'] = df_mr['tgt'].apply(normalize_text)

    # Filter out empty values
    df_hi = df_hi[(df_hi['english'] != "") & (df_hi['hindi'] != "")][['english', 'hindi']]
    df_mr = df_mr[(df_mr['english'] != "") & (df_mr['marathi'] != "")][['english', 'marathi']]

    print(f"Cleaned Hindi pairs: {len(df_hi)}")
    print(f"Cleaned Marathi pairs: {len(df_mr)}")

    # Drop duplicates on English key before merging
    df_hi = df_hi.drop_duplicates(subset=['english'])
    df_mr = df_mr.drop_duplicates(subset=['english'])

    print("\nMerging datasets on English sentence key...")
    df_merged = pd.merge(df_hi, df_mr, on='english', how='inner')

    # Reorder columns to English, Hindi, Marathi
    df_merged = df_merged[['english', 'hindi', 'marathi']]

    # Final cleanup: drop any duplicates across all 3 columns or missing values
    df_merged = df_merged.dropna().drop_duplicates()
    df_merged = df_merged[(df_merged['english'] != "") & (df_merged['hindi'] != "") & (df_merged['marathi'] != "")]

    print(f"\nFinal Merged Dataset Count: {len(df_merged)} trilingual rows")
    print("Sample rows:")
    for idx, row in df_merged.head(3).iterrows():
        print(f"  [{idx+1}] English: {row['english']}")
        print(f"       Hindi:   {row['hindi']}")
        print(f"       Marathi: {row['marathi']}")

    # Create data directory if not exists
    os.makedirs("data", exist_ok=True)

    parquet_out = os.path.join("data", "hindi_marathi_english.parquet")
    csv_out = os.path.join("data", "hindi_marathi_english.csv")

    print(f"\nSaving merged dataset to {parquet_out}...")
    df_merged.to_parquet(parquet_out, index=False)

    print(f"Exporting merged dataset to {csv_out}...")
    df_merged.to_csv(csv_out, index=False, encoding='utf-8')

    print("\nDataset merge complete!")

if __name__ == "__main__":
    main()
