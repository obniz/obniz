"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class MCP9700 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "MCP9700",
        };
    }
    calc(voltage) {
        return (voltage - 0.5) / 0.01; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    }
}
exports.default = MCP9700;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTUNQOTcwMC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlGQUFpRTtBQUVqRSxNQUFNLE9BQVEsU0FBUSxpQ0FBdUI7SUFFcEMsTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQVk7UUFDdEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyx1RUFBdUU7SUFDeEcsQ0FBQztDQUNGO0FBRUQsa0JBQWUsT0FBTyxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTUNQOTcwMC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciBmcm9tIFwiLi4vQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3JcIjtcblxuY2xhc3MgTUNQOTcwMCBleHRlbmRzIEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiTUNQOTcwMFwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FsYyh2b2x0YWdlOiBhbnkpIHtcbiAgICByZXR1cm4gKHZvbHRhZ2UgLSAwLjUpIC8gMC4wMTsgLy8gVGVtcChDZWxzaXVzKSA9IChbQUQgVm9sdGFnZV0tW1ZvbHRhZ2UgYXQgMCBkZWddKS9bVGVtcCBjb2VmZmljaWVudF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNQ1A5NzAwO1xuIl19
