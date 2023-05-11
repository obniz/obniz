# TM2101-SR

マクセル社製の温度パッチセンサ

袋から出し光を感知すると起動し、体温を測定し続けます。

最大5184組のデータを格納可能

## 対応モード

- 接続可能モード

## ビーコンデータ(getData())

- serial: シリアル番号
- interval: 測定間隔(分)
- temperature: 測定済み体温(℃)
- elapsed_time: 起動からの経過時間(秒)
- reset_reason: 最後のリセット起因
- battery: 電池電圧 (1.35のみ1.4V未満を示す)
- full: データ領域の空き状況
- interval_determining_method: 測定間隔の決定方法

## 接続時のデータ(getDataWait())

- data: UNIX時間(秒)における測定体温(℃)の連想配列
- elapsed_time: 起動から最終測定までの経過時間(秒)

## 使用方法

```javascript
const TM2101_SR = Obniz.getPartsClass('TM2101_SR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (TM2101_SR.isDevice(peripheral)) {
    console.log('find');
    const device = new TM2101_SR(peripheral);

    // ビーコンデータ
    const advDataResult = device.getData();
    console.log(advDataResult);

    device.ondisconnect = (reason) => {
      console.log(reason);
    };
    await device.connectWait();
    console.log('connected');

    // 接続時のデータ(格納されていたデータ)
    const dataResult = await device.getDataWait();
    console.log(dataResult);

    await device.disconnectWait();
  }
};
await obniz.ble.scan.startWait();
```

## 各種設定

`setConfigWait()`で設定を更新できます。
省略した項目は以下の初期値が使われます。

警告: 記録されているデータはすべて削除されます。

```javascript
const TM2101_SR = Obniz.getPartsClass('TM2101_SR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (TM2101_SR.isDevice(peripheral)) {
    console.log('find');
    const device = new TM2101_SR(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason);
    };
    await device.connectWait();
    console.log('connected');

    const result = await device.setConfigWait({
      // 第1の測定間隔[分] (1~60) (初期値: 1)
      first_interval: 1,
      // 第2の測定間隔への移行時間[時間] (0~24) (初期値: 24)
      transition_time_to_second: 24,
      // 第2の測定間隔[分] (1~60) (初期値: 5)
      second_interval: 5,
      // 1分間隔へ移行する体温(Ts)[℃] (25.000~41.000) (初期値: 37.5)
      temperature: 37.5,
      // 1分間隔へ移行する体温の差分(Td)[℃] (0.125~2.000) (初期値: 0.5)
      temperature_difference: 0.5,
    });
    console.log('setConfigWait', result);
  }
};
await obniz.ble.scan.startWait();
```

## 休止モードへの移行

`hibernateWait()`で出荷時の休止モードへ移行できます。
移行後は自動で接続が切断されます。

警告: 記録されているデータはすべて削除されます。

```javascript
const TM2101_SR = Obniz.getPartsClass('TM2101_SR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (TM2101_SR.isDevice(peripheral)) {
    console.log('find');
    const device = new TM2101_SR(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason);
      console.log('hibernated');
    };
    await device.connectWait();
    console.log('connected');

    await device.hibernateWait();
  }
};
await obniz.ble.scan.startWait();
```
