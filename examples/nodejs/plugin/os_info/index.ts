
import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID);


console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  obniz.plugin!.execLua(`os.log(os.getVersion().."\\n")`);
  obniz.plugin!.execLua(`os.log(os.getHW().."\\n")`);
};