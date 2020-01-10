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
class ADT7310 {
    constructor() {
        this.keys = ["vcc", "gnd", "frequency", "din", "dout", "clk", "spi"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "ADT7310",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.params.mode = this.params.mode || "master";
        this.params.frequency = this.params.frequency || 500000;
        this.params.mosi = this.params.din;
        this.params.miso = this.params.dout;
        this.spi = this.obniz.getSpiWithConfig(this.params);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.spi.writeWait([0x54]); // send before each commands for stable
            yield this.obniz.wait(200);
            const ret = yield this.spi.writeWait([0x00, 0x00]);
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
exports.default = ADT7310;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9zcGkvQURUNzMxMC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLE1BQU0sT0FBTztJQWNYO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFmTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztJQUNKLENBQUM7SUFhTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRVksV0FBVzs7WUFDdEIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyx1Q0FBdUM7WUFDekUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixNQUFNLEdBQUcsR0FBUSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxPQUFPLEdBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDO1lBRXZCLElBQUksT0FBTyxHQUFHLE1BQU0sRUFBRTtnQkFDcEIsT0FBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7YUFDMUI7WUFFRCxPQUFPLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDdEIsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxPQUFPLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL1RlbXBlcmF0dXJlU2Vuc29yL3NwaS9BRFQ3MzEwL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQURUNzMxMCB7XG5cbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIkFEVDczMTBcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIHJlcXVpcmVkS2V5czogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgc3BpOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gW1widmNjXCIsIFwiZ25kXCIsIFwiZnJlcXVlbmN5XCIsIFwiZGluXCIsIFwiZG91dFwiLCBcImNsa1wiLCBcInNwaVwiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtdO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG5cbiAgICBvYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsIFwiNXZcIik7XG5cbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gdGhpcy5wYXJhbXMubW9kZSB8fCBcIm1hc3RlclwiO1xuICAgIHRoaXMucGFyYW1zLmZyZXF1ZW5jeSA9IHRoaXMucGFyYW1zLmZyZXF1ZW5jeSB8fCA1MDAwMDA7XG4gICAgdGhpcy5wYXJhbXMubW9zaSA9IHRoaXMucGFyYW1zLmRpbjtcbiAgICB0aGlzLnBhcmFtcy5taXNvID0gdGhpcy5wYXJhbXMuZG91dDtcbiAgICB0aGlzLnNwaSA9IHRoaXMub2JuaXouZ2V0U3BpV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0VGVtcFdhaXQoKSB7XG4gICAgYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KFsweDU0XSk7IC8vIHNlbmQgYmVmb3JlIGVhY2ggY29tbWFuZHMgZm9yIHN0YWJsZVxuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCgyMDApO1xuICAgIGNvbnN0IHJldDogYW55ID0gYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KFsweDAwLCAweDAwXSk7XG4gICAgbGV0IHRlbXBCaW46IGFueSA9IHJldFswXSA8PCA4O1xuICAgIHRlbXBCaW4gfD0gcmV0WzFdO1xuICAgIHRlbXBCaW4gPSB0ZW1wQmluID4+IDM7XG5cbiAgICBpZiAodGVtcEJpbiAmIDB4MTAwMCkge1xuICAgICAgdGVtcEJpbiA9IHRlbXBCaW4gLSA4MTkyO1xuICAgIH1cblxuICAgIHJldHVybiB0ZW1wQmluIC8gMTY7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQURUNzMxMDtcbiJdfQ==
