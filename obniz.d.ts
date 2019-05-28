import { Display } from './obniz/libs/embeds/display';
// Light
import { LED, LEDOptions } from './parts/Light/LED';
import { FullColorLED, FullColorLEDOptions } from './parts/Light/FullColorLED';
import { WS2811, WS2811Options } from './parts/Light/WS2811';
import { WS2812, WS2812Options } from './parts/Light/WS2812';
import { WS2812B, WS2812BOptions } from './parts/Light/WS2812B';
// Infrared
import { InfraredLED, InfraredLEDOptions } from './parts/Infrared/InfraredLED';
import { IRModule, IRModuleOptions } from './parts/Infrared/IRModule';
import { IRSensor, IRSensorOptions } from './parts/Infrared/IRSensor';
// Display
import { _7SegmentLED, _7SegmentLEDOptions } from './parts/Display/7SegmentLED';
import { _7SegmentLEDArray, _7SegmentLEDArrayOptions } from './parts/Display/7SegmentLEDArray';
import { _7SegmentLED_MAX7219, _7SegmentLED_MAX7219Options } from './parts/Display/7SegmentLED_MAX7219';
import { MatrixLED_MAX7219, MatrixLED_MAX7219Options } from './parts/Display/MatrixLED_MAX7219';
import { SainSmartTFT18LCD, SainSmartTFT18LCDOptions } from './parts/Display/SainSmartTFT18LCD';
import { SharpMemoryTFT, SharpMemoryTFTOptions } from './parts/Display/SharpMemoryTFT';
// Camera
import { ArduCAMMini, ArduCAMMiniOptions } from './parts/Camera/ArduCAMMini';
import { JpegSerialCam, JpegSerialCamOptions } from './parts/Camera/JpegSerialCam';
// Moving
import { DCMotor, DCMotorOptions } from './parts/Moving/DCMotor';
import { PCA9685, PCA9685Options } from './parts/Moving/PCA9685';
import { ServoMotor, ServoMotorOptions } from './parts/Moving/ServoMotor';
import { Solenoid, SolenoidOptions } from './parts/Moving/Solenoid';
import { StepperMotor, StepperMotorOptions } from './parts/Moving/StepperMotor';
// Sound
import { Speaker, SpeakerOptions } from './parts/Sound/Speaker';
// GasSensor
import { MQ2, MQ2Options } from './parts/GasSensor/MQ2';
import { MQ3, MQ3Options } from './parts/GasSensor/MQ3';
import { MQ4, MQ4Options } from './parts/GasSensor/MQ4';
import { MQ5, MQ5Options } from './parts/GasSensor/MQ5';
import { MQ6, MQ6Options } from './parts/GasSensor/MQ6';
import { MQ7, MQ7Options } from './parts/GasSensor/MQ7';
import { MQ8, MQ8Options } from './parts/GasSensor/MQ8';
import { MQ9, MQ9Options } from './parts/GasSensor/MQ9';
import { MQ135, MQ135Options } from './parts/GasSensor/MQ135';
// Logic
import { SNx4HC595, SNx4HC595Options } from './parts/Logic/SNx4HC595';
// Accessory
import { USB, USBOptions } from './parts/Accessory/USB';
// Wireless
import { RN42, RN42Options } from './parts/Wireless/RN42';
import { XBee, XBeeOptions } from './parts/Wireless/XBee';
// Movement Sensor
import { Button, ButtonOptions } from './parts/MovementSensor/Button';
import { FlickHat, FlickHatOptions } from './parts/MovementSensor/FlickHat';
import { HCSR505, HCSR505Options } from './parts/MovementSensor/HC-SR505';
import { JoyStick, JoyStickOptions } from './parts/MovementSensor/JoyStick';
import { KXR94_2050, KXR94_2050Options } from './parts/MovementSensor/KXR94-2050';
import { KXSC7_2050, KXSC7_2050Options } from './parts/MovementSensor/KXSC7-2050';
import { PaPIRsVZ, PaPIRsVZOptions } from './parts/MovementSensor/PaPIRsVZ';
import { Potentiometer, PotentiometerOptions } from './parts/MovementSensor/Potentiometer';
// Memory
import { _24LC256, _24LC256Options } from './parts/Memory/24LC256';
// GyroSensor
import { ENC03R_Module, ENC03R_ModuleOptions } from './parts/GyroSensor/ENC03R_Module';
// PressureSensor
import { FSR40X, FSR40XOptions } from './parts/PressureSensor/FSR-40X';
// Distance Sensor
import { GP2Y0A21YK0F, GP2Y0A21YK0FOptions } from './parts/DistanceSensor/GP2Y0A21YK0F';
import { HCSR04, HCSR04Options } from './parts/DistanceSensor/HC-SR04';
// GPS
import { GYSFDMAXB, GYSFDMAXBOptions } from './parts/GPS/GYSFDMAXB';
// CompassSensor
import { HMC5883L, HMC5883LOptions } from './parts/CompassSensor/HMC5883L';
// ADConverter
import { HX711, HX711Options } from './parts/ADConverter/hx711';
// SoilSensor
import { SEN0114, SEN0114Options } from './parts/SoilSensor/SEN0114';
// Temperature Sensor
import { LM35DZ, LM35DZOptions } from './parts/TemperatureSensor/analog/LM35DZ';
import { LM60, LM60Options } from './parts/TemperatureSensor/analog/LM60';
import { LM61, LM61Options } from './parts/TemperatureSensor/analog/LM61';
import { LMT87, LMT87Options } from './parts/TemperatureSensor/analog/LMT87';
import { MCP9700, MCP9700Options } from './parts/TemperatureSensor/analog/MCP9700';
import { MCP9701, MCP9701Options } from './parts/TemperatureSensor/analog/MCP9701';
import { S8100B, S8100BOptions } from './parts/TemperatureSensor/analog/S8100B';
import { S8120C, S8120COptions } from './parts/TemperatureSensor/analog/S8120C';
import { ADT7410, ADT7410Options } from './parts/TemperatureSensor/i2c/ADT7410';
import { AMG8833, AMG8833Options } from './parts/TemperatureSensor/i2c/AMG8833';
import { BME280, BME280Options } from './parts/TemperatureSensor/i2c/BME280';
import { D6T44L, D6T44LOptions } from './parts/TemperatureSensor/i2c/D6T44L';
import { S5851A, S5851AOptions } from './parts/TemperatureSensor/i2c/S-5851A';
import { SHT31, SHT31Options } from './parts/TemperatureSensor/i2c/SHT31';
import { ADT7310, ADT7310Options } from './parts/TemperatureSensor/spi/ADT7310';
// ColorSensor
import { S11059, S11059Options } from './parts/ColorSensor/S11059';
// Grove
import { Grove_EarHeartRate, Grove_EarHeartRateOptions } from './parts/Grove/Grove_EarHeartRate';
import { Grove_MP3, Grove_MP3Options } from './parts/Grove/Grove_MP3';
// Ble
import { OMRON_2JCIE, OMRON_2JCIEOptions } from './parts/Ble/2jcie';

