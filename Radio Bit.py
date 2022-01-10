#Used in clapSet.
clpPref = {"device" : "None"}
radio.set_group(1)

#A string is radio'd
def on_received_string(req):
    #We take all the data we need from the formatted string
    dev = req[:3]
    mod = req[3:6]
    par = req[6:]
    
    #The requested function is 'switch'
    if mod == "Swi":
        switch(dev, par)
    
    #The requested function is 'clap'
    elif mod == "Clp":
        clapSet(dev, par)

def switch(device : str, state):

    #Convert string to binary.
    if state == "On": binary = 1

    #Convert string to binary.
    elif state == "Off": binary = 0

    #Check if a valid binary value was made
    if binary == 1 or binary == 0:
        #Use it to change device state.
        if device == "Lig": pins.digital_write_pin(DigitalPin.P0, binary)
        if device == "Cur": pins.digital_write_pin(DigitalPin.P1, binary)
        if device == "Doo": pins.digital_write_pin(DigitalPin.P2, binary)

    #Toggle beg------------------------------------------------------------------------------------
    #Sadly this code is convuluted as makecode is very difficult to navigate.
    #I attempted to use a dictionary, but they don't appear to behave the same way as in python.
    #When there's an error it's given in javascript terms, which I can't work with.
    
    #Used in case of clap.
    elif state == "Toggle":

        #The device is light
        if device == "Lig":

            #If the device is off, turn it on.
            if pins.digital_read_pin(DigitalPin.P0) == 0: pins.digital_write_pin(DigitalPin.P0, 1)
            #The device is on, turn it off.
            else: pins.digital_write_pin(DigitalPin.P0, 0)
        
        #The device is curtain
        elif device == "Cur":
            #If the device is off, turn it on.
            if pins.digital_read_pin(DigitalPin.P0) == 0: pins.digital_write_pin(DigitalPin.P0, 1)
            #The device is on, turn it off.
            else: pins.digital_write_pin(DigitalPin.P0, 0)

        #The device is Door
        elif device == "Doo":
            #If the device is off, turn it on.
            if pins.digital_read_pin(DigitalPin.P0) == 0: pins.digital_write_pin(DigitalPin.P0, 1)
            #The device is on, turn it off.
            else: pins.digital_write_pin(DigitalPin.P0, 0)

        #The state is 'None' or invalid.
        else: return

    #Toggle end------------------------------------------------------------------------------------

#For changing clap preference
def clapSet(device, state):
    global clpPref

    basic.show_string("Yes")
    #Request turned clapPref off.
    if state == "Off":
        basic.show_string("off")
        clpPref["device"] = "None"
    
    #Request turned clapPref on for a given device.
    elif state == "On":

        basic.show_string(device)
        clpPref["device"] = device



def on_sound_loud():
        switch(clpPref["device"], "Toggle")
        return


def on_forever():
    radio.on_received_string(on_received_string)
    input.on_sound(DetectedSound.LOUD, on_sound_loud)
    

basic.forever(on_forever)
