# RN42
BluetoothClassic Module.
SPP and HID profile can be used.

![](./image.jpg)

## wired(obniz, {tx, rx})
RN42 require 3.3v supply. You should supply stable 3.3v to RN42.

```javascript
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2}); // io1 is tx to RN42, io2 is rx from RN42

rn42.config({
  display_name: "obniz",
  master_slave: "slave",
  profile: "HID",
  auth: "just-work",
  power: 16,
})

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
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2});
rn42.send("Hello")
```

## onreceive(data, text)
received data from RN42 via UART. This callback has same arguments with uart.onreceive()
```javascript
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2});
rn42.onreceive = function(data, text) {
  console.log(text);
}
```

## config(json)
set configuration to rn42 and reboot it.
```javascript
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2});
rn42.config({
  display_name: "obniz",
  master_slave: "slave",
  profile: "HID",
  auth: "just-work",
  power: 16,
})
```

available configurations

### display_name
Bluetooth devicename.

### master_slave
Bluetooth mode.

1. "slave"
2. "master"
3. "trigger"
4. "auto-connect-master"
5. "auto-connect-dtr"
6. "auto-connect-any", "pairing"]

### profile
Bluetooth Protocol Profile

1. "SPP"
2. "DUN-DCE"
3. "DUN-DTE"
4. "MDM-SPP"
5. "SPP-DUN-DCE"
6. "APL"
7. "HID"

### auth
authentication on connection

1. "open"
2. "ssp-keyboard"
3. "just-work"
4. "pincode"

### power
tx maximum power in dbm

1. 16
2. 12
3. 8
4. 4
5. 0
6. -4
7. -8

### hid_flag
HID flag. switching keyboard/mouse etc.

## enterCommandMode()
force rn42 to command mode.
```javascript
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2});
rn42.enterCommandMode();
rn42.sendCommand("SM,0");
```

## sendCommand(data)
send a text with "\n" tail and freezing 100msec after command sent.
```javascript
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2});
rn42.enterCommandMode();
rn42.sendCommand("SM,0");
```

## config_get_setting()
send get basic setting from rn42
```javascript
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2});
rn42.onreceive = function(data, text) {
  console.log(text);
}
rn42.enterCommandMode();
rn42.config_get_setting();
```

## config_get_extendSetting()
send get basic setting from rn42
```javascript
// Javascript Example
var rn42 = obniz.wired("RN42", {tx: 1, rx:2});
rn42.onreceive = function(data, text) {
  console.log(text);
}
rn42.enterCommandMode();
rn42.config_get_setting();
```