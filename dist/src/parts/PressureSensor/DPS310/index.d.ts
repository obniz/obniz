/**
 * @packageDocumentation
 * @module Parts.DPS310
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface DPS310Options {
}
export default class DPS310 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    ioKeys: string[];
    params: any;
    private configration;
    private DPS310__OSR_SE;
    private DPS310__LSB;
    private DPS310__PRS_STD_MR;
    private DPS310__PRS_STD_OSR;
    private DPS310__TEMP_STD_MR;
    private DPS310__TEMP_STD_OSR;
    private DPS310__SUCCEEDED;
    private DPS310__FAIL_UNKNOWN;
    private DPS310__FAIL_INIT_FAILED;
    private DPS310__FAIL_TOOBUSY;
    private DPS310__FAIL_UNFINISHED;
    private prsMr;
    private prsOsr;
    private tempMr;
    private tempOsr;
    private m_lastTempScal;
    private mode;
    private bitFileds;
    private dataBlock;
    private scaling_facts;
    private opMode;
    private coeffs;
    private obniz;
    private address;
    private i2c;
    constructor();
    wired(obniz: Obniz): void;
    initWait(): Promise<void>;
    measurePressureOnceWait(oversamplingRate: any): Promise<any>;
    private readByteWait;
    private readByteBitfieldWait;
    private readBlockWait;
    private writeByteWait;
    private writeByteBitfieldWait;
    private setOpModeDetailWait;
    private setOpModeWait;
    private standbyWait;
    private configTempWait;
    private configPressureWait;
    private readCoeffsWait;
    private getSingleResultWait;
    private startMeasureTempOnceWait;
    private startMeasurePressureOnceWait;
    private calcPressure;
    private calcTemp;
    private correctTempWait;
    private measureTempOnceWait;
    private getTempWait;
    private getPressureWait;
}
