export class MESH_parse {
  private _pattern = { BLICK: 1, FUWA: 2 } as const;

  public parseFeature() {
    return [0, 2, 1, 3];
  }

  public parseLightup(
    red: number,
    green: number,
    blue: number,
    time: number,
    cycle_on: number,
    cycle_off: number,
    pattern: number
  ) {
    if (red < 0 || 255 < red) {
      this.errorOutOfRange('red (' + red + ') must be 0 ~ 255.');
      return [];
    }
    if (green < 0 || 255 < green) {
      this.errorOutOfRange('green (' + green + ') must be 0 ~ 255.');
      return [];
    }
    if (blue < 0 || 255 < blue) {
      this.errorOutOfRange('blue (' + blue + ') must be 0 ~ 255.');
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
      time / 256,
      cycle_on % 256,
      cycle_on / 256,
      cycle_off % 256,
      cycle_off / 256,
      pattern,
    ];
    data.push(this.checkSum(data));
    return data;
  }

  private checkSum(command: any[]) {
    let sum = 0;
    command.forEach((val) => {
      sum += val;
    });
    return sum % 256;
  }

  private errorMessage(message: string) {
    console.log('[Error] Can not parse; ' + message);
  }

  private errorOutOfRange(message: string) {
    console.log(this.errorMessage('out of range ' + message));
  }
}
