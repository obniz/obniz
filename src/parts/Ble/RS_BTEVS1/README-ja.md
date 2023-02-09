# RS-BTEVS1

ラトックシステムズ社製のBLE環境センサー



次のセンサーが内蔵されています。

- 温湿度センサー(SENSIRION SHTC3)
- CO2センサー(SENSIRION SCD40)
- PM2.5(0.5/1.0/4.0/10.0)センサー(SENSIRION SPS30)

動作確認バージョン
- 1.0.2
- 1.2.2

## 使用方法

```javascript
const RS_BTEVS1 = Obniz.getPartsClass('RS_BTEVS1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_BTEVS1.isDevice(peripheral)) {
    console.log('find');
    const device = new RS_BTEVS1(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    };
    await device.connectWait();
    console.log('connected');

    device.onButtonPressed = (pressed) => {
      console.log('Button', pressed);
    };

    const dataResult = await device.getDataWait();
    console.log(dataResult);
  }
};
await obniz.ble.scan.startWait();
```

## 各種設定

`getConfigWait()`で現在の設定を確認できます。

`setConfigWait()`で設定を更新できます。
省略した項目は以下の初期値が使われます。

```javascript
const RS_BTEVS1 = Obniz.getPartsClass('RS_BTEVS1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_BTEVS1.isDevice(peripheral)) {
    console.log('find');
    const device = new RS_BTEVS1(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    };
    await device.connectWait();
    console.log('connected');

    const config = await device.getConfigWait();

    const result = await device.setConfigWait({
      tempInterval: 10000, // 温度通知間隔[ms] (10,000~3,600,000)
      pm2_5Interval: 10000, // PM2.5通知間隔[ms] (10,000~3,600,000)
      co2Interval: 10000, // CO2通知間隔[ms] (10,000~3,600,000)
      tempMeasureOperation: false, // 温度センサー計測動作設定
      pm2_5MeasureOperation: false, // PM2.5センサー計測動作設定
      co2MeasureOperation: false, // CO2センサー計測動作設定
      ledDisplay: 'Disable', // 10連LEDへの表示設定 (Disable | PM2.5 | CO2)
      advertisementBeacon: false, // アドバタイズビーコン設定
      pm2_5ConcentrationMode: 'Number' // PM2.5質量濃度/個数濃度モード設定 (Mass | Number) このオプションはファームウェアバージョン1.1以降では動作しません。
    });
  }
};
await obniz.ble.scan.startWait();
```

## ビーコンモードの時

事前に接続し`advertisementBeacon:true`に設定した場合は、接続せずとも3分間隔で大まかな値を取得できます。

- CO2 [ppm]
- PM1.0 [ug/m3]
- PM2.5 [ug/m3]
- PM4.0 [ug/m3]  （互換性のために）
- PM10.0 [ug/m3]
- 温度 [℃]
- 湿度 [%]


（obniz.js v3.18.0まではPM5.0 [ug/m3]がありましたが、こちらはPM4.0の間違いでした。
互換性のために取得できるデータとしては残しています。）

```javascript
const RS_BTEVS1 = Obniz.getPartsClass('RS_BTEVS1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_BTEVS1.isDevice(peripheral)) {
    const data = RS_BTEVS1.getData(peripheral);
    console.log(data);
  }
};
await obniz.ble.scan.startWait();
```
