import { MESHJsBlockVersionError, MESHJsOutOfRangeError } from '../util/Error';

export class Base {
  // Event Handler
  public onBatteryLevel: ((battery: number) => void) | null = null;
  public onStatusButtonPressed: (() => void) | null = null;

  // Constant Values
  public readonly UUIDS = {
    SERVICE_ID: '72c90001-57a9-4d40-b746-534e22ec9f9e' as const,
    CHARACTERISTICS: {
      INDICATE: '72c90005-57a9-4d40-b746-534e22ec9f9e' as const,
      NOTIFY: '72c90003-57a9-4d40-b746-534e22ec9f9e' as const,
      WRITE: '72c90004-57a9-4d40-b746-534e22ec9f9e' as const,
      WRITE_WO_RESPONSE: '72c90002-57a9-4d40-b746-534e22ec9f9e' as const,
    } as const,
  } as const;
  private readonly FEATURE_COMMAND_ = [
    0 as const,
    2 as const,
    1 as const,
    3 as const,
  ];

  private battery_ = -1;

  public get featureCommand(): number[] {
    return this.FEATURE_COMMAND_;
  }

  public get battery(): number {
    return this.battery_;
  }

  /**
   * indicate
   *
   * @param data
   * @returns
   */
  public indicate(data: number[]): void {
    if (data.length !== 16) {
      return;
    }
    if (data[0] !== 0) {
      return;
    }
    if (data[1] !== 2) {
      return;
    }
    this.battery_ = data[14];
    this.checkVersion_(data[7], data[8], data[9]);
  }

  /**
   * notify
   *
   * @param data
   */
  public notify(data: number[]): void {
    this.updateBattery_(data);
    this.updateStatusButton_(data);
  }

  protected checkSum(command: number[]): number {
    let sum = 0;
    command.forEach((val) => {
      sum += val;
    });
    const BYTE = 256 as const;
    return sum % BYTE;
  }

  protected checkRange(
    target: number,
    min: number,
    max: number,
    name: string
  ): boolean {
    if (target < min || max < target) {
      throw new MESHJsOutOfRangeError(name, min, max);
    }
    return true;
  }

  protected complemnt(val: number): number {
    const TWO_BYTE_PLUS1 = 65536 as const; // 0x10000
    const TWO_BYTE_HALF = Math.floor(TWO_BYTE_PLUS1 / 2) - 1;
    return val - (val > TWO_BYTE_HALF ? TWO_BYTE_PLUS1 : 0);
  }

  protected invcomplemnt(val: number): number {
    const TWO_BYTE_PLUS1 = 65536 as const; // 0x10000
    return val + (val < 0 ? TWO_BYTE_PLUS1 : 0);
  }

  private updateBattery_(data: number[]): boolean {
    if (data.length !== 4) {
      return false;
    }
    if (data[0] !== 0) {
      return false;
    }
    if (data[1] !== 0) {
      return false;
    }
    // if (data[2] === this.battery) {
    //   return;
    // }
    this.battery_ = data[2];
    if (typeof this.onBatteryLevel !== 'function') {
      return false;
    }
    this.onBatteryLevel(this.battery_);
    return true;
  }

  private updateStatusButton_(data: number[]): boolean {
    if (data.length !== 4) {
      return false;
    }
    if (data[0] !== 0) {
      return false;
    }
    if (data[1] !== 1) {
      return false;
    }
    if (data[2] !== 0) {
      return false;
    }
    if (typeof this.onStatusButtonPressed !== 'function') {
      return false;
    }
    this.onStatusButtonPressed();
    return true;
  }

  private checkVersion_(major: number, minor: number, release: number) {
    const VERSION_MAJOR = 1;
    const VERSION_MINOR = 2;
    const VERSION_RELEASE = 5;
    if (VERSION_MAJOR < major) {
      return;
    }
    if (major < VERSION_MAJOR) {
      throw new MESHJsBlockVersionError(major, minor, release);
    }
    if (VERSION_MINOR < minor) {
      return;
    }
    if (minor < VERSION_MINOR) {
      throw new MESHJsBlockVersionError(major, minor, release);
    }
    if (VERSION_RELEASE < release) {
      return;
    }
    if (release < VERSION_RELEASE) {
      throw new MESHJsBlockVersionError(major, minor, release);
    }
  }
}
