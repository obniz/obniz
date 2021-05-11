# UA651BLE
株式会社エー・アンド・デイの血圧計です。

データ通信するにはペアリングが必要となります。電源ボタンの長押しから「Pr」が表示されるまで長押しすることでペアリングが可能です。
また、ペアリング時のkeysがなくても通信可能ですが、ペアリングしたデバイスを端末は記録し、そのデバイスに対してのみlocalNameを返し、接続後のデータ転送もそこへのみ行います。

![](./image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、UA651BLEかどうかを判定します。

※通信エラーが頻発する場合UA651BLEの再ペアリングを試して下さい．

```javascript
// Javascript Example
await obniz.ble.initWait();
const UA651BLE = Obniz.getPartsClass("UA651BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new UA651BLE(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const UA651BLE = Obniz.getPartsClass("UA651BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UA651BLE(peripheral);
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
const UA651BLE = Obniz.getPartsClass("UA651BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral)) {
    console.log("find");
    const device = new UA651BLE(peripheral);
    
    const data = await device.getDataWait();
    
    console.log(data);
  }
};
await obniz.ble.scan.startWait();

```


データフォーマットは次の通りで、血圧が mmHg もしくは kPa 形式で、脈拍が pulse/min 形式で入っています。

[https://obniz.github.io/obniz/obnizjs/interfaces/parts.ua651ble.ua651bleresult.html](https://obniz.github.io/obniz/obnizjs/interfaces/parts.ua651ble.ua651bleresult.html)

```json
{
  SystolicPressure_mmHg?: number; // ex) 128mmHg → 0x80 = 128, 0x00
  DiastolicPressure_mmHg?: number;
  MeanArterialPressure_mmHg?: number;
  SystolicPressure_kPa?: number; // ex) 17.6Kpa → 0xB0 = 176, 0xF0
  DiastolicPressure_kPa?: number;
  MeanArterialPressure_kPa?: number;
  bodyMoved?: number;
  cuffFitLoose?: boolean;
  irregularPulseDetected?: boolean;
  improperMeasurement?: boolean;
  PulseRate?: number;
}
```