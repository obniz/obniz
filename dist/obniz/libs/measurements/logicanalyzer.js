"use strict";
const ObnizUtil = require('../utils/util');
class LogicAnalyzer {
    constructor(obniz) {
        this.obniz = obniz;
        this._reset();
    }
    _reset() {
        this.onmeasured = undefined;
    }
    start(params) {
        let err = ObnizUtil._requiredKeys(params, ['io', 'interval', 'duration']);
        if (err) {
            throw new Error("LogicAnalyzer start param '" + err + "' required, but not found ");
        }
        this.params = ObnizUtil._keyFilter(params, [
            'io',
            'interval',
            'duration',
            'triggerValue',
            'triggerValueSamples',
        ]);
        let obj = {};
        obj.logic_analyzer = {
            io: [this.params.io],
            interval: this.params.interval,
            duration: this.params.duration,
        };
        if (this.params.triggerValueSamples > 0) {
            obj.logic_analyzer.trigger = {
                value: !!this.params.triggerValue,
                samples: this.params.triggerValueSamples,
            };
        }
        this.obniz.send(obj);
        return;
    }
    end() {
        let obj = {};
        obj.logic_analyzer = null;
        this.obniz.send(obj);
        return;
    }
    notified(obj) {
        if (this.onmeasured) {
            this.onmeasured(obj.data);
        }
        else {
            if (!this.measured) {
                this.measured = [];
            }
            this.measured.push(obj.data);
        }
        return;
    }
}
module.exports = LogicAnalyzer;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL21lYXN1cmVtZW50cy9sb2dpY2FuYWx5emVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFM0MsTUFBTSxhQUFhO0lBQ2pCLFlBQVksS0FBSztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtRQUNWLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksR0FBRyxFQUFFO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FDYiw2QkFBNkIsR0FBRyxHQUFHLEdBQUcsNEJBQTRCLENBQ25FLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekMsSUFBSTtZQUNKLFVBQVU7WUFDVixVQUFVO1lBQ1YsY0FBYztZQUNkLHFCQUFxQjtTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsY0FBYyxHQUFHO1lBQ25CLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ3BCLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFDOUIsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtTQUMvQixDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixHQUFHLENBQUMsRUFBRTtZQUN2QyxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU8sR0FBRztnQkFDM0IsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVk7Z0JBQ2pDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQjthQUN6QyxDQUFDO1NBQ0g7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixPQUFPO0lBQ1QsQ0FBQztJQUVELEdBQUc7UUFDRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixPQUFPO0lBQ1QsQ0FBQztJQUVELFFBQVEsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7YUFDcEI7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPO0lBQ1QsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9tZWFzdXJlbWVudHMvbG9naWNhbmFseXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE9ibml6VXRpbCA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWwnKTtcblxuY2xhc3MgTG9naWNBbmFseXplciB7XG4gIGNvbnN0cnVjdG9yKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICBfcmVzZXQoKSB7XG4gICAgdGhpcy5vbm1lYXN1cmVkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3RhcnQocGFyYW1zKSB7XG4gICAgbGV0IGVyciA9IE9ibml6VXRpbC5fcmVxdWlyZWRLZXlzKHBhcmFtcywgWydpbycsICdpbnRlcnZhbCcsICdkdXJhdGlvbiddKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiTG9naWNBbmFseXplciBzdGFydCBwYXJhbSAnXCIgKyBlcnIgKyBcIicgcmVxdWlyZWQsIGJ1dCBub3QgZm91bmQgXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMucGFyYW1zID0gT2JuaXpVdGlsLl9rZXlGaWx0ZXIocGFyYW1zLCBbXG4gICAgICAnaW8nLFxuICAgICAgJ2ludGVydmFsJyxcbiAgICAgICdkdXJhdGlvbicsXG4gICAgICAndHJpZ2dlclZhbHVlJyxcbiAgICAgICd0cmlnZ2VyVmFsdWVTYW1wbGVzJyxcbiAgICBdKTtcblxuICAgIGxldCBvYmogPSB7fTtcbiAgICBvYmoubG9naWNfYW5hbHl6ZXIgPSB7XG4gICAgICBpbzogW3RoaXMucGFyYW1zLmlvXSxcbiAgICAgIGludGVydmFsOiB0aGlzLnBhcmFtcy5pbnRlcnZhbCxcbiAgICAgIGR1cmF0aW9uOiB0aGlzLnBhcmFtcy5kdXJhdGlvbixcbiAgICB9O1xuICAgIGlmICh0aGlzLnBhcmFtcy50cmlnZ2VyVmFsdWVTYW1wbGVzID4gMCkge1xuICAgICAgb2JqLmxvZ2ljX2FuYWx5emVyLnRyaWdnZXIgPSB7XG4gICAgICAgIHZhbHVlOiAhIXRoaXMucGFyYW1zLnRyaWdnZXJWYWx1ZSxcbiAgICAgICAgc2FtcGxlczogdGhpcy5wYXJhbXMudHJpZ2dlclZhbHVlU2FtcGxlcyxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5vYm5pei5zZW5kKG9iaik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBvYmoubG9naWNfYW5hbHl6ZXIgPSBudWxsO1xuICAgIHRoaXMub2JuaXouc2VuZChvYmopO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG5vdGlmaWVkKG9iaikge1xuICAgIGlmICh0aGlzLm9ubWVhc3VyZWQpIHtcbiAgICAgIHRoaXMub25tZWFzdXJlZChvYmouZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdGhpcy5tZWFzdXJlZCkge1xuICAgICAgICB0aGlzLm1lYXN1cmVkID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLm1lYXN1cmVkLnB1c2gob2JqLmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2dpY0FuYWx5emVyO1xuIl19