interface WiredNameMap {
  // Light
  'LED': LED;
  'FullColorLED': FullColorLED;
  'WS2811': WS2811;
  'WS2812': WS2812;
  'WS2812B': WS2812B;
  // Infrared
  'InfraredLED': InfraredLED;
  'IRSensor': IRSensor;
  'IRModule': IRModule;
  // Display
  '7SegmentLED': _7SegmentLED;
  '7SegmentLEDArray': _7SegmentLEDArray;
  '7SegmentLED_MAX7219': _7SegmentLED_MAX7219;
  'MatrixLED_MAX7219': MatrixLED_MAX7219;
  'SainSmartTFT18LCD': SainSmartTFT18LCD;
  'SharpMemoryTFT': SharpMemoryTFT;
  // Camera
  'ArduCAMMini': ArduCAMMini;
  'JpegSerialCam': JpegSerialCam;
  // Moving
  'DCMotor': DCMotor;
  'PCA9685': PCA9685;
  'ServoMotor': ServoMotor;
  'Solenoid': Solenoid;
  'StepperMotor': StepperMotor;
  // Sound
  'Speaker': Speaker;
  // GasSensor
  'MQ2': MQ2;
  'MQ3': MQ3;
  'MQ4': MQ4;
  'MQ5': MQ5;
  'MQ6': MQ6;
  'MQ7': MQ7;
  'MQ8': MQ8;
  'MQ9': MQ9;
  'MQ135': MQ135;
  // Logic
  'SNx4HC595': SNx4HC595;
  // Accessory
  'USB': USB;
  // Wireless
  'RN42': RN42;
  'XBee': XBee;
  // Movement Sensor
  'Button': Button;
  // 'FlickHat': FlickHat;
  'HC-SR505': HCSR505;
  'JoyStick': JoyStick;
  'KXR94-2050': KXR94_2050;
  // 'KXSC7-2050': KXSC7_2050;
  'PaPIRsVZ': PaPIRsVZ;
  'Potentiometer': Potentiometer;
  // Memory
  // '24LC256': _24LC256;
  // GyroSensor
  'ENC03R_Module': ENC03R_Module;
  // PressureSensor
  'FSR40X': FSR40X;
  // Distance Sensor
  'HC-SR04': HCSR04;
  'GP2Y0A21YK0F': GP2Y0A21YK0F;
  // GPS
  'GYSFDMAXB': GYSFDMAXB;
  // CompassSensor
  'HMC5883L': HMC5883L;
  // ADConverter
  'hx711': HX711;
  // SoilSensor
  'SEN0114': SEN0114;
  // Temperature Sensor
  'LM35DZ': LM35DZ;
  'LM60': LM60;
  'LM61': LM61;
  'LMT87': LMT87;
  'MCP9700': MCP9700;
  'MCP9701': MCP9701;
  // 'S8100B': S8100B;
  // 'S8120C': S8120C;
  // 'ADT7410': ADT7410;
  'AMG8833': AMG8833;
  'BME280': BME280;
  'D6T44L': D6T44L;
  // 'S5851A': S5851A;
  'SHT31': SHT31;
  'ADT7310': ADT7310;
  // ColorSensor
  'S11059': S11059;
  // Grove
  'Grove_EarHeartRate': Grove_EarHeartRate;
  'Grove_MP3': Grove_MP3;
  // Ble
  '2JCIE': OMRON_2JCIE;
}

