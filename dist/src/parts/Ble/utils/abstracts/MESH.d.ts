import { ObnizPartsBleConnectable } from '../../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH_js } from '../../MESH_js';
export declare abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
    onBatteryNotify: ((battery: number) => void) | null;
    onStatusButtonNotify: (() => void) | null;
    onResponseWrite: ((response: boolean) => void) | null;
    static AvailableBleMode: "Connectable";
    protected static _LocalName: string;
    protected _mesh: MESH_js;
    private _indicateCharacteristic;
    private _notifyCharacteristic;
    private _writeCharacteristic;
    private _writeWOResponseCharacteristic;
    private static readonly LOCAL_NAME_LENGTH;
    static isMESHblock(peripheral: BleRemotePeripheral): boolean;
    static sameSirialNumberBlock(peripheral: BleRemotePeripheral, sirialnumber: string): boolean;
    /**
     * Connect to the services of a MESH
     */
    connectWait(): Promise<void>;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected writeWait(data: number[]): Promise<void>;
    protected writeWOResponse(data: number[]): void;
    private _getCharacteristic;
    private _writeFeatureWait;
}
