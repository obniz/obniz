# BLE ペリフェラル

BLE ペリフェラルを使うことでデバイスをBLEのペリフェラルデバイスとして利用することができます。

obnizOS 1.X.Xまたは2.X.Xのデバイスを操作する場合はobniz.js 2.X.Xの利用を推奨します. [https://github.com/obniz/obniz/releases/tag/v2.5.0](https://github.com/obniz/obniz/releases/tag/v2.5.0)

## \[await] initWait()

BLEを初期化します

```Javascript
// Javascript Example

await obniz.ble.initWait(); 

```

## advertisement.start()

BLEのAdvertisementを開始します。setAdvData/setAdvDataRaw関数で何をAdvertiseするのか指定できます。

advertisement の間隔は 1.28sec で固定です。

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
var service = new obniz.ble.service({
  uuid : "fff0"
});
obniz.ble.peripheral.addService(service); 
obniz.ble.advertisement.setAdvData(service.advData);
obniz.ble.advertisement.start();
```



## advertisement.end()

BLEのAdvertisementを終了します

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.advertisement.start();
obniz.ble.advertisement.end();
```


## advertisement.setAdvDataRaw(bytes[])

BLEのAdvertisementで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

Advertisementで出力するデータバイト列を生成するadvDataBuilderも参照ください

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.advertisement.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```

## advertisement.setAdvData(setting)

settingに渡した引数に従って，BLEのAdvertisementで出力するデータを設定します


```Javascript
// Javascript Example
await obniz.ble.initWait(); 
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
await obniz.ble.initWait(); 
obniz.ble.advertisement.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```



## advertisement.setScanRespData(setting)

settingに渡した引数に従って，BLEのScan Responseで出力するデータを設定します

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
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
await obniz.ble.initWait(); 
/* Service without characteristics */
var service = new obniz.ble.service({"uuid" : "fff0"});
obniz.ble.peripheral.addService(service);

/* Service with characteristics/descriptor */
var service = new obniz.ble.service({"uuid" : "fff0"});
var characteristic = new obniz.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
var descriptor = new obniz.ble.descriptor({"uuid" : "2901", "text" : "hello world characteristic"});

service.addCharacteristic(characteristic);
characteristic.addDescriptor(descriptor);

obniz.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります
```


## peripheral.onconnectionupdates = (data) => {}

外部デバイスが接続／切断されたときに呼ばれるコールバックです

引数に渡されるdataには2つのプロパティがあります。

| property | type | description |
|:---- |:---- |:---- |
| `address` |  array  | central device address |
| `status` |  string  | `connected` or `disconnected` |
    
```Javascript
await obniz.ble.initWait(); 
obniz.ble.peripheral.onconnectionupdates = function(data){
  console.log("remote device ", data.address, data.status)
};

```

## peripheral.end()

peripheralのサービスをすべて終了します
```Javascript

await obniz.ble.initWait(); 
obniz.ble.peripheral.addService(service1);
obniz.ble.peripheral.addService(service2);


obniz.ble.peripheral.end();  //service1 and service2 end.

```

