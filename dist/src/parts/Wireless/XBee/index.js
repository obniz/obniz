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
class XBee {
    constructor() {
        this.keys = ["tx", "rx", "gnd"];
        this.requiredKeys = ["tx", "rx"];
        this.displayIoNames = { tx: "<tx", rx: ">rx" };
    }
    static info() {
        return {
            name: "XBee",
        };
    }
    wired(obniz) {
        this.uart = obniz.getFreeUart();
        this.currentCommand = null;
        this.commands = [];
        this.isAtMode = false;
        this.onFinishAtModeCallback = null;
        if (typeof this.params.gnd === "number") {
            obniz.getIO(this.params.gnd).output(false);
        }
        this.uart.start({
            tx: this.params.tx,
            rx: this.params.rx,
            baud: 9600,
            drive: "3v",
        });
        this.uart.onreceive = (data, text) => {
            if (this.isAtMode) {
                this.onAtResultsRecieve(data, text);
            }
            else {
                if (typeof this.onreceive === "function") {
                    this.onreceive(data, text);
                }
            }
        };
    }
    send(text) {
        if (this.isAtMode === false) {
            this.uart.send(text);
        }
        else {
            this.obniz.error("XBee is AT Command mode now. Wait for finish config.");
        }
    }
    onAtResultsRecieve(data, text) {
        if (!this.isAtMode) {
            return;
        }
        const next = () => {
            this.currentCommand = null;
            this.sendCommand();
        };
        if (text === "OK\r") {
            if (this.currentCommand === "ATCN") {
                this.isAtMode = false;
                this.currentCommand = null;
                if (typeof this.onFinishAtModeCallback === "function") {
                    this.onFinishAtModeCallback();
                    this.onFinishAtModeCallback = null;
                }
                return;
            }
            next();
        }
        else if (text === "ERROR\r") {
            this.obniz.error("XBee config error : " + this.currentCommand);
        }
        else {
            // response of at command.
            console.log("XBEE : no catch message", data);
            next();
        }
    }
    addCommand(command, value) {
        const str = command + (value ? " " + value : "");
        this.commands.push(str);
        if (this.isAtMode === true && this.currentCommand === null) {
            this.sendCommand();
        }
    }
    sendCommand() {
        if (this.isAtMode === true &&
            this.currentCommand === null &&
            this.commands.length > 0) {
            this.currentCommand = "AT" + this.commands.shift();
            this.uart.send(this.currentCommand + "\r");
        }
    }
    enterAtMode() {
        if (this.currentCommand !== null) {
            return;
        }
        this.isAtMode = true;
        this.obniz.wait(1000);
        const command = "+++";
        this.currentCommand = command;
        this.uart.send(this.currentCommand);
        this.obniz.wait(1000);
    }
    exitAtMode() {
        this.addCommand("CN");
    }
    configWait(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isAtMode) {
                throw new Error("Xbee : duplicate config setting");
            }
            return new Promise((resolve, reject) => {
                const standaloneKeys = {
                    destination_address_high: "DH",
                    destination_address_low: "DL",
                    source_address: "MY",
                };
                const highLowKeys = ["destination_address"];
                this.enterAtMode();
                for (const key in config) {
                    if (key.length === 2) {
                        this.addCommand(key, config[key]);
                    }
                    else if (standaloneKeys[key]) {
                        this.addCommand(standaloneKeys[key], config[key]);
                    }
                    else if (highLowKeys.includes(key)) {
                        let high = config[key].slice(0, -8);
                        if (!high) {
                            high = "0";
                        }
                        const low = config[key].slice(-8);
                        this.addCommand(standaloneKeys[key + "_high"], high);
                        this.addCommand(standaloneKeys[key + "_low"], low);
                    }
                }
                this.exitAtMode();
                this.onFinishAtModeCallback = () => {
                    resolve();
                };
            });
        });
    }
}
exports.default = XBee;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9XaXJlbGVzcy9YQmVlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxJQUFJO0lBb0JSO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFDLENBQUM7SUFDL0MsQ0FBQztJQXZCTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDO0lBQ0osQ0FBQztJQXFCTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1FBRW5DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQixFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xCLElBQUksRUFBRSxJQUFJ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QUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNuQzt5QkFBTSxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ25EO3lCQUFNLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDcEMsSUFBSSxJQUFJLEdBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekMsSUFBSSxDQUFDLElBQUksRUFBRTs0QkFDVCxJQUFJLEdBQUcsR0FBRyxDQUFDO3lCQUNaO3dCQUNELE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNyRCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ3BEO2lCQUNGO2dCQUNELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEdBQUcsRUFBRTtvQkFDakMsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvV2lyZWxlc3MvWEJlZS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFhCZWUge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJYQmVlXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZEtleXM6IGFueTtcbiAgcHVibGljIGRpc3BsYXlJb05hbWVzOiBhbnk7XG4gIHB1YmxpYyB1YXJ0OiBhbnk7XG4gIHB1YmxpYyBjdXJyZW50Q29tbWFuZDogYW55O1xuICBwdWJsaWMgY29tbWFuZHM6IGFueTtcbiAgcHVibGljIGlzQXRNb2RlOiBhbnk7XG4gIHB1YmxpYyBvbkZpbmlzaEF0TW9kZUNhbGxiYWNrOiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIG9ucmVjZWl2ZTogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJ0eFwiLCBcInJ4XCIsIFwiZ25kXCJdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW1widHhcIiwgXCJyeFwiXTtcblxuICAgIHRoaXMuZGlzcGxheUlvTmFtZXMgPSB7dHg6IFwiPHR4XCIsIHJ4OiBcIj5yeFwifTtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy51YXJ0ID0gb2JuaXouZ2V0RnJlZVVhcnQoKTtcbiAgICB0aGlzLmN1cnJlbnRDb21tYW5kID0gbnVsbDtcbiAgICB0aGlzLmNvbW1hbmRzID0gW107XG4gICAgdGhpcy5pc0F0TW9kZSA9IGZhbHNlO1xuICAgIHRoaXMub25GaW5pc2hBdE1vZGVDYWxsYmFjayA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMucGFyYW1zLmduZCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuZ25kKS5vdXRwdXQoZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMudWFydC5zdGFydCh7XG4gICAgICB0eDogdGhpcy5wYXJhbXMudHgsXG4gICAgICByeDogdGhpcy5wYXJhbXMucngsXG4gICAgICBiYXVkOiA5NjAwLFxuICAgICAgZHJpdmU6IFwiM3ZcIixcbiAgICB9KTtcblxuICAgIHRoaXMudWFydC5vbnJlY2VpdmUgPSAoZGF0YTogYW55LCB0ZXh0OiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzQXRNb2RlKSB7XG4gICAgICAgIHRoaXMub25BdFJlc3VsdHNSZWNpZXZlKGRhdGEsIHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9ucmVjZWl2ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgdGhpcy5vbnJlY2VpdmUoZGF0YSwgdGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHNlbmQodGV4dDogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNBdE1vZGUgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLnVhcnQuc2VuZCh0ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYm5pei5lcnJvcihcIlhCZWUgaXMgQVQgQ29tbWFuZCBtb2RlIG5vdy4gV2FpdCBmb3IgZmluaXNoIGNvbmZpZy5cIik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQXRSZXN1bHRzUmVjaWV2ZShkYXRhOiBhbnksIHRleHQ6IGFueSkge1xuICAgIGlmICghdGhpcy5pc0F0TW9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHQ6IGFueSA9ICgpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudENvbW1hbmQgPSBudWxsO1xuICAgICAgdGhpcy5zZW5kQ29tbWFuZCgpO1xuICAgIH07XG5cbiAgICBpZiAodGV4dCA9PT0gXCJPS1xcclwiKSB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50Q29tbWFuZCA9PT0gXCJBVENOXCIpIHtcbiAgICAgICAgdGhpcy5pc0F0TW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRDb21tYW5kID0gbnVsbDtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uRmluaXNoQXRNb2RlQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHRoaXMub25GaW5pc2hBdE1vZGVDYWxsYmFjaygpO1xuICAgICAgICAgIHRoaXMub25GaW5pc2hBdE1vZGVDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbmV4dCgpO1xuICAgIH0gZWxzZSBpZiAodGV4dCA9PT0gXCJFUlJPUlxcclwiKSB7XG4gICAgICB0aGlzLm9ibml6LmVycm9yKFwiWEJlZSBjb25maWcgZXJyb3IgOiBcIiArIHRoaXMuY3VycmVudENvbW1hbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZXNwb25zZSBvZiBhdCBjb21tYW5kLlxuICAgICAgY29uc29sZS5sb2coXCJYQkVFIDogbm8gY2F0Y2ggbWVzc2FnZVwiLCBkYXRhKTtcbiAgICAgIG5leHQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkQ29tbWFuZChjb21tYW5kOiBhbnksIHZhbHVlPzogYW55KSB7XG4gICAgY29uc3Qgc3RyOiBhbnkgPSBjb21tYW5kICsgKHZhbHVlID8gXCIgXCIgKyB2YWx1ZSA6IFwiXCIpO1xuICAgIHRoaXMuY29tbWFuZHMucHVzaChzdHIpO1xuICAgIGlmICh0aGlzLmlzQXRNb2RlID09PSB0cnVlICYmIHRoaXMuY3VycmVudENvbW1hbmQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2VuZENvbW1hbmQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VuZENvbW1hbmQoKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5pc0F0TW9kZSA9PT0gdHJ1ZSAmJlxuICAgICAgdGhpcy5jdXJyZW50Q29tbWFuZCA9PT0gbnVsbCAmJlxuICAgICAgdGhpcy5jb21tYW5kcy5sZW5ndGggPiAwXG4gICAgKSB7XG4gICAgICB0aGlzLmN1cnJlbnRDb21tYW5kID0gXCJBVFwiICsgdGhpcy5jb21tYW5kcy5zaGlmdCgpO1xuICAgICAgdGhpcy51YXJ0LnNlbmQodGhpcy5jdXJyZW50Q29tbWFuZCArIFwiXFxyXCIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBlbnRlckF0TW9kZSgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50Q29tbWFuZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmlzQXRNb2RlID0gdHJ1ZTtcbiAgICB0aGlzLm9ibml6LndhaXQoMTAwMCk7XG4gICAgY29uc3QgY29tbWFuZDogYW55ID0gXCIrKytcIjtcbiAgICB0aGlzLmN1cnJlbnRDb21tYW5kID0gY29tbWFuZDtcbiAgICB0aGlzLnVhcnQuc2VuZCh0aGlzLmN1cnJlbnRDb21tYW5kKTtcbiAgICB0aGlzLm9ibml6LndhaXQoMTAwMCk7XG4gIH1cblxuICBwdWJsaWMgZXhpdEF0TW9kZSgpIHtcbiAgICB0aGlzLmFkZENvbW1hbmQoXCJDTlwiKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjb25maWdXYWl0KGNvbmZpZzogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNBdE1vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlhiZWUgOiBkdXBsaWNhdGUgY29uZmlnIHNldHRpbmdcIik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhbmRhbG9uZUtleXM6IGFueSA9IHtcbiAgICAgICAgICBkZXN0aW5hdGlvbl9hZGRyZXNzX2hpZ2g6IFwiREhcIixcbiAgICAgICAgICBkZXN0aW5hdGlvbl9hZGRyZXNzX2xvdzogXCJETFwiLFxuICAgICAgICAgIHNvdXJjZV9hZGRyZXNzOiBcIk1ZXCIsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGhpZ2hMb3dLZXlzOiBhbnkgPSBbXCJkZXN0aW5hdGlvbl9hZGRyZXNzXCJdO1xuICAgICAgICB0aGlzLmVudGVyQXRNb2RlKCk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xuICAgICAgICAgIGlmIChrZXkubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENvbW1hbmQoa2V5LCBjb25maWdba2V5XSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGFuZGFsb25lS2V5c1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENvbW1hbmQoc3RhbmRhbG9uZUtleXNba2V5XSwgY29uZmlnW2tleV0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGlnaExvd0tleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgbGV0IGhpZ2g6IGFueSA9IGNvbmZpZ1trZXldLnNsaWNlKDAsIC04KTtcbiAgICAgICAgICAgIGlmICghaGlnaCkge1xuICAgICAgICAgICAgICBoaWdoID0gXCIwXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsb3c6IGFueSA9IGNvbmZpZ1trZXldLnNsaWNlKC04KTtcblxuICAgICAgICAgICAgdGhpcy5hZGRDb21tYW5kKHN0YW5kYWxvbmVLZXlzW2tleSArIFwiX2hpZ2hcIl0sIGhpZ2gpO1xuICAgICAgICAgICAgdGhpcy5hZGRDb21tYW5kKHN0YW5kYWxvbmVLZXlzW2tleSArIFwiX2xvd1wiXSwgbG93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5leGl0QXRNb2RlKCk7XG4gICAgICAgIHRoaXMub25GaW5pc2hBdE1vZGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgWEJlZTtcbiJdfQ==
