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
class ENC03R_Module {
    constructor() {
        this.keys = ["vcc", "out1", "out2", "gnd"];
        this.required = ["out1", "out2"];
        this.Sens = 0.00067; // Sensitivity, 0.67mV / deg/sec
    }
    static info() {
        return {
            name: "ENC03R_Module",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.ad0 = obniz.getAD(this.params.out1);
        this.ad1 = obniz.getAD(this.params.out2);
        this.ad0.start((value) => {
            this.sens1 = (value - 1.45) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
            if (this.onchange1) {
                this.onchange1(this.sens1);
            }
        });
        this.ad1.start((value) => {
            this.sens2 = (value - 1.35) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
            if (this.onchange2) {
                this.onchange2(this.sens2);
            }
        });
    }
    get1Wait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const value = this.ad0.getWait();
            this.sens1 = (value - 1.45) / this.Sens;
            resolve(this.sens1);
        }));
    }
    get2Wait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const value = this.ad1.getWait();
            this.sens2 = (value - 1.35) / this.Sens;
            resolve(this.sens2);
        }));
    }
}
exports.default = ENC03R_Module;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9HeXJvU2Vuc29yL0VOQzAzUl9Nb2R1bGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLGFBQWE7SUFvQmpCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxnQ0FBZ0M7SUFDdkQsQ0FBQztJQXRCTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLGVBQWU7U0FDdEIsQ0FBQztJQUNKLENBQUM7SUFvQk0sS0FBSyxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGdFQUFnRTtZQUN6RyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzVCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGdFQUFnRTtZQUN6RyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzVCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNiLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBTyxPQUFPLEVBQUUsRUFBRTtZQUNuQyxNQUFNLEtBQUssR0FBUSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN4QyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNiLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBTyxPQUFPLEVBQUUsRUFBRTtZQUNuQyxNQUFNLEtBQUssR0FBUSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN4QyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxhQUFhLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL0d5cm9TZW5zb3IvRU5DMDNSX01vZHVsZS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEVOQzAzUl9Nb2R1bGUge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJFTkMwM1JfTW9kdWxlXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZDogYW55O1xuICBwdWJsaWMgU2VuczogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgYWQwOiBhbnk7XG4gIHB1YmxpYyBhZDE6IGFueTtcbiAgcHVibGljIHNlbnMxOiBhbnk7XG4gIHB1YmxpYyBvbmNoYW5nZTE6IGFueTtcbiAgcHVibGljIHNlbnMyOiBhbnk7XG4gIHB1YmxpYyBvbmNoYW5nZTI6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJ2Y2NcIiwgXCJvdXQxXCIsIFwib3V0MlwiLCBcImduZFwiXTtcbiAgICB0aGlzLnJlcXVpcmVkID0gW1wib3V0MVwiLCBcIm91dDJcIl07XG4gICAgdGhpcy5TZW5zID0gMC4wMDA2NzsgLy8gU2Vuc2l0aXZpdHksIDAuNjdtViAvIGRlZy9zZWNcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIG9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgXCI1dlwiKTtcbiAgICB0aGlzLmFkMCA9IG9ibml6LmdldEFEKHRoaXMucGFyYW1zLm91dDEpO1xuICAgIHRoaXMuYWQxID0gb2JuaXouZ2V0QUQodGhpcy5wYXJhbXMub3V0Mik7XG5cbiAgICB0aGlzLmFkMC5zdGFydCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5zZW5zMSA9ICh2YWx1ZSAtIDEuNDUpIC8gdGhpcy5TZW5zOyAvLyBbQW5ndWxhciB2ZWxvY2l0eShkZWcvc2VjKV0gPSAoIFtBRCBWb2x0YWdlXS0xLjM1ViApIC8gMC42N21WXG4gICAgICBpZiAodGhpcy5vbmNoYW5nZTEpIHtcbiAgICAgICAgdGhpcy5vbmNoYW5nZTEodGhpcy5zZW5zMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmFkMS5zdGFydCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5zZW5zMiA9ICh2YWx1ZSAtIDEuMzUpIC8gdGhpcy5TZW5zOyAvLyBbQW5ndWxhciB2ZWxvY2l0eShkZWcvc2VjKV0gPSAoIFtBRCBWb2x0YWdlXS0xLjM1ViApIC8gMC42N21WXG4gICAgICBpZiAodGhpcy5vbmNoYW5nZTIpIHtcbiAgICAgICAgdGhpcy5vbmNoYW5nZTIodGhpcy5zZW5zMik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0MVdhaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZTogYW55ID0gdGhpcy5hZDAuZ2V0V2FpdCgpO1xuICAgICAgdGhpcy5zZW5zMSA9ICh2YWx1ZSAtIDEuNDUpIC8gdGhpcy5TZW5zO1xuICAgICAgcmVzb2x2ZSh0aGlzLnNlbnMxKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQyV2FpdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlOiBhbnkgPSB0aGlzLmFkMS5nZXRXYWl0KCk7XG4gICAgICB0aGlzLnNlbnMyID0gKHZhbHVlIC0gMS4zNSkgLyB0aGlzLlNlbnM7XG4gICAgICByZXNvbHZlKHRoaXMuc2VuczIpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVOQzAzUl9Nb2R1bGU7XG4iXX0=
