"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteAttributeAbstract_1 = __importDefault(require("./bleRemoteAttributeAbstract"));
class BleRemoteDescriptor extends bleRemoteAttributeAbstract_1.default {
    constructor(params) {
        super(params);
    }
    get parentName() {
        return "characteristic";
    }
    read() {
        const obj = {
            ble: {
                read_descriptor: {
                    address: this.characteristic.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                    descriptor_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.characteristic.service.peripheral.Obniz.send(obj);
    }
    write(array, needResponse) {
        if (needResponse === undefined) {
            needResponse = true;
        }
        const obj = {
            ble: {
                write_descriptor: {
                    address: this.characteristic.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                    descriptor_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    data: array,
                    needResponse,
                },
            },
        };
        this.characteristic.service.peripheral.Obniz.send(obj);
    }
}
exports.default = BleRemoteDescriptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlRGVzY3JpcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUNwQyw4RkFBc0U7QUFFdEUsTUFBTSxtQkFBb0IsU0FBUSxvQ0FBMEI7SUFJMUQsWUFBWSxNQUFXO1FBQ3JCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU0sSUFBSTtRQUNULE1BQU0sR0FBRyxHQUFRO1lBQ2YsR0FBRyxFQUFFO2dCQUNILGVBQWUsRUFBRTtvQkFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU87b0JBQ3ZELFlBQVksRUFBRSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ3BFLG1CQUFtQixFQUFFLG1CQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO29CQUNuRSxlQUFlLEVBQUUsbUJBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDakQ7YUFDRjtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQVUsRUFBRSxZQUFpQjtRQUN4QyxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDOUIsWUFBWSxHQUFHLElBQUksQ0FBQztTQUNyQjtRQUNELE1BQU0sR0FBRyxHQUFRO1lBQ2YsR0FBRyxFQUFFO2dCQUNILGdCQUFnQixFQUFFO29CQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU87b0JBQ3ZELFlBQVksRUFBRSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ3BFLG1CQUFtQixFQUFFLG1CQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO29CQUNuRSxlQUFlLEVBQUUsbUJBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDaEQsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsWUFBWTtpQkFDYjthQUNGO1NBQ0YsQ0FBQztRQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDRjtBQUVELGtCQUFlLG1CQUFtQixDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlRGVzY3JpcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVIZWxwZXIgZnJvbSBcIi4vYmxlSGVscGVyXCI7XG5pbXBvcnQgQmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QgZnJvbSBcIi4vYmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3RcIjtcblxuY2xhc3MgQmxlUmVtb3RlRGVzY3JpcHRvciBleHRlbmRzIEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgcHVibGljIGNoYXJhY3RlcmlzdGljOiBhbnk7XG4gIHB1YmxpYyB1dWlkOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocGFyYW1zOiBhbnkpIHtcbiAgICBzdXBlcihwYXJhbXMpO1xuICB9XG5cbiAgZ2V0IHBhcmVudE5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIFwiY2hhcmFjdGVyaXN0aWNcIjtcbiAgfVxuXG4gIHB1YmxpYyByZWFkKCkge1xuICAgIGNvbnN0IG9iajogYW55ID0ge1xuICAgICAgYmxlOiB7XG4gICAgICAgIHJlYWRfZGVzY3JpcHRvcjoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuY2hhcmFjdGVyaXN0aWMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLmNoYXJhY3RlcmlzdGljLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5jaGFyYWN0ZXJpc3RpYy51dWlkKSxcbiAgICAgICAgICBkZXNjcmlwdG9yX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMudXVpZCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgcHVibGljIHdyaXRlKGFycmF5OiBhbnksIG5lZWRSZXNwb25zZTogYW55KSB7XG4gICAgaWYgKG5lZWRSZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZWVkUmVzcG9uc2UgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgIGJsZToge1xuICAgICAgICB3cml0ZV9kZXNjcmlwdG9yOiB7XG4gICAgICAgICAgYWRkcmVzczogdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuY2hhcmFjdGVyaXN0aWMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLmNoYXJhY3RlcmlzdGljLnV1aWQpLFxuICAgICAgICAgIGRlc2NyaXB0b3JfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgICBkYXRhOiBhcnJheSxcbiAgICAgICAgICBuZWVkUmVzcG9uc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZChvYmopO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZVJlbW90ZURlc2NyaXB0b3I7XG4iXX0=
