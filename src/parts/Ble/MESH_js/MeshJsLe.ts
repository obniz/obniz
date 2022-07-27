import { MeshJs } from './MeshJs';
import { MeshJsInvalidValueError, MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsLe extends MeshJs {
  // Constant Values
  public static readonly PATTERN = {
    BLINK: 1 as const,
    SOFT: 2 as const,
  } as const;

  /**
   *
   * @param red
   * @param green
   * @param blue
   * @param totalTime
   * @param cycleOnTime
   * @param cycleOffTime
   * @param pattern
   * @returns
   */
  public parseLightupCommand(
    red: number,
    green: number,
    blue: number,
    totalTime: number,
    cycleOnTime: number,
    cycleOffTime: number,
    pattern: number
  ): number[] {
    // Error Handle
    const COLOR_MIN = 0 as const;
    const COLOR_MAX = 127 as const;
    if (red < COLOR_MIN || COLOR_MAX < red) {
      throw new MeshJsOutOfRangeError('red', COLOR_MIN, COLOR_MAX);
    }
    if (green < COLOR_MIN || COLOR_MAX < green) {
      throw new MeshJsOutOfRangeError('green', COLOR_MIN, COLOR_MAX);
    }
    if (blue < COLOR_MIN || COLOR_MAX < blue) {
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
    if (
      pattern !== MeshJsLe.PATTERN.BLINK &&
      pattern !== MeshJsLe.PATTERN.SOFT
    ) {
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
      red,
      FIXED,
      green,
      FIXED,
      blue,
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
