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
class Grove_Button {
    constructor() {
        this.keys = ['signal', 'gnd', 'vcc'];
        this.requiredKeys = ['signal'];
        this.onChangeForStateWait = function () { };
    }
    static info() {
        return {
            name: 'Grove_Button',
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.vcc)) {
            this.io_vcc = obniz.getIO(this.params.vcc);
            this.io_vcc.output(true);
        }
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        this.io_signal.pull('5v');
        let self = this;
        this.io_signal.input(function (value) {
            self.isPressed = value;
            if (self.onchange) {
                self.onchange(value);
            }
            self.onChangeForStateWait(value);
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.io_signal.inputWait();
            return ret;
        });
    }
    stateWait(isPressed) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = pressed => {
                if (isPressed == pressed) {
                    this.onChangeForStateWait = function () { };
                    resolve();
                }
            };
        });
    }
}
if (typeof module === 'object') {
    module.exports = Grove_Button;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Hcm92ZS9Hcm92ZV9CdXR0b24vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sWUFBWTtJQUNoQjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsY0FBWSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxjQUFjO1NBQ3JCLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVMsS0FBSztZQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7WUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUssYUFBYTs7WUFDakIsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzNDLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRUQsU0FBUyxDQUFDLFNBQVM7UUFDakIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLEVBQUU7Z0JBQ3BDLElBQUksU0FBUyxJQUFJLE9BQU8sRUFBRTtvQkFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLGNBQVksQ0FBQyxDQUFDO29CQUMxQyxPQUFPLEVBQUUsQ0FBQztpQkFDWDtZQUNILENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7Q0FDL0IiLCJmaWxlIjoicGFydHMvR3JvdmUvR3JvdmVfQnV0dG9uL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgR3JvdmVfQnV0dG9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gWydzaWduYWwnLCAnZ25kJywgJ3ZjYyddO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gWydzaWduYWwnXTtcblxuICAgIHRoaXMub25DaGFuZ2VGb3JTdGF0ZVdhaXQgPSBmdW5jdGlvbigpIHt9O1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdHcm92ZV9CdXR0b24nLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMuaW9fc2lnbmFsID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuc2lnbmFsKTtcblxuICAgIGlmIChvYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMudmNjKSkge1xuICAgICAgdGhpcy5pb192Y2MgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy52Y2MpO1xuICAgICAgdGhpcy5pb192Y2Mub3V0cHV0KHRydWUpO1xuICAgIH1cblxuICAgIGlmIChvYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMuZ25kKSkge1xuICAgICAgdGhpcy5pb19zdXBwbHkgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5nbmQpO1xuICAgICAgdGhpcy5pb19zdXBwbHkub3V0cHV0KGZhbHNlKTtcbiAgICB9XG5cbiAgICB0aGlzLmlvX3NpZ25hbC5wdWxsKCc1dicpO1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuaW9fc2lnbmFsLmlucHV0KGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBzZWxmLmlzUHJlc3NlZCA9IHZhbHVlO1xuICAgICAgaWYgKHNlbGYub25jaGFuZ2UpIHtcbiAgICAgICAgc2VsZi5vbmNoYW5nZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBzZWxmLm9uQ2hhbmdlRm9yU3RhdGVXYWl0KHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGlzUHJlc3NlZFdhaXQoKSB7XG4gICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuaW9fc2lnbmFsLmlucHV0V2FpdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBzdGF0ZVdhaXQoaXNQcmVzc2VkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMub25DaGFuZ2VGb3JTdGF0ZVdhaXQgPSBwcmVzc2VkID0+IHtcbiAgICAgICAgaWYgKGlzUHJlc3NlZCA9PSBwcmVzc2VkKSB7XG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUZvclN0YXRlV2FpdCA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IEdyb3ZlX0J1dHRvbjtcbn1cbiJdfQ==
