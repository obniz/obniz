"use strict";
//Todo: add weight and calc pressure(kg)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FSR40X {
    constructor() {
        this.keys = ['pin0', 'pin1'];
        this.requiredKeys = ['pin0', 'pin1'];
    }
    static info() {
        return {
            name: 'FSR40X',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_pwr = obniz.getIO(this.params.pin0);
        this.ad = obniz.getAD(this.params.pin1);
        this.io_pwr.drive('5v');
        this.io_pwr.output(true);
        let self = this;
        this.ad.start(function (value) {
            let pressure = value * 100;
            self.press = pressure;
            if (self.onchange) {
                self.onchange(self.press);
            }
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield this.ad.getWait();
            let pressure = value * 100;
            this.press = pressure;
            return this.press;
        });
    }
}
if (typeof module === 'object') {
    module.exports = FSR40X;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9QcmVzc3VyZVNlbnNvci9GU1ItNDBYL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3Q0FBd0M7Ozs7Ozs7Ozs7QUFFeEMsTUFBTSxNQUFNO0lBQ1Y7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFTLEtBQUs7WUFDMUIsSUFBSSxRQUFRLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUN0QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUssT0FBTzs7WUFDWCxJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEMsSUFBSSxRQUFRLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztDQUN6QiIsImZpbGUiOiJwYXJ0cy9QcmVzc3VyZVNlbnNvci9GU1ItNDBYL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9Ub2RvOiBhZGQgd2VpZ2h0IGFuZCBjYWxjIHByZXNzdXJlKGtnKVxuXG5jbGFzcyBGU1I0MFgge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3BpbjAnLCAncGluMSddO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gWydwaW4wJywgJ3BpbjEnXTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnRlNSNDBYJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG5cbiAgICB0aGlzLmlvX3B3ciA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnBpbjApO1xuICAgIHRoaXMuYWQgPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy5waW4xKTtcblxuICAgIHRoaXMuaW9fcHdyLmRyaXZlKCc1dicpO1xuICAgIHRoaXMuaW9fcHdyLm91dHB1dCh0cnVlKTtcblxuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmFkLnN0YXJ0KGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBsZXQgcHJlc3N1cmUgPSB2YWx1ZSAqIDEwMDtcbiAgICAgIHNlbGYucHJlc3MgPSBwcmVzc3VyZTtcbiAgICAgIGlmIChzZWxmLm9uY2hhbmdlKSB7XG4gICAgICAgIHNlbGYub25jaGFuZ2Uoc2VsZi5wcmVzcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRXYWl0KCkge1xuICAgIGxldCB2YWx1ZSA9IGF3YWl0IHRoaXMuYWQuZ2V0V2FpdCgpO1xuICAgIGxldCBwcmVzc3VyZSA9IHZhbHVlICogMTAwO1xuICAgIHRoaXMucHJlc3MgPSBwcmVzc3VyZTtcbiAgICByZXR1cm4gdGhpcy5wcmVzcztcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBGU1I0MFg7XG59XG4iXX0=
