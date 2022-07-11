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

  private response = { requestId: -1, temperature: -1, humidity: -1 };

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    if (data[1] !== this.EventTypeID) {
      return;
    }
    const temp_ori = 256 * data[5] + data[4];
    const temp = (temp_ori - (temp_ori > 32767 ? 65536 : 0)) / 10;
    this.response.temperature = Math.min(Math.max(-10, temp), 50);
    // this.response.temperature = (temp < -10) ? -10 : ((temp > 50) ? 50 : temp);

    const hum_ori = 256 * data[7] + data[6];
    this.response.humidity = Math.min(Math.max(0, hum_ori), 100);
    // this.response.humidity = (hum_ori < 0) ? 0 : ((hum_ori > 100) ? 100 : hum_ori);

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
    type: number
  ): number[] {
    const RequestID = 0;
    const HEADER: number[] = [this.MessageTypeID, this.EventTypeID, RequestID];
    const BODY: number[] = [
      (10 * temperature_range_upper) % 256,
      Math.floor((10 * temperature_range_upper) / 256),
      (10 * temperature_range_bottom) % 256,
      Math.floor((10 * temperature_range_bottom) / 256),
      humidity_range_upper % 256,
      Math.floor(humidity_range_upper / 256),
      humidity_range_bottom % 256,
      Math.floor(humidity_range_bottom / 256),
      temperature_condition,
      humidity_condision,
      type,
    ];
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));
    return data;
  }
}
