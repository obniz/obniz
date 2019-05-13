# Peripherals UART
UARTモジュールです。
UARTは２つ利用可能で、
uart0からuart1までです。

## obniz.getFreeUart()
未使用のuartを返します。
```javascript
var uart = obniz.getFreeUart();
```
もし未使用のuartがなければエラーとなります。
```javascript
var uart0 = obniz.getFreeUart();
var uart1 = obniz.getFreeUart();
var uart2 = obniz.getFreeUart(); // Error
```

## start({tx, rx[, gnd, baud, stop, bits, parity, flow control, rts, cts, drive, pull ]})
uartを開始します。
txで指定したピンが送信でそこからデータがobnizから送信され、rxで指定したピンで受信します。
tx とrx以外は設定されて無くても動作します。その場合のデフォルト通信設定は以下のとおりです。

Defaults
- 速度 115200bps
- 非同期
- フローコントロールなし
- 8bit
- パリティなし
- 1 ストップビット
- 5v push-pull drive
- 内部プルアップなし

設定する場合、設定できるのは以下のとおりです

1. baud: number (default 115200)
2. stop: ストップビット幅 数値で 1(default)/1.5/2
3. bits: データ幅 数値で 8(default)/5/6/7
4. parity: パリティチェック 文字列で "off"(default)/"odd"/"even"
5. flowcontrol: フローコントロール 文字列で "off"(default)/"rts"/"cts"/"rts-cts"
6. rts: rtsで利用するピン番号 数値
7. cts: ctsで利用するピン番号 数値


```Javascript
// Javascript Example
obniz.io0.output(false) // for sharing GND.
obniz.uart0.start({tx: 1, rx: 2, baud:9600, bits:7 });
obniz.uart0.send("Hi");

obniz.uart1.start({tx: 3, rx: 4, cts:5, rts:6, flowcontrol: 'rts-cts'});
obniz.uart1.send("Hi");
```

## send(data)

データを送信します。
dataで送れるものは

- 文字 => utf8エンコードされたバイト列となります（ヌル文字は含まれません）
- 数字 => 1byteのデータになります
- 数字の配列 => １つ１つ1byteのデータとして送信されます
- Buffer/Array => そのまま送信されます

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})
obniz.uart0.send("Hi");
obniz.uart0.send(0x11);
obniz.uart0.send([0x11, 0x45, 0x44]);
```


## end()

uartを停止します。uartで使われていたピンは入力となります

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})
obniz.uart0.send("Hi");
obniz.uart0.end();
```
## onreceive

データを受信した時に呼び出されます。
第一引数のdataは受信したデータをarrayとして受け取れます。
第二引数のtextは受信したarrayをtextとして変換したものです。

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})
obniz.uart0.onreceive = function(data, text) {
  console.log(data);
  console.log(text);
}
obniz.uart0.send("Hello");
```

## isDataExists
受信済みで，まだ使用していないデータが無いかチェックします．
データがあればtrueを返します

もし`onreceive`を設定していれば，データが来ると同時に`onreceive`関数によって値を受け取るので，
この値は常にfalseになります．


```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    if(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readText());
    }
    await obniz.wait(10);  //wait for 10ms
}
```


## readByte
受信済みで，まだ使用していないデータを1byteだけ取得します

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    while(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readByte());
    }
    await obniz.wait(10);  //wait for 10ms
}
```


## readBytes
受信済みで，まだ使用していないデータをarrayで返します

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    if(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readBytes());
    }
    await obniz.wait(10);  //wait for 10ms
}
```

## readText
受信済みで，まだ使用していないデータを文字列で返します


```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    if(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readText());
    }
    await obniz.wait(10);  //wait for 10ms
}

```