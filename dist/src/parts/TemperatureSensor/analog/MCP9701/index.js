"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class MCP9701 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "MCP9701",
        };
    }
    calc(voltage) {
        return (voltage - 0.4) / 0.0195; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    }
}
exports.default = MCP9701;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTUNQOTcwMS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlGQUFpRTtBQUVqRSxNQUFNLE9BQVEsU0FBUSxpQ0FBdUI7SUFDcEMsTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQVk7UUFDdEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyx1RUFBdUU7SUFDMUcsQ0FBQztDQUNGO0FBRUQsa0JBQWUsT0FBTyxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTUNQOTcwMS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciBmcm9tIFwiLi4vQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3JcIjtcblxuY2xhc3MgTUNQOTcwMSBleHRlbmRzIEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yIHtcbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIk1DUDk3MDFcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNhbGModm9sdGFnZTogYW55KSB7XG4gICAgcmV0dXJuICh2b2x0YWdlIC0gMC40KSAvIDAuMDE5NTsgLy8gVGVtcChDZWxzaXVzKSA9IChbQUQgVm9sdGFnZV0tW1ZvbHRhZ2UgYXQgMCBkZWddKS9bVGVtcCBjb2VmZmljaWVudF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNQ1A5NzAxO1xuIl19
