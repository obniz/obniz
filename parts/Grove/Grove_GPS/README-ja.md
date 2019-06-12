# Grove_GPS


Grove GPSモジュール[(Grove - GPS)](https://www.seeedstudio.com/Grove-GPS-p-959.html)から情報を取得するライブラリです。
機能は[こちらのモジュール](https://obniz.io/ja/sdk/parts/GYSFDMAXB/README.md)とほぼ同じですが、Grove GPSモジュールには1PPM出力がありません。

## wired(tx, rx {, vcc, gnd})

obnizのtx,rx,vcc,gndをぞれぞれGPSモジュールの対応するピンに接続します。
Groveシステムなので、
| obniz | Groveケーブルの色 |
|:--:|:--:|
| tx | 黄 |
| rx | 白 |
| vcc | 赤 |
| gnd | 黒 |
となるはずです。

**突入電流対策のため、obnizのvcc(5V出力)とGPSモジュールのvccの間に5~10Ω程度の抵抗を挿入してください。**

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { tx:5, rx:6, vcc:7, gnd:8 });
let sentence = gps.readSentence();
```

start1pps関数が使えない以外は[GYSFDMAXB用ライブラリ](https://obniz.io/ja/sdk/parts/GYSFDMAXB/README.md)と共通です。
以下の関数についてもGYSFDMAXBライブラリと共通です。


## getGpsInfo({editedData})

受信したNMEAフォーマットのセンテンスから有用なデータをオブジェクト化した結果を取り出します。同じ情報が`gpsInfo`プロパティにもセットされます。<br>
通常は引数を省略しますが、後述の`editedData`を指定すると、その情報を使用してオブジェクト化します。

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
let gpsInfo = gps.getGpsInfo();
console.log(gpsInfo);

```

## readSentence()

受信したGPSデータ([NMEAフォーマット](https://ja.wikipedia.org/wiki/NMEA_0183))の1センテンス(1行の)データを読み出します。データがない場合は、空文字が返ります。
NMEAフォーマットのデータを直接使いたい場合にこのAPIを使います。

受信した1センテンス分のデータが文字列としてセットされます。<br>
**例：** "$GPGGA,134214.000,3599.9999,N,13999.9999,E,2,11,0.97,57.4,M,39.5,M,,\*5C"


```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
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
let gps = obniz.wired("Grove_GPS", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });

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
