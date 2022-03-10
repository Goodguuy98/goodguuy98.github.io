// List of connected devices (a single value could be used if only connecting to one device)
var connectedDevices = []

// Example event call-back handler
function uBitEventHandler(reason, device, data) {

    //Get every element that's a checkbox and store it
    const checkIds = document.querySelectorAll('input[type=checkbox]')
    switch(reason) {
        
        case "connected":
            console.log("Connected!");
            connectedDevices.push(device)

            //Enable the each checkbox for use!
            for (let i = 0; i < checkIds.length; i++) {
                checkIds[i].disabled = false;
                }
            
            //The device is connected. Update the connection status.
            document.getElementById("ConnectStat").setAttribute("src", "images/tick.png");
            document.getElementById("ConnectStat").setAttribute("alt", "Connected");

            break

        case "disconnected":
            console.log("Disconnected")

            //Disable the each checkbox for use!
            //Set them to 'off state!'
            for (let i = 0; i < checkIds.length; i++) {
                checkIds[i].disabled = true;
                checkIds[i].checked = false;
                }
            
            //The device is disconnected. Update the connection status.
            document.getElementById("ConnectStat").setAttribute("src", "images/ex.png");
            document.getElementById("ConnectStat").setAttribute("alt", "Connected");
    
            connectedDevices = connectedDevices.filter( v => v != device)
            break

        case "disconnected":
            console.log("Disconnected")
            connectedDevices = connectedDevices.filter( v => v != device)
            break

        case "connection failure":
            console.log("Connection Failure")
            break
        case "error":
            console.log("Error")                
            break
        
        //Recieves data from microbit. For recording data to firebase and updating state.
        case "console":

            console.log("Console Data: " + data.data)
            let checkId = data.data.slice(0, 6)
            let stateReq = data.data.slice(6)

            //Check if state is on or off, and update the website
            //The string isn't exactly "On."
            if (stateReq.includes("On")) {
                
                console.log("Device toggled on!")
                if (stateReq.includes("Tog")) {
                document.getElementById('dummy').click()
                }

                document.getElementById(checkId).checked = true;
            } else if (stateReq.includes("Off")) {
                console.log("Device toggled off.")

                if (stateReq.includes("Tog")) {
                    document.getElementById('dummy').click()
                }

                document.getElementById(checkId).checked = false;
            }

            break

        case "graph-event":
            console.log(`Graph Event:  ${data.data} (for ${data.graph}${data.series.length?" / series "+data.series:""})`)
            break
        case "graph-data":
            console.log(`Graph Data: ${data.data} (for ${data.graph}${data.series.length?" / series "+data.series:""})`)
            break
    }
}

function toggle(id) {
    // Get the checkbox
    var checkBox = document.getElementById(id);

    //The ID already resembles the string that must be sent.
    //We only need to add on the parameter.
    var parOn = id + "On";
    var parOff = id + "Off";

    //If checkbox is checked, turn on device. If not, do not.
    if (checkBox.checked == true) {

        //parOn will look something like "DevSwiOn." The microbit will get its requested operation from this.
        connectedDevices.forEach( d=>uBitSend(d, parOn));
        //Disable the checkbox input.
        checkBox.disabled = true;
        //Enable checkbox input after 300ms. Gives the function time to execute so it doesn't desync with the microbit.
        setTimeout(() => {  checkBox.disabled = false; }, 500);

        console.log(parOn)
    } else {

        //parOff will look something like "DevSwiOff." The microbit will get its requested operation from this.
        connectedDevices.forEach( d=>uBitSend(d, parOff));
        //Disable the checkbox input.
        checkBox.disabled = true;
        //Enable checkbox input after 300ms. Gives the function time to execute so it doesn't desync with the microbit.
        setTimeout(() => {  checkBox.disabled = false; }, 500);

        console.log(parOff)
    }
}