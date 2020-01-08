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
class HCSR04 {
    constructor() {
        this.keys = ['vcc', 'trigger', 'echo', 'gnd'];
        this.requiredKeys = ['vcc', 'trigger', 'echo'];
        this._unit = 'mm';
        this.reset_alltime = false;
        this.temp = 15;
    }
    static info() {
        return {
            name: 'HC-SR04',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(null, this.params.gnd, '5v');
        this.vccIO = obniz.getIO(this.params.vcc);
        this.trigger = this.params.trigger;
        this.echo = this.params.echo;
        this.vccIO.drive('5v');
        this.vccIO.output(true);
        this.obniz.wait(100);
    }
    measure(callback) {
        let self = this;
        this.obniz.measure.echo({
            io_pulse: this.trigger,
            io_echo: this.echo,
            pulse: 'positive',
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
                let distance = undefined;
                for (let i = 0; i < edges.length - 1; i++) {
                    // HCSR04's output of io_echo is initially high when trigger is finshed
                    if (edges[i].edge === true) {
                        const time = (edges[i + 1].timing - edges[i].timing) / 1000; // (1/4000 * 8) + is needed??
                        distance =
                            (time / 2) * 20.055 * Math.sqrt(this.temp + 273.15) * 1000;
                        if (self._unit === 'inch') {
                            distance = distance * 0.0393701;
                        }
                    }
                }
                if (typeof callback === 'function') {
                    callback(distance);
                }
            }),
        });
    }
    measureWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.measure(distance => {
                    resolve(distance);
                });
            });
        });
    }
    unit(unit) {
        if (unit === 'mm') {
            this._unit = 'mm';
        }
        else if (unit === 'inch') {
            this._unit = 'inch';
        }
        else {
            throw new Error('HCSR04: unknown unit ' + unit);
        }
    }
}
if (typeof module === 'object') {
    module.exports = HCSR04;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXN0YW5jZVNlbnNvci9IQy1TUjA0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE1BQU07SUFDVjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUUzQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUU3QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLENB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Qy1TUjA0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSENTUjA0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gWyd2Y2MnLCAndHJpZ2dlcicsICdlY2hvJywgJ2duZCddO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gWyd2Y2MnLCAndHJpZ2dlcicsICdlY2hvJ107XG5cbiAgICB0aGlzLl91bml0ID0gJ21tJztcbiAgICB0aGlzLnJlc2V0X2FsbHRpbWUgPSBmYWxzZTtcblxuICAgIHRoaXMudGVtcCA9IDE1O1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdIQy1TUjA0JyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG5cbiAgICBvYm5pei5zZXRWY2NHbmQobnVsbCwgdGhpcy5wYXJhbXMuZ25kLCAnNXYnKTtcblxuICAgIHRoaXMudmNjSU8gPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy52Y2MpO1xuICAgIHRoaXMudHJpZ2dlciA9IHRoaXMucGFyYW1zLnRyaWdnZXI7XG4gICAgdGhpcy5lY2hvID0gdGhpcy5wYXJhbXMuZWNobztcblxuICAgIHRoaXMudmNjSU8uZHJpdmUoJzV2Jyk7XG4gICAgdGhpcy52Y2NJTy5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG4gIH1cblxuICBtZWFzdXJlKGNhbGxiYWNrKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMub2JuaXoubWVhc3VyZS5lY2hvKHtcbiAgICAgIGlvX3B1bHNlOiB0aGlzLnRyaWdnZXIsXG4gICAgICBpb19lY2hvOiB0aGlzLmVjaG8sXG4gICAgICBwdWxzZTogJ3Bvc2l0aXZlJyxcbiAgICAgIHB1bHNlX3dpZHRoOiAwLjAxMSxcbiAgICAgIG1lYXN1cmVfZWRnZXM6IDMsXG4gICAgICB0aW1lb3V0OiAoMTAgLyAzNDApICogMTAwMCxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyBlZGdlcyA9PiB7XG4gICAgICAgIGlmICh0aGlzLnJlc2V0X2FsbHRpbWUpIHtcbiAgICAgICAgICB0aGlzLnZjY0lPLm91dHB1dChmYWxzZSk7XG4gICAgICAgICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG4gICAgICAgICAgdGhpcy52Y2NJTy5vdXRwdXQodHJ1ZSk7XG4gICAgICAgICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgIC8vIEhDU1IwNCdzIG91dHB1dCBvZiBpb19lY2hvIGlzIGluaXRpYWxseSBoaWdoIHdoZW4gdHJpZ2dlciBpcyBmaW5zaGVkXG4gICAgICAgICAgaWYgKGVkZ2VzW2ldLmVkZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSAoZWRnZXNbaSArIDFdLnRpbWluZyAtIGVkZ2VzW2ldLnRpbWluZykgLyAxMDAwOyAvLyAoMS80MDAwICogOCkgKyBpcyBuZWVkZWQ/P1xuICAgICAgICAgICAgZGlzdGFuY2UgPVxuICAgICAgICAgICAgICAodGltZSAvIDIpICogMjAuMDU1ICogTWF0aC5zcXJ0KHRoaXMudGVtcCArIDI3My4xNSkgKiAxMDAwO1xuICAgICAgICAgICAgaWYgKHNlbGYuX3VuaXQgPT09ICdpbmNoJykge1xuICAgICAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlICogMC4wMzkzNzAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2FsbGJhY2soZGlzdGFuY2UpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbWVhc3VyZVdhaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5tZWFzdXJlKGRpc3RhbmNlID0+IHtcbiAgICAgICAgcmVzb2x2ZShkaXN0YW5jZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHVuaXQodW5pdCkge1xuICAgIGlmICh1bml0ID09PSAnbW0nKSB7XG4gICAgICB0aGlzLl91bml0ID0gJ21tJztcbiAgICB9IGVsc2UgaWYgKHVuaXQgPT09ICdpbmNoJykge1xuICAgICAgdGhpcy5fdW5pdCA9ICdpbmNoJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIQ1NSMDQ6IHVua25vd24gdW5pdCAnICsgdW5pdCk7XG4gICAgfVxuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IEhDU1IwNDtcbn1cbiJdfQ==
