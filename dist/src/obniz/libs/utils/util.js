"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizUtil {
    constructor(obniz) {
        this.obniz = obniz;
    }
    static _keyFilter(params, keys) {
        let filterdParams = {};
        if (typeof params !== "object") {
            return filterdParams;
        }
        filterdParams = Object.keys(params)
            .filter((key) => keys.includes(key))
            .reduce((obj, key) => {
            obj[key] = params[key];
            return obj;
        }, {});
        return filterdParams;
    }
    /**
     *
     * @return {String} key name of not found.
     */
    static _requiredKeys(params, keys) {
        if (typeof params !== "object") {
            return keys[0];
        }
        for (const index in keys) {
            if (!(keys[index] in params)) {
                return keys[index];
            }
        }
        return null;
    }
    static dataArray2string(data) {
        let string = null;
        try {
            const StringDecoder = require("string_decoder").StringDecoder;
            if (StringDecoder) {
                string = new StringDecoder("utf8").write(Buffer.from(data));
            }
        }
        catch (e) {
            // this.obniz.error(e);
        }
        return string;
    }
    static string2dataArray(str) {
        const buf = Buffer.from(str);
        return [...buf];
    }
    createCanvasContext(width, height) {
        if (this.obniz.isNode) {
            try {
                const { createCanvas } = require("canvas");
                return createCanvas(this.width, this.height);
            }
            catch (e) {
                throw new Error("obniz.js require node-canvas to draw rich contents. see more detail on docs");
            }
        }
        else {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.style["-webkit-font-smoothing"] = "none";
            const body = document.getElementsByTagName("body")[0];
            body.appendChild(canvas);
            const ctx = canvas.getContext("2d");
            return ctx;
        }
    }
}
exports.default = ObnizUtil;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL3V0aWxzL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLFNBQVM7SUF5RGIsWUFBWSxLQUFVO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUF6RE0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFXLEVBQUUsSUFBUztRQUM3QyxJQUFJLGFBQWEsR0FBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDOUIsT0FBTyxhQUFhLENBQUM7U0FDdEI7UUFDRCxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDaEMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DLE1BQU0sQ0FBQyxDQUFDLEdBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVQsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBVyxFQUFFLElBQVM7UUFDaEQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7UUFFRCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksRUFBRTtZQUN4QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLEVBQUU7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BCO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBUztRQUN0QyxJQUFJLE1BQU0sR0FBUSxJQUFJLENBQUM7UUFDdkIsSUFBSTtZQUNGLE1BQU0sYUFBYSxHQUFRLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUNuRSxJQUFJLGFBQWEsRUFBRTtnQkFDakIsTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDN0Q7U0FDRjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsdUJBQXVCO1NBQ3hCO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFRO1FBQ3JDLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQVdNLG1CQUFtQixDQUFDLEtBQVUsRUFBRSxNQUFXO1FBQ2hELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDckIsSUFBSTtnQkFDRixNQUFNLEVBQUMsWUFBWSxFQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM5QztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sSUFBSSxLQUFLLENBQ2IsNkVBQTZFLENBQzlFLENBQUM7YUFDSDtTQUNGO2FBQU07WUFDTCxNQUFNLE1BQU0sR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxLQUFhLENBQUMsd0JBQXdCLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDekQsTUFBTSxJQUFJLEdBQVEsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFekIsTUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsU0FBUyxDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL3V0aWxzL3V0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBPYm5pelV0aWwge1xuXG4gIHB1YmxpYyBzdGF0aWMgX2tleUZpbHRlcihwYXJhbXM6IGFueSwga2V5czogYW55KSB7XG4gICAgbGV0IGZpbHRlcmRQYXJhbXM6IGFueSA9IHt9O1xuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4gZmlsdGVyZFBhcmFtcztcbiAgICB9XG4gICAgZmlsdGVyZFBhcmFtcyA9IE9iamVjdC5rZXlzKHBhcmFtcylcbiAgICAgIC5maWx0ZXIoKGtleSkgPT4ga2V5cy5pbmNsdWRlcyhrZXkpKVxuICAgICAgLnJlZHVjZSgob2JqOiBhbnksIGtleSkgPT4ge1xuICAgICAgICBvYmpba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSwge30pO1xuXG4gICAgcmV0dXJuIGZpbHRlcmRQYXJhbXM7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfSBrZXkgbmFtZSBvZiBub3QgZm91bmQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIF9yZXF1aXJlZEtleXMocGFyYW1zOiBhbnksIGtleXM6IGFueSkge1xuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4ga2V5c1swXTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIGtleXMpIHtcbiAgICAgIGlmICghKGtleXNbaW5kZXhdIGluIHBhcmFtcykpIHtcbiAgICAgICAgcmV0dXJuIGtleXNbaW5kZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZGF0YUFycmF5MnN0cmluZyhkYXRhOiBhbnkpIHtcbiAgICBsZXQgc3RyaW5nOiBhbnkgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBTdHJpbmdEZWNvZGVyOiBhbnkgPSByZXF1aXJlKFwic3RyaW5nX2RlY29kZXJcIikuU3RyaW5nRGVjb2RlcjtcbiAgICAgIGlmIChTdHJpbmdEZWNvZGVyKSB7XG4gICAgICAgIHN0cmluZyA9IG5ldyBTdHJpbmdEZWNvZGVyKFwidXRmOFwiKS53cml0ZShCdWZmZXIuZnJvbShkYXRhKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gdGhpcy5vYm5pei5lcnJvcihlKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nMmRhdGFBcnJheShzdHI6IGFueSkge1xuICAgIGNvbnN0IGJ1ZjogYW55ID0gQnVmZmVyLmZyb20oc3RyKTtcbiAgICByZXR1cm4gWy4uLmJ1Zl07XG4gIH1cblxuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIHdpZHRoOiBhbnk7XG4gIHB1YmxpYyBoZWlnaHQ6IGFueTtcbiAgcHVibGljIGNyZWF0ZUNhbnZhczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlQ2FudmFzQ29udGV4dCh3aWR0aDogYW55LCBoZWlnaHQ6IGFueSkge1xuICAgIGlmICh0aGlzLm9ibml6LmlzTm9kZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qge2NyZWF0ZUNhbnZhc30gPSByZXF1aXJlKFwiY2FudmFzXCIpO1xuICAgICAgICByZXR1cm4gY3JlYXRlQ2FudmFzKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwib2JuaXouanMgcmVxdWlyZSBub2RlLWNhbnZhcyB0byBkcmF3IHJpY2ggY29udGVudHMuIHNlZSBtb3JlIGRldGFpbCBvbiBkb2NzXCIsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNhbnZhczogYW55ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgIChjYW52YXMuc3R5bGUgYXMgYW55KVtcIi13ZWJraXQtZm9udC1zbW9vdGhpbmdcIl0gPSBcIm5vbmVcIjtcbiAgICAgIGNvbnN0IGJvZHk6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgIGJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICAgICAgY29uc3QgY3R4OiBhbnkgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgcmV0dXJuIGN0eDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT2JuaXpVdGlsO1xuIl19
