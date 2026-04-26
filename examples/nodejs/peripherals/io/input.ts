import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  // Enable internal pull-up so an open switch reads HIGH
  obniz.io0!.pull('5v');

  // Streaming: callback fires every time the input value changes
  obniz.io0!.input((value: boolean) => {
    console.log(`io0 changed to ${value ? 'HIGH' : 'LOW'}`);
  });

  // One-shot read example
  const snapshot = await obniz.io1!.inputWait();
  console.log(`io1 current value = ${snapshot ? 'HIGH' : 'LOW'}`);
};
