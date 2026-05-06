const fs = require('fs');

const file = 'c:/Users/shame/Downloads/sonnanm 1/knowledgeBase.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /"([^"]+)":\s*{\s*explanation:\s*"([^"]+)",\s*solution:\s*"([^"]+)",\s*diet:\s*"([^"]+)",\s*followUps:\s*\[([^\]]+)\]\s*}/g;

// Content mapping rules using smart categorization
const categories = {
    respiratory: {
        keywords: ['cough', 'breath', 'asthma', 'wheez', 'sneeze', 'lung', 'chest', 'phlegm', 'mucus'],
        explanation: '[SYM] often indicates inflammation or constriction in the respiratory tract, restricting normal airflow. It is frequently caused by airborne allergens, viral infections, or environmental pollutants.',
        solution: 'Use an air humidifier to soothe airways and practice deep breathing exercises. Avoid exposure to smoke or strong chemical odors, and monitor your breathing patterns.',
        diet: 'Consume warm herbal teas, ginger, and honey to coat the throat. Avoid excessive dairy which can theoretically thicken mucus buildup.'
    },
    gastro: {
        keywords: ['stomach', 'nausea', 'vomit', 'diarrhea', 'bowel', 'digestion', 'heartburn', 'acid', 'bloat', 'belly', 'gut'],
        explanation: '[SYM] points toward an imbalance or irritation within the gastrointestinal system. Common triggers include foodborne pathogens, excessive acid production, or severe dietary sensitivities.',
        solution: 'Keep meals small and frequent rather than heavy. Do not lie down immediately after eating, and apply a warm compress if experiencing cramps.',
        diet: 'Follow the BRAT diet (Bananas, Rice, Applesauce, Toast). Ensure strict avoidance of highly acidic, spicy, or fried foods until fully settled.'
    },
    neuro: {
        keywords: ['headache', 'migraine', 'dizzi', 'vertigo', 'numb', 'tingl', 'brain', 'vision', 'faint'],
        explanation: '[SYM] is related to neurological function and vascular pressure within the cranial or localized nerve pathways. This can be provoked by extreme tension, chronic dehydration, or sensory overload.',
        solution: 'Move immediately to a quiet, dimly lit room to reduce sensory input. Apply a cold compress to your forehead or neck to relieve vascular throbbing.',
        diet: 'Maintain consistent blood sugar levels with complex carbohydrates. Strictly limit caffeine and artificial sweeteners which can act as neuro-triggers.'
    },
    musculoskeletal: {
        keywords: ['pain', 'ache', 'muscle', 'joint', 'cramp', 'spasm', 'back', 'neck', 'bone', 'stiff', 'swelling'],
        explanation: '[SYM] represents structural or muscular strain, indicating potential micro-tears in tissue or prolonged localized inflammation. Overexertion or poor ergonomic posture are frequent culprits.',
        solution: 'Apply ice for the first 48 hours to minimize acute swelling, then switch to heat therapy. Engage in very gentle, supervised stretching to maintain mobility without strain.',
        diet: 'Increase intake of anti-inflammatory foods like turmeric, omega-3 rich fish, and tart cherries to support tissue repair.'
    },
    systemic_severe: {
        keywords: ['high fever', 'chest pain', 'unconscious', 'seizure', 'bleed', 'stroke', 'attack'],
        explanation: '[SYM] is a critical systemic reaction warning of a potentially severe, advanced medical event. This demands immediate attention as underlying organs may be heavily stressed.',
        solution: 'DO NOT wait or rely on home remedies. Call emergency health services immediately. Keep the patient entirely rested and monitor their airway and consciousness.',
        diet: 'Do not attempt to consume solid foods if vomiting or losing consciousness. Small sips of electrolytes may be given only if the person is fully alert.'
    },
    systemic_mild: {
        keywords: ['fever', 'chill', 'sweat', 'fatigue', 'tired', 'weak', 'malaise', 'weight', 'appetite'],
        explanation: '[SYM] is a generalized systemic immune response. Your body is reallocating energy resources to fight off a mild bacterial or viral disruption.',
        solution: 'Prioritize deep restorative sleep for at least 8 to 10 hours. Monitor your basal temperature every few hours to ensure it does not uncontrollably spike.',
        diet: 'Focus entirely on hydration with electrolyte-rich broths and water. Consume light, nutrient-dense soups that are easy to digest.'
    },
    dermatological: {
        keywords: ['skin', 'rash', 'itch', 'hives', 'bump', 'redness', 'acne', 'blister'],
        explanation: '[SYM] indicates a dermatological reaction, usually triggered by an external contact allergen, autoimmune response, or blocked sebaceous glands.',
        solution: 'Cleanse the affected area gently with mild soap and lukewarm water. Avoid scratching the skin barrier to prevent secondary bacterial infections.',
        diet: 'Avoid known common food allergens. Ensure you are drinking enough water to maintain skin elasticity and barrier flushing.'
    }
};

let replacedCount = 0;

let newContent = content.replace(regex, (match, key, oldExp, oldSol, oldDiet, oldFollowUps) => {
    let cat = 'systemic_mild'; // Default
    let lowercaseKey = key.toLowerCase();
    
    // Determine category
    for (const [catName, catData] of Object.entries(categories)) {
        if (catData.keywords.some(k => lowercaseKey.includes(k))) {
            cat = catName;
            break; // Stop at first match
        }
    }
    
    // Format text
    let symCap = key.charAt(0).toUpperCase() + key.slice(1);
    
    let newExp = categories[cat].explanation.replace('[SYM]', symCap);
    let newSol = categories[cat].solution;
    let newDiet = categories[cat].diet;
    
    replacedCount++;
    return `"${key}": {
        explanation: "${newExp}",
        solution: "${newSol}",
        diet: "${newDiet}",
        followUps: [${oldFollowUps}]
    }`;
});

fs.writeFileSync(file, newContent, 'utf8');
console.log(`Successfully updated ${replacedCount} conditions with unique categorized logic!`);
