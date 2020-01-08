"use strict";
const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');
class LM61 extends AnalogTemperatureSensor {
    calc(voltage) {
        return Math.round((voltage - 0.6) / 0.01); //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    }
    static info() {
        return {
            name: 'LM61',
        };
    }
}
if (typeof module === 'object') {
    module.exports = LM61;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTE02MS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RSxNQUFNLElBQUssU0FBUSx1QkFBdUI7SUFDeEMsSUFBSSxDQUFDLE9BQU87UUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxzRkFBc0Y7SUFDbkksQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0NBQ3ZCIiwiZmlsZSI6InBhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL2FuYWxvZy9MTTYxL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3IgPSByZXF1aXJlKCcuLi9BbmFsb2dUZW1wZXJhdHVyZVNlbnNvcicpO1xuXG5jbGFzcyBMTTYxIGV4dGVuZHMgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3Ige1xuICBjYWxjKHZvbHRhZ2UpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgodm9sdGFnZSAtIDAuNikgLyAwLjAxKTsgLy9UZW1wKENlbHNpdXMpID0gKFtBRCBWb2x0YWdlXS1bVm9sdGFnZSBhdCAwIGRlZyhPZmZzZXQgdm9sdGFnZSldKS9bVGVtcCBjb2VmZmljaWVudF1cbiAgfVxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0xNNjEnLFxuICAgIH07XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gTE02MTtcbn1cbiJdfQ==
