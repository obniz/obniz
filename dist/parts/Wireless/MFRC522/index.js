"use strict";
/* ver 1.0
 * 2019/10/14
 * Created by Zjalic
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*jshint esversion: 8 */
const OK = true;
const ERROR = false;
class MFRC522 {
    constructor() {
        // PCD commands. Described in chapter 10 of the datasheet.
        // PCD(Proximity Coupling Device): NXP MFRC522 Contactless Reader IC.
        this.PCD_Idle = 0x00; // no action, cancels current command execution.
        this.PCD_Mem = 0x01; // stores 25 bytes into the internal buffer.
        this.PCD_GenerateRandomID = 0x02; // generates a 10-byte random ID number.
        this.PCD_CalcCRC = 0x03; // activates the CRC coprocessor or performs a self-test.
        this.PCD_Transmit = 0x04; // transmits data from the FIFO buffer.
        this.PCD_NoCmdChange = 0x07; // no command change, can be used to modify the CommandReg register bits without affecting the command, for example, the PowerDown bit.
        this.PCD_Receive = 0x08; // activates the receiver circuits.
        this.PCD_Transceive = 0x0c; // transmits data from FIFO buffer to antenna and automatically activates the receiver after transmission.
        // this.PCD_Reserved0Dh = 0x0D;
        this.PCD_MFAuthent = 0x0e; // performs the MIFARE standard authentication as a reader.
        this.PCD_SoftReset = 0x0f; // resets the MFRC522.
        // MFRC522 RxGain[2:0] masks, defines the receiver's signal voltage gain factor (on the PCD).
        // Described in 9.3.3.6 / table 98 of the datasheet at http://www.nxp.com/documents/data_sheet/MFRC522.pdf
        this.RxGain_18dB = 0x00 << 4; // 000b - 18 dB, minimum.
        this.RxGain_23dB = 0x01 << 4; // 001b - 23 dB.
        this.RxGain_18dB_2 = 0x02 << 4; // 010b - 18 dB, it seems 010b is a duplicate for 000b.
        this.RxGain_23dB_2 = 0x03 << 4; // 011b - 23 dB, it seems 011b is a duplicate for 001b.
        this.RxGain_33dB = 0x04 << 4; // 100b - 33 dB, average, and typical default.
        this.RxGain_38dB = 0x05 << 4; // 101b - 38 dB.
        this.RxGain_43dB = 0x06 << 4; // 110b - 43 dB.
        this.RxGain_48dB = 0x07 << 4; // 111b - 48 dB, maximum.
        this.RxGain_min = 0x00 << 4; // 000b - 18 dB, minimum, convenience for RxGain_18dB.
        this.RxGain_avg = 0x04 << 4; // 100b - 33 dB, average, convenience for RxGain_33dB.
        this.RxGain_max = 0x07 << 4; // 111b - 48 dB, maximum, convenience for RxGain_48dB.
        // The PICC commands used by the PCD to manage communication with several PICCs (ISO 14443-3, Type A, section 6.4).
        this.PICC_REQA = 0x26; // REQuest command, Type A. Invites PICCs in state IDLE to go to READY and prepare for anticollision or selection. 7 bit frame.
        this.PICC_WUPA = 0x52; // Wake-UP command, Type A. Invites PICCs in state IDLE and HALT to go to READY(*) and prepare for anticollision or selection. 7 bit frame.
        this.PICC_CT = 0x88; // Cascade Tag. Not really a command, but used during anti collision.
        this.PICC_SEL_CL1 = 0x93; // Anti collision/Select, Cascade Level 1.
        this.PICC_SEL_CL2 = 0x95; // Anti collision/Select, Cascade Level 2.
        this.PICC_SEL_CL3 = 0x97; // Anti collision/Select, Cascade Level 3.
        this.PICC_HLTA = 0x50; // HaLT command, Type A. Instructs an ACTIVE PICC to go to state HALT.
        this.PICC_RATS = 0xe0; // Request command for Answer To Reset.
        // The commands used for MIFARE Classic (from http://www.mouser.com/ds/2/302/MF1S503x-89574.pdf, Section 9)
        // Use PCD_MFAuthent to authenticate access to a sector, then use these commands to read/write/modify the blocks on the sector.
        // The read/write commands can also be used for MIFARE Ultralight.
        this.PICC_AUTH_KEYA = 0x60; // Perform authentication with Key A.
        this.PICC_AUTH_KEYB = 0x61; // Perform authentication with Key B.
        this.PICC_READ = 0x30; // Reads one 16 byte block from the authenticated sector of the PICC. Also used for MIFARE Ultralight.
        this.PICC_WRITE = 0xa0; // Writes one 16 byte block to the authenticated sector of the PICC. Called "COMPATIBILITY WRITE" for MIFARE Ultralight.
        this.PICC_DECREMENT = 0xc0; // Decrements the contents of a block and stores the result in the internal data register.
        this.PICC_INCREMENT = 0xc1; // Increments the contents of a block and stores the result in the internal data register.
        this.PICC_RESTORE = 0xc2; // Reads the contents of a block into the internal data register.
        this.PICC_TRANSFER = 0xb0; // Writes the contents of the internal data register to a block.
        // The commands used for MIFARE Ultralight (from http://www.nxp.com/documents/data_sheet/MF0ICU1.pdf, Section 8.6)
        // The PICC_CMD_MF_READ and PICC_CMD_MF_WRITE can also be used for MIFARE Ultralight.
        this.PICC_UL_WRITE = 0xa2; // Writes one 4 byte page to the PICC.
        this.PICC_SElECTTAG = 0x93;
        // Page 0: Command and status
        // this.Reserved00h = 0x00;
        this.CommandReg = 0x01;
        this.ComlEnReg = 0x02;
        this.DivlEnReg = 0x03;
        this.ComIrqReg = 0x04;
        this.DivIrqReg = 0x05;
        this.ErrorReg = 0x06;
        this.Status1Reg = 0x07;
        this.Status2Reg = 0x08;
        this.FIFODataReg = 0x09;
        this.FIFOLevelReg = 0x0a;
        this.WaterLevelReg = 0x0b;
        this.ControlReg = 0x0c;
        this.BitFramingReg = 0x0d;
        this.CollReg = 0x0e;
        // this.Reserved0Fh = 0x0F;
        // Page 1: Command
        // this.Reserved10h = 0x10;
        this.ModeReg = 0x11;
        this.TxModeReg = 0x12;
        this.RxModeReg = 0x13;
        this.TxControlReg = 0x14;
        this.TxASKReg = 0x15;
        this.TxSelReg = 0x16;
        this.RxSelReg = 0x17;
        this.RxThresholdReg = 0x18;
        this.DemodReg = 0x19;
        this.Reserved1Ah = 0x1a;
        this.Reserved1Bh = 0x1b;
        this.MfTxReg = 0x1c;
        this.MfRxReg = 0x1d;
        this.Reserved1Eh = 0x1e;
        this.SerialSpeedReg = 0x1f;
        // Page 2: Configuration
        // this.Reserved20h = 0x20;
        this.CRCResultRegMSB = 0x21;
        this.CRCResultRegLSB = 0x22;
        // this.Reserved23h = 0x23;
        this.ModWidthReg = 0x24;
        // this.Reserved25h = 0x25;
        this.RFCfgReg = 0x26;
        this.GsNReg = 0x27;
        this.CWGsPReg = 0x28;
        this.ModGsPReg = 0x29;
        this.TModeReg = 0x2a;
        this.TPrescalerReg = 0x2b;
        this.TReloadRegHi = 0x2c;
        this.TReloadRegLo = 0x2d;
        this.TCounterValRegHi = 0x2e;
        this.TCounterValRegLo = 0x2f;
        // Page 3: Test register
        // this.Reserved30h = 0x30;
        this.TestSel1Reg = 0x31;
        this.TestSel2Reg = 0x32;
        this.TestPinEnReg = 0x33;
        this.TestPinValueReg = 0x34;
        this.TestBusReg = 0x35;
        this.AutoTestReg = 0x36;
        this.VersionReg = 0x37;
        this.AnalogTestReg = 0x38;
        this.TestDAC1Reg = 0x39;
        this.TestDAC2Reg = 0x3a;
        this.TestADCReg = 0x3b;
        // this.Reserved3Ch = 0x3C;
        // this.Reserved3Dh = 0x3D;
        // this.Reserved3Eh = 0x3E;
        // this.Reserved3Fh = 0x3F;
        // required pin of obniz
        this.keys = [
            'cs',
            'clk',
            'mosi',
            'miso',
            'rst',
            'vcc',
            'gnd',
            'spi',
            'spi_frequency',
        ];
        this.required = ['cs', 'mosi', 'miso', 'rst'];
    }
    static info() {
        return {
            name: 'MFRC522',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // IO pin settings
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.rst = obniz.getIO(this.params.rst);
        // SPI settings
        this.cs = obniz.getIO(this.params.cs);
        this.cs.output(true);
        this.params.mode = 'master';
        this.params.drive = '3v';
        this.params.pull = '3v';
        this.params.frequency = this.params.spi_frequency || 5 * 1000 * 1000;
        this.spi = this.obniz.getSpiWithConfig(this.params);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initializes the MFRC522 chip
            // Hardware and Software reset
            this.rst.output(false);
            yield this.obniz.wait(50); // 8.8.2 says the oscillator start-up time is the start up time of the crystal + 37,74us: 50ms.
            this.rst.output(true);
            this.writeRegister(this.CommandReg, this.PCD_SoftReset);
            // Timer setup: When communicating with a PICC we need a timeout if something goes wrong.
            // f_timer = 13.56 MHz / (2*TPreScaler+1) where TPreScaler = [TPrescaler_Hi:TPrescaler_Lo].
            this.writeRegister(this.TModeReg, 0x80); // TAuto=1; timer starts automatically at the end of the transmission in all communication modes at all speeds
            this.writeRegister(this.TPrescalerReg, 0xa9); // TPreScaler = TModeReg[3..0]: TPrescalerReg, ie 0x0A9 = 169 => f_timer=40kHz, ie a timer period of 25us.
            this.writeRegister(this.TReloadRegHi, 0x03);
            this.writeRegister(this.TReloadRegLo, 0xe8); // Reload timer with 0x3E8 = 1000, ie. 25ms before timeout
            this.writeRegister(this.TxASKReg, 0x40); // Default 0x00. Force a 100 % ASK modulation independent of the ModGsPReg register setting
            this.writeRegister(this.ModeReg, 0x3d); // Default 0x3F. Set the preset value for the CRC coprocessor for the CalcCRC command to 0x6363 (6.2.4)
            yield this.antennaOn(); // Enable the antenna driver pins TX1 and TX2 (they were disabled by the reset)
        });
    }
    writeRegister(addr, val) {
        let data;
        if (val instanceof Array) {
            // If val is Array
            data = [(addr << 1) & 0x7e].concat(val);
        }
        else {
            data = [(addr << 1) & 0x7e, val];
        }
        this.cs.output(false);
        this.spi.write(data);
        this.cs.output(true);
    }
    readRegister(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [((addr << 1) & 0x7e) | 0x80, 0];
            this.cs.output(false);
            let response = yield this.spi.writeWait(data);
            this.cs.output(true);
            return response[1];
        });
    }
    readRegister_nByte(addr, n) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataArray = [];
            if (addr instanceof Array) {
                // Multiple addresses(If addr is Array)
                for (let i = 0; i < addr.length; i++) {
                    dataArray.push(((addr[i] << 1) & 0x7e) | 0x80);
                }
            }
            else {
                // Single address & read n times
                for (let i = 0; i < n; i++) {
                    dataArray.push(((addr << 1) & 0x7e) | 0x80);
                }
            }
            dataArray.push(0); // End reading
            this.cs.output(false);
            let values = yield this.spi.writeWait(dataArray);
            this.cs.output(true);
            values.shift();
            return values;
        });
    }
    setRegisterBitMask(reg, mask) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.readRegister(reg);
            this.writeRegister(reg, response | mask);
        });
    }
    clearRegisterBitMask(reg, mask) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.readRegister(reg);
            this.writeRegister(reg, response & ~mask);
        });
    }
    antennaOn() {
        return __awaiter(this, void 0, void 0, function* () {
            // Turns the antenna on by enabling pins TX1 and TX2
            let response = yield this.readRegister(this.TxControlReg);
            if ((response & 0x03) !== 0x03) {
                //If TX1 and TX2 down
                yield this.setRegisterBitMask(this.TxControlReg, response | 0x03);
            }
        });
    }
    antennaOff() {
        return __awaiter(this, void 0, void 0, function* () {
            // Turns the antenna off by disabling pins TX1 and TX2
            yield this.clearRegisterBitMask(this.TxControlReg, 0x03);
        });
    }
    //RC522 and ISO14443 card communication
    toCard(command, bitsToSend) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            let bitSize = 0;
            let status = ERROR;
            let irqEn = 0x00;
            let waitIRq = 0x00;
            if (command === this.PCD_MFAuthent) {
                irqEn = 0x12;
                waitIRq = 0x10;
            }
            if (command === this.PCD_Transceive) {
                irqEn = 0x77;
                waitIRq = 0x30;
            }
            this.writeRegister(this.CommandReg, this.PCD_Idle); // Stop any active command
            this.writeRegister(this.ComlEnReg, irqEn | 0x80); //Interrupt request is enabled
            this.writeRegister(this.ComIrqReg, 0x7f); // Clear all seven interrupt request bits
            this.writeRegister(this.FIFOLevelReg, 0x80); // FlushBuffer = 1, FIFO initialization
            this.writeRegister(this.FIFODataReg, bitsToSend); // Write sendData to the FIFO
            this.writeRegister(this.CommandReg, command); // Execute the command
            if (command === this.PCD_Transceive) {
                yield this.setRegisterBitMask(this.BitFramingReg, 0x80); // StartSend=1, transmission of data starts
            }
            let TryingTimes = 10, n = 0;
            do {
                //Wait for the received data complete
                n = yield this.readRegister(this.ComIrqReg);
                TryingTimes--;
            } while (TryingTimes !== 0 && !(n & 0x01) && !(n & waitIRq)); //!(Timer interrupt - nothing received before timeout) & !(One of the interrupts that signal success has been set)
            // await this.clearRegisterBitMask(this.BitFramingReg, 0x80);	//Reset with resetAndInit()
            const response = yield this.readRegister_nByte([
                this.ErrorReg,
                this.FIFOLevelReg,
                this.ControlReg,
            ]);
            if (TryingTimes !== 0) {
                if ((response[0] & 0x1b) === 0x00) {
                    // BufferOvfl CollErr ParityErr ProtocolErr
                    status = n & irqEn & 0x01 ? ERROR : OK;
                    if (command === this.PCD_Transceive) {
                        n = response[1]; // Number of bytes in the FIFO
                        let lastBits = response[2] & 0x07; // RxLastBits[2:0] indicates the number of valid bits in the last received byte. If this value is 000b, the whole byte is valid.
                        if (lastBits) {
                            bitSize = (n - 1) * 8 + lastBits;
                        }
                        else {
                            bitSize = n * 8;
                        }
                        if (n === 0)
                            n = 1;
                        if (n > 16)
                            n = 16; // Restrict until 16bytes
                        data = yield this.readRegister_nByte(this.FIFODataReg, n); // Get received data from FIFO buffer
                    }
                }
                else {
                    status = ERROR;
                }
            }
            return { status: status, data: data, bitSize: bitSize };
        });
    }
    findCardWait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            yield this.searchTagWait();
            const uid = yield this.getUidWait();
            const PICC_Type = yield this.identifyCardTypeWait(uid);
            return { uid, PICC_Type };
        });
    }
    searchTagWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.writeRegister(this.BitFramingReg, 0x07);
            const tagType = [this.PICC_REQA];
            let response = yield this.toCard(this.PCD_Transceive, tagType);
            if (response.bitSize !== 0x10) {
                throw 'card_search_ERROR';
            }
        });
    }
    getUidWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.writeRegister(this.BitFramingReg, 0x00);
            let uid = [this.PICC_SEL_CL1, 0x20];
            let response = yield this.toCard(this.PCD_Transceive, uid);
            if (!response.status) {
                throw 'uid_scan_ERROR';
            }
            let uidCheck = response.data[0] ^ response.data[1] ^ response.data[2] ^ response.data[3];
            if (uidCheck !== response.data[4]) {
                throw 'uid_check_ERROR';
            }
            uid = response.data;
            // (uid).pop();
            return uid;
        });
    }
    calculateCRCWait(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.writeRegister(this.CommandReg, this.PCD_Idle); // Stop any active command
            this.writeRegister(this.DivIrqReg, 0x04); // Clear the CRCIRq interrupt request bit
            this.writeRegister(this.FIFOLevelReg, 0x80); // FlushBuffer = 1, FIFO initialization
            this.writeRegister(this.FIFODataReg, data); // Write data to the FIFO
            this.writeRegister(this.CommandReg, this.PCD_CalcCRC); // Start the calculation
            let i = 0xff, n;
            //Wait for the CRC calculation to complete
            do {
                n = yield this.readRegister(this.DivIrqReg);
                i--;
            } while (i != 0 && !(n & 0x04)); // CRCIrq = 1 (Calculation done)
            // CRC calculation result
            return yield this.readRegister_nByte([
                this.CRCResultRegLSB,
                this.CRCResultRegMSB,
            ]);
        });
    }
    identifySoftwareWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let version = yield this.readRegister(this.VersionReg);
            switch (version) {
                case 0x88:
                    version = '(clone)';
                    break;
                case 0x90:
                    version = 'v0.0';
                    break;
                case 0x91:
                    version = 'v1.0';
                    break;
                case 0x92:
                    version = 'v2.0';
                    break;
                case 0x12:
                    version = 'counterfeit chip';
                    break;
                default:
                    version = '(unknown)';
            }
            // When 0x00 or 0xFF is returned, communication probably failed
            if (version === 0x00 || version === 0xff) {
                throw 'software_version_ERROR';
            }
            return version;
        });
    }
    identifyCardTypeWait(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // Identify type of the scanned card
            let buffer = [this.PICC_SElECTTAG, 0x70].concat(uid);
            buffer = buffer.concat(yield this.calculateCRCWait(buffer));
            let response = yield this.toCard(this.PCD_Transceive, buffer);
            let PICC_Type;
            if (response.status && response.bitSize === 0x18) {
                PICC_Type = response.data[0];
            }
            switch (PICC_Type) {
                case 0x04:
                    PICC_Type = 'SAK indicates UID is not complete.';
                    break; // UID not complete
                case 0x09:
                    PICC_Type = 'MIFARE Mini, 320 bytes';
                    break;
                case 0x08:
                    PICC_Type = 'MIFARE 1KB';
                    break;
                case 0x18:
                    PICC_Type = 'MIFARE 4KB';
                    break;
                case 0x00:
                    PICC_Type = 'MIFARE Ultralight or Ultralight C';
                    break;
                case 0x11:
                    PICC_Type = 'MIFARE Plus';
                    break;
                case 0x01:
                    PICC_Type = 'MIFARE TNP3XXX';
                    break;
                case 0x20:
                    PICC_Type = 'PICC compliant with ISO/IEC 14443-4';
                    break;
                case 0x40:
                    PICC_Type = 'PICC compliant with ISO/IEC 18092 (NFC)';
                    break;
                default:
                    throw 'PICC_type_ERROR';
            }
            return PICC_Type;
        });
    }
    readSectorDataWait(Sector, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticateSectorWait(Sector, uid);
            return yield this.getSectorDataWait(Sector);
        });
    }
    readBlockDataWait(Block, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticateBlockWait(Block, uid);
            return yield this.getBlockDataWait(Block);
        });
    }
    authenticateSectorWait(Sector, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Password authentication mode (A or B)
                 * PICC_AUTH_KEYA = Verify the A key are the first 6 bit of 4th Block of each sector
                 * PICC_AUTH_KEYB = Verify the B key are the last 6 bit of 4th Block of each sector
                 */
            const KEY_A = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
            // const KEY_B = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            const Block = Sector * 4;
            let buffer = [this.PICC_AUTH_KEYA, Block].concat(KEY_A); // Append key = 6 bit of 0xFF
            uid = uid.slice(0, 4); // Append the first 4 bit of the UID
            buffer = buffer.concat(uid); //12byte
            // Start authentication itself
            yield this.toCard(this.PCD_MFAuthent, buffer);
            if (!((yield this.readRegister(this.Status2Reg)) & 0x08)) {
                throw 'password_authentication_ERROR';
            }
        });
    }
    authenticateBlockWait(Block, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Password authentication mode (A or B)
                 * PICC_AUTH_KEYA = Verify the A key (the first 6 bit of 3th Block fo each Sector)
                 * PICC_AUTH_KEYB = Verify the B key (the last 6 bit of 3th Block fo each Sector)
                 */
            const KEY_A = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
            // const KEY_B = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            let buffer = [this.PICC_AUTH_KEYA, Block].concat(KEY_A); // Append key = 6 bit of 0xFF
            uid = uid.slice(0, 4); // Append the first 4 bit of the UID
            buffer = buffer.concat(uid); //12byte
            // Start authentication itself
            yield this.toCard(this.PCD_MFAuthent, buffer);
            if (!((yield this.readRegister(this.Status2Reg)) & 0x08)) {
                throw 'password_authentication_ERROR';
            }
        });
    }
    readAgainWait() {
        return __awaiter(this, void 0, void 0, function* () {
            // If you finish reading and want to read again, this can use instead of init()
            yield this.clearRegisterBitMask(this.Status2Reg, 0x08);
        });
    }
    getSectorDataWait(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = [];
            let blockData = [];
            for (let i = 0; i < 4; i++) {
                let request = [this.PICC_READ, address * 4 + i];
                request = request.concat(yield this.calculateCRCWait(request));
                response[i] = yield this.toCard(this.PCD_Transceive, request);
                if (!response[i].status)
                    throw 'data_read_ERROR';
                blockData[i] = response[i].data;
            }
            return blockData;
        });
    }
    getBlockDataWait(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = [this.PICC_READ, address];
            request = request.concat(yield this.calculateCRCWait(request));
            let response = yield this.toCard(this.PCD_Transceive, request);
            if (!response.status)
                throw 'data_read_ERROR';
            return response.data;
        });
    }
    appendCRCtoBufferAndSendToCardWait(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            buffer = buffer.concat(yield this.calculateCRCWait(buffer));
            let response = yield this.toCard(this.PCD_Transceive, buffer);
            if (!response.status ||
                response.bitSize != 4 ||
                (response.data[0] & 0x0f) !== 0x0a) {
                response.status = ERROR;
            }
            return response;
        });
    }
    writeBlockDataWait(Block, sixteenBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Block === 0 || Block % 4 === 3) {
                throw 'deny_Write';
            }
            const buffer = [this.PICC_WRITE, Block];
            let response = yield this.appendCRCtoBufferAndSendToCardWait(buffer);
            if (response.status) {
                response = yield this.appendCRCtoBufferAndSendToCardWait(sixteenBytes);
            }
            else
                throw 'data_write_ERROR';
        });
    }
}
if (typeof module === 'object') {
    module.exports = MFRC522;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9XaXJlbGVzcy9NRlJDNTIyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7Ozs7Ozs7QUFFSCx3QkFBd0I7QUFFeEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQztBQUVwQixNQUFNLE9BQU87SUFDWDtRQUNFLDBEQUEwRDtRQUMxRCxxRUFBcUU7UUFDckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxnREFBZ0Q7UUFDdEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyw0Q0FBNEM7UUFDakUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxDQUFDLHdDQUF3QztRQUMxRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLHlEQUF5RDtRQUNsRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLHVDQUF1QztRQUNqRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxDQUFDLHVJQUF1STtRQUNwSyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLG1DQUFtQztRQUM1RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDLDBHQUEwRztRQUN0SSwrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsQ0FBQywyREFBMkQ7UUFDdEYsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsQ0FBQyxzQkFBc0I7UUFFakQsNkZBQTZGO1FBQzdGLDBHQUEwRztRQUMxRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyx5QkFBeUI7UUFDdkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsZ0JBQWdCO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxJ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RCxJQUNFLENBQUMsUUFBUSxDQUFDLE1BQU07Z0JBQ2hCLFFBQVEsQ0FBQyxPQUFPLElBQUksQ0FBQztnQkFDckIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFDbEM7Z0JBQ0EsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDekI7WUFDRCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO0tBQUE7SUFFSyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsWUFBWTs7WUFDMUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNsQyxNQUFNLFlBQVksQ0FBQzthQUNwQjtZQUNELE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN4QyxJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25CLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUN4RTs7Z0JBQU0sTUFBTSxrQkFBa0IsQ0FBQztRQUNsQyxDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0NBQzFCIiwiZmlsZSI6InBhcnRzL1dpcmVsZXNzL01GUkM1MjIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB2ZXIgMS4wXG4gKiAyMDE5LzEwLzE0XG4gKiBDcmVhdGVkIGJ5IFpqYWxpY1xuICovXG5cbi8qanNoaW50IGVzdmVyc2lvbjogOCAqL1xuXG5jb25zdCBPSyA9IHRydWU7XG5jb25zdCBFUlJPUiA9IGZhbHNlO1xuXG5jbGFzcyBNRlJDNTIyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gUENEIGNvbW1hbmRzLiBEZXNjcmliZWQgaW4gY2hhcHRlciAxMCBvZiB0aGUgZGF0YXNoZWV0LlxuICAgIC8vIFBDRChQcm94aW1pdHkgQ291cGxpbmcgRGV2aWNlKTogTlhQIE1GUkM1MjIgQ29udGFjdGxlc3MgUmVhZGVyIElDLlxuICAgIHRoaXMuUENEX0lkbGUgPSAweDAwOyAvLyBubyBhY3Rpb24sIGNhbmNlbHMgY3VycmVudCBjb21tYW5kIGV4ZWN1dGlvbi5cbiAgICB0aGlzLlBDRF9NZW0gPSAweDAxOyAvLyBzdG9yZXMgMjUgYnl0ZXMgaW50byB0aGUgaW50ZXJuYWwgYnVmZmVyLlxuICAgIHRoaXMuUENEX0dlbmVyYXRlUmFuZG9tSUQgPSAweDAyOyAvLyBnZW5lcmF0ZXMgYSAxMC1ieXRlIHJhbmRvbSBJRCBudW1iZXIuXG4gICAgdGhpcy5QQ0RfQ2FsY0NSQyA9IDB4MDM7IC8vIGFjdGl2YXRlcyB0aGUgQ1JDIGNvcHJvY2Vzc29yIG9yIHBlcmZvcm1zIGEgc2VsZi10ZXN0LlxuICAgIHRoaXMuUENEX1RyYW5zbWl0ID0gMHgwNDsgLy8gdHJhbnNtaXRzIGRhdGEgZnJvbSB0aGUgRklGTyBidWZmZXIuXG4gICAgdGhpcy5QQ0RfTm9DbWRDaGFuZ2UgPSAweDA3OyAvLyBubyBjb21tYW5kIGNoYW5nZSwgY2FuIGJlIHVzZWQgdG8gbW9kaWZ5IHRoZSBDb21tYW5kUmVnIHJlZ2lzdGVyIGJpdHMgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGNvbW1hbmQsIGZvciBleGFtcGxlLCB0aGUgUG93ZXJEb3duIGJpdC5cbiAgICB0aGlzLlBDRF9SZWNlaXZlID0gMHgwODsgLy8gYWN0aXZhdGVzIHRoZSByZWNlaXZlciBjaXJjdWl0cy5cbiAgICB0aGlzLlBDRF9UcmFuc2NlaXZlID0gMHgwYzsgLy8gdHJhbnNtaXRzIGRhdGEgZnJvbSBGSUZPIGJ1ZmZlciB0byBhbnRlbm5hIGFuZCBhdXRvbWF0aWNhbGx5IGFjdGl2YXRlcyB0aGUgcmVjZWl2ZXIgYWZ0ZXIgdHJhbnNtaXNzaW9uLlxuICAgIC8vIHRoaXMuUENEX1Jlc2VydmVkMERoID0gMHgwRDtcbiAgICB0aGlzLlBDRF9NRkF1dGhlbnQgPSAweDBlOyAvLyBwZXJmb3JtcyB0aGUgTUlGQVJFIHN0YW5kYXJkIGF1dGhlbnRpY2F0aW9uIGFzIGEgcmVhZGVyLlxuICAgIHRoaXMuUENEX1NvZnRSZXNldCA9IDB4MGY7IC8vIHJlc2V0cyB0aGUgTUZSQzUyMi5cblxuICAgIC8vIE1GUkM1MjIgUnhHYWluWzI6MF0gbWFza3MsIGRlZmluZXMgdGhlIHJlY2VpdmVyJ3Mgc2lnbmFsIHZvbHRhZ2UgZ2FpbiBmYWN0b3IgKG9uIHRoZSBQQ0QpLlxuICAgIC8vIERlc2NyaWJlZCBpbiA5LjMuMy42IC8gdGFibGUgOTggb2YgdGhlIGRhdGFzaGVldCBhdCBodHRwOi8vd3d3Lm54cC5jb20vZG9jdW1lbnRzL2RhdGFfc2hlZXQvTUZSQzUyMi5wZGZcbiAgICB0aGlzLlJ4R2Fpbl8xOGRCID0gMHgwMCA8PCA0OyAvLyAwMDBiIC0gMTggZEIsIG1pbmltdW0uXG4gICAgdGhpcy5SeEdhaW5fMjNkQiA9IDB4MDEgPDwgNDsgLy8gMDAxYiAtIDIzIGRCLlxuICAgIHRoaXMuUnhHYWluXzE4ZEJfMiA9IDB4MDIgPDwgNDsgLy8gMDEwYiAtIDE4IGRCLCBpdCBzZWVtcyAwMTBiIGlzIGEgZHVwbGljYXRlIGZvciAwMDBiLlxuICAgIHRoaXMuUnhHYWluXzIzZEJfMiA9IDB4MDMgPDwgNDsgLy8gMDExYiAtIDIzIGRCLCBpdCBzZWVtcyAwMTFiIGlzIGEgZHVwbGljYXRlIGZvciAwMDFiLlxuICAgIHRoaXMuUnhHYWluXzMzZEIgPSAweDA0IDw8IDQ7IC8vIDEwMGIgLSAzMyBkQiwgYXZlcmFnZSwgYW5kIHR5cGljYWwgZGVmYXVsdC5cbiAgICB0aGlzLlJ4R2Fpbl8zOGRCID0gMHgwNSA8PCA0OyAvLyAxMDFiIC0gMzggZEIuXG4gICAgdGhpcy5SeEdhaW5fNDNkQiA9IDB4MDYgPDwgNDsgLy8gMTEwYiAtIDQzIGRCLlxuICAgIHRoaXMuUnhHYWluXzQ4ZEIgPSAweDA3IDw8IDQ7IC8vIDExMWIgLSA0OCBkQiwgbWF4aW11bS5cbiAgICB0aGlzLlJ4R2Fpbl9taW4gPSAweDAwIDw8IDQ7IC8vIDAwMGIgLSAxOCBkQiwgbWluaW11bSwgY29udmVuaWVuY2UgZm9yIFJ4R2Fpbl8xOGRCLlxuICAgIHRoaXMuUnhHYWluX2F2ZyA9IDB4MDQgPDwgNDsgLy8gMTAwYiAtIDMzIGRCLCBhdmVyYWdlLCBjb252ZW5pZW5jZSBmb3IgUnhHYWluXzMzZEIuXG4gICAgdGhpcy5SeEdhaW5fbWF4ID0gMHgwNyA8PCA0OyAvLyAxMTFiIC0gNDggZEIsIG1heGltdW0sIGNvbnZlbmllbmNlIGZvciBSeEdhaW5fNDhkQi5cblxuICAgIC8vIFRoZSBQSUNDIGNvbW1hbmRzIHVzZWQgYnkgdGhlIFBDRCB0byBtYW5hZ2UgY29tbXVuaWNhdGlvbiB3aXRoIHNldmVyYWwgUElDQ3MgKElTTyAxNDQ0My0zLCBUeXBlIEEsIHNlY3Rpb24gNi40KS5cbiAgICB0aGlzLlBJQ0NfUkVRQSA9IDB4MjY7IC8vIFJFUXVlc3QgY29tbWFuZCwgVHlwZSBBLiBJbnZpdGVzIFBJQ0NzIGluIHN0YXRlIElETEUgdG8gZ28gdG8gUkVBRFkgYW5kIHByZXBhcmUgZm9yIGFudGljb2xsaXNpb24gb3Igc2VsZWN0aW9uLiA3IGJpdCBmcmFtZS5cbiAgICB0aGlzLlBJQ0NfV1VQQSA9IDB4NTI7IC8vIFdha2UtVVAgY29tbWFuZCwgVHlwZSBBLiBJbnZpdGVzIFBJQ0NzIGluIHN0YXRlIElETEUgYW5kIEhBTFQgdG8gZ28gdG8gUkVBRFkoKikgYW5kIHByZXBhcmUgZm9yIGFudGljb2xsaXNpb24gb3Igc2VsZWN0aW9uLiA3IGJpdCBmcmFtZS5cbiAgICB0aGlzLlBJQ0NfQ1QgPSAweDg4OyAvLyBDYXNjYWRlIFRhZy4gTm90IHJlYWxseSBhIGNvbW1hbmQsIGJ1dCB1c2VkIGR1cmluZyBhbnRpIGNvbGxpc2lvbi5cbiAgICB0aGlzLlBJQ0NfU0VMX0NMMSA9IDB4OTM7IC8vIEFudGkgY29sbGlzaW9uL1NlbGVjdCwgQ2FzY2FkZSBMZXZlbCAxLlxuICAgIHRoaXMuUElDQ19TRUxfQ0wyID0gMHg5NTsgLy8gQW50aSBjb2xsaXNpb24vU2VsZWN0LCBDYXNjYWRlIExldmVsIDIuXG4gICAgdGhpcy5QSUNDX1NFTF9DTDMgPSAweDk3OyAvLyBBbnRpIGNvbGxpc2lvbi9TZWxlY3QsIENhc2NhZGUgTGV2ZWwgMy5cbiAgICB0aGlzLlBJQ0NfSExUQSA9IDB4NTA7IC8vIEhhTFQgY29tbWFuZCwgVHlwZSBBLiBJbnN0cnVjdHMgYW4gQUNUSVZFIFBJQ0MgdG8gZ28gdG8gc3RhdGUgSEFMVC5cbiAgICB0aGlzLlBJQ0NfUkFUUyA9IDB4ZTA7IC8vIFJlcXVlc3QgY29tbWFuZCBmb3IgQW5zd2VyIFRvIFJlc2V0LlxuICAgIC8vIFRoZSBjb21tYW5kcyB1c2VkIGZvciBNSUZBUkUgQ2xhc3NpYyAoZnJvbSBodHRwOi8vd3d3Lm1vdXNlci5jb20vZHMvMi8zMDIvTUYxUzUwM3gtODk1NzQucGRmLCBTZWN0aW9uIDkpXG4gICAgLy8gVXNlIFBDRF9NRkF1dGhlbnQgdG8gYXV0aGVudGljYXRlIGFjY2VzcyB0byBhIHNlY3RvciwgdGhlbiB1c2UgdGhlc2UgY29tbWFuZHMgdG8gcmVhZC93cml0ZS9tb2RpZnkgdGhlIGJsb2NrcyBvbiB0aGUgc2VjdG9yLlxuICAgIC8vIFRoZSByZWFkL3dyaXRlIGNvbW1hbmRzIGNhbiBhbHNvIGJlIHVzZWQgZm9yIE1JRkFSRSBVbHRyYWxpZ2h0LlxuICAgIHRoaXMuUElDQ19BVVRIX0tFWUEgPSAweDYwOyAvLyBQZXJmb3JtIGF1dGhlbnRpY2F0aW9uIHdpdGggS2V5IEEuXG4gICAgdGhpcy5QSUNDX0FVVEhfS0VZQiA9IDB4NjE7IC8vIFBlcmZvcm0gYXV0aGVudGljYXRpb24gd2l0aCBLZXkgQi5cbiAgICB0aGlzLlBJQ0NfUkVBRCA9IDB4MzA7IC8vIFJlYWRzIG9uZSAxNiBieXRlIGJsb2NrIGZyb20gdGhlIGF1dGhlbnRpY2F0ZWQgc2VjdG9yIG9mIHRoZSBQSUNDLiBBbHNvIHVzZWQgZm9yIE1JRkFSRSBVbHRyYWxpZ2h0LlxuICAgIHRoaXMuUElDQ19XUklURSA9IDB4YTA7IC8vIFdyaXRlcyBvbmUgMTYgYnl0ZSBibG9jayB0byB0aGUgYXV0aGVudGljYXRlZCBzZWN0b3Igb2YgdGhlIFBJQ0MuIENhbGxlZCBcIkNPTVBBVElCSUxJVFkgV1JJVEVcIiBmb3IgTUlGQVJFIFVsdHJhbGlnaHQuXG4gICAgdGhpcy5QSUNDX0RFQ1JFTUVOVCA9IDB4YzA7IC8vIERlY3JlbWVudHMgdGhlIGNvbnRlbnRzIG9mIGEgYmxvY2sgYW5kIHN0b3JlcyB0aGUgcmVzdWx0IGluIHRoZSBpbnRlcm5hbCBkYXRhIHJlZ2lzdGVyLlxuICAgIHRoaXMuUElDQ19JTkNSRU1FTlQgPSAweGMxOyAvLyBJbmNyZW1lbnRzIHRoZSBjb250ZW50cyBvZiBhIGJsb2NrIGFuZCBzdG9yZXMgdGhlIHJlc3VsdCBpbiB0aGUgaW50ZXJuYWwgZGF0YSByZWdpc3Rlci5cbiAgICB0aGlzLlBJQ0NfUkVTVE9SRSA9IDB4YzI7IC8vIFJlYWRzIHRoZSBjb250ZW50cyBvZiBhIGJsb2NrIGludG8gdGhlIGludGVybmFsIGRhdGEgcmVnaXN0ZXIuXG4gICAgdGhpcy5QSUNDX1RSQU5TRkVSID0gMHhiMDsgLy8gV3JpdGVzIHRoZSBjb250ZW50cyBvZiB0aGUgaW50ZXJuYWwgZGF0YSByZWdpc3RlciB0byBhIGJsb2NrLlxuICAgIC8vIFRoZSBjb21tYW5kcyB1c2VkIGZvciBNSUZBUkUgVWx0cmFsaWdodCAoZnJvbSBodHRwOi8vd3d3Lm54cC5jb20vZG9jdW1lbnRzL2RhdGFfc2hlZXQvTUYwSUNVMS5wZGYsIFNlY3Rpb24gOC42KVxuICAgIC8vIFRoZSBQSUNDX0NNRF9NRl9SRUFEIGFuZCBQSUNDX0NNRF9NRl9XUklURSBjYW4gYWxzbyBiZSB1c2VkIGZvciBNSUZBUkUgVWx0cmFsaWdodC5cbiAgICB0aGlzLlBJQ0NfVUxfV1JJVEUgPSAweGEyOyAvLyBXcml0ZXMgb25lIDQgYnl0ZSBwYWdlIHRvIHRoZSBQSUNDLlxuXG4gICAgdGhpcy5QSUNDX1NFbEVDVFRBRyA9IDB4OTM7XG5cbiAgICAvLyBQYWdlIDA6IENvbW1hbmQgYW5kIHN0YXR1c1xuICAgIC8vIHRoaXMuUmVzZXJ2ZWQwMGggPSAweDAwO1xuICAgIHRoaXMuQ29tbWFuZFJlZyA9IDB4MDE7XG4gICAgdGhpcy5Db21sRW5SZWcgPSAweDAyO1xuICAgIHRoaXMuRGl2bEVuUmVnID0gMHgwMztcbiAgICB0aGlzLkNvbUlycVJlZyA9IDB4MDQ7XG4gICAgdGhpcy5EaXZJcnFSZWcgPSAweDA1O1xuICAgIHRoaXMuRXJyb3JSZWcgPSAweDA2O1xuICAgIHRoaXMuU3RhdHVzMVJlZyA9IDB4MDc7XG4gICAgdGhpcy5TdGF0dXMyUmVnID0gMHgwODtcbiAgICB0aGlzLkZJRk9EYXRhUmVnID0gMHgwOTtcbiAgICB0aGlzLkZJRk9MZXZlbFJlZyA9IDB4MGE7XG4gICAgdGhpcy5XYXRlckxldmVsUmVnID0gMHgwYjtcbiAgICB0aGlzLkNvbnRyb2xSZWcgPSAweDBjO1xuICAgIHRoaXMuQml0RnJhbWluZ1JlZyA9IDB4MGQ7XG4gICAgdGhpcy5Db2xsUmVnID0gMHgwZTtcbiAgICAvLyB0aGlzLlJlc2VydmVkMEZoID0gMHgwRjtcblxuICAgIC8vIFBhZ2UgMTogQ29tbWFuZFxuICAgIC8vIHRoaXMuUmVzZXJ2ZWQxMGggPSAweDEwO1xuICAgIHRoaXMuTW9kZVJlZyA9IDB4MTE7XG4gICAgdGhpcy5UeE1vZGVSZWcgPSAweDEyO1xuICAgIHRoaXMuUnhNb2RlUmVnID0gMHgxMztcbiAgICB0aGlzLlR4Q29udHJvbFJlZyA9IDB4MTQ7XG4gICAgdGhpcy5UeEFTS1JlZyA9IDB4MTU7XG4gICAgdGhpcy5UeFNlbFJlZyA9IDB4MTY7XG4gICAgdGhpcy5SeFNlbFJlZyA9IDB4MTc7XG4gICAgdGhpcy5SeFRocmVzaG9sZFJlZyA9IDB4MTg7XG4gICAgdGhpcy5EZW1vZFJlZyA9IDB4MTk7XG4gICAgdGhpcy5SZXNlcnZlZDFBaCA9IDB4MWE7XG4gICAgdGhpcy5SZXNlcnZlZDFCaCA9IDB4MWI7XG4gICAgdGhpcy5NZlR4UmVnID0gMHgxYztcbiAgICB0aGlzLk1mUnhSZWcgPSAweDFkO1xuICAgIHRoaXMuUmVzZXJ2ZWQxRWggPSAweDFlO1xuICAgIHRoaXMuU2VyaWFsU3BlZWRSZWcgPSAweDFmO1xuXG4gICAgLy8gUGFnZSAyOiBDb25maWd1cmF0aW9uXG4gICAgLy8gdGhpcy5SZXNlcnZlZDIwaCA9IDB4MjA7XG4gICAgdGhpcy5DUkNSZXN1bHRSZWdNU0IgPSAweDIxO1xuICAgIHRoaXMuQ1JDUmVzdWx0UmVnTFNCID0gMHgyMjtcbiAgICAvLyB0aGlzLlJlc2VydmVkMjNoID0gMHgyMztcbiAgICB0aGlzLk1vZFdpZHRoUmVnID0gMHgyNDtcbiAgICAvLyB0aGlzLlJlc2VydmVkMjVoID0gMHgyNTtcbiAgICB0aGlzLlJGQ2ZnUmVnID0gMHgyNjtcbiAgICB0aGlzLkdzTlJlZyA9IDB4Mjc7XG4gICAgdGhpcy5DV0dzUFJlZyA9IDB4Mjg7XG4gICAgdGhpcy5Nb2RHc1BSZWcgPSAweDI5O1xuICAgIHRoaXMuVE1vZGVSZWcgPSAweDJhO1xuICAgIHRoaXMuVFByZXNjYWxlclJlZyA9IDB4MmI7XG4gICAgdGhpcy5UUmVsb2FkUmVnSGkgPSAweDJjO1xuICAgIHRoaXMuVFJlbG9hZFJlZ0xvID0gMHgyZDtcbiAgICB0aGlzLlRDb3VudGVyVmFsUmVnSGkgPSAweDJlO1xuICAgIHRoaXMuVENvdW50ZXJWYWxSZWdMbyA9IDB4MmY7XG5cbiAgICAvLyBQYWdlIDM6IFRlc3QgcmVnaXN0ZXJcbiAgICAvLyB0aGlzLlJlc2VydmVkMzBoID0gMHgzMDtcbiAgICB0aGlzLlRlc3RTZWwxUmVnID0gMHgzMTtcbiAgICB0aGlzLlRlc3RTZWwyUmVnID0gMHgzMjtcbiAgICB0aGlzLlRlc3RQaW5FblJlZyA9IDB4MzM7XG4gICAgdGhpcy5UZXN0UGluVmFsdWVSZWcgPSAweDM0O1xuICAgIHRoaXMuVGVzdEJ1c1JlZyA9IDB4MzU7XG4gICAgdGhpcy5BdXRvVGVzdFJlZyA9IDB4MzY7XG4gICAgdGhpcy5WZXJzaW9uUmVnID0gMHgzNztcbiAgICB0aGlzLkFuYWxvZ1Rlc3RSZWcgPSAweDM4O1xuICAgIHRoaXMuVGVzdERBQzFSZWcgPSAweDM5O1xuICAgIHRoaXMuVGVzdERBQzJSZWcgPSAweDNhO1xuICAgIHRoaXMuVGVzdEFEQ1JlZyA9IDB4M2I7XG4gICAgLy8gdGhpcy5SZXNlcnZlZDNDaCA9IDB4M0M7XG4gICAgLy8gdGhpcy5SZXNlcnZlZDNEaCA9IDB4M0Q7XG4gICAgLy8gdGhpcy5SZXNlcnZlZDNFaCA9IDB4M0U7XG4gICAgLy8gdGhpcy5SZXNlcnZlZDNGaCA9IDB4M0Y7XG5cbiAgICAvLyByZXF1aXJlZCBwaW4gb2Ygb2JuaXpcbiAgICB0aGlzLmtleXMgPSBbXG4gICAgICAnY3MnLFxuICAgICAgJ2NsaycsXG4gICAgICAnbW9zaScsXG4gICAgICAnbWlzbycsXG4gICAgICAncnN0JyxcbiAgICAgICd2Y2MnLFxuICAgICAgJ2duZCcsXG4gICAgICAnc3BpJyxcbiAgICAgICdzcGlfZnJlcXVlbmN5JyxcbiAgICBdO1xuICAgIHRoaXMucmVxdWlyZWQgPSBbJ2NzJywgJ21vc2knLCAnbWlzbycsICdyc3QnXTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnTUZSQzUyMicsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIC8vIElPIHBpbiBzZXR0aW5nc1xuICAgIHRoaXMub2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCAnNXYnKTtcbiAgICB0aGlzLnJzdCA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnJzdCk7XG4gICAgLy8gU1BJIHNldHRpbmdzXG4gICAgdGhpcy5jcyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmNzKTtcbiAgICB0aGlzLmNzLm91dHB1dCh0cnVlKTtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gJ21hc3Rlcic7XG4gICAgdGhpcy5wYXJhbXMuZHJpdmUgPSAnM3YnO1xuICAgIHRoaXMucGFyYW1zLnB1bGwgPSAnM3YnO1xuICAgIHRoaXMucGFyYW1zLmZyZXF1ZW5jeSA9IHRoaXMucGFyYW1zLnNwaV9mcmVxdWVuY3kgfHwgNSAqIDEwMDAgKiAxMDAwO1xuICAgIHRoaXMuc3BpID0gdGhpcy5vYm5pei5nZXRTcGlXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgfVxuXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZXMgdGhlIE1GUkM1MjIgY2hpcFxuICAgIC8vIEhhcmR3YXJlIGFuZCBTb2Z0d2FyZSByZXNldFxuICAgIHRoaXMucnN0Lm91dHB1dChmYWxzZSk7XG4gICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDUwKTsgLy8gOC44LjIgc2F5cyB0aGUgb3NjaWxsYXRvciBzdGFydC11cCB0aW1lIGlzIHRoZSBzdGFydCB1cCB0aW1lIG9mIHRoZSBjcnlzdGFsICsgMzcsNzR1czogNTBtcy5cbiAgICB0aGlzLnJzdC5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tbWFuZFJlZywgdGhpcy5QQ0RfU29mdFJlc2V0KTtcblxuICAgIC8vIFRpbWVyIHNldHVwOiBXaGVuIGNvbW11bmljYXRpbmcgd2l0aCBhIFBJQ0Mgd2UgbmVlZCBhIHRpbWVvdXQgaWYgc29tZXRoaW5nIGdvZXMgd3JvbmcuXG4gICAgLy8gZl90aW1lciA9IDEzLjU2IE1IeiAvICgyKlRQcmVTY2FsZXIrMSkgd2hlcmUgVFByZVNjYWxlciA9IFtUUHJlc2NhbGVyX0hpOlRQcmVzY2FsZXJfTG9dLlxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLlRNb2RlUmVnLCAweDgwKTsgLy8gVEF1dG89MTsgdGltZXIgc3RhcnRzIGF1dG9tYXRpY2FsbHkgYXQgdGhlIGVuZCBvZiB0aGUgdHJhbnNtaXNzaW9uIGluIGFsbCBjb21tdW5pY2F0aW9uIG1vZGVzIGF0IGFsbCBzcGVlZHNcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5UUHJlc2NhbGVyUmVnLCAweGE5KTsgLy8gVFByZVNjYWxlciA9IFRNb2RlUmVnWzMuLjBdOiBUUHJlc2NhbGVyUmVnLCBpZSAweDBBOSA9IDE2OSA9PiBmX3RpbWVyPTQwa0h6LCBpZSBhIHRpbWVyIHBlcmlvZCBvZiAyNXVzLlxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLlRSZWxvYWRSZWdIaSwgMHgwMyk7XG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuVFJlbG9hZFJlZ0xvLCAweGU4KTsgLy8gUmVsb2FkIHRpbWVyIHdpdGggMHgzRTggPSAxMDAwLCBpZS4gMjVtcyBiZWZvcmUgdGltZW91dFxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLlR4QVNLUmVnLCAweDQwKTsgLy8gRGVmYXVsdCAweDAwLiBGb3JjZSBhIDEwMCAlIEFTSyBtb2R1bGF0aW9uIGluZGVwZW5kZW50IG9mIHRoZSBNb2RHc1BSZWcgcmVnaXN0ZXIgc2V0dGluZ1xuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLk1vZGVSZWcsIDB4M2QpOyAvLyBEZWZhdWx0IDB4M0YuIFNldCB0aGUgcHJlc2V0IHZhbHVlIGZvciB0aGUgQ1JDIGNvcHJvY2Vzc29yIGZvciB0aGUgQ2FsY0NSQyBjb21tYW5kIHRvIDB4NjM2MyAoNi4yLjQpXG4gICAgYXdhaXQgdGhpcy5hbnRlbm5hT24oKTsgLy8gRW5hYmxlIHRoZSBhbnRlbm5hIGRyaXZlciBwaW5zIFRYMSBhbmQgVFgyICh0aGV5IHdlcmUgZGlzYWJsZWQgYnkgdGhlIHJlc2V0KVxuICB9XG5cbiAgd3JpdGVSZWdpc3RlcihhZGRyLCB2YWwpIHtcbiAgICBsZXQgZGF0YTtcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIC8vIElmIHZhbCBpcyBBcnJheVxuICAgICAgZGF0YSA9IFsoYWRkciA8PCAxKSAmIDB4N2VdLmNvbmNhdCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gWyhhZGRyIDw8IDEpICYgMHg3ZSwgdmFsXTtcbiAgICB9XG4gICAgdGhpcy5jcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuc3BpLndyaXRlKGRhdGEpO1xuICAgIHRoaXMuY3Mub3V0cHV0KHRydWUpO1xuICB9XG5cbiAgYXN5bmMgcmVhZFJlZ2lzdGVyKGFkZHIpIHtcbiAgICBsZXQgZGF0YSA9IFsoKGFkZHIgPDwgMSkgJiAweDdlKSB8IDB4ODAsIDBdO1xuICAgIHRoaXMuY3Mub3V0cHV0KGZhbHNlKTtcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNwaS53cml0ZVdhaXQoZGF0YSk7XG4gICAgdGhpcy5jcy5vdXRwdXQodHJ1ZSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlWzFdO1xuICB9XG5cbiAgYXN5bmMgcmVhZFJlZ2lzdGVyX25CeXRlKGFkZHIsIG4pIHtcbiAgICBsZXQgZGF0YUFycmF5ID0gW107XG4gICAgaWYgKGFkZHIgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgLy8gTXVsdGlwbGUgYWRkcmVzc2VzKElmIGFkZHIgaXMgQXJyYXkpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5LnB1c2goKChhZGRyW2ldIDw8IDEpICYgMHg3ZSkgfCAweDgwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2luZ2xlIGFkZHJlc3MgJiByZWFkIG4gdGltZXNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheS5wdXNoKCgoYWRkciA8PCAxKSAmIDB4N2UpIHwgMHg4MCk7XG4gICAgICB9XG4gICAgfVxuICAgIGRhdGFBcnJheS5wdXNoKDApOyAvLyBFbmQgcmVhZGluZ1xuICAgIHRoaXMuY3Mub3V0cHV0KGZhbHNlKTtcbiAgICBsZXQgdmFsdWVzID0gYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KGRhdGFBcnJheSk7XG4gICAgdGhpcy5jcy5vdXRwdXQodHJ1ZSk7XG4gICAgdmFsdWVzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIGFzeW5jIHNldFJlZ2lzdGVyQml0TWFzayhyZWcsIG1hc2spIHtcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3RlcihyZWcpO1xuICAgIHRoaXMud3JpdGVSZWdpc3RlcihyZWcsIHJlc3BvbnNlIHwgbWFzayk7XG4gIH1cblxuICBhc3luYyBjbGVhclJlZ2lzdGVyQml0TWFzayhyZWcsIG1hc2spIHtcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3RlcihyZWcpO1xuICAgIHRoaXMud3JpdGVSZWdpc3RlcihyZWcsIHJlc3BvbnNlICYgfm1hc2spO1xuICB9XG5cbiAgYXN5bmMgYW50ZW5uYU9uKCkge1xuICAgIC8vIFR1cm5zIHRoZSBhbnRlbm5hIG9uIGJ5IGVuYWJsaW5nIHBpbnMgVFgxIGFuZCBUWDJcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3Rlcih0aGlzLlR4Q29udHJvbFJlZyk7XG4gICAgaWYgKChyZXNwb25zZSAmIDB4MDMpICE9PSAweDAzKSB7XG4gICAgICAvL0lmIFRYMSBhbmQgVFgyIGRvd25cbiAgICAgIGF3YWl0IHRoaXMuc2V0UmVnaXN0ZXJCaXRNYXNrKHRoaXMuVHhDb250cm9sUmVnLCByZXNwb25zZSB8IDB4MDMpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFudGVubmFPZmYoKSB7XG4gICAgLy8gVHVybnMgdGhlIGFudGVubmEgb2ZmIGJ5IGRpc2FibGluZyBwaW5zIFRYMSBhbmQgVFgyXG4gICAgYXdhaXQgdGhpcy5jbGVhclJlZ2lzdGVyQml0TWFzayh0aGlzLlR4Q29udHJvbFJlZywgMHgwMyk7XG4gIH1cblxuICAvL1JDNTIyIGFuZCBJU08xNDQ0MyBjYXJkIGNvbW11bmljYXRpb25cbiAgYXN5bmMgdG9DYXJkKGNvbW1hbmQsIGJpdHNUb1NlbmQpIHtcbiAgICBsZXQgZGF0YSA9IFtdO1xuICAgIGxldCBiaXRTaXplID0gMDtcbiAgICBsZXQgc3RhdHVzID0gRVJST1I7XG4gICAgbGV0IGlycUVuID0gMHgwMDtcbiAgICBsZXQgd2FpdElScSA9IDB4MDA7XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gdGhpcy5QQ0RfTUZBdXRoZW50KSB7XG4gICAgICBpcnFFbiA9IDB4MTI7XG4gICAgICB3YWl0SVJxID0gMHgxMDtcbiAgICB9XG4gICAgaWYgKGNvbW1hbmQgPT09IHRoaXMuUENEX1RyYW5zY2VpdmUpIHtcbiAgICAgIGlycUVuID0gMHg3NztcbiAgICAgIHdhaXRJUnEgPSAweDMwO1xuICAgIH1cblxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkNvbW1hbmRSZWcsIHRoaXMuUENEX0lkbGUpOyAvLyBTdG9wIGFueSBhY3RpdmUgY29tbWFuZFxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkNvbWxFblJlZywgaXJxRW4gfCAweDgwKTsgLy9JbnRlcnJ1cHQgcmVxdWVzdCBpcyBlbmFibGVkXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tSXJxUmVnLCAweDdmKTsgLy8gQ2xlYXIgYWxsIHNldmVuIGludGVycnVwdCByZXF1ZXN0IGJpdHNcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5GSUZPTGV2ZWxSZWcsIDB4ODApOyAvLyBGbHVzaEJ1ZmZlciA9IDEsIEZJRk8gaW5pdGlhbGl6YXRpb25cbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5GSUZPRGF0YVJlZywgYml0c1RvU2VuZCk7IC8vIFdyaXRlIHNlbmREYXRhIHRvIHRoZSBGSUZPXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tbWFuZFJlZywgY29tbWFuZCk7IC8vIEV4ZWN1dGUgdGhlIGNvbW1hbmRcblxuICAgIGlmIChjb21tYW5kID09PSB0aGlzLlBDRF9UcmFuc2NlaXZlKSB7XG4gICAgICBhd2FpdCB0aGlzLnNldFJlZ2lzdGVyQml0TWFzayh0aGlzLkJpdEZyYW1pbmdSZWcsIDB4ODApOyAvLyBTdGFydFNlbmQ9MSwgdHJhbnNtaXNzaW9uIG9mIGRhdGEgc3RhcnRzXG4gICAgfVxuXG4gICAgbGV0IFRyeWluZ1RpbWVzID0gMTAsXG4gICAgICBuID0gMDtcbiAgICBkbyB7XG4gICAgICAvL1dhaXQgZm9yIHRoZSByZWNlaXZlZCBkYXRhIGNvbXBsZXRlXG4gICAgICBuID0gYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXIodGhpcy5Db21JcnFSZWcpO1xuICAgICAgVHJ5aW5nVGltZXMtLTtcbiAgICB9IHdoaWxlIChUcnlpbmdUaW1lcyAhPT0gMCAmJiAhKG4gJiAweDAxKSAmJiAhKG4gJiB3YWl0SVJxKSk7IC8vIShUaW1lciBpbnRlcnJ1cHQgLSBub3RoaW5nIHJlY2VpdmVkIGJlZm9yZSB0aW1lb3V0KSAmICEoT25lIG9mIHRoZSBpbnRlcnJ1cHRzIHRoYXQgc2lnbmFsIHN1Y2Nlc3MgaGFzIGJlZW4gc2V0KVxuXG4gICAgLy8gYXdhaXQgdGhpcy5jbGVhclJlZ2lzdGVyQml0TWFzayh0aGlzLkJpdEZyYW1pbmdSZWcsIDB4ODApO1x0Ly9SZXNldCB3aXRoIHJlc2V0QW5kSW5pdCgpXG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMucmVhZFJlZ2lzdGVyX25CeXRlKFtcbiAgICAgIHRoaXMuRXJyb3JSZWcsXG4gICAgICB0aGlzLkZJRk9MZXZlbFJlZyxcbiAgICAgIHRoaXMuQ29udHJvbFJlZyxcbiAgICBdKTtcblxuICAgIGlmIChUcnlpbmdUaW1lcyAhPT0gMCkge1xuICAgICAgaWYgKChyZXNwb25zZVswXSAmIDB4MWIpID09PSAweDAwKSB7XG4gICAgICAgIC8vIEJ1ZmZlck92ZmwgQ29sbEVyciBQYXJpdHlFcnIgUHJvdG9jb2xFcnJcbiAgICAgICAgc3RhdHVzID0gbiAmIGlycUVuICYgMHgwMSA/IEVSUk9SIDogT0s7XG5cbiAgICAgICAgaWYgKGNvbW1hbmQgPT09IHRoaXMuUENEX1RyYW5zY2VpdmUpIHtcbiAgICAgICAgICBuID0gcmVzcG9uc2VbMV07IC8vIE51bWJlciBvZiBieXRlcyBpbiB0aGUgRklGT1xuICAgICAgICAgIGxldCBsYXN0Qml0cyA9IHJlc3BvbnNlWzJdICYgMHgwNzsgLy8gUnhMYXN0Qml0c1syOjBdIGluZGljYXRlcyB0aGUgbnVtYmVyIG9mIHZhbGlkIGJpdHMgaW4gdGhlIGxhc3QgcmVjZWl2ZWQgYnl0ZS4gSWYgdGhpcyB2YWx1ZSBpcyAwMDBiLCB0aGUgd2hvbGUgYnl0ZSBpcyB2YWxpZC5cbiAgICAgICAgICBpZiAobGFzdEJpdHMpIHtcbiAgICAgICAgICAgIGJpdFNpemUgPSAobiAtIDEpICogOCArIGxhc3RCaXRzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiaXRTaXplID0gbiAqIDg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChuID09PSAwKSBuID0gMTtcbiAgICAgICAgICBpZiAobiA+IDE2KSBuID0gMTY7IC8vIFJlc3RyaWN0IHVudGlsIDE2Ynl0ZXNcbiAgICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXJfbkJ5dGUodGhpcy5GSUZPRGF0YVJlZywgbik7IC8vIEdldCByZWNlaXZlZCBkYXRhIGZyb20gRklGTyBidWZmZXJcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdHVzID0gRVJST1I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLCBkYXRhOiBkYXRhLCBiaXRTaXplOiBiaXRTaXplIH07XG4gIH1cblxuICBhc3luYyBmaW5kQ2FyZFdhaXQoKSB7XG4gICAgYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgYXdhaXQgdGhpcy5zZWFyY2hUYWdXYWl0KCk7XG4gICAgY29uc3QgdWlkID0gYXdhaXQgdGhpcy5nZXRVaWRXYWl0KCk7XG4gICAgY29uc3QgUElDQ19UeXBlID0gYXdhaXQgdGhpcy5pZGVudGlmeUNhcmRUeXBlV2FpdCh1aWQpO1xuICAgIHJldHVybiB7IHVpZCwgUElDQ19UeXBlIH07XG4gIH1cblxuICBhc3luYyBzZWFyY2hUYWdXYWl0KCkge1xuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkJpdEZyYW1pbmdSZWcsIDB4MDcpO1xuICAgIGNvbnN0IHRhZ1R5cGUgPSBbdGhpcy5QSUNDX1JFUUFdO1xuXG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy50b0NhcmQodGhpcy5QQ0RfVHJhbnNjZWl2ZSwgdGFnVHlwZSk7XG4gICAgaWYgKHJlc3BvbnNlLmJpdFNpemUgIT09IDB4MTApIHtcbiAgICAgIHRocm93ICdjYXJkX3NlYXJjaF9FUlJPUic7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0VWlkV2FpdCgpIHtcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5CaXRGcmFtaW5nUmVnLCAweDAwKTtcbiAgICBsZXQgdWlkID0gW3RoaXMuUElDQ19TRUxfQ0wxLCAweDIwXTtcblxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMudG9DYXJkKHRoaXMuUENEX1RyYW5zY2VpdmUsIHVpZCk7XG4gICAgaWYgKCFyZXNwb25zZS5zdGF0dXMpIHtcbiAgICAgIHRocm93ICd1aWRfc2Nhbl9FUlJPUic7XG4gICAgfVxuICAgIGxldCB1aWRDaGVjayA9XG4gICAgICByZXNwb25zZS5kYXRhWzBdIF4gcmVzcG9uc2UuZGF0YVsxXSBeIHJlc3BvbnNlLmRhdGFbMl0gXiByZXNwb25zZS5kYXRhWzNdO1xuICAgIGlmICh1aWRDaGVjayAhPT0gcmVzcG9uc2UuZGF0YVs0XSkge1xuICAgICAgdGhyb3cgJ3VpZF9jaGVja19FUlJPUic7XG4gICAgfVxuICAgIHVpZCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgLy8gKHVpZCkucG9wKCk7XG4gICAgcmV0dXJuIHVpZDtcbiAgfVxuXG4gIGFzeW5jIGNhbGN1bGF0ZUNSQ1dhaXQoZGF0YSkge1xuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkNvbW1hbmRSZWcsIHRoaXMuUENEX0lkbGUpOyAvLyBTdG9wIGFueSBhY3RpdmUgY29tbWFuZFxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkRpdklycVJlZywgMHgwNCk7IC8vIENsZWFyIHRoZSBDUkNJUnEgaW50ZXJydXB0IHJlcXVlc3QgYml0XG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuRklGT0xldmVsUmVnLCAweDgwKTsgLy8gRmx1c2hCdWZmZXIgPSAxLCBGSUZPIGluaXRpYWxpemF0aW9uXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuRklGT0RhdGFSZWcsIGRhdGEpOyAvLyBXcml0ZSBkYXRhIHRvIHRoZSBGSUZPXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tbWFuZFJlZywgdGhpcy5QQ0RfQ2FsY0NSQyk7IC8vIFN0YXJ0IHRoZSBjYWxjdWxhdGlvblxuXG4gICAgbGV0IGkgPSAweGZmLFxuICAgICAgbjtcbiAgICAvL1dhaXQgZm9yIHRoZSBDUkMgY2FsY3VsYXRpb24gdG8gY29tcGxldGVcbiAgICBkbyB7XG4gICAgICBuID0gYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXIodGhpcy5EaXZJcnFSZWcpO1xuICAgICAgaS0tO1xuICAgIH0gd2hpbGUgKGkgIT0gMCAmJiAhKG4gJiAweDA0KSk7IC8vIENSQ0lycSA9IDEgKENhbGN1bGF0aW9uIGRvbmUpXG4gICAgLy8gQ1JDIGNhbGN1bGF0aW9uIHJlc3VsdFxuICAgIHJldHVybiBhd2FpdCB0aGlzLnJlYWRSZWdpc3Rlcl9uQnl0ZShbXG4gICAgICB0aGlzLkNSQ1Jlc3VsdFJlZ0xTQixcbiAgICAgIHRoaXMuQ1JDUmVzdWx0UmVnTVNCLFxuICAgIF0pO1xuICB9XG5cbiAgYXN5bmMgaWRlbnRpZnlTb2Z0d2FyZVdhaXQoKSB7XG4gICAgbGV0IHZlcnNpb24gPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3Rlcih0aGlzLlZlcnNpb25SZWcpO1xuICAgIHN3aXRjaCAodmVyc2lvbikge1xuICAgICAgY2FzZSAweDg4OlxuICAgICAgICB2ZXJzaW9uID0gJyhjbG9uZSknO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHg5MDpcbiAgICAgICAgdmVyc2lvbiA9ICd2MC4wJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDB4OTE6XG4gICAgICAgIHZlcnNpb24gPSAndjEuMCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAweDkyOlxuICAgICAgICB2ZXJzaW9uID0gJ3YyLjAnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHgxMjpcbiAgICAgICAgdmVyc2lvbiA9ICdjb3VudGVyZmVpdCBjaGlwJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2ZXJzaW9uID0gJyh1bmtub3duKSc7XG4gICAgfVxuICAgIC8vIFdoZW4gMHgwMCBvciAweEZGIGlzIHJldHVybmVkLCBjb21tdW5pY2F0aW9uIHByb2JhYmx5IGZhaWxlZFxuICAgIGlmICh2ZXJzaW9uID09PSAweDAwIHx8IHZlcnNpb24gPT09IDB4ZmYpIHtcbiAgICAgIHRocm93ICdzb2Z0d2FyZV92ZXJzaW9uX0VSUk9SJztcbiAgICB9XG4gICAgcmV0dXJuIHZlcnNpb247XG4gIH1cblxuICBhc3luYyBpZGVudGlmeUNhcmRUeXBlV2FpdCh1aWQpIHtcbiAgICAvLyBJZGVudGlmeSB0eXBlIG9mIHRoZSBzY2FubmVkIGNhcmRcbiAgICBsZXQgYnVmZmVyID0gW3RoaXMuUElDQ19TRWxFQ1RUQUcsIDB4NzBdLmNvbmNhdCh1aWQpO1xuICAgIGJ1ZmZlciA9IGJ1ZmZlci5jb25jYXQoYXdhaXQgdGhpcy5jYWxjdWxhdGVDUkNXYWl0KGJ1ZmZlcikpO1xuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMudG9DYXJkKHRoaXMuUENEX1RyYW5zY2VpdmUsIGJ1ZmZlcik7XG4gICAgbGV0IFBJQ0NfVHlwZTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICYmIHJlc3BvbnNlLmJpdFNpemUgPT09IDB4MTgpIHtcbiAgICAgIFBJQ0NfVHlwZSA9IHJlc3BvbnNlLmRhdGFbMF07XG4gICAgfVxuICAgIHN3aXRjaCAoUElDQ19UeXBlKSB7XG4gICAgICBjYXNlIDB4MDQ6XG4gICAgICAgIFBJQ0NfVHlwZSA9ICdTQUsgaW5kaWNhdGVzIFVJRCBpcyBub3QgY29tcGxldGUuJztcbiAgICAgICAgYnJlYWs7IC8vIFVJRCBub3QgY29tcGxldGVcbiAgICAgIGNhc2UgMHgwOTpcbiAgICAgICAgUElDQ19UeXBlID0gJ01JRkFSRSBNaW5pLCAzMjAgYnl0ZXMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHgwODpcbiAgICAgICAgUElDQ19UeXBlID0gJ01JRkFSRSAxS0InO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHgxODpcbiAgICAgICAgUElDQ19UeXBlID0gJ01JRkFSRSA0S0InO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHgwMDpcbiAgICAgICAgUElDQ19UeXBlID0gJ01JRkFSRSBVbHRyYWxpZ2h0IG9yIFVsdHJhbGlnaHQgQyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAweDExOlxuICAgICAgICBQSUNDX1R5cGUgPSAnTUlGQVJFIFBsdXMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHgwMTpcbiAgICAgICAgUElDQ19UeXBlID0gJ01JRkFSRSBUTlAzWFhYJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDB4MjA6XG4gICAgICAgIFBJQ0NfVHlwZSA9ICdQSUNDIGNvbXBsaWFudCB3aXRoIElTTy9JRUMgMTQ0NDMtNCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAweDQwOlxuICAgICAgICBQSUNDX1R5cGUgPSAnUElDQyBjb21wbGlhbnQgd2l0aCBJU08vSUVDIDE4MDkyIChORkMpJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyAnUElDQ190eXBlX0VSUk9SJztcbiAgICB9XG4gICAgcmV0dXJuIFBJQ0NfVHlwZTtcbiAgfVxuXG4gIGFzeW5jIHJlYWRTZWN0b3JEYXRhV2FpdChTZWN0b3IsIHVpZCkge1xuICAgIGF3YWl0IHRoaXMuYXV0aGVudGljYXRlU2VjdG9yV2FpdChTZWN0b3IsIHVpZCk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0U2VjdG9yRGF0YVdhaXQoU2VjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIHJlYWRCbG9ja0RhdGFXYWl0KEJsb2NrLCB1aWQpIHtcbiAgICBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZUJsb2NrV2FpdChCbG9jaywgdWlkKTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRCbG9ja0RhdGFXYWl0KEJsb2NrKTtcbiAgfVxuXG4gIGFzeW5jIGF1dGhlbnRpY2F0ZVNlY3RvcldhaXQoU2VjdG9yLCB1aWQpIHtcbiAgICAvKiBQYXNzd29yZCBhdXRoZW50aWNhdGlvbiBtb2RlIChBIG9yIEIpXG5cdFx0ICogUElDQ19BVVRIX0tFWUEgPSBWZXJpZnkgdGhlIEEga2V5IGFyZSB0aGUgZmlyc3QgNiBiaXQgb2YgNHRoIEJsb2NrIG9mIGVhY2ggc2VjdG9yXG5cdFx0ICogUElDQ19BVVRIX0tFWUIgPSBWZXJpZnkgdGhlIEIga2V5IGFyZSB0aGUgbGFzdCA2IGJpdCBvZiA0dGggQmxvY2sgb2YgZWFjaCBzZWN0b3Jcblx0XHQgKi9cbiAgICBjb25zdCBLRVlfQSA9IFsweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmXTtcbiAgICAvLyBjb25zdCBLRVlfQiA9IFsweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwXTtcbiAgICBjb25zdCBCbG9jayA9IFNlY3RvciAqIDQ7XG4gICAgbGV0IGJ1ZmZlciA9IFt0aGlzLlBJQ0NfQVVUSF9LRVlBLCBCbG9ja10uY29uY2F0KEtFWV9BKTsgLy8gQXBwZW5kIGtleSA9IDYgYml0IG9mIDB4RkZcbiAgICB1aWQgPSB1aWQuc2xpY2UoMCwgNCk7IC8vIEFwcGVuZCB0aGUgZmlyc3QgNCBiaXQgb2YgdGhlIFVJRFxuICAgIGJ1ZmZlciA9IGJ1ZmZlci5jb25jYXQodWlkKTsgLy8xMmJ5dGVcbiAgICAvLyBTdGFydCBhdXRoZW50aWNhdGlvbiBpdHNlbGZcbiAgICBhd2FpdCB0aGlzLnRvQ2FyZCh0aGlzLlBDRF9NRkF1dGhlbnQsIGJ1ZmZlcik7XG4gICAgaWYgKCEoKGF3YWl0IHRoaXMucmVhZFJlZ2lzdGVyKHRoaXMuU3RhdHVzMlJlZykpICYgMHgwOCkpIHtcbiAgICAgIHRocm93ICdwYXNzd29yZF9hdXRoZW50aWNhdGlvbl9FUlJPUic7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYXV0aGVudGljYXRlQmxvY2tXYWl0KEJsb2NrLCB1aWQpIHtcbiAgICAvKiBQYXNzd29yZCBhdXRoZW50aWNhdGlvbiBtb2RlIChBIG9yIEIpXG5cdFx0ICogUElDQ19BVVRIX0tFWUEgPSBWZXJpZnkgdGhlIEEga2V5ICh0aGUgZmlyc3QgNiBiaXQgb2YgM3RoIEJsb2NrIGZvIGVhY2ggU2VjdG9yKVxuXHRcdCAqIFBJQ0NfQVVUSF9LRVlCID0gVmVyaWZ5IHRoZSBCIGtleSAodGhlIGxhc3QgNiBiaXQgb2YgM3RoIEJsb2NrIGZvIGVhY2ggU2VjdG9yKVxuXHRcdCAqL1xuICAgIGNvbnN0IEtFWV9BID0gWzB4ZmYsIDB4ZmYsIDB4ZmYsIDB4ZmYsIDB4ZmYsIDB4ZmZdO1xuICAgIC8vIGNvbnN0IEtFWV9CID0gWzB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDBdO1xuICAgIGxldCBidWZmZXIgPSBbdGhpcy5QSUNDX0FVVEhfS0VZQSwgQmxvY2tdLmNvbmNhdChLRVlfQSk7IC8vIEFwcGVuZCBrZXkgPSA2IGJpdCBvZiAweEZGXG4gICAgdWlkID0gdWlkLnNsaWNlKDAsIDQpOyAvLyBBcHBlbmQgdGhlIGZpcnN0IDQgYml0IG9mIHRoZSBVSURcbiAgICBidWZmZXIgPSBidWZmZXIuY29uY2F0KHVpZCk7IC8vMTJieXRlXG5cbiAgICAvLyBTdGFydCBhdXRoZW50aWNhdGlvbiBpdHNlbGZcbiAgICBhd2FpdCB0aGlzLnRvQ2FyZCh0aGlzLlBDRF9NRkF1dGhlbnQsIGJ1ZmZlcik7XG4gICAgaWYgKCEoKGF3YWl0IHRoaXMucmVhZFJlZ2lzdGVyKHRoaXMuU3RhdHVzMlJlZykpICYgMHgwOCkpIHtcbiAgICAgIHRocm93ICdwYXNzd29yZF9hdXRoZW50aWNhdGlvbl9FUlJPUic7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVhZEFnYWluV2FpdCgpIHtcbiAgICAvLyBJZiB5b3UgZmluaXNoIHJlYWRpbmcgYW5kIHdhbnQgdG8gcmVhZCBhZ2FpbiwgdGhpcyBjYW4gdXNlIGluc3RlYWQgb2YgaW5pdCgpXG4gICAgYXdhaXQgdGhpcy5jbGVhclJlZ2lzdGVyQml0TWFzayh0aGlzLlN0YXR1czJSZWcsIDB4MDgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0U2VjdG9yRGF0YVdhaXQoYWRkcmVzcykge1xuICAgIGxldCByZXNwb25zZSA9IFtdO1xuICAgIGxldCBibG9ja0RhdGEgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgbGV0IHJlcXVlc3QgPSBbdGhpcy5QSUNDX1JFQUQsIGFkZHJlc3MgKiA0ICsgaV07XG4gICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jb25jYXQoYXdhaXQgdGhpcy5jYWxjdWxhdGVDUkNXYWl0KHJlcXVlc3QpKTtcbiAgICAgIHJlc3BvbnNlW2ldID0gYXdhaXQgdGhpcy50b0NhcmQodGhpcy5QQ0RfVHJhbnNjZWl2ZSwgcmVxdWVzdCk7XG4gICAgICBpZiAoIXJlc3BvbnNlW2ldLnN0YXR1cykgdGhyb3cgJ2RhdGFfcmVhZF9FUlJPUic7XG4gICAgICBibG9ja0RhdGFbaV0gPSByZXNwb25zZVtpXS5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gYmxvY2tEYXRhO1xuICB9XG5cbiAgYXN5bmMgZ2V0QmxvY2tEYXRhV2FpdChhZGRyZXNzKSB7XG4gICAgbGV0IHJlcXVlc3QgPSBbdGhpcy5QSUNDX1JFQUQsIGFkZHJlc3NdO1xuICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNvbmNhdChhd2FpdCB0aGlzLmNhbGN1bGF0ZUNSQ1dhaXQocmVxdWVzdCkpO1xuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMudG9DYXJkKHRoaXMuUENEX1RyYW5zY2VpdmUsIHJlcXVlc3QpO1xuICAgIGlmICghcmVzcG9uc2Uuc3RhdHVzKSB0aHJvdyAnZGF0YV9yZWFkX0VSUk9SJztcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfVxuXG4gIGFzeW5jIGFwcGVuZENSQ3RvQnVmZmVyQW5kU2VuZFRvQ2FyZFdhaXQoYnVmZmVyKSB7XG4gICAgYnVmZmVyID0gYnVmZmVyLmNvbmNhdChhd2FpdCB0aGlzLmNhbGN1bGF0ZUNSQ1dhaXQoYnVmZmVyKSk7XG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy50b0NhcmQodGhpcy5QQ0RfVHJhbnNjZWl2ZSwgYnVmZmVyKTtcbiAgICBpZiAoXG4gICAgICAhcmVzcG9uc2Uuc3RhdHVzIHx8XG4gICAgICByZXNwb25zZS5iaXRTaXplICE9IDQgfHxcbiAgICAgIChyZXNwb25zZS5kYXRhWzBdICYgMHgwZikgIT09IDB4MGFcbiAgICApIHtcbiAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IEVSUk9SO1xuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBhc3luYyB3cml0ZUJsb2NrRGF0YVdhaXQoQmxvY2ssIHNpeHRlZW5CeXRlcykge1xuICAgIGlmIChCbG9jayA9PT0gMCB8fCBCbG9jayAlIDQgPT09IDMpIHtcbiAgICAgIHRocm93ICdkZW55X1dyaXRlJztcbiAgICB9XG4gICAgY29uc3QgYnVmZmVyID0gW3RoaXMuUElDQ19XUklURSwgQmxvY2tdO1xuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXBwZW5kQ1JDdG9CdWZmZXJBbmRTZW5kVG9DYXJkV2FpdChidWZmZXIpO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgdGhpcy5hcHBlbmRDUkN0b0J1ZmZlckFuZFNlbmRUb0NhcmRXYWl0KHNpeHRlZW5CeXRlcyk7XG4gICAgfSBlbHNlIHRocm93ICdkYXRhX3dyaXRlX0VSUk9SJztcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBNRlJDNTIyO1xufVxuIl19
