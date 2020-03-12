# iBS01RG
INGICS社製の加速度センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
```

## scan()

iBS01RGを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onNotification = (data => {
            console.log(`battery ${data.battery}V address ${data.address} button ${data.button} active ${data.active} acceleration ${data.acceleration[0].x},${data.acceleration[0].y},${data.acceleration[0].z} ${data.acceleration[1].x},${data.acceleration[1].y},${data.acceleration[1].z} ${data.acceleration[2].x},${data.acceleration[2].y},${data.acceleration[2].z}` ) ;
        });
ibs01rg.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- button : ボタンの状態
- active : 加速度がアクティブ状態かインアクティブ状態
- acceleration : x,y,z軸の加速度の配列
- address : モジュールアドレス

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onNotification = (data => {
            console.log(`battery ${data.battery}V address ${data.address} button ${data.button} active ${data.active} acceleration ${data.acceleration[0].x},${data.acceleration[0].y},${data.acceleration[0].z} ${data.acceleration[1].x},${data.acceleration[1].y},${data.acceleration[1].z} ${data.acceleration[2].x},${data.acceleration[2].y},${data.acceleration[2].z}` ) ;
        });
ibs01rg.scan();
```

## onChangeButton = function(pressed){}

ボタンを押したときや離したときにコールバック関数で返します。

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onChangeButton = (pressed =>{
            console.log(`button state ${pressed}`);
        });
ibs01rg.scan();
```

## onChangeActive = function(active){}

アクティブ状態やインアクティブ状態に変化したときにコールバック関数で返します。

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onChangeActive = (active =>{
            console.log(`active state ${active}`);
        });
ibs01rg.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.end();
```
