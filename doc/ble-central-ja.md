# obnizをcentralとして使う

## scan.start( \[target, \[setting]])

BLEのscanを開始します
targetにuuidやlocalNameを設定すると，該当のperipheralのみscanします
settingに渡した引数に従って

設定できるパラメータフォーマットは下記のとおりです．

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0","FFF1"],     //対象のuuidを含むperipheralをスキャンします
    localName: "obniz-BLE",     //対象のlocalNameを含むperipheralをスキャンします
};

var setting = {
    duration : 10   //scanをする期間を秒で指定．指定なしではデフォルト30秒
}
obniz.ble.scan.start(target, setting);

```

引数なしや,ターゲットのみ指定も可能です．

```Javascript
// Javascript Example
obniz.ble.scan.start();  // 引数なしも可能

```


```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};

obniz.ble.scan.start(target);

```


## scan.end()
BLEのscanを停止します

```Javascript
// Javascript Example
obniz.ble.scan.start();
await obniz.wait(5000);
obniz.ble.scan.end();
```


## scan.onfind

scanでperipheralを発見すると呼ばれます
引数にperipheral objectが渡されます


```Javascript
// Javascript Example

obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

obniz.ble.scan.start();
```

## scan.onfinish

スキャンの時間が終了したら呼ばれます．


```Javascript
// Javascript Example

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

## peripheral.adv_data
advertise dataの生データを返します

```Javascript
// Javascript Example
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


## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeWait(dataArray)
characteristicにdataArrayを書き込みます
成功すればtrue，失敗したらfalseが返ります

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = [0x02, 0xFF];
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeWait(dataArray);
        if(result){
            console.log("write success");
        }
    }
}

```


## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeNumberWait(value)
characteristicに数字を1byteとしてを書き込みます
成功すればtrue，失敗したらfalseが返ります

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);c
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeNumberWait(100);
        if(result){
            console.log("write success");
        }
    }
}
```




## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeTextWait(str)
characteristicに文字列を書き込みます
成功すればtrue，失敗したらfalseが返ります

```Javascript
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeTextWait("My Name");
        if(result){
            console.log("write success");
        }
    }
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


## \[await] peripheral.getService(uuid).getCharacteristic(uuid).readWait()
characteristicからデータを読み込みます
読み込みに成功するとデータの入ったArrayが,失敗するとundefinedが返ります

```Javascript
// Javascript Example
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
        console.log(dataArray);
        
    }
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

## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).registerNotify(func)

peripheralからnotifyがきたときに受け取る関数を設定します．
notifyを受け取るためには，BLEの仕様上，CCCD Descriptor(0x2902)を書き込む必要があります

```javascript
var target = {
  localName: "obniz-notify"
};

var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();
if(connected){
  let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  let cccd = char.getDescriptor("2902");
  let result = await cccd.writeWait([0x00, 0x01]); // register cccd for remote peripheral 

  console.log(await cccd.readWait()); // check cccd 

  char.registerNotify( function(){
    console.log("notify");
  });


}else{
  console.log("cannnot connected");

}
    
```




## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeWait(dataArray)
descriptorにdataArrayを書き込みます
成功すればtrue，失敗したらfalseが返ります

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = [0x02, 0xFF];
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
        if(result){
            console.log("write success");
        }
    }
}

```


## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeNumber(value)
descriptorに数字を1byteとしてを書き込みます
成功すればtrue，失敗したらfalseが返ります

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeNumberWait(100);
        if(result){
            console.log("write success");
        }
    }
}
```



## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeText(str)
descriptorに文字列を書き込みます
成功すればtrue，失敗したらfalseが返ります


```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeTextWait("My Name");
        if(result){
            console.log("write success");
        }
    }
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

## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).readWait()
descriptorからデータを読み込みます
読み込みに成功するとデータの入ったArrayが,失敗するとundefinedが返ります

```Javascript
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
        console.log(dataArray);
        
    }
}
```


<!--
## descriptor.onread
descriptorからデータを読み込出したときに呼ばれます

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





