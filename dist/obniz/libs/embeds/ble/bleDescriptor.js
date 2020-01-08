"use strict";
const BleAttributeAbstract = require('./bleAttributeAbstract');
const BleHelper = require('./bleHelper');
class BleDescriptor extends BleAttributeAbstract {
    constructor(obj) {
        super(obj);
        this.permissions = obj.permissions || [];
        if (!Array.isArray(this.permissions)) {
            this.permissions = [this.permissions];
        }
    }
    get parentName() {
        return 'characteristic';
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
    toJSON() {
        let obj = super.toJSON();
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
                        service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
                        characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
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
                        service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
                        characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
                        descriptor_uuid: this.uuid,
                    },
                },
            },
        });
    }
}
module.exports = BleDescriptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlRGVzY3JpcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUMvRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFekMsTUFBTSxhQUFjLFNBQVEsb0JBQW9CO0lBQzlDLFlBQVksR0FBRztRQUNiLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVYLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUs7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQUs7UUFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMvQyxPQUFPLEdBQUcsS0FBSyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUV6QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMvQixHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDcEM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUztRQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2hELEdBQUcsRUFBRTtnQkFDSCxVQUFVLEVBQUU7b0JBQ1YsZ0JBQWdCLEVBQUU7d0JBQ2hCLFlBQVksRUFBRSxTQUFTLENBQUMsVUFBVSxDQUNoQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2pDO3dCQUNELG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7d0JBQ25FLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSTt3QkFDMUIsSUFBSSxFQUFFLFNBQVM7cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2hELEdBQUcsRUFBRTtnQkFDSCxVQUFVLEVBQUU7b0JBQ1YsZUFBZSxFQUFFO3dCQUNmLFlBQVksRUFBRSxTQUFTLENBQUMsVUFBVSxDQUNoQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2pDO3dCQUNELG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7d0JBQ25FLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSTtxQkFDM0I7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvZW1iZWRzL2JsZS9ibGVEZXNjcmlwdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmxlQXR0cmlidXRlQWJzdHJhY3QgPSByZXF1aXJlKCcuL2JsZUF0dHJpYnV0ZUFic3RyYWN0Jyk7XG5jb25zdCBCbGVIZWxwZXIgPSByZXF1aXJlKCcuL2JsZUhlbHBlcicpO1xuXG5jbGFzcyBCbGVEZXNjcmlwdG9yIGV4dGVuZHMgQmxlQXR0cmlidXRlQWJzdHJhY3Qge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICBzdXBlcihvYmopO1xuXG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHRoaXMucGVybWlzc2lvbnMgPSBbdGhpcy5wZXJtaXNzaW9uc107XG4gICAgfVxuICB9XG5cbiAgZ2V0IHBhcmVudE5hbWUoKSB7XG4gICAgcmV0dXJuICdjaGFyYWN0ZXJpc3RpYyc7XG4gIH1cblxuICBhZGRQZXJtaXNzaW9uKHBhcmFtKSB7XG4gICAgaWYgKCF0aGlzLnBlcm1pc3Npb25zLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgdGhpcy5wZXJtaXNzaW9ucy5wdXNoKHBhcmFtKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVQZXJtaXNzaW9uKHBhcmFtKSB7XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnMuZmlsdGVyKGVsbSA9PiB7XG4gICAgICByZXR1cm4gZWxtICE9PSBwYXJhbTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICBsZXQgb2JqID0gc3VwZXIudG9KU09OKCk7XG5cbiAgICBpZiAodGhpcy5wZXJtaXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBvYmoucGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgd3JpdGUoZGF0YUFycmF5KSB7XG4gICAgdGhpcy5jaGFyYWN0ZXJpc3RpYy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZCh7XG4gICAgICBibGU6IHtcbiAgICAgICAgcGVyaXBoZXJhbDoge1xuICAgICAgICAgIHdyaXRlX2Rlc2NyaXB0b3I6IHtcbiAgICAgICAgICAgIHNlcnZpY2VfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIoXG4gICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyaXN0aWMuc2VydmljZS51dWlkXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5jaGFyYWN0ZXJpc3RpYy51dWlkKSxcbiAgICAgICAgICAgIGRlc2NyaXB0b3JfdXVpZDogdGhpcy51dWlkLFxuICAgICAgICAgICAgZGF0YTogZGF0YUFycmF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcmVhZCgpIHtcbiAgICB0aGlzLmNoYXJhY3RlcmlzdGljLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBwZXJpcGhlcmFsOiB7XG4gICAgICAgICAgcmVhZF9kZXNjcmlwdG9yOiB7XG4gICAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKFxuICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcmlzdGljLnNlcnZpY2UudXVpZFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuY2hhcmFjdGVyaXN0aWMudXVpZCksXG4gICAgICAgICAgICBkZXNjcmlwdG9yX3V1aWQ6IHRoaXMudXVpZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZURlc2NyaXB0b3I7XG4iXX0=
