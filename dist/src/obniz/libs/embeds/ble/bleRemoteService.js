"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteAttributeAbstract_1 = __importDefault(require("./bleRemoteAttributeAbstract"));
const bleRemoteCharacteristic_1 = __importDefault(require("./bleRemoteCharacteristic"));
class BleRemoteService extends bleRemoteAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
    }
    get parentName() {
        return "peripheral";
    }
    get childrenClass() {
        return bleRemoteCharacteristic_1.default;
    }
    get childrenName() {
        return "characteristics";
    }
    get characteristics() {
        return this.children;
    }
    addCharacteristic(params) {
        return this.addChild(params);
    }
    getCharacteristic(params) {
        return this.getChild(params);
    }
    discoverAllCharacteristics() {
        return this.discoverChildren();
    }
    discoverAllCharacteristicsWait() {
        return this.discoverChildrenWait();
    }
    discoverChildren() {
        const obj = {
            ble: {
                get_characteristics: {
                    address: this.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.parent.Obniz.send(obj);
    }
    ondiscover(characteristic) {
        this.ondiscovercharacteristic(characteristic);
    }
    ondiscoverfinished(characteristics) {
        this.ondiscovercharacteristicfinished(characteristics);
    }
    ondiscovercharacteristic(characteristic) {
    }
    ondiscovercharacteristicfinished(characteristics) {
    }
}
exports.default = BleRemoteService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUNwQyw4RkFBc0U7QUFDdEUsd0ZBQWdFO0FBRWhFLE1BQU0sZ0JBQWlCLFNBQVEsb0NBQTBCO0lBU3ZELFlBQVksR0FBUTtRQUNsQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8saUNBQXVCLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLE1BQVc7UUFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxNQUFXO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU0sMEJBQTBCO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVNLDhCQUE4QjtRQUNuQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTSxnQkFBZ0I7UUFDckIsTUFBTSxHQUFHLEdBQVE7WUFDZixHQUFHLEVBQUU7Z0JBQ0gsbUJBQW1CLEVBQUU7b0JBQ25CLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU87b0JBQ2hDLFlBQVksRUFBRSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUM5QzthQUNGO1NBQ0YsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sVUFBVSxDQUFDLGNBQW1CO1FBQ25DLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sa0JBQWtCLENBQUMsZUFBb0I7UUFDNUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSx3QkFBd0IsQ0FBQyxjQUFtQjtJQUNuRCxDQUFDO0lBRU0sZ0NBQWdDLENBQUMsZUFBc0I7SUFDOUQsQ0FBQztDQUNGO0FBRUQsa0JBQWUsZ0JBQWdCLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZS9ibGVSZW1vdGVTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsZUhlbHBlciBmcm9tIFwiLi9ibGVIZWxwZXJcIjtcbmltcG9ydCBCbGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdCBmcm9tIFwiLi9ibGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdFwiO1xuaW1wb3J0IEJsZVJlbW90ZUNoYXJhY3RlcmlzdGljIGZyb20gXCIuL2JsZVJlbW90ZUNoYXJhY3RlcmlzdGljXCI7XG5cbmNsYXNzIEJsZVJlbW90ZVNlcnZpY2UgZXh0ZW5kcyBCbGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdCB7XG4gIHB1YmxpYyBjaGlsZHJlbjogYW55O1xuICBwdWJsaWMgYWRkQ2hpbGQ6IGFueTtcbiAgcHVibGljIGdldENoaWxkOiBhbnk7XG4gIHB1YmxpYyBkaXNjb3ZlckNoaWxkcmVuV2FpdDogYW55O1xuICBwdWJsaWMgcGVyaXBoZXJhbDogYW55O1xuICBwdWJsaWMgdXVpZDogYW55O1xuICBwdWJsaWMgcGFyZW50OiBhbnk7XG5cbiAgY29uc3RydWN0b3Iob2JqOiBhbnkpIHtcbiAgICBzdXBlcihvYmopO1xuICB9XG5cbiAgZ2V0IHBhcmVudE5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIFwicGVyaXBoZXJhbFwiO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuQ2xhc3MoKTogYW55IHtcbiAgICByZXR1cm4gQmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWM7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5OYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiBcImNoYXJhY3RlcmlzdGljc1wiO1xuICB9XG5cbiAgZ2V0IGNoYXJhY3RlcmlzdGljcygpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgfVxuXG4gIHB1YmxpYyBhZGRDaGFyYWN0ZXJpc3RpYyhwYXJhbXM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmFkZENoaWxkKHBhcmFtcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2hhcmFjdGVyaXN0aWMocGFyYW1zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZChwYXJhbXMpO1xuICB9XG5cbiAgcHVibGljIGRpc2NvdmVyQWxsQ2hhcmFjdGVyaXN0aWNzKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NvdmVyQ2hpbGRyZW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckFsbENoYXJhY3RlcmlzdGljc1dhaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY292ZXJDaGlsZHJlbldhaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckNoaWxkcmVuKCkge1xuICAgIGNvbnN0IG9iajogYW55ID0ge1xuICAgICAgYmxlOiB7XG4gICAgICAgIGdldF9jaGFyYWN0ZXJpc3RpY3M6IHtcbiAgICAgICAgICBhZGRyZXNzOiB0aGlzLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMudXVpZCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5wYXJlbnQuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgcHVibGljIG9uZGlzY292ZXIoY2hhcmFjdGVyaXN0aWM6IGFueSkge1xuICAgIHRoaXMub25kaXNjb3ZlcmNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljKTtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyZmluaXNoZWQoY2hhcmFjdGVyaXN0aWNzOiBhbnkpIHtcbiAgICB0aGlzLm9uZGlzY292ZXJjaGFyYWN0ZXJpc3RpY2ZpbmlzaGVkKGNoYXJhY3RlcmlzdGljcyk7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcmNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljOiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyY2hhcmFjdGVyaXN0aWNmaW5pc2hlZChjaGFyYWN0ZXJpc3RpY3M6IGFueVtdKSB7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxlUmVtb3RlU2VydmljZTtcbiJdfQ==
