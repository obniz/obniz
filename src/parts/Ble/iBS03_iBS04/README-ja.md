# iBS03
INGICS社製のイベントセンサーです。

![](image.jpg)

サポートモジュールは次の通りです。 

- iBS03(H) : Button, Magnet Event
- iBS04 : Button Event


## wired(obniz)

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
```

## scan()

iBS03TPを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
ibs03.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs03.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- event : event
- address : モジュールのアドレス

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
ibs03.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs03.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
ibs03.end();
```
