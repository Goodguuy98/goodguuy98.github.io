        // Import the functions you need from the SDKs you need
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js';
        import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.4/firebase-analytics.js';
        import { getDatabase, ref, set, onValue} from 'https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js';

        // Firebase configuration
        const firebaseConfig = {
        apiKey: "AIzaSyDqGx1bD6JvKHCTJGIlzE3CDzRjucQklxI",
        authDomain: "cs-smart-home-23e0c.firebaseapp.com",
        projectId: "cs-smart-home-23e0c",
        storageBucket: "cs-smart-home-23e0c.appspot.com",
        messagingSenderId: "489015538881",
        appId: "1:489015538881:web:6b677156e6e67e4a4b1040",
        measurementId: "G-711NWL450G",
        databaseURL: "https://cs-smart-home-23e0c-default-rtdb.europe-west1.firebasedatabase.app"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getDatabase();

        console.log("Firebase imported!")