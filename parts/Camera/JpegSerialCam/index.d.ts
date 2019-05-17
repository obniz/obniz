export interface JpegSerialCamOptions {
  vcc?: number;
  cam_tx: number;
  cam_rx: number;
  gnd?: number;
}

export type JpegSerialCamSize = '640x480' | '320x240' | '160x120';
export type JpegSerialCamBaud = 9600 | 19200 | 38400 | 57600 | 115200;
export interface JpegSerialCam {
  startWait(params: { baud: JpegSerialCamBaud }): Promise<void>;
  setSizeWait(resolution: JpegSerialCamSize): Promise<void>;
  setBaudWait(baud: JpegSerialCamBaud): Promise<void>;
  takeWait(): Promise<any[]>;
  arrayToBase64(bytearray: any[]): string;
}
