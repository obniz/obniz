export interface RN42Options {
  tx: number;
  rx: number;
  gnd?: number;
}

export type RN42Config_Mode =
  | 'slave'
  | 'master'
  | 'trigger'
  | 'auto-connect-master'
  | 'auto-connect-dtr'
  | 'auto-connect-any'
  | 'pairing';
export type RN42Config_Profile = 'SPP' | 'DUN-DCE' | 'DUN-DTE' | 'MDM-SPP' | 'SPP-DUN-DCE' | 'APL' | 'HID';
export type RN42Config_Auth = 'open' | 'ssp-keyboard' | 'just-work' | 'pincode';
export type RN43Config_Power = 16 | 12 | 8 | 4 | 0 | -4 | -8;

export interface RN42Config {
  display_name?: string;
  master_slave?: RN42Config_Mode;
  profile?: RN42Config_Profile;
  auth?: RN42Config_Auth;
  power?: RN43Config_Power;
  hid_flag?: any;
}

export interface RN42 {
  onreceive: (data: any, text: string) => void;
  send(data: any): void;
  config(json: RN42Config): void;
  enterCommandMode(): void;
  sendCommand(data: any): void;
  config_get_setting(): void;
  config_get_extendSetting(): void;
}
