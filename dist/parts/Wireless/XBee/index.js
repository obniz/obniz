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
class XBee {
    constructor() {
        this.keys = ['tx', 'rx', 'gnd'];
        this.requiredKeys = ['tx', 'rx'];
        this.displayIoNames = { tx: '<tx', rx: '>rx' };
    }
    static info() {
        return {
            name: 'XBee',
        };
    }
    wired(obniz) {
        this.uart = obniz.getFreeUart();
        this.currentCommand = null;
        this.commands = [];
        this.isAtMode = false;
        this.onFinishAtModeCallback = null;
        if (typeof this.params.gnd === 'number') {
            obniz.getIO(this.params.gnd).output(false);
        }
        this.uart.start({
            tx: this.params.tx,
            rx: this.params.rx,
            baud: 9600,
            drive: '3v',
        });
        this.uart.onreceive = function (data, text) {
            if (this.isAtMode) {
                this.onAtResultsRecieve(data, text);
            }
            else {
                if (typeof this.onreceive === 'function') {
                    this.onreceive(data, text);
                }
            }
        }.bind(this);
    }
    send(text) {
        if (this.isAtMode === false) {
            this.uart.send(text);
        }
        else {
            this.obniz.error('XBee is AT Command mode now. Wait for finish config.');
        }
    }
    onAtResultsRecieve(data, text) {
        if (!this.isAtMode) {
            return;
        }
        let next = function () {
            this.currentCommand = null;
            this.sendCommand();
        }.bind(this);
        if (text === 'OK\r') {
            if (this.currentCommand === 'ATCN') {
                this.isAtMode = false;
                this.currentCommand = null;
                if (typeof this.onFinishAtModeCallback === 'function') {
                    this.onFinishAtModeCallback();
                    this.onFinishAtModeCallback = null;
                }
                return;
            }
            next();
        }
        else if (text === 'ERROR\r') {
            this.obniz.error('XBee config error : ' + this.currentCommand);
        }
        else {
            //response of at command.
            console.log('XBEE : no catch message', data);
            next();
        }
    }
    addCommand(command, value) {
        let str = command + (value ? ' ' + value : '');
        this.commands.push(str);
        if (this.isAtMode === true && this.currentCommand === null) {
            this.sendCommand();
        }
    }
    sendCommand() {
        if (this.isAtMode === true &&
            this.currentCommand === null &&
            this.commands.length > 0) {
            this.currentCommand = 'AT' + this.commands.shift();
            this.uart.send(this.currentCommand + '\r');
        }
    }
    enterAtMode() {
        if (this.currentCommand !== null)
            return;
        this.isAtMode = true;
        this.obniz.wait(1000);
        let command = '+++';
        this.currentCommand = command;
        this.uart.send(this.currentCommand);
        this.obniz.wait(1000);
    }
    exitAtMode() {
        this.addCommand('CN');
    }
    configWait(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isAtMode) {
                throw new Error('Xbee : duplicate config setting');
            }
            return new Promise(function (resolve, reject) {
                let standaloneKeys = {
                    destination_address_high: 'DH',
                    destination_address_low: 'DL',
                    source_address: 'MY',
                };
                let highLowKeys = ['destination_address'];
                this.enterAtMode();
                for (let key in config) {
                    if (key.length === 2) {
                        this.addCommand(key, config[key]);
                    }
                    else if (standaloneKeys[key]) {
                        this.addCommand(standaloneKeys[key], config[key]);
                    }
                    else if (highLowKeys.includes(key)) {
                        let high = config[key].slice(0, -8);
                        if (!high) {
                            high = '0';
                        }
                        let low = config[key].slice(-8);
                        this.addCommand(standaloneKeys[key + '_high'], high);
                        this.addCommand(standaloneKeys[key + '_low'], low);
                    }
                }
                this.exitAtMode();
                this.onFinishAtModeCallback = function () {
                    resolve();
                };
            }.bind(this));
        });
    }
}
if (typeof module === 'object') {
    module.exports = XBee;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9XaXJlbGVzcy9YQmVlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLElBQUk7SUFDUjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1FBRW5DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQixFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xCLElBQUksRUFBRSxJQUFJO1lBQ1Ys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QUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNuQzt5QkFBTSxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ25EO3lCQUFNLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDcEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLElBQUksRUFBRTs0QkFDVCxJQUFJLEdBQUcsR0FBRyxDQUFDO3lCQUNaO3dCQUNELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNyRCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ3BEO2lCQUNGO2dCQUNELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHO29CQUM1QixPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNiLENBQUM7UUFDSixDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0NBQ3ZCIiwiZmlsZSI6InBhcnRzL1dpcmVsZXNzL1hCZWUvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBYQmVlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gWyd0eCcsICdyeCcsICdnbmQnXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsndHgnLCAncngnXTtcblxuICAgIHRoaXMuZGlzcGxheUlvTmFtZXMgPSB7IHR4OiAnPHR4Jywgcng6ICc+cngnIH07XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1hCZWUnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMudWFydCA9IG9ibml6LmdldEZyZWVVYXJ0KCk7XG4gICAgdGhpcy5jdXJyZW50Q29tbWFuZCA9IG51bGw7XG4gICAgdGhpcy5jb21tYW5kcyA9IFtdO1xuICAgIHRoaXMuaXNBdE1vZGUgPSBmYWxzZTtcbiAgICB0aGlzLm9uRmluaXNoQXRNb2RlQ2FsbGJhY2sgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhcmFtcy5nbmQgPT09ICdudW1iZXInKSB7XG4gICAgICBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5nbmQpLm91dHB1dChmYWxzZSk7XG4gICAgfVxuXG4gICAgdGhpcy51YXJ0LnN0YXJ0KHtcbiAgICAgIHR4OiB0aGlzLnBhcmFtcy50eCxcbiAgICAgIHJ4OiB0aGlzLnBhcmFtcy5yeCxcbiAgICAgIGJhdWQ6IDk2MDAsXG4gICAgICBkcml2ZTogJzN2JyxcbiAgICB9KTtcblxuICAgIHRoaXMudWFydC5vbnJlY2VpdmUgPSBmdW5jdGlvbihkYXRhLCB0ZXh0KSB7XG4gICAgICBpZiAodGhpcy5pc0F0TW9kZSkge1xuICAgICAgICB0aGlzLm9uQXRSZXN1bHRzUmVjaWV2ZShkYXRhLCB0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbnJlY2VpdmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLm9ucmVjZWl2ZShkYXRhLCB0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHNlbmQodGV4dCkge1xuICAgIGlmICh0aGlzLmlzQXRNb2RlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy51YXJ0LnNlbmQodGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JuaXouZXJyb3IoJ1hCZWUgaXMgQVQgQ29tbWFuZCBtb2RlIG5vdy4gV2FpdCBmb3IgZmluaXNoIGNvbmZpZy4nKTtcbiAgICB9XG4gIH1cblxuICBvbkF0UmVzdWx0c1JlY2lldmUoZGF0YSwgdGV4dCkge1xuICAgIGlmICghdGhpcy5pc0F0TW9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBuZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmN1cnJlbnRDb21tYW5kID0gbnVsbDtcbiAgICAgIHRoaXMuc2VuZENvbW1hbmQoKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBpZiAodGV4dCA9PT0gJ09LXFxyJykge1xuICAgICAgaWYgKHRoaXMuY3VycmVudENvbW1hbmQgPT09ICdBVENOJykge1xuICAgICAgICB0aGlzLmlzQXRNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudENvbW1hbmQgPSBudWxsO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMub25GaW5pc2hBdE1vZGVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMub25GaW5pc2hBdE1vZGVDYWxsYmFjaygpO1xuICAgICAgICAgIHRoaXMub25GaW5pc2hBdE1vZGVDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbmV4dCgpO1xuICAgIH0gZWxzZSBpZiAodGV4dCA9PT0gJ0VSUk9SXFxyJykge1xuICAgICAgdGhpcy5vYm5pei5lcnJvcignWEJlZSBjb25maWcgZXJyb3IgOiAnICsgdGhpcy5jdXJyZW50Q29tbWFuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vcmVzcG9uc2Ugb2YgYXQgY29tbWFuZC5cbiAgICAgIGNvbnNvbGUubG9nKCdYQkVFIDogbm8gY2F0Y2ggbWVzc2FnZScsIGRhdGEpO1xuICAgICAgbmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENvbW1hbmQoY29tbWFuZCwgdmFsdWUpIHtcbiAgICBsZXQgc3RyID0gY29tbWFuZCArICh2YWx1ZSA/ICcgJyArIHZhbHVlIDogJycpO1xuICAgIHRoaXMuY29tbWFuZHMucHVzaChzdHIpO1xuICAgIGlmICh0aGlzLmlzQXRNb2RlID09PSB0cnVlICYmIHRoaXMuY3VycmVudENvbW1hbmQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2VuZENvbW1hbmQoKTtcbiAgICB9XG4gIH1cblxuICBzZW5kQ29tbWFuZCgpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmlzQXRNb2RlID09PSB0cnVlICYmXG4gICAgICB0aGlzLmN1cnJlbnRDb21tYW5kID09PSBudWxsICYmXG4gICAgICB0aGlzLmNvbW1hbmRzLmxlbmd0aCA+IDBcbiAgICApIHtcbiAgICAgIHRoaXMuY3VycmVudENvbW1hbmQgPSAnQVQnICsgdGhpcy5jb21tYW5kcy5zaGlmdCgpO1xuICAgICAgdGhpcy51YXJ0LnNlbmQodGhpcy5jdXJyZW50Q29tbWFuZCArICdcXHInKTtcbiAgICB9XG4gIH1cblxuICBlbnRlckF0TW9kZSgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50Q29tbWFuZCAhPT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMuaXNBdE1vZGUgPSB0cnVlO1xuICAgIHRoaXMub2JuaXoud2FpdCgxMDAwKTtcbiAgICBsZXQgY29tbWFuZCA9ICcrKysnO1xuICAgIHRoaXMuY3VycmVudENvbW1hbmQgPSBjb21tYW5kO1xuICAgIHRoaXMudWFydC5zZW5kKHRoaXMuY3VycmVudENvbW1hbmQpO1xuICAgIHRoaXMub2JuaXoud2FpdCgxMDAwKTtcbiAgfVxuXG4gIGV4aXRBdE1vZGUoKSB7XG4gICAgdGhpcy5hZGRDb21tYW5kKCdDTicpO1xuICB9XG5cbiAgYXN5bmMgY29uZmlnV2FpdChjb25maWcpIHtcbiAgICBpZiAodGhpcy5pc0F0TW9kZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdYYmVlIDogZHVwbGljYXRlIGNvbmZpZyBzZXR0aW5nJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBsZXQgc3RhbmRhbG9uZUtleXMgPSB7XG4gICAgICAgICAgZGVzdGluYXRpb25fYWRkcmVzc19oaWdoOiAnREgnLFxuICAgICAgICAgIGRlc3RpbmF0aW9uX2FkZHJlc3NfbG93OiAnREwnLFxuICAgICAgICAgIHNvdXJjZV9hZGRyZXNzOiAnTVknLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgaGlnaExvd0tleXMgPSBbJ2Rlc3RpbmF0aW9uX2FkZHJlc3MnXTtcbiAgICAgICAgdGhpcy5lbnRlckF0TW9kZSgpO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgaWYgKGtleS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ29tbWFuZChrZXksIGNvbmZpZ1trZXldKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YW5kYWxvbmVLZXlzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ29tbWFuZChzdGFuZGFsb25lS2V5c1trZXldLCBjb25maWdba2V5XSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChoaWdoTG93S2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBsZXQgaGlnaCA9IGNvbmZpZ1trZXldLnNsaWNlKDAsIC04KTtcbiAgICAgICAgICAgIGlmICghaGlnaCkge1xuICAgICAgICAgICAgICBoaWdoID0gJzAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGxvdyA9IGNvbmZpZ1trZXldLnNsaWNlKC04KTtcblxuICAgICAgICAgICAgdGhpcy5hZGRDb21tYW5kKHN0YW5kYWxvbmVLZXlzW2tleSArICdfaGlnaCddLCBoaWdoKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ29tbWFuZChzdGFuZGFsb25lS2V5c1trZXkgKyAnX2xvdyddLCBsb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV4aXRBdE1vZGUoKTtcbiAgICAgICAgdGhpcy5vbkZpbmlzaEF0TW9kZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBYQmVlO1xufVxuIl19
