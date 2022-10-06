/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { ObnizBLE as _ObnizBLE } from './libs/embeds/bleHci/ble';
import { BleAdvertisement as _BleAdvertisement } from './libs/embeds/bleHci/bleAdvertisement';
import { BleAdvertisementBuilder as _BleAdvertisementBuilder } from './libs/embeds/bleHci/bleAdvertisementBuilder';
import { BleCharacteristic as _BleCharacteristic } from './libs/embeds/bleHci/bleCharacteristic';
import { BlePeripheral as _BlePeripheral } from './libs/embeds/bleHci/blePeripheral';
import { BleConnectionUpdateParam as _BleConnectionUpdateParam } from './libs/embeds/bleHci/blePeripheral';
import { BleConnectionState as _BleConnectionState } from './libs/embeds/bleHci/blePeripheral';
import { BleRemoteCharacteristic as _BleRemoteCharacteristic } from './libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemoteDescriptor as _BleRemoteDescriptor } from './libs/embeds/bleHci/bleRemoteDescriptor';
import { BleRemotePeripheral as _BleRemotePeripheral } from './libs/embeds/bleHci/bleRemotePeripheral';
import { BleConnectSetting as _BleConnectSetting } from './libs/embeds/bleHci/bleRemotePeripheral';
import { BlePairingOptions as _BlePairingOptions } from './libs/embeds/bleHci/bleRemotePeripheral';
import { IBeacon as _IBeacon } from './libs/embeds/bleHci/bleRemotePeripheral';
import { BleRemoteService as _BleRemoteService } from './libs/embeds/bleHci/bleRemoteService';
import { BleScan as _BleScan } from './libs/embeds/bleHci/bleScan';
import { BleScanAdvertisementFilterParam as _BleScanAdvertisementFilterParam } from './libs/embeds/bleHci/bleScan';
import { BleScanSetting as _BleScanSetting } from './libs/embeds/bleHci/bleScan';
import { BleScanTarget as _BleScanTarget } from './libs/embeds/bleHci/bleScan';
import { BleBinary as _BleBinary } from './libs/embeds/bleHci/bleScan';
import { BleScanMode as _BleScanMode } from './libs/embeds/bleHci/bleScan';
import { BleService as _BleService } from './libs/embeds/bleHci/bleService';
import { BleAdvertisementData as _BleAdvertisementData } from './libs/embeds/bleHci/bleTypes';
import { BleCharacteristicDefine as _BleCharacteristicDefine } from './libs/embeds/bleHci/bleTypes';
import { BleDescriptorDefine as _BleDescriptorDefine } from './libs/embeds/bleHci/bleTypes';
import { BlePeripheralDefine as _BlePeripheralDefine } from './libs/embeds/bleHci/bleTypes';
import { BleScanResponseData as _BleScanResponseData } from './libs/embeds/bleHci/bleTypes';
import { BleServiceDefine as _BleServiceDefine } from './libs/embeds/bleHci/bleTypes';
import { BleAdvertisementFlag as _BleAdvertisementFlag } from './libs/embeds/bleHci/bleTypes';
import { BleAttributePropery as _BleAttributePropery } from './libs/embeds/bleHci/bleTypes';
import { BleDeviceAddress as _BleDeviceAddress } from './libs/embeds/bleHci/bleTypes';
import { BleDeviceAddressType as _BleDeviceAddressType } from './libs/embeds/bleHci/bleTypes';
import { BleDeviceType as _BleDeviceType } from './libs/embeds/bleHci/bleTypes';
import { BleEventType as _BleEventType } from './libs/embeds/bleHci/bleTypes';
import { Handle as _Handle } from './libs/embeds/bleHci/bleTypes';
import { UUID as _UUID } from './libs/embeds/bleHci/bleTypes';
import { ObnizBLEHci as _ObnizBLEHci } from './libs/embeds/bleHci/hci';
import { Display as _Display } from './libs/embeds/display';
import { ObnizSwitch as _ObnizSwitch } from './libs/embeds/switch';
import { M5StackBasic as _M5StackBasic } from './libs/hw/m5stack_basic';
import { M5StickC as _M5StickC } from './libs/hw/m5stickc';
import { ObnizBoard as _ObnizBoard } from './libs/hw/obnizBoard';
import { PeripheralAD as _PeripheralAD } from './libs/io_peripherals/ad';
import { AnimationStatus as _AnimationStatus } from './libs/io_peripherals/common';
import { BitType as _BitType } from './libs/io_peripherals/common';
import { DriveType as _DriveType } from './libs/io_peripherals/common';
import { FlowControlType as _FlowControlType } from './libs/io_peripherals/common';
import { ParityType as _ParityType } from './libs/io_peripherals/common';
import { PullType as _PullType } from './libs/io_peripherals/common';
import { StopBitType as _StopBitType } from './libs/io_peripherals/common';
import { Directive as _Directive } from './libs/io_peripherals/directive';
import { DirectiveAnimationFrame as _DirectiveAnimationFrame } from './libs/io_peripherals/directive';
import { PeripheralGrove as _PeripheralGrove } from './libs/io_peripherals/grove';
import { PeripheralGroveParams as _PeripheralGroveParams } from './libs/io_peripherals/grove';
import { GrovePinOption as _GrovePinOption } from './libs/io_peripherals/grove';
import { PeripheralGroveType as _PeripheralGroveType } from './libs/io_peripherals/grove';
import { PeripheralI2C as _PeripheralI2C } from './libs/io_peripherals/i2c';
import { PeripheralIO as _PeripheralIO } from './libs/io_peripherals/io';
import { PeripheralPWM as _PeripheralPWM } from './libs/io_peripherals/pwm';
import { PWMInterface as _PWMInterface } from './libs/io_peripherals/pwm';
import { PWMModulateType as _PWMModulateType } from './libs/io_peripherals/pwm';
import { PeripheralSPI as _PeripheralSPI } from './libs/io_peripherals/spi';
import { PeripheralUART as _PeripheralUART } from './libs/io_peripherals/uart';
import { PeripheralUARTOptions as _PeripheralUARTOptions } from './libs/io_peripherals/uart';
import { LogicAnalyzer as _LogicAnalyzer } from './libs/measurements/logicanalyzer';
import { LogicAnalyzerOptions as _LogicAnalyzerOptions } from './libs/measurements/logicanalyzer';
import { LogicAnalyzerOptionsExt as _LogicAnalyzerOptionsExt } from './libs/measurements/logicanalyzer';
import { ObnizMeasure as _ObnizMeasure } from './libs/measurements/measure';
import { ObnizMeasureOptions as _ObnizMeasureOptions } from './libs/measurements/measure';
import { ObnizMeasureResult as _ObnizMeasureResult } from './libs/measurements/measure';
import { WiFi as _WiFi } from './libs/network/wifi';
import { Plugin as _Plugin } from './libs/plugin/plugin';
import { Tcp as _Tcp } from './libs/protocol/tcp';
import { ObnizUtil as _ObnizUtil } from './libs/utils/util';
import { ObnizApi as _ObnizApi } from './ObnizApi';
import { ObnizApp as _ObnizApp } from './ObnizApp';
import { ObnizDevice } from './ObnizDevice';
import { ObnizBleAttError as _ObnizBleAttError } from './ObnizError';
import { ObnizBleHciStateError as _ObnizBleHciStateError } from './ObnizError';
import { ObnizBleOpError as _ObnizBleOpError } from './ObnizError';
import { ObnizBlePairingRejectByRemoteError as _ObnizBlePairingRejectByRemoteError } from './ObnizError';
import { ObnizBleScanStartError as _ObnizBleScanStartError } from './ObnizError';
import { ObnizBleUnknownCharacteristicError as _ObnizBleUnknownCharacteristicError } from './ObnizError';
import { ObnizBleUnknownDescriptorError as _ObnizBleUnknownDescriptorError } from './ObnizError';
import { ObnizBleUnknownPeripheralError as _ObnizBleUnknownPeripheralError } from './ObnizError';
import { ObnizBleUnknownServiceError as _ObnizBleUnknownServiceError } from './ObnizError';
import { ObnizBleUnsupportedHciError as _ObnizBleUnsupportedHciError } from './ObnizError';
import { ObnizBleUnSupportedOSVersionError as _ObnizBleUnSupportedOSVersionError } from './ObnizError';
import { ObnizDeprecatedFunctionError as _ObnizDeprecatedFunctionError } from './ObnizError';
import { ObnizError as _ObnizError } from './ObnizError';
import { ObnizI2cError as _ObnizI2cError } from './ObnizError';
import { ObnizI2cWarning as _ObnizI2cWarning } from './ObnizError';
import { ObnizOfflineError as _ObnizOfflineError } from './ObnizError';
import { ObnizParameterError as _ObnizParameterError } from './ObnizError';
import { ObnizTimeoutError as _ObnizTimeoutError } from './ObnizError';
import { ObnizPartsInterface as _ObnizPartsInterface } from './ObnizPartsInterface';
import { ObnizPartsInfo as _ObnizPartsInfo } from './ObnizPartsInterface';
import { PartsList } from './ObnizPartsList';
/**
 * obniz class is the abstract version of obniz Board hardware within JavaScript.
 *
 * By providing obniz id and instantiating it, you can control obniz Board and the connected parts
 * without the details of websocket api.
 *
 *
 * ### obnizOS version and obniz.js version
 *
 * obniz cloud compare your obniz.js version and target device obnizOS version.
 * If your js sdk major number is below from OS version (eg obniz.js is 2.0.0 and obnizOS is 3.0.0) then obniz cloud will alert when connection established.
 * It will work somehow but some functions looses compatibility.
 *
 * ### one device from two program
 *
 * obniz cloud accept multiple websocket connection from multiple obniz.js at same time.
 * every commands from obniz.js will passed to a device and every command from a device will be dispatched to every obniz.js connected to the cloud.
 *
 * But If one of obniz.js established a connection to a device, then target device will send datas only via local connect. So other connected obniz.js only can send datas and never receive datas from a device.
 *
 * If you'd like to receive, you need to specify `local_connect: false` at all of obniz.js to disable local connect.
 *
 */
