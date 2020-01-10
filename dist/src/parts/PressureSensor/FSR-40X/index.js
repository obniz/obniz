"use strict";
// Todo: add weight and calc pressure(kg)
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
class FSR40X {
    constructor() {
        this.keys = ["pin0", "pin1"];
        this.requiredKeys = ["pin0", "pin1"];
    }
    static info() {
        return {
            name: "FSR40X",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_pwr = obniz.getIO(this.params.pin0);
        this.ad = obniz.getAD(this.params.pin1);
        this.io_pwr.drive("5v");
        this.io_pwr.output(true);
        const self = this;
        this.ad.start((value) => {
            const pressure = value * 100;
            self.press = pressure;
            if (self.onchange) {
                self.onchange(self.press);
            }
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.ad.getWait();
            const pressure = value * 100;
            this.press = pressure;
            return this.press;
        });
    }
}
exports.default = FSR40X;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9QcmVzc3VyZVNlbnNvci9GU1ItNDBYL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5Q0FBeUM7Ozs7Ozs7Ozs7O0FBRXpDLE1BQU0sTUFBTTtJQWlCVjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBbEJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7SUFDSixDQUFDO0lBZ0JNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpCLE1BQU0sSUFBSSxHQUFRLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQzNCLE1BQU0sUUFBUSxHQUFRLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMzQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVZLE9BQU87O1lBQ2xCLE1BQU0sS0FBSyxHQUFRLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzQyxNQUFNLFFBQVEsR0FBUSxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvUHJlc3N1cmVTZW5zb3IvRlNSLTQwWC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRvZG86IGFkZCB3ZWlnaHQgYW5kIGNhbGMgcHJlc3N1cmUoa2cpXG5cbmNsYXNzIEZTUjQwWCB7XG5cbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIkZTUjQwWFwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMga2V5czogYW55O1xuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgaW9fcHdyOiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIGFkOiBhbnk7XG4gIHB1YmxpYyBwcmVzczogYW55O1xuICBwdWJsaWMgb25jaGFuZ2U6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJwaW4wXCIsIFwicGluMVwiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcInBpbjBcIiwgXCJwaW4xXCJdO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG5cbiAgICB0aGlzLmlvX3B3ciA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnBpbjApO1xuICAgIHRoaXMuYWQgPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy5waW4xKTtcblxuICAgIHRoaXMuaW9fcHdyLmRyaXZlKFwiNXZcIik7XG4gICAgdGhpcy5pb19wd3Iub3V0cHV0KHRydWUpO1xuXG4gICAgY29uc3Qgc2VsZjogYW55ID0gdGhpcztcbiAgICB0aGlzLmFkLnN0YXJ0KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBwcmVzc3VyZTogYW55ID0gdmFsdWUgKiAxMDA7XG4gICAgICBzZWxmLnByZXNzID0gcHJlc3N1cmU7XG4gICAgICBpZiAoc2VsZi5vbmNoYW5nZSkge1xuICAgICAgICBzZWxmLm9uY2hhbmdlKHNlbGYucHJlc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFdhaXQoKSB7XG4gICAgY29uc3QgdmFsdWU6IGFueSA9IGF3YWl0IHRoaXMuYWQuZ2V0V2FpdCgpO1xuICAgIGNvbnN0IHByZXNzdXJlOiBhbnkgPSB2YWx1ZSAqIDEwMDtcbiAgICB0aGlzLnByZXNzID0gcHJlc3N1cmU7XG4gICAgcmV0dXJuIHRoaXMucHJlc3M7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRlNSNDBYO1xuIl19
