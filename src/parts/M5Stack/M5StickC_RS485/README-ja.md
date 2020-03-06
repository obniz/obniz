# M5StickC RS485

M5StickC用のRS485-HAT は RS485 converterです。

![](image.jpg)

## wired(obniz, {tx, rx,{vcc, gnd, baud}})

obnizデバイスと接続します。  
M5StickCと接続する場合は、txを0に、rxを26に指定してください。

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
```

## send(data)

RS485にデータを送信します。

```javascript
// Javascript Example
var rs485 = obniz.wired("M5StickC_RS485", {tx: 0, rx:26}); // M5stick C
rs485.send("Hello")
```

## onreceive(data, text)

RS485から受信したデータのコールバックになります。
uart.onreceive()と同様の仕様です。

```javascript
// Javascript Example
var rs485 = obniz.wired("M5StickC_RS485", {tx: 0, rx:26}); // M5stick C

rs485.onreceive = function(data, text) {
  console.log(text);
}
```
