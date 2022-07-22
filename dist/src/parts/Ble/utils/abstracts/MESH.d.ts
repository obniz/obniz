import { ObnizPartsBleConnectable } from '../../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MeshJs } from '../../MESH_js/MeshJs';
export declare abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
    onBatteryNotify: ((battery: number) => void) | null;
    onStatusButtonNotify: (() => void) | null;
    onResponseWrite: ((response: boolean) => void) | null;
    static AvailableBleMode: "Connectable";
    private static readonly LOCAL_NAME_LENGTH_;
    protected static PREFIX: string;
    protected _mesh: MeshJs;
    private indicateCharacteristic_;
    private notifyCharacteristic_;
    private writeCharacteristic_;
    private writeWOResponseCharacteristic_;
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
    private getCharacteristic_;
}
