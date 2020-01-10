"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LMT87 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "LMT87",
        };
    }
    calc(voltage) {
        return (voltage * 1000 - 2365) / -13.6 + 20; // 20-50dc;
    }
}
exports.default = LMT87;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvTE1UODcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5RkFBaUU7QUFFakUsTUFBTSxLQUFNLFNBQVEsaUNBQXVCO0lBQ2xDLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUM7SUFDSixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQVk7UUFDdEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsV0FBVztJQUMxRCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxLQUFLLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL2FuYWxvZy9MTVQ4Ny9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciBmcm9tIFwiLi4vQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3JcIjtcblxuY2xhc3MgTE1UODcgZXh0ZW5kcyBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvciB7XG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJMTVQ4N1wiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FsYyh2b2x0YWdlOiBhbnkpIHtcbiAgICByZXR1cm4gKHZvbHRhZ2UgKiAxMDAwIC0gMjM2NSkgLyAtMTMuNiArIDIwOyAvLyAyMC01MGRjO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExNVDg3O1xuIl19
