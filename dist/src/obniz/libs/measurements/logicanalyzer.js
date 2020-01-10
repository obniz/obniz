"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../utils/util"));
class LogicAnalyzer {
    constructor(obniz) {
        this.obniz = obniz;
        this._reset();
    }
    _reset() {
        this.onmeasured = undefined;
    }
    start(params) {
        const err = util_1.default._requiredKeys(params, ["io", "interval", "duration"]);
        if (err) {
            throw new Error("LogicAnalyzer start param '" + err + "' required, but not found ");
        }
        this.params = util_1.default._keyFilter(params, [
            "io",
            "interval",
            "duration",
            "triggerValue",
            "triggerValueSamples",
        ]);
        const obj = {};
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
        const obj = {};
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
exports.default = LogicAnalyzer;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL21lYXN1cmVtZW50cy9sb2dpY2FuYWx5emVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseURBQXNDO0FBRXRDLE1BQU0sYUFBYTtJQU1qQixZQUFZLEtBQVU7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUFXO1FBQ3RCLE1BQU0sR0FBRyxHQUFRLGNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLElBQUksR0FBRyxFQUFFO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FDYiw2QkFBNkIsR0FBRyxHQUFHLEdBQUcsNEJBQTRCLENBQ25FLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsY0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekMsSUFBSTtZQUNKLFVBQVU7WUFDVixVQUFVO1lBQ1YsY0FBYztZQUNkLHFCQUFxQjtTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBUSxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLGNBQWMsR0FBRztZQUNuQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO1lBQzlCLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7U0FDL0IsQ0FBQztRQUNGLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLEVBQUU7WUFDdkMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEdBQUc7Z0JBQzNCLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZO2dCQUNqQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUI7YUFDekMsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsT0FBTztJQUNULENBQUM7SUFFTSxHQUFHO1FBQ1IsTUFBTSxHQUFHLEdBQVEsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE9BQU87SUFDVCxDQUFDO0lBRU0sUUFBUSxDQUFDLEdBQVE7UUFDdEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7YUFDcEI7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPO0lBQ1QsQ0FBQztDQUNGO0FBRUQsa0JBQWUsYUFBYSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL21lYXN1cmVtZW50cy9sb2dpY2FuYWx5emVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9ibml6VXRpbCBmcm9tIFwiLi4vdXRpbHMvdXRpbFwiO1xuXG5jbGFzcyBMb2dpY0FuYWx5emVyIHtcbiAgcHVibGljIG9ibml6OiBhbnk7XG4gIHB1YmxpYyBvbm1lYXN1cmVkOiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIG1lYXN1cmVkOiBhbnk7XG5cbiAgY29uc3RydWN0b3Iob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgcHVibGljIF9yZXNldCgpIHtcbiAgICB0aGlzLm9ubWVhc3VyZWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc3RhcnQocGFyYW1zOiBhbnkpIHtcbiAgICBjb25zdCBlcnI6IGFueSA9IE9ibml6VXRpbC5fcmVxdWlyZWRLZXlzKHBhcmFtcywgW1wiaW9cIiwgXCJpbnRlcnZhbFwiLCBcImR1cmF0aW9uXCJdKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiTG9naWNBbmFseXplciBzdGFydCBwYXJhbSAnXCIgKyBlcnIgKyBcIicgcmVxdWlyZWQsIGJ1dCBub3QgZm91bmQgXCIsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnBhcmFtcyA9IE9ibml6VXRpbC5fa2V5RmlsdGVyKHBhcmFtcywgW1xuICAgICAgXCJpb1wiLFxuICAgICAgXCJpbnRlcnZhbFwiLFxuICAgICAgXCJkdXJhdGlvblwiLFxuICAgICAgXCJ0cmlnZ2VyVmFsdWVcIixcbiAgICAgIFwidHJpZ2dlclZhbHVlU2FtcGxlc1wiLFxuICAgIF0pO1xuXG4gICAgY29uc3Qgb2JqOiBhbnkgPSB7fTtcbiAgICBvYmoubG9naWNfYW5hbHl6ZXIgPSB7XG4gICAgICBpbzogW3RoaXMucGFyYW1zLmlvXSxcbiAgICAgIGludGVydmFsOiB0aGlzLnBhcmFtcy5pbnRlcnZhbCxcbiAgICAgIGR1cmF0aW9uOiB0aGlzLnBhcmFtcy5kdXJhdGlvbixcbiAgICB9O1xuICAgIGlmICh0aGlzLnBhcmFtcy50cmlnZ2VyVmFsdWVTYW1wbGVzID4gMCkge1xuICAgICAgb2JqLmxvZ2ljX2FuYWx5emVyLnRyaWdnZXIgPSB7XG4gICAgICAgIHZhbHVlOiAhIXRoaXMucGFyYW1zLnRyaWdnZXJWYWx1ZSxcbiAgICAgICAgc2FtcGxlczogdGhpcy5wYXJhbXMudHJpZ2dlclZhbHVlU2FtcGxlcyxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5vYm5pei5zZW5kKG9iaik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHVibGljIGVuZCgpIHtcbiAgICBjb25zdCBvYmo6IGFueSA9IHt9O1xuICAgIG9iai5sb2dpY19hbmFseXplciA9IG51bGw7XG4gICAgdGhpcy5vYm5pei5zZW5kKG9iaik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHVibGljIG5vdGlmaWVkKG9iajogYW55KSB7XG4gICAgaWYgKHRoaXMub25tZWFzdXJlZCkge1xuICAgICAgdGhpcy5vbm1lYXN1cmVkKG9iai5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLm1lYXN1cmVkKSB7XG4gICAgICAgIHRoaXMubWVhc3VyZWQgPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWVhc3VyZWQucHVzaChvYmouZGF0YSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dpY0FuYWx5emVyO1xuIl19
