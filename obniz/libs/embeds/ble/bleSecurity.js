const emitter = require('eventemitter3');
const semver = require('semver');

class BleSecurity {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.emitter = new emitter();
  }

  checkIntroducedFirmware(introducedVersion, functionName) {
    let results = semver.lt(this.Obniz.firmware_ver, introducedVersion);
    if (results) {
      let msg = `${functionName} is available obniz firmware ${introducedVersion}.( your obniz version is ${
        this.Obniz.firmware_ver
      })`;
      this.Obniz.error(msg);
      throw new Error(msg);
    }
  }
  setAuth(authTypes) {
    this.checkIntroducedFirmware('1.1.0', 'setAuth');
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
    this.checkIntroducedFirmware('1.1.0', 'setEncryptionLevel');
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
    this.checkIntroducedFirmware('1.1.0', 'setEnableKeyTypes');
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
    this.checkIntroducedFirmware('1.1.0', 'setKeyMaxSize');
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
