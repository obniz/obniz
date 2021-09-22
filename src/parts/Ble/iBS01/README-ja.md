# iBS01

INGICS社製のビーコン

以下のモデルに対応

- iBS01
- iBS01G(旧モデル)
- iBS01H(旧モデル)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- button: ボタンを押すとtrue
- hall_sensor: 磁石が近づくとtrue (iBS01Hのみ)
- moving: 動くとtrue (iBS01Gのみ)
- fall: 落下するとtrue (iBS01Gのみ)

## 使用例

```javascript
// Javascript
const iBS01 = Obniz.getPartsClass('iBS01');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS01でないときはnullに
  const mode = iBS01.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS01(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
