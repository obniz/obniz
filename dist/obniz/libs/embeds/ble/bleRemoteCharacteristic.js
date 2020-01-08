"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BleRemoteDescriptor = require('./bleRemoteDescriptor');
const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');
const BleHelper = require('./bleHelper');
class BleRemoteCharacteristic extends BleRemoteAttributeAbstract {
    constructor(params) {
        super(params);
        this.properties = params.properties || [];
        if (!Array.isArray(this.properties)) {
            this.properties = [this.properties];
        }
    }
    get parentName() {
        return 'service';
    }
    get childrenClass() {
        return BleRemoteDescriptor;
    }
    get childrenName() {
        return 'descriptors';
    }
    get descriptors() {
        return this.children;
    }
    addDescriptor(params) {
        return this.addChild(params);
    }
    //
    // getCharacteristic(params) {
    //   return this.getChild(params)
    // }
    getDescriptor(uuid) {
        let obj = this.getChild(uuid);
        if (obj) {
            return obj;
        }
        let newCharacteristic = new BleRemoteDescriptor(this.Obniz, this, uuid);
        this.addChild(newCharacteristic);
        return newCharacteristic;
    }
    registerNotify(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.onnotify = callback;
            let cccd = this.getDescriptor('2902');
            yield cccd.writeWait([0x01, 0x00]);
            const obj = {
                ble: {
                    register_notify_characteristic: {
                        address: this.service.peripheral.address,
                        service_uuid: BleHelper.uuidFilter(this.service.uuid),
                        characteristic_uuid: BleHelper.uuidFilter(this.uuid),
                    },
                },
            };
            this.service.peripheral.Obniz.send(obj);
        });
    }
    registerNotifyWait(callback) {
        return new Promise(resolve => {
            this.emitter.once('onregisternotify', () => {
                resolve();
            });
            this.registerNotify(callback);
        });
    }
    unregisterNotify() {
        this.onnotify = function () { };
        const obj = {
            ble: {
                unregister_notify_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: BleHelper.uuidFilter(this.service.uuid),
                    characteristic_uuid: BleHelper.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    unregisterNotifyWait() {
        return new Promise(resolve => {
            this.emitter.once('onunregisternotify', () => {
                resolve();
            });
            this.unregisterNotify();
        });
    }
    read() {
        const obj = {
            ble: {
                read_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: BleHelper.uuidFilter(this.service.uuid),
                    characteristic_uuid: BleHelper.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    write(array, needResponse) {
        if (needResponse === undefined) {
            needResponse = true;
        }
        const obj = {
            ble: {
                write_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: BleHelper.uuidFilter(this.service.uuid),
                    characteristic_uuid: BleHelper.uuidFilter(this.uuid),
                    data: array,
                    needResponse,
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    discoverChildren() {
        const obj = {
            ble: {
                get_descriptors: {
                    address: this.service.peripheral.address,
                    service_uuid: BleHelper.uuidFilter(this.service.uuid),
                    characteristic_uuid: BleHelper.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    discoverAllDescriptors() {
        return this.discoverChildren();
    }
    discoverAllDescriptorsWait() {
        return this.discoverChildrenWait();
    }
    toJSON() {
        let obj = super.toJSON();
        if (this.properties.length > 0) {
            obj.properties = this.properties;
        }
        return obj;
    }
    canBroadcast() {
        return this.properties.includes('broadcast');
    }
    canNotify() {
        return this.properties.includes('notify');
    }
    canRead() {
        return this.properties.includes('read');
    }
    canWrite() {
        return this.properties.includes('write');
    }
    canWriteWithoutResponse() {
        return this.properties.includes('write_without_response');
    }
    canIndicate() {
        return this.properties.includes('indicate');
    }
    ondiscover(descriptor) {
        this.ondiscoverdescriptor(descriptor);
    }
    ondiscoverfinished(descriptors) {
        this.ondiscoverdescriptorfinished(descriptors);
    }
    ondiscoverdescriptor() { }
    ondiscoverdescriptorfinished() { }
    onregisternotify() { }
    onunregisternotify() { }
    onnotify() { }
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        switch (notifyName) {
            case 'onregisternotify': {
                this.onregisternotify();
                break;
            }
            case 'onunregisternotify': {
                this.onunregisternotify();
                break;
            }
            case 'onnotify': {
                this.onnotify(params.data || undefined);
                break;
            }
        }
    }
}
module.exports = BleRemoteCharacteristic;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDN0QsTUFBTSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUMzRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFekMsTUFBTSx1QkFBd0IsU0FBUSwwQkFBMEI7SUFDOUQsWUFBWSxNQUFNO1FBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVkLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELGFBQWEsQ0FBQyxNQUFNO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsRUFBRTtJQUNGLDhCQUE4QjtJQUM5QixpQ0FBaUM7SUFDakMsSUFBSTtJQUVKLGFBQWEsQ0FBQyxJQUFJO1FBQ2hCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFR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QUM1QixJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELG9CQUFvQixLQUFJLENBQUM7SUFFekIsNEJBQTRCLEtBQUksQ0FBQztJQUVqQyxnQkFBZ0IsS0FBSSxDQUFDO0lBRXJCLGtCQUFrQixLQUFJLENBQUM7SUFFdkIsUUFBUSxLQUFJLENBQUM7SUFFYixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsTUFBTTtRQUNqQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLFFBQVEsVUFBVSxFQUFFO1lBQ2xCLEtBQUssa0JBQWtCLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLE1BQU07YUFDUDtZQUNELEtBQUssb0JBQW9CLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLE1BQU07YUFDUDtZQUNELEtBQUssVUFBVSxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNO2FBQ1A7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9lbWJlZHMvYmxlL2JsZVJlbW90ZUNoYXJhY3RlcmlzdGljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmxlUmVtb3RlRGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vYmxlUmVtb3RlRGVzY3JpcHRvcicpO1xuY29uc3QgQmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QgPSByZXF1aXJlKCcuL2JsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0Jyk7XG5jb25zdCBCbGVIZWxwZXIgPSByZXF1aXJlKCcuL2JsZUhlbHBlcicpO1xuXG5jbGFzcyBCbGVSZW1vdGVDaGFyYWN0ZXJpc3RpYyBleHRlbmRzIEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgc3VwZXIocGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGVydGllcyA9IHBhcmFtcy5wcm9wZXJ0aWVzIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnByb3BlcnRpZXMpKSB7XG4gICAgICB0aGlzLnByb3BlcnRpZXMgPSBbdGhpcy5wcm9wZXJ0aWVzXTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpIHtcbiAgICByZXR1cm4gJ3NlcnZpY2UnO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuQ2xhc3MoKSB7XG4gICAgcmV0dXJuIEJsZVJlbW90ZURlc2NyaXB0b3I7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5OYW1lKCkge1xuICAgIHJldHVybiAnZGVzY3JpcHRvcnMnO1xuICB9XG5cbiAgZ2V0IGRlc2NyaXB0b3JzKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICB9XG5cbiAgYWRkRGVzY3JpcHRvcihwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZChwYXJhbXMpO1xuICB9XG5cbiAgLy9cbiAgLy8gZ2V0Q2hhcmFjdGVyaXN0aWMocGFyYW1zKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGQocGFyYW1zKVxuICAvLyB9XG5cbiAgZ2V0RGVzY3JpcHRvcih1dWlkKSB7XG4gICAgbGV0IG9iaiA9IHRoaXMuZ2V0Q2hpbGQodXVpZCk7XG4gICAgaWYgKG9iaikge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgbGV0IG5ld0NoYXJhY3RlcmlzdGljID0gbmV3IEJsZVJlbW90ZURlc2NyaXB0b3IodGhpcy5PYm5peiwgdGhpcywgdXVpZCk7XG4gICAgdGhpcy5hZGRDaGlsZChuZXdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgcmV0dXJuIG5ld0NoYXJhY3RlcmlzdGljO1xuICB9XG5cbiAgYXN5bmMgcmVnaXN0ZXJOb3RpZnkoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9ubm90aWZ5ID0gY2FsbGJhY2s7XG4gICAgbGV0IGNjY2QgPSB0aGlzLmdldERlc2NyaXB0b3IoJzI5MDInKTtcbiAgICBhd2FpdCBjY2NkLndyaXRlV2FpdChbMHgwMSwgMHgwMF0pO1xuXG4gICAgY29uc3Qgb2JqID0ge1xuICAgICAgYmxlOiB7XG4gICAgICAgIHJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICByZWdpc3Rlck5vdGlmeVdhaXQoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIub25jZSgnb25yZWdpc3Rlcm5vdGlmeScsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyTm90aWZ5KGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJOb3RpZnkoKSB7XG4gICAgdGhpcy5vbm5vdGlmeSA9IGZ1bmN0aW9uKCkge307XG4gICAgY29uc3Qgb2JqID0ge1xuICAgICAgYmxlOiB7XG4gICAgICAgIHVucmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljOiB7XG4gICAgICAgICAgYWRkcmVzczogdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnV1aWQpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJOb3RpZnlXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKCdvbnVucmVnaXN0ZXJub3RpZnknLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTm90aWZ5KCk7XG4gICAgfSk7XG4gIH1cblxuICByZWFkKCkge1xuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIGJsZToge1xuICAgICAgICByZWFkX2NoYXJhY3RlcmlzdGljOiB7XG4gICAgICAgICAgYWRkcmVzczogdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnV1aWQpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIHdyaXRlKGFycmF5LCBuZWVkUmVzcG9uc2UpIHtcbiAgICBpZiAobmVlZFJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5lZWRSZXNwb25zZSA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIGJsZToge1xuICAgICAgICB3cml0ZV9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgICBkYXRhOiBhcnJheSxcbiAgICAgICAgICBuZWVkUmVzcG9uc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgZGlzY292ZXJDaGlsZHJlbigpIHtcbiAgICBjb25zdCBvYmogPSB7XG4gICAgICBibGU6IHtcbiAgICAgICAgZ2V0X2Rlc2NyaXB0b3JzOiB7XG4gICAgICAgICAgYWRkcmVzczogdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnV1aWQpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIGRpc2NvdmVyQWxsRGVzY3JpcHRvcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY292ZXJDaGlsZHJlbigpO1xuICB9XG5cbiAgZGlzY292ZXJBbGxEZXNjcmlwdG9yc1dhaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY292ZXJDaGlsZHJlbldhaXQoKTtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICBsZXQgb2JqID0gc3VwZXIudG9KU09OKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG9iai5wcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgY2FuQnJvYWRjYXN0KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoJ2Jyb2FkY2FzdCcpO1xuICB9XG5cbiAgY2FuTm90aWZ5KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoJ25vdGlmeScpO1xuICB9XG5cbiAgY2FuUmVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKCdyZWFkJyk7XG4gIH1cblxuICBjYW5Xcml0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKCd3cml0ZScpO1xuICB9XG5cbiAgY2FuV3JpdGVXaXRob3V0UmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcygnd3JpdGVfd2l0aG91dF9yZXNwb25zZScpO1xuICB9XG5cbiAgY2FuSW5kaWNhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcygnaW5kaWNhdGUnKTtcbiAgfVxuXG4gIG9uZGlzY292ZXIoZGVzY3JpcHRvcikge1xuICAgIHRoaXMub25kaXNjb3ZlcmRlc2NyaXB0b3IoZGVzY3JpcHRvcik7XG4gIH1cblxuICBvbmRpc2NvdmVyZmluaXNoZWQoZGVzY3JpcHRvcnMpIHtcbiAgICB0aGlzLm9uZGlzY292ZXJkZXNjcmlwdG9yZmluaXNoZWQoZGVzY3JpcHRvcnMpO1xuICB9XG5cbiAgb25kaXNjb3ZlcmRlc2NyaXB0b3IoKSB7fVxuXG4gIG9uZGlzY292ZXJkZXNjcmlwdG9yZmluaXNoZWQoKSB7fVxuXG4gIG9ucmVnaXN0ZXJub3RpZnkoKSB7fVxuXG4gIG9udW5yZWdpc3Rlcm5vdGlmeSgpIHt9XG5cbiAgb25ub3RpZnkoKSB7fVxuXG4gIG5vdGlmeUZyb21TZXJ2ZXIobm90aWZ5TmFtZSwgcGFyYW1zKSB7XG4gICAgc3VwZXIubm90aWZ5RnJvbVNlcnZlcihub3RpZnlOYW1lLCBwYXJhbXMpO1xuICAgIHN3aXRjaCAobm90aWZ5TmFtZSkge1xuICAgICAgY2FzZSAnb25yZWdpc3Rlcm5vdGlmeSc6IHtcbiAgICAgICAgdGhpcy5vbnJlZ2lzdGVybm90aWZ5KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnb251bnJlZ2lzdGVybm90aWZ5Jzoge1xuICAgICAgICB0aGlzLm9udW5yZWdpc3Rlcm5vdGlmeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ29ubm90aWZ5Jzoge1xuICAgICAgICB0aGlzLm9ubm90aWZ5KHBhcmFtcy5kYXRhIHx8IHVuZGVmaW5lZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZVJlbW90ZUNoYXJhY3RlcmlzdGljO1xuIl19
