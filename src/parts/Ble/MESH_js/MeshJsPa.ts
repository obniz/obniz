import { MeshJs } from './MeshJs';
import { MeshJsInvalidValueError, MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsPa extends MeshJs {
  public static readonly NotifyType = {
    UpdateProximity: 4,
    UpdateBrightness: 8,
    Once: 16,
    Always: 32,
  } as const;

  public onNotify: ((resp: MeshJsPa['response']) => void) | null = null;

  private readonly MessageTypeID: number = 1 as const;
  private readonly EventTypeID: number = 0 as const;
  private response = { requestId: -1, proximity: -1, brightness: -1 };

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    if (data[1] !== this.EventTypeID) {
      return;
    }
    const _Byte = 256 as const;
    this.response.requestId = data[2];
    this.response.proximity = _Byte * data[5] + data[4];
    this.response.brightness = _Byte * data[7] + data[6];
    if (typeof this.onNotify !== 'function') {
      return;
    }
    this.onNotify(this.response);
  }

  public get getResponse(): MeshJsPa['response'] {
    return this.response;
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
    const _notifytypeMin = 4;
    const _notifytypeMax = 60;
    if (notifyType < _notifytypeMin || _notifytypeMax < notifyType) {
      throw new MeshJsOutOfRangeError('notifyType');
    }

    // Generate Command
    const _HEADER = [this.MessageTypeID, this.EventTypeID, requestId] as const;
    const _FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2] as const;
    const data: number[] = _HEADER.concat(_FIXED).concat(notifyType);
    data.push(this.checkSum(data));

    return data;
  }
}
