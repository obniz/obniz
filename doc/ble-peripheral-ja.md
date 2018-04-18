# BLE
Bluetooth Low Energyでperipheral/centralとして通信ができます

# obnizをperipheralとして使う

## startAdvertisement()

BLEのAdvertisementを開始します。setAdvData/setAdvDataRaw関数で何をAdvertiseするのか指定できます。

```Javascript
// Javascript Example
var service = new obniz.ble.service({
  uuid : "FFF0"
});
obniz.ble.peripheral.addService(service); 
obniz.ble.setAdvData(service.advData);
obniz.ble.startAdvertisement();
```


## stopAdvertisement()

BLEのAdvertisementを終了します

```Javascript
// Javascript Example
obniz.ble.startAdvertisement();
obniz.ble.stopAdvertisement();
```


## setAdvDataRaw(bytes[])

BLEのAdvertisementで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

Advertisementで出力するデータバイト列を生成するadvDataBuilderも参照ください

```Javascript
// Javascript Example
obniz.ble.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```

## setAdvData(setting)

settingに渡した引数に従って，BLEのAdvertisementで出力するデータを設定します


```Javascript
// Javascript Example
obniz.ble.setAdvData({
  flags: ["general_discoverable_mode","br_edr_not_supported"],
  manufacturerData:{
    campanyCode : 0x004C,
    serviceUuids: ["fff0"],
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
// Javascript Example
obniz.ble.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```



## setScanRespData(setting)

settingに渡した引数に従って，BLEのScan Responseで出力するデータを設定します

```Javascript
// Javascript Example
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

## peripheral.addService(setting_json or service_obj)

peripheralとしてサービスを開始します
引数にjsonデータもしくはサービスオブジェクトを渡します．

```Javascript
/* Service without characteristics */
var service = new obniz.ble.service({"uuid" : "FFF0"});
obniz.ble.peripheral.addService(service);

/* Service with characteristics/descriptor */
var service = new obniz.ble.service({"uuid" : "FFF0"});
var characteristic = new obniz.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
var descriptor = new obniz.ble.descriptor({"uuid" : "2901", "text" : "hello wrold characteristic"});

service.addCharacteristic(characteristic);
characteristic.addDescriptor(descriptor);

obniz.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります
```

## peripheral.onconnectionupdates


外部デバイスが接続／切断されたときに呼ばれるコールバックです
    
```Javascript
obniz.ble.peripheral.onconnectionupdates = function(data){
  console.log("remote device ", data.address, data.status)
};

```

## peripheral.end()

peripheralのサービスを終了します
```Javascript

obniz.ble.peripheral.addService(setting);


obniz.ble.peripheral.end();

```


## new service(json)

サービスオブジェクトを作成します
jsonにはuuid（必須）およびcharacteristics（オプション）を設定できます

```Javascript
var service = new obniz.ble.service({
                "uuid" : "FFF0",
                "characteristics" : [{
                "uuid" : "FFF1",
                "data" : [0x0e, 0x00, ...], //data for dataArray or  text for string
                "descriptors" : [{
                    "uuid" : "2901",   //Characteristic User Description
                    "text" : "hello wrold characteristic", //data for dataArray or  text for string
                }]
                }]
            });
obniz.ble.peripheral.addService(service); 
```




## new characteristic(json)

```Javascript
var characteristic = new obniz.ble.characteristic({
                "uuid" : "FFF1",
                "data" : [0x0e, 0x00, ...],     //data for dataArray or  text for string
                "descriptors" : [{
                    "uuid" : "2901",   //Characteristic User Description
                    "text" : "hello wrold characteristic",    //data for dataArray or  text for string
                }]
                });

var service = new obniz.ble.service({
                  "uuid" : "FFF0",
                  "characteristics" : [ characteristic ]
});
obniz.ble.peripheral.addService(service); 
   
```

## characteristic.write(data)
characteristicに値を書き込みます


## characteristic.onwrite(data)
characteristic.witeのコールバックです


```Javascript 

characteristic.write([0xf0,0x27]);
characteristic.onwrite = function(val){
    console.log("write :",val.result);
}


```

## characteristic.read(data)
characteristicの値を読み込みます

## characteristic.onread(data)
characteristic.readのコールバックです

```Javascript 

characteristic.read();
characteristic.onread = function(val){
    console.log("read data :",val.data);
}


```

## characteristic.onwritefromremote(data)
characteristicが外部から変更されたときのコールバックです

```Javascript 

characteristic.onwritefromremote = function(val){
    console.log("remote address :",val.address);
    console.log("remote data :",val.data);
}

```

## characteristic.onreadfromremote(data)
characteristicが外部からよまれたときのコールバックです

```Javascript 

characteristic.onreadfromremote = function(val){
    console.log("remote address :",val.address);	
}

```




## new descriptor(json)

ディスクリプタを作成します


```Javascript
var descriptor = new obniz.ble.characteristic({
                      "uuid" : "2901",   //Characteristic User Description
                      "text" : "hello wrold characteristic",
                  });

