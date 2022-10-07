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
import { WSCommandSubnet } from './WSCommandSubnet';

export const createCommandManager = () => {
  const instance = new WSCommandManager();

  /* eslint-disable */
  instance.addCommandClass("WSCommandSystem", WSCommandSystem);
  instance.addCommandClass("WSCommandDirective", WSCommandDirective);
  instance.addCommandClass("WSCommandIO", WSCommandIO);
  instance.addCommandClass("WSCommandPWM", WSCommandPWM);
  instance.addCommandClass("WSCommandUart", WSCommandUart);
  instance.addCommandClass("WSCommandAD", WSCommandAD);
  instance.addCommandClass("WSCommandSPI", WSCommandSPI);
  instance.addCommandClass("WSCommandI2C", WSCommandI2C);
  instance.addCommandClass("WSCommandLogicAnalyzer", WSCommandLogicAnalyzer);
  instance.addCommandClass("WSCommandDisplay", WSCommandDisplay);
  instance.addCommandClass("WSCommandSwitch", WSCommandSwitch);
  instance.addCommandClass("WSCommandBle", WSCommandBle);
  instance.addCommandClass("WSCommandMeasurement", WSCommandMeasurement);
  instance.addCommandClass("WSCommandTcp", WSCommandTcp);
  instance.addCommandClass("WSCommandWiFi", WSCommandWiFi);
  instance.addCommandClass("WSCommandPlugin", WSCommandPlugin);

  return instance;
};

export const WSCommandManagerInstance = createCommandManager();
