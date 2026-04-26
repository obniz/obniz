import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

// Generic I2C master read/write.
// Example targets a 7-bit addressed device at 0x50 (e.g. 24LC256 EEPROM).
const SLAVE_ADDRESS = 0x50;

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const i2c = obniz.getFreeI2C();
  i2c.start({
    mode: 'master',
    sda: 2,
    scl: 3,
    clock: 400_000,
    pull: '5v',
  });

  i2c.onerror = (err) => {
    console.error('I2C error:', err);
  };

  // Write the register address we want to read from
  i2c.write(SLAVE_ADDRESS, [0x00, 0x00]);

  // Then read 4 bytes back
  const data = await i2c.readWait(SLAVE_ADDRESS, 4);
  console.log('read:', data.map((b) => b.toString(16).padStart(2, '0')).join(' '));

  i2c.end();
  obniz.close();
};
