import { ObnizPartsBleConnectable } from '../../../../obniz/ObnizPartsBleAbstract';
import { BleRemotePeripheral } from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { Base } from './MESHjs/block/Base';
export declare abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
    onBatteryLevel: ((battery: number) => void) | null;
    onStatusButtonPressed: (() => void) | null;
    onWriteResponse: ((response: boolean) => void) | null;
    static AvailableBleMode: "Connectable";
    protected readonly TIMEOUT_MSEC: 5000;
    private static readonly LOCAL_NAME_LENGTH_;
    protected static PREFIX: string;
    protected meshBlock: Base;
    protected requestId: MeshRequestId;
    private indicateCharacteristic_;
    private notifyCharacteristic_;
    private writeCharacteristic_;
    private writeWOResponseCharacteristic_;
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral: BleRemotePeripheral, opt_serialnumber?: string): boolean;
    /**
     * Create new instance of MESH
     *
     * @param peripheral
     */
    constructor(peripheral: BleRemotePeripheral);
    /**
     * Connect to the services of MESH
     *
     * @returns
     */
    connectWait(): Promise<void>;
    /**
     * Control statusbar LED
     *
     * @param power
     * @param red
     * @param green
     * @param blue
     */
    setStatusbarLed(power: boolean, red: boolean, green: boolean, blue: boolean): void;
    protected prepareConnect(): void;
    protected writeWait(data: number[]): Promise<void>;
    protected writeWOResponse(data: number[]): void;
    private getCharacteristic_;
}
export declare class MeshRequestId {
    private readonly MAX_ID_;
    private readonly DEFAULT_ID_;
    private pool_;
    private currentId_;
    /**
     * defaultId
     *
     * @returns
     */
    defaultId(): number;
    /**
     * next
     *
     * @returns
     */
    next(): number;
    /**
     * isDefaultId
     *
     * @param id
     * @returns
     */
    isDefaultId(id: number): boolean;
    /**
     * isReceived
     *
     * @param id
     * @returns
     */
    isReceived(id: number): boolean;
    /**
     * received
     *
     * @param id
     */
    received(id: number): void;
}
