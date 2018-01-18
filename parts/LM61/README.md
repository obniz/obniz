# Temperature Sensor - LM61
温度センサLM61BIZ/LM61CIZです。センサで取得した温度を知ることができます。

wired(obniz, 0, 1, 2)
Obnizに温度センサをつなぎます。
0,1,2はそれぞれ温度センサの電源,センサ出力,GNDへ接続してください。

var tempsens = Parts("LM61");
tempsens.wired(obniz, 0, 1, 2);


onChange(callback)
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。小数点以下の温度は表示されません。
