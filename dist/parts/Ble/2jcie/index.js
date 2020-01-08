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
class OMRON_2JCIE {
    constructor() {
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: '2JCIE',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    findWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let target = {
                localName: 'Env',
            };
            this.periperal = yield this.obniz.ble.scan.startOneWait(target);
            return this.periperal;
        });
    }
    omron_uuid(uuid) {
        return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
    }
    connectWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.periperal) {
                yield this.findWait();
            }
            if (!this.periperal) {
                throw new Error('2JCIE not found');
            }
            if (!this.periperal.connected) {
                yield this.periperal.connectWait();
            }
        });
    }
    disconnectWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.periperal && this.periperal.connected) {
                this.periperal.disconnectWait();
            }
        });
    }
    signedNumberFromBinary(data) {
        //little adian
        let val = data[data.length - 1] & 0x7f;
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        if ((data[data.length - 1] & 0x80) !== 0) {
            val = val - Math.pow(2, data.length * 8 - 1);
        }
        return val;
    }
    unsignedNumberFromBinary(data) {
        //little adian
        let val = data[data.length - 1];
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        return val;
    }
    getLatestData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectWait();
            let c = this.periperal
                .getService(this.omron_uuid('3000'))
                .getCharacteristic(this.omron_uuid('3001'));
            let data = yield c.readWait();
            let json = {
                row_number: data[0],
                temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
                relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
                light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
                uv_index: this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
                barometric_pressure: this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
                soud_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
                discomfort_index: this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
                heatstroke_risk_factor: this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
                battery_voltage: this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
            };
            return json;
        });
    }
}
if (typeof module === 'object') {
    module.exports = OMRON_2JCIE;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9CbGUvMmpjaWUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sV0FBVztJQUNmO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVLLFFBQVE7O1lBQ1osSUFBSSxNQUFNLEdBQUc7Z0JBQ1gsU0FBUyxFQUFFLEtBQUs7YUFDakIsQ0FBQztZQUVGLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWhFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDO0tBQUE7SUFFRCxVQUFVLENBQUMsSUFBSTtRQUNiLE9BQU8sT0FBTyxJQUFJLDZCQUE2QixDQUFDO0lBQ2xELENBQUM7SUFFSyxXQUFXOztZQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUN2QjtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDcEM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzth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QkFDbEUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSTtnQkFDeEUsc0JBQXNCLEVBQ3BCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUk7Z0JBQ3hELGVBQWUsRUFDYixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLO2FBQzVELENBQUM7WUFFRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7Q0FDOUIiLCJmaWxlIjoicGFydHMvQmxlLzJqY2llL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgT01ST05fMkpDSUUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtdO1xuICAgIHRoaXMucGVyaXBlcmFsID0gbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnMkpDSUUnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgfVxuXG4gIGFzeW5jIGZpbmRXYWl0KCkge1xuICAgIGxldCB0YXJnZXQgPSB7XG4gICAgICBsb2NhbE5hbWU6ICdFbnYnLFxuICAgIH07XG5cbiAgICB0aGlzLnBlcmlwZXJhbCA9IGF3YWl0IHRoaXMub2JuaXouYmxlLnNjYW4uc3RhcnRPbmVXYWl0KHRhcmdldCk7XG5cbiAgICByZXR1cm4gdGhpcy5wZXJpcGVyYWw7XG4gIH1cblxuICBvbXJvbl91dWlkKHV1aWQpIHtcbiAgICByZXR1cm4gYDBDNEMke3V1aWR9LTc3MDAtNDZGNC1BQTk2RDVFOTc0RTMyQTU0YDtcbiAgfVxuXG4gIGFzeW5jIGNvbm5lY3RXYWl0KCkge1xuICAgIGlmICghdGhpcy5wZXJpcGVyYWwpIHtcbiAgICAgIGF3YWl0IHRoaXMuZmluZFdhaXQoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnBlcmlwZXJhbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCcySkNJRSBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnBlcmlwZXJhbC5jb25uZWN0ZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMucGVyaXBlcmFsLmNvbm5lY3RXYWl0KCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlzY29ubmVjdFdhaXQoKSB7XG4gICAgaWYgKHRoaXMucGVyaXBlcmFsICYmIHRoaXMucGVyaXBlcmFsLmNvbm5lY3RlZCkge1xuICAgICAgdGhpcy5wZXJpcGVyYWwuZGlzY29ubmVjdFdhaXQoKTtcbiAgICB9XG4gIH1cblxuICBzaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEpIHtcbiAgICAvL2xpdHRsZSBhZGlhblxuICAgIGxldCB2YWwgPSBkYXRhW2RhdGEubGVuZ3RoIC0gMV0gJiAweDdmO1xuICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YWwgPSB2YWwgKiAyNTYgKyBkYXRhW2ldO1xuICAgIH1cbiAgICBpZiAoKGRhdGFbZGF0YS5sZW5ndGggLSAxXSAmIDB4ODApICE9PSAwKSB7XG4gICAgICB2YWwgPSB2YWwgLSBNYXRoLnBvdygyLCBkYXRhLmxlbmd0aCAqIDggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIHVuc2lnbmVkTnVtYmVyRnJvbUJpbmFyeShkYXRhKSB7XG4gICAgLy9saXR0bGUgYWRpYW5cbiAgICBsZXQgdmFsID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YWwgPSB2YWwgKiAyNTYgKyBkYXRhW2ldO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgYXN5bmMgZ2V0TGF0ZXN0RGF0YSgpIHtcbiAgICBhd2FpdCB0aGlzLmNvbm5lY3RXYWl0KCk7XG5cbiAgICBsZXQgYyA9IHRoaXMucGVyaXBlcmFsXG4gICAgICAuZ2V0U2VydmljZSh0aGlzLm9tcm9uX3V1aWQoJzMwMDAnKSlcbiAgICAgIC5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLm9tcm9uX3V1aWQoJzMwMDEnKSk7XG4gICAgbGV0IGRhdGEgPSBhd2FpdCBjLnJlYWRXYWl0KCk7XG4gICAgbGV0IGpzb24gPSB7XG4gICAgICByb3dfbnVtYmVyOiBkYXRhWzBdLFxuICAgICAgdGVtcGVyYXR1cmU6IHRoaXMuc2lnbmVkTnVtYmVyRnJvbUJpbmFyeShkYXRhLnNsaWNlKDEsIDMpKSAqIDAuMDEsXG4gICAgICByZWxhdGl2ZV9odW1pZGl0eTogdGhpcy5zaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEuc2xpY2UoMywgNSkpICogMC4wMSxcbiAgICAgIGxpZ2h0OiB0aGlzLnNpZ25lZE51bWJlckZyb21CaW5hcnkoZGF0YS5zbGljZSg1LCA3KSkgKiAxLFxuICAgICAgdXZfaW5kZXg6IHRoaXMuc2lnbmVkTnVtYmVyRnJvbUJpbmFyeShkYXRhLnNsaWNlKDcsIDkpKSAqIDAuMDEsXG4gICAgICBiYXJvbWV0cmljX3ByZXNzdXJlOiB0aGlzLnNpZ25lZE51bWJlckZyb21CaW5hcnkoZGF0YS5zbGljZSg5LCAxMSkpICogMC4xLFxuICAgICAgc291ZF9ub2lzZTogdGhpcy5zaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEuc2xpY2UoMTEsIDEzKSkgKiAwLjAxLFxuICAgICAgZGlzY29tZm9ydF9pbmRleDogdGhpcy5zaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEuc2xpY2UoMTMsIDE1KSkgKiAwLjAxLFxuICAgICAgaGVhdHN0cm9rZV9yaXNrX2ZhY3RvcjpcbiAgICAgICAgdGhpcy5zaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEuc2xpY2UoMTUsIDE3KSkgKiAwLjAxLFxuICAgICAgYmF0dGVyeV92b2x0YWdlOlxuICAgICAgICB0aGlzLnVuc2lnbmVkTnVtYmVyRnJvbUJpbmFyeShkYXRhLnNsaWNlKDE3LCAxOSkpICogMC4wMDEsXG4gICAgfTtcblxuICAgIHJldHVybiBqc29uO1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IE9NUk9OXzJKQ0lFO1xufVxuIl19
