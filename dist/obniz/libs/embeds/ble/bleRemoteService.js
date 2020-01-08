"use strict";
const BleRemoteCharacteristic = require('./bleRemoteCharacteristic');
const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');
const BleHelper = require('./bleHelper');
class BleRemoteService extends BleRemoteAttributeAbstract {
    constructor(obj) {
        super(obj);
    }
    get parentName() {
        return 'peripheral';
    }
    get childrenClass() {
        return BleRemoteCharacteristic;
    }
    get childrenName() {
        return 'characteristics';
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
                    service_uuid: BleHelper.uuidFilter(this.uuid),
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
    ondiscovercharacteristic() { }
    ondiscovercharacteristicfinished() { }
}
module.exports = BleRemoteService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNyRSxNQUFNLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV6QyxNQUFNLGdCQUFpQixTQUFRLDBCQUEwQjtJQUN2RCxZQUFZLEdBQUc7UUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sdUJBQXVCLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELGlCQUFpQixDQUFDLE1BQU07UUFDdEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxNQUFNO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsMEJBQTBCO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELDhCQUE4QjtRQUM1QixPQUFPLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxNQUFNLEdBQUcsR0FBRztZQUNWLEdBQUcsRUFBRTtnQkFDSCxtQkFBbUIsRUFBRTtvQkFDbkIsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTztvQkFDaEMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDOUM7YUFDRjtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFVBQVUsQ0FBQyxjQUFjO1FBQ3ZCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsZUFBZTtRQUNoQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELHdCQUF3QixLQUFJLENBQUM7SUFFN0IsZ0NBQWdDLEtBQUksQ0FBQztDQUN0QztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9lbWJlZHMvYmxlL2JsZVJlbW90ZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCbGVSZW1vdGVDaGFyYWN0ZXJpc3RpYyA9IHJlcXVpcmUoJy4vYmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWMnKTtcbmNvbnN0IEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0ID0gcmVxdWlyZSgnLi9ibGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdCcpO1xuY29uc3QgQmxlSGVscGVyID0gcmVxdWlyZSgnLi9ibGVIZWxwZXInKTtcblxuY2xhc3MgQmxlUmVtb3RlU2VydmljZSBleHRlbmRzIEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgc3VwZXIob2JqKTtcbiAgfVxuXG4gIGdldCBwYXJlbnROYW1lKCkge1xuICAgIHJldHVybiAncGVyaXBoZXJhbCc7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5DbGFzcygpIHtcbiAgICByZXR1cm4gQmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWM7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5OYW1lKCkge1xuICAgIHJldHVybiAnY2hhcmFjdGVyaXN0aWNzJztcbiAgfVxuXG4gIGdldCBjaGFyYWN0ZXJpc3RpY3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gIH1cblxuICBhZGRDaGFyYWN0ZXJpc3RpYyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZChwYXJhbXMpO1xuICB9XG5cbiAgZ2V0Q2hhcmFjdGVyaXN0aWMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGQocGFyYW1zKTtcbiAgfVxuXG4gIGRpc2NvdmVyQWxsQ2hhcmFjdGVyaXN0aWNzKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NvdmVyQ2hpbGRyZW4oKTtcbiAgfVxuXG4gIGRpc2NvdmVyQWxsQ2hhcmFjdGVyaXN0aWNzV2FpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjb3ZlckNoaWxkcmVuV2FpdCgpO1xuICB9XG5cbiAgZGlzY292ZXJDaGlsZHJlbigpIHtcbiAgICBjb25zdCBvYmogPSB7XG4gICAgICBibGU6IHtcbiAgICAgICAgZ2V0X2NoYXJhY3RlcmlzdGljczoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMucGVyaXBoZXJhbC5hZGRyZXNzLFxuICAgICAgICAgIHNlcnZpY2VfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnBhcmVudC5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBvbmRpc2NvdmVyKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgdGhpcy5vbmRpc2NvdmVyY2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWMpO1xuICB9XG5cbiAgb25kaXNjb3ZlcmZpbmlzaGVkKGNoYXJhY3RlcmlzdGljcykge1xuICAgIHRoaXMub25kaXNjb3ZlcmNoYXJhY3RlcmlzdGljZmluaXNoZWQoY2hhcmFjdGVyaXN0aWNzKTtcbiAgfVxuXG4gIG9uZGlzY292ZXJjaGFyYWN0ZXJpc3RpYygpIHt9XG5cbiAgb25kaXNjb3ZlcmNoYXJhY3RlcmlzdGljZmluaXNoZWQoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZVJlbW90ZVNlcnZpY2U7XG4iXX0=
