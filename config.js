// Wait for the Firebase globals to be ready from index.html
const waitForFB = setInterval(() => {
    if (window.FB) {
        clearInterval(waitForFB);
        initFirebase();
    }
}, 50);

function initFirebase() {
    const { initializeApp, getAuth, getFirestore } = window.FB;

    // YOUR SPECIFIC CONFIGURATION
    const firebaseConfig = {
      apiKey: "AIzaSyD-ULlptXK4AbeqgUaQU8xlWrqBQ98kADQ",
      authDomain: "realms-of-valor.firebaseapp.com",
      projectId: "realms-of-valor",
      storageBucket: "realms-of-valor.firebasestorage.app",
      messagingSenderId: "812795312543",
      appId: "1:812795312543:web:f7583f3f95279b568425aa"
    };

    // Initialize the App
    const app = initializeApp(firebaseConfig);
    
    // Set up global variables for game.js to use
    window.auth = getAuth(app);
    window.db = getFirestore(app);
    
    // IMPORTANT: This tells the game where to save your player data
    window.appId = firebaseConfig.appId;

    console.log("Realms of Valor initialized.");
    
    // Tell the game we are ready to start
    window.dispatchEvent(new Event('firebase-ready'));
}
