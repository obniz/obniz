import { MeshJs } from './MeshJs';
import { MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsTh extends MeshJs {
  // Event Handler
  public onNotify: ((accele: MeshJsTh['response_']) => void) | null = null;

  // Constant Values
  public static readonly NOTIFY_TYPE = {
    UPDATE_TEMPERATURE: 4 as const,
    UPDATE_HUMIDITY: 8 as const,
    ONCE: 16 as const,
    ALWAYS: 32 as const,
  } as const;
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly EVENT_TYPE_ID_: number = 0 as const;
  private readonly MAX_TEMPERATURE_ = 50 as const;
  private readonly MIN_TEMPERATURE_ = -10 as const;
  private readonly MAX_HUMIDITY_ = 100 as const;
  private readonly MIN_HUMIDITY_ = 0 as const;

  private response_ = { requestId: -1, temperature: -1, humidity: -1 };

  public get getResponse(): MeshJsTh['response_'] {
    return this.response_;
  }

  /**
   *
   * @param data
   * @returns
   */
  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MESSAGE_TYPE_ID_) {
      return;
    }
    if (data[1] !== this.EVENT_TYPE_ID_) {
      return;
    }

    this.response_.requestId = data[2];

    const BYTE = 256 as const;
    const TEMP = this.complemnt_(BYTE * data[5] + data[4]) / 10;
    this.response_.temperature = Math.min(
      Math.max(this.MIN_TEMPERATURE_, TEMP),
      this.MAX_TEMPERATURE_
    );

    const hum_ori = BYTE * data[7] + data[6];
    this.response_.humidity = Math.min(
      Math.max(this.MIN_HUMIDITY_, hum_ori),
      this.MAX_HUMIDITY_
    );

    if (typeof this.onNotify !== 'function') {
      return;
    }
    this.onNotify(this.response_);
  }

  /**
   *
   * @param temperatureRangeUpper
   * @param temperatureRangeBottom
   * @param temperatureCondition
   * @param humidityRangeUpper
   * @param humidityRangeBottom
   * @param humidityCondision
   * @param type
   * @param requestId
   * @returns
   */
  public parseSetmodeCommand(
    temperatureRangeUpper: number,
    temperatureRangeBottom: number,
    temperatureCondition: number,
    humidityRangeUpper: number,
    humidityRangeBottom: number,
    humidityCondision: number,
    type: number,
    requestId = 0
  ): number[] {
    // Error Handle
    if (
      temperatureRangeBottom < this.MIN_TEMPERATURE_ ||
      this.MAX_TEMPERATURE_ < temperatureRangeUpper
    ) {
      throw new MeshJsOutOfRangeError(
        'temperature_range',
        this.MIN_TEMPERATURE_,
        this.MAX_TEMPERATURE_
      );
    }
    if (
      humidityRangeBottom < this.MIN_HUMIDITY_ ||
      this.MAX_HUMIDITY_ < humidityRangeUpper
    ) {
      throw new MeshJsOutOfRangeError(
        'humidity_range',
        this.MIN_HUMIDITY_,
        this.MAX_HUMIDITY_
      );
    }

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      requestId,
    ] as const;
    const BASE: number = 10 as const;
    const TEMP_UPPER: number[] = this.num2array_(
      BASE * this.invcomplemnt_(temperatureRangeUpper)
    );
    const TEMP_BOTTOM: number[] = this.num2array_(
      BASE * this.invcomplemnt_(temperatureRangeBottom)
    );
    const HUMI_UPPER: number[] = this.num2array_(humidityRangeUpper);
    const HUMI_BOTTOM: number[] = this.num2array_(humidityRangeBottom);
    const data: number[] = HEADER.concat(TEMP_UPPER)
      .concat(TEMP_BOTTOM)
      .concat(HUMI_UPPER)
      .concat(HUMI_BOTTOM)
      .concat([temperatureCondition, humidityCondision, type]);
    data.push(this.checkSum(data));

    return data;
  }

  private num2array_(val: number): number[] {
    const BYTE = 256 as const;
    return [val % BYTE, Math.floor(val / BYTE)];
  }

  private complemnt_(val: number): number {
    const TWO_BYTE = 65536 as const;
    const TWO_BYTE_HALF = Math.floor(TWO_BYTE / 2) - 1;
    return val - (val > TWO_BYTE_HALF ? TWO_BYTE : 0);
  }

  private invcomplemnt_(val: number): number {
    const TWO_BYTE = 65536 as const;
    return val + (val < 0 ? TWO_BYTE : 0);
  }
}
