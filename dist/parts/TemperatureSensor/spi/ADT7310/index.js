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
class ADT7310 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'frequency', 'din', 'dout', 'clk', 'spi'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'ADT7310',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.params.mode = this.params.mode || 'master';
        this.params.frequency = this.params.frequency || 500000;
        this.params.mosi = this.params.din;
        this.params.miso = this.params.dout;
        this.spi = this.obniz.getSpiWithConfig(this.params);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.spi.writeWait([0x54]); //send before each commands for stable
            yield this.obniz.wait(200);
            let ret = yield this.spi.writeWait([0x00, 0x00]);
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
    module.exports = ADT7310;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9zcGkvQURUNzMxMC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxPQUFPO0lBQ1g7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUssV0FBVzs7WUFDZixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNDQUFzQztZQUN4RSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUM7WUFFdkIsSUFBSSxPQUFPLEdBQUcsTUFBTSxFQUFFO2dCQUNwQixPQUFPLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQzthQUMxQjtZQUVELE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0NBQzFCIiwiZmlsZSI6InBhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL3NwaS9BRFQ3MzEwL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQURUNzMxMCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsndmNjJywgJ2duZCcsICdmcmVxdWVuY3knLCAnZGluJywgJ2RvdXQnLCAnY2xrJywgJ3NwaSddO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW107XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0FEVDczMTAnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcblxuICAgIG9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgJzV2Jyk7XG5cbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gdGhpcy5wYXJhbXMubW9kZSB8fCAnbWFzdGVyJztcbiAgICB0aGlzLnBhcmFtcy5mcmVxdWVuY3kgPSB0aGlzLnBhcmFtcy5mcmVxdWVuY3kgfHwgNTAwMDAwO1xuICAgIHRoaXMucGFyYW1zLm1vc2kgPSB0aGlzLnBhcmFtcy5kaW47XG4gICAgdGhpcy5wYXJhbXMubWlzbyA9IHRoaXMucGFyYW1zLmRvdXQ7XG4gICAgdGhpcy5zcGkgPSB0aGlzLm9ibml6LmdldFNwaVdpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VGVtcFdhaXQoKSB7XG4gICAgYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KFsweDU0XSk7IC8vc2VuZCBiZWZvcmUgZWFjaCBjb21tYW5kcyBmb3Igc3RhYmxlXG4gICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDIwMCk7XG4gICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuc3BpLndyaXRlV2FpdChbMHgwMCwgMHgwMF0pO1xuICAgIGxldCB0ZW1wQmluID0gcmV0WzBdIDw8IDg7XG4gICAgdGVtcEJpbiB8PSByZXRbMV07XG4gICAgdGVtcEJpbiA9IHRlbXBCaW4gPj4gMztcblxuICAgIGlmICh0ZW1wQmluICYgMHgxMDAwKSB7XG4gICAgICB0ZW1wQmluID0gdGVtcEJpbiAtIDgxOTI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXBCaW4gLyAxNjtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBBRFQ3MzEwO1xufVxuIl19
