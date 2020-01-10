"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PeripheralIO {
    constructor(Obniz, id) {
        this.Obniz = Obniz;
        this.id = id;
        this._reset();
    }
    _reset() {
        this.value = 0;
        this.observers = [];
    }
    addObserver(callback) {
        if (callback) {
            this.observers.push(callback);
        }
    }
    output(value) {
        value = value === true;
        const obj = {};
        obj["io" + this.id] = value;
        this.value = value;
        this.Obniz.send(obj);
    }
    drive(drive) {
        if (typeof drive !== "string") {
            throw new Error("please specify drive methods in string");
        }
        let output_type = "";
        switch (drive) {
            case "5v":
                output_type = "push-pull5v";
                break;
            case "3v":
                output_type = "push-pull3v";
                break;
            case "open-drain":
                output_type = "open-drain";
                break;
            default:
                throw new Error("unknown drive method");
        }
        const obj = {};
        obj["io" + this.id] = {
            output_type,
        };
        this.Obniz.send(obj);
    }
    pull(updown) {
        if (typeof updown !== "string" && updown !== null) {
            throw new Error("please specify pull methods in string");
        }
        let pull_type = "";
        switch (updown) {
            case "5v":
            case "pull-up5v":
                pull_type = "pull-up5v";
                break;
            case "3v":
            case "pull-up3v":
                pull_type = "pull-up3v";
                break;
            case "0v":
            case "pull-down":
                pull_type = "pull-down";
                break;
            case null:
            case "float":
                pull_type = "float";
                break;
            default:
                throw new Error("unknown pull_type method");
        }
        const obj = {};
        obj["io" + this.id] = {
            pull_type,
        };
        this.Obniz.send(obj);
    }
    input(callback) {
        this.onchange = callback;
        const obj = {};
        obj["io" + this.id] = {
            direction: "input",
            stream: true,
        };
        this.Obniz.send(obj);
        return this.value;
    }
    inputWait() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.addObserver(resolve);
            const obj = {};
            obj["io" + self.id] = {
                direction: "input",
                stream: false,
            };
            self.Obniz.send(obj);
        });
    }
    end() {
        const obj = {};
        obj["io" + this.id] = null;
        this.Obniz.send(obj);
    }
    notified(obj) {
        if (typeof obj === "boolean") {
            this.value = obj;
            const callback = this.observers.shift();
            if (callback) {
                callback(obj);
            }
            if (typeof this.onchange === "function") {
                this.onchange(obj);
            }
        }
        else if (obj && typeof obj === "object") {
            if (obj.warning) {
                this.Obniz.warning({
                    alert: "warning",
                    message: `io${this.id}: ${obj.warning.message}`,
                });
            }
            if (obj.error) {
                this.Obniz.error({
                    alert: "error",
                    message: `io${this.id}: ${obj.error.message}`,
                });
            }
        }
    }
}
exports.default = PeripheralIO;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2lvX3BlcmlwaGVyYWxzL2lvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxZQUFZO0lBT2hCLFlBQVksS0FBVSxFQUFFLEVBQU87UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU07UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxXQUFXLENBQUMsUUFBYTtRQUM5QixJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFVO1FBQ3RCLEtBQUssR0FBRyxLQUFLLEtBQUssSUFBSSxDQUFDO1FBQ3ZCLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztRQUNwQixHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztTQUMzRDtRQUNELElBQUksV0FBVyxHQUFRLEVBQUUsQ0FBQztRQUMxQixRQUFRLEtBQUssRUFBRTtZQUNiLEtBQUssSUFBSTtnQkFDUCxXQUFXLEdBQUcsYUFBYSxDQUFDO2dCQUM1QixNQUFNO1lB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Q0FBQztJQUVNLFFBQVEsQ0FBQyxHQUFRO1FBQ3RCLElBQUksT0FBTyxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLE1BQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDN0MsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7WUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEI7U0FDRjthQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBQ2pCLEtBQUssRUFBRSxTQUFTO29CQUNoQixPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2lCQUNoRCxDQUFDLENBQUM7YUFDSjtZQUNELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDYixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDZixLQUFLLEVBQUUsT0FBTztvQkFDZCxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO2lCQUM5QyxDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2lvX3BlcmlwaGVyYWxzL2lvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUGVyaXBoZXJhbElPIHtcbiAgcHVibGljIE9ibml6OiBhbnk7XG4gIHB1YmxpYyBpZDogYW55O1xuICBwdWJsaWMgdmFsdWU6IGFueTtcbiAgcHVibGljIG9ic2VydmVyczogYW55O1xuICBwdWJsaWMgb25jaGFuZ2U6IGFueTtcblxuICBjb25zdHJ1Y3RvcihPYm5pejogYW55LCBpZDogYW55KSB7XG4gICAgdGhpcy5PYm5peiA9IE9ibml6O1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgcHVibGljIF9yZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gMDtcbiAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xuICB9XG5cbiAgcHVibGljIGFkZE9ic2VydmVyKGNhbGxiYWNrOiBhbnkpIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvdXRwdXQodmFsdWU6IGFueSkge1xuICAgIHZhbHVlID0gdmFsdWUgPT09IHRydWU7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSB7fTtcbiAgICBvYmpbXCJpb1wiICsgdGhpcy5pZF0gPSB2YWx1ZTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBwdWJsaWMgZHJpdmUoZHJpdmU6IGFueSkge1xuICAgIGlmICh0eXBlb2YgZHJpdmUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInBsZWFzZSBzcGVjaWZ5IGRyaXZlIG1ldGhvZHMgaW4gc3RyaW5nXCIpO1xuICAgIH1cbiAgICBsZXQgb3V0cHV0X3R5cGU6IGFueSA9IFwiXCI7XG4gICAgc3dpdGNoIChkcml2ZSkge1xuICAgICAgY2FzZSBcIjV2XCI6XG4gICAgICAgIG91dHB1dF90eXBlID0gXCJwdXNoLXB1bGw1dlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIzdlwiOlxuICAgICAgICBvdXRwdXRfdHlwZSA9IFwicHVzaC1wdWxsM3ZcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwib3Blbi1kcmFpblwiOlxuICAgICAgICBvdXRwdXRfdHlwZSA9IFwib3Blbi1kcmFpblwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gZHJpdmUgbWV0aG9kXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IG9iajogYW55ID0ge307XG4gICAgb2JqW1wiaW9cIiArIHRoaXMuaWRdID0ge1xuICAgICAgb3V0cHV0X3R5cGUsXG4gICAgfTtcbiAgICB0aGlzLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIHB1YmxpYyBwdWxsKHVwZG93bjogYW55KSB7XG4gICAgaWYgKHR5cGVvZiB1cGRvd24gIT09IFwic3RyaW5nXCIgJiYgdXBkb3duICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwbGVhc2Ugc3BlY2lmeSBwdWxsIG1ldGhvZHMgaW4gc3RyaW5nXCIpO1xuICAgIH1cbiAgICBsZXQgcHVsbF90eXBlOiBhbnkgPSBcIlwiO1xuICAgIHN3aXRjaCAodXBkb3duKSB7XG4gICAgICBjYXNlIFwiNXZcIjpcbiAgICAgIGNhc2UgXCJwdWxsLXVwNXZcIjpcbiAgICAgICAgcHVsbF90eXBlID0gXCJwdWxsLXVwNXZcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiM3ZcIjpcbiAgICAgIGNhc2UgXCJwdWxsLXVwM3ZcIjpcbiAgICAgICAgcHVsbF90eXBlID0gXCJwdWxsLXVwM3ZcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiMHZcIjpcbiAgICAgIGNhc2UgXCJwdWxsLWRvd25cIjpcbiAgICAgICAgcHVsbF90eXBlID0gXCJwdWxsLWRvd25cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG51bGw6XG4gICAgICBjYXNlIFwiZmxvYXRcIjpcbiAgICAgICAgcHVsbF90eXBlID0gXCJmbG9hdFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gcHVsbF90eXBlIG1ldGhvZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBvYmo6IGFueSA9IHt9O1xuICAgIG9ialtcImlvXCIgKyB0aGlzLmlkXSA9IHtcbiAgICAgIHB1bGxfdHlwZSxcbiAgICB9O1xuICAgIHRoaXMuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgcHVibGljIGlucHV0KGNhbGxiYWNrOiBhbnkpIHtcbiAgICB0aGlzLm9uY2hhbmdlID0gY2FsbGJhY2s7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSB7fTtcbiAgICBvYmpbXCJpb1wiICsgdGhpcy5pZF0gPSB7XG4gICAgICBkaXJlY3Rpb246IFwiaW5wdXRcIixcbiAgICAgIHN0cmVhbTogdHJ1ZSxcbiAgICB9O1xuICAgIHRoaXMuT2JuaXouc2VuZChvYmopO1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIGlucHV0V2FpdCgpIHtcbiAgICBjb25zdCBzZWxmOiBhbnkgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkgPT4ge1xuICAgICAgc2VsZi5hZGRPYnNlcnZlcihyZXNvbHZlKTtcbiAgICAgIGNvbnN0IG9iajogYW55ID0ge307XG4gICAgICBvYmpbXCJpb1wiICsgc2VsZi5pZF0gPSB7XG4gICAgICAgIGRpcmVjdGlvbjogXCJpbnB1dFwiLFxuICAgICAgICBzdHJlYW06IGZhbHNlLFxuICAgICAgfTtcbiAgICAgIHNlbGYuT2JuaXouc2VuZChvYmopO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGVuZCgpIHtcbiAgICBjb25zdCBvYmo6IGFueSA9IHt9O1xuICAgIG9ialtcImlvXCIgKyB0aGlzLmlkXSA9IG51bGw7XG4gICAgdGhpcy5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBwdWJsaWMgbm90aWZpZWQob2JqOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBvYmo7XG4gICAgICBjb25zdCBjYWxsYmFjazogYW55ID0gdGhpcy5vYnNlcnZlcnMuc2hpZnQoKTtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhvYmopO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uY2hhbmdlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5vbmNoYW5nZShvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGlmIChvYmoud2FybmluZykge1xuICAgICAgICB0aGlzLk9ibml6Lndhcm5pbmcoe1xuICAgICAgICAgIGFsZXJ0OiBcIndhcm5pbmdcIixcbiAgICAgICAgICBtZXNzYWdlOiBgaW8ke3RoaXMuaWR9OiAke29iai53YXJuaW5nLm1lc3NhZ2V9YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAob2JqLmVycm9yKSB7XG4gICAgICAgIHRoaXMuT2JuaXouZXJyb3Ioe1xuICAgICAgICAgIGFsZXJ0OiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogYGlvJHt0aGlzLmlkfTogJHtvYmouZXJyb3IubWVzc2FnZX1gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVyaXBoZXJhbElPO1xuIl19
