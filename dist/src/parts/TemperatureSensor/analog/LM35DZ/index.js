"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LM35DZ extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "LM35DZ",
        };
    }
    calc(voltage) {
        return voltage * 100; // Temp(Celsius) = [AD Voltage] * 100l;
    }
}
exports.default = LM35DZ;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTE0zNURaL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUZBQWlFO0FBRWpFLE1BQU0sTUFBTyxTQUFRLGlDQUF1QjtJQUNuQyxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUVNLElBQUksQ0FBQyxPQUFZO1FBQ3RCLE9BQU8sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLHVDQUF1QztJQUMvRCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxNQUFNLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL2FuYWxvZy9MTTM1RFovaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3IgZnJvbSBcIi4uL0FuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yXCI7XG5cbmNsYXNzIExNMzVEWiBleHRlbmRzIEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yIHtcbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIkxNMzVEWlwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FsYyh2b2x0YWdlOiBhbnkpIHtcbiAgICByZXR1cm4gdm9sdGFnZSAqIDEwMDsgLy8gVGVtcChDZWxzaXVzKSA9IFtBRCBWb2x0YWdlXSAqIDEwMGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTE0zNURaO1xuIl19
