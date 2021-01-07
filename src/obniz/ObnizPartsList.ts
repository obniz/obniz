/**
 * @packageDocumentation
 * @module ObnizCore
 */

// Camera
import ArduCAMMini, { ArduCAMMiniOptions } from "../parts/Camera/ArduCAMMini";
import JpegSerialCam, { JpegSerialCamOptions } from "../parts/Camera/JpegSerialCam";

// Display
import _7SegmentLED, { _7SegmentLEDOptions } from "../parts/Display/7SegmentLED";
import _7SegmentLED_MAX7219, { _7SegmentLED_MAX7219Options } from "../parts/Display/7SegmentLED_MAX7219";
import _7SegmentLEDArray, { _7SegmentLEDArrayOptions } from "../parts/Display/7SegmentLEDArray";
import MatrixLED_HT16K33, { MatrixLED_HT16K33Options } from "../parts/Display/MatrixLED_HT16K33";
import MatrixLED_MAX7219, { MatrixLED_MAX7219Options } from "../parts/Display/MatrixLED_MAX7219";
import SainSmartTFT18LCD, { SainSmartTFT18LCDOptions } from "../parts/Display/SainSmartTFT18LCD";
import SharpMemoryTFT, { SharpMemoryTFTOptions } from "../parts/Display/SharpMemoryTFT";
import ST7735S, { ST7735SOptions } from "../parts/Display/ST7735S";

// DistanceSensor
import GP2Y0A21YK0F, { GP2Y0A21YK0FOptions } from "../parts/DistanceSensor/GP2Y0A21YK0F";
import HCSR04, { HCSR04Options } from "../parts/DistanceSensor/HC-SR04";
import VL53L0X, { VL53L0XOptions } from "../parts/DistanceSensor/VL53L0X";

// GasSensor
import MQ135, { MQ135Options } from "../parts/GasSensor/MQ135";
import MQ2, { MQ2Options } from "../parts/GasSensor/MQ2";
import MQ3, { MQ3Options } from "../parts/GasSensor/MQ3";
import MQ4, { MQ4Options } from "../parts/GasSensor/MQ4";
import MQ5, { MQ5Options } from "../parts/GasSensor/MQ5";
import MQ6, { MQ6Options } from "../parts/GasSensor/MQ6";
import MQ7, { MQ7Options } from "../parts/GasSensor/MQ7";
import MQ8, { MQ8Options } from "../parts/GasSensor/MQ8";
import MQ9, { MQ9Options } from "../parts/GasSensor/MQ9";

// GPS
import GYSFDMAXB, { GYSFDMAXBOptions } from "../parts/GPS/GYSFDMAXB";

// Infrared
import InfraredLED, { InfraredLEDOptions } from "../parts/Infrared/InfraredLED";
import IRModule, { IRModuleOptions } from "../parts/Infrared/IRModule";
import IRSensor, { IRSensorOptions } from "../parts/Infrared/IRSensor";
import YG1006, { YG1006Options } from "../parts/Infrared/YG1006";

// Light
import FullColorLED, { FullColorLEDOptions } from "../parts/Light/FullColorLED";
import LED, { LEDOptions } from "../parts/Light/LED";
import WS2811, { WS2811Options } from "../parts/Light/WS2811";
import WS2812, { WS2812Options } from "../parts/Light/WS2812";
import WS2812B, { WS2812BOptions } from "../parts/Light/WS2812B";

