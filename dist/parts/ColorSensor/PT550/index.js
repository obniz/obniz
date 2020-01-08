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
class PT550 {
    constructor() {
        this.keys = ['signal', 'vcc', 'gnd'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'PT550',
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
            return yield this.signal.getWait();
        });
    }
}
if (typeof module === 'object') {
    module.exports = PT550;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Db2xvclNlbnNvci9QVDU1MC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxLQUFLO0lBQ1Q7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN4QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSyxPQUFPOztZQUNYLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JDLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Q0FDeEIiLCJmaWxlIjoicGFydHMvQ29sb3JTZW5zb3IvUFQ1NTAvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQVDU1MCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsnc2lnbmFsJywgJ3ZjYycsICdnbmQnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnc2lnbmFsJ107XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1BUNTUwJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5vYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICc1dicpO1xuICAgIHRoaXMuc2lnbmFsID0gdGhpcy5vYm5pei5nZXRBRCh0aGlzLnBhcmFtcy5zaWduYWwpO1xuICAgIHRoaXMuc2lnbmFsLnN0YXJ0KHZhbHVlID0+IHtcbiAgICAgIGlmICh0aGlzLm9uY2hhbmdlKSB7XG4gICAgICAgIHRoaXMub25jaGFuZ2UodmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0V2FpdCgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5zaWduYWwuZ2V0V2FpdCgpO1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IFBUNTUwO1xufVxuIl19
