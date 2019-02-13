class Directive {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
  }

  animation(name, status, array) {
    let obj = {};
    obj.io = {
      animation: {
        name: name,
        status: status,
      },
    };
    if (!array) array = [];

    let states = [];
    for (let i = 0; i < array.length; i++) {
      let state = array[i];
      let duration = state.duration;
      let operation = state.state;

      // dry run. and get json commands
      this.Obniz.sendPool = [];
      operation(i);
      let pooledJsonArray = this.Obniz.sendPool;
      this.Obniz.sendPool = null;
      states.push({
        duration: duration,
        state: pooledJsonArray,
      });
    }
    if (status === 'loop') {
      obj.io.animation.states = states;
    }
    this.Obniz.send(obj);
  }
}

module.exports = Directive;
