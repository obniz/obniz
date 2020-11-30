# Logtta TH

BLE経由で利用できる温度センサーです。フレキシブルケーブルで冷蔵庫の庫内温度などを計測できます。

![](image.jpg)

![](image2.jpg)



## getPartsClass(name)

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
```

## isDevice(BleRemotePeripheral)

デバイスを見つけたらtrueを返します。

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (Logtta_TH.isDevice(p)) {
        console.log("find");
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## new Logtta_TH(peripheral)

アドバタイズ情報からインスタンスを生成します。

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral) ) {
    console.log("device find");
    const device = new Logtta_TH(peripheral);
  }
};
await obniz.ble.scan.startWait();

```


## [await]connectWait()

デバイスと接続します。

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
    console.log("connected");
  }
};
await obniz.ble.scan.startWait();

```


## [await]disconnectWait()

デバイスとの接続を切断します。

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral) ) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();

```


## onNotify =  function (data){}

データを受信したら、そのデータをコールバック関数で返します。

``startNotifyWait()``を開始した後にデバイスからデータが来るたびに呼び出されます。

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (data) => {
        console.log(`temperature ${data.temperature} humidity ${data.humidity}`);
    };
    device.startNotifyWait();
  }
};
await obniz.ble.scan.startWait();
```

## startNotifyWait()

Notifyを開始します。

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (data) => {
        console.log(`temperature ${data.temperature} humidity ${data.humidity}`);
    };
    device.startNotifyWait();
  }
};
await obniz.ble.scan.startWait();
```


## [await]getAllWait()

デバイスで取得できるすべての情報を取得します。

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const data = await device.getAllWait();
    console.log(`temperature ${data.temperature} humidity ${data.humidity}`);
  }
};
await obniz.ble.scan.startWait();
```

データフォーマットは次の通りです。

```json
// example response
{
  "temperature": 20,
  "humidity": 30, 
}
```

## [await]getTemperatureWait()

デバイスから温度データを取得できます。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const temperature = await device.getTemperatureWait();
    console.log(`temperature ${temperature}`);
  }
};
await obniz.ble.scan.startWait();
```


## [await]getHumidityWait()

デバイスから湿度データを取得できます。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const humidity = await device.getHumidityWait();
    console.log(`humidity ${humidity}`);
  }
};
await obniz.ble.scan.startWait();
```


## [await]authPinCodeWait(pin)

デバイスと認証を行います。デフォルト値は0000です。

```javascript
// Javascript Example
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_AD.isDevice(peripheral) ) {
    console.log("find");
    const device = new Logtta_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.authPinCodeWait("0000");
    console.log("authPinCodeWait");
  }
};
await obniz.ble.scan.startWait();

```

## [await]setBeaconMode(enable)

デバイスと認証をあらかじめ済ませた状態で実行してください。

定期的にビーコンを発信するモードの有効無効を制御できます。

設定後に切断した後から有効になります。

ビーコンモードを終了する場合、デバイスにあるボタンを2秒以上長押しする操作が必要になります。詳しくは下記のリンクよりドキュメントをご覧ください。
http://www.uni-elec.co.jp/logtta_page.html

```javascript
// Javascript Example
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_AD.isDevice(peripheral) ) {
    console.log("find");
    const device = new Logtta_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.authPinCodeWait("0000");
    console.log("authPinCodeWait");
    await device.setBeaconMode(true);
    console.log("authPinCodeWait");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();

```


## isAdvDevice(BleRemotePeripheral)

アドバタイジングしているデバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (Logtta_AD.isAdvDevice(p)) {
        console.log("found");
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });

```

## getData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : バッテリの電圧
- address : MacAddress
- temperature: 温度
- humidity: 湿度
- interval : 送信間隔


```javascript
// Javascript Example
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (Logtta_AD.isAdvDevice(p)) {
        let data = Logtta_AD.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
