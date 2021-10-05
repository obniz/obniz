# iBS03G

INGICS社製の防水移動検知＆落下検知センサー

![](image.jpg)

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
const iBS03G = Obniz.getPartsClass('iBS03G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS03Gでないときはnullに
  const mode = iBS03G.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS03G(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
