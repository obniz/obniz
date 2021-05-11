# iBS01H
INGICS社製の開閉検知センサです。

このライブラリにより以下の２機種について検知できます。

- iBS01H

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01H = Obniz.getPartsClass('iBS01H');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
let IBS01H = Obniz.getPartsClass('iBS01H');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01H.isDevice(p)) {
        let data = IBS01H.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : 電池電圧
- button : ボタンを押すとtrue
- hall_sensor : 磁石が近づくとtrue

```javascript
// Javascript Example
let IBS01H = Obniz.getPartsClass('iBS01H');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01H.isDevice(p)) {
        let data = IBS01H.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
