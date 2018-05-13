let Obniz = require('../index');
let tv4 = Obniz.WSCommand.schema;

class obnizJsonValidator {
  constructor() {
    this.useCommands = {};
    this.cache = {};
  }

  requestValidate(requestJson, type) {
    // var schema = tv4.getSchema("/request");
    // return tv4.validateMultiple(requestJson, schema);

    let commands = this.matchCommands(requestJson, 'request');
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

    let commands = this.matchCommands(requestJson, 'response');
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
    commands = commands.filter(elm => {
      let schema = tv4.getSchema(elm);
      if (schema['anyOf']) {
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
    let baseTv4 = tv4.freshApi();
    baseTv4.addSchema(tv4.getSchema('/'));

    let baseResults = baseTv4.validateMultiple(json, tv4.getSchema('/' + type));

    let matched = [];

    for (let targetUri of baseResults.missing) {
      let reg = new RegExp('^' + targetUri);
      let targets = this.command(reg);
      for (let commands of json) {
        for (let commandKey of Object.keys(commands)) {
          let command = commands[commandKey];
          for (let target of targets) {
            let results = baseTv4.validateMultiple(
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
    let results = [];
    this.useCommands[type] = this.useCommands[type] || [];
    let useCommandUnique = this.useCommands[type].filter(function(x, i, self) {
      return self.indexOf(x) === i;
    });
    useCommandUnique = useCommandUnique.sort();

    let unusedCommand = this.commandAll().filter(elm => {
      return useCommandUnique.indexOf(elm) == -1;
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
      results.push('not tested:');
      for (let command of unusedCommand) {
        results.push('\t' + command);
      }
    }

    return results.join('\n');
  }
}

module.exports = new obnizJsonValidator();
