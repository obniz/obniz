import { Base } from './Base';
import { MESHJsInvalidValueError } from '../util/Error';

export class TempHumid extends Base {
  /**
   * Sensing event
   */
  public onSensorEvent:
    | ((temperature: number, humidity: number, requestId: number) => void)
    | null = null;

  // Constant Values
  public static readonly EmitCondition = {
    ABOVE_UPPER_OR_BELOW_LOWER: 0 as const,
    ABOVE_UPPER_OR_ABOVE_LOWER: 1 as const,
    BELOW_UPPER_OR_BELOW_LOWER: 16 as const,
    BELOW_UPPER_OR_ABOVE_LOWER: 17 as const,
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
  private readonly TEMPERATURE_MAX_: number = 50 as const;
  private readonly TEMPERATURE_MIN_: number = -10 as const;
  private readonly HUMIDITY_MAX_: number = 100 as const;
  private readonly HUMIDITY_MIN_: number = 0 as const;
  private readonly NOTIFY_MODE_MIN_: number = TempHumid.NotifyMode.STOP;
  private readonly NOTIFY_MODE_MAX_: number =
    TempHumid.NotifyMode.STOP +
    TempHumid.NotifyMode.EMIT_TEMPERATURE +
    TempHumid.NotifyMode.EMIT_HUMIDITY +
    TempHumid.NotifyMode.UPDATE_TEMPERATURE +
    TempHumid.NotifyMode.UPDATE_HUMIDITY +
    TempHumid.NotifyMode.ONCE +
    TempHumid.NotifyMode.ALWAYS;

  /**
   * Verify that the device is MESH block
   *
   * @param name
   * @param opt_serialnumber
   * @returns
   */
  public static isMESHblock(
    name: string | null,
    opt_serialnumber = ''
  ): boolean {
    return super.isMESHblock(name, opt_serialnumber)
      ? name?.indexOf('MESH-100TH') !== -1
      : false;
  }

  /**
   * Parse data that received from MESH block, and emit event
   *
   * @param data
   * @returns void
   */
  public notify(data: number[]): void {
    super.notify(data);
    if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_) {
      return;
    }
    if (data[this.EVENT_TYPE_ID_INDEX] !== this.EVENT_TYPE_ID_) {
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
   * Create command of set-mode
   *
   * @param temperatureRangeUpper
   * @param temperatureRangeLower
   * @param humidityRangeUpper
   * @param humidityRangeLower
   * @param temperatureCondition
   * @param humidityCondition
   * @param notifyMode
   * @param opt_requestId
   * @returns
   */
  public createSetmodeCommand(
    temperatureRangeUpper: number,
    temperatureRangeLower: number,
    humidityRangeUpper: number,
    humidityRangeLower: number,
    temperatureCondition: number,
    humidityCondition: number,
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
      temperatureRangeLower,
      this.TEMPERATURE_MIN_,
      this.TEMPERATURE_MAX_,
      'temperatureRangeLower'
    );
    this.checkRange(
      humidityRangeUpper,
      this.HUMIDITY_MIN_,
      this.HUMIDITY_MAX_,
      'humidityRangeUpper'
    );
    this.checkRange(
      humidityRangeLower,
      this.HUMIDITY_MIN_,
      this.HUMIDITY_MAX_,
      'humidityRangeLower'
    );
    this.checkEmitCondition_(temperatureCondition, 'temperatureCondition');
    this.checkEmitCondition_(humidityCondition, 'humidityCondition');
    this.checkRange(
      notifyMode,
      this.NOTIFY_MODE_MIN_,
      this.NOTIFY_MODE_MAX_,
      'notifyMode'
    );

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
    const TEMP_LOWER: number[] = this.num2array_(
      this.invcomplemnt(BASE * temperatureRangeLower)
    );
    const HUMI_UPPER: number[] = this.num2array_(humidityRangeUpper);
    const HUMI_LOWER: number[] = this.num2array_(humidityRangeLower);
    const data: number[] = HEADER.concat(TEMP_UPPER)
      .concat(TEMP_LOWER)
      .concat(HUMI_UPPER)
      .concat(HUMI_LOWER)
      .concat([temperatureCondition, humidityCondition, notifyMode]);
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
}
