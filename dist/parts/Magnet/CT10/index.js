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
class CT10 {
    constructor() {
        this.keys = ['signal', 'gnd', 'vcc'];
        this.requiredKeys = ['signal'];
        this.onChangeForStateWait = function () { };
    }
    static info() {
        return {
            name: 'CT10',
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.vcc)) {
            this.io_vcc = obniz.getIO(this.params.vcc);
            this.io_vcc.output(true);
        }
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        this.io_signal.pull('0v');
        let self = this;
        this.io_signal.input(function (value) {
            self.isNear = value;
            if (self.onchange) {
                self.onchange(value);
            }
            self.onChangeForStateWait(value);
        });
    }
    isNearWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.io_signal.inputWait();
            return ret;
        });
    }
    stateWait(isNear) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = near => {
                if (isNear == near) {
                    this.onChangeForStateWait = function () { };
                    resolve();
                }
            };
        });
    }
}
if (typeof module === 'object') {
    module.exports = CT10;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9NYWduZXQvQ1QxMC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxJQUFJO0lBQ1I7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLGNBQVksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVMsS0FBSztZQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7WUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUssVUFBVTs7WUFDZCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDM0MsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFRCxTQUFTLENBQUMsTUFBTTtRQUNkLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxFQUFFO2dCQUNqQyxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxjQUFZLENBQUMsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUM7aUJBQ1g7WUFDSCxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0NBQ3ZCIiwiZmlsZSI6InBhcnRzL01hZ25ldC9DVDEwL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ1QxMCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsnc2lnbmFsJywgJ2duZCcsICd2Y2MnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnc2lnbmFsJ107XG5cbiAgICB0aGlzLm9uQ2hhbmdlRm9yU3RhdGVXYWl0ID0gZnVuY3Rpb24oKSB7fTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnQ1QxMCcsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5pb19zaWduYWwgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5zaWduYWwpO1xuXG4gICAgaWYgKG9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy52Y2MpKSB7XG4gICAgICB0aGlzLmlvX3ZjYyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnZjYyk7XG4gICAgICB0aGlzLmlvX3ZjYy5vdXRwdXQodHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKG9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5nbmQpKSB7XG4gICAgICB0aGlzLmlvX3N1cHBseSA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmduZCk7XG4gICAgICB0aGlzLmlvX3N1cHBseS5vdXRwdXQoZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMuaW9fc2lnbmFsLnB1bGwoJzB2Jyk7XG5cbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5pb19zaWduYWwuaW5wdXQoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHNlbGYuaXNOZWFyID0gdmFsdWU7XG4gICAgICBpZiAoc2VsZi5vbmNoYW5nZSkge1xuICAgICAgICBzZWxmLm9uY2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHNlbGYub25DaGFuZ2VGb3JTdGF0ZVdhaXQodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaXNOZWFyV2FpdCgpIHtcbiAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5pb19zaWduYWwuaW5wdXRXYWl0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHN0YXRlV2FpdChpc05lYXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5vbkNoYW5nZUZvclN0YXRlV2FpdCA9IG5lYXIgPT4ge1xuICAgICAgICBpZiAoaXNOZWFyID09IG5lYXIpIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm9yU3RhdGVXYWl0ID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gQ1QxMDtcbn1cbiJdfQ==
