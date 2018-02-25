class Speaker {

  constructor(obniz) {
    this.keys = ["signal","gnd"];
    this.requiredKeys = ["gnd"];
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(null, this.params.gnd, "5v");
    this.pwm = obniz.getFreePwm();
    this.pwm.start(this.params.signal);
  }

  play(freq) {
    if (freq > 0) {
      this.pwm.freq(freq);
      this.pwm.pulse(1/freq/2*1000);
    } else {
      this.pwm.pulse(0);
    }
  }
  
  stop() {
    this.play(0);
  }
}

if (PartsRegistrate) {
  PartsRegistrate("Speaker", Speaker);
}