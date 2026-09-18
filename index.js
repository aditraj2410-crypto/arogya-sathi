const path = require('node:path');
const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const port = process.env.PORT || 3000;
const patients = [
  {
    id: 'P-0041', name: 'Margaret Thornton', age: 67, gender: 'Female', arrived: '09:02', wait: '16m',
    urgency: 'High Urgency', urgencyClass: 'high', complaint: 'Chest Pain',
    vitals: { bp: '158/94', hr: '102 bpm', temp: '37.1 °C', spo2: '96%' },
    history: 'Patient presents with sudden onset substernal chest pressure radiating to the left arm.',
    allergies: ['Penicillin', 'Sulfa'], medications: ['Lisinopril 10mg QD', 'Atorvastatin 20mg QD'],
    symptoms: [{ name: 'Chest Pressure', score: '8/10', pct: '80%' }],
    diagnoses: [{ title: 'Acute Coronary Syndrome', pct: '72%', desc: 'Classic presentation with elevated HR.', top: true }]
  },
  {
    id: 'P-0042', name: 'David Osei-Bonsu', age: 34, gender: 'Male', arrived: '09:12', wait: '6m',
    urgency: 'High Urgency', urgencyClass: 'high', complaint: 'Severe Headache',
    vitals: { bp: '142/88', hr: '88 bpm', temp: '36.8 °C', spo2: '98%' },
    history: 'Sudden onset severe headache accompanied by photophobia.', allergies: ['None'], medications: ['None'],
    symptoms: [{ name: 'Headache', score: '9/10', pct: '90%' }],
    diagnoses: [{ title: 'Migraine / Cluster Headache', pct: '65%', desc: 'Severe unilateral pain reported.', top: true }]
  },
  {
    id: 'P-0045', name: 'Fatima Al-Rashidi', age: 47, gender: 'Female', arrived: '08:46', wait: '32m',
    urgency: 'Moderate', urgencyClass: 'moderate', complaint: 'Abdominal Pain',
    vitals: { bp: '120/80', hr: '76 bpm', temp: '37.0 °C', spo2: '99%' },
    history: 'Persistent right lower quadrant abdominal pain over 6 hours.', allergies: ['Aspirin'], medications: ['Omeprazole 20mg'],
    symptoms: [{ name: 'Abdominal Pain', score: '5/10', pct: '50%' }],
    diagnoses: [{ title: 'Appendicitis', pct: '58%', desc: 'RLQ tenderness noted.', top: true }]
  }
];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'demoo')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.post('/api/auth/login', (req, res) => {
  const { role, username, password } = req.body || {};
  if (!role || !username || !password) return res.status(400).json({ message: 'All login fields are required.' });
  res.json({ user: { id: username, role }, message: 'Login successful.' });
});
app.get('/api/patients', (req, res) => res.json(patients));
app.post('/api/patients', (req, res) => {
  const patient = { ...req.body, createdAt: new Date().toISOString() };
  if (!patient.id || !patient.complaint) return res.status(400).json({ message: 'Patient id and complaint are required.' });
  patients.unshift(patient);
  io.emit('new_patient_arrived', patient);
  res.status(201).json(patient);
});

io.on('connection', socket => socket.emit('queue_snapshot', patients));

httpServer.listen(port, () => console.log(`MedFlow server running at http://localhost:${port}`));
