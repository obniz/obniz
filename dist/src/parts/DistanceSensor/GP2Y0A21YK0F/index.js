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
class GP2Y0A21YK0F {
    constructor() {
        this.keys = ["vcc", "gnd", "signal"];
        this.requiredKeys = ["signal"];
        this.displayIoNames = {
            vcc: "vcc",
            gnd: "gnd",
            signal: "signal",
        };
        this._unit = "mm";
    }
    static info() {
        return {
            name: "GP2Y0A21YK0F",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.io_signal = obniz.getIO(this.params.signal);
        this.io_signal.end();
        this.ad_signal = obniz.getAD(this.params.signal);
    }
    start(callback) {
        this.ad_signal.start((val) => {
            const distance = this._volt2distance(val);
            if (typeof callback === "function") {
                callback(distance);
            }
        });
    }
    _volt2distance(val) {
        if (val <= 0) {
            val = 0.001;
        }
        let distance = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
        if (this._unit === "mm") {
            distance = Math.floor(distance * 10) / 10;
        }
        else {
            distance *= 0.0393701;
            distance = Math.floor(distance * 1000) / 1000;
        }
        return distance;
    }
    getWait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const val = yield this.ad_signal.getWait();
            const distance = this._volt2distance(val);
            resolve(distance);
        }));
    }
    unit(unit) {
        if (unit === "mm") {
            this._unit = "mm";
        }
        else if (unit === "inch") {
            this._unit = "inch";
        }
        else {
            throw new Error("unknown unit " + unit);
        }
    }
}
exports.default = GP2Y0A21YK0F;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXN0YW5jZVNlbnNvci9HUDJZMEEyMVlLMEYvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFlBQVk7SUFpQmhCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLE1BQU0sRUFBRSxRQUFRO1NBQ2pCLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBekJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsY0FBYztTQUNyQixDQUFDO0lBQ0osQ0FBQztJQXVCTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFhO1FBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDaEMsTUFBTSxRQUFRLEdBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFDbEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3BCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sY0FBYyxDQUFDLEdBQVE7UUFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ1osR0FBRyxHQUFHLEtBQUssQ0FBQztTQUNiO1FBQ0QsSUFBSSxRQUFRLEdBQVEsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzNFLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDdkIsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUMzQzthQUFNO1lBQ0wsUUFBUSxJQUFJLFNBQVMsQ0FBQztZQUN0QixRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQy9DO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVNLE9BQU87UUFDWixPQUFPLElBQUksT0FBTyxDQUFDLENBQU8sT0FBTyxFQUFFLEVBQUU7WUFDbkMsTUFBTSxHQUFHLEdBQVEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2hELE1BQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sSUFBSSxDQUFDLElBQVM7UUFDbkIsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25CO2FBQU0sSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1NBQ3JCO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLFlBQVksQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvRGlzdGFuY2VTZW5zb3IvR1AyWTBBMjFZSzBGL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgR1AyWTBBMjFZSzBGIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiR1AyWTBBMjFZSzBGXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZEtleXM6IGFueTtcbiAgcHVibGljIGRpc3BsYXlJb05hbWVzOiBhbnk7XG4gIHB1YmxpYyBfdW5pdDogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgaW9fc2lnbmFsOiBhbnk7XG4gIHB1YmxpYyBhZF9zaWduYWw6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJ2Y2NcIiwgXCJnbmRcIiwgXCJzaWduYWxcIl07XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbXCJzaWduYWxcIl07XG5cbiAgICB0aGlzLmRpc3BsYXlJb05hbWVzID0ge1xuICAgICAgdmNjOiBcInZjY1wiLFxuICAgICAgZ25kOiBcImduZFwiLFxuICAgICAgc2lnbmFsOiBcInNpZ25hbFwiLFxuICAgIH07XG4gICAgdGhpcy5fdW5pdCA9IFwibW1cIjtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuXG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCBcIjV2XCIpO1xuICAgIHRoaXMuaW9fc2lnbmFsID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuc2lnbmFsKTtcbiAgICB0aGlzLmlvX3NpZ25hbC5lbmQoKTtcbiAgICB0aGlzLmFkX3NpZ25hbCA9IG9ibml6LmdldEFEKHRoaXMucGFyYW1zLnNpZ25hbCk7XG4gIH1cblxuICBwdWJsaWMgc3RhcnQoY2FsbGJhY2s6IGFueSkge1xuICAgIHRoaXMuYWRfc2lnbmFsLnN0YXJ0KCh2YWw6IGFueSkgPT4ge1xuICAgICAgY29uc3QgZGlzdGFuY2U6IGFueSA9IHRoaXMuX3ZvbHQyZGlzdGFuY2UodmFsKTtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayhkaXN0YW5jZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgX3ZvbHQyZGlzdGFuY2UodmFsOiBhbnkpIHtcbiAgICBpZiAodmFsIDw9IDApIHtcbiAgICAgIHZhbCA9IDAuMDAxO1xuICAgIH1cbiAgICBsZXQgZGlzdGFuY2U6IGFueSA9IDE5OTg4LjM0ICogTWF0aC5wb3coKHZhbCAvIDUuMCkgKiAxMDI0LCAtMS4yNTIxNCkgKiAxMDtcbiAgICBpZiAodGhpcy5fdW5pdCA9PT0gXCJtbVwiKSB7XG4gICAgICBkaXN0YW5jZSA9IE1hdGguZmxvb3IoZGlzdGFuY2UgKiAxMCkgLyAxMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzdGFuY2UgKj0gMC4wMzkzNzAxO1xuICAgICAgZGlzdGFuY2UgPSBNYXRoLmZsb29yKGRpc3RhbmNlICogMTAwMCkgLyAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gZGlzdGFuY2U7XG4gIH1cblxuICBwdWJsaWMgZ2V0V2FpdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHZhbDogYW55ID0gYXdhaXQgdGhpcy5hZF9zaWduYWwuZ2V0V2FpdCgpO1xuICAgICAgY29uc3QgZGlzdGFuY2U6IGFueSA9IHRoaXMuX3ZvbHQyZGlzdGFuY2UodmFsKTtcbiAgICAgIHJlc29sdmUoZGlzdGFuY2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHVuaXQodW5pdDogYW55KSB7XG4gICAgaWYgKHVuaXQgPT09IFwibW1cIikge1xuICAgICAgdGhpcy5fdW5pdCA9IFwibW1cIjtcbiAgICB9IGVsc2UgaWYgKHVuaXQgPT09IFwiaW5jaFwiKSB7XG4gICAgICB0aGlzLl91bml0ID0gXCJpbmNoXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdW5pdCBcIiArIHVuaXQpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHUDJZMEEyMVlLMEY7XG4iXX0=
