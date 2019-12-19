# BLE Central

obnizデバイスをBLEのセントラルとして動作させ、ペリフェラルデバイスの検索と接続などを行います。

obnizOS 1.X.Xまたは2.X.Xのデバイスを操作する場合はobniz.js 2.X.Xの利用を推奨します. [https://github.com/obniz/obniz/releases/tag/v2.5.0](https://github.com/obniz/obniz/releases/tag/v2.5.0)

## \[await] initWait()

BLEを初期化します。すべての操作を行う前に１度のみ呼び出す必要があります。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 

```


## scan.start( \[target, \[setting]])

BLEのscanを開始します。
targetにuuidやlocalNameを設定すると，該当のperipheralのみscanします
settingに渡した引数に従って

設定できるパラメータフォーマットは下記のとおりです．

### target

| property | type | default | description |
|:--:|:--:|:--:|:--:|
| uuids | `array` | `[]` | サービスUUIDの配列。この中のいずれかをadvertisementに持つペリフェラルを探します。
| localName | `string` | null | デバイス名での探索を行います。

### target

| property | type | default | description |
|:--:|:--:|:--:|:--:|
| duration | `number` | `30` | スキャンのタイムアウトまでの時間
| duplicate | `boolean` | `false` | 同一ペリフェラルからのadvertisementを受け取るかどうかを指定します。デフォルトでは同一ペリフェラルの場合はonfindが二度呼ばれることはありません。


```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0","FFF1"],     //対象のuuidを含むperipheralをスキャンします
    localName: "obniz-BLE",     //対象のlocalNameを含むperipheralをスキャンします
};

var setting = {
    duration : 10   //scanをする期間を秒で指定．指定なしではデフォルト30秒
}

await obniz.ble.initWait(); 
obniz.ble.scan.start(target, setting);

```

引数なしではすべての検索となります。

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.scan.start();  // 引数なしも可能

```

探索したいサービスを持つペリフェラルのみを探すことも可能です。


```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};

await obniz.ble.initWait(); 
obniz.ble.scan.start(target);

```


## scan.end()
BLEのscanを停止します

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.scan.start();
await obniz.wait(5000);
obniz.ble.scan.end();
```


## scan.onfind

scanでperipheralを発見すると呼ばれます
引数にperipheral objectが渡されます


```Javascript
// Javascript Example

await obniz.ble.initWait(); 
obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

obniz.ble.scan.start();
```

## scan.onfinish

スキャンの時間が終了したら呼ばれます．


```Javascript
// Javascript Example

await obniz.ble.initWait(); 
obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

obniz.ble.scan.onfinish = function(peripheral){
   console.log("scan timeout!")
};

obniz.ble.scan.start();
```


## \[await] scan.startOneWait( \[target, \[setting]])
scanし，targetで指定された対象のうち，一番最初に見つかった一つのperipheralを返します．
２番目以降は無視されます．
引数はscan.startと同じです．

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
};

var peripheral = await obniz.ble.scan.startOneWait(target);
console.log(peripheral);
```

## \[await] scan.startAllWait( \[target, \[setting]])
scanし，targetで指定された対象すべてのperipheralを返します．
引数はscan.startと同じです．
この関数はscanがタイムアウトするまで継続します．
タイムアウトまでの時間はデフォルト30秒ですが，settingで変更可能です

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
};
var setting = {
    duration : 10  
}

var peripherals = await obniz.ble.scan.startAllWait(target,setting);

for(var peripheral of peripherals){
  console.log(peripheral);
}
```