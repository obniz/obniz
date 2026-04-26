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
  display.clear();

  // Border
  display.rect(0, 0, display.width, display.height);

  // Diagonal
  display.line(0, 0, display.width, display.height);

  // Filled circle in the centre
  display.circle(display.width / 2, display.height / 2, 12, true);

  // QR code linking somewhere
  display.qr('https://obniz.com/');
};
