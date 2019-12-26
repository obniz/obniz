export interface ENC03R_ModuleOptions {
  gnd?: number;
  vcc?: number;
  out2: number;
  out1: number;
}

export interface ENC03R_Module {
  onchange1: (val: number) => void;
  onchange2: (val: number) => void;
  get1Wait(): Promise<number>;
  get2Wait(): Promise<number>;
}
