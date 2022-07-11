import { MESH_js } from '.';
export class MESH_js_PA extends MESH_js {
  /**
   * MessageTypeID
   * command header
   */
  private readonly MessageTypeID: number = 1;

  /**
   * EventTypeID
   * command header
   */
  private readonly EventTypeID: number = 0;

  private response = { requestId: -1, proximity: -1, brightness: -1 };

  public onNotify: ((resp: MESH_js_PA['response']) => void) | null = null;

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    if (data[1] !== this.EventTypeID) {
      return;
    }
    this.response.requestId = data[2];
    this.response.proximity = 256 * data[5] + data[4];
    this.response.brightness = 256 * data[7] + data[6];
    if (typeof this.onNotify !== 'function') {
      return;
    }
    this.onNotify(this.response);
  }

  public get getResponse(): MESH_js_PA['response'] {
    return this.response;
  }

  /**
   * setMode
   *
   * @param type
   * @returns
   */
  public parseSetmodeCommand(notifyType: number, requestId = 0): number[] {
    const HEADER: number[] = [this.MessageTypeID, this.EventTypeID, requestId];
    const FIXED: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2];
    const data: number[] = HEADER.concat(FIXED).concat(notifyType);
    data.push(this.checkSum(data));
    return data;
  }
}
