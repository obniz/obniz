import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);
  // Wire an LED with anode on io0 and cathode on io1
  obniz.io1!.output(false);
};

obniz.onloop = async () => {
  obniz.io0!.output(true);
  await sleep(500);
  obniz.io0!.output(false);
  await sleep(500);
};
