import { MESH_js } from '.';
import { MESHOutOfRangeError } from './MESH_js_Error';
export class MESH_js_MD extends MESH_js {
  public readonly DetectionMode = {
    DETECTED: 0x01,
    NOTDETECTED: 0x02,
    ONESHOT: 0x10,
    CONTINUOUS: 0x20,
  } as const;

  public readonly MotionState = {
    SETUP: 0x00,
    DETECTED: 0x01,
    NOTDETECTED: 0x02,
  } as const;

  public onNotify: ((response: MESH_js_MD['response']) => void) | null = null;

  private readonly MessageTypeID: number = 1;

  private readonly EventTypeID: number = 0;

  private response = { request_id: -1, motion_state: -1, detection_mode: -1 };

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    if (data[1] !== this.EventTypeID) {
      return;
    }
    this.response.request_id = data[2];
    this.response.motion_state = data[3];
    this.response.detection_mode = data[4];
    if (typeof this.onNotify !== 'function') {
      return;
    }
    this.onNotify(this.response);
  }

  public get getResponse(): MESH_js_MD['response'] {
    return this.response;
  }

  public parseSetmodeCommand(
    detection_mode: number,
    detection_time = 500,
    response_time = 500,
    request_id = 0
  ): number[] {
    // Error Handle
    const _DetectionTimeMin = 200 as const;
    const _DetectionTimeMax = 60000 as const;
    if (
      detection_time < _DetectionTimeMin ||
      _DetectionTimeMax < detection_time
    ) {
      throw new MESHOutOfRangeError(
        'detection_time',
        _DetectionTimeMin,
        _DetectionTimeMax
      );
    }
    const _ResponseTimeMin = 500 as const;
    const _ResponseTimeMax = 60000 as const;
    if (response_time < _ResponseTimeMin || _ResponseTimeMax < response_time) {
      throw new MESHOutOfRangeError(
        'response_time',
        _ResponseTimeMin,
        _ResponseTimeMax
      );
    }

    // Generate Command
    const HEADER = [this.MessageTypeID, this.EventTypeID, request_id] as const;
    const BODY = [
      detection_mode,
      detection_time % 256,
      Math.floor(detection_time / 256),
      response_time % 256,
      Math.floor(response_time / 256),
    ] as const;
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));

    return data;
  }
}
