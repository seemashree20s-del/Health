import re

file_path = "c:/Users/shame/Downloads/sonnanm 1/knowledgeBase.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

categories = {
    "sys_severe": {
        "keywords": ["high fever", "chest", "unconscious", "seizure", "bleed", "stroke", "attack"],
        "exp": "[SYM] is a critical systemic reaction warning of a potentially severe medical event. This demands immediate attention as underlying organs may be heavily stressed.",
        "sol": "DO NOT wait or rely on home remedies. Contact emergency health services immediately. Keep the patient entirely rested and consistently monitor their breathing.",
        "diet": "Do not attempt to consume solid foods if vomiting or losing consciousness. Small sips of electrolytes may be given carefully only if fully alert."
    },
    "resp": {
        "keywords": ["cough", "breath", "asthma", "wheez", "sneeze", "lung", "throat", "phlegm", "mucus"],
        "exp": "[SYM] often indicates inflammation or constriction in the respiratory tract restricting normal airflow. It is frequently caused by airborne allergens or viral infections.",
        "sol": "Use an air humidifier to soothe your airways and practice deep breathing exercises. Avoid exposure to smoke or strong chemical odors completely.",
        "diet": "Consume warm herbal teas featuring ginger and honey to coat the irritated throat. Avoid excessive dairy intake which can thicken respiratory mucus."
    },
    "gastro": {
        "keywords": ["stomach", "nausea", "vomit", "diarrhea", "bowel", "digestion", "heartburn", "acid", "bloat", "belly", "gut"],
        "exp": "[SYM] points toward an acute imbalance or irritation within the gastrointestinal system. Common triggers include foodborne pathogens or severe dietary sensitivities.",
        "sol": "Keep all meals exceptionally small and frequent rather than heavy. Do not lie down immediately after eating and apply a warm compress if experiencing cramps.",
        "diet": "Adopt the BRAT diet consisting of Bananas Rice Applesauce and Toast. Ensure strict avoidance of highly acidic spicy or fried foods until fully settled."
    },
    "neuro": {
        "keywords": ["headache", "migraine", "dizzi", "vertigo", "numb", "tingl", "brain", "vision", "faint"],
        "exp": "[SYM] is related to neurological function or vascular pressure within the cranial nerve pathways. This can be provoked by extreme tension or sensory overload.",
        "sol": "Move immediately to a quiet and dimly lit room to dramatically reduce active sensory input. Apply a cold compress directly to the forehead to relieve vascular throbbing.",
        "diet": "Maintain consistent steady blood sugar levels with complex carbohydrates. Strictly limit caffeine and artificial sweeteners which regularly act as neuro triggers."
    },
    "musc": {
        "keywords": ["pain", "ache", "muscle", "joint", "cramp", "spasm", "back", "neck", "bone", "stiff", "swelling"],
        "exp": "[SYM] represents structural strain indicating potential micro tears in tissue or prolonged localized inflammation. Overexertion and poor ergonomic posture are frequent culprits.",
        "sol": "Apply ice during the first 48 hours to minimize acute swelling before switching to heat therapy. Engage in very gentle stretching to maintain healthy mobility without strain.",
        "diet": "Increase your daily intake of anti inflammatory natural foods like turmeric and omega 3 rich fish to actively support internal tissue repair."
    },
    "derm": {
        "keywords": ["skin", "rash", "itch", "hives", "bump", "redness", "acne", "blister"],
        "exp": "[SYM] indicates a distinct dermatological reaction usually triggered by an external contact allergen or a mild autoimmune response.",
        "sol": "Cleanse the affected area very gently with mild unscented soap and lukewarm water. Consciously avoid scratching the delicate skin barrier to prevent infection.",
        "diet": "Avoid universally known common allergens. Ensure you are drinking substantial amounts of water to maintain skin elasticity and barrier flushing."
    },
    "sys_mild": {
        "keywords": ["fever", "chill", "sweat", "fatigue", "tired", "weak", "malaise", "weight", "appetite"],
        "exp": "[SYM] is a generalized systemic immune response mechanism. Your body is reallocating energy resources specifically to fight off a bacterial or viral disruption.",
        "sol": "Prioritize deep restorative sleep for a minimum of 8 to 10 hours continuously. Actively monitor your basal temperature every few hours to ensure stability.",
        "diet": "Focus almost entirely on steady hydration utilizing electrolyte rich broths and clean water. Consume strictly light nutrient dense soups that are exceptionally easy to digest."
    }
}

count = 0

def replace_logic(match):
    global count
    key = match.group(1)
    old_fol = match.group(5)
    
    lower_key = key.lower()
    chosen_cat = "sys_mild"
    
    for cat_name, cat_data in categories.items():
        if any(k in lower_key for k in cat_data["keywords"]):
            chosen_cat = cat_name
            break
            
    sym_cap = key.capitalize()
    
    new_exp = categories[chosen_cat]["exp"].replace("[SYM]", sym_cap)
    new_sol = categories[chosen_cat]["sol"]
    new_diet = categories[chosen_cat]["diet"]
    
    count += 1
    
    return f'"{key}": {{\n        explanation: "{new_exp}",\n        solution: "{new_sol}",\n        diet: "{new_diet}",\n        followUps: [{old_fol}]\n    }}'

# We match the entire object: "fever": { explanation: "...", solution: "...", diet: "...", followUps: [...] }
pattern = re.compile(r'"([^"]+)":\s*\{\s*explanation:\s*"([^"]+)",\s*solution:\s*"([^"]+)",\s*diet:\s*"([^"]+)",\s*followUps:\s*\[([^\]]+)\]\s*\}')

new_content = pattern.sub(replace_logic, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print(f"Successfully modified {count} dictionary matches.")
