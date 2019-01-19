# Use obniz as central

## scan.start( \[target, \[setting]])

This starts scanning BLE.
You can filter uuids or localName using the target param.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0","FFF1"],     //scan only has uuids "FFF0" and "FFF1"
    localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
};

var setting = {
    duration : 10  
}
obniz.ble.scan.start(target, setting);

```

This is also possible without params being valid.

```Javascript
// Javascript Example
obniz.ble.scan.start(); 

```


```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};

obniz.ble.scan.start(target);

```


## scan.end()
This stops scanning BLE.

```Javascript
// Javascript Example
obniz.ble.scan.start();
await obniz.wait(5000);
obniz.ble.scan.end();
```

## scan.onfind

This function gets called when obniz finds a new peripheral.


```Javascript
// Javascript Example

obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

obniz.ble.scan.start();
```

## scan.onfinish

This function gets called when obniz finishes scanning.


```Javascript
// Javascript Example

obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

obniz.ble.scan.onfinish = function(peripheral){
   console.log("scan timeout!")
};

obniz.ble.scan.start();
```


## \[await] scan.startOneWait( \[target, \[setting]])
This scans and returns the first peripheral that was found among the objects specified in the target.



```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};

var peripheral = await obniz.ble.scan.startOneWait(target);
console.log(peripheral);
```

## \[await] scan.startAllWait( \[target, \[setting]])
This scans and returns all the peripherals found.
This function does not return until scanning gets timed out.(default 30sec)
If you want to change the default duration, you can do so with the duration param.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var setting = {
    duration : 10  
}

var peripherals = await obniz.ble.scan.startAllWait(target,setting);

for(var peripheral of peripherals){
  console.log(peripheral);
}
```


## peripheral.adv_data
This returns raw advertise data.

```Javascript
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.adv_data)
```

## peripheral.localName
This returns local name if the peripheral has it.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.localName)
```



## peripheral.iBeacon
// Javascript Example

This returns iBeacon data if the peripheral has it. If none, it will return null.
The return values are shown below.

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
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.iBeacon)
```

<!--
## peripheral.connect()
Connet to peripheral

```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```

-->
## \[await] peripheral.connectWait()
This connects obniz to the peripheral.
It returns true when it succeeds and false when it fails.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
}else{
    console.log("failed");
}
```

## peripheral.onconnect
This function is called when connection succeeds.

```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){
        peripheral.onconnect = function(){
            console.log("success");
        }
        obniz.ble.scan.end();
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```


<!--

## peripheral.disconnect()
Close connection.

```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){
        peripheral.connect();
        await obniz.wait(1000);
        peripheral.disconnect();
    }
}
obniz.ble.startScan({duration : 10});
```


-->



## \[await] peripheral.disconnectWait()
This disconnects obniz from peripheral.
It returns true when it succeeds and false when it fails.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        await obniz.wait(1000);
        var disconnected = await peripheral.disconnectWait();
    
        if(disconnected){
            console.log("disconnected");
        }else{
            console.log("disconnect failed");
        }
    }
}
```


## peripheral.ondisconnect
This function is called when obniz is disconnected.

```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){
        peripheral.onconnect = function(){
            console.log("success");
        }
        peripheral.ondisconnect = function(){
            console.log("closed");
        }
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```




## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeWait(dataArray)
This writes dataArray to the characteristic.
It returns true when it succeeds and false when it fails.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = [0x02, 0xFF];
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeWait(dataArray);
        if(result){
            console.log("write success");
        }
    }
}

```

## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeNumberWait(value)
It writes data to the characteristic as 1byte.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);c
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeNumberWait(100);
        if(result){
            console.log("write success");
        }
    }
}
```



## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeTextWait(str)
It writes data to the characteristic as string.
It returns true when it succeeds and false when it fails.

```Javascript
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeTextWait("My Name");
        if(result){
            console.log("write success");
        }
    }
}
```
<!--
## peripheral.onwrite
Call this func when write to the characteristic success.


```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

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
-->


## \[await] peripheral.getService(uuid).getCharacteristic(uuid).readWait()
It reads data from the characteristic.
The returned value appears in the callback function (onread). If reading succeeds an Array with data will be returned, but if it fails undefined will be returned.

```Javascript
// Javascript Example
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
        console.log(dataArray);
        
    }
}
```
<!--
## peripheral.onread
Call this func when read from the characteristic success.

```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

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
-->

## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).registerNotify(func)

This sets a callback function to receive notify when it comes from periperal.
To receive notify, you need to register on CCCD Descriptor(0x2902).

```javascript
var target = {
  localName: "obniz-notify"
};

var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();
if(connected){
  let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  let cccd = char.getDescriptor("2902");
  let result = await cccd.writeWait([0x00, 0x01]); // register cccd for remote peripheral 

  console.log(await cccd.readWait()); // check cccd 

  char.registerNotify( function(){
    console.log("notify");
  });


}else{
  console.log("cannnot connected");

}
    
```


## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeWait(dataArray)
This writes dataArray to descriptor.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = [0x02, 0xFF];
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
        if(result){
            console.log("write success");
        }
    }
}

```

<!--
## descriptor.onwrite
Callback function of write descriptor results.


```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

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
-->

## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeNumber(value)
This writes a number to descriptor as 1byte.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeNumberWait(100);
        if(result){
            console.log("write success");
        }
    }
}
```



## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeText(str)
This writes data to the descriptor as string.
It returns true when it succeeds and false when it fails.



```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeTextWait("My Name");
        if(result){
            console.log("write success");
        }
    }
}
```

## peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).readWait()
It reads data from descriptor.
The return value appears in the callback function (onread). If reading succeeds an Array with data will be returned, but if it fails undefined will be returned.

```Javascript
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
        console.log(dataArray);
        
    }
}
```



## peripheral.onerror
This gets called with an error message when some kind of error occurs.

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
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

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





