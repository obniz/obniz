"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsLe extends MeshJs_1.MeshJs {
    parseLightupCommand(red, green, blue, total_time, cycle_on_time, cycle_off_time, pattern) {
        // Error Handle
        const _ColorMin = 0;
        const _ColorMax = 127;
        if (red < _ColorMin || _ColorMax < red) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('red', _ColorMin, _ColorMax);
        }
        if (green < _ColorMin || _ColorMax < green) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('green', _ColorMin, _ColorMax);
        }
        if (blue < _ColorMin || _ColorMax < blue) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('blue', _ColorMin, _ColorMax);
        }
        const _TimeMin = 0;
        const _TimeMax = 65535;
        if (total_time < _TimeMin || _TimeMax < total_time) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('time', _TimeMin, _TimeMax);
        }
        if (cycle_on_time < _TimeMin || _TimeMax < cycle_on_time) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('cycle_on', _TimeMin, _TimeMax);
        }
        if (cycle_off_time < _TimeMin || _TimeMax < cycle_off_time) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('cycle_off', _TimeMin, _TimeMax);
        }
        if (pattern !== MeshJsLe.Pattern.Blink &&
            pattern !== MeshJsLe.Pattern.Soft) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('pattern');
        }
        // Generate Command
        const _MessageTypeID = 1;
        const _EventTypeID = 0;
        const _Fixed = 0;
        const _Byte = 256;
        const data = [
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
exports.MeshJsLe = MeshJsLe;
MeshJsLe.Pattern = { Blink: 1, Soft: 2 };
