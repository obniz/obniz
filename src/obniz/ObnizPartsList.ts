/**
 * @packageDocumentation
 * @module ObnizCore
 */

import USB, {USBOptions} from "../parts/Accessory/USB";
import HX711, {Hx711Options} from "../parts/ADConverter/hx711";
// Camera
import ArduCAMMini, {ArduCAMMiniOptions} from "../parts/Camera/ArduCAMMini";
import JpegSerialCam, {JpegSerialCamOptions} from "../parts/Camera/JpegSerialCam";
// Display
import _7SegmentLED, {_7SegmentLEDOptions} from "../parts/Display/7SegmentLED";
import _7SegmentLED_MAX7219, {_7SegmentLED_MAX7219Options} from "../parts/Display/7SegmentLED_MAX7219";
import _7SegmentLEDArray, {_7SegmentLEDArrayOptions} from "../parts/Display/7SegmentLEDArray";
import MatrixLED_HT16K33, {MatrixLED_HT16K33Options} from "../parts/Display/MatrixLED_HT16K33";
import MatrixLED_MAX7219, {MatrixLED_MAX7219Options} from "../parts/Display/MatrixLED_MAX7219";
import SainSmartTFT18LCD, {SainSmartTFT18LCDOptions} from "../parts/Display/SainSmartTFT18LCD";
import SharpMemoryTFT, {SharpMemoryTFTOptions} from "../parts/Display/SharpMemoryTFT";
import ST7735S, {ST7735SOptions} from "../parts/Display/ST7735S";
// DistanceSensor
import GP2Y0A21YK0F, {GP2Y0A21YK0FOptions} from "../parts/DistanceSensor/GP2Y0A21YK0F";
import HCSR04, {HCSR04Options} from "../parts/DistanceSensor/HC-SR04";
// GasSensor
import MQ135, {MQ135Options} from "../parts/GasSensor/MQ135";
import MQ2, {MQ2Options} from "../parts/GasSensor/MQ2";
import MQ3, {MQ3Options} from "../parts/GasSensor/MQ3";
import MQ4, {MQ4Options} from "../parts/GasSensor/MQ4";
import MQ5, {MQ5Options} from "../parts/GasSensor/MQ5";
import MQ6, {MQ6Options} from "../parts/GasSensor/MQ6";
import MQ7, {MQ7Options} from "../parts/GasSensor/MQ7";
import MQ8, {MQ8Options} from "../parts/GasSensor/MQ8";
import MQ9, {MQ9Options} from "../parts/GasSensor/MQ9";
import GYSFDMAXB, {GYSFDMAXBOptions} from "../parts/GPS/GYSFDMAXB";
import ENC03R_Module, {ENC03R_ModuleOptions} from "../parts/GyroSensor/ENC03R_Module";
import InfraredLED, {InfraredLEDOptions} from "../parts/Infrared/InfraredLED";
import IRModule, {IRModuleOptions} from "../parts/Infrared/IRModule";
import IRSensor, {IRSensorOptions} from "../parts/Infrared/IRSensor";
import YG1006, {YG1006Options} from "../parts/Infrared/YG1006";

