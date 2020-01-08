"use strict";
const BleAttributeAbstract = require('./bleAttributeAbstract');
const BleCharacteristic = require('./bleCharacteristic');
const BleHelper = require('./bleHelper');
class BleService extends BleAttributeAbstract {
    constructor(obj) {
        super(obj);
        this.addCharacteristic = this.addChild;
        this.getCharacteristic = this.getChild;
    }
    get parentName() {
        return 'peripheral';
    }
    get childrenName() {
        return 'characteristics';
    }
    get childrenClass() {
        return BleCharacteristic;
    }
    get advData() {
        return {
            flags: ['general_discoverable_mode', 'br_edr_not_supported'],
            serviceUuids: [this.uuid],
        };
    }
    end() {
        this.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    stop_service: {
                        service_uuid: BleHelper.uuidFilter(this.uuid),
                    },
                },
            },
        });
        this.peripheral.removeService(this.uuid);
    }
    notify(notifyName, params) {
        //nothing
    }
}
module.exports = BleService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUMvRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3pELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV6QyxNQUFNLFVBQVcsU0FBUSxvQkFBb0I7SUFDM0MsWUFBWSxHQUFHO1FBQ2IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVgsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLGlCQUFpQixDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDZixPQUFPLGlCQUFpQixDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPO1lBQ0wsS0FBSyxFQUFFLENBQUMsMkJBQTJCLEVBQUUsc0JBQXNCLENBQUM7WUFDNUQsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUMxQixDQUFDO0lBQ0osQ0FBQztJQUVELEdBQUc7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDekIsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRTtvQkFDVixZQUFZLEVBQUU7d0JBQ1osWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztxQkFDOUM7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNO1FBQ3ZCLFNBQVM7SUFDWCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJsZUF0dHJpYnV0ZUFic3RyYWN0ID0gcmVxdWlyZSgnLi9ibGVBdHRyaWJ1dGVBYnN0cmFjdCcpO1xuY29uc3QgQmxlQ2hhcmFjdGVyaXN0aWMgPSByZXF1aXJlKCcuL2JsZUNoYXJhY3RlcmlzdGljJyk7XG5jb25zdCBCbGVIZWxwZXIgPSByZXF1aXJlKCcuL2JsZUhlbHBlcicpO1xuXG5jbGFzcyBCbGVTZXJ2aWNlIGV4dGVuZHMgQmxlQXR0cmlidXRlQWJzdHJhY3Qge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICBzdXBlcihvYmopO1xuXG4gICAgdGhpcy5hZGRDaGFyYWN0ZXJpc3RpYyA9IHRoaXMuYWRkQ2hpbGQ7XG4gICAgdGhpcy5nZXRDaGFyYWN0ZXJpc3RpYyA9IHRoaXMuZ2V0Q2hpbGQ7XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpIHtcbiAgICByZXR1cm4gJ3BlcmlwaGVyYWwnO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuTmFtZSgpIHtcbiAgICByZXR1cm4gJ2NoYXJhY3RlcmlzdGljcyc7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5DbGFzcygpIHtcbiAgICByZXR1cm4gQmxlQ2hhcmFjdGVyaXN0aWM7XG4gIH1cblxuICBnZXQgYWR2RGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmxhZ3M6IFsnZ2VuZXJhbF9kaXNjb3ZlcmFibGVfbW9kZScsICdicl9lZHJfbm90X3N1cHBvcnRlZCddLFxuICAgICAgc2VydmljZVV1aWRzOiBbdGhpcy51dWlkXSxcbiAgICB9O1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHRoaXMucGVyaXBoZXJhbC5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBwZXJpcGhlcmFsOiB7XG4gICAgICAgICAgc3RvcF9zZXJ2aWNlOiB7XG4gICAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMudXVpZCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5wZXJpcGhlcmFsLnJlbW92ZVNlcnZpY2UodGhpcy51dWlkKTtcbiAgfVxuXG4gIG5vdGlmeShub3RpZnlOYW1lLCBwYXJhbXMpIHtcbiAgICAvL25vdGhpbmdcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZVNlcnZpY2U7XG4iXX0=
