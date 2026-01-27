
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

  obniz.uart0!.start({ tx: 1, rx: 2, baud: 9600 });
  obniz.uart0!.onreceive = function (data: any, text: any) {
    console.log(`${obniz.id} 232 receive `);
    console.log(data);
  }
  obniz.wait(1); // if you are using loopback. you need draing first one byte.
  obniz.uart0!.send([0x1, 0x2, 0x3]);
  console.log("sent");
};