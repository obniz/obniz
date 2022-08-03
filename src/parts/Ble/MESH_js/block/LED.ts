import { Base } from './Base';
import { MeshJsInvalidValueError, MeshJsOutOfRangeError } from '../MeshJsError';
export class LED extends Base {
  // Constant Values
  public static readonly PATTERN = {
    BLINK: 1 as const,
    FIREFLY: 2 as const,
  } as const;

  protected colors = { red: 0, green: 0, blue: 0 };

  /**
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
    if (colors.red < COLOR_MIN || COLOR_MAX < colors.red) {
      throw new MeshJsOutOfRangeError('red', COLOR_MIN, COLOR_MAX);
    }
    if (colors.green < COLOR_MIN || COLOR_MAX < colors.green) {
      throw new MeshJsOutOfRangeError('green', COLOR_MIN, COLOR_MAX);
    }
    if (colors.blue < COLOR_MIN || COLOR_MAX < colors.blue) {
      throw new MeshJsOutOfRangeError('blue', COLOR_MIN, COLOR_MAX);
    }
    const TIME_MIN = 0 as const;
    const TIME_MAX = 65535 as const;
    if (totalTime < TIME_MIN || TIME_MAX < totalTime) {
      throw new MeshJsOutOfRangeError('time', TIME_MIN, TIME_MAX);
    }
    if (cycleOnTime < TIME_MIN || TIME_MAX < cycleOnTime) {
      throw new MeshJsOutOfRangeError('cycle_on', TIME_MIN, TIME_MAX);
    }
    if (cycleOffTime < TIME_MIN || TIME_MAX < cycleOffTime) {
      throw new MeshJsOutOfRangeError('cycle_off', TIME_MIN, TIME_MAX);
    }
    if (pattern !== LED.PATTERN.BLINK && pattern !== LED.PATTERN.FIREFLY) {
      throw new MeshJsInvalidValueError('pattern');
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