// MovementSensor
import AK09916, { AK09916Options } from "../parts/MovementSensor/AK09916";
import AK8963, { AK8963Options } from "../parts/MovementSensor/AK8963";
import Button, { ButtonOptions } from "../parts/MovementSensor/Button";
import FlickHat, { FlickHatOptions } from "../parts/MovementSensor/FlickHat";
import HCSR505, { HCSR505Options } from "../parts/MovementSensor/HC-SR505";
import ICM20948, { ICM20948Options } from "../parts/MovementSensor/ICM20948";
import IPM_165, { IPM_165Options } from "../parts/MovementSensor/IPM-165";
import JoyStick, { JoyStickOptions } from "../parts/MovementSensor/JoyStick";
import KXR94_2050, { KXR94_2050Options } from "../parts/MovementSensor/KXR94-2050";
import KXSC7_2050, { KXSC7_2050Options } from "../parts/MovementSensor/KXSC7-2050";
import MPU6050, { MPU6050Options } from "../parts/MovementSensor/MPU6050";
import MPU6500, { MPU6500Options } from "../parts/MovementSensor/MPU6500";
import MPU6886, { MPU6886Options } from "../parts/MovementSensor/MPU6886";
import MPU9250, { MPU9250Options } from "../parts/MovementSensor/MPU9250";
import PaPIRsVZ, { PaPIRsVZOptions } from "../parts/MovementSensor/PaPIRsVZ";
import Potentiometer, { PotentiometerOptions } from "../parts/MovementSensor/Potentiometer";
import SH200Q, { SH200QOptions } from "../parts/MovementSensor/SH200Q";

// Moving
import DCMotor, { DCMotorOptions } from "../parts/Moving/DCMotor";
import PCA9685, { PCA9685Options } from "../parts/Moving/PCA9685";
import ServoMotor, { ServoMotorOptions } from "../parts/Moving/ServoMotor";
import Solenoid, { SolenoidOptions } from "../parts/Moving/Solenoid";
import StepperMotor, { StepperMotorOptions } from "../parts/Moving/StepperMotor";

// etc
import USB, { USBOptions } from "../parts/Accessory/USB";
import HX711, { Hx711Options } from "../parts/ADConverter/hx711";
import MCP4725, { MCP4725Options } from "../parts/DAConverter/MCP4725";
import ENC03R_Module, { ENC03R_ModuleOptions } from "../parts/GyroSensor/ENC03R_Module";
import SNx4HC595, { SNx4HC595Options } from "../parts/Logic/SNx4HC595";
import CT10, { CT10Options } from "../parts/Magnet/CT10";
import HMC5883L, { HMC5883LOptions } from "../parts/Magnet/HMC5883L";
import _24LC256, { _24LC256Options } from "../parts/Memory/24LC256";
import AXP192, { AXP192Options } from "../parts/Power/AXP192";
import SEN0114, { SEN0114Options } from "../parts/SoilSensor/SEN0114";
import Speaker, { SpeakerOptions } from "../parts/Sound/Speaker";

// PressureSensor
import BMP280, { BMP280Options } from "../parts/PressureSensor/BMP280";
import DPS310, { DPS310Options } from "../parts/PressureSensor/DPS310";
import FSR40X, { FSR40XOptions } from "../parts/PressureSensor/FSR-40X";

// TemperatureSensor
import LM35DZ, { LM35DZOptions } from "../parts/TemperatureSensor/analog/LM35DZ";
import LM60, { LM60Options } from "../parts/TemperatureSensor/analog/LM60";
import LM61, { LM61Options } from "../parts/TemperatureSensor/analog/LM61";
import LMT87, { LMT87Options } from "../parts/TemperatureSensor/analog/LMT87";
import MCP9700, { MCP9700Options } from "../parts/TemperatureSensor/analog/MCP9700";
import MCP9701, { MCP9701Options } from "../parts/TemperatureSensor/analog/MCP9701";
import S8100B, { S8100BOptions } from "../parts/TemperatureSensor/analog/S8100B";
import S8120C, { S8120COptions } from "../parts/TemperatureSensor/analog/S8120C";
import ADT7410, { ADT7410Options } from "../parts/TemperatureSensor/i2c/ADT7410";
import AM2320, { AM2320Options } from "../parts/TemperatureSensor/i2c/AM2320";
import AMG8833, { AMG8833Options } from "../parts/TemperatureSensor/i2c/AMG8833";
import BME280, { BME280Options } from "../parts/TemperatureSensor/i2c/BME280";
import D6T44L, { D6T44LOptions } from "../parts/TemperatureSensor/i2c/D6T44L";
import DHT12, { DHT12Options } from "../parts/TemperatureSensor/i2c/DHT12";
import S5851A, { S5851AOptions } from "../parts/TemperatureSensor/i2c/S-5851A";
import SHT20, { SHT20Options } from "../parts/TemperatureSensor/i2c/SHT20";
import SHT31, { SHT31Options } from "../parts/TemperatureSensor/i2c/SHT31";
import ADT7310, { ADT7310Options } from "../parts/TemperatureSensor/spi/ADT7310";

