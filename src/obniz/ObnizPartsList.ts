/**
 * @packageDocumentation
 * @module ObnizCore
 */

import USB, { USBOptions } from '../parts/Accessory/USB';
import HX711, { Hx711Options } from '../parts/ADConverter/hx711';
import Puls08M5stickcS, {
  Puls08M5stickcSOptions,
} from '../parts/Biological/PULSE08-M5STICKC-S';
import OMRON_2JCIE, { OMRON_2JCIEOptions } from '../parts/Ble/2JCIE';
import ENERTALK_TOUCH, { ENERTALK_TOUCHOptions } from '../parts/Ble/ENERTALK';
import HEM_6233T, { HEM_6233TOptions } from '../parts/Ble/HEM_6233T';
import HEM_9200T, { HEM_9200TOptions } from '../parts/Ble/HEM_9200T';

import IBS01, { iBS01Options } from '../parts/Ble/iBS01';
import IBS01G, { iBS01GOptions } from '../parts/Ble/iBS01G';
import IBS01H, { iBS01HOptions } from '../parts/Ble/iBS01H';
import IBS01RG, { iBS01RGOptions } from '../parts/Ble/iBS01RG';
import IBS01T, { iBS01TOptions } from '../parts/Ble/iBS01T';
import IBS02IR, { iBS02IROptions } from '../parts/Ble/iBS02IR';
import IBS02PIR, { iBS02PIROptions } from '../parts/Ble/iBS02PIR';
import IBS03, { iBS03Options } from '../parts/Ble/iBS03';
import IBS03G, { iBS03GOptions } from '../parts/Ble/iBS03G';
import iBS03H, { iBS03HOptions } from '../parts/Ble/iBS03H';
import IBS03R, { IBS03ROptions } from '../parts/Ble/iBS03R';
import IBS03T, { iBS03TOptions } from '../parts/Ble/iBS03T';
import IBS03TP, { iBS03TPOptions } from '../parts/Ble/iBS03TP';
import IBS04, { iBS04Options } from '../parts/Ble/iBS04';
import IBS04I, { iBS04iOptions } from '../parts/Ble/iBS04i';
import IBS05G, { iBS05GOptions } from '../parts/Ble/iBS05G';
import IBS05T, { iBS05TOptions } from '../parts/Ble/iBS05T';
import IBS_TH, { IBS_THOptions } from '../parts/Ble/IBS_TH';
import KankiAirMier, { KankiAirMierOptions } from '../parts/Ble/KankiAirMier';
import Linking, { LinkingOptions } from '../parts/Ble/linking';
import Logtta_Accel, { Logtta_AccelOptions } from '../parts/Ble/LogttaAccel';
import Logtta_AD, { Logtta_ADOptions } from '../parts/Ble/LogttaAD';
import Logtta_CO2, { Logtta_CO2Options } from '../parts/Ble/LogttaCO2';
import Logtta_TH, { Logtta_THOptions } from '../parts/Ble/LogttaTemp';
import MINEW_S1, { MINEW_S1Options } from '../parts/Ble/MINEW_S1';
import MiniBreeze, { MiniBreezeOptions } from '../parts/Ble/MiniBreeze';
import MT_500BT, { MT_500BTOptions } from '../parts/Ble/MT_500BT';
import PLS_01BT, { PLS_01BTOptions } from '../parts/Ble/PLS_01BT';
import REX_BTPM25V, { REX_BTPM25VOptions } from '../parts/Ble/REX_BTPM25V';
import RS_BTEVS1, { RS_BTEVS1Options } from '../parts/Ble/RS_BTEVS1';
import RS_BTWATTCH2, { RS_BTWATTCH2Options } from '../parts/Ble/RS_BTWATTCH2';
import RS_Seek3, { RS_Seek3Options } from '../parts/Ble/RS_SEEK3';
import SCBTGAAAC, { SCBTGAAACOptions } from '../parts/Ble/scbtgaaac';
import SCBTGABBI, { SCBTGABBIOptions } from '../parts/Ble/scbtgabbi';
import STM550B, { STM550B_Options } from '../parts/Ble/STM550B';
import TM530, { TM530Options } from '../parts/Ble/tm530';
import TM511, { TM511Options } from '../parts/Ble/tm511';
import Toio_CoreCube, {
  Toio_CoreCubeOptions,
} from '../parts/Ble/toio_corecube';
import Tr4, { Tr4Options } from '../parts/Ble/TR4';
import UA1200BLE, { UA1200BLEOptions } from '../parts/Ble/UA1200BLE';
import UA651BLE, { UA651BLEOptions } from '../parts/Ble/UA651BLE';
import uPRISM, { uPRISMOptions } from '../parts/Ble/uprism';
import UT201BLE, { UT201BLEOptions } from '../parts/Ble/UT201BLE';
import VitalBand, { VitalBandOptions } from '../parts/Ble/VitalBand';
import ArduCAMMini, { ArduCAMMiniOptions } from '../parts/Camera/ArduCAMMini';
import JpegSerialCam, {
  JpegSerialCamOptions,
} from '../parts/Camera/JpegSerialCam';
import PT550, { PT550Options } from '../parts/ColorSensor/PT550';
import S11059, { S11059Options } from '../parts/ColorSensor/S11059';
import MCP4725, { MCP4725Options } from '../parts/DAConverter/MCP4725';
import _7SegmentLED, {
  _7SegmentLEDOptions,
} from '../parts/Display/7SegmentLED';
import _7SegmentLED_MAX7219, {
  _7SegmentLED_MAX7219Options,
} from '../parts/Display/7SegmentLED_MAX7219';
import _7SegmentLEDArray, {
  _7SegmentLEDArrayOptions,
} from '../parts/Display/7SegmentLEDArray';
import MatrixLED_HT16K33, {
  MatrixLED_HT16K33Options,
} from '../parts/Display/MatrixLED_HT16K33';
import MatrixLED_MAX7219, {
  MatrixLED_MAX7219Options,
} from '../parts/Display/MatrixLED_MAX7219';
import SainSmartTFT18LCD, {
  SainSmartTFT18LCDOptions,
} from '../parts/Display/SainSmartTFT18LCD';
import SharpMemoryTFT, {
  SharpMemoryTFTOptions,
} from '../parts/Display/SharpMemoryTFT';
import ST7735S, { ST7735SOptions } from '../parts/Display/ST7735S';
import GP2Y0A21YK0F, {
  GP2Y0A21YK0FOptions,
} from '../parts/DistanceSensor/GP2Y0A21YK0F';
import HCSR04, { HCSR04Options } from '../parts/DistanceSensor/HC-SR04';
import VL53L0X, { VL53L0XOptions } from '../parts/DistanceSensor/VL53L0X';
import W5500, { W5500Parts } from '../parts/Ethernet/W5500';
import MH_Z19B, { MH_Z19BOptions } from '../parts/GasSensor/MH_Z19B';
import MQ135, { MQ135Options } from '../parts/GasSensor/MQ135';
import MQ2, { MQ2Options } from '../parts/GasSensor/MQ2';
import MQ3, { MQ3Options } from '../parts/GasSensor/MQ3';
import MQ4, { MQ4Options } from '../parts/GasSensor/MQ4';
import MQ5, { MQ5Options } from '../parts/GasSensor/MQ5';
import MQ6, { MQ6Options } from '../parts/GasSensor/MQ6';
import MQ7, { MQ7Options } from '../parts/GasSensor/MQ7';
import MQ8, { MQ8Options } from '../parts/GasSensor/MQ8';
import MQ9, { MQ9Options } from '../parts/GasSensor/MQ9';
import GYSFDMAXB, { GYSFDMAXBOptions } from '../parts/GPS/GYSFDMAXB';
import Grove_3AxisAccelerometer, {
  Grove_3AxisAccelerometerOptions,
} from '../parts/Grove/Grove_3AxisAccelerometer';
import Grove_Button, { Grove_ButtonOptions } from '../parts/Grove/Grove_Button';
import Grove_Buzzer, { Grove_BuzzerOptions } from '../parts/Grove/Grove_Buzzer';
import Grove_DistanceSensor, {
  Grove_DistanceSensorOptions,
} from '../parts/Grove/Grove_DistanceSensor';
import Grove_EarHeartRate, {
  Grove_EarHeartRateOptions,
} from '../parts/Grove/Grove_EarHeartRate';
import Grove_EARTH, { Grove_EARTHOptions } from '../parts/Grove/Grove_EARTH';
import Grove_Gesture, {
  Grove_GestureSensorOptions,
} from '../parts/Grove/Grove_GestureSensor';
import Grove_GPS, { Grove_GPSOptions } from '../parts/Grove/Grove_GPS';
import Grove_JoyStick, {
  Grove_JoyStickOptions,
} from '../parts/Grove/Grove_JoyStick';
import Grove_LightSensor, {
  Grove_LightSensorOptions,
} from '../parts/Grove/Grove_LightSensor';
import Grove_MicroSwitch, {
  Grove_MicroSwitchOptions,
} from '../parts/Grove/Grove_MicroSwitch';
import Grove_MP3, { Grove_MP3Options } from '../parts/Grove/Grove_MP3';
import Grove_PressureSensor, {
  Grove_PressureSensorOptions,
} from '../parts/Grove/Grove_PressureSensor';
import Grove_Relay, { Grove_RelayOptions } from '../parts/Grove/Grove_Relay';
import Grove_RotaryAngleSensor, {
  Grove_RotaryAngleSensorOptions,
} from '../parts/Grove/Grove_RotaryAngleSensor';
import Grove_SHT35Sensor, {
  Grove_SHT35SensorOptions,
} from '../parts/Grove/Grove_SHT35Sensor';
import Grove_SoilMoistureSensor, {
  Grove_SoilMoistureSensorOptions,
} from '../parts/Grove/Grove_SoilMoistureSensor';
import Grove_Speaker, {
  Grove_SpeakerOptions,
} from '../parts/Grove/Grove_Speaker';
import Grove_WaterLevelSensor, {
  Grove_WaterLevelSensorOptions,
} from '../parts/Grove/Grove_WaterLevelSensor';
import ENC03R_Module, {
  ENC03R_ModuleOptions,
} from '../parts/GyroSensor/ENC03R_Module';
import InfraredLED, { InfraredLEDOptions } from '../parts/Infrared/InfraredLED';
import IRModule, { IRModuleOptions } from '../parts/Infrared/IRModule';
import IRSensor, { IRSensorOptions } from '../parts/Infrared/IRSensor';
import YG1006, { YG1006Options } from '../parts/Infrared/YG1006';
import Keyestudio_Button, {
  Keyestudio_ButtonOptions,
} from '../parts/Keyestudio/Keyestudio_Button';
import Keyestudio_Buzzer, {
  Keyestudio_BuzzerOptions,
} from '../parts/Keyestudio/Keyestudio_Buzzer';
import Keyestudio_HT16K33, {
  Keyestudio_HT16K33Options,
} from '../parts/Keyestudio/Keyestudio_HT16K33';
import Keyestudio_MoistureSensor, {
  Keyestudio_MoistureSensorOptions,
} from '../parts/Keyestudio/Keyestudio_MoistureSensor';
import Keyestudio_PIR, {
  Keyestudio_PIROptions,
} from '../parts/Keyestudio/Keyestudio_PIR';
import Keyestudio_TemperatureSensor, {
  Keyestudio_TemperatureSensorOptions,
} from '../parts/Keyestudio/Keyestudio_TemperatureSensor';
import Keyestudio_TrafficLight, {
  Keyestudio_TrafficLightOptions,
} from '../parts/Keyestudio/Keyestudio_TrafficLight';
import FullColorLED, { FullColorLEDOptions } from '../parts/Light/FullColorLED';
import LED, { LEDOptions } from '../parts/Light/LED';
import WS2811, { WS2811Options } from '../parts/Light/WS2811';
import WS2812, { WS2812Options } from '../parts/Light/WS2812';
import WS2812B, { WS2812BOptions } from '../parts/Light/WS2812B';
import MCP23S08, { MCP23S08Options } from '../parts/Logic/MCP23S08';
import SNx4HC595, { SNx4HC595Options } from '../parts/Logic/SNx4HC595';
import M5StickC_ADC, {
  M5StickC_ADCOptions,
} from '../parts/M5Stack/M5StickC_ADC';
import M5StickC_DAC, {
  M5StickC_DACOptions,
} from '../parts/M5Stack/M5StickC_DAC';
import M5StickC_FINGER, {
  M5StickC_FINGEROptions,
} from '../parts/M5Stack/M5StickC_FINGER';
import M5StickC_JoyStick, {
  M5StickC_JoyStickOptions,
} from '../parts/M5Stack/M5StickC_JoyStick';
import M5StickC_RS485, {
  M5StickC_RS485Options,
} from '../parts/M5Stack/M5StickC_RS485';
import M5StickC_ToF, {
  M5StickC_ToFOptions,
} from '../parts/M5Stack/M5StickC_ToF';
import M5StickC_Yun, {
  M5StickC_YunOptions,
} from '../parts/M5Stack/M5StickC_Yun';
import CT10, { CT10Options } from '../parts/Magnet/CT10';
import HMC5883L, { HMC5883LOptions } from '../parts/Magnet/HMC5883L';
import _24LC256, { _24LC256Options } from '../parts/Memory/24LC256';
import AK09916, { AK09916Options } from '../parts/MovementSensor/AK09916';
import AK8963, { AK8963Options } from '../parts/MovementSensor/AK8963';
import Button, { ButtonOptions } from '../parts/MovementSensor/Button';
import FlickHat, { FlickHatOptions } from '../parts/MovementSensor/FlickHat';
import HCSR505, { HCSR505Options } from '../parts/MovementSensor/HC-SR505';
import ICM20948, { ICM20948Options } from '../parts/MovementSensor/ICM20948';
import IPM_165, { IPM_165Options } from '../parts/MovementSensor/IPM-165';
import JoyStick, { JoyStickOptions } from '../parts/MovementSensor/JoyStick';
import KXR94_2050, {
  KXR94_2050Options,
} from '../parts/MovementSensor/KXR94-2050';
import KXSC7_2050, {
  KXSC7_2050Options,
} from '../parts/MovementSensor/KXSC7-2050';
import MPU6050, { MPU6050Options } from '../parts/MovementSensor/MPU6050';
import MPU6500, { MPU6500Options } from '../parts/MovementSensor/MPU6500';
import MPU6886, { MPU6886Options } from '../parts/MovementSensor/MPU6886';
import MPU9250, { MPU9250Options } from '../parts/MovementSensor/MPU9250';
import PaPIRsVZ, { PaPIRsVZOptions } from '../parts/MovementSensor/PaPIRsVZ';
import Potentiometer, {
  PotentiometerOptions,
} from '../parts/MovementSensor/Potentiometer';
import SH200Q, { SH200QOptions } from '../parts/MovementSensor/SH200Q';
import DCMotor, { DCMotorOptions } from '../parts/Moving/DCMotor';
import PCA9685, { PCA9685Options } from '../parts/Moving/PCA9685';
import ServoMotor, { ServoMotorOptions } from '../parts/Moving/ServoMotor';
import Solenoid, { SolenoidOptions } from '../parts/Moving/Solenoid';
import StepperMotor, {
  StepperMotorOptions,
} from '../parts/Moving/StepperMotor';
import AXP192, { AXP192Options } from '../parts/Power/AXP192';
import BMP280, { BMP280Options } from '../parts/PressureSensor/BMP280';
import DPS310, { DPS310Options } from '../parts/PressureSensor/DPS310';
import FSR40X, { FSR40XOptions } from '../parts/PressureSensor/FSR-40X';
import SEN0114, { SEN0114Options } from '../parts/SoilSensor/SEN0114';
import Speaker, { SpeakerOptions } from '../parts/Sound/Speaker';
import LM35DZ, {
  LM35DZOptions,
} from '../parts/TemperatureSensor/analog/LM35DZ';
import LM60, { LM60Options } from '../parts/TemperatureSensor/analog/LM60';
import LM61, { LM61Options } from '../parts/TemperatureSensor/analog/LM61';
import LMT87, { LMT87Options } from '../parts/TemperatureSensor/analog/LMT87';
import MCP9700, {
  MCP9700Options,
} from '../parts/TemperatureSensor/analog/MCP9700';
import MCP9701, {
  MCP9701Options,
} from '../parts/TemperatureSensor/analog/MCP9701';
import S8100B, {
  S8100BOptions,
} from '../parts/TemperatureSensor/analog/S8100B';
import S8120C, {
  S8120COptions,
} from '../parts/TemperatureSensor/analog/S8120C';
import ADT7410, {
  ADT7410Options,
} from '../parts/TemperatureSensor/i2c/ADT7410';
import AM2320, { AM2320Options } from '../parts/TemperatureSensor/i2c/AM2320';
import AMG8833, {
  AMG8833Options,
} from '../parts/TemperatureSensor/i2c/AMG8833';
import BME280, { BME280Options } from '../parts/TemperatureSensor/i2c/BME280';
import D6T44L, { D6T44LOptions } from '../parts/TemperatureSensor/i2c/D6T44L';
import DHT12, { DHT12Options } from '../parts/TemperatureSensor/i2c/DHT12';
import S5851A, { S5851AOptions } from '../parts/TemperatureSensor/i2c/S-5851A';
import SHT20, { SHT20Options } from '../parts/TemperatureSensor/i2c/SHT20';
import SHT31, { SHT31Options } from '../parts/TemperatureSensor/i2c/SHT31';
import ADT7310, {
  ADT7310Options,
} from '../parts/TemperatureSensor/spi/ADT7310';
import RN42, { RN42Options } from '../parts/Wireless/RN42';
import XBee, { XBeeOptions } from '../parts/Wireless/XBee';
import EXVital, { EXVital_Options } from '../parts/Ble/EXVital';
import iBS03T_RH, { iBS03T_RHOptions } from '../parts/Ble/iBS03T_RH';
import iBS05H, { iBS05HOptions } from '../parts/Ble/iBS05H';
import UC421BLE, { UC421BLEOptions } from '../parts/Ble/UC421BLE';
import UC352BLE, { UC352BLEOptions } from '../parts/Ble/UC352BLE';

