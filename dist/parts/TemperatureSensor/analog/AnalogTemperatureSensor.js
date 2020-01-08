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
class AnalogTemperatureSensor {
    constructor() {
        this.keys = ['vcc', 'gnd', 'output'];
        this.requiredKeys = ['output'];
        this.drive = '5v';
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
        this.ad = obniz.getAD(this.params.output);
        this.ad.start(function (voltage) {
            this.temp = this.calc(voltage);
            this.onchange(this.temp);
        }.bind(this));
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let voltage = yield this.ad.getWait();
            this.temp = this.calc(voltage);
            return this.temp;
        });
    }
    onchange(temp) { }
    calc(voltage) {
        return 0;
    }
}
module.exports = AnalogTemperatureSensor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sdUJBQXVCO0lBQzNCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUNYLFVBQVMsT0FBTztZQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNiLENBQUM7SUFDSixDQUFDO0lBRUssT0FBTzs7WUFDWCxJQUFJLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDO0tBQUE7SUFFRCxRQUFRLENBQUMsSUFBSSxJQUFHLENBQUM7SUFFakIsSUFBSSxDQUFDLE9BQU87UUFDVixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUMiLCJmaWxlIjoicGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvYW5hbG9nL0FuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdnbmQnLCAnb3V0cHV0J107XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbJ291dHB1dCddO1xuICAgIHRoaXMuZHJpdmUgPSAnNXYnO1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCB0aGlzLmRyaXZlKTtcbiAgICB0aGlzLmFkID0gb2JuaXouZ2V0QUQodGhpcy5wYXJhbXMub3V0cHV0KTtcblxuICAgIHRoaXMuYWQuc3RhcnQoXG4gICAgICBmdW5jdGlvbih2b2x0YWdlKSB7XG4gICAgICAgIHRoaXMudGVtcCA9IHRoaXMuY2FsYyh2b2x0YWdlKTtcbiAgICAgICAgdGhpcy5vbmNoYW5nZSh0aGlzLnRlbXApO1xuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGdldFdhaXQoKSB7XG4gICAgbGV0IHZvbHRhZ2UgPSBhd2FpdCB0aGlzLmFkLmdldFdhaXQoKTtcbiAgICB0aGlzLnRlbXAgPSB0aGlzLmNhbGModm9sdGFnZSk7XG4gICAgcmV0dXJuIHRoaXMudGVtcDtcbiAgfVxuXG4gIG9uY2hhbmdlKHRlbXApIHt9XG5cbiAgY2FsYyh2b2x0YWdlKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBbmFsb2dUZW1wZXJhdHVyZVNlbnNvcjtcbiJdfQ==
