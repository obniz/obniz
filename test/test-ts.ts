import Obniz = require("../dist/src/obniz");

const obniz = new Obniz("86014802", 1);

const led = obniz.wired("LED", {anode: 1});
const dcm = obniz.wired("DCMotor", {forward: 1, back: 2});
