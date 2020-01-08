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
class _24LC256 {
    constructor() {
        this.requiredKeys = ['address'];
        this.keys = ['sda', 'scl', 'clock', 'pull', 'i2c', 'address'];
    }
    static info() {
        return {
            name: '24LC256',
        };
    }
    wired(obniz) {
        this.params.mode = this.params.mode || 'master'; //for i2c
        this.params.clock = this.params.clock || 400 * 1000; //for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    // Module functions
    set(address, data) {
        let array = [];
        array.push((address >> 8) & 0xff);
        array.push(address & 0xff);
        array.push.apply(array, data);
        this.i2c.write(0x50, array);
        this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
    }
    getWait(address, length) {
        return __awaiter(this, void 0, void 0, function* () {
            let array = [];
            array.push((address >> 8) & 0xff);
            array.push(address & 0xff);
            this.i2c.write(0x50, array);
            return yield this.i2c.readWait(0x50, length);
        });
    }
}
if (typeof module === 'object') {
    module.exports = _24LC256;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9NZW1vcnkvMjRMQzI1Ni9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxRQUFRO0lBQ1o7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxTQUFTO1FBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxTQUFTO1FBQzlELElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsbUJBQW1CO0lBRW5CLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSTtRQUNmLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4REFBOEQ7SUFDeEYsQ0FBQztJQUVLLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTTs7WUFDM0IsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUIsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0NBQzNCIiwiZmlsZSI6InBhcnRzL01lbW9yeS8yNExDMjU2L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgXzI0TEMyNTYge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnYWRkcmVzcyddO1xuICAgIHRoaXMua2V5cyA9IFsnc2RhJywgJ3NjbCcsICdjbG9jaycsICdwdWxsJywgJ2kyYycsICdhZGRyZXNzJ107XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJzI0TEMyNTYnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSB0aGlzLnBhcmFtcy5tb2RlIHx8ICdtYXN0ZXInOyAvL2ZvciBpMmNcbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IHRoaXMucGFyYW1zLmNsb2NrIHx8IDQwMCAqIDEwMDA7IC8vZm9yIGkyY1xuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gIH1cblxuICAvLyBNb2R1bGUgZnVuY3Rpb25zXG5cbiAgc2V0KGFkZHJlc3MsIGRhdGEpIHtcbiAgICBsZXQgYXJyYXkgPSBbXTtcbiAgICBhcnJheS5wdXNoKChhZGRyZXNzID4+IDgpICYgMHhmZik7XG4gICAgYXJyYXkucHVzaChhZGRyZXNzICYgMHhmZik7XG4gICAgYXJyYXkucHVzaC5hcHBseShhcnJheSwgZGF0YSk7XG4gICAgdGhpcy5pMmMud3JpdGUoMHg1MCwgYXJyYXkpO1xuICAgIHRoaXMub2JuaXoud2FpdCg0ICsgMSk7IC8vIHdyaXRlIGN5Y2xlIHRpbWUgPSA0bXMgZm9yIDI0WFgwMCwgMS41bXMgZm9yIDI0QzAxQywgMjRDMDJDXG4gIH1cblxuICBhc3luYyBnZXRXYWl0KGFkZHJlc3MsIGxlbmd0aCkge1xuICAgIGxldCBhcnJheSA9IFtdO1xuICAgIGFycmF5LnB1c2goKGFkZHJlc3MgPj4gOCkgJiAweGZmKTtcbiAgICBhcnJheS5wdXNoKGFkZHJlc3MgJiAweGZmKTtcbiAgICB0aGlzLmkyYy53cml0ZSgweDUwLCBhcnJheSk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KDB4NTAsIGxlbmd0aCk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gXzI0TEMyNTY7XG59XG4iXX0=
