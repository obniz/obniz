# Logtta AD
Logtta AD を検索し、データを取得します。

![](image.jpg)

## wired(obniz)

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_AD');
```

## [await] findWait()

デバイスをスキャンし、obniz.ble.peripheralを返します。
スキャンでみつけられない場合、Nullを返します。

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

デバイスに接続します。
デバイスを見つけていなかった場合、自動的にスキャンを行います。

接続に成功した場合trueを返します。

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

デバイスのスキャンを行い、周囲にあるデバイスのリストを作成します。

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

macアドレスで指定したデバイスに接続を行います。

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
デバイスとの接続を切断します。

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
デバイスからすべてのセンサーデータを取得します。

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

取得できるデータフォーマットは次の通りです。

```json
// example response
{
  "ampere": 5, // mA
  "volt": 3,   // mV
  "count": 10  // count
}
```

## [await]getAmpereWait()
デバイスから電流値を取得します。

4mA - 20mAの間で取得できます。

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
デバイスから電圧値を取得します。

1V - 5Vの間でデータを取得できます。

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
デバイスからカウント情報を取得できます。

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
デバイスからNotifyでデータを取得できます。

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
