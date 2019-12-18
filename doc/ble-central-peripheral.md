# BLE Central Peripheral

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


## peripheral.discoverAllServices()

Discover all services in connected peripheral.
A function set to `ondiscoverservice` will be called for each found service. And a function set to `ondiscoverservicefinished` will be called when discovery finished.

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      
        peripheral.onconnect = function(){
            console.log("connected");
            peripheral.discoverAllServices();
            peripheral.ondiscoverservice = function (service) {
                console.log('service UUID: ' + service.uuid);
            }
            peripheral.ondiscoverservicefinished = function (service) {
                console.log("service discovery finished")
            }
        }
      
        peripheral.ondisconnect = function(){
            console.log("disconnected");
        }
      
        obniz.ble.scan.end();
        peripheral.connect();
    }
};

obniz.ble.scan.start();
```

## ondiscoverservice = (service) => {}

A function set to this property will be called when a service found after `discoverAllServices()` is called. 1st param is service object.

## ondiscoverservicefinished = () => {}

A function set to this property will be called when service discovery  `discoverAllServices()` was finshed.

## \[await] peripheral.discoverAllServicesWait()

This function is async version of `discoverAllServices()`.
It will return all found services as array.

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      obniz.ble.scan.end();
      var connected = await peripheral.connectWait();

      if(connected){
          var services = await peripheral.discoverAllServicesWait();
          console.log("service discovery finish");
          for (var i=0; i<services.length; i++) {
              console.log('service UUID: ' + services[i].uuid)
          }
      }else{
          console.log("failed");
      }
    }
};

obniz.ble.scan.start();
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





