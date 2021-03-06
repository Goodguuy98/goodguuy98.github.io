#Used in clapSet.
clpPref = "None"

#The radio communicates in group 1.
radio.set_group(1)

#List of usable ports
periphPorts = [DigitalPin.P0, DigitalPin.P1, DigitalPin.P2]

#Makecode is poor at supporting dictionaries. We must instead use lists of equal lengths
periphKeys = ["Lig", "Cur", "Doo"]

#The state of each peripheral. The Microbit is not consistent at reading pins,
#So we must record its state.
periphState = [0, 0, 0]

def on_data_received():
    req = serial.read_until(serial.delimiters(Delimiters.NEW_LINE))
    on_received_string(req)

#A string is radio'd
def on_received_string(req):
    #We take all the data we need from the formatted string
    dev = req[:3]
    mod = req[3:6]
    par = req[6:]
    
    #The requested function is 'switch'
    if mod == "Swi":
        switch(dev, par, "web")
    
    #The requested function is 'clap'
    elif mod == "Clp":
        clapSet(dev, par)

def switch(device : str, state, trigger):
    global periphState

    if device == "None":
        return

    #MakeCode does not play nice with dictionaries, so I'm forced to use strange methods.
    for index in range(0, 2):
        if periphKeys[index] == device:
            targetPort = periphPorts[index]
            targetIndex = index

    #Convert string to binary.
    if state == "On": binary = 1

    #Convert string to binary.
    elif state == "Off": binary = 0

    #Check if a valid binary value was made
    if binary == 1 or binary == 0:
        #Set pin to binary value
        pins.digital_write_pin(targetPort, binary)
        #Store the peripherals state for future toggles (via clap)
        periphState[targetIndex] = binary
        
        #If toggled from website, notifying the website is redundant!
        if trigger == "web":
            return

        #Notify website a toggle was made.
        notif = device + "Swi" + state
        
        serial.write_line(notif)

    #Toggle beg------------------------------------------------------------------------------------

    #Used in case of clap.
    elif state == "Toggle":

        #If the device is off, turn it on.
        if periphState[targetIndex] == 0:
            pins.digital_write_pin(targetPort, 1)
            periphState[targetIndex] = 1
            serial.write_line(device + "SwiOn")
            radio.send_string(device + "SwiOn")
        #and vice versa
        else:
            pins.digital_write_pin(targetPort, 0)
            periphState[targetIndex] = 0
            serial.write_line(device + "SwiOff")
            radio.send_string(device + "SwiOff")

    #Toggle end------------------------------------------------------------------------------------

#For changing clap preference
def clapSet(device, state):
    global clpPref
    
    #Request turned clapPref off.
    if state == "Off":
        clpPref = "None"
    
    #Request turned clapPref on for a given device.
    elif state == "On":
        clpPref = device

def on_sound_loud():
        switch(clpPref, "Toggle", "sound")
        return

#Turn off via onboard
def on_button_pressed_a():
    switch("Lig", "Off", "onboard")

#Turn on via onboard
def on_button_pressed_b():
    switch("Lig","On", "onboard")


def on_forever():
    #Radio:bit activation-----------------------
    radio.on_received_string(on_received_string)
    #Clap activation---------------------------------
    input.on_sound(DetectedSound.LOUD, on_sound_loud)
    #Serial activation--------------------------------------------------------------
    serial.on_data_received(serial.delimiters(Delimiters.NEW_LINE), on_data_received)
    #Onboard activation-------------------------------------------------------------
    input.on_button_pressed(Button.A, on_button_pressed_a)
    input.on_button_pressed(Button.B, on_button_pressed_b)

basic.forever(on_forever)

basic.show_icon(IconNames.HAPPY)
