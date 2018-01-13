# RN42
BluetoothClassic Module.
SPP and HID profile can be used.

## wired(obniz, tx_to_RN42, rx_from_RN42)
RN42 require 3.3v supply. You should supply stable 3.3v to RN42.

```javascript
  // Example
  var rn42 = obniz.wired("RN42", 1, 2); // io1 is tx to RN42, io2 is rx from RN42
  rn42.onreceive = function(data, text) {
    console.log(text);
  }
  $("#send").click(function(){
    rn42.send("Hello")
  })
```

## send(data)
send data via UART to RN42.
```javascript
  var rn42 = obniz.wired("RN42", 1, 2);
  rn42.send("Hello")
```

## onreceive(data, text)
received data from RN42 via UART. This callback has same arguments with uart.onreceive()
```javascript
  var rn42 = obniz.wired("RN42", 1, 2);
  rn42.onreceive = function(data, text) {
    console.log(text);
  }
```