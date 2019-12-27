/* tslint:disable:class-name  */
export interface Grove_ButtonOptions {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export interface Grove_Button {
  onchange: (pressed: boolean) => void;
  isPressedWait(): Promise<boolean>;
  stateWait(pressed: boolean): Promise<void>;
}
