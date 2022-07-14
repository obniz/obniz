import { MESH_js } from '.';
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
    requestid = 0
  ): number[] {
    if (detection_time < 200 || 60000 < detection_time) {
      this.errorOutOfRange(
        'detection_time (' + detection_time + ') must be 200 ~ 60000.'
      );
      return [];
    }
    if (response_time < 500 || 60000 < response_time) {
      this.errorOutOfRange(
        'response_time (' + response_time + ') must be 500 ~ 60000.'
      );
      return [];
    }
    const HEADER = [this.MessageTypeID, this.EventTypeID, requestid] as const;
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