// TODO: この二重管理をなんとかしたい
interface WiredNameOptionsMap {
  // Light
  'LED': LEDOptions;
  'FullColorLED': FullColorLEDOptions;
  'WS2811': WS2811Options;
  'WS2812': WS2812Options;
  'WS2812B': WS2812BOptions;
  // Infrared
  'InfraredLED': InfraredLEDOptions;
  'IRSensor': IRSensorOptions;
  'IRModule': IRModuleOptions;
  // Display
  '7SegmentLED': _7SegmentLEDOptions;
  '7SegmentLEDArray': _7SegmentLEDArrayOptions;
  '7SegmentLED_MAX7219': _7SegmentLED_MAX7219Options;
  'MatrixLED_MAX7219': MatrixLED_MAX7219Options;
  'SainSmartTFT18LCD': SainSmartTFT18LCDOptions;
  'SharpMemoryTFT': SharpMemoryTFTOptions;
  // Camera
  'ArduCAMMini': ArduCAMMiniOptions;
  'JpegSerialCam': JpegSerialCamOptions;
  // Moving
  'DCMotor': DCMotorOptions;
  'PCA9685': PCA9685Options;
  'ServoMotor': ServoMotorOptions;
  'Solenoid': SolenoidOptions;
  'StepperMotor': StepperMotorOptions;
  // Sound
  'Speaker': SpeakerOptions;
  // GasSensor
  'MQ2': MQ2Options;
  'MQ3': MQ3Options;
  'MQ4': MQ4Options;
  'MQ5': MQ5Options;
  'MQ6': MQ6Options;
  'MQ7': MQ7Options;
  'MQ8': MQ8Options;
  'MQ9': MQ9Options;
  'MQ135': MQ135Options;
  // Logic
  'SNx4HC595': SNx4HC595Options;
  // Accessory
  'USB': USBOptions;
  // Wireless
  'RN42': RN42Options;
  'XBee': XBeeOptions;
  // Movement Sensor
  'Button': ButtonOptions;
  // 'FlickHat': FlickHatOptions;
  'HC-SR505': HCSR505Options;
  'JoyStick': JoyStickOptions;
  'KXR94-2050': KXR94_2050Options;
  // 'KXSC7-2050': KXSC7_2050Options;
  'PaPIRsVZ': PaPIRsVZOptions;
  'Potentiometer': PotentiometerOptions;
  // Memory
  // '24LC256': _24LC256Options;
  // GyroSensor
  'ENC03R_Module': ENC03R_ModuleOptions;
  // PressureSensor
  'FSR40X': FSR40XOptions;
  // Distance Sensor
  'HC-SR04': HCSR04Options;
  'GP2Y0A21YK0F': GP2Y0A21YK0FOptions;
  // GPS
  'GYSFDMAXB': GYSFDMAXBOptions;
  // CompassSensor
  'HMC5883L': HMC5883LOptions;
  // ADConverter
  'hx711': HX711Options;
  // SoilSensor
  'SEN0114': SEN0114Options;
  // Temperature Sensor
  'LM35DZ': LM35DZOptions;
  'LM60': LM60Options;
  'LM61': LM61Options;
  'LMT87': LMT87Options;
  'MCP9700': MCP9700Options;
  'MCP9701': MCP9701Options;
  // 'S8100B': S8100BOptions;
  // 'S8120C': S8120COptions;
  // 'ADT7410': ADT7410Options;
  'AMG8833': AMG8833Options;
  'BME280': BME280Options;
  'D6T44L': D6T44LOptions;
  // 'S5851A': S5851AOptions;
  'SHT31': SHT31Options;
  'ADT7310': ADT7310Options;
  // ColorSensor
  'S11059': S11059Options;
  // Grove
  'Grove_EarHeartRate': Grove_EarHeartRateOptions;
  'Grove_MP3': Grove_MP3Options;
  // Ble
  '2JCIE': OMRON_2JCIEOptions;
}

