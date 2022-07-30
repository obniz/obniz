import { MeshJs } from './MeshJs';
import { MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsMd extends MeshJs {
  // Event Handler
  public onSensorEvent:
    | ((motionState: number, detectionMode: number, requestId: number) => void)
    | null = null;

  // Constant Values
  public readonly DETECTION_MODE = {
    DETECTED: 0x01 as const,
    NOT_DETECTED: 0x02 as const,
    ONESHOT: 0x10 as const,
    CONTINUOUS: 0x20 as const,
  } as const;
  public readonly MOTION_STATE = {
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
    const detectionMode = data[4];
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    this.onSensorEvent(motionState, detectionMode, requestId);
  }

  /**
   *
   * @param detectionMode
   * @param opt_detectionTime
   * @param opt_responseTime
   * @param opt_requestId
   * @returns
   */
  public parseSetmodeCommand(
    detectionMode: number,
    opt_detectionTime = 500,
    opt_responseTime = 500,
    opt_requestId = 0
  ): number[] {
    // Error Handle
    const DETECTION_TIME_MIN = 200 as const;
    const DETECTION_TIME_MAX = 60000 as const;
    if (
      opt_detectionTime < DETECTION_TIME_MIN ||
      DETECTION_TIME_MAX < opt_detectionTime
    ) {
      throw new MeshJsOutOfRangeError(
        'opt_detectionTime',
        DETECTION_TIME_MIN,
        DETECTION_TIME_MAX
      );
    }
    const RESPONSE_TIME_MIN = 500 as const;
    const RESPONSE_TIME_MAX = 60000 as const;
    if (
      opt_responseTime < RESPONSE_TIME_MIN ||
      RESPONSE_TIME_MAX < opt_responseTime
    ) {
      throw new MeshJsOutOfRangeError(
        'opt_responseTime',
        RESPONSE_TIME_MIN,
        RESPONSE_TIME_MAX
      );
    }

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      opt_requestId,
    ] as const;
    const BYTE = 256 as const;
    const BODY = [
      detectionMode,
      opt_detectionTime % BYTE,
      Math.floor(opt_detectionTime / BYTE),
      opt_responseTime % BYTE,
      Math.floor(opt_responseTime / BYTE),
    ] as const;
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));

    return data;
  }
}
