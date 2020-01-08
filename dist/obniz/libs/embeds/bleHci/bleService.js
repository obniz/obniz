"use strict";
const BleLocalAttributeAbstract = require('./bleLocalAttributeAbstract');
const BleCharacteristic = require('./bleCharacteristic');
class BleService extends BleLocalAttributeAbstract {
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
    get characteristics() {
        return this.children;
    }
    get advData() {
        return {
            flags: ['general_discoverable_mode', 'br_edr_not_supported'],
            serviceUuids: [this.uuid],
        };
    }
    end() {
        this.peripheral.removeService(this.uuid);
    }
    emit(name, ...params) { }
    notify(notifyName, params) {
        //nothing
    }
}
module.exports = BleService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSx5QkFBeUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN6RSxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRXpELE1BQU0sVUFBVyxTQUFRLHlCQUF5QjtJQUNoRCxZQUFZLEdBQUc7UUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFWCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU87WUFDTCxLQUFLLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxzQkFBc0IsQ0FBQztZQUM1RCxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUM7SUFDSixDQUFDO0lBRUQsR0FBRztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBRyxDQUFDO0lBRXhCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTTtRQUN2QixTQUFTO0lBQ1gsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL2JsZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCbGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0ID0gcmVxdWlyZSgnLi9ibGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0Jyk7XG5jb25zdCBCbGVDaGFyYWN0ZXJpc3RpYyA9IHJlcXVpcmUoJy4vYmxlQ2hhcmFjdGVyaXN0aWMnKTtcblxuY2xhc3MgQmxlU2VydmljZSBleHRlbmRzIEJsZUxvY2FsQXR0cmlidXRlQWJzdHJhY3Qge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICBzdXBlcihvYmopO1xuXG4gICAgdGhpcy5hZGRDaGFyYWN0ZXJpc3RpYyA9IHRoaXMuYWRkQ2hpbGQ7XG4gICAgdGhpcy5nZXRDaGFyYWN0ZXJpc3RpYyA9IHRoaXMuZ2V0Q2hpbGQ7XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpIHtcbiAgICByZXR1cm4gJ3BlcmlwaGVyYWwnO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuTmFtZSgpIHtcbiAgICByZXR1cm4gJ2NoYXJhY3RlcmlzdGljcyc7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5DbGFzcygpIHtcbiAgICByZXR1cm4gQmxlQ2hhcmFjdGVyaXN0aWM7XG4gIH1cblxuICBnZXQgY2hhcmFjdGVyaXN0aWNzKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICB9XG5cbiAgZ2V0IGFkdkRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZsYWdzOiBbJ2dlbmVyYWxfZGlzY292ZXJhYmxlX21vZGUnLCAnYnJfZWRyX25vdF9zdXBwb3J0ZWQnXSxcbiAgICAgIHNlcnZpY2VVdWlkczogW3RoaXMudXVpZF0sXG4gICAgfTtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICB0aGlzLnBlcmlwaGVyYWwucmVtb3ZlU2VydmljZSh0aGlzLnV1aWQpO1xuICB9XG5cbiAgZW1pdChuYW1lLCAuLi5wYXJhbXMpIHt9XG5cbiAgbm90aWZ5KG5vdGlmeU5hbWUsIHBhcmFtcykge1xuICAgIC8vbm90aGluZ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmxlU2VydmljZTtcbiJdfQ==
