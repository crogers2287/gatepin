const codes = {
  '2287': 'https://bolt.skinnyc.pro/webhook1', // Proxy to first webhook
  '4764': 'https://bolt.skinnyc.pro/webhook2'  // Proxy to second webhook
};

let deferredPrompt;
const installButton = document.getElementById('install-button');

// Show install button if PWA is not installed
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = 'block'; // Show the install button
});

// Handle install button click
installButton.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        installButton.style.display = 'none'; // Hide the button after installation
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  }
});

// Hide the install button if the app is already installed
window.addEventListener('appinstalled', () => {
  console.log('App installed successfully');
  installButton.style.display = 'none'; // Hide the button
});

function appendToPin(num) {
  const pinInput = document.getElementById('pin-input');
  pinInput.value += num;
}

function clearPin() {
  const pinInput = document.getElementById('pin-input');
  pinInput.value = '';
  pinInput.classList.remove('success', 'failure'); // Reset styles
}

async function submitPin() {
  const pinInput = document.getElementById('pin-input');
  const message = document.getElementById('message');
  const log = document.getElementById('log');
  const enteredPin = pinInput.value;

  if (codes[enteredPin]) {
    const webhookUrl = codes[enteredPin];

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: `Pin ${enteredPin} entered correctly!` })
      });

      if (response.ok) {
        message.textContent = "You're in, Welcome to the Party!";
        message.style.color = '#4caf50'; // Green for success
        pinInput.classList.remove('failure');
        pinInput.classList.add('success'); // Add success class
        log.innerHTML = ''; // Clear the log
      } else {
        const errorText = await response.text();
        message.textContent = 'Failed to trigger webhook.';
        message.style.color = '#ff6b6b'; // Red for error
        pinInput.classList.remove('success');
        pinInput.classList.add('failure'); // Add failure class
        log.innerHTML = `<div>Failed to trigger webhook. Status: ${response.status}, Response: ${errorText}</div>`;
      }
    } catch (error) {
      message.textContent = 'Error: ' + error.message;
      message.style.color = '#ff6b6b'; // Red for error
      pinInput.classList.remove('success');
      pinInput.classList.add('failure'); // Add failure class
      log.innerHTML = `<div>Error: ${error.message}</div>`;
    }
  } else {
    message.textContent = 'Incorrect Pin. Try again.';
    message.style.color = '#ff6b6b'; // Red for error
    pinInput.classList.remove('success');
    pinInput.classList.add('failure'); // Add failure class
    log.innerHTML = `<div>Incorrect pin entered.</div>`;
  }

  // Clear the pin field after submission
  setTimeout(() => {
    pinInput.value = '';
    pinInput.classList.remove('success', 'failure'); // Reset styles
  }, 2000); // Clear after 2 seconds
}
