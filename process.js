const fs = require('fs');

const symptomsList = fs.readFileSync('symptoms.txt', 'utf8').split('\n').map(s => s.trim()).filter(s => s.length > 0);

let newEntries = [];
symptomsList.forEach(s => {
    const key = s.toLowerCase();
    newEntries.push(`
    "${key}": {
        explanation: "${s} could be caused by fatigue, environmental factors, or minor localized inflammation.",
        solution: "Rest and stay hydrated. Apply basic self-care and monitor the condition closely over the next 48 hours.",
        diet: "Eat a balanced diet rich in whole foods, vitamin C, and drink plenty of water to help your body recover.",
        followUps: ["How long have you been experiencing ${key}?", "Is the feeling constant, or does it come and go?", "On a scale of 1 to 10, how severe is it?"]
    }`);
});

let kb = fs.readFileSync('knowledgeBase.js', 'utf8');
const injectionPoint = kb.indexOf('const explicitData = {') + 'const explicitData = {'.length;

// Inject right after the object opening
const updatedKb = kb.slice(0, injectionPoint) + newEntries.join(',') + ',' + kb.slice(injectionPoint);
fs.writeFileSync('knowledgeBase.js', updatedKb);

console.log(`Successfully injected ${newEntries.length} new symptom matrices into knowledgeBase.js.`);
