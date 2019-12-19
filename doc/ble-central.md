# BLE Central


## \[await] initWait()

Initialize BLE module. You need call this first everything before.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 

```

## scan.start( \[target, \[setting]])

This starts scanning BLE.
You can filter uuids or localName using the target param.

### target

| property | type | default | description |
|:--:|:--:|:--:|:--:|
| uuids | `array` | `[]` | an array of scan target service uuids. If a peripheral has a one of listed uuid, then found.
| localName | `string` | null | scan target device localName

### target

| property | type | default | description |
|:--:|:--:|:--:|:--:|
| duration | `number` | `30` | Timeout of scannning.
| duplicate | `boolean` | `false` | Specifiying `onfind` will be called or not when an advertisment received from already known peripheral. Defualt is never called again. Now obniz.js only accept `false`.

```Javascript
// Javascript Example

var target = {
    uuids: ["FFF0","FFF1"],     //scan only has uuids "FFF0" and "FFF1"
    localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
};

var setting = {
    duration : 10  //scan duration time in seconds. default is 30 sec.
}

await obniz.ble.initWait(); 
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

await obniz.ble.initWait(); 
obniz.ble.scan.start(target);

```


## scan.end()
This stops scanning BLE.

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
obniz.ble.scan.start();
await obniz.wait(5000);
obniz.ble.scan.end();
```

## scan.onfind

This function gets called when obniz Board finds a new peripheral.


```Javascript
// Javascript Example

obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

await obniz.ble.initWait(); 
obniz.ble.scan.start();
```

## scan.onfinish

This function gets called when obniz Board finishes scanning.


```Javascript
// Javascript Example

obniz.ble.scan.onfind = function(peripheral){
   console.log(peripheral)
};

obniz.ble.scan.onfinish = function(peripheral){
   console.log("scan timeout!")
};

await obniz.ble.initWait(); 
obniz.ble.scan.start();
```


## \[await] scan.startOneWait( \[target, \[setting]])
This scans and returns the first peripheral that was found among the objects specified in the target.



```Javascript
// Javascript Example

await obniz.ble.initWait(); 
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

await obniz.ble.initWait(); 
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

