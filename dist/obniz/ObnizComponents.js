"use strict";
const ObnizBLE = require('./libs/embeds/ble/ble');
const ObnizBLEHci = require('./libs/embeds/bleHci/ble');
const Display = require('./libs/embeds/display');
const ObnizSwitch = require('./libs/embeds/switch');
const semver = require('semver');
const LogicAnalyzer = require('./libs/measurements/logicanalyzer');
const ObnizMeasure = require('./libs/measurements/measure');
const PeripheralAD = require('./libs/io_peripherals/ad');
const PeripheralI2C = require('./libs/io_peripherals/i2c');
const PeripheralIO = require('./libs/io_peripherals/io');
const PeripheralDirective = require('./libs/io_peripherals/directive');
const PeripheralPWM = require('./libs/io_peripherals/pwm');
const PeripheralSPI = require('./libs/io_peripherals/spi');
const PeripheralUART = require('./libs/io_peripherals/uart');
const TCP = require('./libs/protocol/tcp');
const ObnizParts = require('./ObnizParts');
const HW = require('./libs/hw');
module.exports = class ObnizComponents extends ObnizParts {
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
        const hwDefinition = HW.getDefinitionFor(this.hw);
        if (!hwDefinition) {
            throw new Error(`unkown hw ${this.hw}`);
        }
        const hw_peripherals = hwDefinition.peripherals;
        const hw_embeds = hwDefinition.embeds;
        const hw_protocol = hwDefinition.protocol;
        const shared_map = {
            io: PeripheralDirective,
            logicAnalyzer: LogicAnalyzer,
            measure: ObnizMeasure,
        };
        const peripheral_map = {
            io: PeripheralIO,
            ad: PeripheralAD,
            uart: PeripheralUART,
            spi: PeripheralSPI,
            i2c: PeripheralI2C,
            pwm: PeripheralPWM,
        };
        let ble = ObnizBLEHci;
        // < 3.0.0-beta
        if (semver.lt(this.firmware_ver, '3.0.0-beta')) {
            ble = ObnizBLE;
        }
        const embeds_map = {
            display: Display,
            switch: ObnizSwitch,
            ble: ble,
        };
        const protocol_map = {
            tcp: TCP,
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
                    for (let unitId in units) {
                        unitId = parseInt(unitId);
                        this[key + unitId] = new Class(this, unitId);
                        this._allComponentKeys.push(key + unitId);
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
                    for (let unitId in units) {
                        unitId = parseInt(unitId);
                        this[key + unitId] = new Class(this, unitId);
                        this._allComponentKeys.push(key + unitId);
                    }
                }
            }
        }
    }
    _resetComponents() {
        this.print_debug('components state resets');
        for (const key of this._allComponentKeys) {
            this[key]._reset();
        }
    }
    notifyToModule(obj) {
        super.notifyToModule(obj);
        for (const key of this._allComponentKeys) {
            if (key === 'logicAnalyzer') {
                if (obj.hasOwnProperty('logic_analyzer')) {
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
            for (let callback of this.pongObservers) {
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
            let index = this.pongObservers.indexOf(callback);
            this.pongObservers.splice(index, 1);
        }
    }
    isValidIO(io) {
        return typeof io === 'number' && this['io' + io] != null;
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
            throw new Error('io ' + io + ' is not valid io');
        }
        return this['io' + io];
    }
    getAD(io) {
        if (!this.isValidIO(io)) {
            throw new Error('ad ' + io + ' is not valid io');
        }
        return this['ad' + io];
    }
    _getFreePeripheralUnit(peripheral) {
        for (const key of this._allComponentKeys) {
            if (key.indexOf(peripheral) === 0) {
                /* "io" for "io0" */
                const obj = this[key];
                if (typeof obj == 'object' && !obj.isUsed()) {
                    obj.used = true;
                    return obj;
                }
            }
        }
        throw new Error(`No More ${peripheral} Available.`);
    }
    getFreePwm() {
        return this._getFreePeripheralUnit('pwm');
    }
    getFreeI2C() {
        return this._getFreePeripheralUnit('i2c');
    }
    getI2CWithConfig(config) {
        if (typeof config !== 'object') {
            throw new Error('getI2CWithConfig need config arg');
        }
        if (config.i2c) {
            return config.i2c;
        }
        let i2c = this.getFreeI2C();
        i2c.start(config);
        return i2c;
    }
    getFreeSpi() {
        return this._getFreePeripheralUnit('spi');
    }
    getSpiWithConfig(config) {
        if (typeof config !== 'object') {
            throw new Error('getSpiWithConfig need config arg');
        }
        if (config.spi) {
            return config.spi;
        }
        let spi = this.getFreeSpi();
        spi.start(config);
        return spi;
    }
    getFreeUart() {
        return this._getFreePeripheralUnit('uart');
    }
    getFreeTcp() {
        return this._getFreePeripheralUnit('tcp');
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9PYm5pekNvbXBvbmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3hELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVqQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUNuRSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUM1RCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN6RCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUMzRCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN6RCxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3ZFLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzNELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzNELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRTdELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRTNDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUUzQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFaEMs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Q3JEO1FBQ0QsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ2QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxNQUFNO1FBQ3JCLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztTQUNyRDtRQUNELElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNkLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUNuQjtRQUNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7Q0FDRixDQUFDIiwiZmlsZSI6Im9ibml6L09ibml6Q29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE9ibml6QkxFID0gcmVxdWlyZSgnLi9saWJzL2VtYmVkcy9ibGUvYmxlJyk7XG5jb25zdCBPYm5pekJMRUhjaSA9IHJlcXVpcmUoJy4vbGlicy9lbWJlZHMvYmxlSGNpL2JsZScpO1xuY29uc3QgRGlzcGxheSA9IHJlcXVpcmUoJy4vbGlicy9lbWJlZHMvZGlzcGxheScpO1xuY29uc3QgT2JuaXpTd2l0Y2ggPSByZXF1aXJlKCcuL2xpYnMvZW1iZWRzL3N3aXRjaCcpO1xuY29uc3Qgc2VtdmVyID0gcmVxdWlyZSgnc2VtdmVyJyk7XG5cbmNvbnN0IExvZ2ljQW5hbHl6ZXIgPSByZXF1aXJlKCcuL2xpYnMvbWVhc3VyZW1lbnRzL2xvZ2ljYW5hbHl6ZXInKTtcbmNvbnN0IE9ibml6TWVhc3VyZSA9IHJlcXVpcmUoJy4vbGlicy9tZWFzdXJlbWVudHMvbWVhc3VyZScpO1xuY29uc3QgUGVyaXBoZXJhbEFEID0gcmVxdWlyZSgnLi9saWJzL2lvX3BlcmlwaGVyYWxzL2FkJyk7XG5jb25zdCBQZXJpcGhlcmFsSTJDID0gcmVxdWlyZSgnLi9saWJzL2lvX3BlcmlwaGVyYWxzL2kyYycpO1xuY29uc3QgUGVyaXBoZXJhbElPID0gcmVxdWlyZSgnLi9saWJzL2lvX3BlcmlwaGVyYWxzL2lvJyk7XG5jb25zdCBQZXJpcGhlcmFsRGlyZWN0aXZlID0gcmVxdWlyZSgnLi9saWJzL2lvX3BlcmlwaGVyYWxzL2RpcmVjdGl2ZScpO1xuY29uc3QgUGVyaXBoZXJhbFBXTSA9IHJlcXVpcmUoJy4vbGlicy9pb19wZXJpcGhlcmFscy9wd20nKTtcbmNvbnN0IFBlcmlwaGVyYWxTUEkgPSByZXF1aXJlKCcuL2xpYnMvaW9fcGVyaXBoZXJhbHMvc3BpJyk7XG5jb25zdCBQZXJpcGhlcmFsVUFSVCA9IHJlcXVpcmUoJy4vbGlicy9pb19wZXJpcGhlcmFscy91YXJ0Jyk7XG5cbmNvbnN0IFRDUCA9IHJlcXVpcmUoJy4vbGlicy9wcm90b2NvbC90Y3AnKTtcblxuY29uc3QgT2JuaXpQYXJ0cyA9IHJlcXVpcmUoJy4vT2JuaXpQYXJ0cycpO1xuXG5jb25zdCBIVyA9IHJlcXVpcmUoJy4vbGlicy9odycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE9ibml6Q29tcG9uZW50cyBleHRlbmRzIE9ibml6UGFydHMge1xuICBjb25zdHJ1Y3RvcihpZCwgb3B0aW9ucykge1xuICAgIHN1cGVyKGlkLCBvcHRpb25zKTtcbiAgICB0aGlzLnBvbmdPYnNlcnZlcnMgPSBbXTtcbiAgICB0aGlzLl9hbGxDb21wb25lbnRLZXlzID0gW107XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBzdXBlci5jbG9zZSgpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMucmVzZXRfb2JuaXpfb25fd3NfZGlzY29ubmVjdGlvbikge1xuICAgICAgdGhpcy5fcmVzZXRDb21wb25lbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgX2NhbGxPbkNvbm5lY3QoKSB7XG4gICAgdGhpcy5fcHJlcGFyZUNvbXBvbmVudHMoKTtcbiAgICBzdXBlci5fY2FsbE9uQ29ubmVjdCgpO1xuICB9XG5cbiAgX3ByZXBhcmVDb21wb25lbnRzKCkge1xuICAgIGlmICh0aGlzLl9hbGxDb21wb25lbnRLZXlzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGh3RGVmaW5pdGlvbiA9IEhXLmdldERlZmluaXRpb25Gb3IodGhpcy5odyk7XG4gICAgaWYgKCFod0RlZmluaXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rb3duIGh3ICR7dGhpcy5od31gKTtcbiAgICB9XG5cbiAgICBjb25zdCBod19wZXJpcGhlcmFscyA9IGh3RGVmaW5pdGlvbi5wZXJpcGhlcmFscztcbiAgICBjb25zdCBod19lbWJlZHMgPSBod0RlZmluaXRpb24uZW1iZWRzO1xuICAgIGNvbnN0IGh3X3Byb3RvY29sID0gaHdEZWZpbml0aW9uLnByb3RvY29sO1xuXG4gICAgY29uc3Qgc2hhcmVkX21hcCA9IHtcbiAgICAgIGlvOiBQZXJpcGhlcmFsRGlyZWN0aXZlLFxuICAgICAgbG9naWNBbmFseXplcjogTG9naWNBbmFseXplcixcbiAgICAgIG1lYXN1cmU6IE9ibml6TWVhc3VyZSxcbiAgICB9O1xuXG4gICAgY29uc3QgcGVyaXBoZXJhbF9tYXAgPSB7XG4gICAgICBpbzogUGVyaXBoZXJhbElPLFxuICAgICAgYWQ6IFBlcmlwaGVyYWxBRCxcbiAgICAgIHVhcnQ6IFBlcmlwaGVyYWxVQVJULFxuICAgICAgc3BpOiBQZXJpcGhlcmFsU1BJLFxuICAgICAgaTJjOiBQZXJpcGhlcmFsSTJDLFxuICAgICAgcHdtOiBQZXJpcGhlcmFsUFdNLFxuICAgIH07XG5cbiAgICBsZXQgYmxlID0gT2JuaXpCTEVIY2k7XG5cbiAgICAvLyA8IDMuMC4wLWJldGFcbiAgICBpZiAoc2VtdmVyLmx0KHRoaXMuZmlybXdhcmVfdmVyLCAnMy4wLjAtYmV0YScpKSB7XG4gICAgICBibGUgPSBPYm5pekJMRTtcbiAgICB9XG5cbiAgICBjb25zdCBlbWJlZHNfbWFwID0ge1xuICAgICAgZGlzcGxheTogRGlzcGxheSxcbiAgICAgIHN3aXRjaDogT2JuaXpTd2l0Y2gsXG4gICAgICBibGU6IGJsZSxcbiAgICB9O1xuXG4gICAgY29uc3QgcHJvdG9jb2xfbWFwID0ge1xuICAgICAgdGNwOiBUQ1AsXG4gICAgfTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHNoYXJlZF9tYXApIHtcbiAgICAgIGNvbnN0IENsYXNzID0gc2hhcmVkX21hcFtrZXldO1xuICAgICAgdGhpc1trZXldID0gbmV3IENsYXNzKHRoaXMpO1xuICAgICAgdGhpcy5fYWxsQ29tcG9uZW50S2V5cy5wdXNoKGtleSk7XG4gICAgfVxuXG4gICAgaWYgKGh3X3BlcmlwaGVyYWxzKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBwZXJpcGhlcmFsX21hcCkge1xuICAgICAgICBpZiAoaHdfcGVyaXBoZXJhbHNba2V5XSkge1xuICAgICAgICAgIGNvbnN0IHVuaXRzID0gaHdfcGVyaXBoZXJhbHNba2V5XS51bml0cztcbiAgICAgICAgICBjb25zdCBDbGFzcyA9IHBlcmlwaGVyYWxfbWFwW2tleV07XG4gICAgICAgICAgZm9yIChsZXQgdW5pdElkIGluIHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0SWQgPSBwYXJzZUludCh1bml0SWQpO1xuICAgICAgICAgICAgdGhpc1trZXkgKyB1bml0SWRdID0gbmV3IENsYXNzKHRoaXMsIHVuaXRJZCk7XG4gICAgICAgICAgICB0aGlzLl9hbGxDb21wb25lbnRLZXlzLnB1c2goa2V5ICsgdW5pdElkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaHdfZW1iZWRzKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBlbWJlZHNfbWFwKSB7XG4gICAgICAgIGlmIChod19lbWJlZHNba2V5XSkge1xuICAgICAgICAgIGNvbnN0IENsYXNzID0gZW1iZWRzX21hcFtrZXldO1xuICAgICAgICAgIHRoaXNba2V5XSA9IG5ldyBDbGFzcyh0aGlzKTtcbiAgICAgICAgICB0aGlzLl9hbGxDb21wb25lbnRLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChod19wcm90b2NvbCkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvdG9jb2xfbWFwKSB7XG4gICAgICAgIGlmIChod19wcm90b2NvbFtrZXldKSB7XG4gICAgICAgICAgY29uc3QgdW5pdHMgPSBod19wcm90b2NvbFtrZXldLnVuaXRzO1xuICAgICAgICAgIGNvbnN0IENsYXNzID0gcHJvdG9jb2xfbWFwW2tleV07XG4gICAgICAgICAgZm9yIChsZXQgdW5pdElkIGluIHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0SWQgPSBwYXJzZUludCh1bml0SWQpO1xuICAgICAgICAgICAgdGhpc1trZXkgKyB1bml0SWRdID0gbmV3IENsYXNzKHRoaXMsIHVuaXRJZCk7XG4gICAgICAgICAgICB0aGlzLl9hbGxDb21wb25lbnRLZXlzLnB1c2goa2V5ICsgdW5pdElkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVzZXRDb21wb25lbnRzKCkge1xuICAgIHRoaXMucHJpbnRfZGVidWcoJ2NvbXBvbmVudHMgc3RhdGUgcmVzZXRzJyk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5fYWxsQ29tcG9uZW50S2V5cykge1xuICAgICAgdGhpc1trZXldLl9yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeVRvTW9kdWxlKG9iaikge1xuICAgIHN1cGVyLm5vdGlmeVRvTW9kdWxlKG9iaik7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5fYWxsQ29tcG9uZW50S2V5cykge1xuICAgICAgaWYgKGtleSA9PT0gJ2xvZ2ljQW5hbHl6ZXInKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoJ2xvZ2ljX2FuYWx5emVyJykpIHtcbiAgICAgICAgICB0aGlzLmxvZ2ljQW5hbHl6ZXIubm90aWZpZWQob2JqLmxvZ2ljX2FuYWx5emVyKTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAvKiBiZWNhdXNlIG9mIG51bGxhYmxlICovXG4gICAgICAgIHRoaXNba2V5XS5ub3RpZmllZChvYmpba2V5XSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU3lzdGVtQ29tbWFuZCh3c09iaikge1xuICAgIHN1cGVyLmhhbmRsZVN5c3RlbUNvbW1hbmQod3NPYmopO1xuICAgIC8vIHBpbmcgcG9uZ1xuICAgIGlmICh3c09iai5wb25nKSB7XG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLnBvbmdPYnNlcnZlcnMpIHtcbiAgICAgICAgY2FsbGJhY2sod3NPYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZFBvbmdPYnNlcnZlcihjYWxsYmFjaykge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy5wb25nT2JzZXJ2ZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVBvbmdPYnNlcnZlcihjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLnBvbmdPYnNlcnZlcnMuaW5jbHVkZXMoY2FsbGJhY2spKSB7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLnBvbmdPYnNlcnZlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICB0aGlzLnBvbmdPYnNlcnZlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkSU8oaW8pIHtcbiAgICByZXR1cm4gdHlwZW9mIGlvID09PSAnbnVtYmVyJyAmJiB0aGlzWydpbycgKyBpb10gIT0gbnVsbDtcbiAgfVxuXG4gIHNldFZjY0duZCh2Y2MsIGduZCwgZHJpdmUpIHtcbiAgICBpZiAodGhpcy5pc1ZhbGlkSU8odmNjKSkge1xuICAgICAgaWYgKGRyaXZlKSB7XG4gICAgICAgIHRoaXMuZ2V0SU8odmNjKS5kcml2ZShkcml2ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdldElPKHZjYykub3V0cHV0KHRydWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzVmFsaWRJTyhnbmQpKSB7XG4gICAgICBpZiAoZHJpdmUpIHtcbiAgICAgICAgdGhpcy5nZXRJTyhnbmQpLmRyaXZlKGRyaXZlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ2V0SU8oZ25kKS5vdXRwdXQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGdldElPKGlvKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRJTyhpbykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW8gJyArIGlvICsgJyBpcyBub3QgdmFsaWQgaW8nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNbJ2lvJyArIGlvXTtcbiAgfVxuXG4gIGdldEFEKGlvKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRJTyhpbykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYWQgJyArIGlvICsgJyBpcyBub3QgdmFsaWQgaW8nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNbJ2FkJyArIGlvXTtcbiAgfVxuXG4gIF9nZXRGcmVlUGVyaXBoZXJhbFVuaXQocGVyaXBoZXJhbCkge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHRoaXMuX2FsbENvbXBvbmVudEtleXMpIHtcbiAgICAgIGlmIChrZXkuaW5kZXhPZihwZXJpcGhlcmFsKSA9PT0gMCkge1xuICAgICAgICAvKiBcImlvXCIgZm9yIFwiaW8wXCIgKi9cbiAgICAgICAgY29uc3Qgb2JqID0gdGhpc1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PSAnb2JqZWN0JyAmJiAhb2JqLmlzVXNlZCgpKSB7XG4gICAgICAgICAgb2JqLnVzZWQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyBNb3JlICR7cGVyaXBoZXJhbH0gQXZhaWxhYmxlLmApO1xuICB9XG5cbiAgZ2V0RnJlZVB3bSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0RnJlZVBlcmlwaGVyYWxVbml0KCdwd20nKTtcbiAgfVxuXG4gIGdldEZyZWVJMkMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEZyZWVQZXJpcGhlcmFsVW5pdCgnaTJjJyk7XG4gIH1cblxuICBnZXRJMkNXaXRoQ29uZmlnKGNvbmZpZykge1xuICAgIGlmICh0eXBlb2YgY29uZmlnICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRJMkNXaXRoQ29uZmlnIG5lZWQgY29uZmlnIGFyZycpO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLmkyYykge1xuICAgICAgcmV0dXJuIGNvbmZpZy5pMmM7XG4gICAgfVxuICAgIGxldCBpMmMgPSB0aGlzLmdldEZyZWVJMkMoKTtcbiAgICBpMmMuc3RhcnQoY29uZmlnKTtcbiAgICByZXR1cm4gaTJjO1xuICB9XG5cbiAgZ2V0RnJlZVNwaSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0RnJlZVBlcmlwaGVyYWxVbml0KCdzcGknKTtcbiAgfVxuXG4gIGdldFNwaVdpdGhDb25maWcoY29uZmlnKSB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNwaVdpdGhDb25maWcgbmVlZCBjb25maWcgYXJnJyk7XG4gICAgfVxuICAgIGlmIChjb25maWcuc3BpKSB7XG4gICAgICByZXR1cm4gY29uZmlnLnNwaTtcbiAgICB9XG4gICAgbGV0IHNwaSA9IHRoaXMuZ2V0RnJlZVNwaSgpO1xuICAgIHNwaS5zdGFydChjb25maWcpO1xuICAgIHJldHVybiBzcGk7XG4gIH1cblxuICBnZXRGcmVlVWFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0RnJlZVBlcmlwaGVyYWxVbml0KCd1YXJ0Jyk7XG4gIH1cblxuICBnZXRGcmVlVGNwKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRGcmVlUGVyaXBoZXJhbFVuaXQoJ3RjcCcpO1xuICB9XG59O1xuIl19
