"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../utils/util"));
class ObnizMeasure {
    constructor(obniz) {
        this.obniz = obniz;
        this._reset();
    }
    _reset() {
        this.observers = [];
    }
    echo(params) {
        const err = util_1.default._requiredKeys(params, [
            "io_pulse",
            "pulse",
            "pulse_width",
            "io_echo",
            "measure_edges",
        ]);
        if (err) {
            throw new Error("Measure start param '" + err + "' required, but not found ");
        }
        this.params = util_1.default._keyFilter(params, [
            "io_pulse",
            "pulse",
            "pulse_width",
            "io_echo",
            "measure_edges",
            "timeout",
            "callback",
        ]);
        const echo = {};
        echo.io_pulse = this.params.io_pulse;
        echo.pulse = this.params.pulse;
        echo.pulse_width = this.params.pulse_width;
        echo.io_echo = this.params.io_echo;
        echo.measure_edges = this.params.measure_edges;
        if (typeof this.params.timeout === "number") {
            echo.timeout = this.params.timeout;
        }
        this.obniz.send({
            measure: {
                echo,
            },
        });
        if (this.params.callback) {
            this.observers.push(this.params.callback);
        }
    }
    notified(obj) {
        const callback = this.observers.shift();
        if (callback) {
            callback(obj.echo);
        }
    }
}
exports.default = ObnizMeasure;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL21lYXN1cmVtZW50cy9tZWFzdXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseURBQXNDO0FBRXRDLE1BQU0sWUFBWTtJQUtoQixZQUFZLEtBQVU7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLElBQUksQ0FBQyxNQUFXO1FBQ3JCLE1BQU0sR0FBRyxHQUFRLGNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQy9DLFVBQVU7WUFDVixPQUFPO1lBQ1AsYUFBYTtZQUNiLFNBQVM7WUFDVCxlQUFlO1NBQ2hCLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxFQUFFO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FDYix1QkFBdUIsR0FBRyxHQUFHLEdBQUcsNEJBQTRCLENBQzdELENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsY0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekMsVUFBVTtZQUNWLE9BQU87WUFDUCxhQUFhO1lBQ2IsU0FBUztZQUNULGVBQWU7WUFDZixTQUFTO1lBQ1QsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFRLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDL0MsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDZCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSTthQUNMO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVNLFFBQVEsQ0FBQyxHQUFRO1FBQ3RCLE1BQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0MsSUFBSSxRQUFRLEVBQUU7WUFDWixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL21lYXN1cmVtZW50cy9tZWFzdXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9ibml6VXRpbCBmcm9tIFwiLi4vdXRpbHMvdXRpbFwiO1xuXG5jbGFzcyBPYm5pek1lYXN1cmUge1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIG9ic2VydmVyczogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG5cbiAgY29uc3RydWN0b3Iob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgcHVibGljIF9yZXNldCgpIHtcbiAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xuICB9XG5cbiAgcHVibGljIGVjaG8ocGFyYW1zOiBhbnkpIHtcbiAgICBjb25zdCBlcnI6IGFueSA9IE9ibml6VXRpbC5fcmVxdWlyZWRLZXlzKHBhcmFtcywgW1xuICAgICAgXCJpb19wdWxzZVwiLFxuICAgICAgXCJwdWxzZVwiLFxuICAgICAgXCJwdWxzZV93aWR0aFwiLFxuICAgICAgXCJpb19lY2hvXCIsXG4gICAgICBcIm1lYXN1cmVfZWRnZXNcIixcbiAgICBdKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiTWVhc3VyZSBzdGFydCBwYXJhbSAnXCIgKyBlcnIgKyBcIicgcmVxdWlyZWQsIGJ1dCBub3QgZm91bmQgXCIsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnBhcmFtcyA9IE9ibml6VXRpbC5fa2V5RmlsdGVyKHBhcmFtcywgW1xuICAgICAgXCJpb19wdWxzZVwiLFxuICAgICAgXCJwdWxzZVwiLFxuICAgICAgXCJwdWxzZV93aWR0aFwiLFxuICAgICAgXCJpb19lY2hvXCIsXG4gICAgICBcIm1lYXN1cmVfZWRnZXNcIixcbiAgICAgIFwidGltZW91dFwiLFxuICAgICAgXCJjYWxsYmFja1wiLFxuICAgIF0pO1xuXG4gICAgY29uc3QgZWNobzogYW55ID0ge307XG4gICAgZWNoby5pb19wdWxzZSA9IHRoaXMucGFyYW1zLmlvX3B1bHNlO1xuICAgIGVjaG8ucHVsc2UgPSB0aGlzLnBhcmFtcy5wdWxzZTtcbiAgICBlY2hvLnB1bHNlX3dpZHRoID0gdGhpcy5wYXJhbXMucHVsc2Vfd2lkdGg7XG4gICAgZWNoby5pb19lY2hvID0gdGhpcy5wYXJhbXMuaW9fZWNobztcbiAgICBlY2hvLm1lYXN1cmVfZWRnZXMgPSB0aGlzLnBhcmFtcy5tZWFzdXJlX2VkZ2VzO1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYXJhbXMudGltZW91dCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWNoby50aW1lb3V0ID0gdGhpcy5wYXJhbXMudGltZW91dDtcbiAgICB9XG5cbiAgICB0aGlzLm9ibml6LnNlbmQoe1xuICAgICAgbWVhc3VyZToge1xuICAgICAgICBlY2hvLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5jYWxsYmFjaykge1xuICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaCh0aGlzLnBhcmFtcy5jYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5vdGlmaWVkKG9iajogYW55KSB7XG4gICAgY29uc3QgY2FsbGJhY2s6IGFueSA9IHRoaXMub2JzZXJ2ZXJzLnNoaWZ0KCk7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhvYmouZWNobyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9ibml6TWVhc3VyZTtcbiJdfQ==
