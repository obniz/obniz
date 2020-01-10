"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
// this not work, but sometimes good
// resason1:too low of obniz input Impedance ?
// resoson2:Is the sensor oscillating?
class S8120C extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "S8120C",
        };
    }
    calc(voltage) {
        return (voltage - 1.474) / -0.0082 + 30; // Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
    }
}
exports.default = S8120C;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvUzgxMjBDL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUZBQWlFO0FBRWpFLG9DQUFvQztBQUNwQyw4Q0FBOEM7QUFDOUMsc0NBQXNDO0FBRXRDLE1BQU0sTUFBTyxTQUFRLGlDQUF1QjtJQUNuQyxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUVNLElBQUksQ0FBQyxPQUFZO1FBQ3RCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsNEVBQTRFO0lBQ3ZILENBQUM7Q0FDRjtBQUVELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvYW5hbG9nL1M4MTIwQy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciBmcm9tIFwiLi4vQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3JcIjtcblxuLy8gdGhpcyBub3Qgd29yaywgYnV0IHNvbWV0aW1lcyBnb29kXG4vLyByZXNhc29uMTp0b28gbG93IG9mIG9ibml6IGlucHV0IEltcGVkYW5jZSA/XG4vLyByZXNvc29uMjpJcyB0aGUgc2Vuc29yIG9zY2lsbGF0aW5nP1xuXG5jbGFzcyBTODEyMEMgZXh0ZW5kcyBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciB7XG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJTODEyMENcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNhbGModm9sdGFnZTogYW55KSB7XG4gICAgcmV0dXJuICh2b2x0YWdlIC0gMS40NzQpIC8gLTAuMDA4MiArIDMwOyAvLyBUZW1wKENlbHNpdXMpID0gKChbQUQgVm9sdGFnZV0gLSBbT3V0cHV0IFZvbHRhZ2UgYXQgMzBkZWddKS9bVi9kZWddKSArIDMwXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUzgxMjBDO1xuIl19
