import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

// Generic SPI master full-duplex transfer.
// writeWait sends the bytes you provide and returns the same number of bytes
// shifted in from MISO.
obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const spi = obniz.getFreeSpi();
  spi.start({
    mode: 'master',
    clk: 0,
    mosi: 1,
    miso: 2,
    frequency: 1_000_000,
  });

  const received = await spi.writeWait([0x9f, 0x00, 0x00, 0x00]);
  console.log('rx:', received.map((b) => b.toString(16).padStart(2, '0')).join(' '));
};
