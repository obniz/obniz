# Logtta Temp
Logttaの温湿度センサーを搭載したデバイスを検索し、データを取得します。

次のデバイスをサポートしています。

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

デバイスをスキャンし、obniz.ble.peripheralを返します。
スキャンでみつけられない場合、Nullを返します。

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

##  [await]connectWait()


デバイスに接続します。
デバイスを見つけていなかった場合、自動的にスキャンを行います。

接続に成功した場合trueを返します。

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

デバイスのスキャンを行い、周囲にあるデバイスのリストを作成します。

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

macアドレスで指定したデバイスに接続を行います。

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

デバイスとの接続を切断します。

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

デバイスからすべてのセンサーデータを取得します。

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

取得できるデータフォーマットは次の通りです。

```json
// example response
{
  "temperature": 20, // ℃
  "humidity": 30     //　%
}
```

## [await]getTemperatureWait()

デバイスから温度を取得します。

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

デバイスから湿度を取得します。

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

デバイスからNotifyでデータを取得できます。

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
