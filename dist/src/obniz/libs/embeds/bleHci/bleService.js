"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
class BleService extends bleLocalAttributeAbstract_1.default {
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
    get characteristics() {
        return this.children;
    }
    get advData() {
        return {
            flags: ["general_discoverable_mode", "br_edr_not_supported"],
            serviceUuids: [this.uuid],
        };
    }
    end() {
        this.peripheral.removeService(this.uuid);
    }
    emit(name, ...params) {
    }
    notify(notifyName, params) {
        // nothing
    }
}
exports.default = BleService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRFQUFvRDtBQUNwRCw0RkFBb0U7QUFFcEUsTUFBTSxVQUFXLFNBQVEsbUNBQXlCO0lBU2hELFlBQVksR0FBUTtRQUNsQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFWCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sMkJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU87WUFDTCxLQUFLLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxzQkFBc0IsQ0FBQztZQUM1RCxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUM7SUFDSixDQUFDO0lBRU0sR0FBRztRQUNSLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sSUFBSSxDQUFDLElBQVMsRUFBRSxHQUFHLE1BQVc7SUFDckMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFlLEVBQUUsTUFBVztRQUN4QyxVQUFVO0lBQ1osQ0FBQztDQUNGO0FBRUQsa0JBQWUsVUFBVSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVDaGFyYWN0ZXJpc3RpYyBmcm9tIFwiLi9ibGVDaGFyYWN0ZXJpc3RpY1wiO1xuaW1wb3J0IEJsZUxvY2FsQXR0cmlidXRlQWJzdHJhY3QgZnJvbSBcIi4vYmxlTG9jYWxBdHRyaWJ1dGVBYnN0cmFjdFwiO1xuXG5jbGFzcyBCbGVTZXJ2aWNlIGV4dGVuZHMgQmxlTG9jYWxBdHRyaWJ1dGVBYnN0cmFjdCB7XG4gIHB1YmxpYyBhZGRDaGFyYWN0ZXJpc3RpYzogYW55O1xuICBwdWJsaWMgYWRkQ2hpbGQ6IGFueTtcbiAgcHVibGljIGdldENoYXJhY3RlcmlzdGljOiBhbnk7XG4gIHB1YmxpYyBnZXRDaGlsZDogYW55O1xuICBwdWJsaWMgY2hpbGRyZW46IGFueTtcbiAgcHVibGljIHV1aWQ6IGFueTtcbiAgcHVibGljIHBlcmlwaGVyYWw6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvYmo6IGFueSkge1xuICAgIHN1cGVyKG9iaik7XG5cbiAgICB0aGlzLmFkZENoYXJhY3RlcmlzdGljID0gdGhpcy5hZGRDaGlsZDtcbiAgICB0aGlzLmdldENoYXJhY3RlcmlzdGljID0gdGhpcy5nZXRDaGlsZDtcbiAgfVxuXG4gIGdldCBwYXJlbnROYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiBcInBlcmlwaGVyYWxcIjtcbiAgfVxuXG4gIGdldCBjaGlsZHJlbk5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIFwiY2hhcmFjdGVyaXN0aWNzXCI7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5DbGFzcygpOiBhbnkge1xuICAgIHJldHVybiBCbGVDaGFyYWN0ZXJpc3RpYztcbiAgfVxuXG4gIGdldCBjaGFyYWN0ZXJpc3RpY3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gIH1cblxuICBnZXQgYWR2RGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmxhZ3M6IFtcImdlbmVyYWxfZGlzY292ZXJhYmxlX21vZGVcIiwgXCJicl9lZHJfbm90X3N1cHBvcnRlZFwiXSxcbiAgICAgIHNlcnZpY2VVdWlkczogW3RoaXMudXVpZF0sXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBlbmQoKSB7XG4gICAgdGhpcy5wZXJpcGhlcmFsLnJlbW92ZVNlcnZpY2UodGhpcy51dWlkKTtcbiAgfVxuXG4gIHB1YmxpYyBlbWl0KG5hbWU6IGFueSwgLi4ucGFyYW1zOiBhbnkpOiBhbnkge1xuICB9XG5cbiAgcHVibGljIG5vdGlmeShub3RpZnlOYW1lOiBhbnksIHBhcmFtczogYW55KSB7XG4gICAgLy8gbm90aGluZ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZVNlcnZpY2U7XG4iXX0=
