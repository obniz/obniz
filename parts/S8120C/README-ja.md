# Temperature Sensor - S-8120C
※正しく動作しません！考えられる原因はjsに書きました
温度センサS-8120Cです。センサで取得した温度を知ることができます。

## wired(obniz, vcc, output, gnd)
Obnizに温度センサをつなぎます。
0,1,2はそれぞれ温度センサの電源,GND,センサ出力へ接続してください。
```javascript
var tempsens = obniz.wired("S8120C", 0, 1, 2);
```

## onChange(callback(temp))
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。

```javascript
var tempsens = obniz.wired("S8120C", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp)
})
```
