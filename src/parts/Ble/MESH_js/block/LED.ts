import { Base } from './Base';
import { MESHJsInvalidValueError } from '../util/Error';

export class LED extends Base {
  // Constant Values
  public static readonly PATTERN = {
    BLINK: 1 as const,
    FIREFLY: 2 as const,
  } as const;
  private readonly COLOR_MIN_ = 0 as const;
  private readonly COLOR_MAX_ = 127 as const;
  private readonly TIME_MIN_ = 0 as const;
  private readonly TIME_MAX_ = 65535 as const;

  protected colors = { red: 0, green: 0, blue: 0 };

  /**
   * parseLedCommand
   *
   * @param colors
   * @param totalTime
   * @param cycleOnTime
   * @param cycleOffTime
   * @param pattern
   * @returns
   */
  public parseLedCommand(
    colors: LED['colors'],
    totalTime: number,
    cycleOnTime: number,
    cycleOffTime: number,
    pattern: number
  ): number[] {
    // Error Handle
    this.checkRange(colors.red, this.COLOR_MIN_, this.COLOR_MAX_, 'colors.red');
    this.checkRange(
      colors.green,
      this.COLOR_MIN_,
      this.COLOR_MAX_,
      'colors.green'
    );
    this.checkRange(
      colors.blue,
      this.COLOR_MIN_,
      this.COLOR_MAX_,
      'colors.blue'
    );
    this.checkRange(totalTime, this.TIME_MIN_, this.TIME_MAX_, 'totalTime');
    this.checkRange(cycleOnTime, this.TIME_MIN_, this.TIME_MAX_, 'cycleOnTime');
    this.checkRange(
      cycleOffTime,
      this.TIME_MIN_,
      this.TIME_MAX_,
      'cycleOffTIme'
    );
    if (pattern !== LED.PATTERN.BLINK && pattern !== LED.PATTERN.FIREFLY) {
      throw new MESHJsInvalidValueError('pattern');
    }

    // Generate Command
    const MESSAGE_TYPE_ID = 1 as const;
    const EVENT_TYPE_ID = 0 as const;
    const FIXED = 0 as const;
    const BYTE = 256 as const;
    const data: number[] = [
      MESSAGE_TYPE_ID,
      EVENT_TYPE_ID,
      colors.red,
      FIXED,
      colors.green,
      FIXED,
      colors.blue,
      totalTime % BYTE,
      Math.floor(totalTime / BYTE),
      cycleOnTime % BYTE,
      Math.floor(cycleOnTime / BYTE),
      cycleOffTime % BYTE,
      Math.floor(cycleOffTime / BYTE),
      pattern,
    ];
    data.push(this.checkSum(data));

    return data;
  }
}
