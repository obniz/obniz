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
class IPM_165 {
    constructor() {
        this.keys = ['signal', 'vcc', 'gnd'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'IPM-165',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.signal = this.obniz.getAD(this.params.signal);
        this.signal.start(value => {
            if (this.onchange) {
                this.onchange(value);
            }
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield this.signal.getWait();
            return value;
        });
    }
}
if (typeof module === 'object') {
    module.exports = IPM_165;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9JUE0tMTY1L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE9BQU87SUFDWDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN4QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSyxPQUFPOztZQUNYLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN4QyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FDMUIiLCJmaWxlIjoicGFydHMvTW92ZW1lbnRTZW5zb3IvSVBNLTE2NS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIElQTV8xNjUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3NpZ25hbCcsICd2Y2MnLCAnZ25kJ107XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbJ3NpZ25hbCddO1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdJUE0tMTY1JyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5vYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICc1dicpO1xuICAgIHRoaXMuc2lnbmFsID0gdGhpcy5vYm5pei5nZXRBRCh0aGlzLnBhcmFtcy5zaWduYWwpO1xuICAgIHRoaXMuc2lnbmFsLnN0YXJ0KHZhbHVlID0+IHtcbiAgICAgIGlmICh0aGlzLm9uY2hhbmdlKSB7XG4gICAgICAgIHRoaXMub25jaGFuZ2UodmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0V2FpdCgpIHtcbiAgICBsZXQgdmFsdWUgPSBhd2FpdCB0aGlzLnNpZ25hbC5nZXRXYWl0KCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IElQTV8xNjU7XG59XG4iXX0=
