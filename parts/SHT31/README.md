# Temperature Sensor - SHT31
温度センサSHT31です。センサで取得した温度を知ることができます。

wired(obniz, 0, 1, 2, 3, 4, 5)
Obnizに温度センサをつなぎます。
0,1,2,3,4はそれぞれ温度センサの電源,SDA,SCL,GND,ADDRピンへ接続してください。
5はI2Cアドレスです。アドレスを0x44にする場合は4,0x45にする場合は5を入力してください。
ADDRピンをプルアップしている場合は0x45,プルダウンしている場合は0x44です。
秋月電子のモジュールキット(K-12125)を使用している場合のデフォルトは0x45です。

var sensor = Parts("SHT31");
sensor.wired(obniz, 0, 2, 3, 1, 4, 5);

getTemp()
現在の温度を計測して返します。単位は摂氏(℃)です。

getHumd()
現在の湿度を計測して返します。単位は%です。

var sensor = Parts("SHT31");
sensor.wired(obniz, 0, 1, 2, 3, 4, 5);
var temp = await sensor.getTemp();
var humd = await sensor.getHumd();
console.log('temperature:' + temp);
console.log('humidity:' + humd);
