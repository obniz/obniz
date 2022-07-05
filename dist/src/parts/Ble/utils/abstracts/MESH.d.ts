import { ObnizPartsBleConnectable } from '../../../../obniz/ObnizPartsBleAbstract';
import { BleRemoteCharacteristic } from '../../../../obniz';
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH_js } from '../../MESH_js';
export declare abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
    protected static _LocalName: string;
    protected _mesh: MESH_js;
    protected _UUIDS: {
        serviceId: string;
        characteristicIndicate: string;
        characteristicNotify: string;
        characteristicWrite: string;
        characteristicWriteWO: string;
    };
    protected _indicateCharacteristic: BleRemoteCharacteristic | null;
    protected _notifyCharacteristic: BleRemoteCharacteristic | null;
    protected _writeCharacteristic: BleRemoteCharacteristic | null;
    protected _writeWOCharacteristic: BleRemoteCharacteristic | null;
    onBatteryNotify: ((battery: number) => void) | null;
    onStatusButtonNotify: (() => void) | null;
    static isMESHblock(peripheral: BleRemotePeripheral): boolean;
    protected static _isMESHblock(name: string): boolean;
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    connectWait(): Promise<void>;
    protected _notify(data: any): void;
    protected prepareConnect(): void;
    private _getCharacteristic;
    wirteFeatureWait(): Promise<void>;
}
