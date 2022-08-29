# UT201BLE
株式会社エー・アンド・デイの体温計です。  

体温の計測データを受信するには、最初にペアリングをしてペアリングキーを取得する必要があります。  

![](./image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、UT201BLEかどうかを判定します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new UT201BLE(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UT201BLE(peripheral);
  }
};
await obniz.ble.scan.startWait();

```

## isPairingMode()

BLEで受信したアドバタイズ情報をもとに、ペアリングモードか測定モードかを判断します。  
ペアリングモードの場合、trueが返ります。

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
let key;
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral)) {
    console.log("device find");
    const device = new UT201BLE(peripheral);
    console.log(device.isPairingMode());
  }
};
await obniz.ble.scan.startWait();

```

## [await]pairingWait()

UT201BLEとペアリングをし、ペアリングキーを取得します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
let key;
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UT201BLE(peripheral);
    if(device.isPairingMode()){
      key = await device.pairingWait();
      console.log(key);
    };
  }
};
await obniz.ble.scan.startWait();

```


## [await]getDataWait()

デバイスに接続し、データを一括取得します。
取得できるデータはデバイスが未送信のデータのみです。  

データの取得には、ペアリングキーが必要です。  

データ送信後、自動的にデバイスとの接続が切断されます。  

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
let key = "pairing key here";
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral)) {
    console.log("find");
    const device = new UT201BLE(peripheral);
    if(key){
      const data = await device.getDataWait(key);
      console.log(data);
    }
  }
};

await obniz.ble.scan.startWait();

```


データフォーマットは次の通りで、celsius　もしくは fahrenheit に温度データが入っています。

```json
{
  fahrenheit?: number;
  celsius?: number;
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  temperatureType?: string;
  battery?: number;
}
```
