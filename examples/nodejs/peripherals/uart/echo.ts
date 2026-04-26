import Obniz from '../../../../src/obniz';

if (typeof process.env.OBNIZ_ID !== 'string') {
  throw new Error('Please set export OBNIZ_ID=your_obniz_id');
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN,
});

obniz.onconnect = async () => {
  console.log(`connected to ${obniz.id}`);

  const uart = obniz.getFreeUart();
  uart.start({ tx: 0, rx: 1, baud: 115200 });

  uart.onreceive = (data, text) => {
    console.log(`rx: ${text} (${data.length} bytes)`);
  };

  // Send a banner once, then echo a heartbeat every 2 seconds
  uart.send('Hello from obniz UART\r\n');
  setInterval(() => {
    uart.send(`tick ${new Date().toISOString()}\r\n`);
  }, 2000);
};