import TR7, { TR7Options } from '../parts/Ble/TR7';
import MM_BLEBC5, { MM_BLEBC5_Options } from '../parts/Ble/MM_BLEBC5';
import MESH_100BU, { MESH_100BUOptions } from '../parts/Ble/MESH_100BU';
import MESH_100LE, { MESH_100LEOptions } from '../parts/Ble/MESH_100LE';
import MESH_100AC, { MESH_100ACOptions } from '../parts/Ble/MESH_100AC';
import MESH_100MD, { MESH_100MDOptions } from '../parts/Ble/MESH_100MD';
import MESH_100PA, { MESH_100PAOptions } from '../parts/Ble/MESH_100PA';
import MESH_100TH, { MESH_100THOptions } from '../parts/Ble/MESH_100TH';
import MESH_100GP, { MESH_100GPOptions } from '../parts/Ble/MESH_100GP';
import HN_300T2, { HN_300T2Options } from '../parts/Ble/HN_300T2';
import GT_7510, { GT_7510Options } from '../parts/Ble/GT_7510';
import TT_MSK1508, { TT_MSK1508Options } from '../parts/Ble/TT-MSK1508';
import INKBIRD, { INKBIRDOptions } from '../parts/Ble/INKBIRD';
import DR_MARK, { DR_MARKOptions } from '../parts/Ble/DR_MARK';
import RTR500B, { RTR500BOptions } from '../parts/Ble/RTR500B';
import GX_3R_Pro, { GX_3R_Pro_Options } from '../parts/Ble/GX_3R_Pro';
import Tr4A, { Tr4AOptions } from '../parts/Ble/TR4A';
import HPO_300T, { HPO_300TOptions } from '../parts/Ble/HPO_300T';
import MC_6810T2, { MC_6810T2Options } from '../parts/Ble/MC_6810T2';
import Talia, { TaliaOptions } from '../parts/Ble/Talia';
import Panasonic_lock, {
  Panasonic_lockOptions,
} from '../parts/Ble/panasonic_lock';

