import requests
import sys

sys.stdout.reconfigure(encoding='utf-8')

words = [
    'great',
    'awesome',
    'fantastic',
    'friend',
    'love',
    'beautiful',
    'computer',
    'window',
    'tree',
    'knowledge'
]

print("==================================================")
print("=== TESTING TRANSLATION PIPELINE FOR STEP 8 TEST WORDS ===")

for w in words:
    resp = requests.post("http://127.0.0.1:5000/api/translate", json={"text": w, "direction": "en_to_mr"})
    d = resp.json()
    src = d.get('source', 'unknown')
    en = d.get('english', '')
    hi = d.get('hindi', '')
    mr = d.get('marathi', '')
    print(f"Input: {w:<15} | Source: {src:<10} | EN: {en:<12} | HI: {hi:<18} | MR: {mr}")

print("==================================================")
