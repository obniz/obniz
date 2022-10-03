/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - device.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-11-03
 * ---------------------------------------------------------------- */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const advertising_1 = __importDefault(require("./advertising"));
const service_1 = __importDefault(require("./service"));
class LinkingDevice {
    constructor(peripheral) {
        this.PRIMARY_SERVICE_UUID = 'b3b3690150d34044808d50835b13a6cd';
        this.WRITE_CHARACTERRISTIC_UUID = 'b3b3910150d34044808d50835b13a6cd';
        this.INDICATE_CHARACTERRISTIC_UUID = 'b3b3910250d34044808d50835b13a6cd';
        this.info = {};
        this.connected = false;
        this.onconnect = null;
        this.onconnectprogress = null;
        this.ondisconnect = null;
        this.onnotify = null;
        this.services = {
            deviceName: null,
            led: null,
            vibration: null,
            button: null,
            gyroscope: null,
            accelerometer: null,
            orientation: null,
            battery: null,
            temperature: null,
            humidity: null,
            pressure: null,
            openclose: null,
            human: null,
            move: null,
            illuminance: null,
        };
        this._service = null;
        this._div_packet_queue = [];
        this._LinkingService = new service_1.default();
        this._onresponse = null;
        this._write_response_timeout = 30000; // msec
        this._generic_access_service = {
            SERVICE_UUID: '1800',
            service: null,
            device_name: {
                CHARACTERRISTIC_UUID: '2a00',
                char: null,
            },
        };
        this.advertisement = advertising_1.default.parse(peripheral);
        this._peripheral = peripheral;
    }
    /**
     * @deprecated
     * @param setting
     */
    connect(setting) {
        return this.connectWait(setting);
    }
    async connectWait(setting) {
        if (this.connected === true) {
            throw new Error('The device has been already connected.');
        }
        let onprogress = this.onconnectprogress;
        if (!this._isFunction(this.onconnectprogress)) {
            onprogress = () => {
                // do nothing.
            };
        }
        const peripheral = this._peripheral;
        onprogress({ step: 1, desc: 'CONNECTING' });
        try {
            peripheral.ondisconnect = async () => {
                await this._cleanWait();
                if (this._isFunction(this.ondisconnect)) {
                    this.ondisconnect({ wasClean: false });
                }
            };
            await peripheral.connectWait(setting);
            onprogress({ step: 2, desc: 'CONNECTION_ESTABLISHED' });
            onprogress({ step: 3, desc: 'GETTING_CHARACTERISTICS' });
            await this._getServicesAndChars();
            onprogress({ step: 4, desc: 'SUBSCRIBING' });
            await this._subscribeForIndicateWait();
            onprogress({ step: 5, desc: 'GETTING_DEVICE_INFOMATION' });
            let res;
            res = await this.write('GET_DEVICE_INFORMATION');
            this.info.id = '';
            if ('deviceId' in res.data) {
                this.info.id = res.data.deviceId;
            }
            this.info.uid = '';
            if ('deviceUid' in res.data) {
                this.info.uid = res.data.deviceUid;
            }
            this.info.services = {};
            if ('serviceList' in res.data) {
                res.data.serviceList.forEach((o) => {
                    this.info.services[o.name] = o.id;
                });
            }
            this.info.capabilities = {};
            if ('deviceCapability' in res.data) {
                res.data.deviceCapability.forEach((o) => {
                    this.info.capabilities[o.name] = o.id;
                });
            }
            this.info.exsensors = {};
            if ('exSensorType' in res.data) {
                res.data.exSensorType.forEach((o) => {
                    this.info.exsensors[o.name] = o.id;
                });
            }
            onprogress({ step: 6, desc: 'GETTING_NOTIFY_CATEGORIES' });
            res = await this._writeConfirmNotifyCategory();
            this.info.notifyCategories = {};
            if (res) {
                if ('notifyCategory' in res.data) {
                    res.data.notifyCategory.forEach((o) => {
                        this.info.notifyCategories[o.name] = o.id;
                    });
                }
            }
            onprogress({ step: 7, desc: 'GETTING_SETTING_INFORMATION' });
            res = await this._writeGetSettingInformation();
            this.info.settings = {};
            if (res) {
                if ('settingInformationData' in res.data) {
                    res.data.settingInformationData.forEach((o) => {
                        this.info.settings[o.name] = o;
                    });
                }
            }
            onprogress({ step: 8, desc: 'GETTING_LED_COLOR_NAMES' });
            res = await this._writeGetSettingName('LEDColorName');
            if (res) {
                this.info.settings.LED.colors = res.data.settingNameData;
            }
            onprogress({ step: 9, desc: 'GETTING_LED_PATTERN_NAMES' });
            res = await this._writeGetSettingName('LEDPatternName');
            if (res) {
                this.info.settings.LED.patterns = res.data.settingNameData;
            }
            onprogress({ step: 10, desc: 'GETTING_VIBRATION_PATTERN_NAMES' });
            res = await this._writeGetSettingName('VibrationPatternName');
            if (res) {
                this.info.settings.Vibration.patterns = res.data.settingNameData;
            }
            onprogress({ step: 11, desc: 'GETTING_BEEP_PATTERN_NAMES' });
            res = await this._writeGetSettingName('BeepPatternName');
            if (res) {
                this.info.settings.Beep.patterns = res.data.settingNameData;
            }
            this._LinkingService.setDeviceInfo(this.info);
            this._initServices();
            this.connected = true;
            if (this._isFunction(this.onconnect)) {
                this.onconnect();
            }
            onprogress({ step: 12, desc: 'COMPLETED' });
        }
        catch (e) {
            onprogress({ step: 0, desc: 'FAILED' });
            await this._cleanWait();
            throw e;
        }
    }
    _wait(msec) {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, msec);
        });
        return promise;
    }
    _writeConfirmNotifyCategory() {
        const promise = new Promise((resolve, reject) => {
            if (!('PeripheralDeviceNotification' in this.info.services)) {
                resolve(null);
                return;
            }
            this.write('CONFIRM_NOTIFY_CATEGORY')
                .then((res) => {
                resolve(res);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _writeGetSettingInformation() {
        const promise = new Promise((resolve, reject) => {
            if (!('PeripheralDeviceSettingOperation' in this.info.services)) {
                resolve(null);
                return;
            }
            this.write('GET_SETTING_INFORMATION')
                .then((res) => {
                resolve(res);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _writeGetSettingName(name) {
        const promise = new Promise((resolve, reject) => {
            if (!('PeripheralDeviceSettingOperation' in this.info.services)) {
                resolve(null);
                return;
            }
            const s = this.info.settings;
            if (name === 'LEDColorName') {
                if (!('LED' in s && s.LED.colorMax)) {
                    resolve(null);
                    return;
                }
            }
            else if (name === 'LEDPatternName') {
                if (!('LED' in s && s.LED.patternMax)) {
                    resolve(null);
                    return;
                }
            }
            else if (name === 'VibrationPatternName') {
                if (!('Vibration' in s && s.Vibration.patternMax)) {
                    resolve(null);
                    return;
                }
            }
            else if (name === 'BeepPatternName') {
                if (!('Beep' in s && s.Beep.patternMax)) {
                    resolve(null);
                    return;
                }
            }
            this.write('GET_SETTING_NAME', { SettingNameType: name })
                .then((res) => {
                resolve(res);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _isFunction(o) {
        return o && typeof o === 'function' ? true : false;
    }
    _getServicesAndChars() {
        const peripheral = this._peripheral;
        const service = peripheral.getService(this.PRIMARY_SERVICE_UUID);
        if (!service) {
            throw new Error('No service was found');
        }
        const write_char = service.getCharacteristic(this.WRITE_CHARACTERRISTIC_UUID);
        const indicate_char = service.getCharacteristic(this.INDICATE_CHARACTERRISTIC_UUID);
        if (!(write_char && indicate_char)) {
            throw new Error('No characteristic was found');
        }
        this.char_write = write_char;
        this.char_indicate = indicate_char;
        this._service = service;
        const ga_service = peripheral.getService(this._generic_access_service.SERVICE_UUID);
        if (ga_service) {
            const ga_char = ga_service.getCharacteristic(this._generic_access_service.device_name.CHARACTERRISTIC_UUID);
            if (ga_service && ga_char) {
                this._generic_access_service.service = ga_service;
                this._generic_access_service.device_name.char = ga_char;
            }
        }
    }
    /**
     * @deprecated
     */
    _subscribeForIndicate() {
        return this._subscribeForIndicateWait();
    }
    async _subscribeForIndicateWait() {
        await this.char_indicate.registerNotifyWait((data) => {
            this._receivedPacket(Buffer.from(data));
        });
    }
    _receivedPacket(buf) {
        // console.log("receive raw packet ", buf);
        const new_buf = Buffer.alloc(buf.length - 1);
        buf.copy(new_buf, 0, 1, buf.length);
        this._div_packet_queue.push(new_buf);
        if (this._isExecutedPacket(buf)) {
            const header_byte = Buffer.from([buf.readUInt8(0)]);
            this._div_packet_queue.unshift(header_byte);
            const total_buf = Buffer.concat(this._div_packet_queue);
            this._receivedIndicate(total_buf);
            this._div_packet_queue = [];
        }
    }
    _isExecutedPacket(buf) {
        const ph = buf.readUInt8(0);
        return ph & 0x00000001 ? true : false;
    }
    _receivedIndicate(buf) {
        const parsed = this._LinkingService.parseResponse(buf);
        // console.log("linking buf parse", buf, JSON.stringify(parsed, null, 2));
        if (!parsed) {
            return;
        }
        if (parsed.messageName.match(/_RESP$/)) {
            if (this._onresponse) {
                this._onresponse(parsed);
            }
        }
        else {
            // All notifications
            if (this._isFunction(this.onnotify)) {
                this.onnotify(parsed);
            }
            // Button
            if (parsed.serviceId === 2) {
                // PeripheralDeviceOperation Service
                if (parsed.messageId === 0) {
                    // NOTIFY_PD_OPERATION
                    // let f = this.services['button']['onnotify'];
                    let f = null;
                    if (this.services.button) {
                        if (this._isFunction(this.services.button.onnotify)) {
                            f = this.services.button.onnotify;
                        }
                    }
                    if (f) {
                        let button = null;
                        parsed.parameters.forEach((p) => {
                            if (p.parameterId === 2) {
                                // ButtonId
                                button = {
                                    buttonId: p.buttonId,
                                    buttonName: p.buttonName,
                                };
                            }
                        });
                        f(button);
                    }
                }
                // Sensors
            }
            else if (parsed.serviceId === 3) {
                // PeripheralDeviceSensorInformation Service
                if (parsed.messageId === 4) {
                    // NOTIFY_PD_SENSOR_INFO
                    let sensor_type = -1;
                    let res = {};
                    parsed.parameters.forEach((p) => {
                        const pid = p.parameterId;
                        if (pid === 2) {
                            // SensorType
                            sensor_type = p.sensorTypeCode;
                        }
                        else {
                            if (sensor_type.toString().match(/^(0|1|2)$/)) {
                                // Gyroscope, Accelerometer, Orientation
                                if (pid === 4) {
                                    // X_value
                                    res.x = p.xValue;
                                }
                                else if (pid === 5) {
                                    // Y_value
                                    res.y = p.yValue;
                                }
                                else if (pid === 6) {
                                    // Z_value
                                    res.z = p.zValue;
                                }
                            }
                            else if (sensor_type === 3) {
                                // Battery
                                res = {
                                    charge: p.charge,
                                    level: p.level,
                                };
                            }
                            else if (sensor_type === 4) {
                                // Temperature
                                res.temperature = p.temperature;
                            }
                            else if (sensor_type === 5) {
                                // Humidity
                                res.humidity = p.humidity;
                            }
                            else if (sensor_type === 6) {
                                // Aire pressure
                                res.pressure = p.pressure;
                            }
                            else if (sensor_type === 7) {
                                // Opening and closing
                                res.openclose = p.openclose;
                            }
                            else if (sensor_type === 8) {
                                // Human detection
                                res.human = p.human;
                            }
                            else if (sensor_type === 9) {
                                // Move
                                res.move = p.move;
                            }
                            else if (sensor_type === 0x0a) {
                                // Illuminance
                                res.illuminance = p.illuminance;
                            }
                        }
                    });
                    let f = null;
                    if (sensor_type === 0) {
                        if (this.services.gyroscope) {
                            f = this.services.gyroscope.onnotify;
                        }
                    }
                    else if (sensor_type === 1) {
                        if (this.services.accelerometer) {
                            f = this.services.accelerometer.onnotify;
                        }
                    }
                    else if (sensor_type === 2) {
                        if (this.services.orientation) {
                            f = this.services.orientation.onnotify;
                        }
                    }
                    else if (sensor_type === 3) {
                        if (this.services.battery) {
                            f = this.services.battery.onnotify;
                        }
                    }
                    else if (sensor_type === 4) {
                        if (this.services.temperature) {
                            f = this.services.temperature.onnotify;
                        }
                    }
                    else if (sensor_type === 5) {
                        if (this.services.humidity) {
                            f = this.services.humidity.onnotify;
                        }
                    }
                    else if (sensor_type === 6) {
                        if (this.services.pressure) {
                            f = this.services.pressure.onnotify;
                        }
                    }
                    else if (sensor_type === 7) {
                        if (this.services.openclose) {
                            f = this.services.openclose.onnotify;
                        }
                    }
                    else if (sensor_type === 8) {
                        if (this.services.human) {
                            f = this.services.human.onnotify;
                        }
                    }
                    else if (sensor_type === 9) {
                        if (this.services.move) {
                            f = this.services.move.onnotify;
                        }
                    }
                    else if (sensor_type === 0x0a) {
                        if (this.services.illuminance) {
                            f = this.services.illuminance.onnotify;
                        }
                    }
                    if (this._isFunction(f)) {
                        f(res);
                    }
                }
            }
        }
    }
    /**
     * @deprecated
     */
    disconnect() {
        return this.disconnectWait();
    }
    async disconnectWait() {
        if (this._peripheral) {
            if (this._peripheral.connected) {
                await this._peripheral.disconnectWait(); // ondisconnect will call
            }
            else {
                await this._cleanWait();
            }
        }
        else {
            await this._cleanWait();
        }
    }
    /**
     * @deprecated
     */
    _clean() {
        return this._cleanWait();
    }
    async _cleanWait() {
        const p = this._peripheral;
        if (!p) {
            return;
        }
        if (this.char_indicate) {
            await this.char_indicate.unregisterNotifyWait();
        }
        // p.removeAllListeners();
        this.connected = false;
        this._service = null;
        this.char_write = null;
        this.char_indicate = null;
        this._div_packet_queue = [];
        this._onresponse = null;
        if (p.connected) {
            await p.disconnectWait();
        }
    }
    write(message_name, params) {
        return this.writeWait(message_name, params);
    }
    async writeWait(message_name, params) {
        const buf = this._LinkingService.createRequest(message_name, params);
        if (!buf) {
            throw new Error('The specified parameters are invalid.');
        }
        const timer = setTimeout(() => {
            this._onresponse = null;
            throw new Error('Timeout');
        }, this._write_response_timeout);
        const waitResponse = new Promise((resolve, reject) => {
            this._onresponse = (res) => {
                if (res.messageName === message_name + '_RESP') {
                    this._onresponse = null;
                    clearTimeout(timer);
                    const data = this._margeResponsePrameters(res);
                    if (data) {
                        res.data = data;
                        resolve(res);
                    }
                    else {
                        throw new Error('Unknown response');
                    }
                }
            };
        });
        // console.log("linking write ", buf, message_name, JSON.stringify(params, null, 2));
        await this.char_write.writeWait(buf, true);
        return await waitResponse;
    }
    _margeResponsePrameters(res) {
        if (!res) {
            return null;
        }
        const parameters = res.parameters;
        if (parameters && Array.isArray(parameters) && parameters.length > 0) {
            const data = {};
            parameters.forEach((p) => {
                for (const k in p) {
                    if (!k.match(/^(name|parameterId)$/)) {
                        data[k] = p[k];
                    }
                }
            });
            return data;
        }
        else {
            return null;
        }
    }
    _initServices() {
        const device_name = this._peripheral.localName || '';
        // Device Name
        if (this._generic_access_service.device_name.char) {
            this.services.deviceName = {
                get: this._deviceNameSetWait.bind(this),
                set: this._deviceNameSetWait.bind(this),
            };
        }
        // Button
        if ('Button' in this.info.exsensors ||
            device_name.match(/^(Linking Board01|BLEAD-LK-TSH)/)) {
            this.services.button = {
                onnotify: null,
            };
        }
        // LED
        if ('LED' in this.info.settings) {
            const o = this.info.settings.LED;
            if (o.colors &&
                o.colors.length > 0 &&
                o.patterns &&
                o.patterns.length > 0) {
                const colors = {};
                for (let i = 0; i < o.colors.length; i++) {
                    colors[o.colors[i]] = i + 1;
                }
                const patterns = {};
                for (let i = 0; i < o.patterns.length; i++) {
                    patterns[o.patterns[i]] = i + 1;
                }
                this.services.led = {
                    colors,
                    patterns,
                    turnOn: this._ledTurnOn.bind(this),
                    turnOff: this._ledTurnOff.bind(this),
                };
            }
        }
        // Vibration
        if ('Vibration' in this.info.settings) {
            const o = this.info.settings.Vibration;
            if (o.patterns && o.patterns.length > 0) {
                const patterns = {};
                for (let i = 0; i < o.patterns.length; i++) {
                    patterns[o.patterns[i]] = i + 1;
                }
                this.services.vibration = {
                    patterns,
                    turnOn: this._vibrationTurnOn.bind(this),
                    turnOff: this._vibrationTurnOff.bind(this),
                };
            }
        }
        // Gyroscope
        if ('Gyroscope' in this.info.capabilities) {
            this.services.gyroscope = this._createSensorServiceObject(0x00);
        }
        // Accelerometer
        if ('Accelerometer' in this.info.capabilities) {
            this.services.accelerometer = this._createSensorServiceObject(0x01);
        }
        // Orientation
        if ('Orientation' in this.info.capabilities) {
            this.services.orientation = this._createSensorServiceObject(0x02);
        }
        // Battery
        if ('Battery' in this.info.capabilities) {
            this.services.battery = this._createSensorServiceObject(0x03);
        }
        // Temperature
        if ('Temperature' in this.info.capabilities) {
            this.services.temperature = this._createSensorServiceObject(0x04);
        }
        // Humidity
        if ('Humidity' in this.info.capabilities) {
            this.services.humidity = this._createSensorServiceObject(0x05);
        }
        // Atmospheric pressure
        if ('Atmospheric pressure' in this.info.capabilities) {
            this.services.pressure = this._createSensorServiceObject(0x06);
        }
        // Opening and closing
        if ('Opening and closing' in this.info.exsensors) {
            this.services.openclose = this._createSensorServiceObject(0x07);
        }
        // Human detection
        if ('Human detection' in this.info.exsensors) {
            this.services.human = this._createSensorServiceObject(0x08);
        }
        // Move
        if ('Move' in this.info.exsensors) {
            this.services.move = this._createSensorServiceObject(0x09);
        }
        // Illuminance
        if ('Illuminance' in this.info.exsensors) {
            this.services.illuminance = this._createSensorServiceObject(0x0a);
        }
    }
    /**
     * @deprecated
     */
    _deviceNameGet() {
        return this._deviceNameGetWait();
    }
    async _deviceNameGetWait() {
        const char = this._generic_access_service.device_name
            .char;
        const data = await char.readWait();
        return {
            deviceName: Buffer.from(data).toString('utf8'),
        };
    }
    /**
     * @deprecated
     * @param name
     */
    _deviceNameSet(name) {
        return this._deviceNameSetWait(name);
    }
    async _deviceNameSetWait(name) {
        if (!name) {
            throw new Error('Device name is required.');
        }
        else if (typeof name !== 'string') {
            throw new Error('Device name must be a string.');
        }
        else if (name.length > 32) {
            throw new Error('Device name is too long. The length must be in the range 1 to 32.');
        }
        const buf = Buffer.from(name, 'utf8');
        const char = this._generic_access_service.device_name
            .char;
        await char.writeWait(buf, false);
    }
    _ledTurnOn(color, pattern, duration) {
        let color_number = 1;
        if (color) {
            const colors = this.services.led.colors;
            if (typeof color === 'number') {
                for (const name in colors) {
                    if (colors[name] === color) {
                        color_number = color;
                        break;
                    }
                }
            }
            else if (typeof color === 'string') {
                if (color in colors) {
                    color_number = colors[color];
                }
            }
        }
        let pattern_number = 2;
        if (pattern) {
            const patterns = this.services.led.patterns;
            if (typeof pattern === 'number') {
                for (const name in patterns) {
                    if (patterns[name] === pattern) {
                        pattern_number = pattern;
                        break;
                    }
                }
            }
            else if (typeof pattern === 'string') {
                if (pattern in patterns) {
                    pattern_number = patterns[pattern];
                }
            }
        }
        if (!duration || typeof duration !== 'number' || duration % 1 !== 0) {
            duration = 5;
        }
        const promise = new Promise((resolve, reject) => {
            this.write('SELECT_SETTING_INFORMATION', {
                SettingInformationRequest: {
                    requestName: 'START_DEMONSTRATION',
                },
                SettingInformationData: [
                    {
                        settingName: 'LED',
                        colorNumber: color_number,
                        patternNumber: pattern_number,
                        duration,
                    },
                ],
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _ledTurnOff() {
        const promise = new Promise((resolve, reject) => {
            this.write('SELECT_SETTING_INFORMATION', {
                SettingInformationRequest: {
                    requestName: 'STOP_DEMONSTRATION',
                },
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _vibrationTurnOn(pattern, duration) {
        let pattern_number = 2;
        if (pattern) {
            const patterns = this.services.vibration.patterns;
            if (typeof pattern === 'number') {
                for (const name in patterns) {
                    if (patterns[name] === pattern) {
                        pattern_number = pattern;
                        break;
                    }
                }
            }
            else if (typeof pattern === 'string') {
                if (pattern in patterns) {
                    pattern_number = patterns[pattern];
                }
            }
        }
        if (!duration || typeof duration !== 'number' || duration % 1 !== 0) {
            duration = 5;
        }
        const promise = new Promise((resolve, reject) => {
            this.write('SELECT_SETTING_INFORMATION', {
                SettingInformationRequest: {
                    requestName: 'START_DEMONSTRATION',
                },
                SettingInformationData: [
                    {
                        settingName: 'Vibration',
                        patternNumber: pattern_number,
                        duration,
                    },
                ],
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _vibrationTurnOff() {
        const promise = new Promise((resolve, reject) => {
            this.write('SELECT_SETTING_INFORMATION', {
                SettingInformationRequest: {
                    requestName: 'STOP_DEMONSTRATION',
                },
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _createSensorServiceObject(sensor_type) {
        return {
            onnotify: null,
            start: () => {
                return this._setNotifySensorInfo(sensor_type, 1);
            },
            stop: () => {
                return this._setNotifySensorInfo(sensor_type, 0);
            },
            get: () => {
                return this._getSensorInfo(sensor_type);
            },
        };
    }
    _setNotifySensorInfo(sensor_type, status) {
        const promise = new Promise((resolve, reject) => {
            this.write('SET_NOTIFY_SENSOR_INFO', {
                SensorType: sensor_type,
                Status: status,
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
    _getSensorInfo(sensor_type) {
        const promise = new Promise((resolve, reject) => {
            this.write('GET_SENSOR_INFO', {
                SensorType: sensor_type,
            })
                .then((res) => {
                if (sensor_type.toString().match(/^(0|1|2)$/)) {
                    // Gyroscope, Accelerometer, Orientation
                    const d = res.data;
                    const data = {
                        x: d.xValue,
                        y: d.yValue,
                        z: d.zValue,
                    };
                    resolve(data);
                }
                else {
                    resolve(res.data);
                }
            })
                .catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
}
exports.default = LinkingDevice;
