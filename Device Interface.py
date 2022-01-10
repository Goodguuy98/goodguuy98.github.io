#Used in clapSet.
clpPref = "None"

#The radio communicates in group 1.
radio.set_group(1)

#List of usable ports
ports = [DigitalPin.P0, DigitalPin.P1, DigitalPin.P2]

#Makecode is poor at supporting dictionaries. We must instead use lists of equal lengths
peripherals = ["Lig", "Cur", "Doo"]

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
    global peripherals

    #MakeCode does not play nice with dictionaries, so I'm forced to use strange methods.
    for index in range(0, 2):
        if peripherals[index] == device:
            targetPort = ports[index]

    #Convert string to binary.
    if state == "On": binary = 1

    #Convert string to binary.
    elif state == "Off": binary = 0

    #Check if a valid binary value was made
    if binary == 1 or binary == 0:
        pins.digital_write_pin(targetPort, binary)

    #Toggle beg------------------------------------------------------------------------------------
    
    #Used in case of clap.
    elif state == "Toggle":

        #If the device is off, turn it on.
        if pins.digital_read_pin(targetPort) == 0: pins.digital_write_pin(targetPort, 1)
        #and vice versa
        elif pins.digital_read_pin(targetPort) == 1: pins.digital_write_pin(targetPort, 0)
        #The state is 'None' or invalid.
        else: return

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
        switch(clpPref, "Toggle")
        return


def on_forever():
    radio.on_received_string(on_received_string)
    input.on_sound(DetectedSound.LOUD, on_sound_loud)
    

basic.forever(on_forever)