export type PartsType = keyof PartsList;

interface PartsInterface<P, O, C extends { new (...args: any[]): P }> {
  instance: P;
  options: O;
  class: C;
}

type PartsListType = {
  [key: string]: PartsInterface<any, any, any>;
};

export interface PartsList {
  LED: PartsInterface<LED, LEDOptions, typeof LED>;
  FullColorLED: PartsInterface<
    FullColorLED,
    FullColorLEDOptions,
    typeof FullColorLED
  >;
  WS2811: PartsInterface<WS2811, WS2811Options, typeof WS2811>;
  WS2812: PartsInterface<WS2812, WS2812Options, typeof WS2812>;
  WS2812B: PartsInterface<WS2812B, WS2812BOptions, typeof WS2812B>;
  InfraredLED: PartsInterface<
    InfraredLED,
    InfraredLEDOptions,
    typeof InfraredLED
  >;
  IRSensor: PartsInterface<IRSensor, IRSensorOptions, typeof IRSensor>;
  IRModule: PartsInterface<IRModule, IRModuleOptions, typeof IRModule>;
  '7SegmentLED': PartsInterface<
    _7SegmentLED,
    _7SegmentLEDOptions,
    typeof _7SegmentLED
  >;

  '7SegmentLEDArray': PartsInterface<
    _7SegmentLEDArray,
    _7SegmentLEDArrayOptions,
    typeof _7SegmentLEDArray
  >;

