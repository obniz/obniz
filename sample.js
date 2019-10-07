const Obniz = require('./obniz/index');

let obniz = new Obniz('15696177');
obniz.debugprint = true;
obniz.onconnect = async function() {
  console.log('onconnect');
};

obniz.onclose = async function() {
  console.log('close');
};
