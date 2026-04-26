import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const display = obniz.display!;
  const sw = obniz.switch!;

  display.clear();
  display.print('Press the switch');

  // States: "none" | "push" | "left" | "right"
  sw.onchange = (state) => {
    console.log(`switch state: ${state}`);
    display.clear();
    display.print(`switch: ${state}`);
  };

  // Or wait once for the next push
  await sw.stateWait('push');
  console.log('the switch was pushed at least once');
};
