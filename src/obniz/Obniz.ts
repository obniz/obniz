/**
 * @packageDocumentation
 * @module ObnizCore
 */
import _ObnizBLE from "./libs/embeds/bleHci/ble";
import _BleAdvertisement from "./libs/embeds/bleHci/bleAdvertisement";
import _BleAdvertisementBuilder from "./libs/embeds/bleHci/bleAdvertisementBuilder";
import _BleCharacteristic from "./libs/embeds/bleHci/bleCharacteristic";
import _BlePeripheral from "./libs/embeds/bleHci/blePeripheral";
import { BleConnectionUpdateParam as _BleConnectionUpdateParam } from "./libs/embeds/bleHci/blePeripheral";
import { BleConnectionState as _BleConnectionState } from "./libs/embeds/bleHci/blePeripheral";
import _BleRemoteCharacteristic from "./libs/embeds/bleHci/bleRemoteCharacteristic";
import _BleRemoteDescriptor from "./libs/embeds/bleHci/bleRemoteDescriptor";
import _BleRemotePeripheral from "./libs/embeds/bleHci/bleRemotePeripheral";
import { BleConnectSetting as _BleConnectSetting } from "./libs/embeds/bleHci/bleRemotePeripheral";
import { BlePairingOptions as _BlePairingOptions } from "./libs/embeds/bleHci/bleRemotePeripheral";
import { IBeacon as _IBeacon } from "./libs/embeds/bleHci/bleRemotePeripheral";
import _BleRemoteService from "./libs/embeds/bleHci/bleRemoteService";
import _BleScan from "./libs/embeds/bleHci/bleScan";
import { BleScanAdvertisementFilterParam as _BleScanAdvertisementFilterParam } from "./libs/embeds/bleHci/bleScan";
import { BleScanSetting as _BleScanSetting } from "./libs/embeds/bleHci/bleScan";
import { BleScanTarget as _BleScanTarget } from "./libs/embeds/bleHci/bleScan";
import { BleBinary as _BleBinary } from "./libs/embeds/bleHci/bleScan";
import { BleScanMode as _BleScanMode } from "./libs/embeds/bleHci/bleScan";
import _BleService from "./libs/embeds/bleHci/bleService";
import { BleAdvertisementData as _BleAdvertisementData } from "./libs/embeds/bleHci/bleTypes";
import { BleCharacteristicDefine as _BleCharacteristicDefine } from "./libs/embeds/bleHci/bleTypes";
import { BleDescriptorDefine as _BleDescriptorDefine } from "./libs/embeds/bleHci/bleTypes";
import { BlePeripheralDefine as _BlePeripheralDefine } from "./libs/embeds/bleHci/bleTypes";
import { BleScanResponseData as _BleScanResponseData } from "./libs/embeds/bleHci/bleTypes";
import { BleServiceDefine as _BleServiceDefine } from "./libs/embeds/bleHci/bleTypes";
import { BleAdvertisementFlag as _BleAdvertisementFlag } from "./libs/embeds/bleHci/bleTypes";
import { BleAttributePropery as _BleAttributePropery } from "./libs/embeds/bleHci/bleTypes";
import { BleDeviceAddress as _BleDeviceAddress } from "./libs/embeds/bleHci/bleTypes";
import { BleDeviceAddressType as _BleDeviceAddressType } from "./libs/embeds/bleHci/bleTypes";
import { BleDeviceType as _BleDeviceType } from "./libs/embeds/bleHci/bleTypes";
import { BleEventType as _BleEventType } from "./libs/embeds/bleHci/bleTypes";
import { Handle as _Handle } from "./libs/embeds/bleHci/bleTypes";
import { UUID as _UUID } from "./libs/embeds/bleHci/bleTypes";
import _ObnizBLEHci from "./libs/embeds/bleHci/hci";
import _Display from "./libs/embeds/display";
import _ObnizSwitch from "./libs/embeds/switch";
import { M5StackBasic as _M5StackBasic } from "./libs/hw/m5stack_basic";
import { M5StickC as _M5StickC } from "./libs/hw/m5stickc";
import _ObnizBoard from "./libs/hw/obnizBoard";
import _PeripheralAD from "./libs/io_peripherals/ad";
import { AnimationStatus as _AnimationStatus } from "./libs/io_peripherals/common";
import { BitType as _BitType } from "./libs/io_peripherals/common";
import { DriveType as _DriveType } from "./libs/io_peripherals/common";
import { FlowControlType as _FlowControlType } from "./libs/io_peripherals/common";
import { ParityType as _ParityType } from "./libs/io_peripherals/common";
import { PullType as _PullType } from "./libs/io_peripherals/common";
import { StopBitType as _StopBitType } from "./libs/io_peripherals/common";
import _Directive from "./libs/io_peripherals/directive";
import { DirectiveAnimationFrame as _DirectiveAnimationFrame } from "./libs/io_peripherals/directive";
import _PeripheralGrove from "./libs/io_peripherals/grove";
import { PeripheralGroveParams as _PeripheralGroveParams } from "./libs/io_peripherals/grove";
import { GrovePinOption as _GrovePinOption } from "./libs/io_peripherals/grove";
import { PeripheralGroveType as _PeripheralGroveType } from "./libs/io_peripherals/grove";
import _PeripheralI2C from "./libs/io_peripherals/i2c";
import _PeripheralIO from "./libs/io_peripherals/io";
import _PeripheralPWM from "./libs/io_peripherals/pwm";
import { PWMInterface as _PWMInterface } from "./libs/io_peripherals/pwm";
import { PWMModulateType as _PWMModulateType } from "./libs/io_peripherals/pwm";
import _PeripheralSPI from "./libs/io_peripherals/spi";
import _PeripheralUART from "./libs/io_peripherals/uart";
import { PeripheralUARTOptions as _PeripheralUARTOptions } from "./libs/io_peripherals/uart";
import _LogicAnalyzer from "./libs/measurements/logicanalyzer";
import { LogicAnalyzerOptions as _LogicAnalyzerOptions } from "./libs/measurements/logicanalyzer";
import { LogicAnalyzerOptionsExt as _LogicAnalyzerOptionsExt } from "./libs/measurements/logicanalyzer";
import _ObnizMeasure from "./libs/measurements/measure";
import { ObnizMeasureOptions as _ObnizMeasureOptions } from "./libs/measurements/measure";
import { ObnizMeasureResult as _ObnizMeasureResult } from "./libs/measurements/measure";
import _WiFi from "./libs/network/wifi";
import _Plugin from "./libs/plugin/plugin";
import _Tcp from "./libs/protocol/tcp";
import _ObnizApi from "./ObnizApi";
import _ObnizApp from "./ObnizApp";
import ObnizDevice from "./ObnizDevice";
import { ObnizBleAttError as _ObnizBleAttError } from "./ObnizError";
import { ObnizBleHciStateError as _ObnizBleHciStateError } from "./ObnizError";
import { ObnizBleOpError as _ObnizBleOpError } from "./ObnizError";
import { ObnizBlePairingRejectByRemoteError as _ObnizBlePairingRejectByRemoteError } from "./ObnizError";
import { ObnizBleScanStartError as _ObnizBleScanStartError } from "./ObnizError";
import { ObnizBleUnknownCharacteristicError as _ObnizBleUnknownCharacteristicError } from "./ObnizError";
import { ObnizBleUnknownDescriptorError as _ObnizBleUnknownDescriptorError } from "./ObnizError";
import { ObnizBleUnknownPeripheralError as _ObnizBleUnknownPeripheralError } from "./ObnizError";
import { ObnizBleUnknownServiceError as _ObnizBleUnknownServiceError } from "./ObnizError";
import { ObnizBleUnsupportedHciError as _ObnizBleUnsupportedHciError } from "./ObnizError";
import { ObnizBleUnSupportedOSVersionError as _ObnizBleUnSupportedOSVersionError } from "./ObnizError";
import { ObnizDeprecatedFunctionError as _ObnizDeprecatedFunctionError } from "./ObnizError";
import { ObnizError as _ObnizError } from "./ObnizError";
import { ObnizI2cError as _ObnizI2cError } from "./ObnizError";
import { ObnizI2cWarning as _ObnizI2cWarning } from "./ObnizError";
import { ObnizOfflineError as _ObnizOfflineError } from "./ObnizError";
import { ObnizParameterError as _ObnizParameterError } from "./ObnizError";
import { ObnizTimeoutError as _ObnizTimeoutError } from "./ObnizError";
import _ObnizPartsInterface from "./ObnizPartsInterface";
import { ObnizPartsInfo as _ObnizPartsInfo } from "./ObnizPartsInterface";
import { PartsList } from "./ObnizPartsList";

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
export class Obniz extends ObnizDevice {
  /**
   * M5StickC device
   */
  public static M5StickC = _M5StickC;
  public static M5StackBasic = _M5StackBasic;

