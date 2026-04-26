import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  // Drive io0 as 5V push-pull output and turn it HIGH
  obniz.io0!.drive('5v');
  obniz.io0!.output(true);

  // Toggle io1 every second
  let value = false;
  setInterval(() => {
    value = !value;
    obniz.io1!.output(value);
    console.log(`io1 = ${value ? 'HIGH' : 'LOW'}`);
  }, 1000);
};
