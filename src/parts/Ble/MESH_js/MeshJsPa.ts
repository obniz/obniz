import { MeshJs } from './MeshJs';
import { MeshJsInvalidValueError, MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsPa extends MeshJs {
  // Event Handler
  public onSensorEvent:
    | ((proximity: number, brightness: number, requestId: number) => void)
    | null = null;

  // Constant Values
  public static readonly NotifyMode = {
    STOP: 0 as const,
    UPDATE_PROXIMITY: 4 as const,
    UPDATE_BRIGHTNESS: 8 as const,
    ONCE: 16 as const,
    ALWAYS: 32 as const,
  } as const;
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly EVENT_TYPE_ID_: number = 0 as const;

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
    const proximity = BYTE * data[5] + data[4];
    const brightness = BYTE * data[7] + data[6];
    const requestId = data[2];
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    this.onSensorEvent(proximity, brightness, requestId);
  }

  /**
   *
   * @param notifyType
   * @param opt_requestId
   * @returns command
   */
  public parseSetmodeCommand(notifyMode: number, opt_requestId = 0): number[] {
    // Error Handle
    this.checkNotifyMode_(notifyMode);

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      opt_requestId,
    ] as const;
    const FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2] as const;
    const data: number[] = HEADER.concat(FIXED).concat(notifyMode);
    data.push(this.checkSum(data));

    return data;
  }

  private checkNotifyMode_(target: number): boolean {
    if (target === 0) {
      return true;
    }
    if (target % 4 !== 0) {
      throw new MeshJsInvalidValueError('notifyMode');
    }
    const NOTIFY_MODE_MIN = MeshJsPa.NotifyMode.UPDATE_PROXIMITY;
    const NOTIFY_MODE_MAX =
      MeshJsPa.NotifyMode.UPDATE_PROXIMITY +
      MeshJsPa.NotifyMode.UPDATE_BRIGHTNESS +
      MeshJsPa.NotifyMode.ONCE +
      MeshJsPa.NotifyMode.ALWAYS;
    if (target < NOTIFY_MODE_MIN || NOTIFY_MODE_MAX < target) {
      throw new MeshJsOutOfRangeError(
        'notifyType',
        NOTIFY_MODE_MIN,
        NOTIFY_MODE_MAX
      );
    }
    return true;
  }
}
