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
Object.defineProperty(exports, "__esModule", { value: true });
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
            "cs",
            "clk",
            "mosi",
            "miso",
            "rst",
            "vcc",
            "gnd",
            "spi",
            "spi_frequency",
        ];
        this.required = ["cs", "mosi", "miso", "rst"];
    }
    static info() {
        return {
            name: "MFRC522",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // IO pin settings
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.rst = obniz.getIO(this.params.rst);
        // SPI settings
        this.cs = obniz.getIO(this.params.cs);
        this.cs.output(true);
        this.params.mode = "master";
        this.params.drive = "3v";
        this.params.pull = "3v";
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
            const data = [((addr << 1) & 0x7e) | 0x80, 0];
            this.cs.output(false);
            const response = yield this.spi.writeWait(data);
            this.cs.output(true);
            return response[1];
        });
    }
    readRegister_nByte(addr, n) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataArray = [];
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
            const values = yield this.spi.writeWait(dataArray);
            this.cs.output(true);
            values.shift();
            return values;
        });
    }
    setRegisterBitMask(reg, mask) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.readRegister(reg);
            this.writeRegister(reg, response | mask);
        });
    }
    clearRegisterBitMask(reg, mask) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.readRegister(reg);
            this.writeRegister(reg, response & ~mask);
        });
    }
    antennaOn() {
        return __awaiter(this, void 0, void 0, function* () {
            // Turns the antenna on by enabling pins TX1 and TX2
            const response = yield this.readRegister(this.TxControlReg);
            if ((response & 0x03) !== 0x03) {
                // If TX1 and TX2 down
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
    // RC522 and ISO14443 card communication
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
            this.writeRegister(this.ComlEnReg, irqEn | 0x80); // Interrupt request is enabled
            this.writeRegister(this.ComIrqReg, 0x7f); // Clear all seven interrupt request bits
            this.writeRegister(this.FIFOLevelReg, 0x80); // FlushBuffer = 1, FIFO initialization
            this.writeRegister(this.FIFODataReg, bitsToSend); // Write sendData to the FIFO
            this.writeRegister(this.CommandReg, command); // Execute the command
            if (command === this.PCD_Transceive) {
                yield this.setRegisterBitMask(this.BitFramingReg, 0x80); // StartSend=1, transmission of data starts
            }
            let TryingTimes = 10;
            let n = 0;
            do {
                // Wait for the received data complete
                n = yield this.readRegister(this.ComIrqReg);
                TryingTimes--;
            } while (TryingTimes !== 0 && !(n & 0x01) && !(n & waitIRq)); // !(Timer interrupt - nothing received before timeout) & !(One of the interrupts that signal success has been set)
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
                        const lastBits = response[2] & 0x07; // RxLastBits[2:0] indicates the number of valid bits in the last received byte. If this value is 000b, the whole byte is valid.
                        if (lastBits) {
                            bitSize = (n - 1) * 8 + lastBits;
                        }
                        else {
                            bitSize = n * 8;
                        }
                        if (n === 0) {
                            n = 1;
                        }
                        if (n > 16) {
                            n = 16;
                        } // Restrict until 16bytes
                        data = yield this.readRegister_nByte(this.FIFODataReg, n); // Get received data from FIFO buffer
                    }
                }
                else {
                    status = ERROR;
                }
            }
            return { status, data, bitSize };
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
            const response = yield this.toCard(this.PCD_Transceive, tagType);
            if (response.bitSize !== 0x10) {
                throw new Error("card_search_ERROR");
            }
        });
    }
    getUidWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.writeRegister(this.BitFramingReg, 0x00);
            let uid = [this.PICC_SEL_CL1, 0x20];
            const response = yield this.toCard(this.PCD_Transceive, uid);
            if (!response.status) {
                throw new Error("uid_scan_ERROR");
            }
            const uidCheck = response.data[0] ^ response.data[1] ^ response.data[2] ^ response.data[3];
            if (uidCheck !== response.data[4]) {
                throw new Error("uid_check_ERROR");
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
            let i = 0xff;
            let n;
            // Wait for the CRC calculation to complete
            do {
                n = yield this.readRegister(this.DivIrqReg);
                i--;
            } while (i !== 0 && !(n & 0x04)); // CRCIrq = 1 (Calculation done)
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
                    version = "(clone)";
                    break;
                case 0x90:
                    version = "v0.0";
                    break;
                case 0x91:
                    version = "v1.0";
                    break;
                case 0x92:
                    version = "v2.0";
                    break;
                case 0x12:
                    version = "counterfeit chip";
                    break;
                default:
                    version = "(unknown)";
            }
            // When 0x00 or 0xFF is returned, communication probably failed
            if (version === 0x00 || version === 0xff) {
                throw new Error("software_version_ERROR");
            }
            return version;
        });
    }
    identifyCardTypeWait(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // Identify type of the scanned card
            let buffer = [this.PICC_SElECTTAG, 0x70].concat(uid);
            buffer = buffer.concat(yield this.calculateCRCWait(buffer));
            const response = yield this.toCard(this.PCD_Transceive, buffer);
            let PICC_Type;
            if (response.status && response.bitSize === 0x18) {
                PICC_Type = response.data[0];
            }
            switch (PICC_Type) {
                case 0x04:
                    PICC_Type = "SAK indicates UID is not complete.";
                    break; // UID not complete
                case 0x09:
                    PICC_Type = "MIFARE Mini, 320 bytes";
                    break;
                case 0x08:
                    PICC_Type = "MIFARE 1KB";
                    break;
                case 0x18:
                    PICC_Type = "MIFARE 4KB";
                    break;
                case 0x00:
                    PICC_Type = "MIFARE Ultralight or Ultralight C";
                    break;
                case 0x11:
                    PICC_Type = "MIFARE Plus";
                    break;
                case 0x01:
                    PICC_Type = "MIFARE TNP3XXX";
                    break;
                case 0x20:
                    PICC_Type = "PICC compliant with ISO/IEC 14443-4";
                    break;
                case 0x40:
                    PICC_Type = "PICC compliant with ISO/IEC 18092 (NFC)";
                    break;
                default:
                    throw new Error("PICC_type_ERROR");
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
            buffer = buffer.concat(uid); // 12byte
            // Start authentication itself
            yield this.toCard(this.PCD_MFAuthent, buffer);
            if (!((yield this.readRegister(this.Status2Reg)) & 0x08)) {
                throw new Error("password_authentication_ERROR");
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
            buffer = buffer.concat(uid); // 12byte
            // Start authentication itself
            yield this.toCard(this.PCD_MFAuthent, buffer);
            if (!((yield this.readRegister(this.Status2Reg)) & 0x08)) {
                throw new Error("password_authentication_ERROR");
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
            const response = [];
            const blockData = [];
            for (let i = 0; i < 4; i++) {
                let request = [this.PICC_READ, address * 4 + i];
                request = request.concat(yield this.calculateCRCWait(request));
                response[i] = yield this.toCard(this.PCD_Transceive, request);
                if (!response[i].status) {
                    throw new Error("data_read_ERROR");
                }
                blockData[i] = response[i].data;
            }
            return blockData;
        });
    }
    getBlockDataWait(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = [this.PICC_READ, address];
            request = request.concat(yield this.calculateCRCWait(request));
            const response = yield this.toCard(this.PCD_Transceive, request);
            if (!response.status) {
                throw new Error("data_read_ERROR");
            }
            return response.data;
        });
    }
    appendCRCtoBufferAndSendToCardWait(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            buffer = buffer.concat(yield this.calculateCRCWait(buffer));
            const response = yield this.toCard(this.PCD_Transceive, buffer);
            if (!response.status ||
                response.bitSize !== 4 ||
                (response.data[0] & 0x0f) !== 0x0a) {
                response.status = ERROR;
            }
            return response;
        });
    }
    writeBlockDataWait(Block, sixteenBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Block === 0 || Block % 4 === 3) {
                throw new Error("deny_Write");
            }
            const buffer = [this.PICC_WRITE, Block];
            let response = yield this.appendCRCtoBufferAndSendToCardWait(buffer);
            if (response.status) {
                response = yield this.appendCRCtoBufferAndSendToCardWait(sixteenBytes);
            }
            else {
                throw new Error("data_write_ERROR");
            }
        });
    }
}
exports.default = MFRC522;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9XaXJlbGVzcy9NRlJDNTIyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7Ozs7Ozs7O0FBRUgsd0JBQXdCO0FBRXhCLE1BQU0sRUFBRSxHQUFRLElBQUksQ0FBQztBQUNyQixNQUFNLEtBQUssR0FBUSxLQUFLLENBQUM7QUFFekIsTUFBTSxPQUFPO0lBNEdYO1FBQ0UsMERBQTBEO1FBQzFELHFFQUFxRTtRQUNyRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLGdEQUFnRDtRQUN0RSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLDRDQUE0QztRQUNqRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLENBQUMsd0NBQXdDO1FBQzFFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMseURBQXlEO1FBQ2xGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsdUNBQXVDO1FBQ2pFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsdUlBQXVJO1FBQ3BLLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsbUNBQW1DO1FBQzVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLENBQUMsMEdBQTBHO1FBQ3RJLCtCQUErQjtRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLDJEQUEyRDtRQUN0RixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLHNCQUFzQjtRQUVqRCw2RkFBNkY7UUFDN0YsMEdBQTBHO1FBQzFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLHlCQUF5QjtRQUN2RCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7UUFDOUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJ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Ijoic3JjL3BhcnRzL1dpcmVsZXNzL01GUkM1MjIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB2ZXIgMS4wXG4gKiAyMDE5LzEwLzE0XG4gKiBDcmVhdGVkIGJ5IFpqYWxpY1xuICovXG5cbi8qanNoaW50IGVzdmVyc2lvbjogOCAqL1xuXG5jb25zdCBPSzogYW55ID0gdHJ1ZTtcbmNvbnN0IEVSUk9SOiBhbnkgPSBmYWxzZTtcblxuY2xhc3MgTUZSQzUyMiB7XG5cbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIk1GUkM1MjJcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIFBDRF9JZGxlOiBhbnk7XG4gIHB1YmxpYyBQQ0RfTWVtOiBhbnk7XG4gIHB1YmxpYyBQQ0RfR2VuZXJhdGVSYW5kb21JRDogYW55O1xuICBwdWJsaWMgUENEX0NhbGNDUkM6IGFueTtcbiAgcHVibGljIFBDRF9UcmFuc21pdDogYW55O1xuICBwdWJsaWMgUENEX05vQ21kQ2hhbmdlOiBhbnk7XG4gIHB1YmxpYyBQQ0RfUmVjZWl2ZTogYW55O1xuICBwdWJsaWMgUENEX1RyYW5zY2VpdmU6IGFueTtcbiAgcHVibGljIFBDRF9NRkF1dGhlbnQ6IGFueTtcbiAgcHVibGljIFBDRF9Tb2Z0UmVzZXQ6IGFueTtcbiAgcHVibGljIFJ4R2Fpbl8xOGRCOiBhbnk7XG4gIHB1YmxpYyBSeEdhaW5fMjNkQjogYW55O1xuICBwdWJsaWMgUnhHYWluXzE4ZEJfMjogYW55O1xuICBwdWJsaWMgUnhHYWluXzIzZEJfMjogYW55O1xuICBwdWJsaWMgUnhHYWluXzMzZEI6IGFueTtcbiAgcHVibGljIFJ4R2Fpbl8zOGRCOiBhbnk7XG4gIHB1YmxpYyBSeEdhaW5fNDNkQjogYW55O1xuICBwdWJsaWMgUnhHYWluXzQ4ZEI6IGFueTtcbiAgcHVibGljIFJ4R2Fpbl9taW46IGFueTtcbiAgcHVibGljIFJ4R2Fpbl9hdmc6IGFueTtcbiAgcHVibGljIFJ4R2Fpbl9tYXg6IGFueTtcbiAgcHVibGljIFBJQ0NfUkVRQTogYW55O1xuICBwdWJsaWMgUElDQ19XVVBBOiBhbnk7XG4gIHB1YmxpYyBQSUNDX0NUOiBhbnk7XG4gIHB1YmxpYyBQSUNDX1NFTF9DTDE6IGFueTtcbiAgcHVibGljIFBJQ0NfU0VMX0NMMjogYW55O1xuICBwdWJsaWMgUElDQ19TRUxfQ0wzOiBhbnk7XG4gIHB1YmxpYyBQSUNDX0hMVEE6IGFueTtcbiAgcHVibGljIFBJQ0NfUkFUUzogYW55O1xuICBwdWJsaWMgUElDQ19BVVRIX0tFWUE6IGFueTtcbiAgcHVibGljIFBJQ0NfQVVUSF9LRVlCOiBhbnk7XG4gIHB1YmxpYyBQSUNDX1JFQUQ6IGFueTtcbiAgcHVibGljIFBJQ0NfV1JJVEU6IGFueTtcbiAgcHVibGljIFBJQ0NfREVDUkVNRU5UOiBhbnk7XG4gIHB1YmxpYyBQSUNDX0lOQ1JFTUVOVDogYW55O1xuICBwdWJsaWMgUElDQ19SRVNUT1JFOiBhbnk7XG4gIHB1YmxpYyBQSUNDX1RSQU5TRkVSOiBhbnk7XG4gIHB1YmxpYyBQSUNDX1VMX1dSSVRFOiBhbnk7XG4gIHB1YmxpYyBQSUNDX1NFbEVDVFRBRzogYW55O1xuICBwdWJsaWMgQ29tbWFuZFJlZzogYW55O1xuICBwdWJsaWMgQ29tbEVuUmVnOiBhbnk7XG4gIHB1YmxpYyBEaXZsRW5SZWc6IGFueTtcbiAgcHVibGljIENvbUlycVJlZzogYW55O1xuICBwdWJsaWMgRGl2SXJxUmVnOiBhbnk7XG4gIHB1YmxpYyBFcnJvclJlZzogYW55O1xuICBwdWJsaWMgU3RhdHVzMVJlZzogYW55O1xuICBwdWJsaWMgU3RhdHVzMlJlZzogYW55O1xuICBwdWJsaWMgRklGT0RhdGFSZWc6IGFueTtcbiAgcHVibGljIEZJRk9MZXZlbFJlZzogYW55O1xuICBwdWJsaWMgV2F0ZXJMZXZlbFJlZzogYW55O1xuICBwdWJsaWMgQ29udHJvbFJlZzogYW55O1xuICBwdWJsaWMgQml0RnJhbWluZ1JlZzogYW55O1xuICBwdWJsaWMgQ29sbFJlZzogYW55O1xuICBwdWJsaWMgTW9kZVJlZzogYW55O1xuICBwdWJsaWMgVHhNb2RlUmVnOiBhbnk7XG4gIHB1YmxpYyBSeE1vZGVSZWc6IGFueTtcbiAgcHVibGljIFR4Q29udHJvbFJlZzogYW55O1xuICBwdWJsaWMgVHhBU0tSZWc6IGFueTtcbiAgcHVibGljIFR4U2VsUmVnOiBhbnk7XG4gIHB1YmxpYyBSeFNlbFJlZzogYW55O1xuICBwdWJsaWMgUnhUaHJlc2hvbGRSZWc6IGFueTtcbiAgcHVibGljIERlbW9kUmVnOiBhbnk7XG4gIHB1YmxpYyBSZXNlcnZlZDFBaDogYW55O1xuICBwdWJsaWMgUmVzZXJ2ZWQxQmg6IGFueTtcbiAgcHVibGljIE1mVHhSZWc6IGFueTtcbiAgcHVibGljIE1mUnhSZWc6IGFueTtcbiAgcHVibGljIFJlc2VydmVkMUVoOiBhbnk7XG4gIHB1YmxpYyBTZXJpYWxTcGVlZFJlZzogYW55O1xuICBwdWJsaWMgQ1JDUmVzdWx0UmVnTVNCOiBhbnk7XG4gIHB1YmxpYyBDUkNSZXN1bHRSZWdMU0I6IGFueTtcbiAgcHVibGljIE1vZFdpZHRoUmVnOiBhbnk7XG4gIHB1YmxpYyBSRkNmZ1JlZzogYW55O1xuICBwdWJsaWMgR3NOUmVnOiBhbnk7XG4gIHB1YmxpYyBDV0dzUFJlZzogYW55O1xuICBwdWJsaWMgTW9kR3NQUmVnOiBhbnk7XG4gIHB1YmxpYyBUTW9kZVJlZzogYW55O1xuICBwdWJsaWMgVFByZXNjYWxlclJlZzogYW55O1xuICBwdWJsaWMgVFJlbG9hZFJlZ0hpOiBhbnk7XG4gIHB1YmxpYyBUUmVsb2FkUmVnTG86IGFueTtcbiAgcHVibGljIFRDb3VudGVyVmFsUmVnSGk6IGFueTtcbiAgcHVibGljIFRDb3VudGVyVmFsUmVnTG86IGFueTtcbiAgcHVibGljIFRlc3RTZWwxUmVnOiBhbnk7XG4gIHB1YmxpYyBUZXN0U2VsMlJlZzogYW55O1xuICBwdWJsaWMgVGVzdFBpbkVuUmVnOiBhbnk7XG4gIHB1YmxpYyBUZXN0UGluVmFsdWVSZWc6IGFueTtcbiAgcHVibGljIFRlc3RCdXNSZWc6IGFueTtcbiAgcHVibGljIEF1dG9UZXN0UmVnOiBhbnk7XG4gIHB1YmxpYyBWZXJzaW9uUmVnOiBhbnk7XG4gIHB1YmxpYyBBbmFsb2dUZXN0UmVnOiBhbnk7XG4gIHB1YmxpYyBUZXN0REFDMVJlZzogYW55O1xuICBwdWJsaWMgVGVzdERBQzJSZWc6IGFueTtcbiAgcHVibGljIFRlc3RBRENSZWc6IGFueTtcbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIHJlcXVpcmVkOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyByc3Q6IGFueTtcbiAgcHVibGljIGNzOiBhbnk7XG4gIHB1YmxpYyBzcGk6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBQQ0QgY29tbWFuZHMuIERlc2NyaWJlZCBpbiBjaGFwdGVyIDEwIG9mIHRoZSBkYXRhc2hlZXQuXG4gICAgLy8gUENEKFByb3hpbWl0eSBDb3VwbGluZyBEZXZpY2UpOiBOWFAgTUZSQzUyMiBDb250YWN0bGVzcyBSZWFkZXIgSUMuXG4gICAgdGhpcy5QQ0RfSWRsZSA9IDB4MDA7IC8vIG5vIGFjdGlvbiwgY2FuY2VscyBjdXJyZW50IGNvbW1hbmQgZXhlY3V0aW9uLlxuICAgIHRoaXMuUENEX01lbSA9IDB4MDE7IC8vIHN0b3JlcyAyNSBieXRlcyBpbnRvIHRoZSBpbnRlcm5hbCBidWZmZXIuXG4gICAgdGhpcy5QQ0RfR2VuZXJhdGVSYW5kb21JRCA9IDB4MDI7IC8vIGdlbmVyYXRlcyBhIDEwLWJ5dGUgcmFuZG9tIElEIG51bWJlci5cbiAgICB0aGlzLlBDRF9DYWxjQ1JDID0gMHgwMzsgLy8gYWN0aXZhdGVzIHRoZSBDUkMgY29wcm9jZXNzb3Igb3IgcGVyZm9ybXMgYSBzZWxmLXRlc3QuXG4gICAgdGhpcy5QQ0RfVHJhbnNtaXQgPSAweDA0OyAvLyB0cmFuc21pdHMgZGF0YSBmcm9tIHRoZSBGSUZPIGJ1ZmZlci5cbiAgICB0aGlzLlBDRF9Ob0NtZENoYW5nZSA9IDB4MDc7IC8vIG5vIGNvbW1hbmQgY2hhbmdlLCBjYW4gYmUgdXNlZCB0byBtb2RpZnkgdGhlIENvbW1hbmRSZWcgcmVnaXN0ZXIgYml0cyB3aXRob3V0IGFmZmVjdGluZyB0aGUgY29tbWFuZCwgZm9yIGV4YW1wbGUsIHRoZSBQb3dlckRvd24gYml0LlxuICAgIHRoaXMuUENEX1JlY2VpdmUgPSAweDA4OyAvLyBhY3RpdmF0ZXMgdGhlIHJlY2VpdmVyIGNpcmN1aXRzLlxuICAgIHRoaXMuUENEX1RyYW5zY2VpdmUgPSAweDBjOyAvLyB0cmFuc21pdHMgZGF0YSBmcm9tIEZJRk8gYnVmZmVyIHRvIGFudGVubmEgYW5kIGF1dG9tYXRpY2FsbHkgYWN0aXZhdGVzIHRoZSByZWNlaXZlciBhZnRlciB0cmFuc21pc3Npb24uXG4gICAgLy8gdGhpcy5QQ0RfUmVzZXJ2ZWQwRGggPSAweDBEO1xuICAgIHRoaXMuUENEX01GQXV0aGVudCA9IDB4MGU7IC8vIHBlcmZvcm1zIHRoZSBNSUZBUkUgc3RhbmRhcmQgYXV0aGVudGljYXRpb24gYXMgYSByZWFkZXIuXG4gICAgdGhpcy5QQ0RfU29mdFJlc2V0ID0gMHgwZjsgLy8gcmVzZXRzIHRoZSBNRlJDNTIyLlxuXG4gICAgLy8gTUZSQzUyMiBSeEdhaW5bMjowXSBtYXNrcywgZGVmaW5lcyB0aGUgcmVjZWl2ZXIncyBzaWduYWwgdm9sdGFnZSBnYWluIGZhY3RvciAob24gdGhlIFBDRCkuXG4gICAgLy8gRGVzY3JpYmVkIGluIDkuMy4zLjYgLyB0YWJsZSA5OCBvZiB0aGUgZGF0YXNoZWV0IGF0IGh0dHA6Ly93d3cubnhwLmNvbS9kb2N1bWVudHMvZGF0YV9zaGVldC9NRlJDNTIyLnBkZlxuICAgIHRoaXMuUnhHYWluXzE4ZEIgPSAweDAwIDw8IDQ7IC8vIDAwMGIgLSAxOCBkQiwgbWluaW11bS5cbiAgICB0aGlzLlJ4R2Fpbl8yM2RCID0gMHgwMSA8PCA0OyAvLyAwMDFiIC0gMjMgZEIuXG4gICAgdGhpcy5SeEdhaW5fMThkQl8yID0gMHgwMiA8PCA0OyAvLyAwMTBiIC0gMTggZEIsIGl0IHNlZW1zIDAxMGIgaXMgYSBkdXBsaWNhdGUgZm9yIDAwMGIuXG4gICAgdGhpcy5SeEdhaW5fMjNkQl8yID0gMHgwMyA8PCA0OyAvLyAwMTFiIC0gMjMgZEIsIGl0IHNlZW1zIDAxMWIgaXMgYSBkdXBsaWNhdGUgZm9yIDAwMWIuXG4gICAgdGhpcy5SeEdhaW5fMzNkQiA9IDB4MDQgPDwgNDsgLy8gMTAwYiAtIDMzIGRCLCBhdmVyYWdlLCBhbmQgdHlwaWNhbCBkZWZhdWx0LlxuICAgIHRoaXMuUnhHYWluXzM4ZEIgPSAweDA1IDw8IDQ7IC8vIDEwMWIgLSAzOCBkQi5cbiAgICB0aGlzLlJ4R2Fpbl80M2RCID0gMHgwNiA8PCA0OyAvLyAxMTBiIC0gNDMgZEIuXG4gICAgdGhpcy5SeEdhaW5fNDhkQiA9IDB4MDcgPDwgNDsgLy8gMTExYiAtIDQ4IGRCLCBtYXhpbXVtLlxuICAgIHRoaXMuUnhHYWluX21pbiA9IDB4MDAgPDwgNDsgLy8gMDAwYiAtIDE4IGRCLCBtaW5pbXVtLCBjb252ZW5pZW5jZSBmb3IgUnhHYWluXzE4ZEIuXG4gICAgdGhpcy5SeEdhaW5fYXZnID0gMHgwNCA8PCA0OyAvLyAxMDBiIC0gMzMgZEIsIGF2ZXJhZ2UsIGNvbnZlbmllbmNlIGZvciBSeEdhaW5fMzNkQi5cbiAgICB0aGlzLlJ4R2Fpbl9tYXggPSAweDA3IDw8IDQ7IC8vIDExMWIgLSA0OCBkQiwgbWF4aW11bSwgY29udmVuaWVuY2UgZm9yIFJ4R2Fpbl80OGRCLlxuXG4gICAgLy8gVGhlIFBJQ0MgY29tbWFuZHMgdXNlZCBieSB0aGUgUENEIHRvIG1hbmFnZSBjb21tdW5pY2F0aW9uIHdpdGggc2V2ZXJhbCBQSUNDcyAoSVNPIDE0NDQzLTMsIFR5cGUgQSwgc2VjdGlvbiA2LjQpLlxuICAgIHRoaXMuUElDQ19SRVFBID0gMHgyNjsgLy8gUkVRdWVzdCBjb21tYW5kLCBUeXBlIEEuIEludml0ZXMgUElDQ3MgaW4gc3RhdGUgSURMRSB0byBnbyB0byBSRUFEWSBhbmQgcHJlcGFyZSBmb3IgYW50aWNvbGxpc2lvbiBvciBzZWxlY3Rpb24uIDcgYml0IGZyYW1lLlxuICAgIHRoaXMuUElDQ19XVVBBID0gMHg1MjsgLy8gV2FrZS1VUCBjb21tYW5kLCBUeXBlIEEuIEludml0ZXMgUElDQ3MgaW4gc3RhdGUgSURMRSBhbmQgSEFMVCB0byBnbyB0byBSRUFEWSgqKSBhbmQgcHJlcGFyZSBmb3IgYW50aWNvbGxpc2lvbiBvciBzZWxlY3Rpb24uIDcgYml0IGZyYW1lLlxuICAgIHRoaXMuUElDQ19DVCA9IDB4ODg7IC8vIENhc2NhZGUgVGFnLiBOb3QgcmVhbGx5IGEgY29tbWFuZCwgYnV0IHVzZWQgZHVyaW5nIGFudGkgY29sbGlzaW9uLlxuICAgIHRoaXMuUElDQ19TRUxfQ0wxID0gMHg5MzsgLy8gQW50aSBjb2xsaXNpb24vU2VsZWN0LCBDYXNjYWRlIExldmVsIDEuXG4gICAgdGhpcy5QSUNDX1NFTF9DTDIgPSAweDk1OyAvLyBBbnRpIGNvbGxpc2lvbi9TZWxlY3QsIENhc2NhZGUgTGV2ZWwgMi5cbiAgICB0aGlzLlBJQ0NfU0VMX0NMMyA9IDB4OTc7IC8vIEFudGkgY29sbGlzaW9uL1NlbGVjdCwgQ2FzY2FkZSBMZXZlbCAzLlxuICAgIHRoaXMuUElDQ19ITFRBID0gMHg1MDsgLy8gSGFMVCBjb21tYW5kLCBUeXBlIEEuIEluc3RydWN0cyBhbiBBQ1RJVkUgUElDQyB0byBnbyB0byBzdGF0ZSBIQUxULlxuICAgIHRoaXMuUElDQ19SQVRTID0gMHhlMDsgLy8gUmVxdWVzdCBjb21tYW5kIGZvciBBbnN3ZXIgVG8gUmVzZXQuXG4gICAgLy8gVGhlIGNvbW1hbmRzIHVzZWQgZm9yIE1JRkFSRSBDbGFzc2ljIChmcm9tIGh0dHA6Ly93d3cubW91c2VyLmNvbS9kcy8yLzMwMi9NRjFTNTAzeC04OTU3NC5wZGYsIFNlY3Rpb24gOSlcbiAgICAvLyBVc2UgUENEX01GQXV0aGVudCB0byBhdXRoZW50aWNhdGUgYWNjZXNzIHRvIGEgc2VjdG9yLCB0aGVuIHVzZSB0aGVzZSBjb21tYW5kcyB0byByZWFkL3dyaXRlL21vZGlmeSB0aGUgYmxvY2tzIG9uIHRoZSBzZWN0b3IuXG4gICAgLy8gVGhlIHJlYWQvd3JpdGUgY29tbWFuZHMgY2FuIGFsc28gYmUgdXNlZCBmb3IgTUlGQVJFIFVsdHJhbGlnaHQuXG4gICAgdGhpcy5QSUNDX0FVVEhfS0VZQSA9IDB4NjA7IC8vIFBlcmZvcm0gYXV0aGVudGljYXRpb24gd2l0aCBLZXkgQS5cbiAgICB0aGlzLlBJQ0NfQVVUSF9LRVlCID0gMHg2MTsgLy8gUGVyZm9ybSBhdXRoZW50aWNhdGlvbiB3aXRoIEtleSBCLlxuICAgIHRoaXMuUElDQ19SRUFEID0gMHgzMDsgLy8gUmVhZHMgb25lIDE2IGJ5dGUgYmxvY2sgZnJvbSB0aGUgYXV0aGVudGljYXRlZCBzZWN0b3Igb2YgdGhlIFBJQ0MuIEFsc28gdXNlZCBmb3IgTUlGQVJFIFVsdHJhbGlnaHQuXG4gICAgdGhpcy5QSUNDX1dSSVRFID0gMHhhMDsgLy8gV3JpdGVzIG9uZSAxNiBieXRlIGJsb2NrIHRvIHRoZSBhdXRoZW50aWNhdGVkIHNlY3RvciBvZiB0aGUgUElDQy4gQ2FsbGVkIFwiQ09NUEFUSUJJTElUWSBXUklURVwiIGZvciBNSUZBUkUgVWx0cmFsaWdodC5cbiAgICB0aGlzLlBJQ0NfREVDUkVNRU5UID0gMHhjMDsgLy8gRGVjcmVtZW50cyB0aGUgY29udGVudHMgb2YgYSBibG9jayBhbmQgc3RvcmVzIHRoZSByZXN1bHQgaW4gdGhlIGludGVybmFsIGRhdGEgcmVnaXN0ZXIuXG4gICAgdGhpcy5QSUNDX0lOQ1JFTUVOVCA9IDB4YzE7IC8vIEluY3JlbWVudHMgdGhlIGNvbnRlbnRzIG9mIGEgYmxvY2sgYW5kIHN0b3JlcyB0aGUgcmVzdWx0IGluIHRoZSBpbnRlcm5hbCBkYXRhIHJlZ2lzdGVyLlxuICAgIHRoaXMuUElDQ19SRVNUT1JFID0gMHhjMjsgLy8gUmVhZHMgdGhlIGNvbnRlbnRzIG9mIGEgYmxvY2sgaW50byB0aGUgaW50ZXJuYWwgZGF0YSByZWdpc3Rlci5cbiAgICB0aGlzLlBJQ0NfVFJBTlNGRVIgPSAweGIwOyAvLyBXcml0ZXMgdGhlIGNvbnRlbnRzIG9mIHRoZSBpbnRlcm5hbCBkYXRhIHJlZ2lzdGVyIHRvIGEgYmxvY2suXG4gICAgLy8gVGhlIGNvbW1hbmRzIHVzZWQgZm9yIE1JRkFSRSBVbHRyYWxpZ2h0IChmcm9tIGh0dHA6Ly93d3cubnhwLmNvbS9kb2N1bWVudHMvZGF0YV9zaGVldC9NRjBJQ1UxLnBkZiwgU2VjdGlvbiA4LjYpXG4gICAgLy8gVGhlIFBJQ0NfQ01EX01GX1JFQUQgYW5kIFBJQ0NfQ01EX01GX1dSSVRFIGNhbiBhbHNvIGJlIHVzZWQgZm9yIE1JRkFSRSBVbHRyYWxpZ2h0LlxuICAgIHRoaXMuUElDQ19VTF9XUklURSA9IDB4YTI7IC8vIFdyaXRlcyBvbmUgNCBieXRlIHBhZ2UgdG8gdGhlIFBJQ0MuXG5cbiAgICB0aGlzLlBJQ0NfU0VsRUNUVEFHID0gMHg5MztcblxuICAgIC8vIFBhZ2UgMDogQ29tbWFuZCBhbmQgc3RhdHVzXG4gICAgLy8gdGhpcy5SZXNlcnZlZDAwaCA9IDB4MDA7XG4gICAgdGhpcy5Db21tYW5kUmVnID0gMHgwMTtcbiAgICB0aGlzLkNvbWxFblJlZyA9IDB4MDI7XG4gICAgdGhpcy5EaXZsRW5SZWcgPSAweDAzO1xuICAgIHRoaXMuQ29tSXJxUmVnID0gMHgwNDtcbiAgICB0aGlzLkRpdklycVJlZyA9IDB4MDU7XG4gICAgdGhpcy5FcnJvclJlZyA9IDB4MDY7XG4gICAgdGhpcy5TdGF0dXMxUmVnID0gMHgwNztcbiAgICB0aGlzLlN0YXR1czJSZWcgPSAweDA4O1xuICAgIHRoaXMuRklGT0RhdGFSZWcgPSAweDA5O1xuICAgIHRoaXMuRklGT0xldmVsUmVnID0gMHgwYTtcbiAgICB0aGlzLldhdGVyTGV2ZWxSZWcgPSAweDBiO1xuICAgIHRoaXMuQ29udHJvbFJlZyA9IDB4MGM7XG4gICAgdGhpcy5CaXRGcmFtaW5nUmVnID0gMHgwZDtcbiAgICB0aGlzLkNvbGxSZWcgPSAweDBlO1xuICAgIC8vIHRoaXMuUmVzZXJ2ZWQwRmggPSAweDBGO1xuXG4gICAgLy8gUGFnZSAxOiBDb21tYW5kXG4gICAgLy8gdGhpcy5SZXNlcnZlZDEwaCA9IDB4MTA7XG4gICAgdGhpcy5Nb2RlUmVnID0gMHgxMTtcbiAgICB0aGlzLlR4TW9kZVJlZyA9IDB4MTI7XG4gICAgdGhpcy5SeE1vZGVSZWcgPSAweDEzO1xuICAgIHRoaXMuVHhDb250cm9sUmVnID0gMHgxNDtcbiAgICB0aGlzLlR4QVNLUmVnID0gMHgxNTtcbiAgICB0aGlzLlR4U2VsUmVnID0gMHgxNjtcbiAgICB0aGlzLlJ4U2VsUmVnID0gMHgxNztcbiAgICB0aGlzLlJ4VGhyZXNob2xkUmVnID0gMHgxODtcbiAgICB0aGlzLkRlbW9kUmVnID0gMHgxOTtcbiAgICB0aGlzLlJlc2VydmVkMUFoID0gMHgxYTtcbiAgICB0aGlzLlJlc2VydmVkMUJoID0gMHgxYjtcbiAgICB0aGlzLk1mVHhSZWcgPSAweDFjO1xuICAgIHRoaXMuTWZSeFJlZyA9IDB4MWQ7XG4gICAgdGhpcy5SZXNlcnZlZDFFaCA9IDB4MWU7XG4gICAgdGhpcy5TZXJpYWxTcGVlZFJlZyA9IDB4MWY7XG5cbiAgICAvLyBQYWdlIDI6IENvbmZpZ3VyYXRpb25cbiAgICAvLyB0aGlzLlJlc2VydmVkMjBoID0gMHgyMDtcbiAgICB0aGlzLkNSQ1Jlc3VsdFJlZ01TQiA9IDB4MjE7XG4gICAgdGhpcy5DUkNSZXN1bHRSZWdMU0IgPSAweDIyO1xuICAgIC8vIHRoaXMuUmVzZXJ2ZWQyM2ggPSAweDIzO1xuICAgIHRoaXMuTW9kV2lkdGhSZWcgPSAweDI0O1xuICAgIC8vIHRoaXMuUmVzZXJ2ZWQyNWggPSAweDI1O1xuICAgIHRoaXMuUkZDZmdSZWcgPSAweDI2O1xuICAgIHRoaXMuR3NOUmVnID0gMHgyNztcbiAgICB0aGlzLkNXR3NQUmVnID0gMHgyODtcbiAgICB0aGlzLk1vZEdzUFJlZyA9IDB4Mjk7XG4gICAgdGhpcy5UTW9kZVJlZyA9IDB4MmE7XG4gICAgdGhpcy5UUHJlc2NhbGVyUmVnID0gMHgyYjtcbiAgICB0aGlzLlRSZWxvYWRSZWdIaSA9IDB4MmM7XG4gICAgdGhpcy5UUmVsb2FkUmVnTG8gPSAweDJkO1xuICAgIHRoaXMuVENvdW50ZXJWYWxSZWdIaSA9IDB4MmU7XG4gICAgdGhpcy5UQ291bnRlclZhbFJlZ0xvID0gMHgyZjtcblxuICAgIC8vIFBhZ2UgMzogVGVzdCByZWdpc3RlclxuICAgIC8vIHRoaXMuUmVzZXJ2ZWQzMGggPSAweDMwO1xuICAgIHRoaXMuVGVzdFNlbDFSZWcgPSAweDMxO1xuICAgIHRoaXMuVGVzdFNlbDJSZWcgPSAweDMyO1xuICAgIHRoaXMuVGVzdFBpbkVuUmVnID0gMHgzMztcbiAgICB0aGlzLlRlc3RQaW5WYWx1ZVJlZyA9IDB4MzQ7XG4gICAgdGhpcy5UZXN0QnVzUmVnID0gMHgzNTtcbiAgICB0aGlzLkF1dG9UZXN0UmVnID0gMHgzNjtcbiAgICB0aGlzLlZlcnNpb25SZWcgPSAweDM3O1xuICAgIHRoaXMuQW5hbG9nVGVzdFJlZyA9IDB4Mzg7XG4gICAgdGhpcy5UZXN0REFDMVJlZyA9IDB4Mzk7XG4gICAgdGhpcy5UZXN0REFDMlJlZyA9IDB4M2E7XG4gICAgdGhpcy5UZXN0QURDUmVnID0gMHgzYjtcbiAgICAvLyB0aGlzLlJlc2VydmVkM0NoID0gMHgzQztcbiAgICAvLyB0aGlzLlJlc2VydmVkM0RoID0gMHgzRDtcbiAgICAvLyB0aGlzLlJlc2VydmVkM0VoID0gMHgzRTtcbiAgICAvLyB0aGlzLlJlc2VydmVkM0ZoID0gMHgzRjtcblxuICAgIC8vIHJlcXVpcmVkIHBpbiBvZiBvYm5pelxuICAgIHRoaXMua2V5cyA9IFtcbiAgICAgIFwiY3NcIixcbiAgICAgIFwiY2xrXCIsXG4gICAgICBcIm1vc2lcIixcbiAgICAgIFwibWlzb1wiLFxuICAgICAgXCJyc3RcIixcbiAgICAgIFwidmNjXCIsXG4gICAgICBcImduZFwiLFxuICAgICAgXCJzcGlcIixcbiAgICAgIFwic3BpX2ZyZXF1ZW5jeVwiLFxuICAgIF07XG4gICAgdGhpcy5yZXF1aXJlZCA9IFtcImNzXCIsIFwibW9zaVwiLCBcIm1pc29cIiwgXCJyc3RcIl07XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICAvLyBJTyBwaW4gc2V0dGluZ3NcbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgXCI1dlwiKTtcbiAgICB0aGlzLnJzdCA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnJzdCk7XG4gICAgLy8gU1BJIHNldHRpbmdzXG4gICAgdGhpcy5jcyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmNzKTtcbiAgICB0aGlzLmNzLm91dHB1dCh0cnVlKTtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gXCJtYXN0ZXJcIjtcbiAgICB0aGlzLnBhcmFtcy5kcml2ZSA9IFwiM3ZcIjtcbiAgICB0aGlzLnBhcmFtcy5wdWxsID0gXCIzdlwiO1xuICAgIHRoaXMucGFyYW1zLmZyZXF1ZW5jeSA9IHRoaXMucGFyYW1zLnNwaV9mcmVxdWVuY3kgfHwgNSAqIDEwMDAgKiAxMDAwO1xuICAgIHRoaXMuc3BpID0gdGhpcy5vYm5pei5nZXRTcGlXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemVzIHRoZSBNRlJDNTIyIGNoaXBcbiAgICAvLyBIYXJkd2FyZSBhbmQgU29mdHdhcmUgcmVzZXRcbiAgICB0aGlzLnJzdC5vdXRwdXQoZmFsc2UpO1xuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCg1MCk7IC8vIDguOC4yIHNheXMgdGhlIG9zY2lsbGF0b3Igc3RhcnQtdXAgdGltZSBpcyB0aGUgc3RhcnQgdXAgdGltZSBvZiB0aGUgY3J5c3RhbCArIDM3LDc0dXM6IDUwbXMuXG4gICAgdGhpcy5yc3Qub3V0cHV0KHRydWUpO1xuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkNvbW1hbmRSZWcsIHRoaXMuUENEX1NvZnRSZXNldCk7XG5cbiAgICAvLyBUaW1lciBzZXR1cDogV2hlbiBjb21tdW5pY2F0aW5nIHdpdGggYSBQSUNDIHdlIG5lZWQgYSB0aW1lb3V0IGlmIHNvbWV0aGluZyBnb2VzIHdyb25nLlxuICAgIC8vIGZfdGltZXIgPSAxMy41NiBNSHogLyAoMipUUHJlU2NhbGVyKzEpIHdoZXJlIFRQcmVTY2FsZXIgPSBbVFByZXNjYWxlcl9IaTpUUHJlc2NhbGVyX0xvXS5cbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5UTW9kZVJlZywgMHg4MCk7IC8vIFRBdXRvPTE7IHRpbWVyIHN0YXJ0cyBhdXRvbWF0aWNhbGx5IGF0IHRoZSBlbmQgb2YgdGhlIHRyYW5zbWlzc2lvbiBpbiBhbGwgY29tbXVuaWNhdGlvbiBtb2RlcyBhdCBhbGwgc3BlZWRzXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuVFByZXNjYWxlclJlZywgMHhhOSk7IC8vIFRQcmVTY2FsZXIgPSBUTW9kZVJlZ1szLi4wXTogVFByZXNjYWxlclJlZywgaWUgMHgwQTkgPSAxNjkgPT4gZl90aW1lcj00MGtIeiwgaWUgYSB0aW1lciBwZXJpb2Qgb2YgMjV1cy5cbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5UUmVsb2FkUmVnSGksIDB4MDMpO1xuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLlRSZWxvYWRSZWdMbywgMHhlOCk7IC8vIFJlbG9hZCB0aW1lciB3aXRoIDB4M0U4ID0gMTAwMCwgaWUuIDI1bXMgYmVmb3JlIHRpbWVvdXRcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5UeEFTS1JlZywgMHg0MCk7IC8vIERlZmF1bHQgMHgwMC4gRm9yY2UgYSAxMDAgJSBBU0sgbW9kdWxhdGlvbiBpbmRlcGVuZGVudCBvZiB0aGUgTW9kR3NQUmVnIHJlZ2lzdGVyIHNldHRpbmdcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5Nb2RlUmVnLCAweDNkKTsgLy8gRGVmYXVsdCAweDNGLiBTZXQgdGhlIHByZXNldCB2YWx1ZSBmb3IgdGhlIENSQyBjb3Byb2Nlc3NvciBmb3IgdGhlIENhbGNDUkMgY29tbWFuZCB0byAweDYzNjMgKDYuMi40KVxuICAgIGF3YWl0IHRoaXMuYW50ZW5uYU9uKCk7IC8vIEVuYWJsZSB0aGUgYW50ZW5uYSBkcml2ZXIgcGlucyBUWDEgYW5kIFRYMiAodGhleSB3ZXJlIGRpc2FibGVkIGJ5IHRoZSByZXNldClcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZVJlZ2lzdGVyKGFkZHI6IGFueSwgdmFsOiBhbnkpIHtcbiAgICBsZXQgZGF0YTogYW55O1xuICAgIGlmICh2YWwgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgLy8gSWYgdmFsIGlzIEFycmF5XG4gICAgICBkYXRhID0gWyhhZGRyIDw8IDEpICYgMHg3ZV0uY29uY2F0KHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBbKGFkZHIgPDwgMSkgJiAweDdlLCB2YWxdO1xuICAgIH1cbiAgICB0aGlzLmNzLm91dHB1dChmYWxzZSk7XG4gICAgdGhpcy5zcGkud3JpdGUoZGF0YSk7XG4gICAgdGhpcy5jcy5vdXRwdXQodHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVhZFJlZ2lzdGVyKGFkZHI6IGFueSkge1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IFsoKGFkZHIgPDwgMSkgJiAweDdlKSB8IDB4ODAsIDBdO1xuICAgIHRoaXMuY3Mub3V0cHV0KGZhbHNlKTtcbiAgICBjb25zdCByZXNwb25zZTogYW55ID0gYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KGRhdGEpO1xuICAgIHRoaXMuY3Mub3V0cHV0KHRydWUpO1xuICAgIHJldHVybiByZXNwb25zZVsxXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZWFkUmVnaXN0ZXJfbkJ5dGUoYWRkcjogYW55LCBuPzogYW55KSB7XG4gICAgY29uc3QgZGF0YUFycmF5OiBhbnkgPSBbXTtcbiAgICBpZiAoYWRkciBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAvLyBNdWx0aXBsZSBhZGRyZXNzZXMoSWYgYWRkciBpcyBBcnJheSlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkci5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXkucHVzaCgoKGFkZHJbaV0gPDwgMSkgJiAweDdlKSB8IDB4ODApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTaW5nbGUgYWRkcmVzcyAmIHJlYWQgbiB0aW1lc1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5LnB1c2goKChhZGRyIDw8IDEpICYgMHg3ZSkgfCAweDgwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGF0YUFycmF5LnB1c2goMCk7IC8vIEVuZCByZWFkaW5nXG4gICAgdGhpcy5jcy5vdXRwdXQoZmFsc2UpO1xuICAgIGNvbnN0IHZhbHVlczogYW55ID0gYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KGRhdGFBcnJheSk7XG4gICAgdGhpcy5jcy5vdXRwdXQodHJ1ZSk7XG4gICAgdmFsdWVzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzZXRSZWdpc3RlckJpdE1hc2socmVnOiBhbnksIG1hc2s6IGFueSkge1xuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3RlcihyZWcpO1xuICAgIHRoaXMud3JpdGVSZWdpc3RlcihyZWcsIHJlc3BvbnNlIHwgbWFzayk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2xlYXJSZWdpc3RlckJpdE1hc2socmVnOiBhbnksIG1hc2s6IGFueSkge1xuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3RlcihyZWcpO1xuICAgIHRoaXMud3JpdGVSZWdpc3RlcihyZWcsIHJlc3BvbnNlICYgfm1hc2spO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGFudGVubmFPbigpIHtcbiAgICAvLyBUdXJucyB0aGUgYW50ZW5uYSBvbiBieSBlbmFibGluZyBwaW5zIFRYMSBhbmQgVFgyXG4gICAgY29uc3QgcmVzcG9uc2U6IGFueSA9IGF3YWl0IHRoaXMucmVhZFJlZ2lzdGVyKHRoaXMuVHhDb250cm9sUmVnKTtcbiAgICBpZiAoKHJlc3BvbnNlICYgMHgwMykgIT09IDB4MDMpIHtcbiAgICAgIC8vIElmIFRYMSBhbmQgVFgyIGRvd25cbiAgICAgIGF3YWl0IHRoaXMuc2V0UmVnaXN0ZXJCaXRNYXNrKHRoaXMuVHhDb250cm9sUmVnLCByZXNwb25zZSB8IDB4MDMpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBhbnRlbm5hT2ZmKCkge1xuICAgIC8vIFR1cm5zIHRoZSBhbnRlbm5hIG9mZiBieSBkaXNhYmxpbmcgcGlucyBUWDEgYW5kIFRYMlxuICAgIGF3YWl0IHRoaXMuY2xlYXJSZWdpc3RlckJpdE1hc2sodGhpcy5UeENvbnRyb2xSZWcsIDB4MDMpO1xuICB9XG5cbiAgLy8gUkM1MjIgYW5kIElTTzE0NDQzIGNhcmQgY29tbXVuaWNhdGlvblxuICBwdWJsaWMgYXN5bmMgdG9DYXJkKGNvbW1hbmQ6IGFueSwgYml0c1RvU2VuZDogYW55KSB7XG4gICAgbGV0IGRhdGE6IGFueSA9IFtdO1xuICAgIGxldCBiaXRTaXplOiBhbnkgPSAwO1xuICAgIGxldCBzdGF0dXM6IGFueSA9IEVSUk9SO1xuICAgIGxldCBpcnFFbjogYW55ID0gMHgwMDtcbiAgICBsZXQgd2FpdElScTogYW55ID0gMHgwMDtcblxuICAgIGlmIChjb21tYW5kID09PSB0aGlzLlBDRF9NRkF1dGhlbnQpIHtcbiAgICAgIGlycUVuID0gMHgxMjtcbiAgICAgIHdhaXRJUnEgPSAweDEwO1xuICAgIH1cbiAgICBpZiAoY29tbWFuZCA9PT0gdGhpcy5QQ0RfVHJhbnNjZWl2ZSkge1xuICAgICAgaXJxRW4gPSAweDc3O1xuICAgICAgd2FpdElScSA9IDB4MzA7XG4gICAgfVxuXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tbWFuZFJlZywgdGhpcy5QQ0RfSWRsZSk7IC8vIFN0b3AgYW55IGFjdGl2ZSBjb21tYW5kXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tbEVuUmVnLCBpcnFFbiB8IDB4ODApOyAvLyBJbnRlcnJ1cHQgcmVxdWVzdCBpcyBlbmFibGVkXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tSXJxUmVnLCAweDdmKTsgLy8gQ2xlYXIgYWxsIHNldmVuIGludGVycnVwdCByZXF1ZXN0IGJpdHNcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5GSUZPTGV2ZWxSZWcsIDB4ODApOyAvLyBGbHVzaEJ1ZmZlciA9IDEsIEZJRk8gaW5pdGlhbGl6YXRpb25cbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5GSUZPRGF0YVJlZywgYml0c1RvU2VuZCk7IC8vIFdyaXRlIHNlbmREYXRhIHRvIHRoZSBGSUZPXG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQ29tbWFuZFJlZywgY29tbWFuZCk7IC8vIEV4ZWN1dGUgdGhlIGNvbW1hbmRcblxuICAgIGlmIChjb21tYW5kID09PSB0aGlzLlBDRF9UcmFuc2NlaXZlKSB7XG4gICAgICBhd2FpdCB0aGlzLnNldFJlZ2lzdGVyQml0TWFzayh0aGlzLkJpdEZyYW1pbmdSZWcsIDB4ODApOyAvLyBTdGFydFNlbmQ9MSwgdHJhbnNtaXNzaW9uIG9mIGRhdGEgc3RhcnRzXG4gICAgfVxuXG4gICAgbGV0IFRyeWluZ1RpbWVzOiBhbnkgPSAxMDsgbGV0IG46IGFueSA9IDA7XG4gICAgZG8ge1xuICAgICAgLy8gV2FpdCBmb3IgdGhlIHJlY2VpdmVkIGRhdGEgY29tcGxldGVcbiAgICAgIG4gPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3Rlcih0aGlzLkNvbUlycVJlZyk7XG4gICAgICBUcnlpbmdUaW1lcy0tO1xuICAgIH0gd2hpbGUgKFRyeWluZ1RpbWVzICE9PSAwICYmICEobiAmIDB4MDEpICYmICEobiAmIHdhaXRJUnEpKTsgLy8gIShUaW1lciBpbnRlcnJ1cHQgLSBub3RoaW5nIHJlY2VpdmVkIGJlZm9yZSB0aW1lb3V0KSAmICEoT25lIG9mIHRoZSBpbnRlcnJ1cHRzIHRoYXQgc2lnbmFsIHN1Y2Nlc3MgaGFzIGJlZW4gc2V0KVxuXG4gICAgLy8gYXdhaXQgdGhpcy5jbGVhclJlZ2lzdGVyQml0TWFzayh0aGlzLkJpdEZyYW1pbmdSZWcsIDB4ODApO1x0Ly9SZXNldCB3aXRoIHJlc2V0QW5kSW5pdCgpXG5cbiAgICBjb25zdCByZXNwb25zZTogYW55ID0gYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXJfbkJ5dGUoW1xuICAgICAgdGhpcy5FcnJvclJlZyxcbiAgICAgIHRoaXMuRklGT0xldmVsUmVnLFxuICAgICAgdGhpcy5Db250cm9sUmVnLFxuICAgIF0pO1xuXG4gICAgaWYgKFRyeWluZ1RpbWVzICE9PSAwKSB7XG4gICAgICBpZiAoKHJlc3BvbnNlWzBdICYgMHgxYikgPT09IDB4MDApIHtcbiAgICAgICAgLy8gQnVmZmVyT3ZmbCBDb2xsRXJyIFBhcml0eUVyciBQcm90b2NvbEVyclxuICAgICAgICBzdGF0dXMgPSBuICYgaXJxRW4gJiAweDAxID8gRVJST1IgOiBPSztcblxuICAgICAgICBpZiAoY29tbWFuZCA9PT0gdGhpcy5QQ0RfVHJhbnNjZWl2ZSkge1xuICAgICAgICAgIG4gPSByZXNwb25zZVsxXTsgLy8gTnVtYmVyIG9mIGJ5dGVzIGluIHRoZSBGSUZPXG4gICAgICAgICAgY29uc3QgbGFzdEJpdHM6IGFueSA9IHJlc3BvbnNlWzJdICYgMHgwNzsgLy8gUnhMYXN0Qml0c1syOjBdIGluZGljYXRlcyB0aGUgbnVtYmVyIG9mIHZhbGlkIGJpdHMgaW4gdGhlIGxhc3QgcmVjZWl2ZWQgYnl0ZS4gSWYgdGhpcyB2YWx1ZSBpcyAwMDBiLCB0aGUgd2hvbGUgYnl0ZSBpcyB2YWxpZC5cbiAgICAgICAgICBpZiAobGFzdEJpdHMpIHtcbiAgICAgICAgICAgIGJpdFNpemUgPSAobiAtIDEpICogOCArIGxhc3RCaXRzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiaXRTaXplID0gbiAqIDg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgICAgICBuID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG4gPiAxNikge1xuICAgICAgICAgICAgbiA9IDE2O1xuICAgICAgICAgIH0gLy8gUmVzdHJpY3QgdW50aWwgMTZieXRlc1xuICAgICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLnJlYWRSZWdpc3Rlcl9uQnl0ZSh0aGlzLkZJRk9EYXRhUmVnLCBuKTsgLy8gR2V0IHJlY2VpdmVkIGRhdGEgZnJvbSBGSUZPIGJ1ZmZlclxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgPSBFUlJPUjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtzdGF0dXMsIGRhdGEsIGJpdFNpemV9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGZpbmRDYXJkV2FpdCgpIHtcbiAgICBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICBhd2FpdCB0aGlzLnNlYXJjaFRhZ1dhaXQoKTtcbiAgICBjb25zdCB1aWQ6IGFueSA9IGF3YWl0IHRoaXMuZ2V0VWlkV2FpdCgpO1xuICAgIGNvbnN0IFBJQ0NfVHlwZTogYW55ID0gYXdhaXQgdGhpcy5pZGVudGlmeUNhcmRUeXBlV2FpdCh1aWQpO1xuICAgIHJldHVybiB7dWlkLCBQSUNDX1R5cGV9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNlYXJjaFRhZ1dhaXQoKSB7XG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQml0RnJhbWluZ1JlZywgMHgwNyk7XG4gICAgY29uc3QgdGFnVHlwZTogYW55ID0gW3RoaXMuUElDQ19SRVFBXTtcblxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCB0aGlzLnRvQ2FyZCh0aGlzLlBDRF9UcmFuc2NlaXZlLCB0YWdUeXBlKTtcbiAgICBpZiAocmVzcG9uc2UuYml0U2l6ZSAhPT0gMHgxMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2FyZF9zZWFyY2hfRVJST1JcIik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFVpZFdhaXQoKSB7XG4gICAgdGhpcy53cml0ZVJlZ2lzdGVyKHRoaXMuQml0RnJhbWluZ1JlZywgMHgwMCk7XG4gICAgbGV0IHVpZDogYW55ID0gW3RoaXMuUElDQ19TRUxfQ0wxLCAweDIwXTtcblxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCB0aGlzLnRvQ2FyZCh0aGlzLlBDRF9UcmFuc2NlaXZlLCB1aWQpO1xuICAgIGlmICghcmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1aWRfc2Nhbl9FUlJPUlwiKTtcbiAgICB9XG4gICAgY29uc3QgdWlkQ2hlY2s6IGFueSA9XG4gICAgICByZXNwb25zZS5kYXRhWzBdIF4gcmVzcG9uc2UuZGF0YVsxXSBeIHJlc3BvbnNlLmRhdGFbMl0gXiByZXNwb25zZS5kYXRhWzNdO1xuICAgIGlmICh1aWRDaGVjayAhPT0gcmVzcG9uc2UuZGF0YVs0XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidWlkX2NoZWNrX0VSUk9SXCIpO1xuICAgIH1cbiAgICB1aWQgPSByZXNwb25zZS5kYXRhO1xuICAgIC8vICh1aWQpLnBvcCgpO1xuICAgIHJldHVybiB1aWQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2FsY3VsYXRlQ1JDV2FpdChkYXRhOiBhbnkpIHtcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5Db21tYW5kUmVnLCB0aGlzLlBDRF9JZGxlKTsgLy8gU3RvcCBhbnkgYWN0aXZlIGNvbW1hbmRcbiAgICB0aGlzLndyaXRlUmVnaXN0ZXIodGhpcy5EaXZJcnFSZWcsIDB4MDQpOyAvLyBDbGVhciB0aGUgQ1JDSVJxIGludGVycnVwdCByZXF1ZXN0IGJpdFxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkZJRk9MZXZlbFJlZywgMHg4MCk7IC8vIEZsdXNoQnVmZmVyID0gMSwgRklGTyBpbml0aWFsaXphdGlvblxuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkZJRk9EYXRhUmVnLCBkYXRhKTsgLy8gV3JpdGUgZGF0YSB0byB0aGUgRklGT1xuICAgIHRoaXMud3JpdGVSZWdpc3Rlcih0aGlzLkNvbW1hbmRSZWcsIHRoaXMuUENEX0NhbGNDUkMpOyAvLyBTdGFydCB0aGUgY2FsY3VsYXRpb25cblxuICAgIGxldCBpOiBhbnkgPSAweGZmOyBsZXQgbjogYW55O1xuICAgIC8vIFdhaXQgZm9yIHRoZSBDUkMgY2FsY3VsYXRpb24gdG8gY29tcGxldGVcbiAgICBkbyB7XG4gICAgICBuID0gYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXIodGhpcy5EaXZJcnFSZWcpO1xuICAgICAgaS0tO1xuICAgIH0gd2hpbGUgKGkgIT09IDAgJiYgIShuICYgMHgwNCkpOyAvLyBDUkNJcnEgPSAxIChDYWxjdWxhdGlvbiBkb25lKVxuICAgIC8vIENSQyBjYWxjdWxhdGlvbiByZXN1bHRcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXJfbkJ5dGUoW1xuICAgICAgdGhpcy5DUkNSZXN1bHRSZWdMU0IsXG4gICAgICB0aGlzLkNSQ1Jlc3VsdFJlZ01TQixcbiAgICBdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpZGVudGlmeVNvZnR3YXJlV2FpdCgpIHtcbiAgICBsZXQgdmVyc2lvbjogYW55ID0gYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXIodGhpcy5WZXJzaW9uUmVnKTtcbiAgICBzd2l0Y2ggKHZlcnNpb24pIHtcbiAgICAgIGNhc2UgMHg4ODpcbiAgICAgICAgdmVyc2lvbiA9IFwiKGNsb25lKVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHg5MDpcbiAgICAgICAgdmVyc2lvbiA9IFwidjAuMFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHg5MTpcbiAgICAgICAgdmVyc2lvbiA9IFwidjEuMFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHg5MjpcbiAgICAgICAgdmVyc2lvbiA9IFwidjIuMFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHgxMjpcbiAgICAgICAgdmVyc2lvbiA9IFwiY291bnRlcmZlaXQgY2hpcFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZlcnNpb24gPSBcIih1bmtub3duKVwiO1xuICAgIH1cbiAgICAvLyBXaGVuIDB4MDAgb3IgMHhGRiBpcyByZXR1cm5lZCwgY29tbXVuaWNhdGlvbiBwcm9iYWJseSBmYWlsZWRcbiAgICBpZiAodmVyc2lvbiA9PT0gMHgwMCB8fCB2ZXJzaW9uID09PSAweGZmKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzb2Z0d2FyZV92ZXJzaW9uX0VSUk9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdmVyc2lvbjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpZGVudGlmeUNhcmRUeXBlV2FpdCh1aWQ6IGFueSkge1xuICAgIC8vIElkZW50aWZ5IHR5cGUgb2YgdGhlIHNjYW5uZWQgY2FyZFxuICAgIGxldCBidWZmZXI6IGFueSA9IFt0aGlzLlBJQ0NfU0VsRUNUVEFHLCAweDcwXS5jb25jYXQodWlkKTtcbiAgICBidWZmZXIgPSBidWZmZXIuY29uY2F0KGF3YWl0IHRoaXMuY2FsY3VsYXRlQ1JDV2FpdChidWZmZXIpKTtcbiAgICBjb25zdCByZXNwb25zZTogYW55ID0gYXdhaXQgdGhpcy50b0NhcmQodGhpcy5QQ0RfVHJhbnNjZWl2ZSwgYnVmZmVyKTtcbiAgICBsZXQgUElDQ19UeXBlOiBhbnk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAmJiByZXNwb25zZS5iaXRTaXplID09PSAweDE4KSB7XG4gICAgICBQSUNDX1R5cGUgPSByZXNwb25zZS5kYXRhWzBdO1xuICAgIH1cbiAgICBzd2l0Y2ggKFBJQ0NfVHlwZSkge1xuICAgICAgY2FzZSAweDA0OlxuICAgICAgICBQSUNDX1R5cGUgPSBcIlNBSyBpbmRpY2F0ZXMgVUlEIGlzIG5vdCBjb21wbGV0ZS5cIjtcbiAgICAgICAgYnJlYWs7IC8vIFVJRCBub3QgY29tcGxldGVcbiAgICAgIGNhc2UgMHgwOTpcbiAgICAgICAgUElDQ19UeXBlID0gXCJNSUZBUkUgTWluaSwgMzIwIGJ5dGVzXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAweDA4OlxuICAgICAgICBQSUNDX1R5cGUgPSBcIk1JRkFSRSAxS0JcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDB4MTg6XG4gICAgICAgIFBJQ0NfVHlwZSA9IFwiTUlGQVJFIDRLQlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMHgwMDpcbiAgICAgICAgUElDQ19UeXBlID0gXCJNSUZBUkUgVWx0cmFsaWdodCBvciBVbHRyYWxpZ2h0IENcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDB4MTE6XG4gICAgICAgIFBJQ0NfVHlwZSA9IFwiTUlGQVJFIFBsdXNcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDB4MDE6XG4gICAgICAgIFBJQ0NfVHlwZSA9IFwiTUlGQVJFIFROUDNYWFhcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDB4MjA6XG4gICAgICAgIFBJQ0NfVHlwZSA9IFwiUElDQyBjb21wbGlhbnQgd2l0aCBJU08vSUVDIDE0NDQzLTRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDB4NDA6XG4gICAgICAgIFBJQ0NfVHlwZSA9IFwiUElDQyBjb21wbGlhbnQgd2l0aCBJU08vSUVDIDE4MDkyIChORkMpXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUElDQ190eXBlX0VSUk9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gUElDQ19UeXBlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlYWRTZWN0b3JEYXRhV2FpdChTZWN0b3I6IGFueSwgdWlkOiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZVNlY3RvcldhaXQoU2VjdG9yLCB1aWQpO1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFNlY3RvckRhdGFXYWl0KFNlY3Rvcik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVhZEJsb2NrRGF0YVdhaXQoQmxvY2s6IGFueSwgdWlkOiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZUJsb2NrV2FpdChCbG9jaywgdWlkKTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRCbG9ja0RhdGFXYWl0KEJsb2NrKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBhdXRoZW50aWNhdGVTZWN0b3JXYWl0KFNlY3RvcjogYW55LCB1aWQ6IGFueSkge1xuICAgIC8qIFBhc3N3b3JkIGF1dGhlbnRpY2F0aW9uIG1vZGUgKEEgb3IgQilcblx0XHQgKiBQSUNDX0FVVEhfS0VZQSA9IFZlcmlmeSB0aGUgQSBrZXkgYXJlIHRoZSBmaXJzdCA2IGJpdCBvZiA0dGggQmxvY2sgb2YgZWFjaCBzZWN0b3Jcblx0XHQgKiBQSUNDX0FVVEhfS0VZQiA9IFZlcmlmeSB0aGUgQiBrZXkgYXJlIHRoZSBsYXN0IDYgYml0IG9mIDR0aCBCbG9jayBvZiBlYWNoIHNlY3RvclxuXHRcdCAqL1xuICAgIGNvbnN0IEtFWV9BOiBhbnkgPSBbMHhmZiwgMHhmZiwgMHhmZiwgMHhmZiwgMHhmZiwgMHhmZl07XG4gICAgLy8gY29uc3QgS0VZX0IgPSBbMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMF07XG4gICAgY29uc3QgQmxvY2s6IGFueSA9IFNlY3RvciAqIDQ7XG4gICAgbGV0IGJ1ZmZlcjogYW55ID0gW3RoaXMuUElDQ19BVVRIX0tFWUEsIEJsb2NrXS5jb25jYXQoS0VZX0EpOyAvLyBBcHBlbmQga2V5ID0gNiBiaXQgb2YgMHhGRlxuICAgIHVpZCA9IHVpZC5zbGljZSgwLCA0KTsgLy8gQXBwZW5kIHRoZSBmaXJzdCA0IGJpdCBvZiB0aGUgVUlEXG4gICAgYnVmZmVyID0gYnVmZmVyLmNvbmNhdCh1aWQpOyAvLyAxMmJ5dGVcbiAgICAvLyBTdGFydCBhdXRoZW50aWNhdGlvbiBpdHNlbGZcbiAgICBhd2FpdCB0aGlzLnRvQ2FyZCh0aGlzLlBDRF9NRkF1dGhlbnQsIGJ1ZmZlcik7XG4gICAgaWYgKCEoKGF3YWl0IHRoaXMucmVhZFJlZ2lzdGVyKHRoaXMuU3RhdHVzMlJlZykpICYgMHgwOCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInBhc3N3b3JkX2F1dGhlbnRpY2F0aW9uX0VSUk9SXCIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBhdXRoZW50aWNhdGVCbG9ja1dhaXQoQmxvY2s6IGFueSwgdWlkOiBhbnkpIHtcbiAgICAvKiBQYXNzd29yZCBhdXRoZW50aWNhdGlvbiBtb2RlIChBIG9yIEIpXG5cdFx0ICogUElDQ19BVVRIX0tFWUEgPSBWZXJpZnkgdGhlIEEga2V5ICh0aGUgZmlyc3QgNiBiaXQgb2YgM3RoIEJsb2NrIGZvIGVhY2ggU2VjdG9yKVxuXHRcdCAqIFBJQ0NfQVVUSF9LRVlCID0gVmVyaWZ5IHRoZSBCIGtleSAodGhlIGxhc3QgNiBiaXQgb2YgM3RoIEJsb2NrIGZvIGVhY2ggU2VjdG9yKVxuXHRcdCAqL1xuICAgIGNvbnN0IEtFWV9BOiBhbnkgPSBbMHhmZiwgMHhmZiwgMHhmZiwgMHhmZiwgMHhmZiwgMHhmZl07XG4gICAgLy8gY29uc3QgS0VZX0IgPSBbMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMF07XG4gICAgbGV0IGJ1ZmZlcjogYW55ID0gW3RoaXMuUElDQ19BVVRIX0tFWUEsIEJsb2NrXS5jb25jYXQoS0VZX0EpOyAvLyBBcHBlbmQga2V5ID0gNiBiaXQgb2YgMHhGRlxuICAgIHVpZCA9IHVpZC5zbGljZSgwLCA0KTsgLy8gQXBwZW5kIHRoZSBmaXJzdCA0IGJpdCBvZiB0aGUgVUlEXG4gICAgYnVmZmVyID0gYnVmZmVyLmNvbmNhdCh1aWQpOyAvLyAxMmJ5dGVcblxuICAgIC8vIFN0YXJ0IGF1dGhlbnRpY2F0aW9uIGl0c2VsZlxuICAgIGF3YWl0IHRoaXMudG9DYXJkKHRoaXMuUENEX01GQXV0aGVudCwgYnVmZmVyKTtcbiAgICBpZiAoISgoYXdhaXQgdGhpcy5yZWFkUmVnaXN0ZXIodGhpcy5TdGF0dXMyUmVnKSkgJiAweDA4KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGFzc3dvcmRfYXV0aGVudGljYXRpb25fRVJST1JcIik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlYWRBZ2FpbldhaXQoKSB7XG4gICAgLy8gSWYgeW91IGZpbmlzaCByZWFkaW5nIGFuZCB3YW50IHRvIHJlYWQgYWdhaW4sIHRoaXMgY2FuIHVzZSBpbnN0ZWFkIG9mIGluaXQoKVxuICAgIGF3YWl0IHRoaXMuY2xlYXJSZWdpc3RlckJpdE1hc2sodGhpcy5TdGF0dXMyUmVnLCAweDA4KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRTZWN0b3JEYXRhV2FpdChhZGRyZXNzOiBhbnkpIHtcbiAgICBjb25zdCByZXNwb25zZTogYW55ID0gW107XG4gICAgY29uc3QgYmxvY2tEYXRhOiBhbnkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgbGV0IHJlcXVlc3Q6IGFueSA9IFt0aGlzLlBJQ0NfUkVBRCwgYWRkcmVzcyAqIDQgKyBpXTtcbiAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNvbmNhdChhd2FpdCB0aGlzLmNhbGN1bGF0ZUNSQ1dhaXQocmVxdWVzdCkpO1xuICAgICAgcmVzcG9uc2VbaV0gPSBhd2FpdCB0aGlzLnRvQ2FyZCh0aGlzLlBDRF9UcmFuc2NlaXZlLCByZXF1ZXN0KTtcbiAgICAgIGlmICghcmVzcG9uc2VbaV0uc3RhdHVzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImRhdGFfcmVhZF9FUlJPUlwiKTtcbiAgICAgIH1cbiAgICAgIGJsb2NrRGF0YVtpXSA9IHJlc3BvbnNlW2ldLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBibG9ja0RhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0QmxvY2tEYXRhV2FpdChhZGRyZXNzOiBhbnkpIHtcbiAgICBsZXQgcmVxdWVzdDogYW55ID0gW3RoaXMuUElDQ19SRUFELCBhZGRyZXNzXTtcbiAgICByZXF1ZXN0ID0gcmVxdWVzdC5jb25jYXQoYXdhaXQgdGhpcy5jYWxjdWxhdGVDUkNXYWl0KHJlcXVlc3QpKTtcbiAgICBjb25zdCByZXNwb25zZTogYW55ID0gYXdhaXQgdGhpcy50b0NhcmQodGhpcy5QQ0RfVHJhbnNjZWl2ZSwgcmVxdWVzdCk7XG4gICAgaWYgKCFyZXNwb25zZS5zdGF0dXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImRhdGFfcmVhZF9FUlJPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYXBwZW5kQ1JDdG9CdWZmZXJBbmRTZW5kVG9DYXJkV2FpdChidWZmZXI6IGFueSkge1xuICAgIGJ1ZmZlciA9IGJ1ZmZlci5jb25jYXQoYXdhaXQgdGhpcy5jYWxjdWxhdGVDUkNXYWl0KGJ1ZmZlcikpO1xuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCB0aGlzLnRvQ2FyZCh0aGlzLlBDRF9UcmFuc2NlaXZlLCBidWZmZXIpO1xuICAgIGlmIChcbiAgICAgICFyZXNwb25zZS5zdGF0dXMgfHxcbiAgICAgIHJlc3BvbnNlLmJpdFNpemUgIT09IDQgfHxcbiAgICAgIChyZXNwb25zZS5kYXRhWzBdICYgMHgwZikgIT09IDB4MGFcbiAgICApIHtcbiAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IEVSUk9SO1xuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgd3JpdGVCbG9ja0RhdGFXYWl0KEJsb2NrOiBhbnksIHNpeHRlZW5CeXRlczogYW55KSB7XG4gICAgaWYgKEJsb2NrID09PSAwIHx8IEJsb2NrICUgNCA9PT0gMykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGVueV9Xcml0ZVwiKTtcbiAgICB9XG4gICAgY29uc3QgYnVmZmVyOiBhbnkgPSBbdGhpcy5QSUNDX1dSSVRFLCBCbG9ja107XG4gICAgbGV0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCB0aGlzLmFwcGVuZENSQ3RvQnVmZmVyQW5kU2VuZFRvQ2FyZFdhaXQoYnVmZmVyKTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXBwZW5kQ1JDdG9CdWZmZXJBbmRTZW5kVG9DYXJkV2FpdChzaXh0ZWVuQnl0ZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkYXRhX3dyaXRlX0VSUk9SXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNRlJDNTIyO1xuIl19
