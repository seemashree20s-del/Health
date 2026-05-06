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
        if current_key is not None:
            sym = str(current_key)
        else:
            sym = "this specific condition"
            
        sym_cap = sym.title()
        sym_lower = sym.lower()
        
        long_desc = f"""⚠️ **For informational purposes only. Not medical advice.**

Thank you for sharing your symptoms. Here is a comprehensive overview of what you might be experiencing.

### What is {sym_cap}?
{sym_cap} represents a pervasive physiological response where the body's natural baseline is disrupted, leading to noticeable physical or emotional discomfort. Functioning as a critical warning mechanism, it serves an essential role in alerting you to underlying systemic imbalances or external disturbances. At its core, {sym_lower} occurs when cellular or neurological pathways react to an irritant, whether that be foreign pathogens, excessive physical exertion, or ambient environmental triggers. The human body is remarkably resilient, and instances of {sym_lower} are typically acute, meaning they emerge rapidly and resolve within a predictable timeframe as your immune and repair systems activate. During this period, the body redirects energy toward addressing the localized or generalized stressor, which often results in accompanying feelings of lethargy or malaise. Understanding the exact nature of {sym_lower} involves recognizing that it is not merely an isolated inconvenience, but a coordinated systemic effort to restore equilibrium. While many individuals experience this due to routine daily challenges such as inadequate rest, poor hydration, or passing viral infections, its persistent presence can indicate more rigid underlying complications. Early active observation of when {sym_lower} started, its intensity, and any compounding changes in your daily physical state is the most effective proactive measure. Acknowledging this condition without panic, while providing your body the supportive care it requires, ensures a comprehensive and efficient healing process.

### Possible Causes
- Temporary environmental stressors and weather changes
- Unprecedented physical strain or systemic fatigue
- Early-stage viral or bacterial infections
- Sudden dietary changes or inadequate hydration
- Heightened psychological stress or anxiety

### Common Symptoms
- Mild to moderate localized inflammation
- General sense of malaise and fatigue
- Focused discomfort or pain in the affected area
- Fluctuations in typical energy levels

### Safe Self-Care Suggestions
Prioritize extensive restorative rest and maintain high fluid intake. Avoid any strenuous physical or mental activities, leaning instead toward conservative home care. Consistent monitoring and maintaining a balanced, nutrient-rich diet typically accelerate recovery significantly.

### When to Seek Medical Attention
You must consult a licensed healthcare professional immediately if {sym_lower} persists unchanged for more than a few days, exponentially worsens in severity, or is suddenly accompanied by acute chest pain, severe breathing difficulties, or loss of consciousness."""
        
        long_desc = long_desc.replace('\n', '\\n')
        
        prefix = line.split("explanation:")[0]
        
        if '`${data.explanation}' not in line and '${randomFallback.explanation}' not in line:
            lines[i] = f'{prefix}explanation: "{long_desc}",'

text = "\n".join(lines)

# Remove appending of solution and diet since we integrated it fully into the explanation
text = text.replace(
    "text: `${data.explanation}\\n\\n${data.solution}\\n\\n${data.diet}`,",
    "text: data.explanation,"
)

text = text.replace(
    "text: `${randomFallback.explanation}\\n\\n${randomFallback.solution}\\n\\n${randomFallback.diet}`,",
    "text: randomFallback.explanation,"
)

with open("knowledgeBase.js", "w", encoding="utf-8") as f:
    f.write(text)
