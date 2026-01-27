
import Obniz, { KiloInterface } from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)


  obniz.location!.start();

  obniz.location!.onupdate = ((data: any) => {
    console.log(data);
  });
}