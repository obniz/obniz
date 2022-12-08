"use strict";
/**
 * @packageDocumentation
 * @module Parts.MFRC522
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.requiredKeys = ['cs', 'mosi', 'miso', 'rst'];
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
    /**
     * @deprecated
     */
    init() {
        return this.initWait();
    }
    async initWait() {
        // Initializes the MFRC522 chip
        // Hardware and Software reset
        this.rst.output(false);
        await this.obniz.wait(50); // 8.8.2 says the oscillator start-up time is the start up time of the crystal + 37,74us: 50ms.
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
        await this.antennaOnWait(); // Enable the antenna driver pins TX1 and TX2 (they were disabled by the reset)
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
    /**
     * @deprecated
     * @param addr
     */
    readRegister(addr) {
        return this.readRegisterWait(addr);
    }
    async readRegisterWait(addr) {
        const data = [((addr << 1) & 0x7e) | 0x80, 0];
        this.cs.output(false);
        const response = await this.spi.writeWait(data);
        this.cs.output(true);
        return response[1];
    }
    /**
     * @deprecated
     * @param addr
     * @param n
     */
    readRegister_nByte(addr, n) {
        return this.readRegister_nByteWait(addr, n);
    }
    async readRegister_nByteWait(addr, n) {
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
        const values = await this.spi.writeWait(dataArray);
        this.cs.output(true);
        values.shift();
        return values;
    }
    /**
     * @deprecated
     * @param reg
     * @param mask
     */
    setRegisterBitMask(reg, mask) {
        return this.setRegisterBitMaskWait(reg, mask);
    }
    async setRegisterBitMaskWait(reg, mask) {
        const response = await this.readRegisterWait(reg);
        this.writeRegister(reg, response | mask);
    }
    /**
     * @deprecated
     *
     * @param reg
     * @param mask
     */
    clearRegisterBitMask(reg, mask) {
        return this.clearRegisterBitMaskWait(reg, mask);
    }
    async clearRegisterBitMaskWait(reg, mask) {
        const response = await this.readRegisterWait(reg);
        this.writeRegister(reg, response & ~mask);
    }
    /**
     * @deprecated
     */
    antennaOn() {
        return this.antennaOnWait();
    }
    async antennaOnWait() {
        // Turns the antenna on by enabling pins TX1 and TX2
        const response = await this.readRegisterWait(this.TxControlReg);
        if ((response & 0x03) !== 0x03) {
            // If TX1 and TX2 down
            await this.setRegisterBitMaskWait(this.TxControlReg, response | 0x03);
        }
    }
    /**
     * @deprecated
     */
    antennaOff() {
        return this.antennaOffWait();
    }
    async antennaOffWait() {
        // Turns the antenna off by disabling pins TX1 and TX2
        await this.clearRegisterBitMaskWait(this.TxControlReg, 0x03);
    }
    /**
     * @deprecated
     * @param command
     * @param bitsToSend
     */
    toCard(command, bitsToSend) {
        return this.toCardWait(command, bitsToSend);
    }
    // RC522 and ISO14443 card communication
    async toCardWait(command, bitsToSend) {
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
            await this.setRegisterBitMaskWait(this.BitFramingReg, 0x80); // StartSend=1, transmission of data starts
        }
        let TryingTimes = 10;
        let n = 0;
        do {
            // Wait for the received data complete
            n = await this.readRegisterWait(this.ComIrqReg);
            TryingTimes--;
        } while (TryingTimes !== 0 && !(n & 0x01) && !(n & waitIRq)); // !(Timer interrupt - nothing received before timeout) & !(One of the interrupts that signal success has been set)
        // await this.clearRegisterBitMaskWait(this.BitFramingReg, 0x80);	//Reset with resetAndInit()
        const response = await this.readRegister_nByteWait([
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
                    data = await this.readRegister_nByteWait(this.FIFODataReg, n); // Get received data from FIFO buffer
                }
            }
            else {
                status = ERROR;
            }
        }
        return { status, data, bitSize };
    }
    async findCardWait() {
        await this.initWait();
        await this.searchTagWait();
        const uid = await this.getUidWait();
        const PICC_Type = await this.identifyCardTypeWait(uid);
        return { uid, PICC_Type };
    }
    async searchTagWait() {
        this.writeRegister(this.BitFramingReg, 0x07);
        const tagType = [this.PICC_REQA];
        const response = await this.toCardWait(this.PCD_Transceive, tagType);
        if (response.bitSize !== 0x10) {
            throw new Error('card_search_ERROR');
        }
    }
    async getUidWait() {
        this.writeRegister(this.BitFramingReg, 0x00);
        let uid = [this.PICC_SEL_CL1, 0x20];
        const response = await this.toCardWait(this.PCD_Transceive, uid);
        if (!response.status) {
            throw new Error('uid_scan_ERROR');
        }
        const uidCheck = response.data[0] ^ response.data[1] ^ response.data[2] ^ response.data[3];
        if (uidCheck !== response.data[4]) {
            throw new Error('uid_check_ERROR');
        }
        uid = response.data;
        // (uid).pop();
        return uid;
    }
    async calculateCRCWait(data) {
        this.writeRegister(this.CommandReg, this.PCD_Idle); // Stop any active command
        this.writeRegister(this.DivIrqReg, 0x04); // Clear the CRCIRq interrupt request bit
        this.writeRegister(this.FIFOLevelReg, 0x80); // FlushBuffer = 1, FIFO initialization
        this.writeRegister(this.FIFODataReg, data); // Write data to the FIFO
        this.writeRegister(this.CommandReg, this.PCD_CalcCRC); // Start the calculation
        let i = 0xff;
        let n;
        // Wait for the CRC calculation to complete
        do {
            n = await this.readRegisterWait(this.DivIrqReg);
            i--;
        } while (i !== 0 && !(n & 0x04)); // CRCIrq = 1 (Calculation done)
        // CRC calculation result
        return await this.readRegister_nByteWait([
            this.CRCResultRegLSB,
            this.CRCResultRegMSB,
        ]);
    }
    async identifySoftwareWait() {
        let version = await this.readRegisterWait(this.VersionReg);
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
            throw new Error('software_version_ERROR');
        }
        return version;
    }
    async identifyCardTypeWait(uid) {
        // Identify type of the scanned card
        let buffer = [this.PICC_SElECTTAG, 0x70].concat(uid);
        buffer = buffer.concat(await this.calculateCRCWait(buffer));
        const response = await this.toCardWait(this.PCD_Transceive, buffer);
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
                throw new Error('PICC_type_ERROR');
        }
        return PICC_Type;
    }
    async readSectorDataWait(Sector, uid) {
        await this.authenticateSectorWait(Sector, uid);
        return await this.getSectorDataWait(Sector);
    }
    async readBlockDataWait(Block, uid) {
        await this.authenticateBlockWait(Block, uid);
        return await this.getBlockDataWait(Block);
    }
    async authenticateSectorWait(Sector, uid) {
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
        await this.toCardWait(this.PCD_MFAuthent, buffer);
        if (!((await this.readRegisterWait(this.Status2Reg)) & 0x08)) {
            throw new Error('password_authentication_ERROR');
        }
    }
    async authenticateBlockWait(Block, uid) {
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
        await this.toCardWait(this.PCD_MFAuthent, buffer);
        if (!((await this.readRegisterWait(this.Status2Reg)) & 0x08)) {
            throw new Error('password_authentication_ERROR');
        }
    }
    async readAgainWait() {
        // If you finish reading and want to read again, this can use instead of initWait()
        await this.clearRegisterBitMaskWait(this.Status2Reg, 0x08);
    }
    async getSectorDataWait(address) {
        const response = [];
        const blockData = [];
        for (let i = 0; i < 4; i++) {
            let request = [this.PICC_READ, address * 4 + i];
            request = request.concat(await this.calculateCRCWait(request));
            response[i] = await this.toCardWait(this.PCD_Transceive, request);
            if (!response[i].status) {
                throw new Error('data_read_ERROR');
            }
            blockData[i] = response[i].data;
        }
        return blockData;
    }
    async getBlockDataWait(address) {
        let request = [this.PICC_READ, address];
        request = request.concat(await this.calculateCRCWait(request));
        const response = await this.toCardWait(this.PCD_Transceive, request);
        if (!response.status) {
            throw new Error('data_read_ERROR');
        }
        return response.data;
    }
    async appendCRCtoBufferAndSendToCardWait(buffer) {
        buffer = buffer.concat(await this.calculateCRCWait(buffer));
        const response = await this.toCardWait(this.PCD_Transceive, buffer);
        if (!response.status ||
            response.bitSize !== 4 ||
            (response.data[0] & 0x0f) !== 0x0a) {
            response.status = ERROR;
        }
        return response;
    }
    async writeBlockDataWait(Block, sixteenBytes) {
        if (Block === 0 || Block % 4 === 3) {
            throw new Error('deny_Write');
        }
        const buffer = [this.PICC_WRITE, Block];
        let response = await this.appendCRCtoBufferAndSendToCardWait(buffer);
        if (response.status) {
            response = await this.appendCRCtoBufferAndSendToCardWait(sixteenBytes);
        }
        else {
            throw new Error('data_write_ERROR');
        }
    }
}
exports.default = MFRC522;
