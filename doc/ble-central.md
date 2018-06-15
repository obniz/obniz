# Use obniz as central

## scan.start( \[target, \[setting]])

Start scan.
You can filter uuids or localName in target param.

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

Also, without params are valid.

```Javascript
// Javascript Example
obniz.ble.scan.start();  // 引数なしも可能

```


```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],  
};

obniz.ble.scan.start(target);

```


## scan.end()
stop scan.

```Javascript
// Javascript Example
obniz.ble.scan.start();
await obniz.wait(5000);
obniz.ble.scan.stop();
```

## scan.onfind

Call this func when obniz find new peripheral.


```Javascript
// Javascript Example

obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

obniz.ble.scan.start();
```


## \[await] scan.startOneWait( \[target, \[setting]])
Scan and return first find peripheral.


```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};

var peripheral = await obniz.ble.scan.startOneWait(target);
console.log(peripheral);
```

## \[await] scan.startAllWait( \[target, \[setting]])
Scan and return all find peripheral.
This function not return until scan timeout.(default 30sec)
If you want to change it, set duration param.

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


## peripheral.advertise_data
Return raw advertise data.

```Javascript
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.adv_data)
```

## peripheral.localName
Return local name if peripheral has it.

```Javascript

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);

console.log(peripheral.localName)
```



## peripheral.iBeacon

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
obniz.ble.onscan = function(peripheral){
    if(peripheral.localName() == "my peripheral"){
        peripheral.connect();
    }
}
obniz.ble.startScan({duration : 10});
```

-->
## \[await] peripheral.connectWait()
connect to peripheral
return true for success，false for fail

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
Call  this func when obniz connect success

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
obniz.ble.scan.start();
```


<!--

## peripheral.disconnect()
Close connection.

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


-->



## \[await] peripheral.disconnectWait()
disconnect from peripheral
return true for success，false for fail

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
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
```


## peripheral.ondisconnect
Call this func when obniz close connection. 

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
obniz.ble.scan.start();
```




## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeWait(dataArray)
write data to the characteristic from data array.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
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

```

## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeNumberWait(value)
write data to the characteristic from value as 1byte.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = [0x02, 0xFF];
    var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeNumberWait(dataArray);
    if(result){
        console.log("write success");
    }
}
```



## \[await] peripheral.getService(uuid).getCharacteristic(uuid).writeTextWait(str)
write data to the characteristic from string.

```Javascript
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = [0x02, 0xFF];
    var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeTextWait("My Name");
    if(result){
        console.log("write success");
    }
}
```
<!--
## peripheral.onwrite
Call this func when write to the characteristic success.


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
-->


## \[await] peripheral.getService(uuid).getCharacteristic(uuid).readWait()
Read from characteristic.
Return value appear in callback function (onread) .

```Javascript
// Javascript Example
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
    console.log(dataArray);
    
}
```
<!--
## peripheral.onread
Call this func when read from the characteristic success.

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
-->
## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeWait(dataArray)
write descriptor with dataArray

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
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

```

<!--
## descriptor.onwrite
Callback function of write descriptor results.


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
-->

## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeNumber(value)
write descriptor with number as 1 byte

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = [0x02, 0xFF];
    var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeNumberWait(dataArray);
    if(result){
        console.log("write success");
    }
}
```



## \[await] peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).writeText(str)
write data to the descriptor from string.



```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = [0x02, 0xFF];
    var result = await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeTextWait("My Name");
    if(result){
        console.log("write success");
    }
}
```

## peripheral.getService(uuid).getCharacteristic(uuid).getDescriptor(uuid).readWait()
Read data from descriptor
Return value appear in callback function (onread) .

```Javascript
// Javascript Example
var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();

if(connected){
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
    console.log(dataArray);
    
}
```



## peripheral.onerror
Call this func when something error occurred with error messages.

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





