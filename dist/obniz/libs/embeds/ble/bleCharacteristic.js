"use strict";
const BleDescriptor = require('./bleDescriptor');
const BleAttributeAbstract = require('./bleAttributeAbstract');
const BleHelper = require('./bleHelper');
class BleCharacteristic extends BleAttributeAbstract {
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
        return 'service';
    }
    get childrenClass() {
        return BleDescriptor;
    }
    get childrenName() {
        return 'descriptors';
    }
    get descriptors() {
        return this.children;
    }
    toJSON() {
        let obj = super.toJSON();
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
        this.properties = this.properties.filter(elm => {
            return elm !== param;
        });
    }
    addPermission(param) {
        if (!this.permissions.includes(param)) {
            this.permissions.push(param);
        }
    }
    removePermission(param) {
        this.permissions = this.permissions.filter(elm => {
            return elm !== param;
        });
    }
    write(data) {
        this.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    write_characteristic: {
                        service_uuid: BleHelper.uuidFilter(this.service.uuid),
                        characteristic_uuid: BleHelper.uuidFilter(this.uuid),
                        data: data,
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
                        service_uuid: BleHelper.uuidFilter(this.service.uuid),
                        characteristic_uuid: BleHelper.uuidFilter(this.uuid),
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
                        service_uuid: BleHelper.uuidFilter(this.service.uuid),
                        characteristic_uuid: BleHelper.uuidFilter(this.uuid),
                    },
                },
            },
        });
    }
}
module.exports = BleCharacteristic;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlQ2hhcmFjdGVyaXN0aWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDL0QsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRXpDLE1BQU0saUJBQWtCLFNBQVEsb0JBQW9CO0lBQ2xELFlBQVksR0FBRztRQUNiLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVYLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXpCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzlCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUNsQztRQUVELElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNwQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFLO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDN0MsT0FBTyxHQUFHLEtBQUssS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFLO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDL0MsT0FBTyxHQUFHLEtBQUssS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNqQyxHQUFHLEVBQUU7Z0JBQ0gsVUFBVSxFQUFFO29CQUNWLG9CQUFvQixFQUFFO3dCQUNwQixZQUFZLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDckQsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUNwRCxJQUFJLEVBQUUsSUFBSTtxQkFDWDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2pDLEdBQUcsRUFBRTtnQkFDSCxVQUFVLEVBQUU7b0JBQ1YsbUJBQW1CLEVBQUU7d0JBQ25CLFlBQVksRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO3dCQUNyRCxtQkFBbUIsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7cUJBQ3JEO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDakMsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRTtvQkFDVixxQkFBcUIsRUFBRTt3QkFDckIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7d0JBQ3JELG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztxQkFDckQ7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9lbWJlZHMvYmxlL2JsZUNoYXJhY3RlcmlzdGljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmxlRGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vYmxlRGVzY3JpcHRvcicpO1xuY29uc3QgQmxlQXR0cmlidXRlQWJzdHJhY3QgPSByZXF1aXJlKCcuL2JsZUF0dHJpYnV0ZUFic3RyYWN0Jyk7XG5jb25zdCBCbGVIZWxwZXIgPSByZXF1aXJlKCcuL2JsZUhlbHBlcicpO1xuXG5jbGFzcyBCbGVDaGFyYWN0ZXJpc3RpYyBleHRlbmRzIEJsZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgc3VwZXIob2JqKTtcblxuICAgIHRoaXMuYWRkRGVzY3JpcHRvciA9IHRoaXMuYWRkQ2hpbGQ7XG4gICAgdGhpcy5nZXREZXNjcmlwdG9yID0gdGhpcy5nZXRDaGlsZDtcblxuICAgIHRoaXMucHJvcGVydGllcyA9IG9iai5wcm9wZXJ0aWVzIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnByb3BlcnRpZXMpKSB7XG4gICAgICB0aGlzLnByb3BlcnRpZXMgPSBbdGhpcy5wcm9wZXJ0aWVzXTtcbiAgICB9XG5cbiAgICB0aGlzLnBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgdGhpcy5wZXJtaXNzaW9ucyA9IFt0aGlzLnBlcm1pc3Npb25zXTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpIHtcbiAgICByZXR1cm4gJ3NlcnZpY2UnO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuQ2xhc3MoKSB7XG4gICAgcmV0dXJuIEJsZURlc2NyaXB0b3I7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5OYW1lKCkge1xuICAgIHJldHVybiAnZGVzY3JpcHRvcnMnO1xuICB9XG5cbiAgZ2V0IGRlc2NyaXB0b3JzKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIGxldCBvYmogPSBzdXBlci50b0pTT04oKTtcblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGFkZFByb3BlcnR5KHBhcmFtKSB7XG4gICAgaWYgKCF0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMocGFyYW0pKSB7XG4gICAgICB0aGlzLnByb3BlcnRpZXMucHVzaChwYXJhbSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlUHJvcGVydHkocGFyYW0pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXMuZmlsdGVyKGVsbSA9PiB7XG4gICAgICByZXR1cm4gZWxtICE9PSBwYXJhbTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZFBlcm1pc3Npb24ocGFyYW0pIHtcbiAgICBpZiAoIXRoaXMucGVybWlzc2lvbnMuaW5jbHVkZXMocGFyYW0pKSB7XG4gICAgICB0aGlzLnBlcm1pc3Npb25zLnB1c2gocGFyYW0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVBlcm1pc3Npb24ocGFyYW0pIHtcbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9ucy5maWx0ZXIoZWxtID0+IHtcbiAgICAgIHJldHVybiBlbG0gIT09IHBhcmFtO1xuICAgIH0pO1xuICB9XG5cbiAgd3JpdGUoZGF0YSkge1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLk9ibml6LnNlbmQoe1xuICAgICAgYmxlOiB7XG4gICAgICAgIHBlcmlwaGVyYWw6IHtcbiAgICAgICAgICB3cml0ZV9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnV1aWQpLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHJlYWQoKSB7XG4gICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZCh7XG4gICAgICBibGU6IHtcbiAgICAgICAgcGVyaXBoZXJhbDoge1xuICAgICAgICAgIHJlYWRfY2hhcmFjdGVyaXN0aWM6IHtcbiAgICAgICAgICAgIHNlcnZpY2VfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5zZXJ2aWNlLnV1aWQpLFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIG5vdGlmeSgpIHtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBwZXJpcGhlcmFsOiB7XG4gICAgICAgICAgbm90aWZ5X2NoYXJhY3RlcmlzdGljOiB7XG4gICAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMudXVpZCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbGVDaGFyYWN0ZXJpc3RpYztcbiJdfQ==
