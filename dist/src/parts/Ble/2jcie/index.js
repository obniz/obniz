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
Object.defineProperty(exports, "__esModule", { value: true });
class OMRON_2JCIE {
    constructor() {
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "2JCIE",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    findWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const target = {
                localName: "Env",
            };
            this.periperal = yield this.obniz.ble.scan.startOneWait(target);
            return this.periperal;
        });
    }
    omron_uuid(uuid) {
        return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
    }
    connectWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.periperal) {
                yield this.findWait();
            }
            if (!this.periperal) {
                throw new Error("2JCIE not found");
            }
            if (!this.periperal.connected) {
                yield this.periperal.connectWait();
            }
        });
    }
    disconnectWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.periperal && this.periperal.connected) {
                this.periperal.disconnectWait();
            }
        });
    }
    signedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1] & 0x7f;
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        if ((data[data.length - 1] & 0x80) !== 0) {
            val = val - Math.pow(2, data.length * 8 - 1);
        }
        return val;
    }
    unsignedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1];
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        return val;
    }
    getLatestData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectWait();
            const c = this.periperal
                .getService(this.omron_uuid("3000"))
                .getCharacteristic(this.omron_uuid("3001"));
            const data = yield c.readWait();
            const json = {
                row_number: data[0],
                temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
                relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
                light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
                uv_index: this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
                barometric_pressure: this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
                soud_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
                discomfort_index: this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
                heatstroke_risk_factor: this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
                battery_voltage: this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
            };
            return json;
        });
    }
}
exports.default = OMRON_2JCIE;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9CbGUvMmpjaWUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFdBQVc7SUFhZjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQWZNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUM7SUFDSixDQUFDO0lBYU0sS0FBSyxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVZLFFBQVE7O1lBQ25CLE1BQU0sTUFBTSxHQUFRO2dCQUNsQixTQUFTLEVBQUUsS0FBSzthQUNqQixDQUFDO1lBRUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7S0FBQTtJQUVNLFVBQVUsQ0FBQyxJQUFTO1FBQ3pCLE9BQU8sT0FBTyxJQUFJLDZCQUE2QixDQUFDO0lBQ2xELENBQUM7SUFFWSxXQUFXOztZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDdkI7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQ3BDO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2dCQUM3QixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFF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RyxJQUFJO2dCQUNsRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJO2dCQUN4RSxzQkFBc0IsRUFDcEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSTtnQkFDeEQsZUFBZSxFQUNiLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUs7YUFDNUQsQ0FBQztZQUVGLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxXQUFXLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL0JsZS8yamNpZS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE9NUk9OXzJKQ0lFIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiMkpDSUVcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIHJlcXVpcmVkS2V5czogYW55O1xuICBwdWJsaWMgcGVyaXBlcmFsOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW107XG4gICAgdGhpcy5wZXJpcGVyYWwgPSBudWxsO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZmluZFdhaXQoKSB7XG4gICAgY29uc3QgdGFyZ2V0OiBhbnkgPSB7XG4gICAgICBsb2NhbE5hbWU6IFwiRW52XCIsXG4gICAgfTtcblxuICAgIHRoaXMucGVyaXBlcmFsID0gYXdhaXQgdGhpcy5vYm5pei5ibGUuc2Nhbi5zdGFydE9uZVdhaXQodGFyZ2V0KTtcblxuICAgIHJldHVybiB0aGlzLnBlcmlwZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyBvbXJvbl91dWlkKHV1aWQ6IGFueSkge1xuICAgIHJldHVybiBgMEM0QyR7dXVpZH0tNzcwMC00NkY0LUFBOTZENUU5NzRFMzJBNTRgO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNvbm5lY3RXYWl0KCkge1xuICAgIGlmICghdGhpcy5wZXJpcGVyYWwpIHtcbiAgICAgIGF3YWl0IHRoaXMuZmluZFdhaXQoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnBlcmlwZXJhbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiMkpDSUUgbm90IGZvdW5kXCIpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucGVyaXBlcmFsLmNvbm5lY3RlZCkge1xuICAgICAgYXdhaXQgdGhpcy5wZXJpcGVyYWwuY29ubmVjdFdhaXQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGlzY29ubmVjdFdhaXQoKSB7XG4gICAgaWYgKHRoaXMucGVyaXBlcmFsICYmIHRoaXMucGVyaXBlcmFsLmNvbm5lY3RlZCkge1xuICAgICAgdGhpcy5wZXJpcGVyYWwuZGlzY29ubmVjdFdhaXQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2lnbmVkTnVtYmVyRnJvbUJpbmFyeShkYXRhOiBhbnkpIHtcbiAgICAvLyBsaXR0bGUgYWRpYW5cbiAgICBsZXQgdmFsOiBhbnkgPSBkYXRhW2RhdGEubGVuZ3RoIC0gMV0gJiAweDdmO1xuICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YWwgPSB2YWwgKiAyNTYgKyBkYXRhW2ldO1xuICAgIH1cbiAgICBpZiAoKGRhdGFbZGF0YS5sZW5ndGggLSAxXSAmIDB4ODApICE9PSAwKSB7XG4gICAgICB2YWwgPSB2YWwgLSBNYXRoLnBvdygyLCBkYXRhLmxlbmd0aCAqIDggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIHB1YmxpYyB1bnNpZ25lZE51bWJlckZyb21CaW5hcnkoZGF0YTogYW55KSB7XG4gICAgLy8gbGl0dGxlIGFkaWFuXG4gICAgbGV0IHZhbDogYW55ID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSBkYXRhLmxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YWwgPSB2YWwgKiAyNTYgKyBkYXRhW2ldO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldExhdGVzdERhdGEoKSB7XG4gICAgYXdhaXQgdGhpcy5jb25uZWN0V2FpdCgpO1xuXG4gICAgY29uc3QgYzogYW55ID0gdGhpcy5wZXJpcGVyYWxcbiAgICAgIC5nZXRTZXJ2aWNlKHRoaXMub21yb25fdXVpZChcIjMwMDBcIikpXG4gICAgICAuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5vbXJvbl91dWlkKFwiMzAwMVwiKSk7XG4gICAgY29uc3QgZGF0YTogYW55ID0gYXdhaXQgYy5yZWFkV2FpdCgpO1xuICAgIGNvbnN0IGpzb246IGFueSA9IHtcbiAgICAgIHJvd19udW1iZXI6IGRhdGFbMF0sXG4gICAgICB0ZW1wZXJhdHVyZTogdGhpcy5zaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEuc2xpY2UoMSwgMykpICogMC4wMSxcbiAgICAgIHJlbGF0aXZlX2h1bWlkaXR5OiB0aGlzLnNpZ25lZE51bWJlckZyb21CaW5hcnkoZGF0YS5zbGljZSgzLCA1KSkgKiAwLjAxLFxuICAgICAgbGlnaHQ6IHRoaXMuc2lnbmVkTnVtYmVyRnJvbUJpbmFyeShkYXRhLnNsaWNlKDUsIDcpKSAqIDEsXG4gICAgICB1dl9pbmRleDogdGhpcy5zaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEuc2xpY2UoNywgOSkpICogMC4wMSxcbiAgICAgIGJhcm9tZXRyaWNfcHJlc3N1cmU6IHRoaXMuc2lnbmVkTnVtYmVyRnJvbUJpbmFyeShkYXRhLnNsaWNlKDksIDExKSkgKiAwLjEsXG4gICAgICBzb3VkX25vaXNlOiB0aGlzLnNpZ25lZE51bWJlckZyb21CaW5hcnkoZGF0YS5zbGljZSgxMSwgMTMpKSAqIDAuMDEsXG4gICAgICBkaXNjb21mb3J0X2luZGV4OiB0aGlzLnNpZ25lZE51bWJlckZyb21CaW5hcnkoZGF0YS5zbGljZSgxMywgMTUpKSAqIDAuMDEsXG4gICAgICBoZWF0c3Ryb2tlX3Jpc2tfZmFjdG9yOlxuICAgICAgICB0aGlzLnNpZ25lZE51bWJlckZyb21CaW5hcnkoZGF0YS5zbGljZSgxNSwgMTcpKSAqIDAuMDEsXG4gICAgICBiYXR0ZXJ5X3ZvbHRhZ2U6XG4gICAgICAgIHRoaXMudW5zaWduZWROdW1iZXJGcm9tQmluYXJ5KGRhdGEuc2xpY2UoMTcsIDE5KSkgKiAwLjAwMSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGpzb247XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT01ST05fMkpDSUU7XG4iXX0=
