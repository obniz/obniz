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
class HCSR04 {
    constructor() {
        this.keys = ["vcc", "trigger", "echo", "gnd"];
        this.requiredKeys = ["vcc", "trigger", "echo"];
        this._unit = "mm";
        this.reset_alltime = false;
        this.temp = 15;
    }
    static info() {
        return {
            name: "HC-SR04",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(null, this.params.gnd, "5v");
        this.vccIO = obniz.getIO(this.params.vcc);
        this.trigger = this.params.trigger;
        this.echo = this.params.echo;
        this.vccIO.drive("5v");
        this.vccIO.output(true);
        this.obniz.wait(100);
    }
    measure(callback) {
        const self = this;
        this.obniz.measure.echo({
            io_pulse: this.trigger,
            io_echo: this.echo,
            pulse: "positive",
            pulse_width: 0.011,
            measure_edges: 3,
            timeout: (10 / 340) * 1000,
            callback: (edges) => __awaiter(this, void 0, void 0, function* () {
                if (this.reset_alltime) {
                    this.vccIO.output(false);
                    this.obniz.wait(100);
                    this.vccIO.output(true);
                    this.obniz.wait(100);
                }
                let distance;
                for (let i = 0; i < edges.length - 1; i++) {
                    // HCSR04's output of io_echo is initially high when trigger is finshed
                    if (edges[i].edge === true) {
                        const time = (edges[i + 1].timing - edges[i].timing) / 1000; // (1/4000 * 8) + is needed??
                        distance =
                            (time / 2) * 20.055 * Math.sqrt(this.temp + 273.15) * 1000;
                        if (self._unit === "inch") {
                            distance = distance * 0.0393701;
                        }
                    }
                }
                if (typeof callback === "function") {
                    callback(distance);
                }
            }),
        });
    }
    measureWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.measure((distance) => {
                    resolve(distance);
                });
            });
        });
    }
    unit(unit) {
        if (unit === "mm") {
            this._unit = "mm";
        }
        else if (unit === "inch") {
            this._unit = "inch";
        }
        else {
            throw new Error("HCSR04: unknown unit " + unit);
        }
    }
}
exports.default = HCSR04;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXN0YW5jZVNlbnNvci9IQy1TUjA0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxNQUFNO0lBbUJWO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBRTNCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUF6Qk0sTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBdUJNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUU3QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRU0sT0FBTyxDQUFDLFFBQWE7UUFDMUIsTUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN0QixRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2xCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJO1lBQzFCLFFBQVEsRUFBRSxDQUFPLEtBQVUsRUFBRSxFQUFFO2dCQUM3QixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN0QjtnQkFDRCxJQUFJLFFBQWEsQ0FBQztnQkFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN6Qyx1RUFBdUU7b0JBQ3ZFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7d0JBQzFCLE1BQU0sSUFBSSxHQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLDZCQUE2Qjt3QkFDL0YsUUFBUTs0QkFDTixDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQzt3QkFDN0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQU0sRUFBRTs0QkFDekIsUUFBUSxHQUFHLFFBQVEsR0FBRyxTQUFTLENBQUM7eUJBQ2pDO3FCQUNGO2lCQUNGO2dCQUNELElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO29CQUNsQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3BCO1lBQ0gsQ0FBQyxDQUFBO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVZLFdBQVc7O1lBQ3RCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO29CQUM3QixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTSxJQUFJLENBQUMsSUFBUztRQUNuQixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbkI7YUFBTSxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7U0FDckI7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxNQUFNLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL0Rpc3RhbmNlU2Vuc29yL0hDLVNSMDQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIQ1NSMDQge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJIQy1TUjA0XCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZEtleXM6IGFueTtcbiAgcHVibGljIF91bml0OiBhbnk7XG4gIHB1YmxpYyByZXNldF9hbGx0aW1lOiBhbnk7XG4gIHB1YmxpYyB0ZW1wOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyB2Y2NJTzogYW55O1xuICBwdWJsaWMgdHJpZ2dlcjogYW55O1xuICBwdWJsaWMgZWNobzogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcInZjY1wiLCBcInRyaWdnZXJcIiwgXCJlY2hvXCIsIFwiZ25kXCJdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW1widmNjXCIsIFwidHJpZ2dlclwiLCBcImVjaG9cIl07XG5cbiAgICB0aGlzLl91bml0ID0gXCJtbVwiO1xuICAgIHRoaXMucmVzZXRfYWxsdGltZSA9IGZhbHNlO1xuXG4gICAgdGhpcy50ZW1wID0gMTU7XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcblxuICAgIG9ibml6LnNldFZjY0duZChudWxsLCB0aGlzLnBhcmFtcy5nbmQsIFwiNXZcIik7XG5cbiAgICB0aGlzLnZjY0lPID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMudmNjKTtcbiAgICB0aGlzLnRyaWdnZXIgPSB0aGlzLnBhcmFtcy50cmlnZ2VyO1xuICAgIHRoaXMuZWNobyA9IHRoaXMucGFyYW1zLmVjaG87XG5cbiAgICB0aGlzLnZjY0lPLmRyaXZlKFwiNXZcIik7XG4gICAgdGhpcy52Y2NJTy5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG4gIH1cblxuICBwdWJsaWMgbWVhc3VyZShjYWxsYmFjazogYW55KSB7XG4gICAgY29uc3Qgc2VsZjogYW55ID0gdGhpcztcbiAgICB0aGlzLm9ibml6Lm1lYXN1cmUuZWNobyh7XG4gICAgICBpb19wdWxzZTogdGhpcy50cmlnZ2VyLFxuICAgICAgaW9fZWNobzogdGhpcy5lY2hvLFxuICAgICAgcHVsc2U6IFwicG9zaXRpdmVcIixcbiAgICAgIHB1bHNlX3dpZHRoOiAwLjAxMSxcbiAgICAgIG1lYXN1cmVfZWRnZXM6IDMsXG4gICAgICB0aW1lb3V0OiAoMTAgLyAzNDApICogMTAwMCxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoZWRnZXM6IGFueSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5yZXNldF9hbGx0aW1lKSB7XG4gICAgICAgICAgdGhpcy52Y2NJTy5vdXRwdXQoZmFsc2UpO1xuICAgICAgICAgIHRoaXMub2JuaXoud2FpdCgxMDApO1xuICAgICAgICAgIHRoaXMudmNjSU8ub3V0cHV0KHRydWUpO1xuICAgICAgICAgIHRoaXMub2JuaXoud2FpdCgxMDApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkaXN0YW5jZTogYW55O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgIC8vIEhDU1IwNCdzIG91dHB1dCBvZiBpb19lY2hvIGlzIGluaXRpYWxseSBoaWdoIHdoZW4gdHJpZ2dlciBpcyBmaW5zaGVkXG4gICAgICAgICAgaWYgKGVkZ2VzW2ldLmVkZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWU6IGFueSA9IChlZGdlc1tpICsgMV0udGltaW5nIC0gZWRnZXNbaV0udGltaW5nKSAvIDEwMDA7IC8vICgxLzQwMDAgKiA4KSArIGlzIG5lZWRlZD8/XG4gICAgICAgICAgICBkaXN0YW5jZSA9XG4gICAgICAgICAgICAgICh0aW1lIC8gMikgKiAyMC4wNTUgKiBNYXRoLnNxcnQodGhpcy50ZW1wICsgMjczLjE1KSAqIDEwMDA7XG4gICAgICAgICAgICBpZiAoc2VsZi5fdW5pdCA9PT0gXCJpbmNoXCIpIHtcbiAgICAgICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZSAqIDAuMDM5MzcwMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgY2FsbGJhY2soZGlzdGFuY2UpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIG1lYXN1cmVXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55KSA9PiB7XG4gICAgICB0aGlzLm1lYXN1cmUoKGRpc3RhbmNlOiBhbnkpID0+IHtcbiAgICAgICAgcmVzb2x2ZShkaXN0YW5jZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1bml0KHVuaXQ6IGFueSkge1xuICAgIGlmICh1bml0ID09PSBcIm1tXCIpIHtcbiAgICAgIHRoaXMuX3VuaXQgPSBcIm1tXCI7XG4gICAgfSBlbHNlIGlmICh1bml0ID09PSBcImluY2hcIikge1xuICAgICAgdGhpcy5fdW5pdCA9IFwiaW5jaFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIQ1NSMDQ6IHVua25vd24gdW5pdCBcIiArIHVuaXQpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIQ1NSMDQ7XG4iXX0=
