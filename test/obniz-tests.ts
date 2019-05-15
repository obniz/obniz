import * as Obniz from '../';

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
    const canvas = document.createElement('canvas');
    obniz.display.draw(canvas);
  }
}

/**
 * https://obniz.io/ja/sdk/parts/LED/README.md
 */
class LEDTest {
  led() {
    const obniz = new Obniz(OBNIZ_ID);
    var led = obniz.wired('LED', { anode: 0 }); // io0 is anode. cathode is connected obniz GND other way.
    led.on();
  }
  on() {
    const obniz = new Obniz(OBNIZ_ID);
    var led = obniz.wired('LED', { anode: 0, cathode: 1 });
    led.on();
  }
  off() {
    const obniz = new Obniz(OBNIZ_ID);
    var led = obniz.wired('LED', { anode: 0, cathode: 1 });
    led.output(true);
  }
  blink() {
    const obniz = new Obniz(OBNIZ_ID);
    var led = obniz.wired('LED', { anode: 0, cathode: 1 });
    led.blink(); // 100msec
  }
  endBlick() {
    const obniz = new Obniz(OBNIZ_ID);
    var led = obniz.wired('LED', { anode: 0, cathode: 1 });
    led.endBlink();
  }
}
