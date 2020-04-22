# Logtta Accel

加速度センサーの値をBLEのadvertisingで発信するデバイスです。

http://www.uni-elec.co.jp/logtta_accel_3_0_torisetsu.pdf

本ライブラリは、上記のドキュメントを参考にビーコンモード時に動作するものです。

Logtta Accel を検索し、データを取得します

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const LOGTTA = Obniz.getPartsClass('Logtta_Accel');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const LOGTTA = Obniz.getPartsClass('Logtta_Accel');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (LOGTTA.isDevice(p)) {
        let data = LOGTTA.getScanData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getScanData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : バッテリの電圧
- sequence : シーケンス番号
- revision : モジュールのバージョン
- name : モジュール名
- setting
    - temp_cycle : 温湿度測定周期(秒)
    - accel_sampling : 加速度サンプリング周波数(Hz)
    - hpf : ハイパスフィルタ
    - accel_range : 加速度レンジ(G)
    - accel_axis : 加速度計測軸(0b001:Z, 0b010:Y, 0b011:Y/Z, 0b100:X, 0b101:X/Z, 0b110:X/Y, 0b111:X/Y/Z)
    - accel_resolution : 加速度分解能(bit)
- temperature : 温度
- humidity : 湿度
- alert : 過去4回分のアラートの発生状態

```javascript
// Javascript Example
const LOGTTA = Obniz.getPartsClass('Logtta_Accel');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (LOGTTA.isDevice(p)) {
        let data = LOGTTA.getScanData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getAccelData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- peak : 加速度ピークデータ
- rms : 加速度RMS データ

```javascript
// Javascript Example
const LOGTTA = Obniz.getPartsClass('Logtta_Accel');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (LOGTTA.isDevice(p)) {
        let data = LOGTTA.getAccelData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