  '7SegmentLED_MAX7219': PartsInterface<
    _7SegmentLED_MAX7219,
    _7SegmentLED_MAX7219Options,
    typeof _7SegmentLED_MAX7219
  >;

  MatrixLED_MAX7219: PartsInterface<
    MatrixLED_MAX7219,
    MatrixLED_MAX7219Options,
    typeof MatrixLED_MAX7219
  >;
  MatrixLED_HT16K33: PartsInterface<
    MatrixLED_HT16K33,
    MatrixLED_HT16K33Options,
    typeof MatrixLED_HT16K33
  >;
  SainSmartTFT18LCD: PartsInterface<
    SainSmartTFT18LCD,
    SainSmartTFT18LCDOptions,
    typeof SainSmartTFT18LCD
  >;
  SharpMemoryTFT: PartsInterface<
    SharpMemoryTFT,
    SharpMemoryTFTOptions,
    typeof SharpMemoryTFT
  >;
  ST7735S: PartsInterface<ST7735S, ST7735SOptions, typeof ST7735S>;
  ArduCAMMini: PartsInterface<
    ArduCAMMini,
    ArduCAMMiniOptions,
    typeof ArduCAMMini
  >;
  JpegSerialCam: PartsInterface<
    JpegSerialCam,
    JpegSerialCamOptions,
    typeof JpegSerialCam
  >;
  DCMotor: PartsInterface<DCMotor, DCMotorOptions, typeof DCMotor>;
  PCA9685: PartsInterface<PCA9685, PCA9685Options, typeof PCA9685>;
  ServoMotor: PartsInterface<ServoMotor, ServoMotorOptions, typeof ServoMotor>;
  Solenoid: PartsInterface<Solenoid, SolenoidOptions, typeof Solenoid>;
  StepperMotor: PartsInterface<
    StepperMotor,
    StepperMotorOptions,
    typeof StepperMotor
  >;
  Speaker: PartsInterface<Speaker, SpeakerOptions, typeof Speaker>;
  AXP192: PartsInterface<AXP192, AXP192Options, typeof AXP192>;
  MQ2: PartsInterface<MQ2, MQ2Options, typeof MQ2>;
  MQ3: PartsInterface<MQ3, MQ3Options, typeof MQ3>;
  MQ4: PartsInterface<MQ4, MQ4Options, typeof MQ4>;
  MQ5: PartsInterface<MQ5, MQ5Options, typeof MQ5>;
  MQ6: PartsInterface<MQ6, MQ6Options, typeof MQ6>;
  MQ7: PartsInterface<MQ7, MQ7Options, typeof MQ7>;
  MQ8: PartsInterface<MQ8, MQ8Options, typeof MQ8>;
  MQ9: PartsInterface<MQ9, MQ9Options, typeof MQ9>;
  MQ135: PartsInterface<MQ135, MQ135Options, typeof MQ135>;
  MH_Z19B: PartsInterface<MH_Z19B, MH_Z19BOptions, typeof MH_Z19B>;
  MCP23S08: PartsInterface<MCP23S08, MCP23S08Options, typeof MCP23S08>;
  SNx4HC595: PartsInterface<SNx4HC595, SNx4HC595Options, typeof SNx4HC595>;
  USB: PartsInterface<USB, USBOptions, typeof USB>;
  RN42: PartsInterface<RN42, RN42Options, typeof RN42>;
  XBee: PartsInterface<XBee, XBeeOptions, typeof XBee>;
  Button: PartsInterface<Button, ButtonOptions, typeof Button>;
  AK8963: PartsInterface<AK8963, AK8963Options, typeof AK8963>;
  MPU6050: PartsInterface<MPU6050, MPU6050Options, typeof MPU6050>;
  MPU6500: PartsInterface<MPU6500, MPU6500Options, typeof MPU6500>;
  MPU6886: PartsInterface<MPU6886, MPU6886Options, typeof MPU6886>;
  MPU9250: PartsInterface<MPU9250, MPU9250Options, typeof MPU9250>;
  SH200Q: PartsInterface<SH200Q, SH200QOptions, typeof SH200Q>;
  AK09916: PartsInterface<AK09916, AK09916Options, typeof AK09916>;
  ICM20948: PartsInterface<ICM20948, ICM20948Options, typeof ICM20948>;
  'HC-SR505': PartsInterface<HCSR505, HCSR505Options, typeof HCSR505>;

