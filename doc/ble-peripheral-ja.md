# obnizをperipheralとして使う

## advertisement.start()

BLEのAdvertisementを開始します。setAdvData/setAdvDataRaw関数で何をAdvertiseするのか指定できます。

```Javascript
// Javascript Example
var service = new obniz.ble.service({
  uuid : "FFF0"
});
obniz.ble.peripheral.addService(service); 
obniz.ble.advertisement.setAdvData(service.advData);
obniz.ble.advertisement.start();
```


## advertisement.end()

BLEのAdvertisementを終了します

```Javascript
// Javascript Example
obniz.ble.advertisement.start();
obniz.ble.advertisement.end();
```


## advertisement.setAdvDataRaw(bytes[])

BLEのAdvertisementで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

Advertisementで出力するデータバイト列を生成するadvDataBuilderも参照ください

```Javascript
// Javascript Example
obniz.ble.advertisement.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```

## advertisement.setAdvData(setting)

settingに渡した引数に従って，BLEのAdvertisementで出力するデータを設定します


```Javascript
// Javascript Example
obniz.ble.advertisement.setAdvData({
  flags: ["general_discoverable_mode","br_edr_not_supported"],
  manufacturerData:{
    companyCode : 0x004C,
    serviceUuids: ["fff0"],
    data : [0x02,0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb,0x10,0x00,0x00,0x10,0xFF],
  },
});

obniz.ble.advertisement.start();
```

設定できるパラメータフォーマットは下記のとおりです．


```Javascript
{
     flags: ["<flag>", ...] // <flag> = "limited_discoverable_mode", "general_discoverable_mode", 
                            //          "br_edr_not_supported", "le_br_edr_controller", "le_br_edr_host"        
     serviceUuids : [ "<service UUID>", ... ],  
     localName : "<name>",
     manufacturerData:{
     	companyCode : <int>,
        data : [ <int>, ... ],
     },
}
```

## advertisement.setScanRespDataRaw(data[])

BLEのScanResponseで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

ScanResponseで出力するデータバイト列を生成するscanRespDataBuilderも参照ください

```Javascript
// Javascript Example
obniz.ble.advertisement.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```



## advertisement.setScanRespData(setting)

settingに渡した引数に従って，BLEのScan Responseで出力するデータを設定します

```Javascript
// Javascript Example
obniz.ble.advertisement.setScanRespData({
  localName : "obniz BLE",
});

obniz.ble.advertisement.start();
```

設定できるパラメータフォーマットは下記のとおりです．


```Javascript
{
     serviceUuids : [ "<service UUID>", ... ],  
     localName : "<name>",
     manufacturerData:{
     	companyCode : <int>,
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
var descriptor = new obniz.ble.descriptor({"uuid" : "2901", "text" : "hello world characteristic"});

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

peripheralのサービスをすべて終了します
```Javascript

obniz.ble.peripheral.addService(service1);
obniz.ble.peripheral.addService(service2);


obniz.ble.peripheral.end();  //service1 and service2 end.

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
            "text" : "hello world characteristic", //data for dataArray or  text for string
        }]
    }]
});
obniz.ble.peripheral.addService(service); 
```

## service.end()

サービスを終了します
```Javascript

var service = new obniz.ble.service({   "uuid" : "FFF0" });
obniz.ble.peripheral.addService(service); 

service.end();

```




## new characteristic(json)

```Javascript
var characteristic = new obniz.ble.characteristic({
    "uuid" : "FFF1",
    "properties" : ["read","write"],  // read, write, notify
    "data" : [0x0e, 0x00, ...],     //data for dataArray or  text for string
    "descriptors" : [{
        "uuid" : "2901",   //Characteristic User Description
        "text" : "hello world characteristic",    //data for dataArray or  text for string
    }]
});

var service = new obniz.ble.service({
                  "uuid" : "FFF0",
                  "characteristics" : [ characteristic ]
});
obniz.ble.peripheral.addService(service); 
   
```

<!--
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
-->

## \[await] characteristic.writeWait(data)
characteristicに値を書き込みます
成功するとtrue,失敗するとfalseが返ります

```Javascript 
let result =  await characteristic.writeWait([0xf0,0x27]);

if(result){
    console.log("write success");
}

```

<!--
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

-->

## \[await] characteristic.readWait()
characteristicの値を読み込みます
成功するとdataのはいったArrayが,失敗するとundefinedが返ります

```Javascript 
let data =  await characteristic.readWait()

console.log("data: " , data );


```

## characteristic.onwritefromremote(address, newvalue)
characteristicが外部から変更されたときのコールバックです

```Javascript 

characteristic.onwritefromremote = function(address, newvalue){
    console.log("remote address :",address);
    console.log("remote data :",newvalue);
}

```

## characteristic.onreadfromremote(address)
characteristicが外部からよまれたときのコールバックです

```Javascript 

characteristic.onreadfromremote = function(address){
    console.log("remote address :",address);	
}

```

## characteristic.notify()
接続済みのcentralに対してnotifyを出します．
BLEの仕様上，CCCDのdescriptor(0x2901)が必要です．

```javascript
var characteristic = new obniz.ble.characteristic({
  uuid: 'FFF1',
  data: [0x0e, 0x00],
  properties : ["read","write","notify"],  // add notify properties
  descriptors: [
    {
      uuid: '2902', //CCCD
      data: [0x00, 0x00],  //2byte
    }, 
  ],
});

var service = new obniz.ble.service({
  uuid: 'FFF0',
  characteristics: [characteristic],
});
obniz.ble.peripheral.addService(service);


// after central connected
characteristic.notify();

```



## new descriptor(json)

ディスクリプタを作成します


```Javascript
var descriptor = new obniz.ble.characteristic({
                      "uuid" : "2901",   //Characteristic User Description
                      "text" : "hello world characteristic",
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

<!--
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
-->


## descriptor.writeWait(data)
descriptorに値を書き込みます
成功するとtrue,失敗するとfalseが返ります

```Javascript 
let result =  await descriptor.writeWait([0xf0,0x27]);

if(result){
    console.log("write success");
}

```
<!--

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
-->

## \[await] descriptor.readWait()
descriptorに値を読み込みます
成功するとdataのはいったArrayが,失敗するとundefinedが返ります

```Javascript 
let data =  await descriptor.readWait()

console.log("data: " , data );


```

## descriptor.onwritefromremote
descriptorが外部から変更されたときのコールバックです


```Javascript 

descriptor.onwritefromremote = function(val){
    console.log("remote address :",val.address);
    console.log("remote data :",val.data);
}

```

## descriptor.onreadfromremote
descriptorが外部からよまれたときのコールバックです

```Javascript 

descriptor.onreadfromremote = function(val){
    console.log("remote address :",val.address);	
}

```



