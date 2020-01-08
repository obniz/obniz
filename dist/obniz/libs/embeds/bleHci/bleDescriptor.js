"use strict";
const BleLocalAttributeAbstract = require('./bleLocalAttributeAbstract');
class BleDescriptor extends BleLocalAttributeAbstract {
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
}
module.exports = BleDescriptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlRGVzY3JpcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSx5QkFBeUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUV6RSxNQUFNLGFBQWMsU0FBUSx5QkFBeUI7SUFDbkQsWUFBWSxHQUFHO1FBQ2IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVgsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBSztRQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQy9DLE9BQU8sR0FBRyxLQUFLLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXpCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNwQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL2JsZURlc2NyaXB0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCbGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0ID0gcmVxdWlyZSgnLi9ibGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0Jyk7XG5cbmNsYXNzIEJsZURlc2NyaXB0b3IgZXh0ZW5kcyBCbGVMb2NhbEF0dHJpYnV0ZUFic3RyYWN0IHtcbiAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgc3VwZXIob2JqKTtcblxuICAgIHRoaXMucGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICB0aGlzLnBlcm1pc3Npb25zID0gW3RoaXMucGVybWlzc2lvbnNdO1xuICAgIH1cbiAgfVxuXG4gIGdldCBwYXJlbnROYW1lKCkge1xuICAgIHJldHVybiAnY2hhcmFjdGVyaXN0aWMnO1xuICB9XG5cbiAgYWRkUGVybWlzc2lvbihwYXJhbSkge1xuICAgIGlmICghdGhpcy5wZXJtaXNzaW9ucy5pbmNsdWRlcyhwYXJhbSkpIHtcbiAgICAgIHRoaXMucGVybWlzc2lvbnMucHVzaChwYXJhbSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlUGVybWlzc2lvbihwYXJhbSkge1xuICAgIHRoaXMucGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zLmZpbHRlcihlbG0gPT4ge1xuICAgICAgcmV0dXJuIGVsbSAhPT0gcGFyYW07XG4gICAgfSk7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgbGV0IG9iaiA9IHN1cGVyLnRvSlNPTigpO1xuXG4gICAgaWYgKHRoaXMucGVybWlzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZURlc2NyaXB0b3I7XG4iXX0=
