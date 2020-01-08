"use strict";
const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');
//this not work, but sometimes good
//resason1:too low of obniz input Impedance ?
//resoson2:Is the sensor oscillating?
class S8120C extends AnalogTemperatureSensor {
    calc(voltage) {
        return (voltage - 1.474) / -0.0082 + 30; //Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
    }
    static info() {
        return {
            name: 'S8120C',
        };
    }
}
if (typeof module === 'object') {
    module.exports = S8120C;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvUzgxMjBDL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLHVCQUF1QixHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRXRFLG1DQUFtQztBQUNuQyw2Q0FBNkM7QUFDN0MscUNBQXFDO0FBRXJDLE1BQU0sTUFBTyxTQUFRLHVCQUF1QjtJQUMxQyxJQUFJLENBQUMsT0FBTztRQUNWLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsMkVBQTJFO0lBQ3RILENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztDQUN6QiIsImZpbGUiOiJwYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvUzgxMjBDL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3IgPSByZXF1aXJlKCcuLi9BbmFsb2dUZW1wZXJhdHVyZVNlbnNvcicpO1xuXG4vL3RoaXMgbm90IHdvcmssIGJ1dCBzb21ldGltZXMgZ29vZFxuLy9yZXNhc29uMTp0b28gbG93IG9mIG9ibml6IGlucHV0IEltcGVkYW5jZSA/XG4vL3Jlc29zb24yOklzIHRoZSBzZW5zb3Igb3NjaWxsYXRpbmc/XG5cbmNsYXNzIFM4MTIwQyBleHRlbmRzIEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yIHtcbiAgY2FsYyh2b2x0YWdlKSB7XG4gICAgcmV0dXJuICh2b2x0YWdlIC0gMS40NzQpIC8gLTAuMDA4MiArIDMwOyAvL1RlbXAoQ2Vsc2l1cykgPSAoKFtBRCBWb2x0YWdlXSAtIFtPdXRwdXQgVm9sdGFnZSBhdCAzMGRlZ10pL1tWL2RlZ10pICsgMzBcbiAgfVxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1M4MTIwQycsXG4gICAgfTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBTODEyMEM7XG59XG4iXX0=
