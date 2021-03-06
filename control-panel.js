// List of connected devices (a single value could be used if only connecting to one device)
var connectedDevices = []

//Used to differentiate between User toggles and Micro:bit toggles.
var autoClick = false

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
            document.getElementById("ConnectStat").setAttribute("alt", "Disconnected");
    
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

            console.log("Microbit Recieve: " + data.data)
            let checkId = data.data.slice(0, 6)
            let checkEl = document.getElementById(checkId)
            let stateReq = data.data.slice(6)

            //Check if state is on or off, and update the website
            //The string isn't exactly "On." Use ".includes()"
            if (stateReq.includes("On")) {
                //The click was automatic. Mark it as such to prevent a redundant toggle() call.
                autoClick = true
                //Fire a click event to trigger Firebase EventListener
                checkEl.click()
                //Ensure checkbox is correctly set
                checkEl.checked = true;
            } else if (stateReq.includes("Off")) {
                //The click was automatic. Mark it as such to prevent a redundant toggle() call.
                autoClick = true
                //Fire a click event to trigger Firebase EventListener
                checkEl.click()
                //Ensure checkbox is correctly set
                checkEl.checked = false;
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

    //toggle() should not activate on reception of Micro:Bit string to prevent redundant data exchange. Interrupt function.
    if (autoClick == true) {
        autoClick = false
        return
    }
    
    // Get the checkbox
    var checkBox = document.getElementById(id);

    if (checkBox.checked == true) {
        var req = id + "On";
    } else {
        var req = id + "Off";
    }
        
    //par will look something like "DevSwiOn." The microbit will get its requested operation from this.
    connectedDevices.forEach( d=>uBitSend(d, req));
    //Disable the checkbox input.
    checkBox.disabled = true;
    //Enable checkbox input after 300ms. Gives the function time to execute so it doesn't desync with the microbit.
    setTimeout(() => {  checkBox.disabled = false; }, 500);

    console.log("Website Sent: " + req)
}