import { MeshJs } from './MeshJs';
import { MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsMd extends MeshJs {
  // Event Handler
  public onNotify: ((response: MeshJsMd['response_']) => void) | null = null;

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

  private response_ = { requestId: -1, motionState: -1, detectionMode: -1 };

  public get getResponse(): MeshJsMd['response_'] {
    return this.response_;
  }

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
    this.response_.requestId = data[2];
    this.response_.motionState = data[3];
    this.response_.detectionMode = data[4];
    if (typeof this.onNotify !== 'function') {
      return;
    }
    this.onNotify(this.response_);
  }

  /**
   *
   * @param detectionMode
   * @param detectionTime
   * @param responseTime
   * @param requestId
   * @returns
   */
  public parseSetmodeCommand(
    detectionMode: number,
    detectionTime = 500,
    responseTime = 500,
    requestId = 0
  ): number[] {
    // Error Handle
    const DETECTION_TIME_MIN = 200 as const;
    const DETECTION_TIME_MAX = 60000 as const;
    if (
      detectionTime < DETECTION_TIME_MIN ||
      DETECTION_TIME_MAX < detectionTime
    ) {
      throw new MeshJsOutOfRangeError(
        'detectionTime',
        DETECTION_TIME_MIN,
        DETECTION_TIME_MAX
      );
    }
    const RESPONSE_TIME_MIN = 500 as const;
    const RESPONSE_TIME_MAX = 60000 as const;
    if (responseTime < RESPONSE_TIME_MIN || RESPONSE_TIME_MAX < responseTime) {
      throw new MeshJsOutOfRangeError(
        'responseTime',
        RESPONSE_TIME_MIN,
        RESPONSE_TIME_MAX
      );
    }

    // Generate Command
    const HEADER = [
      this.MESSAGE_TYPE_ID_,
      this.EVENT_TYPE_ID_,
      requestId,
    ] as const;
    const BYTE = 256 as const;
    const BODY = [
      detectionMode,
      detectionTime % BYTE,
      Math.floor(detectionTime / BYTE),
      responseTime % BYTE,
      Math.floor(responseTime / BYTE),
    ] as const;
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));

    return data;
  }
}
