
import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });


console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  obniz.plugin!.execLua(`
      x=1;
      x=x+2;
      os.log(x.."\\n")
  `); // will print "3" on obnizOS console(need console enabled)

  obniz.plugin!.execLua(`os.log(os.getTick().."\\n")`);
  obniz.plugin!.execLua(`os.log(os.getTick().."\\n")`);
};