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

  const servo = obniz.wired('ServoMotor', { gnd: 0, vcc: 1, signal: 2 });

  obniz.onloop = async () => {
    for (const angle of [0, 45, 90, 135, 180]) {
      servo.angle(angle);
      console.log(`angle = ${angle}deg`);
      await sleep(700);
    }
  };
};
