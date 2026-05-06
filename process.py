import json

with open('symptoms.txt', 'r') as f:
    symptoms = [s.strip() for s in f.read().split('\n') if s.strip()]

new_entries = []
for s in symptoms:
    key = s.lower()
    entry = f"""    "{key}": {{
        explanation: "{s} could be caused by fatigue, environmental factors, or minor localized inflammation.",
        solution: "Rest and stay hydrated. Apply basic self-care and monitor the condition closely over the next 48 hours.",
        diet: "Eat a balanced diet rich in whole foods, vitamin C, and drink plenty of water to help your body recover.",
        followUps: ["How long have you been experiencing {key}?", "Is the feeling constant, or does it come and go?", "On a scale of 1 to 10, how severe is it?"]
    }}"""
    new_entries.append(entry)

with open('knowledgeBase.js', 'r') as f:
    kb = f.read()

inj_str = 'const explicitData = {\n'
idx = kb.find(inj_str) + len(inj_str)

new_kb = kb[:idx] + ',\n'.join(new_entries) + ',\n' + kb[idx:]

with open('knowledgeBase.js', 'w', encoding='utf-8') as f:
    f.write(new_kb)

print(f"Successfully injected {len(new_entries)} new symptom matrices into knowledgeBase.js.")
