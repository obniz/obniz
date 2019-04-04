let Obniz = require('./index.js');

let obniz = new Obniz('5252-7518');
obniz.onconnect = async function() {
  let tempsens = obniz.wired('LM60', { gnd: 0, output: 1, vcc: 2 });
  tempsens.onchange = function(temp) {
    console.log(temp);
  };
};
