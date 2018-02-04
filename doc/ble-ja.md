# BLE
Bluetooth Low Energyでperipheral/centralとして通信ができます

# obnizをperipheralとして使う

## startAdvertisement()

BLEのAdvertisementを開始します

```Javascript
obniz.ble.startAdvertisement();
obniz.ble.stopAdvertisement();
```



## stopAdvertisement()

BLEのAdvertisementを終了します

```Javascript
obniz.ble.startAdvertisement();
obniz.ble.stopAdvertisement();
```


## setAdvDataRaw(bytes[])

BLEのAdvertisementで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

Advertisementで出力するデータバイト列を生成するadvDataBuilderも参照ください



```Javascript
obniz.ble.setAdvData([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```

## setAdvData(setting)

settingに渡した引数に従って，BLEのAdvertisementで出力するデータを設定します



```Javascript
obniz.ble.setAdvData({
  flags: ["general_discoverable_mode","br_edr_not_supported"],
  manufacturerData:{
    campanyCode : 0x004C,
    data : [0x02,0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb,0x10,0x00,0x00,0x10,0xFF],
  },
});

obniz.ble.startAdvertisement();
```

設定できるパラメータフォーマットは下記のとおりです．


```Javascript
{
     flags: ["<flag>", ...] // <flag> = "limited_discoverable_mode", "general_discoverable_mode", 
                            //          "br_edr_not_supported", "le_br_edr_controller", "le_br_edr_host"        
     serviceUuids : [ "<service UUID>", ... ],  
     localName : "<name>",
     manufacturerData:{
     	campanyCode : <int>,
        data : [ <int>, ... ],
     },
   
}
```

## setScanRespDataRaw(data[])

BLEのScanResponseで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

ScanResponseで出力するデータバイト列を生成するscanRespDataBuilderも参照ください

```Javascript
obniz.ble.setScanRespData([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```



## setScanRespData(setting)

settingに渡した引数に従って，BLEのScan Responseで出力するデータを設定します

```Javascript
obniz.ble.setScanRespData({
  localName : "obniz BLE",
});

obniz.ble.startAdvertisement();
```

設定できるパラメータフォーマットは下記のとおりです．


```Javascript
{
     serviceUuids : [ "<service UUID>", ... ],  
     localName : "<name>",
     manufacturerData:{
     	campanyCode : <int>,
        data : [ <int>, ... ],
     },
}
```


# obnizをcentralとして使う

## startScan([setting])

settingに渡した引数に従って，BLEのscanを開始します

設定できるパラメータフォーマットは下記のとおりです．

```Javascript
{
     duration: 30,   //scanをする期間を秒で指定．デフォルト30秒
}
```

```Javascript
obniz.ble.startScan({duration : 10});

obniz.ble.startScan();   //引数なしも可能

```


## stopScan()
BLEのscanを停止します

```Javascript
obniz.ble.startScan({duration : 10});
await obniz.wait(5000);
obniz.ble.stopScan();
```

## onScan

scanでperipheralを発見すると呼ばれます
引数にperipheral objectが渡されます


```Javascript
obniz.ble.onscan = function(peripheral){
   alert(peripheral)
}

obniz.ble.startScan({duration : 10});
```


## peripheral.adv_data
advertise dataの生データを返します

```Javascript
obniz.ble.onscan = function(peripheral){
   alert(peripheral.adv_data)
}

obniz.ble.startScan({duration : 10});
```

## peripheral.localName()
advertise dataの中にlocal Name情報があればそれを返します

```Javascript
obniz.ble.onscan = function(peripheral){
   alert(peripheral.localName())
}

obniz.ble.startScan({duration : 10});
```


## peripheral.iBeacon()
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
obniz.ble.onscan = function(peripheral){
   alert(peripheral.iBeacon())
}
obniz.ble.startScan({duration : 10});
```


## peripheral.connect()
peripheralに接続します

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```


## peripheral.onconnect
接続が成功したときに呼ばれます

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.onconnect = function(){
            alert("success");
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```


## peripheral.disconnect()
peripheralから切断します

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.connect();
        wait obniz.wait(1000);
        peripheral.disconnect();
    }
}
obniz.ble.startScan({duration : 10});
```



## peripheral.onconnect
切断されたときに呼ばれます 

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.onconnect = function(){
            alert("success");
        }
        peripheral.ondisconnect = function(){
            alert("closed");
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```

## peripheral.getService(uuid).getCharacteristic(uuid).write(dataArray)
characteristicにdataArrayを書き込みます

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            var dataArray = [0x00, 0x00, ...];
            peripheral.getService("FF00").getCharacteristic("FF01").write(dataArray);
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});

```


## peripheral.getService(uuid).getCharacteristic(uuid).writeNumber(value)
characteristicに数字を4byteのbigadianとしてを書き込みます

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").writeNumber(1000);
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```



## peripheral.getService(uuid).getCharacteristic(uuid).writeText(str)
characteristicにdataArrayを書き込みます

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").writeText("My Name");
        }

        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```

## peripheral.onwritecharacteristic
characteristicに書き込みが完了したときに呼ばれます


```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").writeText("My Name");
        }
        peripheral.onwritecharacteristic = function(service, characteristic){
            if(service.uuid === "FF00" && characteristic.uuid === "FF01" ){
                alert("success");
            }
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```



## peripheral.getService(uuid).getCharacteristic(uuid).read()
characteristicからデータを読み込みます
結果は，onreadcharacteristicコールバックで呼ばれます

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").read();
        }
        peripheral.onreadcharacteristic = function(service, characteristic, dataArray){
            if(service.uuid === "FF00" && characteristic.uuid === "FF01" ){
                alert("value : " + dataArray);
            }
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```

## peripheral.onreadcharacteristic
characteristicからデータを読み込出したときに呼ばれます

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").read();
        }
        peripheral.onreadcharacteristic = function(service, characteristic, dataArray){
            if(service.uuid === "FF00" && characteristic.uuid === "FF01" ){
                alert("value : " + dataArray);
            }
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
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
}
```


```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").read();
        }
        peripheral.onreadcharacteristic = function(service, characteristic, dataArray){
            if(service.uuid === "FF00" && characteristic.uuid === "FF01" ){
                alert("value : " + dataArray);
            }
        }
        peripheral.onerror = function(err){
            alert("error : " + err.message);
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```





