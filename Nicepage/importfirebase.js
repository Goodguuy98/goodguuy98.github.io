// When Firebase was initialised externally, the modules did not import correctly.
// Firebase initialise str------------------------------------------------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.4/firebase-analytics.js';
import { getDatabase, ref, set, onValue, get, child} from 'https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js';

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

//Write Data to firebase and update webpage.
function writeToggleData(dev) {
    

    get(ref(db, 'embedded/' + dev + '/Swi/')).then((toggleNum) => {
        if (toggleNum.exists()) {
            const data = toggleNum.val()
            var tallySnap = Object.values(data)[0] + 1
            console.log(tallySnap)

            set(ref(db, 'embedded/' + dev + '/Swi'), {
                toggleNum: tallySnap,
            });

            console.log("Data updated.")
        } else {
        console.log("No data available");
        }
    });
}


function syncToggleData(dev, tallyReq) {

    //Get latest data from Firebase
    const toggleCountRef = ref(db, 'embedded/' + dev + '/Swi/');
    onValue(toggleCountRef, (toggleNum) => {

    //The data given as an Object
    const data = toggleNum.val();

    //Convert the Object's values to an array and take the first value.
    let tallyCurrent = Object.values(data)[0]
    
    document.getElementById("counter").innerHTML = String(tallyCurrent)
    });

}

//Updates tally display on website load.
syncToggleData('Lig', false)

document.getElementById("LigSwi").addEventListener('click', e=> {
    writeToggleData('Lig')
});
// document.getElementById("dummy").addEventListener('click', readToggleData)