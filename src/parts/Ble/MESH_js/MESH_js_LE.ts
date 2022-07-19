import { MESH_js } from '.';
import { MESHOutOfRangeError } from './MESH_js_Error';
export class MESH_js_LE extends MESH_js {
  public static readonly Pattern = { Blink: 1, Soft: 2 } as const;

  public parseLightupCommand(
    red: number,
    green: number,
    blue: number,
    total_time: number,
    cycle_on_time: number,
    cycle_off_time: number,
    pattern: number
  ): number[] {
    // Error Handle
    const _ColorMin = 0 as const;
    const _ColorMax = 127 as const;
    if (red < _ColorMin || _ColorMax < red) {
      throw new MESHOutOfRangeError('red', _ColorMin, _ColorMax);
    }
    if (green < _ColorMin || _ColorMax < green) {
      throw new MESHOutOfRangeError('green', _ColorMin, _ColorMax);
    }
    if (blue < _ColorMin || _ColorMax < blue) {
      throw new MESHOutOfRangeError('blue', _ColorMin, _ColorMax);
    }
    const _TimeMin = 0 as const;
    const _TimeMax = 65535 as const;
    if (total_time < _TimeMin || _TimeMax < total_time) {
      throw new MESHOutOfRangeError('time', _TimeMin, _TimeMax);
    }
    if (cycle_on_time < _TimeMin || _TimeMax < cycle_on_time) {
      throw new MESHOutOfRangeError('cycle_on', _TimeMin, _TimeMax);
    }
    if (cycle_off_time < _TimeMin || _TimeMax < cycle_off_time) {
      throw new MESHOutOfRangeError('cycle_off', _TimeMin, _TimeMax);
    }
    if (
      pattern !== MESH_js_LE.Pattern.Blink &&
      pattern !== MESH_js_LE.Pattern.Soft
    ) {
      throw new MESHOutOfRangeError('pattern');
    }

    // Generate Command
    const _MessageTypeID = 1 as const;
    const _EventTypeID = 0 as const;
    const _Fixed = 0 as const;
    const _Byte = 256 as const;
    const data: number[] = [
      _MessageTypeID,
      _EventTypeID,
      red,
      _Fixed,
      green,
      _Fixed,
      blue,
      total_time % _Byte,
      Math.floor(total_time / _Byte),
      cycle_on_time % _Byte,
      Math.floor(cycle_on_time / _Byte),
      cycle_off_time % _Byte,
      Math.floor(cycle_off_time / _Byte),
      pattern,
    ];
    data.push(this.checkSum(data));

    return data;
  }
}
