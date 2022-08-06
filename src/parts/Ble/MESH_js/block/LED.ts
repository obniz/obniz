import { Base } from './Base';
import { MESHJsInvalidValueError } from '../util/Error';
export class LED extends Base {
  // Constant Values
  public static readonly PATTERN = {
    BLINK: 1 as const,
    FIREFLY: 2 as const,
  } as const;

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
    const COLOR_MIN = 0 as const;
    const COLOR_MAX = 127 as const;
    this.checkRange(colors.red, COLOR_MIN, COLOR_MAX, 'colors.red');
    this.checkRange(colors.green, COLOR_MIN, COLOR_MAX, 'colors.green');
    this.checkRange(colors.blue, COLOR_MIN, COLOR_MAX, 'colors.blue');
    const TIME_MIN = 0 as const;
    const TIME_MAX = 65535 as const;
    this.checkRange(totalTime, TIME_MIN, TIME_MAX, 'totalTime');
    this.checkRange(cycleOnTime, TIME_MIN, TIME_MAX, 'cycleOnTime');
    this.checkRange(cycleOffTime, TIME_MIN, TIME_MAX, 'cycleOffTIme');
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
