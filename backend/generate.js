const fs = require('fs');

const explanations = [
    "may be caused by inflammation, viral infections, or stress.",
    "is often related to dietary habits, dehydration, or minor injuries.",
    "frequently arises from environmental factors, allergies, or physical strain.",
    "could refer to an underlying condition requiring rest and observation.",
    "is a common bodily response to external stress or changing internal conditions."
];

const solutions = [
    "Ensure you get plenty of rest, stay hydrated, and try to relax.",
    "Avoid strenuous physical activities, eat light foods, and apply a warm or cold compress if applicable.",
    "Make sure to monitor your symptoms closely, avoid known triggers, and seek medical attention if it persists.",
    "Keep yourself warm or cool as needed, avoid stressful environments, and consider over-the-counter remedies if advised.",
    "Rest the affected area, drink warm fluids, and consult a doctor if the situation does not improve within a few days."
];

const diets = [
    "Bananas\nRice\nApplesauce\nToast",
    "Clear broths\nHerbal teas\nPlenty of water",
    "Leafy greens\nWhole grains\nLean proteins",
    "Citrus fruits\nGinger\nGarlic\nHoney",
    "Nuts and seeds\nBerries\nOatmeal"
];

const qsTemp = [
    ["How severe is the discomfort on a scale of 1 to 10?", "When did you first notice this symptom?", "Is it continuous, or does it come and go?"],
    ["Have you tried any home remedies yet?", "Is anyone else in your household feeling similar?", "Are you experiencing any fever or chills alongside it?"],
    ["Has this interfered with your sleep?", "Do you have any existing medical conditions?", "Does eating or drinking make it better or worse?"],
    ["Are you currently taking any medications?", "Have you traveled recently?", "Have you experienced this specific issue before?"]
];

const diseases = [
    { keywords: ["headache", "migraine", "head pain"], explanation: "Headache may occur because of stress, dehydration, lack of sleep, or long screen time.", solution: "Drink enough water, rest your eyes, reduce screen exposure, and try relaxing for some time. If the headache continues for several days, consult a doctor.", diet: "Bananas\nLeafy vegetables\nWhole grains\nPlenty of water", qs: ["Are you getting enough sleep recently?", "Are you spending long hours on your phone or computer?", "Do you feel nausea or dizziness with the headache?"] },
    { keywords: ["fever", "hot", "high temperature"], explanation: "A fever indicates your body is fighting off an infection.", solution: "Rest extensively, keep the room cool, and use a damp cloth on your forehead.", diet: "Clear broths\nElectrolyte solutions\nPlenty of water", qs: ["What is your current temperature?", "Are you also feeling chills or body aches?", "Do you have a sore throat?"] },
    { keywords: ["stomach", "pain", "belly", "stomach ache", "abdomen"], explanation: "Stomach pain can have many causes including dietary issues or mild infections.", solution: "Place a warm water bottle on your abdomen and avoid lying down flat immediately after eating.", diet: "Bananas\nRice\nApplesauce\nToast", qs: ["Is the pain sharp or dull?", "Have you eaten anything unusual recently?", "Are you experiencing nausea?"] },
    { keywords: ["cold", "cough", "sneez"], explanation: "Those symptoms generally align with a common viral cold.", solution: "Use a humidifier, elevate your head while sleeping, and stay warm.", diet: "Warm broths\nHerbal teas\nGarlic and ginger", qs: ["Have you noticed any breathing difficulties?", "How long have you had this cough?", "Is your cough dry or producing mucus?"] }
];

const diseaseNames = [
    "flu", "covid", "asthma", "allergy", "tension", "food poisoning", "indigestion", "acid reflux", "ulcer", "back pain", "sciatica", "muscle strain", "arthritis", "gout", "osteoporosis", "skin rash", "eczema", "psoriasis", "acne", "hives", "conjunctivitis", "glaucoma", "cataract", "ear infection", "tinnitus", "vertigo", "sore throat", "tonsillitis", "laryngitis", "bronchitis", "pneumonia", "tuberculosis", "hypertension", "hypotension", "angina", "heart attack", "arrhythmia", "stroke", "diabetes", "hypoglycemia", "hyperthyroidism", "hypothyroidism", "anemia", "leukemia", "lymphoma", "kidney stone", "uti", "bladder infection", "yeast infection", "prostate issues", "hemorrhoids", "constipation", "diarrhea", "ibs", "crohns", "celiac", "hepatitis", "cirrhosis", "gallstones", "pancreatitis", "appendicitis", "hernia", "depression", "anxiety", "panic attack", "bipolar", "schizophrenia", "insomnia", "sleep apnea", "narcolepsy", "chronic fatigue", "fibromyalgia", "lupus", "rheumatoid arthritis", "multiple sclerosis", "parkinsons", "alzheimers", "dementia", "epilepsy", "adhd", "autism", "ptsd", "ocd", "eating disorder", "obesity", "malnourishment", "dehydration", "heat stroke", "frostbite", "sunburn", "concussion", "fracture", "sprain", "dislocation", "burn", "cut", "bruise", "dizziness", "nausea", "vomiting", "fatigue", "weakness", "muscle ache", "joint pain", "swelling", "blister", "cramp", "toothache", "gum bleeding", "nosebleed"
];

let i = 0;
for (const d of diseaseNames) {
    const e = explanations[i % explanations.length];
    const s = solutions[(i + 1) % solutions.length];
    const dt = diets[(i + 2) % diets.length];
    const q = qsTemp[(i + 3) % qsTemp.length];
    
    diseases.push({
        keywords: [d, d + "s", d + " symptoms"],
        explanation: `Symptoms related to ${d} ${e}`,
        solution: `For ${d}, ${s}`,
        diet: dt,
        qs: [
            q[0].replace('this symptom', d),
            q[1],
            q[2]
        ]
    });
    i++;
}

fs.writeFileSync('diseases.js', `module.exports = ${JSON.stringify(diseases, null, 4)};\n`);
console.log('Successfully generated diseases.js with', diseases.length, 'records.');
