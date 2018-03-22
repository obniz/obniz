# Peripherals I2C
i2cを利用できます。
i2cは１つのみ利用可能でi2c0のみ存在します。
通信速度は最大1Mhzです。
Master/Slaveモード。
Slaveモードでは書き込まれたデータを受け取れますが、読み取られるためのデータをセットしておくことはできません。

OverView
```Javascript
// Example
// master mode sda=2 scl=3 400khz no internal pullup
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
var ret = await obniz.i2c0.readWait(0x50, 1);
console.log("readed"+ret);

// use internal pullups
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000, pull:"5v"}); 
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:100000, pull:"3v"}); 

// slave mode
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address_length: 7, slave_address: 0x01});
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address_length: 7, slave_address: 0x01, pull: "5v"});
```

# obniz.getFreeI2C()
未使用のI2Cを返します。
```javascript
var i2c = obniz.getFreeI2C();
```
i2cはi2c0しかないので、返ってくるものはi2c0と同じです。i2c1はありません。
```javascript
(obniz.getFreeI2C() === obniz.i2c0) => true
```
もし、未使用のものがなければerrorが返ります。
```javascript
var i2c0 = obniz.getFreeI2C();
var i2c1 = obniz.getFreeI2C(); // Error
```

## start({mode, sda, scl, clock[, pull]})

i2cを有効化します。
SDA, SCLとして利用するioの番号が必要です。
また、通信速度はhzで指定します。

内部プルアップを指定するpullは出力設定オプションです.
何も指定しなければ，pull:nullが設定されます。その場合は外部抵抗でのプルアップが必要です。
出力設定についてはobniz.ioX.pull() 関数に詳細があります.
内部プルアップをつかう時に3.3vの相手と通信を行う場合は3vを選びます。これにより3.3vでpullupされます。
5vの相手と通信を行う場合で速度が遅くても良い場合は 5v を選びます。5vの内部プルアップが有効になります。

通信速度は内部プルアップを使う場合は最大100khz、それ以外の場合は最大1Mhzまで指定できます。

よりノイズの少ない安定した通信をするためには外部抵抗でプルアップすることをおすすめします。
400khzでの通信であっても外部で2.2kOhm程度でのプルアップ抵抗をSDA,SCL端子に接続して下さい。

```Javascript
// Javascript Example
// master mode sda=2 scl=3 400khz no internal pullup
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
var ret = await obniz.i2c0.readWait(0x50, 1);
console.log("readed"+ret);

// use internal pullups
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000, pull:"5v"}); 
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:100000, pull:"3v"}); 

// slave mode
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address_length: 7, slave_address: 0x01});
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address_length: 7, slave_address: 0x01, pull: "5v"});
```

## write(address, data);

addressにデータを送信します。
addressが0x7Fより大きな場合は自動的に10bitアドレスとして送信します。
それより小さな値でも10bitアドレスとして送信したい場合はwrite10bit関数を使って下さい。
dataの最大は1024バイトです。

Example

```Javascript
// Javascript Example
// master mode sda=2 scl=3 400khz no pullup
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
```
## write10bit(address, data);

addressにデータを送信します。
addressの値が何であれ必ず10bitアドレスモードで送信します。
dataの最大は1024バイトです。

```Javascript
// Javascript Example
// master mode sda=2 scl=3 400khz no pullup
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.write10bit(0x50, [0x00, 0x00, 0x12]);
```
## [await] readWait(address, length);

addressからlengthで指定しただけデータを読み取ります。
addressの扱いに関してはwriteのものと同じです。
lengthの最大は1024バイトです。

```Javascript
// Javascript Example
// master mode sda=2 scl=3 400khz no pullup
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
var ret = await obniz.i2c0.readWait(0x50, 1);
console.log("readed"+ret);
```

## [await] read10bitWait(address, length);

addressからlengthで指定しただけデータを読み取ります。
addressの値が何であれ必ず10bitアドレスモードで送信します。
lengthの最大は1024バイトです。

```Javascript
// Javascript Example
// master mode sda=2 scl=3 400khz no pullup
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
var ret = await obniz.i2c0.read10bitWait(0x50, 1);
console.log("readed"+ret);
```

## i2cX.onwritten = function(data){}
Slaveモードのみ。
データが書き込まれた時に呼び出されるcallbackです。
受信データはフラグメント化されています。
100byte書き込まれたとしても、56byteと44byteの２回に分けて届く可能性があります。
また、1024バイトを超えるデータはデータをロストする可能性があります。
```Javascript
// Javascript Example
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
obniz.i2c0.onwritten = function(data){
  console.log(data);
}
```

## end()

i2cを終了しIOを開放します。

```Javascript
// Javascript Example
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.end();
```