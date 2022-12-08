/**
 * @packageDocumentation
 * @module Parts.XBee
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface XBeeOptions {
    tx: number;
    rx: number;
    gnd?: number;
}
export interface XBeeConfig {
    [key: string]: string;
}
export default class XBee implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    displayIoNames: {
        tx: string;
        rx: string;
    };
    currentCommand: any;
    commands: any;
    isAtMode: any;
    onFinishAtModeCallback: any;
    onreceive?: (data: any, text: string) => void;
    protected obniz: Obniz;
    private uart;
    constructor();
    wired(obniz: Obniz): void;
    send(data: any): void;
    onAtResultsRecieve(data: any, text: any): void;
    addCommand(command: any, value?: any): void;
    sendCommand(): void;
    enterAtMode(): void;
    exitAtMode(): void;
    configWait(config: any): Promise<void>;
}
