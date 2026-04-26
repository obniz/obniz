import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

// Probe each 7-bit I2C address by attempting a 1-byte read.
// Devices that ACK respond; everything else throws / errors.
obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const i2c = obniz.getFreeI2C();
  i2c.start({ mode: 'master', sda: 2, scl: 3, clock: 100_000, pull: '5v' });

  let lastError: unknown = null;
  i2c.onerror = (err) => {
    lastError = err;
  };

  const found: number[] = [];
  for (let addr = 0x08; addr <= 0x77; addr++) {
    lastError = null;
    try {
      await i2c.readWait(addr, 1);
      if (!lastError) {
        found.push(addr);
        console.log(`  device found at 0x${addr.toString(16).padStart(2, '0')}`);
      }
    } catch {
      // no device at this address
    }
  }

  console.log(`scan complete. ${found.length} device(s) found.`);
  i2c.end();
  obniz.close();
};
