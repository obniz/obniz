# HEM_6233T
オムロン株式会社の血圧計です。
![](./image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、HEM_6233Tかどうかを判定します

```javascript
// Javascript Example
await obniz.ble.initWait();
const HEM_6233T = Obniz.getPartsClass("HEM_6233T");
obniz.ble.scan.onfind = async (peripheral) => {
  if (HEM_6233T.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new HEM_6233T(peripheral, timezoneOffsetMinute)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const HEM_6233T = Obniz.getPartsClass("HEM_6233T");
obniz.ble.scan.onfind = async (peripheral) => {
  if (HEM_6233T.isDevice(peripheral) ) {
    console.log("device find");
    const device = new HEM_6233T(peripheral, 9*60);
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
const HEM_6233T = Obniz.getPartsClass("HEM_6233T");
obniz.ble.scan.onfind = async (peripheral) => {
  if (HEM_6233T.isDevice(peripheral)) {
    console.log("find");
    const device = new HEM_6233T(peripheral,9*60);
    
    const data = await device.getDataWait();
    
    console.log(data);
   
  }
};
await obniz.ble.scan.startWait();
```


データフォーマットは次の通りで、celsius　もしくは fahrenheit に温度データが入っています。

```json
{
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    meanArterialPressure: number;
    unit: "mmHg";
  };
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  pulseRate?: number;
  userId?: number;
  measurementStatus?: HEM_6233TMesurementStatus[];
}
```
