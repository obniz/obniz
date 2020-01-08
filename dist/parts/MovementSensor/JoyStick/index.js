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
class JoyStick {
    constructor() {
        this.keys = ['sw', 'y', 'x', 'vcc', 'gnd', 'i2c'];
        this.requiredKeys = ['sw', 'y', 'x'];
        this.pins = this.keys || ['sw', 'y', 'x', 'vcc', 'gnd'];
        this.pinname = { sw: 'sw12' };
        this.shortName = 'joyS';
    }
    static info() {
        return {
            name: 'JoyStick',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.io_sig_sw = obniz.getIO(this.params.sw);
        this.ad_x = obniz.getAD(this.params.x);
        this.ad_y = obniz.getAD(this.params.y);
        this.io_sig_sw.pull('5v');
        let self = this;
        this.ad_x.start(function (value) {
            self.positionX = value / 5.0;
            if (self.onchangex) {
                self.onchangex(self.positionX * 2 - 1);
            }
        });
        this.ad_y.start(function (value) {
            self.positionY = value / 5.0;
            if (self.onchangey) {
                self.onchangey(self.positionY * 2 - 1);
            }
        });
        this.io_sig_sw.input(function (value) {
            self.isPressed = value === false;
            if (self.onchangesw) {
                self.onchangesw(value === false);
            }
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.io_sig_sw.inputWait();
            return ret === false;
        });
    }
    getXWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield this.ad_x.getWait();
            this.positionX = value / 5.0;
            return this.positionX * 2 - 1;
        });
    }
    getYWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield this.ad_y.getWait();
            this.positionY = value / 5.0;
            return this.positionY * 2 - 1;
        });
    }
}
if (typeof module === 'object') {
    module.exports = JoyStick;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9Kb3lTdGljay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxRQUFRO0lBQ1o7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVMsS0FBSztZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDN0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFTLEtBQUs7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQzdCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4QztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBUyxLQUFLO1lBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxLQUFLLEtBQUssQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUssYUFBYTs7WUFDakIsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzNDLE9BQU8sR0FBRyxLQUFLLEtBQUssQ0FBQztRQUN2QixDQUFDO0tBQUE7SUFFSyxRQUFROztZQUNaLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDN0IsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUFBO0lBRUssUUFBUTs7WUFDWixJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQzdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Q0FDM0IiLCJmaWxlIjoicGFydHMvTW92ZW1lbnRTZW5zb3IvSm95U3RpY2svaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBKb3lTdGljayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsnc3cnLCAneScsICd4JywgJ3ZjYycsICdnbmQnLCAnaTJjJ107XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbJ3N3JywgJ3knLCAneCddO1xuICAgIHRoaXMucGlucyA9IHRoaXMua2V5cyB8fCBbJ3N3JywgJ3knLCAneCcsICd2Y2MnLCAnZ25kJ107XG4gICAgdGhpcy5waW5uYW1lID0geyBzdzogJ3N3MTInIH07XG4gICAgdGhpcy5zaG9ydE5hbWUgPSAnam95Uyc7XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pveVN0aWNrJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG5cbiAgICBvYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICc1dicpO1xuXG4gICAgdGhpcy5pb19zaWdfc3cgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5zdyk7XG4gICAgdGhpcy5hZF94ID0gb2JuaXouZ2V0QUQodGhpcy5wYXJhbXMueCk7XG4gICAgdGhpcy5hZF95ID0gb2JuaXouZ2V0QUQodGhpcy5wYXJhbXMueSk7XG5cbiAgICB0aGlzLmlvX3NpZ19zdy5wdWxsKCc1dicpO1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuYWRfeC5zdGFydChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgc2VsZi5wb3NpdGlvblggPSB2YWx1ZSAvIDUuMDtcbiAgICAgIGlmIChzZWxmLm9uY2hhbmdleCkge1xuICAgICAgICBzZWxmLm9uY2hhbmdleChzZWxmLnBvc2l0aW9uWCAqIDIgLSAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYWRfeS5zdGFydChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgc2VsZi5wb3NpdGlvblkgPSB2YWx1ZSAvIDUuMDtcbiAgICAgIGlmIChzZWxmLm9uY2hhbmdleSkge1xuICAgICAgICBzZWxmLm9uY2hhbmdleShzZWxmLnBvc2l0aW9uWSAqIDIgLSAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuaW9fc2lnX3N3LmlucHV0KGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBzZWxmLmlzUHJlc3NlZCA9IHZhbHVlID09PSBmYWxzZTtcbiAgICAgIGlmIChzZWxmLm9uY2hhbmdlc3cpIHtcbiAgICAgICAgc2VsZi5vbmNoYW5nZXN3KHZhbHVlID09PSBmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBpc1ByZXNzZWRXYWl0KCkge1xuICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmlvX3NpZ19zdy5pbnB1dFdhaXQoKTtcbiAgICByZXR1cm4gcmV0ID09PSBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIGdldFhXYWl0KCkge1xuICAgIGxldCB2YWx1ZSA9IGF3YWl0IHRoaXMuYWRfeC5nZXRXYWl0KCk7XG4gICAgdGhpcy5wb3NpdGlvblggPSB2YWx1ZSAvIDUuMDtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvblggKiAyIC0gMTtcbiAgfVxuXG4gIGFzeW5jIGdldFlXYWl0KCkge1xuICAgIGxldCB2YWx1ZSA9IGF3YWl0IHRoaXMuYWRfeS5nZXRXYWl0KCk7XG4gICAgdGhpcy5wb3NpdGlvblkgPSB2YWx1ZSAvIDUuMDtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvblkgKiAyIC0gMTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBKb3lTdGljaztcbn1cbiJdfQ==
