"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("./libs/utils/util"));
const ObnizConnection_1 = __importDefault(require("./ObnizConnection"));
const _parts = {};
class ObnizParts extends ObnizConnection_1.default {
    static _parts() {
        return _parts;
    }
    static PartsRegistrate(arg0, arg1) {
        if (arg0 &&
            typeof arg0.info === "function" &&
            typeof arg0.info().name === "string") {
            _parts[arg0.info().name] = arg0;
        }
        else if (typeof arg0 === "string" && typeof arg1 === "object") {
            _parts[arg0] = arg1;
        }
    }
    static Parts(name) {
        if (!_parts[name]) {
            throw new Error(`unknown parts [${name}]`);
        }
        return new _parts[name]();
    }
    constructor(id, options) {
        super(id, options);
    }
    isValidIO(io) {
        return typeof io === "number" && this["io" + io] !== null;
    }
    wired(partsname) {
        const parts = ObnizParts.Parts(partsname);
        if (!parts) {
            throw new Error("No such a parts [" + partsname + "] found");
        }
        const args = Array.from(arguments);
        args.shift();
        args.unshift(this);
        if (parts.keys) {
            if (parts.requiredKeys) {
                const err = util_1.default._requiredKeys(args[1], parts.requiredKeys);
                if (err) {
                    throw new Error(partsname + " wired param '" + err + "' required, but not found ");
                }
            }
            parts.params = util_1.default._keyFilter(args[1], parts.keys);
        }
        parts.obniz = this;
        parts.wired.apply(parts, args);
        if (parts.keys || parts.ioKeys) {
            const keys = parts.ioKeys || parts.keys;
            const displayPartsName = parts.displayName || partsname;
            const ioNames = {};
            for (const index in keys) {
                let pinName = keys[index];
                const io = args[1][pinName];
                if (this.isValidIO(io)) {
                    if (parts.displayIoNames && parts.displayIoNames[pinName]) {
                        pinName = parts.displayIoNames[pinName];
                    }
                    ioNames[io] = pinName;
                }
            }
            const display = this.display;
            if (display) {
                display.setPinNames(displayPartsName, ioNames);
            }
        }
        return parts;
    }
}
exports.default = ObnizParts;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9PYm5pelBhcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQTBDO0FBQzFDLHdFQUFnRDtBQUVoRCxNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7QUFFdkIsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO0lBRTlDLE1BQU0sQ0FBQyxNQUFNO1FBQ2xCLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQVMsRUFBRSxJQUFVO1FBQ2pELElBQ0UsSUFBSTtZQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVO1lBQy9CLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQ3BDO1lBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDakM7YUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQVM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxZQUFZLEVBQU8sRUFBRSxPQUFZO1FBQy9CLEtBQUssQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVNLFNBQVMsQ0FBQyxFQUFPO1FBQ3RCLE9BQU8sT0FBTyxFQUFFLEtBQUssUUFBUSxJQUFLLElBQVksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQ3JFLENBQUM7SUFFTSxLQUFLLENBQUMsU0FBYztRQUN6QixNQUFNLEtBQUssR0FBUSxVQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQztTQUM5RDtRQUNELE1BQU0sSUFBSSxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDZCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RCLE1BQU0sR0FBRyxHQUFRLGNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsTUFBTSxJQUFJLEtBQUssQ0FDYixTQUFTLEdBQUcsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLDRCQUE0QixDQUNsRSxDQUFDO2lCQUNIO2FBQ0Y7WUFDRCxLQUFLLENBQUMsTUFBTSxHQUFHLGNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxRDtRQUNELEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUM5QixNQUFNLElBQUksR0FBUSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDN0MsTUFBTSxnQkFBZ0IsR0FBUSxLQUFLLENBQUMsV0FBVyxJQUFJLFNBQVMsQ0FBQztZQUM3RCxNQUFNLE9BQU8sR0FBUSxFQUFFLENBQUM7WUFDeEIsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksT0FBTyxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxFQUFFLEdBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ3RCLElBQUksS0FBSyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUN6RCxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDekM7b0JBQ0QsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztpQkFDdkI7YUFDRjtZQUNELE1BQU0sT0FBTyxHQUFJLElBQVksQ0FBQyxPQUFPLENBQUM7WUFDdEMsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsT0FBTyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNoRDtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUEzRUQsNkJBMkVDIiwiZmlsZSI6InNyYy9vYm5pei9PYm5pelBhcnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9ibml6VXRpbCBmcm9tIFwiLi9saWJzL3V0aWxzL3V0aWxcIjtcbmltcG9ydCBPYm5pekNvbm5lY3Rpb24gZnJvbSBcIi4vT2JuaXpDb25uZWN0aW9uXCI7XG5cbmNvbnN0IF9wYXJ0czogYW55ID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9ibml6UGFydHMgZXh0ZW5kcyBPYm5pekNvbm5lY3Rpb24ge1xuXG4gIHB1YmxpYyBzdGF0aWMgX3BhcnRzKCkge1xuICAgIHJldHVybiBfcGFydHM7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFBhcnRzUmVnaXN0cmF0ZShhcmcwOiBhbnksIGFyZzE/OiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICBhcmcwICYmXG4gICAgICB0eXBlb2YgYXJnMC5pbmZvID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgIHR5cGVvZiBhcmcwLmluZm8oKS5uYW1lID09PSBcInN0cmluZ1wiXG4gICAgKSB7XG4gICAgICBfcGFydHNbYXJnMC5pbmZvKCkubmFtZV0gPSBhcmcwO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZzAgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIF9wYXJ0c1thcmcwXSA9IGFyZzE7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBQYXJ0cyhuYW1lOiBhbnkpIHtcbiAgICBpZiAoIV9wYXJ0c1tuYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duIHBhcnRzIFske25hbWV9XWApO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IF9wYXJ0c1tuYW1lXSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoaWQ6IGFueSwgb3B0aW9uczogYW55KSB7XG4gICAgc3VwZXIoaWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGlzVmFsaWRJTyhpbzogYW55KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpbyA9PT0gXCJudW1iZXJcIiAmJiAodGhpcyBhcyBhbnkpW1wiaW9cIiArIGlvXSAhPT0gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChwYXJ0c25hbWU6IGFueSkge1xuICAgIGNvbnN0IHBhcnRzOiBhbnkgPSBPYm5pelBhcnRzLlBhcnRzKHBhcnRzbmFtZSk7XG4gICAgaWYgKCFwYXJ0cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VjaCBhIHBhcnRzIFtcIiArIHBhcnRzbmFtZSArIFwiXSBmb3VuZFwiKTtcbiAgICB9XG4gICAgY29uc3QgYXJnczogYW55ID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgIGFyZ3Muc2hpZnQoKTtcbiAgICBhcmdzLnVuc2hpZnQodGhpcyk7XG4gICAgaWYgKHBhcnRzLmtleXMpIHtcbiAgICAgIGlmIChwYXJ0cy5yZXF1aXJlZEtleXMpIHtcbiAgICAgICAgY29uc3QgZXJyOiBhbnkgPSBPYm5pelV0aWwuX3JlcXVpcmVkS2V5cyhhcmdzWzFdLCBwYXJ0cy5yZXF1aXJlZEtleXMpO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgcGFydHNuYW1lICsgXCIgd2lyZWQgcGFyYW0gJ1wiICsgZXJyICsgXCInIHJlcXVpcmVkLCBidXQgbm90IGZvdW5kIFwiLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhcnRzLnBhcmFtcyA9IE9ibml6VXRpbC5fa2V5RmlsdGVyKGFyZ3NbMV0sIHBhcnRzLmtleXMpO1xuICAgIH1cbiAgICBwYXJ0cy5vYm5peiA9IHRoaXM7XG4gICAgcGFydHMud2lyZWQuYXBwbHkocGFydHMsIGFyZ3MpO1xuICAgIGlmIChwYXJ0cy5rZXlzIHx8IHBhcnRzLmlvS2V5cykge1xuICAgICAgY29uc3Qga2V5czogYW55ID0gcGFydHMuaW9LZXlzIHx8IHBhcnRzLmtleXM7XG4gICAgICBjb25zdCBkaXNwbGF5UGFydHNOYW1lOiBhbnkgPSBwYXJ0cy5kaXNwbGF5TmFtZSB8fCBwYXJ0c25hbWU7XG4gICAgICBjb25zdCBpb05hbWVzOiBhbnkgPSB7fTtcbiAgICAgIGZvciAoY29uc3QgaW5kZXggaW4ga2V5cykge1xuICAgICAgICBsZXQgcGluTmFtZTogYW55ID0ga2V5c1tpbmRleF07XG4gICAgICAgIGNvbnN0IGlvOiBhbnkgPSBhcmdzWzFdW3Bpbk5hbWVdO1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkSU8oaW8pKSB7XG4gICAgICAgICAgaWYgKHBhcnRzLmRpc3BsYXlJb05hbWVzICYmIHBhcnRzLmRpc3BsYXlJb05hbWVzW3Bpbk5hbWVdKSB7XG4gICAgICAgICAgICBwaW5OYW1lID0gcGFydHMuZGlzcGxheUlvTmFtZXNbcGluTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlvTmFtZXNbaW9dID0gcGluTmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgZGlzcGxheSA9ICh0aGlzIGFzIGFueSkuZGlzcGxheTtcbiAgICAgIGlmIChkaXNwbGF5KSB7XG4gICAgICAgIGRpc3BsYXkuc2V0UGluTmFtZXMoZGlzcGxheVBhcnRzTmFtZSwgaW9OYW1lcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJ0cztcbiAgfVxufVxuIl19
