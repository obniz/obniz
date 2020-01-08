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
class SHT31 {
    constructor() {
        this.requiredKeys = ['adr', 'addressmode'];
        this.keys = [
            'vcc',
            'sda',
            'scl',
            'gnd',
            'adr',
            'addressmode',
            'i2c',
            'pull',
        ];
        this.ioKeys = ['vcc', 'sda', 'scl', 'gnd', 'adr'];
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
        //not tested
        this.commands.readStatus = [0xf3, 0x2d];
    }
    static info() {
        return {
            name: 'SHT31',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.io_adr = obniz.getIO(this.params.adr);
        if (this.params.addressmode === 4) {
            this.io_adr.output(false);
            this.address = 0x44;
        }
        else if (this.params.addressmode === 5) {
            this.io_adr.pull(null);
            this.address = 0x45;
        }
        this.params.clock = this.params.clock || 100 * 1000; //for i2c
        this.params.mode = this.params.mode || 'master'; //for i2c
        this.params.pull = this.params.pull || '5v'; //for i2c
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
            let ret = yield this.getData();
            let tempBin = ret[0] * 256 + ret[1];
            let temperature = -45 + 175 * (tempBin / (65536 - 1));
            let humdBin = ret[3] * 256 + ret[4];
            let humidity = 100 * (humdBin / (65536 - 1));
            return { temperature, humidity };
        });
    }
}
if (typeof module === 'object') {
    module.exports = SHT31;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvU0hUMzEvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sS0FBSztJQUNUO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxhQUFhO1lBQ2IsS0FBSztZQUNMLE1BQU07U0FDUCxDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV2QyxJQUFJ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LENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBRUssVUFBVTs7WUFDZCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUUvQixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0RCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ25DLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Q0FDeEIiLCJmaWxlIjoicGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvaTJjL1NIVDMxL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU0hUMzEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnYWRyJywgJ2FkZHJlc3Ntb2RlJ107XG4gICAgdGhpcy5rZXlzID0gW1xuICAgICAgJ3ZjYycsXG4gICAgICAnc2RhJyxcbiAgICAgICdzY2wnLFxuICAgICAgJ2duZCcsXG4gICAgICAnYWRyJyxcbiAgICAgICdhZGRyZXNzbW9kZScsXG4gICAgICAnaTJjJyxcbiAgICAgICdwdWxsJyxcbiAgICBdO1xuXG4gICAgdGhpcy5pb0tleXMgPSBbJ3ZjYycsICdzZGEnLCAnc2NsJywgJ2duZCcsICdhZHInXTtcbiAgICB0aGlzLmNvbW1hbmRzID0ge307XG4gICAgdGhpcy5jb21tYW5kcy5zb2Z0UmVzZXQgPSBbMHgzMCwgMHhhMl07XG4gICAgdGhpcy5jb21tYW5kcy5oaWdoUmVwZWF0U3RyZWFjaCA9IFsweDJjLCAweDA2XTtcbiAgICB0aGlzLmNvbW1hbmRzLm1pZGRsZVJlcGVhdFN0cmVhY2ggPSBbMHgyYywgMHgwZF07XG4gICAgdGhpcy5jb21tYW5kcy5sb3dSZXBlYXRTdHJlYWNoID0gWzB4MmMsIDB4MTBdO1xuICAgIHRoaXMuY29tbWFuZHMuaGlnaFJlcGVhdCA9IFsweDI0LCAweDAwXTtcbiAgICB0aGlzLmNvbW1hbmRzLm1lZGl1bVJlcGVhdCA9IFsweDI0LCAweDBiXTtcbiAgICB0aGlzLmNvbW1hbmRzLmxvd1JlcGVhdCA9IFsweDI0LCAweDE2XTtcblxuICAgIHRoaXMud2FpdFRpbWUgPSB7fTtcbiAgICB0aGlzLndhaXRUaW1lLndha2V1cCA9IDE7XG4gICAgdGhpcy53YWl0VGltZS5zb2Z0UmVzZXQgPSAxO1xuICAgIHRoaXMud2FpdFRpbWUubG93UmVwZWF0ID0gNDtcbiAgICB0aGlzLndhaXRUaW1lLm1lZGl1bVJlcGVhdCA9IDY7XG4gICAgdGhpcy53YWl0VGltZS5oaWdoUmVwZWF0ID0gMTU7XG5cbiAgICAvL25vdCB0ZXN0ZWRcbiAgICB0aGlzLmNvbW1hbmRzLnJlYWRTdGF0dXMgPSBbMHhmMywgMHgyZF07XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1NIVDMxJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5vYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICc1dicpO1xuICAgIHRoaXMuaW9fYWRyID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuYWRyKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5hZGRyZXNzbW9kZSA9PT0gNCkge1xuICAgICAgdGhpcy5pb19hZHIub3V0cHV0KGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NDQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5hZGRyZXNzbW9kZSA9PT0gNSkge1xuICAgICAgdGhpcy5pb19hZHIucHVsbChudWxsKTtcbiAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NDU7XG4gICAgfVxuXG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSB0aGlzLnBhcmFtcy5jbG9jayB8fCAxMDAgKiAxMDAwOyAvL2ZvciBpMmNcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gdGhpcy5wYXJhbXMubW9kZSB8fCAnbWFzdGVyJzsgLy9mb3IgaTJjXG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IHRoaXMucGFyYW1zLnB1bGwgfHwgJzV2JzsgLy9mb3IgaTJjXG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgICBvYm5pei5pMmMwLndyaXRlKHRoaXMuYWRkcmVzcywgdGhpcy5jb21tYW5kcy5zb2Z0UmVzZXQpO1xuICB9XG5cbiAgYXN5bmMgZ2V0RGF0YSgpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIHRoaXMuY29tbWFuZHMuaGlnaFJlcGVhdCk7XG4gICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KHRoaXMud2FpdFRpbWUuaGlnaFJlcGVhdCk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuYWRkcmVzcywgNik7XG4gIH1cblxuICBhc3luYyBnZXRUZW1wV2FpdCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0QWxsV2FpdCgpKS50ZW1wZXJhdHVyZTtcbiAgfVxuXG4gIGFzeW5jIGdldEh1bWRXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxXYWl0KCkpLmh1bWlkaXR5O1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsV2FpdCgpIHtcbiAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5nZXREYXRhKCk7XG5cbiAgICBsZXQgdGVtcEJpbiA9IHJldFswXSAqIDI1NiArIHJldFsxXTtcbiAgICBsZXQgdGVtcGVyYXR1cmUgPSAtNDUgKyAxNzUgKiAodGVtcEJpbiAvICg2NTUzNiAtIDEpKTtcblxuICAgIGxldCBodW1kQmluID0gcmV0WzNdICogMjU2ICsgcmV0WzRdO1xuICAgIGxldCBodW1pZGl0eSA9IDEwMCAqIChodW1kQmluIC8gKDY1NTM2IC0gMSkpO1xuICAgIHJldHVybiB7IHRlbXBlcmF0dXJlLCBodW1pZGl0eSB9O1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IFNIVDMxO1xufVxuIl19
