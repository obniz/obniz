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
class D6T44L {
    constructor() {
        this.requiredKeys = [];
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'clock'];
        this.address = 0x0a;
        this.ioKeys = ['vcc', 'gnd', 'sda', 'scl'];
        this.commands = {};
        this.commands.read_data = [0x4c];
    }
    static info() {
        return {
            name: 'D6T44L',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.params.clock = this.params.clock || 100 * 1000; //for i2c
        this.params.mode = this.params.mode || 'master'; //for i2c
        this.params.pull = this.params.pull || null; //for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(50);
    }
    getOnePixWait(pixcel) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.getAllPixWait();
            return data[pixcel];
        });
    }
    getAllPixWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [0x4c]);
            //await obniz.wait(160);
            let raw = yield this.i2c.readWait(this.address, 35);
            let data = [];
            for (let i = 0; i < 16; i++) {
                data[i] = parseFloat(((raw[i * 2 + 2] + (raw[i * 2 + 3] << 8)) * 0.1).toFixed(1));
            }
            return data;
        });
    }
}
if (typeof module === 'object') {
    module.exports = D6T44L;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvRDZUNDRML2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE1BQU07SUFDVjtRQUNFLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxTQUFTO1FBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLFNBQVM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsU0FBUztRQUN0RCxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVLLGFBQWEsQ0FBQyxNQUFNOztZQUN4QixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN0QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFSyxhQUFhOztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQyx3QkFBd0I7WUFDeEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXBELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUVkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQ2xCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUM1RCxDQUFDO2FBQ0g7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Q0FDekIiLCJmaWxlIjoicGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvaTJjL0Q2VDQ0TC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEQ2VDQ0TCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW107XG4gICAgdGhpcy5rZXlzID0gWyd2Y2MnLCAnZ25kJywgJ3NkYScsICdzY2wnLCAnY2xvY2snXTtcbiAgICB0aGlzLmFkZHJlc3MgPSAweDBhO1xuXG4gICAgdGhpcy5pb0tleXMgPSBbJ3ZjYycsICdnbmQnLCAnc2RhJywgJ3NjbCddO1xuICAgIHRoaXMuY29tbWFuZHMgPSB7fTtcbiAgICB0aGlzLmNvbW1hbmRzLnJlYWRfZGF0YSA9IFsweDRjXTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnRDZUNDRMJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5vYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICc1dicpO1xuXG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSB0aGlzLnBhcmFtcy5jbG9jayB8fCAxMDAgKiAxMDAwOyAvL2ZvciBpMmNcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gdGhpcy5wYXJhbXMubW9kZSB8fCAnbWFzdGVyJzsgLy9mb3IgaTJjXG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IHRoaXMucGFyYW1zLnB1bGwgfHwgbnVsbDsgLy9mb3IgaTJjXG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgICB0aGlzLm9ibml6LndhaXQoNTApO1xuICB9XG5cbiAgYXN5bmMgZ2V0T25lUGl4V2FpdChwaXhjZWwpIHtcbiAgICBsZXQgZGF0YSA9IGF3YWl0IHRoaXMuZ2V0QWxsUGl4V2FpdCgpO1xuICAgIHJldHVybiBkYXRhW3BpeGNlbF07XG4gIH1cblxuICBhc3luYyBnZXRBbGxQaXhXYWl0KCkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgWzB4NGNdKTtcbiAgICAvL2F3YWl0IG9ibml6LndhaXQoMTYwKTtcbiAgICBsZXQgcmF3ID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5hZGRyZXNzLCAzNSk7XG5cbiAgICBsZXQgZGF0YSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICBkYXRhW2ldID0gcGFyc2VGbG9hdChcbiAgICAgICAgKChyYXdbaSAqIDIgKyAyXSArIChyYXdbaSAqIDIgKyAzXSA8PCA4KSkgKiAwLjEpLnRvRml4ZWQoMSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRDZUNDRMO1xufVxuIl19
