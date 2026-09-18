const socket = io();

socket.on('queue_snapshot', (patients) => {
  window.dispatchEvent(new CustomEvent('queue_snapshot', { detail: patients }));
});

socket.on('new_patient_arrived', (patient) => {
  window.dispatchEvent(new CustomEvent('new_patient_arrived', { detail: patient }));
});