// Wireless
import RN42, { RN42Options } from "../parts/Wireless/RN42";
import XBee, { XBeeOptions } from "../parts/Wireless/XBee";

// ColorSensor
import PT550, { PT550Options } from "../parts/ColorSensor/PT550";
import S11059, { S11059Options } from "../parts/ColorSensor/S11059";

// biological
import Puls08M5stickcS, { Puls08M5stickcSOptions } from "../parts/Biological/PULSE08-M5STICKC-S";

// Ble
import OMRON_2JCIE, { OMRON_2JCIEOptions } from "../parts/Ble/2jcie";
import cir415a, { cir415aOptions } from "../parts/Ble/cir415a";
import ENERTALK_TOUCH, { ENERTALK_TOUCHOptions } from "../parts/Ble/ENERTALK";
import HEM_6233T, { HEM_6233TOptions } from "../parts/Ble/HEM_6233T";
import IBS01, { IBS01Options } from "../parts/Ble/iBS01";
import IBS01RG, { IBS01RGOptions } from "../parts/Ble/iBS01RG";
import IBS01T, { IBS01TOptions } from "../parts/Ble/iBS01T";
import IBS02IR, { IBS02IROptions } from "../parts/Ble/iBS02IR";
import IBS02PIR, { IBS02PIROptions } from "../parts/Ble/iBS02PIR";
import IBS03, { IBS03Options } from "../parts/Ble/iBS03_iBS04";
import IBS03T, { IBS03TOptions } from "../parts/Ble/iBS03T";
import IBS03TP, { IBS03TPOptions } from "../parts/Ble/iBS03TP";
import IBS04I, { IBS04IOptions } from "../parts/Ble/iBS04i";
import Linking, { LinkingOptions } from "../parts/Ble/linking";
import Logtta_Accel, { Logtta_AccelOptions } from "../parts/Ble/LogttaAccel";
import Logtta_AD, { Logtta_ADOptions } from "../parts/Ble/LogttaAD";
import Logtta_CO2, { Logtta_CO2Options } from "../parts/Ble/LogttaCO2";
import Logtta_TH, { Logtta_THOptions } from "../parts/Ble/LogttaTemp";
import MINEW_S1, { MINEW_S1Options } from "../parts/Ble/MINEW_S1";
import MiniBreeze, { MiniBreezeOptions } from "../parts/Ble/MiniBreeze";
import MT_500BT, { MT_500BTOptions } from "../parts/Ble/MT_500BT";
import PLS_01BT, { PLS_01BTOptions } from "../parts/Ble/PLS_01BT";
import REX_BTPM25V, { REX_BTPM25VOptions } from "../parts/Ble/REX_BTPM25V";
import RS_Seek3, { RS_Seek3Options } from "../parts/Ble/RS_SEEK3";
import SCBTGAAAC, { SCBTGAAACOptions } from "../parts/Ble/scbtgaaac";
import TM530, { TM530Options } from "../parts/Ble/tm530";
import TM551, { TM551Options } from "../parts/Ble/tm551";
import Toio_CoreCube, { Toio_CoreCubeOptions } from "../parts/Ble/toio_corecube";
import uPRISM, { uPRISMOptions } from "../parts/Ble/uprism";
import UT201BLE, { UT201BLEOptions } from "../parts/Ble/UT201BLE";

