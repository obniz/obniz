import { Base } from './Base';
import { MESHJsInvalidValueError, MESHJsOutOfRangeError } from '../util/Error';
export class TempHumid extends Base {
  // Event Handler
  public onSensorEvent:
    | ((temperature: number, humidity: number, requestId: number) => void)
    | null = null;

  // Constant Values
  public static readonly EmitCondition = {
    ABOVE_UPPER_AND_BELOW_BOTTOM: 0 as const,
    ABOVE_UPPER_AND_ABOVE_BOTTOM: 1 as const,
    BELOW_UPPER_AND_BELOW_BOTTOM: 16 as const,
    BELOW_UPPER_AND_ABOVE_BOTTOM: 17 as const,
  };
  public static readonly NotifyMode = {
    STOP: 0 as const,
    EMIT_TEMPERATURE: 1 as const,
    EMIT_HUMIDITY: 2 as const,
    UPDATE_TEMPERATURE: 4 as const,
    UPDATE_HUMIDITY: 8 as const,
    ONCE: 16 as const,
    ALWAYS: 32 as const,
  } as const;
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly EVENT_TYPE_ID_: number = 0 as const;
  private readonly TEMPERATURE_MAX_ = 50 as const;
  private readonly TEMPERATURE_MIN_ = -10 as const;
  private readonly HUMIDITY_MAX_ = 100 as const;
  private readonly HUMIDITY_MIN_ = 0 as const;
  private readonly NOTIFY_MODE_MIN_ = TempHumid.NotifyMode.STOP;
  private readonly NOTIFY_MODE_MAX_ =
    TempHumid.NotifyMode.STOP +
    TempHumid.NotifyMode.EMIT_TEMPERATURE +
    TempHumid.NotifyMode.EMIT_HUMIDITY +
    TempHumid.NotifyMode.UPDATE_TEMPERATURE +
    TempHumid.NotifyMode.UPDATE_HUMIDITY +
    TempHumid.NotifyMode.ONCE +
    TempHumid.NotifyMode.ALWAYS;

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
    const BASE = 10 as const;
    const TEMP = this.complemnt(BYTE * data[5] + data[4]) / BASE;
    const temperature = Math.min(
      Math.max(this.TEMPERATURE_MIN_, TEMP),
      this.TEMPERATURE_MAX_
    );
    const HUM = BYTE * data[7] + data[6];
    const humidity = Math.min(
      Math.max(this.HUMIDITY_MIN_, HUM),
      this.HUMIDITY_MAX_
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
   * @param humidityRangeUpper
   * @param humidityRangeBottom
   * @param temperatureCondition
   * @param humidityCondision
   * @param notifyMode
   * @param opt_requestId
   * @returns
   */
  public parseSetmodeCommand(
    temperatureRangeUpper: number,
    temperatureRangeBottom: number,
    humidityRangeUpper: number,
    humidityRangeBottom: number,
    temperatureCondition: number,
    humidityCondision: number,
    notifyMode: number,
    opt_requestId = 0
  ): number[] {
    // Error Handle
    this.checkRange(
      temperatureRangeUpper,
      this.TEMPERATURE_MIN_,
      this.TEMPERATURE_MAX_,
      'temperatureRangeUpper'
    );
    this.checkRange(
      temperatureRangeBottom,
      this.TEMPERATURE_MIN_,
      this.TEMPERATURE_MAX_,
      'temperatureRangeBottom'
    );
    this.checkRange(
      humidityRangeUpper,
      this.HUMIDITY_MIN_,
      this.HUMIDITY_MAX_,
      'humidityRangeUpper'
    );
    this.checkRange(
      humidityRangeBottom,
      this.HUMIDITY_MIN_,
      this.HUMIDITY_MAX_,
      'humidityRangeBottom'
    );
    this.checkEmitCondition_(temperatureCondition, 'temperatureCondition');
    this.checkEmitCondition_(humidityCondision, 'humidityCondision');
    this.checkNotifyMode_(notifyMode);

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      opt_requestId,
    ] as const;
    const BASE: number = 10 as const;
    const TEMP_UPPER: number[] = this.num2array_(
      this.invcomplemnt(BASE * temperatureRangeUpper)
    );
    const TEMP_BOTTOM: number[] = this.num2array_(
      this.invcomplemnt(BASE * temperatureRangeBottom)
    );
    const HUMI_UPPER: number[] = this.num2array_(humidityRangeUpper);
    const HUMI_BOTTOM: number[] = this.num2array_(humidityRangeBottom);
    const data: number[] = HEADER.concat(TEMP_UPPER)
      .concat(TEMP_BOTTOM)
      .concat(HUMI_UPPER)
      .concat(HUMI_BOTTOM)
      .concat([temperatureCondition, humidityCondision, notifyMode]);
    data.push(this.checkSum(data));

    return data;
  }

  private num2array_(val: number): number[] {
    const BYTE = 256 as const;
    return [val % BYTE, Math.floor(val / BYTE)];
  }

  private checkEmitCondition_(target: number, name: string) {
    let _isExist = false;
    Object.entries(TempHumid.EmitCondition).forEach(([, value]) => {
      if (target === value) {
        _isExist = true;
      }
    });
    if (_isExist) {
      return true;
    }
    throw new MESHJsInvalidValueError(name);
  }

  private checkNotifyMode_(target: number): boolean {
    if (target < this.NOTIFY_MODE_MIN_ || this.NOTIFY_MODE_MAX_ < target) {
      throw new MESHJsOutOfRangeError(
        'notifyType',
        this.NOTIFY_MODE_MIN_,
        this.NOTIFY_MODE_MAX_
      );
    }
    return true;
  }
}
