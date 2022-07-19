import { MESH_js } from '.';
export class MESH_js_TH extends MESH_js {
  // Event handler
  public onNotify: ((accele: MESH_js_TH['response']) => void) | null = null;

  /**
   * MessageTypeID
   * command header
   */
  private readonly MessageTypeID: number = 1;

  /**
   * EventTypeID
   * command header
   */
  private readonly EventTypeID: number = 0;

  private readonly MaxTemperature = 50;
  private readonly MinTemperature = -10;
  private readonly MaxHumidity = 100;
  private readonly MinHumidity = 0;

  private response = { requestId: -1, temperature: -1, humidity: -1 };

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    if (data[1] !== this.EventTypeID) {
      return;
    }
    const temp = this.complemnt(256 * data[5] + data[4]) / 10;
    this.response.temperature = Math.min(
      Math.max(this.MinTemperature, temp),
      this.MaxTemperature
    );
    const hum_ori = 256 * data[7] + data[6];
    this.response.humidity = Math.min(
      Math.max(this.MinHumidity, hum_ori),
      this.MaxHumidity
    );

    if (typeof this.onNotify !== 'function') {
      return;
    }
    this.onNotify(this.response);
  }

  public get getResponse(): MESH_js_TH['response'] {
    return this.response;
  }

  public parseSetmodeCommand(
    temperature_range_upper: number,
    temperature_range_bottom: number,
    temperature_condition: number,
    humidity_range_upper: number,
    humidity_range_bottom: number,
    humidity_condision: number,
    type: number,
    request_id = 0
  ): number[] {
    // Generate Command
    const HEADER: number[] = [this.MessageTypeID, this.EventTypeID, request_id];
    const TEMP_UPPER: number[] = this.num2array(
      10 * this.invcomplemnt(temperature_range_upper)
    );
    const TEMP_BOTTOM: number[] = this.num2array(
      10 * this.invcomplemnt(temperature_range_bottom)
    );
    const HUMI_UPPER: number[] = this.num2array(humidity_range_upper);
    const HUMI_BOTTOM: number[] = this.num2array(humidity_range_bottom);
    const data: number[] = HEADER.concat(TEMP_UPPER)
      .concat(TEMP_BOTTOM)
      .concat(HUMI_UPPER)
      .concat(HUMI_BOTTOM)
      .concat([temperature_condition, humidity_condision, type]);
    data.push(this.checkSum(data));

    return data;
  }

  private num2array(val: number): number[] {
    const _base = 256;
    return [val % _base, Math.floor(val / _base)];
  }

  private complemnt(val: number): number {
    return val - (val > 32767 ? 65536 : 0);
  }

  private invcomplemnt(val: number): number {
    return val + (val < 0 ? 65536 : 0);
  }
}
