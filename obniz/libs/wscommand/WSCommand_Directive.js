const WSCommand = require('./WSCommand_.js');
const ObnizUtil = require('../utils/util');

module.exports = class WSCommand_Directive extends WSCommand {
  constructor(delegate) {
    super(delegate);
    this.module = 1;

    this._CommandRegistrate = 0;
    this._CommandPause = 1;
    this._CommandResume = 2;

    const CommandIO = require('./WSCommand_IO');
    const CommandPWM = require('./WSCommand_PWM');

    this.availableCommands = [new CommandIO(), new CommandPWM()];
  }

  // Commands

  init(params, originalParams) {
    const nameArray = ObnizUtil.string2dataArray(params.animation.name);
    let frame = new Uint8Array(nameArray.length + 2);
    frame[0] = nameArray.length + 1;
    frame.set(nameArray, 1);
    frame[frame.byteLength - 1] = 0; // null string
    const commandJsonArray = params.animation.states;

    for (let i = 0; i < commandJsonArray.length; i++) {
      const obj = commandJsonArray[i];
      const duration = parseInt(obj.duration * 1000);
      const state = obj.state;

      // Dry run commands
      let parsedCommands = JSON.parse(JSON.stringify(state));
      if (!Array.isArray(parsedCommands)) {
        parsedCommands = [parsedCommands];
      }
      let compressed = null;
      for (
        let commandIndex = 0;
        commandIndex < parsedCommands.length;
        commandIndex++
      ) {
        const frame = WSCommand.compress(
          this.availableCommands,
          parsedCommands[commandIndex]
        );
        if (!frame) {
          throw new Error(
            '[io.animation.states.state]only io or pwm commands. Pleave provide state at least one of them.'
          );
        }
        if (compressed) {
          let combined = new Uint8Array(compressed.length + frame.length);
          combined.set(compressed, 0);
          combined.set(frame, compressed.length);
          compressed = combined;
        } else {
          compressed = frame;
        }
      }
      if (!compressed) {
        throw new Error(
          '[io.animation.states.state]only io or pwm commands. Pleave provide state at least one of them.'
        );
      }
      const length = compressed.byteLength;

      let commandHeader = new Uint8Array(8);
      commandHeader[0] = length >> (8 * 3);
      commandHeader[1] = length >> (8 * 2);
      commandHeader[2] = length >> (8 * 1);
      commandHeader[3] = length;
      commandHeader[4] = duration >> (8 * 3);
      commandHeader[5] = duration >> (8 * 2);
      commandHeader[6] = duration >> (8 * 1);
      commandHeader[7] = duration;

      const combined = new Uint8Array(
        frame.byteLength + commandHeader.byteLength + compressed.byteLength
      );
      combined.set(frame, 0);
      combined.set(commandHeader, frame.byteLength);
      combined.set(compressed, frame.byteLength + commandHeader.byteLength);

      frame = combined;
    }

    if (frame.byteLength > 1000) {
      // 1kbyte over
      throw new Error('[io.animation]Too big animation datas');
    }

    this.sendCommand(this._CommandRegistrate, frame);
  }

  changeState(params) {
    if (params.animation.status === 'resume') {
      const nameArray = ObnizUtil.string2dataArray(params.animation.name);
      let frame = new Uint8Array(nameArray.length + 2);
      frame[0] = nameArray.length + 1;
      frame.set(nameArray, 1);
      frame[frame.byteLength - 1] = 0;
      this.sendCommand(this._CommandResume, frame);
    } else if (params.animation.status === 'pause') {
      const nameArray = ObnizUtil.string2dataArray(params.animation.name);
      let frame = new Uint8Array(nameArray.length + 2);
      frame[0] = nameArray.length + 1;
      frame.set(nameArray, 1);
      frame[frame.byteLength - 1] = 0;
      this.sendCommand(this._CommandPause, frame);
    }
  }

  parseFromJson(json) {
    let parentCommandNotFound = false;
    try {
      super.parseFromJson(json);
    } catch (err) {
      if (err instanceof this.WSCommandNotFoundError) {
        parentCommandNotFound = true;
      } else {
        throw err;
      }
    }

    const module = json['io'];
    if (module === undefined) {
      return;
    }

    const schemaData = [
      { uri: '/request/ioAnimation/init', onValid: this.init },
      { uri: '/request/ioAnimation/changeState', onValid: this.changeState },
    ];
    const res = this.validateCommandSchema(schemaData, module, 'io', module);

    if (res.valid === 0 && parentCommandNotFound) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        let WSCommandNotFoundError = this.WSCommandNotFoundError;
        throw new WSCommandNotFoundError(`[io.animation]unknown command`);
      }
    }
  }
};
