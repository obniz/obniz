export class MESH_js {
  private battery = -1;

  public onBattery: ((battery: number) => void) | null = null;
  public onStatusButtonPressed: (() => void) | null = null;

  public feature() {
    return [0, 2, 1, 3];
  }

  public getBattery(): number {
    return this.battery;
  }

  public notify(data: number[]) {
    this.updateBattery(data);
    this.updateStatusButton(data);
  }

  public printData(message: string) {
    console.log('bat: ' + this.battery + ', ' + message);
  }

  protected checkSum(command: number[]) {
    let sum = 0;
    command.forEach((val) => {
      sum += val;
    });
    return sum % 256;
  }

  protected errorMessage(message: string) {
    console.log('[Error] Can not parse; ' + message);
  }

  protected errorOutOfRange(message: string) {
    console.log(this.errorMessage('out of range ' + message));
  }

  private updateBattery(data: number[]) {
    if (data.length !== 4) {
      return;
    }
    if (data[0] !== 0) {
      return;
    }
    if (data[1] !== 0) {
      return;
    }
    // if (data[2] === this.battery) {
    //   return;
    // }
    this.battery = data[2];
    if (typeof this.onBattery !== 'function') {
      return;
    }
    this.onBattery(this.battery);
  }

  private updateStatusButton(data: number[]) {
    if (data.length !== 4) {
      return;
    }
    if (data[0] !== 0) {
      return;
    }
    if (data[1] !== 1) {
      return;
    }
    if (data[2] !== 0) {
      return;
    }
    if (typeof this.onStatusButtonPressed !== 'function') {
      return;
    }
    this.onStatusButtonPressed();
  }
}

export class MESH_BU extends MESH_js {
  // public static type = { single: 1, long: 2, double: 3 } as const;
  private type = { single: 1, long: 2, double: 3 } as const;
  public onSinglePressed: (() => void) | null = null;
  public onLongPressed: (() => void) | null = null;
  public onDoublePressed: (() => void) | null = null;
  // public onButton: ((resp: number) => void) | null = null;

  public notify(data: number[]) {
    super.notify(data);
    if (data.length !== 4) {
      return;
    }
    if (data[0] !== 1) {
      return;
    }
    if (data[1] !== 0) {
      return;
    }
    // if (typeof this.onButton !== 'function') {
    //   return;
    // }
    // this.onButton(data[2]);
    switch (data[2]) {
      case this.type.single:
        if (typeof this.onSinglePressed === 'function') {
          this.onSinglePressed();
        }
        break;
      case this.type.long:
        if (typeof this.onLongPressed === 'function') {
          this.onLongPressed();
        }
        break;
      case this.type.double:
        if (typeof this.onDoublePressed === 'function') {
          this.onDoublePressed();
        }
        break;
      default:
        break;
    }
  }
}

export class MESH_LE extends MESH_js {
  private _pattern = { BLICK: 1, FUWA: 2 } as const;

  public notify(data: number[]) {
    super.notify(data);
  }

  public lightup(
    red: number,
    green: number,
    blue: number,
    time: number,
    cycle_on: number,
    cycle_off: number,
    pattern: number
  ) {
    if (red < 0 || 127 < red) {
      this.errorOutOfRange('red (' + red + ') must be 0 ~ 127.');
      return [];
    }
    if (green < 0 || 127 < green) {
      this.errorOutOfRange('green (' + green + ') must be 0 ~ 127.');
      return [];
    }
    if (blue < 0 || 127 < blue) {
      this.errorOutOfRange('blue (' + blue + ') must be 0 ~ 127.');
      return [];
    }
    if (time < 0 || 65535 < time) {
      this.errorOutOfRange('time (' + time + ') must be 0 ~ 65,535.');
      return [];
    }
    if (cycle_on < 0 || 65535 < cycle_on) {
      this.errorOutOfRange('cycle_on (' + cycle_on + ') must be 0 ~ 65,535.');
      return [];
    }
    if (cycle_off < 0 || 65535 < cycle_off) {
      this.errorOutOfRange('cycle_off (' + cycle_off + ') must be 0 ~ 65,535.');
      return [];
    }
    const data: number[] = [
      1,
      0,
      red,
      0,
      green,
      0,
      blue,
      time % 256,
      Math.floor(time / 256),
      cycle_on % 256,
      Math.floor(cycle_on / 256),
      cycle_off % 256,
      Math.floor(cycle_off / 256),
      pattern,
    ];
    data.push(this.checkSum(data));
    return data;
  }
}

export class MESH_AC extends MESH_js {
  private accele = { x: -1, y: -1, z: -1 };
  private face = -1;

  public onTapped: ((accele: MESH_AC['accele']) => void) | null = null;
  public onShaked: ((accele: MESH_AC['accele']) => void) | null = null;
  public onFlipped: ((accele: MESH_AC['accele']) => void) | null = null;
  public onDirection:
    | ((face: number, accele: MESH_AC['accele']) => void)
    | null = null;

  public notify(data: number[]) {
    super.notify(data);
    this.updateFace(data);
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
          this.onDirection(this.face, this.accele);
        }
        break;
      default:
        break;
    }
  }

  public getAccele() {
    return this.accele;
  }

  public getFace(): number {
    return this.face;
  }

  public printData() {
    super.printData(
      'face: ' +
        this.face +
        ', accele {x: ' +
        this.accele.x +
        ',y: ' +
        this.accele.y +
        ',z: ' +
        this.accele.z +
        '}'
    );
  }

  private updateFace(data: number[]) {
    if (data.length !== 17) {
      return;
    }
    if (data[0] !== 1) {
      return;
    }
    if (data[1] !== 3) {
      return;
    }
    this.face = data[2];
  }

  private updateAccele(data: number[]) {
    if (data.length !== 17) {
      return;
    }
    if (data[0] !== 1) {
      return;
    }
    this.accele.x = 256 * data[5] + data[4];
    this.accele.y = 256 * data[7] + data[6];
    this.accele.z = 256 * data[9] + data[8];
  }
}

export class MESH_PA extends MESH_js {
  public notify(data: number[]) {
    super.notify(data);
  }
}

export class MESH_TH extends MESH_js {
  public notify(data: number[]) {
    super.notify(data);
  }

  public setMode(
    temperature_upper: number,
    temperature_bottom: number,
    temperature_condition: number,
    humidity_upper: number,
    humidity_bottom: number,
    humidity_condision: number,
    type: number
  ) {
    const data: number[] = [
      1,
      0,
      1,
      (100 * temperature_upper) % 256,
      Math.floor((100 * temperature_upper) / 256),
      (100 * temperature_bottom) % 256,
      Math.floor((100 * temperature_bottom) / 256),
      (100 * humidity_upper) % 256,
      Math.floor((100 * humidity_upper) / 256),
      (100 * humidity_bottom) % 256,
      Math.floor((100 * humidity_bottom) / 256),
      temperature_condition,
      humidity_condision,
      type,
    ];
    data.push(this.checkSum(data));
    return data;
  }
}

export class MESH_MD extends MESH_js {
  public notify(data: number[]) {
    super.notify(data);
    if (data[0] !== 1) {
      return;
    }
    if (data[1] !== 0) {
      return;
    }
  }

  public setMode(
    requestid: number,
    mode: number,
    time1: number,
    time2: number
  ) {
    const data: number[] = [
      1,
      0,
      requestid,
      mode,
      time1 % 256,
      Math.floor(time1 / 256),
      time2 % 256,
      Math.floor(time2 / 256),
    ];
    data.push(this.checkSum(data));
    console.log('send data:' + data);
    return data;
  }
}
