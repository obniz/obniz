export interface TCP {
  onconnection(connected: boolean);
  onreceive: (data: array) => void;
  onerror: (state: object) => void;

  connectWait(port: number, domain: string): Promise<number>;
  close(): void;
  write(data: any): boolean;
  readWait(): Array;
  end(): void;
  isUsed(): boolean;
}
