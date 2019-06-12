# GYSFDMAXB

Library for Grove GPS Module [Grove - GPS](https://www.seeedstudio.com/Grove-GPS-p-959.html).


## wired(tx, rx {, vcc, gnd})

Connect tx, rx, vcc, gnd to an obniz.
| obniz | Color of Grove cable |
|:--:|:--:|
| tx | Yellow |
| rx | White |
| vcc | Red |
| gnd | Black |

**To prevent rush current, plase insert resistor(5~10R) between obniz vcc and GPS vcc.**

And specify the pins on program.

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { tx:5, rx:6, vcc:7, gnd:8 });
let sentence = gps.readSentence();
```

Functions are common with [GYSFDMAXB Library](https://obniz.io/ja/sdk/parts/GYSFDMAXB/README.md) apart from start1pps function.
The following is common functions.

## getGpsInfo({editedData})

Retriving infomation from received NMEA sentences.
Same information will be set to gpsInfo property.

`editedData` is optional.

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
let gpsInfo = getGpsInfo();
console.log(gpsInfo);

```

## readSentence()

Read and analyze one sentence (one line) from received ([NMEA Format](https://ja.wikipedia.org/wiki/NMEA_0183)).
Empty string will be returned when no data received.

This method is useful only when NMEA direct use.

One sentence will appear in one string.
**Example:** "$GPGGA,134214.000,3599.9999,N,13999.9999,E,2,11,0.97,57.4,M,39.5,M,,\*5C"

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { vcc:7, gnd:8, txd:9, rxd:10, Opps:11 });
let sentence = gps.readSentence();
```

## getEditedData()

Get GPS info object from received NMEA format.
Same data is set to editedData property.

- editedData.enable : indicate having datas below
- editedData.GPGGA : GPGGA sentence data
- editedData.GPGLL : GPGLL sentence data
- editedData.GPGSA : GPGSA sentence data
- editedData.GPGSV[ ] : GPGSV array of sentence data
- editedData.GPRMC : GPRMC sentence data
- editedData.GPVTG : GPVTG sentence data
- editedData.GPZDA : GPZDA sentence data
- editedData.xxx : otherxxx sentence data
- editedData.timestamp : GPZDA sentence data's date(Date object)

**Example:** $GPGGA,134214.000,3599.9999,N,13999.9999,E,2,11,0.97,57.4,M,39.5,M,,\*5C
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
  setTimeout(mainLoop, 100);
}

setTimeout(mainLoop, 10);
```


## unit conversion methods

Data conversion methods for NMEA format.

- nmea2dms(value)<br>
Latitude/Longitude of NMEA to DMS format string (999°99'99.9")

- nmea2dm(value)<br>
Latitude/Longitude of NMEA to DM format string (999°99.9999')

- nmea2dd(value)<br>
Latitude/Longitude of NMEA to DD format string (999.999999)

- nmea2s(value)<br>
Latitude/Longitude of NMEA to S format string (0.999999999)


```javascript
// Javascript Example

  let d = gps.getEditedData();
  if (d.enable) {
    if (d.GPGGA) {
      let p = d.GPGGA;
      if (p[6] != "0") {
        //Longitude
        let longitude = gps.nmea2dd(p[2]);
        //Latitude
        let latitude = gps.nmea2dd(p[4]);

        ・・・

      }
    }
  }

```

[Reference](https://www.petitmonte.com/robot/howto_gysfdmaxb.html)

---
