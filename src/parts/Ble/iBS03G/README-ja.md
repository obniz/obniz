# iBS03G

INGICS社製の防水移動検知センサです。

サポートデバイス

- iBS03G

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS03G = Obniz.getPartsClass('iBS03G');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const IBS03G = Obniz.getPartsClass('iBS03G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS03G.isDevice(p)) {
        let data = IBS03G.getData(p);
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

```javascript
// Javascript Example
const IBS03G = Obniz.getPartsClass('iBS03G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS03G.isDevice(p)) {
        let data = IBS03G.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

