"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleCharacteristic extends bleAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.addDescriptor = this.addChild;
        this.getDescriptor = this.getChild;
        this.properties = obj.properties || [];
        if (!Array.isArray(this.properties)) {
            this.properties = [this.properties];
        }
        this.permissions = obj.permissions || [];
        if (!Array.isArray(this.permissions)) {
            this.permissions = [this.permissions];
        }
    }
    get parentName() {
        return "service";
    }
    get childrenClass() {
        return bleDescriptor_1.default;
    }
    get childrenName() {
        return "descriptors";
    }
    get descriptors() {
        return this.children;
    }
    toJSON() {
        const obj = super.toJSON();
        if (this.properties.length > 0) {
            obj.properties = this.properties;
        }
        if (this.permissions.length > 0) {
            obj.permissions = this.permissions;
        }
        return obj;
    }
    addProperty(param) {
        if (!this.properties.includes(param)) {
            this.properties.push(param);
        }
    }
    removeProperty(param) {
        this.properties = this.properties.filter((elm) => {
            return elm !== param;
        });
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
    write(data) {
        this.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    write_characteristic: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                        data,
                    },
                },
            },
        });
    }
    read() {
        this.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    read_characteristic: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    },
                },
            },
        });
    }
    notify() {
        this.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    notify_characteristic: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    },
                },
            },
        });
    }
}
exports.default = BleCharacteristic;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlQ2hhcmFjdGVyaXN0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrRkFBMEQ7QUFDMUQsb0VBQTRDO0FBQzVDLDREQUFvQztBQUVwQyxNQUFNLGlCQUFrQixTQUFRLDhCQUFvQjtJQVdsRCxZQUFZLEdBQVE7UUFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVgsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUVuQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyx1QkFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxNQUFNO1FBQ1gsTUFBTSxHQUFHLEdB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bml6L2xpYnMvZW1iZWRzL2JsZS9ibGVDaGFyYWN0ZXJpc3RpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVBdHRyaWJ1dGVBYnN0cmFjdCBmcm9tIFwiLi9ibGVBdHRyaWJ1dGVBYnN0cmFjdFwiO1xuaW1wb3J0IEJsZURlc2NyaXB0b3IgZnJvbSBcIi4vYmxlRGVzY3JpcHRvclwiO1xuaW1wb3J0IEJsZUhlbHBlciBmcm9tIFwiLi9ibGVIZWxwZXJcIjtcblxuY2xhc3MgQmxlQ2hhcmFjdGVyaXN0aWMgZXh0ZW5kcyBCbGVBdHRyaWJ1dGVBYnN0cmFjdCB7XG4gIHB1YmxpYyBhZGREZXNjcmlwdG9yOiBhbnk7XG4gIHB1YmxpYyBhZGRDaGlsZDogYW55O1xuICBwdWJsaWMgZ2V0RGVzY3JpcHRvcjogYW55O1xuICBwdWJsaWMgZ2V0Q2hpbGQ6IGFueTtcbiAgcHVibGljIHByb3BlcnRpZXM6IGFueTtcbiAgcHVibGljIHBlcm1pc3Npb25zOiBhbnk7XG4gIHB1YmxpYyBjaGlsZHJlbjogYW55O1xuICBwdWJsaWMgc2VydmljZTogYW55O1xuICBwdWJsaWMgdXVpZDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9iajogYW55KSB7XG4gICAgc3VwZXIob2JqKTtcblxuICAgIHRoaXMuYWRkRGVzY3JpcHRvciA9IHRoaXMuYWRkQ2hpbGQ7XG4gICAgdGhpcy5nZXREZXNjcmlwdG9yID0gdGhpcy5nZXRDaGlsZDtcblxuICAgIHRoaXMucHJvcGVydGllcyA9IG9iai5wcm9wZXJ0aWVzIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnByb3BlcnRpZXMpKSB7XG4gICAgICB0aGlzLnByb3BlcnRpZXMgPSBbdGhpcy5wcm9wZXJ0aWVzXTtcbiAgICB9XG5cbiAgICB0aGlzLnBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgdGhpcy5wZXJtaXNzaW9ucyA9IFt0aGlzLnBlcm1pc3Npb25zXTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcInNlcnZpY2VcIjtcbiAgfVxuXG4gIGdldCBjaGlsZHJlbkNsYXNzKCk6IGFueSB7XG4gICAgcmV0dXJuIEJsZURlc2NyaXB0b3I7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5OYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiZGVzY3JpcHRvcnNcIjtcbiAgfVxuXG4gIGdldCBkZXNjcmlwdG9ycygpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSBzdXBlci50b0pTT04oKTtcblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHB1YmxpYyBhZGRQcm9wZXJ0eShwYXJhbTogYW55KSB7XG4gICAgaWYgKCF0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMocGFyYW0pKSB7XG4gICAgICB0aGlzLnByb3BlcnRpZXMucHVzaChwYXJhbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZVByb3BlcnR5KHBhcmFtOiBhbnkpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXMuZmlsdGVyKChlbG06IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIGVsbSAhPT0gcGFyYW07XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUGVybWlzc2lvbihwYXJhbTogYW55KSB7XG4gICAgaWYgKCF0aGlzLnBlcm1pc3Npb25zLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgdGhpcy5wZXJtaXNzaW9ucy5wdXNoKHBhcmFtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlUGVybWlzc2lvbihwYXJhbTogYW55KSB7XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnMuZmlsdGVyICgoZWxtOiBhbnkgKSA9PiB7XG4gICAgICByZXR1cm4gZWxtICE9PSBwYXJhbTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZShkYXRhOiBhbnkpIHtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBwZXJpcGhlcmFsOiB7XG4gICAgICAgICAgd3JpdGVfY2hhcmFjdGVyaXN0aWM6IHtcbiAgICAgICAgICAgIHNlcnZpY2VfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5zZXJ2aWNlLnV1aWQpLFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZCgpIHtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBwZXJpcGhlcmFsOiB7XG4gICAgICAgICAgcmVhZF9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnV1aWQpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeSgpIHtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBwZXJpcGhlcmFsOiB7XG4gICAgICAgICAgbm90aWZ5X2NoYXJhY3RlcmlzdGljOiB7XG4gICAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMudXVpZCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxlQ2hhcmFjdGVyaXN0aWM7XG4iXX0=