  JoyStick: PartsInterface<JoyStick, JoyStickOptions, typeof JoyStick>;
  'KXR94-2050': PartsInterface<
    KXR94_2050,
    KXR94_2050Options,
    typeof KXR94_2050
  >;

  'IPM-165': PartsInterface<IPM_165, IPM_165Options, typeof IPM_165>;

  PaPIRsVZ: PartsInterface<PaPIRsVZ, PaPIRsVZOptions, typeof PaPIRsVZ>;
  Potentiometer: PartsInterface<
    Potentiometer,
    PotentiometerOptions,
    typeof Potentiometer
  >;
  // '24LC256':{instance: _24LC256,options: _24LC256Options},
  ENC03R_Module: PartsInterface<
    ENC03R_Module,
    ENC03R_ModuleOptions,
    typeof ENC03R_Module
  >;
  FSR40X: PartsInterface<FSR40X, FSR40XOptions, typeof FSR40X>;
  'HC-SR04': PartsInterface<HCSR04, HCSR04Options, typeof HCSR04>;

  GP2Y0A21YK0F: PartsInterface<
    GP2Y0A21YK0F,
    GP2Y0A21YK0FOptions,
    typeof GP2Y0A21YK0F
  >;
  VL53L0X: PartsInterface<VL53L0X, VL53L0XOptions, typeof VL53L0X>;
  GYSFDMAXB: PartsInterface<GYSFDMAXB, GYSFDMAXBOptions, typeof GYSFDMAXB>;
  CT10: PartsInterface<CT10, CT10Options, typeof CT10>;
  HMC5883L: PartsInterface<HMC5883L, HMC5883LOptions, typeof HMC5883L>;
  hx711: PartsInterface<HX711, Hx711Options, typeof HX711>;
  MCP4725: PartsInterface<MCP4725, MCP4725Options, typeof MCP4725>;
  SEN0114: PartsInterface<SEN0114, SEN0114Options, typeof SEN0114>;
  LM35DZ: PartsInterface<LM35DZ, LM35DZOptions, typeof LM35DZ>;
  LM60: PartsInterface<LM60, LM60Options, typeof LM60>;
  LM61: PartsInterface<LM61, LM61Options, typeof LM61>;
  LMT87: PartsInterface<LMT87, LMT87Options, typeof LMT87>;
  MCP9700: PartsInterface<MCP9700, MCP9700Options, typeof MCP9700>;
  MCP9701: PartsInterface<MCP9701, MCP9701Options, typeof MCP9701>;
  INKBIRD: PartsInterface<INKBIRD, INKBIRDOptions, typeof INKBIRD>;
  // 'S8100B':{instance: S8100B,options: S8100BOptions},
  // 'S8120C':{instance: S8120C,options: S8120COptions},
  // 'ADT7410':{instance: ADT7410,options: ADT7410Options},
  AMG8833: PartsInterface<AMG8833, AMG8833Options, typeof AMG8833>;
  BME280: PartsInterface<BME280, BME280Options, typeof BME280>;
  D6T44L: PartsInterface<D6T44L, D6T44LOptions, typeof D6T44L>;
  DHT12: PartsInterface<DHT12, DHT12Options, typeof DHT12>;
  // 'S5851A':{instance: S5851A,options: S5851AOptions},
  SHT31: PartsInterface<SHT31, SHT31Options, typeof SHT31>;
  SHT20: PartsInterface<SHT20, SHT20Options, typeof SHT20>;
  ADT7310: PartsInterface<ADT7310, ADT7310Options, typeof ADT7310>;
  AM2320: PartsInterface<AM2320, AM2320Options, typeof AM2320>;
  PT550: PartsInterface<PT550, PT550Options, typeof PT550>;
  S11059: PartsInterface<S11059, S11059Options, typeof S11059>;
  YG1006: PartsInterface<YG1006, YG1006Options, typeof YG1006>;
  Grove_Button: PartsInterface<
    Grove_Button,
    Grove_ButtonOptions,
    typeof Grove_Button
  >;
  Grove_Buzzer: PartsInterface<
    Grove_Buzzer,
    Grove_BuzzerOptions,
    typeof Grove_Buzzer
  >;
  Grove_EarHeartRate: PartsInterface<
    Grove_EarHeartRate,
    Grove_EarHeartRateOptions,
    typeof Grove_EarHeartRate
  >;
  Grove_MP3: PartsInterface<Grove_MP3, Grove_MP3Options, typeof Grove_MP3>;
  Grove_GPS: PartsInterface<Grove_GPS, Grove_GPSOptions, typeof Grove_GPS>;
  Grove_EARTH: PartsInterface<
    Grove_EARTH,
    Grove_EARTHOptions,
    typeof Grove_EARTH
  >;
  Grove_JoyStick: PartsInterface<
    Grove_JoyStick,
    Grove_JoyStickOptions,
    typeof Grove_JoyStick
  >;
  Grove_3AxisAccelerometer: PartsInterface<
    Grove_3AxisAccelerometer,
    Grove_3AxisAccelerometerOptions,
    typeof Grove_3AxisAccelerometer
  >;
  Grove_Speaker: PartsInterface<
    Grove_Speaker,
    Grove_SpeakerOptions,
    typeof Grove_Speaker
  >;
  Grove_RotaryAnglesensor: PartsInterface<
    Grove_RotaryAngleSensor,
    Grove_RotaryAngleSensorOptions,
    typeof Grove_RotaryAngleSensor
  >;
  Grove_DistanceSensor: PartsInterface<
    Grove_DistanceSensor,
    Grove_DistanceSensorOptions,
    typeof Grove_DistanceSensor
  >;
  Grove_LightSensor: PartsInterface<
    Grove_LightSensor,
    Grove_LightSensorOptions,
    typeof Grove_LightSensor
  >;
  Grove_PressureSensor: PartsInterface<
    Grove_PressureSensor,
    Grove_PressureSensorOptions,
    typeof Grove_PressureSensor
  >;
  Grove_SoilMoistureSensor: PartsInterface<
    Grove_SoilMoistureSensor,
    Grove_SoilMoistureSensorOptions,
    typeof Grove_SoilMoistureSensor
  >;
  Grove_Gesture: PartsInterface<
    Grove_Gesture,
    Grove_GestureSensorOptions,
    typeof Grove_Gesture
  >;
  Grove_WaterLevelSensor: PartsInterface<
    Grove_WaterLevelSensor,
    Grove_WaterLevelSensorOptions,
    typeof Grove_WaterLevelSensor
  >;
  Grove_MicroSwitch: PartsInterface<
    Grove_MicroSwitch,
    Grove_MicroSwitchOptions,
    typeof Grove_MicroSwitch
  >;
  M5StickC_JoyStick: PartsInterface<
    M5StickC_JoyStick,
    M5StickC_JoyStickOptions,
    typeof M5StickC_JoyStick
  >;
  M5StickC_ADC: PartsInterface<
    M5StickC_ADC,
    M5StickC_ADCOptions,
    typeof M5StickC_ADC
  >;
  M5StickC_DAC: PartsInterface<
    M5StickC_DAC,
    M5StickC_DACOptions,
    typeof M5StickC_DAC
  >;
  M5StickC_ToF: PartsInterface<
    M5StickC_ToF,
    M5StickC_ToFOptions,
    typeof M5StickC_ToF
  >;
  M5StickC_FINGER: PartsInterface<
    M5StickC_FINGER,
    M5StickC_FINGEROptions,
    typeof M5StickC_FINGER
  >;
  M5StickC_RS485: PartsInterface<
    M5StickC_RS485,
    M5StickC_RS485Options,
    typeof M5StickC_RS485
  >;
  M5StickC_Yun: PartsInterface<
    M5StickC_Yun,
    M5StickC_YunOptions,
    typeof M5StickC_Yun
  >;
  Keyestudio_Button: PartsInterface<
    Keyestudio_Button,
    Keyestudio_ButtonOptions,
    typeof Keyestudio_Button
  >;
  Keyestudio_MoistureSensor: PartsInterface<
    Keyestudio_MoistureSensor,
    Keyestudio_MoistureSensorOptions,
    typeof Keyestudio_MoistureSensor
  >;
  Keyestudio_Buzzer: PartsInterface<
    Keyestudio_Buzzer,
    Keyestudio_BuzzerOptions,
    typeof Keyestudio_Buzzer
  >;
  Keyestudio_TemperatureSensor: PartsInterface<
    Keyestudio_TemperatureSensor,
    Keyestudio_TemperatureSensorOptions,
    typeof Keyestudio_TemperatureSensor
  >;
  Keyestudio_PIR: PartsInterface<
    Keyestudio_PIR,
    Keyestudio_PIROptions,
    typeof Keyestudio_PIR
  >;
  Keyestudio_TrafficLight: PartsInterface<
    Keyestudio_TrafficLight,
    Keyestudio_TrafficLightOptions,
    typeof Keyestudio_TrafficLight
  >;
  Keyestudio_HT16K33: PartsInterface<
    Keyestudio_HT16K33,
    Keyestudio_HT16K33Options,
    typeof Keyestudio_HT16K33
  >;
  '2JCIE': PartsInterface<OMRON_2JCIE, OMRON_2JCIEOptions, typeof OMRON_2JCIE>;

