# iBS03R
距離を計測し、その計測結果を含んだビーコンを発信するデバイスです。



![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS03R = Obniz.getPartsClass('iBS03R');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const IBS03R = Obniz.getPartsClass('iBS03R');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
  if (IBS03R.isDevice(p)) {
    let data = IBS03R.getData(p);
    console.log(data);
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : バッテリーの電圧
- distance: 距離の計測結果

```javascript
// Javascript Example
const IBS03R = Obniz.getPartsClass('iBS03R');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
  if (IBS03R.isDevice(p)) {
    let data = IBS03R.getData(p);
    console.log(data);
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
