# GYSFDMAXB


GPSモジュール[(GYSFDMAXB(太陽誘電))](http://akizukidenshi.com/catalog/g/gK-09991/)から情報を取得するライブラリです。

![](./image.jpg)




## wired(vcc, gnd, txd, rxd {, Opps })

vcc(5v), gnd, txd, rxd, Oppsをobniz Boardに接続し、接続したioをプログラムで以下のように記述します。

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


## getGpsInfo({editedData})

受信したNMEAフォーマットのセンテンスから有用なデータをオブジェクト化した結果を取り出します。同じ情報が`gpsInfo`プロパティにもセットされます。<br>
通常は引数を省略しますが、後述の`editedData`を指定すると、その情報を使用してオブジェクト化します。

```javascript
// Javascript Example
let gps = obniz.wired("GYSFDMAXB", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
let gpsInfo = gps.getGpsInfo();
console.log(gpsInfo);

// 出力結果
gpsInfo: Object
  utc: Sat Sep 08 2018 22:42:14 GMT+0900 (JST)
  status: A [Active]	// Active or Void
  fixMode: 3 [3D]	// 1:Fix not available, 2:2D, 3:3D
  gpsQuality: 2 [DGPS fix]	// 0:Invalid, 1:GPS fix, 2:DGPS fix
  latitude: 35.999999
  longitude: 139.999999
  pdop: 1.24	// PDOP: Position Dilution of Precision
  hdop: 0.97	// HDOP: Horizontal Dilution of Precision
  vdop: 0.77	// VDOP: Vertical Dilution of Position
  altitude: 57.4[M]
  declination: NaN	// Magnetic declination
  direction: 236.34
  speed: 0.02[km/h]
  satelliteInfo: Object
    inUse: 11
    inView: 15
    satellites: Array (15)
      [0]: {id: 194,	elevation: 87,	azimuth: 261,	snr: 31[dB],	inUse: true, }
      [1]: {id: 25,	elevation: 63,	azimuth: 179,	snr: 34[dB],	inUse: true, }
      [2]: {id: 12,	elevation: 59,	azimuth: 67,	snr: 20[dB],	inUse: true, }
      [3]: {id: 193,	elevation: 59,	azimuth: 210,	snr: 37[dB],	inUse: true, }
      [4]: {id: 10,	elevation: 55,	azimuth: 256,	snr: 40[dB],	inUse: true, }
      [5]: {id: 42,	elevation: 48,	azimuth: 170,	snr: 31[dB],	inUse: false, }
      [6]: {id: 20,	elevation: 43,	azimuth: 211,	snr: 35[dB],	inUse: true, }
      [7]: {id: 32,	elevation: 41,	azimuth: 315,	snr: 46[dB],	inUse: true, }
      [8]: {id: 24,	elevation: 35,	azimuth: 57,	snr: NaN[dB],	inUse: false, }
      [9]: {id: 15,	elevation: 25,	azimuth: 120,	snr: 23[dB],	inUse: true, }
      [10]: {id: 14,	elevation: 19,	azimuth: 307,	snr: 30[dB],	inUse: true, }
      [11]: {id: 195,	elevation: 18,	azimuth: 168,	snr: 28[dB],	inUse: true, }
      [12]: {id: 31,	elevation: 12,	azimuth: 260,	snr: 24[dB],	inUse: true, }
      [13]: {id: 19,	elevation: 5,	azimuth: 46,	snr: NaN[dB],	inUse: false, }
      [14]: {id: 29,	elevation: 1,	azimuth: 160,	snr: NaN[dB],	inUse: false, }
  sentences: Set {GPGGA, GPGSA, GPGSV, GPRMC, GPVTG, GPZDA, }

```

## readSentence()

受信したGPSデータ([NMEAフォーマット](https://ja.wikipedia.org/wiki/NMEA_0183))の1センテンス(1行の)データを読み出します。データがない場合は、空文字が返ります。
NMEAフォーマットのデータを直接使いたい場合にこのAPIを使います。

受信した1センテンス分のデータが文字列としてセットされます。<br>
**例：** "$GPGGA,134214.000,3599.9999,N,13999.9999,E,2,11,0.97,57.4,M,39.5,M,,\*5C"


```javascript
// Javascript Example
let gps = obniz.wired("GYSFDMAXB", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
let sentence = gps.readSentence();
```

## getEditedData()

受信したNMEAフォーマットのセンテンスをオブジェクト化した結果を取り出します。同じ情報が`editedData`プロパティにもセットされます。

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

各センテンスのデータが文字配列としてセットされます。<br>
**例：** $GPGGA,134214.000,3599.9999,N,13999.9999,E,2,11,0.97,57.4,M,39.5,M,,\*5C
<br>
["$GPGGA","134214.000","3599.9999","N","13999.9999","E","2","11","0.97","57.4","M","39.5","M","","*5C"]


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
  setTimeout(mainLoop, 1000);
}

setTimeout(mainLoop, 10);
```


## 経度・緯度情報の単位変換メソッド

NMEAフォーマットの経度・緯度情報の単位変換を提供します。

- nmea2dms(value)<br>
NMEAの緯度経度を「度分秒(DMS)」の文字列に変換（999°99'99.9"）

- nmea2dm(value)<br>
NMEAの緯度経度を「度分(DM)」の文字列に変換（999°99.9999'）

- nmea2dd(value)<br>
NMEAの緯度経度を「度(DD)」の数値に変換（999.999999）

- nmea2s(value)<br>
NMEAの緯度経度を「秒(S)」の数値に変換（999999.999）


```javascript
// Javascript Example

  let d = gps.getEditedData();
  if (d.enable) {
    if (d.GPGGA) {
      let p = d.GPGGA;
      if (p[6] != "0") {
        //経度
        let longitude = gps.nmea2dd(p[2]);
        //緯度
        let latitude = gps.nmea2dd(p[4]);

        ・・・

      }
    }
  }

```

[参考サイト](https://www.petitmonte.com/robot/howto_gysfdmaxb.html)


---

Merged Pull Request

[https://github.com/obniz/obniz/pull/127](https://github.com/obniz/obniz/pull/127)

[https://github.com/obniz/obniz/pull/132](https://github.com/obniz/obniz/pull/132)
