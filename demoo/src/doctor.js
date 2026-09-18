const patientQueue = [
  {
    id: "P-0041",
    name: "Margaret Thornton",
    age: 67,
    gender: "Female",
    arrived: "09:02",
    wait: "16m",
    urgency: "High Urgency",
    urgencyClass: "high",
    complaint: "Chest Pain",
    vitals: { bp: "158/94", hr: "102 bpm", temp: "37.1 °C", spo2: "96%" },
    history: "Patient presents with sudden onset substernal chest pressure radiating to the left arm, beginning approximately 45 minutes ago. Rates pain 8/10. Associated diaphoresis and mild dyspnea. No prior cardiac history. Currently on lisinopril for hypertension.",
    allergies: ["Penicillin", "Sulfa"],
    medications: ["Lisinopril 10mg QD", "Atorvastatin 20mg QD"],
    symptoms: [
      { name: "Chest Pressure", score: "8/10", pct: "80%" },
      { name: "Left Arm Radiation", score: "6/10", pct: "60%" },
      { name: "Diaphoresis", score: "5/10", pct: "50%" },
      { name: "Dyspnea", score: "4/10", pct: "40%" }
    ],
    diagnoses: [
      { title: "Acute Coronary Syndrome", pct: "72%", desc: "Classic presentation: substernal pressure, radiation, diaphoresis, elevated HR.", top: true },
      { title: "GERD / Esophageal Spasm", pct: "15%", desc: "Alternative gastrointestinal cause.", top: false }
    ]
  },
  {
    id: "P-0042",
    name: "David Osei-Bonsu",
    age: 34,
    gender: "Male",
    arrived: "09:12",
    wait: "6m",
    urgency: "High Urgency",
    urgencyClass: "high",
    complaint: "Severe Headache",
    vitals: { bp: "142/88", hr: "88 bpm", temp: "36.8 °C", spo2: "98%" },
    history: "Sudden onset severe headache accompanied by photophobia.",
    allergies: ["None"],
    medications: ["None"],
    symptoms: [{ name: "Headache", score: "9/10", pct: "90%" }],
    diagnoses: [{ title: "Migraine / Cluster Headache", pct: "65%", desc: "Severe unilateral pain reported.", top: true }]
  },
  {
    id: "P-0045",
    name: "Fatima Al-Rashidi",
    age: 47,
    gender: "Female",
    arrived: "08:46",
    wait: "32m",
    urgency: "Moderate",
    urgencyClass: "moderate",
    complaint: "Abdominal Pain",
    vitals: { bp: "120/80", hr: "76 bpm", temp: "37.0 °C", spo2: "99%" },
    history: "Persistent right lower quadrant abdominal pain over 6 hours.",
    allergies: ["Aspirin"],
    medications: ["Omeprazole 20mg"],
    symptoms: [{ name: "Abdominal Pain", score: "5/10", pct: "50%" }],
    diagnoses: [{ title: "Appendicitis", pct: "58%", desc: "RLQ tenderness noted.", top: true }]
  }
];

const historyData = [
  { id: "P-0038", name: "Robert Chen", age: "54", gender: "Male", visit: "14 Sep 2026", diagnosis: "Type 2 Diabetes Review" },
  { id: "P-0035", name: "Anita Sharma", age: "41", gender: "Female", visit: "10 Sep 2026", diagnosis: "Acute Bronchitis" },
  { id: "P-0031", name: "Michael Vance", age: "60", gender: "Male", visit: "02 Sep 2026", diagnosis: "Hypertension Adjustment" }
];

let activePatientId = "P-0041";

function switchTab(tabName) {
  // Hide all tab views
  document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active-view'));
  
  // Deactivate all sidebar nav buttons
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  // Show selected tab view
  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) targetView.classList.add('active-view');

  // Highlight active sidebar menu button
  event.currentTarget.classList.add('active');
}

