# BLE Central ペリフェラル

## peripheral.connected

接続中かどうかを返します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.connected) // => false
```

## peripheral.rssi

電波強度(dBm)を数値で表示します。

```Javascript
// Javascript Example

await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName, peripheral.rssi); // null, -80
};

obniz.ble.scan.start();
```


## peripheral.adv_data
advertise dataの生データを返します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.adv_data)
```


## peripheral.localName
advertise dataの中にlocal Name情報があればそれを返します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.localName)
```



## peripheral.iBeacon
advertise dataの中にiBeacon情報があればそれを返します．なければnullを返します
返り値は下記のとおりです．

```
{
    uuid : "907e1d1d-d85d-497f-9e93-4c813a459cae", //hex string
    major : 1000, //number
    minor : 100, //number
    power : 300, //number
    rssi : -22, //number
}
```

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.iBeacon)
```


## \[await] peripheral.connectWait()

peripheralに接続します。
接続とスキャンは同時に利用できないため、scan中の場合にはscanは停止されます。
接続に失敗した場合はthrowとなります。

接続に成功するとペリフェラルの持つサービスとそれに紐づくキャラクタリスティクスとそれに紐づディスクリプタのdiscoveryを自動的に行います。
すべてが完了した段階でconnectWait()の完了となります。

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
} catch(e) {
  console.log("can't connect");
}
```


## peripheral.connect()

peripheralに接続します。
接続とスキャンは同時に利用できないため、scan中の場合にはscanは停止されます。
接続完了すると`onconnect`に設定された関数が呼び出され、接続できない場合は`ondisconnect`が呼ばれます。

接続に成功するとペリフェラルの持つサービスとそれに紐づくキャラクタリスティクスとそれに紐づディスクリプタのdiscoveryを自動的に行います。
すべてが完了した段階で`onconnect`が呼び出されます。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){
        peripheral.onconnect = function(){
            console.log("success");
        }
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```


## peripheral.onconnect
接続が成功したときに呼ばれます

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){
        peripheral.onconnect = function(){
            console.log("success");
        }
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```

## peripheral.ondisconnect

切断されたとき、又は接続に失敗したときに呼ばれます 

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){
        peripheral.onconnect = function(){
            console.log("success");
        }
        peripheral.ondisconnect = function(){
            console.log("closed");
        }
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```

## \[await] peripheral.disconnectWait()
peripheralから切断します

切断に失敗するとthrowします。

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
    await peripheral.disconnectWait();
    console.log("disconnected");
} catch(e) {
    console.log("can't connect / can't disconnect");
}
```

<!--
## peripheral.discoverAllServices()

接続中ペリフェラルに登録されているサービス一覧を取得します。
サービスは１つ見つけるごとに`ondiscoverservice`に設定した関数呼ばれ、完了すると`ondiscoverservicefinished`に設定した関数が１度呼ばれる。

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      
        peripheral.onconnect = function(){
            console.log("connected");
            peripheral.discoverAllServices();
            peripheral.ondiscoverservice = function (service) {
                console.log('service UUID: ' + service.uuid);
            }
            peripheral.ondiscoverservicefinished = function (service) {
                console.log("service discovery finished")
            }
        }
      
        peripheral.ondisconnect = function(){
            console.log("disconnected");
        }
      
        peripheral.connect();
    }
};

obniz.ble.scan.start();
```

## ondiscoverservice = (service) => {}

`discoverAllServices()`によりサービスが見つかったときに呼び出される関数を設定する。引数にはサービスオブジェクトが含まれる。

## ondiscoverservicefinished = () => {}

`discoverAllServices()`によるサービス検索が完了したときに呼び出される関数を設定する。

## \[await] peripheral.discoverAllServicesWait()

`discoverAllServices()`が完了するまで待機し、検索した結果見つかったサービス一覧を取得する。

この関数は並列で呼び出さないでください。この関数は１つを実行中にもう１つ並列で実行すると動作が不安定となります。

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      await peripheral.connectWait();
        var services = await peripheral.discoverAllServicesWait();
        console.log("service discovery finish");
        for (var i=0; i<services.length; i++) {
            console.log('service UUID: ' + services[i].uuid)
        }
    }
};

obniz.ble.scan.start();
```
-->


## peripheral.services

connect後に発見されたサービスの一覧が入っています。connectしたあとに利用できます。

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
  for (var service of peripheral.services) {
      console.log(service.uuid)
  }
} catch(e) {
  console.error(e);
}
```

## peripheral.getService(uuid: string)

引数の文字列で指定したUUIDを持つサービスを返します。通信は発生せず、connect時の自動discoverの結果に含まれるかどうかが判定されます。

英語の大文字小文字は区別されません。`aa00`の指定と`AA00`の指定は同じになります。

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
  if (!service) {
      console.log("service not found")
      return;
  }
  console.log(service.uuid) // => 1800 or 
} catch(e) {
  console.error(e);
}
```


## peripheral.onerror

ペリフェラルに関するエラーが発生したときに呼ばれます.
引数にエラー内容がわたされます

引数に渡されるのは次の内容です
```Javascript
{
   error_code : 1,
   message : "ERROR MESSAGE",
   device_address : "abcdefghijkl", //hex string or null
   service_uuid : "FF00",           //hex string or null
   characteristic_uuid : "FF01", //hex string or null
   descriptor_uuid : "FF01", //hex string or null
}
```


```Javascript
// Javascript Example
await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

peripheral.onerror = function(err){
    console.log("error : " + err.message);
}

```
