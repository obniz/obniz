/**
 * @packageDocumentation
 * @module Parts.MFRC522
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface MFRC522Options {
    gnd?: number;
    vcc?: number;
    cs: number;
    clk?: number;
    mosi: number;
    miso: number;
    spi?: number;
    spi_frequency?: number;
    pull?: any;
    rst: number;
}
export default class MFRC522 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    PCD_Idle: any;
    PCD_Mem: any;
    PCD_GenerateRandomID: any;
    PCD_CalcCRC: any;
    PCD_Transmit: any;
    PCD_NoCmdChange: any;
    PCD_Receive: any;
    PCD_Transceive: any;
    PCD_MFAuthent: any;
    PCD_SoftReset: any;
    RxGain_18dB: any;
    RxGain_23dB: any;
    RxGain_18dB_2: any;
    RxGain_23dB_2: any;
    RxGain_33dB: any;
    RxGain_38dB: any;
    RxGain_43dB: any;
    RxGain_48dB: any;
    RxGain_min: any;
    RxGain_avg: any;
    RxGain_max: any;
    PICC_REQA: any;
    PICC_WUPA: any;
    PICC_CT: any;
    PICC_SEL_CL1: any;
    PICC_SEL_CL2: any;
    PICC_SEL_CL3: any;
    PICC_HLTA: any;
    PICC_RATS: any;
    PICC_AUTH_KEYA: any;
    PICC_AUTH_KEYB: any;
    PICC_READ: any;
    PICC_WRITE: any;
    PICC_DECREMENT: any;
    PICC_INCREMENT: any;
    PICC_RESTORE: any;
    PICC_TRANSFER: any;
    PICC_UL_WRITE: any;
    PICC_SElECTTAG: any;
    CommandReg: any;
    ComlEnReg: any;
    DivlEnReg: any;
    ComIrqReg: any;
    DivIrqReg: any;
    ErrorReg: any;
    Status1Reg: any;
    Status2Reg: any;
    FIFODataReg: any;
    FIFOLevelReg: any;
    WaterLevelReg: any;
    ControlReg: any;
    BitFramingReg: any;
    CollReg: any;
    ModeReg: any;
    TxModeReg: any;
    RxModeReg: any;
    TxControlReg: any;
    TxASKReg: any;
    TxSelReg: any;
    RxSelReg: any;
    RxThresholdReg: any;
    DemodReg: any;
    Reserved1Ah: any;
    Reserved1Bh: any;
    MfTxReg: any;
    MfRxReg: any;
    Reserved1Eh: any;
    SerialSpeedReg: any;
    CRCResultRegMSB: any;
    CRCResultRegLSB: any;
    ModWidthReg: any;
    RFCfgReg: any;
    GsNReg: any;
    CWGsPReg: any;
    ModGsPReg: any;
    TModeReg: any;
    TPrescalerReg: any;
    TReloadRegHi: any;
    TReloadRegLo: any;
    TCounterValRegHi: any;
    TCounterValRegLo: any;
    TestSel1Reg: any;
    TestSel2Reg: any;
    TestPinEnReg: any;
    TestPinValueReg: any;
    TestBusReg: any;
    AutoTestReg: any;
    VersionReg: any;
    AnalogTestReg: any;
    TestDAC1Reg: any;
    TestDAC2Reg: any;
    TestADCReg: any;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    rst: any;
    cs: any;
    spi: any;
    constructor();
    wired(obniz: Obniz): void;
    /**
     * @deprecated
     */
    init(): Promise<void>;
    initWait(): Promise<void>;
    writeRegister(addr: number, val: any): void;
    /**
     * @deprecated
     * @param addr
     */
    readRegister(addr: number): Promise<any>;
    readRegisterWait(addr: number): Promise<any>;
    /**
     * @deprecated
     * @param addr
     * @param n
     */
    readRegister_nByte(addr: any, n?: any): Promise<number[]>;
    readRegister_nByteWait(addr: any, n?: any): Promise<number[]>;
    /**
     * @deprecated
     * @param reg
     * @param mask
     */
    setRegisterBitMask(reg: any, mask: any): Promise<void>;
    setRegisterBitMaskWait(reg: any, mask: any): Promise<void>;
    /**
     * @deprecated
     *
     * @param reg
     * @param mask
     */
    clearRegisterBitMask(reg: any, mask: any): Promise<void>;
    clearRegisterBitMaskWait(reg: any, mask: any): Promise<void>;
    /**
     * @deprecated
     */
    antennaOn(): Promise<void>;
    antennaOnWait(): Promise<void>;
    /**
     * @deprecated
     */
    antennaOff(): Promise<void>;
    antennaOffWait(): Promise<void>;
    /**
     * @deprecated
     * @param command
     * @param bitsToSend
     */
    toCard(command: any, bitsToSend: any): Promise<{
        status: boolean;
        data: any;
        bitSize: number;
    }>;
    toCardWait(command: any, bitsToSend: any): Promise<{
        status: boolean;
        data: any;
        bitSize: number;
    }>;
    findCardWait(): Promise<{
        uid: any;
        PICC_Type: string;
    }>;
    searchTagWait(): Promise<void>;
    getUidWait(): Promise<any>;
    calculateCRCWait(data: any): Promise<number[]>;
    identifySoftwareWait(): Promise<any>;
    identifyCardTypeWait(uid: any): Promise<any>;
    readSectorDataWait(Sector: any, uid: any): Promise<any>;
    readBlockDataWait(Block: any, uid: any): Promise<{
        status: boolean;
        data: any;
        bitSize: number;
    }>;
    authenticateSectorWait(Sector: any, uid: any): Promise<void>;
    authenticateBlockWait(Block: any, uid: any): Promise<void>;
    readAgainWait(): Promise<void>;
    getSectorDataWait(address: any): Promise<any>;
    getBlockDataWait(address: any): Promise<{
        status: boolean;
        data: any;
        bitSize: number;
    }>;
    appendCRCtoBufferAndSendToCardWait(buffer: any): Promise<{
        status: boolean;
        data: any;
        bitSize: number;
    }>;
    writeBlockDataWait(Block: any, sixteenBytes: any): Promise<void>;
}
