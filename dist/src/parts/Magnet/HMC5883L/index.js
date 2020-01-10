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
class HMC5883L {
    constructor() {
        this.keys = ["gnd", "sda", "scl", "i2c"];
        this.address = {};
        this.address.device = 0x1e;
        this.address.reset = [0x02, 0x00]; // Continuous Measurment Mode
        this.address.xMSB = [0x03];
    }
    static info() {
        return {
            name: "HMC5883L",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(null, this.params.gnd, "3v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(500);
    }
    init() {
        this.i2c.write(this.address.device, this.address.reset);
        this.obniz.wait(500);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address.device, this.address.xMSB);
            const readed = yield this.i2c.readWait(this.address.device, 2 * 3);
            const obj = {};
            const keys = ["x", "y", "z"];
            for (let i = 0; i < 3; i++) {
                let val = (readed[i * 2] << 8) | readed[i * 2 + 1];
                if (val & 0x8000) {
                    val = val - 65536;
                }
                obj[keys[i]] = val;
            }
            return obj;
        });
    }
}
exports.default = HMC5883L;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9NYWduZXQvSE1DNTg4M0wvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFFBQVE7SUFjWjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7UUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBbkJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsVUFBVTtTQUNqQixDQUFDO0lBQ0osQ0FBQztJQWlCTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUU1QixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLElBQUk7UUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFWSxHQUFHOztZQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkQsTUFBTSxNQUFNLEdBQVEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFeEUsTUFBTSxHQUFHLEdBQVEsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxHQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxQixJQUFJLEdBQUcsR0FBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELElBQUksR0FBRyxHQUFHLE1BQU0sRUFBRTtvQkFDaEIsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7aUJBQ25CO2dCQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDcEI7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsUUFBUSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9NYWduZXQvSE1DNTg4M0wvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBITUM1ODgzTCB7XG5cbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIkhNQzU4ODNMXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyBpMmM6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJnbmRcIiwgXCJzZGFcIiwgXCJzY2xcIiwgXCJpMmNcIl07XG5cbiAgICB0aGlzLmFkZHJlc3MgPSB7fTtcbiAgICB0aGlzLmFkZHJlc3MuZGV2aWNlID0gMHgxZTtcbiAgICB0aGlzLmFkZHJlc3MucmVzZXQgPSBbMHgwMiwgMHgwMF07IC8vIENvbnRpbnVvdXMgTWVhc3VybWVudCBNb2RlXG4gICAgdGhpcy5hZGRyZXNzLnhNU0IgPSBbMHgwM107XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICBvYm5pei5zZXRWY2NHbmQobnVsbCwgdGhpcy5wYXJhbXMuZ25kLCBcIjN2XCIpO1xuXG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSAxMDAwMDA7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IFwiM3ZcIjtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gXCJtYXN0ZXJcIjtcblxuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG5cbiAgICB0aGlzLm9ibml6LndhaXQoNTAwKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KCkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcy5kZXZpY2UsIHRoaXMuYWRkcmVzcy5yZXNldCk7XG4gICAgdGhpcy5vYm5pei53YWl0KDUwMCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0KCkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcy5kZXZpY2UsIHRoaXMuYWRkcmVzcy54TVNCKTtcbiAgICBjb25zdCByZWFkZWQ6IGFueSA9IGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuYWRkcmVzcy5kZXZpY2UsIDIgKiAzKTtcblxuICAgIGNvbnN0IG9iajogYW55ID0ge307XG4gICAgY29uc3Qga2V5czogYW55ID0gW1wieFwiLCBcInlcIiwgXCJ6XCJdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBsZXQgdmFsOiBhbnkgPSAocmVhZGVkW2kgKiAyXSA8PCA4KSB8IHJlYWRlZFtpICogMiArIDFdO1xuICAgICAgaWYgKHZhbCAmIDB4ODAwMCkge1xuICAgICAgICB2YWwgPSB2YWwgLSA2NTUzNjtcbiAgICAgIH1cbiAgICAgIG9ialtrZXlzW2ldXSA9IHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhNQzU4ODNMO1xuIl19
