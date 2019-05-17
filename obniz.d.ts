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
// Logic
// Accessory
// Wireless
// Movement Sensor
// Distance Sensor
import { GP2Y0A21YK0F, GP2Y0A21YK0FOptions } from './parts/DistanceSensor/GP2Y0A21YK0F';
import { HCSR04, HCSR04Options } from './parts/DistanceSensor/HC-SR04';
// GPS
// Magnet
// ADConverter
// Soil Moisture Sensor
// Temperature Sensor
// Grove
// Ble

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
  // Logic
  // Accessory
  // Wireless
  // Movement Sensor
  // Distance Sensor
  wired(name: 'HCSR04', options: HCSR04Options): HCSR04;
  wired(name: 'GP2Y0A21YK0F', options: GP2Y0A21YK0FOptions): GP2Y0A21YK0F;
  // GPS
  // Magnet
  // ADConverter
  // Soil Moisture Sensor
  // Temperature Sensor
  // Grove
  // Ble
}

interface ObnizConstructor {
  new (id: string, options?: ObnizOptions): Obniz;
}
declare const Obniz: ObnizConstructor;

export = Obniz;
