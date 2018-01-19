# Temperature Sensor - LM60
温度センサLM60BIZ/LM60CIMです。センサで取得した温度を知ることができます。

## wired(obniz, 0, 1, 2)
Obnizに温度センサをつなぎます。
0,1,2はそれぞれ温度センサの電源,センサ出力,GNDへ接続してください。

```javascript
// Example
var tempsens = obniz.wired("LM60", 0, 1, 2);
```

## onChange(callback)
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。
温度は小数点第1位まで表示されますが、計測単位は1.6度です。
Ex. 20.1→21.7→23.3
```javascript
// Example
var tempsens = obniz.wired("LM60", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp);
})
```