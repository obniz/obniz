export interface Grove_GPSOptions {
  vcc?: number;
  gnd?: number;
  tx: number;
  rx: number;
}

export interface Grove_GPSEditedData {
  enable: boolean;
  GPGGA: any;
  GPGLL: any;
  GPGSA: any;
  GPGSV: any[];
  GPRMC: any;
  GPVTG: any;
  GPZDA: any;
  [key: string]: any;
  timestamp: Date;
}

export interface Grove_GPS {
  readSentence(): string;
  getEditedData(): Grove_GPSEditedData;
  getGpsInfo(editedData?: Grove_GPSEditedData): any;
  nmea2dms(value: any): string;
  nmea2dm(value: any): string;
  nmea2dd(value: any): number;
  nmea2s(value: any): number;
}
