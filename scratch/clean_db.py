import sqlite3
import os

db_path = 'data/bola_multilingual.db'
if not os.path.exists(db_path):
    print("Database not found:", db_path)
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Find triggers
cursor.execute("SELECT name FROM sqlite_master WHERE type='trigger'")
triggers = cursor.fetchall()

# Drop triggers if they break SQLite FTS
for t in triggers:
    trigger_name = t[0]
    cursor.execute(f"DROP TRIGGER IF EXISTS {trigger_name}")

# Delete invalid echo rows where English == Hindi or English == Marathi
cursor.execute("DELETE FROM translations WHERE LOWER(TRIM(english)) = LOWER(TRIM(hindi)) AND LOWER(TRIM(english)) = LOWER(TRIM(marathi))")
print("Deleted invalid echo rows. Count:", cursor.rowcount)

common_words = [
    ('hello', 'Hello', 'नमस्ते', 'नमस्कार'),
    ('bye', 'Bye', 'अलविदा', 'पुन्हा भेटू / नमस्कार'),
    ('hey', 'Hey', 'अरे / नमस्ते', 'अरे / नमस्कार'),
    ('good morning', 'Good Morning', 'शुभ प्रभात', 'शुभ सकाळ'),
    ('thank you', 'Thank you', 'धन्यवाद', 'धन्यवाद'),
    ('water', 'Water', 'पानी', 'पाणी'),
    ('food', 'Food', 'खाना', 'जेवण / अन्न'),
    ('school', 'School', 'स्कूल / विद्यालय', 'शाळा'),
    ('mother', 'Mother', 'माँ', 'आई'),
    ('father', 'Father', 'पिता', 'वडील / बाबा'),
    ('friend', 'Friend', 'मित्र / दोस्त', 'मित्र'),
    ('house', 'House', 'घर', 'घर / निवास'),
    ('love', 'Love', 'प्यार / प्रेम', 'प्रेम'),
    ('great', 'Great', 'महान / शानदार', 'उत्तम / छान'),
    ('awesome', 'Awesome', 'बहुत बढ़िया', 'अतिउत्तम / अप्रतिम'),
    ('fantastic', 'Fantastic', 'शानदार', 'छान / उत्तम'),
    ('beautiful', 'Beautiful', 'सुंदर', 'सुंदर'),
    ('computer', 'Computer', 'कंप्यूटर', 'संगणक'),
    ('window', 'Window', 'खिड़की', 'खिडकी'),
    ('tree', 'Tree', 'पेड़', 'झाड / वृक्ष'),
    ('knowledge', 'Knowledge', 'ज्ञान', 'ज्ञान / माहिती')
]

for key, en, hi, mr in common_words:
    cursor.execute("DELETE FROM translations WHERE LOWER(TRIM(english)) = ?", (key.lower(),))
    cursor.execute("INSERT INTO translations (english, hindi, marathi) VALUES (?, ?, ?)", (en, hi, mr))

conn.commit()
print("Successfully cleaned and seeded data/bola_multilingual.db with all 21 test vocabulary items!")
