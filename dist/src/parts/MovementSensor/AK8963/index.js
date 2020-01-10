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
class AK8963 {
    constructor() {
        this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "address", "adb_cycle"];
        this.required = [];
    }
    static info() {
        return {
            name: "AK8963",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        this._address = this.params.address || 0x0c;
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.setConfig(this.params.adc_cycle || 8);
    }
    setConfig(ADC_cycle) {
        switch (ADC_cycle) {
            case 8:
                this.i2c.write(this._address, [0x0a, 0x12]);
                break;
            case 100:
                this.i2c.write(this._address, [0x0a, 0x16]);
                break;
            default:
                throw new Error("ADC_cycle variable 8,100 setting");
        }
        this._adc_cycle = ADC_cycle;
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this._address, [0x03]); // request AK8963 data
            const raw_data_AK8963 = yield this.i2c.readWait(this._address, 7); // read 7byte(read mag_data[6] to refresh)
            return {
                x: this.char2short(raw_data_AK8963[0], raw_data_AK8963[1]),
                y: this.char2short(raw_data_AK8963[2], raw_data_AK8963[3]),
                z: this.char2short(raw_data_AK8963[4], raw_data_AK8963[5]),
            };
        });
    }
    char2short(valueH, valueL) {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, valueH);
        dv.setUint8(1, valueL);
        return dv.getInt16(0, false);
    }
}
exports.default = AK8963;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9BSzg5NjMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE1BQU07SUFnQlY7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQWpCTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO0lBQ0osQ0FBQztJQWVNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLFNBQVMsQ0FBQyxTQUFjO1FBQzdCLFFBQVEsU0FBUyxFQUFFO1lBQ2pCLEtBQUssQ0FBQztnQkFDSixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUIsQ0FBQztJQUVZLE9BQU87O1lBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCO1lBQzdELE1BQU0sZUFBZSxHQUFRLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUEwQztZQUNsSCxPQUFPO2dCQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0QsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVNLFVBQVUsQ0FBQyxNQUFXLEVBQUUsTUFBVztRQUN4QyxNQUFNLE1BQU0sR0FBUSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLEVBQUUsR0FBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQUNELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvTW92ZW1lbnRTZW5zb3IvQUs4OTYzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQUs4OTYzIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiQUs4OTYzXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZDogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgX2FkZHJlc3M6IGFueTtcbiAgcHVibGljIGkyYzogYW55O1xuICBwdWJsaWMgX2FkY19jeWNsZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcImduZFwiLCBcInZjY1wiLCBcInNkYVwiLCBcInNjbFwiLCBcImkyY1wiLCBcImFkZHJlc3NcIiwgXCJhZGJfY3ljbGVcIl07XG4gICAgdGhpcy5yZXF1aXJlZCA9IFtdO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCBcIjV2XCIpO1xuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gMTAwMDAwO1xuICAgIHRoaXMucGFyYW1zLnB1bGwgPSBcIjN2XCI7XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9IFwibWFzdGVyXCI7XG4gICAgdGhpcy5fYWRkcmVzcyA9IHRoaXMucGFyYW1zLmFkZHJlc3MgfHwgMHgwYztcbiAgICB0aGlzLmkyYyA9IG9ibml6LmdldEkyQ1dpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuICAgIHRoaXMuc2V0Q29uZmlnKHRoaXMucGFyYW1zLmFkY19jeWNsZSB8fCA4KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRDb25maWcoQURDX2N5Y2xlOiBhbnkpIHtcbiAgICBzd2l0Y2ggKEFEQ19jeWNsZSkge1xuICAgICAgY2FzZSA4OlxuICAgICAgICB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgwYSwgMHgxMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTAwOlxuICAgICAgICB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgwYSwgMHgxNl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFEQ19jeWNsZSB2YXJpYWJsZSA4LDEwMCBzZXR0aW5nXCIpO1xuICAgIH1cbiAgICB0aGlzLl9hZGNfY3ljbGUgPSBBRENfY3ljbGU7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0V2FpdCgpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgwM10pOyAvLyByZXF1ZXN0IEFLODk2MyBkYXRhXG4gICAgY29uc3QgcmF3X2RhdGFfQUs4OTYzOiBhbnkgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLl9hZGRyZXNzLCA3KTsgLy8gcmVhZCA3Ynl0ZShyZWFkIG1hZ19kYXRhWzZdIHRvIHJlZnJlc2gpXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHRoaXMuY2hhcjJzaG9ydChyYXdfZGF0YV9BSzg5NjNbMF0sIHJhd19kYXRhX0FLODk2M1sxXSksXG4gICAgICB5OiB0aGlzLmNoYXIyc2hvcnQocmF3X2RhdGFfQUs4OTYzWzJdLCByYXdfZGF0YV9BSzg5NjNbM10pLFxuICAgICAgejogdGhpcy5jaGFyMnNob3J0KHJhd19kYXRhX0FLODk2M1s0XSwgcmF3X2RhdGFfQUs4OTYzWzVdKSxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNoYXIyc2hvcnQodmFsdWVIOiBhbnksIHZhbHVlTDogYW55KSB7XG4gICAgY29uc3QgYnVmZmVyOiBhbnkgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgY29uc3QgZHY6IGFueSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGR2LnNldFVpbnQ4KDAsIHZhbHVlSCk7XG4gICAgZHYuc2V0VWludDgoMSwgdmFsdWVMKTtcbiAgICByZXR1cm4gZHYuZ2V0SW50MTYoMCwgZmFsc2UpO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBSzg5NjM7XG4iXX0=
