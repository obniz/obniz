export interface TCP {
  onconnection(connected: boolean);
  onreceive: (data: any) => void;
  onerror: (state: string) => void;

  connectWait(port: number, domain: string): Promise<number>;
  close(): void;
  write(data: any): boolean;
  end(): void;
  isUsed(): boolean;
}
