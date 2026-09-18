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

function handleLogin(event) {
  event.preventDefault();
  
  // Direct user to target app page after successful sign in
  if (currentRole === 'patient') {
    window.location.href = 'patient.html';
  } else if (currentRole === 'doctor') {
    window.location.href = 'doctor.html';
  }
}