import FullColorLED, {FullColorLEDOptions} from "../parts/Light/FullColorLED";
import LED, {LEDOptions} from "../parts/Light/LED";
import WS2811, {WS2811Options} from "../parts/Light/WS2811";
import WS2812, {WS2812Options} from "../parts/Light/WS2812";
import WS2812B, {WS2812BOptions} from "../parts/Light/WS2812B";
import SNx4HC595, {SNx4HC595Options} from "../parts/Logic/SNx4HC595";
import CT10, {CT10Options} from "../parts/Magnet/CT10";
import HMC5883L, {HMC5883LOptions} from "../parts/Magnet/HMC5883L";
import _24LC256, {_24LC256Options} from "../parts/Memory/24LC256";
import AK8963, {AK8963Options} from "../parts/MovementSensor/AK8963";
import Button, {ButtonOptions} from "../parts/MovementSensor/Button";
import FlickHat, {FlickHatOptions} from "../parts/MovementSensor/FlickHat";
import HCSR505, {HCSR505Options} from "../parts/MovementSensor/HC-SR505";
import IPM_165, {IPM_165Options} from "../parts/MovementSensor/IPM-165";
import JoyStick, {JoyStickOptions} from "../parts/MovementSensor/JoyStick";
import KXR94_2050, {KXR94_2050Options} from "../parts/MovementSensor/KXR94-2050";
import KXSC7_2050, {KXSC7_2050Options} from "../parts/MovementSensor/KXSC7-2050";
import MPU6050, {MPU6050Options} from "../parts/MovementSensor/MPU6050";
import MPU6886, {MPU6886Options} from "../parts/MovementSensor/MPU6886";
import MPU9250, {MPU9250Options} from "../parts/MovementSensor/MPU9250";
import PaPIRsVZ, {PaPIRsVZOptions} from "../parts/MovementSensor/PaPIRsVZ";
import Potentiometer, {PotentiometerOptions} from "../parts/MovementSensor/Potentiometer";
import SH200Q, {SH200QOptions} from "../parts/MovementSensor/SH200Q";
import DCMotor, {DCMotorOptions} from "../parts/Moving/DCMotor";
import PCA9685, {PCA9685Options} from "../parts/Moving/PCA9685";
import ServoMotor, {ServoMotorOptions} from "../parts/Moving/ServoMotor";
import Solenoid, {SolenoidOptions} from "../parts/Moving/Solenoid";
import StepperMotor, {StepperMotorOptions} from "../parts/Moving/StepperMotor";
import AXP192, {AXP192Options} from "../parts/Power/AXP192";
import DPS310, {DPS310Options} from "../parts/PressureSensor/DPS310";
import FSR40X, {FSR40XOptions} from "../parts/PressureSensor/FSR-40X";
import SEN0114, {SEN0114Options} from "../parts/SoilSensor/SEN0114";
import Speaker, {SpeakerOptions} from "../parts/Sound/Speaker";
import LM35DZ, {LM35DZOptions} from "../parts/TemperatureSensor/analog/LM35DZ";
import LM60, {LM60Options} from "../parts/TemperatureSensor/analog/LM60";
import LM61, {LM61Options} from "../parts/TemperatureSensor/analog/LM61";
import LMT87, {LMT87Options} from "../parts/TemperatureSensor/analog/LMT87";
import MCP9700, {MCP9700Options} from "../parts/TemperatureSensor/analog/MCP9700";
import MCP9701, {MCP9701Options} from "../parts/TemperatureSensor/analog/MCP9701";
import S8100B, {S8100BOptions} from "../parts/TemperatureSensor/analog/S8100B";
import S8120C, {S8120COptions} from "../parts/TemperatureSensor/analog/S8120C";
import ADT7410, {ADT7410Options} from "../parts/TemperatureSensor/i2c/ADT7410";
import AM2320, {AM2320Options} from "../parts/TemperatureSensor/i2c/AM2320";
import AMG8833, {AMG8833Options} from "../parts/TemperatureSensor/i2c/AMG8833";
import BME280, {BME280Options} from "../parts/TemperatureSensor/i2c/BME280";
import D6T44L, {D6T44LOptions} from "../parts/TemperatureSensor/i2c/D6T44L";
import DHT12, {DHT12Options} from "../parts/TemperatureSensor/i2c/DHT12";
import S5851A, {S5851AOptions} from "../parts/TemperatureSensor/i2c/S-5851A";
import SHT20, {SHT20Options} from "../parts/TemperatureSensor/i2c/SHT20";
import SHT31, {SHT31Options} from "../parts/TemperatureSensor/i2c/SHT31";
import ADT7310, {ADT7310Options} from "../parts/TemperatureSensor/spi/ADT7310";
// Wireless
import RN42, {RN42Options} from "../parts/Wireless/RN42";
import XBee, {XBeeOptions} from "../parts/Wireless/XBee";

// ColorSensor
// biological
import Puls08M5stickcS, {Puls08M5stickcSOptions} from "../parts/Biological/PULSE08-M5STICKC-S";
// Ble
import OMRON_2JCIE, {OMRON_2JCIEOptions} from "../parts/Ble/2jcie";
import Linking, {LinkingOptions} from "../parts/Ble/linking";
import PT550, {PT550Options} from "../parts/ColorSensor/PT550";
import S11059, {S11059Options} from "../parts/ColorSensor/S11059";

