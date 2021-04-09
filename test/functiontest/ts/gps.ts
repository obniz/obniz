import Obniz from '../../../dist/src/obniz/index';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/GYSFDMAXB/README.md
 */
class GYSFDMAXBTest {
  public start1pps() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const gps = obniz.wired('GYSFDMAXB', {
        vcc: 7,
        gnd: 8,
        txd: 9,
        rxd: 10,
        Opps: 11,
      });
      gps.start1pps(() => {
        console.log('1pps received.');
      });
    };
  }

  public getGpsInfo() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const gps = obniz.wired('GYSFDMAXB', {
        vcc: 7,
        gnd: 8,
        txd: 9,
        rxd: 10,
        Opps: 11,
      });
      const gpsInfo = gps.getGpsInfo();
      console.log(gpsInfo);
    };
  }

  public readSentence() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const gps = obniz.wired('GYSFDMAXB', {
        vcc: 7,
        gnd: 8,
        txd: 9,
        rxd: 10,
        Opps: 11,
      });
      const sentence = gps.readSentence();
    };
  }

  public getEditedData() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const gps = obniz.wired('GYSFDMAXB', {
        vcc: 7,
        gnd: 8,
        txd: 9,
        rxd: 10,
        Opps: 11,
      });

      function mainLoop() {
        const data = gps.getEditedData();
        if (data.enable) {
          if (data.GPGGA) {
            console.log(data.GPGGA.join(','));
          }
          if (data.GPGLL) {
            console.log(data.GPGLL.join(','));
          }
          if (data.GPGSA) {
            console.log(data.GPGSA.join(','));
          }
          if (data.GPGSV[0]) {
            console.log(data.GPGSV[0].join(','));
          }
          if (data.GPGSV[1]) {
            console.log(data.GPGSV[1].join(','));
          }
          if (data.GPGSV[2]) {
            console.log(data.GPGSV[2].join(','));
          }
          if (data.GPGSV[3]) {
            console.log(data.GPGSV[3].join(','));
          }
          if (data.GPRMC) {
            console.log(data.GPRMC.join(','));
          }
          if (data.GPVTG) {
            console.log(data.GPVTG.join(','));
          }
          if (data.GPZDA) {
            console.log(data.GPZDA.join(','));
          }
          if (data.PMTK010) {
            console.log(data.PMTK010.join(','));
          }
          if (data.PMTK011) {
            console.log(data.PMTK011.join(','));
          }
        }
        setTimeout(mainLoop, 1000);
      }

      setTimeout(mainLoop, 10);
    };
  }

  public convertLatLngUnit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const gps = obniz.wired('GYSFDMAXB', {
        vcc: 7,
        gnd: 8,
        txd: 9,
        rxd: 10,
        Opps: 11,
      });
      const d = gps.getEditedData();
      if (d.enable) {
        if (d.GPGGA) {
          const p = d.GPGGA;
          if (p[6] !== '0') {
            // 経度
            const longitude = gps.nmea2dd(p[2]);
            // 緯度
            const latitude = gps.nmea2dd(p[4]);
          }
        }
      }
    };
  }
}
