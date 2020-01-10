"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
class BleCharacteristic extends bleLocalAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this._maxValueSize = null;
        this._updateValueCallback = null;
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
        return "service";
    }
    get childrenClass() {
        return bleDescriptor_1.default;
    }
    get childrenName() {
        return "descriptors";
    }
    get descriptors() {
        return this.children;
    }
    toJSON() {
        const obj = super.toJSON();
        if (this.properties.length > 0) {
            obj.properties = this.properties;
        }
        if (this.permissions.length > 0) {
            obj.permissions = this.permissions;
        }
        return obj;
    }
    toBufferObj() {
        const obj = super.toBufferObj();
        obj.properties = this.properties;
        obj.secure = [];
        return obj;
    }
    addProperty(param) {
        if (!this.properties.includes(param)) {
            this.properties.push(param);
        }
    }
    removeProperty(param) {
        this.properties = this.properties.filter((elm) => {
            return elm !== param;
        });
    }
    addPermission(param) {
        if (!this.permissions.includes(param)) {
            this.permissions.push(param);
        }
    }
    removePermission(param) {
        this.permissions = this.permissions.filter((elm) => {
            return elm !== param;
        });
    }
    emit(name, ...params) {
        const result = super.emit(name, ...params);
        if (result) {
            return result;
        }
        switch (name) {
            case "subscribe":
                this._onSubscribe(...params);
                return true;
            case "unsubscribe":
                this._onUnsubscribe();
                return true;
            case "notify":
                this._onNotify();
                return true;
            case "indicate":
                this._onIndicate();
                return true;
            default:
                throw new Error("unknown emit");
        }
    }
    _onSubscribe(maxValueSize, updateValueCallback) {
        // console.log('_onSubscribe');
        this._maxValueSize = maxValueSize;
        this._updateValueCallback = updateValueCallback;
    }
    _onUnsubscribe() {
        this._maxValueSize = null;
        this._updateValueCallback = null;
    }
    _onNotify() {
    }
    _onIndicate() {
    }
    notify() {
        if (this._updateValueCallback) {
            this._updateValueCallback(Buffer.from(this.data));
        }
    }
}
exports.default = BleCharacteristic;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlQ2hhcmFjdGVyaXN0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsNEZBQW9FO0FBRXBFLE1BQU0saUJBQWtCLFNBQVEsbUNBQXlCO0lBWXZELFlBQVksR0FBUTtRQUNsQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFWCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO1FBRWpDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sdUJBQWEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksV0FBVztRQUNi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RyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRU0sU0FBUztJQUNoQixDQUFDO0lBRU0sV0FBVztJQUNsQixDQUFDO0lBRU0sTUFBTTtRQUNYLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsaUJBQWlCLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9ibGVDaGFyYWN0ZXJpc3RpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVEZXNjcmlwdG9yIGZyb20gXCIuL2JsZURlc2NyaXB0b3JcIjtcbmltcG9ydCBCbGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0IGZyb20gXCIuL2JsZUxvY2FsQXR0cmlidXRlQWJzdHJhY3RcIjtcblxuY2xhc3MgQmxlQ2hhcmFjdGVyaXN0aWMgZXh0ZW5kcyBCbGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgcHVibGljIF9tYXhWYWx1ZVNpemU6IGFueTtcbiAgcHVibGljIF91cGRhdGVWYWx1ZUNhbGxiYWNrOiBhbnk7XG4gIHB1YmxpYyBhZGREZXNjcmlwdG9yOiBhbnk7XG4gIHB1YmxpYyBhZGRDaGlsZDogYW55O1xuICBwdWJsaWMgZ2V0RGVzY3JpcHRvcjogYW55O1xuICBwdWJsaWMgZ2V0Q2hpbGQ6IGFueTtcbiAgcHVibGljIHByb3BlcnRpZXM6IGFueTtcbiAgcHVibGljIHBlcm1pc3Npb25zOiBhbnk7XG4gIHB1YmxpYyBjaGlsZHJlbjogYW55O1xuICBwdWJsaWMgZGF0YTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9iajogYW55KSB7XG4gICAgc3VwZXIob2JqKTtcblxuICAgIHRoaXMuX21heFZhbHVlU2l6ZSA9IG51bGw7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWVDYWxsYmFjayA9IG51bGw7XG5cbiAgICB0aGlzLmFkZERlc2NyaXB0b3IgPSB0aGlzLmFkZENoaWxkO1xuICAgIHRoaXMuZ2V0RGVzY3JpcHRvciA9IHRoaXMuZ2V0Q2hpbGQ7XG5cbiAgICB0aGlzLnByb3BlcnRpZXMgPSBvYmoucHJvcGVydGllcyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5wcm9wZXJ0aWVzKSkge1xuICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gW3RoaXMucHJvcGVydGllc107XG4gICAgfVxuXG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHRoaXMucGVybWlzc2lvbnMgPSBbdGhpcy5wZXJtaXNzaW9uc107XG4gICAgfVxuICB9XG5cbiAgZ2V0IHBhcmVudE5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIFwic2VydmljZVwiO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuQ2xhc3MoKTogYW55IHtcbiAgICByZXR1cm4gQmxlRGVzY3JpcHRvcjtcbiAgfVxuXG4gIGdldCBjaGlsZHJlbk5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIFwiZGVzY3JpcHRvcnNcIjtcbiAgfVxuXG4gIGdldCBkZXNjcmlwdG9ycygpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSBzdXBlci50b0pTT04oKTtcblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHB1YmxpYyB0b0J1ZmZlck9iaigpIHtcbiAgICBjb25zdCBvYmo6IGFueSA9IHN1cGVyLnRvQnVmZmVyT2JqKCk7XG5cbiAgICBvYmoucHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcbiAgICBvYmouc2VjdXJlID0gW107XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgcHVibGljIGFkZFByb3BlcnR5KHBhcmFtOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMucHJvcGVydGllcy5pbmNsdWRlcyhwYXJhbSkpIHtcbiAgICAgIHRoaXMucHJvcGVydGllcy5wdXNoKHBhcmFtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlUHJvcGVydHkocGFyYW06IGFueSkge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcy5maWx0ZXIoKGVsbTogYW55KSA9PiB7XG4gICAgICByZXR1cm4gZWxtICE9PSBwYXJhbTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRQZXJtaXNzaW9uKHBhcmFtOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMucGVybWlzc2lvbnMuaW5jbHVkZXMocGFyYW0pKSB7XG4gICAgICB0aGlzLnBlcm1pc3Npb25zLnB1c2gocGFyYW0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVQZXJtaXNzaW9uKHBhcmFtOiBhbnkpIHtcbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9ucy5maWx0ZXIoKGVsbTogYW55KSA9PiB7XG4gICAgICByZXR1cm4gZWxtICE9PSBwYXJhbTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbWl0KG5hbWU6IGFueSwgLi4ucGFyYW1zOiBhbnkpIHtcbiAgICBjb25zdCByZXN1bHQ6IGFueSA9IHN1cGVyLmVtaXQobmFtZSwgLi4ucGFyYW1zKTtcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgXCJzdWJzY3JpYmVcIjpcbiAgICAgICAgdGhpcy5fb25TdWJzY3JpYmUoLi4ucGFyYW1zIGFzIFthbnksIGFueV0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgXCJ1bnN1YnNjcmliZVwiOlxuICAgICAgICB0aGlzLl9vblVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSBcIm5vdGlmeVwiOlxuICAgICAgICB0aGlzLl9vbk5vdGlmeSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgXCJpbmRpY2F0ZVwiOlxuICAgICAgICB0aGlzLl9vbkluZGljYXRlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBlbWl0XCIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBfb25TdWJzY3JpYmUobWF4VmFsdWVTaXplOiBhbnksIHVwZGF0ZVZhbHVlQ2FsbGJhY2s/OiBhbnkpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnX29uU3Vic2NyaWJlJyk7XG4gICAgdGhpcy5fbWF4VmFsdWVTaXplID0gbWF4VmFsdWVTaXplO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlQ2FsbGJhY2sgPSB1cGRhdGVWYWx1ZUNhbGxiYWNrO1xuICB9XG5cbiAgcHVibGljIF9vblVuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuX21heFZhbHVlU2l6ZSA9IG51bGw7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWVDYWxsYmFjayA9IG51bGw7XG4gIH1cblxuICBwdWJsaWMgX29uTm90aWZ5KCkge1xuICB9XG5cbiAgcHVibGljIF9vbkluZGljYXRlKCkge1xuICB9XG5cbiAgcHVibGljIG5vdGlmeSgpIHtcbiAgICBpZiAodGhpcy5fdXBkYXRlVmFsdWVDYWxsYmFjaykge1xuICAgICAgdGhpcy5fdXBkYXRlVmFsdWVDYWxsYmFjayhCdWZmZXIuZnJvbSh0aGlzLmRhdGEpKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxlQ2hhcmFjdGVyaXN0aWM7XG4iXX0=
