"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleService_1 = __importDefault(require("./bleService"));
class BlePeripheral {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this._services = [];
    }
    get services() {
        return this._services;
    }
    addService(obj) {
        if (!(obj instanceof bleService_1.default)) {
            obj = new bleService_1.default(obj);
        }
        this._services.push(obj);
        obj.peripheral = this;
        this.Obniz.send({ ble: { peripheral: { services: [obj] } } });
    }
    setJson(json) {
        if (json.services) {
            for (const service of json.services) {
                this.addService(service);
            }
        }
    }
    getService(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        return this._services
            .filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) === uuid;
        })
            .shift();
    }
    removeService(uuid) {
        this._services = this._services.filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) !== uuid;
        });
    }
    stopAllService() {
        this.Obniz.send({
            ble: {
                peripheral: null,
            },
        });
        this._services = [];
    }
    toJSON() {
        return {
            services: this._services,
        };
    }
    findCharacteristic(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        const characteristicUuid = bleHelper_1.default.uuidFilter(param.characteristic_uuid);
        const s = this.getService(serviceUuid);
        if (s) {
            return s.getCharacteristic(characteristicUuid);
        }
        return null;
    }
    findDescriptor(param) {
        const descriptorUuid = bleHelper_1.default.uuidFilter(param.descriptor_uuid);
        const c = this.findCharacteristic(param);
        if (c) {
            return c.getDescriptor(descriptorUuid);
        }
        return null;
    }
    end() {
        this.Obniz.send({ ble: { peripheral: null } });
    }
    onconnectionupdates() {
    }
    onerror() {
    }
}
exports.default = BlePeripheral;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUGVyaXBoZXJhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUNwQyw4REFBc0M7QUFFdEMsTUFBTSxhQUFhO0lBSWpCLFlBQVksS0FBVTtRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxVQUFVLENBQUMsR0FBUTtRQUN4QixJQUFJLENBQUMsQ0FBQyxHQUFHLFlBQVksb0JBQVUsQ0FBQyxFQUFFO1lBQ2hDLEdBQUcsR0FBRyxJQUFJLG9CQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxFQUFDLFVBQVUsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFTO1FBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDMUI7U0FDRjtJQUNILENBQUM7SUFFTSxVQUFVLENBQUMsSUFBUztRQUN6QixJQUFJLEdBQUcsbUJBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUMsU0FBUzthQUNsQixNQUFNLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUN2QixPQUFPLG1CQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUM7UUFDckQsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxFQUFFLENBQUM7SUFDYixDQUFDO0lBRU0sYUFBYSxDQUFDLElBQVM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBRSxDQUFDLE9BQVksRUFBRyxFQUFFO1lBQ3hELE9BQU8sbUJBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxjQUFjO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2QsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRSxJQUFJO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLE1BQU07UUFDWCxPQUFPO1lBQ0wsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQ3pCLENBQUM7SUFDSixDQUFDO0lBRU0sa0JBQWtCLENBQUMsS0FBVTtRQUNsQyxNQUFNLFdBQVcsR0FBUSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEUsTUFBTSxrQkFBa0IsR0FBUSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNoRixNQUFNLENBQUMsR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGNBQWMsQ0FBQyxLQUFVO1FBQzlCLE1BQU0sY0FBYyxHQUFRLG1CQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsR0FBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEVBQUU7WUFDTCxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxHQUFHO1FBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsSUFBSSxFQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxtQkFBbUI7SUFDMUIsQ0FBQztJQUVNLE9BQU87SUFDZCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxhQUFhLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZS9ibGVQZXJpcGhlcmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsZUhlbHBlciBmcm9tIFwiLi9ibGVIZWxwZXJcIjtcbmltcG9ydCBCbGVTZXJ2aWNlIGZyb20gXCIuL2JsZVNlcnZpY2VcIjtcblxuY2xhc3MgQmxlUGVyaXBoZXJhbCB7XG4gIHB1YmxpYyBPYm5pejogYW55O1xuICBwdWJsaWMgX3NlcnZpY2VzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoT2JuaXo6IGFueSkge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLl9zZXJ2aWNlcyA9IFtdO1xuICB9XG5cbiAgZ2V0IHNlcnZpY2VzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlcztcbiAgfVxuXG4gIHB1YmxpYyBhZGRTZXJ2aWNlKG9iajogYW55KSB7XG4gICAgaWYgKCEob2JqIGluc3RhbmNlb2YgQmxlU2VydmljZSkpIHtcbiAgICAgIG9iaiA9IG5ldyBCbGVTZXJ2aWNlKG9iaik7XG4gICAgfVxuICAgIHRoaXMuX3NlcnZpY2VzLnB1c2gob2JqKTtcbiAgICBvYmoucGVyaXBoZXJhbCA9IHRoaXM7XG4gICAgdGhpcy5PYm5pei5zZW5kKHtibGU6IHtwZXJpcGhlcmFsOiB7c2VydmljZXM6IFtvYmpdfX19KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRKc29uKGpzb246IGFueSkge1xuICAgIGlmIChqc29uLnNlcnZpY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IHNlcnZpY2Ugb2YganNvbi5zZXJ2aWNlcykge1xuICAgICAgICB0aGlzLmFkZFNlcnZpY2Uoc2VydmljZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFNlcnZpY2UodXVpZDogYW55KSB7XG4gICAgdXVpZCA9IEJsZUhlbHBlci51dWlkRmlsdGVyKHV1aWQpO1xuICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlc1xuICAgICAgLmZpbHRlcigoZWxlbWVudDogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBCbGVIZWxwZXIudXVpZEZpbHRlcihlbGVtZW50LnV1aWQpID09PSB1dWlkO1xuICAgICAgfSlcbiAgICAgIC5zaGlmdCgpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZVNlcnZpY2UodXVpZDogYW55KSB7XG4gICAgdGhpcy5fc2VydmljZXMgPSB0aGlzLl9zZXJ2aWNlcy5maWx0ZXIgKChlbGVtZW50OiBhbnkgKSA9PiB7XG4gICAgICByZXR1cm4gQmxlSGVscGVyLnV1aWRGaWx0ZXIoZWxlbWVudC51dWlkKSAhPT0gdXVpZDtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdG9wQWxsU2VydmljZSgpIHtcbiAgICB0aGlzLk9ibml6LnNlbmQoe1xuICAgICAgYmxlOiB7XG4gICAgICAgIHBlcmlwaGVyYWw6IG51bGwsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuX3NlcnZpY2VzID0gW107XG4gIH1cblxuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZXJ2aWNlczogdGhpcy5fc2VydmljZXMsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kQ2hhcmFjdGVyaXN0aWMocGFyYW06IGFueSkge1xuICAgIGNvbnN0IHNlcnZpY2VVdWlkOiBhbnkgPSBCbGVIZWxwZXIudXVpZEZpbHRlcihwYXJhbS5zZXJ2aWNlX3V1aWQpO1xuICAgIGNvbnN0IGNoYXJhY3RlcmlzdGljVXVpZDogYW55ID0gQmxlSGVscGVyLnV1aWRGaWx0ZXIocGFyYW0uY2hhcmFjdGVyaXN0aWNfdXVpZCk7XG4gICAgY29uc3QgczogYW55ID0gdGhpcy5nZXRTZXJ2aWNlKHNlcnZpY2VVdWlkKTtcbiAgICBpZiAocykge1xuICAgICAgcmV0dXJuIHMuZ2V0Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNVdWlkKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgZmluZERlc2NyaXB0b3IocGFyYW06IGFueSkge1xuICAgIGNvbnN0IGRlc2NyaXB0b3JVdWlkOiBhbnkgPSBCbGVIZWxwZXIudXVpZEZpbHRlcihwYXJhbS5kZXNjcmlwdG9yX3V1aWQpO1xuICAgIGNvbnN0IGM6IGFueSA9IHRoaXMuZmluZENoYXJhY3RlcmlzdGljKHBhcmFtKTtcbiAgICBpZiAoYykge1xuICAgICAgcmV0dXJuIGMuZ2V0RGVzY3JpcHRvcihkZXNjcmlwdG9yVXVpZCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGVuZCgpIHtcbiAgICB0aGlzLk9ibml6LnNlbmQoe2JsZToge3BlcmlwaGVyYWw6IG51bGx9fSk7XG4gIH1cblxuICBwdWJsaWMgb25jb25uZWN0aW9udXBkYXRlcygpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbmVycm9yKCkge1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZVBlcmlwaGVyYWw7XG4iXX0=