export declare class Obniz extends ObnizDevice {
    /**
     * M5StickC device
     */
    static M5StickC: typeof _M5StickC;
    static M5StackBasic: typeof _M5StackBasic;
    /**
     * obniz REST api class
     *
     * @returns {ObnizApi}
     */
    static get api(): typeof _ObnizApi;
    /**
     * App Support class
     *
     * @returns {ObnizApp}
     */
    static get App(): typeof _ObnizApp;
}
/**
 * types
 */
export declare namespace Obniz {
    type ObnizApp = _ObnizApp;
    type ObnizApi = _ObnizApi;
    type ObnizPartsInfo = _ObnizPartsInfo;
    type ObnizPartsInterface = _ObnizPartsInterface;
    type BleAdvertisement = _BleAdvertisement;
    type BleAdvertisementBuilder = _BleAdvertisementBuilder;
    type BleAdvertisementData = _BleAdvertisementData;
    type BleCharacteristic = _BleCharacteristic;
    type BleCharacteristicDefine = _BleCharacteristicDefine;
    type BleConnectionUpdateParam = _BleConnectionUpdateParam;
    type BleConnectSetting = _BleConnectSetting;
    type BleDescriptorDefine = _BleDescriptorDefine;
    type BlePairingOptions = _BlePairingOptions;
    type BlePeripheral = _BlePeripheral;
    type BlePeripheralDefine = _BlePeripheralDefine;
    type BleRemoteCharacteristic = _BleRemoteCharacteristic;
    type BleRemoteDescriptor = _BleRemoteDescriptor;
    type BleRemotePeripheral = _BleRemotePeripheral;
    type BleRemoteService = _BleRemoteService;
    type BleScan = _BleScan;
    type BleScanAdvertisementFilterParam = _BleScanAdvertisementFilterParam;
    type BleScanResponseData = _BleScanResponseData;
    type BleScanSetting = _BleScanSetting;
    type BleScanTarget = _BleScanTarget;
    type BleService = _BleService;
    type BleServiceDefine = _BleServiceDefine;
    type Directive = _Directive;
    type DirectiveAnimationFrame = _DirectiveAnimationFrame;
    type Display = _Display;
    type IBeacon = _IBeacon;
    type LogicAnalyzer = _LogicAnalyzer;
    type LogicAnalyzerOptions = _LogicAnalyzerOptions;
    type LogicAnalyzerOptionsExt = _LogicAnalyzerOptionsExt;
    type M5StackBasic = _M5StackBasic;
    type M5StickC = _M5StickC;
    type ObnizBLE = _ObnizBLE;
    type ObnizBleAttError = _ObnizBleAttError;
    type ObnizBLEHci = _ObnizBLEHci;
    type ObnizBleHciStateError = _ObnizBleHciStateError;
    type ObnizBleOpError = _ObnizBleOpError;
    type ObnizBlePairingRejectByRemoteError = _ObnizBlePairingRejectByRemoteError;
    type ObnizBleScanStartError = _ObnizBleScanStartError;
    type ObnizBleUnknownCharacteristicError = _ObnizBleUnknownCharacteristicError;
    type ObnizBleUnknownDescriptorError = _ObnizBleUnknownDescriptorError;
    type ObnizBleUnknownPeripheralError = _ObnizBleUnknownPeripheralError;
    type ObnizBleUnknownServiceError = _ObnizBleUnknownServiceError;
    type ObnizBleUnsupportedHciError = _ObnizBleUnsupportedHciError;
    type ObnizBleUnSupportedOSVersionError = _ObnizBleUnSupportedOSVersionError;
    type ObnizBoard = _ObnizBoard;
    type ObnizDeprecatedFunctionError = _ObnizDeprecatedFunctionError;
    type ObnizError = _ObnizError;
    type ObnizI2cError = _ObnizI2cError;
    type ObnizI2cWarning = _ObnizI2cWarning;
    type ObnizMeasure = _ObnizMeasure;
    type ObnizMeasureOptions = _ObnizMeasureOptions;
    type ObnizMeasureResult = _ObnizMeasureResult;
    type ObnizOfflineError = _ObnizOfflineError;
    type ObnizParameterError = _ObnizParameterError;
    type ObnizSwitch = _ObnizSwitch;
    type ObnizTimeoutError = _ObnizTimeoutError;
    type ObnizUtil = _ObnizUtil;
    type PeripheralAD = _PeripheralAD;
    type PeripheralGrove = _PeripheralGrove;
    type PeripheralGroveParams = _PeripheralGroveParams;
    type PeripheralI2C = _PeripheralI2C;
    type PeripheralIO = _PeripheralIO;
    type PeripheralPWM = _PeripheralPWM;
    type PeripheralSPI = _PeripheralSPI;
    type PeripheralUART = _PeripheralUART;
    type PeripheralUARTOptions = _PeripheralUARTOptions;
    type Plugin = _Plugin;
    type PWMInterface = _PWMInterface;
    type Tcp = _Tcp;
    type WiFi = _WiFi;
    type AnimationStatus = _AnimationStatus;
    type BitType = _BitType;
    type BleAdvertisementFlag = _BleAdvertisementFlag;
    type BleAttributePropery = _BleAttributePropery;
    type BleBinary = _BleBinary;
    type BleConnectionState = _BleConnectionState;
    type BleDeviceAddress = _BleDeviceAddress;
    type BleDeviceAddressType = _BleDeviceAddressType;
    type BleDeviceType = _BleDeviceType;
    type BleEventType = _BleEventType;
    type BleScanMode = _BleScanMode;
    type DriveType = _DriveType;
    type FlowControlType = _FlowControlType;
    type GrovePinOption = _GrovePinOption;
    type Handle = _Handle;
    type ParityType = _ParityType;
    type PeripheralGroveType = _PeripheralGroveType;
    type PullType = _PullType;
    type PWMModulateType = _PWMModulateType;
    type StopBitType = _StopBitType;
    type UUID = _UUID;
    type Parts<K extends keyof PartsList> = PartsList[K]['instance'];
    type PartsClass<K extends keyof PartsList> = PartsList[K]['class'];
    type PartsOptions<K extends keyof PartsList> = PartsList[K]['options'];
}
