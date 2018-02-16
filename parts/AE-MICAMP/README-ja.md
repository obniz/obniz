# Microphone Sensor Module - AE-MICAMP
秋月電子のマイクアンプキットAE-MICAMPです。音の大小を電圧を取得し、音センサとして使用します。

## wired(obniz, {vcc, out, gnd})
Obnizにマイクセンサをつなぎます。
0,1,2はそれぞれマイクセンサの電源,GND,センサ出力へ接続してください。
```javascript
var microphone = obniz.wired("AE_MICAMP", {vcc:0, out:1, gnd:2});
```

## onChange(callback(temp))
マイクセンサの値に変化があった場合にcallback関数を呼び出します。
音のレベルを電圧で返します。

```javascript
var microphone = obniz.wired("AE_MICAMP", 0, 1, 2);
microphone.onChange(function(voltage){
  console.log(voltage)
})
```
