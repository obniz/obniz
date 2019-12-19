# BLE Central Descriptor

## \[await] descriptor.writeWait(dataArray)
This writes dataArray to descriptor.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
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

## \[await] descriptor.writeNumber(value)
This writes a number to descriptor as 1byte.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
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



## \[await] descriptor.writeText(str)
This writes data to the descriptor as string.
It returns true when it succeeds and false when it fails.



```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
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

## \[await] descriptor.readWait()
It reads data from descriptor.
The return value appears in the callback function (onread). If reading succeeds an Array with data will be returned, but if it fails undefined will be returned.

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
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
