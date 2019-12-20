# BLE Central Descriptor

## \[await] descriptor.writeWait(dataArray)
This writes dataArray to descriptor.
It throws an error when failed.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = [0x02, 0xFF];
    await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
    console.log("write success");
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

It throws an error when failed.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeNumberWait(100);
    console.log("write success");
}
```



## \[await] descriptor.writeText(str)
This writes data to the descriptor as string.
It throws an error when failed.



```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeTextWait("My Name");
    console.log("write success");
}
```

## \[await] descriptor.readWait()
It reads data from descriptor.
The return value appears in the callback function (onread). If reading succeeds an Array with data will be returned.
It throws an error when failed.

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
    console.log(dataArray);
}
```
