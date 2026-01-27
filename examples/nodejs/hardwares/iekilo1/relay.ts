
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
  obniz.components!.powerOnInterface(KiloInterface.Relay_On);
};

let state = false;

obniz.onloop = async () => {
  console.log(`relay set to ${state}`);
  obniz.components!.setRelay(state);
  state = !state;
  await obniz.wait(1000);
}