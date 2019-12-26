export interface ArduCAMMiniOptions {
  cs: number;
  mosi?: number;
  miso?: number;
  sclk?: number;
  gnd?: number;
  vcc?: number;
  sda?: number;
  scl?: number;
  i2c?: any; // TODO: i2c object
  spi?: any; // TODO: spi object
  spi_drive?: any; // TODO: spi object
  spi_frequency?: any; // TODO: spi object
  module_version?: number;
}

export type ArduCAMMiniMode = 'MCU2LCD' | 'CAM2LCD' | 'LCD2MCU';
export type ArduCAMMiniSize =
  | '160x120'
  | '176x144'
  | '320x240'
  | '352x288'
  | '640x480'
  | '800x600'
  | '1024x768'
  | '1280x960'
  | '1600x1200';

export interface ArduCAMMini {
  startupWait(): Promise<void>;
  takeWait(size: ArduCAMMiniSize): Promise<any[]>;
  arrayToBase64(bytearray: any[]): string;
  setMode(mode: ArduCAMMiniMode): void;
  spi_pingpongWait(): Promise<void>;
  getChipIdWait(): Promise<number>;
  init(): void;
  setSize(size: ArduCAMMiniSize): void;
  flushFIFO(): void;
  startCapture(): void;
  isCaptureDoneWait(): Promise<boolean>;
  readFIFOWait(): Promise<any[]>;
}
