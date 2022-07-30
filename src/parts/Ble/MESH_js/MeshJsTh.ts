import { MeshJs } from './MeshJs';
import { MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsTh extends MeshJs {
  // Event Handler
  public onSensorEvent:
    | ((temperature: number, humidity: number, requestId: number) => void)
    | null = null;

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

    const BYTE = 256 as const;
    const TEMP = this.complemnt_(BYTE * data[5] + data[4]) / 10;
    const temperature = Math.min(
      Math.max(this.MIN_TEMPERATURE_, TEMP),
      this.MAX_TEMPERATURE_
    );
    const HUM = BYTE * data[7] + data[6];
    const humidity = Math.min(
      Math.max(this.MIN_HUMIDITY_, HUM),
      this.MAX_HUMIDITY_
    );
    const requestId = data[2];
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    this.onSensorEvent(temperature, humidity, requestId);
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
   * @param opt_requestId
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
    opt_requestId = 0
  ): number[] {
    // Error Handle
    if (
      temperatureRangeBottom < this.MIN_TEMPERATURE_ ||
      this.MAX_TEMPERATURE_ < temperatureRangeUpper
    ) {
      throw new MeshJsOutOfRangeError(
        'temperatureRange',
        this.MIN_TEMPERATURE_,
        this.MAX_TEMPERATURE_
      );
    }
    if (
      humidityRangeBottom < this.MIN_HUMIDITY_ ||
      this.MAX_HUMIDITY_ < humidityRangeUpper
    ) {
      throw new MeshJsOutOfRangeError(
        'humidityRange',
        this.MIN_HUMIDITY_,
        this.MAX_HUMIDITY_
      );
    }

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      opt_requestId,
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
