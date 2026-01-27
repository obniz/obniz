
import Obniz, { KiloInterface } from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  obniz.debugprint = true;
}

obniz.onloop = async () => {
  const temp = await obniz.motion!.getTemperatureWait();
  console.log(`Temp: ${temp} degree`);

  const acc = await obniz.motion!.getAccelerationWait();
  console.log(`Acc.R: ${acc.r}\nAcc.T: ${acc.t}\nAcc.P: ${acc.p}`);

  const recognition = await obniz.motion!.getRecognitionWait();
  console.log(`Motion ${recognition.motion} (${recognition.possibility})`);
}