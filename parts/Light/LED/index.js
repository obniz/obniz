class LED {
  constructor() {
    this.keys = ['anode', 'cathode'];
    this.requiredKeys = ['anode'];
  }

  static info() {
    return {
      name: 'LED',
    };
  }

  wired(obniz) {
    function getIO(io) {
      if (io && typeof io === 'object') {
        if (typeof io['output'] === 'function') {
          return io;
        }
      }
      return obniz.getIO(io);
    }

    this.obniz = obniz;
    this.io_anode = getIO(this.params.anode);
    this.io_anode.output(false);
    if (this.obniz.isValidIO(this.params.cathode)) {
      this.io_cathode = getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.animationName = 'Led-' + this.params.anode;
  }

  on() {
    this.endBlink();
    this.io_anode.output(true);
  }

  off() {
    this.endBlink();
    this.io_anode.output(false);
  }

  output(value) {
    if (value) {
      this.on();
    } else {
      this.off();
    }
  }

  endBlink() {
    this.obniz.io.animation(this.animationName, 'pause');
  }

  blink(interval) {
    if (!interval) {
      interval = 100;
    }
    let frames = [
      {
        duration: interval,
        state: function(index) {
          // index = 0
          this.io_anode.output(true); // on
        }.bind(this),
      },
      {
        duration: interval,
        state: function(index) {
          // index = 0
          this.io_anode.output(false); //off
        }.bind(this),
      },
    ];

    this.obniz.io.animation(this.animationName, 'loop', frames);
  }
}

if (typeof module === 'object') {
  module.exports = LED;
}
