
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
  obniz.components!.powerOnInterface(KiloInterface.CANBus_On);

  obniz.canbus0!.start({
    tx: 5,
    rx: 6,
    mode: 'normal',
    kbps: 500,
    filter_code: 0,
    filter_mask: 0
  });
  obniz.canbus0!.onreceive = async (isExtended: boolean, isRTR: boolean, id: number, data: number[]) => {
    console.log(obniz.id, isExtended, isRTR, id, data);
  }

  const ext_id = 0x01;
  // await obniz.wait(1000);
  obniz.canbus0!.send({
    extended: false,
    rtr: false,
    single_shot: false,
    self_reception: false
  }, ext_id, [0x01, 0x02]);
  console.log('can sent')
};