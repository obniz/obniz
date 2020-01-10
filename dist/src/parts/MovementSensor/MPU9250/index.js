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
class MPU9250 {
    constructor(obniz) {
        this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "address"];
        this.required = [];
    }
    static info() {
        return {
            name: "MPU9250",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this._address = this.params.address || 0x68;
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.i2c.write(this._address, [0x6b, 0x00]); // activate MPU9250
        this.i2c.write(this._address, [0x37, 0x02]); // activate AK8963 (bypass)
        this.i2c.write(this._address, [0x1a, 0x06]); // activate LPF (search datasheet_p.13)
        this.i2c.write(this._address, [0x1d, 0x02]); // accel LPF set.
        this.mpu6050 = obniz.wired("MPU6050", { i2c: this.i2c });
        this.ak8963 = obniz.wired("AK8963", { i2c: this.i2c });
    }
    setConfig(accel_range, gyro_range, ADC_cycle) {
        this.mpu6050.setConfig(accel_range, gyro_range);
        this.ak8963.setConfig(ADC_cycle);
    }
    _getAK8963Wait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.i2c.write(this._address, [0x02]); // request AK8983 data
            const ST1 = yield this.i2c.readWait(this._address, 1); // confirm magnet value readable
            if (ST1 & 0x01) {
                return yield this.ak8963.getWait();
            }
            return {};
        });
    }
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.mpu6050.getWait();
            data.compass = yield this.ak8963.getWait();
            return data;
        });
    }
    getCompassWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ak8963.getWait();
        });
    }
    getAccelerometerWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.mpu6050.getWait()).accelerometer;
        });
    }
    getGyroscopeWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.mpu6050.getWait()).gyroscope;
        });
    }
}
exports.default = MPU9250;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9NUFU5MjUwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxPQUFPO0lBaUJYLFlBQVksS0FBVTtRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBbEJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDO0lBQ0osQ0FBQztJQWdCTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO1FBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQzVCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7UUFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsMkJBQTJCO1FBQ3hFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztRQUNwRixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7UUFFOUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSxTQUFTLENBQUMsV0FBZ0IsRUFBRSxVQUFlLEVBQUUsU0FBYztRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVZLGNBQWM7O1lBQ3pCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7WUFDbkUsTUFBTSxHQUFHLEdBQVEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDO1lBQzVGLElBQUksR0FBRyxHQUFHLElBQUksRUFBRTtnQkFDZCxPQUFPLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNwQztZQUNELE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztLQUFBO0lBRVksVUFBVTs7WUFDckIsTUFBTSxJQUFJLEdBQVEsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0lBRVksY0FBYzs7WUFDekIsT0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRVksb0JBQW9COztZQUMvQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQ3RELENBQUM7S0FBQTtJQUVZLGdCQUFnQjs7WUFDM0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLE9BQU8sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvTW92ZW1lbnRTZW5zb3IvTVBVOTI1MC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1QVTkyNTAge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJNUFU5MjUwXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZDogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgX2FkZHJlc3M6IGFueTtcbiAgcHVibGljIGkyYzogYW55O1xuICBwdWJsaWMgbXB1NjA1MDogYW55O1xuICBwdWJsaWMgYWs4OTYzOiBhbnk7XG5cbiAgY29uc3RydWN0b3Iob2JuaXo6IGFueSkge1xuICAgIHRoaXMua2V5cyA9IFtcImduZFwiLCBcInZjY1wiLCBcInNkYVwiLCBcInNjbFwiLCBcImkyY1wiLCBcImFkZHJlc3NcIl07XG4gICAgdGhpcy5yZXF1aXJlZCA9IFtdO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCBcIjV2XCIpO1xuICAgIHRoaXMuX2FkZHJlc3MgPSB0aGlzLnBhcmFtcy5hZGRyZXNzIHx8IDB4Njg7XG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSAxMDAwMDA7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IFwiM3ZcIjtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gXCJtYXN0ZXJcIjtcbiAgICB0aGlzLmkyYyA9IG9ibml6LmdldEkyQ1dpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuXG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5fYWRkcmVzcywgWzB4NmIsIDB4MDBdKTsgLy8gYWN0aXZhdGUgTVBVOTI1MFxuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuX2FkZHJlc3MsIFsweDM3LCAweDAyXSk7IC8vIGFjdGl2YXRlIEFLODk2MyAoYnlwYXNzKVxuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuX2FkZHJlc3MsIFsweDFhLCAweDA2XSk7IC8vIGFjdGl2YXRlIExQRiAoc2VhcmNoIGRhdGFzaGVldF9wLjEzKVxuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuX2FkZHJlc3MsIFsweDFkLCAweDAyXSk7IC8vIGFjY2VsIExQRiBzZXQuXG5cbiAgICB0aGlzLm1wdTYwNTAgPSBvYm5pei53aXJlZChcIk1QVTYwNTBcIiwge2kyYzogdGhpcy5pMmN9KTtcbiAgICB0aGlzLmFrODk2MyA9IG9ibml6LndpcmVkKFwiQUs4OTYzXCIsIHtpMmM6IHRoaXMuaTJjfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0Q29uZmlnKGFjY2VsX3JhbmdlOiBhbnksIGd5cm9fcmFuZ2U6IGFueSwgQURDX2N5Y2xlOiBhbnkpIHtcbiAgICB0aGlzLm1wdTYwNTAuc2V0Q29uZmlnKGFjY2VsX3JhbmdlLCBneXJvX3JhbmdlKTtcbiAgICB0aGlzLmFrODk2My5zZXRDb25maWcoQURDX2N5Y2xlKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBfZ2V0QUs4OTYzV2FpdCgpIHtcbiAgICBhd2FpdCB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgwMl0pOyAvLyByZXF1ZXN0IEFLODk4MyBkYXRhXG4gICAgY29uc3QgU1QxOiBhbnkgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLl9hZGRyZXNzLCAxKTsgLy8gY29uZmlybSBtYWduZXQgdmFsdWUgcmVhZGFibGVcbiAgICBpZiAoU1QxICYgMHgwMSkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYWs4OTYzLmdldFdhaXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEFsbFdhaXQoKSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gYXdhaXQgdGhpcy5tcHU2MDUwLmdldFdhaXQoKTtcbiAgICBkYXRhLmNvbXBhc3MgPSBhd2FpdCB0aGlzLmFrODk2My5nZXRXYWl0KCk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q29tcGFzc1dhaXQoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYWs4OTYzLmdldFdhaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRBY2NlbGVyb21ldGVyV2FpdCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubXB1NjA1MC5nZXRXYWl0KCkpLmFjY2VsZXJvbWV0ZXI7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0R3lyb3Njb3BlV2FpdCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubXB1NjA1MC5nZXRXYWl0KCkpLmd5cm9zY29wZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNUFU5MjUwO1xuIl19
