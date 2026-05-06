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
        
        long_desc = (
            f"When you experience {sym}, it is crucial to understand that your body is signaling an underlying imbalance. "
            f"The occurrence of {sym} could be caused by a variety of distinct factors including temporary fatigue, "
            f"minor environmental stressors, or early stages of localized cellular inflammation. In most typical scenarios, "
            f"these instances are mild and represent your robust immune and neurological systems working together seamlessly "
            f"to maintain physiological equilibrium. However, the consistent presence of {sym} can sometimes point "
            f"toward common viral infections, unexpected muscular strain, sudden dietary shifts, or chronic emotional stress "
            f"affecting your overall daily well-being. Evaluating precisely when {sym} first started and how severely "
            f"it impacts your routine is an essential first step in determining the right response. While it often resolves "
            f"entirely independently within a relatively short timeframe through proper rest and adequate hydration, taking "
            f"immediate proactive measures always ensures your body recovers effectively without escalating into more significant, "
            f"long-term medical complications that would otherwise require intensive clinical oversight and extended recovery periods."
        )
        
        # Determine prefix spacing
        prefix = line.split("explanation:")[0]
        
        # Only replace if it looks like the actual target definition
        if '`${data.explanation}' not in line and '${randomFallback.explanation}' not in line:
            lines[i] = f'{prefix}explanation: "{long_desc}",'

with open("knowledgeBase.js", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