import Grove_3AxisAccelerometer, {Grove_3AxisAccelerometerOptions} from "../parts/Grove/Grove_3AxisAccelerometer";
// Grove
import Grove_Button, {Grove_ButtonOptions} from "../parts/Grove/Grove_Button";
import Grove_Buzzer, {Grove_BuzzerOptions} from "../parts/Grove/Grove_Buzzer";
import Grove_EarHeartRate, {Grove_EarHeartRateOptions} from "../parts/Grove/Grove_EarHeartRate";
import Grove_GPS, {Grove_GPSOptions} from "../parts/Grove/Grove_GPS";
import Grove_MP3, {Grove_MP3Options} from "../parts/Grove/Grove_MP3";

import M5StickC_YunHat, {M5StickC_YunHatOptions} from "../parts/M5Stack/M5StickCYunHat";
import BMP280, {BMP280Options} from "../parts/PressureSensor/BMP280";

// Keyestudio
import Keyestudio_Button, {Keyestudio_ButtonOptions} from "../parts/Keyestudio/Keyestudio_Button";
import Keyestudio_Buzzer, {Keyestudio_BuzzerOptions} from "../parts/Keyestudio/Keyestudio_Buzzer";
import Keyestudio_HT16K33, {Keyestudio_HT16K33Options} from "../parts/Keyestudio/Keyestudio_HT16K33";
import Keyestudio_MoistureSensor, {Keyestudio_MoistureSensorOptions} from "../parts/Keyestudio/Keyestudio_MoistureSensor";
import Keyestudio_PIR, {Keyestudio_PIROptions} from "../parts/Keyestudio/Keyestudio_PIR";
import Keyestudio_TemperatureSensor, {Keyestudio_TemperatureSensorOptions} from "../parts/Keyestudio/Keyestudio_TemperatureSensor";
import Keyestudio_TrafficLight, {Keyestudio_TrafficLightOptions} from "../parts/Keyestudio/Keyestudio_TrafficLight";

export interface WiredNameMap {
  // Light
  "LED": LED;
  "FullColorLED": FullColorLED;
  "WS2811": WS2811;
  "WS2812": WS2812;
  "WS2812B": WS2812B;
  // Infrared
  "InfraredLED": InfraredLED;
  "IRSensor": IRSensor;
  "IRModule": IRModule;
  // Display
  "7SegmentLED": _7SegmentLED;
  "7SegmentLEDArray": _7SegmentLEDArray;
  "7SegmentLED_MAX7219": _7SegmentLED_MAX7219;
  "MatrixLED_MAX7219": MatrixLED_MAX7219;
  "MatrixLED_HT16K33": MatrixLED_HT16K33;
  "SainSmartTFT18LCD": SainSmartTFT18LCD;
  "SharpMemoryTFT": SharpMemoryTFT;
  "ST7735S": ST7735S;
  // Camera
  "ArduCAMMini": ArduCAMMini;
  "JpegSerialCam": JpegSerialCam;
  // Moving
  "DCMotor": DCMotor;
  "PCA9685": PCA9685;
  "ServoMotor": ServoMotor;
  "Solenoid": Solenoid;
  "StepperMotor": StepperMotor;
  // Sound
  "Speaker": Speaker;
  // Power
  "AXP192": AXP192;
  // GasSensor
  "MQ2": MQ2;
  "MQ3": MQ3;
  "MQ4": MQ4;
  "MQ5": MQ5;
  "MQ6": MQ6;
  "MQ7": MQ7;
  "MQ8": MQ8;
  "MQ9": MQ9;
  "MQ135": MQ135;
  // Logic
  "SNx4HC595": SNx4HC595;
  // Accessory
  "USB": USB;
  // Wireless
  "RN42": RN42;
  "XBee": XBee;
  // Movement Sensor
  "Button": Button;
  "AK8963": AK8963;
  "MPU6050": MPU6050;
  "MPU6886": MPU6886;
  "MPU9250": MPU9250;
  "SH200Q": SH200Q;
  // 'FlickHat': FlickHat;
  "HC-SR505": HCSR505;
  "JoyStick": JoyStick;
  "KXR94-2050": KXR94_2050;
  "IPM-165": IPM_165;
  // 'KXSC7-2050': KXSC7_2050;
  "PaPIRsVZ": PaPIRsVZ;
  "Potentiometer": Potentiometer;
  // Memory
  // '24LC256': _24LC256;
  // GyroSensor
  "ENC03R_Module": ENC03R_Module;
  // PressureSensor
  "FSR40X": FSR40X;
  // Distance Sensor
  "HC-SR04": HCSR04;
  "GP2Y0A21YK0F": GP2Y0A21YK0F;
  // GPS
  "GYSFDMAXB": GYSFDMAXB;
  // MagnetSensor
  "CT10": CT10;
  "HMC5883L": HMC5883L;
  // ADConverter
  "hx711": HX711;
  // SoilSensor
  "SEN0114": SEN0114;
  // Temperature Sensor
  "LM35DZ": LM35DZ;
  "LM60": LM60;
  "LM61": LM61;
  "LMT87": LMT87;
  "MCP9700": MCP9700;
  "MCP9701": MCP9701;
  // 'S8100B': S8100B;
  // 'S8120C': S8120C;
  // 'ADT7410': ADT7410;
  "AMG8833": AMG8833;
  "BME280": BME280;
  "D6T44L": D6T44L;
  "DHT12": DHT12;
  // 'S5851A': S5851A;
  "SHT31": SHT31;
  "SHT20": SHT20;
  "ADT7310": ADT7310;
  "AM2320": AM2320;
  // ColorSensor
  "PT550": PT550;
  "S11059": S11059;
  "YG1006": YG1006;
  // Memory
  "24LC256": _24LC256;
  // Grove
  "Grove_Button": Grove_Button;
  "Grove_Buzzer": Grove_Buzzer;
  "Grove_EarHeartRate": Grove_EarHeartRate;
  "Grove_MP3": Grove_MP3;
  "Grove_GPS": Grove_GPS;
  "Grove_3AxisAccelerometer": Grove_3AxisAccelerometer;
  // Keyestudio
  "Keyestudio_Button": Keyestudio_Button;
  "Keyestudio_MoistureSensor": Keyestudio_MoistureSensor;
  "Keyestudio_Buzzer": Keyestudio_Buzzer;
  "Keyestudio_TemperatureSensor": Keyestudio_TemperatureSensor;
  "Keyestudio_PIR": Keyestudio_PIR;
  "Keyestudio_TrafficLight": Keyestudio_TrafficLight;
  "Keyestudio_HT16K33": Keyestudio_HT16K33;
  // Ble
  "2JCIE": OMRON_2JCIE;
  "Linking": Linking;
  // Bioligical
  "PULSE08_M5STICKC-S": Puls08M5stickcS;

