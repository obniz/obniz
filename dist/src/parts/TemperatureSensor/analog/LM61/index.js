"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LM61 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "LM61",
        };
    }
    calc(voltage) {
        return Math.round((voltage - 0.6) / 0.01); // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    }
}
exports.default = LM61;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTE02MS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlGQUFpRTtBQUVqRSxNQUFNLElBQUssU0FBUSxpQ0FBdUI7SUFDakMsTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQztJQUNKLENBQUM7SUFFTSxJQUFJLENBQUMsT0FBWTtRQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyx1RkFBdUY7SUFDcEksQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTE02MS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciBmcm9tIFwiLi4vQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3JcIjtcblxuY2xhc3MgTE02MSBleHRlbmRzIEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yIHtcbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIkxNNjFcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNhbGModm9sdGFnZTogYW55KSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoKHZvbHRhZ2UgLSAwLjYpIC8gMC4wMSk7IC8vIFRlbXAoQ2Vsc2l1cykgPSAoW0FEIFZvbHRhZ2VdLVtWb2x0YWdlIGF0IDAgZGVnKE9mZnNldCB2b2x0YWdlKV0pL1tUZW1wIGNvZWZmaWNpZW50XVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExNNjE7XG4iXX0=
