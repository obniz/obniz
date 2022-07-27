import { MeshJs } from './MeshJs';
import { MeshJsInvalidValueError, MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsPa extends MeshJs {
  // Event Handler
  public onNotify: ((resp: MeshJsPa['response_']) => void) | null = null;

  // Constant Values
  public static readonly NOTIFY_TYPE = {
    UPDATE_PROXIMITY: 4 as const,
    UPDATE_BRIGHTNESS: 8 as const,
    ONCE: 16 as const,
    ALWAYS: 32 as const,
  } as const;
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly EVENT_TYPE_ID_: number = 0 as const;

  private response_ = { requestId: -1, proximity: -1, brightness: -1 };

  public get getResponse(): MeshJsPa['response_'] {
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
    const BYTE = 256 as const;
    this.response_.requestId = data[2];
    this.response_.proximity = BYTE * data[5] + data[4];
    this.response_.brightness = BYTE * data[7] + data[6];
    if (typeof this.onNotify !== 'function') {
      return;
    }
    this.onNotify(this.response_);
  }

  /**
   *
   * @param notifyType
   * @param requestId
   * @returns command
   */
  public parseSetmodeCommand(notifyType: number, requestId = 0): number[] {
    // Error Handle
    if (notifyType % 4 !== 0) {
      throw new MeshJsInvalidValueError('notifyType');
    }
    const NOTIFY_TYPE_MIN = MeshJsPa.NOTIFY_TYPE.UPDATE_PROXIMITY;
    const NOTIFY_TYPE_MAX =
      MeshJsPa.NOTIFY_TYPE.UPDATE_PROXIMITY +
      MeshJsPa.NOTIFY_TYPE.UPDATE_BRIGHTNESS +
      MeshJsPa.NOTIFY_TYPE.ONCE +
      MeshJsPa.NOTIFY_TYPE.ALWAYS;
    if (notifyType < NOTIFY_TYPE_MIN || NOTIFY_TYPE_MAX < notifyType) {
      throw new MeshJsOutOfRangeError(
        'notifyType',
        NOTIFY_TYPE_MIN,
        NOTIFY_TYPE_MAX
      );
    }

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      requestId,
    ] as const;
    const FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2] as const;
    const data: number[] = HEADER.concat(FIXED).concat(notifyType);
    data.push(this.checkSum(data));

    return data;
  }
}
