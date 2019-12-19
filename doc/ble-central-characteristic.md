# BLE Central Characteristic

## characteristics.uuid

It return uuid of characteristics as string.

```javascript
console.log(characteristics.uuid); // => 'FF00'
```


## characteristics.properties

It is an array of properties of a characteristics. It contains some of belows.

`broadcast`, `notify`, `read`, `write`, `write_without_response`, `indicate`


## \[await] characteristics.writeWait(dataArray)
This writes dataArray to the characteristic.
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
    
        var dataArray = [0x02, 0xFF];
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeWait(dataArray);
        if(result){
            console.log("write success");
        }
    }
}

```

## \[await] characteristics.writeNumberWait(value)
It writes data to the characteristic as 1byte.

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
        await obniz.wait(1000);c
    
        var result = await peripheral.getService("FF00").getCharacteristic("FF01").writeNumberWait(100);
        if(result){
            console.log("write success");
        }
    }
}
```



## \[await] characteristics.writeTextWait(str)
It writes data to the characteristic as string.
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


## \[await] characteristics.readWait()
It reads data from the characteristic.
The returned value appears in the callback function (onread). If reading succeeds an Array with data will be returned, but if it fails undefined will be returned.

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


## characteristics.registerNotify(func)

This sets a callback function to receive notify when it comes from periperal.
To receive notify, you need to register on CCCD Descriptor(0x2902).

More infomation of BLE/CCCD is available at [bluetooth.com](https://www.bluetooth.com/specifications/gatt/descriptors/).


```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();
if(connected){
  let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
  char.onregisternotify = function() {
    console.log("register finshed")
  }

  char.registerNotify( function(data){
    console.log("notify with data " + data.join(','));
  });


}else{
  console.log("cannnot connected");

}
    
```

## characteristics.onregisternotify = ()=>{}

Set a function to this property to get know when `registerNotify()` finished.

## \[await] characteristics.registerNotifyWait(func)

This sets a callback function and wait to receive notify when it comes from periperal.

```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();
if(connected){
  let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
  await char.registerNotifyWait( function(data){
    console.log("notify with data " + data.join(','));
  });


}else{
  console.log("cannnot connected");

}
    
```


## characteristics.unregisterNotify()

unregistrate a callback which is registrated by `registerNotify`or`registerNotifyWait`.


```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};
var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();
if(connected){
  let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
  char.onregisternotify = function() {
    console.log("register finshed")
    char.unregisterNotify();
  }

  char.onunregisternotify = function() {
    console.log("unregistrated")
  }

  char.registerNotify( function(data){
    console.log("notify with data " + data.join(','));
  });


}else{
  console.log("cannnot connected");

}
    
```

## characteristics.onunregisternotify = ()=>{}

Set a callback function to this. A function will be called when `unregisterNotify()` finished.

## \[await] characteristics.unregisterNotifyWait()

Unregistrate a callback which is registrated by `registerNotify`or`registerNotifyWait`. And wait until done.

```javascript

await obniz.ble.initWait(); 
var target = {
  localName: "obniz-notify"
};

var peripheral = await obniz.ble.scan.startOneWait(target);
var connected = await peripheral.connectWait();
if(connected){
  let char = peripheral.getService('fff0').getCharacteristic( 'fff1');
  
  await char.registerNotifyWait( function(data){
    console.log("notify with data " + data.join(','));
  });
  await char.unregisterNotifyWait();
  console.log("unregistrated")


}else{
  console.log("cannnot connected");

}
    
```