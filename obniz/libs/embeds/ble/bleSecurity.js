const emitter = require('eventemitter3');

class BleSecurity {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.emitter = new emitter();
  }

  setAuth(authTypes) {
    if (!Array.isArray(authTypes)) {
      authTypes = [authTypes];
    }
    let sendTypes = authTypes
      .map(elm => {
        return elm.toLowerCase();
      })
      .filter(elm => {
        return ['mitm', 'secure_connection', 'bonding'].includes(elm);
      });

    if (sendTypes.length !== authTypes.length) {
      throw new Error('unknown auth type');
    }

    this.Obniz.send({
      ble: {
        security: {
          auth: authTypes,
        },
      },
    });
  }

  setEncryptionLevel(level) {
    level = level.toLowerCase();
    let levels = ['none', 'encryption', 'mitm'];
    if (!levels.includes(level)) {
      throw new Error('unknown encryption level : ' + level);
    }
    this.Obniz.send({
      ble: {
        security: {
          encryption_level: level,
        },
      },
    });
  }

  setEnableKeyTypes(keyTypes) {
    if (!Array.isArray(keyTypes)) {
      keyTypes = [keyTypes];
    }
    let sendTypes = keyTypes
      .map(elm => {
        return elm.toLowerCase();
      })
      .filter(elm => {
        return ['ltk', 'csrk', 'irk'].includes(elm);
      });

    if (sendTypes.length !== keyTypes.length) {
      throw new Error('unknown key type');
    }

    this.Obniz.send({
      ble: {
        security: {
          key: { type: sendTypes },
        },
      },
    });
  }

  setKeyMaxSize(size) {
    if (typeof size !== 'number') {
      throw new Error('please provide key size in number');
    }
    this.Obniz.send({
      ble: {
        security: {
          key: { max_size: size },
        },
      },
    });
  }

  onerror() {} //dummy

  notifyFromServer(notifyName, params) {
    switch (notifyName) {
      case 'onerror': {
        this.onerror(params);
        break;
      }
    }
  }
}

module.exports = BleSecurity;
