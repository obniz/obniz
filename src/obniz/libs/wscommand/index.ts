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

const commandClasses = {
  WSCommandSystem,
  WSCommandDirective,
  WSCommandIO,
  WSCommandPWM,
  WSCommandUart,
  WSCommandAD,
  WSCommandSPI,
  WSCommandI2C,
  WSCommandLogicAnalyzer,
  WSCommandDisplay,
  WSCommandSwitch,
  WSCommandBle,
  WSCommandMeasurement,
  WSCommandTcp,
  WSCommandWiFi,
  WSCommandPlugin,
  WSCommandCANBus,
  WSCommandLocation,
  WSCommandMotion,
  WSCommandStorage,
};

type CommandClassMap = typeof commandClasses;

export type WsCommandModules = {
  [K in keyof CommandClassMap]: InstanceType<CommandClassMap[K]>;
};

export const createCommandManager = () => {
  const instance = new WSCommandManager<WsCommandModules>(commandClasses);
  return instance;
};

export const WSCommandManagerInstance = createCommandManager();
