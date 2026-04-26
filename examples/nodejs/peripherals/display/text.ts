import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  obniz.display!.clear();
  obniz.display!.font('Avenir', 32);
  obniz.display!.print('Hello!');

  obniz.display!.font('Avenir', 14);
  obniz.display!.pos(0, 50);
  obniz.display!.print(`id: ${obniz.id}`);
};
