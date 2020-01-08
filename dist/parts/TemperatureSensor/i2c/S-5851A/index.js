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
//sensor response not found
class S5851A {
    constructor() {
        this.requiredKeys = ['vcc', 'gnd', 'adr0', 'adr1', 'adr_select'];
        this.keys = ['sda', 'scl', 'adr0', 'adr1', 'adr_select', 'i2c'];
    }
    static info() {
        return {
            name: 'S5851A',
        };
    }
    wired(obniz) {
        //params: pwr, gnd, sda, scl, adr0, adr1, adr_select
        this.io_adr0 = obniz.getIO(this.params.adr0);
        this.io_adr1 = obniz.getIO(this.params.adr1);
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        switch (this.params.adr_select) {
            case 8:
                this.io_adr0.output(false);
                this.io_adr1.output(false);
                this.address = 0x48;
                break;
            case 9:
                this.io_adr0.pull(null);
                this.io_adr1.output(false);
                this.address = 0x49;
                break;
            case 'A':
                this.io_adr0.output(true);
                this.io_adr1.output(false);
                this.address = 0x4a;
                break;
            case 'B':
                this.io_adr0.output(false);
                this.io_adr1.output(true);
                this.address = 0x4b;
                break;
            case 'C':
                this.io_adr0.pull(null);
                this.io_adr1.output(true);
                this.address = 0x4c;
                break;
            case 'D':
                this.io_adr0.output(true);
                this.io_adr1.output(true);
                this.address = 0x4d;
                break;
            case 'E':
                this.io_adr0.output(false);
                this.io_adr1.pull(null);
                this.address = 0x4e;
                break;
            case 'F':
                this.io_adr0.output(true);
                this.io_adr1.pull(null);
                this.address = 0x4f;
                break;
            default:
                this.io_adr0.output(false);
                this.io_adr1.output(false);
                this.address = 0x48;
                break;
        }
        console.log('i2c address=' + this.address);
        this.params.clock = this.params.clock || 400 * 1000; //for i2c
        this.params.mode = this.params.mode || 'master'; //for i2c
        this.params.pull = this.params.pull || '5v'; //for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        //obniz.i2c0.write(address, [0x20, 0x24]);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("gettempwait");
            //obniz.i2c0.write(address, [0x20, 0x24]);
            //obniz.i2c0.write(address, [0xE0, 0x00]);
            let ret = yield this.i2c0.readWait(this.address, 2);
            //console.log('ret:' + ret);
            let tempBin = ret[0].toString(2) + ('00000000' + ret[1].toString(2)).slice(-8);
            let temperature = -45 + 175 * (parseInt(tempBin, 2) / (65536 - 1));
            return temperature;
        });
    }
    getHumdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [0x20, 0x24]);
            this.i2c.write(this.address, [0xe0, 0x00]);
            let ret = yield this.i2c.readWait(this.address, 4);
            let humdBin = ret[2].toString(2) + ('00000000' + ret[3].toString(2)).slice(-8);
            let humidity = 100 * (parseInt(humdBin, 2) / (65536 - 1));
            return humidity;
        });
    }
}
if (typeof module === 'object') {
    module.exports = S5851A;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvUy01ODUxQS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsMkJBQTJCO0FBQzNCLE1BQU0sTUFBTTtJQUNWO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1Qsb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdELFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDOUIsS0FBSyxDQUFDO2dCQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJ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QUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0NBQ3pCIiwiZmlsZSI6InBhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL2kyYy9TLTU4NTFBL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9zZW5zb3IgcmVzcG9uc2Ugbm90IGZvdW5kXG5jbGFzcyBTNTg1MUEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsndmNjJywgJ2duZCcsICdhZHIwJywgJ2FkcjEnLCAnYWRyX3NlbGVjdCddO1xuICAgIHRoaXMua2V5cyA9IFsnc2RhJywgJ3NjbCcsICdhZHIwJywgJ2FkcjEnLCAnYWRyX3NlbGVjdCcsICdpMmMnXTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUzU4NTFBJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICAvL3BhcmFtczogcHdyLCBnbmQsIHNkYSwgc2NsLCBhZHIwLCBhZHIxLCBhZHJfc2VsZWN0XG4gICAgdGhpcy5pb19hZHIwID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuYWRyMCk7XG4gICAgdGhpcy5pb19hZHIxID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuYWRyMSk7XG5cbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgJzV2Jyk7XG5cbiAgICBzd2l0Y2ggKHRoaXMucGFyYW1zLmFkcl9zZWxlY3QpIHtcbiAgICAgIGNhc2UgODpcbiAgICAgICAgdGhpcy5pb19hZHIwLm91dHB1dChmYWxzZSk7XG4gICAgICAgIHRoaXMuaW9fYWRyMS5vdXRwdXQoZmFsc2UpO1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSAweDQ4O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgOTpcbiAgICAgICAgdGhpcy5pb19hZHIwLnB1bGwobnVsbCk7XG4gICAgICAgIHRoaXMuaW9fYWRyMS5vdXRwdXQoZmFsc2UpO1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSAweDQ5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0EnOlxuICAgICAgICB0aGlzLmlvX2FkcjAub3V0cHV0KHRydWUpO1xuICAgICAgICB0aGlzLmlvX2FkcjEub3V0cHV0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5hZGRyZXNzID0gMHg0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdCJzpcbiAgICAgICAgdGhpcy5pb19hZHIwLm91dHB1dChmYWxzZSk7XG4gICAgICAgIHRoaXMuaW9fYWRyMS5vdXRwdXQodHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NGI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQyc6XG4gICAgICAgIHRoaXMuaW9fYWRyMC5wdWxsKG51bGwpO1xuICAgICAgICB0aGlzLmlvX2FkcjEub3V0cHV0KHRydWUpO1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSAweDRjO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0QnOlxuICAgICAgICB0aGlzLmlvX2FkcjAub3V0cHV0KHRydWUpO1xuICAgICAgICB0aGlzLmlvX2FkcjEub3V0cHV0KHRydWUpO1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSAweDRkO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgICB0aGlzLmlvX2FkcjAub3V0cHV0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5pb19hZHIxLnB1bGwobnVsbCk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRic6XG4gICAgICAgIHRoaXMuaW9fYWRyMC5vdXRwdXQodHJ1ZSk7XG4gICAgICAgIHRoaXMuaW9fYWRyMS5wdWxsKG51bGwpO1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSAweDRmO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuaW9fYWRyMC5vdXRwdXQoZmFsc2UpO1xuICAgICAgICB0aGlzLmlvX2FkcjEub3V0cHV0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5hZGRyZXNzID0gMHg0ODtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdpMmMgYWRkcmVzcz0nICsgdGhpcy5hZGRyZXNzKTtcblxuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gdGhpcy5wYXJhbXMuY2xvY2sgfHwgNDAwICogMTAwMDsgLy9mb3IgaTJjXG4gICAgdGhpcy5wYXJhbXMubW9kZSA9IHRoaXMucGFyYW1zLm1vZGUgfHwgJ21hc3Rlcic7IC8vZm9yIGkyY1xuICAgIHRoaXMucGFyYW1zLnB1bGwgPSB0aGlzLnBhcmFtcy5wdWxsIHx8ICc1dic7IC8vZm9yIGkyY1xuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gICAgLy9vYm5pei5pMmMwLndyaXRlKGFkZHJlc3MsIFsweDIwLCAweDI0XSk7XG4gIH1cblxuICBhc3luYyBnZXRUZW1wV2FpdCgpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiZ2V0dGVtcHdhaXRcIik7XG4gICAgLy9vYm5pei5pMmMwLndyaXRlKGFkZHJlc3MsIFsweDIwLCAweDI0XSk7XG4gICAgLy9vYm5pei5pMmMwLndyaXRlKGFkZHJlc3MsIFsweEUwLCAweDAwXSk7XG4gICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuaTJjMC5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDIpO1xuICAgIC8vY29uc29sZS5sb2coJ3JldDonICsgcmV0KTtcbiAgICBsZXQgdGVtcEJpbiA9XG4gICAgICByZXRbMF0udG9TdHJpbmcoMikgKyAoJzAwMDAwMDAwJyArIHJldFsxXS50b1N0cmluZygyKSkuc2xpY2UoLTgpO1xuICAgIGxldCB0ZW1wZXJhdHVyZSA9IC00NSArIDE3NSAqIChwYXJzZUludCh0ZW1wQmluLCAyKSAvICg2NTUzNiAtIDEpKTtcbiAgICByZXR1cm4gdGVtcGVyYXR1cmU7XG4gIH1cblxuICBhc3luYyBnZXRIdW1kV2FpdCgpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFsweDIwLCAweDI0XSk7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbMHhlMCwgMHgwMF0pO1xuICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDQpO1xuICAgIGxldCBodW1kQmluID1cbiAgICAgIHJldFsyXS50b1N0cmluZygyKSArICgnMDAwMDAwMDAnICsgcmV0WzNdLnRvU3RyaW5nKDIpKS5zbGljZSgtOCk7XG4gICAgbGV0IGh1bWlkaXR5ID0gMTAwICogKHBhcnNlSW50KGh1bWRCaW4sIDIpIC8gKDY1NTM2IC0gMSkpO1xuICAgIHJldHVybiBodW1pZGl0eTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBTNTg1MUE7XG59XG4iXX0=
