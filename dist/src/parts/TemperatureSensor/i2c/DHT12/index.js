"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts = require("../../../i2cParts");
class DHT12 extends i2cParts {
    static info() {
        return {
            name: "DHT12",
        };
    }
    i2cInfo() {
        return {
            address: 0x5c,
            clock: 100000,
            voltage: "3v",
        };
    }
    getAllDataWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.readWait(0x00, 5);
            const humidity = data[0] + data[1] * 0.1;
            let temperature = data[2] + (data[3] & 0x7f) * 0.1;
            if (data[3] & 0x80) {
                temperature *= -1;
            }
            const checksum = data[0] + data[1] + data[2] + data[3];
            if (checksum !== data[4]) {
                return null;
            }
            return {
                humidity,
                temperature,
            };
        });
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllDataWait()).temperature;
        });
    }
    getHumdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllDataWait()).humidity;
        });
    }
}
exports.default = DHT12;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvREhUMTIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFFBQVEsR0FBUSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUVuRCxNQUFNLEtBQU0sU0FBUSxRQUFRO0lBRW5CLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUM7SUFDSixDQUFDO0lBSU0sT0FBTztRQUNaLE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSTtZQUNiLEtBQUssRUFBRSxNQUFNO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVZLGNBQWM7O1lBQ3pCLE1BQU0sSUFBSSxHQUFRLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsTUFBTSxRQUFRLEdBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDOUMsSUFBSSxXQUFXLEdBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUN4RCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUU7Z0JBQ2xCLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNuQjtZQUVELE1BQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxPQUFPO2dCQUNMLFFBQVE7Z0JBQ1IsV0FBVzthQUNaLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFWSxXQUFXOztZQUN0QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFVLENBQUEsQ0FBQyxXQUFXLENBQUM7UUFDMUQsQ0FBQztLQUFBO0lBRVksV0FBVzs7WUFDdEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBVyxDQUFBLENBQUMsUUFBUSxDQUFDO1FBQ3hELENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsS0FBSyxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvREhUMTIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpMmNQYXJ0czogYW55ID0gcmVxdWlyZShcIi4uLy4uLy4uL2kyY1BhcnRzXCIpO1xuXG5jbGFzcyBESFQxMiBleHRlbmRzIGkyY1BhcnRzIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiREhUMTJcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJlYWRXYWl0OiBhbnk7XG5cbiAgcHVibGljIGkyY0luZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFkZHJlc3M6IDB4NWMsXG4gICAgICBjbG9jazogMTAwMDAwLFxuICAgICAgdm9sdGFnZTogXCIzdlwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0QWxsRGF0YVdhaXQoKSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gYXdhaXQgdGhpcy5yZWFkV2FpdCgweDAwLCA1KTtcbiAgICBjb25zdCBodW1pZGl0eTogYW55ID0gZGF0YVswXSArIGRhdGFbMV0gKiAwLjE7XG4gICAgbGV0IHRlbXBlcmF0dXJlOiBhbnkgPSBkYXRhWzJdICsgKGRhdGFbM10gJiAweDdmKSAqIDAuMTtcbiAgICBpZiAoZGF0YVszXSAmIDB4ODApIHtcbiAgICAgIHRlbXBlcmF0dXJlICo9IC0xO1xuICAgIH1cblxuICAgIGNvbnN0IGNoZWNrc3VtOiBhbnkgPSBkYXRhWzBdICsgZGF0YVsxXSArIGRhdGFbMl0gKyBkYXRhWzNdO1xuICAgIGlmIChjaGVja3N1bSAhPT0gZGF0YVs0XSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGh1bWlkaXR5LFxuICAgICAgdGVtcGVyYXR1cmUsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRUZW1wV2FpdCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0QWxsRGF0YVdhaXQoKSBhcyBhbnkpLnRlbXBlcmF0dXJlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEh1bWRXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxEYXRhV2FpdCgpIGFzIGFueSApLmh1bWlkaXR5O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERIVDEyO1xuIl19
