/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
import { MESH } from '../utils/abstracts/MESH';
import { GPIO } from '../MESH_js/block/GPIO';
export interface MESH_100GPOptions {
}
/**
 * data from MESH_100GP
 */
export interface MESH_100GP_Data {
    name: string;
    address: string;
}
/** MESH_100GP management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
    static readonly PartsName = "MESH_100GP";
    static readonly PREFIX = "MESH-100GP";
    static readonly AnalogInEventCondition: {
        readonly NOT_NOTIFY: 0;
        readonly ABOVE_THRESHOLD: 17;
        readonly BELOW_THRESHOLD: 34;
    };
    static readonly AnalogInputNotifyMode: {
        readonly STOP: 0;
        readonly ONCE: 1;
        readonly ALWAYS: 2;
    };
    static readonly Pin: {
        readonly P1: 0;
        readonly P2: 1;
        readonly P3: 2;
    };
    static readonly State: {
        readonly LOW_2_HIGH: 1;
        readonly HIGH_2_LOW: 2;
    };
    static readonly DigitalInputState: {
        UP_EDGE: 0;
        DOWN_EDGE: 1;
    };
    static readonly Vcc: {
        readonly AUTO: 0;
        readonly ON: 1;
        readonly OFF: 2;
    };
    static readonly VccState: {
        readonly OFF: 0;
        readonly ON: 1;
    };
    readonly DigitalPins: GPIO['DigitalPins'];
    onDigitalInputEvent: ((pin: number, state: number) => void) | null;
    onAnalogInputEvent: ((level: number) => void) | null;
    protected readonly staticClass: typeof MESH_100GP;
    private digitalInputLow2High_;
    private digitalInputHigh2Low_;
    private digitalOutput_;
    private pwmRatio_;
    private vcc_;
    private analogInputRangeUpper_;
    private analogInputRangeBottom_;
    private analogInputCondition_;
    private retDigitalInState_;
    private retPwm_;
    private retVccState_;
    private retLevel_;
    private retDigitalOutState_;
    /**
     * getDataWait
     *
     * @returns
     */
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    /**
     * getDigitalInputDataWait
     *
     * @param pin
     * @returns
     */
    getDigitalInputDataWait(pin: number): Promise<number>;
    /**
     * getAnalogInputDataWait
     *
     * @returns
     */
    getAnalogInputDataWait(): Promise<number>;
    /**
     * getVOutputDataWait
     *
     * @returns
     */
    getVOutputDataWait(): Promise<number>;
    /**
     * getDigitalOutputDataWait
     *
     * @param pin
     * @returns
     */
    getDigitalOutputDataWait(pin: number): Promise<number>;
    /**
     * getPwmDataWait
     *
     * @returns
     */
    getPwmDataWait(): Promise<number>;
    /**
     * setMode
     *
     * @param digitalInputLow2High {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInputHigh2Low {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOutput {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0-255
     * @param vcc Vcc.AUTO or Vcc.ON or Vcc.OFF
     * @param analogInputRangeUpper 0-255(0.00-3.00[V])
     * @param analogInputRangeBottom 0-255(0.00-3.00[V])
     * @param analogInputCondition AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
    setMode(digitalInputLow2High: MESH_100GP['DigitalPins'], digitalInputHigh2Low: MESH_100GP['DigitalPins'], digitalOutput: MESH_100GP['DigitalPins'], pwmRatio: number, vcc: number, analogInputRangeUpper: number, analogInputRangeBottom: number, analogInputCondition: number): void;
    /**
     * setModeDigitalInput
     *
     * @param digitalInputLow2High { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalInputHigh2Low { p1:boolean, p2:boolean, p3:boolean }
     */
    setModeDigitalInput(digitalInputLow2High: MESH_100GP['DigitalPins'], digitalInputHigh2Low: MESH_100GP['DigitalPins']): void;
    /**
     * setModeAnalogInput
     *
     * @param analogInputRangeUpper 0-255(0.00-3.00[V])
     * @param analogInputRangeBottom 0-255(0.00-3.00[V])
     * @param analogInputCondition AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
    setModeAnalogInput(analogInputRangeUpper: number, analogInputRangeBottom: number, analogInputCondition: number): void;
    /**
     * setDigitalOutput
     *
     * @param digitalOutput { p1:boolean, p2:boolean, p3:boolean }
     */
    setDigitalOutput(digitalOutput: MESH_100GP['DigitalPins']): void;
    /**
     * setPwmOutput
     *
     * @param pwmRatio 0-255
     */
    setPwmOutput(pwmRatio: number): void;
    /**
     * setVOutput
     *
     * @param vcc Vcc.AUTO or Vcc.ON or Vcc.OFF
     */
    setVOutput(vcc: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    protected getSensorDataWait(requestId: number, command: number[]): Promise<unknown>;
}
