let selectedLanguage = "English";const socket = io('http://localhost:3000');
let selectedMode = "voice";

function selectLanguage(element, lang) {
  // Clear active state from all language buttons
  document.querySelectorAll('.lang-card').forEach(card => {
    card.classList.remove('active');
  });

  // Set active state on clicked language button
  element.classList.add('active');
  selectedLanguage = lang;
}

function selectMode(mode) {
  selectedMode = mode;
  
  const voiceBtn = document.getElementById('modeVoice');
  const textBtn = document.getElementById('modeText');

  if (mode === 'voice') {
    voiceBtn.classList.add('active');
    textBtn.classList.remove('active');
  } else {
    textBtn.classList.add('active');
    voiceBtn.classList.remove('active');
  }
}

function startCaseTaking() {
  const newPatient = {
    id: "P-" + Math.floor(1000 + Math.random() * 9000),
    name: "Patient " + Math.floor(10 + Math.random() * 90),
    age: 29,
    gender: "Female",
    arrived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    wait: "1m",
    urgency: "High Urgency",
    urgencyClass: "high",
    complaint: `Intake in ${selectedLanguage} (${selectedMode.toUpperCase()})`,
    vitals: { bp: "124/82", hr: "84 bpm", temp: "37.2 °C", spo2: "98%" },
    history: `Patient initiated self case-taking via ${selectedMode} mode in ${selectedLanguage}.`,
    allergies: ["Penicillin"],
    medications: ["None"],
    symptoms: [
      { name: "Self-Reported Distress", score: "7/10", pct: "70%" }
    ],
    diagnoses: [
      { title: "Pending Clinical Evaluation", pct: "--", desc: "Awaiting primary exam.", top: true }
    ]
  };

  // Send patient data live over WebSocket to server.js
  socket.emit('submit_patient_data', newPatient);
  alert(`Case for ${newPatient.id} submitted live to Doctor Queue!`);
}