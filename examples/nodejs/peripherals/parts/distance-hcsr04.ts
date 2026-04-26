import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const hcsr04 = obniz.wired('HC-SR04', { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
  hcsr04.unit('mm');

  setInterval(() => {
    hcsr04.measure((distance: number) => {
      console.log(`distance = ${distance.toFixed(1)} mm`);
      obniz.display!.clear();
      obniz.display!.print(`${distance.toFixed(0)} mm`);
    });
  }, 500);
};
