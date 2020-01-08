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
class S11059 {
    constructor() {
        this.keys = ['vcc', 'sda', 'scl', 'i2c', 'gnd'];
        this.requiredKeys = [];
        this.address = 0x2a;
        this.regAdrs = {};
        this.regAdrs.ctrl = 0x00;
        this.regAdrs.manualTiming = 0x01;
        this.regAdrs.sensorRed = 0x03;
    }
    static info() {
        return {
            name: 'S11059',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
        this.obniz.wait(100);
        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(100);
    }
    init(gain, intTime) {
        this.i2c.write(this.address, [this.regAdrs.ctrl, 0x80]); // Reset
        let val = (gain << 3) | intTime;
        this.i2c.write(this.address, [this.regAdrs.ctrl, val]); // Set gain,interger time
    }
    getVal() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [this.regAdrs.sensorRed]);
            let ret = yield this.i2c.readWait(this.address, 8);
            let level = [0, 0, 0, 0];
            level[0] = (ret[0] << 8) | ret[1];
            level[1] = (ret[2] << 8) | ret[3];
            level[2] = (ret[4] << 8) | ret[5];
            level[3] = (ret[6] << 8) | ret[7];
            return level;
        });
    }
}
if (typeof module === 'object') {
    module.exports = S11059;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Db2xvclNlbnNvci9TMTEwNTkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sTUFBTTtJQUNWO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTztRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7UUFDakUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMseUJBQXlCO0lBQ25GLENBQUM7SUFFSyxNQUFNOztZQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Q0FDekIiLCJmaWxlIjoicGFydHMvQ29sb3JTZW5zb3IvUzExMDU5L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUzExMDU5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gWyd2Y2MnLCAnc2RhJywgJ3NjbCcsICdpMmMnLCAnZ25kJ107XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbXTtcblxuICAgIHRoaXMuYWRkcmVzcyA9IDB4MmE7XG4gICAgdGhpcy5yZWdBZHJzID0ge307XG4gICAgdGhpcy5yZWdBZHJzLmN0cmwgPSAweDAwO1xuICAgIHRoaXMucmVnQWRycy5tYW51YWxUaW1pbmcgPSAweDAxO1xuICAgIHRoaXMucmVnQWRycy5zZW5zb3JSZWQgPSAweDAzO1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdTMTEwNTknLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICBvYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICczdicpO1xuICAgIHRoaXMub2JuaXoud2FpdCgxMDApO1xuXG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSAxMDAwMDA7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9ICczdic7XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9ICdtYXN0ZXInO1xuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG4gIH1cblxuICBpbml0KGdhaW4sIGludFRpbWUpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFt0aGlzLnJlZ0FkcnMuY3RybCwgMHg4MF0pOyAvLyBSZXNldFxuICAgIGxldCB2YWwgPSAoZ2FpbiA8PCAzKSB8IGludFRpbWU7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbdGhpcy5yZWdBZHJzLmN0cmwsIHZhbF0pOyAvLyBTZXQgZ2FpbixpbnRlcmdlciB0aW1lXG4gIH1cblxuICBhc3luYyBnZXRWYWwoKSB7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbdGhpcy5yZWdBZHJzLnNlbnNvclJlZF0pO1xuICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDgpO1xuICAgIGxldCBsZXZlbCA9IFswLCAwLCAwLCAwXTtcbiAgICBsZXZlbFswXSA9IChyZXRbMF0gPDwgOCkgfCByZXRbMV07XG4gICAgbGV2ZWxbMV0gPSAocmV0WzJdIDw8IDgpIHwgcmV0WzNdO1xuICAgIGxldmVsWzJdID0gKHJldFs0XSA8PCA4KSB8IHJldFs1XTtcbiAgICBsZXZlbFszXSA9IChyZXRbNl0gPDwgOCkgfCByZXRbN107XG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IFMxMTA1OTtcbn1cbiJdfQ==
