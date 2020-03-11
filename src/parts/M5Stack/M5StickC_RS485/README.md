# M5StickC RS485
RS485-HAT is a TTL to RS485 converter for M5StickC.

![](image.jpg)

## wired(obniz, {tx, rx,{vcc, gnd, baud}})

connect to the obniz device.  
When using M5StickC, You do not need to assign pins. 

```javascript
// JavaScript Examples
var obniz = new Obniz.M5StickC("OBNIZ_ID_HERE");
obniz.onconnect = async function() {
  var rs485 = obniz.wired("M5StickC_RS485"); // M5stick C

  rs485.onreceive = function(data, text) {
    console.log(text);
  }
  $("#send").click(function(){
    rs485.send("Hello")
  })
}
```

When using other devices, White, yellow, red and black wires correspond to scl, sda, vcc and gnd respectively.  

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
tx | `number(obniz Board io)` | yes |  &nbsp; | tx
rx | `number(obniz Board io)` | yes | &nbsp;  | rx
baud | `number` | no | &nbsp;  | baudrate

```javascript
// Javascript Example
var rs485 = obniz.wired("M5StickC_RS485", {tx: 0, rx:26}); // M5stick C

rs485.onreceive = function(data, text) {
  console.log(text);
}
$("#send").click(function(){
  rs485.send("Hello")
})
```

## send(data)
send data via UART to RS485.
```javascript
// Javascript Example
var rs485 = obniz.wired("M5StickC_RS485", {tx: 0, rx:26}); // M5stick C
rs485.send("Hello")
```

## onreceive(data, text)
received data from RS485 via UART. This callback has same arguments with uart.onreceive()
```javascript
// Javascript Example
var rs485 = obniz.wired("M5StickC_RS485", {tx: 0, rx:26}); // M5stick C

rs485.onreceive = function(data, text) {
  console.log(text);
}
```
