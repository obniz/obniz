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
class MPU9250 {
    constructor(obniz) {
        this.keys = ['gnd', 'vcc', 'sda', 'scl', 'i2c', 'address'];
        this.required = [];
    }
    static info() {
        return {
            name: 'MPU9250',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this._address = this.params.address || 0x68;
        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.i2c.write(this._address, [0x6b, 0x00]); //activate MPU9250
        this.i2c.write(this._address, [0x37, 0x02]); //activate AK8963 (bypass)
        this.i2c.write(this._address, [0x1a, 0x06]); //activate LPF (search datasheet_p.13)
        this.i2c.write(this._address, [0x1d, 0x02]); //accel LPF set.
        this.mpu6050 = obniz.wired('MPU6050', { i2c: this.i2c });
        this.ak8963 = obniz.wired('AK8963', { i2c: this.i2c });
    }
    setConfig(accel_range, gyro_range, ADC_cycle) {
        this.mpu6050.setConfig(accel_range, gyro_range);
        this.ak8963.setConfig(ADC_cycle);
    }
    _getAK8963Wait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.i2c.write(this._address, [0x02]); //request AK8983 data
            let ST1 = yield this.i2c.readWait(this._address, 1); //confirm magnet value readable
            if (ST1 & 0x01) {
                return yield this.ak8963.getWait();
            }
            return {};
        });
    }
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.mpu6050.getWait();
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
if (typeof module === 'object') {
    module.exports = MPU9250;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9NUFU5MjUwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE9BQU87SUFDWCxZQUFZLEtBQUs7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtRQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEI7UUFDdkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsc0NBQXNDO1FBQ25GLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtRQUU3RCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELFNBQVMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFNBQVM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFSyxjQUFjOztZQUNsQixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1lBQ2xFLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLCtCQUErQjtZQUNwRixJQUFJLEdBQUcsR0FBRyxJQUFJLEVBQUU7Z0JBQ2QsT0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDcEM7WUFDRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtJQUVLLFVBQVU7O1lBQ2QsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0lBRUssY0FBYzs7WUFDbEIsT0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRUssb0JBQW9COztZQUN4QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQ3RELENBQUM7S0FBQTtJQUVLLGdCQUFnQjs7WUFDcEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7Q0FDRjtBQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0NBQzFCIiwiZmlsZSI6InBhcnRzL01vdmVtZW50U2Vuc29yL01QVTkyNTAvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNUFU5MjUwIHtcbiAgY29uc3RydWN0b3Iob2JuaXopIHtcbiAgICB0aGlzLmtleXMgPSBbJ2duZCcsICd2Y2MnLCAnc2RhJywgJ3NjbCcsICdpMmMnLCAnYWRkcmVzcyddO1xuICAgIHRoaXMucmVxdWlyZWQgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnTVBVOTI1MCcsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIG9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgJzV2Jyk7XG4gICAgdGhpcy5fYWRkcmVzcyA9IHRoaXMucGFyYW1zLmFkZHJlc3MgfHwgMHg2ODtcbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IDEwMDAwMDtcbiAgICB0aGlzLnBhcmFtcy5wdWxsID0gJzN2JztcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gJ21hc3Rlcic7XG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcblxuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuX2FkZHJlc3MsIFsweDZiLCAweDAwXSk7IC8vYWN0aXZhdGUgTVBVOTI1MFxuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuX2FkZHJlc3MsIFsweDM3LCAweDAyXSk7IC8vYWN0aXZhdGUgQUs4OTYzIChieXBhc3MpXG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5fYWRkcmVzcywgWzB4MWEsIDB4MDZdKTsgLy9hY3RpdmF0ZSBMUEYgKHNlYXJjaCBkYXRhc2hlZXRfcC4xMylcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLl9hZGRyZXNzLCBbMHgxZCwgMHgwMl0pOyAvL2FjY2VsIExQRiBzZXQuXG5cbiAgICB0aGlzLm1wdTYwNTAgPSBvYm5pei53aXJlZCgnTVBVNjA1MCcsIHsgaTJjOiB0aGlzLmkyYyB9KTtcbiAgICB0aGlzLmFrODk2MyA9IG9ibml6LndpcmVkKCdBSzg5NjMnLCB7IGkyYzogdGhpcy5pMmMgfSk7XG4gIH1cblxuICBzZXRDb25maWcoYWNjZWxfcmFuZ2UsIGd5cm9fcmFuZ2UsIEFEQ19jeWNsZSkge1xuICAgIHRoaXMubXB1NjA1MC5zZXRDb25maWcoYWNjZWxfcmFuZ2UsIGd5cm9fcmFuZ2UpO1xuICAgIHRoaXMuYWs4OTYzLnNldENvbmZpZyhBRENfY3ljbGUpO1xuICB9XG5cbiAgYXN5bmMgX2dldEFLODk2M1dhaXQoKSB7XG4gICAgYXdhaXQgdGhpcy5pMmMud3JpdGUodGhpcy5fYWRkcmVzcywgWzB4MDJdKTsgLy9yZXF1ZXN0IEFLODk4MyBkYXRhXG4gICAgbGV0IFNUMSA9IGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuX2FkZHJlc3MsIDEpOyAvL2NvbmZpcm0gbWFnbmV0IHZhbHVlIHJlYWRhYmxlXG4gICAgaWYgKFNUMSAmIDB4MDEpIHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmFrODk2My5nZXRXYWl0KCk7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGFzeW5jIGdldEFsbFdhaXQoKSB7XG4gICAgbGV0IGRhdGEgPSBhd2FpdCB0aGlzLm1wdTYwNTAuZ2V0V2FpdCgpO1xuICAgIGRhdGEuY29tcGFzcyA9IGF3YWl0IHRoaXMuYWs4OTYzLmdldFdhaXQoKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbXBhc3NXYWl0KCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmFrODk2My5nZXRXYWl0KCk7XG4gIH1cblxuICBhc3luYyBnZXRBY2NlbGVyb21ldGVyV2FpdCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubXB1NjA1MC5nZXRXYWl0KCkpLmFjY2VsZXJvbWV0ZXI7XG4gIH1cblxuICBhc3luYyBnZXRHeXJvc2NvcGVXYWl0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5tcHU2MDUwLmdldFdhaXQoKSkuZ3lyb3Njb3BlO1xuICB9XG59XG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBNUFU5MjUwO1xufVxuIl19
