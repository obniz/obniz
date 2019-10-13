export interface Puls08M5stickcSOptions {
  vcc?: number;
  gnd?: number;
  rx: number;
  tx: number;
}

export interface Puls08M5stickcS {
  onbpmupdate(bpm: number) : void;
  onrawupdate(values: [number]) : void;
}
