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
  private readonly MESSAGE_TYPE_ID_INDEX = 0 as const;
  private readonly EVENT_TYPE_ID_INDEX = 1 as const;
  private readonly VERSION_MAJOR_INDEX_ = 7 as const;
  private readonly VERSION_MINOR_INDEX_ = 8 as const;
  private readonly VERSION_RELEASE_INDEX_ = 9 as const;
  private readonly BATTERY_INDEX_ = 14 as const;
  private readonly MESSAGE_TYPE_ID_VALUE = 0 as const;
  private readonly EVENT_TYPE_ID_VALUE = 2 as const;
  private readonly INDICATE_LENGTH = 16 as const;

  private versionMajor_ = -1;
  private versionMinor_ = -1;
  private versionRelease_ = -1;
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
    if (data.length !== this.INDICATE_LENGTH) {
      return;
    }
    if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_VALUE) {
      return;
    }
    if (data[this.EVENT_TYPE_ID_INDEX] !== this.EVENT_TYPE_ID_VALUE) {
      return;
    }
    this.battery_ = data[this.BATTERY_INDEX_];
    this.versionMajor_ = data[this.VERSION_MAJOR_INDEX_];
    this.versionMinor_ = data[this.VERSION_MINOR_INDEX_];
    this.versionRelease_ = data[this.VERSION_RELEASE_INDEX_];
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

  /**
   * checkVersion
   *
   * @returns
   */
  public checkVersion() {
    const VERSION_MAJOR = 1;
    const VERSION_MINOR = 2;
    const VERSION_RELEASE = 5;
    if (VERSION_MAJOR < this.versionMajor_) {
      return true;
    }
    if (this.versionMajor_ < VERSION_MAJOR) {
      throw new MESHJsBlockVersionError(
        this.versionMajor_,
        this.versionMinor_,
        this.versionRelease_
      );
    }
    if (VERSION_MINOR < this.versionMinor_) {
      return true;
    }
    if (this.versionMinor_ < VERSION_MINOR) {
      throw new MESHJsBlockVersionError(
        this.versionMajor_,
        this.versionMinor_,
        this.versionRelease_
      );
    }
    if (VERSION_RELEASE < this.versionRelease_) {
      return true;
    }
    if (this.versionRelease_ < VERSION_RELEASE) {
      throw new MESHJsBlockVersionError(
        this.versionMajor_,
        this.versionMinor_,
        this.versionRelease_
      );
    }
    return true;
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
}
