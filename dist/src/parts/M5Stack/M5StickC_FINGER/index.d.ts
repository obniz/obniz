/**
 * @packageDocumentation
 * @module Parts.M5StickC_FINGER
 */
import Obniz from '../../../obniz';
import { PeripheralUART } from '../../../obniz/libs/io_peripherals/uart';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface M5StickC_FINGEROptions {
    tx: number;
    rx: number;
    gnd?: number;
}
export default class M5StickC_FINGER implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    ack: any;
    cmd: any;
    HEAD: number;
    CMD: number;
    CHK: number;
    TAIL: number;
    P1: number;
    P2: number;
    P3: number;
    Q1: number;
    Q2: number;
    Q3: number;
    TxBuf: number[];
    RxBuf: number[];
    protected obniz: Obniz;
    protected uart: PeripheralUART;
    constructor();
    wired(obniz: Obniz): void;
    getUserNumWait(): Promise<number>;
    addUserWait(userNum: number, userPermission: number): Promise<any>;
    compareFingerWait(): Promise<any>;
    sleepWait(): Promise<any>;
    setAddModeWait(mode: number): Promise<any>;
    readAddModeWait(): Promise<number>;
    deleteAllUserWait(): Promise<any>;
    deleteUserWait(userNum: number): Promise<any>;
    getUserPermissionWait(userNum: number): Promise<number>;
    setSecurityLevelWait(level: number): Promise<any>;
    getSecurityLevelWait(): Promise<number>;
    private sendAndReceiveWait;
}
