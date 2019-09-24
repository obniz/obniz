const isNode = typeof window === 'undefined';

class Tcp {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
    this.connectObservers = [];
    this.readObservers = [];
    this.used = false;
  }

  _addConnectObserver(callback) {
    if (callback) {
      this.connectObservers.push(callback);
    }
  }

  _addReadObserver(callback) {
    if (callback) {
      this.readObservers.push(callback);
    }
  }

  connectWait(port, domain) {
    // if (this.used) {
    //   throw new Error(`tcp${this.id} is used`);
    // }
    if (port < 0 || port > 65535) {
      throw new Error(`tcp${this.id} is port`);
    }
    if (domain.length > 30) {
      throw new Error(`tcp${this.id} is domain length over`);
    }

    this.connectObservers = [];
    this.used = true;
    let self = this;
    return new Promise(function(resolve, reject) {
      self._addConnectObserver(resolve);
      self.Obniz.send({
        tcp: {
          connect: {
            index: self.id,
            port: port,
            domain: domain,
          },
        },
      });
    });
  }

  close() {
    this.Obniz.send({
      tcp: {
        disconnect: {
          index: this.id,
        },
      },
    });
  }

  write(data) {
    if (!this.used) {
      throw new Error(`tcp${this.id} is not started`);
    }
    if (data === undefined) {
      return;
    }
    if (typeof data === 'number') {
      data = [data];
    }

    let send_data = null;
    if (isNode && data instanceof Buffer) {
      send_data = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === 'string') {
      const buf = Buffer.from(data);
      send_data = [...buf];
    }

    this.Obniz.send({
      tcp: {
        write: {
          index: this.id,
          data: send_data,
        },
      },
    });
  }

  readWait() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self._addReadObserver(resolve);
    });
  }

  end() {
    this.close();
  }

  notified(obj) {
    if (obj.connection) {
      if (this.onconnection) {
        this.onconnection(obj.connection.connected);
      }
      if (!obj.connection.connected) {
        this._reset();
      }
    } else if (obj.read) {
      if (this.onreceive) {
        this.onreceive(obj.read.data);
      }
      let callback = this.readObservers.shift();
      if (callback) {
        callback(obj.read.data);
      }
    } else if (obj.connect) {
      if (obj.connect.code !== 0) {
        if (this.onerror) {
          this.onerror(obj.connect);
        }
      }
      let callback = this.connectObservers.shift();
      if (callback) {
        callback(obj.connect.code);
      }
    }
  }

  isUsed() {
    return this.used;
  }
}
module.exports = Tcp;
