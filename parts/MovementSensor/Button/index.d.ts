export interface ButtonOptions {
  signal: number;
  gnd?: number;
}

export interface Button {
  onchange: (pressed: boolean) => void;
  isPressedWait(): Promise<boolean>;
  stateWait(pressed: boolean): Promise<void>;
}
