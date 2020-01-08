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
class KXSC7_2050 {
    constructor() {
        this.keys = ['x', 'y', 'z', 'vcc', 'gnd'];
        this.requiredKeys = ['x', 'y', 'z'];
    }
    static info() {
        return {
            name: 'KXSC7-2050',
        };
    }
    wired(obniz) {
        return __awaiter(this, void 0, void 0, function* () {
            this.obniz = obniz;
            obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
            this.ad_x = obniz.getAD(this.params.x);
            this.ad_y = obniz.getAD(this.params.y);
            this.ad_z = obniz.getAD(this.params.z);
            yield obniz.wait(500);
            let ad = obniz.getAD(this.params.vcc);
            let pwrVoltage = yield ad.getWait();
            let horizontalZ = yield this.ad_z.getWait();
            let sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
            let offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)
            let self = this;
            this.ad_x.start(function (value) {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangex) {
                    self.onchangex(self.gravity);
                }
            });
            this.ad_y.start(function (value) {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangey) {
                    self.onchangey(self.gravity);
                }
            });
            this.ad_z.start(function (value) {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangez) {
                    self.onchangez(self.gravity);
                }
            });
        });
    }
}
if (typeof module === 'object') {
    module.exports = KXSC7_2050;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9LWFNDNy0yMDUwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFVBQVU7SUFDZDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxZQUFZO1NBQ25CLENBQUM7SUFDSixDQUFDO0lBRUssS0FBSyxDQUFDLEtBQUs7O1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2QyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLElBQUksVUFBVSxHQUFHLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLElBQUksV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1QyxJQUFJLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsMEJBQTBCO1lBQzVELElBQUksYUFBYSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQyxtREFBbUQ7WUFFbEcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVMsS0FBSztnQkFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsR0FBRyxXQUFXLENBQUM7Z0JBQ3JELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzlCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFTLEtBQUs7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEdBQUcsV0FBVyxDQUFDO2dCQUNyRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM5QjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBUyxLQUFLO2dCQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxHQUFHLFdBQVcsQ0FBQztnQkFDckQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDOUI7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7Q0FDN0IiLCJmaWxlIjoicGFydHMvTW92ZW1lbnRTZW5zb3IvS1hTQzctMjA1MC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEtYU0M3XzIwNTAge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3gnLCAneScsICd6JywgJ3ZjYycsICdnbmQnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsneCcsICd5JywgJ3onXTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnS1hTQzctMjA1MCcsXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuXG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCAnM3YnKTtcbiAgICB0aGlzLmFkX3ggPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy54KTtcbiAgICB0aGlzLmFkX3kgPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy55KTtcbiAgICB0aGlzLmFkX3ogPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy56KTtcblxuICAgIGF3YWl0IG9ibml6LndhaXQoNTAwKTtcbiAgICBsZXQgYWQgPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy52Y2MpO1xuICAgIGxldCBwd3JWb2x0YWdlID0gYXdhaXQgYWQuZ2V0V2FpdCgpO1xuICAgIGxldCBob3Jpem9udGFsWiA9IGF3YWl0IHRoaXMuYWRfei5nZXRXYWl0KCk7XG4gICAgbGV0IHNlbnNpdGl2aXR5ID0gcHdyVm9sdGFnZSAvIDU7IC8vU2V0IHNlbnNpdGl2aXR5ICh1bml0OlYpXG4gICAgbGV0IG9mZnNldFZvbHRhZ2UgPSBob3Jpem9udGFsWiAtIHNlbnNpdGl2aXR5OyAvL1NldCBvZmZzZXQgdm9sdGFnZSAoT3V0cHV0IHZvbHRhZ2UgYXQgMGcsIHVuaXQ6VilcblxuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmFkX3guc3RhcnQoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHNlbGYuZ3Jhdml0eSA9ICh2YWx1ZSAtIG9mZnNldFZvbHRhZ2UpIC8gc2Vuc2l0aXZpdHk7XG4gICAgICBpZiAoc2VsZi5vbmNoYW5nZXgpIHtcbiAgICAgICAgc2VsZi5vbmNoYW5nZXgoc2VsZi5ncmF2aXR5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYWRfeS5zdGFydChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgc2VsZi5ncmF2aXR5ID0gKHZhbHVlIC0gb2Zmc2V0Vm9sdGFnZSkgLyBzZW5zaXRpdml0eTtcbiAgICAgIGlmIChzZWxmLm9uY2hhbmdleSkge1xuICAgICAgICBzZWxmLm9uY2hhbmdleShzZWxmLmdyYXZpdHkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5hZF96LnN0YXJ0KGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBzZWxmLmdyYXZpdHkgPSAodmFsdWUgLSBvZmZzZXRWb2x0YWdlKSAvIHNlbnNpdGl2aXR5O1xuICAgICAgaWYgKHNlbGYub25jaGFuZ2V6KSB7XG4gICAgICAgIHNlbGYub25jaGFuZ2V6KHNlbGYuZ3Jhdml0eSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gS1hTQzdfMjA1MDtcbn1cbiJdfQ==
