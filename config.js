// Wait for the Firebase globals to be ready from index.php
const waitForFB = setInterval(() => {
    if (window.FB) {
        clearInterval(waitForFB);
        initFirebase();
    }
}, 50);

function initFirebase() {
    const { initializeApp, getAuth, getFirestore } = window.FB;

    // YOUR CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyD-ULlptXK4AbeqgUaQU8xlWrqBQ98kADQ",
  authDomain: "realms-of-valor.firebaseapp.com",
  projectId: "realms-of-valor",
  storageBucket: "realms-of-valor.firebasestorage.app",
  messagingSenderId: "812795312543",
  appId: "1:812795312543:web:f7583f3f95279b568425aa"
};

    const app = initializeApp(firebaseConfig);
    window.auth = getAuth(app);
    window.db = getFirestore(app);
    window.appId = "1:545970715319:web:05bdaaa764df6338802b32";

    console.log("Darkness initialized.");
    
    // Dispatch event to tell game.js we are ready
    window.dispatchEvent(new Event('firebase-ready'));
}// JavaScript Document