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

export const WSCommandManagerInstance = new WSCommandManager();

/* eslint-disable */
WSCommandManagerInstance.addCommandClass("WSCommandSystem", WSCommandSystem);
WSCommandManagerInstance.addCommandClass(
  "WSCommandDirective",
  WSCommandDirective
);
WSCommandManagerInstance.addCommandClass("WSCommandIO", WSCommandIO);
WSCommandManagerInstance.addCommandClass("WSCommandPWM", WSCommandPWM);
WSCommandManagerInstance.addCommandClass("WSCommandUart", WSCommandUart);
WSCommandManagerInstance.addCommandClass("WSCommandAD", WSCommandAD);
WSCommandManagerInstance.addCommandClass("WSCommandSPI", WSCommandSPI);
WSCommandManagerInstance.addCommandClass("WSCommandI2C", WSCommandI2C);
WSCommandManagerInstance.addCommandClass(
  "WSCommandLogicAnalyzer",
  WSCommandLogicAnalyzer
);
WSCommandManagerInstance.addCommandClass("WSCommandDisplay", WSCommandDisplay);
WSCommandManagerInstance.addCommandClass("WSCommandSwitch", WSCommandSwitch);
WSCommandManagerInstance.addCommandClass("WSCommandBle", WSCommandBle);
WSCommandManagerInstance.addCommandClass(
  "WSCommandMeasurement",
  WSCommandMeasurement
);
WSCommandManagerInstance.addCommandClass("WSCommandTcp", WSCommandTcp);
WSCommandManagerInstance.addCommandClass("WSCommandWiFi", WSCommandWiFi);
WSCommandManagerInstance.addCommandClass("WSCommandPlugin", WSCommandPlugin);
WSCommandManagerInstance.addCommandClass("WSCommandStorage", WSCommandStorage);
WSCommandManagerInstance.addCommandClass("WSCommandSubnet", WSCommandSubnet);