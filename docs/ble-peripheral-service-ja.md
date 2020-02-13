# BLE Peripheral - サービス

## new service(json)

サービスオブジェクトを作成します
jsonにはuuid（必須）およびcharacteristics（オプション）を設定できます

```Javascript
var service = new obniz.ble.service({
    "uuid" : "fff0",
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

## service.advData

作成されたサービスをadvertisementするときに使用するobjectが代入されています。

```javascript
// Javascript Example
await obniz.ble.initWait();
var service = new obniz.ble.service({ uuid : "1234" });
var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
service.addCharacteristic(characteristic);
obniz.ble.peripheral.addService(service);

obniz.ble.advertisement.setAdvData(service.advData);
obniz.ble.advertisement.setScanRespData({
localName : "obniz BLE",
});
obniz.ble.advertisement.start();
```

## service.end()

サービスを終了します
```javascript
// Javascript Example
await obniz.ble.initWait();
var service = new obniz.ble.service({ uuid : "1234" });
var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
service.addCharacteristic(characteristic);
obniz.ble.peripheral.addService(service);

service.end();
```

