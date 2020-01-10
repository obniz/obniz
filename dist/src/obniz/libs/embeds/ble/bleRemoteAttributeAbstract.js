"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
class BleRemoteAttributeAbstract extends bleAttributeAbstract_1.default {
    constructor(params) {
        super(params);
        this.isRemote = false;
        this.discoverdOnRemote = false;
    }
    get wsChildUuidName() {
        const childrenName = this.childrenName;
        if (!childrenName) {
            return null;
        }
        const childName = childrenName.slice(0, -1);
        return childName + "_uuid";
    }
    discoverChildren() {
    }
    discoverChildrenWait() {
        return new Promise((resolve) => {
            this.emitter.once("discoverfinished", () => {
                const children = this.children.filter((elm) => {
                    return elm.discoverdOnRemote;
                });
                resolve(children);
            });
            this.discoverChildren();
        });
    }
    /**
     * CALLBACKS
     */
    ondiscover(child) {
    }
    ondiscoverfinished(children) {
    }
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        switch (notifyName) {
            case "discover": {
                const uuid = params[this.wsChildUuidName];
                let child = this.getChild(uuid);
                if (!child) {
                    child = this.addChild({ uuid });
                }
                child.discoverdOnRemote = true;
                child.properties = params.properties || [];
                this.ondiscover(child);
                break;
            }
            case "discoverfinished": {
                const children = this.children.filter((elm) => {
                    return elm.discoverdOnRemote;
                });
                this.ondiscoverfinished(children);
                break;
            }
        }
    }
}
exports.default = BleRemoteAttributeAbstract;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrRkFBMEQ7QUFFMUQsTUFBTSwwQkFBMkIsU0FBUSw4QkFBb0I7SUFTM0QsWUFBWSxNQUFXO1FBQ3JCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVkLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixNQUFNLFlBQVksR0FBUSxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzVDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE1BQU0sU0FBUyxHQUFRLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsT0FBTyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzdCLENBQUM7SUFFTSxnQkFBZ0I7SUFDdkIsQ0FBQztJQUVNLG9CQUFvQjtRQUN6QixPQUFPLElBQUksT0FBTyxDQUFFLENBQUMsT0FBWSxFQUFHLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO2dCQUN6QyxNQUFNLFFBQVEsR0FBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDLEdBQVEsRUFBRyxFQUFFO29CQUN4RCxPQUFPLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxVQUFVLENBQUMsS0FBVTtJQUM1QixDQUFDO0lBRU0sa0JBQWtCLENBQUMsUUFBYTtJQUN2QyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsVUFBZSxFQUFFLE1BQVc7UUFDbEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxRQUFRLFVBQVUsRUFBRTtZQUNsQixLQUFLLFVBQVUsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sSUFBSSxHQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLEtBQUssR0FBUSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNWLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsS0FBSyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztnQkFDL0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkIsTUFBTTthQUNQO1lBQ0QsS0FBSyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLFFBQVEsR0FBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDLEdBQVEsRUFBRyxFQUFFO29CQUN4RCxPQUFPLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNO2FBQ1A7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLDBCQUEwQixDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmxlQXR0cmlidXRlQWJzdHJhY3QgZnJvbSBcIi4vYmxlQXR0cmlidXRlQWJzdHJhY3RcIjtcblxuY2xhc3MgQmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QgZXh0ZW5kcyBCbGVBdHRyaWJ1dGVBYnN0cmFjdCB7XG4gIHB1YmxpYyBpc1JlbW90ZTogYW55O1xuICBwdWJsaWMgZGlzY292ZXJkT25SZW1vdGU6IGFueTtcbiAgcHVibGljIGNoaWxkcmVuTmFtZTogYW55O1xuICBwdWJsaWMgZW1pdHRlcjogYW55O1xuICBwdWJsaWMgY2hpbGRyZW46IGFueTtcbiAgcHVibGljIGdldENoaWxkOiBhbnk7XG4gIHB1YmxpYyBhZGRDaGlsZDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogYW55KSB7XG4gICAgc3VwZXIocGFyYW1zKTtcblxuICAgIHRoaXMuaXNSZW1vdGUgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2NvdmVyZE9uUmVtb3RlID0gZmFsc2U7XG4gIH1cblxuICBnZXQgd3NDaGlsZFV1aWROYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IGNoaWxkcmVuTmFtZTogYW55ID0gdGhpcy5jaGlsZHJlbk5hbWU7XG4gICAgaWYgKCFjaGlsZHJlbk5hbWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZE5hbWU6IGFueSA9IGNoaWxkcmVuTmFtZS5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuIGNoaWxkTmFtZSArIFwiX3V1aWRcIjtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb3ZlckNoaWxkcmVuKCkge1xuICB9XG5cbiAgcHVibGljIGRpc2NvdmVyQ2hpbGRyZW5XYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSAoKHJlc29sdmU6IGFueSApID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwiZGlzY292ZXJmaW5pc2hlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiBhbnkgPSB0aGlzLmNoaWxkcmVuLmZpbHRlciAoKGVsbTogYW55ICkgPT4ge1xuICAgICAgICAgIHJldHVybiBlbG0uZGlzY292ZXJkT25SZW1vdGU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKGNoaWxkcmVuKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNjb3ZlckNoaWxkcmVuKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ0FMTEJBQ0tTXG4gICAqL1xuICBwdWJsaWMgb25kaXNjb3ZlcihjaGlsZDogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcmZpbmlzaGVkKGNoaWxkcmVuOiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWU6IGFueSwgcGFyYW1zOiBhbnkpIHtcbiAgICBzdXBlci5ub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWUsIHBhcmFtcyk7XG4gICAgc3dpdGNoIChub3RpZnlOYW1lKSB7XG4gICAgICBjYXNlIFwiZGlzY292ZXJcIjoge1xuICAgICAgICBjb25zdCB1dWlkOiBhbnkgPSBwYXJhbXNbdGhpcy53c0NoaWxkVXVpZE5hbWUhXTtcbiAgICAgICAgbGV0IGNoaWxkOiBhbnkgPSB0aGlzLmdldENoaWxkKHV1aWQpO1xuICAgICAgICBpZiAoIWNoaWxkKSB7XG4gICAgICAgICAgY2hpbGQgPSB0aGlzLmFkZENoaWxkKHt1dWlkfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGQuZGlzY292ZXJkT25SZW1vdGUgPSB0cnVlO1xuICAgICAgICBjaGlsZC5wcm9wZXJ0aWVzID0gcGFyYW1zLnByb3BlcnRpZXMgfHwgW107XG4gICAgICAgIHRoaXMub25kaXNjb3ZlcihjaGlsZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBcImRpc2NvdmVyZmluaXNoZWRcIjoge1xuICAgICAgICBjb25zdCBjaGlsZHJlbjogYW55ID0gdGhpcy5jaGlsZHJlbi5maWx0ZXIgKChlbG06IGFueSApID0+IHtcbiAgICAgICAgICByZXR1cm4gZWxtLmRpc2NvdmVyZE9uUmVtb3RlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbmRpc2NvdmVyZmluaXNoZWQoY2hpbGRyZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3Q7XG4iXX0=
