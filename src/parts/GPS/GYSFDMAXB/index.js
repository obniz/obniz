class GYSFDMAXB {
  constructor() {
    this.keys = ['vcc', 'txd', 'rxd', 'gnd', 'Opps'];
    this.requiredKeys = ['txd', 'rxd'];

    this.ioKeys = this.keys;
    this.displayName = 'gps';
    this.displayIoNames = { txd: 'txd', rxd: 'rxd', Opps: '1pps' };
  }

  static info() {
    return {
      name: 'GYSFDMAXB',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.tx = this.params.txd;
    this.rx = this.params.rxd;
    this.vcc = this.params.vcc;
    this.gnd = this.params.gnd;
    this.Opps = this.params.Opps;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.uart = obniz.getFreeUart();
    this.uart.start({
      tx: this.params.txd,
      rx: this.params.rxd,
      baud: 9600,
      drive: '3v',
    });

    this.editedData = {};
    this.editedData.enable = false;
    this.editedData.GPGSV = new Array(4);

    this.on1pps = null;
    this.last1pps = 0;

    this.gpsInfo = {};
    this.gpsInfo._sentenceType = {
      GPGGA: 0x0001, // GGA - Global Positioning System Fix Data
      GPGSA: 0x0002, // GSA - GNSS DOP and active satellites
      GPGSV: 0x0004, // GSV - Satellites in view
      GPRMC: 0x0008, // RMC - Recommended minimum specific GNSS data
      GPVTG: 0x0010, // VTG - Track made good and ground speed
      GPZDA: 0x0020, // ZDA - Date & Time
    };
    this.gpsInfo.status = 'V';
    this.gpsInfo.sentences = new Set(); // Set specifying sentence of MNEA from which data have been obtained
    this.gpsInfo.satelliteInfo = {
      satellites: [],
      inView: 0,
    };
  }

  start1pps(callback) {
    this.on1pps = callback;
    if (callback) {
      this.last1pps = 2;
      this.obniz.getAD(this.Opps).self = this;
      this.obniz.getAD(this.Opps).start(function(voltage) {
        let vol = Math.round(voltage);
        if (vol != this.self.last1pps) {
          this.self.last1pps = vol;
          if (vol == 0 && this.self.on1pps) {
            this.self.on1pps();
          }
        }
      });
    } else {
      this.obniz.getAD(this.Opps).end();
    }
  }

  readSentence() {
    let results = [];
    if (this.uart.isDataExists()) {
      let pos = this.uart.received.indexOf(0x0a);
      if (pos >= 0) {
        results = this.uart.received.slice(0, pos - 1);
        this.uart.received.splice(0, pos + 1);
        return this.uart.tryConvertString(results);
      }
    }
    return '';
  }

  getEditedData() {
    let n, utc, format;
    let sentence = this.readSentence();
    this.editedData.enable = false;
    this.editedData.GPGSV = new Array(4);
    while (sentence.length > 0) {
      let part = sentence.split(',');
      if (sentence.slice(-4, -3) != ',') {
        let st = part[part.length - 1].slice(0, -3);
        part.push(part[part.length - 1].slice(-3));
        part[part.length - 2] = st;
      }
      this.editedData.sentence = part.join(',');
      switch (part[0]) {
        case '$GPGGA':
          this.editedData.GPGGA = part;
          break;
        case '$GPGLL':
          this.editedData.GPGLL = part;
          break;
        case '$GPGSA':
          this.editedData.GPGSA = part;
          break;
        case '$GPGSV':
          n = Number(part[2]);
          if (n > this.editedData.GPGSV.length) {
            while (n > this.editedData.GPGSV.length) {
              this.editedData.GPGSV.push([]);
            }
          }
          this.editedData.GPGSV[n - 1] = part;
          break;
        case '$GPRMC':
          this.editedData.GPRMC = part;
          break;
        case '$GPVTG':
          this.editedData.GPVTG = part;
          break;
        case '$GPZDA':
          this.editedData.GPZDA = part;
          utc =
            part[4] +
            '/' +
            part[3] +
            '/' +
            part[2] +
            ' ' +
            part[1].substring(0, 2) +
            ':' +
            part[1].substring(2, 4) +
            ':' +
            part[1].substring(4, 6) +
            ' +00:00';
          this.editedData.timestamp = new Date(utc);
          break;
        default:
          format = part[0].substr(1);
          this.editedData[format] = part;
      }

      this.editedData.enable = true;
      sentence = this.readSentence();
    }
    return this.editedData;
  }

  getGpsInfo(editedData) {
    const NMEA_SATINSENTENCE = 4,
      NMEA_MAXSAT = 12;
    editedData = editedData || this.getEditedData();
    this.gpsInfo.status = 'V';
    if (editedData.enable) {
      if (editedData.GPGGA) {
        const gga = editedData.GPGGA;
        this.gpsInfo.gpsQuality = parseFloat(gga[6]); //Fix Quality: 0 = Invalid, 1 = GPS fix, 2 = DGPS fix
        this.gpsInfo.hdop = parseFloat(gga[8]); //Horizontal Dilution of Precision (HDOP)
        this.gpsInfo.altitude = parseFloat(gga[9]); //Antenna Altitude meters above mean sea level
        const latitude = this.nmea2dd(parseFloat(gga[2]));
        this.gpsInfo.latitude = gga[3] == 'N' ? latitude : -latitude;
        const longitude = this.nmea2dd(parseFloat(gga[4]));
        this.gpsInfo.longitude = gga[5] == 'E' ? longitude : -longitude;
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPGGA);
      }
      if (editedData.GPGSV) {
        for (let n = 0; n < editedData.GPGSV.length; n++)
          if (editedData.GPGSV[n]) {
            const gsv = editedData.GPGSV[n].map(v => parseFloat(v));
            const pack_count = gsv[1],
              pack_index = gsv[2],
              sat_count = gsv[3];
            if (pack_index > pack_count) continue;

            this.gpsInfo.satelliteInfo.inView = sat_count;
            let nsat = (pack_index - 1) * NMEA_SATINSENTENCE;
            nsat =
              nsat + NMEA_SATINSENTENCE > sat_count
                ? sat_count - nsat
                : NMEA_SATINSENTENCE;

            for (let isat = 0; isat < nsat; ++isat) {
              const isi = (pack_index - 1) * NMEA_SATINSENTENCE + isat;
              if (this.gpsInfo.satelliteInfo.satellites.length <= isi) {
                this.gpsInfo.satelliteInfo.satellites.push({});
              }
              const isatn = isat * NMEA_SATINSENTENCE;
              this.gpsInfo.satelliteInfo.satellites[isi] = {
                id: gsv[isatn + 4], // SV PRN number
                elevation: gsv[isatn + 5], // Elevation in degrees, 90 maximum
                azimuth: gsv[isatn + 6], // Azimuth, degrees from true north, 000 to 359
                snr: gsv[isatn + 7], // SNR, 00-99 dB (null when not tracking)
                inUse: false,
              };
            }
            this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPGSV);
          }
      }
      if (editedData.GPGSA) {
        const gsa = editedData.GPGSA;
        let nuse = 0;
        this.gpsInfo.fixMode = parseFloat(gsa[2]); // Fix Mode: 1=Fix not available, 2=2D, 3=3D
        this.gpsInfo.pdop = parseFloat(gsa[15]); // PDOP: Position Dilution of Precision
        this.gpsInfo.hdop = parseFloat(gsa[16]); // HDOP: Horizontal Dilution of Precision
        this.gpsInfo.vdop = parseFloat(gsa[17]); // VDOP: Vertical Dilution of Position
        for (let i = 0; i < NMEA_MAXSAT; ++i) {
          for (let j = 0; j < this.gpsInfo.satelliteInfo.inView; ++j) {
            if (
              this.gpsInfo.satelliteInfo.satellites[j] &&
              gsa[i + 3] == this.gpsInfo.satelliteInfo.satellites[j].id
            ) {
              this.gpsInfo.satelliteInfo.satellites[j].inUse = true;
              nuse++;
            }
          }
        }
        this.gpsInfo.satelliteInfo.inUse = nuse;
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPGSA);
      }
      if (editedData.GPRMC) {
        const rmc = editedData.GPRMC;
        this.gpsInfo.status = rmc[2]; // Status Active or Void
        const latitude = this.nmea2dd(parseFloat(rmc[3]));
        this.gpsInfo.latitude = rmc[4] == 'N' ? latitude : -latitude;
        const longitude = this.nmea2dd(parseFloat(rmc[5]));
        this.gpsInfo.longitude = rmc[6] == 'E' ? longitude : -longitude;
        const NMEA_TUD_KNOTS = 1.852; // 1knot=1.852km/h
        this.gpsInfo.speed = parseFloat(rmc[7]) * NMEA_TUD_KNOTS; //unit: km/h
        this.gpsInfo.direction = rmc[8];
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPRMC);
      }
      if (editedData.GPVTG) {
        const vtg = editedData.GPVTG;
        this.gpsInfo.direction = parseFloat(vtg[1]);
        this.gpsInfo.declination = parseFloat(vtg[3]);
        this.gpsInfo.speed = parseFloat(vtg[7]);
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPVTG);
      }
      if (editedData.GPZDA) {
        this.gpsInfo.utc = editedData.timestamp;
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPZDA);
      }
    }
    return this.gpsInfo;
  }
  //-------------------
  get latitude() {
    return this.nmea2dd(this._latitude);
  }
  get longitude() {
    return this.nmea2dd(this._longitude);
  }
  _mneaTo(format, value) {
    let result = this.nmea2dd(value);
    if (typeof format == 'string') {
      switch (format.toUpperCase()) {
        case 'DMS':
          result = this.nmea2dms(value);
          break;
        case 'DM':
          result = this.nmea2dm(value);
          break;
        case 'S':
          result = this.nmea2s(value);
          break;
        default:
      }
    }
    return result;
  }
  latitudeTo(format) {
    return this._mneaTo(format, this._latitude);
  }
  longitudeTo(format) {
    return this._mneaTo(format, this._longitude);
  }
  status2string(status) {
    status = status || this.status;
    if (status == 'A') return 'Active';
    if (status == 'V') return 'Void';
    return status;
  }
  fixMode2string(fixMode) {
    fixMode = fixMode || this.fixMode;
    if (fixMode == 1) return 'Fix not available';
    if (fixMode == 2) return '2D';
    if (fixMode == 3) return '3D';
    return fixMode;
  }
  gpsQuality2string(gpsQuality) {
    gpsQuality = gpsQuality || this.gpsQuality;
    if (gpsQuality == 0) return 'Invalid';
    if (gpsQuality == 1) return 'GPS fix';
    if (gpsQuality == 2) return 'DGPS fix';
    return gpsQuality;
  }

  //--- latitude/longitude MNEA format change to each unit
  nmea2dms(val) {
    //NMEA format to DMS format string (999° 99'99.9")
    val = parseFloat(val);
    let d = Math.floor(val / 100);
    let m = Math.floor((val / 100.0 - d) * 100.0);
    let s = ((val / 100.0 - d) * 100.0 - m) * 60;
    return d + '°' + m + "'" + s.toFixed(1) + '"';
  }
  nmea2dm(val) {
    //NMEA format to DM format string (999° 99.9999')
    val = parseFloat(val);
    let d = Math.floor(val / 100.0);
    let m = (val / 100.0 - d) * 100.0;
    return d + '°' + m.toFixed(4) + "'";
  }
  nmea2dd(val) {
    //NMEA format to DD format decimal (999.999999)
    val = parseFloat(val);
    let d = Math.floor(val / 100.0);
    let m = Math.floor(((val / 100.0 - d) * 100.0) / 60);
    let s = (((val / 100.0 - d) * 100.0 - m) * 60) / (60 * 60);
    return parseFloat((d + m + s).toFixed(6));
  }
  nmea2s(val) {
    //NMEA format to S format decimal (99999.9999)
    val = parseFloat(val);
    let d = Math.floor(val / 100.0);
    let m = Math.floor(((val / 100.0 - d) * 100.0) / 60);
    let s = (((val / 100.0 - d) * 100.0 - m) * 60) / (60 * 60);
    return (d + m + s) / (1.0 / 60.0 / 60.0);
  }
}

if (typeof module === 'object') {
  module.exports = GYSFDMAXB;
}
