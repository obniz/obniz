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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
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
    //
    // getCharacteristic(params) {
    //   return this.getChild(params)
    // }
    getDescriptor(uuid) {
        return this.getChild(uuid);
    }
    registerNotify(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.onnotify = callback;
            const cccd = this.getDescriptor("2902");
            yield cccd.writeWait([0x01, 0x00]);
            const obj = {
                ble: {
                    register_notify_characteristic: {
                        address: this.service.peripheral.address,
                        service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    },
                },
            };
            this.service.peripheral.Obniz.send(obj);
        });
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
        const obj = {
            ble: {
                unregister_notify_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
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
        const obj = {
            ble: {
                read_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
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
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
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
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
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
    ondiscoverdescriptor(descriptors) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFDcEMsOEZBQXNFO0FBQ3RFLGdGQUF3RDtBQUV4RCxNQUFNLHVCQUF3QixTQUFRLG9DQUEwQjtJQVc5RCxZQUFZLE1BQVc7UUFDckIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWQsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyw2QkFBbUIsQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRU0sYUFBYSxDQUFDLE1BQVc7UUFDOUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxFQUFFO0lBQ0YsOEJBQThCO0lBQzlCLGlDQUFpQztJQUNqQyxJQUFJO0lBRUcsYUFBYSxDQUFDLElBQVM7UUFDNUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFWSxjQUFjLENBQUMsUUFBYTs7WUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsTUFBTSxJQUFJLEdBQVEsSUFB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Q0FBQyxDQUFDO1FBQzNDLFFBQVEsVUFBVSxFQUFFO1lBQ2xCLEtBQUssa0JBQWtCLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLE1BQU07YUFDUDtZQUNELEtBQUssb0JBQW9CLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLE1BQU07YUFDUDtZQUNELEtBQUssVUFBVSxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNO2FBQ1A7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLHVCQUF1QixDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlQ2hhcmFjdGVyaXN0aWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmxlSGVscGVyIGZyb20gXCIuL2JsZUhlbHBlclwiO1xuaW1wb3J0IEJsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0IGZyb20gXCIuL2JsZVJlbW90ZUF0dHJpYnV0ZUFic3RyYWN0XCI7XG5pbXBvcnQgQmxlUmVtb3RlRGVzY3JpcHRvciBmcm9tIFwiLi9ibGVSZW1vdGVEZXNjcmlwdG9yXCI7XG5cbmNsYXNzIEJsZVJlbW90ZUNoYXJhY3RlcmlzdGljIGV4dGVuZHMgQmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3Qge1xuICBwdWJsaWMgcHJvcGVydGllczogYW55O1xuICBwdWJsaWMgY2hpbGRyZW46IGFueTtcbiAgcHVibGljIGFkZENoaWxkOiBhbnk7XG4gIHB1YmxpYyBnZXRDaGlsZDogYW55O1xuICBwdWJsaWMgT2JuaXo6IGFueTtcbiAgcHVibGljIHNlcnZpY2U6IGFueTtcbiAgcHVibGljIHV1aWQ6IGFueTtcbiAgcHVibGljIGVtaXR0ZXI6IGFueTtcbiAgcHVibGljIGRpc2NvdmVyQ2hpbGRyZW5XYWl0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IocGFyYW1zOiBhbnkpIHtcbiAgICBzdXBlcihwYXJhbXMpO1xuXG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcGFyYW1zLnByb3BlcnRpZXMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucHJvcGVydGllcykpIHtcbiAgICAgIHRoaXMucHJvcGVydGllcyA9IFt0aGlzLnByb3BlcnRpZXNdO1xuICAgIH1cbiAgfVxuXG4gIGdldCBwYXJlbnROYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiBcInNlcnZpY2VcIjtcbiAgfVxuXG4gIGdldCBjaGlsZHJlbkNsYXNzKCk6IGFueSB7XG4gICAgcmV0dXJuIEJsZVJlbW90ZURlc2NyaXB0b3I7XG4gIH1cblxuICBnZXQgY2hpbGRyZW5OYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiBcImRlc2NyaXB0b3JzXCI7XG4gIH1cblxuICBnZXQgZGVzY3JpcHRvcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG4gIH1cblxuICBwdWJsaWMgYWRkRGVzY3JpcHRvcihwYXJhbXM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmFkZENoaWxkKHBhcmFtcyk7XG4gIH1cblxuICAvL1xuICAvLyBnZXRDaGFyYWN0ZXJpc3RpYyhwYXJhbXMpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5nZXRDaGlsZChwYXJhbXMpXG4gIC8vIH1cblxuICBwdWJsaWMgZ2V0RGVzY3JpcHRvcih1dWlkOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGlsZCh1dWlkKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZWdpc3Rlck5vdGlmeShjYWxsYmFjazogYW55KSB7XG4gICAgdGhpcy5vbm5vdGlmeSA9IGNhbGxiYWNrO1xuICAgIGNvbnN0IGNjY2Q6IGFueSA9IHRoaXMuZ2V0RGVzY3JpcHRvcihcIjI5MDJcIik7XG4gICAgYXdhaXQgY2NjZC53cml0ZVdhaXQoWzB4MDEsIDB4MDBdKTtcblxuICAgIGNvbnN0IG9iajogYW55ID0ge1xuICAgICAgYmxlOiB7XG4gICAgICAgIHJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJOb3RpZnlXYWl0KGNhbGxiYWNrOiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoXCJvbnJlZ2lzdGVybm90aWZ5XCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyTm90aWZ5KGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1bnJlZ2lzdGVyTm90aWZ5KCkge1xuICAgIHRoaXMub25ub3RpZnkgPSAoKSA9PiB7XG4gICAgfTtcbiAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgIGJsZToge1xuICAgICAgICB1bnJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBwdWJsaWMgdW5yZWdpc3Rlck5vdGlmeVdhaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwib251bnJlZ2lzdGVybm90aWZ5XCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJOb3RpZnkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkKCkge1xuICAgIGNvbnN0IG9iajogYW55ID0ge1xuICAgICAgYmxlOiB7XG4gICAgICAgIHJlYWRfY2hhcmFjdGVyaXN0aWM6IHtcbiAgICAgICAgICBhZGRyZXNzOiB0aGlzLnNlcnZpY2UucGVyaXBoZXJhbC5hZGRyZXNzLFxuICAgICAgICAgIHNlcnZpY2VfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy5zZXJ2aWNlLnV1aWQpLFxuICAgICAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMudXVpZCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgcHVibGljIHdyaXRlKGFycmF5OiBhbnksIG5lZWRSZXNwb25zZTogYW55KSB7XG4gICAgaWYgKG5lZWRSZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZWVkUmVzcG9uc2UgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgIGJsZToge1xuICAgICAgICB3cml0ZV9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLmFkZHJlc3MsXG4gICAgICAgICAgc2VydmljZV91dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnNlcnZpY2UudXVpZCksXG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogQmxlSGVscGVyLnV1aWRGaWx0ZXIodGhpcy51dWlkKSxcbiAgICAgICAgICBkYXRhOiBhcnJheSxcbiAgICAgICAgICBuZWVkUmVzcG9uc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgcHVibGljIGRpc2NvdmVyQ2hpbGRyZW4oKSB7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSB7XG4gICAgICBibGU6IHtcbiAgICAgICAgZ2V0X2Rlc2NyaXB0b3JzOiB7XG4gICAgICAgICAgYWRkcmVzczogdGhpcy5zZXJ2aWNlLnBlcmlwaGVyYWwuYWRkcmVzcyxcbiAgICAgICAgICBzZXJ2aWNlX3V1aWQ6IEJsZUhlbHBlci51dWlkRmlsdGVyKHRoaXMuc2VydmljZS51dWlkKSxcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBCbGVIZWxwZXIudXVpZEZpbHRlcih0aGlzLnV1aWQpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuc2VydmljZS5wZXJpcGhlcmFsLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckFsbERlc2NyaXB0b3JzKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NvdmVyQ2hpbGRyZW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckFsbERlc2NyaXB0b3JzV2FpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjb3ZlckNoaWxkcmVuV2FpdCgpO1xuICB9XG5cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICBjb25zdCBvYmo6IGFueSA9IHN1cGVyLnRvSlNPTigpO1xuXG4gICAgaWYgKHRoaXMucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBvYmoucHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHB1YmxpYyBjYW5Ccm9hZGNhc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcyhcImJyb2FkY2FzdFwiKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5Ob3RpZnkoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbmNsdWRlcyhcIm5vdGlmeVwiKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5SZWFkKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoXCJyZWFkXCIpO1xuICB9XG5cbiAgcHVibGljIGNhbldyaXRlKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuaW5jbHVkZXMoXCJ3cml0ZVwiKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5Xcml0ZVdpdGhvdXRSZXNwb25zZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKFwid3JpdGVfd2l0aG91dF9yZXNwb25zZVwiKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5JbmRpY2F0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmluY2x1ZGVzKFwiaW5kaWNhdGVcIik7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcihkZXNjcmlwdG9yOiBhbnkpIHtcbiAgICB0aGlzLm9uZGlzY292ZXJkZXNjcmlwdG9yKGRlc2NyaXB0b3IpO1xuICB9XG5cbiAgcHVibGljIG9uZGlzY292ZXJmaW5pc2hlZChkZXNjcmlwdG9yczogYW55KSB7XG4gICAgdGhpcy5vbmRpc2NvdmVyZGVzY3JpcHRvcmZpbmlzaGVkKGRlc2NyaXB0b3JzKTtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyZGVzY3JpcHRvcihkZXNjcmlwdG9yczogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcmRlc2NyaXB0b3JmaW5pc2hlZChkZXNjcmlwdG9yczogYW55W10pIHtcbiAgfVxuXG4gIHB1YmxpYyBvbnJlZ2lzdGVybm90aWZ5KCkge1xuICB9XG5cbiAgcHVibGljIG9udW5yZWdpc3Rlcm5vdGlmeSgpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbm5vdGlmeShkYXRhOiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWU6IGFueSwgcGFyYW1zOiBhbnkpIHtcbiAgICBzdXBlci5ub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWUsIHBhcmFtcyk7XG4gICAgc3dpdGNoIChub3RpZnlOYW1lKSB7XG4gICAgICBjYXNlIFwib25yZWdpc3Rlcm5vdGlmeVwiOiB7XG4gICAgICAgIHRoaXMub25yZWdpc3Rlcm5vdGlmeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJvbnVucmVnaXN0ZXJub3RpZnlcIjoge1xuICAgICAgICB0aGlzLm9udW5yZWdpc3Rlcm5vdGlmeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJvbm5vdGlmeVwiOiB7XG4gICAgICAgIHRoaXMub25ub3RpZnkocGFyYW1zLmRhdGEgfHwgdW5kZWZpbmVkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZVJlbW90ZUNoYXJhY3RlcmlzdGljO1xuIl19
