// Firebase API Ref https://firebase.google.com/docs/reference
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

//Control Panel Code--------------------------------------------------------------------
//Write Data to firebase and update webpage.

function writeToggleData(dev) {
    
    const toggleCountRef = ref(db, 'embedded/' + dev + '/Swi/');
    
    //Grabs data from firebase once.
    get(toggleCountRef).then((toggleNum) => {

        if (toggleNum.exists()) {
            const data = toggleNum.val()

            //Adds a value to the tally.
            var tallySnap = Object.values(data)[0] + 1

            //Updates firebase with new value
            set(ref(db, 'embedded/' + dev + '/Swi'), {
                toggleNum: tallySnap,
            });
            console.log("Data updated.")

        } else {console.log("No data available");}
    });
}

function syncToggleData(dev, tallyReq) {

    
    const toggleCountRef = ref(db, 'embedded/' + dev + '/Swi/');

    //Continuously grabs data from Firebase.
    onValue(toggleCountRef, (toggleNum) => {

    //The data given as an Object.
    const data = toggleNum.val();

    //Convert the Object's values to an array and take the first value.
    let tallyCurrent = Object.values(data)[0]
    

    //Continously displays latest value.
    document.getElementById("counter").innerHTML = String(tallyCurrent)
    });
}

//Executes functions for control panel, only on the control panel
if (document.URL.includes("Control") ) {
    //Updates tally display on website load.
    syncToggleData('Lig', false)

    document.getElementById("LigSwi").addEventListener('click', e=> {
    writeToggleData('Lig')
    }); 
}

//Control Panel Code--------------------------------------------------------------------
//Account Form Code--------------------------------------------------------------------

// Grab form html element
if (document.URL.includes("Create") ) {
    const form = document.querySelector(".form")
}

function captureUserData() {
    var inputs, index;

    let loginData = {};

    //Exclude junk via CSS psuedo-class selector.
    inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea')

    for (index = 0; index < inputs.length; ++index) {

        //Added for readability.
        let loginKey = inputs[index].name
        let loginValue = inputs[index].value

        //Save to object
        loginData[loginKey] = loginValue

        //Scrub all input fields.
        inputs[index].value = "";
    }

    console.log("Form data captured!")

    //The userid will be stored path to the data, not in the data object itself.
    var userid = loginData['userid']
    delete loginData.userid
    set(ref(db, 'users/' + userid), loginData);

    console.log("Sent to Firebase!")
}

//Listen for a form submission, only on create an account page.
if (document.URL.includes("Create") ) {
    form.addEventListener('submit', e=> {
        console.log("Stopped it!");
        e.preventDefault();
        captureUserData();
        });
}

//Control Panel Code--------------------------------------------------------------------
//Welcome Code--------------------------------------------------------------------------

const pre = ["lovingly written", "imposingly dictated", "hastily telegraphed", "brandishly typed", "poetically recited", "line dropped", "carefully composed", "jubilantly passed on", "concisely conveyed", "needlessly broadcasted", "prolificly proclaimed", "covertly divulged", "happily imparted"]
const adj = ["doglike", "petulant", "great", "humble", "bodacious", "chucklesome", "eccentric", "amiable", "gregarious", "anti-social", "forlorne", "contested", "impartial"]

function populateQuotes() {

    get(child(ref(db), `users/`)).then((userData) => {
        if (userData.exists()) {
            //Takes data sorted by users.
            let data = userData.val()

            //Integer of the amount of users.
            var initialLen = Object.keys(data).length

            for (let i = 0; i < initialLen; i++) {

                //The current length of object keys array will serve as cap for number generation.
                let currentLen = Object.keys(data).length
                //Generate a random number between 0 (inclusive) and amount of users (exclusive).
                let randMsg = (Math.floor((Math.random() * currentLen) + 0));
                let randPre = (Math.floor((Math.random() * pre.length) + 0));
                let randAdj = (Math.floor((Math.random() * adj.length) + 0));

                let intro = pre[randPre] + " by the " + adj[randAdj] + " "

                qSlots[i].innerHTML = Object.values(data)[randMsg]['msg'] + " - " + intro +  Object.keys(data)[randMsg]
                delete data[Object.keys(data)[randMsg]]

                if (i == qSlots.length - 1) {
                    break
                }

            }
        } else {
            return
        }
    });
}
console.log(window.location.href)

//Executes functions for welcome page, only on welcome page.
if (document.URL.includes("Welcome")) {
    //Grab all the blockquote tags in "Quote Slots" variable
    var qSlots = document.querySelectorAll('blockquote')
    populateQuotes()
};