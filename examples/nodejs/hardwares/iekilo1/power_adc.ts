
import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

/**
 * Read AD value from Qwiic signal port
 */

obniz.onconnect = async () => {

  obniz.components!.prepare();

  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  // onece
  console.log(`Power supply voltage = ${await obniz.components!.getPowerSupplyVoltageWait()} v`);

  // continue
  obniz.components!.startMonitoringPowerSupply((voltage: number) => {
    console.log("Power supply voltage changed to " + voltage + " v")
  });
};