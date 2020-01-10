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
class KXSC7_2050 {
    constructor() {
        this.keys = ["x", "y", "z", "vcc", "gnd"];
        this.requiredKeys = ["x", "y", "z"];
    }
    static info() {
        return {
            name: "KXSC7-2050",
        };
    }
    wired(obniz) {
        return __awaiter(this, void 0, void 0, function* () {
            this.obniz = obniz;
            obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
            this.ad_x = obniz.getAD(this.params.x);
            this.ad_y = obniz.getAD(this.params.y);
            this.ad_z = obniz.getAD(this.params.z);
            yield obniz.wait(500);
            const ad = obniz.getAD(this.params.vcc);
            const pwrVoltage = yield ad.getWait();
            const horizontalZ = yield this.ad_z.getWait();
            const sensitivity = pwrVoltage / 5; // Set sensitivity (unit:V)
            const offsetVoltage = horizontalZ - sensitivity; // Set offset voltage (Output voltage at 0g, unit:V)
            const self = this;
            this.ad_x.start((value) => {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangex) {
                    self.onchangex(self.gravity);
                }
            });
            this.ad_y.start((value) => {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangey) {
                    self.onchangey(self.gravity);
                }
            });
            this.ad_z.start((value) => {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangez) {
                    self.onchangez(self.gravity);
                }
            });
        });
    }
}
exports.default = KXSC7_2050;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9LWFNDNy0yMDUwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxVQUFVO0lBb0JkO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBckJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsWUFBWTtTQUNuQixDQUFDO0lBQ0osQ0FBQztJQW1CWSxLQUFLLENBQUMsS0FBVTs7WUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2QyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsTUFBTSxFQUFFLEdBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sVUFBVSxHQUFRLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNDLE1BQU0sV0FBVyxHQUFRLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuRCxNQUFNLFdBQVcsR0FBUSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsMkJBQTJCO1lBQ3BFLE1BQU0sYUFBYSxHQUFRLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQyxvREFBb0Q7WUFFMUcsTUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEdBQUcsV0FBVyxDQUFDO2dCQUNyRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM5QjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsR0FBRyxXQUFXLENBQUM7Z0JBQ3JELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzlCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO2dCQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxHQUFHLFdBQVcsQ0FBQztnQkFDckQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDOUI7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsVUFBVSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9LWFNDNy0yMDUwL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgS1hTQzdfMjA1MCB7XG5cbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIktYU0M3LTIwNTBcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIHJlcXVpcmVkS2V5czogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgYWRfeDogYW55O1xuICBwdWJsaWMgYWRfeTogYW55O1xuICBwdWJsaWMgYWRfejogYW55O1xuICBwdWJsaWMgZ3Jhdml0eTogYW55O1xuICBwdWJsaWMgb25jaGFuZ2V4OiBhbnk7XG4gIHB1YmxpYyBvbmNoYW5nZXk6IGFueTtcbiAgcHVibGljIG9uY2hhbmdlejogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcInhcIiwgXCJ5XCIsIFwielwiLCBcInZjY1wiLCBcImduZFwiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcInhcIiwgXCJ5XCIsIFwielwiXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuXG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCBcIjN2XCIpO1xuICAgIHRoaXMuYWRfeCA9IG9ibml6LmdldEFEKHRoaXMucGFyYW1zLngpO1xuICAgIHRoaXMuYWRfeSA9IG9ibml6LmdldEFEKHRoaXMucGFyYW1zLnkpO1xuICAgIHRoaXMuYWRfeiA9IG9ibml6LmdldEFEKHRoaXMucGFyYW1zLnopO1xuXG4gICAgYXdhaXQgb2JuaXoud2FpdCg1MDApO1xuICAgIGNvbnN0IGFkOiBhbnkgPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy52Y2MpO1xuICAgIGNvbnN0IHB3clZvbHRhZ2U6IGFueSA9IGF3YWl0IGFkLmdldFdhaXQoKTtcbiAgICBjb25zdCBob3Jpem9udGFsWjogYW55ID0gYXdhaXQgdGhpcy5hZF96LmdldFdhaXQoKTtcbiAgICBjb25zdCBzZW5zaXRpdml0eTogYW55ID0gcHdyVm9sdGFnZSAvIDU7IC8vIFNldCBzZW5zaXRpdml0eSAodW5pdDpWKVxuICAgIGNvbnN0IG9mZnNldFZvbHRhZ2U6IGFueSA9IGhvcml6b250YWxaIC0gc2Vuc2l0aXZpdHk7IC8vIFNldCBvZmZzZXQgdm9sdGFnZSAoT3V0cHV0IHZvbHRhZ2UgYXQgMGcsIHVuaXQ6VilcblxuICAgIGNvbnN0IHNlbGY6IGFueSA9IHRoaXM7XG4gICAgdGhpcy5hZF94LnN0YXJ0KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBzZWxmLmdyYXZpdHkgPSAodmFsdWUgLSBvZmZzZXRWb2x0YWdlKSAvIHNlbnNpdGl2aXR5O1xuICAgICAgaWYgKHNlbGYub25jaGFuZ2V4KSB7XG4gICAgICAgIHNlbGYub25jaGFuZ2V4KHNlbGYuZ3Jhdml0eSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmFkX3kuc3RhcnQoKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIHNlbGYuZ3Jhdml0eSA9ICh2YWx1ZSAtIG9mZnNldFZvbHRhZ2UpIC8gc2Vuc2l0aXZpdHk7XG4gICAgICBpZiAoc2VsZi5vbmNoYW5nZXkpIHtcbiAgICAgICAgc2VsZi5vbmNoYW5nZXkoc2VsZi5ncmF2aXR5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYWRfei5zdGFydCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgc2VsZi5ncmF2aXR5ID0gKHZhbHVlIC0gb2Zmc2V0Vm9sdGFnZSkgLyBzZW5zaXRpdml0eTtcbiAgICAgIGlmIChzZWxmLm9uY2hhbmdleikge1xuICAgICAgICBzZWxmLm9uY2hhbmdleihzZWxmLmdyYXZpdHkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtYU0M3XzIwNTA7XG4iXX0=
