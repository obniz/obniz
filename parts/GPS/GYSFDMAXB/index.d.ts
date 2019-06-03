export interface GYSFDMAXBOptions {
  vcc?: number;
  gnd?: number;
  txd: number;
  rxd: number;
  Opps?: number;
}

export interface GYSFDMAXBEditedData {
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

export interface GYSFDMAXB {
  start1pps(callback: () => void): void;
  getGpsInfo(editedData?: GYSFDMAXBEditedData): any;
  readSentence(): any;
  getEditedData(): GYSFDMAXBEditedData;
  nmea2dms(value: any): string;
  nmea2dm(value: any): string;
  nmea2dd(value: any): number;
  nmea2s(value: any): number;
}
