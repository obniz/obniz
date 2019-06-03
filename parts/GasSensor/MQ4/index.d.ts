export interface MQ4Options {
  gnd?: number;
  vcc?: number;
  do?: number;
  ao?: number;
}

export interface MQ4 {
  voltageLimit: number;
  onchangeanalog: (voltage: number) => void;
  onexceedvoltage: (voltage: number) => void;
  onchangedigital: (voltage: number) => void;
  startHeating(): void;
  heatWait(sec?: number): Promise<void>;
}
