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
class ADT7410 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'addressMode'];
        this.requiredKeys = ['addressMode'];
    }
    static info() {
        return {
            name: 'ADT7410',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        if (this.params.addressMode === 8) {
            this.address = 0x48;
        }
        else if (this.params.addressMode === 9) {
            this.address = 0x49;
        }
        this.params.clock = 400000;
        this.params.pull = '5v';
        this.params.mode = 'master';
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.i2c.readWait(this.address, 2);
            let tempBin = ret[0] << 8;
            tempBin |= ret[1];
            tempBin = tempBin >> 3;
            if (tempBin & 0x1000) {
                tempBin = tempBin - 8192;
            }
            return tempBin / 16;
        });
    }
}
if (typeof module === 'object') {
    module.exports = ADT7410;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvQURUNzQxMC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxPQUFPO0lBQ1g7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFeEQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxLQUFLLENBQUMsRUFBRTtZQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNyQjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBRTVCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUssV0FBVzs7WUFDZixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDO1lBRXZCLElBQUksT0FBTyxHQUFHLE1BQU0sRUFBRTtnQkFDcEIsT0FBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7YUFDMUI7WUFFRCxPQUFPLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDdEIsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUMxQiIsImZpbGUiOiJwYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvQURUNzQxMC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFEVDc0MTAge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdnbmQnLCAnc2RhJywgJ3NjbCcsICdhZGRyZXNzTW9kZSddO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gWydhZGRyZXNzTW9kZSddO1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdBRFQ3NDEwJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCAnNXYnKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5hZGRyZXNzTW9kZSA9PT0gOCkge1xuICAgICAgdGhpcy5hZGRyZXNzID0gMHg0ODtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLmFkZHJlc3NNb2RlID09PSA5KSB7XG4gICAgICB0aGlzLmFkZHJlc3MgPSAweDQ5O1xuICAgIH1cblxuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gNDAwMDAwO1xuICAgIHRoaXMucGFyYW1zLnB1bGwgPSAnNXYnO1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSAnbWFzdGVyJztcblxuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gIH1cblxuICBhc3luYyBnZXRUZW1wV2FpdCgpIHtcbiAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5hZGRyZXNzLCAyKTtcbiAgICBsZXQgdGVtcEJpbiA9IHJldFswXSA8PCA4O1xuICAgIHRlbXBCaW4gfD0gcmV0WzFdO1xuICAgIHRlbXBCaW4gPSB0ZW1wQmluID4+IDM7XG5cbiAgICBpZiAodGVtcEJpbiAmIDB4MTAwMCkge1xuICAgICAgdGVtcEJpbiA9IHRlbXBCaW4gLSA4MTkyO1xuICAgIH1cblxuICAgIHJldHVybiB0ZW1wQmluIC8gMTY7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gQURUNzQxMDtcbn1cbiJdfQ==
