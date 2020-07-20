# UT201BLE
株式会社エー・アンド・デイの体温計です。

![](./image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、UT201BLEかどうかを判定します

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


## [await]getDataWait()

デバイスに接続し、データを一括取得します。
取得できるデータはデバイスが未送信のデータのみです

データ送信後、自動的にデバイスとの接続が切断されます。

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral)) {
    console.log("find");
    const device = new UT201BLE(peripheral);
    
    const data = await device.getDataWait();
    
    console.log(data);
    // {
    //     fahrenheit?: number;
    //     celsius?: number;
    //     date?: {
    //       year: number;
    //       month: number;
    //       day: number;
    //       hour: number;
    //       minute: number;
    //       second: number;
    //     };
    //     temperatureType?: string;
    //   }
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
}
```
