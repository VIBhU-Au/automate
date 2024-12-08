import fetch from 'node-fetch';

const ANDROID_IP = '192.0.0.4'; // Replace with your Android device's IP address
const PORT = 8080; // Replace with the port your Android app is using
const ENDPOINT = `http://${ANDROID_IP}:${PORT}/messages`;

async function fetchMessages() {
  try {
    console.log('Fetching messages from Android device...');
    const response = await fetch(ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const messages = await response.json();
    
    console.log('Messages received:');
    console.log(JSON.stringify(messages, null, 2));
    
    // Here you can process the messages further, save to a file, etc.
  } catch (error) {
    console.error('Error fetching messages:', error.message);
  }
}

fetchMessages();