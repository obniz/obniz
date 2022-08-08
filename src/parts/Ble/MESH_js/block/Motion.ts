import { Base } from './Base';

export class Motion extends Base {
  // Event Handler
  public onSensorEvent:
    | ((motionState: number, notifyMode: number, requestId: number) => void)
    | null = null;

  // Constant Values
  public static readonly NotifyMode = {
    DETECTED: 0x01 as const,
    NOT_DETECTED: 0x02 as const,
    ONCE: 0x10 as const,
    ALWAYS: 0x20 as const,
  } as const;
  public static readonly MotionState = {
    SETUP: 0x00 as const,
    DETECTED: 0x01 as const,
    NOT_DETECTED: 0x02 as const,
  } as const;
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
    const requestId = data[2];
    const motionState = data[3];
    const notifyMode = data[4];
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    this.onSensorEvent(motionState, notifyMode, requestId);
  }

  /**
   *
   * @param notifyMode
   * @param opt_detectionTime
   * @param opt_holdingTime
   * @param opt_requestId
   * @returns
   */
  public parseSetmodeCommand(
    notifyMode: number,
    opt_detectionTime = 500,
    opt_holdingTime = 500,
    opt_requestId = 0
  ): number[] {
    // Error Handle
    const DETECTION_TIME_MIN = 200 as const;
    const DETECTION_TIME_MAX = 60000 as const;
    this.checkRange(
      opt_detectionTime,
      DETECTION_TIME_MIN,
      DETECTION_TIME_MAX,
      'opt_detectionTime'
    );
    const HOLDING_TIME_MIN = 500 as const;
    const HOLDING_TIME_MAX = 60000 as const;
    this.checkRange(
      opt_holdingTime,
      HOLDING_TIME_MIN,
      HOLDING_TIME_MAX,
      'opt_holdingTime'
    );

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      opt_requestId,
    ] as const;
    const BYTE = 256 as const;
    const BODY = [
      notifyMode,
      opt_detectionTime % BYTE,
      Math.floor(opt_detectionTime / BYTE),
      opt_holdingTime % BYTE,
      Math.floor(opt_holdingTime / BYTE),
    ] as const;
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));

    return data;
  }
}
