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
const i2cParts = require('../../../i2cParts');
class DHT12 extends i2cParts {
    static info() {
        return {
            name: 'DHT12',
        };
    }
    i2cInfo() {
        return {
            address: 0x5c,
            clock: 100000,
            voltage: '3v',
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
if (typeof module === 'object') {
    module.exports = DHT12;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvREhUMTIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRTlDLE1BQU0sS0FBTSxTQUFRLFFBQVE7SUFDMUIsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUk7WUFDYixLQUFLLEVBQUUsTUFBTTtZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFFSyxjQUFjOztZQUNsQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ3pDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDbkQsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFO2dCQUNsQixXQUFXLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDbkI7WUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsT0FBTztnQkFDTCxRQUFRO2dCQUNSLFdBQVc7YUFDWixDQUFDO1FBQ0osQ0FBQztLQUFBO0lBRUssV0FBVzs7WUFDZixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDbkQsQ0FBQztLQUFBO0lBRUssV0FBVzs7WUFDZixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDaEQsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztDQUN4QiIsImZpbGUiOiJwYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvREhUMTIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpMmNQYXJ0cyA9IHJlcXVpcmUoJy4uLy4uLy4uL2kyY1BhcnRzJyk7XG5cbmNsYXNzIERIVDEyIGV4dGVuZHMgaTJjUGFydHMge1xuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0RIVDEyJyxcbiAgICB9O1xuICB9XG5cbiAgaTJjSW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWRkcmVzczogMHg1YyxcbiAgICAgIGNsb2NrOiAxMDAwMDAsXG4gICAgICB2b2x0YWdlOiAnM3YnLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBnZXRBbGxEYXRhV2FpdCgpIHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5yZWFkV2FpdCgweDAwLCA1KTtcbiAgICBjb25zdCBodW1pZGl0eSA9IGRhdGFbMF0gKyBkYXRhWzFdICogMC4xO1xuICAgIGxldCB0ZW1wZXJhdHVyZSA9IGRhdGFbMl0gKyAoZGF0YVszXSAmIDB4N2YpICogMC4xO1xuICAgIGlmIChkYXRhWzNdICYgMHg4MCkge1xuICAgICAgdGVtcGVyYXR1cmUgKj0gLTE7XG4gICAgfVxuXG4gICAgY29uc3QgY2hlY2tzdW0gPSBkYXRhWzBdICsgZGF0YVsxXSArIGRhdGFbMl0gKyBkYXRhWzNdO1xuICAgIGlmIChjaGVja3N1bSAhPT0gZGF0YVs0XSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGh1bWlkaXR5LFxuICAgICAgdGVtcGVyYXR1cmUsXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIGdldFRlbXBXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxEYXRhV2FpdCgpKS50ZW1wZXJhdHVyZTtcbiAgfVxuXG4gIGFzeW5jIGdldEh1bWRXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxEYXRhV2FpdCgpKS5odW1pZGl0eTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBESFQxMjtcbn1cbiJdfQ==
