
import Obniz, { KiloInterface } from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  obniz.motion!.onAccelerationUpdate = ((r: any, t: any, p: any) => {
    console.log(`R: ${r}\nTheta: ${t}\nPhi: ${p}`);
  });
  obniz.motion!.start(0, 0.97, 0);
}