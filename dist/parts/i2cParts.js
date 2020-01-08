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
class I2cPartsAbstruct {
    constructor() {
        this.keys = ['gnd', 'vcc', 'sda', 'scl', 'i2c', 'vcc'];
        this.requiredKeys = [];
        this.i2cinfo = this.i2cInfo();
        this.address = this.i2cinfo.address;
    }
    i2cInfo() {
        throw new Error('abstruct class');
        // eslint-disable-next-line no-unreachable
        return {
            address: 0x00,
            clock: 100000,
            voltage: '3v',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.i2cinfo.voltage);
        this.params.clock = this.i2cinfo.clock;
        this.params.pull = this.i2cinfo.voltage;
        this.params.mode = 'master';
        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }
    char2short(val1, val2) {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, val1);
        dv.setUint8(1, val2);
        return dv.getInt16(0, false);
    }
    readWait(command, length) {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [command]);
            return yield this.i2c.readWait(this.address, length);
        });
    }
    readUint16Wait(command, length) {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [command]);
            return yield this.i2c.readWait(this.address, length);
        });
    }
    write(command, buf) {
        if (!Array.isArray(buf)) {
            buf = [buf];
        }
        this.i2c.write(this.address, [command, ...buf]);
    }
}
module.exports = I2cPartsAbstruct;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9pMmNQYXJ0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxnQkFBZ0I7SUFDcEI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ3RDLENBQUM7SUFDRCxPQUFPO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRWxDLDBDQUEwQztRQUMxQyxPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUk7WUFDYixLQUFLLEVBQUUsTUFBTTtZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDNUIsYUFBYTtRQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSTtRQUNuQixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFSyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU07O1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELENBQUM7S0FBQTtJQUVLLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTTs7WUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDeEMsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkQsQ0FBQztLQUFBO0lBRUQsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHO1FBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2I7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0Y7QUFDRCxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6InBhcnRzL2kyY1BhcnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSTJjUGFydHNBYnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsnZ25kJywgJ3ZjYycsICdzZGEnLCAnc2NsJywgJ2kyYycsICd2Y2MnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtdO1xuXG4gICAgdGhpcy5pMmNpbmZvID0gdGhpcy5pMmNJbmZvKCk7XG4gICAgdGhpcy5hZGRyZXNzID0gdGhpcy5pMmNpbmZvLmFkZHJlc3M7XG4gIH1cbiAgaTJjSW5mbygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Fic3RydWN0IGNsYXNzJyk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5yZWFjaGFibGVcbiAgICByZXR1cm4ge1xuICAgICAgYWRkcmVzczogMHgwMCxcbiAgICAgIGNsb2NrOiAxMDAwMDAsXG4gICAgICB2b2x0YWdlOiAnM3YnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcblxuICAgIG9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgdGhpcy5pMmNpbmZvLnZvbHRhZ2UpO1xuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gdGhpcy5pMmNpbmZvLmNsb2NrO1xuICAgIHRoaXMucGFyYW1zLnB1bGwgPSB0aGlzLmkyY2luZm8udm9sdGFnZTtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gJ21hc3Rlcic7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuaTJjID0gdGhpcy5vYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgfVxuXG4gIGNoYXIyc2hvcnQodmFsMSwgdmFsMikge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGR2LnNldFVpbnQ4KDAsIHZhbDEpO1xuICAgIGR2LnNldFVpbnQ4KDEsIHZhbDIpO1xuICAgIHJldHVybiBkdi5nZXRJbnQxNigwLCBmYWxzZSk7XG4gIH1cblxuICBhc3luYyByZWFkV2FpdChjb21tYW5kLCBsZW5ndGgpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFtjb21tYW5kXSk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuYWRkcmVzcywgbGVuZ3RoKTtcbiAgfVxuXG4gIGFzeW5jIHJlYWRVaW50MTZXYWl0KGNvbW1hbmQsIGxlbmd0aCkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgW2NvbW1hbmRdKTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5hZGRyZXNzLCBsZW5ndGgpO1xuICB9XG5cbiAgd3JpdGUoY29tbWFuZCwgYnVmKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJ1ZikpIHtcbiAgICAgIGJ1ZiA9IFtidWZdO1xuICAgIH1cbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFtjb21tYW5kLCAuLi5idWZdKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBJMmNQYXJ0c0Fic3RydWN0O1xuIl19
