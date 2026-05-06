import re

with open("knowledgeBase.js", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")
current_key = None

for i, line in enumerate(lines):
    if "}" in line:
        current_key = None
        
    key_match = re.search(r'"([^"]+)"\s*:\s*\{', line)
    if key_match:
        current_key = key_match.group(1)

    if "explanation:" in line:
        sym = current_key if current_key else "this specific symptom"
        
        # Capitalize symptom for start of sentence
        sym_cap = sym.capitalize()
        sym_lower = sym.lower()
        
        long_desc = (
            f"{sym_cap} is a common health condition characterized by physical discomfort and physiological imbalance. "
            f"Common causes typically include temporary environmental stressors, physical strain, viral infections, or dietary changes. "
            f"Associated symptoms often involve mild inflammation, general malaise, or focused pain in the affected area. "
            f"Leading risk factors include a weakened immune system, lack of adequate sleep, or poor hydration, making the body more susceptible. "
            f"Basic prevention and daily management tips for {sym_lower} involve getting extended rest, staying well hydrated, avoiding further strain, "
            f"and seeking timely medical advice if the condition worsens beyond a few days to ensure safe and healthy long-term recovery."
        )
        
        # Determine prefix spacing
        prefix = line.split("explanation:")[0]
        
        # Only replace if it looks like the actual target definition
        if '`${data.explanation}' not in line and '${randomFallback.explanation}' not in line:
            lines[i] = f'{prefix}explanation: "{long_desc}",'

with open("knowledgeBase.js", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
