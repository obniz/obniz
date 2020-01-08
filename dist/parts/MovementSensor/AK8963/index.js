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
class AK8963 {
    constructor() {
        this.keys = ['gnd', 'vcc', 'sda', 'scl', 'i2c', 'address', 'adb_cycle'];
        this.required = [];
    }
    static info() {
        return {
            name: 'AK8963',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';
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
                throw new Error('ADC_cycle variable 8,100 setting');
        }
        this._adc_cycle = ADC_cycle;
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this._address, [0x03]); //request AK8963 data
            let raw_data_AK8963 = yield this.i2c.readWait(this._address, 7); //read 7byte(read mag_data[6] to refresh)
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
if (typeof module === 'object') {
    module.exports = AK8963;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9BSzg5NjMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sTUFBTTtJQUNWO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxTQUFTLENBQUMsU0FBUztRQUNqQixRQUFRLFNBQVMsRUFBRTtZQUNqQixLQUFLLENBQUM7Z0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztTQUN2RDtRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUFFSyxPQUFPOztZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1lBQzVELElBQUksZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHlDQUF5QztZQUMxRyxPQUFPO2dCQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0QsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVELFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTTtRQUN2QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0NBQ3pCIiwiZmlsZSI6InBhcnRzL01vdmVtZW50U2Vuc29yL0FLODk2My9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFLODk2MyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsnZ25kJywgJ3ZjYycsICdzZGEnLCAnc2NsJywgJ2kyYycsICdhZGRyZXNzJywgJ2FkYl9jeWNsZSddO1xuICAgIHRoaXMucmVxdWlyZWQgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnQUs4OTYzJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCAnNXYnKTtcbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IDEwMDAwMDtcbiAgICB0aGlzLnBhcmFtcy5wdWxsID0gJzN2JztcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gJ21hc3Rlcic7XG4gICAgdGhpcy5fYWRkcmVzcyA9IHRoaXMucGFyYW1zLmFkZHJlc3MgfHwgMHgwYztcbiAgICB0aGlzLmkyYyA9IG9ibml6LmdldEkyQ1dpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuICAgIHRoaXMuc2V0Q29uZmlnKHRoaXMucGFyYW1zLmFkY19jeWNsZSB8fCA4KTtcbiAgfVxuXG4gIHNldENvbmZpZyhBRENfY3ljbGUpIHtcbiAgICBzd2l0Y2ggKEFEQ19jeWNsZSkge1xuICAgICAgY2FzZSA4OlxuICAgICAgICB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgwYSwgMHgxMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTAwOlxuICAgICAgICB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgwYSwgMHgxNl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQURDX2N5Y2xlIHZhcmlhYmxlIDgsMTAwIHNldHRpbmcnKTtcbiAgICB9XG4gICAgdGhpcy5fYWRjX2N5Y2xlID0gQURDX2N5Y2xlO1xuICB9XG5cbiAgYXN5bmMgZ2V0V2FpdCgpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgwM10pOyAvL3JlcXVlc3QgQUs4OTYzIGRhdGFcbiAgICBsZXQgcmF3X2RhdGFfQUs4OTYzID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5fYWRkcmVzcywgNyk7IC8vcmVhZCA3Ynl0ZShyZWFkIG1hZ19kYXRhWzZdIHRvIHJlZnJlc2gpXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHRoaXMuY2hhcjJzaG9ydChyYXdfZGF0YV9BSzg5NjNbMF0sIHJhd19kYXRhX0FLODk2M1sxXSksXG4gICAgICB5OiB0aGlzLmNoYXIyc2hvcnQocmF3X2RhdGFfQUs4OTYzWzJdLCByYXdfZGF0YV9BSzg5NjNbM10pLFxuICAgICAgejogdGhpcy5jaGFyMnNob3J0KHJhd19kYXRhX0FLODk2M1s0XSwgcmF3X2RhdGFfQUs4OTYzWzVdKSxcbiAgICB9O1xuICB9XG5cbiAgY2hhcjJzaG9ydCh2YWx1ZUgsIHZhbHVlTCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGR2LnNldFVpbnQ4KDAsIHZhbHVlSCk7XG4gICAgZHYuc2V0VWludDgoMSwgdmFsdWVMKTtcbiAgICByZXR1cm4gZHYuZ2V0SW50MTYoMCwgZmFsc2UpO1xuICB9XG59XG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBBSzg5NjM7XG59XG4iXX0=
