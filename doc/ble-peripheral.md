# BLE Peripheral

You can use bluetooth Low Energy with obniz Board as a peripheral device

If you have obnizOS 1.X.X or 2.X.X, we recommend you to use obniz.js 2.X.X. [https://github.com/obniz/obniz/releases/tag/v2.5.0](https://github.com/obniz/obniz/releases/tag/v2.5.0)

# Use obniz Board as ble peripheral

## \[await] initWait()

Initialize BLE module.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 

```

## advertisement.start()
This starts advertisement of BLE.
Before calling this function, you should call setAdvData/setAdvDataRaw to set data.

advertisement interval is 1.28sec fixed.

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

This stops advertisement of BLE.

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.advertisement.start();
obniz.ble.advertisement.end();
```


## advertisement.setAdvDataRaw(bytes[])

This sets advertise data from data array.

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.advertisement.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```

## advertisement.setAdvData(setting)

This sets advertise data from json.

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

The json parameters are shown below.


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
This sets scan response data from data array.

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.advertisement.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```

## advertisement.setScanRespData(setting)

This sets scan response data from json data.

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.advertisement.setScanRespData({
  localName : "obniz BLE",
});

obniz.ble.advertisement.start();
```

The json parameters are shown below.



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

This starts a service as peripheral with setting_json or service_obj.

service_obj
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

obniz.ble.peripheral.addService(service); // call this after all descriptors and characteristics added to service.
```

## peripheral.onconnectionupdates

This is a callback function used when an external device gets connected or disconnected.
    
```Javascript
await obniz.ble.initWait(); 
obniz.ble.peripheral.onconnectionupdates = function(data){
  console.log("remote device ", data.address, data.status)
};

```

## peripheral.end()

This ends all the peripheral service
```Javascript

obniz.ble.peripheral.addService(setting);

obniz.ble.peripheral.end();
```
