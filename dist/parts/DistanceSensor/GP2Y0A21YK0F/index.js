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
class GP2Y0A21YK0F {
    constructor() {
        this.keys = ['vcc', 'gnd', 'signal'];
        this.requiredKeys = ['signal'];
        this.displayIoNames = {
            vcc: 'vcc',
            gnd: 'gnd',
            signal: 'signal',
        };
        this._unit = 'mm';
    }
    static info() {
        return {
            name: 'GP2Y0A21YK0F',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.io_signal = obniz.getIO(this.params.signal);
        this.io_signal.end();
        this.ad_signal = obniz.getAD(this.params.signal);
    }
    start(callback) {
        this.ad_signal.start(val => {
            let distance = this._volt2distance(val);
            if (typeof callback == 'function') {
                callback(distance);
            }
        });
    }
    _volt2distance(val) {
        if (val <= 0) {
            val = 0.001;
        }
        let distance = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
        if (this._unit === 'mm') {
            distance = parseInt(distance * 10) / 10;
        }
        else {
            distance *= 0.0393701;
            distance = parseInt(distance * 1000) / 1000;
        }
        return distance;
    }
    getWait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let val = yield this.ad_signal.getWait();
            let distance = this._volt2distance(val);
            resolve(distance);
        }));
    }
    unit(unit) {
        if (unit === 'mm') {
            this._unit = 'mm';
        }
        else if (unit === 'inch') {
            this._unit = 'inch';
        }
        else {
            throw new Error('unknown unit ' + unit);
        }
    }
}
if (typeof module === 'object') {
    module.exports = GP2Y0A21YK0F;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXN0YW5jZVNlbnNvci9HUDJZMEEyMVlLMEYvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sWUFBWTtJQUNoQjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsY0FBYyxHQUFHO1lBQ3BCLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixNQUFNLEVBQUUsUUFBUTtTQUNqQixDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxjQUFjO1NBQ3JCLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRO1FBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QyxJQUFJLE9BQU8sUUFBUSxJQUFJLFVBQVUsRUFBRTtnQkFDakMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3BCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsY0FBYyxDQUFDLEdBQUc7UUFDaEIsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ1osR0FBRyxHQUFHLEtBQUssQ0FBQztTQUNiO1FBQ0QsSUFBSSxRQUFRLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3RFLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDdkIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ3pDO2FBQU07WUFDTCxRQUFRLElBQUksU0FBUyxDQUFDO1lBQ3RCLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztTQUM3QztRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFNLE9BQU8sRUFBQyxFQUFFO1lBQ2pDLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN6QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJO1FBQ1AsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25CO2FBQU0sSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1NBQ3JCO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0NBQy9CIiwiZmlsZSI6InBhcnRzL0Rpc3RhbmNlU2Vuc29yL0dQMlkwQTIxWUswRi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEdQMlkwQTIxWUswRiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFsndmNjJywgJ2duZCcsICdzaWduYWwnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnc2lnbmFsJ107XG5cbiAgICB0aGlzLmRpc3BsYXlJb05hbWVzID0ge1xuICAgICAgdmNjOiAndmNjJyxcbiAgICAgIGduZDogJ2duZCcsXG4gICAgICBzaWduYWw6ICdzaWduYWwnLFxuICAgIH07XG4gICAgdGhpcy5fdW5pdCA9ICdtbSc7XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0dQMlkwQTIxWUswRicsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuXG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCAnNXYnKTtcbiAgICB0aGlzLmlvX3NpZ25hbCA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnNpZ25hbCk7XG4gICAgdGhpcy5pb19zaWduYWwuZW5kKCk7XG4gICAgdGhpcy5hZF9zaWduYWwgPSBvYm5pei5nZXRBRCh0aGlzLnBhcmFtcy5zaWduYWwpO1xuICB9XG5cbiAgc3RhcnQoY2FsbGJhY2spIHtcbiAgICB0aGlzLmFkX3NpZ25hbC5zdGFydCh2YWwgPT4ge1xuICAgICAgbGV0IGRpc3RhbmNlID0gdGhpcy5fdm9sdDJkaXN0YW5jZSh2YWwpO1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrKGRpc3RhbmNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF92b2x0MmRpc3RhbmNlKHZhbCkge1xuICAgIGlmICh2YWwgPD0gMCkge1xuICAgICAgdmFsID0gMC4wMDE7XG4gICAgfVxuICAgIGxldCBkaXN0YW5jZSA9IDE5OTg4LjM0ICogTWF0aC5wb3coKHZhbCAvIDUuMCkgKiAxMDI0LCAtMS4yNTIxNCkgKiAxMDtcbiAgICBpZiAodGhpcy5fdW5pdCA9PT0gJ21tJykge1xuICAgICAgZGlzdGFuY2UgPSBwYXJzZUludChkaXN0YW5jZSAqIDEwKSAvIDEwO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXN0YW5jZSAqPSAwLjAzOTM3MDE7XG4gICAgICBkaXN0YW5jZSA9IHBhcnNlSW50KGRpc3RhbmNlICogMTAwMCkgLyAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gZGlzdGFuY2U7XG4gIH1cblxuICBnZXRXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyByZXNvbHZlID0+IHtcbiAgICAgIGxldCB2YWwgPSBhd2FpdCB0aGlzLmFkX3NpZ25hbC5nZXRXYWl0KCk7XG4gICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLl92b2x0MmRpc3RhbmNlKHZhbCk7XG4gICAgICByZXNvbHZlKGRpc3RhbmNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVuaXQodW5pdCkge1xuICAgIGlmICh1bml0ID09PSAnbW0nKSB7XG4gICAgICB0aGlzLl91bml0ID0gJ21tJztcbiAgICB9IGVsc2UgaWYgKHVuaXQgPT09ICdpbmNoJykge1xuICAgICAgdGhpcy5fdW5pdCA9ICdpbmNoJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIHVuaXQgJyArIHVuaXQpO1xuICAgIH1cbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBHUDJZMEEyMVlLMEY7XG59XG4iXX0=
