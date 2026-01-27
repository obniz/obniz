
import Obniz, { KiloInterface } from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

/**
 * Read AD value from Qwiic signal port
 */

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  obniz.components!.prepare();

  obniz.components!.prepare(); // we can call it twice and more. nothing happen. spi bus will be taken only once.

  obniz.components!.powerOnInterface(KiloInterface.Relay_On); // => Relay is powered on
  obniz.components!.powerOnInterface(KiloInterface.RS232_On); // => RS232 is powered on and still Relay is powered ON!
  // obniz.components!.powerOffAllInterfaces(); // Everything shudding down
  return;

  obniz.components!.powerOnInterface(KiloInterface.CANBus_On | KiloInterface.RS485_On); // => Can and RS485 are powered on. No Relay. No RS232
  obniz.components!.setRelay(true); // => Relay is powered on. Ofcourse, it never change CANBus and RS485 status
  obniz.components!.setRelay(false); // => Relay is powered off. Ofcourse, it never change CANBus and RS485 status
};