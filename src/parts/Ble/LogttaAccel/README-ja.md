# Logtta_Accel

ユニ電子製の加速度センサー

公式製品紹介ページは[こちら](http://www.uni-elec.co.jp/logtta_page.html)

紹介ページ内にあるAndroidアプリでビーコンモードに切り替えた時のみ対応しています。

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: バッテリ残量(%)
- sequence: シーケンス番号
- revision: モジュールのバージョン
- name: モジュール名
- setting
    - temp_cycle: 温湿度測定周期(秒)
    - accel_sampling: 加速度サンプリング周波数(Hz)
    - hpf: ハイパスフィルタ
    - accel_range: 加速度レンジ(G)
    - accel_axis: 加速度計測軸(X/Y/Z)
    - accel_resolution: 加速度分解能(bit)
- temperature: 温度(℃)
- humidity: 湿度(%)
- alert: 過去4回分のアラートの発生状態
- accel_peak: 加速度ピークデータ
- accel_rms: 加速度RMSデータ

## 使用例

```javascript
// Javascript
const Logtta_Accel = Obniz.getPartsClass('Logtta_Accel');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、Logtta_Accelでないときはnullに
  const mode = Logtta_Accel.getDeviceMode(peripheral);
  if (mode === 'Beacon') {
    // インスタンスを生成
    const device = new Logtta_Accel(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
