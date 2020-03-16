# Logtta CO2
Look for Logtta CO2 and get the data.

![](image.jpg)


## wired(obniz)


```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');

```



## [await] findWait()

Search device and return obniz.ble.peripheral object.
If not found, return null.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');
let results = await logtta.findWait();

if(results){
  console.log("find");
}else{
  console.log("not find");
}
```

## connectWait()

Connect to the device.
Search device automatically.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```

##  [await]findListWait()

Search devices and return obniz.ble.peripheral objects.

```javascript
// Javascript Example
const logtta = obniz.wired("Logtta_CO2");
const list = await logtta.findListWait()
console.log(list);
if(list.length >= 1){
    await logtta.directConnectWait(list[0].address);
    const co2 = await logtta.getWait();
    console.log(`CO2 get ${co2} ppm`);
}
```


##  [await]directConnectWait(address)

Connect to the device.

```javascript
// Javascript Example
const logtta = obniz.wired("Logtta_CO2");
const list = await logtta.findListWait()
console.log(list);
if(list.length >= 1){
    await logtta.directConnectWait(list[0].address);
    const co2 = await logtta.getWait();
    console.log(`CO2 get ${co2} ppm`);
}
```

## [await]disconnectWait()
Disconnect from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        await logtta.disconnectWait();
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```


## [await]getWait()
Get CO2 Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const co2 = await logtta.getWait();
        console.log(`CO2 get ${co2} ppm`);
        await logtta.disconnectWait();
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```

## [await]startNotifyWait()
Get Notify Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        logtta.onNotify = (co2 => {
                    console.log(`CO2 notify ${co2} ppm`);
                });
        await logtta.startNotifyWait();
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```
