
import Obniz, { KiloInterface } from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  obniz.motion!.onTemperatureUpdate = ((temp: any) => {
    console.log(`Temp: ${temp} degree`);
  });
  obniz.motion!.start(0.99, 0, 0);
}