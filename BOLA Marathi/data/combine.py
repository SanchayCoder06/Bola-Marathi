import json, os

files = [
    r'c:\Translation\data\_m1_m2.json',
    r'c:\Translation\data\_m3_m4.json',
    r'c:\Translation\data\_m5_m8.json',
    r'c:\Translation\data\_m9_m12.json'
]

combined_modules = []

for fpath in files:
    if not os.path.exists(fpath):
        print(f"Error: File {fpath} does not exist!")
        exit(1)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        combined_modules.extend(data)

# Sort by module ID to ensure logical order (m1, m2, ... m12)
def get_mod_num(m):
    # Extract number from "m1", "m12" etc.
    return int(m['id'][1:])

combined_modules.sort(key=get_mod_num)

final_data = {
    "modules": combined_modules
}

output_path = r'c:\Translation\data\lessons.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)

print("=== Curriculum Compilation Successful ===")
print(f"Total Modules: {len(combined_modules)}")
print(f"Module Order: {[m['id'] for m in combined_modules]}")

total_lessons = 0
total_phrases = 0

for m in combined_modules:
    lessons_in_mod = len(m['lessons'])
    phrases_in_mod = sum(len(l['phrases']) for l in m['lessons'])
    print(f"- {m['id']} ({m['title']}): {lessons_in_mod} lessons, {phrases_in_mod} phrases")
    total_lessons += lessons_in_mod
    total_phrases += phrases_in_mod

print(f"Total Lessons Compiled: {total_lessons}")
print(f"Total Phrases Compiled: {total_phrases}")
print(f"Output saved to: {output_path}")
