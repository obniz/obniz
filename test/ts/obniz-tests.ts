import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/doc/sdk/doc/display
 */
class DisplayTest {
  clear() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.clear();
  }
  print() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.print('Hello!');
    obniz.display.font('Serif', 18);
    obniz.display.print('Hello World🧡');
  }
  pos() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.pos(0, 30);
    obniz.display.print('YES. こんにちは');
  }
  font() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.font('Avenir', 30);
    obniz.display.print('Avenir');
    obniz.display.font(null, 30); //デフォルトフォント(Arial)の30px
    obniz.display.font('Avenir'); //Avenirのデフォルトサイズ(16px)
  }
  line() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.line(30, 30, 100, 30);
    obniz.display.rect(20, 20, 20, 20);
    obniz.display.circle(100, 30, 20);
    obniz.display.line(60, 50, 100, 30);
    obniz.display.rect(50, 40, 20, 20, true);
    obniz.display.line(50, 10, 100, 30);
    obniz.display.circle(50, 10, 10, true);
  }
  rect() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.rect(10, 10, 20, 20);
    obniz.display.rect(20, 20, 20, 20, true); // filled rect
  }
  circle() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.circle(40, 30, 20);
    obniz.display.circle(90, 30, 20, true); // filled circle
  }
  drawing() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.drawing(false);
    for (var i = 0; i < 100; i++) {
      var x0 = Math.random() * 128;
      var y0 = Math.random() * 64;
      var x1 = Math.random() * 128;
      var y1 = Math.random() * 64;
      obniz.display.clear();
      obniz.display.line(x0, y0, x1, y1);
    }
    obniz.display.drawing(true);
  }
  qr() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.qr('https://obniz.io');
  }
  raw() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.display.raw([255, 255]); // must be 128*64 bits(=1024byte)
  }
  draw() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      // 1. load existing
      const canvas1 = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx1 = canvas1.getContext('2d');
      obniz.display.draw(ctx1);

      // 2. create new canvas dom and load it.
      const ctx2 = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);
      obniz.display.draw(ctx2);

      // 3. running with node.js
      //    npm install canvas. ( version 2.0.0 or later required )
      const { createCanvas } = require('canvas');
      const canvas = createCanvas(128, 64);
      const ctx3 = canvas.getContext('2d');

      ctx3.fillStyle = 'white';
      ctx3.font = '30px Avenir';
      ctx3.fillText('Avenir', 0, 40);

      obniz.display.draw(ctx3);
    };
  }
}

/**
 * https://obniz.io/doc/sdk/doc/ad
 */
class ADTest {
  start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.ad0.start(function(voltage) {
        console.log('changed to ' + voltage + ' v');
      });

      obniz.ad0.start();
      obniz.ad0.onchange = function(voltage) {
        console.log('changed to ' + voltage + ' v');
      };

      obniz.ad0.start();
      while (true) {
        console.log('changed to ' + obniz.ad0.value + ' v');
        await obniz.wait(10); // 10ms wait
      }
    };
  }

  getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io0.output(true);
      var voltage = await obniz.ad0.getWait();
      obniz.io0.output(false);
      console.log('' + voltage + ' should be closed to 5.00');
    };
  }

  end() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.ad0.start();
      obniz.ad0.end();
    };
  }

  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.ad0.start();
      obniz.ad0.onchange = function(voltage) {
        console.log('voltage = ' + voltage);
      };
    };
  }
}

/**
 * https://obniz.io/doc/sdk/doc/i2c
 */
