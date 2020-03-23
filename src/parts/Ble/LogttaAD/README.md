# Logtta AD
Look for Logtta AD and get the data.

![](image.jpg)


## wired(obniz)


```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');

```



## [await] findWait()

Search device and return obniz.ble.peripheral object.
If not found, return null.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');
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
let logtta = obniz.wired('Logtta_AD');
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
const logtta = obniz.wired("Logtta_AD");
const list = await logtta.findListWait()
console.log(list);
if(list.length >= 1){
    await logtta.directConnectWait(list[0].address);
    const data = await logtta.getAllWait();
    console.log(`AD get volt ${data.volt} or ampere ${data.ampere} count ${data.count}`);
}
```


##  [await]directConnectWait(address)

Connect to the device.

```javascript
// Javascript Example
const logtta = obniz.wired("Logtta_AD");
const list = await logtta.findListWait()
console.log(list);
if(list.length >= 1){
    await logtta.directConnectWait(list[0].address);
    const data = await logtta.getAllWait();
    console.log(`AD get volt ${data.volt} or ampere ${data.ampere} count ${data.count}`);
}
```
## [await]disconnectWait()
Disconnect from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');
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


## [await]getAllWait()
Get All Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const data = await logtta.getAllWait();
        console.log(`AD get volt ${data.volt} or ampere ${data.ampere} count ${data.count}`);
        await logtta.disconnectWait();
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```


The format is below.
```json
// example response
{
  "ampere": 5, // mA
  "volt": 3,   // mV
  "count": 10  // count
}
```

## [await]getAmpereWait()
Get Ampere Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const data = await logtta.getAmpereWait();
        console.log(`AD data ${data}`);
        await logtta.disconnectWait();
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```


## [await]getVoltWait()
Get Volt Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const data = await logtta.getVoltWait();
        console.log(`AD data ${data}`);
        await logtta.disconnectWait();
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```


## [await]getCountWait()
Get count Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const data = await logtta.getCountWait();
        console.log(`AD data ${data}`);
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
let logtta = obniz.wired('Logtta_AD');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        logtta.onNotify = (data => {
                    console.log(`AD notify volt ${data.volt} or ampere ${data.ampere} count ${data.count}`);
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
