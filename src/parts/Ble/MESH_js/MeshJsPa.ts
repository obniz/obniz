import { MeshJs } from './MeshJs';
import { MeshJsInvalidValueError, MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsPa extends MeshJs {
  // Event Handler
  public onSensorEvent:
    | ((proximity: number, brightness: number, requestId: number) => void)
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
    EMIT_PROXIMITY: 1 as const,
    EMIT_BRIGHTNESS: 2 as const,
    UPDATE_PROXIMITY: 4 as const,
    UPDATE_BRIGHTNESS: 8 as const,
    ONCE: 16 as const,
    ALWAYS: 32 as const,
  } as const;
  private readonly RANGE_MIN = 0 as const;
  private readonly RANGE_MAX = 65535 as const;
  private readonly NOTIFY_MODE_MIN_ = MeshJsPa.NotifyMode.STOP;
  private readonly NOTIFY_MODE_MAX_ =
    MeshJsPa.NotifyMode.STOP +
    MeshJsPa.NotifyMode.EMIT_PROXIMITY +
    MeshJsPa.NotifyMode.EMIT_BRIGHTNESS +
    MeshJsPa.NotifyMode.UPDATE_PROXIMITY +
    MeshJsPa.NotifyMode.UPDATE_BRIGHTNESS +
    MeshJsPa.NotifyMode.ONCE +
    MeshJsPa.NotifyMode.ALWAYS;
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly EVENT_TYPE_ID_: number = 0 as const;

  /**
   * notify
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
    const proximity = BYTE * data[5] + data[4];
    const LX = 10 as const;
    const brightness = LX * (BYTE * data[7] + data[6]);
    const requestId = data[2];
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    this.onSensorEvent(proximity, brightness, requestId);
  }

  /**
   * parseSetmodeCommand
   *
   * @param notifyMode
   * @param opt_requestId
   * @returns command
   */
  public parseSetmodeCommand(
    proximityRangeUpper: number,
    proximityRangeBottom: number,
    brightnessRangeUpper: number,
    brightnessRangeBottom: number,
    proximityCondition: number,
    brightnessCondition: number,
    notifyMode: number,
    opt_requestId = 0
  ): number[] {
    // Convert
    const LX = 10 as const;
    const _brightnessRangeUpper = brightnessRangeUpper / LX;
    const _brightnessRangeBottom = brightnessRangeBottom / LX;

    // Error Handle
    this.checkRange_(proximityRangeUpper);
    this.checkRange_(proximityRangeBottom);
    this.checkRange_(_brightnessRangeUpper);
    this.checkRange_(_brightnessRangeBottom);
    this.checkNotifyMode_(notifyMode);

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      opt_requestId,
    ] as const;

    const PROXIMITY_RANGE_UPPER = this.num2array_(proximityRangeUpper);
    const PROXIMITY_RANGE_BOTTOM = this.num2array_(proximityRangeBottom);
    const BRIGHTNESS_RANGE_UPPER = this.num2array_(_brightnessRangeUpper);
    const BRIGHTNESS_RANGE_BOTTOM = this.num2array_(_brightnessRangeBottom);
    const FIXED = [2, 2, 2] as const;
    const data: number[] = HEADER.concat(PROXIMITY_RANGE_UPPER)
      .concat(PROXIMITY_RANGE_BOTTOM)
      .concat(BRIGHTNESS_RANGE_UPPER)
      .concat(BRIGHTNESS_RANGE_BOTTOM)
      .concat(proximityCondition)
      .concat(brightnessCondition)
      .concat(FIXED)
      .concat(notifyMode);
    data.push(this.checkSum(data));

    return data;
  }

  private checkRange_(target: number): boolean {
    if (target < this.RANGE_MIN || this.RANGE_MAX < target) {
      throw new MeshJsOutOfRangeError(
        'range value',
        this.RANGE_MIN,
        this.RANGE_MAX
      );
    }
    return true;
  }

  private checkNotifyMode_(target: number): boolean {
    if (target < this.NOTIFY_MODE_MIN_ || this.NOTIFY_MODE_MAX_ < target) {
      throw new MeshJsOutOfRangeError(
        'notifyType',
        this.NOTIFY_MODE_MIN_,
        this.NOTIFY_MODE_MAX_
      );
    }
    return true;
  }

  private num2array_(val: number): number[] {
    const BYTE = 256 as const;
    return [val % BYTE, Math.floor(val / BYTE)];
  }
}
