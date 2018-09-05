# GYSFDMAXB


GPSモジュール[(GYSFDMAXB(太陽誘電))](http://akizukidenshi.com/catalog/g/gK-09991/)から情報を取得するライブラリです。

![](./image.jpg) 




## wired(vcc, gnd, txd, rxd {, Opps })

vcc(5v), gnd, txd, rxd, Oppsをobnizに接続し、接続したioをプログラムで以下のように記述します。

```javascript
// Javascript Example
let gps = obniz.wired("GYSFDMAXB", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
let sentence = gps.readSentence();
```

このGPSモジュールは衛星からの電波を受信すると、基板上の赤いLEDが正確に1秒単位で点滅を始めます。同時に1PPSのピンにも信号を出します。

- 1PPSを使用しない場合は、Oppsの接続は不要。


## start1pps(callback)

1PPSピンの信号に連動してコールバック関数を呼び出します。

```javascript
// Javascript Example
let gps = obniz.wired("GYSFDMAXB", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
gps.start1pps(function() {
  console.log("1pps received.");
});
```


## readSentence()

受信したGPSデータ([NMEAフォーマット](https://ja.wikipedia.org/wiki/NMEA_0183))の1センテンス(1行の)データを読み出します。データがない場合は、空文字が返ります。
NMEAフォーマットのデータを直接使いたい場合にこのAPIを使いますが、通常は次の`getEditedData()`を使う方が便利です。


```javascript
// Javascript Example
let gps = obniz.wired("GYSFDMAXB", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
let sentence = gps.readSentence();
```

## getEditedData()

受信したNMEAフォーマットを編集しオブジェクト化した結果を取り出します。同じ情報が`editedData`プロパティにもセットされます。

- editedData.enable : 以下が有効なデータを保持している場合true
- editedData.GPGGA : GPGGAセンテンスデータ
- editedData.GPGLL : GPGLLセンテンスデータ
- editedData.GPGSA : GPGSAセンテンスデータ
- editedData.GPGSV[ ] : GPGSVセンテンスデータの配列
- editedData.GPRMC : GPRMCセンテンスデータ
- editedData.GPVTG : GPVTGセンテンスデータ
- editedData.GPZDA : GPZDAセンテンスデータ
- editedData.xxx : その他xxxセンテンスデータ
- editedData.timestamp : GPZDAセンテンスの日付時刻情報（Date型）

```javascript
// Javascript Example
let gps = obniz.wired("GYSFDMAXB", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });

function mainLoop() {
  var data = gps.getEditedData();
  if (data.enable) {
    if (data.GPGGA)    console.log(data.GPGGA.join(","));
    if (data.GPGLL)    console.log(data.GPGLL.join(","));
    if (data.GPGSA)    console.log(data.GPGSA.join(","));
    if (data.GPGSV[0]) console.log(data.GPGSV[0].join(","));
    if (data.GPGSV[1]) console.log(data.GPGSV[1].join(","));
    if (data.GPGSV[2]) console.log(data.GPGSV[2].join(","));
    if (data.GPGSV[3]) console.log(data.GPGSV[3].join(","));
    if (data.GPRMC)    console.log(data.GPRMC.join(","));
    if (data.GPVTG)    console.log(data.GPVTG.join(","));
    if (data.GPZDA)    console.log(data.GPZDA.join(","));
    if (data.PMTK010)  console.log(data.PMTK010.join(","));
    if (data.PMTK011)  console.log(data.PMTK011.join(","));
  }
  setTimeout(mainLoop, 100);
}

setTimeout(mainLoop, 10);
```


## staticメソッド

NMEAフォーマットの経度・緯度情報の単位変換を提供します。

- nmea2dms(value)<br>
NMEAの緯度経度を「度分秒(DMS)」の文字列に変換（999°99'99.9"）

- nmea2dm(value)<br>
NMEAの緯度経度を「度分(DM)」の文字列に変換（999°99.9999'）

- nmea2dd(value)<br>
NMEAの緯度経度を「度(DD)」の文字列に変換（999.999999）

- nmea2s(value)<br>
NMEAの緯度経度を「秒(S)」の数値に変換（0.999999999）


```javascript
// Javascript Example

  let d = gps.getEditedData();
  if (d.enable) {
    if (d.GPGGA) { 
      let p = d.GPGGA;
      if (p[6] != "0") {
        //経度
        let longitude = GYSFDMAXB.nmea2s(p[2]);
        //緯度
        let latitude = GYSFDMAXB.nmea2s(p[4]);
        
        ・・・
        
      }
    }
  }

```

[参考サイト](https://www.petitmonte.com/robot/howto_gysfdmaxb.html)

---

Merged Pull Request

[https://github.com/obniz/obniz/pull/127](https://github.com/obniz/obniz/pull/127)