// Grove
import Grove_3AxisAccelerometer, { Grove_3AxisAccelerometerOptions } from "../parts/Grove/Grove_3AxisAccelerometer";
import Grove_Button, { Grove_ButtonOptions } from "../parts/Grove/Grove_Button";
import Grove_Buzzer, { Grove_BuzzerOptions } from "../parts/Grove/Grove_Buzzer";
import Grove_DistanceSensor, { Grove_DistanceSensorOptions } from "../parts/Grove/Grove_DistanceSensor";
import Grove_EarHeartRate, { Grove_EarHeartRateOptions } from "../parts/Grove/Grove_EarHeartRate";
import Grove_EARTH, { Grove_EARTHOptions } from "../parts/Grove/Grove_EARTH";
import Grove_Gesture, { Grove_GestureSensorOptions } from "../parts/Grove/Grove_GestureSensor";
import Grove_GPS, { Grove_GPSOptions } from "../parts/Grove/Grove_GPS";
import Grove_JoyStick, { Grove_JoyStickOptions } from "../parts/Grove/Grove_JoyStick";
import Grove_LightSensor, { Grove_LightSensorOptions } from "../parts/Grove/Grove_LightSensor";
import Grove_MP3, { Grove_MP3Options } from "../parts/Grove/Grove_MP3";
import Grove_PressureSensor, { Grove_PressureSensorOptions } from "../parts/Grove/Grove_PressureSensor";
import Grove_RotaryAngleSensor, { Grove_RotaryAngleSensorOptions } from "../parts/Grove/Grove_RotaryAngleSensor";
import Grove_SoilMoistureSensor, { Grove_SoilMoistureSensorOptions } from "../parts/Grove/Grove_SoilMoistureSensor";
import Grove_Speaker, { Grove_SpeakerOptions } from "../parts/Grove/Grove_Speaker";
import Grove_WaterLevelSensor, { Grove_WaterLevelSensorOptions } from "../parts/Grove/Grove_WaterLevelSensor";
// Keyestudio
import Keyestudio_Button, { Keyestudio_ButtonOptions } from "../parts/Keyestudio/Keyestudio_Button";
import Keyestudio_Buzzer, { Keyestudio_BuzzerOptions } from "../parts/Keyestudio/Keyestudio_Buzzer";
import Keyestudio_HT16K33, { Keyestudio_HT16K33Options } from "../parts/Keyestudio/Keyestudio_HT16K33";
import Keyestudio_MoistureSensor, {
  Keyestudio_MoistureSensorOptions,
} from "../parts/Keyestudio/Keyestudio_MoistureSensor";
import Keyestudio_PIR, { Keyestudio_PIROptions } from "../parts/Keyestudio/Keyestudio_PIR";
import Keyestudio_TemperatureSensor, {
  Keyestudio_TemperatureSensorOptions,
} from "../parts/Keyestudio/Keyestudio_TemperatureSensor";
import Keyestudio_TrafficLight, { Keyestudio_TrafficLightOptions } from "../parts/Keyestudio/Keyestudio_TrafficLight";

// M5StackC
import HEM_9200T, { HEM_9200TOptions } from "../parts/Ble/HEM_9200T";
import M5StickC_ADC, { M5StickC_ADCOptions } from "../parts/M5Stack/M5StickC_ADC";
import M5StickC_DAC, { M5StickC_DACOptions } from "../parts/M5Stack/M5StickC_DAC";
import M5StickC_FINGER, { M5StickC_FINGEROptions } from "../parts/M5Stack/M5StickC_FINGER";
import M5StickC_JoyStick, { M5StickC_JoyStickOptions } from "../parts/M5Stack/M5StickC_JoyStick";
import M5StickC_RS485, { M5StickC_RS485Options } from "../parts/M5Stack/M5StickC_RS485";
import M5StickC_ToF, { M5StickC_ToFOptions } from "../parts/M5Stack/M5StickC_ToF";
import M5StickC_Yun, { M5StickC_YunOptions } from "../parts/M5Stack/M5StickC_Yun";

