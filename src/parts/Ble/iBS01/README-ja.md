# iBS01
INGICS社製のBLEタグです。

このライブラリにより以下の２機種について検知できます。

- iBS01H: ホールセンサーを利用したドアの開閉検知センサー
- iBS01G: 動作や落下を検知するセンサー

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
- hall_sensor : 磁石が近づくとtrue(iBS01H)
- moving : 動くとtrue(iBS01G)
- fall : 落下するとtrue(iBS01G)

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
