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
const ObnizUIs = require('./ObnizUIs');
const ObnizApi = require('./ObnizApi');
const ObnizUtil = require('./libs/utils/util');
/* global showObnizDebugError  */
const isNode = typeof window === 'undefined';
class Obniz extends ObnizUIs {
    constructor(id, options) {
        super(id, options);
        this.util = new ObnizUtil(this);
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
            if (typeof this.looper === 'function' && this.onConnectCalled) {
                let prom = this.looper();
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
        if (typeof target === 'string') {
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
        if (typeof obj.message === 'object' && this.onmessage) {
            this.onmessage(obj.message.data, obj.message.from);
        }
        // debug
        if (typeof obj.debug === 'object') {
            if (obj.debug.warning) {
                let msg = 'Warning: ' + obj.debug.warning.message;
                this.warning({ alert: 'warning', message: msg });
            }
            if (obj.debug.error) {
                let msg = 'Error: ' + obj.debug.error.message;
                this.error({ alert: 'error', message: msg });
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
            if (msg && typeof msg === 'object' && msg.alert) {
                this.showAlertUI(msg);
                console.log(msg.message);
                return;
            }
            if (typeof showObnizDebugError === 'function') {
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
            if (msg && typeof msg === 'object' && msg.alert) {
                this.showAlertUI(msg);
                msg = msg.message;
            }
            if (typeof showObnizDebugError === 'function') {
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
        return ObnizApi;
    }
}
module.exports = Obniz;
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
        //cross origin iframe
    }
    else {
        console.error(e);
    }
}
/*===================*/
/* ReadParts */
/*===================*/
require.context = require('./libs/webpackReplace/require-context');
if (require.context && require.context.setBaseDir) {
    require.context.setBaseDir(__dirname);
}
let context = require.context('../parts', true, /\.js$/);
/* webpack loader */
for (let path of context.keys()) {
    const anParts = context(path);
    if (anParts.info) {
        Obniz.PartsRegistrate(anParts);
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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R0FBRyxDQUFDLENBQUM7YUFDeEM7UUFDSCxDQUFDO0tBQ0Y7Q0FDRjtBQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ1YsSUFBSSxDQUFDLFlBQVksWUFBWSxFQUFFO1FBQzdCLHFCQUFxQjtLQUN0QjtTQUFNO1FBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjtDQUNGO0FBRUQsdUJBQXVCO0FBQ3ZCLGVBQWU7QUFDZix1QkFBdUI7QUFFdkIsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUNuRSxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7SUFDakQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7Q0FDdkM7QUFFRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekQsb0JBQW9CO0FBQ3BCLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFO0lBQy9CLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7UUFDaEIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNoQztDQUNGIiwiZmlsZSI6Im9ibml6L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgT2JuaXpVSXMgPSByZXF1aXJlKCcuL09ibml6VUlzJyk7XG5jb25zdCBPYm5pekFwaSA9IHJlcXVpcmUoJy4vT2JuaXpBcGknKTtcbmNvbnN0IE9ibml6VXRpbCA9IHJlcXVpcmUoJy4vbGlicy91dGlscy91dGlsJyk7XG5cbi8qIGdsb2JhbCBzaG93T2JuaXpEZWJ1Z0Vycm9yICAqL1xuXG5jb25zdCBpc05vZGUgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJztcblxuY2xhc3MgT2JuaXogZXh0ZW5kcyBPYm5pelVJcyB7XG4gIGNvbnN0cnVjdG9yKGlkLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoaWQsIG9wdGlvbnMpO1xuICAgIHRoaXMudXRpbCA9IG5ldyBPYm5pelV0aWwodGhpcyk7XG4gIH1cblxuICByZXBlYXQoY2FsbGJhY2ssIGludGVydmFsKSB7XG4gICAgaWYgKHRoaXMubG9vcGVyKSB7XG4gICAgICB0aGlzLmxvb3BlciA9IGNhbGxiYWNrO1xuICAgICAgdGhpcy5yZXBlYXRJbnRlcnZhbCA9IGludGVydmFsIHx8IHRoaXMucmVwZWF0SW50ZXJ2YWwgfHwgMTAwO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxvb3BlciA9IGNhbGxiYWNrO1xuICAgIHRoaXMucmVwZWF0SW50ZXJ2YWwgPSBpbnRlcnZhbCB8fCAxMDA7XG5cbiAgICBpZiAodGhpcy5vbkNvbm5lY3RDYWxsZWQpIHtcbiAgICAgIHRoaXMubG9vcCgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvb3AoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmxvb3BlciA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLm9uQ29ubmVjdENhbGxlZCkge1xuICAgICAgbGV0IHByb20gPSB0aGlzLmxvb3BlcigpO1xuICAgICAgaWYgKHByb20gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIGF3YWl0IHByb207XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KHRoaXMubG9vcC5iaW5kKHRoaXMpLCB0aGlzLnJlcGVhdEludGVydmFsIHx8IDEwMCk7XG4gICAgfVxuICB9XG5cbiAgX2NhbGxPbkNvbm5lY3QoKSB7XG4gICAgc3VwZXIuX2NhbGxPbkNvbm5lY3QoKTtcbiAgICB0aGlzLmxvb3AoKTtcbiAgfVxuXG4gIG1lc3NhZ2UodGFyZ2V0LCBtZXNzYWdlKSB7XG4gICAgbGV0IHRhcmdldHMgPSBbXTtcbiAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRhcmdldHMucHVzaCh0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXRzID0gdGFyZ2V0O1xuICAgIH1cbiAgICB0aGlzLnNlbmQoe1xuICAgICAgbWVzc2FnZToge1xuICAgICAgICB0bzogdGFyZ2V0cyxcbiAgICAgICAgZGF0YTogbWVzc2FnZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBub3RpZnlUb01vZHVsZShvYmopIHtcbiAgICBzdXBlci5ub3RpZnlUb01vZHVsZShvYmopO1xuICAgIC8vIG5vdGlmeSBtZXNzYWdpbmdcbiAgICBpZiAodHlwZW9mIG9iai5tZXNzYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLm9ubWVzc2FnZSkge1xuICAgICAgdGhpcy5vbm1lc3NhZ2Uob2JqLm1lc3NhZ2UuZGF0YSwgb2JqLm1lc3NhZ2UuZnJvbSk7XG4gICAgfVxuICAgIC8vIGRlYnVnXG4gICAgaWYgKHR5cGVvZiBvYmouZGVidWcgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAob2JqLmRlYnVnLndhcm5pbmcpIHtcbiAgICAgICAgbGV0IG1zZyA9ICdXYXJuaW5nOiAnICsgb2JqLmRlYnVnLndhcm5pbmcubWVzc2FnZTtcbiAgICAgICAgdGhpcy53YXJuaW5nKHsgYWxlcnQ6ICd3YXJuaW5nJywgbWVzc2FnZTogbXNnIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLmRlYnVnLmVycm9yKSB7XG4gICAgICAgIGxldCBtc2cgPSAnRXJyb3I6ICcgKyBvYmouZGVidWcuZXJyb3IubWVzc2FnZTtcbiAgICAgICAgdGhpcy5lcnJvcih7IGFsZXJ0OiAnZXJyb3InLCBtZXNzYWdlOiBtc2cgfSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vbmRlYnVnKSB7XG4gICAgICAgIHRoaXMub25kZWJ1ZyhvYmouZGVidWcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHdhcm5pbmcobXNnKSB7XG4gICAgaWYgKHRoaXMuaXNOb2RlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtc2cgJiYgdHlwZW9mIG1zZyA9PT0gJ29iamVjdCcgJiYgbXNnLmFsZXJ0KSB7XG4gICAgICAgIHRoaXMuc2hvd0FsZXJ0VUkobXNnKTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnLm1lc3NhZ2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNob3dPYm5pekRlYnVnRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc2hvd09ibml6RGVidWdFcnJvcihuZXcgRXJyb3IobXNnKSk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhgV2FybmluZzogJHttc2d9YCk7XG4gICAgfVxuICB9XG5cbiAgZXJyb3IobXNnKSB7XG4gICAgaWYgKHRoaXMuaXNOb2RlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtc2cgJiYgdHlwZW9mIG1zZyA9PT0gJ29iamVjdCcgJiYgbXNnLmFsZXJ0KSB7XG4gICAgICAgIHRoaXMuc2hvd0FsZXJ0VUkobXNnKTtcbiAgICAgICAgbXNnID0gbXNnLm1lc3NhZ2U7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNob3dPYm5pekRlYnVnRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc2hvd09ibml6RGVidWdFcnJvcihuZXcgRXJyb3IobXNnKSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKG1zZykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYm5pekFwaX1cbiAgICovXG4gIHN0YXRpYyBnZXQgYXBpKCkge1xuICAgIHJldHVybiBPYm5pekFwaTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9ibml6O1xuXG4vKj09PT09PT09PT09PT09PT09PT0qL1xuLyogVXRpbHMgKi9cbi8qPT09PT09PT09PT09PT09PT09PSovXG50cnkge1xuICBpZiAoIWlzTm9kZSkge1xuICAgIGlmICh3aW5kb3cgJiYgd2luZG93LnBhcmVudCAmJiB3aW5kb3cucGFyZW50LnVzZXJBcHBMb2FkZWQpIHtcbiAgICAgIHdpbmRvdy5wYXJlbnQudXNlckFwcExvYWRlZCh3aW5kb3cpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dPYm5pekRlYnVnRXJyb3IoZXJyKSB7Ly9lc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICBpZiAod2luZG93LnBhcmVudCAmJiB3aW5kb3cucGFyZW50LmxvZ2dlcikge1xuICAgICAgICB3aW5kb3cucGFyZW50LmxvZ2dlci5vbk9ibml6RXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0gY2F0Y2ggKGUpIHtcbiAgaWYgKGUgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pIHtcbiAgICAvL2Nyb3NzIG9yaWdpbiBpZnJhbWVcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PSovXG4vKiBSZWFkUGFydHMgKi9cbi8qPT09PT09PT09PT09PT09PT09PSovXG5cbnJlcXVpcmUuY29udGV4dCA9IHJlcXVpcmUoJy4vbGlicy93ZWJwYWNrUmVwbGFjZS9yZXF1aXJlLWNvbnRleHQnKTtcbmlmIChyZXF1aXJlLmNvbnRleHQgJiYgcmVxdWlyZS5jb250ZXh0LnNldEJhc2VEaXIpIHtcbiAgcmVxdWlyZS5jb250ZXh0LnNldEJhc2VEaXIoX19kaXJuYW1lKTtcbn1cblxubGV0IGNvbnRleHQgPSByZXF1aXJlLmNvbnRleHQoJy4uL3BhcnRzJywgdHJ1ZSwgL1xcLmpzJC8pO1xuLyogd2VicGFjayBsb2FkZXIgKi9cbmZvciAobGV0IHBhdGggb2YgY29udGV4dC5rZXlzKCkpIHtcbiAgY29uc3QgYW5QYXJ0cyA9IGNvbnRleHQocGF0aCk7XG4gIGlmIChhblBhcnRzLmluZm8pIHtcbiAgICBPYm5pei5QYXJ0c1JlZ2lzdHJhdGUoYW5QYXJ0cyk7XG4gIH1cbn1cbiJdfQ==
