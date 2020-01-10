"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitter = require("eventemitter3");
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleScan {
    constructor(Obniz) {
        this.scanTarget = null;
        this.Obniz = Obniz;
        this.emitter = new emitter();
        this.scanedPeripherals = [];
    }
    start(target, settings) {
        const obj = {};
        obj.ble = {};
        obj.ble.scan = {
            //    "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
            //    "interval" : settings && settings.interval ? settings.interval : 30,
            duration: settings && settings.duration ? settings.duration : 30,
        };
        if (settings && settings.duplicate) {
            throw new Error(`duplicate property can only be used with obnizOS3 or later`);
        }
        this.scanTarget = target;
        if (this.scanTarget &&
            this.scanTarget.uuids &&
            Array.isArray(this.scanTarget.uuids)) {
            this.scanTarget.uuids = this.scanTarget.uuids.map((elm) => {
                return bleHelper_1.default.uuidFilter(elm);
            });
        }
        this.scanedPeripherals = [];
        this.Obniz.send(obj);
    }
    startOneWait(target, settings) {
        let state = 0;
        return new Promise((resolve) => {
            this.emitter.once("onfind", (param) => {
                if (state === 0) {
                    state = 1;
                    this.end();
                    resolve(param);
                }
            });
            this.emitter.once("onfinish", () => {
                if (state === 0) {
                    state = 1;
                    resolve(null);
                }
            });
            this.start(target, settings);
        });
    }
    startAllWait(target, settings) {
        return new Promise((resolve) => {
            this.emitter.once("onfinish", () => {
                resolve(this.scanedPeripherals);
            });
            this.start(target, settings);
        });
    }
    end() {
        const obj = {};
        obj.ble = {};
        obj.ble.scan = null;
        this.Obniz.send(obj);
    }
    isTarget(peripheral) {
        if (this.scanTarget &&
            this.scanTarget.localName &&
            peripheral.localName !== this.scanTarget.localName) {
            return false;
        }
        if (this.scanTarget && this.scanTarget.uuids) {
            const uuids = peripheral.advertisementServiceUuids().map((e) => {
                return bleHelper_1.default.uuidFilter(e);
            });
            for (const uuid of this.scanTarget.uuids) {
                if (!uuids.includes(uuid)) {
                    return false;
                }
            }
        }
        return true;
    }
    onfinish(scanedPeripherals) {
    } // dummy
    onfind(params) {
    } // dummy
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case "onfind": {
                if (this.isTarget(params)) {
                    this.scanedPeripherals.push(params);
                    this.emitter.emit(notifyName, params);
                    this.onfind(params);
                }
                break;
            }
            case "onfinish": {
                this.emitter.emit(notifyName, this.scanedPeripherals);
                this.onfinish(this.scanedPeripherals);
                break;
            }
        }
    }
}
exports.default = BleScan;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2Nhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlDQUEwQztBQUMxQyw0REFBb0M7QUFFcEMsTUFBTSxPQUFPO0lBTVgsWUFBWSxLQUFVO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFTSxLQUFLLENBQUMsTUFBVyxFQUFFLFFBQWE7UUFDckMsTUFBTSxHQUFHLEdBQVEsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7WUFDYixrRkFBa0Y7WUFDbEYsMEVBQTBFO1lBQzFFLFFBQVEsRUFBRSxRQUFRLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUNqRSxDQUFDO1FBQ0YsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUNiLDREQUE0RCxDQUM3RCxDQUFDO1NBQ0g7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUN6QixJQUNFLElBQUksQ0FBQyxVQUFVO1lBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLO1lBQ3JCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFDcEM7WUFDQSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQyxH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UTtJQUNILE1BQU0sQ0FBQyxNQUFXO0lBQ3pCLENBQUMsQ0FBQyxRQUFRO0lBRUgsZ0JBQWdCLENBQUMsVUFBZSxFQUFFLE1BQVc7UUFDbEQsUUFBUSxVQUFVLEVBQUU7WUFDbEIsS0FBSyxRQUFRLENBQUMsQ0FBQztnQkFDYixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDckI7Z0JBQ0QsTUFBTTthQUNQO1lBQ0QsS0FBSyxVQUFVLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3RDLE1BQU07YUFDUDtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsT0FBTyxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2Nhbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbWl0dGVyID0gcmVxdWlyZShcImV2ZW50ZW1pdHRlcjNcIik7XG5pbXBvcnQgQmxlSGVscGVyIGZyb20gXCIuL2JsZUhlbHBlclwiO1xuXG5jbGFzcyBCbGVTY2FuIHtcbiAgcHVibGljIHNjYW5UYXJnZXQ6IGFueTtcbiAgcHVibGljIE9ibml6OiBhbnk7XG4gIHB1YmxpYyBlbWl0dGVyOiBhbnk7XG4gIHB1YmxpYyBzY2FuZWRQZXJpcGhlcmFsczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKE9ibml6OiBhbnkpIHtcbiAgICB0aGlzLnNjYW5UYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgZW1pdHRlcigpO1xuXG4gICAgdGhpcy5zY2FuZWRQZXJpcGhlcmFscyA9IFtdO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0KHRhcmdldDogYW55LCBzZXR0aW5nczogYW55KSB7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSB7fTtcbiAgICBvYmouYmxlID0ge307XG4gICAgb2JqLmJsZS5zY2FuID0ge1xuICAgICAgLy8gICAgXCJ0YXJnZXRVdWlkXCIgOiBzZXR0aW5ncyAmJiBzZXR0aW5ncy50YXJnZXRVdWlkID8gc2V0dGluZ3MudGFyZ2V0VXVpZCA6IG51bGwsXG4gICAgICAvLyAgICBcImludGVydmFsXCIgOiBzZXR0aW5ncyAmJiBzZXR0aW5ncy5pbnRlcnZhbCA/IHNldHRpbmdzLmludGVydmFsIDogMzAsXG4gICAgICBkdXJhdGlvbjogc2V0dGluZ3MgJiYgc2V0dGluZ3MuZHVyYXRpb24gPyBzZXR0aW5ncy5kdXJhdGlvbiA6IDMwLFxuICAgIH07XG4gICAgaWYgKHNldHRpbmdzICYmIHNldHRpbmdzLmR1cGxpY2F0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZHVwbGljYXRlIHByb3BlcnR5IGNhbiBvbmx5IGJlIHVzZWQgd2l0aCBvYm5pek9TMyBvciBsYXRlcmAsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc2NhblRhcmdldCA9IHRhcmdldDtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNjYW5UYXJnZXQgJiZcbiAgICAgIHRoaXMuc2NhblRhcmdldC51dWlkcyAmJlxuICAgICAgQXJyYXkuaXNBcnJheSh0aGlzLnNjYW5UYXJnZXQudXVpZHMpXG4gICAgKSB7XG4gICAgICB0aGlzLnNjYW5UYXJnZXQudXVpZHMgPSB0aGlzLnNjYW5UYXJnZXQudXVpZHMubWFwICgoZWxtOiBhbnkgKSA9PiB7XG4gICAgICAgIHJldHVybiBCbGVIZWxwZXIudXVpZEZpbHRlcihlbG0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuc2NhbmVkUGVyaXBoZXJhbHMgPSBbXTtcbiAgICB0aGlzLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydE9uZVdhaXQodGFyZ2V0OiBhbnksIHNldHRpbmdzOiBhbnkpIHtcbiAgICBsZXQgc3RhdGU6IGFueSA9IDA7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UgKChyZXNvbHZlOiBhbnkgKSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIub25jZShcIm9uZmluZFwiLCAocGFyYW06IGFueSApID0+IHtcbiAgICAgICAgaWYgKHN0YXRlID09PSAwKSB7XG4gICAgICAgICAgc3RhdGUgPSAxO1xuICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgICAgcmVzb2x2ZShwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmVtaXR0ZXIub25jZShcIm9uZmluaXNoXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHN0YXRlID09PSAwKSB7XG4gICAgICAgICAgc3RhdGUgPSAxO1xuICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnN0YXJ0KHRhcmdldCwgc2V0dGluZ3MpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0QWxsV2FpdCh0YXJnZXQ6IGFueSwgc2V0dGluZ3M6IGFueSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSAoKHJlc29sdmU6IGFueSApID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwib25maW5pc2hcIiwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHRoaXMuc2NhbmVkUGVyaXBoZXJhbHMpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3RhcnQodGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZW5kKCkge1xuICAgIGNvbnN0IG9iajogYW55ID0ge307XG4gICAgb2JqLmJsZSA9IHt9O1xuICAgIG9iai5ibGUuc2NhbiA9IG51bGw7XG4gICAgdGhpcy5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBwdWJsaWMgaXNUYXJnZXQocGVyaXBoZXJhbDogYW55KSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zY2FuVGFyZ2V0ICYmXG4gICAgICB0aGlzLnNjYW5UYXJnZXQubG9jYWxOYW1lICYmXG4gICAgICBwZXJpcGhlcmFsLmxvY2FsTmFtZSAhPT0gdGhpcy5zY2FuVGFyZ2V0LmxvY2FsTmFtZVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5zY2FuVGFyZ2V0ICYmIHRoaXMuc2NhblRhcmdldC51dWlkcykge1xuICAgICAgY29uc3QgdXVpZHM6IGFueSA9IHBlcmlwaGVyYWwuYWR2ZXJ0aXNlbWVudFNlcnZpY2VVdWlkcygpLm1hcCAoKGU6IGFueSApID0+IHtcbiAgICAgICAgcmV0dXJuIEJsZUhlbHBlci51dWlkRmlsdGVyKGUpO1xuICAgICAgfSk7XG4gICAgICBmb3IgKGNvbnN0IHV1aWQgb2YgdGhpcy5zY2FuVGFyZ2V0LnV1aWRzKSB7XG4gICAgICAgIGlmICghdXVpZHMuaW5jbHVkZXModXVpZCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwdWJsaWMgb25maW5pc2goc2NhbmVkUGVyaXBoZXJhbHM6IGFueSkge1xuICB9IC8vIGR1bW15XG4gIHB1YmxpYyBvbmZpbmQocGFyYW1zOiBhbnkpIHtcbiAgfSAvLyBkdW1teVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWU6IGFueSwgcGFyYW1zOiBhbnkpIHtcbiAgICBzd2l0Y2ggKG5vdGlmeU5hbWUpIHtcbiAgICAgIGNhc2UgXCJvbmZpbmRcIjoge1xuICAgICAgICBpZiAodGhpcy5pc1RhcmdldChwYXJhbXMpKSB7XG4gICAgICAgICAgdGhpcy5zY2FuZWRQZXJpcGhlcmFscy5wdXNoKHBhcmFtcyk7XG4gICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQobm90aWZ5TmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICB0aGlzLm9uZmluZChwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBcIm9uZmluaXNoXCI6IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQobm90aWZ5TmFtZSwgdGhpcy5zY2FuZWRQZXJpcGhlcmFscyk7XG4gICAgICAgIHRoaXMub25maW5pc2godGhpcy5zY2FuZWRQZXJpcGhlcmFscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCbGVTY2FuO1xuIl19