  "FlickHat": FlickHat;
  "KXSC7_2050": KXSC7_2050;
  "S8100B": S8100B;
  "S8120C": S8120C;
  "ADT7410": ADT7410;
  "S5851A": S5851A;
  "DPS310": DPS310;
  "BMP280": BMP280;
  "M5StickC_YunHat": M5StickC_YunHat;
}

// TODO: この二重管理をなんとかしたい
export interface WiredNameOptionsMap {
  // Light
  "LED": LEDOptions;
  "FullColorLED": FullColorLEDOptions;
  "WS2811": WS2811Options;
  "WS2812": WS2812Options;
  "WS2812B": WS2812BOptions;
  // Infrared
  "InfraredLED": InfraredLEDOptions;
  "IRSensor": IRSensorOptions;
  "IRModule": IRModuleOptions;
  // Display
  "7SegmentLED": _7SegmentLEDOptions;
  "7SegmentLEDArray": _7SegmentLEDArrayOptions;
  "7SegmentLED_MAX7219": _7SegmentLED_MAX7219Options;
  "MatrixLED_MAX7219": MatrixLED_MAX7219Options;
  "MatrixLED_HT16K33": MatrixLED_HT16K33Options;
  "SainSmartTFT18LCD": SainSmartTFT18LCDOptions;
  "SharpMemoryTFT": SharpMemoryTFTOptions;
  "ST7735S": ST7735SOptions;
  // Camera
  "ArduCAMMini": ArduCAMMiniOptions;
  "JpegSerialCam": JpegSerialCamOptions;
  // Moving
  "DCMotor": DCMotorOptions;
  "PCA9685": PCA9685Options;
  "ServoMotor": ServoMotorOptions;
  "Solenoid": SolenoidOptions;
  "StepperMotor": StepperMotorOptions;
  // Sound
  "Speaker": SpeakerOptions;
  // Power
  "AXP192": AXP192Options;
  // GasSensor
  "MQ2": MQ2Options;
  "MQ3": MQ3Options;
  "MQ4": MQ4Options;
  "MQ5": MQ5Options;
  "MQ6": MQ6Options;
  "MQ7": MQ7Options;
  "MQ8": MQ8Options;
  "MQ9": MQ9Options;
  "MQ135": MQ135Options;
  // Logic
  "SNx4HC595": SNx4HC595Options;
  // Accessory
  "USB": USBOptions;
  // Wireless
  "RN42": RN42Options;
  "XBee": XBeeOptions;
  // Movement Sensor
  "Button": ButtonOptions;
  "AK8963": AK8963Options;
  "MPU6050": MPU6050Options;
  "MPU6886": MPU6886Options;
  "MPU9250": MPU9250Options;
  "SH200Q": SH200QOptions;
  // 'FlickHat': FlickHatOptions;
  "HC-SR505": HCSR505Options;
  "JoyStick": JoyStickOptions;
  "KXR94-2050": KXR94_2050Options;
  "IPM-165": IPM_165Options;
  // 'KXSC7-2050': KXSC7_2050Options;
  "PaPIRsVZ": PaPIRsVZOptions;
  "Potentiometer": PotentiometerOptions;
  // Memory
  // '24LC256': _24LC256Options;
  // GyroSensor
  "ENC03R_Module": ENC03R_ModuleOptions;
  // PressureSensor
  "FSR40X": FSR40XOptions;
  // Distance Sensor
  "HC-SR04": HCSR04Options;
  "GP2Y0A21YK0F": GP2Y0A21YK0FOptions;
  // GPS
  "GYSFDMAXB": GYSFDMAXBOptions;
  // MagnetSensor
  "CT10": CT10Options;
  "HMC5883L": HMC5883LOptions;
  // ADConverter
  "hx711": Hx711Options;
  // SoilSensor
  "SEN0114": SEN0114Options;
  // Temperature Sensor
  "LM35DZ": LM35DZOptions;
  "LM60": LM60Options;
  "LM61": LM61Options;
  "LMT87": LMT87Options;
  "MCP9700": MCP9700Options;
  "MCP9701": MCP9701Options;
  // 'S8100B': S8100BOptions;
  // 'S8120C': S8120COptions;
  // 'ADT7410': ADT7410Options;
  "AMG8833": AMG8833Options;
  "BME280": BME280Options;
  "D6T44L": D6T44LOptions;
  "DHT12": DHT12Options;
  // 'S5851A': S5851AOptions;
  "SHT31": SHT31Options;
  "SHT20": SHT20Options;
  "ADT7310": ADT7310Options;
  "AM2320": AM2320Options;
  // ColorSensor
  "PT550": PT550Options;
  "S11059": S11059Options;
  "YG1006": YG1006Options;
  // Grove
  "Grove_Button": Grove_ButtonOptions;
  "Grove_Buzzer": Grove_BuzzerOptions;
  "Grove_EarHeartRate": Grove_EarHeartRateOptions;
  "Grove_MP3": Grove_MP3Options;
  "Grove_GPS": Grove_GPSOptions;
  "Grove_3AxisAccelerometer": Grove_3AxisAccelerometerOptions;
  // Keyestudio
  "Keyestudio_Button": Keyestudio_ButtonOptions;
  "Keyestudio_MoistureSensor": Keyestudio_MoistureSensorOptions;
  "Keyestudio_Buzzer": Keyestudio_BuzzerOptions;
  "Keyestudio_TemperatureSensor": Keyestudio_TemperatureSensorOptions;
  "Keyestudio_PIR": Keyestudio_PIROptions;
  "Keyestudio_TrafficLight": Keyestudio_TrafficLightOptions;
  "Keyestudio_HT16K33": Keyestudio_HT16K33Options;
  // Ble
  "2JCIE": OMRON_2JCIEOptions;
  "Linking": LinkingOptions;
  // Bioligical
  "PULSE08_M5STICKC-S": Puls08M5stickcSOptions;

  "24LC256": _24LC256Options;
  "FlickHat": FlickHatOptions;
  "KXSC7_2050": KXSC7_2050Options;
  "S8100B": S8100BOptions;
  "S8120C": S8120COptions;
  "ADT7410": ADT7410Options;
  "S5851A": S5851AOptions;
  "DPS310": DPS310Options;
  "BMP280": BMP280Options;
  "M5StickC_YunHat": M5StickC_YunHatOptions;
}
