# Logtta Temp
Look for Logtta Temp and get the data.

support device.

- Logtta 
- Logtta Cable 
- Logtta WR 

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_TH');
```

## [await] findWait()

Search device and return obniz.ble.peripheral object.
If not found, return null.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_TH');
let results = await logtta.findWait();

if(results){
  console.log("find");
}else{
  console.log("not find");
}
```

## [await] connectWait()

Connect to the device.
Search device automatically.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_TH');
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
const logtta = obniz.wired("Logtta_TH");
const list = await logtta.findListWait()
console.log(list);
if(list.length >= 1){
    await logtta.directConnectWait(list[0].address);
    const data = await logtta.getAllWait();
    console.log(`TH get temp ${data.temperature} humid ${data.humidity}`);
}
```


##  [await]directConnectWait(address)

Connect to the device.

```javascript
// Javascript Example
const logtta = obniz.wired("Logtta_TH");
const list = await logtta.findListWait()
console.log(list);
if(list.length >= 1){
    await logtta.directConnectWait(list[0].address);
    const data = await logtta.getAllWait();
    console.log(`TH get temp ${data.temperature} humid ${data.humidity}`);
}
```

## [await]disconnectWait()
Disconnect from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_TH');
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
let logtta = obniz.wired('Logtta_TH');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const data = await logtta.getAllWait();
        console.log(`TH get temperature ${data.temperature} humidity ${data.humidity}`);
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
  "temperature": 20, // ℃
  "humidity": 30     //　%
}
```

## [await]getTemperatureWait()
Get Temperature Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_TH');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const temp = await logtta.getTemperatureWait();
        console.log(`TH data ${temp}`);
        await logtta.disconnectWait();
    }else{
        console.log("Failure");
        return;
    }
}else{
    console.log("not find");
}
```


## [await]getHumidityWait()
Get Humidity Data from device.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_TH');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const humid = await logtta.getHumidityWait();
        console.log(`TH data ${humid}`);
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
let logtta = obniz.wired('Logtta_TH');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        logtta.onNotify = (data => {
                    console.log(`TH notify temperature ${data.temperature} humidity ${data.humidity}`);
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
