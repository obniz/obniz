import LED, { LEDOptions } from "../parts/Light/LED/index";
import DCMotor, { DCMotorOptions } from "../parts/Moving/DCMotor";
export interface WiredNameMap {
    "LED": LED;
    "DCMotor": DCMotor;
}
export interface WiredNameOptionsMap {
    "LED": LEDOptions;
    "DCMotor": DCMotorOptions;
}
