"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
class BleDescriptor extends bleLocalAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.permissions = obj.permissions || [];
        if (!Array.isArray(this.permissions)) {
            this.permissions = [this.permissions];
        }
    }
    get parentName() {
        return "characteristic";
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
    toJSON() {
        const obj = super.toJSON();
        if (this.permissions.length > 0) {
            obj.permissions = this.permissions;
        }
        return obj;
    }
}
exports.default = BleDescriptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlRGVzY3JpcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRGQUFvRTtBQUVwRSxNQUFNLGFBQWMsU0FBUSxtQ0FBeUI7SUFHbkQsWUFBWSxHQUFRO1FBQ2xCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVYLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU0sYUFBYSxDQUFDLEtBQVU7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEtBQVU7UUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBRSxDQUFDLEdBQVEsRUFBRyxFQUFFO1lBQ3hELE9BQU8sR0FBRyxLQUFLLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNO1FBQ1gsTUFBTSxHQUFHLEdBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNwQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQUNGO0FBRUQsa0JBQWUsYUFBYSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlRGVzY3JpcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0IGZyb20gXCIuL2JsZUxvY2FsQXR0cmlidXRlQWJzdHJhY3RcIjtcblxuY2xhc3MgQmxlRGVzY3JpcHRvciBleHRlbmRzIEJsZUxvY2FsQXR0cmlidXRlQWJzdHJhY3Qge1xuICBwdWJsaWMgcGVybWlzc2lvbnM6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvYmo6IGFueSkge1xuICAgIHN1cGVyKG9iaik7XG5cbiAgICB0aGlzLnBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgdGhpcy5wZXJtaXNzaW9ucyA9IFt0aGlzLnBlcm1pc3Npb25zXTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFyZW50TmFtZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gXCJjaGFyYWN0ZXJpc3RpY1wiO1xuICB9XG5cbiAgcHVibGljIGFkZFBlcm1pc3Npb24ocGFyYW06IGFueSkge1xuICAgIGlmICghdGhpcy5wZXJtaXNzaW9ucy5pbmNsdWRlcyhwYXJhbSkpIHtcbiAgICAgIHRoaXMucGVybWlzc2lvbnMucHVzaChwYXJhbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZVBlcm1pc3Npb24ocGFyYW06IGFueSkge1xuICAgIHRoaXMucGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zLmZpbHRlciAoKGVsbTogYW55ICkgPT4ge1xuICAgICAgcmV0dXJuIGVsbSAhPT0gcGFyYW07XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIGNvbnN0IG9iajogYW55ID0gc3VwZXIudG9KU09OKCk7XG5cbiAgICBpZiAodGhpcy5wZXJtaXNzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBvYmoucGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZURlc2NyaXB0b3I7XG4iXX0=
