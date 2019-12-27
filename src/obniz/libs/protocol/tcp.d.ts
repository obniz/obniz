export interface TCP {
  onreceive: (data: any) => void;
  onerror: (state: object) => void;
  onconnection(connected: boolean): any;

  connectWait(port: number, domain: string): Promise<number>;
  close(): void;
  write(data: any): boolean;
  readWait(): any;
  end(): void;
  isUsed(): boolean;
}