class I2CTest {
  getFreeI2C() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var i2c = obniz.getFreeI2C();
    };
  }

  start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.i2c0.start({ mode: 'master', sda: 2, scl: 3, clock: 400000 });
      obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
      var ret = await obniz.i2c0.readWait(0x50, 1);
      console.log('read ' + ret);

      // use internal pull up
      obniz.i2c0.start({ mode: 'master', sda: 2, scl: 3, clock: 400000, pull: '5v' });
      obniz.i2c0.start({ mode: 'master', sda: 2, scl: 3, clock: 100000, pull: '3v' });

      // slave mode
      obniz.i2c0.start({ mode: 'slave', sda: 0, scl: 1, slave_address: 0x01 });
    };
  }

  write() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.i2c0.start({ mode: 'master', sda: 2, scl: 3, clock: 400000, pull: null });
      obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
    };
  }

  readWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.i2c0.start({ mode: 'master', sda: 2, scl: 3, clock: 400000, pull: null });
      var ret = await obniz.i2c0.readWait(0x50, 1);
      console.log('read ' + ret);
    };
  }

  onwritten() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.i2c0.start({ mode: 'slave', sda: 0, scl: 1, slave_address: 0x01 });
      obniz.i2c0.onwritten = function(data) {
        console.log(data);
      };
    };
  }

  onerror() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.i2c0.start({ mode: 'master', sda: 2, scl: 3, clock: 400000 });
      obniz.i2c0.onerror = function(err) {
        console.log('Error', err);
      };
      var ret = await obniz.i2c0.readWait(0x50, 1);
    };
  }

  end() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.i2c0.start({ mode: 'master', sda: 2, scl: 3, clock: 400000 });
      obniz.i2c0.end();
    };
  }
}

/**
 * https://obniz.io/doc/sdk/doc/io
 */
class IOTest {
  output() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io1.output(true); // io1 is 5v
      obniz.io2.output(1); //  io2 is 5v
      obniz.io3.drive('3v');
      obniz.io3.output(1); // io3 is around 3v.
    };
  }

  drive() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io0.output(true); // output push-pull 5v

      obniz.io1.drive('3v');
      obniz.io1.output(true); // output push-pull 3v

      obniz.io2.pull('5v');
      obniz.io2.drive('open-drain');
      obniz.io2.output(true); // output open-drain with 5v pull-up
    };
  }

  pull() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io0.pull('3v');
      obniz.io0.drive('open-drain'); // output open-drain
      obniz.io0.output(false);
    };
  }

  input() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io0.input(function(value) {
        console.log('changed to ' + value);
      });
    };
  }

  inputWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var value = await obniz.io0.inputWait();
      console.log(value);
    };
  }

  end() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io0.output(true);
      obniz.io0.end();
    };
  }

  animation() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io.animation('animation-1', 'loop', [
        {
          duration: 10,
          state: function(index) {
            // index = 0
            obniz.io0.output(false);
            obniz.io1.output(true);
          }
        },
        {
          duration: 10,
          state: function(index) {
            // index = 1
            obniz.io0.output(true);
            obniz.io1.output(false);
          }
        }
      ]);
    };
  }

  repeatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      await obniz.io.repeatWait(
        [
          {
            duration: 1000,
            state: function(index) {
              obniz.io0.output(true);
            }
          },
          {
            duration: 1000,
            state: function(index) {
              obniz.io0.output(false);
            }
          }
        ],
        4
      );
    };
  }
}

/**
 * https://obniz.io/doc/sdk/doc/pwm
 */
class PWMTest {
  getFreePwm() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
    };
  }

  start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
      pwm.start({ io: 0 }); // start pwm. output at io0
      pwm.freq(1000);
      pwm.duty(50);

      var pwm2 = obniz.getFreePwm();
      pwm2.start({ io: 1, drive: 'open-drain', pull: '5v' });
    };
  }

  freq() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
      pwm.start({ io: 0 });
      pwm.freq(1000); // set pwm. frequency to 1khz
    };
  }

  pulse() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
      pwm.start({ io: 0 });
      pwm.freq(2000); // set pwm frequency to 2khz
      pwm.pulse(0.5); // set pwm pulse 0.5ms.  so this is  25% ratio.
    };
  }

  duty() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
      pwm.start({ io: 0 });
      pwm.freq(2000); // set pwm frequency to 2khz
      pwm.duty(50); // set pwm pulse width 50%
    };
  }

  modulate() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
      pwm.start({ io: 0 });
      pwm.freq(38000); // set pwm frequency to 38khz

      // signal for room heater's remote signal
      var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1];

      pwm.modulate('am', 0.07, arr); // am modulate. symbol length = 70us.
    };
  }

  end() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pwm = obniz.getFreePwm();
      pwm.start({ io: 0 });
      pwm.end();
    };
  }
}

