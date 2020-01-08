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
class ENC03R_Module {
    constructor() {
        this.keys = ['vcc', 'out1', 'out2', 'gnd'];
        this.required = ['out1', 'out2'];
        this.Sens = 0.00067; //Sensitivity, 0.67mV / deg/sec
    }
    static info() {
        return {
            name: 'ENC03R_Module',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.ad0 = obniz.getAD(this.params.out1);
        this.ad1 = obniz.getAD(this.params.out2);
        this.ad0.start(value => {
            this.sens1 = (value - 1.45) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
            if (this.onchange1) {
                this.onchange1(this.sens1);
            }
        });
        this.ad1.start(value => {
            this.sens2 = (value - 1.35) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
            if (this.onchange2) {
                this.onchange2(this.sens2);
            }
        });
    }
    get1Wait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let value = this.ad0.getWait();
            this.sens1 = (value - 1.45) / this.Sens;
            resolve(this.sens1);
        }));
    }
    get2Wait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let value = this.ad1.getWait();
            this.sens2 = (value - 1.35) / this.Sens;
            resolve(this.sens2);
        }));
    }
}
if (typeof module === 'object') {
    module.exports = ENC03R_Module;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9HeXJvU2Vuc29yL0VOQzAzUl9Nb2R1bGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sYUFBYTtJQUNqQjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsK0JBQStCO0lBQ3RELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsZUFBZTtTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQywrREFBK0Q7WUFDeEcsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM1QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsK0RBQStEO1lBQ3hHLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFNLE9BQU8sRUFBQyxFQUFFO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFNLE9BQU8sRUFBQyxFQUFFO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDO0NBQ2hDIiwiZmlsZSI6InBhcnRzL0d5cm9TZW5zb3IvRU5DMDNSX01vZHVsZS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEVOQzAzUl9Nb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdvdXQxJywgJ291dDInLCAnZ25kJ107XG4gICAgdGhpcy5yZXF1aXJlZCA9IFsnb3V0MScsICdvdXQyJ107XG4gICAgdGhpcy5TZW5zID0gMC4wMDA2NzsgLy9TZW5zaXRpdml0eSwgMC42N21WIC8gZGVnL3NlY1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdFTkMwM1JfTW9kdWxlJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCAnNXYnKTtcbiAgICB0aGlzLmFkMCA9IG9ibml6LmdldEFEKHRoaXMucGFyYW1zLm91dDEpO1xuICAgIHRoaXMuYWQxID0gb2JuaXouZ2V0QUQodGhpcy5wYXJhbXMub3V0Mik7XG5cbiAgICB0aGlzLmFkMC5zdGFydCh2YWx1ZSA9PiB7XG4gICAgICB0aGlzLnNlbnMxID0gKHZhbHVlIC0gMS40NSkgLyB0aGlzLlNlbnM7IC8vW0FuZ3VsYXIgdmVsb2NpdHkoZGVnL3NlYyldID0gKCBbQUQgVm9sdGFnZV0tMS4zNVYgKSAvIDAuNjdtVlxuICAgICAgaWYgKHRoaXMub25jaGFuZ2UxKSB7XG4gICAgICAgIHRoaXMub25jaGFuZ2UxKHRoaXMuc2VuczEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5hZDEuc3RhcnQodmFsdWUgPT4ge1xuICAgICAgdGhpcy5zZW5zMiA9ICh2YWx1ZSAtIDEuMzUpIC8gdGhpcy5TZW5zOyAvL1tBbmd1bGFyIHZlbG9jaXR5KGRlZy9zZWMpXSA9ICggW0FEIFZvbHRhZ2VdLTEuMzVWICkgLyAwLjY3bVZcbiAgICAgIGlmICh0aGlzLm9uY2hhbmdlMikge1xuICAgICAgICB0aGlzLm9uY2hhbmdlMih0aGlzLnNlbnMyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldDFXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyByZXNvbHZlID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYWQwLmdldFdhaXQoKTtcbiAgICAgIHRoaXMuc2VuczEgPSAodmFsdWUgLSAxLjQ1KSAvIHRoaXMuU2VucztcbiAgICAgIHJlc29sdmUodGhpcy5zZW5zMSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQyV2FpdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgcmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLmFkMS5nZXRXYWl0KCk7XG4gICAgICB0aGlzLnNlbnMyID0gKHZhbHVlIC0gMS4zNSkgLyB0aGlzLlNlbnM7XG4gICAgICByZXNvbHZlKHRoaXMuc2VuczIpO1xuICAgIH0pO1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IEVOQzAzUl9Nb2R1bGU7XG59XG4iXX0=
