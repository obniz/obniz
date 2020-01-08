"use strict";
const ObnizUtil = require('../utils/util');
class ObnizMeasure {
    constructor(obniz) {
        this.obniz = obniz;
        this._reset();
    }
    _reset() {
        this.observers = [];
    }
    echo(params) {
        let err = ObnizUtil._requiredKeys(params, [
            'io_pulse',
            'pulse',
            'pulse_width',
            'io_echo',
            'measure_edges',
        ]);
        if (err) {
            throw new Error("Measure start param '" + err + "' required, but not found ");
        }
        this.params = ObnizUtil._keyFilter(params, [
            'io_pulse',
            'pulse',
            'pulse_width',
            'io_echo',
            'measure_edges',
            'timeout',
            'callback',
        ]);
        let echo = {};
        echo.io_pulse = this.params.io_pulse;
        echo.pulse = this.params.pulse;
        echo.pulse_width = this.params.pulse_width;
        echo.io_echo = this.params.io_echo;
        echo.measure_edges = this.params.measure_edges;
        if (typeof this.params.timeout === 'number') {
            echo.timeout = this.params.timeout;
        }
        this.obniz.send({
            measure: {
                echo: echo,
            },
        });
        if (this.params.callback) {
            this.observers.push(this.params.callback);
        }
    }
    notified(obj) {
        let callback = this.observers.shift();
        if (callback) {
            callback(obj.echo);
        }
    }
}
module.exports = ObnizMeasure;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL21lYXN1cmVtZW50cy9tZWFzdXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFM0MsTUFBTSxZQUFZO0lBQ2hCLFlBQVksS0FBSztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLENBQUMsTUFBTTtRQUNULElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3hDLFVBQVU7WUFDVixPQUFPO1lBQ1AsYUFBYTtZQUNiLFNBQVM7WUFDVCxlQUFlO1NBQ2hCLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxFQUFFO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FDYix1QkFBdUIsR0FBRyxHQUFHLEdBQUcsNEJBQTRCLENBQzdELENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekMsVUFBVTtZQUNWLE9BQU87WUFDUCxhQUFhO1lBQ2IsU0FBUztZQUNULGVBQWU7WUFDZixTQUFTO1lBQ1QsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUMvQyxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDcEM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNkLE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsSUFBSTthQUNYO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QyxJQUFJLFFBQVEsRUFBRTtZQUNaLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL21lYXN1cmVtZW50cy9tZWFzdXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgT2JuaXpVdGlsID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbCcpO1xuXG5jbGFzcyBPYm5pek1lYXN1cmUge1xuICBjb25zdHJ1Y3RvcihvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgX3Jlc2V0KCkge1xuICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gIH1cblxuICBlY2hvKHBhcmFtcykge1xuICAgIGxldCBlcnIgPSBPYm5pelV0aWwuX3JlcXVpcmVkS2V5cyhwYXJhbXMsIFtcbiAgICAgICdpb19wdWxzZScsXG4gICAgICAncHVsc2UnLFxuICAgICAgJ3B1bHNlX3dpZHRoJyxcbiAgICAgICdpb19lY2hvJyxcbiAgICAgICdtZWFzdXJlX2VkZ2VzJyxcbiAgICBdKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiTWVhc3VyZSBzdGFydCBwYXJhbSAnXCIgKyBlcnIgKyBcIicgcmVxdWlyZWQsIGJ1dCBub3QgZm91bmQgXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMucGFyYW1zID0gT2JuaXpVdGlsLl9rZXlGaWx0ZXIocGFyYW1zLCBbXG4gICAgICAnaW9fcHVsc2UnLFxuICAgICAgJ3B1bHNlJyxcbiAgICAgICdwdWxzZV93aWR0aCcsXG4gICAgICAnaW9fZWNobycsXG4gICAgICAnbWVhc3VyZV9lZGdlcycsXG4gICAgICAndGltZW91dCcsXG4gICAgICAnY2FsbGJhY2snLFxuICAgIF0pO1xuXG4gICAgbGV0IGVjaG8gPSB7fTtcbiAgICBlY2hvLmlvX3B1bHNlID0gdGhpcy5wYXJhbXMuaW9fcHVsc2U7XG4gICAgZWNoby5wdWxzZSA9IHRoaXMucGFyYW1zLnB1bHNlO1xuICAgIGVjaG8ucHVsc2Vfd2lkdGggPSB0aGlzLnBhcmFtcy5wdWxzZV93aWR0aDtcbiAgICBlY2hvLmlvX2VjaG8gPSB0aGlzLnBhcmFtcy5pb19lY2hvO1xuICAgIGVjaG8ubWVhc3VyZV9lZGdlcyA9IHRoaXMucGFyYW1zLm1lYXN1cmVfZWRnZXM7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhcmFtcy50aW1lb3V0ID09PSAnbnVtYmVyJykge1xuICAgICAgZWNoby50aW1lb3V0ID0gdGhpcy5wYXJhbXMudGltZW91dDtcbiAgICB9XG5cbiAgICB0aGlzLm9ibml6LnNlbmQoe1xuICAgICAgbWVhc3VyZToge1xuICAgICAgICBlY2hvOiBlY2hvLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5jYWxsYmFjaykge1xuICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaCh0aGlzLnBhcmFtcy5jYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZpZWQob2JqKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gdGhpcy5vYnNlcnZlcnMuc2hpZnQoKTtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKG9iai5lY2hvKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYm5pek1lYXN1cmU7XG4iXX0=
