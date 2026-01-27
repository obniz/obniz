/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandManager } from './WSCommandManager';
import { WSCommandAD } from './WSCommandAD';
import { WSCommandBle } from './WSCommandBle';
import { WSCommandDirective } from './WSCommandDirective';
import { WSCommandDisplay } from './WSCommandDisplay';
import { WSCommandI2C } from './WSCommandI2C';
import { WSCommandIO } from './WSCommandIO';
import { WSCommandLogicAnalyzer } from './WSCommandLogicAnalyzer';
import { WSCommandMeasurement } from './WSCommandMeasurement';
import { WSCommandPlugin } from './WSCommandPlugin';
import { WSCommandPWM } from './WSCommandPWM';
import { WSCommandSPI } from './WSCommandSPI';
import { WSCommandSwitch } from './WSCommandSwitch';
import { WSCommandSystem } from './WSCommandSystem';
import { WSCommandTcp } from './WSCommandTcp';
import { WSCommandUart } from './WSCommandUart';
import { WSCommandWiFi } from './WSCommandWiFi';
import { WSCommandStorage } from './WSCommandStorage';
import { WSCommandMotion } from './WSCommandMotion';
import { WSCommandLocation } from './WSCommandLocation';
import { WSCommandCANBus } from './WSCommandCANBus';
declare const commandClasses: {
    WSCommandSystem: typeof WSCommandSystem;
    WSCommandDirective: typeof WSCommandDirective;
    WSCommandIO: typeof WSCommandIO;
    WSCommandPWM: typeof WSCommandPWM;
    WSCommandUart: typeof WSCommandUart;
    WSCommandAD: typeof WSCommandAD;
    WSCommandSPI: typeof WSCommandSPI;
    WSCommandI2C: typeof WSCommandI2C;
    WSCommandLogicAnalyzer: typeof WSCommandLogicAnalyzer;
    WSCommandDisplay: typeof WSCommandDisplay;
    WSCommandSwitch: typeof WSCommandSwitch;
    WSCommandBle: typeof WSCommandBle;
    WSCommandMeasurement: typeof WSCommandMeasurement;
    WSCommandTcp: typeof WSCommandTcp;
    WSCommandWiFi: typeof WSCommandWiFi;
    WSCommandPlugin: typeof WSCommandPlugin;
    WSCommandCANBus: typeof WSCommandCANBus;
    WSCommandLocation: typeof WSCommandLocation;
    WSCommandMotion: typeof WSCommandMotion;
    WSCommandStorage: typeof WSCommandStorage;
};
declare type CommandClassMap = typeof commandClasses;
export declare type WsCommandModules = {
    [K in keyof CommandClassMap]: InstanceType<CommandClassMap[K]>;
};
export declare const createCommandManager: () => WSCommandManager<WsCommandModules>;
export declare const WSCommandManagerInstance: WSCommandManager<WsCommandModules>;
export {};
