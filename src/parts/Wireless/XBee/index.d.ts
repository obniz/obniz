export interface XBeeOptions {
  tx: number;
  rx: number;
  gnd?: number;
}

export interface XBeeConfig {
  [key: string]: string;
}

export interface XBee {
  onreceive: (data: any, text: string) => void;
  configWait(json: XBeeConfig): Promise<void>;
  send(data: any): void;
}
