
import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

/**
 * Read AD value from Qwiic signal port
 */

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  // Blue Qwiic connector
  obniz.ad1!.start(function (voltage) {
    console.log("ad1 changed to " + voltage + " v")
  });

  // Yellow Qwiic connector
  obniz.ad2!.start(function (voltage) {
    console.log("ad2 changed to " + voltage + " v")
  });
};