interface ObnizOptions {
  binary?: boolean;
  local_connect?: boolean;
  debug_dom_id?: string;
  auto_connect?: boolean;
  access_token?: string;
  reset_obniz_on_ws_disconnection?: boolean;
}

interface ConnectOptions {
  timeout: number;
}

type ConnectionState = 'closed' | 'connecting' | 'connected' | 'closing';
interface Obniz {
  onconnect: () => Promise<void>;
  onclose: () => Promise<void>;
  connectionState: ConnectionState;
  debugprint: boolean;
  display: Display;

  connect(): void;
  connectWait(options?: ConnectOptions): Promise<boolean>;
  close(): void;
  resetOnDisconnect(reset: boolean): void;

  // Light
  wired(name: 'LED', options: LEDOptions): LED;
  wired(name: 'FullColorLED', options: FullColorLEDOptions): FullColorLED;
  wired(name: 'WS2811', options: WS2811Options): WS2811;
  wired(name: 'WS2812', options: WS2812Options): WS2812;
  wired(name: 'WS2812B', options: WS2812BOptions): WS2812B;
  // Infrared
  wired(name: 'InfraredLED', options: InfraredLEDOptions): InfraredLED;
  wired(name: 'IRSensor', options: IRSensorOptions): IRSensor;
  wired(name: 'IRModule', options: IRModuleOptions): IRModule;
  // Display
  wired(name: '7SegmentLED', options: _7SegmentLEDOptions): _7SegmentLED;
  wired(name: '7SegmentLEDArray', options: _7SegmentLEDArrayOptions): _7SegmentLEDArray;
  wired(name: '7SegmentLED_MAX7219', options: _7SegmentLED_MAX7219Options): _7SegmentLED_MAX7219;
  wired(name: 'MatrixLED_MAX7219', options: MatrixLED_MAX7219Options): MatrixLED_MAX7219;
  wired(name: 'SainSmartTFT18LCD', options: SainSmartTFT18LCDOptions): SainSmartTFT18LCD;
  wired(name: 'SharpMemoryTFT', options: SharpMemoryTFTOptions): SharpMemoryTFT;
  // Camera
  wired(name: 'ArduCAMMini', options: ArduCAMMiniOptions): ArduCAMMini;
  wired(name: 'JpegSerialCam', options: JpegSerialCamOptions): JpegSerialCam;
  // Moving
  wired(name: 'DCMotor', options: DCMotorOptions): DCMotor;
  wired(name: 'PCA9685', options: PCA9685Options): PCA9685;
  wired(name: 'ServoMotor', options: ServoMotorOptions): ServoMotor;
  wired(name: 'Solenoid', options: SolenoidOptions): Solenoid;
  wired(name: 'StepperMotor', options: StepperMotorOptions): StepperMotor;
  // Sound
  wired(name: 'Speaker', options: SpeakerOptions): Speaker;
  // GasSensor
  wired(name: 'MQ2', options: MQ2Options): MQ2;
  wired(name: 'MQ3', options: MQ3Options): MQ3;
  wired(name: 'MQ4', options: MQ4Options): MQ4;
  wired(name: 'MQ5', options: MQ5Options): MQ5;
  wired(name: 'MQ6', options: MQ6Options): MQ6;
  wired(name: 'MQ7', options: MQ7Options): MQ7;
  wired(name: 'MQ8', options: MQ8Options): MQ8;
  wired(name: 'MQ9', options: MQ9Options): MQ9;
  wired(name: 'MQ135', options: MQ135Options): MQ135;
  // Logic
  wired(name: 'SNx4HC595', options: SNx4HC595Options): SNx4HC595;
  // Accessory
  wired(name: 'USB', options: USBOptions): USB;
  // Wireless
  wired(name: 'RN42', options: RN42Options): RN42;
  wired(name: 'XBee', options: XBeeOptions): XBee;
  // Movement Sensor
  wired(name: 'Button', options: ButtonOptions): Button;
  // wired(name: 'FlickHat', options: FlickHatOptions): FlickHat;
  wired(name: 'HC-SR505', options: HCSR505Options): HCSR505;
  wired(name: 'JoyStick', options: JoyStickOptions): JoyStick;
  wired(name: 'KXR94-2050', options: KXR94_2050Options): KXR94_2050;
  // wired(name: 'KXSC7-2050', options: KXSC7_2050Options): KXSC7_2050;
  wired(name: 'PaPIRsVZ', options: PaPIRsVZOptions): PaPIRsVZ;
  wired(name: 'Potentiometer', options: PotentiometerOptions): Potentiometer;
  // Memory
  // wired(name: '24LC256', options: _24LC256Options): _24LC256;
  // GyroSensor
  wired(name: 'ENC03R_Module', options: ENC03R_ModuleOptions): ENC03R_Module;
  // PressureSensor
  wired(name: 'FSR40X', options: FSR40XOptions): FSR40X;
  // Distance Sensor
  wired(name: 'HC-SR04', options: HCSR04Options): HCSR04;
  wired(name: 'GP2Y0A21YK0F', options: GP2Y0A21YK0FOptions): GP2Y0A21YK0F;
  // GPS
  wired(name: 'GYSFDMAXB', options: GYSFDMAXBOptions): GYSFDMAXB;
  // CompassSensor
  wired(name: 'HMC5883L', options: HMC5883LOptions): HMC5883L;
  // ADConverter
  wired(name: 'hx711', options: HX711Options): HX711;
  // SoilSensor
  wired(name: 'SEN0114', options: SEN0114Options): SEN0114;
  // Temperature Sensor
  wired(name: 'LM35DZ', options: LM35DZOptions): LM35DZ;
  wired(name: 'LM60', options: LM60Options): LM60;
  wired(name: 'LM61', options: LM61Options): LM61;
  wired(name: 'LMT87', options: LMT87Options): LMT87;
  wired(name: 'MCP9700', options: MCP9700Options): MCP9700;
  wired(name: 'MCP9701', options: MCP9701Options): MCP9701;
  // wired(name: 'S8100B', options: S8100BOptions): S8100B;
  // wired(name: 'S8120C', options: S8120COptions): S8120C;
  // wired(name: 'ADT7410', options: ADT7410Options): ADT7410;
  wired(name: 'AMG8833', options: AMG8833Options): AMG8833;
  wired(name: 'BME280', options: BME280Options): BME280;
  wired(name: 'D6T44L', options: D6T44LOptions): D6T44L;
  // wired(name: 'S5851A', options: S5851AOptions): S5851A;
  wired(name: 'SHT31', options: SHT31Options): SHT31;
  // wired(name: 'ADT7310', options: ADT7310Options): ADT7310;
  // ColorSensor
  wired(name: 'S11059', options: S11059Options): S11059;
  // Grove
  wired(name: 'Grove_EarHeartRate', options: Grove_EarHeartRateOptions): Grove_EarHeartRate;
  wired(name: 'Grove_MP3', options: Grove_MP3Options): Grove_MP3;
  // Ble
  wired(name: '2JCIE'): OMRON_2JCIE;
}

interface ObnizConstructor {
  new (id: string, options?: ObnizOptions): Obniz;
}
declare const Obniz: ObnizConstructor;

export = Obniz;
