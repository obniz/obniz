import { ObnizPartsBleConnectable } from '../../../../obniz/ObnizPartsBleAbstract';
import { BleRemoteCharacteristic } from '../../../../obniz';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH_parse } from '../../MESH_parse';
export declare abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
    protected static localName: string;
    protected _parser: MESH_parse;
    private _UUIDS;
    protected _indicateCharacteristic: BleRemoteCharacteristic | null;
    protected _notifyCharacteristic: BleRemoteCharacteristic | null;
    protected _writeCharacteristic: BleRemoteCharacteristic | null;
    protected _writeWOCharacteristic: BleRemoteCharacteristic | null;
    static isMESHblock(peripheral: BleRemotePeripheral): boolean;
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    connectWait(): Promise<void>;
    private _getCharacteristic;
    wirteFeatureWait(data: any): Promise<void>;
}
