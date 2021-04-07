# iBS04
INGICS社製のBLEを利用しビーコンを発信するデバイスです。

サポートデバイス

- iBS04

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS04 = Obniz.getPartsClass('iBS04');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const IBS04 = Obniz.getPartsClass('iBS04');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS04.isDevice(p)) {
        let data = IBS04.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : 電池電圧
- button : ボタンを押すとtrue

```javascript
// Javascript Example
const IBS04 = Obniz.getPartsClass('iBS04');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS04.isDevice(p)) {
        let data = IBS04.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

