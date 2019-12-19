# BLE Central ペリフェラル

## peripheral.connected

接続中かどうかを返します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.connected) // => false
```


## peripheral.adv_data
advertise dataの生データを返します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
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
    uuids: ["FFF0"],
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
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.iBeacon)
```



<!-- ## peripheral.connect() -->
<!-- peripheralに接続します -->

<!-- ```Javascript -->
<!-- // Javascript Example -->

<!-- var target = { -->
    <!-- uuids: ["FFF0"], -->
<!-- }; -->
<!-- var peripheral = await obniz.ble.scan.startOneWait(target); -->

<!-- peripheral.connect(); -->

<!-- ``` -->




## \[await] peripheral.connectWait()
peripheralに接続します
接続に成功するとtrue，失敗するとfalseを返します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
}else{
    console.log("failed");
}
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
        obniz.ble.scan.end();
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```


## \[await] peripheral.disconnectWait()
peripheralから切断します
切断に成功するとtrue，失敗するとfalseを返します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        await obniz.wait(1000);
        var disconnected = await peripheral.disconnectWait();
    
        if(disconnected){
            console.log("disconnected");
        }else{
            console.log("disconnect failed");
        }
    }
}
```

## peripheral.ondisconnect
切断されたときに呼ばれます 

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
      
        obniz.ble.scan.end();
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

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      obniz.ble.scan.end();
      var connected = await peripheral.connectWait();

      if(connected){
          var services = await peripheral.discoverAllServicesWait();
          console.log("service discovery finish");
          for (var i=0; i<services.length; i++) {
              console.log('service UUID: ' + services[i].uuid)
          }
      }else{
          console.log("failed");
      }
    }
};

obniz.ble.scan.start();
```



## peripheral.onerror
何かしらエラーが発生したときに呼ばれます.
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
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

peripheral.onerror = function(err){
    console.log("error : " + err.message);
}

var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
    console.log(dataArray);
    
}


```
