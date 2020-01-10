"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleService extends bleAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.addCharacteristic = this.addChild;
        this.getCharacteristic = this.getChild;
    }
    get parentName() {
        return "peripheral";
    }
    get childrenName() {
        return "characteristics";
    }
    get childrenClass() {
        return bleCharacteristic_1.default;
    }
    get advData() {
        return {
            flags: ["general_discoverable_mode", "br_edr_not_supported"],
            serviceUuids: [this.uuid],
        };
    }
    end() {
        this.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    stop_service: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    },
                },
            },
        });
        this.peripheral.removeService(this.uuid);
    }
    notify(notifyName, params) {
        // nothing
    }
}
exports.default = BleService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtGQUEwRDtBQUMxRCw0RUFBb0Q7QUFDcEQsNERBQW9DO0FBRXBDLE1BQU0sVUFBVyxTQUFRLDhCQUFvQjtJQVEzQyxZQUFZLEdBQVE7UUFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVgsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLGlCQUFpQixDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDZixPQUFPLDJCQUFpQixDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPO1lBQ0wsS0FBSyxFQUFFLENBQUMsMkJBQTJCLEVBQUUsc0JBQXNCLENBQUM7WUFDNUQsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUMxQixDQUFDO0lBQ0osQ0FBQztJQUVNLEdBQUc7UUFDUixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDekIsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRTtvQkFDVixZQUFZLEVBQUU7d0JBQ1osWUFBWSxFQUFFLG1CQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7cUJBQzlDO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFlLEVBQUUsTUFBVztRQUN4QyxVQUFVO0lBQ1osQ0FBQztDQUNGO0FBRUQsa0JBQWUsVUFBVSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVBdHRyaWJ1dGVBYnN0cmFjdCBmcm9tIFwiLi9ibGVBdHRyaWJ1dGVBYnN0cmFjdFwiO1xuaW1wb3J0IEJsZUNoYXJhY3RlcmlzdGljIGZyb20gXCIuL2JsZUNoYXJhY3RlcmlzdGljXCI7XG5pbXBvcnQgQmxlSGVscGVyIGZyb20gXCIuL2JsZUhlbHBlclwiO1xuXG5jbGFzcyBCbGVTZXJ2aWNlIGV4dGVuZHMgQmxlQXR0cmlidXRlQWJzdHJhY3Qge1xuICBwdWJsaWMgYWRkQ2hhcmFjdGVyaXN0aWM6IGFueTtcbiAgcHVibGljIGFkZENoaWxkOiBhbnk7XG4gIHB1YmxpYyBnZXRDaGFyYWN0ZXJpc3RpYzogYW55O1xuICBwdWJsaWMgZ2V0Q2hpbGQ6IGFueTtcbiAgcHVibGljIHV1aWQ6IGFueTtcbiAgcHVibGljIHBlcmlwaGVyYWw6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvYmo6IGFueSkge1xuICAgIHN1cGVyKG9iaik7XG5cbiAgICB0aGlzLmFkZENoYXJhY3RlcmlzdGljID0gdGhpcy5hZGRDaGlsZDtcbiAgICB0aGlzLmdldENoYXJhY3RlcmlzdGljID0gdGhpcy5nZXRDaGlsZDtcbiAgfVxuXG4gIGdldCBwYXJlbnROYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiBcInBlcmlwaGVyYWxcIjtcbiAgfVxuXG4gIGdldCBjaGlsZHJlbk5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIFwiY2hhcmFjdGVyaXN0aWNzXCI7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5DbGFzcygpOiBhbnkge1xuICAgIHJldHVybiBCbGVDaGFyYWN0ZXJpc3RpYztcbiAgfVxuXG4gIGdldCBhZHZEYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmbGFnczogW1wiZ2VuZXJhbF9kaXNjb3ZlcmFibGVfbW9kZVwiLCBcImJyX2Vkcl9ub3Rfc3VwcG9ydGVkXCJdLFxuICAgICAgc2VydmljZVV1aWRzOiBbdGhpcy51dWlkXSxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGVuZCgpIHtcbiAgICB0aGlzLnBlcmlwaGVyYWwuT2JuaXouc2VuZCh7XG4gICAgICBibGU6IHtcbiAgICAgICAgcGVyaXBoZXJhbDoge1xuICAgICAgICAgIHN0b3Bfc2VydmljZToge1xuICAgICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnV1aWQpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMucGVyaXBoZXJhbC5yZW1vdmVTZXJ2aWNlKHRoaXMudXVpZCk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5KG5vdGlmeU5hbWU6IGFueSwgcGFyYW1zOiBhbnkpIHtcbiAgICAvLyBub3RoaW5nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxlU2VydmljZTtcbiJdfQ==
