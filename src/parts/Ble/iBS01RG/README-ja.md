# iBS01RG

INGICS社製の3軸加速度センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- button: ボタンを押すとtrue
- active: 動きがあるとtrue
- acceleration: x,y,z軸の加速度

## 使用例

```javascript
// Javascript
const iBS01RG = Obniz.getPartsClass('iBS01RG');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS01RGでないときはnullに
  const mode = iBS01RG.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS01RG(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
