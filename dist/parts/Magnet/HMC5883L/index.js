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
class HMC5883L {
    constructor() {
        this.keys = ['gnd', 'sda', 'scl', 'i2c'];
        this.address = {};
        this.address.device = 0x1e;
        this.address.reset = [0x02, 0x00]; // Continuous Measurment Mode
        this.address.xMSB = [0x03];
    }
    static info() {
        return {
            name: 'HMC5883L',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(null, this.params.gnd, '3v');
        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(500);
    }
    init() {
        this.i2c.write(this.address.device, this.address.reset);
        this.obniz.wait(500);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address.device, this.address.xMSB);
            let readed = yield this.i2c.readWait(this.address.device, 2 * 3);
            let obj = {};
            let keys = ['x', 'y', 'z'];
            for (let i = 0; i < 3; i++) {
                let val = (readed[i * 2] << 8) | readed[i * 2 + 1];
                if (val & 0x8000) {
                    val = val - 65536;
                }
                obj[keys[i]] = val;
            }
            return obj;
        });
    }
}
if (typeof module === 'object') {
    module.exports = HMC5883L;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9NYWduZXQvSE1DNTg4M0wvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sUUFBUTtJQUNaO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXpDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsVUFBVTtTQUNqQixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFFNUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUssR0FBRzs7WUFDUCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZELElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRWpFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELElBQUksR0FBRyxHQUFHLE1BQU0sRUFBRTtvQkFDaEIsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7aUJBQ25CO2dCQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDcEI7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Q0FDM0IiLCJmaWxlIjoicGFydHMvTWFnbmV0L0hNQzU4ODNML2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSE1DNTg4M0wge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ2duZCcsICdzZGEnLCAnc2NsJywgJ2kyYyddO1xuXG4gICAgdGhpcy5hZGRyZXNzID0ge307XG4gICAgdGhpcy5hZGRyZXNzLmRldmljZSA9IDB4MWU7XG4gICAgdGhpcy5hZGRyZXNzLnJlc2V0ID0gWzB4MDIsIDB4MDBdOyAvLyBDb250aW51b3VzIE1lYXN1cm1lbnQgTW9kZVxuICAgIHRoaXMuYWRkcmVzcy54TVNCID0gWzB4MDNdO1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdITUM1ODgzTCcsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIG9ibml6LnNldFZjY0duZChudWxsLCB0aGlzLnBhcmFtcy5nbmQsICczdicpO1xuXG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSAxMDAwMDA7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9ICczdic7XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9ICdtYXN0ZXInO1xuXG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcblxuICAgIHRoaXMub2JuaXoud2FpdCg1MDApO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MuZGV2aWNlLCB0aGlzLmFkZHJlc3MucmVzZXQpO1xuICAgIHRoaXMub2JuaXoud2FpdCg1MDApO1xuICB9XG5cbiAgYXN5bmMgZ2V0KCkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcy5kZXZpY2UsIHRoaXMuYWRkcmVzcy54TVNCKTtcbiAgICBsZXQgcmVhZGVkID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5hZGRyZXNzLmRldmljZSwgMiAqIDMpO1xuXG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGxldCBrZXlzID0gWyd4JywgJ3knLCAneiddO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBsZXQgdmFsID0gKHJlYWRlZFtpICogMl0gPDwgOCkgfCByZWFkZWRbaSAqIDIgKyAxXTtcbiAgICAgIGlmICh2YWwgJiAweDgwMDApIHtcbiAgICAgICAgdmFsID0gdmFsIC0gNjU1MzY7XG4gICAgICB9XG4gICAgICBvYmpba2V5c1tpXV0gPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBITUM1ODgzTDtcbn1cbiJdfQ==
