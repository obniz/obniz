"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleRemoteAttributeAbstract_1 = __importDefault(require("./bleRemoteAttributeAbstract"));
const bleRemoteDescriptor_1 = __importDefault(require("./bleRemoteDescriptor"));
class BleRemoteCharacteristic extends bleRemoteAttributeAbstract_1.default {
    constructor(params) {
        super(params);
        this.properties = params.properties || [];
        if (!Array.isArray(this.properties)) {
            this.properties = [this.properties];
        }
    }
    get parentName() {
        return "service";
    }
    get childrenClass() {
        return bleRemoteDescriptor_1.default;
    }
    get childrenName() {
        return "descriptors";
    }
    get descriptors() {
        return this.children;
    }
    addDescriptor(params) {
        return this.addChild(params);
    }
    getDescriptor(uuid) {
        return this.getChild(uuid);
    }
    registerNotify(callback) {
        this.onnotify = callback;
        this.service.peripheral.obnizBle.centralBindings.notify(this.service.peripheral.address, this.service.uuid, this.uuid, true);
    }
    registerNotifyWait(callback) {
        return new Promise((resolve) => {
            this.emitter.once("onregisternotify", () => {
                resolve();
            });
            this.registerNotify(callback);
        });
    }
    unregisterNotify() {
        this.onnotify = () => {
        };
        this.service.peripheral.obnizBle.centralBindings.notify(this.service.peripheral.address, this.service.uuid, this.uuid, false);
    }
    unregisterNotifyWait() {
        return new Promise((resolve) => {
            this.emitter.once("onunregisternotify", () => {
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
        const obj = super.toJSON();
        if (this.properties.length > 0) {
            obj.properties = this.properties;
        }
        return obj;
    }
    canBroadcast() {
        return this.properties.includes("broadcast");
    }
    canNotify() {
        return this.properties.includes("notify");
    }
    canRead() {
        return this.properties.includes("read");
    }
    canWrite() {
        return this.properties.includes("write");
    }
    canWriteWithoutResponse() {
        return this.properties.includes("write_without_response");
    }
    canIndicate() {
        return this.properties.includes("indicate");
    }
    ondiscover(descriptor) {
        this.ondiscoverdescriptor(descriptor);
    }
    ondiscoverfinished(descriptors) {
        this.ondiscoverdescriptorfinished(descriptors);
    }
    ondiscoverdescriptor(descriptor) {
    }
    ondiscoverdescriptorfinished(descriptors) {
    }
    onregisternotify() {
    }
    onunregisternotify() {
    }
    onnotify(data) {
    }
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        switch (notifyName) {
            case "onregisternotify": {
                this.onregisternotify();
                break;
            }
            case "onunregisternotify": {
                this.onunregisternotify();
                break;
            }
            case "onnotify": {
                this.onnotify(params.data || undefined);
                break;
            }
        }
    }
}
exports.default = BleRemoteCharacteristic;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4RkFBc0U7QUFDdEUsZ0ZBQXdEO0FBRXhELE1BQU0sdUJBQXdCLFNBQVEsb0NBQTBCO0lBVzlELFlBQVksTUFBVztRQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDZixPQUFPLDZCQUFtQixDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxhQUFhLENBQUMsTUFBVztRQUM5QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFTO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU0sY0FBYyxDQUFDLFFBQWE7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsVUFB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QUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsTUFBTTthQUNQO1lBQ0QsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsTUFBTTthQUNQO1lBQ0QsS0FBSyxVQUFVLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU07YUFDUDtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsdUJBQXVCLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9ibGVSZW1vdGVDaGFyYWN0ZXJpc3RpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdCBmcm9tIFwiLi9ibGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdFwiO1xuaW1wb3J0IEJsZVJlbW90ZURlc2NyaXB0b3IgZnJvbSBcIi4vYmxlUmVtb3RlRGVzY3JpcHRvclwiO1xuXG5jbGFzcyBCbGVSZW1vdGVDaGFyYWN0ZXJpc3RpYyBleHRlbmRzIEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgcHVibGljIHByb3BlcnRpZXM6IGFueTtcbiAgcHVibGljIGNoaWxkcmVuOiBhbnk7XG4gIHB1YmxpYyBhZGRDaGlsZDogYW55O1xuICBwdWJsaWMgZ2V0Q2hpbGQ6IGFueTtcbiAgcHVibGljIE9ibml6OiBhbnk7XG4gIHB1YmxpYyBzZXJ2aWNlOiBhbnk7XG4gIHB1YmxpYyB1dWlkOiBhbnk7XG4gIHB1YmxpYyBlbWl0dGVyOiBhbnk7XG4gIHB1YmxpYyBkaXNjb3ZlckNoaWxkcmVuV2FpdDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogYW55KSB7XG4gICAgc3VwZXIocGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGVydGllcyA9IHBhcmFtcy5wcm9wZXJ0aWVzIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnByb3BlcnRpZXMpKSB7XG4gICAgICB0aGlzLnByb3BlcnRpZXMgPSBbdGhpcy5wcm9wZXJ0aWVzXTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gXCJzZXJ2aWNlXCI7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5DbGFzcygpOiBhbnkge1xuICAgIHJldHVybiBCbGVSZW1vdGVEZXNjcmlwdG9yO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuTmFtZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gXCJkZXNjcmlwdG9yc1wiO1xuICB9XG5cbiAgZ2V0IGRlc2NyaXB0b3JzKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuO1xuICB9XG5cbiAgcHVibGljIGFkZERlc2NyaXB0b3IocGFyYW1zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZChwYXJhbXMpO1xuICB9XG5cbiAgcHVibGljIGdldERlc2NyaXB0b3IodXVpZDogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGQodXVpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJOb3RpZnkoY2FsbGJhY2s6IGFueSkge1xuICAgIHRoaXMub25ub3RpZnkgPSBjYWxsYmFjaztcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5vYm5pekJsZS5jZW50cmFsQmluZGluZ3Mubm90aWZ5KFxuICAgICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgIHRoaXMuc2VydmljZS51dWlkLFxuICAgICAgdGhpcy51dWlkLFxuICAgICAgdHJ1ZSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTm90aWZ5V2FpdChjYWxsYmFjazogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlICgocmVzb2x2ZTogYW55ICkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoXCJvbnJlZ2lzdGVybm90aWZ5XCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyTm90aWZ5KGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1bnJlZ2lzdGVyTm90aWZ5KCkge1xuICAgIHRoaXMub25ub3RpZnkgPSAoKSA9PiB7XG4gICAgfTtcblxuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLm9ibml6QmxlLmNlbnRyYWxCaW5kaW5ncy5ub3RpZnkoXG4gICAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5hZGRyZXNzLFxuICAgICAgdGhpcy5zZXJ2aWNlLnV1aWQsXG4gICAgICB0aGlzLnV1aWQsXG4gICAgICBmYWxzZSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHVucmVnaXN0ZXJOb3RpZnlXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSAoKHJlc29sdmU6IGFueSApID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwib251bnJlZ2lzdGVybm90aWZ5XCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJOb3RpZnkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkKCkge1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLm9ibml6QmxlLmNlbnRyYWxCaW5kaW5ncy5yZWFkKFxuICAgICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgIHRoaXMuc2VydmljZS51dWlkLFxuICAgICAgdGhpcy51dWlkLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGUoYXJyYXk6IGFueSwgbmVlZFJlc3BvbnNlOiBhbnkpIHtcbiAgICBpZiAobmVlZFJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5lZWRSZXNwb25zZSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLm9ibml6QmxlLmNlbnRyYWxCaW5kaW5ncy53cml0ZShcbiAgICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICB0aGlzLnNlcnZpY2UudXVpZCxcbiAgICAgIHRoaXMudXVpZCxcbiAgICAgIEJ1ZmZlci5mcm9tKGFycmF5KSxcbiAgICAgICFuZWVkUmVzcG9uc2UsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckNoaWxkcmVuKCkge1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLm9ibml6QmxlLmNlbnRyYWxCaW5kaW5ncy5kaXNjb3ZlckRlc2NyaXB0b3JzKFxuICAgICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgIHRoaXMuc2VydmljZS51dWlkLFxuICAgICAgdGhpcy51dWlkLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgZGlzY292ZXJBbGxEZXNjcmlwdG9ycygpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjb3ZlckNoaWxkcmVuKCk7XG4gIH1cblxuICBwdWJsaWMgZGlzY292ZXJBbGxEZXNjcmlwdG9yc1dhaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY292ZXJDaGlsZHJlbldhaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSBzdXBlci50b0pTT04oKTtcblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBwdWJsaWMgY2FuQnJvYWRjYXN0KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoXCJicm9hZGNhc3RcIik7XG4gIH1cblxuICBwdWJsaWMgY2FuTm90aWZ5KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoXCJub3RpZnlcIik7XG4gIH1cblxuICBwdWJsaWMgY2FuUmVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKFwicmVhZFwiKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5Xcml0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKFwid3JpdGVcIik7XG4gIH1cblxuICBwdWJsaWMgY2FuV3JpdGVXaXRob3V0UmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcyhcIndyaXRlX3dpdGhvdXRfcmVzcG9uc2VcIik7XG4gIH1cblxuICBwdWJsaWMgY2FuSW5kaWNhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcyhcImluZGljYXRlXCIpO1xuICB9XG5cbiAgcHVibGljIG9uZGlzY292ZXIoZGVzY3JpcHRvcjogYW55KSB7XG4gICAgdGhpcy5vbmRpc2NvdmVyZGVzY3JpcHRvcihkZXNjcmlwdG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyZmluaXNoZWQoZGVzY3JpcHRvcnM6IGFueSkge1xuICAgIHRoaXMub25kaXNjb3ZlcmRlc2NyaXB0b3JmaW5pc2hlZChkZXNjcmlwdG9ycyk7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcmRlc2NyaXB0b3IoZGVzY3JpcHRvcjogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcmRlc2NyaXB0b3JmaW5pc2hlZChkZXNjcmlwdG9yczogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgb25yZWdpc3Rlcm5vdGlmeSgpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbnVucmVnaXN0ZXJub3RpZnkoKSB7XG4gIH1cblxuICBwdWJsaWMgb25ub3RpZnkoZGF0YTogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbVNlcnZlcihub3RpZnlOYW1lOiBhbnksIHBhcmFtczogYW55KSB7XG4gICAgc3VwZXIubm90aWZ5RnJvbVNlcnZlcihub3RpZnlOYW1lLCBwYXJhbXMpO1xuICAgIHN3aXRjaCAobm90aWZ5TmFtZSkge1xuICAgICAgY2FzZSBcIm9ucmVnaXN0ZXJub3RpZnlcIjoge1xuICAgICAgICB0aGlzLm9ucmVnaXN0ZXJub3RpZnkoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFwib251bnJlZ2lzdGVybm90aWZ5XCI6IHtcbiAgICAgICAgdGhpcy5vbnVucmVnaXN0ZXJub3RpZnkoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFwib25ub3RpZnlcIjoge1xuICAgICAgICB0aGlzLm9ubm90aWZ5KHBhcmFtcy5kYXRhIHx8IHVuZGVmaW5lZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCbGVSZW1vdGVDaGFyYWN0ZXJpc3RpYztcbiJdfQ==