  /**
   * obniz REST api class
   * @returns {ObnizApi}
   */
  public static get api() {
    return _ObnizApi;
  }

  /**
   * App Support class
   * @returns {ObnizApp}
   */
  public static get App() {
    return _ObnizApp;
  }
}

/**
 * types
 */
export namespace Obniz {
  export type ObnizApp = _ObnizApp;
  export type ObnizApi = _ObnizApi;
  export type ObnizPartsInfo = _ObnizPartsInfo;
  export type ObnizPartsInterface = _ObnizPartsInterface;
  export type BleAdvertisement = _BleAdvertisement;
  export type BleAdvertisementBuilder = _BleAdvertisementBuilder;
  export type BleAdvertisementData = _BleAdvertisementData;
  export type BleCharacteristic = _BleCharacteristic;
  export type BleCharacteristicDefine = _BleCharacteristicDefine;
  export type BleConnectionUpdateParam = _BleConnectionUpdateParam;
  export type BleConnectSetting = _BleConnectSetting;
  export type BleDescriptorDefine = _BleDescriptorDefine;
  export type BlePairingOptions = _BlePairingOptions;
  export type BlePeripheral = _BlePeripheral;
  export type BlePeripheralDefine = _BlePeripheralDefine;
  export type BleRemoteCharacteristic = _BleRemoteCharacteristic;
  export type BleRemoteDescriptor = _BleRemoteDescriptor;
  export type BleRemotePeripheral = _BleRemotePeripheral;
  export type BleRemoteService = _BleRemoteService;
  export type BleScan = _BleScan;
  export type BleScanAdvertisementFilterParam = _BleScanAdvertisementFilterParam;
  export type BleScanResponseData = _BleScanResponseData;
  export type BleScanSetting = _BleScanSetting;
  export type BleScanTarget = _BleScanTarget;
  export type BleService = _BleService;
  export type BleServiceDefine = _BleServiceDefine;
  export type Directive = _Directive;
  export type DirectiveAnimationFrame = _DirectiveAnimationFrame;
  export type Display = _Display;
  export type IBeacon = _IBeacon;
  export type LogicAnalyzer = _LogicAnalyzer;
  export type LogicAnalyzerOptions = _LogicAnalyzerOptions;
  export type LogicAnalyzerOptionsExt = _LogicAnalyzerOptionsExt;
  export type M5StackBasic = _M5StackBasic;
  export type M5StickC = _M5StickC;
  export type ObnizBLE = _ObnizBLE;
  export type ObnizBleAttError = _ObnizBleAttError;
  export type ObnizBLEHci = _ObnizBLEHci;
  export type ObnizBleHciStateError = _ObnizBleHciStateError;
  export type ObnizBleOpError = _ObnizBleOpError;
  export type ObnizBlePairingRejectByRemoteError = _ObnizBlePairingRejectByRemoteError;
  export type ObnizBleScanStartError = _ObnizBleScanStartError;
  export type ObnizBleUnknownCharacteristicError = _ObnizBleUnknownCharacteristicError;
  export type ObnizBleUnknownDescriptorError = _ObnizBleUnknownDescriptorError;
  export type ObnizBleUnknownPeripheralError = _ObnizBleUnknownPeripheralError;
  export type ObnizBleUnknownServiceError = _ObnizBleUnknownServiceError;
  export type ObnizBleUnsupportedHciError = _ObnizBleUnsupportedHciError;
  export type ObnizBleUnSupportedOSVersionError = _ObnizBleUnSupportedOSVersionError;
  export type ObnizBoard = _ObnizBoard;
  export type ObnizDeprecatedFunctionError = _ObnizDeprecatedFunctionError;
  export type ObnizError = _ObnizError;
  export type ObnizI2cError = _ObnizI2cError;
  export type ObnizI2cWarning = _ObnizI2cWarning;
  export type ObnizMeasure = _ObnizMeasure;
  export type ObnizMeasureOptions = _ObnizMeasureOptions;
  export type ObnizMeasureResult = _ObnizMeasureResult;
  export type ObnizOfflineError = _ObnizOfflineError;
  export type ObnizParameterError = _ObnizParameterError;
  export type ObnizSwitch = _ObnizSwitch;
  export type ObnizTimeoutError = _ObnizTimeoutError;
  export type PeripheralAD = _PeripheralAD;
  export type PeripheralGrove = _PeripheralGrove;
  export type PeripheralGroveParams = _PeripheralGroveParams;
  export type PeripheralI2C = _PeripheralI2C;
  export type PeripheralIO = _PeripheralIO;
  export type PeripheralPWM = _PeripheralPWM;
  export type PeripheralSPI = _PeripheralSPI;
  export type PeripheralUART = _PeripheralUART;
  export type PeripheralUARTOptions = _PeripheralUARTOptions;
  export type Plugin = _Plugin;
  export type PWMInterface = _PWMInterface;
  export type Tcp = _Tcp;
  export type WiFi = _WiFi;

  export type AnimationStatus = _AnimationStatus;
  export type BitType = _BitType;
  export type BleAdvertisementFlag = _BleAdvertisementFlag;
  export type BleAttributePropery = _BleAttributePropery;
  export type BleBinary = _BleBinary;
  export type BleConnectionState = _BleConnectionState;
  export type BleDeviceAddress = _BleDeviceAddress;
  export type BleDeviceAddressType = _BleDeviceAddressType;
  export type BleDeviceType = _BleDeviceType;
  export type BleEventType = _BleEventType;
  export type BleScanMode = _BleScanMode;
  export type DriveType = _DriveType;
  export type FlowControlType = _FlowControlType;
  export type GrovePinOption = _GrovePinOption;
  export type Handle = _Handle;
  export type ParityType = _ParityType;
  export type PeripheralGroveType = _PeripheralGroveType;
  export type PullType = _PullType;
  export type PWMModulateType = _PWMModulateType;
  export type StopBitType = _StopBitType;
  export type UUID = _UUID;

  export type Parts<K extends keyof PartsList> = PartsList[K]["class"];
  export type PartsOptions<K extends keyof PartsList> = PartsList[K]["options"];
}
