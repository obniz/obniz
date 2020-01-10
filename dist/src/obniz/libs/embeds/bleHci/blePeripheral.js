"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleService_1 = __importDefault(require("./bleService"));
class BlePeripheral {
    constructor(obnizBle) {
        this.obnizBle = obnizBle;
        this._services = [];
        this.currentConnectedDeviceAddress = null;
    }
    _updateServices() {
        const bufData = this._services.map((e) => e.toBufferObj());
        this.obnizBle.peripheralBindings.setServices(bufData);
    }
    addService(obj) {
        this.obnizBle.warningIfNotInitialize();
        if (!(obj instanceof bleService_1.default)) {
            obj = new bleService_1.default(obj);
        }
        this._services.push(obj);
        obj.peripheral = this;
        this._updateServices();
    }
    setJson(json) {
        if (json.services) {
            for (const service of json.services) {
                this.addService(service);
            }
        }
    }
    getService(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        return this._services
            .filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) === uuid;
        })
            .shift();
    }
    removeService(uuid) {
        this._services = this._services.filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) !== uuid;
        });
        this._updateServices();
    }
    stopAllService() {
        this._services = [];
        this._updateServices();
    }
    toJSON() {
        return {
            services: this._services,
        };
    }
    findCharacteristic(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        const characteristicUuid = bleHelper_1.default.uuidFilter(param.characteristic_uuid);
        const s = this.getService(serviceUuid);
        if (s) {
            return s.getCharacteristic(characteristicUuid);
        }
        return null;
    }
    findDescriptor(param) {
        const descriptorUuid = bleHelper_1.default.uuidFilter(param.descriptor_uuid);
        const c = this.findCharacteristic(param);
        if (c) {
            return c.getDescriptor(descriptorUuid);
        }
        return null;
    }
    end() {
        this.stopAllService();
    }
    onconnectionupdates() {
    }
    onerror() {
    }
}
exports.default = BlePeripheral;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlUGVyaXBoZXJhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUNwQyw4REFBc0M7QUFFdEMsTUFBTSxhQUFhO0lBS2pCLFlBQVksUUFBYTtRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDO0lBQzVDLENBQUM7SUFFTSxlQUFlO1FBQ3BCLE1BQU0sT0FBTyxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sVUFBVSxDQUFDLEdBQVE7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxDQUFDLEdBQUcsWUFBWSxvQkFBVSxDQUFDLEVBQUU7WUFDaEMsR0FBRyxHQUFHLElBQUksb0JBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQVM7UUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMxQjtTQUNGO0lBQ0gsQ0FBQztJQUVNLFVBQVUsQ0FBQyxJQUFTO1FBQ3pCLElBQUksR0FBRyxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTO2FBQ2xCLE1BQU0sQ0FBRSxDQUFDLE9BQVksRUFBRyxFQUFFO1lBQ3pCLE9BQU8sbUJBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQztRQUNyRCxDQUFDLENBQUM7YUFDRCxLQUFLLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBUztRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFFLENBQUMsT0FBWSxFQUFHLEVBQUU7WUFDeEQsT0FBTyxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxjQUFjO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU0sTUFBTTtRQUNYLE9BQU87WUFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDekIsQ0FBQztJQUNKLENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxLQUFVO1FBQ2xDLE1BQU0sV0FBVyxHQUFRLG1CQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsRSxNQUFNLGtCQUFrQixHQUFRLG1CQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hGLE1BQU0sQ0FBQyxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLEVBQUU7WUFDTCxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sY0FBYyxDQUFDLEtBQVU7UUFDOUIsTUFBTSxjQUFjLEdBQVEsbUJBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxHQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsRUFBRTtZQUNMLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLEdBQUc7UUFDUixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVNLG1CQUFtQjtJQUMxQixDQUFDO0lBRU0sT0FBTztJQUNkLENBQUM7Q0FDRjtBQUVELGtCQUFlLGFBQWEsQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL2JsZVBlcmlwaGVyYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmxlSGVscGVyIGZyb20gXCIuL2JsZUhlbHBlclwiO1xuaW1wb3J0IEJsZVNlcnZpY2UgZnJvbSBcIi4vYmxlU2VydmljZVwiO1xuXG5jbGFzcyBCbGVQZXJpcGhlcmFsIHtcbiAgcHVibGljIG9ibml6QmxlOiBhbnk7XG4gIHB1YmxpYyBfc2VydmljZXM6IGFueTtcbiAgcHVibGljIGN1cnJlbnRDb25uZWN0ZWREZXZpY2VBZGRyZXNzOiBhbnk7XG5cbiAgY29uc3RydWN0b3Iob2JuaXpCbGU6IGFueSkge1xuICAgIHRoaXMub2JuaXpCbGUgPSBvYm5pekJsZTtcbiAgICB0aGlzLl9zZXJ2aWNlcyA9IFtdO1xuICAgIHRoaXMuY3VycmVudENvbm5lY3RlZERldmljZUFkZHJlc3MgPSBudWxsO1xuICB9XG5cbiAgcHVibGljIF91cGRhdGVTZXJ2aWNlcygpIHtcbiAgICBjb25zdCBidWZEYXRhOiBhbnkgPSB0aGlzLl9zZXJ2aWNlcy5tYXAoKGU6IGFueSkgPT4gZS50b0J1ZmZlck9iaigpKTtcbiAgICB0aGlzLm9ibml6QmxlLnBlcmlwaGVyYWxCaW5kaW5ncy5zZXRTZXJ2aWNlcyhidWZEYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTZXJ2aWNlKG9iajogYW55KSB7XG4gICAgdGhpcy5vYm5pekJsZS53YXJuaW5nSWZOb3RJbml0aWFsaXplKCk7XG4gICAgaWYgKCEob2JqIGluc3RhbmNlb2YgQmxlU2VydmljZSkpIHtcbiAgICAgIG9iaiA9IG5ldyBCbGVTZXJ2aWNlKG9iaik7XG4gICAgfVxuICAgIHRoaXMuX3NlcnZpY2VzLnB1c2gob2JqKTtcbiAgICBvYmoucGVyaXBoZXJhbCA9IHRoaXM7XG5cbiAgICB0aGlzLl91cGRhdGVTZXJ2aWNlcygpO1xuICB9XG5cbiAgcHVibGljIHNldEpzb24oanNvbjogYW55KSB7XG4gICAgaWYgKGpzb24uc2VydmljZXMpIHtcbiAgICAgIGZvciAoY29uc3Qgc2VydmljZSBvZiBqc29uLnNlcnZpY2VzKSB7XG4gICAgICAgIHRoaXMuYWRkU2VydmljZShzZXJ2aWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0U2VydmljZSh1dWlkOiBhbnkpIHtcbiAgICB1dWlkID0gQmxlSGVscGVyLnV1aWRGaWx0ZXIodXVpZCk7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzXG4gICAgICAuZmlsdGVyICgoZWxlbWVudDogYW55ICkgPT4ge1xuICAgICAgICByZXR1cm4gQmxlSGVscGVyLnV1aWRGaWx0ZXIoZWxlbWVudC51dWlkKSA9PT0gdXVpZDtcbiAgICAgIH0pXG4gICAgICAuc2hpZnQoKTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVTZXJ2aWNlKHV1aWQ6IGFueSkge1xuICAgIHRoaXMuX3NlcnZpY2VzID0gdGhpcy5fc2VydmljZXMuZmlsdGVyICgoZWxlbWVudDogYW55ICkgPT4ge1xuICAgICAgcmV0dXJuIEJsZUhlbHBlci51dWlkRmlsdGVyKGVsZW1lbnQudXVpZCkgIT09IHV1aWQ7XG4gICAgfSk7XG5cbiAgICB0aGlzLl91cGRhdGVTZXJ2aWNlcygpO1xuICB9XG5cbiAgcHVibGljIHN0b3BBbGxTZXJ2aWNlKCkge1xuICAgIHRoaXMuX3NlcnZpY2VzID0gW107XG4gICAgdGhpcy5fdXBkYXRlU2VydmljZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlcnZpY2VzOiB0aGlzLl9zZXJ2aWNlcyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGZpbmRDaGFyYWN0ZXJpc3RpYyhwYXJhbTogYW55KSB7XG4gICAgY29uc3Qgc2VydmljZVV1aWQ6IGFueSA9IEJsZUhlbHBlci51dWlkRmlsdGVyKHBhcmFtLnNlcnZpY2VfdXVpZCk7XG4gICAgY29uc3QgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnkgPSBCbGVIZWxwZXIudXVpZEZpbHRlcihwYXJhbS5jaGFyYWN0ZXJpc3RpY191dWlkKTtcbiAgICBjb25zdCBzOiBhbnkgPSB0aGlzLmdldFNlcnZpY2Uoc2VydmljZVV1aWQpO1xuICAgIGlmIChzKSB7XG4gICAgICByZXR1cm4gcy5nZXRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY1V1aWQpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kRGVzY3JpcHRvcihwYXJhbTogYW55KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvclV1aWQ6IGFueSA9IEJsZUhlbHBlci51dWlkRmlsdGVyKHBhcmFtLmRlc2NyaXB0b3JfdXVpZCk7XG4gICAgY29uc3QgYzogYW55ID0gdGhpcy5maW5kQ2hhcmFjdGVyaXN0aWMocGFyYW0pO1xuICAgIGlmIChjKSB7XG4gICAgICByZXR1cm4gYy5nZXREZXNjcmlwdG9yKGRlc2NyaXB0b3JVdWlkKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgZW5kKCkge1xuICAgIHRoaXMuc3RvcEFsbFNlcnZpY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBvbmNvbm5lY3Rpb251cGRhdGVzKCkge1xuICB9XG5cbiAgcHVibGljIG9uZXJyb3IoKSB7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxlUGVyaXBoZXJhbDtcbiJdfQ==
