# Temperature Sensor - MCP9701
温度センサMCP9701です。センサで取得した温度を知ることができます。

## wired(obniz, vcc, output, gnd)
Obnizに温度センサをつなぎます。
0,1,2はそれぞれ温度センサの電源,センサ出力,GNDへ接続してください。
```javascript
var tempsens = obniz.wired("MCP9701", 0, 1, 2);
```

## onChange(callback(temp))
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。

```javascript
var tempsens = obniz.wired("MCP9701", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp);
})
```