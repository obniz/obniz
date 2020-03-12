# iBS04i
INGICS社製のビーコンです。

![](image.jpg)

## wired(obniz)

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
```

## scan()

iBS04iを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
ibs04i.onNotification = (data => {
            console.log(
                `battery ${data.battery}V event ${data.event} uuid ${data.uuid} major ${data.major} minor ${data.minor} rssi ${data.rssi} address ${data.address}`,
            );
        });
ibs04i.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : バッテリの電圧
- event : Button押したとき: 1
- uuid : iBeacon　UUID
- major : iBeacon　major
- minor : iBeacon　minor
- power : iBeacon　power
- rssi : 電波強度
- address : モジュールのアドレス

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
ibs04i.onNotification = (data => {
            console.log(
                `battery ${data.battery}V event ${data.event} uuid ${data.uuid} major ${data.major} minor ${data.minor} rssi ${data.rssi} power ${data.power} address ${data.address}`,
            );
        });
ibs04i.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
ibs04i.end();
```
