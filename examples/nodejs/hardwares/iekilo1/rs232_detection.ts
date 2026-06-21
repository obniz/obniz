
import Obniz, { KiloInterface } from "../../../../dist/src/obniz";
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

/**
 * Recognize RS232 target connection and disconnection.
 */

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  obniz.components!.prepare();
  obniz.components!.powerOnInterface(KiloInterface.RS232_On);

  obniz.uart0!.start({
    tx: 3,
    rx: 4,
    baud: 9600
  });
};

let previousConnected = false;

obniz.onloop = async () => {
  const connected = await obniz.components!.isRS232HavingTargetWait();
  if (connected && !previousConnected) {
    console.log(`RS232 target connected`);
  } else if (!connected && previousConnected) {
    console.log(`RS232 target disconnected`);
  }
  previousConnected = connected;
}