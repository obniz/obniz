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
class JoyStick {
    constructor() {
        this.keys = ["sw", "y", "x", "vcc", "gnd", "i2c"];
        this.requiredKeys = ["sw", "y", "x"];
        this.pins = this.keys || ["sw", "y", "x", "vcc", "gnd"];
        this.pinname = { sw: "sw12" };
        this.shortName = "joyS";
    }
    static info() {
        return {
            name: "JoyStick",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.io_sig_sw = obniz.getIO(this.params.sw);
        this.ad_x = obniz.getAD(this.params.x);
        this.ad_y = obniz.getAD(this.params.y);
        this.io_sig_sw.pull("5v");
        const self = this;
        this.ad_x.start((value) => {
            self.positionX = value / 5.0;
            if (self.onchangex) {
                self.onchangex(self.positionX * 2 - 1);
            }
        });
        this.ad_y.start((value) => {
            self.positionY = value / 5.0;
            if (self.onchangey) {
                self.onchangey(self.positionY * 2 - 1);
            }
        });
        this.io_sig_sw.input((value) => {
            self.isPressed = value === false;
            if (self.onchangesw) {
                self.onchangesw(value === false);
            }
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.io_sig_sw.inputWait();
            return ret === false;
        });
    }
    getXWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.ad_x.getWait();
            this.positionX = value / 5.0;
            return this.positionX * 2 - 1;
        });
    }
    getYWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.ad_y.getWait();
            this.positionY = value / 5.0;
            return this.positionY * 2 - 1;
        });
    }
}
exports.default = JoyStick;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9Kb3lTdGljay9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLE1BQU0sUUFBUTtJQXlCWjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUMsRUFBRSxFQUFFLE1BQU0sRUFBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUE3Qk0sTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxVQUFVO1NBQ2pCLENBQUM7SUFDSixDQUFDO0lBMkJNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsTUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQzdCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4QztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDN0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxLQUFLLEtBQUssQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRVksYUFBYTs7WUFDeEIsTUFBTSxHQUFHLEdBQVEsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xELE9BQU8sR0FBRyxLQUFLLEtBQUssQ0FBQztRQUN2QixDQUFDO0tBQUE7SUFFWSxRQUFROztZQUNuQixNQUFNLEtBQUssR0FBUSxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQzdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FBQTtJQUVZLFFBQVE7O1lBQ25CLE1BQU0sS0FBSyxHQUFRLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDN0IsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxRQUFRLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL01vdmVtZW50U2Vuc29yL0pveVN0aWNrL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSm95U3RpY2sge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJKb3lTdGlja1wiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMga2V5czogYW55O1xuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBwaW5zOiBhbnk7XG4gIHB1YmxpYyBwaW5uYW1lOiBhbnk7XG4gIHB1YmxpYyBzaG9ydE5hbWU6IGFueTtcbiAgcHVibGljIG9ibml6OiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIGlvX3NpZ19zdzogYW55O1xuICBwdWJsaWMgYWRfeDogYW55O1xuICBwdWJsaWMgYWRfeTogYW55O1xuICBwdWJsaWMgcG9zaXRpb25YOiBhbnk7XG4gIHB1YmxpYyBwb3NpdGlvblk6IGFueTtcbiAgcHVibGljIG9uY2hhbmdleDogYW55O1xuICBwdWJsaWMgb25jaGFuZ2V5OiBhbnk7XG4gIHB1YmxpYyBpc1ByZXNzZWQ6IGFueTtcbiAgcHVibGljIG9uY2hhbmdlc3c6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJzd1wiLCBcInlcIiwgXCJ4XCIsIFwidmNjXCIsIFwiZ25kXCIsIFwiaTJjXCJdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW1wic3dcIiwgXCJ5XCIsIFwieFwiXTtcbiAgICB0aGlzLnBpbnMgPSB0aGlzLmtleXMgfHwgW1wic3dcIiwgXCJ5XCIsIFwieFwiLCBcInZjY1wiLCBcImduZFwiXTtcbiAgICB0aGlzLnBpbm5hbWUgPSB7c3c6IFwic3cxMlwifTtcbiAgICB0aGlzLnNob3J0TmFtZSA9IFwiam95U1wiO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG5cbiAgICBvYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsIFwiNXZcIik7XG5cbiAgICB0aGlzLmlvX3NpZ19zdyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnN3KTtcbiAgICB0aGlzLmFkX3ggPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy54KTtcbiAgICB0aGlzLmFkX3kgPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy55KTtcblxuICAgIHRoaXMuaW9fc2lnX3N3LnB1bGwoXCI1dlwiKTtcblxuICAgIGNvbnN0IHNlbGY6IGFueSA9IHRoaXM7XG4gICAgdGhpcy5hZF94LnN0YXJ0KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBzZWxmLnBvc2l0aW9uWCA9IHZhbHVlIC8gNS4wO1xuICAgICAgaWYgKHNlbGYub25jaGFuZ2V4KSB7XG4gICAgICAgIHNlbGYub25jaGFuZ2V4KHNlbGYucG9zaXRpb25YICogMiAtIDEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5hZF95LnN0YXJ0KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBzZWxmLnBvc2l0aW9uWSA9IHZhbHVlIC8gNS4wO1xuICAgICAgaWYgKHNlbGYub25jaGFuZ2V5KSB7XG4gICAgICAgIHNlbGYub25jaGFuZ2V5KHNlbGYucG9zaXRpb25ZICogMiAtIDEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5pb19zaWdfc3cuaW5wdXQoKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIHNlbGYuaXNQcmVzc2VkID0gdmFsdWUgPT09IGZhbHNlO1xuICAgICAgaWYgKHNlbGYub25jaGFuZ2Vzdykge1xuICAgICAgICBzZWxmLm9uY2hhbmdlc3codmFsdWUgPT09IGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpc1ByZXNzZWRXYWl0KCkge1xuICAgIGNvbnN0IHJldDogYW55ID0gYXdhaXQgdGhpcy5pb19zaWdfc3cuaW5wdXRXYWl0KCk7XG4gICAgcmV0dXJuIHJldCA9PT0gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0WFdhaXQoKSB7XG4gICAgY29uc3QgdmFsdWU6IGFueSA9IGF3YWl0IHRoaXMuYWRfeC5nZXRXYWl0KCk7XG4gICAgdGhpcy5wb3NpdGlvblggPSB2YWx1ZSAvIDUuMDtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvblggKiAyIC0gMTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRZV2FpdCgpIHtcbiAgICBjb25zdCB2YWx1ZTogYW55ID0gYXdhaXQgdGhpcy5hZF95LmdldFdhaXQoKTtcbiAgICB0aGlzLnBvc2l0aW9uWSA9IHZhbHVlIC8gNS4wO1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uWSAqIDIgLSAxO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEpveVN0aWNrO1xuIl19
