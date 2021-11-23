# iBS01G

INGICS社製の移動検知＆落下検知センサー

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- button: ボタンを押すとtrue
- moving: 動くとtrue
- fall: 落下するとtrue

## 使用例

```javascript
// Javascript
const iBS01G = Obniz.getPartsClass('iBS01G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS01Gでないときはnullに
  const mode = iBS01G.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS01G(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
