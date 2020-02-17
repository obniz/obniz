# M5StickC RS485
RS485-HAT is a TTL to RS485 converter for M5StickC.

![](image.jpg)

## wired(obniz, {tx, rx,{vcc, gnd, baud}})


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
