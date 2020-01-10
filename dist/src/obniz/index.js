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
const util_1 = __importDefault(require("./libs/utils/util"));
const ObnizApi_1 = __importDefault(require("./ObnizApi"));
const ObnizUIs_1 = __importDefault(require("./ObnizUIs"));
const isNode = typeof window === "undefined";
class Obniz extends ObnizUIs_1.default {
    constructor(id, options) {
        super(id, options);
        this.util = new util_1.default(this);
    }
    repeat(callback, interval) {
        if (this.looper) {
            this.looper = callback;
            this.repeatInterval = interval || this.repeatInterval || 100;
            return;
        }
        this.looper = callback;
        this.repeatInterval = interval || 100;
        if (this.onConnectCalled) {
            this.loop();
        }
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.looper === "function" && this.onConnectCalled) {
                const prom = this.looper();
                if (prom instanceof Promise) {
                    yield prom;
                }
                setTimeout(this.loop.bind(this), this.repeatInterval || 100);
            }
        });
    }
    _callOnConnect() {
        super._callOnConnect();
        this.loop();
    }
    message(target, message) {
        let targets = [];
        if (typeof target === "string") {
            targets.push(target);
        }
        else {
            targets = target;
        }
        this.send({
            message: {
                to: targets,
                data: message,
            },
        });
    }
    notifyToModule(obj) {
        super.notifyToModule(obj);
        // notify messaging
        if (typeof obj.message === "object" && this.onmessage) {
            this.onmessage(obj.message.data, obj.message.from);
        }
        // debug
        if (typeof obj.debug === "object") {
            if (obj.debug.warning) {
                const msg = "Warning: " + obj.debug.warning.message;
                this.warning({ alert: "warning", message: msg });
            }
            if (obj.debug.error) {
                const msg = "Error: " + obj.debug.error.message;
                this.error({ alert: "error", message: msg });
            }
            if (this.ondebug) {
                this.ondebug(obj.debug);
            }
        }
    }
    warning(msg) {
        if (this.isNode) {
            console.error(msg);
        }
        else {
            if (msg && typeof msg === "object" && msg.alert) {
                this.showAlertUI(msg);
                console.log(msg.message);
                return;
            }
            if (typeof showObnizDebugError === "function") {
                showObnizDebugError(new Error(msg));
            }
            console.log(`Warning: ${msg}`);
        }
    }
    error(msg) {
        if (this.isNode) {
            console.error(msg);
        }
        else {
            if (msg && typeof msg === "object" && msg.alert) {
                this.showAlertUI(msg);
                msg = msg.message;
            }
            if (typeof showObnizDebugError === "function") {
                showObnizDebugError(new Error(msg));
                console.error(new Error(msg));
            }
            else {
                throw new Error(msg);
            }
        }
    }
    /**
     *
     * @returns {ObnizApi}
     */
    static get api() {
        return ObnizApi_1.default;
    }
}
exports.default = Obniz;
/*===================*/
/* Utils */
/*===================*/
try {
    if (!isNode) {
        if (window && window.parent && window.parent.userAppLoaded) {
            window.parent.userAppLoaded(window);
        }
        function showObnizDebugError(err) {
            if (window.parent && window.parent.logger) {
                window.parent.logger.onObnizError(err);
            }
        }
    }
}
catch (e) {
    if (e instanceof DOMException) {
        // cross origin iframe
    }
    else {
        console.error(e);
    }
}
/*===================*/
/* ReadParts */
/*===================*/
require.context = require("./libs/webpackReplace/require-context");
if (require.context && require.context.setBaseDir) {
    require.context.setBaseDir(__dirname);
}
const context = require.context("../parts", true, /\.js$/);
/* webpack loader */
for (const path of context.keys()) {
    const anParts = context(path);
    if (anParts.info) {
        Obniz.PartsRegistrate(anParts);
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7Q0FDRjtBQUVELHVCQUF1QjtBQUN2QixlQUFlO0FBQ2YsdUJBQXVCO0FBRXZCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7QUFDbkUsSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFLLE9BQU8sQ0FBQyxPQUFlLENBQUMsVUFBVSxFQUFFO0lBQ3pELE9BQU8sQ0FBQyxPQUFlLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0NBQ2hEO0FBRUQsTUFBTSxPQUFPLEdBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hFLG9CQUFvQjtBQUNwQixLQUFLLE1BQU0sSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtJQUNqQyxNQUFNLE9BQU8sR0FBUSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2hCLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDaEM7Q0FDRiIsImZpbGUiOiJzcmMvb2JuaXovaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT2JuaXpVdGlsIGZyb20gXCIuL2xpYnMvdXRpbHMvdXRpbFwiO1xuaW1wb3J0IE9ibml6QXBpIGZyb20gXCIuL09ibml6QXBpXCI7XG5pbXBvcnQgT2JuaXpVSXMgZnJvbSBcIi4vT2JuaXpVSXNcIjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICB2YXIgc2hvd09ibml6RGVidWdFcnJvcjogYW55O1xuICB2YXIgTW96V2ViU29ja2V0OiBhbnk7XG5cbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgdXNlckFwcExvYWRlZD86IGFueTtcbiAgICBsb2dnZXI/OiBhbnk7XG4gICAgV2ViU29ja2V0OiBhbnk7XG4gICAgTW96V2ViU29ja2V0OiBhbnk7XG4gIH1cbn1cblxuY29uc3QgaXNOb2RlOiBhbnkgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiO1xuXG5jbGFzcyBPYm5peiBleHRlbmRzIE9ibml6VUlzIHtcbiAgcHVibGljIHV0aWw6IGFueTtcbiAgcHVibGljIGxvb3BlcjogYW55O1xuICBwdWJsaWMgcmVwZWF0SW50ZXJ2YWw6IGFueTtcbiAgcHVibGljIG9uQ29ubmVjdENhbGxlZDogYW55O1xuICBwdWJsaWMgc2VuZDogYW55O1xuICBwdWJsaWMgb25tZXNzYWdlOiBhbnk7XG4gIHB1YmxpYyBvbmRlYnVnOiBhbnk7XG4gIHB1YmxpYyBpc05vZGU6IGFueTtcbiAgcHVibGljIHNob3dBbGVydFVJOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoaWQ6IGFueSwgb3B0aW9uczogYW55KSB7XG4gICAgc3VwZXIoaWQsIG9wdGlvbnMpO1xuICAgIHRoaXMudXRpbCA9IG5ldyBPYm5pelV0aWwodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcmVwZWF0KGNhbGxiYWNrOiBhbnksIGludGVydmFsOiBhbnkpIHtcbiAgICBpZiAodGhpcy5sb29wZXIpIHtcbiAgICAgIHRoaXMubG9vcGVyID0gY2FsbGJhY2s7XG4gICAgICB0aGlzLnJlcGVhdEludGVydmFsID0gaW50ZXJ2YWwgfHwgdGhpcy5yZXBlYXRJbnRlcnZhbCB8fCAxMDA7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubG9vcGVyID0gY2FsbGJhY2s7XG4gICAgdGhpcy5yZXBlYXRJbnRlcnZhbCA9IGludGVydmFsIHx8IDEwMDtcblxuICAgIGlmICh0aGlzLm9uQ29ubmVjdENhbGxlZCkge1xuICAgICAgdGhpcy5sb29wKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGxvb3AoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmxvb3BlciA9PT0gXCJmdW5jdGlvblwiICYmIHRoaXMub25Db25uZWN0Q2FsbGVkKSB7XG4gICAgICBjb25zdCBwcm9tOiBhbnkgPSB0aGlzLmxvb3BlcigpO1xuICAgICAgaWYgKHByb20gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIGF3YWl0IHByb207XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KHRoaXMubG9vcC5iaW5kKHRoaXMpLCB0aGlzLnJlcGVhdEludGVydmFsIHx8IDEwMCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9jYWxsT25Db25uZWN0KCkge1xuICAgIHN1cGVyLl9jYWxsT25Db25uZWN0KCk7XG4gICAgdGhpcy5sb29wKCk7XG4gIH1cblxuICBwdWJsaWMgbWVzc2FnZSh0YXJnZXQ6IGFueSwgbWVzc2FnZTogYW55KSB7XG4gICAgbGV0IHRhcmdldHM6IGFueSA9IFtdO1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB0YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0cyA9IHRhcmdldDtcbiAgICB9XG4gICAgdGhpcy5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgdG86IHRhcmdldHMsXG4gICAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeVRvTW9kdWxlKG9iajogYW55KSB7XG4gICAgc3VwZXIubm90aWZ5VG9Nb2R1bGUob2JqKTtcbiAgICAvLyBub3RpZnkgbWVzc2FnaW5nXG4gICAgaWYgKHR5cGVvZiBvYmoubWVzc2FnZSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzLm9ubWVzc2FnZSkge1xuICAgICAgdGhpcy5vbm1lc3NhZ2Uob2JqLm1lc3NhZ2UuZGF0YSwgb2JqLm1lc3NhZ2UuZnJvbSk7XG4gICAgfVxuICAgIC8vIGRlYnVnXG4gICAgaWYgKHR5cGVvZiBvYmouZGVidWcgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGlmIChvYmouZGVidWcud2FybmluZykge1xuICAgICAgICBjb25zdCBtc2c6IGFueSA9IFwiV2FybmluZzogXCIgKyBvYmouZGVidWcud2FybmluZy5tZXNzYWdlO1xuICAgICAgICB0aGlzLndhcm5pbmcoe2FsZXJ0OiBcIndhcm5pbmdcIiwgbWVzc2FnZTogbXNnfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmouZGVidWcuZXJyb3IpIHtcbiAgICAgICAgY29uc3QgbXNnOiBhbnkgPSBcIkVycm9yOiBcIiArIG9iai5kZWJ1Zy5lcnJvci5tZXNzYWdlO1xuICAgICAgICB0aGlzLmVycm9yKHthbGVydDogXCJlcnJvclwiLCBtZXNzYWdlOiBtc2d9KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uZGVidWcpIHtcbiAgICAgICAgdGhpcy5vbmRlYnVnKG9iai5kZWJ1Zyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHdhcm5pbmcobXNnOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pc05vZGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1zZyAmJiB0eXBlb2YgbXNnID09PSBcIm9iamVjdFwiICYmIG1zZy5hbGVydCkge1xuICAgICAgICB0aGlzLnNob3dBbGVydFVJKG1zZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZy5tZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBzaG93T2JuaXpEZWJ1Z0Vycm9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgc2hvd09ibml6RGVidWdFcnJvcihuZXcgRXJyb3IobXNnKSk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhgV2FybmluZzogJHttc2d9YCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGVycm9yKG1zZzogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNOb2RlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtc2cgJiYgdHlwZW9mIG1zZyA9PT0gXCJvYmplY3RcIiAmJiBtc2cuYWxlcnQpIHtcbiAgICAgICAgdGhpcy5zaG93QWxlcnRVSShtc2cpO1xuICAgICAgICBtc2cgPSBtc2cubWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygc2hvd09ibml6RGVidWdFcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHNob3dPYm5pekRlYnVnRXJyb3IobmV3IEVycm9yKG1zZykpO1xuICAgICAgICBjb25zb2xlLmVycm9yKG5ldyBFcnJvcihtc2cpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JuaXpBcGl9XG4gICAqL1xuICBzdGF0aWMgZ2V0IGFwaSgpIHtcbiAgICByZXR1cm4gT2JuaXpBcGk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT2JuaXo7XG5cbi8qPT09PT09PT09PT09PT09PT09PSovXG4vKiBVdGlscyAqL1xuLyo9PT09PT09PT09PT09PT09PT09Ki9cbnRyeSB7XG4gIGlmICghaXNOb2RlKSB7XG4gICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cucGFyZW50ICYmIHdpbmRvdy5wYXJlbnQudXNlckFwcExvYWRlZCkge1xuICAgICAgd2luZG93LnBhcmVudC51c2VyQXBwTG9hZGVkKHdpbmRvdyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd09ibml6RGVidWdFcnJvcihlcnI6IGFueSkgey8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIGlmICh3aW5kb3cucGFyZW50ICYmIHdpbmRvdy5wYXJlbnQubG9nZ2VyKSB7XG4gICAgICAgIHdpbmRvdy5wYXJlbnQubG9nZ2VyLm9uT2JuaXpFcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSBjYXRjaCAoZSkge1xuICBpZiAoZSBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbikge1xuICAgIC8vIGNyb3NzIG9yaWdpbiBpZnJhbWVcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PSovXG4vKiBSZWFkUGFydHMgKi9cbi8qPT09PT09PT09PT09PT09PT09PSovXG5cbnJlcXVpcmUuY29udGV4dCA9IHJlcXVpcmUoXCIuL2xpYnMvd2VicGFja1JlcGxhY2UvcmVxdWlyZS1jb250ZXh0XCIpO1xuaWYgKHJlcXVpcmUuY29udGV4dCAmJiAocmVxdWlyZS5jb250ZXh0IGFzIGFueSkuc2V0QmFzZURpcikge1xuICAocmVxdWlyZS5jb250ZXh0IGFzIGFueSkuc2V0QmFzZURpcihfX2Rpcm5hbWUpO1xufVxuXG5jb25zdCBjb250ZXh0OiBhbnkgPSByZXF1aXJlLmNvbnRleHQoXCIuLi9wYXJ0c1wiLCB0cnVlLCAvXFwuanMkLyk7XG4vKiB3ZWJwYWNrIGxvYWRlciAqL1xuZm9yIChjb25zdCBwYXRoIG9mIGNvbnRleHQua2V5cygpKSB7XG4gIGNvbnN0IGFuUGFydHM6IGFueSA9IGNvbnRleHQocGF0aCk7XG4gIGlmIChhblBhcnRzLmluZm8pIHtcbiAgICBPYm5pei5QYXJ0c1JlZ2lzdHJhdGUoYW5QYXJ0cyk7XG4gIH1cbn1cbiJdfQ==
