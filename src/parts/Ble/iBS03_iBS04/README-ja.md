# iBS03TP
INGICS社製の温度センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
```

## scan()

iBS03TPを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
ibs03tp.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} probe_temperature ${data.probe_temperature} address ${data.address}`);
        });
ibs03tp.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- event : event
- temperature : モジュール内の温度センサの値
- probe_temperature : プローブの温度センサの値
- address : モジュールのアドレス

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
ibs03tp.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} probe_temperature ${data.probe_temperature} address ${data.address}`);
        });
ibs03tp.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
ibs03tp.end();
```
