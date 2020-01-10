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
class SHT31 {
    constructor() {
        this.requiredKeys = ["adr", "addressmode"];
        this.keys = [
            "vcc",
            "sda",
            "scl",
            "gnd",
            "adr",
            "addressmode",
            "i2c",
            "pull",
        ];
        this.ioKeys = ["vcc", "sda", "scl", "gnd", "adr"];
        this.commands = {};
        this.commands.softReset = [0x30, 0xa2];
        this.commands.highRepeatStreach = [0x2c, 0x06];
        this.commands.middleRepeatStreach = [0x2c, 0x0d];
        this.commands.lowRepeatStreach = [0x2c, 0x10];
        this.commands.highRepeat = [0x24, 0x00];
        this.commands.mediumRepeat = [0x24, 0x0b];
        this.commands.lowRepeat = [0x24, 0x16];
        this.waitTime = {};
        this.waitTime.wakeup = 1;
        this.waitTime.softReset = 1;
        this.waitTime.lowRepeat = 4;
        this.waitTime.mediumRepeat = 6;
        this.waitTime.highRepeat = 15;
        // not tested
        this.commands.readStatus = [0xf3, 0x2d];
    }
    static info() {
        return {
            name: "SHT31",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.io_adr = obniz.getIO(this.params.adr);
        if (this.params.addressmode === 4) {
            this.io_adr.output(false);
            this.address = 0x44;
        }
        else if (this.params.addressmode === 5) {
            this.io_adr.pull(null);
            this.address = 0x45;
        }
        this.params.clock = this.params.clock || 100 * 1000; // for i2c
        this.params.mode = this.params.mode || "master"; // for i2c
        this.params.pull = this.params.pull || "5v"; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        obniz.i2c0.write(this.address, this.commands.softReset);
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, this.commands.highRepeat);
            yield this.obniz.wait(this.waitTime.highRepeat);
            return yield this.i2c.readWait(this.address, 6);
        });
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllWait()).temperature;
        });
    }
    getHumdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllWait()).humidity;
        });
    }
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.getData();
            const tempBin = ret[0] * 256 + ret[1];
            const temperature = -45 + 175 * (tempBin / (65536 - 1));
            const humdBin = ret[3] * 256 + ret[4];
            const humidity = 100 * (humdBin / (65536 - 1));
            return { temperature, humidity };
        });
    }
}
exports.default = SHT31;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvU0hUMzEvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLEtBQUs7SUFtQlQ7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDVixLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLGFBQWE7WUFDYixLQUFLO1lBQ0wsTUFBTTtTQUNQLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZDLElB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VUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBRVksVUFBVTs7WUFDckIsTUFBTSxHQUFHLEdBQVEsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFdEMsTUFBTSxPQUFPLEdBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsTUFBTSxXQUFXLEdBQVEsQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0QsTUFBTSxPQUFPLEdBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsTUFBTSxRQUFRLEdBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsT0FBTyxFQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUMsQ0FBQztRQUNqQyxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLEtBQUssQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvaTJjL1NIVDMxL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU0hUMzEge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJTSFQzMVwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyBpb0tleXM6IGFueTtcbiAgcHVibGljIGNvbW1hbmRzOiBhbnk7XG4gIHB1YmxpYyB3YWl0VGltZTogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgaW9fYWRyOiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzOiBhbnk7XG4gIHB1YmxpYyBpMmM6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcImFkclwiLCBcImFkZHJlc3Ntb2RlXCJdO1xuICAgIHRoaXMua2V5cyA9IFtcbiAgICAgIFwidmNjXCIsXG4gICAgICBcInNkYVwiLFxuICAgICAgXCJzY2xcIixcbiAgICAgIFwiZ25kXCIsXG4gICAgICBcImFkclwiLFxuICAgICAgXCJhZGRyZXNzbW9kZVwiLFxuICAgICAgXCJpMmNcIixcbiAgICAgIFwicHVsbFwiLFxuICAgIF07XG5cbiAgICB0aGlzLmlvS2V5cyA9IFtcInZjY1wiLCBcInNkYVwiLCBcInNjbFwiLCBcImduZFwiLCBcImFkclwiXTtcbiAgICB0aGlzLmNvbW1hbmRzID0ge307XG4gICAgdGhpcy5jb21tYW5kcy5zb2Z0UmVzZXQgPSBbMHgzMCwgMHhhMl07XG4gICAgdGhpcy5jb21tYW5kcy5oaWdoUmVwZWF0U3RyZWFjaCA9IFsweDJjLCAweDA2XTtcbiAgICB0aGlzLmNvbW1hbmRzLm1pZGRsZVJlcGVhdFN0cmVhY2ggPSBbMHgyYywgMHgwZF07XG4gICAgdGhpcy5jb21tYW5kcy5sb3dSZXBlYXRTdHJlYWNoID0gWzB4MmMsIDB4MTBdO1xuICAgIHRoaXMuY29tbWFuZHMuaGlnaFJlcGVhdCA9IFsweDI0LCAweDAwXTtcbiAgICB0aGlzLmNvbW1hbmRzLm1lZGl1bVJlcGVhdCA9IFsweDI0LCAweDBiXTtcbiAgICB0aGlzLmNvbW1hbmRzLmxvd1JlcGVhdCA9IFsweDI0LCAweDE2XTtcblxuICAgIHRoaXMud2FpdFRpbWUgPSB7fTtcbiAgICB0aGlzLndhaXRUaW1lLndha2V1cCA9IDE7XG4gICAgdGhpcy53YWl0VGltZS5zb2Z0UmVzZXQgPSAxO1xuICAgIHRoaXMud2FpdFRpbWUubG93UmVwZWF0ID0gNDtcbiAgICB0aGlzLndhaXRUaW1lLm1lZGl1bVJlcGVhdCA9IDY7XG4gICAgdGhpcy53YWl0VGltZS5oaWdoUmVwZWF0ID0gMTU7XG5cbiAgICAvLyBub3QgdGVzdGVkXG4gICAgdGhpcy5jb21tYW5kcy5yZWFkU3RhdHVzID0gWzB4ZjMsIDB4MmRdO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5vYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsIFwiNXZcIik7XG4gICAgdGhpcy5pb19hZHIgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5hZHIpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmFkZHJlc3Ntb2RlID09PSA0KSB7XG4gICAgICB0aGlzLmlvX2Fkci5vdXRwdXQoZmFsc2UpO1xuICAgICAgdGhpcy5hZGRyZXNzID0gMHg0NDtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLmFkZHJlc3Ntb2RlID09PSA1KSB7XG4gICAgICB0aGlzLmlvX2Fkci5wdWxsKG51bGwpO1xuICAgICAgdGhpcy5hZGRyZXNzID0gMHg0NTtcbiAgICB9XG5cbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IHRoaXMucGFyYW1zLmNsb2NrIHx8IDEwMCAqIDEwMDA7IC8vIGZvciBpMmNcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gdGhpcy5wYXJhbXMubW9kZSB8fCBcIm1hc3RlclwiOyAvLyBmb3IgaTJjXG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IHRoaXMucGFyYW1zLnB1bGwgfHwgXCI1dlwiOyAvLyBmb3IgaTJjXG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgICBvYm5pei5pMmMwLndyaXRlKHRoaXMuYWRkcmVzcywgdGhpcy5jb21tYW5kcy5zb2Z0UmVzZXQpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldERhdGEoKSB7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCB0aGlzLmNvbW1hbmRzLmhpZ2hSZXBlYXQpO1xuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCh0aGlzLndhaXRUaW1lLmhpZ2hSZXBlYXQpO1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDYpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFRlbXBXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxXYWl0KCkpLnRlbXBlcmF0dXJlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEh1bWRXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxXYWl0KCkpLmh1bWlkaXR5O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEFsbFdhaXQoKSB7XG4gICAgY29uc3QgcmV0OiBhbnkgPSBhd2FpdCB0aGlzLmdldERhdGEoKTtcblxuICAgIGNvbnN0IHRlbXBCaW46IGFueSA9IHJldFswXSAqIDI1NiArIHJldFsxXTtcbiAgICBjb25zdCB0ZW1wZXJhdHVyZTogYW55ID0gLTQ1ICsgMTc1ICogKHRlbXBCaW4gLyAoNjU1MzYgLSAxKSk7XG5cbiAgICBjb25zdCBodW1kQmluOiBhbnkgPSByZXRbM10gKiAyNTYgKyByZXRbNF07XG4gICAgY29uc3QgaHVtaWRpdHk6IGFueSA9IDEwMCAqIChodW1kQmluIC8gKDY1NTM2IC0gMSkpO1xuICAgIHJldHVybiB7dGVtcGVyYXR1cmUsIGh1bWlkaXR5fTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTSFQzMTtcbiJdfQ==
