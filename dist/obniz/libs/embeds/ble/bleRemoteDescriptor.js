"use strict";
const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');
const BleHelper = require('./bleHelper');
class BleRemoteDescriptor extends BleRemoteAttributeAbstract {
    constructor(params) {
        super(params);
    }
    get parentName() {
        return 'characteristic';
    }
    read() {
        const obj = {
            ble: {
                read_descriptor: {
                    address: this.characteristic.service.peripheral.address,
                    service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
                    characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
                    descriptor_uuid: BleHelper.uuidFilter(this.uuid),
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
                    service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
                    characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
                    descriptor_uuid: BleHelper.uuidFilter(this.uuid),
                    data: array,
                    needResponse,
                },
            },
        };
        this.characteristic.service.peripheral.Obniz.send(obj);
    }
}
module.exports = BleRemoteDescriptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlRGVzY3JpcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUMzRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFekMsTUFBTSxtQkFBb0IsU0FBUSwwQkFBMEI7SUFDMUQsWUFBWSxNQUFNO1FBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHO1lBQ1YsR0FBRyxFQUFFO2dCQUNILGVBQWUsRUFBRTtvQkFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU87b0JBQ3ZELFlBQVksRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDcEUsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztvQkFDbkUsZUFBZSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDakQ7YUFDRjtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZO1FBQ3ZCLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUM5QixZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO1FBQ0QsTUFBTSxHQUFHLEdBQUc7WUFDVixHQUFHLEVBQUU7Z0JBQ0gsZ0JBQWdCLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTztvQkFDdkQsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO29CQUNwRSxtQkFBbUIsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO29CQUNuRSxlQUFlLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUNoRCxJQUFJLEVBQUUsS0FBSztvQkFDWCxZQUFZO2lCQUNiO2FBQ0Y7U0FDRixDQUFDO1FBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlRGVzY3JpcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0ID0gcmVxdWlyZSgnLi9ibGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdCcpO1xuY29uc3QgQmxlSGVscGVyID0gcmVxdWlyZSgnLi9ibGVIZWxwZXInKTtcblxuY2xhc3MgQmxlUmVtb3RlRGVzY3JpcHRvciBleHRlbmRzIEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgc3VwZXIocGFyYW1zKTtcbiAgfVxuXG4gIGdldCBwYXJlbnROYW1lKCkge1xuICAgIHJldHVybiAnY2hhcmFjdGVyaXN0aWMnO1xuICB9XG5cbiAgcmVhZCgpIHtcbiAgICBjb25zdCBvYmogPSB7XG4gICAgICBibGU6IHtcbiAgICAgICAgcmVhZF9kZXNjcmlwdG9yOiB7XG4gICAgICAgICAgYWRkcmVzczogdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuY2hhcmFjdGVyaXN0aWMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLmNoYXJhY3RlcmlzdGljLnV1aWQpLFxuICAgICAgICAgIGRlc2NyaXB0b3JfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLmNoYXJhY3RlcmlzdGljLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICB3cml0ZShhcnJheSwgbmVlZFJlc3BvbnNlKSB7XG4gICAgaWYgKG5lZWRSZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZWVkUmVzcG9uc2UgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBvYmogPSB7XG4gICAgICBibGU6IHtcbiAgICAgICAgd3JpdGVfZGVzY3JpcHRvcjoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuY2hhcmFjdGVyaXN0aWMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLmNoYXJhY3RlcmlzdGljLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5jaGFyYWN0ZXJpc3RpYy51dWlkKSxcbiAgICAgICAgICBkZXNjcmlwdG9yX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMudXVpZCksXG4gICAgICAgICAgZGF0YTogYXJyYXksXG4gICAgICAgICAgbmVlZFJlc3BvbnNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuY2hhcmFjdGVyaXN0aWMuc2VydmljZS5wZXJpcGhlcmFsLk9ibml6LnNlbmQob2JqKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZVJlbW90ZURlc2NyaXB0b3I7XG4iXX0=
