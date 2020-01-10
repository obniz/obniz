"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleDescriptor extends bleAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.permissions = obj.permissions || [];
        if (!Array.isArray(this.permissions)) {
            this.permissions = [this.permissions];
        }
    }
    get parentName() {
        return "characteristic";
    }
    addPermission(param) {
        if (!this.permissions.includes(param)) {
            this.permissions.push(param);
        }
    }
    removePermission(param) {
        this.permissions = this.permissions.filter((elm) => {
            return elm !== param;
        });
    }
    toJSON() {
        const obj = super.toJSON();
        if (this.permissions.length > 0) {
            obj.permissions = this.permissions;
        }
        return obj;
    }
    write(dataArray) {
        this.characteristic.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    write_descriptor: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                        descriptor_uuid: this.uuid,
                        data: dataArray,
                    },
                },
            },
        });
    }
    read() {
        this.characteristic.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    read_descriptor: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                        descriptor_uuid: this.uuid,
                    },
                },
            },
        });
    }
}
exports.default = BleDescriptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlRGVzY3JpcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtGQUEwRDtBQUMxRCw0REFBb0M7QUFFcEMsTUFBTSxhQUFjLFNBQVEsOEJBQW9CO0lBSzlDLFlBQVksR0FBUTtRQUNsQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFWCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxLQUFVO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxLQUFVO1FBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUUsQ0FBQyxHQUFRLEVBQUcsRUFBRTtZQUN4RCxPQUFPLEdBQUcsS0FBSyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sTUFBTTtRQUNYLE1BQU0sR0FBRyxHQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVoQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMvQixHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDcEM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxLQUFLLENBQUMsU0FBYztRQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNoRCxHQUFHLEVBQUU7Z0JBQ0gsVUFBVSxFQUFFO29CQUNWLGdCQUFnQixFQUFFO3dCQUNoQixZQUFZLEVBQUUsbUJBQVMsQ0FBQyxVQUFVLENBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDakM7d0JBQ0QsbUJBQW1CLEVBQUUsbUJBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7d0JBQ25FLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSTt3QkFDMUIsSUFBSSxFQUFFLFNBQVM7cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sSUFBSTtRQUNULElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2hELEdBQUcsRUFBRTtnQkFDSCxVQUFVLEVBQUU7b0JBQ1YsZUFBZSxFQUFFO3dCQUNmLFlBQVksRUFBRSxtQkFBUyxDQUFDLFVBQVUsQ0FDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUNqQzt3QkFDRCxtQkFBbUIsRUFBRSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQzt3QkFDbkUsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUMzQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsa0JBQWUsYUFBYSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlRGVzY3JpcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVBdHRyaWJ1dGVBYnN0cmFjdCBmcm9tIFwiLi9ibGVBdHRyaWJ1dGVBYnN0cmFjdFwiO1xuaW1wb3J0IEJsZUhlbHBlciBmcm9tIFwiLi9ibGVIZWxwZXJcIjtcblxuY2xhc3MgQmxlRGVzY3JpcHRvciBleHRlbmRzIEJsZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgcHVibGljIHBlcm1pc3Npb25zOiBhbnk7XG4gIHB1YmxpYyBjaGFyYWN0ZXJpc3RpYzogYW55O1xuICBwdWJsaWMgdXVpZDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9iajogYW55KSB7XG4gICAgc3VwZXIob2JqKTtcblxuICAgIHRoaXMucGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICB0aGlzLnBlcm1pc3Npb25zID0gW3RoaXMucGVybWlzc2lvbnNdO1xuICAgIH1cbiAgfVxuXG4gIGdldCBwYXJlbnROYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiBcImNoYXJhY3RlcmlzdGljXCI7XG4gIH1cblxuICBwdWJsaWMgYWRkUGVybWlzc2lvbihwYXJhbTogYW55KSB7XG4gICAgaWYgKCF0aGlzLnBlcm1pc3Npb25zLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgdGhpcy5wZXJtaXNzaW9ucy5wdXNoKHBhcmFtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlUGVybWlzc2lvbihwYXJhbTogYW55KSB7XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnMuZmlsdGVyICgoZWxtOiBhbnkgKSA9PiB7XG4gICAgICByZXR1cm4gZWxtICE9PSBwYXJhbTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSBzdXBlci50b0pTT04oKTtcblxuICAgIGlmICh0aGlzLnBlcm1pc3Npb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIG9iai5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnM7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBwdWJsaWMgd3JpdGUoZGF0YUFycmF5OiBhbnkpIHtcbiAgICB0aGlzLmNoYXJhY3RlcmlzdGljLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBwZXJpcGhlcmFsOiB7XG4gICAgICAgICAgd3JpdGVfZGVzY3JpcHRvcjoge1xuICAgICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcihcbiAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnV1aWQsXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5jaGFyYWN0ZXJpc3RpYy51dWlkKSxcbiAgICAgICAgICAgIGRlc2NyaXB0b3JfdXVpZDogdGhpcy51dWlkLFxuICAgICAgICAgICAgZGF0YTogZGF0YUFycmF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlYWQoKSB7XG4gICAgdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZCh7XG4gICAgICBibGU6IHtcbiAgICAgICAgcGVyaXBoZXJhbDoge1xuICAgICAgICAgIHJlYWRfZGVzY3JpcHRvcjoge1xuICAgICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcihcbiAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnV1aWQsXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5jaGFyYWN0ZXJpc3RpYy51dWlkKSxcbiAgICAgICAgICAgIGRlc2NyaXB0b3JfdXVpZDogdGhpcy51dWlkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZURlc2NyaXB0b3I7XG4iXX0=
