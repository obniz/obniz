const tv4 = require('../../dist/src/obniz/libs/wscommand/WSSchema').default;

class obnizJsonValidator {
  constructor() {
    this.useCommands = {};
    this.cache = {};
  }

  requestValidate(requestJson, type) {
    // var schema = tv4.getSchema("/request");
    // return tv4.validateMultiple(requestJson, schema);

    const commands = this.matchCommands(requestJson, 'request');
    if (commands.length === 0) {
      return {
        valid: false,
        errors: ['json are valid for no command'],
      };
    } else {
      // }else if(commands.length === requestJson.length){
      this.useCommands[type] = this.useCommands[type] || [];
      this.useCommands[type].push(commands[0]);
      return {
        valid: true,
        errors: [],
      };

      // }else{
      //   return {
      //     valid : false,
      //     errors : ["json are valid for multiple command:" + commands.join(",")],
      //   }
    }
  }

  responseValidate(requestJson, type) {
    // var schema = tv4.getSchema("/response");
    // return tv4.validateMultiple(requestJson, schema);

    const commands = this.matchCommands(requestJson, 'response');
    if (commands.length === 0) {
      return {
        valid: false,
        errors: ['json are valid for no command'],
      };
    } else {
      // }else if(commands.length === requestJson.length){
      this.useCommands[type] = this.useCommands[type] || [];
      this.useCommands[type].push(commands[0]);
      return {
        valid: true,
        errors: [],
      };
      //
      // }else{
      //   return {
      //     valid : false,
      //     errors : ["json are valid for multiple command:" + commands.join(",")],
      //   }
    }
  }

  commandAllNum() {
    return this.commandAll().length;
  }

  commandAll() {
    if (this.cache.commandAll) {
      return this.cache.commandAll;
    }
    let commands = []
      .concat(this.command(/^\/request\//))
      .concat(this.command(/^\/response\//));
    commands = commands.filter((elm) => {
      const schema = tv4.getSchema(elm);
      if (schema['anyOf']) {
        return false;
      } else if (schema['deprecated']) {
        return false;
      } else {
        return true;
      }
    });
    this.cache.commandAll = commands;
    return this.cache.commandAll;
  }

  command(reg) {
    return tv4.getSchemaUris(reg);
  }

  commandCount(reg) {
    return this.command(reg).length;
  }

  matchCommands(json, type) {
    const baseTv4 = tv4.freshApi();
    baseTv4.addSchema(tv4.getSchema('/'));

    const baseResults = baseTv4.validateMultiple(
      json,
      tv4.getSchema('/' + type)
    );

    const matched = [];

    for (const targetUri of baseResults.missing) {
      const reg = new RegExp('^' + targetUri);
      const targets = this.command(reg);
      for (const commands of json) {
        for (const commandKey of Object.keys(commands)) {
          const command = commands[commandKey];
          for (const target of targets) {
            const results = baseTv4.validateMultiple(
              command,
              tv4.getSchema(target)
            );
            if (results.valid && results.missing.length === 0) {
              matched.push(target);
            }
          }
        }
      }
    }
    return matched;
  }

  checkResults(type, prefix) {
    const results = [];
    this.useCommands[type] = this.useCommands[type] || [];
    let useCommandUnique = this.useCommands[type].filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
    const allCommands = this.commandAll();
    useCommandUnique = useCommandUnique
      .filter((elm) => {
        return allCommands.indexOf(elm) !== -1;
      })
      .sort();

    const unusedCommand = this.commandAll().filter((elm) => {
      return useCommandUnique.indexOf(elm) === -1;
    });

    results.push(
      prefix +
        ' commands tested ' +
        useCommandUnique.length +
        ' / ' +
        this.commandAllNum() +
        ' (remain : ' +
        (this.commandAllNum() - useCommandUnique.length) +
        ')'
    );

    if (unusedCommand.length > 0) {
      results.push('not tested(exclude:deprecated):');
      for (const command of unusedCommand) {
        results.push('\t' + command);
      }
    }

    return results.join('\n');
  }
}

module.exports = new obnizJsonValidator();
