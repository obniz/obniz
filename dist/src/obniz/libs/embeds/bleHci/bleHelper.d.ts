/**
 * @packageDocumentation
 * @ignore
 */
import { BleDeviceAddress, BleDeviceAddressReversed, BleDeviceAddressReversedBuffer, BleDeviceColonSeparatedAddress, BleUUIDBuffer, UUID } from './bleTypes';
export declare class BleHelper {
    uuidFilter(uuid: string | UUID): UUID;
    deviceAddressFilter(deviceAddress: string | BleDeviceAddress): BleDeviceAddress;
    toCamelCase(str: string): string;
    toSnakeCase(str: string): string;
    buffer2reversedHex(buf: BleDeviceAddressReversedBuffer): BleDeviceAddress;
    hex2reversedBuffer<T extends BleDeviceColonSeparatedAddress | BleDeviceAddress | UUID>(address: T): T extends UUID ? BleUUIDBuffer : BleDeviceAddressReversedBuffer;
    /**
     * hex stringをreverseする。
     *
     * ex)
     * 123456789012 -> 129078563412
     *
     * @param str
     * @param separator
     */
    reverseHexString<T extends BleDeviceAddress | BleDeviceAddressReversed>(str: T): T extends BleDeviceAddress ? BleDeviceAddressReversed : BleDeviceAddress;
    addColon(str: BleDeviceAddress): BleDeviceColonSeparatedAddress;
}
declare const _default: BleHelper;
export default _default;
