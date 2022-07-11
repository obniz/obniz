import { MESH_js } from '.';
export class MESH_js_AC extends MESH_js {
  /**
   * MessageTypeID
   * command header
   */
  private readonly MessageTypeID: number = 1;

  private accele = { x: -1, y: -1, z: -1 };
  private face = -1;
  private readonly DATA_LENGTH = 17;

  // event handler
  public onTapped: ((accele: MESH_js_AC['accele']) => void) | null = null;
  public onShaked: ((accele: MESH_js_AC['accele']) => void) | null = null;
  public onFlipped: ((accele: MESH_js_AC['accele']) => void) | null = null;
  public onDirection:
    | ((face: number, accele: MESH_js_AC['accele']) => void)
    | null = null;

  public notify(data: number[]): void {
    super.notify(data);
    this.updateAccele(data);
    if (data[0] !== 1) {
      return;
    }
    switch (data[1]) {
      case 0: // Tap
        if (typeof this.onTapped === 'function') {
          this.onTapped(this.accele);
        }
        break;
      case 1: // Shake
        if (typeof this.onShaked === 'function') {
          this.onShaked(this.accele);
        }
        break;
      case 2: // Flip
        if (typeof this.onFlipped === 'function') {
          this.onFlipped(this.accele);
        }
        break;
      case 3: // Direction
        if (typeof this.onDirection === 'function') {
          this.face = data[2];
          this.onDirection(this.face, this.accele);
        }
        break;
      default:
        break;
    }
  }

  public get getAccele(): MESH_js_AC['accele'] {
    return this.accele;
  }

  public get getFace(): number {
    return this.face;
  }

  /**
   * setMode
   *
   * @param type
   * @returns
   */
  //   public parseSetmodeCommand(
  //     event: number,
  //     mode: number,
  //     requestId = 0
  //   ): number[] {
  //     const HEADER: number[] = [this.MessageTypeID, 1, requestId];
  //     const data: number[] = HEADER.concat(event).concat(mode);
  //     data.push(this.checkSum(data));
  //     console.log('setMode: ' + data);
  //     return data;
  //   }

  private updateAccele(data: number[]): boolean {
    if (data.length !== this.DATA_LENGTH) {
      return false;
    }
    if (data[0] !== 1) {
      return false;
    }
    this.accele.x = this.complemnt(256 * data[5] + data[4]);
    this.accele.y = this.complemnt(256 * data[7] + data[6]);
    this.accele.z = this.complemnt(256 * data[9] + data[8]);
    return true;
  }

  private complemnt(val: number): number {
    return val - (val > 32767 ? 65536 : 0);
  }
}
