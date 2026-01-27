
import Obniz from "../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { access_token: process.env.ACCESS_TOKEN });

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  console.log(`boot_reason=${obniz.boot_reason}`);
};