# MM_BLEBC5

サンワサプライ社の加速度センサー付きビーコンです。
事前に専用アプリによりビーコン出力の設定をする必要があります。

いずれかのスロットのフレームタイプにACCが設定されている場合のみ対応しています。

![](./image.jpg)


## ビーコンデータ(getData())

- acceleration: 加速度(±2G)
- battery: 電池残量(%)

## 使用例

```javascript
// Javascript
const MM_BLEBC5 = Obniz.getPartsClass('MM_BLEBC5');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、MM_BLEBC5でないときはnullに
  const mode = MM_BLEBC5.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new MM_BLEBC5(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
