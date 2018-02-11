# BLE
You can use Bluetooth Low Energy with obniz as peripheral/central

# Use obniz as ble peripheral

## startAdvertisement()
Start advertisement .
Before call this function, you shoud call setAdvDataRaw for set data.

```Javascript
obniz.ble.startAdvertisement();
obniz.ble.stopAdvertisement();
```



## stopAdvertisement()

Stop advertisement .

```Javascript
obniz.ble.startAdvertisement();
obniz.ble.stopAdvertisement();
```


## setAdvDataRaw(bytes[])

Set advertise data from data array.

```Javascript
obniz.ble.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```

## setAdvData(setting)

Set advertise data from json.



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

Json parameters are here.．


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
Set scan response data from data array.


```Javascript
obniz.ble.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```



## setScanRespData(setting)

Set scan response data from data json.

```Javascript
obniz.ble.setScanRespData({
  localName : "obniz BLE",
});

obniz.ble.startAdvertisement();
```

Json parameters are here.．



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


# Use obniz as central

## startScan([setting])
Start scan.

```Javascript
{
     duration: 30,   //scan duration in seconds
}
```

```Javascript
obniz.ble.startScan({duration : 10});

obniz.ble.startScan();   //setting arg is optinal

```


## stopScan()
stop scan.

```Javascript
obniz.ble.startScan({duration : 10});
await obniz.wait(5000);
obniz.ble.stopScan();
```

## onScan

Call this func when obniz find new peripheral.


```Javascript
obniz.ble.onscan = function(peripheral){
   alert(peripheral)
}

obniz.ble.startScan({duration : 10});
```


## peripheral.advertise_data
Return raw advertise data.

```Javascript
obniz.ble.onscan = function(peripheral){
   alert(peripheral.advertise_data)
}

obniz.ble.startScan({duration : 10});
```

## peripheral.localName()
Return local name if peripheral has it.

```Javascript
obniz.ble.onscan = function(peripheral){
   alert(peripheral.localName())
}

obniz.ble.startScan({duration : 10});
```



## peripheral.iBeacon()

Return iBeacon data if peripheral has it.
Return values are here.

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
Connet to peripheral

```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```


## peripheral.onconnect
Call  this func when obniz connect success

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
Close connection.

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



## peripheral.ondisconnect
Call this func when obniz close connection. 

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
write data to the characteristic from data array.

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
write data to the characteristic from value as 4byte bigadian int.

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
write data to the characteristic from string.

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
Call this func when write to the characteristic success.


```Javascript
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){

        peripheral.onconnect = function(){
            peripheral.getService("FF00").getCharacteristic("FF01").writeText("My Name");
        }
        peripheral.onwritecharacteristic = function(service, characteristic,results){
            if(service.uuid === "FF00" && characteristic.uuid === "FF01" ){
                alert(results); //"success" or "failed"
            }
        }
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```



## peripheral.getService(uuid).getCharacteristic(uuid).read()
Read from characteristic.
Return value appear in callback function (onreadcharacteristic) .

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
Call this func when read from the characteristic success.

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
Call this func when someting error occurred with erorr messages.

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





