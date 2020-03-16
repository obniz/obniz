# Logtta CO2
Logtta CO2 を検索し、データを取得します。

![](image.jpg)

## wired(obniz)

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');
```

## [await] findWait()

デバイスをスキャンし、obniz.ble.peripheralを返します。
スキャンでみつけられない場合、Nullを返します。

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

デバイスに接続します。
デバイスを見つけていなかった場合、自動的にスキャンを行います。

接続に成功した場合trueを返します。

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

デバイスのスキャンを行い、周囲にあるデバイスのリストを作成します。

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

macアドレスで指定したデバイスに接続を行います。

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
デバイスとの接続を切断します。

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
デバイスからCO2データを取得します。

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_CO2');
let results = await logtta.findWait();

if(results){
    console.log("find");
  
    if(await logtta.connectWait()){
        console.log("connected!");
        const co2 = await logtta.getAllWait();
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
デバイスからNotifyでデータを取得できます。

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
