# S-CBTGAAAC

ABLIC社製の漏水センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
```

## scan()

S-CBTGAAACを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
tag.onNotification = (deviceId => {
            console.log(`deviceID ${deviceId}`);
        });
tag.scan();
```

## onNotification = function(deviceId){}

発見した場合にその情報をCallback関数で返します。

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
tag.onNotification = (deviceId => {
            console.log(`deviceID ${deviceId}`);
        });
tag.scan();
```


## end()

スキャンを終了します。

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
tag.end();
```
