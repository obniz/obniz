# iBS01T
INGICS社製の温湿度センサーです。

Support device

- iBS01T

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01T = Obniz.getPartsClass('iBS01T');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
let IBS01T = Obniz.getPartsClass('iBS01T');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01T.isDevice(p)) {
        let data = IBS01T.getData(p);
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
- reed : reedビットが1のときtrue
- temperature : 温度センサの値
- humidity : 湿度センサの値

```javascript
// Javascript Example
let IBS01T = Obniz.getPartsClass('iBS01T');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01T.isDevice(p)) {
        let data = IBS01T.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
