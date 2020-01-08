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
class AM2320 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'AM2320',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.address = 0x5c;
        this.params.pull = '5v';
        this.params.mode = 'master';
        this.params.clock = this.params.clock || 100 * 1000;
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let i2cOnerror = this.i2c.onerror;
            this.i2c.onerror = () => { };
            this.i2c.write(this.address, [0]); //wake
            this.obniz.wait(2);
            this.i2c.write(this.address, [0x03, 0x00, 0x04]);
            this.obniz.wait(2);
            this.i2c.write(this.address, [0x03, 0x00, 0x04]);
            let ret = yield this.i2c.readWait(this.address, 6);
            this.i2c.onerror = i2cOnerror;
            if (ret[0] != 3 || ret[1] != 4) {
                console.log('AM2320: Could not receive data correctly');
                return {};
            }
            let humidity = (ret[2] * 256 + ret[3]) / 10.0;
            let temperature = (ret[4] * 256 + ret[5]) / 10.0;
            return { temperature, humidity };
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
}
if (typeof module === 'object') {
    module.exports = AM2320;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvQU0yMzIwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE1BQU07SUFDVjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3BELElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUssVUFBVTs7WUFDZCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO1lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO1lBQzlCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7Z0JBQ3hELE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFDRCxJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzlDLElBQUksV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUNuQyxDQUFDO0tBQUE7SUFFSyxXQUFXOztZQUNmLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFSyxXQUFXOztZQUNmLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUM1QyxDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0NBQ3pCIiwiZmlsZSI6InBhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL2kyYy9BTTIzMjAvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBTTIzMjAge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdnbmQnLCAnc2RhJywgJ3NjbCcsICdpMmMnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtdO1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdBTTIzMjAnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICBvYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICc1dicpO1xuICAgIHRoaXMuYWRkcmVzcyA9IDB4NWM7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9ICc1dic7XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9ICdtYXN0ZXInO1xuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gdGhpcy5wYXJhbXMuY2xvY2sgfHwgMTAwICogMTAwMDtcbiAgICB0aGlzLmkyYyA9IG9ibml6LmdldEkyQ1dpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsV2FpdCgpIHtcbiAgICBsZXQgaTJjT25lcnJvciA9IHRoaXMuaTJjLm9uZXJyb3I7XG4gICAgdGhpcy5pMmMub25lcnJvciA9ICgpID0+IHt9O1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgWzBdKTsgLy93YWtlXG4gICAgdGhpcy5vYm5pei53YWl0KDIpO1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgWzB4MDMsIDB4MDAsIDB4MDRdKTtcbiAgICB0aGlzLm9ibml6LndhaXQoMik7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbMHgwMywgMHgwMCwgMHgwNF0pO1xuICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDYpO1xuICAgIHRoaXMuaTJjLm9uZXJyb3IgPSBpMmNPbmVycm9yO1xuICAgIGlmIChyZXRbMF0gIT0gMyB8fCByZXRbMV0gIT0gNCkge1xuICAgICAgY29uc29sZS5sb2coJ0FNMjMyMDogQ291bGQgbm90IHJlY2VpdmUgZGF0YSBjb3JyZWN0bHknKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgbGV0IGh1bWlkaXR5ID0gKHJldFsyXSAqIDI1NiArIHJldFszXSkgLyAxMC4wO1xuICAgIGxldCB0ZW1wZXJhdHVyZSA9IChyZXRbNF0gKiAyNTYgKyByZXRbNV0pIC8gMTAuMDtcbiAgICByZXR1cm4geyB0ZW1wZXJhdHVyZSwgaHVtaWRpdHkgfTtcbiAgfVxuXG4gIGFzeW5jIGdldFRlbXBXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxXYWl0KCkpLnRlbXBlcmF0dXJlO1xuICB9XG5cbiAgYXN5bmMgZ2V0SHVtZFdhaXQoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmdldEFsbFdhaXQoKSkuaHVtaWRpdHk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gQU0yMzIwO1xufVxuIl19