var characteristic = new obniz.ble.characteristic({
                    "uuid" : "FFF1",
                    "text" : "Hi",
                    "descriptors" : [ descriptor ]
                  });

var service = new obniz.ble.service({
                  "uuid" : "FFF0",
                  "characteristics" : [ characteristic ]
});
obniz.ble.peripheral.addService(service); 
   
```


## descriptor.write(data)
descriptorに値を書き込みます

## descriptor.onwrite(data)
descriptor.witeのコールバックです



```Javascript 

descriptor.write([0xf0,0x27]);
descriptor.onwrite = function(val){
    console.log("write :",val.result);
}


```


## descriptor.read(data)
descriptorの値を読み込みます

## descriptor.onread(data)
descriptor.readのコールバックです


```Javascript 

descriptor.read();
descriptor.onread = function(val){
    console.log("read data :",val.data);
}


```

## descriptor.onwritefromremote(data)
descriptorが外部から変更されたときのコールバックです


```Javascript 

descriptor.onwritefromremote = function(val){
    console.log("remote address :",val.address);
    console.log("remote data :",val.data);
}

```

## descriptor.onreadfromremote(data)
descriptorが外部からよまれたときのコールバックです

```Javascript 

descriptor.onreadfromremote = function(val){
    console.log("remote address :",val.address);	
}

```


# obnizをcentralとして使う

## startScan([setting])

settingに渡した引数に従って，BLEのscanを開始します

設定できるパラメータフォーマットは下記のとおりです．

```Javascript
// Javascript Example
obniz.ble.startScan({
  duration : 10   //scanをする期間を秒で指定．指定なしではデフォルト30秒
});

obniz.ble.startScan();  // 引数なしも可能

```


## stopScan()
BLEのscanを停止します

```Javascript
// Javascript Example
obniz.ble.startScan({duration : 10});
await obniz.wait(5000);
obniz.ble.stopScan();
```

## onScan

scanでperipheralを発見すると呼ばれます
引数にperipheral objectが渡されます


```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
   console.log(peripheral)
}

obniz.ble.startScan({duration : 10});
```


## peripheral.advertise_data
advertise dataの生データを返します

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
   console.log(peripheral.advertise_data)
}

obniz.ble.startScan({duration : 10});
```

## peripheral.localName()
advertise dataの中にlocal Name情報があればそれを返します

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
   console.log(peripheral.localName())
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
// Javascript Example
obniz.ble.onscan = function(peripheral){
   console.log(peripheral.iBeacon())
}
obniz.ble.startScan({duration : 10});
```


## peripheral.connect()
peripheralに接続します

```Javascript
// Javascript Example
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
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.onconnect = function(){
            console.log("success");
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```


## peripheral.disconnect()
peripheralから切断します

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.connect();
        await obniz.wait(1000);
        peripheral.disconnect();
    }
}
obniz.ble.startScan({duration : 10});
```



## peripheral.ondisconnect
切断されたときに呼ばれます 

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.onconnect = function(){
            console.log("success");
        }
        peripheral.ondisconnect = function(){
            console.log("closed");
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```

## peripheral.getService(uuid).getCharacteristic(uuid).write(dataArray)
characteristicにdataArrayを書き込みます

```Javascript
// Javascript Example
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
characteristicに数字を1byteとしてを書き込みます

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").writeNumber(100);
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```



## peripheral.getService(uuid).getCharacteristic(uuid).writeText(str)
characteristicにdataArrayを書き込みます

```Javascript
// Javascript Example
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

## characteristic.onwrite
characteristicに書き込みが完了したときに呼ばれます


```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

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
obniz.ble.startScan({duration : 10});
```



## peripheral.getService(uuid).getCharacteristic(uuid).read()
characteristicからデータを読み込みます
結果は，onreadコールバックで呼ばれます

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

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
obniz.ble.startScan({duration : 10});
```

## characteristic.onread
characteristicからデータを読み込出したときに呼ばれます

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

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
obniz.ble.startScan({duration : 10});
```

## peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).write(dataArray)
descriptorにdataArrayを書き込みます

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            var dataArray = [0x00, 0x00, ...];
            peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").write([0x4f, 0x62, 0x6e, 0x69, 0x7a]);
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});

```

x

## descriptor.onwrite
descriptorに書き込みが完了したときに呼ばれます


```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            var descriptor = peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901");
            descriptor.write();
            descriptor.onwrite = function(resutls){
                console.log(results); //"success" or "failed"
            }
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```



## peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor("2901").read()
descriptorからデータを読み込みます
結果は，onreadコールバックで呼ばれます

```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            var descriptor = peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901");
            descriptor.read();
            descriptor.onread = function(dataArray){
                console.log("value : " + dataArray);
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
   descriptor_uuid : "FF01", //hex string or null
}
```


```Javascript
// Javascript Example
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").read();
        }
        peripheral.onreadcharacteristic = function(service, characteristic, dataArray){
            if(service.uuid === "FF00" && characteristic.uuid === "FF01" ){
                console.log("value : " + dataArray);
            }
        }
        peripheral.onerror = function(err){
            console.log("error : " + err.message);
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```





