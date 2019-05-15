import { Display } from './obniz/libs/embeds/display';
// Light
import { LED, LEDOptions } from './parts/Light/LED';
import { FullColorLED, FullColorLEDOptions } from './parts/Light/FullColorLED';
import { WS2811, WS2811Options } from './parts/Light/WS2811';
import { WS2812, WS2812Options } from './parts/Light/WS2812';
import { WS2812B, WS2812BOptions } from './parts/Light/WS2812B';
// Moving
import { DCMotor, DCMotorOptions } from './parts/Moving/DCMotor';
import { PCA9685, PCA9685Options } from './parts/Moving/PCA9685';
import { ServoMotor, ServoMotorOptions } from './parts/Moving/ServoMotor';
import { Solenoid, SolenoidOptions } from './parts/Moving/Solenoid';
import { StepperMotor, StepperMotorOptions } from './parts/Moving/StepperMotor';

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

  constructor(id: string, options?: ObnizOptions);
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
  // Moving
  wired(name: 'DCMotor', options: DCMotorOptions): DCMotor;
  wired(name: 'PCA9685', options: PCA9685Options): PCA9685;
  wired(name: 'ServoMotor', options: ServoMotorOptions): ServoMotor;
  wired(name: 'Solenoid', options: SolenoidOptions): Solenoid;
  wired(name: 'StepperMotor', options: StepperMotorOptions): StepperMotor;
}

interface ObnizConstructor {
  new (id: string, options?: ObnizOptions): Obniz;
}
declare const Obniz: ObnizConstructor;

export = Obniz;
