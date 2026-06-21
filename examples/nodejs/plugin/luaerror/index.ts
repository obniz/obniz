
import Obniz from "../../../../dist/src/obniz"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  obniz.plugin!.onError = (error) => {
    console.log(`error occurred: ${error.message}`);
  }

  obniz.plugin!.execLua(`MUST FAILED`)
};