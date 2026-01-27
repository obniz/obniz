/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */
import { MCP23S08 } from '../embeds/mcp23s08';
import { ObnizDevice } from '../../ObnizDevice';
export declare enum KiloInterface {
    None = 0,
    Relay_On = 1,
    RS232_On = 2,
    RS485_On = 4,
    CANBus_On = 8
}
export declare class IntelligentEdgeKiloComponent {
    protected obniz: ObnizDevice;
    mcp23s08: MCP23S08;
    protected isDirectionFlashed: boolean;
    RS232_TX: number;
    RS232_RX: number;
    RS485_TX: number;
    RS485_RX: number;
    RS485_DE: number;
    CANBUS_TX: number;
    CANBUS_RX: number;
    constructor(obniz: ObnizDevice);
    prepare(): void;
    /**
     * Powering on Each Interface.
     * RS232, RS485, CANBus, Relay. But RS232 and RS485 cannot be enabled at the same time.
     *
     * @param mode Powring on each interface.
     */
    powerOnInterface(mode: KiloInterface): void;
    /**
     * Powering off all interfaces.
     */
    powerOffAllInterfaces(): void;
    /**
     * Check RS232 is having 232 leve linput.
     * Attention! This function never works with FORCE ON. this is standard situation.
     *
     * @returns true: RS232 is having rs232 leve signal. false: RS232 is not having target wait.
     */
    isRS232HavingTargetWait(): Promise<boolean>;
    /**
     * Conversion method from ad0 voltage to input supply voltage.
     *
     * @param inputVoltage ad0 voltage.
     * @returns Input Supply Voltage.
     */
    protected inputVoltageToVoltage(inputVoltage: number): number;
    /**
     * Step is 8.12mV(12bit)
     * voltage. measurable range is 0 to 33.3v.
     */
    startMonitoringPowerSupply(callbaack: (voltage: number) => void): void;
    /**
     * Step is 8.12mV(12bit)
     *
     * @returns voltage. measurable range is 0 to 33.3v.
     */
    getPowerSupplyVoltageWait(): Promise<number>;
    /**
     * Setting relay state.
     *
     * @param state true for on.
     */
    setRelay(state: boolean): void;
}
