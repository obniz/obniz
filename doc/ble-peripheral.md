# BLE
You can use bluetooth Low Energy with obniz as peripheral/central

# Use obniz as ble peripheral

## advertisement.start()
This starts advertisement of BLE.
Before calling this function, you should call setAdvData/setAdvDataRaw to set data.

```Javascript
// Javascript Example
// Javascript Example
var service = new obniz.ble.service({
  uuid : "FFF0"
});
obniz.ble.peripheral.addService(service); 
obniz.ble.advertisement.setAdvData(service.advData);
obniz.ble.advertisement.start();
```

## advertisement.end()

This stops advertisement of BLE.

```Javascript
// Javascript Example
obniz.ble.advertisement.start();
obniz.ble.advertisement.end();
```


## advertisement.setAdvDataRaw(bytes[])

This sets advertise data from data array.

```Javascript
// Javascript Example
obniz.ble.advertisement.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```

## advertisement.setAdvData(setting)

This sets advertise data from json.

```Javascript
// Javascript Example

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
obniz.ble.advertisement.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.advertisement.start();
```

## advertisement.setScanRespData(setting)

This sets scan response data from json data.

```Javascript
// Javascript Example
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
/* Service without characteristics */
var service = new obniz.ble.service({"uuid" : "FFF0"});
obniz.ble.peripheral.addService(service);

/* Service with characteristics/descriptor */
var service = new obniz.ble.service({"uuid" : "FFF0"});
var characteristic = new obniz.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
var descriptor = new obniz.ble.descriptor({"uuid" : "2901", "text" : "hello world characteristic"});

service.addCharacteristic(characteristic);
characteristic.addDescriptor(descriptor);

obniz.ble.peripheral.addService(service); // call this after all descriptors and characteristics added to service.
```

## peripheral.onconnectionupdates

This is a callback function used when an external device gets connected or disconnected.
    
```Javascript
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

## new service(json)

This creates service object
uuid is required and characteristics is optional.

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
write data on characteristic

## characteristic.onwrite(data)
callback of characteristic.wite


```Javascript 

characteristic.write([0xf0,0x27]);
characteristic.onwrite = function(val){
    console.log("write :",val.result);
}


```
-->

## \[await] characteristic.writeWait(data)
This writes data on characteristic.
It returns true when it is successful and false when it fails.

```Javascript 
let result =  await characteristic.writeWait([0xf0,0x27]);

if(result){
    console.log("write success");
}

```
<!--
## characteristic.read(data)
read data on characteristic

## characteristic.onread(data)
callback of characteristic.read

```Javascript 

characteristic.read();
characteristic.onread = function(val){
    console.log("read data :",val.data);
}


```
-->
## \[await] characteristic.readWait()
This reads data on characteristic.
It returns data array when it successds and undefined when it fails.

```Javascript 
let data =  await characteristic.readWait()

console.log("data: " , data );


```

## characteristic.onwritefromremote(address, newvalue)
This is a callback function used when characteristic gets changed by an external device.


```Javascript 

characteristic.onwritefromremote = function(address, newvalue){
    console.log("remote address :",address);
    console.log("remote data :",newvalue);
}

```

## characteristic.onreadfromremote(address)
This is a callback function used when characteristic is read by an external device.

```Javascript 

characteristic.onreadfromremote = function(address){
    console.log("remote address :",address);	
}

```


## characteristic.notify()
This sends notify to the connected central.
It needs CCCD descriptor(0x2901).

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
This creates descriptor.

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
write on descriptor

## descriptor.onwrite(data)
callback of descriptor.wite



```Javascript 

descriptor.write([0xf0,0x27]);
descriptor.onwrite = function(val){
    console.log("write :",val.result);
}


```
-->

## descriptor.writeWait(data)
This writes data on descriptor.
It returns true when it succeeds and false when it fails.

```Javascript 
let result =  await descriptor.writeWait([0xf0,0x27]);

if(result){
    console.log("write success");
}

```
<!--
## descriptor.read(data)
read data on descriptor

## descriptor.onread(data)
callback of descriptor.read


```Javascript 

descriptor.read();
descriptor.onread = function(val){
    console.log("read data :",val.data);
}


```
-->

## \[await] descriptor.readWait()
This reads data on descriptor.
It returns data array when it succeeds and undefined when it fails.


```Javascript 
let data =  await descriptor.readWait()

console.log("data: " , data );


```


## descriptor.onwritefromremote

This is a callback function used when the descriptor gets changed by an external device.


```Javascript 

descriptor.onwritefromremote = function(val){
    console.log("remote address :",val.address);
    console.log("remote data :",val.data);
}

```

## descriptor.onreadfromremote
This is a callback function used when the descriptor is read by an external device.

```Javascript 

descriptor.onreadfromremote = function(val){
    console.log("remote address :",val.address);	
}

```







