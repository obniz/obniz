import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  // Streaming: callback fires whenever the analog value changes
  obniz.ad0!.start((voltage: number) => {
    console.log(`ad0 = ${voltage.toFixed(3)} V`);
  });

  // One-shot read example
  const v = await obniz.ad1!.getWait();
  console.log(`ad1 snapshot = ${v.toFixed(3)} V`);
};