  Logtta_CO2: PartsInterface<Logtta_CO2, Logtta_CO2Options, typeof Logtta_CO2>;
  Logtta_TH: PartsInterface<Logtta_TH, Logtta_THOptions, typeof Logtta_TH>;
  Logtta_AD: PartsInterface<Logtta_AD, Logtta_ADOptions, typeof Logtta_AD>;
  Logtta_Accel: PartsInterface<
    Logtta_Accel,
    Logtta_AccelOptions,
    typeof Logtta_Accel
  >;
  Linking: PartsInterface<Linking, LinkingOptions, typeof Linking>;
  uPRISM: PartsInterface<uPRISM, uPRISMOptions, typeof uPRISM>;
  SCBTGAAAC: PartsInterface<SCBTGAAAC, SCBTGAAACOptions, typeof SCBTGAAAC>;
  SCBTGABBI: PartsInterface<SCBTGABBI, SCBTGABBIOptions, typeof SCBTGABBI>;
  iBS01: PartsInterface<IBS01, iBS01Options, typeof IBS01>;
  iBS01G: PartsInterface<IBS01G, iBS01GOptions, typeof IBS01G>;
  iBS01H: PartsInterface<IBS01H, iBS01HOptions, typeof IBS01H>;
  iBS01RG: PartsInterface<IBS01RG, iBS01RGOptions, typeof IBS01RG>;
  iBS01T: PartsInterface<IBS01T, iBS01TOptions, typeof IBS01T>;
  iBS02IR: PartsInterface<IBS02IR, iBS02IROptions, typeof IBS02IR>;
  iBS02PIR: PartsInterface<IBS02PIR, iBS02PIROptions, typeof IBS02PIR>;
  iBS03: PartsInterface<IBS03, iBS03Options, typeof IBS03>;
  iBS03G: PartsInterface<IBS03G, iBS03GOptions, typeof IBS03G>;
  iBS03H: PartsInterface<iBS03H, iBS03HOptions, typeof iBS03H>;
  iBS03T: PartsInterface<IBS03T, iBS03TOptions, typeof IBS03T>;
  iBS03T_RH: PartsInterface<iBS03T_RH, iBS03T_RHOptions, typeof iBS03T_RH>;
  iBS03TP: PartsInterface<IBS03TP, iBS03TPOptions, typeof IBS03TP>;
  iBS04: PartsInterface<IBS04, iBS04Options, typeof IBS04>;
  iBS04i: PartsInterface<IBS04I, iBS04iOptions, typeof IBS04I>;
  iBS03R: PartsInterface<IBS03R, IBS03ROptions, typeof IBS03R>;
  iBS05H: PartsInterface<iBS05H, iBS05HOptions, typeof iBS05H>;
  iBS05G: PartsInterface<IBS05G, iBS05GOptions, typeof IBS05G>;
  iBS05T: PartsInterface<IBS05T, iBS05TOptions, typeof IBS05T>;
  IBS_TH: PartsInterface<IBS_TH, IBS_THOptions, typeof IBS_TH>;
  TR4: PartsInterface<Tr4, Tr4Options, typeof Tr4>;
  TR4A: PartsInterface<Tr4A, Tr4AOptions, typeof Tr4A>;
  RTR500B: PartsInterface<RTR500B, RTR500BOptions, typeof Tr4A>;
  TR7: PartsInterface<TR7, TR7Options, typeof TR7>;
  TT_MSK1508: PartsInterface<TT_MSK1508, TT_MSK1508Options, typeof TT_MSK1508>;
  KankiAirMier: PartsInterface<
    KankiAirMier,
    KankiAirMierOptions,
    typeof KankiAirMier
  >;
  MINEW_S1: PartsInterface<MINEW_S1, MINEW_S1Options, typeof MINEW_S1>;
  RS_BTEVS1: PartsInterface<RS_BTEVS1, RS_BTEVS1Options, typeof RS_BTEVS1>;
  RS_Seek3: PartsInterface<RS_Seek3, RS_Seek3Options, typeof RS_Seek3>;
  REX_BTPM25V: PartsInterface<
    REX_BTPM25V,
    REX_BTPM25VOptions,
    typeof REX_BTPM25V
  >;
  PLS_01BT: PartsInterface<PLS_01BT, PLS_01BTOptions, typeof PLS_01BT>;
  ENERTALK_TOUCH: PartsInterface<
    ENERTALK_TOUCH,
    ENERTALK_TOUCHOptions,
    typeof ENERTALK_TOUCH
  >;
  TM530: PartsInterface<TM530, TM530Options, typeof TM530>;
  TM511: PartsInterface<TM511, TM511Options, typeof TM511>;
  toio_CoreCube: PartsInterface<
    Toio_CoreCube,
    Toio_CoreCubeOptions,
    typeof Toio_CoreCube
  >;
  UT201BLE: PartsInterface<UT201BLE, UT201BLEOptions, typeof UT201BLE>;
  VitalBand: PartsInterface<VitalBand, VitalBandOptions, typeof VitalBand>;
  HEM_6233T: PartsInterface<HEM_6233T, HEM_6233TOptions, typeof HEM_6233T>;
  MiniBreeze: PartsInterface<MiniBreeze, MiniBreezeOptions, typeof MiniBreeze>;
  MT_500BT: PartsInterface<MT_500BT, MT_500BTOptions, typeof MT_500BT>;
  'PULSE08_M5STICKC-S': PartsInterface<
    Puls08M5stickcS,
    Puls08M5stickcSOptions,
    typeof Puls08M5stickcS
  >;

