# BLE Peripheral - Service

## new service(json)

This creates service object
uuid is required and characteristics is optional.

```Javascript
await obniz.ble.initWait(); 
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


