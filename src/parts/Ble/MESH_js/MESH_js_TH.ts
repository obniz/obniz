import { MESH_js } from '.';
import { MESHOutOfRangeError } from './MESH_js_Error';
export class MESH_js_TH extends MESH_js {
  public static readonly NotifyType = {
    UpdateTemperature: 4,
    UpdateHumidity: 8,
    Once: 16,
    Always: 32,
  } as const;

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

  private readonly MaxTemperature = 50 as const;
  private readonly MinTemperature = -10 as const;
  private readonly MaxHumidity = 100 as const;
  private readonly MinHumidity = 0 as const;

  private response = { request_id: -1, temperature: -1, humidity: -1 };

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    if (data[1] !== this.EventTypeID) {
      return;
    }
    this.response.request_id = data[2];
    const _Byte = 256;
    const temp = this.complemnt(_Byte * data[5] + data[4]) / 10;
    this.response.temperature = Math.min(
      Math.max(this.MinTemperature, temp),
      this.MaxTemperature
    );
    const hum_ori = _Byte * data[7] + data[6];
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
    // Error Handle
    if (
      temperature_range_bottom < this.MinTemperature ||
      this.MaxTemperature < temperature_range_upper
    ) {
      throw new MESHOutOfRangeError(
        'temperature_range',
        this.MinTemperature,
        this.MaxTemperature
      );
    }
    if (
      humidity_range_bottom < this.MinHumidity ||
      this.MaxHumidity < humidity_range_upper
    ) {
      throw new MESHOutOfRangeError(
        'humidity_range',
        this.MinHumidity,
        this.MaxHumidity
      );
    }

    // Generate Command
    const _HEADER = [this.MessageTypeID, this.EventTypeID, request_id] as const;
    const TEMP_UPPER: number[] = this.num2array(
      10 * this.invcomplemnt(temperature_range_upper)
    );
    const TEMP_BOTTOM: number[] = this.num2array(
      10 * this.invcomplemnt(temperature_range_bottom)
    );
    const HUMI_UPPER: number[] = this.num2array(humidity_range_upper);
    const HUMI_BOTTOM: number[] = this.num2array(humidity_range_bottom);
    const data: number[] = _HEADER
      .concat(TEMP_UPPER)
      .concat(TEMP_BOTTOM)
      .concat(HUMI_UPPER)
      .concat(HUMI_BOTTOM)
      .concat([temperature_condition, humidity_condision, type]);
    data.push(this.checkSum(data));

    return data;
  }

  private num2array(val: number): number[] {
    const _Byte = 256 as const;
    return [val % _Byte, Math.floor(val / _Byte)];
  }

  private complemnt(val: number): number {
    const _2Byte = 65536 as const;
    const _2ByteHalf = Math.floor(_2Byte / 2) - 1;
    return val - (val > _2ByteHalf ? _2Byte : 0);
  }

  private invcomplemnt(val: number): number {
    const _2Byte = 65536 as const;
    return val + (val < 0 ? _2Byte : 0);
  }
}