/**
 * https://obniz.io/doc/sdk/doc/spi
 */
class SPITest {
  getFreeSpi() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var spi = obniz.getFreeSpi();
    };
  }

  start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.spi0.start({ mode: 'master', clk: 0, mosi: 1, miso: 2, frequency: 1000000 });
      var ret = await obniz.spi0.writeWait([0x12, 0x98]);
      console.log('received: ' + ret);

      // drive and pull is optional
      obniz.spi0.start({ mode: 'master', clk: 0, mosi: 1, miso: 2, frequency: 1000000, drive: '5v', pull: null });
    };
  }

  writeWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.spi0.start({ mode: 'master', clk: 0, mosi: 1, miso: 2, frequency: 1000000 });
      var ret = await obniz.spi0.writeWait([0x12, 0x98]);
      console.log('received: ' + ret);
    };
  }

  write() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.spi0.start({ mode: 'master', clk: 0, mosi: 1, miso: 2, frequency: 1000000 });
      obniz.spi0.write([0x12, 0x98]);
    };
  }

  end() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      // obniz.spi0.start({ mode: 'master', clk: 0, mosi: 1, miso: 2, clock: 1000000 });
      obniz.spi0.start({ mode: 'master', clk: 0, mosi: 1, miso: 2, frequency: 1000000 });
      obniz.spi0.write([0x12, 0x98]);
      obniz.spi0.end();
    };
  }
}

/**
 * https://obniz.io/doc/sdk/doc/uart
 */
class UARTTest {
  getFreeUart() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var uart = obniz.getFreeUart();
    };
  }

  start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io0.output(false); // for sharing GND.
      obniz.uart0.start({ tx: 1, rx: 2, baud: 9600, bits: 7 });
      obniz.uart0.send('Hi');

      obniz.uart1.start({ tx: 3, rx: 4, cts: 5, rts: 6, flowcontrol: 'rts-cts' });
      obniz.uart1.send('Hi');
    };
  }

  send() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.uart0.start({ tx: 0, rx: 1 });
      obniz.uart0.send('Hi');
      obniz.uart0.send(0x11);
      obniz.uart0.send([0x11, 0x45, 0x44]);
    };
  }

  end() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.uart0.start({ tx: 0, rx: 1 });
      obniz.uart0.send('Hi');
      obniz.uart0.end();
    };
  }

  onreceive() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.uart0.start({ tx: 0, rx: 1 });
      obniz.uart0.onreceive = function(data, text) {
        console.log(data);
        console.log(text);
      };
      obniz.uart0.send('Hello');
    };
  }

  isDataExists() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.uart0.start({ tx: 0, rx: 1 });

      while (1) {
        if (obniz.uart0.isDataExists()) {
          console.log(obniz.uart0.readText());
        }
        await obniz.wait(10); //wait for 10ms
      }
    };
  }

  readByte() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.uart0.start({ tx: 0, rx: 1 });

      while (1) {
        while (obniz.uart0.isDataExists()) {
          console.log(obniz.uart0.readByte());
        }
        await obniz.wait(10); //wait for 10ms
      }
    };
  }

  readBytes() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.uart0.start({ tx: 0, rx: 1 });

      while (1) {
        if (obniz.uart0.isDataExists()) {
          console.log(obniz.uart0.readBytes());
        }
        await obniz.wait(10); //wait for 10ms
      }
    };
  }

  readText() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.uart0.start({ tx: 0, rx: 1 });

      while (1) {
        if (obniz.uart0.isDataExists()) {
          console.log(obniz.uart0.readText());
        }
        await obniz.wait(10); //wait for 10ms
      }
    };
  }
}
