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
class AM2320 {
    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "AM2320",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.address = 0x5c;
        this.params.pull = "5v";
        this.params.mode = "master";
        this.params.clock = this.params.clock || 100 * 1000;
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const i2cOnerror = this.i2c.onerror;
            this.i2c.onerror = () => {
            };
            this.i2c.write(this.address, [0]); // wake
            this.obniz.wait(2);
            this.i2c.write(this.address, [0x03, 0x00, 0x04]);
            this.obniz.wait(2);
            this.i2c.write(this.address, [0x03, 0x00, 0x04]);
            const ret = yield this.i2c.readWait(this.address, 6);
            this.i2c.onerror = i2cOnerror;
            if (ret[0] !== 3 || ret[1] !== 4) {
                console.log("AM2320: Could not receive data correctly");
                return {};
            }
            const humidity = (ret[2] * 256 + ret[3]) / 10.0;
            const temperature = (ret[4] * 256 + ret[5]) / 10.0;
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
exports.default = AM2320;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvQU0yMzIwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxNQUFNO0lBZVY7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFoQk0sTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFjTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztRQUNwRCxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVZLFVBQVU7O1lBQ3JCLE1BQU0sVUFBVSxHQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUN4QixDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87WUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sR0FBRyxHQUFRLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7WUFDOUIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztnQkFDeEQsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUNELE1BQU0sUUFBUSxHQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDckQsTUFBTSxXQUFXLEdBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN4RCxPQUFPLEVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBQ2pDLENBQUM7S0FBQTtJQUVZLFdBQVc7O1lBQ3RCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFWSxXQUFXOztZQUN0QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDNUMsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxNQUFNLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL2kyYy9BTTIzMjAvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBTTIzMjAge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJBTTIzMjBcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIHJlcXVpcmVkS2V5czogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgYWRkcmVzczogYW55O1xuICBwdWJsaWMgaTJjOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gW1widmNjXCIsIFwiZ25kXCIsIFwic2RhXCIsIFwic2NsXCIsIFwiaTJjXCJdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW107XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICBvYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsIFwiNXZcIik7XG4gICAgdGhpcy5hZGRyZXNzID0gMHg1YztcbiAgICB0aGlzLnBhcmFtcy5wdWxsID0gXCI1dlwiO1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSBcIm1hc3RlclwiO1xuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gdGhpcy5wYXJhbXMuY2xvY2sgfHwgMTAwICogMTAwMDtcbiAgICB0aGlzLmkyYyA9IG9ibml6LmdldEkyQ1dpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEFsbFdhaXQoKSB7XG4gICAgY29uc3QgaTJjT25lcnJvcjogYW55ID0gdGhpcy5pMmMub25lcnJvcjtcbiAgICB0aGlzLmkyYy5vbmVycm9yID0gKCkgPT4ge1xuICAgIH07XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbMF0pOyAvLyB3YWtlXG4gICAgdGhpcy5vYm5pei53YWl0KDIpO1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgWzB4MDMsIDB4MDAsIDB4MDRdKTtcbiAgICB0aGlzLm9ibml6LndhaXQoMik7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbMHgwMywgMHgwMCwgMHgwNF0pO1xuICAgIGNvbnN0IHJldDogYW55ID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5hZGRyZXNzLCA2KTtcbiAgICB0aGlzLmkyYy5vbmVycm9yID0gaTJjT25lcnJvcjtcbiAgICBpZiAocmV0WzBdICE9PSAzIHx8IHJldFsxXSAhPT0gNCkge1xuICAgICAgY29uc29sZS5sb2coXCJBTTIzMjA6IENvdWxkIG5vdCByZWNlaXZlIGRhdGEgY29ycmVjdGx5XCIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCBodW1pZGl0eTogYW55ID0gKHJldFsyXSAqIDI1NiArIHJldFszXSkgLyAxMC4wO1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlOiBhbnkgPSAocmV0WzRdICogMjU2ICsgcmV0WzVdKSAvIDEwLjA7XG4gICAgcmV0dXJuIHt0ZW1wZXJhdHVyZSwgaHVtaWRpdHl9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFRlbXBXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxXYWl0KCkpLnRlbXBlcmF0dXJlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEh1bWRXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxXYWl0KCkpLmh1bWlkaXR5O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFNMjMyMDtcbiJdfQ==
