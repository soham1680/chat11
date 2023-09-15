document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('messageContainer');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const logoutBtn = document.getElementById('logoutBtn');
  
    // Check if the user is authenticated
    fetch('/get-messages')
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            data.forEach((message) => {
              messageContainer.innerHTML += `${message.username}: ${message.text}<br>`;
            });
          });
        } else {
          window.location.href = '/login';
        }
      });
  
    // Send a message
    sendMessageBtn.addEventListener('click', () => {
      const text = messageInput.value;
      if (text) {
        fetch('/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }).then(() => {
          messageInput.value = '';
        });
      }
    });
  
    // Logout
    logoutBtn.addEventListener('click', () => {
      fetch('/logout', { method: 'GET' }).then(() => {
        window.location.href = '/login';
      });
    });
  });
  