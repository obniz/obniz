
import Obniz, { KiloInterface } from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

/**
 * Read AD value from Qwiic signal port
 */

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id} ${obniz.hw}`)

  obniz.components!.prepare();
  obniz.components!.powerOnInterface(KiloInterface.RS485_On);

  obniz.uart0!.start({ tx: 4, rx: 3, baud: 9600 });
  obniz.uart0!.onreceive = function (data: any, text: any) {
    console.log(`${obniz.id} 485 receive `);
    console.log(data);
  }
  obniz.wait(1); // if you are using loopback. you need draing first one byte.
  obniz.uart0!.setDE(7);
  obniz.uart0!.send([0x01, 0x02, 0x03]);
  console.log("sent");
};