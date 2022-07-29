import { MeshJs } from './MeshJs';
export class MeshJsAc extends MeshJs {
  // Event Handler
  public onTapped:
    | ((acceleX: number, acceleY: number, acceleZ: number) => void)
    | null = null;
  public onShaked:
    | ((acceleX: number, acceleY: number, acceleZ: number) => void)
    | null = null;
  public onFlipped:
    | ((acceleX: number, acceleY: number, acceleZ: number) => void)
    | null = null;
  public onOrientation:
    | ((
        face: number,
        acceleX: number,
        acceleY: number,
        acceleZ: number
      ) => void)
    | null = null;

  // Constant Values
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly DATA_LENGTH_ = 17 as const;
  private readonly TAP_EVENT_ID_ = 0 as const;
  private readonly SHAKE_EVENT_ID_ = 1 as const;
  private readonly FLIP_EVENT_ID_ = 2 as const;
  private readonly ORIENTATION_EVENT_ID_ = 3 as const;

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
    const BYTE = 256 as const;
    const BASE = 1024 as const;
    const acceleX = this.complemnt_(BYTE * data[5] + data[4]) / BASE;
    const acceleY = this.complemnt_(BYTE * data[7] + data[6]) / BASE;
    const acceleZ = this.complemnt_(BYTE * data[9] + data[8]) / BASE;
    switch (data[1]) {
      case this.TAP_EVENT_ID_:
        if (typeof this.onTapped === 'function') {
          this.onTapped(acceleX, acceleY, acceleZ);
        }
        break;
      case this.SHAKE_EVENT_ID_:
        if (typeof this.onShaked === 'function') {
          this.onShaked(acceleX, acceleY, acceleZ);
        }
        break;
      case this.FLIP_EVENT_ID_:
        if (typeof this.onFlipped === 'function') {
          this.onFlipped(acceleX, acceleY, acceleZ);
        }
        break;
      case this.ORIENTATION_EVENT_ID_:
        if (typeof this.onOrientation === 'function') {
          const face = data[2];
          this.onOrientation(face, acceleX, acceleY, acceleZ);
        }
        break;
      default:
        break;
    }
  }

  private complemnt_(val: number): number {
    const TWO_BYTE = 65536 as const;
    const TWO_BYTE_HALF = Math.floor(TWO_BYTE / 2) - 1;
    return val - (val > TWO_BYTE_HALF ? TWO_BYTE : 0);
  }
}
