export class MeshJs {
  public readonly UUIDS = {
    serviceId: '72C90001-57A9-4D40-B746-534E22EC9F9E',
    characteristics: {
      Indicate: '72c90005-57a9-4d40-b746-534e22ec9f9e',
      Notify: '72c90003-57a9-4d40-b746-534e22ec9f9e',
      Write: '72c90004-57a9-4d40-b746-534e22ec9f9e',
      WriteWOResponse: '72c90002-57a9-4d40-b746-534e22ec9f9e',
    },
  } as const;

  // event handler
  public onBattery: ((battery: number) => void) | null = null;
  public onStatusButtonPressed: (() => void) | null = null;

  private readonly _feature_command: number[] = [0, 2, 1, 3];
  private _battery = -1;

  public get feature(): number[] {
    return this._feature_command;
  }

  public get battery(): number {
    return this._battery;
  }

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
    this._battery = data[14];
  }

  public notify(data: number[]): void {
    this._updateBattery(data);
    this._updateStatusButton(data);
  }

  public printData(message: string): void {
    console.log('bat: ' + this._battery + ', ' + message);
  }

  protected checkSum(command: number[]): number {
    let sum = 0;
    command.forEach((val) => {
      sum += val;
    });
    return sum % 256;
  }

  protected errorMessage(message: string): void {
    console.log('[Error] Can not parse; ' + message);
  }

  protected errorOutOfRange(message: string): void {
    console.log(this.errorMessage('out of range ' + message));
  }

  private _updateBattery(data: number[]): boolean {
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
    this._battery = data[2];
    if (typeof this.onBattery !== 'function') {
      return false;
    }
    this.onBattery(this._battery);
    return true;
  }

  private _updateStatusButton(data: number[]): boolean {
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
