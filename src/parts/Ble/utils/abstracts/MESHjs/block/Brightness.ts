import { Base } from './Base';

export class Brightness extends Base {
  /**
   * Sensing event
   */
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
  private readonly NOTIFY_MODE_MIN_ = Brightness.NotifyMode.STOP;
  private readonly NOTIFY_MODE_MAX_ =
    Brightness.NotifyMode.STOP +
    Brightness.NotifyMode.UPDATE_PROXIMITY +
    Brightness.NotifyMode.UPDATE_BRIGHTNESS +
    Brightness.NotifyMode.ONCE +
    Brightness.NotifyMode.ALWAYS;
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly EVENT_TYPE_ID_: number = 0 as const;
  private readonly LX_: number = 10 as const;

  /**
   * Verify that the device is MESH block
   *
   * @param name
   * @param opt_serialnumber
   * @returns
   */
  public static isMESHblock(
    name: string | null,
    opt_serialnumber = ''
  ): boolean {
    return super.isMESHblock(name, opt_serialnumber)
      ? name?.indexOf('MESH-100PA') !== -1
      : false;
  }

  /**
   * notify
   *
   * @param data
   * @returns void
   */
  public notify(data: number[]): void {
    super.notify(data);
    if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_) {
      return;
    }
    if (data[this.EVENT_TYPE_ID_INDEX] !== this.EVENT_TYPE_ID_) {
      return;
    }
    const BYTE = 256 as const;
    const proximity = BYTE * data[5] + data[4];
    const brightness = this.LX_ * (BYTE * data[7] + data[6]);
    const requestId = data[2];
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    this.onSensorEvent(proximity, brightness, requestId);
  }

  /**
   * Create command of set-mode
   *
   * @param notifyMode
   * @param opt_requestId
   * @returns command
   */
  public createSetmodeCommand(notifyMode: number, opt_requestId = 0): number[] {
    // Error Handle
    this.checkRange(
      notifyMode,
      this.NOTIFY_MODE_MIN_,
      this.NOTIFY_MODE_MAX_,
      'notifyMode'
    );

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
}