function renderQueue() {
  const queueContainer = document.getElementById("patientList");
  if (!queueContainer) return;
  queueContainer.innerHTML = "";

  patientQueue.forEach((p) => {
    const card = document.createElement("div");
    card.className = `patient-card ${p.id === activePatientId ? "active" : ""}`;
    card.onclick = () => selectPatient(p.id);

    card.innerHTML = `
      <div class="p-card-top">
        <div>
          <h4>${p.name}</h4>
          <p class="p-card-meta">${p.age}y · ${p.gender} · ID-${p.id}</p>
        </div>
        <span class="tag-urgency ${p.urgencyClass}">${p.urgency}</span>
      </div>
      <p class="p-card-complaint">● ${p.complaint}</p>
      <div class="p-card-time">
        <span>Arrived ${p.arrived}</span>
        <span>Wait: ${p.wait}</span>
      </div>
    `;
    queueContainer.appendChild(card);
  });
}

function selectPatient(id) {
  activePatientId = id;
  renderQueue();

  const p = patientQueue.find((item) => item.id === id);
  if (!p) return;

  document.getElementById("pName").textContent = p.name;
  document.getElementById("pMeta").textContent = `${p.age}y · ${p.gender} | ID-${p.id} | Arrived ${p.arrived}`;
  
  const urgencyEl = document.getElementById("pUrgency");
  urgencyEl.textContent = p.urgency;
  urgencyEl.className = `tag-urgency ${p.urgencyClass}`;

  document.getElementById("vBp").textContent = p.vitals.bp;
  document.getElementById("vHr").textContent = p.vitals.hr;
  document.getElementById("vTemp").textContent = p.vitals.temp;
  document.getElementById("vSpo2").textContent = p.vitals.spo2;

  document.getElementById("pComplaint").textContent = p.complaint;
  document.getElementById("pHistory").textContent = p.history;

  document.getElementById("pAllergies").innerHTML = p.allergies
    .map((a) => `<span class="pill red">${a}</span>`)
    .join("");

  document.getElementById("pMedications").innerHTML = p.medications
    .map((m) => `<p>${m}</p>`)
    .join("");

  document.getElementById("severityBars").innerHTML = p.symptoms
    .map(
      (s) => `
      <div class="severity-row">
        <span>${s.name}</span>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${s.pct}"></div>
        </div>
        <span>${s.score}</span>
      </div>
    `
    )
    .join("");

  document.getElementById("diagnosisList").innerHTML = p.diagnoses
    .map(
      (d) => `
      <div class="diag-card ${d.top ? "top" : ""}">
        <div class="diag-header">
          <span>${d.top ? "TOP " : ""}${d.title}</span>
          <span>${d.pct}</span>
        </div>
        <p class="diag-desc">${d.desc}</p>
      </div>
    `
    )
    .join("");
}

function renderHistoryTable() {
  const tbody = document.getElementById("historyTableBody");
  if (!tbody) return;
  tbody.innerHTML = historyData.map(p => `
    <tr>
      <td>${p.id}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.age} / ${p.gender}</td>
      <td>${p.visit}</td>
      <td>${p.diagnosis}</td>
      <td><button class="btn btn-secondary" onclick="alert('Viewing record for ${p.name}')">View Record</button></td>
    </tr>
  `).join('');
}

function callNextPatient() {
  const currentIndex = patientQueue.findIndex(p => p.id === activePatientId);
  if (currentIndex < patientQueue.length - 1) {
    selectPatient(patientQueue[currentIndex + 1].id);
  } else {
    alert("Reached the end of the queue!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderQueue();
  selectPatient(activePatientId);
  renderHistoryTable();
});
// Connect to backend server
const socket = io('http://localhost:3000');

// Listen for incoming patient data
socket.on('new_patient_arrived', (newPatient) => {
  patientQueue.unshift(newPatient);
  renderQueue();
  selectPatient(newPatient.id);
});