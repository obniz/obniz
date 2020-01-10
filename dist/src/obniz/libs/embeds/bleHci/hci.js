"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizBLEHci {
    constructor(Obniz) {
        this.Obniz = Obniz;
    }
    write(hciCommand) {
        this.Obniz.send({
            ble: {
                hci: {
                    write: hciCommand,
                },
            },
        });
    }
    notified(obj) {
        if (obj.read && obj.read.data) {
            this.onread(obj.read.data);
        }
    }
    onread(data) {
    }
}
exports.default = ObnizBLEHci;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvaGNpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxXQUFXO0lBR2YsWUFBWSxLQUFVO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFTSxLQUFLLENBQUMsVUFBZTtRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNkLEdBQUcsRUFBRTtnQkFDSCxHQUFHLEVBQUU7b0JBQ0gsS0FBSyxFQUFFLFVBQVU7aUJBQ2xCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sUUFBUSxDQUFDLEdBQVE7UUFDdEIsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFTSxNQUFNLENBQUMsSUFBUztJQUN2QixDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxXQUFXLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9oY2kuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBPYm5pekJMRUhjaSB7XG4gIHB1YmxpYyBPYm5pejogYW55O1xuXG4gIGNvbnN0cnVjdG9yKE9ibml6OiBhbnkpIHtcbiAgICB0aGlzLk9ibml6ID0gT2JuaXo7XG4gIH1cblxuICBwdWJsaWMgd3JpdGUoaGNpQ29tbWFuZDogYW55KSB7XG4gICAgdGhpcy5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBoY2k6IHtcbiAgICAgICAgICB3cml0ZTogaGNpQ29tbWFuZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZpZWQob2JqOiBhbnkpIHtcbiAgICBpZiAob2JqLnJlYWQgJiYgb2JqLnJlYWQuZGF0YSkge1xuICAgICAgdGhpcy5vbnJlYWQob2JqLnJlYWQuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9ucmVhZChkYXRhOiBhbnkpIHtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPYm5pekJMRUhjaTtcbiJdfQ==
