const Obniz = require('./index');

let obniz = new Obniz('71440641');
//aaa
obniz.onconnect = async function() {
  obniz.display.clear();
};
