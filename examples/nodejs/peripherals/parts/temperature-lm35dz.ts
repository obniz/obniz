import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const sensor = obniz.wired('LM35DZ', { gnd: 0, output: 1, vcc: 2 });

  setInterval(async () => {
    const temp = await sensor.getWait();
    console.log(`temperature = ${temp.toFixed(1)} C`);
    obniz.display!.clear();
    obniz.display!.print(`${temp.toFixed(1)} C`);
  }, 1000);
};
