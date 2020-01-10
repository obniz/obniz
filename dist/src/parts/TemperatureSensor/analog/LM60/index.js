"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LM60 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "LM60",
        };
    }
    calc(voltage) {
        return Math.round(((voltage - 0.424) / 0.00625) * 10) / 10; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    }
}
exports.default = LM60;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTE02MC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlGQUFpRTtBQUVqRSxNQUFxQixJQUFLLFNBQVEsaUNBQXVCO0lBRWhELE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUM7SUFDSixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQVk7UUFDdEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsdUZBQXVGO0lBQ3JKLENBQUM7Q0FDRjtBQVhELHVCQVdDIiwiZmlsZSI6InNyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTE02MC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciBmcm9tIFwiLi4vQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTE02MCBleHRlbmRzIEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiTE02MFwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FsYyh2b2x0YWdlOiBhbnkpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoKHZvbHRhZ2UgLSAwLjQyNCkgLyAwLjAwNjI1KSAqIDEwKSAvIDEwOyAvLyBUZW1wKENlbHNpdXMpID0gKFtBRCBWb2x0YWdlXS1bVm9sdGFnZSBhdCAwIGRlZyhPZmZzZXQgdm9sdGFnZSldKS9bVGVtcCBjb2VmZmljaWVudF1cbiAgfVxufVxuIl19
