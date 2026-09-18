// Monitor WebSocket Connection Status
const statusText = document.getElementById('serverStatusText');
const statusIndicator = document.getElementById('statusIndicator');

try {
  // Connect to backend server
  const socket = io('http://localhost:3000', {
    timeout: 3000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    statusText.innerText = 'WebSocket Server Online (Port 3000)';
    statusIndicator.className = 'status-indicator online';
  });

  socket.on('connect_error', () => {
    statusText.innerText = 'Server Offline — Start via "node server.js"';
    statusIndicator.className = 'status-indicator offline';
  });

  socket.on('disconnect', () => {
    statusText.innerText = 'Server Disconnected';
    statusIndicator.className = 'status-indicator offline';
  });
} catch (err) {
  statusText.innerText = 'Server Offline';
  statusIndicator.className = 'status-indicator offline';
}
// Login Modal Logic
let currentRole = '';

function openLoginModal(role) {
  currentRole = role;
  const modal = document.getElementById('loginModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalIcon = document.getElementById('modalIcon');
  const identityLabel = document.getElementById('identityLabel');
  const usernameInput = document.getElementById('usernameInput');

  if (role === 'patient') {
    modalIcon.innerText = '📱';
    modalTitle.innerText = 'Patient Portal Sign In';
    modalSubtitle.innerText = 'Enter your Patient Access ID or Phone Number';
    identityLabel.innerText = 'Patient ID / Mobile Number';
    usernameInput.placeholder = 'e.g., P-8921 or +1234567890';
  } else {
    modalIcon.innerText = '🩺';
    modalTitle.innerText = 'Clinician EMR Login';
    modalSubtitle.innerText = 'Enter your Medical License credentials';
    identityLabel.innerText = 'Doctor License / Staff ID';
    usernameInput.placeholder = 'e.g., DOC-4029';
  }

  modal.classList.add('active');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
}

async function handleLogin(event) {
  event.preventDefault();
  const submitButton = document.getElementById('loginSubmitBtn');
  submitButton.disabled = true;
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: currentRole,
        username: document.getElementById('usernameInput').value.trim(),
        password: document.getElementById('passwordInput').value
      })
    });
    if (!response.ok) throw new Error('Login failed');
    window.location.href = currentRole === 'patient' ? 'patient.html' : 'doctor.html';
  } catch (error) {
    alert('Unable to sign in. Please make sure the MedFlow server is running.');
    submitButton.disabled = false;
  }
}