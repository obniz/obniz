# iBS01G
INGICS社製の落下検知センサです。

サポートデバイス

- iBS01G


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01G = Obniz.getPartsClass('iBS01G');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
let IBS01G = Obniz.getPartsClass('iBS01G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01G.isDevice(p)) {
        let data = IBS01G.getData(p);
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
- fall : 落下するとtrue

```javascript
// Javascript Example
let IBS01G = Obniz.getPartsClass('iBS01G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01G.isDevice(p)) {
        let data = IBS01G.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
