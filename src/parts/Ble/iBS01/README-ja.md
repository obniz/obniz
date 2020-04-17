# iBS01
INGICS社製のBLEタグです。

サポートデバイス

- iBS01H
- iBS01G

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01 = Obniz.getPartsClass('iBS01');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
let IBS01 = Obniz.getPartsClass('iBS01');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01.isDevice(p)) {
        let data = IBS01.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : 電池電圧
- button : ボタンを押すとtrue
- moving : 動くとtrue
- hall_sensor : 磁石が近づくとtrue
- fall : 落下するとtrue

```javascript
// Javascript Example
let IBS01 = Obniz.getPartsClass('iBS01');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01.isDevice(p)) {
        let data = IBS01.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
