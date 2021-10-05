# Logtta_TH

ユニ電子製の温湿度センサー

公式製品紹介ページは[こちら](http://www.uni-elec.co.jp/logtta_page.html)

![](image.jpg)

![](image2.jpg)

## 対応モード

- ビーコンモード
- 接続可能モード

## ビーコンデータ(getData())

- battery: 電池残量(%)
- temperature: 温度(℃)
- humidity: 湿度(%)
- interval: 送信間隔(秒)

## 接続時のデータ(getDataWait())

- temperature: 温度(℃)
- humidity: 湿度(%)

## 使用例(ビーコンモード)

```javascript
// Javascript
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、Logtta_THでないときはnullに
  const mode = Logtta_TH.getDeviceMode(peripheral);
  if (mode === 'Beacon') {
    // インスタンスを生成
    const device = new Logtta_TH(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## 使用例(接続可能モード)

### 接続して1回だけデータ取得＆電池残量取得

`batteryService.getBatteryLevelWait()`を使用して電池残量をパーセント単位で取得できます。

```javascript
// Javascript
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、Logtta_THでないときはnullに
  const mode = Logtta_TH.getDeviceMode(peripheral);
  if (mode === 'Connectable') {
    // インスタンスを生成
    const device = new Logtta_TH(peripheral, mode);
    console.log(`Connecting to Logtta_TH[${device.address}]`);

    // デバイスに接続
    await device.connectWait();
    console.log(`Connected to Logtta_TH[${device.address}]`);

    // デバイスからデータ取得
    const data = await device.getDataWait();
    console.log(`Logtta_TH[${device.address}]: ${data.temperature}℃`);
    console.log(`Logtta_TH[${device.address}]: ${data.humidity}%`);

    if (device.batteryService) {
      // デバイスから電池残量を取得
      const batteryLevel = await device.batteryService.getBatteryLevelWait();
      // 電池残量を出力
      console.log(`Logtta_TH[${device.address}]: BatteryLevel ${batteryLevel}%`);
    }

    // デバイスから切断
    await device.disconnectWait();
    console.log(`Disconnected from Logtta_TH[${device.address}]`);
  }
};
await obniz.ble.scan.startWait();
```

### 接続して定期的にデータ取得

`startNotifyWait()`を使用してデバイスからのデータを常に待ち受けることができます。

```javascript
// Javascript
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、Logtta_THでないときはnullに
  const mode = Logtta_TH.getDeviceMode(peripheral);
  if (mode === 'Connectable') {
    // インスタンスを生成
    const device = new Logtta_TH(peripheral, mode);
    console.log(`Connecting to Logtta_TH[${device.address}]`);

    // デバイスに接続
    await device.connectWait();
    console.log(`Connected Logtta_TH[${device.address}]`);

    // デバイスからのデータの待ち受けを開始
    device.startNotifyWait((data) => {
      console.log(`Logtta_TH[${device.address}]: ${data.temperature}℃`);
      console.log(`Logtta_TH[${device.address}]: ${data.humidity}%`);
    });
  }
};
await obniz.ble.scan.startWait();
```

### 接続してビーコンモードを有効化

`setBeaconModeWait()`を使用して定期的にビーコンを発信するモードの有効無効を制御できます。

設定後に切断すると有効になります。

事前に`authPinCodeWait()`を使用してデバイスと認証する必要があります。(デフォルト認証コード: 0000)

ビーコンモードを終了する場合、デバイスにあるボタンを2秒以上長押しする操作が必要になります。

```javascript
// Javascript
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、Logtta_THでないときはnullに
  const mode = Logtta_TH.getDeviceMode(peripheral);
  if (mode === 'Connectable') {
    // インスタンスを生成
    const device = new Logtta_TH(peripheral, mode);
    console.log(`Connecting to Logtta_TH[${device.address}]`);

    // デバイスに接続
    await device.connectWait();
    console.log(`Connected to Logtta_TH[${device.address}]`);

    // 認証コードを送信
    await device.authPinCodeWait(0000);
    console.log(`Logtta_TH[${device.address}]: Sent auth pin code`);

    // ビーコンモードに有効化
    await device.setBeaconModeWait(true);
    console.log(`Logtta_TH[${device.address}]: Enabled beacon mode`);

    // デバイスから切断
    await device.disconnectWait();
    console.log(`Disconnected from Logtta_TH[${device.address}]`);
  }
};
await obniz.ble.scan.startWait();
```
