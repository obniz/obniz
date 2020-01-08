"use strict";
const BleRemoteDescriptor = require('./bleRemoteDescriptor');
const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');
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
        this.onnotify = callback;
        this.service.peripheral.obnizBle.centralBindings.notify(this.service.peripheral.address, this.service.uuid, this.uuid, true);
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
        this.service.peripheral.obnizBle.centralBindings.notify(this.service.peripheral.address, this.service.uuid, this.uuid, false);
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
        this.service.peripheral.obnizBle.centralBindings.read(this.service.peripheral.address, this.service.uuid, this.uuid);
    }
    write(array, needResponse) {
        if (needResponse === undefined) {
            needResponse = true;
        }
        this.service.peripheral.obnizBle.centralBindings.write(this.service.peripheral.address, this.service.uuid, this.uuid, Buffer.from(array), !needResponse);
    }
    discoverChildren() {
        this.service.peripheral.obnizBle.centralBindings.discoverDescriptors(this.service.peripheral.address, this.service.uuid, this.uuid);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDN0QsTUFBTSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUUzRSxNQUFNLHVCQUF3QixTQUFRLDBCQUEwQjtJQUM5RCxZQUFZLE1BQU07UUFDaEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWQsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxtQkFBbUIsQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsYUFBYSxDQUFDLE1BQU07UUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBSTtRQUNoQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksR0FBRyxFQUFFO1lBQ1AsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUNELElBQUksaUJBQWlCLEdBQUcsSUFBSSxtQkFB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QUFJLENBQUM7SUFFakMsZ0JBQWdCLEtBQUksQ0FBQztJQUVyQixrQkFBa0IsS0FBSSxDQUFDO0lBRXZCLFFBQVEsS0FBSSxDQUFDO0lBRWIsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLE1BQU07UUFDakMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxRQUFRLFVBQVUsRUFBRTtZQUNsQixLQUFLLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QixNQUFNO2FBQ1A7WUFDRCxLQUFLLG9CQUFvQixDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMxQixNQUFNO2FBQ1A7WUFDRCxLQUFLLFVBQVUsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQztnQkFDeEMsTUFBTTthQUNQO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLHVCQUF1QixDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9ibGVSZW1vdGVDaGFyYWN0ZXJpc3RpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJsZVJlbW90ZURlc2NyaXB0b3IgPSByZXF1aXJlKCcuL2JsZVJlbW90ZURlc2NyaXB0b3InKTtcbmNvbnN0IEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0ID0gcmVxdWlyZSgnLi9ibGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdCcpO1xuXG5jbGFzcyBCbGVSZW1vdGVDaGFyYWN0ZXJpc3RpYyBleHRlbmRzIEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgc3VwZXIocGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGVydGllcyA9IHBhcmFtcy5wcm9wZXJ0aWVzIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnByb3BlcnRpZXMpKSB7XG4gICAgICB0aGlzLnByb3BlcnRpZXMgPSBbdGhpcy5wcm9wZXJ0aWVzXTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpIHtcbiAgICByZXR1cm4gJ3NlcnZpY2UnO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuQ2xhc3MoKSB7XG4gICAgcmV0dXJuIEJsZVJlbW90ZURlc2NyaXB0b3I7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5OYW1lKCkge1xuICAgIHJldHVybiAnZGVzY3JpcHRvcnMnO1xuICB9XG5cbiAgZ2V0IGRlc2NyaXB0b3JzKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICB9XG5cbiAgYWRkRGVzY3JpcHRvcihwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZChwYXJhbXMpO1xuICB9XG5cbiAgZ2V0RGVzY3JpcHRvcih1dWlkKSB7XG4gICAgbGV0IG9iaiA9IHRoaXMuZ2V0Q2hpbGQodXVpZCk7XG4gICAgaWYgKG9iaikge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgbGV0IG5ld0NoYXJhY3RlcmlzdGljID0gbmV3IEJsZVJlbW90ZURlc2NyaXB0b3IodGhpcy5PYm5peiwgdGhpcywgdXVpZCk7XG4gICAgdGhpcy5hZGRDaGlsZChuZXdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgcmV0dXJuIG5ld0NoYXJhY3RlcmlzdGljO1xuICB9XG5cbiAgcmVnaXN0ZXJOb3RpZnkoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9ubm90aWZ5ID0gY2FsbGJhY2s7XG4gICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwub2JuaXpCbGUuY2VudHJhbEJpbmRpbmdzLm5vdGlmeShcbiAgICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICB0aGlzLnNlcnZpY2UudXVpZCxcbiAgICAgIHRoaXMudXVpZCxcbiAgICAgIHRydWVcbiAgICApO1xuICB9XG5cbiAgcmVnaXN0ZXJOb3RpZnlXYWl0KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoJ29ucmVnaXN0ZXJub3RpZnknLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZWdpc3Rlck5vdGlmeShjYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICB1bnJlZ2lzdGVyTm90aWZ5KCkge1xuICAgIHRoaXMub25ub3RpZnkgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwub2JuaXpCbGUuY2VudHJhbEJpbmRpbmdzLm5vdGlmeShcbiAgICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICB0aGlzLnNlcnZpY2UudXVpZCxcbiAgICAgIHRoaXMudXVpZCxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJOb3RpZnlXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKCdvbnVucmVnaXN0ZXJub3RpZnknLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTm90aWZ5KCk7XG4gICAgfSk7XG4gIH1cblxuICByZWFkKCkge1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLm9ibml6QmxlLmNlbnRyYWxCaW5kaW5ncy5yZWFkKFxuICAgICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgIHRoaXMuc2VydmljZS51dWlkLFxuICAgICAgdGhpcy51dWlkXG4gICAgKTtcbiAgfVxuXG4gIHdyaXRlKGFycmF5LCBuZWVkUmVzcG9uc2UpIHtcbiAgICBpZiAobmVlZFJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5lZWRSZXNwb25zZSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLm9ibml6QmxlLmNlbnRyYWxCaW5kaW5ncy53cml0ZShcbiAgICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICB0aGlzLnNlcnZpY2UudXVpZCxcbiAgICAgIHRoaXMudXVpZCxcbiAgICAgIEJ1ZmZlci5mcm9tKGFycmF5KSxcbiAgICAgICFuZWVkUmVzcG9uc2VcbiAgICApO1xuICB9XG5cbiAgZGlzY292ZXJDaGlsZHJlbigpIHtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5vYm5pekJsZS5jZW50cmFsQmluZGluZ3MuZGlzY292ZXJEZXNjcmlwdG9ycyhcbiAgICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICB0aGlzLnNlcnZpY2UudXVpZCxcbiAgICAgIHRoaXMudXVpZFxuICAgICk7XG4gIH1cblxuICBkaXNjb3ZlckFsbERlc2NyaXB0b3JzKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NvdmVyQ2hpbGRyZW4oKTtcbiAgfVxuXG4gIGRpc2NvdmVyQWxsRGVzY3JpcHRvcnNXYWl0KCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NvdmVyQ2hpbGRyZW5XYWl0KCk7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgbGV0IG9iaiA9IHN1cGVyLnRvSlNPTigpO1xuXG4gICAgaWYgKHRoaXMucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBvYmoucHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGNhbkJyb2FkY2FzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKCdicm9hZGNhc3QnKTtcbiAgfVxuXG4gIGNhbk5vdGlmeSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKCdub3RpZnknKTtcbiAgfVxuXG4gIGNhblJlYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcygncmVhZCcpO1xuICB9XG5cbiAgY2FuV3JpdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcygnd3JpdGUnKTtcbiAgfVxuXG4gIGNhbldyaXRlV2l0aG91dFJlc3BvbnNlKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoJ3dyaXRlX3dpdGhvdXRfcmVzcG9uc2UnKTtcbiAgfVxuXG4gIGNhbkluZGljYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoJ2luZGljYXRlJyk7XG4gIH1cblxuICBvbmRpc2NvdmVyKGRlc2NyaXB0b3IpIHtcbiAgICB0aGlzLm9uZGlzY292ZXJkZXNjcmlwdG9yKGRlc2NyaXB0b3IpO1xuICB9XG5cbiAgb25kaXNjb3ZlcmZpbmlzaGVkKGRlc2NyaXB0b3JzKSB7XG4gICAgdGhpcy5vbmRpc2NvdmVyZGVzY3JpcHRvcmZpbmlzaGVkKGRlc2NyaXB0b3JzKTtcbiAgfVxuXG4gIG9uZGlzY292ZXJkZXNjcmlwdG9yKCkge31cblxuICBvbmRpc2NvdmVyZGVzY3JpcHRvcmZpbmlzaGVkKCkge31cblxuICBvbnJlZ2lzdGVybm90aWZ5KCkge31cblxuICBvbnVucmVnaXN0ZXJub3RpZnkoKSB7fVxuXG4gIG9ubm90aWZ5KCkge31cblxuICBub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWUsIHBhcmFtcykge1xuICAgIHN1cGVyLm5vdGlmeUZyb21TZXJ2ZXIobm90aWZ5TmFtZSwgcGFyYW1zKTtcbiAgICBzd2l0Y2ggKG5vdGlmeU5hbWUpIHtcbiAgICAgIGNhc2UgJ29ucmVnaXN0ZXJub3RpZnknOiB7XG4gICAgICAgIHRoaXMub25yZWdpc3Rlcm5vdGlmeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ29udW5yZWdpc3Rlcm5vdGlmeSc6IHtcbiAgICAgICAgdGhpcy5vbnVucmVnaXN0ZXJub3RpZnkoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdvbm5vdGlmeSc6IHtcbiAgICAgICAgdGhpcy5vbm5vdGlmeShwYXJhbXMuZGF0YSB8fCB1bmRlZmluZWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbGVSZW1vdGVDaGFyYWN0ZXJpc3RpYztcbiJdfQ==