export interface PartsList {
  "LED": { class: LED; options: LEDOptions };
  "FullColorLED": { class: FullColorLED; options: FullColorLEDOptions };
  "WS2811": { class: WS2811; options: WS2811Options };
  "WS2812": { class: WS2812; options: WS2812Options };
  "WS2812B": { class: WS2812B; options: WS2812BOptions };
  "InfraredLED": { class: InfraredLED; options: InfraredLEDOptions };
  "IRSensor": { class: IRSensor; options: IRSensorOptions };
  "IRModule": { class: IRModule; options: IRModuleOptions };
  "7SegmentLED": { class: _7SegmentLED; options: _7SegmentLEDOptions };
  "7SegmentLEDArray": { class: _7SegmentLEDArray; options: _7SegmentLEDArrayOptions };
  "7SegmentLED_MAX7219": { class: _7SegmentLED_MAX7219; options: _7SegmentLED_MAX7219Options };
  "MatrixLED_MAX7219": { class: MatrixLED_MAX7219; options: MatrixLED_MAX7219Options };
  "MatrixLED_HT16K33": { class: MatrixLED_HT16K33; options: MatrixLED_HT16K33Options };
  "SainSmartTFT18LCD": { class: SainSmartTFT18LCD; options: SainSmartTFT18LCDOptions };
  "SharpMemoryTFT": { class: SharpMemoryTFT; options: SharpMemoryTFTOptions };
  "ST7735S": { class: ST7735S; options: ST7735SOptions };
  "ArduCAMMini": { class: ArduCAMMini; options: ArduCAMMiniOptions };
  "JpegSerialCam": { class: JpegSerialCam; options: JpegSerialCamOptions };
  "DCMotor": { class: DCMotor; options: DCMotorOptions };
  "PCA9685": { class: PCA9685; options: PCA9685Options };
  "ServoMotor": { class: ServoMotor; options: ServoMotorOptions };
  "Solenoid": { class: Solenoid; options: SolenoidOptions };
  "StepperMotor": { class: StepperMotor; options: StepperMotorOptions };
  "Speaker": { class: Speaker; options: SpeakerOptions };
  "AXP192": { class: AXP192; options: AXP192Options };
  "MQ2": { class: MQ2; options: MQ2Options };
  "MQ3": { class: MQ3; options: MQ3Options };
  "MQ4": { class: MQ4; options: MQ4Options };
  "MQ5": { class: MQ5; options: MQ5Options };
  "MQ6": { class: MQ6; options: MQ6Options };
  "MQ7": { class: MQ7; options: MQ7Options };
  "MQ8": { class: MQ8; options: MQ8Options };
  "MQ9": { class: MQ9; options: MQ9Options };
  "MQ135": { class: MQ135; options: MQ135Options };
  "SNx4HC595": { class: SNx4HC595; options: SNx4HC595Options };
  "USB": { class: USB; options: USBOptions };
  "RN42": { class: RN42; options: RN42Options };
  "XBee": { class: XBee; options: XBeeOptions };
  "Button": { class: Button; options: ButtonOptions };
  "AK8963": { class: AK8963; options: AK8963Options };
  "MPU6050": { class: MPU6050; options: MPU6050Options };
  "MPU6500": { class: MPU6500; options: MPU6500Options };
  "MPU6886": { class: MPU6886; options: MPU6886Options };
  "MPU9250": { class: MPU9250; options: MPU9250Options };
  "SH200Q": { class: SH200Q; options: SH200QOptions };
  "AK09916": { class: AK09916; options: AK09916Options };
  "ICM20948": { class: ICM20948; options: ICM20948Options };
  "HC-SR505": { class: HCSR505; options: HCSR505Options };
  "JoyStick": { class: JoyStick; options: JoyStickOptions };
  "KXR94-2050": { class: KXR94_2050; options: KXR94_2050Options };
  "IPM-165": { class: IPM_165; options: IPM_165Options };
  "PaPIRsVZ": { class: PaPIRsVZ; options: PaPIRsVZOptions };
  "Potentiometer": { class: Potentiometer; options: PotentiometerOptions };
  // '24LC256':{class: _24LC256,options: _24LC256Options},
  "ENC03R_Module": { class: ENC03R_Module; options: ENC03R_ModuleOptions };
  "FSR40X": { class: FSR40X; options: FSR40XOptions };
  "HC-SR04": { class: HCSR04; options: HCSR04Options };
  "GP2Y0A21YK0F": { class: GP2Y0A21YK0F; options: GP2Y0A21YK0FOptions };
  "VL53L0X": { class: VL53L0X; options: VL53L0XOptions };
  "GYSFDMAXB": { class: GYSFDMAXB; options: GYSFDMAXBOptions };
  "CT10": { class: CT10; options: CT10Options };
  "HMC5883L": { class: HMC5883L; options: HMC5883LOptions };
  "hx711": { class: HX711; options: Hx711Options };
  "MCP4725": { class: MCP4725; options: MCP4725Options };
  "SEN0114": { class: SEN0114; options: SEN0114Options };
  "LM35DZ": { class: LM35DZ; options: LM35DZOptions };
  "LM60": { class: LM60; options: LM60Options };
  "LM61": { class: LM61; options: LM61Options };
  "LMT87": { class: LMT87; options: LMT87Options };
  "MCP9700": { class: MCP9700; options: MCP9700Options };
  "MCP9701": { class: MCP9701; options: MCP9701Options };
  // 'S8100B':{class: S8100B,options: S8100BOptions},
  // 'S8120C':{class: S8120C,options: S8120COptions},
  // 'ADT7410':{class: ADT7410,options: ADT7410Options},
  "AMG8833": { class: AMG8833; options: AMG8833Options };
  "BME280": { class: BME280; options: BME280Options };
  "D6T44L": { class: D6T44L; options: D6T44LOptions };
  "DHT12": { class: DHT12; options: DHT12Options };
  // 'S5851A':{class: S5851A,options: S5851AOptions},
  "SHT31": { class: SHT31; options: SHT31Options };
  "SHT20": { class: SHT20; options: SHT20Options };
  "ADT7310": { class: ADT7310; options: ADT7310Options };
  "AM2320": { class: AM2320; options: AM2320Options };
  "PT550": { class: PT550; options: PT550Options };
  "S11059": { class: S11059; options: S11059Options };
  "YG1006": { class: YG1006; options: YG1006Options };
  "Grove_Button": { class: Grove_Button; options: Grove_ButtonOptions };
  "Grove_Buzzer": { class: Grove_Buzzer; options: Grove_BuzzerOptions };
  "Grove_EarHeartRate": { class: Grove_EarHeartRate; options: Grove_EarHeartRateOptions };
  "Grove_MP3": { class: Grove_MP3; options: Grove_MP3Options };
  "Grove_GPS": { class: Grove_GPS; options: Grove_GPSOptions };
  "Grove_EARTH": { class: Grove_EARTH; options: Grove_EARTHOptions };
  "Grove_JoyStick": { class: Grove_JoyStick; options: Grove_JoyStickOptions };
  "Grove_3AxisAccelerometer": { class: Grove_3AxisAccelerometer; options: Grove_3AxisAccelerometerOptions };
  "Grove_Speaker": { class: Grove_Speaker; options: Grove_SpeakerOptions };
  "Grove_RotaryAnglesensor": { class: Grove_RotaryAngleSensor; options: Grove_RotaryAngleSensorOptions };
  "Grove_DistanceSensor": { class: Grove_DistanceSensor; options: Grove_DistanceSensorOptions };
  "Grove_LightSensor": { class: Grove_LightSensor; options: Grove_LightSensorOptions };
  "Grove_PressureSensor": { class: Grove_PressureSensor; options: Grove_PressureSensorOptions };
  "Grove_SoilMoistureSensor": {
    class: Grove_SoilMoistureSensor;
    options: Grove_SoilMoistureSensorOptions;
  };
  "Grove_Gesture": {
    class: Grove_Gesture;
    options: Grove_GestureSensorOptions;
  };
  "Grove_WaterLevelSensor": {
    class: Grove_WaterLevelSensor;
    options: Grove_WaterLevelSensorOptions;
  };
  "M5StickC_JoyStick": { class: M5StickC_JoyStick; options: M5StickC_JoyStickOptions };
  "M5StickC_ADC": { class: M5StickC_ADC; options: M5StickC_ADCOptions };
  "M5StickC_DAC": { class: M5StickC_DAC; options: M5StickC_DACOptions };
  "M5StickC_ToF": { class: M5StickC_ToF; options: M5StickC_ToFOptions };
  "M5StickC_FINGER": { class: M5StickC_FINGER; options: M5StickC_FINGEROptions };
  "M5StickC_RS485": { class: M5StickC_RS485; options: M5StickC_RS485Options };
  "M5StickC_Yun": { class: M5StickC_Yun; options: M5StickC_YunOptions };
  "Keyestudio_Button": { class: Keyestudio_Button; options: Keyestudio_ButtonOptions };
  "Keyestudio_MoistureSensor": { class: Keyestudio_MoistureSensor; options: Keyestudio_MoistureSensorOptions };
  "Keyestudio_Buzzer": { class: Keyestudio_Buzzer; options: Keyestudio_BuzzerOptions };
  "Keyestudio_TemperatureSensor": { class: Keyestudio_TemperatureSensor; options: Keyestudio_TemperatureSensorOptions };
  "Keyestudio_PIR": { class: Keyestudio_PIR; options: Keyestudio_PIROptions };
  "Keyestudio_TrafficLight": { class: Keyestudio_TrafficLight; options: Keyestudio_TrafficLightOptions };
  "Keyestudio_HT16K33": { class: Keyestudio_HT16K33; options: Keyestudio_HT16K33Options };
  "2JCIE": { class: OMRON_2JCIE; options: OMRON_2JCIEOptions };
  "Logtta_CO2": { class: Logtta_CO2; options: Logtta_CO2Options };
  "Logtta_TH": { class: Logtta_TH; options: Logtta_THOptions };
  "Logtta_AD": { class: Logtta_AD; options: Logtta_ADOptions };
  "Logtta_Accel": { class: Logtta_Accel; options: Logtta_AccelOptions };
  "Linking": { class: Linking; options: LinkingOptions };
  "uPRISM": { class: uPRISM; options: uPRISMOptions };
  "SCBTGAAAC": { class: SCBTGAAAC; options: SCBTGAAACOptions };
  "iBS04i": { class: IBS04I; options: IBS04IOptions };
  "iBS01T": { class: IBS01T; options: IBS01TOptions };
  "iBS01RG": { class: IBS01RG; options: IBS01RGOptions };
  "iBS01": { class: IBS01; options: IBS01Options };
  "iBS02IR": { class: IBS02IR; options: IBS02IROptions };
  "iBS02PIR": { class: IBS02PIR; options: IBS02PIROptions };
  "iBS03": { class: IBS03; options: IBS03Options };
  "iBS03T": { class: IBS03T; options: IBS03TOptions };
  "iBS03TP": { class: IBS03TP; options: IBS03TPOptions };
  "MINEW_S1": { class: MINEW_S1; options: MINEW_S1Options };
  "RS_Seek3": { class: RS_Seek3; options: RS_Seek3Options };
  "REX_BTPM25V": { class: REX_BTPM25V; options: REX_BTPM25VOptions };
  "PLS_01BT": { class: PLS_01BT; options: PLS_01BTOptions };
  "ENERTALK_TOUCH": { class: ENERTALK_TOUCH; options: ENERTALK_TOUCHOptions };
  "cir415a": { class: cir415a; options: cir415aOptions };
  "TM530": { class: TM530; options: TM530Options };
  "TM551": { class: TM551; options: TM551Options };
  "toio_CoreCube": { class: Toio_CoreCube; options: Toio_CoreCubeOptions };
  "UT201BLE": { class: UT201BLE; options: UT201BLEOptions };
  "HEM_6233T": { class: HEM_6233T; options: HEM_6233TOptions };
  "MiniBreeze": { class: MiniBreeze; options: MiniBreezeOptions };
  "MT_500BT": { class: MT_500BT; options: MT_500BTOptions };
  "PULSE08_M5STICKC-S": { class: Puls08M5stickcS; options: Puls08M5stickcSOptions };
  "24LC256": { class: _24LC256; options: _24LC256Options };
  "FlickHat": { class: FlickHat; options: FlickHatOptions };
  "KXSC7_2050": { class: KXSC7_2050; options: KXSC7_2050Options };
  "S8100B": { class: S8100B; options: S8100BOptions };
  "S8120C": { class: S8120C; options: S8120COptions };
  "ADT7410": { class: ADT7410; options: ADT7410Options };
  "S5851A": { class: S5851A; options: S5851AOptions };
  "DPS310": { class: DPS310; options: DPS310Options };
  "BMP280": { class: BMP280; options: BMP280Options };
  "HEM_9200T": { class: HEM_9200T; options: HEM_9200TOptions };
}
