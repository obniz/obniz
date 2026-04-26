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

  // Wire LED anode → io0, cathode → io1 (or use ground)
  obniz.io1!.output(false);

  const pwm = obniz.getFreePwm();
  pwm.start({ io: 0 });
  pwm.freq(1000);

  obniz.onloop = async () => {
    for (let duty = 0; duty <= 100; duty += 5) {
      pwm.duty(duty);
      await sleep(50);
    }
    for (let duty = 100; duty >= 0; duty -= 5) {
      pwm.duty(duty);
      await sleep(50);
    }
  };
};
