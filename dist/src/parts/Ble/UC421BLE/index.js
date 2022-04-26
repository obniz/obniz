"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = require("eventemitter3");
class UC421BLE {
    constructor(peripheral) {
        if (!peripheral || !UC421BLE.isDevice(peripheral)) {
            throw new Error('peripheral is not UC421BLE');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'UC421BLE',
        };
    }
    static isDevice(peripheral) {
        return (peripheral.localName && peripheral.localName.startsWith('UC-421BLE_'));
    }
    async connectingWait() {
        if (!this._peripheral) {
            throw new Error('UC421BLE not found');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
    }
    async pairingWait() {
        if (!this._peripheral) {
            throw new Error('UC421BLE not found');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        let key = null;
        await this._peripheral.connectWait({
            pairingOption: {
                onPairedCallback: (pairingKey) => {
                    key = pairingKey;
                },
            },
        });
        return key;
    }
    async aquireNewUserNoWait(cc) {
        const ccArr = this._toCcArr(cc);
        let no = null;
        const opcodeRegister = 0x01;
        const opcodeResponse = 0x20;
        const responseValueSuccess = 0x01;
        const responseValueErrorInvalidParameter = 0x03;
        const responseValueErrorOperationFailed = 0x04;
        const _analyzeData = (data) => {
            const opcode = data[0];
            const requestedOpcode = data[1];
            const responseValue = data[2];
            if (opcode === opcodeResponse && requestedOpcode === opcodeRegister) {
                if (responseValue === responseValueSuccess) {
                    const responseParameter = data[3];
                    no = responseParameter;
                }
                else {
                    switch (responseValue) {
                        case responseValueErrorInvalidParameter:
                            throw new Error('cc is too long or payload too big.');
                        case responseValueErrorOperationFailed:
                            throw new Error('All user no are already used.');
                        default:
                            throw new Error('Unkonw response value.');
                    }
                }
            }
        };
        const userControlPointChar = await this._getUserControlPointCharWait();
        await userControlPointChar.registerNotifyWait(_analyzeData);
        await userControlPointChar.writeWait([opcodeRegister, ...ccArr]);
        if (!no)
            throw new Error('Failed to register new user.');
        return no;
    }
    async authorizeUserWait(userNo, cc) {
        let authorized = false;
        const ccArr = this._toCcArr(cc);
        const opcodeAuthorize = 0x02;
        const opcodeResponse = 0x20;
        const responseValueSuccess = 0x01;
        const responseValueErrorPayloadTooLong = 0x03;
        const responseValueErrorFailedThreeTimes = 0x04;
        const responseValueErrorCcMismatch = 0x05;
        const evtEmitter = new eventemitter3_1.EventEmitter();
        const waitNotification = new Promise((res, rej) => evtEmitter.on('notified', res));
        const _analyzeData = (data) => {
            const opcode = data[0];
            const requestedOpcode = data[1];
            const responseValue = data[2];
            if (opcode === opcodeResponse && requestedOpcode === opcodeAuthorize) {
                if (responseValue === responseValueSuccess) {
                    authorized = true;
                    evtEmitter.emit('notified');
                }
                else {
                    switch (responseValue) {
                        case responseValueErrorPayloadTooLong:
                            throw new Error('Requested data is too long.');
                        case responseValueErrorFailedThreeTimes:
                            throw new Error('Failed authorization three times in a row.');
                        case responseValueErrorCcMismatch:
                            throw new Error('Given cc mismatches to one of given user no.');
                        default:
                            throw new Error('Unknown response value.');
                    }
                }
            }
        };
        const userControlPointChar = await this._getUserControlPointCharWait();
        await userControlPointChar.registerNotifyWait(_analyzeData);
        await userControlPointChar.writeWait([opcodeAuthorize, userNo, ...ccArr]);
        await waitNotification;
        if (!authorized)
            throw new Error('Authorization failed.');
    }
    async updateUserInfoDataWait(userInfo) {
        const updateFunctions = [];
        // update check inputs
        if (userInfo.firstName) {
            const buf = Buffer.from(userInfo.firstName, 'utf-8');
            const arr = Array.from(buf);
            // validation, max 20 bytes
            if (arr.length > 20)
                throw new Error('The length of first name should be within 20 bytes.');
            const updateFirstName = async () => {
                const firstNameChar = await this._getFirstNameCharWait();
                await firstNameChar.writeWait(arr);
            };
            updateFunctions.push(updateFirstName);
        }
        if (userInfo.lastName) {
            const buf = Buffer.from(userInfo.lastName, 'utf-8');
            // validation, max 20 bytes
            if (buf.length > 20)
                throw new Error('The length of last name should be within 20 bytes.');
            const updateLastName = async () => {
                const lastNameChar = await this._getLastNameCharWait();
                await lastNameChar.writeWait(buf);
            };
            updateFunctions.push(updateLastName);
        }
        if (userInfo.email) {
            const buf = Buffer.from(userInfo.email, 'utf-8');
            // validation, max 20 bytes
            if (buf.length > 16)
                throw new Error('The length of email should be within 16 bytes.');
            const updateEmail = async () => {
                const emailChar = await this._getEmailCharWait();
                await emailChar.writeWait(buf);
            };
            updateFunctions.push(updateEmail);
        }
        if (userInfo.birth) {
            const { year, month, day } = userInfo.birth;
            // TODO: validate the values
            // 1977, 1, 2 -> [0xB9, 0x07, 0x01, 0x02]
            const buf = Buffer.alloc(4);
            buf.writeUInt16LE(year, 0);
            buf.writeUInt8(month, 2);
            buf.writeUInt8(day, 3);
            const arr = Array.from(buf);
            const updateBirth = async () => {
                const birthChar = await this._getBirthCharWait();
                await birthChar.writeWait(arr);
            };
            updateFunctions.push(updateBirth);
        }
        if (userInfo.gender) {
            const arr = new Array(1);
            switch (userInfo.gender) {
                case 'male':
                    arr[0] = 0x00;
                    break;
                case 'female':
                    arr[0] = 0x01;
                    break;
                case 'unspecified':
                    // NOTE: The peripheral won't mesure the body composition data in this case.
                    arr[0] = 0x02;
                    break;
                default:
                    throw new Error('Unknown gender.');
            }
            const updateGender = async () => {
                const genderChar = await this._getGenderCharWait();
                await genderChar.writeWait(arr);
            };
            updateFunctions.push(updateGender);
        }
        if (userInfo.height) {
            // Acceptable value ranges from 90 to 220.
            const buf = Buffer.alloc(2);
            buf.writeUInt16LE(userInfo.height, 0);
            const arr = Array.from(buf);
            const updateHeight = async () => {
                const heightChar = await this._getHeightCharWait();
                await heightChar.writeWait(arr);
            };
            updateFunctions.push(updateHeight);
        }
        // update the info
        for (const updateFunc of updateFunctions) {
            await updateFunc();
        }
    }
    async getUserInfoDataWait() {
        const firstNameChar = await this._getFirstNameCharWait();
        const lastNameChar = await this._getLastNameCharWait();
        const emailChar = await this._getEmailCharWait();
        const birthChar = await this._getBirthCharWait();
        const heightChar = await this._getHeightCharWait();
        const genderChar = await this._getGenderCharWait();
        const firstNameBytes = await firstNameChar.readWait();
        const lastNameBytes = await lastNameChar.readWait();
        const emailBytes = await emailChar.readWait();
        const birthBytes = await birthChar.readWait();
        const heightBytes = await heightChar.readWait();
        const genderBytes = await genderChar.readWait();
        const firstName = String.fromCharCode(...firstNameBytes);
        const lastName = String.fromCharCode(...lastNameBytes);
        const email = String.fromCharCode(...emailBytes);
        const bufBirth = Buffer.from(birthBytes);
        const birth = {
            year: bufBirth.readUInt16LE(0),
            month: bufBirth.readUInt8(2),
            day: bufBirth.readUInt8(3),
        };
        const bHeight = Buffer.from(heightBytes);
        const height = bHeight.readInt16LE(0);
        let gender = 'unspecified';
        switch (genderBytes[0]) {
            case 0x00:
                gender = 'male';
                break;
            case 0x01:
                gender = 'female';
                break;
        }
        const userInfo = {
            firstName,
            lastName,
            email,
            birth,
            height,
            gender,
        };
        return userInfo;
    }
    async getWeightDataWait() {
        const results = [];
        const evtEmitter = new eventemitter3_1.EventEmitter();
        const weightScaleChar = await this._getWeightScaleMeasurementCharWait();
        const waitGettingAllData = new Promise((resolve, reject) => evtEmitter.on('gettingAllData', async () => {
            await weightScaleChar.unregisterNotifyWait();
            resolve(results);
        }));
        const emit = [
            () => evtEmitter.emit('gettingAllData'),
            500,
        ];
        let timeoutId = setTimeout(...emit);
        const _analyzeData = (data) => {
            const result = {};
            const buf = Buffer.from(data);
            let offset = 0;
            // flags
            const flags = buf.readUInt8(offset);
            const bit0 = 0b00000001;
            const bit1 = 0b00000010;
            const bit2 = 0b00000100;
            const bit3 = 0b00001000;
            const measurementUnit = flags & bit0 ? 'lb' : 'kg';
            const timeStampPresent = flags & bit1 ? true : false;
            const userIdPresent = flags & bit2 ? true : false;
            const bmiAndHeightPresent = flags & bit3 ? true : false;
            const byteLenFlags = 1;
            offset += byteLenFlags;
            // get weight
            const resolutionWeight = measurementUnit === 'kg' ? 0.005 : 0.01;
            const weightMass = buf.readUInt16LE(offset);
            const weight = weightMass * resolutionWeight;
            const byteLenWeight = 2;
            offset += byteLenWeight;
            result.weight = { unit: measurementUnit, value: weight };
            // get ts
            if (timeStampPresent) {
                const year = buf.readUInt16LE(offset);
                const byteLenYear = 2;
                offset += byteLenYear;
                const month = buf.readUInt8(offset);
                const byteLenMonth = 1;
                offset += byteLenMonth;
                const day = buf.readUInt8(offset);
                const byteLenDay = 1;
                offset += byteLenDay;
                const hour = buf.readUInt8(offset);
                const byteLenHour = 1;
                offset += byteLenHour;
                const minute = buf.readUInt8(offset);
                const byteLenMinute = 1;
                offset += byteLenMinute;
                const second = buf.readUInt8(offset);
                const byteLenSecond = 1;
                offset += byteLenSecond;
                result.timestamp = {
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    second,
                };
            }
            if (userIdPresent) {
                // Do nothing about user id.
                const byteLenUserId = 1;
                offset += byteLenUserId;
            }
            // get bmi
            if (bmiAndHeightPresent) {
                const resolutionBmi = 0.1;
                const bmiMass = buf.readUInt16LE(offset);
                const bmi = bmiMass * resolutionBmi;
                const byteLenBmi = 2;
                offset += byteLenBmi;
                const resolutionHeight = 0.1;
                const heightMass = buf.readUInt16LE(offset);
                const height = heightMass * resolutionHeight;
                const byteLenHeight = 2;
                offset += byteLenHeight;
                result.bmi = bmi;
                result.height = height;
            }
            return result;
        };
        // weight
        await weightScaleChar.registerNotifyWait((data) => {
            clearTimeout(timeoutId);
            results.push(_analyzeData(data));
            timeoutId = setTimeout(...emit);
        });
        return await waitGettingAllData;
    }
    async getBodyCompositionDataWait() {
        const enableCccd = 0x01;
        const results = [];
        const _analyzeData = (data) => {
            const result = {};
            console.log(data);
            const buf = Buffer.from(data);
            let offset = 0;
            // flags
            const flags = buf.readUInt16LE(offset);
            // add a leading 0 to make it more readable
            const bit00 = 0b0000000000000001;
            const bit01 = 0b0000000000000010;
            const bit02 = 0b0000000000000100;
            const bit03 = 0b0000000000001000;
            const bit04 = 0b0000000000010000;
            const bit05 = 0b0000000000100000;
            const bit06 = 0b0000000001000000;
            const bit07 = 0b0000000010000000;
            const bit08 = 0b0000000100000000;
            const bit09 = 0b0000001000000000;
            const bit10 = 0b0000010000000000;
            const bit11 = 0b0000100000000000;
            const bit12 = 0b0001000000000000;
            // some flags are not used but write them to make it more readable
            const measurementUnit = flags & bit00 ? 'lb' : 'kg';
            const timeStampPresent = flags & bit01 ? true : false;
            const userIdPresent = flags & bit02 ? true : false;
            const basalMetabolismPresent = flags & bit03 ? true : false;
            const musclePercentagePresent = flags & bit04 ? true : false; // not used
            const mascleMassPresent = flags & bit05 ? true : false;
            const fatFreeMassPresent = flags & bit06 ? true : false; // not used
            const softLeanMassPresent = flags & bit07 ? true : false; // not used
            const bodyWaterMassPresent = flags & bit08 ? true : false;
            const impedancePresent = flags & bit09 ? true : false; // not used
            const weightPresent = flags & bit10 ? true : false; // not used
            const heightPresent = flags & bit11 ? true : false; // not used
            const multiplePacketPresent = flags & bit12 ? true : false; // not used
            const byteLenFlags = 2;
            offset += byteLenFlags;
            // body fat percentage
            const resolutionBodyFatPercentage = 0.1;
            const bodyFatPercentageInt = buf.readUInt16LE(offset);
            const bodyFatPercentageFloat = bodyFatPercentageInt * resolutionBodyFatPercentage;
            const byteLenBodyFatPercentage = 2;
            offset += byteLenBodyFatPercentage;
            result.bodyFatPercentage = bodyFatPercentageFloat;
            // ts
            if (timeStampPresent) {
                const year = buf.readUInt16LE(offset);
                const byteLenYear = 2;
                offset += byteLenYear;
                const month = buf.readUInt8(offset);
                const byteLenMonth = 1;
                offset += byteLenMonth;
                const day = buf.readUInt8(offset);
                const byteLenDay = 1;
                offset += byteLenDay;
                const hour = buf.readUInt8(offset);
                const byteLenHour = 1;
                offset += byteLenHour;
                const minute = buf.readUInt8(offset);
                const byteLenMinute = 1;
                offset += byteLenMinute;
                const second = buf.readUInt8(offset);
                const byteLenSecond = 1;
                offset += byteLenSecond;
                result.timestamp = {
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    second,
                };
            }
            if (userIdPresent) {
                // Do nothing about user id.
                const byteLenUserId = 1;
                offset += byteLenUserId;
            }
            // basal metabolism
            if (basalMetabolismPresent) {
                const basalMetabolismInt = buf.readUInt16LE(offset); // resolution is 1
                const byteLenBasalMetabolism = 2;
                offset += byteLenBasalMetabolism;
                result.basalMetabolismKj = basalMetabolismInt;
            }
            // mascle mass
            if (mascleMassPresent) {
                const resolutionMascleMass = measurementUnit === 'kg' ? 0.005 : 0.01;
                const mascleMassInt = buf.readUInt16LE(offset);
                const mascleMassFloat = mascleMassInt * resolutionMascleMass;
                const byteLenMascleMass = 2;
                offset += byteLenMascleMass;
                result.muscleMass = { unit: measurementUnit, value: mascleMassFloat };
            }
            // body water mass
            if (bodyWaterMassPresent) {
                const resolutionBodyWaterMass = measurementUnit === 'kg' ? 0.005 : 0.01;
                const bodyWaterMassInt = buf.readUInt16LE(offset);
                const bodyWaterMassFloat = bodyWaterMassInt * resolutionBodyWaterMass;
                const byteLenBodyWaterMass = 2;
                offset += byteLenBodyWaterMass;
                result.bodyWaterMass = {
                    unit: measurementUnit,
                    value: bodyWaterMassFloat,
                };
            }
            return result;
        };
        const bodyCompositionChar = await this._getBodyCompositionMeasurementCharWait();
        await bodyCompositionChar.registerNotifyWait((data) => {
            results.push(_analyzeData(data));
        });
        const bodyCompositionCccd = bodyCompositionChar.getDescriptor('2902');
        if (!bodyCompositionCccd)
            throw new Error('Failed to get cccd of body composition charactaristic.');
        // The data is notified as soon as cccd is enabled.
        await bodyCompositionCccd.writeWait([enableCccd]);
        return results;
    }
    async changeRunningModeWait(mode) {
        const runningMode = {
            measurement: 0x02,
            setting: 0x03,
        };
        if (!runningMode[mode])
            throw new Error('Unknown mode passed in.');
        const aAndDCustomNotificationChar = await this._getAAndDCustomNotificationCharWait();
        const aAndDCustomWriteReadChar = await this._getAAndDCustomWriteReadCharWait();
        const cmdDirectionPeriToObniz = 0x00;
        const cmdDirectionObnizToPeri = 0x01;
        const cmd = 0x05;
        const cmdId = 0x0a;
        const evtEmitter = new eventemitter3_1.EventEmitter();
        const waitNotification = new Promise((res, rej) => evtEmitter.on('notified', res));
        const _analyzeData = (data) => {
            const lenNotifiedCmd = 0x04;
            const resultOk = 0x00;
            const cmdOk = [
                lenNotifiedCmd,
                cmdDirectionPeriToObniz,
                cmd,
                cmdId,
                resultOk,
            ];
            if (data.length === cmdOk.length &&
                data[0] === lenNotifiedCmd &&
                data[1] === cmdDirectionPeriToObniz &&
                data[2] === cmd &&
                data[3] === cmdId) {
                if (data[4] === resultOk) {
                    evtEmitter.emit('notified');
                }
                else {
                    throw new Error('Failed to change running mode.');
                }
            }
        };
        await aAndDCustomNotificationChar.registerNotifyWait(_analyzeData);
        const lenWriteCmd = 0x04;
        await aAndDCustomWriteReadChar.writeWait([
            lenWriteCmd,
            cmdDirectionObnizToPeri,
            cmd,
            cmdId,
            runningMode[mode],
        ]);
        await waitNotification;
    }
    async setMedicalExamModeWait(mode) {
        // NOTE: We have to go into 'setting' mode before configuring this mode.
        if (!(mode === 'on' || mode === 'off'))
            throw new Error("mode should be either 'on' or 'off'");
        const aAndDCustomNotificationChar = await this._getAAndDCustomNotificationCharWait();
        const aAndDCustomWriteReadChar = await this._getAAndDCustomWriteReadCharWait();
        const cmdDirectionPeriToObniz = 0x00;
        const cmdDirectionObnizToPeri = 0x01;
        const cmd = 0x05;
        const cmdId = 0x28;
        const cmdOff = 0x00;
        const cmdOn = 0x01;
        const evtEmitter = new eventemitter3_1.EventEmitter();
        const waitNotification = new Promise((res, rej) => evtEmitter.on('notified', res));
        const _analyzeData = (data) => {
            const lenNotifiedCmd = 0x04;
            const resultOk = 0x00;
            const cmdOk = [
                lenNotifiedCmd,
                cmdDirectionPeriToObniz,
                cmd,
                cmdId,
                resultOk,
            ];
            if (data.length === cmdOk.length &&
                data[0] === lenNotifiedCmd &&
                data[1] === cmdDirectionPeriToObniz &&
                data[2] === cmd &&
                data[3] === cmdId) {
                if (data[4] === resultOk) {
                    evtEmitter.emit('notified');
                }
                else {
                    throw new Error('Failed to set medical exam mode.');
                }
            }
        };
        await aAndDCustomNotificationChar.registerNotifyWait(_analyzeData);
        const lenWriteCmd = 0x04;
        await aAndDCustomWriteReadChar.writeWait([
            lenWriteCmd,
            cmdDirectionObnizToPeri,
            cmd,
            cmdId,
            mode === 'on' ? cmdOn : cmdOff,
        ]);
        await waitNotification;
    }
    // temp use
    async getMedicalExamModeSettingWait() {
        const aAndDCustomWriteReadChar = await this._getAAndDCustomWriteReadCharWait();
        const aAndDCustomNotificationChar = await this._getAAndDCustomNotificationCharWait();
        const evtEmitter = new eventemitter3_1.EventEmitter();
        const waitNotification = new Promise((res, rej) => evtEmitter.on('notified', res));
        let setting = 'failed';
        const _analyzeData = (data) => {
            setting = data[4] === 0x01 ? 'on' : 'off';
            evtEmitter.emit('notified');
        };
        await aAndDCustomNotificationChar.registerNotifyWait(_analyzeData);
        await aAndDCustomWriteReadChar.writeWait([0x03, 0x01, 0x05, 0x29]);
        await waitNotification;
        return setting;
    }
    async disconnectWait() {
        await this._peripheral.disconnectWait();
    }
    /*
      PRIVSTE METHODS
    */
    // utils
    _toCcArr(cc) {
        if (cc < 0 || cc > 9999) {
            throw new Error('cc must be within the range from 0000 to 9999.');
        }
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(cc, 0);
        const ccArr = Array.from(buf);
        return ccArr;
    }
    // services
    async _getUserDataServiceWait() {
        const userDataService = this._peripheral.getService('181C');
        if (!userDataService)
            throw new Error('Failed to get UserDataService.');
        return userDataService;
    }
    async _getWeightScaleServiceWait() {
        const weightScaleService = this._peripheral.getService('181D');
        if (!weightScaleService)
            throw new Error('Failed to get WeightScaleService.');
        return weightScaleService;
    }
    async _getBodyCompositionServiceWait() {
        const bodyCompositionService = this._peripheral.getService('181B');
        if (!bodyCompositionService)
            throw new Error('Failed to get BodyCompositionService.');
        return bodyCompositionService;
    }
    async _getAAndDCustomServiceWait() {
        const aAndDCustomService = this._peripheral.getService('11127000-B364-11E4-AB27-0800200C9A66');
        if (!aAndDCustomService)
            throw new Error('Failed to get AAndDCustomService.');
        return aAndDCustomService;
    }
    // charactaristics
    async _getUserControlPointCharWait() {
        const userDataService = await this._getUserDataServiceWait();
        const userControlPointChar = userDataService.getCharacteristic('2A9F');
        if (!userControlPointChar)
            throw new Error('Failed to get UserControlPoint charactaristic.');
        return userControlPointChar;
    }
    async _getFirstNameCharWait() {
        const userDataService = await this._getUserDataServiceWait();
        const fistNameChar = userDataService.getCharacteristic('2A8A');
        if (!fistNameChar)
            throw new Error('Failed to get FirstName charactaristic.');
        return fistNameChar;
    }
    async _getLastNameCharWait() {
        const userDataService = await this._getUserDataServiceWait();
        const lastNameChar = userDataService.getCharacteristic('2A90');
        if (!lastNameChar)
            throw new Error('Failed to get LastName charactaristic.');
        return lastNameChar;
    }
    async _getEmailCharWait() {
        const userDataService = await this._getUserDataServiceWait();
        const emailChar = userDataService.getCharacteristic('2A87');
        if (!emailChar)
            throw new Error('Failed to get Email charactaristic.');
        return emailChar;
    }
    async _getBirthCharWait() {
        const userDataService = await this._getUserDataServiceWait();
        const birthChar = userDataService.getCharacteristic('2A85');
        if (!birthChar)
            throw new Error('Failed to get Birth charactaristic.');
        return birthChar;
    }
    async _getGenderCharWait() {
        const userDataService = await this._getUserDataServiceWait();
        const genderChar = userDataService.getCharacteristic('2A8C');
        if (!genderChar)
            throw new Error('Failed to get Gender charactaristic.');
        return genderChar;
    }
    async _getHeightCharWait() {
        const userDataService = await this._getUserDataServiceWait();
        const heightChar = userDataService.getCharacteristic('2A8E');
        if (!heightChar)
            throw new Error('Failed to get Height charactaristic.');
        return heightChar;
    }
    async _getWeightScaleMeasurementCharWait() {
        const weightScaleService = await this._getWeightScaleServiceWait();
        const weightScaleMeasurementChar = weightScaleService.getCharacteristic('2A9D');
        if (!weightScaleMeasurementChar)
            throw new Error('Failed to get Weight Measurement charactaristic.');
        return weightScaleMeasurementChar;
    }
    async _getBodyCompositionMeasurementCharWait() {
        const bodyCompositionService = await this._getBodyCompositionServiceWait();
        const bodyCompositionMeasurementChar = bodyCompositionService.getCharacteristic('2A9C');
        if (!bodyCompositionMeasurementChar)
            throw new Error('Failed to get Body Composition Measurement charactaristic.');
        return bodyCompositionMeasurementChar;
    }
    async _getAAndDCustomWriteReadCharWait() {
        const aAndDCustomService = await this._getAAndDCustomServiceWait();
        const aAndDCustomWriteReadChar = aAndDCustomService.getCharacteristic('11127001-B364-11E4-AB27-0800200C9A66');
        if (!aAndDCustomWriteReadChar)
            throw new Error('Failed to get A&D Custom Read Write charactaristic.');
        return aAndDCustomWriteReadChar;
    }
    async _getAAndDCustomNotificationCharWait() {
        const aAndDCustomService = await this._getAAndDCustomServiceWait();
        const aAndDCustomNotificationChar = aAndDCustomService.getCharacteristic('11127002-B364-11E4-AB27-0800200C9A66');
        if (!aAndDCustomNotificationChar)
            throw new Error('Failed to get A&D Custom Notification charactaristic.');
        return aAndDCustomNotificationChar;
    }
}
exports.default = UC421BLE;
