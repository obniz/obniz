# Peripherals UART
UARTモジュールです。
UARTは２つ利用可能で、
uart0からuart1までです。

## start(tx, rx, baud, stop, bits, parity, flow control, rts, cts)
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

設定する場合、設定できるのは以下のとおりです

1. baud: number (default 115200)
2. stop: ストップビット幅 数値で 1(default)/1.5/2
3. bits: データ幅 数値で 8(default)/5/6/7
4. parity: パリティチェック 文字列で "off"(default)/"odd"/"even"
5. flowcontrol: フローコントロール 文字列で "off"(default)/"rts"/"cts"/"rts-cts"
6. rts: rtsで利用するピン番号 数値
7. cts: ctsで利用するピン番号 数値


```Javascript
// Example
obniz.uart0.start(1, 2, 9600, null, 7);  // speed changed to 9600. bits = 7bit
obniz.uart0.send("Hi");
```
## send(data)

データを送信します。
dataで送れるものは

- 文字
- 数字 => 1byteのデータになります
- 数字の配列 => １つ１つ1byteのデータとして送信されます
- オブジェクト => 文字になります
- Buffer => そのまま送信されます

```Javascript
// Example
obniz.uart0.start(1, 2); // 1 is output, 2 is input
obniz.uart0.send("Hi");
obniz.uart0.send(0x11);
obniz.uart0.send([0x11, 0x45, 0x44]);
obniz.uart0.send({success: true});
```
## end()

uartを停止します。uartで使われていたピンは入力となります

```Javascript
// Example
obniz.uart0.start(1, 2);
obniz.uart0.send("Hi");
obniz.uart0.end();
```
## onreceive

データを受信した時に呼び出されます。
第一引数のdataは受信したデータをarrayとして受け取れます。
第二引数のtextは受信したarrayをtextとして変換したものです。

```Javascript
// Example
obniz.uart0.start(0, 1); // 0 is output, 1 is input
obniz.uart0.onreceive = function(data, text) {
  console.log(data);
  console.log(text);
}
obniz.uart0.send("Hello");
```