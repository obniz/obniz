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
class YG1006 {
    constructor() {
        this.keys = ['signal', 'vcc', 'gnd'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'YG1006',
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
    module.exports = YG1006;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9JbmZyYXJlZC9ZRzEwMDYvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sTUFBTTtJQUNWO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUssT0FBTzs7WUFDWCxJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDeEMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0NBQ3pCIiwiZmlsZSI6InBhcnRzL0luZnJhcmVkL1lHMTAwNi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFlHMTAwNiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsnc2lnbmFsJywgJ3ZjYycsICdnbmQnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnc2lnbmFsJ107XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1lHMTAwNicsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIHRoaXMub2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCAnNXYnKTtcbiAgICB0aGlzLnNpZ25hbCA9IHRoaXMub2JuaXouZ2V0QUQodGhpcy5wYXJhbXMuc2lnbmFsKTtcbiAgICB0aGlzLnNpZ25hbC5zdGFydCh2YWx1ZSA9PiB7XG4gICAgICBpZiAodGhpcy5vbmNoYW5nZSkge1xuICAgICAgICB0aGlzLm9uY2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFdhaXQoKSB7XG4gICAgbGV0IHZhbHVlID0gYXdhaXQgdGhpcy5zaWduYWwuZ2V0V2FpdCgpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBZRzEwMDY7XG59XG4iXX0=
