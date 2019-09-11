# Grove_GPS
Grove GPSモジュール[(Grove - GPS)](https://www.seeedstudio.com/Grove-GPS-p-959.html)から情報を取得するライブラリです。
機能は[GYSFDMAXB](https://obniz.io/ja/sdk/parts/GYSFDMAXB/README.md)とほぼ同じですが、Grove GPSモジュールには1PPM出力がありません。

![](./image.jpg)

```html
<!-- HTML Example -->
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://obniz.io/js/jquery-3.2.1.min.js"></script>
<script src="https://unpkg.com/obniz@latest/obniz.js"></script>
</head>
<body>

<div id="obniz-debug"></div>
<h1>obniz GPS</h1>
<div id="obniz-gps"></div>

<script>
  var obniz = new Obniz("95496709");
  obniz.onconnect = async function () {
    let gps = obniz.wired("Grove_GPS", { rx: 0, tx: 1, vcc: 2, gnd: 3 });

    setInterval(async function () {
      let gpsInfo = gps.getGpsInfo();
      console.log(gpsInfo);
      document.getElementById("obniz-gps").textContent = "longitude:" + gpsInfo.longitude + " latitude:" + gpsInfo.latitude;
    }, 1000);
  }
</script>
</body>
</html>
```


## wired(rx, tx {, vcc, gnd})

obniz BoardにGPSモジュールを接続します。
次のように接続を行います。

| grove | cable | obniz |
|:--:|:--:|:--:|
| tx | - | rx |
| rx | - | tx |
| vcc | - | vcc |
| gnd | - | gnd |


**突入電流対策のため、obniz Boardのvcc(5V出力)とGPSモジュールのvccの間に5~10Ω程度の抵抗を挿入してください。**

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { rx:0, tx:1, vcc:2, gnd:3 });
```

## readSentence()

受信したGPSデータ([NMEAフォーマット](https://ja.wikipedia.org/wiki/NMEA_0183))の1センテンス(1行の)データを読み出します。
データがない場合は、空文字が返ります。
NMEAフォーマットのデータを直接使いたい場合にこのAPIを使います。

受信した1センテンス分のデータが文字列としてセットされます。<br>
**例：** "$GPGGA,134214.000,3599.9999,N,13999.9999,E,2,11,0.97,57.4,M,39.5,M,,\*5C"


```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { rx:0, tx:1, vcc:2, gnd:3 });
let sentence = gps.readSentence();
```

## getGpsInfo({editedData})

受信したNMEAフォーマットのセンテンスから有用なデータをオブジェクト化した結果を取り出します。同じ情報が`gpsInfo`プロパティにもセットされます。<br>
通常は引数を省略しますが、後述の`editedData`を指定すると、その情報を使用してオブジェクト化します。

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { rx:0, tx:1, vcc:2, gnd:3 });
let gpsInfo = gps.getGpsInfo();
console.log(gpsInfo);

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
let gps = obniz.wired("Grove_GPS", { rx:0, tx:1, vcc:2, gnd:3 });

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
let gps = obniz.wired("Grove_GPS", { rx:0, tx:1, vcc:2, gnd:3 });
let d = gps.getEditedData();
if (d.enable) {
  if (d.GPGGA) {
    let p = d.GPGGA;
    if (p[6] != "0") {
      //経度
      let longitude = gps.nmea2dd(p[2]);
      //緯度
      let latitude = gps.nmea2dd(p[4]);
    }
  }
}

```

[参考サイト](https://www.petitmonte.com/robot/howto_gysfdmaxb.html)


---
