# SCBTGAAAC

ABLIC社製の漏水センサー

電池不要で、水が触れることで発電しビーコンを発信します。

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

名前(major-minor)

## 使用例

```javascript
// Javascript
const SCBTGAAAC = Obniz.getPartsClass('SCBTGAAAC');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、SCBTGAAACでないときはnullに
  const mode = SCBTGAAAC.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new SCBTGAAAC(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```