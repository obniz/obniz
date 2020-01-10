"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
// sensor resopnse not found
class S8100B extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "S8100B",
        };
    }
    calc(voltage) {
        return 30 + (1.508 - voltage) / -0.08; // Temp(Celsius) =
    }
}
exports.default = S8100B;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvUzgxMDBCL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUZBQWlFO0FBRWpFLDRCQUE0QjtBQUU1QixNQUFNLE1BQU8sU0FBUSxpQ0FBdUI7SUFDbkMsTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFFTSxJQUFJLENBQUMsT0FBWTtRQUN0QixPQUFPLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQjtJQUMzRCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxNQUFNLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL2FuYWxvZy9TODEwMEIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3IgZnJvbSBcIi4uL0FuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yXCI7XG5cbi8vIHNlbnNvciByZXNvcG5zZSBub3QgZm91bmRcblxuY2xhc3MgUzgxMDBCIGV4dGVuZHMgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3Ige1xuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiUzgxMDBCXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBjYWxjKHZvbHRhZ2U6IGFueSkge1xuICAgIHJldHVybiAzMCArICgxLjUwOCAtIHZvbHRhZ2UpIC8gLTAuMDg7IC8vIFRlbXAoQ2Vsc2l1cykgPVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFM4MTAwQjtcbiJdfQ==
