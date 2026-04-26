import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Drive a hobby servo by sending raw PWM pulses (1.0 ms - 2.0 ms at 50 Hz)
obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const pwm = obniz.getFreePwm();
  pwm.start({ io: 0 });
  pwm.freq(50);

  const angleToPulseMs = (angle: number) => 1.0 + (angle / 180) * 1.0;

  obniz.onloop = async () => {
    for (const angle of [0, 45, 90, 135, 180]) {
      pwm.pulse(angleToPulseMs(angle));
      console.log(`angle = ${angle}deg`);
      await sleep(800);
    }
  };
};
