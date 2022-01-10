def on_data_received():
    radio.send_string(serial.read_until(serial.delimiters(Delimiters.NEW_LINE)))
serial.on_data_received(serial.delimiters(Delimiters.NEW_LINE), on_data_received)

radio.set_group(1)
