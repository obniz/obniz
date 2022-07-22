import { MeshJs } from './MeshJs';
export class MeshJsAc extends MeshJs {
  // Event Handler
  public onTapped: ((accele: MeshJsAc['accele_']) => void) | null = null;
  public onShaked: ((accele: MeshJsAc['accele_']) => void) | null = null;
  public onFlipped: ((accele: MeshJsAc['accele_']) => void) | null = null;
  public onDirection:
    | ((face: number, accele: MeshJsAc['accele_']) => void)
    | null = null;

  // Constant Values
  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly DATA_LENGTH_ = 17 as const;
  private readonly TAP_EVENT_ID_ = 0 as const;
  private readonly SHAKE_EVENT_ID_ = 1 as const;
  private readonly FLIP_EVENT_ID_ = 2 as const;
  private readonly DIRECTION_EVENT_ID_ = 3 as const;

  private accele_ = { x: -1, y: -1, z: -1 };
  private face_ = -1;

  public get getAccele(): MeshJsAc['accele_'] {
    return this.accele_;
  }

  public get getFace(): number {
    return this.face_;
  }

  /**
   * notify
   *
   * @param data
   * @returns
   */
  public notify(data: number[]): void {
    super.notify(data);
    this.updateAccele_(data);
    if (data[0] !== 1) {
      return;
    }
    switch (data[1]) {
      case this.TAP_EVENT_ID_:
        if (typeof this.onTapped === 'function') {
          this.onTapped(this.accele_);
        }
        break;
      case this.SHAKE_EVENT_ID_:
        if (typeof this.onShaked === 'function') {
          this.onShaked(this.accele_);
        }
        break;
      case this.FLIP_EVENT_ID_:
        if (typeof this.onFlipped === 'function') {
          this.onFlipped(this.accele_);
        }
        break;
      case this.DIRECTION_EVENT_ID_:
        if (typeof this.onDirection === 'function') {
          this.face_ = data[2];
          this.onDirection(this.face_, this.accele_);
        }
        break;
      default:
        break;
    }
  }

  private updateAccele_(data: number[]): boolean {
    if (data.length !== this.DATA_LENGTH_) {
      return false;
    }
    if (data[0] !== this.MESSAGE_TYPE_ID_) {
      return false;
    }
    const BYTE = 256 as const;
    const BASE = 1024 as const;
    this.accele_.x = this.complemnt_(BYTE * data[5] + data[4]) / BASE;
    this.accele_.y = this.complemnt_(BYTE * data[7] + data[6]) / BASE;
    this.accele_.z = this.complemnt_(BYTE * data[9] + data[8]) / BASE;
    return true;
  }

  private complemnt_(val: number): number {
    const TWO_BYTE = 65536 as const;
    const TWO_BYTE_HALF = Math.floor(TWO_BYTE / 2) - 1;
    return val - (val > TWO_BYTE_HALF ? TWO_BYTE : 0);
  }
}
