def on_button_pressed_a():
    radio.send_string("LigSwiOn")
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_received_string(receivedString):
    serial.write_line(receivedString)
radio.on_received_string(on_received_string)

def on_button_pressed_b():
    radio.send_string("LigSwiOff")
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_data_received():
    radio.send_string(serial.read_until(serial.delimiters(Delimiters.NEW_LINE)))
serial.on_data_received(serial.delimiters(Delimiters.NEW_LINE), on_data_received)

radio.set_group(1)
basic.show_icon(IconNames.YES)