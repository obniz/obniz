"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const ble_1 = __importDefault(require("./libs/embeds/ble/ble"));
const ble_2 = __importDefault(require("./libs/embeds/bleHci/ble"));
const display_1 = __importDefault(require("./libs/embeds/display"));
const switch_1 = __importDefault(require("./libs/embeds/switch"));
const ad_1 = __importDefault(require("./libs/io_peripherals/ad"));
const directive_1 = __importDefault(require("./libs/io_peripherals/directive"));
const i2c_1 = __importDefault(require("./libs/io_peripherals/i2c"));
const io_1 = __importDefault(require("./libs/io_peripherals/io"));
const pwm_1 = __importDefault(require("./libs/io_peripherals/pwm"));
const spi_1 = __importDefault(require("./libs/io_peripherals/spi"));
const uart_1 = __importDefault(require("./libs/io_peripherals/uart"));
const logicanalyzer_1 = __importDefault(require("./libs/measurements/logicanalyzer"));
const measure_1 = __importDefault(require("./libs/measurements/measure"));
const tcp_1 = __importDefault(require("./libs/protocol/tcp"));
const ObnizParts_1 = __importDefault(require("./ObnizParts"));
const hw_1 = __importDefault(require("./libs/hw"));
class ObnizComponents extends ObnizParts_1.default {
    constructor(id, options) {
        super(id, options);
        this.pongObservers = [];
        this._allComponentKeys = [];
    }
    close() {
        super.close();
        if (this.options.reset_obniz_on_ws_disconnection) {
            this._resetComponents();
        }
    }
    _callOnConnect() {
        this._prepareComponents();
        super._callOnConnect();
    }
    _prepareComponents() {
        if (this._allComponentKeys.length !== 0) {
            return;
        }
        const hwDefinition = hw_1.default.getDefinitionFor(this.hw);
        if (!hwDefinition) {
            throw new Error(`unkown hw ${this.hw}`);
        }
        const hw_peripherals = hwDefinition.peripherals;
        const hw_embeds = hwDefinition.embeds;
        const hw_protocol = hwDefinition.protocol;
        const shared_map = {
            io: directive_1.default,
            logicAnalyzer: logicanalyzer_1.default,
            measure: measure_1.default,
        };
        const peripheral_map = {
            io: io_1.default,
            ad: ad_1.default,
            uart: uart_1.default,
            spi: spi_1.default,
            i2c: i2c_1.default,
            pwm: pwm_1.default,
        };
        let ble = ble_2.default;
        // < 3.0.0-beta
        if (semver.lt(this.firmware_ver, "3.0.0-beta")) {
            ble = ble_1.default;
        }
        const embeds_map = {
            display: display_1.default,
            switch: switch_1.default,
            ble,
        };
        const protocol_map = {
            tcp: tcp_1.default,
        };
        for (const key in shared_map) {
            const Class = shared_map[key];
            this[key] = new Class(this);
            this._allComponentKeys.push(key);
        }
        if (hw_peripherals) {
            for (const key in peripheral_map) {
                if (hw_peripherals[key]) {
                    const units = hw_peripherals[key].units;
                    const Class = peripheral_map[key];
                    for (const unitId in units) {
                        const unitIdNumber = parseInt(unitId);
                        this[key + unitIdNumber] = new Class(this, unitIdNumber);
                        this._allComponentKeys.push(key + unitIdNumber);
                    }
                }
            }
        }
        if (hw_embeds) {
            for (const key in embeds_map) {
                if (hw_embeds[key]) {
                    const Class = embeds_map[key];
                    this[key] = new Class(this);
                    this._allComponentKeys.push(key);
                }
            }
        }
        if (hw_protocol) {
            for (const key in protocol_map) {
                if (hw_protocol[key]) {
                    const units = hw_protocol[key].units;
                    const Class = protocol_map[key];
                    for (const unitId in units) {
                        const unitIdNumber = parseInt(unitId);
                        this[key + unitIdNumber] = new Class(this, unitIdNumber);
                        this._allComponentKeys.push(key + unitIdNumber);
                    }
                }
            }
        }
    }
    _resetComponents() {
        this.print_debug("components state resets");
        for (const key of this._allComponentKeys) {
            this[key]._reset();
        }
    }
    notifyToModule(obj) {
        super.notifyToModule(obj);
        for (const key of this._allComponentKeys) {
            if (key === "logicAnalyzer") {
                if (obj.hasOwnProperty("logic_analyzer")) {
                    this.logicAnalyzer.notified(obj.logic_analyzer);
                }
                continue;
            }
            if (obj.hasOwnProperty(key)) {
                /* because of nullable */
                this[key].notified(obj[key]);
            }
        }
    }
    handleSystemCommand(wsObj) {
        super.handleSystemCommand(wsObj);
        // ping pong
        if (wsObj.pong) {
            for (const callback of this.pongObservers) {
                callback(wsObj);
            }
        }
    }
    addPongObserver(callback) {
        if (callback) {
            this.pongObservers.push(callback);
        }
    }
    removePongObserver(callback) {
        if (this.pongObservers.includes(callback)) {
            const index = this.pongObservers.indexOf(callback);
            this.pongObservers.splice(index, 1);
        }
    }
    setVccGnd(vcc, gnd, drive) {
        if (this.isValidIO(vcc)) {
            if (drive) {
                this.getIO(vcc).drive(drive);
            }
            this.getIO(vcc).output(true);
        }
        if (this.isValidIO(gnd)) {
            if (drive) {
                this.getIO(gnd).drive(drive);
            }
            this.getIO(gnd).output(false);
        }
    }
    getIO(io) {
        if (!this.isValidIO(io)) {
            throw new Error("io " + io + " is not valid io");
        }
        return this["io" + io];
    }
    getAD(io) {
        if (!this.isValidIO(io)) {
            throw new Error("ad " + io + " is not valid io");
        }
        return this["ad" + io];
    }
    _getFreePeripheralUnit(peripheral) {
        for (const key of this._allComponentKeys) {
            if (key.indexOf(peripheral) === 0) {
                /* "io" for "io0" */
                const obj = this[key];
                if (typeof obj === "object" && !obj.isUsed()) {
                    obj.used = true;
                    return obj;
                }
            }
        }
        throw new Error(`No More ${peripheral} Available.`);
    }
    getFreePwm() {
        return this._getFreePeripheralUnit("pwm");
    }
    getFreeI2C() {
        return this._getFreePeripheralUnit("i2c");
    }
    getI2CWithConfig(config) {
        if (typeof config !== "object") {
            throw new Error("getI2CWithConfig need config arg");
        }
        if (config.i2c) {
            return config.i2c;
        }
        const i2c = this.getFreeI2C();
        i2c.start(config);
        return i2c;
    }
    getFreeSpi() {
        return this._getFreePeripheralUnit("spi");
    }
    getSpiWithConfig(config) {
        if (typeof config !== "object") {
            throw new Error("getSpiWithConfig need config arg");
        }
        if (config.spi) {
            return config.spi;
        }
        const spi = this.getFreeSpi();
        spi.start(config);
        return spi;
    }
    getFreeUart() {
        return this._getFreePeripheralUnit("uart");
    }
    getFreeTcp() {
        return this._getFreePeripheralUnit("tcp");
    }
}
exports.default = ObnizComponents;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9PYm5pekNvbXBvbmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpQ0FBa0M7QUFDbEMsZ0VBQTZDO0FBQzdDLG1FQUFtRDtBQUNuRCxvRUFBNEM7QUFDNUMsa0VBQStDO0FBRS9DLGtFQUFvRDtBQUNwRCxnRkFBa0U7QUFDbEUsb0VBQXNEO0FBQ3RELGtFQUFvRDtBQUNwRCxvRUFBc0Q7QUFDdEQsb0VBQXNEO0FBQ3RELHNFQUF3RDtBQUN4RCxzRkFBOEQ7QUFDOUQsMEVBQXVEO0FBRXZELDhEQUFzQztBQUV0Qyw4REFBc0M7QUFFdEMsbURBQTJCO0FBRTNCLE1BQXFCLGVBQWdCLFNBQVEsb0JBQVU7SUFJckQsWUFBWSxFQUFPLEVBQUUsT0FBWTtRQUMvQixLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVNLEtBQUs7UUFDVixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRU0sY0FBYztRQUNuQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVNLGtCQUFrQjtRQUN2QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3ZDLE9BQU87U0FDUjtRQUVELE1BQU0sWUFBWSxHQUFRLFlBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxD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InNyYy9vYm5pei9PYm5pekNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VtdmVyID0gcmVxdWlyZShcInNlbXZlclwiKTtcbmltcG9ydCBPYm5pekJMRSBmcm9tIFwiLi9saWJzL2VtYmVkcy9ibGUvYmxlXCI7XG5pbXBvcnQgT2JuaXpCTEVIY2kgZnJvbSBcIi4vbGlicy9lbWJlZHMvYmxlSGNpL2JsZVwiO1xuaW1wb3J0IERpc3BsYXkgZnJvbSBcIi4vbGlicy9lbWJlZHMvZGlzcGxheVwiO1xuaW1wb3J0IE9ibml6U3dpdGNoIGZyb20gXCIuL2xpYnMvZW1iZWRzL3N3aXRjaFwiO1xuXG5pbXBvcnQgUGVyaXBoZXJhbEFEIGZyb20gXCIuL2xpYnMvaW9fcGVyaXBoZXJhbHMvYWRcIjtcbmltcG9ydCBQZXJpcGhlcmFsRGlyZWN0aXZlIGZyb20gXCIuL2xpYnMvaW9fcGVyaXBoZXJhbHMvZGlyZWN0aXZlXCI7XG5pbXBvcnQgUGVyaXBoZXJhbEkyQyBmcm9tIFwiLi9saWJzL2lvX3BlcmlwaGVyYWxzL2kyY1wiO1xuaW1wb3J0IFBlcmlwaGVyYWxJTyBmcm9tIFwiLi9saWJzL2lvX3BlcmlwaGVyYWxzL2lvXCI7XG5pbXBvcnQgUGVyaXBoZXJhbFBXTSBmcm9tIFwiLi9saWJzL2lvX3BlcmlwaGVyYWxzL3B3bVwiO1xuaW1wb3J0IFBlcmlwaGVyYWxTUEkgZnJvbSBcIi4vbGlicy9pb19wZXJpcGhlcmFscy9zcGlcIjtcbmltcG9ydCBQZXJpcGhlcmFsVUFSVCBmcm9tIFwiLi9saWJzL2lvX3BlcmlwaGVyYWxzL3VhcnRcIjtcbmltcG9ydCBMb2dpY0FuYWx5emVyIGZyb20gXCIuL2xpYnMvbWVhc3VyZW1lbnRzL2xvZ2ljYW5hbHl6ZXJcIjtcbmltcG9ydCBPYm5pek1lYXN1cmUgZnJvbSBcIi4vbGlicy9tZWFzdXJlbWVudHMvbWVhc3VyZVwiO1xuXG5pbXBvcnQgVENQIGZyb20gXCIuL2xpYnMvcHJvdG9jb2wvdGNwXCI7XG5cbmltcG9ydCBPYm5pelBhcnRzIGZyb20gXCIuL09ibml6UGFydHNcIjtcblxuaW1wb3J0IEhXIGZyb20gXCIuL2xpYnMvaHdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JuaXpDb21wb25lbnRzIGV4dGVuZHMgT2JuaXpQYXJ0cyB7XG4gIHB1YmxpYyBwb25nT2JzZXJ2ZXJzOiBhbnk7XG4gIHB1YmxpYyBfYWxsQ29tcG9uZW50S2V5czogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBhbnksIG9wdGlvbnM6IGFueSkge1xuICAgIHN1cGVyKGlkLCBvcHRpb25zKTtcbiAgICB0aGlzLnBvbmdPYnNlcnZlcnMgPSBbXTtcbiAgICB0aGlzLl9hbGxDb21wb25lbnRLZXlzID0gW107XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKSB7XG4gICAgc3VwZXIuY2xvc2UoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnJlc2V0X29ibml6X29uX3dzX2Rpc2Nvbm5lY3Rpb24pIHtcbiAgICAgIHRoaXMuX3Jlc2V0Q29tcG9uZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBfY2FsbE9uQ29ubmVjdCgpIHtcbiAgICB0aGlzLl9wcmVwYXJlQ29tcG9uZW50cygpO1xuICAgIHN1cGVyLl9jYWxsT25Db25uZWN0KCk7XG4gIH1cblxuICBwdWJsaWMgX3ByZXBhcmVDb21wb25lbnRzKCkge1xuICAgIGlmICh0aGlzLl9hbGxDb21wb25lbnRLZXlzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGh3RGVmaW5pdGlvbjogYW55ID0gSFcuZ2V0RGVmaW5pdGlvbkZvcih0aGlzLmh3KTtcbiAgICBpZiAoIWh3RGVmaW5pdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtvd24gaHcgJHt0aGlzLmh3fWApO1xuICAgIH1cblxuICAgIGNvbnN0IGh3X3BlcmlwaGVyYWxzOiBhbnkgPSBod0RlZmluaXRpb24ucGVyaXBoZXJhbHM7XG4gICAgY29uc3QgaHdfZW1iZWRzOiBhbnkgPSBod0RlZmluaXRpb24uZW1iZWRzO1xuICAgIGNvbnN0IGh3X3Byb3RvY29sOiBhbnkgPSBod0RlZmluaXRpb24ucHJvdG9jb2w7XG5cbiAgICBjb25zdCBzaGFyZWRfbWFwOiBhbnkgPSB7XG4gICAgICBpbzogUGVyaXBoZXJhbERpcmVjdGl2ZSxcbiAgICAgIGxvZ2ljQW5hbHl6ZXI6IExvZ2ljQW5hbHl6ZXIsXG4gICAgICBtZWFzdXJlOiBPYm5pek1lYXN1cmUsXG4gICAgfTtcblxuICAgIGNvbnN0IHBlcmlwaGVyYWxfbWFwOiBhbnkgPSB7XG4gICAgICBpbzogUGVyaXBoZXJhbElPLFxuICAgICAgYWQ6IFBlcmlwaGVyYWxBRCxcbiAgICAgIHVhcnQ6IFBlcmlwaGVyYWxVQVJULFxuICAgICAgc3BpOiBQZXJpcGhlcmFsU1BJLFxuICAgICAgaTJjOiBQZXJpcGhlcmFsSTJDLFxuICAgICAgcHdtOiBQZXJpcGhlcmFsUFdNLFxuICAgIH07XG5cbiAgICBsZXQgYmxlOiBhbnkgPSBPYm5pekJMRUhjaTtcblxuICAgIC8vIDwgMy4wLjAtYmV0YVxuICAgIGlmIChzZW12ZXIubHQodGhpcy5maXJtd2FyZV92ZXIsIFwiMy4wLjAtYmV0YVwiKSkge1xuICAgICAgYmxlID0gT2JuaXpCTEU7XG4gICAgfVxuXG4gICAgY29uc3QgZW1iZWRzX21hcDogYW55ID0ge1xuICAgICAgZGlzcGxheTogRGlzcGxheSxcbiAgICAgIHN3aXRjaDogT2JuaXpTd2l0Y2gsXG4gICAgICBibGUsXG4gICAgfTtcblxuICAgIGNvbnN0IHByb3RvY29sX21hcDogYW55ID0ge1xuICAgICAgdGNwOiBUQ1AsXG4gICAgfTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHNoYXJlZF9tYXApIHtcbiAgICAgIGNvbnN0IENsYXNzOiBhbnkgPSBzaGFyZWRfbWFwW2tleV07XG4gICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSBuZXcgQ2xhc3ModGhpcyk7XG4gICAgICB0aGlzLl9hbGxDb21wb25lbnRLZXlzLnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBpZiAoaHdfcGVyaXBoZXJhbHMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHBlcmlwaGVyYWxfbWFwKSB7XG4gICAgICAgIGlmIChod19wZXJpcGhlcmFsc1trZXldKSB7XG4gICAgICAgICAgY29uc3QgdW5pdHM6IGFueSA9IGh3X3BlcmlwaGVyYWxzW2tleV0udW5pdHM7XG4gICAgICAgICAgY29uc3QgQ2xhc3M6IGFueSA9IHBlcmlwaGVyYWxfbWFwW2tleV07XG4gICAgICAgICAgZm9yIChjb25zdCB1bml0SWQgaW4gdW5pdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVuaXRJZE51bWJlciA9IHBhcnNlSW50KHVuaXRJZCk7XG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleSArIHVuaXRJZE51bWJlcl0gPSBuZXcgQ2xhc3ModGhpcywgdW5pdElkTnVtYmVyKTtcbiAgICAgICAgICAgIHRoaXMuX2FsbENvbXBvbmVudEtleXMucHVzaChrZXkgKyB1bml0SWROdW1iZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChod19lbWJlZHMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGVtYmVkc19tYXApIHtcbiAgICAgICAgaWYgKGh3X2VtYmVkc1trZXldKSB7XG4gICAgICAgICAgY29uc3QgQ2xhc3M6IGFueSA9IGVtYmVkc19tYXBba2V5XTtcbiAgICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSBuZXcgQ2xhc3ModGhpcyk7XG4gICAgICAgICAgdGhpcy5fYWxsQ29tcG9uZW50S2V5cy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaHdfcHJvdG9jb2wpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3RvY29sX21hcCkge1xuICAgICAgICBpZiAoaHdfcHJvdG9jb2xba2V5XSkge1xuICAgICAgICAgIGNvbnN0IHVuaXRzOiBhbnkgPSBod19wcm90b2NvbFtrZXldLnVuaXRzO1xuICAgICAgICAgIGNvbnN0IENsYXNzOiBhbnkgPSBwcm90b2NvbF9tYXBba2V5XTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHVuaXRJZCBpbiB1bml0cykge1xuICAgICAgICAgICAgY29uc3QgdW5pdElkTnVtYmVyID0gcGFyc2VJbnQodW5pdElkKTtcbiAgICAgICAgICAgICh0aGlzIGFzIGFueSlba2V5ICsgdW5pdElkTnVtYmVyXSA9IG5ldyBDbGFzcyh0aGlzLCB1bml0SWROdW1iZXIpO1xuICAgICAgICAgICAgdGhpcy5fYWxsQ29tcG9uZW50S2V5cy5wdXNoKGtleSArIHVuaXRJZE51bWJlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9yZXNldENvbXBvbmVudHMoKSB7XG4gICAgdGhpcy5wcmludF9kZWJ1ZyhcImNvbXBvbmVudHMgc3RhdGUgcmVzZXRzXCIpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHRoaXMuX2FsbENvbXBvbmVudEtleXMpIHtcbiAgICAgICh0aGlzIGFzIGFueSlba2V5XS5fcmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5VG9Nb2R1bGUob2JqOiBhbnkpIHtcbiAgICBzdXBlci5ub3RpZnlUb01vZHVsZShvYmopO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHRoaXMuX2FsbENvbXBvbmVudEtleXMpIHtcbiAgICAgIGlmIChrZXkgPT09IFwibG9naWNBbmFseXplclwiKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoXCJsb2dpY19hbmFseXplclwiKSkge1xuICAgICAgICAgICh0aGlzIGFzIGFueSkubG9naWNBbmFseXplci5ub3RpZmllZChvYmoubG9naWNfYW5hbHl6ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIC8qIGJlY2F1c2Ugb2YgbnVsbGFibGUgKi9cbiAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldLm5vdGlmaWVkKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlU3lzdGVtQ29tbWFuZCh3c09iajogYW55KSB7XG4gICAgc3VwZXIuaGFuZGxlU3lzdGVtQ29tbWFuZCh3c09iaik7XG4gICAgLy8gcGluZyBwb25nXG4gICAgaWYgKHdzT2JqLnBvbmcpIHtcbiAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5wb25nT2JzZXJ2ZXJzKSB7XG4gICAgICAgIGNhbGxiYWNrKHdzT2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkUG9uZ09ic2VydmVyKGNhbGxiYWNrOiBhbnkpIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMucG9uZ09ic2VydmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlUG9uZ09ic2VydmVyKGNhbGxiYWNrOiBhbnkpIHtcbiAgICBpZiAodGhpcy5wb25nT2JzZXJ2ZXJzLmluY2x1ZGVzKGNhbGxiYWNrKSkge1xuICAgICAgY29uc3QgaW5kZXg6IGFueSA9IHRoaXMucG9uZ09ic2VydmVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgIHRoaXMucG9uZ09ic2VydmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRWY2NHbmQodmNjOiBhbnksIGduZDogYW55LCBkcml2ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNWYWxpZElPKHZjYykpIHtcbiAgICAgIGlmIChkcml2ZSkge1xuICAgICAgICB0aGlzLmdldElPKHZjYykuZHJpdmUoZHJpdmUpO1xuICAgICAgfVxuICAgICAgdGhpcy5nZXRJTyh2Y2MpLm91dHB1dCh0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1ZhbGlkSU8oZ25kKSkge1xuICAgICAgaWYgKGRyaXZlKSB7XG4gICAgICAgIHRoaXMuZ2V0SU8oZ25kKS5kcml2ZShkcml2ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdldElPKGduZCkub3V0cHV0KGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0SU8oaW86IGFueSkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkSU8oaW8pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbyBcIiArIGlvICsgXCIgaXMgbm90IHZhbGlkIGlvXCIpO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMgYXMgYW55KVtcImlvXCIgKyBpb107XG4gIH1cblxuICBwdWJsaWMgZ2V0QUQoaW86IGFueSkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkSU8oaW8pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhZCBcIiArIGlvICsgXCIgaXMgbm90IHZhbGlkIGlvXCIpO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMgYXMgYW55KVtcImFkXCIgKyBpb107XG4gIH1cblxuICBwdWJsaWMgX2dldEZyZWVQZXJpcGhlcmFsVW5pdChwZXJpcGhlcmFsOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLl9hbGxDb21wb25lbnRLZXlzKSB7XG4gICAgICBpZiAoa2V5LmluZGV4T2YocGVyaXBoZXJhbCkgPT09IDApIHtcbiAgICAgICAgLyogXCJpb1wiIGZvciBcImlvMFwiICovXG4gICAgICAgIGNvbnN0IG9iajogYW55ID0gKHRoaXMgYXMgYW55KVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAhb2JqLmlzVXNlZCgpKSB7XG4gICAgICAgICAgb2JqLnVzZWQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyBNb3JlICR7cGVyaXBoZXJhbH0gQXZhaWxhYmxlLmApO1xuICB9XG5cbiAgcHVibGljIGdldEZyZWVQd20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEZyZWVQZXJpcGhlcmFsVW5pdChcInB3bVwiKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGcmVlSTJDKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRGcmVlUGVyaXBoZXJhbFVuaXQoXCJpMmNcIik7XG4gIH1cblxuICBwdWJsaWMgZ2V0STJDV2l0aENvbmZpZyhjb25maWc6IGFueSkge1xuICAgIGlmICh0eXBlb2YgY29uZmlnICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJnZXRJMkNXaXRoQ29uZmlnIG5lZWQgY29uZmlnIGFyZ1wiKTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5pMmMpIHtcbiAgICAgIHJldHVybiBjb25maWcuaTJjO1xuICAgIH1cbiAgICBjb25zdCBpMmM6IGFueSA9IHRoaXMuZ2V0RnJlZUkyQygpO1xuICAgIGkyYy5zdGFydChjb25maWcpO1xuICAgIHJldHVybiBpMmM7XG4gIH1cblxuICBwdWJsaWMgZ2V0RnJlZVNwaSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0RnJlZVBlcmlwaGVyYWxVbml0KFwic3BpXCIpO1xuICB9XG5cbiAgcHVibGljIGdldFNwaVdpdGhDb25maWcoY29uZmlnOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZyAhPT0gXCJvYmplY3RcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0U3BpV2l0aENvbmZpZyBuZWVkIGNvbmZpZyBhcmdcIik7XG4gICAgfVxuICAgIGlmIChjb25maWcuc3BpKSB7XG4gICAgICByZXR1cm4gY29uZmlnLnNwaTtcbiAgICB9XG4gICAgY29uc3Qgc3BpOiBhbnkgPSB0aGlzLmdldEZyZWVTcGkoKTtcbiAgICBzcGkuc3RhcnQoY29uZmlnKTtcbiAgICByZXR1cm4gc3BpO1xuICB9XG5cbiAgcHVibGljIGdldEZyZWVVYXJ0KCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRGcmVlUGVyaXBoZXJhbFVuaXQoXCJ1YXJ0XCIpO1xuICB9XG5cbiAgcHVibGljIGdldEZyZWVUY3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEZyZWVQZXJpcGhlcmFsVW5pdChcInRjcFwiKTtcbiAgfVxufVxuIl19
