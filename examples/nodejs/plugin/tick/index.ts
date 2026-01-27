

import Obniz from "../../../../"

if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID);

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  // set current time to obnizOS
  obniz.setClock(); // or obniz.pingWait(). But ping will return pong. it is not neccesary for just setting time.
};

obniz.onloop = async () => {
  obniz.plugin!.execLua(`
    os.log("tick: "..os.getTick());
    os.log("unix: "..os.getUnixTime())
    `); // force log current time.
  await obniz.wait(1000);
};