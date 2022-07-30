import { ObnizPartsBleConnectable } from '../../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MeshJs } from '../../MESH_js/MeshJs';
export declare abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
    onBatteryLevel: ((battery: number) => void) | null;
    onStatusButtonPressed: (() => void) | null;
    onWriteResponse: ((response: boolean) => void) | null;
    static AvailableBleMode: "Connectable";
    private static readonly LOCAL_NAME_LENGTH_;
    protected static PREFIX: string;
    protected meshBlock: MeshJs;
    protected requestId: MeshRequestId;
    private indicateCharacteristic_;
    private notifyCharacteristic_;
    private writeCharacteristic_;
    private writeWOResponseCharacteristic_;
    /**
     *
     * @param peripheral
     * @returns
     */
    static isMESHblock(peripheral: BleRemotePeripheral): boolean;
    /**
     *
     * @param peripheral
     * @param serialnumber
     * @returns
     */
    static sameSerialNumberBlock(peripheral: BleRemotePeripheral, serialnumber: string): boolean;
    /**
     * Connect to the services of a MESH
     */
    connectWait(): Promise<void>;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected writeWait(data: number[]): Promise<void>;
    protected writeWOResponse(data: number[]): void;
    private getCharacteristic_;
}
export declare class MeshRequestId {
    private readonly MAX_ID_;
    private readonly DEFAULT_ID_;
    private currentId_;
    private receivedId_;
    defaultId(): number;
    next(): number;
    isDefaultId(id: number): boolean;
    isReceived(id: number): boolean;
    received(id: number): void;
}
