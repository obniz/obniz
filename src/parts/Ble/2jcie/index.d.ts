export interface OMRON_2JCIEOptions {}

export interface OMRON_2JCIE_Data {
  row_number: number;
  temperature: number;
  relative_humidity: number;
  light: number;
  uv_index: number;
  barometric_pressure: number;
  soud_noise: number;
  discomfort_index: number;
  heatstroke_risk_factor: number;
  battery_voltage: number;
}

export interface OMRON_2JCIE {
  findWait(): Promise<any>;
  connectWait(): Promise<void>;
  disconnectWait(): Promise<void>;
  getLatestData(): Promise<OMRON_2JCIE_Data>;
}
