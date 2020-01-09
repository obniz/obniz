const isNode: any = typeof window === "undefined";
import semver = require("semver");

class Tcp {
  public Obniz: any;
  public id: any;
  public connectObservers: any;
  public readObservers: any;
  public used: any;
  public onconnection: any;
  public onreceive: any;
  public onerror: any;

  constructor(Obniz: any, id: any) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  public _reset() {
    this.connectObservers = [];
    this.readObservers = [];
    this.used = false;
  }

  public _addConnectObserver(callback: any) {
    if (callback) {
      this.connectObservers.push(callback);
    }
  }

  public _addReadObserver(callback: any) {
    if (callback) {
      this.readObservers.push(callback);
    }
  }

  public connectWait(port: any, domain: any) {
    if (semver.lt(this.Obniz.firmware_ver, "2.1.0")) {
      throw new Error(`Please update obniz firmware >= 2.1.0`);
    }

    // TODO
    // if (this.used) {
    //   throw new Error(`tcp${this.id} is in used`);
    // }

    if (port < 0 || port > 65535) {
      throw new Error(`tcp${this.id} is invalid port`);
    }
    if (domain.length > 30) {
      throw new Error(`tcp${this.id} is domain length over`);
    }

    this.connectObservers = [];
    this.used = true;
    return new Promise((resolve: any, reject: any) => {
      this._addConnectObserver(resolve);
      const obj: any = {};
      obj["tcp" + this.id] = {
        connect: {
          port,
          domain,
        },
      };
      this.Obniz.send(obj);
    });
  }

  public close() {
    if (!this.used) {
      throw new Error(`tcp${this.id} is not used`);
    }
    const obj: any = {};
    obj["tcp" + this.id] = {
      disconnect: true,
    };
    this.Obniz.send(obj);
  }

  public write(data: any) {
    if (!this.used) {
      throw new Error(`tcp${this.id} is not started`);
    }
    if (data === undefined) {
      return;
    }
    if (typeof data === "number") {
      data = [data];
    }

    let send_data: any = null;
    if (isNode && data instanceof Buffer) {
      send_data = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === "string") {
      const buf: any = Buffer.from(data);
      send_data = [...buf];
    }
    const obj: any = {};
    obj["tcp" + this.id] = {
      write: {
        data: send_data,
      },
    };
    this.Obniz.send(obj);
  }

  public readWait() {
    if (!this.used) {
      throw new Error(`tcp${this.id} is not started`);
    }
    return new Promise((resolve: any, reject: any) => {
      this._addReadObserver(resolve);
    });
  }

  public end() {
    this.close();
  }

  public notified(obj: any) {
    if (obj.connection) {
      /* Connectino state update. response of connect(), close from destination, response from */
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
      const callback: any = this.readObservers.shift();
      if (callback) {
        callback(obj.read.data);
      }
    } else if (obj.connect) {
      /* response of connect() */
      /* `this.connection` will called before this function */
      if (obj.connect.code !== 0) {
        if (this.onerror) {
          this.onerror(obj.connect);
        }
      }
      const callback: any = this.connectObservers.shift();
      if (callback) {
        callback(obj.connect.code);
      }
    }
  }

  public isUsed() {
    return this.used;
  }
}

export default Tcp;