  '24LC256': PartsInterface<_24LC256, _24LC256Options, typeof _24LC256>;

  FlickHat: PartsInterface<FlickHat, FlickHatOptions, typeof FlickHat>;
  KXSC7_2050: PartsInterface<KXSC7_2050, KXSC7_2050Options, typeof KXSC7_2050>;
  S8100B: PartsInterface<S8100B, S8100BOptions, typeof S8100B>;
  S8120C: PartsInterface<S8120C, S8120COptions, typeof S8120C>;
  ADT7410: PartsInterface<ADT7410, ADT7410Options, typeof ADT7410>;
  S5851A: PartsInterface<S5851A, S5851AOptions, typeof S5851A>;
  DPS310: PartsInterface<DPS310, DPS310Options, typeof DPS310>;
  BMP280: PartsInterface<BMP280, BMP280Options, typeof BMP280>;
  HEM_9200T: PartsInterface<HEM_9200T, HEM_9200TOptions, typeof HEM_9200T>;
  W5500: PartsInterface<W5500, W5500Parts.WiredOptions, typeof W5500>;
  RS_BTWATTCH2: PartsInterface<
    RS_BTWATTCH2,
    RS_BTWATTCH2Options,
    typeof RS_BTWATTCH2
  >;
  Grove_Relay: PartsInterface<
    Grove_Relay,
    Grove_RelayOptions,
    typeof Grove_Relay
  >;
  Grove_SHT35Sensor: PartsInterface<
    Grove_SHT35Sensor,
    Grove_SHT35SensorOptions,
    typeof Grove_SHT35Sensor
  >;
  UA651BLE: PartsInterface<UA651BLE, UA651BLEOptions, typeof UA651BLE>;
  UA1200BLE: PartsInterface<UA1200BLE, UA1200BLEOptions, typeof UA1200BLE>;
  EXVital: PartsInterface<EXVital, EXVital_Options, typeof EXVital>;
  STM550B: PartsInterface<STM550B, STM550B_Options, typeof STM550B>;
  UC421BLE: PartsInterface<UC421BLE, UC421BLEOptions, typeof UC421BLE>;
  UC352BLE: PartsInterface<UC352BLE, UC352BLEOptions, typeof UC352BLE>;
  MESH_100BU: PartsInterface<MESH_100BU, MESH_100BUOptions, typeof MESH_100BU>;
  MESH_100LE: PartsInterface<MESH_100LE, MESH_100LEOptions, typeof MESH_100LE>;
  MESH_100AC: PartsInterface<MESH_100AC, MESH_100ACOptions, typeof MESH_100AC>;
  MESH_100MD: PartsInterface<MESH_100MD, MESH_100MDOptions, typeof MESH_100MD>;
  MESH_100PA: PartsInterface<MESH_100PA, MESH_100PAOptions, typeof MESH_100PA>;
  MESH_100TH: PartsInterface<MESH_100TH, MESH_100THOptions, typeof MESH_100TH>;
  MESH_100GP: PartsInterface<MESH_100GP, MESH_100GPOptions, typeof MESH_100GP>;
  MM_BLEBC5: PartsInterface<MM_BLEBC5, MM_BLEBC5_Options, typeof MM_BLEBC5>;
  HN_300T2: PartsInterface<HN_300T2, HN_300T2Options, typeof HN_300T2>;
  GT_7510: PartsInterface<GT_7510, GT_7510Options, typeof GT_7510>;
  DR_MARK: PartsInterface<DR_MARK, DR_MARKOptions, typeof DR_MARK>;
  GX_3R_Pro: PartsInterface<GX_3R_Pro, GX_3R_Pro_Options, typeof GX_3R_Pro>;
  Tr4A: PartsInterface<Tr4A, Tr4AOptions, typeof Tr4A>;
  HPO_300T: PartsInterface<HPO_300T, HPO_300TOptions, typeof HPO_300T>;
  MC_6810T2: PartsInterface<MC_6810T2, MC_6810T2Options, typeof MC_6810T2>;
  Talia: PartsInterface<Talia, TaliaOptions, typeof Talia>;
  Panasonic_lock: PartsInterface<
    Panasonic_lock,
    Panasonic_lockOptions,
    typeof Panasonic_lock
  >;
}
