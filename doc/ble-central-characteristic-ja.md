# BLE Central キャラクタリスティク

## characteristics.uuid

キャラクタリスティクスのIDの文字列です

```javascript
console.log(characteristics.uuid); // => 'FF00'
```

## characteristics.properties

キャラクタリスティクスのプロパティの配列です。書き込み専用なのかなどの属性を示します。
配列に含まれる可能性がある文字列は以下のとおりです。

`broadcast`, `notify`, `read`, `write`, `write_without_response`, `indicate`

```javascript
console.log(characteristics.properties); // => ['read', 'write', 'notify']
```

詳しくはこちらを参照 [https://www.bluetooth.com/ja-jp/specifications/bluetooth-core-specification/](https://www.bluetooth.com/ja-jp/specifications/bluetooth-core-specification/)

## \[await] characteristics.writeWait(dataArray)
characteristicにdataArrayを書き込みます
失敗した場合はエラーがthrowされます。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 

var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = [0x02, 0xFF];
    await peripheral.getService("FF00").getCharacteristic("FF01").writeWait(dataArray);
    console.log("write success");
}

```


## \[await] characteristics.writeNumberWait(value)
characteristicに数字を1byteとしてを書き込みます
失敗した場合はエラーがthrowされます。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);c

    await peripheral.getService("FF00").getCharacteristic("FF01").writeNumberWait(100);
    console.log("write success");
}
```


## \[await] characteristics.writeTextWait(str)
characteristicに文字列を書き込みます
失敗した場合はエラーがthrowされます。

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    await peripheral.getService("FF00").getCharacteristic("FF01").writeTextWait("My Name");
    console.log("write success");
}
```
<!-- 
## characteristic.onwrite
characteristicに書き込みが完了したときに呼ばれます


```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

        peripheral.onconnect = function(){
            var characteristic = peripheral.getService("FF00").getCharacteristic("FF01");
            characteristic.writeText("My Name");
            characteristic.onwrite = function(resutls){
                console.log(results); //"success" or "failed"
            }
        }
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```
-->


## \[await] characteristics.readWait()
characteristicからデータを読み込みます
読み込みに成功するとデータの入ったArrayが,失敗するとエラーがthrowされます

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
    console.log(dataArray);
}
```
<!--
## characteristic.onread
characteristicからデータを読み込出したときに呼ばれます

```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

        peripheral.onconnect = function(){
            var characteristic = peripheral.getService("FF00").getCharacteristic("FF01");
            characteristic.read();
            characteristic.onread = function(dataArray){
                console.log("value : " + dataArray);
            }
        }

        peripheral.connect();
    }
}
obniz.ble.scan.start();
```
-->

## characteristics.registerNotify(func)

キャラクタリスティクスの値が変化したときに呼ばれる関数を設定します。


```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};

var peripheral = await obniz.ble.scan.startOneWait(target);
await peripheral.connectWait();
let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
char.onregisternotify = function() {
  console.log("register finshed")
}

char.registerNotify( function(data){
  console.log("notify with data " + data.join(','));
});
    
```

## characteristics.onregisternotify = ()=>{}

`registerNotify()`での関数の登録が完了したときに呼ばれる関数を指定できます。

## \[await] characteristics.registerNotifyWait(func)

キャラクタリスティクスの値が変化したときに呼ばれる関数を設定します。設定が完了するまで待機します。


```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};

var peripheral = await obniz.ble.scan.startOneWait(target);
await peripheral.connectWait();
let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
await char.registerNotifyWait( function(data){
  console.log("notify with data " + data.join(','));
});
    
```


## characteristics.unregisterNotify()

`registerNotify`または`registerNotifyWait`で設定した関数の登録を解除します。


```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};

var peripheral = await obniz.ble.scan.startOneWait(target);
await peripheral.connectWait();
let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
char.onregisternotify = function() {
  console.log("register finshed")
  char.unregisterNotify();
}

char.onunregisternotify = function() {
  console.log("unregistrated")
}

char.registerNotify( function(data){
  console.log("notify with data " + data.join(','));
});
    
```

## characteristics.onunregisternotify = ()=>{}

`unregisterNotify()`が完了したときに呼ばれる関数を指定できます。

## \[await] characteristics.unregisterNotifyWait()


`registerNotify`または`registerNotifyWait`で設定した関数の登録を解除します。解除が完了するまで待機します。

```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};

var peripheral = await obniz.ble.scan.startOneWait(target);
await peripheral.connectWait();
let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
await char.registerNotifyWait( function(data){
  console.log("notify with data " + data.join(','));
});
await char.unregisterNotifyWait();
console.log("unregistrated")
    
```



## characteristics.descriptors

キャラクタリスティクスに含まれるディスクリプタの一覧の配列です。
接続時に自動検索され、代入されています。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(!peripheral) {
    console.log('no such peripheral')
    return;
}
try {
  await peripheral.connectWait();
  console.log("connected");
  var service = peripheral.getService("1800")
  var c = service.getCharacteristic("fff0")
  for (var d of c.descriptors) {
    console.log(d.uuid)
  }
} catch(e) {
  console.error(e);
}
```

## characteristics.getDescriptor(uuid: string)

キャラクタリスティクスに含まれるディスクリプタのうち、uuidで文字列で指定したディスクリプタを取得します。存在しない場合はnullが返ります。

uuidの大文字と小文字は区別されません。`aa00`と`AA00`は同じです。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(!peripheral) {
    console.log('no such peripheral')
    return;
}
try {
  await peripheral.connectWait();
  console.log("connected");
  var service = peripheral.getService("1800")
  var c = service.getCharacteristic("fff0")
  var d = c.getDescriptor("fff0")
  console.log(d.uuid)
} catch(e) {
  console.error(e);
}
```

