# MINEW_S1

MINEW社製の温湿度ビーコンです。
事前に専用アプリによりビーコン出力の設定をする必要があります。

いずれかのSLOTのフレームタイプに HT Sensor / Info が設定されている場合のみ対応しています。iBeacon / UID / URL / TLM が設定されていてもこのライブラリではデータを受信することはできません(検出に影響はありません)。

![](./image.jpg)

## ビーコンデータ(getData())

- batteryLevel: 電池残量(%)
- temperature: プローブの温度(℃)
- humidity: 本体側の湿度(%)

## 使用例

```javascript
// Javascript
const MINEW_S1 = Obniz.getPartsClass('MINEW_S1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、MINEW_S1でないときはnullに
  const mode = MINEW_S1.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new MINEW_S1(peripheral, mode);
    // データを取得
    const data = device.getData();
    // 温湿度データがない場合、dataはnullになります。
    if (data) {
      console.log(data);
    }
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## Infoデータを取得する例

### Infoデータ

- frameType: フレームタイプ
- versionNumber: バージョン番号
- batteryLevel: 電池残量(%)
- macAddress: MACアドレス
- name: デバイス名

```javascript
// Javascript
await obniz.ble.initWait();
const MINEW_S1 = Obniz.getPartsClass("MINEW_S1");
obniz.ble.scan.onfind = (peripheral) => {
  if (MINEW_S1.getDeviceMode(peripheral)) {
    const data = MINEW_S1.getInfoData(peripheral);
    // Infoデータがない場合、dataはnullになります。
    if (data) {
      console.log(data);
    }
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });

```
