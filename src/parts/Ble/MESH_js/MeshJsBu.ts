import { MeshJs } from './MeshJs';
export class MeshJsBu extends MeshJs {
  // Event Handler
  public onSinglePressedNotify: (() => void) | null = null;
  public onLongPressedNotify: (() => void) | null = null;
  public onDoublePressedNotify: (() => void) | null = null;

  // Constant Values
  private readonly DATA_LENGTH_: number = 4 as const;
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly EVENT_TYPE_ID_: number = 0 as const;
  private readonly TYPE_ = {
    SINGLE: 1 as const,
    LONG: 2 as const,
    DOUBLE: 3 as const,
  } as const;

  /**
   * notify
   *
   * @param data
   * @returns
   */
  public notify(data: number[]): void {
    super.notify(data);
    if (data.length !== this.DATA_LENGTH_) {
      return;
    }
    if (data[0] !== this.MESSAGE_TYPE_ID_) {
      return;
    }
    if (data[1] !== this.EVENT_TYPE_ID_) {
      return;
    }
    switch (data[2]) {
      case this.TYPE_.SINGLE:
        if (typeof this.onSinglePressedNotify === 'function') {
          this.onSinglePressedNotify();
        }
        break;
      case this.TYPE_.LONG:
        if (typeof this.onLongPressedNotify === 'function') {
          this.onLongPressedNotify();
        }
        break;
      case this.TYPE_.DOUBLE:
        if (typeof this.onDoublePressedNotify === 'function') {
          this.onDoublePressedNotify();
        }
        break;
      default:
        break;
    }
  }
}
