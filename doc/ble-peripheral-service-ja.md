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

## service.end()

サービスを終了します
```Javascript

await obniz.ble.initWait(); 
var service = new obniz.ble.service({   "uuid" : "fff0" });
obniz.ble.peripheral.addService(service); 

service.end();

```


