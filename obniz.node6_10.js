(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Obniz"] = factory();
	else
		root["Obniz"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./obniz/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./json_schema sync recursive \\.yml$":
/*!*********************************!*\
  !*** ./json_schema sync \.yml$ ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./index.yml": "./json_schema/index.yml",
	"./request/ad/deinit.yml": "./json_schema/request/ad/deinit.yml",
	"./request/ad/index.yml": "./json_schema/request/ad/index.yml",
	"./request/ad/input.yml": "./json_schema/request/ad/input.yml",
	"./request/ble/central/characteristic_get.yml": "./json_schema/request/ble/central/characteristic_get.yml",
	"./request/ble/central/characteristic_read.yml": "./json_schema/request/ble/central/characteristic_read.yml",
	"./request/ble/central/characteristic_write.yml": "./json_schema/request/ble/central/characteristic_write.yml",
	"./request/ble/central/connect.yml": "./json_schema/request/ble/central/connect.yml",
	"./request/ble/central/descriptor_get.yml": "./json_schema/request/ble/central/descriptor_get.yml",
	"./request/ble/central/descriptor_read.yml": "./json_schema/request/ble/central/descriptor_read.yml",
	"./request/ble/central/descriptor_write.yml": "./json_schema/request/ble/central/descriptor_write.yml",
	"./request/ble/central/disconnect.yml": "./json_schema/request/ble/central/disconnect.yml",
	"./request/ble/central/index.yml": "./json_schema/request/ble/central/index.yml",
	"./request/ble/central/scan_start.yml": "./json_schema/request/ble/central/scan_start.yml",
	"./request/ble/central/scan_stop.yml": "./json_schema/request/ble/central/scan_stop.yml",
	"./request/ble/central/service_get.yml": "./json_schema/request/ble/central/service_get.yml",
	"./request/ble/index.yml": "./json_schema/request/ble/index.yml",
	"./request/ble/peripheral/advertisement_start.yml": "./json_schema/request/ble/peripheral/advertisement_start.yml",
	"./request/ble/peripheral/advertisement_stop.yml": "./json_schema/request/ble/peripheral/advertisement_stop.yml",
	"./request/ble/peripheral/characteristic_read.yml": "./json_schema/request/ble/peripheral/characteristic_read.yml",
	"./request/ble/peripheral/characteristic_write.yml": "./json_schema/request/ble/peripheral/characteristic_write.yml",
	"./request/ble/peripheral/descriptor_read.yml": "./json_schema/request/ble/peripheral/descriptor_read.yml",
	"./request/ble/peripheral/descriptor_write.yml": "./json_schema/request/ble/peripheral/descriptor_write.yml",
	"./request/ble/peripheral/index.yml": "./json_schema/request/ble/peripheral/index.yml",
	"./request/ble/peripheral/servie_start.yml": "./json_schema/request/ble/peripheral/servie_start.yml",
	"./request/ble/peripheral/servie_stop.yml": "./json_schema/request/ble/peripheral/servie_stop.yml",
	"./request/display/clear.yml": "./json_schema/request/display/clear.yml",
	"./request/display/index.yml": "./json_schema/request/display/index.yml",
	"./request/display/pin_assign.yml": "./json_schema/request/display/pin_assign.yml",
	"./request/display/qr.yml": "./json_schema/request/display/qr.yml",
	"./request/display/raw.yml": "./json_schema/request/display/raw.yml",
	"./request/display/text.yml": "./json_schema/request/display/text.yml",
	"./request/i2c/deinit.yml": "./json_schema/request/i2c/deinit.yml",
	"./request/i2c/index.yml": "./json_schema/request/i2c/index.yml",
	"./request/i2c/init_master.yml": "./json_schema/request/i2c/init_master.yml",
	"./request/i2c/init_slave.yml": "./json_schema/request/i2c/init_slave.yml",
	"./request/i2c/read.yml": "./json_schema/request/i2c/read.yml",
	"./request/i2c/write.yml": "./json_schema/request/i2c/write.yml",
	"./request/index.yml": "./json_schema/request/index.yml",
	"./request/io/deinit.yml": "./json_schema/request/io/deinit.yml",
	"./request/io/index.yml": "./json_schema/request/io/index.yml",
	"./request/io/input.yml": "./json_schema/request/io/input.yml",
	"./request/io/input_detail.yml": "./json_schema/request/io/input_detail.yml",
	"./request/io/output.yml": "./json_schema/request/io/output.yml",
	"./request/io/output_detail.yml": "./json_schema/request/io/output_detail.yml",
	"./request/io/output_type.yml": "./json_schema/request/io/output_type.yml",
	"./request/io/pull_type.yml": "./json_schema/request/io/pull_type.yml",
	"./request/ioanimation/changeState.yml": "./json_schema/request/ioanimation/changeState.yml",
	"./request/ioanimation/index.yml": "./json_schema/request/ioanimation/index.yml",
	"./request/ioanimation/init.yml": "./json_schema/request/ioanimation/init.yml",
	"./request/logicanalyzer/deinit.yml": "./json_schema/request/logicanalyzer/deinit.yml",
	"./request/logicanalyzer/index.yml": "./json_schema/request/logicanalyzer/index.yml",
	"./request/logicanalyzer/init.yml": "./json_schema/request/logicanalyzer/init.yml",
	"./request/measure/echo.yml": "./json_schema/request/measure/echo.yml",
	"./request/measure/index.yml": "./json_schema/request/measure/index.yml",
	"./request/message/index.yml": "./json_schema/request/message/index.yml",
	"./request/message/send.yml": "./json_schema/request/message/send.yml",
	"./request/pwm/deinit.yml": "./json_schema/request/pwm/deinit.yml",
	"./request/pwm/duty.yml": "./json_schema/request/pwm/duty.yml",
	"./request/pwm/freq.yml": "./json_schema/request/pwm/freq.yml",
	"./request/pwm/index.yml": "./json_schema/request/pwm/index.yml",
	"./request/pwm/init.yml": "./json_schema/request/pwm/init.yml",
	"./request/pwm/modulate.yml": "./json_schema/request/pwm/modulate.yml",
	"./request/pwm/pulse.yml": "./json_schema/request/pwm/pulse.yml",
	"./request/spi/deinit.yml": "./json_schema/request/spi/deinit.yml",
	"./request/spi/index.yml": "./json_schema/request/spi/index.yml",
	"./request/spi/init_master.yml": "./json_schema/request/spi/init_master.yml",
	"./request/spi/write.yml": "./json_schema/request/spi/write.yml",
	"./request/switch/get.yml": "./json_schema/request/switch/get.yml",
	"./request/switch/index.yml": "./json_schema/request/switch/index.yml",
	"./request/system/index.yml": "./json_schema/request/system/index.yml",
	"./request/system/keep_working_at_offline.yml": "./json_schema/request/system/keep_working_at_offline.yml",
	"./request/system/ping.yml": "./json_schema/request/system/ping.yml",
	"./request/system/reboot.yml": "./json_schema/request/system/reboot.yml",
	"./request/system/reset.yml": "./json_schema/request/system/reset.yml",
	"./request/system/self_check.yml": "./json_schema/request/system/self_check.yml",
	"./request/system/wait.yml": "./json_schema/request/system/wait.yml",
	"./request/uart/deinit.yml": "./json_schema/request/uart/deinit.yml",
	"./request/uart/index.yml": "./json_schema/request/uart/index.yml",
	"./request/uart/init.yml": "./json_schema/request/uart/init.yml",
	"./request/uart/send.yml": "./json_schema/request/uart/send.yml",
	"./request/ws/index.yml": "./json_schema/request/ws/index.yml",
	"./request/ws/reset_obniz_on_ws_disconnection.yml": "./json_schema/request/ws/reset_obniz_on_ws_disconnection.yml",
	"./response/ad/get.yml": "./json_schema/response/ad/get.yml",
	"./response/ad/index.yml": "./json_schema/response/ad/index.yml",
	"./response/ble/central/characteristic_get.yml": "./json_schema/response/ble/central/characteristic_get.yml",
	"./response/ble/central/characteristic_read.yml": "./json_schema/response/ble/central/characteristic_read.yml",
	"./response/ble/central/characteristic_write.yml": "./json_schema/response/ble/central/characteristic_write.yml",
	"./response/ble/central/descriptor_get.yml": "./json_schema/response/ble/central/descriptor_get.yml",
	"./response/ble/central/descriptor_read.yml": "./json_schema/response/ble/central/descriptor_read.yml",
	"./response/ble/central/descriptor_write.yml": "./json_schema/response/ble/central/descriptor_write.yml",
	"./response/ble/central/error.yml": "./json_schema/response/ble/central/error.yml",
	"./response/ble/central/index.yml": "./json_schema/response/ble/central/index.yml",
	"./response/ble/central/scan.yml": "./json_schema/response/ble/central/scan.yml",
	"./response/ble/central/scan_finish.yml": "./json_schema/response/ble/central/scan_finish.yml",
	"./response/ble/central/service_get.yml": "./json_schema/response/ble/central/service_get.yml",
	"./response/ble/central/status_update.yml": "./json_schema/response/ble/central/status_update.yml",
	"./response/ble/index.yml": "./json_schema/response/ble/index.yml",
	"./response/ble/peripheral/characteristic_notify_read.yml": "./json_schema/response/ble/peripheral/characteristic_notify_read.yml",
	"./response/ble/peripheral/characteristic_notify_write.yml": "./json_schema/response/ble/peripheral/characteristic_notify_write.yml",
	"./response/ble/peripheral/characteristic_read.yml": "./json_schema/response/ble/peripheral/characteristic_read.yml",
	"./response/ble/peripheral/characteristic_write.yml": "./json_schema/response/ble/peripheral/characteristic_write.yml",
	"./response/ble/peripheral/descriptor_notify_read.yml": "./json_schema/response/ble/peripheral/descriptor_notify_read.yml",
	"./response/ble/peripheral/descriptor_notify_write.yml": "./json_schema/response/ble/peripheral/descriptor_notify_write.yml",
	"./response/ble/peripheral/descriptor_read.yml": "./json_schema/response/ble/peripheral/descriptor_read.yml",
	"./response/ble/peripheral/descriptor_write.yml": "./json_schema/response/ble/peripheral/descriptor_write.yml",
	"./response/ble/peripheral/index.yml": "./json_schema/response/ble/peripheral/index.yml",
	"./response/ble/peripheral/status.yml": "./json_schema/response/ble/peripheral/status.yml",
	"./response/debug/error.yml": "./json_schema/response/debug/error.yml",
	"./response/debug/index.yml": "./json_schema/response/debug/index.yml",
	"./response/debug/warning.yml": "./json_schema/response/debug/warning.yml",
	"./response/i2c/index.yml": "./json_schema/response/i2c/index.yml",
	"./response/i2c/master.yml": "./json_schema/response/i2c/master.yml",
	"./response/i2c/slave.yml": "./json_schema/response/i2c/slave.yml",
	"./response/index.yml": "./json_schema/response/index.yml",
	"./response/io/get.yml": "./json_schema/response/io/get.yml",
	"./response/io/index.yml": "./json_schema/response/io/index.yml",
	"./response/logicanalyzer/data.yml": "./json_schema/response/logicanalyzer/data.yml",
	"./response/logicanalyzer/index.yml": "./json_schema/response/logicanalyzer/index.yml",
	"./response/measure/echo.yml": "./json_schema/response/measure/echo.yml",
	"./response/measure/index.yml": "./json_schema/response/measure/index.yml",
	"./response/message/index.yml": "./json_schema/response/message/index.yml",
	"./response/message/receive.yml": "./json_schema/response/message/receive.yml",
	"./response/spi/index.yml": "./json_schema/response/spi/index.yml",
	"./response/spi/read.yml": "./json_schema/response/spi/read.yml",
	"./response/switch/change.yml": "./json_schema/response/switch/change.yml",
	"./response/switch/index.yml": "./json_schema/response/switch/index.yml",
	"./response/system/index.yml": "./json_schema/response/system/index.yml",
	"./response/system/pong.yml": "./json_schema/response/system/pong.yml",
	"./response/uart/index.yml": "./json_schema/response/uart/index.yml",
	"./response/uart/receive.yml": "./json_schema/response/uart/receive.yml",
	"./response/ws/index.yml": "./json_schema/response/ws/index.yml",
	"./response/ws/ready.yml": "./json_schema/response/ws/ready.yml",
	"./response/ws/redirect.yml": "./json_schema/response/ws/redirect.yml"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./json_schema sync recursive \\.yml$";

/***/ }),

/***/ "./json_schema/index.yml":
/*!*******************************!*\
  !*** ./json_schema/index.yml ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/","definitions":{"pinSetting":{"id":"pinSetting","type":"integer","minimum":0,"maximum":11,"default":null,"example":[0,1,2,3,4,5,6]},"bleAdvertiseData":{"id":"bleAdvertiseData","type":"array","default":null,"maxItems":31,"example":[[2,1,26,7,9,83,97,109,112,108,101],[7,9,83,97,109,112,108,101]],"items":{"type":"integer","minimum":0,"maximum":255}},"dataArray32":{"id":"dataArray32","type":"array","default":null,"maxItems":32,"example":[[100,255,21,0,21]],"items":{"type":"integer","minimum":0,"maximum":255}},"dataArray1024":{"id":"dataArray1024","type":"array","default":null,"maxItems":1024,"example":[[100,255,21,0,21]],"items":{"type":"integer","minimum":0,"maximum":255}},"zerooneArray":{"id":"zerooneArray","type":"array","default":null,"description":"Binary data array represented in 0 1.","example":[[0,1,1,0,0,1,1,0],[0,0,1,0,0,0,0,0]],"items":{"type":"integer","minimum":0,"maximum":1}},"dataArray":{"id":"dataArray","type":"array","default":null,"description":"Binary data array.","example":[[16,34,242],[100,255,21,0,21]],"items":{"type":"integer","minimum":0,"maximum":255}},"imageData128x64":{"id":"imageData128x64","type":"array","description":"Image data bit array.","minItems":1024,"maxItems":1024,"example":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,255,240,56,0,0,0,0,0,0,0,0,0,0,0,0,7,255,224,120,0,0,0,0,0,0,0,0,0,0,0,0,63,255,192,240,0,0,0,0,0,0,0,0,0,0,0,0,127,255,129,248,0,0,0,0,0,0,0,0,0,0,0,1,255,255,3,254,0,0,0,0,0,0,0,0,0,0,0,3,255,254,7,255,0,0,0,0,0,0,0,0,0,0,0,15,255,252,15,255,128,0,0,0,0,0,0,0,0,0,0,31,255,248,31,255,192,0,0,0,0,0,0,0,0,0,0,63,255,240,63,255,224,0,0,0,0,0,0,0,0,0,0,63,255,224,127,255,240,0,0,0,0,0,0,0,0,0,0,127,255,192,255,255,248,0,0,0,0,0,0,0,0,0,0,255,255,129,255,255,252,0,0,0,0,0,0,0,0,0,1,255,255,3,255,255,254,0,0,0,0,0,0,0,0,0,1,255,254,7,255,255,254,0,0,0,0,0,0,0,0,0,3,255,252,15,255,255,255,0,0,0,0,0,0,0,0,0,7,255,248,31,255,255,255,0,0,0,0,0,0,0,0,0,7,255,240,63,255,255,255,128,0,0,0,0,0,0,0,0,7,255,224,127,193,255,255,128,0,0,0,0,0,0,0,0,15,252,64,255,128,255,255,128,0,0,0,0,0,0,0,0,15,240,1,255,0,127,255,0,0,0,0,0,0,0,0,0,15,224,3,254,0,127,254,14,0,0,0,0,0,0,0,0,31,224,7,254,0,63,252,30,0,0,0,0,0,0,0,0,31,224,7,254,0,63,248,60,0,0,0,0,0,0,0,0,31,192,7,254,0,63,240,120,0,0,0,0,0,0,0,0,31,192,7,254,0,127,224,240,0,0,0,0,0,0,0,0,31,224,7,252,0,127,193,224,0,0,0,0,0,0,0,0,31,224,15,248,0,255,131,224,0,0,0,0,0,0,0,0,31,240,31,240,39,255,7,224,0,0,0,0,0,0,0,0,31,252,63,224,127,254,15,224,0,0,0,0,0,0,0,0,31,255,255,192,255,252,31,224,0,0,0,0,0,0,0,0,31,255,255,129,255,248,63,224,0,0,0,0,0,0,0,0,31,255,255,3,255,240,127,224,0,0,0,0,0,0,0,0,31,255,254,7,255,224,255,224,0,0,0,0,0,0,0,0,31,255,252,15,255,193,255,192,0,0,0,0,0,0,0,0,15,255,248,31,255,131,255,192,0,0,0,0,0,0,0,0,15,255,240,63,255,7,255,192,0,0,0,0,0,0,0,0,15,255,224,127,254,15,255,192,0,0,0,0,0,0,0,0,15,255,192,255,252,31,255,128,0,0,0,0,0,0,0,0,7,255,129,255,0,63,255,128,0,0,0,0,0,0,0,0,7,255,3,254,0,127,255,0,0,0,0,0,0,0,0,0,3,254,7,252,0,255,255,0,0,0,0,0,0,0,0,0,3,252,15,252,0,255,254,0,0,0,0,0,0,0,0,0,1,248,31,252,0,255,254,0,0,0,0,0,0,0,0,0,0,240,63,252,0,255,252,0,0,0,0,0,0,0,0,0,0,224,127,252,0,255,252,0,0,0,0,0,0,0,0,0,0,64,255,252,0,255,248,0,0,0,0,0,0,0,0,0,0,1,255,254,1,255,240,0,0,0,0,0,0,0,0,0,0,3,255,255,3,255,224,0,0,0,0,0,0,0,0,0,0,7,255,255,255,255,192,0,0,0,0,0,0,0,0,0,0,15,255,255,255,255,128,0,0,0,0,0,0,0,0,0,0,31,255,255,255,254,0,0,0,0,0,0,0,0,0,0,0,12,255,255,255,252,0,0,0,0,0,0,0,0,0,0,0,0,63,255,255,240,0,0,0,0,0,0,0,0,0,0,0,0,15,255,255,192,0,0,0,0,0,0,0,0,0,0,0,0,3,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,63,224,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"items":{"type":"integer","minimum":0,"maximum":255}},"hexString":{"id":"hexString","type":"string","default":null,"pattern":"^([0-9a-fA-F]+)$","description":"Bluetooth device id.If it contain '-', it ignored.","example":"8d0fd8f9"},"uuid":{"id":"uuid","type":"string","pattern":"^([-0-9a-fA-F]+)$","minLength":4,"maxLength":36,"description":"Bluetooth uuid. If it contain '-', it ignored.","example":["e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e","8d3591bda71140fd8f9f00535fe57179","d822b53c","de44"]},"uuidOrNull":{"id":"uuidOrNull","type":["string","null"],"pattern":"^([-0-9a-fA-F]+)$","minLength":4,"maxLength":36,"description":"Bluetooth uuid. If it contain '-', it ignored.","example":["e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e","8d3591bda71140fd8f9f00535fe57179","d822b53c","de44",null]},"deviceAddress":{"id":"deviceAddress","type":"string","pattern":"^([0-9a-fA-F]+)$","minLength":12,"maxLength":12,"description":"Bluetooth device id. It's hexString cannot cointain '0x' or '-'.","example":"77e754ab8591"},"obnizId":{"id":"obnizId","type":["string","integer"],"pattern":"^[0-9]{4}-?[0-9]{4}$","minimum":0,"maximum":99999999,"description":"Obniz id. It can contain '-' or not.","example":["1234-5678",12345678]}}}

/***/ }),

/***/ "./json_schema/request/ad/deinit.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/ad/deinit.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/ad/index.yml":
/*!******************************************!*\
  !*** ./json_schema/request/ad/index.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad","basePath":"ad0","description":"available ad0~ad11","anyOf":[{"$ref":"/request/ad/get"},{"$ref":"/request/ad/deinit"}]}

/***/ }),

/***/ "./json_schema/request/ad/input.yml":
/*!******************************************!*\
  !*** ./json_schema/request/ad/input.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad/get","related":"/response/ad/get","desription":"enable & start ad module at io.","type":"object","required":["stream"],"properties":{"stream":{"type":"boolean","default":false,"description":"true to continuous notifying on voltage change."}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_get.yml":
/*!****************************************************************!*\
  !*** ./json_schema/request/ble/central/characteristic_get.yml ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_get","related":"/response/ble/central/characteristic_get","type":"object","required":["get_characteristics"],"properties":{"get_characteristics":{"type":"object","required":["address","service_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_read.yml":
/*!*****************************************************************!*\
  !*** ./json_schema/request/ble/central/characteristic_read.yml ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_read","related":"/response/ble/central/characteristic_read","type":"object","required":["read_characteristic"],"properties":{"read_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_write.yml":
/*!******************************************************************!*\
  !*** ./json_schema/request/ble/central/characteristic_write.yml ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_write","related":"/response/ble/central/characteristic_write","type":"object","required":["write_characteristic"],"properties":{"write_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"needResponse":{"type":"boolean","default":true}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/connect.yml":
/*!*****************************************************!*\
  !*** ./json_schema/request/ble/central/connect.yml ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/connect","related":"/response/ble/central/status_update","type":"object","required":["connect"],"properties":{"connect":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/descriptor_get.yml":
/*!************************************************************!*\
  !*** ./json_schema/request/ble/central/descriptor_get.yml ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/descriptor_get","related":"/response/ble/central/descriptor_get","type":"object","required":["get_descriptors"],"properties":{"get_descriptors":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/descriptor_read.yml":
/*!*************************************************************!*\
  !*** ./json_schema/request/ble/central/descriptor_read.yml ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/descriptor_read","related":"/response/ble/central/descriptor_read","type":"object","required":["read_descriptor"],"properties":{"read_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/descriptor_write.yml":
/*!**************************************************************!*\
  !*** ./json_schema/request/ble/central/descriptor_write.yml ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/descriptor_write","related":"/response/ble/central/descriptor_write","type":"object","required":["write_descriptor"],"properties":{"write_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"needResponse":{"type":"boolean","default":true}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/disconnect.yml":
/*!********************************************************!*\
  !*** ./json_schema/request/ble/central/disconnect.yml ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/disconnect","type":"object","required":["disconnect"],"properties":{"disconnect":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/index.yml":
/*!***************************************************!*\
  !*** ./json_schema/request/ble/central/index.yml ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central","basePath":"ble","description":"use obniz as central","anyOf":[{"$ref":"/request/ble/central/scan_start"},{"$ref":"/request/ble/central/scan_stop"},{"$ref":"/request/ble/central/connect"},{"$ref":"/request/ble/central/disconnect"},{"$ref":"/request/ble/central/service_get"},{"$ref":"/request/ble/central/characteristic_get"},{"$ref":"/request/ble/central/characteristic_read"},{"$ref":"/request/ble/central/characteristic_write"},{"$ref":"/request/ble/central/descriptor_get"},{"$ref":"/request/ble/central/descriptor_read"},{"$ref":"/request/ble/central/descriptor_write"}]}

/***/ }),

/***/ "./json_schema/request/ble/central/scan_start.yml":
/*!********************************************************!*\
  !*** ./json_schema/request/ble/central/scan_start.yml ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/scan_start","related":["/response/ble/central/scan","/response/ble/central/scan_finish"],"type":"object","required":["scan"],"properties":{"scan":{"type":"object","additionalProperties":false,"properties":{"duration":{"type":"integer","default":30}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/scan_stop.yml":
/*!*******************************************************!*\
  !*** ./json_schema/request/ble/central/scan_stop.yml ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/scan_stop","type":"object","required":["scan"],"properties":{"scan":{"type":"null"}}}

/***/ }),

/***/ "./json_schema/request/ble/central/service_get.yml":
/*!*********************************************************!*\
  !*** ./json_schema/request/ble/central/service_get.yml ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/service_get","related":"/response/ble/central/service_get","type":"object","required":["get_services"],"properties":{"get_services":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/ble/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble","basePath":"ble","anyOf":[{"$ref":"/request/ble/peripheral"},{"$ref":"/request/ble/central"}]}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/advertisement_start.yml":
/*!********************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/advertisement_start.yml ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/advertisement_start","related":"/response/ble/peripheral/status","type":"object","required":["advertisement"],"properties":{"advertisement":{"type":"object","required":["adv_data"],"additionalProperties":false,"properties":{"adv_data":{"$ref":"/bleAdvertiseData"},"scan_resp":{"$ref":"/bleAdvertiseData"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/advertisement_stop.yml":
/*!*******************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/advertisement_stop.yml ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/advertisement_stop","type":"object","required":["advertisement"],"properties":{"advertisement":{"type":"null"}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/characteristic_read.yml":
/*!********************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/characteristic_read.yml ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_read","description":"read characteristic on own service","related":"/response/ble/peripheral/characteristic_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["read_characteristic"],"properties":{"read_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/characteristic_write.yml":
/*!*********************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/characteristic_write.yml ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_write","description":"write characteristic on own service","related":"/response/ble/peripheral/characteristic_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["write_characteristic"],"properties":{"write_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/descriptor_read.yml":
/*!****************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/descriptor_read.yml ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/descriptor_read","related":"/response/ble/peripheral/descriptor_read","description":"read descriptor on own service","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["read_descriptor"],"properties":{"read_descriptor":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/descriptor_write.yml":
/*!*****************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/descriptor_write.yml ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/descriptor_write","related":"/response/ble/peripheral/descriptor_write","description":"write descriptor on own service","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["write_descriptor"],"properties":{"write_descriptor":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/index.yml":
/*!******************************************************!*\
  !*** ./json_schema/request/ble/peripheral/index.yml ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral","basePath":"ble","description":"use obniz as peripheral","anyOf":[{"$ref":"/request/ble/peripheral/advertisement_start"},{"$ref":"/request/ble/peripheral/advertisement_stop"},{"$ref":"/request/ble/peripheral/service_start"},{"$ref":"/request/ble/peripheral/service_stop"},{"$ref":"/request/ble/peripheral/characteristic_read"},{"$ref":"/request/ble/peripheral/characteristic_write"},{"$ref":"/request/ble/peripheral/descriptor_read"},{"$ref":"/request/ble/peripheral/descriptor_write"}]}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_start.yml":
/*!*************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/servie_start.yml ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_start","related":["/response/ble/peripheral/status","/response/ble/peripheral/characteristic_notify_read","/response/ble/peripheral/characteristic_notify_write","/response/ble/peripheral/descriptor_notify_read","/response/ble/peripheral/descriptor_notify_write"],"description":"callback of external device connected","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["services"],"properties":{"services":{"type":"array","minItems":1,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"characteristics":{"type":"array","minItems":0,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"descriptors":{"type":"array","minItems":0,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_stop.yml":
/*!************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/servie_stop.yml ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_stop","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"null"}}}

/***/ }),

/***/ "./json_schema/request/display/clear.yml":
/*!***********************************************!*\
  !*** ./json_schema/request/display/clear.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/clear","type":"object","required":["clear"],"properties":{"clear":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/display/index.yml":
/*!***********************************************!*\
  !*** ./json_schema/request/display/index.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display","basePath":"display","anyOf":[{"$ref":"/request/display/text"},{"$ref":"/request/display/clear"},{"$ref":"/request/display/qr"},{"$ref":"/request/display/raw"},{"$ref":"/request/display/pin_assign"}]}

/***/ }),

/***/ "./json_schema/request/display/pin_assign.yml":
/*!****************************************************!*\
  !*** ./json_schema/request/display/pin_assign.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/pin_assign","type":"object","required":["pin_assign"],"properties":{"pin_assign":{"type":"object","minProperties":1,"patternExample":[0,1,2,3],"patternProperties":{"^[0-9]$":{"type":"object","properties":{"module_name":{"type":"string","example":"io"},"pin_name":{"type":"string","example":"output"}}},"^1[0-1]$":{"type":"object","properties":{"module_name":{"type":"string","example":"io"},"pin_name":{"type":"string","example":"output"}}}}}}}

/***/ }),

/***/ "./json_schema/request/display/qr.yml":
/*!********************************************!*\
  !*** ./json_schema/request/display/qr.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/qr","type":"object","required":["qr"],"properties":{"qr":{"type":"object","required":["text"],"additionalProperties":false,"properties":{"text":{"type":"string","example":"Hello, obniz!"},"correction":{"type":"string","enum":["L","M","Q","H"],"default":"M"}}}}}

/***/ }),

/***/ "./json_schema/request/display/raw.yml":
/*!*********************************************!*\
  !*** ./json_schema/request/display/raw.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/raw","description":"1 bit represents 1 dot. 1=white, 0=black. 1 byte is part of one line. Order is same like.<br/> {1byte} {2byte} {3byte}...{16byte}<br/> {17byte} {18byte} {19byte}...<br/> .....<br/> .....................{1024byte}","type":"object","required":["raw"],"properties":{"raw":{"$ref":"/imageData128x64"}}}

/***/ }),

/***/ "./json_schema/request/display/text.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/display/text.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/text","type":"object","required":["text"],"properties":{"text":{"type":"string","example":"Hello, obniz!"}}}

/***/ }),

/***/ "./json_schema/request/i2c/deinit.yml":
/*!********************************************!*\
  !*** ./json_schema/request/i2c/deinit.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/i2c/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/i2c/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c","basePath":"i2c0","description":"available only i2c0","anyOf":[{"$ref":"/request/i2c/init_master"},{"$ref":"/request/i2c/init_slave"},{"$ref":"/request/i2c/write"},{"$ref":"/request/i2c/read"},{"$ref":"/request/i2c/deinit"}]}

/***/ }),

/***/ "./json_schema/request/i2c/init_master.yml":
/*!*************************************************!*\
  !*** ./json_schema/request/i2c/init_master.yml ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/init_master","description":"internal pullup is available. But, We recommend use external pull-up resistor.","type":"object","required":["mode","sda","scl","clock"],"uniqueKeys":["sda","scl"],"properties":{"mode":{"type":"string","enum":["master"]},"sda":{"$ref":"/pinSetting"},"scl":{"$ref":"/pinSetting"},"clock":{"type":"integer","description":"frequency (Hz)","minimum":1,"maximum":1000000}}}

/***/ }),

/***/ "./json_schema/request/i2c/init_slave.yml":
/*!************************************************!*\
  !*** ./json_schema/request/i2c/init_slave.yml ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/init_slave","related":"/response/i2c/slave","type":"object","required":["mode","sda","scl","slave_address"],"uniqueKeys":["sda","scl"],"properties":{"mode":{"type":"string","enum":["master","slave"]},"sda":{"$ref":"/pinSetting"},"scl":{"$ref":"/pinSetting"},"slave_address":{"type":"integer","minimum":0,"maximum":1023},"slave_address_length":{"type":"integer","enum":[7],"default":7},"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"data":{"$ref":"/dataArray"},"read":{"type":"integer","minimum":0}}}

/***/ }),

/***/ "./json_schema/request/i2c/read.yml":
/*!******************************************!*\
  !*** ./json_schema/request/i2c/read.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/read","description":"if address over 0b01111111; then address treated as 10bit address automatically. or specify address_bits: 10 to force 10bit address mode.","related":"/response/i2c/master","type":"object","required":["address","read"],"properties":{"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"read":{"type":"integer","minimum":0,"maximum":1024}}}

/***/ }),

/***/ "./json_schema/request/i2c/write.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/i2c/write.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/write","description":"if address over 0b01111111; then address treated as 10bit address automatically. or specify address_bits: 10 to force 10bit address mode.","type":"object","required":["address","data"],"properties":{"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"data":{"$ref":"/dataArray1024"}}}

/***/ }),

/***/ "./json_schema/request/index.yml":
/*!***************************************!*\
  !*** ./json_schema/request/index.yml ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request","type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"patternProperties":{"^io[0-9]$":{"$ref":"/request/io"},"^io1[0-1]$":{"$ref":"/request/io"},"^ad[0-9]$":{"$ref":"/request/ad"},"^ad1[0-1]$":{"$ref":"/request/ad"},"^pwm[0-5]$":{"$ref":"/request/pwm"},"^uart[0-1]$":{"$ref":"/request/uart"},"^spi[0-1]$":{"$ref":"/request/spi"},"^i2c0$":{"$ref":"/request/i2c"}},"properties":{"io":{"$ref":"/request/ioAnimation"},"ble":{"$ref":"/request/ble"},"switch":{"$ref":"/request/switch"},"display":{"$ref":"/request/display"},"measure":{"$ref":"/request/measure"},"message":{"$ref":"/request/message"},"logic_analyzer":{"$ref":"/request/logicAnalyzer"},"system":{"$ref":"/request/system"},"ws":{"$ref":"/request/ws"}}}}

/***/ }),

/***/ "./json_schema/request/io/deinit.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/io/deinit.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/io/index.yml":
/*!******************************************!*\
  !*** ./json_schema/request/io/index.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io","basePath":"io0","description":"General purpose IO available on each io (io0 to io11).","anyOf":[{"$ref":"/request/io/input"},{"$ref":"/request/io/input_detail"},{"$ref":"/request/io/output"},{"$ref":"/request/io/output_detail"},{"$ref":"/request/io/output_type"},{"$ref":"/request/io/pull_type"},{"$ref":"/request/io/deinit"}]}

/***/ }),

/***/ "./json_schema/request/io/input.yml":
/*!******************************************!*\
  !*** ./json_schema/request/io/input.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/input","related":"/response/io/get","type":"string","enum":["get"]}

/***/ }),

/***/ "./json_schema/request/io/input_detail.yml":
/*!*************************************************!*\
  !*** ./json_schema/request/io/input_detail.yml ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/input_detail","related":"/response/io/get","type":"object","required":["direction"],"properties":{"direction":{"type":"string","enum":["input"]},"stream":{"type":"boolean","default":false,"description":"enable stream callback when value change"}}}

/***/ }),

/***/ "./json_schema/request/io/output.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/io/output.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/output","type":"boolean"}

/***/ }),

/***/ "./json_schema/request/io/output_detail.yml":
/*!**************************************************!*\
  !*** ./json_schema/request/io/output_detail.yml ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/output_detail","type":"object","required":["direction","value"],"properties":{"direction":{"type":"string","enum":["output"]},"value":{"type":"boolean"}}}

/***/ }),

/***/ "./json_schema/request/io/output_type.yml":
/*!************************************************!*\
  !*** ./json_schema/request/io/output_type.yml ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/output_type","type":"object","required":["output_type"],"properties":{"output_type":{"type":"string","enum":["push-pull5v","push-pull3v","open-drain"],"description":"drive type"}}}

/***/ }),

/***/ "./json_schema/request/io/pull_type.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/io/pull_type.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/pull_type","type":"object","required":["pull_type"],"properties":{"pull_type":{"type":"string","enum":["pull-up5v","pull-up3v","pull-down","float"]}}}

/***/ }),

/***/ "./json_schema/request/ioanimation/changeState.yml":
/*!*********************************************************!*\
  !*** ./json_schema/request/ioanimation/changeState.yml ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation/changeState","type":"object","required":["animation"],"properties":{"animation":{"type":"object","required":["name","status"],"additionalProperties":false,"properties":{"name":{"type":"string","example":"anim-1","minLength":1,"maxLength":254},"status":{"type":"string","enum":["pause","resume"]}}}}}

/***/ }),

/***/ "./json_schema/request/ioanimation/index.yml":
/*!***************************************************!*\
  !*** ./json_schema/request/ioanimation/index.yml ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation","basePath":"io.animation","description":"io animation is hardware acceleration for serial sequence change of io. now 'loop' animation is avaiable. it loop io changes regarding json array.","anyOf":[{"$ref":"/request/ioAnimation/init"},{"$ref":"/request/ioAnimation/changeState"}]}

/***/ }),

/***/ "./json_schema/request/ioanimation/init.yml":
/*!**************************************************!*\
  !*** ./json_schema/request/ioanimation/init.yml ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation/init","commandExample":{"io":{"animation":{"animation":{"name":"anim-1","status":"loop","states":[{"duration":500,"state":{"io0":true}},{"duration":500,"state":{"io0":false}}]}}}},"type":"object","required":["animation"],"properties":{"animation":{"type":"object","required":["name","status","states"],"additionalProperties":false,"properties":{"name":{"type":"string","description":"Animation name to use pause/resume","example":"anim-1","minLength":1,"maxLength":254},"status":{"type":"string","default":"loop","enum":["loop"]},"states":{"type":"array","default":[],"items":{"type":"object","required":["duration","state"],"additionalProperties":false,"properties":{"duration":{"type":"integer","description":"State duration time(ms)","minimum":0,"maximum":60000,"multipleOf":0.001,"example":500},"state":{"type":"object","description":"io/pwm commands.","filter":"pass_all","example":[{"io0":true},{"io0":false}]}}}}}}}}

/***/ }),

/***/ "./json_schema/request/logicanalyzer/deinit.yml":
/*!******************************************************!*\
  !*** ./json_schema/request/logicanalyzer/deinit.yml ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/logicanalyzer/index.yml":
/*!*****************************************************!*\
  !*** ./json_schema/request/logicanalyzer/index.yml ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer","basePath":"logic_analyzer","description":"Monitor io logic level changes by sampling io.","anyOf":[{"$ref":"/request/logicAnalyzer/init"},{"$ref":"/request/logicAnalyzer/deinit"}]}

/***/ }),

/***/ "./json_schema/request/logicanalyzer/init.yml":
/*!****************************************************!*\
  !*** ./json_schema/request/logicanalyzer/init.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer/init","exampleDescription":"With below sample code, you will receive only datas which start with 'false, false, false' 3bit.","type":"object","required":["io","interval","duration"],"properties":{"io":{"type":"array","minItems":1,"maxItems":1,"items":{"$ref":"/pinSetting"}},"interval":{"type":"number","minimum":0,"multipleOf":0.001,"exclusiveMinimum":true},"duration":{"type":"integer","minimum":0,"exclusiveMinimum":true},"triger":{"type":"object","description":"Without this, logicanalyzer will start with any io level changes. trigger specify start position. ","additionalProperties":false,"required":["value","samples"],"default":{"value":false,"samples":0},"properties":{"value":{"description":"start value","type":"boolean","default":false},"samples":{"type":"integer","description":"how that values consists","minimum":0,"default":0,"example":3}}}}}

/***/ }),

/***/ "./json_schema/request/measure/echo.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/measure/echo.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/measure/echo","description":"It measures pulse response.","related":"/response/measure/echo","type":"object","required":["echo"],"properties":{"echo":{"type":"object","required":["io_pulse","io_echo","pulse_width"],"properties":{"io_pulse":{"$ref":"/pinSetting"},"io_echo":{"$ref":"/pinSetting"},"pulse":{"type":"string","default":"positive","enum":["positive","negative"]},"pulse_width":{"type":"number","minimum":0.001,"maximum":1000,"multipleOf":0.001},"measure_edges":{"type":"integer","minimum":1,"maximum":4},"timeout":{"type":"number","default":1000,"minimum":0.001,"maximum":1000,"multipleOf":0.001}}}}}

/***/ }),

/***/ "./json_schema/request/measure/index.yml":
/*!***********************************************!*\
  !*** ./json_schema/request/measure/index.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/measure","basePath":"measure","anyOf":[{"$ref":"/request/measure/echo"}]}

/***/ }),

/***/ "./json_schema/request/message/index.yml":
/*!***********************************************!*\
  !*** ./json_schema/request/message/index.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/message","basePath":"message","description":"send/receive with other obniz or webhook","anyOf":[{"$ref":"/request/message/send"}]}

/***/ }),

/***/ "./json_schema/request/message/send.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/message/send.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/message/send","related":"/response/message/receive","type":"object","additionalProperties":false,"required":["data","to"],"properties":{"data":{"example":"button pressed","description":"All type of data is pass."},"to":{"type":"array","minItems":1,"items":{"$ref":"/obnizId"}}}}

/***/ }),

/***/ "./json_schema/request/pwm/deinit.yml":
/*!********************************************!*\
  !*** ./json_schema/request/pwm/deinit.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/pwm/duty.yml":
/*!******************************************!*\
  !*** ./json_schema/request/pwm/duty.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/duty","type":"object","required":["duty"],"properties":{"duty":{"type":"number","description":"% of duty cycle","minimum":0,"maximum":100}}}

/***/ }),

/***/ "./json_schema/request/pwm/freq.yml":
/*!******************************************!*\
  !*** ./json_schema/request/pwm/freq.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/freq","type":"object","required":["freq"],"properties":{"freq":{"type":"integer","description":"frequency (Hz)","minimum":1,"maximum":80000000}}}

/***/ }),

/***/ "./json_schema/request/pwm/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/pwm/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm","basePath":"pwm0","description":"available 0 to 5","anyOf":[{"$ref":"/request/pwm/init"},{"$ref":"/request/pwm/freq"},{"$ref":"/request/pwm/pulse"},{"$ref":"/request/pwm/duty"},{"$ref":"/request/pwm/modulate"},{"$ref":"/request/pwm/deinit"}]}

/***/ }),

/***/ "./json_schema/request/pwm/init.yml":
/*!******************************************!*\
  !*** ./json_schema/request/pwm/init.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/init","type":"object","required":["io"],"properties":{"io":{"$ref":"/pinSetting"}}}

/***/ }),

/***/ "./json_schema/request/pwm/modulate.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/pwm/modulate.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/modulate","type":"object","required":["modulate"],"properties":{"modulate":{"type":"object","required":["type","symbol_length","data"],"additionalProperties":false,"properties":{"type":{"type":"string","enum":["am"]},"symbol_length":{"type":"number","minimum":0.05,"maximum":1000,"multipleOf":0.001,"description":"symbol width (ms)"},"data":{"$ref":"/zerooneArray"}}}}}

/***/ }),

/***/ "./json_schema/request/pwm/pulse.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/pwm/pulse.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/pulse","type":"object","required":["pulse"],"properties":{"pulse":{"type":"number","minimum":0,"multipleOf":0.001,"description":"pulse width (ms)"}}}

/***/ }),

/***/ "./json_schema/request/spi/deinit.yml":
/*!********************************************!*\
  !*** ./json_schema/request/spi/deinit.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/spi/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/spi/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi","basePath":"spi0","description":"available spi0, spi1","anyOf":[{"$ref":"/request/spi/init_master"},{"$ref":"/request/spi/deinit"},{"$ref":"/request/spi/write"}]}

/***/ }),

/***/ "./json_schema/request/spi/init_master.yml":
/*!*************************************************!*\
  !*** ./json_schema/request/spi/init_master.yml ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/init_master","description":"clk, miso, mosi are optional, but at least one are required","type":"object","required":["mode","clock"],"uniqueKeys":["mosi","miso","clk"],"properties":{"mode":{"type":"string","enum":["master"]},"clk":{"$ref":"/pinSetting"},"mosi":{"$ref":"/pinSetting"},"miso":{"$ref":"/pinSetting"},"clock":{"type":"integer","default":115200,"minimum":1,"maximum":26000000,"desription":"frequency (Hz)"}}}

/***/ }),

/***/ "./json_schema/request/spi/write.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/spi/write.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/write","related":"/response/spi/read","type":"object","required":["data","read"],"properties":{"data":{"$ref":"/dataArray32"},"read":{"type":"boolean","default":true,"description":"If false, write without receive"}}}

/***/ }),

/***/ "./json_schema/request/switch/get.yml":
/*!********************************************!*\
  !*** ./json_schema/request/switch/get.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/switch/get","related":"/response/switch/change","type":"string","enum":["get"]}

/***/ }),

/***/ "./json_schema/request/switch/index.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/switch/index.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/switch","basePath":"switch","description":"the switch embed on obniz itself. If it's state is changed, notification will be fired.","anyOf":[{"$ref":"/request/switch/get"}]}

/***/ }),

/***/ "./json_schema/request/system/index.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/system/index.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system","basePath":"system","anyOf":[{"$ref":"/request/system/wait"},{"$ref":"/request/system/reset"},{"$ref":"/request/system/reboot"},{"$ref":"/request/system/selfCheck"},{"$ref":"/request/system/keepWorkingAtOffline"},{"$ref":"/request/system/ping"}]}

/***/ }),

/***/ "./json_schema/request/system/keep_working_at_offline.yml":
/*!****************************************************************!*\
  !*** ./json_schema/request/system/keep_working_at_offline.yml ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/keepWorkingAtOffline","description":"reset obniz when obniz gone to offline.","type":"object","required":["keep_working_at_offline"],"properties":{"keep_working_at_offline":{"type":"boolean"}}}

/***/ }),

/***/ "./json_schema/request/system/ping.yml":
/*!*********************************************!*\
  !*** ./json_schema/request/system/ping.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/ping","response":"/response/system/pong","type":"object","required":["ping"],"properties":{"ping":{"type":"object","required":["key"],"properties":{"key":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/request/system/reboot.yml":
/*!***********************************************!*\
  !*** ./json_schema/request/system/reboot.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/reboot","type":"object","required":["reboot"],"properties":{"reboot":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/system/reset.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/system/reset.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/reset","type":"object","required":["reset"],"properties":{"reset":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/system/self_check.yml":
/*!***************************************************!*\
  !*** ./json_schema/request/system/self_check.yml ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/selfCheck","description":"circuit IO check","type":"object","required":["self_check"],"properties":{"self_check":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/system/wait.yml":
/*!*********************************************!*\
  !*** ./json_schema/request/system/wait.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/wait","type":"object","required":["wait"],"properties":{"wait":{"type":"integer","description":"wait time (ms)"}}}

/***/ }),

/***/ "./json_schema/request/uart/deinit.yml":
/*!*********************************************!*\
  !*** ./json_schema/request/uart/deinit.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/uart/index.yml":
/*!********************************************!*\
  !*** ./json_schema/request/uart/index.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart","basePath":"uart0","anyOf":[{"$ref":"/request/uart/init"},{"$ref":"/request/uart/send"},{"$ref":"/request/uart/deinit"}]}

/***/ }),

/***/ "./json_schema/request/uart/init.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/uart/init.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart/init","description":"available 0 to 1","type":"object","required":["rx","tx"],"uniqueKeys":["rx","tx","rts","cts"],"properties":{"rx":{"$ref":"/pinSetting"},"tx":{"$ref":"/pinSetting"},"baud":{"type":"integer","default":115200,"minimum":1,"maximum":5000000,"description":"baud rate (bps)"},"stop":{"type":"number","enum":[1,1.5,2],"default":1,"description":"stop bit width"},"bits":{"type":"integer","enum":[5,6,7,8],"default":8},"parity":{"type":"string","enum":["off","odd","even"],"default":"off"},"flowcontrol":{"type":"string","enum":["off","rts","cts","rts-cts"],"default":"off"},"rts":{"$ref":"/pinSetting"},"cts":{"$ref":"/pinSetting"}}}

/***/ }),

/***/ "./json_schema/request/uart/send.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/uart/send.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart/send","type":"object","required":["data"],"properties":{"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/request/ws/index.yml":
/*!******************************************!*\
  !*** ./json_schema/request/ws/index.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ws","basePath":"ws","anyOf":[{"$ref":"/request/ws/reset_obniz_on_ws_disconnection"}]}

/***/ }),

/***/ "./json_schema/request/ws/reset_obniz_on_ws_disconnection.yml":
/*!********************************************************************!*\
  !*** ./json_schema/request/ws/reset_obniz_on_ws_disconnection.yml ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ws/reset_obniz_on_ws_disconnection","type":"object","required":["reset_obniz_on_ws_disconnection"],"properties":{"reset_obniz_on_ws_disconnection":{"type":"boolean","default":false}}}

/***/ }),

/***/ "./json_schema/response/ad/get.yml":
/*!*****************************************!*\
  !*** ./json_schema/response/ad/get.yml ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ad/get","type":"number","example":3.3,"minimum":0,"maximum":5,"description":"current value (volt)"}

/***/ }),

/***/ "./json_schema/response/ad/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/response/ad/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ad","basePath":"ad0","anyOf":[{"$ref":"/response/ad/get"}]}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_get.yml":
/*!*****************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_get.yml ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_get","type":"object","required":["get_characteristic_result"],"properties":{"get_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_read.yml":
/*!******************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_read.yml ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_read","type":"object","required":["read_characteristic_result"],"properties":{"read_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_write.yml":
/*!*******************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_write.yml ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_write","type":"object","required":["write_characteristic_result"],"properties":{"write_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_get.yml":
/*!*************************************************************!*\
  !*** ./json_schema/response/ble/central/descriptor_get.yml ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_get","type":"object","required":["get_descriptors_result"],"properties":{"get_descriptors_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_read.yml":
/*!**************************************************************!*\
  !*** ./json_schema/response/ble/central/descriptor_read.yml ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_read","type":"object","required":["read_descriptor_result"],"properties":{"read_descriptor_results":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_write.yml":
/*!***************************************************************!*\
  !*** ./json_schema/response/ble/central/descriptor_write.yml ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_write","type":"object","required":["write_descriptor_result"],"properties":{"write_descriptor_results":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/error.yml":
/*!****************************************************!*\
  !*** ./json_schema/response/ble/central/error.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/error","type":"object","required":["error"],"properties":{"error":{"type":"object","required":["error_code","message"],"additionalProperties":false,"properties":{"error_code":{"type":"integer","example":0},"message":{"type":"string","example":"ERROR MESSAGE"},"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuidOrNull"},"characteristic_uuid":{"$ref":"/uuidOrNull"},"descriptor_uuid":{"$ref":"/uuidOrNull"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/index.yml":
/*!****************************************************!*\
  !*** ./json_schema/response/ble/central/index.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central","basePath":"ble","anyOf":[{"$ref":"/response/ble/central/scan"},{"$ref":"/response/ble/central/scan_finish"},{"$ref":"/response/ble/central/status_update"},{"$ref":"/response/ble/central/service_get"},{"$ref":"/response/ble/central/characteristic_get"},{"$ref":"/response/ble/central/characteristic_write"},{"$ref":"/response/ble/central/characteristic_read"},{"$ref":"/response/ble/central/descriptor_get"},{"$ref":"/response/ble/central/descriptor_write"},{"$ref":"/response/ble/central/descriptor_read"},{"$ref":"/response/ble/central/error"}]}

/***/ }),

/***/ "./json_schema/response/ble/central/scan.yml":
/*!***************************************************!*\
  !*** ./json_schema/response/ble/central/scan.yml ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/scan","type":"object","required":["scan_result"],"properties":{"scan_result":{"type":"object","required":["event_type"],"additionalProperties":false,"properties":{"event_type":{"type":"string","enum":["inquiry_result"]},"address":{"$ref":"/deviceAddress"},"ble_event_type":{"type":"string","enum":["connectable_advertisemnt","connectable_directed_advertisemnt","scannable_advertising","non_connectable_advertising","scan_response"]},"device_type":{"type":"string","enum":["ble","dumo","breder"]},"address_type":{"type":"string","enum":["public","random","rpa_public","rpa_random"]},"flag":{"type":"integer","minimum":0},"rssi":{"type":"integer","maximum":0},"adv_data":{"$ref":"/bleAdvertiseData"},"scan_resp":{"$ref":"/bleAdvertiseData"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/scan_finish.yml":
/*!**********************************************************!*\
  !*** ./json_schema/response/ble/central/scan_finish.yml ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/scan_finish","type":"object","required":["scan_result"],"properties":{"scan_result":{"type":"object","required":["event_type"],"additionalProperties":false,"properties":{"event_type":{"type":"string","enum":["inquiry_complete"]}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/service_get.yml":
/*!**********************************************************!*\
  !*** ./json_schema/response/ble/central/service_get.yml ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/service_get","type":"object","required":["get_service_result"],"properties":{"get_service_result":{"type":"object","required":["address","service_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/status_update.yml":
/*!************************************************************!*\
  !*** ./json_schema/response/ble/central/status_update.yml ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/status_update","type":"object","required":["status_update"],"properties":{"status_update":{"type":"object","required":["address","status"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"status":{"type":"string","enum":["connected","disconnected"]}}}}}

/***/ }),

/***/ "./json_schema/response/ble/index.yml":
/*!********************************************!*\
  !*** ./json_schema/response/ble/index.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble","basePath":"ble","anyOf":[{"$ref":"/response/ble/central"},{"$ref":"/response/ble/peripheral"}]}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_notify_read.yml":
/*!****************************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/characteristic_notify_read.yml ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_notify_read","description":"callback of external device read characteristic","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_read_characteristic"],"properties":{"notify_read_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_notify_write.yml":
/*!*****************************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/characteristic_notify_write.yml ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_notify_write","description":"callback of external device write characteristic","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_write_characteristic"],"properties":{"notify_write_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_read.yml":
/*!*********************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/characteristic_read.yml ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_read","description":"callback of read characteristic","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["read_characteristic_result"],"properties":{"read_characteristic_result":{"type":"object","required":["service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_write.yml":
/*!**********************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/characteristic_write.yml ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_write","description":"callback of write characteristic","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["write_characteristic_result"],"properties":{"write_characteristic_result":{"type":"object","required":["service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_notify_read.yml":
/*!************************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_notify_read.yml ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_notify_read","description":"callback of external device read descriptor","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_read_descriptor"],"properties":{"notify_read_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_notify_write.yml":
/*!*************************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_notify_write.yml ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_notify_write","description":"callback of external device write descriptor","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_write_descriptor"],"properties":{"notify_write_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_read.yml":
/*!*****************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_read.yml ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_read","description":"callback of read descriptor","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["read_descriptor_result"],"properties":{"read_descriptor_result":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_write.yml":
/*!******************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_write.yml ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_write","description":"callback of write descriptor","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["write_descriptor_result"],"properties":{"write_descriptor_result":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/index.yml":
/*!*******************************************************!*\
  !*** ./json_schema/response/ble/peripheral/index.yml ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral","basePath":"ble","anyOf":[{"$ref":"/response/ble/peripheral/status"},{"$ref":"/response/ble/peripheral/characteristic_read"},{"$ref":"/response/ble/peripheral/characteristic_write"},{"$ref":"/response/ble/peripheral/characteristic_notify_read"},{"$ref":"/response/ble/peripheral/characteristic_notify_write"},{"$ref":"/response/ble/peripheral/descriptor_read"},{"$ref":"/response/ble/peripheral/descriptor_write"},{"$ref":"/response/ble/peripheral/descriptor_notify_read"},{"$ref":"/response/ble/peripheral/descriptor_notify_write"}]}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/status.yml":
/*!********************************************************!*\
  !*** ./json_schema/response/ble/peripheral/status.yml ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/status","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["connection_status"],"properties":{"connection_status":{"type":"object","required":["address","status"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"status":{"type":"string","enum":["connected","disconnected"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/debug/error.yml":
/*!**********************************************!*\
  !*** ./json_schema/response/debug/error.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug/error","desccription":"global error","type":"object","required":["error"],"properties":{"error":{"type":"object","additionalProperties":true,"properties":{"message":{"description":"readable message","type":"string","example":"voltage down"}}}}}

/***/ }),

/***/ "./json_schema/response/debug/index.yml":
/*!**********************************************!*\
  !*** ./json_schema/response/debug/index.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug","basePath":"debug","anyOf":[{"$ref":"/response/debug/warning"},{"$ref":"/response/debug/error"}]}

/***/ }),

/***/ "./json_schema/response/debug/warning.yml":
/*!************************************************!*\
  !*** ./json_schema/response/debug/warning.yml ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug/warning","desccription":"global warnings","type":"object","required":["warning"],"properties":{"warning":{"type":"object","additionalProperties":true,"properties":{"message":{"description":"readable message","type":"string","example":"unknown command"}}}}}

/***/ }),

/***/ "./json_schema/response/i2c/index.yml":
/*!********************************************!*\
  !*** ./json_schema/response/i2c/index.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/i2c","basePath":"i2c0","anyOf":[{"$ref":"/response/i2c/master"},{"$ref":"/response/i2c/slave"}]}

/***/ }),

/***/ "./json_schema/response/i2c/master.yml":
/*!*********************************************!*\
  !*** ./json_schema/response/i2c/master.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/i2c/master","type":"object","required":["mode","address","data"],"properties":{"mode":{"type":"string","enum":["master"]},"address":{"type":"integer","minimum":0,"maximum":1023},"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/i2c/slave.yml":
/*!********************************************!*\
  !*** ./json_schema/response/i2c/slave.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/i2c/slave","type":"object","required":["mode","address","is_fragmented","data"],"properties":{"mode":{"type":"string","enum":["slave"]},"address":{"type":"integer","minimum":0,"maximum":1023},"is_fragmented":{"type":"boolean"},"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/index.yml":
/*!****************************************!*\
  !*** ./json_schema/response/index.yml ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response","type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"patternProperties":{"^io[0-9]$":{"$ref":"/response/io"},"^io1[0-1]$":{"$ref":"/response/io"},"^ad[0-9]$":{"$ref":"/response/ad"},"^ad1[0-1]$":{"$ref":"/response/ad"},"^uart[0-1]$":{"$ref":"/response/uart"},"^spi[0-1]$":{"$ref":"/response/spi"},"^i2c0$":{"$ref":"/response/i2c"}},"properties":{"switch":{"$ref":"/response/switch"},"ble":{"$ref":"/response/ble"},"measure":{"$ref":"/response/measure"},"message":{"$ref":"/response/message"},"logic_analyzer":{"$ref":"/response/logicAnalyzer"},"system":{"$ref":"/response/system"},"debug":{"$ref":"/response/debug"},"ws":{"$ref":"/response/ws"}}}}

/***/ }),

/***/ "./json_schema/response/io/get.yml":
/*!*****************************************!*\
  !*** ./json_schema/response/io/get.yml ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/io/get","type":"boolean"}

/***/ }),

/***/ "./json_schema/response/io/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/response/io/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/io","basePath":"io0","anyOf":[{"$ref":"/response/io/get"}]}

/***/ }),

/***/ "./json_schema/response/logicanalyzer/data.yml":
/*!*****************************************************!*\
  !*** ./json_schema/response/logicanalyzer/data.yml ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/logicAnalyzer/data","type":"object","required":["data"],"properties":{"data":{"$ref":"/zerooneArray"}}}

/***/ }),

/***/ "./json_schema/response/logicanalyzer/index.yml":
/*!******************************************************!*\
  !*** ./json_schema/response/logicanalyzer/index.yml ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/logicAnalyzer","basePath":"logic_analyzer","anyOf":[{"$ref":"/response/logicAnalyzer/data"}]}

/***/ }),

/***/ "./json_schema/response/measure/echo.yml":
/*!***********************************************!*\
  !*** ./json_schema/response/measure/echo.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/measure/echo","type":"object","required":["echo"],"properties":{"echo":{"type":"array","minItesm":1,"items":{"type":"object","required":["edge","timing"],"properties":{"edge":{"type":"boolean","description":"rising = true"},"timing":{"type":"number","description":"msec from end of pulse"}}}}}}

/***/ }),

/***/ "./json_schema/response/measure/index.yml":
/*!************************************************!*\
  !*** ./json_schema/response/measure/index.yml ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/measure","basePath":"measure","anyOf":[{"$ref":"/response/measure/echo"}]}

/***/ }),

/***/ "./json_schema/response/message/index.yml":
/*!************************************************!*\
  !*** ./json_schema/response/message/index.yml ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/message","basePath":"message","anyOf":[{"$ref":"/response/message/receive"}]}

/***/ }),

/***/ "./json_schema/response/message/receive.yml":
/*!**************************************************!*\
  !*** ./json_schema/response/message/receive.yml ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/message/receive","related":"/request/message/send","type":"object","required":["data","from"],"properties":{"data":{"example":"button pressed","description":"All type of data is pass."},"from":{"type":["string","null"],"example":"1234-5678","description":"From obniz id. Null is used when webhook message."}}}

/***/ }),

/***/ "./json_schema/response/spi/index.yml":
/*!********************************************!*\
  !*** ./json_schema/response/spi/index.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/spi","basePath":"spi0","anyOf":[{"$ref":"/response/spi/read"}]}

/***/ }),

/***/ "./json_schema/response/spi/read.yml":
/*!*******************************************!*\
  !*** ./json_schema/response/spi/read.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/spi/read","type":"object","required":["data"],"properties":{"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/switch/change.yml":
/*!************************************************!*\
  !*** ./json_schema/response/switch/change.yml ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/switch/change","desccription":"value cahnges are always notified.","type":"object","required":["state"],"properties":{"state":{"type":"string","enum":["none","push","left","right"]},"action":{"type":"string","enum":["get"],"description":"this is optional and added when user request"}}}

/***/ }),

/***/ "./json_schema/response/switch/index.yml":
/*!***********************************************!*\
  !*** ./json_schema/response/switch/index.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/switch","basePath":"switch","anyOf":[{"$ref":"/response/switch/change"}]}

/***/ }),

/***/ "./json_schema/response/system/index.yml":
/*!***********************************************!*\
  !*** ./json_schema/response/system/index.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/system","basePath":"system","anyOf":[{"$ref":"/response/system/pong"}]}

/***/ }),

/***/ "./json_schema/response/system/pong.yml":
/*!**********************************************!*\
  !*** ./json_schema/response/system/pong.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/system/pong","desccription":"pong response with same key of ping request","type":"object","required":["pong"],"properties":{"pong":{"type":"object","required":["key"],"properties":{"key":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/uart/index.yml":
/*!*********************************************!*\
  !*** ./json_schema/response/uart/index.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/uart","basePath":"uart0","anyOf":[{"$ref":"/response/uart/receive"}]}

/***/ }),

/***/ "./json_schema/response/uart/receive.yml":
/*!***********************************************!*\
  !*** ./json_schema/response/uart/receive.yml ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/uart/receive","type":"object","properties":{"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/ws/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/response/ws/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws","basePath":"ws","anyOf":[{"$ref":"/response/ws/ready"},{"$ref":"/response/ws/redirect"}]}

/***/ }),

/***/ "./json_schema/response/ws/ready.yml":
/*!*******************************************!*\
  !*** ./json_schema/response/ws/ready.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws/ready","description":"all things ready","type":"object","required":["ready"],"properties":{"ready":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/response/ws/redirect.yml":
/*!**********************************************!*\
  !*** ./json_schema/response/ws/redirect.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws/redirect","description":"If the server required you to connect other endpoint to communicate with your obniz. This json will be sent.","type":"object","required":["redirect"],"properties":{"redirect":{"type":"string","example":"wss://ws1.obniz.io","description":"The url you should redirect to."}}}

/***/ }),

/***/ "./obniz sync recursive":
/*!********************!*\
  !*** ./obniz sync ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./obniz sync recursive";

/***/ }),

/***/ "./obniz/index.js":
/*!************************!*\
  !*** ./obniz/index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ObnizBLE = __webpack_require__(/*! ./libs/embeds/ble/ble */ "./obniz/libs/embeds/ble/ble.js");

const Display = __webpack_require__(/*! ./libs/embeds/display */ "./obniz/libs/embeds/display.js");
const ObnizSwitch = __webpack_require__(/*! ./libs/embeds/switch */ "./obniz/libs/embeds/switch.js");

const LogicAnalyzer = __webpack_require__(/*! ./libs/measurements/logicanalyzer */ "./obniz/libs/measurements/logicanalyzer.js");
const ObnizMeasure = __webpack_require__(/*! ./libs/measurements/measure */ "./obniz/libs/measurements/measure.js");

const PeripheralAD = __webpack_require__(/*! ./libs/io_peripherals/ad */ "./obniz/libs/io_peripherals/ad.js");
const PeripheralI2C = __webpack_require__(/*! ./libs/io_peripherals/i2c */ "./obniz/libs/io_peripherals/i2c.js");
const PeripheralIO = __webpack_require__(/*! ./libs/io_peripherals/io */ "./obniz/libs/io_peripherals/io.js");
const PeripheralIO_ = __webpack_require__(/*! ./libs/io_peripherals/io_ */ "./obniz/libs/io_peripherals/io_.js");
const PeripheralPWM = __webpack_require__(/*! ./libs/io_peripherals/pwm */ "./obniz/libs/io_peripherals/pwm.js");
const PeripheralSPI = __webpack_require__(/*! ./libs/io_peripherals/spi */ "./obniz/libs/io_peripherals/spi.js");
const PeripheralUART = __webpack_require__(/*! ./libs/io_peripherals/uart */ "./obniz/libs/io_peripherals/uart.js");

const ObnizUtil = __webpack_require__(/*! ./libs/utils/util */ "./obniz/libs/utils/util.js");

const WSCommand = __webpack_require__(/*! ./libs/wscommand */ "./obniz/libs/wscommand/index.js");

/* global showObnizDebugError  */

let isNode = typeof window === 'undefined';

class Obniz {

  constructor(id, options) {
    this.isNode = isNode;
    this.apiversion = 1;
    this.id = id;
    this.socket = null;
    this.debugprint = false;
    this.debugs = [];
    this.pongObservers = [];

    this.bufferdAmoundWarnBytes = 100 * 1000; // 100k bytes

    this.init();

    if (!options) {
      options = {};
    }
    this.server_obnizio = options.obniz_server || "wss://obniz.io";
    this._access_token = options.access_token;
    this.debugDomId = options.debug_dom_id || "obniz-debug";
    this.auto_connect = typeof options.auto_connect === "boolean" ? options.auto_connect : true;

    if (options.binary !== false) {
      this.wscommand = this.constructor.WSCommand;
      let classes = this.constructor.WSCommand.CommandClasses;
      this.wscommands = [];
      for (let class_name in classes) {
        this.wscommands.push(new classes[class_name]());
      }
    }

    if (this.isNode === false) {
      this.showOffLine();
    }

    if (!this.isValidObnizId(this.id)) {
      if (isNode) {
        this.error("invalid obniz id");
      } else {
        let filled = _ReadCookie("obniz-last-used") || "";
        this.prompt(filled, function (obnizid) {
          this.id = obnizid;
          this.showOffLine();
          this.wsconnect();
        }.bind(this));
      }
      return;
    }

    if (this.auto_connect) {
      this.wsconnect();
    }
  }

  static get version() {
    let packageJson = __webpack_require__(/*! ../package.json */ "./package.json");
    return packageJson.version;
  }

  static get WSCommand() {
    return WSCommand;
  }

  isValidObnizId(str) {
    if (typeof str != "string" || str.length < 8) {
      return null;
    }
    str = str.replace("-", "");
    let id = parseInt(str);
    if (isNaN(id)) id = null;
    return id != null;
  }

  prompt(filled, callback) {
    var obnizid = prompt("Please enter obniz id", filled);
    if (!obnizid) {} else {
      callback(obnizid);
    }
  }

  wsOnOpen() {
    this.print_debug("ws connected");
    // wait for {ws:{ready:true}} object
    if (typeof this.onopen === "function") {
      this.onopen(this);
    }
  }

  binary2Json(binary) {
    let data = new Uint8Array(binary);
    let json = [];
    while (true) {
      const frame = WSCommand.dequeueOne(data);
      if (!frame) break;
      let obj = {};
      for (var i = 0; i < this.wscommands.length; i++) {
        const command = this.wscommands[i];
        if (command.module === frame.module) {
          command.notifyFromBinary(obj, frame.func, frame.payload);
          break;
        }
      }
      json.push(obj);
      data = frame.next;
    }
    return json;
  }

  wsOnMessage(data) {
    let json;
    if (typeof data === "string") {
      json = JSON.parse(data);
    } else if (this.wscommands) {
      //binary
      json = this.binary2Json(data);
    }

    if (Array.isArray(json)) {
      for (let i in json) {
        this.notifyToModule(json[i]);
      }
    } else {
      //invalid json
    }
  }

  notifyToModule(obj) {
    this.print_debug(JSON.stringify(obj));

    // notify messaging
    if (typeof obj.message === "object" && this.onmessage) {
      this.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof obj.debug === "object") {
      if (obj.debug.warning) {
        let msg = "Warning: " + obj.debug.warning.message;
        this.warning({ alert: 'warning', message: msg });
      }

      if (obj.debug.error) {
        let msg = "Error: " + obj.debug.error.message;
        this.error({ alert: 'error', message: msg });
      }
      if (this.ondebug) {
        this.ondebug(obj.debug);
      }
    }
    // ws command
    if (obj["ws"]) {
      this.handleWSCommand(obj["ws"]);
      return;
    }
    if (obj["system"]) {
      this.handleSystemCommand(obj["system"]);
      return;
    }

    // notify
    let notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
    for (let handerIndex = 0; handerIndex < notifyHandlers.length; handerIndex++) {
      let i = -1;
      let peripheral = notifyHandlers[handerIndex];
      while (true) {
        i++;
        if (this[peripheral + "" + i] === undefined) {
          break;
        }
        let module_value = obj[peripheral + "" + i];
        if (module_value === undefined) continue;
        this[peripheral + "" + i].notified(module_value);
      }
    }
    let names = ["switch", "ble", "measure"];
    for (let i = 0; i < names.length; i++) {
      if (obj[names[i]]) {
        this[names[i]].notified(obj[names[i]]);
      }
    }
    if (obj.logic_analyzer) {
      this.logicAnalyzer.notified(obj.logic_analyzer);
    }
  }

  wsOnClose(event) {
    this.print_debug("closed");
    if (this.isNode === false) {
      this.showOffLine();
    }
    if (this.looper) {
      this.looper = null;
    }

    this.clearSocket(this.socket);

    if (typeof this.onclose === "function") {
      this.onclose(this);
    }

    if (this.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), 1000);
    }
  }

  wsOnError(event) {
    console.error("websocket error.");
  }

  wsOnUnexpectedResponse(req, res) {
    let reconnectTime = 1000;
    if (res && res.statusCode == 404) {
      // obniz not online
      this.print_debug("obniz not online");
    } else {
      // servder error or someting
      reconnectTime = 5000;
      this.print_debug( true ? res.statusCode : undefined);
    }
    this.clearSocket(this.socket);
    if (this.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), reconnectTime);
    }
  }

  wsconnect(desired_server) {
    let server = this.server_obnizio;
    if (desired_server) {
      server = "" + desired_server;
    }
    if (this.socket) {
      this.socket.close();
      this.clearSocket(this.socket);
    }
    let url = server + "/obniz/" + this.id + "/ws/" + this.apiversion;
    if (this.constructor.version) {
      url += "?obnizjs=" + this.constructor.version;
    }
    if (this._access_token) {
      url += "&access_token=" + this._access_token;
    }
    if (this.wscommand) {
      url += "&accept_binary=true";
    }
    this.print_debug("connecting to " + url);

    if (this.isNode) {
      const wsClient = __webpack_require__(/*! ws */ "ws");
      this.socket = new wsClient(url);
      this.socket.on('open', this.wsOnOpen.bind(this));
      this.socket.on('message', this.wsOnMessage.bind(this));
      this.socket.on('close', this.wsOnClose.bind(this));
      this.socket.on('error', this.wsOnError.bind(this));
      this.socket.on('unexpected-response', this.wsOnUnexpectedResponse.bind(this));
    } else {
      this.socket = new WebSocket(url);
      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = this.wsOnOpen.bind(this);
      this.socket.onmessage = function (event) {
        this.wsOnMessage(event.data);
      }.bind(this);
      this.socket.onclose = this.wsOnClose.bind(this);
      this.socket.onerror = this.wsOnError.bind(this);
    }
  }

  clearSocket(socket) {
    /* send queue */
    if (this._sendQueueTimer) {
      delete this._sendQueue;
      clearTimeout(this._sendQueueTimer);
      this._sendQueueTimer = null;
    }
    /* unbind */
    if (this.isNode) {
      let shouldRemoveObservers = ['open', 'message', 'close', 'error'];
      for (let i = 0; i < shouldRemoveObservers.length; i++) {
        socket.removeAllListeners(shouldRemoveObservers[i]);
      }
    } else {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    }
    this.socket = null;
  }

  connect() {
    this.wsconnect();
  }

  close() {
    if (this.socket) {
      this._drainQueued();
      this.socket.close(1000, 'close');
      this.clearSocket(this.socket);
    }
  }

  wired(partsname) {
    let parts = new _parts[partsname]();
    if (!parts) {
      throw new Error("No such a parts [" + partsname + "] found");
      return;
    }
    let args = Array.from(arguments);
    args.shift();
    args.unshift(this);
    if (parts.keys) {
      if (parts.requiredKeys) {
        let err = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
        if (err) {
          throw new Error(partsname + " wired param '" + err + "' required, but not found ");
          return;
        }
      }
      parts.params = ObnizUtil._keyFilter(args[1], parts.keys);
    }
    parts.obniz = this;
    parts.wired.apply(parts, args);
    if (parts.keys || parts.ioKeys) {
      let keys = parts.ioKeys || parts.keys;
      let displayPartsName = parts.displayName || partsname;
      let ioNames = {};
      for (let index in keys) {
        let pinName = keys[index];
        let io = args[1][pinName];
        if (parts.displayIoNames && parts.displayIoNames[pinName]) {
          pinName = parts.displayIoNames[pinName];
        }
        ioNames[io] = pinName;
      }
      this.display.setPinNames(displayPartsName, ioNames);
    }
    return parts;
  }

  print_debug(str) {
    if (this.debugprint) {
      console.log("Obniz: " + str);
    }
  }

  send(obj) {
    if (!obj || typeof obj !== "object") {
      console.log("obnizjs. didnt send ", obj);
      return;
    }
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        this.send(obj[i]);
      }
      return;
    }
    if (this.sendPool) {
      this.sendPool.push(obj);return;
    }

    let sendData = JSON.stringify([obj]);
    /* compress */
    if (this.wscommand) {
      let compressed;
      try {
        compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData)[0]);
        if (compressed) {
          sendData = compressed;
        }
      } catch (e) {
        this.error('------ errored json -------');
        this.error(sendData);
        throw e;
      }
    }
    if (this.debugprint) {
      this.print_debug("send: " + (typeof sendData === "string" ? sendData : JSON.stringify(obj)));
    }
    /* queue sending */
    if (typeof sendData === "string") {
      this._drainQueued();
      this.socket.send(sendData);
    } else {
      if (this._sendQueue) {
        this._sendQueue.push(sendData);
      } else {
        this._sendQueue = [sendData];
        this._sendQueueTimer = setTimeout(this._drainQueued.bind(this), 1);
      }
    }
  }

  _drainQueued() {
    if (!this._sendQueue) return;
    let expectSize = 0;
    for (let i = 0; i < this._sendQueue.length; i++) {
      expectSize += this._sendQueue[i].length;
    }
    let filled = 0;
    let sendData = new Uint8Array(expectSize);
    for (let i = 0; i < this._sendQueue.length; i++) {
      sendData.set(this._sendQueue[i], filled);
      filled += this._sendQueue[i].length;
    }
    this.socket.send(sendData);
    delete this._sendQueue;
    clearTimeout(this._sendQueueTimer);
    this._sendQueueTimer = null;

    if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
      this.error('Warning: over ' + this.socket.bufferedAmount + ' bytes queued');
    }
  }

  init() {
    this.io = new PeripheralIO_(this);
    for (let i = 0; i < 12; i++) {
      this["io" + i] = new PeripheralIO(this, i);
    }
    for (let i = 0; i < 12; i++) {
      this["ad" + i] = new PeripheralAD(this, i);
    }
    for (let i = 0; i < 2; i++) {
      this["uart" + i] = new PeripheralUART(this, i);
    }
    for (let i = 0; i < 2; i++) {
      this["spi" + i] = new PeripheralSPI(this, i);
    }
    for (let i = 0; i < 1; i++) {
      this["i2c" + i] = new PeripheralI2C(this, i);
    }
    for (let i = 0; i < 6; i++) {
      this["pwm" + i] = new PeripheralPWM(this, i);
    }

    this.display = new Display(this);
    this.switch = new ObnizSwitch(this);
    this.logicAnalyzer = new LogicAnalyzer(this);
    this.ble = new ObnizBLE(this);
    this.measure = new ObnizMeasure(this);

    this.util = new ObnizUtil(this);
  }

  isValidIO(io) {
    return typeof io === "number" && io >= 0 && io < 12;
  }

  setVccGnd(vcc, gnd, drive) {
    if (this.isValidIO(vcc)) {
      if (drive) {
        this.getIO(vcc).drive(drive);
      }
      this.getIO(vcc).output(true);
    }

    if (this.isValidIO(gnd)) {
      if (drive) {
        this.getIO(gnd).drive(drive);
      }
      this.getIO(gnd).output(false);
    }
  }

  getIO(io) {
    if (!this.isValidIO(io)) {
      throw new Error('io ' + io + ' is not valid io');
    }
    return this["io" + io];
  }

  getAD(io) {
    if (!this.isValidIO(io)) {
      throw new Error('ad ' + io + ' is not valid io');
    }
    return this["ad" + io];
  }

  getFreePwm() {
    let i = 0;
    while (true) {
      let pwm = this["pwm" + i];
      if (!pwm) {
        break;
      }
      if (!pwm.isUsed()) {
        pwm.used = true;
        return pwm;
      }
      i++;
    }
    throw new Error("No More PWM Available. max = " + i);
  }

  getFreeI2C() {
    let i = 0;
    while (true) {
      let i2c = this["i2c" + i];
      if (!i2c) {
        break;
      }
      if (!i2c.isUsed()) {
        i2c.used = true;
        return i2c;
      }
      i++;
    }
    throw new Error("No More I2C Available. max = " + i);
  }

  getI2CWithConfig(config) {
    if (typeof config !== "object") {
      throw new Error("getI2CWithConfig need config arg");
    }
    if (config.i2c) {
      return config.i2c;
    }
    let i2c = this.getFreeI2C();
    i2c.start(config);
    return i2c;
  }

  getFreeSpi() {
    let i = 0;
    while (true) {
      let spi = this["spi" + i];
      if (!spi) {
        break;
      }
      if (!spi.isUsed()) {
        spi.used = true;
        return spi;
      }
      i++;
    }
    throw new Error("No More SPI Available. max = " + i);
  }

  getSpiWithConfig(config) {
    if (typeof config !== "object") {
      throw new Error("getSpiWithConfig need config arg");
    }
    if (config.spi) {
      return config.spi;
    }
    let spi = this.getFreeSpi();
    spi.start(config);
    return spi;
  }

  getFreeUart() {
    let i = 0;
    while (true) {
      let uart = this["uart" + i];
      if (!uart) {
        break;
      }
      if (!uart.isUsed()) {
        uart.used = true;
        return uart;
      }
      i++;
    }
    throw new Error("No More uart Available. max = " + i);
  }

  addPongObserver(callback) {
    if (callback) {
      this.pongObservers.push(callback);
    }
  }
  removePongObserver(callback) {
    if (this.pongObservers.includes(callback)) {
      let index = this.pongObservers.indexOf(callback);
      this.pongObservers.splice(index, 1);
    }
  }
  handleSystemCommand(wsObj) {
    // ping pong
    if (wsObj.pong) {
      for (let callback of this.pongObservers) {
        callback(wsObj);
      }
    }
  }

  handleWSCommand(wsObj) {
    // ready
    if (wsObj.ready) {

      this.resetOnDisconnect(true);
      if (this.isNode === false) {
        this.showOnLine();
      }
      if (this.onconnect) {
        let promise = this.onconnect(this);
        if (promise instanceof Promise) {
          promise.catch(err => {
            console.error(err);
          });
        }
      }
    }
    if (wsObj.redirect) {
      let server = wsObj.redirect;
      this.print_debug("WS connection changed to " + server);
      this.close();
      this.wsconnect(server);
    }
  }

  message(target, message) {
    let targets = [];
    if (typeof target === "string") {
      targets.push(target);
    } else {
      targets = target;
    }
    this.send({
      message: {
        to: targets,
        data: message
      }
    });
  }

  // --- System ---


  repeat(callback, interval) {
    let loop = (() => {
      var _ref = _asyncToGenerator(function* () {
        if (typeof self.looper === "function") {
          yield self.looper();
          setTimeout(loop, interval);
        }
      });

      return function loop() {
        return _ref.apply(this, arguments);
      };
    })();

    if (this.looper) {
      this.looper = callback;
      return;
    }
    this.looper = callback;
    let self = this;
    if (!interval) interval = 100;

    loop();
  }

  wait(msec) {
    if (msec < 0) {
      msec = 0;
    } else if (msec > 60 * 1000) {
      msec = 60 * 1000;
    }
    this.send({ system: { wait: msec } });
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  reset() {
    this.send({ system: { reset: true } });this.init();
  }
  reboot() {
    this.send({ system: { reboot: true } });this.init();
  }
  selfCheck() {
    this.send({ system: { self_check: true } });
  }
  keepWorkingAtOffline(working) {
    this.send({ system: { keep_working_at_offline: working } });
  }
  resetOnDisconnect(reset) {
    this.send({ ws: { reset_obniz_on_ws_disconnection: reset } });
  }

  pingWait(unixtime, rand) {
    unixtime = unixtime || new Date().getTime();
    let upper = Math.floor(unixtime / Math.pow(2, 32));
    let lower = unixtime - upper * Math.pow(2, 32);
    rand = rand || Math.floor(Math.random() * Math.pow(2, 4));
    let buf = [];

    buf.push(upper >>> 8 * 3 & 0xFF);
    buf.push(upper >>> 8 * 2 & 0xFF);
    buf.push(upper >>> 8 * 1 & 0xFF);
    buf.push(upper >>> 8 * 0 & 0xFF);
    buf.push(lower >>> 8 * 3 & 0xFF);
    buf.push(lower >>> 8 * 2 & 0xFF);
    buf.push(lower >>> 8 * 1 & 0xFF);
    buf.push(lower >>> 8 * 0 & 0xFF);
    buf.push(rand >>> 8 * 3 & 0xFF);
    buf.push(rand >>> 8 * 2 & 0xFF);
    buf.push(rand >>> 8 * 1 & 0xFF);
    buf.push(rand >>> 8 * 0 & 0xFF);
    this.send({ system: { ping: { key: buf } } });

    return new Promise(resolve => {
      let callback = systemObj => {
        for (let i = 0; i < buf.length; i++) {
          if (buf[i] !== systemObj.pong.key[i]) {
            return;
          }
        }
        this.removePongObserver(callback);
        let upper = (systemObj.pong.key[0] << 8 * 3 >>> 0) + (systemObj.pong.key[1] << 8 * 2 >>> 0) + (systemObj.pong.key[2] << 8 * 1 >>> 0) + (systemObj.pong.key[3] << 8 * 0 >>> 0);
        let lower = (systemObj.pong.key[4] << 8 * 3 >>> 0) + (systemObj.pong.key[5] << 8 * 2 >>> 0) + (systemObj.pong.key[6] << 8 * 1 >>> 0) + (systemObj.pong.key[7] << 8 * 0 >>> 0);
        let obnizJsPingUnixtime = upper * Math.pow(2, 32) + lower;
        let obnizJsPongUnixtime = new Date().getTime();
        let allTime = obnizJsPongUnixtime - obnizJsPingUnixtime;
        let timeJs2server = systemObj.pong.pingServerTime - obnizJsPingUnixtime;
        let timeServer2Obniz = systemObj.pong.obnizTime - systemObj.pong.pingServerTime;
        let timeObniz2Server = systemObj.pong.pongServerTime - systemObj.pong.obnizTime;
        let timeServer2Js = obnizJsPongUnixtime - systemObj.pong.pongServerTime;
        let str = `ping ${allTime}ms (js --[${timeJs2server}ms]--> server --[${timeServer2Obniz}ms]--> obniz --[${timeObniz2Server}ms]--> server --[${timeServer2Js}ms]--> js)`;
        // let str = `ping,${obnizJsPingUnixtime},${systemObj.pong.pingServerTime},${systemObj.pong.obnizTime},${systemObj.pong.pongServerTime}`;


        this.print_debug(str);
        resolve(str);
      };
      this.addPongObserver(callback);
    });
  }

  warning(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        console.log(msg.message);
        return;
      }
      if (typeof showObnizDebugError === "function") {
        showObnizDebugError(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  error(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        msg = msg.message;
      }
      if (typeof showObnizDebugError === "function") {
        showObnizDebugError(new Error(msg));
        console.error(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  showAlertUI(obj) {
    if (this.isNode || !document.getElementById(this.debugDomId)) {
      return;
    }
    const alerts = {
      warning: 'alert-warning alert-dismissible',
      error: 'alert-danger'
    };
    let dom = `
    <div style="background-color:${obj.alert === "warning" ? "#ffee35" : "#ff7b34"}">${obj.message}</div>`;
    document.getElementById(this.debugDomId).insertAdjacentHTML('beforeend', dom);
  }

  getDebugDoms() {
    if (this.isNode) {
      return;
    }
    let loaderDom = document.querySelector("#loader");
    let debugDom = document.querySelector("#" + this.debugDomId);
    let statusDom = document.querySelector("#" + this.debugDomId + " #online-status");
    if (debugDom && !statusDom) {
      statusDom = document.createElement("div");
      statusDom.id = 'online-status';
      statusDom.style.color = "#FFF";
      statusDom.style.padding = "5px";
      statusDom.style.textAlign = "center";
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return { loaderDom: loaderDom, debugDom: debugDom, statusDom: statusDom };
  }
  showOnLine() {
    if (this.isNode) {
      return;
    }
    let doms = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = "none";
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = "#449d44";
      doms.statusDom.style.color = "#FFF";
      doms.statusDom.innerHTML = this.id ? "online : " + this.id : "online";
    }
  }
  showOffLine() {
    if (this.isNode) {
      return;
    }

    let doms = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = "block";
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = "#d9534f";
      doms.statusDom.style.color = "#FFF";
      doms.statusDom.innerHTML = this.id ? "offline : " + this.id : "offline";
    }
  }

}

/*===================*/
/* Parts */
/*===================*/
let _parts = {};

Obniz._parts = _parts;

Obniz.PartsRegistrate = function (name, obj) {
  _parts[name] = obj;
};

Obniz.Parts = function (name) {
  return new _parts[name]();
};

/*===================*/
/* Utils */
/*===================*/
function _ReadCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

if (!isNode) {

  if (window && window.parent && window.parent.userAppLoaded) {
    window.parent.userAppLoaded(window);
  }

  function showObnizDebugError(err) {
    if (window.parent && window.parent.logger) {
      window.parent.logger.onObnizError(err);
    } else {
      throw err;
    }
  }
}

/*===================*/
/* Export */
/*===================*/
module.exports = Obniz;

// read parts
__webpack_require__("./obniz sync recursive").context = __webpack_require__(/*! ./libs/webpackReplace/require-context */ "./obniz/libs/webpackReplace/require-context.js");
if (__webpack_require__("./obniz sync recursive").context && __webpack_require__("./obniz sync recursive").context.setBaseDir) {
  __webpack_require__("./obniz sync recursive").context.setBaseDir(__dirname);
}
let context = __webpack_require__("./parts sync recursive \\.js$");
for (let path of context.keys()) {
  context(path);
}
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./obniz/libs/embeds/ble/ble.js":
/*!**************************************!*\
  !*** ./obniz/libs/embeds/ble/ble.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BlePeripheral = __webpack_require__(/*! ./blePeripheral */ "./obniz/libs/embeds/ble/blePeripheral.js");
const BleService = __webpack_require__(/*! ./bleService */ "./obniz/libs/embeds/ble/bleService.js");
const BleCharacteristic = __webpack_require__(/*! ./bleCharacteristic */ "./obniz/libs/embeds/ble/bleCharacteristic.js");
const BleDescriptor = __webpack_require__(/*! ./bleDescriptor */ "./obniz/libs/embeds/ble/bleDescriptor.js");
const BleRemotePeripheral = __webpack_require__(/*! ./bleRemotePeripheral */ "./obniz/libs/embeds/ble/bleRemotePeripheral.js");

class ObnizBLE {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.remotePeripherals = [];
    this.adv_data = [];
    this.scan_resp = [];

    this.service = BleService;
    this.characteristic = BleCharacteristic;
    this.descriptor = BleDescriptor;
    this.peripheral = new BlePeripheral(Obniz);
  }

  startAdvertisement() {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["advertisement"] = {
      adv_data: this.adv_data
    };

    if (this.scan_resp.length > 0) {
      obj["ble"]["advertisement"]["scan_resp"] = this.scan_resp;
    }

    this.Obniz.send(obj);
    return;
  }

  stopAdvertisement() {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["advertisement"] = null;
    this.Obniz.send(obj);
    return;
  }

  setAdvDataRaw(adv_data) {
    var obj = {};
    this.adv_data = adv_data;
    return;
  }

  setAdvData(json) {
    var builder = this.advDataBulider(json);
    this.setAdvDataRaw(builder.build());
    return;
  }

  dataBuliderPrototype() {

    var builder = function (Obniz, json) {
      this.Obniz = Obniz;
      this.rows = {};

      if (json) {
        if (json.localName) {
          this.setCompleteLocalName(json.localName);
        }
        if (json.manufacturerData && json.manufacturerData.campanyCode && json.manufacturerData.data) {
          this.setManufacturerSpecificData(json.manufacturerData.campanyCode, json.manufacturerData.data);
        }
        if (json.serviceUuids) {
          for (var key in json.serviceUuids) {
            this.setUuid(json.serviceUuids[key]);
          }
        }
      }
      if (typeof this.extendEvalJson === "function") {
        this.extendEvalJson(json);
      }
    };
    builder.prototype.setRow = function (type, data) {
      this.rows[type] = data;
    };
    builder.prototype.getRow = function (type) {
      return this.rows[type] || [];
    };

    builder.prototype.check = function () {
      return true;
    };

    builder.prototype.build = function () {
      if (!this.check) {
        return;
      }
      var data = [];
      for (var key in this.rows) {
        if (this.rows[key].length === 0) continue;

        data.push(this.rows[key].length + 1);
        data.push(parseInt(key));
        Array.prototype.push.apply(data, this.rows[key]);
      }
      if (data.length > 31) {
        this.Obniz.error("Too large data. Advertise/ScanResponse data are must be less than 32 byte.");
      }

      return data;
    };

    builder.prototype.setStringData = function (type, string) {
      var data = [];

      for (var i = 0; i < string.length; i++) {
        data.push(string.charCodeAt(i));
      }

      this.setRow(type, data);
    };

    builder.prototype.setShortenedLocalName = function (name) {
      this.setStringData(0x08, name);
    };
    builder.prototype.setCompleteLocalName = function (name) {
      this.setStringData(0x09, name);
    };

    builder.prototype.setManufacturerSpecificData = function (campanyCode, data) {
      var row = [];
      row.push(campanyCode & 0xFF);
      row.push(campanyCode >> 8 & 0xFF);
      Array.prototype.push.apply(row, data);
      this.setRow(0xFF, row);
    };

    builder.prototype.setUuid = function (uuid) {
      var uuidData = this.convertUuid(uuid);
      var type = { 16: 0x06, 4: 0x04, 2: 0x02 }[uuidData.length];
      this.setRow(type, uuidData);
    };

    builder.prototype.convertUuid = function (uuid) {
      var uuidNumeric = uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
      if (uuidNumeric.length !== 32 && uuidNumeric.length !== 8 && uuidNumeric.length !== 4) {
        this.Obniz.error("BLE uuid must be 16/32/128 bit . (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb for 128bit)");
      }

      var data = [];
      for (var i = uuidNumeric.length; i > 1; i -= 2) {
        data.push(parseInt(uuidNumeric[i - 2] + uuidNumeric[i - 1], 16));
      }
      return data;
    };

    builder.prototype.setIbeaconData = function (uuid, major, minor, txPower) {
      var data = [];
      data.push(0x02, 0x15); // fixed data

      var uuidData = this.convertUuid(uuid);
      Array.prototype.push.apply(data, uuidData);

      data.push(major >> 8 & 0xFF);
      data.push(major >> 0 & 0xFF);
      data.push(minor >> 8 & 0xFF);
      data.push(minor >> 0 & 0xFF);
      data.push(txPower >> 0 & 0xFF);

      this.setManufacturerSpecificData(0x004c, data);
      return;
    };

    return builder;
  }

  advDataBulider(jsonVal) {
    var builder = this.dataBuliderPrototype();

    builder.prototype.check = function () {

      return true;
    };

    builder.prototype.extendEvalJson = function (json) {
      if (json) {
        if (json.flags) {
          if (json.flags.includes("limited_discoverable_mode")) this.setLeLimitedDiscoverableModeFlag();
          if (json.flags.includes("general_discoverable_mode")) this.setLeGeneralDiscoverableModeFlag();
          if (json.flags.includes("br_edr_not_supported")) this.setBrEdrNotSupportedFlag();
          if (json.flags.includes("le_br_edr_controller")) this.setLeBrEdrControllerFlag();
          if (json.flags.includes("le_br_edr_host")) this.setLeBrEdrHostFlag();
        }
      }
    };

    builder.prototype.setFlags = function (flag) {
      var data = this.getRow(0x01);
      data[0] = (data[0] || 0) | flag;
      this.setRow(0x01, data);
    };
    builder.prototype.setLeLimitedDiscoverableModeFlag = function () {
      this.setFlags(0x01);
    };
    builder.prototype.setLeGeneralDiscoverableModeFlag = function () {
      this.setFlags(0x02);
    };
    builder.prototype.setBrEdrNotSupportedFlag = function () {
      this.setFlags(0x04);
    };
    builder.prototype.setLeBrEdrControllerFlag = function () {
      this.setFlags(0x08);
    };
    builder.prototype.setLeBrEdrHostFlag = function () {
      this.setFlags(0x10);
    };

    return new builder(this.Obniz, jsonVal);
  }

  scanRespDataBuilder(json) {
    var builder = this.dataBuliderPrototype();
    return new builder(this.Obniz, json);
  }

  setScanRespDataRaw(scan_resp) {
    this.scan_resp = scan_resp;
  }

  setScanRespData(json) {
    this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
  }

  startScan(settings) {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["scan"] = {
      //    "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
      //    "interval" : settings && settings.interval ? settings.interval : 30,
      "duration": settings && settings.duration ? settings.duration : 30

    };

    this.remotePeripherals = [];

    this.Obniz.send(obj);
    return;
  }

  stopScan() {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["scan"] = null;
    this.Obniz.send(obj);
  }

  findPeripheral(address) {
    for (var key in this.remotePeripherals) {
      if (this.remotePeripherals[key].address === address) {
        return this.remotePeripherals[key];
      }
    }
    return null;
  }

  notified(obj) {
    if (obj.scan_result) {
      let isFinished = false;
      if (obj.scan_result.event_type === "inquiry_complete") {
        isFinished = true;
      } else if (obj.scan_result.event_type === "inquiry_result") {
        let val = new BleRemotePeripheral(this.Obniz, obj.scan_result.address);
        val.setParams(obj.scan_result);
        this.remotePeripherals.push(val);
        this.onscan(val);
      }
      if (isFinished) {
        this.onscanfinish(this.remotePeripherals);
      }
    }

    if (obj.status_update) {
      let params = obj.status_update;
      if (!params.address) return;
      let p = this.findPeripheral(params.address);
      if (p) {
        if (params.status === "connected") {
          p.onconnect();
        }
        if (params.status === "disconnected") {
          p.ondisconnect();
        }
      }
    }

    if (obj.get_service_result) {
      let params = obj.get_service_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          p.ondiscoverservice(service);
        }
      }
    }
    if (obj.get_characteristic_result) {
      let params = obj.get_characteristic_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          service.ondiscovercharacteristic(chara);
        }
      }
    }
    if (obj.write_characteristic_result) {
      let params = obj.write_characteristic_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          chara.onwrite(params.result);
        }
      }
    }

    if (obj.read_characteristic_result) {
      let params = obj.read_characteristic_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          chara.onread(params.data);
        }
      }
    }
    if (obj.get_descriptors_result) {
      let params = obj.get_descriptors_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          let descr = chara.getDescriptor(params.descriptor_uuid);
          chara.ondiscoverdescriptor(descr);
        }
      }
    }
    if (obj.read_descriptor_result) {
      let params = obj.read_descriptor_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          let descr = chara.getDescriptor(params.descriptor_uuid);
          descr.onread(params.data);
        }
      }
    }
    if (obj.write_descriptor_result) {
      let params = obj.write_descriptor_result;
      if (params.address) {
        var p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          let descr = chara.getDescriptor(params.descriptor_uuid);
          descr.onwrite(params.result);
        }
      }
    }

    var callbackFunc = function (val, func, type) {
      var obj = null;
      if (val === undefined) return;
      if (type === "service") {
        obj = this.peripheral.getService(val);
      } else if (type === "characteristic") {
        obj = this.peripheral.findCharacteristic(val);
      } else if (type === "descriptor") {
        obj = this.peripheral.findDescriptor(val);
      }
      func(val, obj);
    }.bind(this);

    if (obj.peripheral) {
      callbackFunc(obj.peripheral.connection_status, function (val) {
        this.peripheral.onconnectionupdates(val);
      }.bind(this));

      var paramList = {
        read_characteristic_result: { method: "onread", obj: "characteristic" },
        write_characteristic_result: { method: "onwrite", obj: "characteristic" },
        notify_read_characteristic: { method: "onreadfromremote", obj: "characteristic" },
        notify_write_characteristic: { method: "onwritefromremote", obj: "characteristic" },
        read_descriptor_result: { method: "onread", obj: "descriptor" },
        write_descriptor_result: { method: "onwrite", obj: "descriptor" },
        notify_read_descriptor: { method: "onreadfromremote", obj: "descriptor" },
        notify_write_descriptor: { method: "onwritefromremote", obj: "descriptor" }
      };

      for (var key in paramList) {
        callbackFunc(obj.peripheral[key], function (val, bleobj) {
          bleobj[paramList[key].method](val);
        }.bind(this), paramList[key].obj);
      }
    }

    if (obj.error) {
      let params = obj.error;
      let handled = false;
      if (!params.address) {
        if (typeof this.onerror === "function") {
          this.onerror(params);
          handled = true;
        }
      }

      let p = this.findPeripheral(params.address);
      if (p) {
        p.onerror(params);
        handled = true;
      }
      if (!handled) {
        this.Obniz.error(`ble ${params.message} service=${params.service_uuid} characteristic_uuid=${params.characteristic_uuid} descriptor_uuid=${params.descriptor_uuid}`);
      }
    }
  }

  onscanfinish() {} //dummy
  onscan() {} //dummy
}

module.exports = ObnizBLE;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleCharacteristic.js":
/*!****************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleCharacteristic.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../../utils/util */ "./obniz/libs/utils/util.js");
const BleDescriptor = __webpack_require__(/*! ./bleDescriptor */ "./obniz/libs/embeds/ble/bleDescriptor.js");

class BleCharacteristic {

  constructor(obj) {
    this.descriptors = [];
    this.uuid = obj.uuid.toLowerCase();
    this.data = obj.data || null;
    if (!this.data && obj.text) {
      this.data = ObnizUtil.string2dataArray(obj.text);
    }
    if (!this.data && obj.value) {
      this.data = obj.value;
    }

    this.property = obj.property || [];
    if (!Array.isArray(this.property)) {
      this.property = [this.property];
    }

    if (obj["descriptors"]) {
      for (var key in obj["descriptors"]) {
        this.addDescriptor(obj["descriptors"][key]);
      }
    }
  }

  addDescriptor(obj) {
    if (!(obj instanceof BleDescriptor)) {
      obj = new BleDescriptor(obj);
    }
    this.descriptors.push(obj);
    obj.characteristic = this;
  }

  getDescriptor(uuid) {
    return this.descriptors.filter(function (element) {
      return element.uuid.toLowerCase() === uuid.toLowerCase();
    }).shift();
  }

  write(data) {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          write_characteristic: {
            service_uuid: this.service.uuid.toLowerCase(),
            characteristic_uuid: this.uuid.toLowerCase(),
            data: data
          }
        }
      }
    });
  }

  writeNumber(val) {
    this.write([val]);
  }

  writeText(val) {
    this.write(ObnizUtil.string2dataArray(str));
  }

  read() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_characteristic: {
            service_uuid: this.service.uuid.toLowerCase(),
            characteristic_uuid: this.uuid.toLowerCase()
          }
        }
      }
    });
  }
  onwrite() {}
  onread() {}
  onwritefromremote() {}
  onreadfromremote() {}

  toJSON() {
    var obj = {
      uuid: this.uuid.toLowerCase()
    };
    if (this.data) {
      obj.data = this.data;
    }
    if (this.descriptors) {
      obj.descriptors = this.descriptors;
    }
    if (this.property.length > 0) {
      obj.property = this.property;
    }
    return obj;
  }
}

module.exports = BleCharacteristic;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleDescriptor.js":
/*!************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleDescriptor.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../../utils/util */ "./obniz/libs/utils/util.js");

/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */
class BleDescriptor {

  constructor(obj) {
    this.descriptors = [];
    this.uuid = obj.uuid.toLowerCase();

    this.data = obj.data || null;
    if (!this.data && obj.text) {
      this.data = ObnizUtil.string2dataArray(obj.text);
    }
    if (!this.data && obj.value) {
      this.data = obj.value;
    }

    this.property = obj.property || [];
    if (!Array.isArray(this.property)) {
      this.property = [this.property];
    }
  }

  toJSON() {
    var obj = {
      uuid: this.uuid.toLowerCase()
    };
    if (this.data) {
      obj.data = this.data;
    }
    if (this.property.length > 0) {
      obj.property = this.property;
    }
    return obj;
  }

  write(dataArray) {
    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          write_descriptor: {
            service_uuid: this.characteristic.service.uuid.toLowerCase(),
            characteristic_uuid: this.characteristic.uuid.toLowerCase(),
            descriptor_uuid: this.uuid,
            data: dataArray
          }
        }
      }
    });
  }

  writeNumber(val) {
    this.write([val]);
  }

  writeText(val) {
    this.write(ObnizUtil.string2dataArray(str));
  }

  read() {

    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_descriptor: {
            service_uuid: this.characteristic.service.uuid.toLowerCase(),
            characteristic_uuid: this.characteristic.uuid.toLowerCase(),
            descriptor_uuid: this.uuid
          }
        }
      }
    });
  }

  onwrite() {}
  onread() {}
  onwritefromremote() {}
  onreadfromremote() {}
}

module.exports = BleDescriptor;

/***/ }),

/***/ "./obniz/libs/embeds/ble/blePeripheral.js":
/*!************************************************!*\
  !*** ./obniz/libs/embeds/ble/blePeripheral.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleService = __webpack_require__(/*! ./bleService */ "./obniz/libs/embeds/ble/bleService.js");

class BlePeripheral {

  constructor(Obniz) {
    this.Obniz = Obniz;
    this.services = [];
  }

  addService(obj) {
    if (!(obj instanceof BleService)) {
      obj = new BleService(obj);
    }
    this.services.push(obj);
    obj.peripheral = this;
    this.Obniz.send({ ble: { peripheral: { services: [obj] } } });
  }

  setJson(json) {
    if (json["services"]) {
      for (var key in json["services"]) {
        this.addService(json["services"][key]);
      }
    }
  }

  getService(uuid) {
    return this.services.filter(function (element) {
      return element.uuid.toLowerCase() === uuid.toLowerCase();
    }).shift();
  }

  toJSON() {
    return {
      services: this.services
    };
  }

  onconnectionupdates() {}

  findCharacteristic(param) {
    var serviceUuid = param.service_uuid.toLowerCase();
    var characteristicUuid = param.characteristic_uuid.toLowerCase();
    var s = this.getService(serviceUuid);
    if (s) {
      var c = s.getCharacteristic(characteristicUuid);
      return c;
    }
    return null;
  }

  findDescriptor(param) {
    var descriptorUuid = param.descriptor_uuid.toLowerCase();
    var c = this.findCharacteristic(param);
    if (c) {
      var d = c.getDescriptor(descriptorUuid);
      return d;
    }
    return null;
  }

  end() {
    this.Obniz.send({ ble: { peripheral: null } });
  }
}

module.exports = BlePeripheral;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemoteCharacteristic.js":
/*!**********************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleRemoteCharacteristic.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ObnizUtil = __webpack_require__(/*! ../../utils/util */ "./obniz/libs/utils/util.js");
const BleRemoteDescriptor = __webpack_require__(/*! ./bleRemoteDescriptor */ "./obniz/libs/embeds/ble/bleRemoteDescriptor.js");

class BleRemoteCharacteristic {

  constructor(Obniz, service, uuid) {
    this.Obniz = Obniz;
    this.service = service;
    this.uuid = uuid;
    this.descriptors = [];
  }

  toString() {
    return JSON.stringify({
      "address": this.service.peripheral.address,
      "service_uuid": this.service.uuid,
      "characteristic_uuid": this.uuid
    });
  }

  read() {
    var obj = {
      "ble": {
        "read_characteristic": {
          "address": this.service.peripheral.address,
          "service_uuid": this.service.uuid,
          "characteristic_uuid": this.uuid
        }
      }
    };
    this.Obniz.send(obj);
  }

  readWait() {
    return _asyncToGenerator(function* () {
      throw new Error("TODO");
    })();
  }

  write(array) {
    var obj = {
      "ble": {
        "write_characteristic": {
          "address": this.service.peripheral.address,
          "service_uuid": this.service.uuid,
          "characteristic_uuid": this.uuid,
          "data": array
        }
      }
    };
    this.Obniz.send(obj);
  }

  writeNumber(val) {
    this.write([val]);
  }

  writeText(val) {
    this.write(ObnizUtil.string2dataArray(str));
  }

  discoverAllDescriptors(str) {
    var obj = {
      "ble": {
        "get_descriptors": {
          "address": this.service.peripheral.address,
          "service_uuid": this.service.uuid,
          "characteristic_uuid": this.uuid
        }
      }
    };
    this.Obniz.send(obj);
  }

  getDescriptor(uuid) {
    for (var key in this.descriptors) {
      if (this.descriptors[key].uuid === uuid) {
        return this.descriptors[key];
      }
    }
    var newDescriptors = new BleRemoteDescriptor(this.Obniz, this, uuid);
    this.descriptors.push(newDescriptors);
    return newDescriptors;
  }

  onwrite(status) {}
  onread(value) {}
  ondiscoverdescriptor(descriptor) {}
}
module.exports = BleRemoteCharacteristic;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemoteDescriptor.js":
/*!******************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleRemoteDescriptor.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class BleRemoteDescriptor {
  constructor(Obniz, characteristic, uuid) {
    this.Obniz = Obniz;
    this.characteristic = characteristic;
    this.uuid = uuid;
  }

  toString() {
    return JSON.stringify({
      "address": this.characteristic.service.peripheral.address,
      "service_uuid": this.characteristic.service.uuid,
      "characteristic_uuid": this.characteristic.uuid,
      "descriptor_uuid": this.uuid
    });
  }

  read() {
    var obj = {
      "ble": {
        "read_descriptor": {
          "address": this.characteristic.service.peripheral.address,
          "service_uuid": this.characteristic.service.uuid,
          "characteristic_uuid": this.characteristic.uuid,
          "descriptor_uuid": this.uuid
        }
      }
    };
    this.Obniz.send(obj);
  }

  readWait() {
    return _asyncToGenerator(function* () {
      throw new Error("TODO");
    })();
  }

  write(array) {
    var obj = {
      "ble": {
        "write_descriptor": {
          "address": this.characteristic.service.peripheral.address,
          "service_uuid": this.characteristic.service.uuid,
          "characteristic_uuid": this.characteristic.uuid,
          "descriptor_uuid": this.uuid,
          "data": array
        }
      }
    };
    this.Obniz.send(obj);
  }

  writeNumber(val) {
    this.write([val]);
  }

  writeText(val) {
    this.write(ObnizUtil.string2dataArray(str));
  }

  onread(value) {}
  onwrite(value) {}
}

module.exports = BleRemoteDescriptor;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemotePeripheral.js":
/*!******************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleRemotePeripheral.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleRemoteService = __webpack_require__(/*! ./bleRemoteService */ "./obniz/libs/embeds/ble/bleRemoteService.js");

class BleRemotePeripheral {

  constructor(Obniz, address) {
    this.Obniz = Obniz;
    this.address = address;

    this.keys = ["device_type", "address_type", "ble_event_type", "rssi", "adv_data", "scan_resp"];

    this.services = [];
  }

  /**
   * 
   * @return {String} json value
   */
  toString() {
    return JSON.stringify({
      id: this.id,
      address: this.address,
      addressType: this.addressType,
      connectable: this.connectable,
      advertisement: this.adv_data,
      scanResponse: this.scan_resp,
      rssi: this.rssi,
      state: this.state
    });
  }

  setParams(dic) {
    for (var key in dic) {
      if (this.keys.includes(key)) {
        this[key] = dic[key];
      }
    }
  }

  analyseAdvertisement() {
    if (!this.advertise_data_rows) {
      this.advertise_data_rows = [];
      if (this.adv_data) {
        for (var i = 0; i < this.adv_data.length; i++) {
          var length = this.adv_data[i];
          var arr = new Array(length);
          for (var j = 0; j < length; j++) {
            arr[j] = this.adv_data[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
      if (this.scan_resp) {

        for (var i = 0; i < this.scan_resp.length; i++) {
          var length = this.scan_resp[i];
          var arr = new Array(length);
          for (var j = 0; j < length; j++) {
            arr[j] = this.scan_resp[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
    }
  }

  serarchTypeVal(type) {
    this.analyseAdvertisement();
    for (var i = 0; i < this.advertise_data_rows.length; i++) {
      if (this.advertise_data_rows[i][0] === type) {
        var results = [].concat(this.advertise_data_rows[i]);
        results.shift();
        return results;
      }
    }
    return undefined;
  }

  localName() {
    var data = this.serarchTypeVal(0x09);
    if (!data) {
      data = this.serarchTypeVal(0x08);
    }
    if (!data) return null;
    return String.fromCharCode.apply(null, data);
  }

  iBeacon() {
    var data = this.serarchTypeVal(0xFF);
    if (!data || data[0] !== 0x4c || data[1] !== 0x00 || data[2] !== 0x02 || data[3] !== 0x15 || data.length !== 25) return null;

    var uuidData = data.slice(4, 20);
    var uuid = "";
    for (var i = 0; i < uuidData.length; i++) {
      uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
      if (i === 4 - 1 || i === 4 + 2 - 1 || i === 4 + 2 * 2 - 1 || i === 4 + 2 * 3 - 1) {
        uuid += "-";
      }
    }

    var major = (data[20] << 8) + data[21];
    var minor = (data[22] << 8) + data[23];
    var power = data[24];

    return {
      uuid: uuid,
      major: major,
      minor: minor,
      power: power,
      rssi: this.rssi
    };
  }

  connect(callbacks) {
    var keys = ["onconnect", "ondisconnect"];
    this.setParams(keys, callbacks);

    var obj = {
      "ble": {
        "connect": {
          "address": this.address
        }
      }
    };
    this.Obniz.send(obj);
  }

  disconnect() {
    var obj = {
      "ble": {
        "disconnect": {
          "address": this.address
        }
      }
    };
    this.Obniz.send(obj);
  }

  updateRssi() {
    throw new Error("todo");
  }

  getService(uuid) {
    for (var key in this.services) {
      if (this.services[key].uuid === uuid) {
        return this.services[key];
      }
    }
    var newService = new BleRemoteService(this.Obniz, this, uuid);
    this.services.push(newService);
    return newService;
  }

  discoverAllServices() {
    var obj = {
      "ble": {
        "get_services": {
          "address": this.address
        }
      }
    };
    this.Obniz.send(obj);
  }

  onconnect() {}
  ondisconnect() {}
  ondiscoverservice(service) {}

  onerror(err) {}
}

module.exports = BleRemotePeripheral;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemoteService.js":
/*!***************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleRemoteService.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleRemoteCharacteristic = __webpack_require__(/*! ./bleRemoteCharacteristic */ "./obniz/libs/embeds/ble/bleRemoteCharacteristic.js");

class BleRemoteService {

  constructor(Obniz, peripheral, uuid) {
    this.Obniz = Obniz;
    this.uuid = uuid;
    this.peripheral = peripheral;

    this.characteristics = [];
  }

  toString() {
    return JSON.stringify({
      "address": this.peripheral.address,
      "service_uuid": this.uuid
    });
  }

  discoverAllCharacteristics() {
    var obj = {
      "ble": {
        "get_characteristics": {
          "address": this.peripheral.address,
          "service_uuid": this.uuid
        }
      }
    };
    this.Obniz.send(obj);
  }

  getCharacteristic(uuid) {

    for (var key in this.characteristics) {
      if (this.characteristics[key].uuid === uuid) {
        return this.characteristics[key];
      }
    }
    var newCharacteristic = new BleRemoteCharacteristic(this.Obniz, this, uuid);
    this.characteristics.push(newCharacteristic);
    return newCharacteristic;
  }

  ondiscovercharacteristic(characteristic) {}
}

module.exports = BleRemoteService;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleService.js":
/*!*********************************************!*\
  !*** ./obniz/libs/embeds/ble/bleService.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleCharacteristic = __webpack_require__(/*! ./bleCharacteristic */ "./obniz/libs/embeds/ble/bleCharacteristic.js");

class BleService {

  constructor(obj) {
    this.characteristics = [];
    this.uuid = obj.uuid.toLowerCase();

    if (obj["characteristics"]) {
      for (var key in obj["characteristics"]) {
        this.addCharacteristic(obj["characteristics"][key]);
      }
    }
  }

  addCharacteristic(obj) {
    if (!(obj instanceof BleCharacteristic)) {
      obj = new BleCharacteristic(obj);
    }
    this.characteristics.push(obj);
    obj.service = this;
  }

  getCharacteristic(uuid) {
    return this.characteristics.filter(function (element) {
      return element.uuid.toLowerCase() === uuid.toLowerCase();
    }).shift();
  }

  toJSON() {
    return {
      uuid: this.uuid.toLowerCase(),
      characteristics: this.characteristics
    };
  }

  get advData() {
    return {
      flags: ["general_discoverable_mode", "br_edr_not_supported"],
      serviceUuids: [this.uuid]
    };
  }
}

module.exports = BleService;

/***/ }),

/***/ "./obniz/libs/embeds/display.js":
/*!**************************************!*\
  !*** ./obniz/libs/embeds/display.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class Display {

  constructor(Obniz) {
    this.Obniz = Obniz;
    this.width = 128;
    this.height = 64;

    this._pos = { x: 0, y: 0 };
    this._canvas = null;
  }

  warnCanvasAvailability() {
    if (this.Obniz.isNode) {
      throw new Error('obniz.js require node-canvas to draw rich contents. see more detail on docs');
    } else {
      throw new Error('obniz.js cant create canvas element to body');
    }
  }

  _preparedCanvas() {
    if (this._canvas) {
      return this._canvas;
    }
    if (this.Obniz.isNode) {
      try {
        const { createCanvas } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"canvas\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
        this._canvas = createCanvas(this.width, this.height);
      } catch (e) {
        // this.warnCanvasAvailability();
        return null;
      }
    } else {
      const identifier = 'obnizcanvas-' + this.Obniz.id;
      let canvas = document.getElementById(identifier);
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.setAttribute("id", identifier);
        canvas.style.visibility = "hidden";
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style["-webkit-font-smoothing"] = "none";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
      }
      this._canvas = canvas;
    }
    const ctx = this._canvas.getContext("2d");;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#FFF';
    this._pos.x = 0;
    this._pos.y = 0;
    this.fontSize = 16;
    ctx.font = `${this.fontSize}px Arial`;
    return this._canvas;
  }

  _ctx() {
    const canvas = this._preparedCanvas();
    if (canvas) {
      return canvas.getContext("2d");
    }
  }

  font(font, size) {
    const ctx = this._ctx();
    if (typeof size !== "number") {
      size = 12;
    }
    this.fontSize = size;
    ctx.font = '' + +' ' + size + 'px ' + font;
  }

  clear() {
    const ctx = this._ctx();
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#FFF';
    }
    this._pos.x = 0;
    this._pos.y = 0;
    var obj = {};
    obj["display"] = {
      clear: true
    };
    this.Obniz.send(obj);
  }

  pos(x, y) {
    const ctx = this._ctx(); // load it first.
    if (typeof x == 'number') {
      this._pos.x = x;
    }
    if (typeof y == 'number') {
      this._pos.y = y;
    }
    return this._pos;
  }

  print(text) {
    const ctx = this._ctx();
    if (ctx) {
      ctx.fillText(text, this._pos.x, this._pos.y + this.fontSize);
      this.draw(ctx);
      this._pos.y += this.fontSize;
    } else {
      var obj = {};
      obj["display"] = {
        text: "" + text
      };
      this.Obniz.send(obj);
    }
  }

  line(x_0, y_0, x_1, y_1) {
    const ctx = this._ctx();
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x_0, y_0);
      ctx.lineTo(x_1, y_1);
      ctx.stroke();
      this.draw(ctx);
    } else {
      this.warnCanvasAvailability();
    }
  }

  rect(x, y, width, height, mustFill) {
    const ctx = this._ctx();
    if (ctx) {
      if (mustFill) {
        ctx.fillRect(x, y, width, height);
      } else {
        ctx.strokeRect(x, y, width, height);
      }
      this.draw(ctx);
    } else {
      this.warnCanvasAvailability();
    }
  }

  circle(x, y, r, mustFill) {
    const ctx = this._ctx();
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (mustFill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
      this.draw(ctx);
    } else {
      this.warnCanvasAvailability();
    }
  }

  qr(text, correction) {
    var obj = {};
    obj["display"] = {
      qr: {
        text
      }
    };
    if (correction) {
      obj["display"].qr.correction = correction;
    }
    this.Obniz.send(obj);
  }

  raw(data) {
    var obj = {};
    obj["display"] = {
      raw: data
    };
    this.Obniz.send(obj);
  }

  setPinName(io, moduleName, funcName) {
    var obj = {};
    obj["display"] = {};
    obj["display"]["pin_assign"] = {};
    obj["display"]["pin_assign"][io] = { module_name: moduleName, pin_name: funcName };

    this.Obniz.send(obj);
  }

  setPinNames(moduleName, data) {
    var obj = {};
    obj["display"] = {};
    obj["display"]["pin_assign"] = {};
    for (var key in data) {
      obj["display"]["pin_assign"][key] = { module_name: moduleName, pin_name: data[key] };
    }

    this.Obniz.send(obj);
  }

  draw(ctx) {
    const stride = this.width / 8;
    let vram = new Array(stride * 64);
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      var index = parseInt(i / 4);
      var line = parseInt(index / this.width);
      var col = parseInt((index - line * this.width) / 8);
      var bits = parseInt(index - line * this.width) % 8;
      if (bits == 0) vram[line * stride + col] = 0x00;
      if (brightness > 0x7F) vram[line * stride + col] |= 0x80 >> bits;
    }
    this.raw(vram);
  }
}

module.exports = Display;

/***/ }),

/***/ "./obniz/libs/embeds/switch.js":
/*!*************************************!*\
  !*** ./obniz/libs/embeds/switch.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class ObnizSwitch {

  constructor(Obniz) {
    this.Obniz = Obniz;
    this.observers = [];
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  getWait() {
    let self = this;
    return new Promise(function (resolve, reject) {
      let obj = {};
      obj["switch"] = "get";
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  notified(obj) {
    this.state = obj.state;
    if (this.onchange) {
      this.onchange(this.state);
    }
    const callback = this.observers.shift();
    if (callback) {
      callback(this.state);
    }
  }
}

module.exports = ObnizSwitch;

/***/ }),

/***/ "./obniz/libs/io_peripherals/ad.js":
/*!*****************************************!*\
  !*** ./obniz/libs/io_peripherals/ad.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class PeripheralAD {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.value = 0.0;
    this.observers = [];
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  start(callback) {
    this.onchange = callback;
    var obj = {};
    obj["ad" + this.id] = {
      stream: true
    };
    this.Obniz.send(obj);
    return this.value;
  }

  getWait() {
    var self = this;
    return new Promise(function (resolve, reject) {
      var obj = {};
      obj["ad" + self.id] = {
        stream: false
      };
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  end() {
    this.onchange = null;
    var obj = {};
    obj["ad" + this.id] = null;
    this.Obniz.send(obj);
    return;
  }

  notified(obj) {
    this.value = obj;
    if (this.onchange) {
      this.onchange(obj);
    }
    var callback = this.observers.shift();
    if (callback) {
      callback(obj);
    }
  }
}

module.exports = PeripheralAD;

/***/ }),

/***/ "./obniz/libs/io_peripherals/i2c.js":
/*!******************************************!*\
  !*** ./obniz/libs/io_peripherals/i2c.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../utils/util */ "./obniz/libs/utils/util.js");

class PeripheralI2C {

  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.observers = [];
    this.state = {};
    this.used = false;

    this.onwritten = undefined;
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  start(arg) {
    var err = ObnizUtil._requiredKeys(arg, ["mode", "sda", "scl"]);
    if (err) {
      throw new Error("I2C start param '" + err + "' required, but not found ");return;
    }
    this.state = ObnizUtil._keyFilter(arg, ["mode", "sda", "scl", "pull"]);

    let ioKeys = ["sda", "scl"];
    for (let key of ioKeys) {
      if (this.state[key] && !this.Obniz.isValidIO(this.state[key])) {
        throw new Error("i2c start param '" + key + "' are to be valid io no");
      }
    }

    var mode = this.state.mode;
    var clock = typeof arg.clock === "number" ? parseInt(arg.clock) : null;
    var slave_address = typeof arg.slave_address === "number" ? parseInt(arg.slave_address) : null;
    var slave_address_length = typeof arg.slave_address_length === "number" ? parseInt(arg.slave_address_length) : null;

    if (mode !== "master" && mode !== "slave") {
      throw new Error("i2c: invalid mode " + mode);
    }
    if (mode === "master") {
      if (clock === null) {
        throw new Error("i2c: please specify clock when master mode");
      }
      if (clock <= 0 || clock > 1 * 1000 * 1000) {
        throw new Error("i2c: invalid clock " + clock);
      }
      if (typeof arg.pull === "5v" && clock > 400 * 1000) {
        throw new Error("i2c: please use under 400khz when internal 5v internal pull-up");
      }
      if (typeof arg.pull === "3v" && clock > 100 * 1000) {
        throw new Error("i2c: please use under 100khz when internal 3v internal pull-up");
      }
    } else {
      if (slave_address === null) {
        throw new Error("i2c: please specify slave_address");
      }
      if (slave_address < 0 || slave_address > 0x7F) {
        throw new Error("i2c: invalid slave_address");
      }
      if (slave_address < 0 || slave_address > 0x7F) {
        throw new Error("i2c: invalid slave_address");
      }
      if (slave_address_length !== null && slave_address_length !== 7) {
        throw new Error("i2c: invalid slave_address_length. please specify 7");
      }
    }

    this.Obniz.getIO(this.state.sda).drive("open-drain");
    this.Obniz.getIO(this.state.scl).drive("open-drain");

    if (this.state.pull) {
      this.Obniz.getIO(this.state.sda).pull(this.state.pull);
      this.Obniz.getIO(this.state.scl).pull(this.state.pull);
    } else {
      this.Obniz.getIO(this.state.sda).pull(null);
      this.Obniz.getIO(this.state.scl).pull(null);
    }

    var startObj = ObnizUtil._keyFilter(this.state, ["mode", "sda", "scl"]);
    if (mode === "master") {
      startObj.clock = clock;
    } else {
      startObj.slave_address = slave_address;
      if (slave_address_length) {
        startObj.slave_address_length = slave_address_length;
      }
    }

    var obj = {};
    obj["i2c" + this.id] = startObj;
    this.used = true;
    this.Obniz.send(obj);
  }

  write(address, data) {
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error("i2c: please specify address");
    }
    if (address < 0 || address > 0x7F) {
      throw new Error("i2c: invalid address");
    }
    if (!data) {
      throw new Error("i2c: please provide data");
    }
    if (data.length > 1024) {
      throw new Error("i2c: data should be under 1024 bytes");
    }
    var obj = {};
    obj["i2c" + this.id] = {
      address,
      data
    };
    this.Obniz.send(obj);
  }

  readWait(address, length) {
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error("i2c: please specify address");
    }
    if (address < 0 || address > 0x7F) {
      throw new Error("i2c: invalid address");
    }
    length = parseInt(length);
    if (isNaN(length) || length < 0) {
      throw new Error("i2c: invalid length to read");
    }
    if (length > 1024) {
      throw new Error("i2c: data length should be under 1024 bytes");
    }
    var self = this;
    return new Promise(function (resolve, reject) {
      var obj = {};
      obj["i2c" + self.id] = {
        address,
        read: length
      };
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  notified(obj) {
    if (obj && typeof obj === "object") {
      if (obj.data) {
        if (obj.mode === "slave" && typeof this.onwritten === "function") {
          this.onwritten(obj.data, obj.address);
        } else {
          // TODO: we should compare byte length from sent
          var callback = this.observers.shift();
          if (callback) {
            callback(obj.data);
          }
        }
      }
      if (obj.warnings) {
        for (let i = 0; i < obj.warnings.length; i++) {
          this.Obniz.warning({ alert: 'warning', message: `i2c${this.id}: ${obj.warnings[i].message}` });
        }
      }
      if (obj.errors) {
        for (let i = 0; i < obj.errors.length; i++) {
          this.Obniz.error({ alert: 'error', message: `i2c${this.id}: ${obj.errors[i].message}` });
        }
      }
    }
  }

  isUsed() {
    return this.used;
  }

  end() {
    this.state = {};
    var obj = {};
    obj["i2c" + this.id] = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}

module.exports = PeripheralI2C;

/***/ }),

/***/ "./obniz/libs/io_peripherals/io.js":
/*!*****************************************!*\
  !*** ./obniz/libs/io_peripherals/io.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class PeripheralIO {

  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.value = 0;
    this.observers = [];
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  output(value) {
    var obj = {};
    obj["io" + this.id] = value;
    this.value = value;
    this.Obniz.send(obj);
  }

  drive(drive) {
    if (typeof drive !== "string") {
      throw new Error("please specify drive methods in string");
      return;
    }
    let output_type = "";
    switch (drive) {
      case "5v":
        output_type = "push-pull5v";
        break;
      case "3v":
        output_type = "push-pull3v";
        break;
      case "open-drain":
        output_type = "open-drain";
        break;
      default:
        throw new Error("unknown drive method");
        break;
    }

    var obj = {};
    obj["io" + this.id] = {
      output_type: output_type
    };
    this.Obniz.send(obj);
  }

  pull(updown) {

    if (typeof updown !== "string" && updown !== null) {
      throw new Error("please specify pull methods in string");
      return;
    }
    let pull_type = "";
    switch (updown) {
      case "5v":
      case "pull-up5v":
        pull_type = "pull-up5v";
        break;
      case "3v":
      case "pull-up3v":
        pull_type = "pull-up3v";
        break;
      case "0v":
      case "pull-down":
        pull_type = "pull-down";
        break;
      case null:
      case "float":
        pull_type = "float";
        break;
      default:
        throw new Error("unknown pull_type method");
        break;
    }

    var obj = {};
    obj["io" + this.id] = {
      pull_type: pull_type
    };
    this.Obniz.send(obj);
  }

  input(callback) {
    this.onchange = callback;
    var obj = {};
    obj["io" + this.id] = {
      direction: "input",
      stream: true
    };
    this.Obniz.send(obj);
    return this.value;
  }

  inputWait() {
    var self = this;
    return new Promise(function (resolve, reject) {
      var obj = {};
      obj["io" + self.id] = {
        direction: "input",
        stream: false
      };
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  end() {
    var obj = {};
    obj["io" + this.id] = null;
    this.Obniz.send(obj);
  }

  notified(obj) {
    if (typeof obj === "boolean") {
      this.value = obj;
      var callback = this.observers.shift();
      if (callback) {
        callback(obj);
      }
      if (typeof this.onchange === "function") {
        this.onchange(obj);
      }
    } else if (obj && typeof obj === "object") {
      if (obj.warning) {
        this.Obniz.warning({ alert: 'warning', message: `io${this.id}: ${obj.warning.message}` });
      }
      if (obj.error) {
        this.Obniz.error({ alert: 'error', message: `io${this.id}: ${obj.error.message}` });
      }
    }
  }
}
module.exports = PeripheralIO;

/***/ }),

/***/ "./obniz/libs/io_peripherals/io_.js":
/*!******************************************!*\
  !*** ./obniz/libs/io_peripherals/io_.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class PeripheralIO_ {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
  }

  animation(name, status, array) {
    var obj = {};
    obj.io = {
      animation: {
        name: name,
        status: status
      }
    };
    if (!array) array = [];

    let states = [];
    for (var i = 0; i < array.length; i++) {
      let state = array[i];
      let duration = state.duration;
      let func = state.state;

      // dry run. and get json commands
      this.Obniz.sendPool = [];
      func(i);
      let pooledJsonArray = this.Obniz.sendPool;
      this.Obniz.sendPool = null;

      // simply merge objects
      let merged = {};
      for (var index = 0; index < pooledJsonArray.length; index++) {
        for (let key in pooledJsonArray[index]) {
          merged[key] = pooledJsonArray[index][key];
        }
      }
      states.push({
        duration: duration,
        state: merged
      });
    }
    if (status === "loop") {
      obj.io.animation.states = states;
    }
    this.Obniz.send(obj);
  }
}
module.exports = PeripheralIO_;

/***/ }),

/***/ "./obniz/libs/io_peripherals/pwm.js":
/*!******************************************!*\
  !*** ./obniz/libs/io_peripherals/pwm.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../utils/util */ "./obniz/libs/utils/util.js");

class PeripheralPWM {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.state = {};
    this.used = false;
  }

  sendWS(obj) {
    var wsObj = {};
    wsObj["pwm" + this.id] = obj;
    this.Obniz.send(wsObj);
  }

  start(params) {
    const err = ObnizUtil._requiredKeys(params, ["io"]);
    if (err) {
      throw new Error("pwm start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, ["io", "drive", "pull"]);

    const io = this.params.io;
    const ioObj = this.Obniz.getIO(io);

    ioObj.drive(this.params.drive || '5v');
    ioObj.pull(this.params.pull || null);

    var obj = {};
    this.state.io = io;
    this.sendWS({
      io: io
    });
    this.used = true;
  }

  freq(freq) {
    var obj = {};
    this.state.freq = freq;
    this.sendWS({
      freq: freq
    });
  }

  pulse(pulse_width) {
    var obj = {};
    this.state.pulse = pulse_width;
    this.sendWS({
      pulse: pulse_width
    });
  }

  duty(duty) {
    var obj = {};
    this.state.duty = duty;
    this.sendWS({
      duty: duty
    });
  }

  isUsed() {
    return this.used;
  }

  end() {
    var obj = {};
    this.state = {};
    this.sendWS(null);
    this.used = false;
  }

  modulate(type, symbol_length, data) {
    var obj = {};
    this.sendWS({
      modulate: {
        type: type,
        symbol_length: symbol_length,
        data: data
      }
    });
  }
}
module.exports = PeripheralPWM;

/***/ }),

/***/ "./obniz/libs/io_peripherals/spi.js":
/*!******************************************!*\
  !*** ./obniz/libs/io_peripherals/spi.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../utils/util */ "./obniz/libs/utils/util.js");

class PeripheralSPI {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.observers = [];
    this.used = false;
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  start(params) {

    var err = ObnizUtil._requiredKeys(params, ["mode", "frequency"]);
    if (err) {
      throw new Error("spi start param '" + err + "' required, but not found ");return;
    }
    this.params = ObnizUtil._keyFilter(params, ["mode", "clk", "mosi", "miso", "frequency", "drive", "pull"]);
    var obj = {};

    let ioKeys = ["clk", "mosi", "miso"];
    for (let key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }

    obj["spi" + this.id] = {
      mode: this.params.mode,
      clock: this.params.frequency //name different
    };
    if (this.params.clk !== undefined) {
      obj["spi" + this.id].clk = this.params.clk;
    }
    if (this.params.mosi !== undefined) {
      obj["spi" + this.id].mosi = this.params.mosi;
    }
    if (this.params.miso !== undefined) {
      obj["spi" + this.id].miso = this.params.miso;
    }

    if (this.params.drive) {
      if (this.params.clk !== undefined) this.Obniz.getIO(this.params.clk).drive(this.params.drive);
      if (this.params.mosi !== undefined) this.Obniz.getIO(this.params.mosi).drive(this.params.drive);
      if (this.params.miso !== undefined) this.Obniz.getIO(this.params.miso).drive(this.params.drive);
    } else {
      if (this.params.clk !== undefined) this.Obniz.getIO(this.params.clk).drive("5v");
      if (this.params.mosi !== undefined) this.Obniz.getIO(this.params.mosi).drive("5v");
      if (this.params.miso !== undefined) this.Obniz.getIO(this.params.miso).drive("5v");
    }

    if (this.params.pull) {
      if (this.params.clk !== undefined) this.Obniz.getIO(this.params.clk).pull(this.params.pull);
      if (this.params.mosi !== undefined) this.Obniz.getIO(this.params.mosi).pull(this.params.pull);
      if (this.params.miso !== undefined) this.Obniz.getIO(this.params.miso).pull(this.params.pull);
    } else {
      if (this.params.clk !== undefined) this.Obniz.getIO(this.params.clk).pull(null);
      if (this.params.mosi !== undefined) this.Obniz.getIO(this.params.mosi).pull(null);
      if (this.params.miso !== undefined) this.Obniz.getIO(this.params.miso).pull(null);
    }

    this.used = true;
    this.Obniz.send(obj);
  }

  writeWait(data) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var obj = {};
      obj["spi" + self.id] = {
        data: data,
        read: true
      };
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  write(data) {
    var self = this;
    var obj = {};
    obj["spi" + self.id] = {
      data: data,
      read: false
    };
    self.Obniz.send(obj);
  }

  notified(obj) {
    // TODO: we should compare byte length from sent
    var callback = this.observers.shift();
    if (callback) {
      callback(obj.data);
    }
  }

  isUsed() {
    return this.used;
  }

  end(reuse) {
    var self = this;
    var obj = {};
    obj["spi" + self.id] = null;
    this.params = null;
    self.Obniz.send(obj);
    if (!reuse) {
      this.used = false;
    }
  }
}
module.exports = PeripheralSPI;

/***/ }),

/***/ "./obniz/libs/io_peripherals/uart.js":
/*!*******************************************!*\
  !*** ./obniz/libs/io_peripherals/uart.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../utils/util */ "./obniz/libs/utils/util.js");
const isNode = typeof window === 'undefined';

class PeripheralUART {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.received = new Uint8Array([]);
    this.used = false;
  }

  start(params) {

    var err = ObnizUtil._requiredKeys(params, ["tx", "rx"]);
    if (err) {
      throw new Error("uart start param '" + err + "' required, but not found ");
      return;
    }
    this.params = ObnizUtil._keyFilter(params, ["tx", "rx", "baud", "stop", "bits", "parity", "flowcontrol", "rts", "cts", "drive", "pull"]);

    let ioKeys = ["rx", "tx", "rts", "cts"];
    for (let key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("uart start param '" + key + "' are to be valid io no");
      }
    }

    if (this.params.hasOwnProperty("drive")) {
      this.Obniz.getIO(this.params.rx).drive(this.params.drive);
      this.Obniz.getIO(this.params.tx).drive(this.params.drive);
    } else {
      this.Obniz.getIO(this.params.rx).drive("5v");
      this.Obniz.getIO(this.params.tx).drive("5v");
    }

    if (this.params.hasOwnProperty("pull")) {
      this.Obniz.getIO(this.params.rx).pull(this.params.pull);
      this.Obniz.getIO(this.params.tx).pull(this.params.pull);
    } else {
      this.Obniz.getIO(this.params.rx).pull(null);
      this.Obniz.getIO(this.params.tx).pull(null);
    }

    var obj = {};
    obj["uart" + this.id] = this.params;
    this.Obniz.send(obj);
    this.received = [];
    this.used = true;
  }

  send(data) {
    var send_data = null;
    if (data === undefined) {
      return;
    }
    if (typeof data === "number") {
      data = [data];
    }
    if (isNode && data instanceof Buffer) {
      var arr = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === "string") {
      if (isNode) {
        const buf = Buffer(data);
        send_data = [...buf];
      } else if (TextEncoder) {
        const typedArray = new TextEncoder("utf-8").encode(data);
        send_data = new Array(typedArray.length);
        for (var i = 0; i < typedArray.length; i++) {
          send_data[i] = typedArray[i];
        }
      }
    }
    var obj = {};
    obj["uart" + this.id] = {};
    obj["uart" + this.id].data = send_data;
    //  console.log(obj);
    this.Obniz.send(obj);
  }

  isDataExists() {
    return this.received && this.received.length > 0;
  }

  readBytes() {
    var results = [];
    if (this.isDataExists()) {
      for (var i = 0; i < this.received.length; i++) {
        results.push(this.received[i]);
      }
    }
    this.received = [];
    return results;
  }

  readText() {
    var string = null;
    if (this.isDataExists()) {
      var data = this.readBytes();
      string = this.tryConvertString(data);
    }
    this.received = [];
    return string;
  }

  tryConvertString(data) {
    return ObnizUtil.dataArray2string(data);
  }

  notified(obj) {
    if (this.onreceive) {
      var string = this.tryConvertString(obj.data);
      this.onreceive(obj.data, string);
    } else {
      if (!this.received) {
        this.received = [];
      }

      this.received.push.apply(this.received, obj.data);
    }
  }

  isUsed() {
    return this.used;
  }

  end() {
    var obj = {};
    obj["uart" + this.id] = null;
    this.params = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}
module.exports = PeripheralUART;

/***/ }),

/***/ "./obniz/libs/measurements/logicanalyzer.js":
/*!**************************************************!*\
  !*** ./obniz/libs/measurements/logicanalyzer.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../utils/util */ "./obniz/libs/utils/util.js");

class LogicAnalyzer {

  constructor(obniz) {
    this.obniz = obniz;
  }

  start(params) {

    var err = ObnizUtil._requiredKeys(params, ["io", "interval", "duration"]);
    if (err) {
      throw new Error("LogicAnalyzer start param '" + err + "' required, but not found ");return;
    }
    this.params = ObnizUtil._keyFilter(params, ["io", "interval", "duration", "trigerValue", "trigerValueSamples"]);

    var obj = {};
    obj.logic_analyzer = {
      io: [this.params.io],
      interval: this.params.interval,
      duration: this.params.duration
    };
    if (this.params.trigerValueSamples > 0) {
      obj.logic_analyzer.triger = {
        value: !!this.params.trigerValue,
        samples: this.params.trigerValueSamples
      };
    }

    this.obniz.send(obj);
    return;
  }

  end() {
    var obj = {};
    obj.logic_analyzer = null;
    this.obniz.send(obj);
    return;
  }

  notified(obj) {
    if (this.onmeasured) {
      this.onmeasured(obj.data);
    } else {
      if (!this.measured) {
        this.measured = [];
      }
      this.measured.push(obj.data);
    }
    return;
  }
}

module.exports = LogicAnalyzer;

/***/ }),

/***/ "./obniz/libs/measurements/measure.js":
/*!********************************************!*\
  !*** ./obniz/libs/measurements/measure.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../utils/util */ "./obniz/libs/utils/util.js");

class ObnizMeasure {

  constructor(obniz) {
    this.obniz = obniz;
    this.observers = [];
  }

  echo(params) {
    var err = ObnizUtil._requiredKeys(params, ["io_pulse", "pulse", "pulse_width", "io_echo", "measure_edges"]);
    if (err) {
      throw new Error("Measure start param '" + err + "' required, but not found ");return;
    }
    this.params = ObnizUtil._keyFilter(params, ["io_pulse", "pulse", "pulse_width", "io_echo", "measure_edges", "timeout", "callback"]);

    var echo = {};
    echo.io_pulse = this.params.io_pulse;
    echo.pulse = this.params.pulse;
    echo.pulse_width = this.params.pulse_width;
    echo.io_echo = this.params.io_echo;
    echo.measure_edges = this.params.measure_edges;
    if (typeof this.params.timeout === "number") {
      echo.timeout = this.params.timeout;
    }

    this.obniz.send({
      measure: {
        echo: echo
      }
    });

    if (this.params.callback) {
      this.observers.push(this.params.callback);
    }
  }

  notified(obj) {
    var callback = this.observers.shift();
    if (callback) {
      callback(obj.echo);
    }
  }
}
module.exports = ObnizMeasure;

/***/ }),

/***/ "./obniz/libs/utils/util.js":
/*!**********************************!*\
  !*** ./obniz/libs/utils/util.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let isNode = typeof window === 'undefined';

class ObnizUtil {

  constructor(obniz) {
    this.obniz = obniz;
  }

  createCanvasContext(width, height) {
    if (this.obniz.isNode) {
      try {
        const { createCanvas } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"canvas\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
        return createCanvas(this.width, this.height);
        throw new Error();
      } catch (e) {
        throw new Error('obniz.js require node-canvas to draw rich contents. see more detail on docs');
      }
    } else {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style["-webkit-font-smoothing"] = "none";
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(canvas);

      var ctx = canvas.getContext("2d");
      return ctx;
    }
  }

  static _keyFilter(params, keys) {
    var filterdParams = {};
    if (typeof params !== "object") {
      return filterdParams;
    }
    filterdParams = Object.keys(params).filter(key => keys.includes(key)).reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

    return filterdParams;
  }

  /**
   *
   * @return {String} key name of not found. 
   */
  static _requiredKeys(params, keys) {
    if (typeof params !== "object") {
      return keys[0];
    }

    for (var index in keys) {
      if (!(keys[index] in params)) {
        return keys[index];
      }
    }
    return null;
  }

  static dataArray2string(data) {
    var string = null;
    try {
      if (isNode) {
        const StringDecoder = __webpack_require__(/*! string_decoder */ "string_decoder").StringDecoder;
        if (StringDecoder) {
          string = new StringDecoder('utf8').write(Buffer.from(data));
        }
      } else if (TextDecoder) {
        string = new TextDecoder("utf-8").decode(new Uint8Array(data));
      }
    } catch (e) {
      //this.obniz.error(e);
    }
    return string;
  }

  static string2dataArray(str) {
    if (isNode) {
      const buf = Buffer(str);
      return [...buf];
    } else if (TextEncoder) {
      const typedArray = new TextEncoder("utf-8").encode(str);
      var arr = new Array(typedArray.length);
      for (var i = 0; i < typedArray.length; i++) {
        arr[i] = typedArray[i];
      }
      return arr;
    }
    return null;
  }
}

module.exports = ObnizUtil;

/***/ }),

/***/ "./obniz/libs/webpackReplace sync recursive":
/*!****************************************!*\
  !*** ./obniz/libs/webpackReplace sync ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./obniz/libs/webpackReplace sync recursive";

/***/ }),

/***/ "./obniz/libs/webpackReplace/require-context.js":
/*!******************************************************!*\
  !*** ./obniz/libs/webpackReplace/require-context.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

let baseDir = undefined;
let yaml = __webpack_require__(/*! js-yaml */ "js-yaml");
let fs = __webpack_require__(/*! fs */ "fs");

module.exports = function (directory, recursive, regExp) {
  let dir = __webpack_require__(/*! node-dir */ "node-dir");
  let path = __webpack_require__(/*! path */ "path");

  // Assume absolute path by default
  let basepath = directory;

  if (directory[0] === '.') {
    // Relative path
    let dir = __dirname;
    if (baseDir) {
      dir = baseDir;
    }
    basepath = path.join(dir, directory);
  } else if (!path.isAbsolute(directory)) {
    // Module path
    basepath = /*require.resolve*/(__webpack_require__("./obniz/libs/webpackReplace sync recursive").resolve(directory));
  }

  let keys = dir.files(basepath, {
    sync: true,
    recursive: recursive || false
  }).filter(function (file) {
    return file.match(regExp || /\.(json|js)$/);
  }).map(function (file) {
    return path.join('.', file.slice(basepath.length + 1));
  });

  let context = function (key) {
    let path = context.resolve(key);
    if (/\.(json|js)$/.test(path)) {
      return __webpack_require__("./obniz/libs/webpackReplace sync recursive")(path);
    } else if (/\.(yaml|yml)$/.test(path)) {
      return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    } else {
      throw new Error("unknown type");
    }
  };

  context.resolve = function (key) {
    return path.join(basepath, key);
  };

  context.keys = function () {
    return keys;
  };

  return context;
};

module.exports.setBaseDir = function (base) {
  baseDir = base;
};
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./obniz/libs/wscommand sync recursive":
/*!***********************************!*\
  !*** ./obniz/libs/wscommand sync ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./obniz/libs/wscommand sync recursive";

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_.js":
/*!********************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSSchema = __webpack_require__(/*! ./WSSchema */ "./obniz/libs/wscommand/WSSchema.js");

let commandClasses = {};

class WSCommand {

  constructor(delegate) {
    this.delegate = delegate;

    //constants
    this.COMMAND_FUNC_ID_ERROR = 0xFF;
    this.ioNotUsed = 0xFF;
  }

  static get schema() {
    return WSSchema;
  }
  static get CommandClasses() {
    return commandClasses;
    // {
    //   WSCommand_System,
    //   WSCommand_Directive,
    //   WSCommand_IO,
    //   WSCommand_PWM,
    //   WSCommand_UART,
    //   WSCommand_AD,
    //   WSCommand_SPI,
    //   WSCommand_I2C,
    //   WSCommand_LogicAnalyzer,
    //   WSCommand_Display,
    //   WSCommand_Switch,
    //   WSCommand_Ble,
    //   WSCommand_Measurement
    // };
  }

  static addCommandClass(name, classObj) {
    commandClasses[name] = classObj;
  }

  static framed(module, func, payload) {
    var payload_length = 0;
    if (payload) {
      payload_length = payload.length;
    }
    var length_type;
    if (payload_length <= 0x3F) {
      length_type = 0;
    } else if (payload_length <= 0x3FFF) {
      length_type = 1;
    } else if (payload_length <= 0x3FFFFFFF) {
      length_type = 2;
    } else {
      throw new Error("too big payload");
      return null;
    }
    var length_extra_bytse = length_type == 0 ? 0 : length_type == 1 ? 1 : 3;
    var header_length = 3 + length_extra_bytse;
    var result = new Uint8Array(header_length + payload_length);
    var index = 0;
    result[index++] = module & 0x7F;
    result[index++] = func;
    result[index++] = length_type << 6 | payload_length >> length_extra_bytse * 8;
    while (length_extra_bytse > 0) {
      length_extra_bytse--;
      result[index++] = payload_length >> length_extra_bytse * 8;
    }
    if (payload_length == 0) {
      return result;
    } else {
      result.set(payload, header_length);
      return result;
    }
  }

  static dequeueOne(buf) {
    if (!buf || buf.byteLength == 0) return null;
    if (buf.byteLength < 3) {
      throw new Eror("something wrong. buf less than 3");
    }
    if (buf[0] & 0x80) {
      throw new Eror("reserved bit 1");
    }
    var module = 0x7F & buf[0];
    var func = buf[1];
    var length_type = buf[2] >> 6 & 0x3;
    var length_extra_bytse = length_type == 0 ? 0 : length_type == 1 ? 1 : 3;
    if (length_type == 4) {
      throw new Eror("invalid length");
    }
    var length = (buf[2] & 0x3F) << length_extra_bytse * 8;
    var index = 3;
    var shift = length_extra_bytse;
    while (shift > 0) {
      shift--;
      length += buf[index] << shift * 8;
      index++;
    }

    return {
      module: module,
      func: func,
      payload: buf.slice(3 + length_extra_bytse, 3 + length_extra_bytse + length),
      next: buf.slice(3 + length_extra_bytse + length)
    };
  }

  static compress(wscommands, json) {
    var ret = null;
    function append(module, func, payload) {
      var frame = WSCommand.framed(module, func, payload);
      if (ret) {
        var combined = new Uint8Array(ret.length + frame.length);
        combined.set(ret, 0);
        combined.set(frame, ret.length);
        ret = combined;
      } else {
        ret = frame;
      }
    }
    for (let i = 0; i < wscommands.length; i++) {
      const wscommand = wscommands[i];
      wscommand.parsed = append;
      wscommand.parseFromJson(json);
    }
    return ret;
  }

  sendCommand(func, payload) {
    if (this.delegate && this.delegate.onParsed) {
      this.delegate.onParsed(this.module, func, payload);
    }
    if (this.parsed) {
      this.parsed(this.module, func, payload);
    }
  }

  parseFromJson(json) {}

  notifyFromBinary(objToSend, func, payload) {

    switch (func) {
      case this.COMMAND_FUNC_ID_ERROR:
        if (!objToSend.debug) objToSend.debug = {};
        var err = {
          module: this.module,
          _args: [...payload]
        };

        if (payload.byteLength == 3) {
          err.err0 = payload[0];
          err.err1 = payload[1];
          err.function = payload[2];
          err.message = `Error module=${this.module} func=${err.function} err0=${err.err0} returned=${err.err1}`;
        } else {
          err.message = `Error module=${this.module} with + ${err._args}`;
        }
        objToSend.debug.error = err;
        break;

      default:
        // unknown
        break;
    }
  }

  envelopWarning(objToSend, module_key, obj) {
    if (!objToSend[module_key]) objToSend[module_key] = {};
    objToSend[module_key].warning = obj;
  }

  envelopError(objToSend, module_key, obj) {
    if (!objToSend[module_key]) objToSend[module_key] = {};
    objToSend[module_key].error = obj;
  }

  isValidIO(io) {
    return typeof io === "number" && 0 <= io && io <= 11;
  }

  getSchema(uri) {
    //chack isFirst

    return WSSchema.getSchema(uri);
  }

  validateCommandSchema(uriList, json, rootPath, customArg) {
    let res = { valid: 0, invalid: 0, results: [], invalidButLike: [] };
    for (let oneRow of uriList) {
      let errors = this.validate(oneRow.uri, json);
      res.results.push(errors);
      if (errors.valid) {
        res.valid++;
        if (oneRow.onValid) {
          oneRow.onValid.bind(this)(this.filter(oneRow.uri, json), customArg);
        }
      } else {
        res.invalid++;
        let message = this.onlyTypeErrorMessage(errors, rootPath);
        if (message) {
          res.invalidButLike.push({ uri: oneRow.uri, message });
        }
      }
    }

    return res;
  }

  validate(commandUri, json) {
    let schema = this.getSchema(commandUri);
    let results = WSSchema.validateMultiple(json, schema);
    return results;
  }

  onlyTypeErrorMessage(validateError, rootPath) {
    if (validateError.valid) {
      return true;
    }
    if (validateError.missing && validateError.missing.length > 0) {
      return false;
    }

    let badErrorCodes = [WSSchema.errorCodes.ANY_OF_MISSING, WSSchema.errorCodes.ONE_OF_MISSING, WSSchema.errorCodes.ONE_OF_MULTIPLE, WSSchema.errorCodes.NOT_PASSED, WSSchema.errorCodes.OBJECT_REQUIRED, WSSchema.errorCodes.OBJECT_ADDITIONAL_PROPERTIES, WSSchema.errorCodes.CIRCULAR_REFERENCE, WSSchema.errorCodes.FORMAT_CUSTOM, WSSchema.errorCodes.KEYWORD_CUSTOM, WSSchema.errorCodes.UNKNOWN_PROPERTY];
    let messages = [];
    for (let error of validateError.errors) {
      if (error.code === WSSchema.errorCodes.INVALID_TYPE) {
        if (error.params.type === "object" || error.params.expected === "object") {
          return false;
        }
      } else if (badErrorCodes.includes(error.code)) {
        return false;
      }

      let path = rootPath + error.dataPath.replace(/\//g, ".");
      messages.push(`[${path}]${error.message}`);
    }
    return messages.join(";");
  }

  filter(commandUri, json) {
    let schema = this.getSchema(commandUri);
    return this._filterSchema(schema, json);
  }

  _filterSchema(schema, json) {

    if (schema["$ref"]) {
      let refSchema = WSSchema.getSchema(schema["$ref"]);
      return this._filterSchema(refSchema, json);
    }

    if (json === undefined) {
      return schema.default;
    }

    if (schema.type === "string" || schema.type === "integer" || schema.type === "boolean" || schema.type === "number" || schema.type === "null" || schema.filter === "pass_all") {
      return json;
    }

    if (schema.type === "array") {
      let results = [];
      for (let key in json) {
        results[key] = this._filterSchema(schema.items, json[key]);
      }
      return results;
    }

    if (schema.type === "object") {
      let results = {};
      for (let key in schema.properties) {
        results[key] = this._filterSchema(schema.properties[key], json[key]);
      }

      for (let pattern in schema.patternProperties) {
        let reg = new RegExp(pattern);
        for (let key in Object.keys(json)) {
          if (reg.test(key)) {
            results[key] = this._filterSchema(schema.patternProperties[pattern], json[key]);
          }
        }
      }
      return results;
    }

    throw Error("unknown json schema type");
  }

  get WSCommandNotFoundError() {
    return WSCommandNotFoundError;
  }
}

class WSCommandNotFoundError extends Error {}

module.exports = WSCommand;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_AD.js":
/*!**********************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_AD.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_AD extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 7;

    this._CommandInitNormalInterval = 0;
    this._CommandDeinit = 1;
    this._CommandNotifyValue = 2;
    this._CommandDoOnece = 3;
  }

  // Commands


  get(params, no) {
    var buf = new Uint8Array([no]);
    this.sendCommand(params.stream ? this._CommandInitNormalInterval : this._CommandDoOnece, buf);
  }

  deinit(params, no) {
    var buf = new Uint8Array([no]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  parseFromJson(json) {
    for (var i = 0; i < 12; i++) {
      var module = json["ad" + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [{ uri: "/request/ad/deinit", onValid: this.deinit }, { uri: "/request/ad/get", onValid: this.get }];
      let res = this.validateCommandSchema(schemaData, module, "ad" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[ad${i}]unknown command`);
        }
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandNotifyValue) {
      for (var i = 0; i < payload.byteLength; i += 3) {
        var value = (payload[i + 1] << 8) + payload[i + 2];
        value = value / 100.0;
        objToSend["ad" + payload[i]] = value;
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_AD;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Ble.js":
/*!***********************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_Ble.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const JsonBinaryConverter = __webpack_require__(/*! ./jsonBinaryConverter */ "./obniz/libs/wscommand/jsonBinaryConverter.js");
const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_Ble extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 11;

    this.uuidLength = 16 + 2;

    this._CommandSetAdvData = 0;
    this._CommandSetScanRespData = 1;
    this._CommandStartAdv = 2;
    this._CommandStopAdv = 3;
    this._CommandScan = 4;
    this._CommandStartScan = 4;
    this._CommandStopScan = 5;
    this._CommandScanResults = 6;
    this._CommandConnect = 7;
    this._CommandServices = 8;
    this._CommandCharacteristics = 9;
    this._CommandWriteCharacteristics = 10;
    this._CommandReadCharacteristics = 11;
    // this._CommandNotifyCharacteristics = 12; // currently not used
    // this._CommandNotifyCharacteristicsResults = 13; // currently not used
    this._CommandDescriptors = 14;
    this._CommandWriteDescriptor = 15;
    this._CommandReadDescriptor = 16;

    this._CommandServerStartPeripheral = 20;
    this._CommandServerNotifyConnect = 21;
    this._CommandServerAddService = 22;
    this._CommandServerAddCharacteristic = 23;
    this._CommandServerAddDescriptor = 24;
    this._CommandServerWriteCharavteristicValue = 25;
    this._CommandServerReadCharavteristicValue = 26;
    this._CommandServerNotifyWriteCharavteristicValue = 27;
    this._CommandServerNotifyReadCharavteristicValue = 28;
    this._CommandServerWriteDescriptorValue = 29;
    this._CommandServerReadDescriptorValue = 30;
    this._CommandServerNotifyWriteDescriptorValue = 31;
    this._CommandServerNotifyReadDescriptorValue = 32;

    this._CommandScanResultsDevice = {
      breder: 0x01,
      ble: 0x02,
      dumo: 0x03
    };

    /// BLE device address type
    this._CommandScanResultsDeviceAddress = {
      public: 0x00,
      random: 0x01,
      rpa_public: 0x02,
      rpa_random: 0x03
    };

    this._CommandScanResultsEvet = {
      inquiry_result: 0, /*!< Inquiry result for a peer device. */
      inquiry_complete: 1, /*!< Inquiry complete. */
      discovery_result: 2, /*!< Discovery result for a peer device. */
      discovery_ble_result: 3, /*!< Discovery result for BLE GATT based service on a peer device. */
      discovery_cmoplete: 4, /*!< Discovery complete. */
      discovery_di_cmoplete: 5, /*!< Discovery complete. */
      cancelled: 6 /*!< Search cancelled */
    };

    this._CommandScanResultsBleEvent = {
      connectable_advertisemnt: 0x00, /*!< Connectable undirected advertising (ADV_IND) */
      connectable_directed_advertisemnt: 0x01, /*!< Connectable directed advertising (ADV_DIRECT_IND) */
      scannable_advertising: 0x02, /*!< Scannable undirected advertising (ADV_SCAN_IND) */
      non_connectable_advertising: 0x03, /*!< Non connectable undirected advertising (ADV_NONCONN_IND) */
      scan_response: 0x04 /*!< Scan Response (SCAN_RSP) */
    };
  }

  /* CENTRAL   */

  centralScanStart(params) {
    let schema = [{ path: "scan.duration", length: 4, type: "int", default: 30 }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandStartScan, buf);
  }

  centralScanStop(params) {
    this.sendCommand(this._CommandStopScan, null);
  }

  centralConnect(params) {
    let schema = [{ path: "connect.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: null, length: 1, type: "char", default: false //const val
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  centralDisconnect(params) {
    let schema = [{ path: "connect.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: null, length: 1, type: "char", default: true //const val
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  centralServiceGet(params) {
    let schema = [{ path: "get_services.address", length: 6, type: "hex", required: true, endianness: "little" }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServices, buf);
  }

  centralCharacteristicGet(params) {
    var schema = [{ path: "get_characteristics.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: "get_characteristics.service_uuid", length: 18, type: "uuid", required: true }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandCharacteristics, buf);
  }

  centralCharacteristicRead(params) {
    var schema = [{ path: "read_characteristic.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: "read_characteristic.service_uuid", length: 18, type: "uuid", required: true }, { path: "read_characteristic.characteristic_uuid", length: 18, type: "uuid", required: true }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadCharacteristics, buf);
  }

  centralCharacteristicWrite(params) {
    var schema = [{ path: "write_characteristic.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: "write_characteristic.service_uuid", length: 18, type: "uuid", required: true }, { path: "write_characteristic.characteristic_uuid", length: 18, type: "uuid", required: true }, { path: "write_characteristic.needResponse", length: 1, type: "char", default: 1 }, { path: "write_characteristic.data", length: null, type: "dataArray" }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandWriteCharacteristics, buf);
  }

  centralDescriptorGet(params) {
    var schema = [{ path: "get_descriptor.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: "get_descriptor.service_uuid", length: 18, type: "uuid", required: true }, { path: "get_descriptor.characteristic_uuid", length: 18, type: "uuid", required: true }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandDescriptors, buf);
  }

  centralDescriptorRead(params) {
    var schema = [{ path: "read_descriptor.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: "read_descriptor.service_uuid", length: 18, type: "uuid", required: true }, { path: "read_descriptor.characteristic_uuid", length: 18, type: "uuid", required: true }, { path: "read_descriptor.descriptor_uuid", length: 18, type: "uuid", required: true }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadDescriptor, buf);
  }

  centralDescriptorWrite(params) {
    var schema = [{ path: "write_descriptor.address", length: 6, type: "hex", required: true, endianness: "little" }, { path: "write_descriptor.service_uuid", length: 18, type: "uuid", required: true }, { path: "write_descriptor.characteristic_uuid", length: 18, type: "uuid", required: true }, { path: "write_descriptor.descriptor_uuid", length: 18, type: "uuid", required: true }, { path: "write_descriptor.needResponse", length: 1, type: "char", default: 1 }, { path: "write_descriptor.data", length: null, type: "dataArray" }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandWriteDescriptor, buf);
  }

  /* PERIPHERAL   */

  peripheralAdvertisementStart(params) {
    this.sendCommand(this._CommandSetAdvData, new Uint8Array(params.advertisement.adv_data));

    if (params.advertisement.scan_resp) {
      this.sendCommand(this._CommandSetScanRespData, new Uint8Array(params.advertisement.scan_resp));
    }

    this.sendCommand(this._CommandStartAdv, null);
  }

  peripheralAdvertisementStop(params) {
    this.sendCommand(this._CommandStopAdv, null);
  }

  peripheralServiceStart(params) {
    let val = params["peripheral"];
    var propFlags = {
      0x01: "broadcast",
      0x02: "read",
      0x04: "write_no_response",
      0x08: "write",
      0x10: "notify",
      0x20: "indiate",
      0x40: "auth",
      0x80: "ext_prop"
    };
    var schema = {
      service: {
        command: this._CommandServerAddService,
        schema: [{ path: "uuid", length: 18, type: "uuid", required: true }]
      },
      characteristic: {
        command: this._CommandServerAddCharacteristic,
        schema: [{ path: "service_uuid", length: 18, type: "uuid", required: true }, { path: "uuid", length: 18, type: "uuid", required: true }, { path: "property", length: 1, type: "flag", default: ["write", "read"], flags: propFlags }, //read and write OK
        { path: "data", type: "dataArray" }]
      },
      descriptor: {
        command: this._CommandServerAddDescriptor,
        schema: [{ path: "service_uuid", length: 18, type: "uuid", required: true }, { path: "characteristic_uuid", length: 18, type: "uuid", required: true }, { path: "uuid", length: 18, type: "uuid", required: true }, { path: "property", length: 1, type: "flag", default: ["read"], flags: propFlags }, //read OK
        { path: "data", type: "dataArray" }]
      }
    };

    var sendBufs = [];
    var buf;
    for (var serviceIndex in val["services"]) {
      var service = val["services"][serviceIndex];
      buf = JsonBinaryConverter.createSendBuffer(schema["service"].schema, service);
      if (buf.length === 0) {
        return;
      }
      sendBufs.push({ command: schema["service"].command, buffer: buf });

      for (var charaIndex in service["characteristics"]) {
        var chara = service["characteristics"][charaIndex];
        chara.service_uuid = service.uuid;
        buf = JsonBinaryConverter.createSendBuffer(schema["characteristic"].schema, chara);
        if (buf.length === 0) {
          return;
        }
        sendBufs.push({ command: schema["characteristic"].command, buffer: buf });

        for (var descIndex in chara["descriptors"]) {
          var desc = chara["descriptors"][descIndex];
          desc.service_uuid = service.uuid;
          desc.characteristic_uuid = chara.uuid;
          buf = JsonBinaryConverter.createSendBuffer(schema["descriptor"].schema, desc);
          if (buf.length === 0) {
            return;
          }
          sendBufs.push({ command: schema["descriptor"].command, buffer: buf });
        }
      }
    }
    if (sendBufs.length > 0) {
      sendBufs.push({ command: this._CommandServerStartPeripheral, buffer: new Uint8Array([0]) });
    }
    for (var index in sendBufs) {
      this.sendCommand(sendBufs[index].command, sendBufs[index].buffer);
    }
  }

  peripheralServiceStop(params) {
    this.sendCommand(this._CommandServerStartPeripheral, new Uint8Array([1]));
  }

  peripheralCharacteristicRead(params) {
    var schema = [{ path: "peripheral.read_characteristic.service_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.read_characteristic.characteristic_uuid", length: 18, type: "uuid", required: true }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadCharavteristicValue, buf);
  }

  peripheralCharacteristicWrite(params) {
    var schema = [{ path: "peripheral.write_characteristic.service_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.write_characteristic.characteristic_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.write_characteristic.data", type: "dataArray" }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteCharavteristicValue, buf);
  }

  peripheralDescriptorRead(params) {
    var schema = [{ path: "peripheral.read_descriptor.service_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.read_descriptor.characteristic_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.read_descriptor.descriptor_uuid", length: 18, type: "uuid", required: true }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadDescriptorValue, buf);
  }

  peripheralDescriptorWrite(params) {
    var schema = [{ path: "peripheral.write_descriptor.service_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.write_descriptor.characteristic_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.write_descriptor.descriptor_uuid", length: 18, type: "uuid", required: true }, { path: "peripheral.write_descriptor.data", type: "dataArray" }];
    var buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteDescriptorValue, buf);
  }

  parseFromJson(json) {
    var module = json["ble"];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: "/request/ble/central/scan_start", onValid: this.centralScanStart }, { uri: "/request/ble/central/scan_stop", onValid: this.centralScanStop }, { uri: "/request/ble/central/connect", onValid: this.centralConnect }, { uri: "/request/ble/central/disconnect", onValid: this.centralDisconnect }, { uri: "/request/ble/central/service_get", onValid: this.centralServiceGet }, { uri: "/request/ble/central/characteristic_get", onValid: this.centralCharacteristicGet }, { uri: "/request/ble/central/characteristic_read", onValid: this.centralCharacteristicRead }, { uri: "/request/ble/central/characteristic_write", onValid: this.centralCharacteristicWrite }, { uri: "/request/ble/central/descriptor_get", onValid: this.centralDescriptorGet }, { uri: "/request/ble/central/descriptor_read", onValid: this.centralDescriptorRead }, { uri: "/request/ble/central/descriptor_write", onValid: this.centralDescriptorWrite }, { uri: "/request/ble/peripheral/advertisement_start", onValid: this.peripheralAdvertisementStart }, { uri: "/request/ble/peripheral/advertisement_stop", onValid: this.peripheralAdvertisementStop }, { uri: "/request/ble/peripheral/service_start", onValid: this.peripheralServiceStart }, { uri: "/request/ble/peripheral/service_stop", onValid: this.peripheralServiceStop }, { uri: "/request/ble/peripheral/characteristic_read", onValid: this.peripheralCharacteristicRead }, { uri: "/request/ble/peripheral/characteristic_write", onValid: this.peripheralCharacteristicWrite }, { uri: "/request/ble/peripheral/descriptor_read", onValid: this.peripheralDescriptorRead }, { uri: "/request/ble/peripheral/descriptor_write", onValid: this.peripheralDescriptorWrite }];
    let res = this.validateCommandSchema(schemaData, module, "ble");
    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[ble]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    let funcList = {};
    funcList[this._CommandScanResults] = this.notifyFromBinaryScanResponse.bind(this);
    funcList[this._CommandConnect] = this.notifyFromBinaryConnect.bind(this);
    funcList[this._CommandServices] = this.notifyFromBinaryServices.bind(this);
    funcList[this._CommandCharacteristics] = this.notifyFromBinaryChacateristics.bind(this);
    funcList[this._CommandWriteCharacteristics] = this.notifyFromBinaryWriteChacateristics.bind(this);
    funcList[this._CommandReadCharacteristics] = this.notifyFromBinaryReadChacateristics.bind(this);
    funcList[this._CommandDescriptors] = this.notifyFromBinaryDescriptors.bind(this);
    funcList[this._CommandWriteDescriptor] = this.notifyFromBinaryWriteDescriptor.bind(this);
    funcList[this._CommandReadDescriptor] = this.notifyFromBinaryReadDescriptor.bind(this);

    funcList[this._CommandServerNotifyConnect] = this.notifyFromBinaryServerConnectionState.bind(this);
    funcList[this._CommandServerReadCharavteristicValue] = this.notifyFromBinaryServerReadCharavteristicValue.bind(this);
    funcList[this._CommandServerWriteCharavteristicValue] = this.notifyFromBinaryServerWriteCharavteristicValue.bind(this);
    funcList[this._CommandServerNotifyReadCharavteristicValue] = this.notifyFromBinaryServerNotifyReadCharavteristicValue.bind(this);
    funcList[this._CommandServerNotifyWriteCharavteristicValue] = this.notifyFromBinaryServerNotifyWriteCharavteristicValue.bind(this);
    funcList[this._CommandServerReadDescriptorValue] = this.notifyFromBinaryServerReadDescriptorValue.bind(this);
    funcList[this._CommandServerWriteDescriptorValue] = this.notifyFromBinaryServerWriteDescriptorValue.bind(this);
    funcList[this._CommandServerNotifyReadDescriptorValue] = this.notifyFromBinaryServerNotifyReadDescriptorValue.bind(this);
    funcList[this._CommandServerNotifyWriteDescriptorValue] = this.notifyFromBinaryServerNotifyWriteDescriptorValue.bind(this);

    funcList[this.COMMAND_FUNC_ID_ERROR] = this.notifyFromBinaryError.bind(this);

    if (funcList[func]) {
      funcList[func](objToSend, payload);
    }
  }

  notifyFromBinaryScanResponse(objToSend, payload) {
    if (payload.byteLength > 1) {

      var schema = [{ name: "event_type", type: "enum", length: 1, enum: this._CommandScanResultsEvet }, { name: "address", type: "hex", length: 6, endianness: "little" }, { name: "device_type", type: "enum", length: 1, enum: this._CommandScanResultsDevice }, { name: "address_type", type: "enum", length: 1, enum: this._CommandScanResultsDeviceAddress }, { name: "ble_event_type", type: "enum", length: 1, enum: this._CommandScanResultsBleEvent }, { name: "rssi", type: "signed number", length: 4 }, { name: "adv_data", type: "dataArray", length: 31 * 2 }, { name: "flag", type: "number", length: 4 }, { name: "num_response", type: "number", length: 4 }, { name: "advertise_length", type: "number", length: 1 }, { name: "scan_response_length", type: "number", length: 1 }];

      var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

      results.scan_resp = results.adv_data.slice(results.advertise_length, results.advertise_length + results.scan_response_length);
      results.adv_data = results.adv_data.slice(0, results.advertise_length);

      //      if(results.scan_response_length === 0){
      //          results.scan_resp = [];
      //      }else{
      //        results.scan_resp = results.adv_data.slice(results.advertise_length);
      //        results.adv_data = results.adv_data.slice(0, results.advertise_length);;
      //      }
      delete results.num_response;
      delete results.advertise_length;
      delete results.scan_response_length;
      delete results.advertise_data;

      if (results.event_type === "inquiry_complete") {
        results = { event_type: "inquiry_complete" };
      }

      this._addRowForPath(objToSend, "ble.scan_result", results);
    }
  }

  notifyFromBinaryConnect(objToSend, payload) {
    if (payload.length === 7) {
      var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "status", type: "enum", length: 1, enum: { "connected": 0, "disconnected": 1 } }];

      var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
      this._addRowForPath(objToSend, "ble.status_update", results);
    }
  }

  notifyFromBinaryServices(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.get_service_result", results);
  }

  notifyFromBinaryChacateristics(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.get_characteristic_result", results);
  }

  notifyFromBinaryReadChacateristics(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "data", type: "dataArray", length: null }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.read_characteristic_result", results);
  }

  notifyFromBinaryWriteChacateristics(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "result", type: "enum", length: 1, enum: { "success": 1, "failed": 0 } }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.write_characteristic_result", results);
  }

  notifyFromBinaryDescriptors(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "descriptor_uuid", type: "uuid", length: uuidLength }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.get_descriptors_results", results);
  }

  notifyFromBinaryReadDescriptor(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "descriptor_uuid", type: "uuid", length: this.uuidLength }, { name: "data", type: "dataArray", length: null }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.read_descriptor_result", results);
  }

  notifyFromBinaryWriteDescriptor(objToSend, payload) {
    var uuidLength = 16 + 2;
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: uuidLength }, { name: "characteristic_uuid", type: "uuid", length: uuidLength }, { name: "descriptor_uuid", type: "uuid", length: uuidLength }, { name: "result", type: "enum", length: 1, enum: { "success": 1, "failed": 0 } }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.write_descriptor_result", results);
  }

  notifyFromBinaryServerConnectionState(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "status", type: "enum", length: 1, enum: { "connected": 1, "disconnected": 0 } }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.connection_status", results);
  }

  notifyFromBinaryServerWriteCharavteristicValue(objToSend, payload) {
    var schema = [{ name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "result", type: "enum", length: 1, enum: { "success": 1, "failed": 0 } }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.write_characteristic_result", results);
  }

  notifyFromBinaryServerReadCharavteristicValue(objToSend, payload) {
    var schema = [{ name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "data", type: "dataArray", length: null }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.read_characteristic_result", results);
  }

  notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_read_characteristic", results);
  }

  notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "data", type: "dataArray", length: null }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_write_characteristic", results);
  }

  notifyFromBinaryServerReadDescriptorValue(objToSend, payload) {
    var schema = [{ name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "descriptor_uuid", type: "uuid", length: this.uuidLength }, { name: "data", type: "dataArray", length: null }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.read_descriptor_result", results);
  }

  notifyFromBinaryServerWriteDescriptorValue(objToSend, payload) {
    var schema = [{ name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "descriptor_uuid", type: "uuid", length: this.uuidLength }, { name: "result", type: "enum", length: 1, enum: { "success": 1, "failed": 0 } }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.write_descriptor_result", results);
  }

  notifyFromBinaryServerNotifyReadDescriptorValue(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "descriptor_uuid", type: "uuid", length: this.uuidLength }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_read_descriptor", results);
  }

  notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend, payload) {
    var schema = [{ name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "descriptor_uuid", type: "uuid", length: this.uuidLength }, { name: "data", type: "dataArray", length: null }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_write_descriptor", results);
  }

  notifyFromBinaryError(objToSend, payload) {
    var schema = [{ name: "esp_error_code", type: "char", length: 1 }, { name: "error_code", type: "char", length: 1 }, { name: "function_code", type: "char", length: 1 }, { name: "address", type: "hex", length: 6, endianness: "little" }, { name: "service_uuid", type: "uuid", length: this.uuidLength }, { name: "characteristic_uuid", type: "uuid", length: this.uuidLength }, { name: "descriptor_uuid", type: "uuid", length: this.uuidLength }];

    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    var errorMessage = {
      0x00: "error",
      0x01: "device not connected",
      0x02: "service not found",
      0x03: "charavteristic not found",
      0x04: "descriptor not found",
      0x05: "no permission",
      0x06: "device not found",
      0x07: "ble is busy",
      0x08: "service already running"
    };

    var functionMessage = {
      0: "on setting advertisement data",
      1: "on setting scan response data",
      2: "on starting advertisement",
      3: "on stopping advertisement",
      4: "on starting scan",
      5: "on stoping scan",
      6: "",
      7: "on connecting device",
      8: "on getting services",
      9: "on getting characteristic",
      10: "on writing characteristic",
      11: "on reading characteristic",
      14: "on getting descriptor",
      15: "on writing descriptor",
      16: "on reading descriptor",
      20: "on start pheripheral",
      21: "on notify connect",
      22: "on adding service",
      23: "on adding characteristic",
      24: "on adding descriptor",
      25: "on writing characteristic",
      26: "on reading characteristic",
      27: "on writing characteristic from remote",
      28: "on reading characteristic from remote",
      29: "on writing descriptor",
      30: "on reading descriptor",
      31: "on writing descriptor from remote",
      32: "on reading descriptor from remote"
    };

    results.message = errorMessage[results.error_code] + " " + functionMessage[results.function_code];

    delete results.esp_error_code;
    delete results.function_code;

    this.envelopError(objToSend, 'ble', results);
  }

  _addRowForPath(sendObj, path, row) {
    var keys = path.split('.');
    var target = sendObj;
    for (var index = 0; index < keys.length - 1; index++) {
      target[keys[index]] = target[keys[index]] || {};
      target = target[keys[index]];
    }
    target[keys[keys.length - 1]] = row;
  }
}

module.exports = WSCommand_Ble;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Directive.js":
/*!*****************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_Directive.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_Directive extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 1;
  }

}

module.exports = WSCommand_Directive;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Display.js":
/*!***************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_Display.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

let isNode = typeof window === 'undefined';

class WSCommand_Display extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 8;

    this._CommandClear = 0;
    this._CommandPrint = 1;
    this._CommandDrawCampusVerticalBytes = 2;
    this._CommandDrawCampusHorizonalBytes = 3;
    this._CommandDrawIOState = 4;
    this._CommandSetPinName = 5;
  }

  // Commands

  clear(params) {
    this.sendCommand(this._CommandClear, null);
  }

  print(buf) {
    this.sendCommand(this._CommandPrint, buf);
  }

  printText(text) {
    var result;
    if (isNode) {
      const buf = Buffer(text, 'utf8');
      result = new Uint8Array(buf);
    } else if (TextEncoder) {
      result = new Uint8Array(new TextEncoder("utf-8").encode(text));
    }
    this.print(result);
  }

  text(params) {
    this.printText(params.text);
  }
  raw(params) {
    this.drawHorizonally(new Uint8Array(params.raw));
  }

  pinName(params) {
    for (var i = 0; i < 12; i++) {
      if (typeof params.pin_assign[i] === "object") {
        this.setPinName(i, params.pin_assign[i].module_name || "?", params.pin_assign[i].pin_name || "?");
      }
    }
  }

  drawVertically(buf) {
    this.sendCommand(this._CommandDrawCampusVerticalBytes, buf);
  }

  drawHorizonally(buf) {
    this.sendCommand(this._CommandDrawCampusHorizonalBytes, buf);
  }

  drawIOState(val) {
    var buf = new Uint8Array([!val]);
    this.sendCommand(this._CommandDrawIOState, buf);
  }

  setPinName(no, moduleName, pinName) {
    var str = moduleName.slice(0, 4) + " " + pinName;
    str = str.slice(0, 9);

    var buf = new Uint8Array(1);
    buf[0] = no;

    var stringarray;
    if (isNode) {
      const buf = Buffer(str, 'utf8');
      stringarray = new Uint8Array(buf);
    } else if (TextEncoder) {
      stringarray = new Uint8Array(new TextEncoder("utf-8").encode(str));
    }
    var combined = new Uint8Array(buf.length + stringarray.length);
    combined.set(buf, 0);
    combined.set(stringarray, 1);

    this.sendCommand(this._CommandSetPinName, combined);
  }

  parseFromJson(json) {
    var module = json["display"];
    if (module === undefined) {
      return;
    }

    let schemaData = [{ uri: "/request/display/text", onValid: this.text }, { uri: "/request/display/clear", onValid: this.clear }, { uri: "/request/display/raw", onValid: this.raw }, { uri: "/request/display/pin_assign", onValid: this.pinName }, { uri: "/request/display/qr" // nothing to do 
    }];
    let res = this.validateCommandSchema(schemaData, module, "display");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[display]unknown command`);
      }
    }
  }
}

module.exports = WSCommand_Display;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_I2C.js":
/*!***********************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_I2C.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_I2C extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 6;

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandWrite = 2;
    this._CommandRead = 3;
    this._CommandSlvWritten = 4;
  }

  // Commands

  initMaster(params, module) {

    var mode = 0;
    var sda = parseInt(params.sda);
    var scl = parseInt(params.scl);
    var clock = parseInt(params.clock);

    var buf = new Uint8Array(8);
    buf[0] = module;
    buf[1] = mode;
    buf[2] = sda;
    buf[3] = scl;
    buf[4] = clock >> 3 * 8;
    buf[5] = clock >> 2 * 8;
    buf[6] = clock >> 1 * 8;
    buf[7] = clock;

    this.sendCommand(this._CommandInit, buf);
  }

  initSlave(params, module) {

    var mode = 1;
    var sda = parseInt(params.sda);
    var scl = parseInt(params.scl);
    var clock = 0;

    var addressLength = params.slave_address_length;
    var address = params.slave_address;
    if (address > 0x7F) {
      addressLength = 10;
    }

    var buf = new Uint8Array(11);
    buf[0] = module;
    buf[1] = mode;
    buf[2] = sda;
    buf[3] = scl;
    buf[4] = clock >> 3 * 8;
    buf[5] = clock >> 2 * 8;
    buf[6] = clock >> 1 * 8;
    buf[7] = clock;
    buf[8] = addressLength;
    buf[9] = address >> 8;
    buf[10] = address;

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  write(params, module) {
    let address = parseInt(params.address);

    if (params.address_bits === 10 || address > 0x7F) {
      address = address | 0x8000; // mark 10bit mode
    }
    var buf = new Uint8Array(3 + params.data.length);
    buf[0] = module;
    buf[1] = address >> 8;
    buf[2] = address;
    buf.set(params.data, 3);
    this.sendCommand(this._CommandWrite, buf);
  }

  read(params, module) {
    let address = parseInt(params.address);

    if (params.address_bits === 10 || address > 0x7F) {
      address = address | 0x8000; // mark 10bit mode
    }
    let read_length = params.read;
    var buf = new Uint8Array(7);
    buf[0] = module;
    buf[1] = address >> 8;
    buf[2] = address;
    buf[3] = read_length >> 3 * 8;
    buf[4] = read_length >> 2 * 8;
    buf[5] = read_length >> 1 * 8;
    buf[6] = read_length;
    this.sendCommand(this._CommandRead, buf);
  }

  parseFromJson(json) {
    // 0
    for (var i = 0; i < 1; i++) {
      var module = json["i2c" + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [{ uri: "/request/i2c/init_master", onValid: this.initMaster }, { uri: "/request/i2c/init_slave", onValid: this.initSlave }, { uri: "/request/i2c/write", onValid: this.write }, { uri: "/request/i2c/read", onValid: this.read }, { uri: "/request/i2c/deinit", onValid: this.deinit }];
      let res = this.validateCommandSchema(schemaData, module, "i2c" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[i2c${i}]unknown command`);
        }
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandRead && payload.byteLength > 3) {
      var module_index = payload[0];
      var address = (payload[1] << 8) + payload[2];

      var arr = new Array(payload.byteLength - 3);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 3];
      }

      objToSend["i2c" + module_index] = {
        mode: "master",
        address: address,
        data: arr
      };
    } else if (func === this._CommandSlvWritten && payload.byteLength > 4) {
      var module_index = payload[0];
      var address_bit_length = payload[1];
      var address = (payload[2] << 8) + payload[3];

      var arr = new Array(payload.byteLength - 4);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 4];
      }

      objToSend["i2c" + module_index] = {
        mode: "slave",
        is_fragmented: true,
        address: address,
        data: arr
      };
    } else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength > 2) {
      const esperr = payload[0];
      const err = payload[1];
      const ref_func_id = payload[2];

      if (ref_func_id === this._CommandWrite || ref_func_id === this._CommandRead) {
        let reason = '' + (ref_func_id === this._CommandWrite ? 'writing' : 'reading') + ' error. ';
        if (err === 7) {
          // in fact. it is 0x107. but truncated
          reason += 'Communication Timeout. Maybe, target is not connected.';
        } else if (err === 255) {
          reason += 'Communication Failed. Maybe, target is not connected.';
        }
        this.envelopError(objToSend, `i2c0`, { message: reason });
      } else {
        super.notifyFromBinary(objToSend, func, payload);
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_I2C;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_IO.js":
/*!**********************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_IO.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH = 1;
const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW = 2;
const COMMAND_IO_ERRORS_IO_TOO_LOW = 3;
const COMMAND_IO_ERRORS_IO_TOO_HIGH = 4;
const COMMAND_IO_ERRORS_IO_FORCE_RELEASED = 0xF0;

const COMMAND_IO_ERROR_MESSAGES = {
  0: 'unknown error',
  1: 'heavy output. output voltage is too low when driving high',
  2: 'heavy output. output voltage is too high when driving low',
  3: 'output voltage is too low when driving high. io state has changed output to input',
  4: 'output voltage is too high when driving low. io state has changed output to input'
};

const COMMAND_IO_MUTEX_NAMES = {
  1: 'io.input',
  2: 'io.output',
  3: 'pwm',
  4: 'uart',
  5: 'i2c',
  6: 'spi',
  7: 'LogicAnalyzer',
  8: 'Measure'
};

class WSCommand_IO extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 2;

    this._CommandOutput = 0;
    this._CommandInputStream = 1;
    this._CommandInputOnece = 2;
    this._CommandOutputType = 3;
    this._CommandPullResisterType = 4;
    this._CommandEnd = 5;
  }

  // Commands


  output(value, id) {
    var buf = new Uint8Array([id, value]);
    this.sendCommand(this._CommandOutput, buf);
  }

  outputDetail(params, id) {
    var buf = new Uint8Array([id, params.value]);
    this.sendCommand(this._CommandOutput, buf);
  }

  input(params, id) {
    var buf = new Uint8Array([id]);
    this.sendCommand(this._CommandInputOnece, buf);
  }

  inputDetail(params, id) {
    var buf = new Uint8Array([id]);
    this.sendCommand(params.stream ? this._CommandInputStream : this._CommandInputOnece, buf);
  }

  outputType(params, id) {
    var buf = new Uint8Array(2);
    buf[0] = id;
    if (params.output_type === "push-pull5v") {
      buf[1] = 0;
    } else if (params.output_type === "push-pull3v") {
      buf[1] = 2;
    } else if (params.output_type === "open-drain") {
      buf[1] = 3;
    } else {
      return "io unknown outputtype: " + params.output_type;
    }
    this.sendCommand(this._CommandOutputType, buf);
  }

  pullType(params, id) {
    var buf = new Uint8Array(2);
    buf[0] = id;
    if (params.pull_type === "float") {
      buf[1] = 0;
    } else if (params.pull_type === "pull-up3v") {
      buf[1] = 1;
    } else if (params.pull_type === "pull-down") {
      buf[1] = 2;
    } else if (params.pull_type === "pull-up5v") {
      buf[1] = 3;
    } else {
      return "io unknown pull_type: " + params.pull_type;
    }
    this.sendCommand(this._CommandPullResisterType, buf);
  }

  deinit(params, id) {
    var buf = new Uint8Array([id]);
    this.sendCommand(this._CommandEnd, buf);
  }

  parseFromJson(json) {
    for (var i = 0; i <= 11; i++) {
      var module = json["io" + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [{ uri: "/request/io/input", onValid: this.input }, { uri: "/request/io/input_detail", onValid: this.inputDetail }, { uri: "/request/io/output", onValid: this.output }, { uri: "/request/io/output_detail", onValid: this.outputDetail }, { uri: "/request/io/output_type", onValid: this.outputType }, { uri: "/request/io/pull_type", onValid: this.pullType }, { uri: "/request/io/deinit", onValid: this.deinit }];
      let res = this.validateCommandSchema(schemaData, module, "io" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[io${i}]unknown command`);
        }
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {

    if (func === this._CommandInputStream || func === this._CommandInputOnece) {
      for (var i = 0; i < payload.byteLength; i += 2) {
        objToSend["io" + payload[i]] = payload[i + 1] > 0;
      }
    } else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength >= 4) {
      const esperr = payload[0];
      const err = payload[1];
      const ref_func_id = payload[2];
      const module_index = payload[3];

      if (err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH || err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW) {
        this.envelopWarning(objToSend, `io${module_index}`, { message: COMMAND_IO_ERROR_MESSAGES[err] });
      } else if (err === COMMAND_IO_ERRORS_IO_TOO_LOW || err === COMMAND_IO_ERRORS_IO_TOO_HIGH) {
        this.envelopError(objToSend, `io${module_index}`, { message: COMMAND_IO_ERROR_MESSAGES[err] });
      } else if (err === COMMAND_IO_ERRORS_IO_FORCE_RELEASED && payload.byteLength >= 6) {
        const oldMutexOwner = payload[4];
        const newMutexOwner = payload[5];
        this.envelopWarning(objToSend, 'debug', { message: `io${module_index} binded "${COMMAND_IO_MUTEX_NAMES[oldMutexOwner]}" was stopped. "${COMMAND_IO_MUTEX_NAMES[newMutexOwner]}" have started using this io.` });
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
};

module.exports = WSCommand_IO;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_LogicAnalyzer.js":
/*!*********************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_LogicAnalyzer.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_LogicAnalyzer extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 10;

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandRecv = 2;
  }

  // Commands

  init(params) {
    let io = params.io[0];
    let intervalUsec = params.interval * 1000;
    let durationUsec = params.duration * 1000;

    let matchValue = parseInt(params.triger.value);
    let matchCount = params.triger.samples;
    var buf = new Uint8Array(12);
    buf[0] = 1;
    buf[1] = io;
    buf[2] = intervalUsec >> 8 * 3;
    buf[3] = intervalUsec >> 8 * 2;
    buf[4] = intervalUsec >> 8 * 1;
    buf[5] = intervalUsec;
    buf[6] = durationUsec >> 8 * 3;
    buf[7] = durationUsec >> 8 * 2;
    buf[8] = durationUsec >> 8 * 1;
    buf[9] = durationUsec;
    buf[10] = matchValue;
    buf[11] = matchCount;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params) {
    var buf = new Uint8Array(0);
    this.sendCommand(this._CommandDeinit, buf);
  }

  parseFromJson(json) {
    var module = json["logic_analyzer"];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: "/request/logicAnalyzer/init", onValid: this.init }, { uri: "/request/logicAnalyzer/deinit", onValid: this.deinit }];
    let res = this.validateCommandSchema(schemaData, module, "logic_analyzer");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[logic_analyzer]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandRecv) {
      let arr = new Array(payload.byteLength * 8);
      let offset = 0;
      for (let i = 0; i < payload.byteLength; i++) {
        const byte = payload[i];
        for (let bit = 0; bit < 8; bit++) {
          arr[offset] = byte & 0x80 >>> bit ? 1 : 0;
          offset++;
        }
      }
      objToSend["logic_analyzer"] = {
        data: arr
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_LogicAnalyzer;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Measurement.js":
/*!*******************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_Measurement.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_Measurement extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 12;

    this._CommandMeasurementEcho = 0;
  }

  // Commands

  echo(params) {
    let type = 0;
    let trigerIO = params.echo.io_pulse;
    let trigerPosNeg = params.echo.pulse === "negative" ? false : true;
    let trigerWidthUs = parseInt(params.echo.pulse_width * 1000);
    let echoIO = params.echo.io_echo;
    let responseCount = params.echo.measure_edges;
    let timeoutUs = params.echo.timeout * 1000;
    timeoutUs = parseInt(timeoutUs);

    var buf = new Uint8Array(13);
    buf[0] = 0;
    buf[1] = trigerIO;
    buf[2] = trigerPosNeg ? 1 : 0;
    buf[3] = trigerWidthUs >> 8 * 3;
    buf[4] = trigerWidthUs >> 8 * 2;
    buf[5] = trigerWidthUs >> 8;
    buf[6] = trigerWidthUs;
    buf[7] = echoIO;
    buf[8] = responseCount;
    buf[9] = timeoutUs >> 8 * 3;
    buf[10] = timeoutUs >> 8 * 2;
    buf[11] = timeoutUs >> 8;
    buf[12] = timeoutUs;
    this.sendCommand(this._CommandMeasurementEcho, buf);
  }

  parseFromJson(json) {
    var module = json["measure"];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: "/request/measure/echo", onValid: this.echo }];
    let res = this.validateCommandSchema(schemaData, module, "measure");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[measure]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandMeasurementEcho) {
      var index = 0;
      var count = parseInt(payload[index++]);
      var array = [];
      for (var i = 0; i < count; i++) {
        var timing;
        var edge = payload[index++] > 0 ? true : false;
        timing = payload[index++] << 8 * 3;
        timing += payload[index++] << 8 * 2;
        timing += payload[index++] << 8;
        timing += payload[index++];
        timing = timing / 1000;
        array.push({
          edge,
          timing
        });
      }
      objToSend["measure"] = {
        echo: array
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_Measurement;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_PWM.js":
/*!***********************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_PWM.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_PWM extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 3;
    this.ModuleNum = 6;
    this.resetInternalStatus();

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandSetFreq = 2;
    this._CommandSetDuty = 3;
    this._CommandAMModulate = 4;
  }

  resetInternalStatus() {
    this.pwms = [];
    for (var i = 0; i < this.ModuleNum; i++) {
      this.pwms.push({});
    }
  }

  // Commands

  init(params, module) {
    var buf = new Uint8Array(2);
    buf[0] = module;
    buf[1] = params.io;
    this.pwms[module].io = params.io;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    var buf = new Uint8Array(1);
    buf[0] = module;
    this.pwms[module] = {};
    this.sendCommand(this._CommandDeinit, buf);
  }

  freq(params, module) {
    var buf = new Uint8Array(5);
    buf[0] = module;
    buf[1] = params.freq >> 8 * 3;
    buf[2] = params.freq >> 8 * 2;
    buf[3] = params.freq >> 8 * 1;
    buf[4] = params.freq;
    this.pwms[module].freq = params.freq;
    this.sendCommand(this._CommandSetFreq, buf);
  }

  pulse(params, module) {
    let buf = new Uint8Array(5);
    let pulseUSec = params.pulse * 1000;
    buf[0] = module;
    buf[1] = pulseUSec >> 8 * 3;
    buf[2] = pulseUSec >> 8 * 2;
    buf[3] = pulseUSec >> 8 * 1;
    buf[4] = pulseUSec;
    this.pwms[module].pulseUSec = pulseUSec;
    this.sendCommand(this._CommandSetDuty, buf);
  }

  duty(params, module) {
    let buf = new Uint8Array(5);
    let pulseUSec = 1.0 / this.pwms[module].freq * params.duty * 0.01 * 1000000;
    pulseUSec = parseInt(pulseUSec);
    buf[0] = module;
    buf[1] = pulseUSec >> 8 * 3;
    buf[2] = pulseUSec >> 8 * 2;
    buf[3] = pulseUSec >> 8 * 1;
    buf[4] = pulseUSec;
    this.pwms[module].pulseUSec = pulseUSec;
    this.sendCommand(this._CommandSetDuty, buf);
  }

  amModulate(params, module) {
    const bitLength = params.modulate.data.length;
    const byteLength = parseInt((bitLength + 7) / 8);
    let buf = new Uint8Array(5 + byteLength);
    let symbol_length_usec = params.modulate.symbol_length * 1000;
    buf[0] = module;
    buf[1] = symbol_length_usec >> 8 * 3;
    buf[2] = symbol_length_usec >> 8 * 2;
    buf[3] = symbol_length_usec >> 8 * 1;
    buf[4] = symbol_length_usec;
    let bitIndex = 0;
    for (let byte = 0; byte < byteLength; byte++) {
      buf[5 + byte] = 0;
      for (let bit = 0; bit < 8; bit++) {
        if (params.modulate.data[bitIndex++]) {
          buf[5 + byte] |= 0x80 >>> bit;
        }
      }
    }
    this.sendCommand(this._CommandAMModulate, buf);
  }

  parseFromJson(json) {
    for (var i = 0; i < this.ModuleNum; i++) {
      var module = json["pwm" + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [{ uri: "/request/pwm/init", onValid: this.init }, { uri: "/request/pwm/freq", onValid: this.freq }, { uri: "/request/pwm/pulse", onValid: this.pulse }, { uri: "/request/pwm/duty", onValid: this.duty }, { uri: "/request/pwm/modulate", onValid: this.amModulate }, { uri: "/request/pwm/deinit", onValid: this.deinit }];
      let res = this.validateCommandSchema(schemaData, module, "pwm" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[pwm${i}]unknown command`);
        }
      }
    }
  }
}

module.exports = WSCommand_PWM;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_SPI.js":
/*!***********************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_SPI.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_SPI extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 5;

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandWriteRead = 2;
    this._CommandWrite = 3;
  }

  // Commands

  initMaster(params, module) {

    var mode = 0; //master mode

    let clk = params.clk;
    let mosi = params.mosi;
    let miso = params.miso;
    let cs = params.cs;

    var clock = params.clock;

    if (clk === null && mosi === null && miso === null) {
      throw new Error("spi: master mode require one of clk/mosi/miso");
      return;
    }

    if (clk === null) clk = this.ioNotUsed;
    if (mosi === null) mosi = this.ioNotUsed;
    if (miso === null) miso = this.ioNotUsed;
    if (cs === null) cs = this.ioNotUsed;

    var buf = new Uint8Array(11);
    buf[0] = module;
    buf[1] = mode;
    buf[2] = clk;
    buf[3] = mosi;
    buf[4] = miso;
    buf[5] = this.ioNotUsed; //wp
    buf[6] = this.ioNotUsed; // hd
    buf[7] = clock >> 3 * 8;
    buf[8] = clock >> 2 * 8;
    buf[9] = clock >> 1 * 8;
    buf[10] = clock;
    buf[11] = cs;

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    var buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  write(params, module) {
    var buf = new Uint8Array(1 + params.data.length);
    buf[0] = module;
    buf.set(params.data, 1);
    if (params.read) {
      this.sendCommand(this._CommandWriteRead, buf);
    } else {
      this.sendCommand(this._CommandWrite, buf);
    }
  }

  parseFromJson(json) {
    for (var i = 0; i < 2; i++) {
      var module = json["spi" + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [{ uri: "/request/spi/init_master", onValid: this.initMaster }, { uri: "/request/spi/write", onValid: this.write }, { uri: "/request/spi/deinit", onValid: this.deinit }];
      let res = this.validateCommandSchema(schemaData, module, "spi" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[spi${i}]unknown command`);
        }
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandWriteRead && payload.byteLength > 1) {
      var module_index = payload[0];
      var received = payload.slice(1);

      var arr = new Array(payload.byteLength - 1);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 1];
      }
      objToSend["spi" + module_index] = {
        data: arr
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_SPI;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Switch.js":
/*!**************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_Switch.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_Switch extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 9;

    this._CommandNotifyValue = 0;
    this._CommandOnece = 1;
  }

  // Commands

  get(params) {
    var buf = new Uint8Array(0);
    this.sendCommand(this._CommandOnece, buf);
  }

  parseFromJson(json) {
    var module = json["switch"];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: "/request/switch/get", onValid: this.get }];
    let res = this.validateCommandSchema(schemaData, module, "switch");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[switch]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if ((func === this._CommandOnece || func === this._CommandNotifyValue) && payload.byteLength == 1) {
      var state = parseInt(payload[0]);
      var states = ["none", "push", "left", "right"];
      objToSend["switch"] = {
        state: states[state]
      };
      if (func === this._CommandOnece) {
        objToSend["switch"].action = "get";
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_Switch;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_System.js":
/*!**************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_System.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_System extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 0;

    this._CommandReboot = 0;

    this._CommandReset = 2;
    this._CommandSelfCheck = 3;
    this._CommandWait = 4;
    this._CommandResetOnDisconnect = 5;

    this._CommandVCC = 9;
  }

  // Commands

  reboot(params) {
    this.sendCommand(this._CommandReboot, null);
  }

  reset(params) {
    this.sendCommand(this._CommandReset, null);
  }

  selfCheck(params) {
    this.sendCommand(this._CommandSelfCheck, null);
  }

  wait(params) {
    let msec = params.wait;
    var buf = new Uint8Array([msec >> 8, msec]);
    this.sendCommand(this._CommandWait, buf);
  }
  keepWorkingAtOffline(params) {
    this.resetOnDisconnect(!params.keep_working_at_offline);
  }
  resetOnDisconnect(mustReset) {
    var buf = new Uint8Array([mustReset ? 1 : 0]);
    this.sendCommand(this._CommandResetOnDisconnect, buf);
  }

  parseFromJson(json) {
    var module = json["system"];
    if (module === undefined) {
      return;
    }

    let schemaData = [{ uri: "/request/system/reboot", onValid: this.reboot }, { uri: "/request/system/reset", onValid: this.reset }, { uri: "/request/system/wait", onValid: this.wait }, { uri: "/request/system/selfCheck", onValid: this.selfCheck }, { uri: "/request/system/keepWorkingAtOffline", onValid: this.keepWorkingAtOffline }, { uri: "/request/system/ping" }];
    let res = this.validateCommandSchema(schemaData, module, "system");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[system]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    switch (func) {
      case this._CommandVCC:
        if (payload.byteLength === 3) {
          let value = (payload[1] << 8) + payload[2];
          value = value / 100.0;
          this.envelopWarning(objToSend, 'debug', { message: `Low Voltage ${value}v. connect obniz to more powerful USB.` });
        }
        break;

      default:
        super.notifyFromBinary(objToSend, func, payload);
        break;
    }
  }
}

module.exports = WSCommand_System;

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_UART.js":
/*!************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_UART.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_UART extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 4;

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandSend = 2;
    this._CommandRecv = 3;
  }

  // Commands

  init(params, module) {
    var buf = new Uint8Array(13);
    buf[0] = module;
    buf[1] = parseInt(params.tx);
    buf[2] = parseInt(params.rx);

    buf[3] = params.baud >> 3 * 8;
    buf[4] = params.baud >> 2 * 8;
    buf[5] = params.baud >> 1 * 8;
    buf[6] = params.baud;

    if (params.stop === 1) {
      buf[7] = 1;
    } else if (params.stop === 1.5) {
      buf[7] = 2;
    } else if (params.stop === 2) {
      buf[7] = 3;
    } else if (params.stop === 0) {
      buf[7] = 0;
    } else {
      //ここには来ない
      throw new Error("uart: invalid stop bits");
    }

    buf[8] = params.bits;

    if (params.parity === "even") {
      buf[9] = 2;
    } else if (params.parity === "odd") {
      buf[9] = 3;
    }

    if (params.flowcontrol === "rts") {
      buf[10] = 2;
    } else if (params.flowcontrol === "cts") {
      buf[10] = 3;
    } else if (params.flowcontrol === "rts-cts") {
      buf[10] = 4;
    }

    if (params.rts !== null) buf[11] = params.rts;
    if (params.cts !== null) buf[12] = params.cts;

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    var buf = new Uint8Array(1);
    buf[0] = module;
    this.sendCommand(this._CommandDeinit, buf);
  }

  send(params, module) {
    var buf = new Uint8Array(1 + params.data.length);
    buf[0] = module;
    buf.set(params.data, 1);
    this.sendCommand(this._CommandSend, buf);
  }

  parseFromJson(json) {
    // 0~2
    for (var i = 0; i < 3; i++) {
      var module = json["uart" + i];
      if (module === undefined) {
        continue;
      }
      let schemaData = [{ uri: "/request/uart/init", onValid: this.init }, { uri: "/request/uart/send", onValid: this.send }, { uri: "/request/uart/deinit", onValid: this.deinit }];
      let res = this.validateCommandSchema(schemaData, module, "uart" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[uart${i}]unknown command`);
        }
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandRecv && payload.byteLength > 1) {
      var module_index = payload[0];
      var arr = new Array(payload.byteLength - 1);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 1];
      }

      objToSend["uart" + module_index] = {
        data: arr
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
};

module.exports = WSCommand_UART;

/***/ }),

/***/ "./obniz/libs/wscommand/WSSchema.js":
/*!******************************************!*\
  !*** ./obniz/libs/wscommand/WSSchema.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

const tv4 = __webpack_require__(/*! tv4 */ "tv4");

tv4.defineError("UNIQUE_KEYS", 10001, "{uniqueKeys} are must be unique value.");

tv4.defineKeyword("uniqueKeys", function (data, value, schema) {
  if (!Array.isArray(value)) {
    return null;
  }
  let targets = [];
  for (let key of value) {
    if (data[key] !== null && data[key] !== undefined) {
      targets.push(data[key]);
    }
  }
  let duplicated = targets.filter(function (x, i, self) {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });
  if (duplicated.length > 0) {
    return { code: tv4.errorCodes.UNIQUE_KEYS, message: { uniqueKeys: value.join(",") } };
  }
  return null;
});

//todo

let wsSchema = [];
__webpack_require__("./obniz/libs/wscommand sync recursive").context = __webpack_require__(/*! ../webpackReplace/require-context */ "./obniz/libs/webpackReplace/require-context.js");
if (__webpack_require__("./obniz/libs/wscommand sync recursive").context && __webpack_require__("./obniz/libs/wscommand sync recursive").context.setBaseDir) {
  __webpack_require__("./obniz/libs/wscommand sync recursive").context.setBaseDir(__dirname);
}
let context = __webpack_require__("./json_schema sync recursive \\.yml$");
for (let path of context.keys()) {
  let oneSchema = context(path);
  wsSchema.push(oneSchema);
}

wsSchema.map(tv4.addSchema);

module.exports = tv4;
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./obniz/libs/wscommand/index.js":
/*!***************************************!*\
  !*** ./obniz/libs/wscommand/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_ */ "./obniz/libs/wscommand/WSCommand_.js");

WSCommand.addCommandClass("WSCommand_System", __webpack_require__(/*! ./WSCommand_System */ "./obniz/libs/wscommand/WSCommand_System.js"));
WSCommand.addCommandClass("WSCommand_Directive", __webpack_require__(/*! ./WSCommand_Directive */ "./obniz/libs/wscommand/WSCommand_Directive.js"));
WSCommand.addCommandClass("WSCommand_IO", __webpack_require__(/*! ./WSCommand_IO */ "./obniz/libs/wscommand/WSCommand_IO.js"));
WSCommand.addCommandClass("WSCommand_PWM", __webpack_require__(/*! ./WSCommand_PWM */ "./obniz/libs/wscommand/WSCommand_PWM.js"));
WSCommand.addCommandClass("WSCommand_UART", __webpack_require__(/*! ./WSCommand_UART */ "./obniz/libs/wscommand/WSCommand_UART.js"));
WSCommand.addCommandClass("WSCommand_AD", __webpack_require__(/*! ./WSCommand_AD */ "./obniz/libs/wscommand/WSCommand_AD.js"));
WSCommand.addCommandClass("WSCommand_SPI", __webpack_require__(/*! ./WSCommand_SPI */ "./obniz/libs/wscommand/WSCommand_SPI.js"));
WSCommand.addCommandClass("WSCommand_I2C", __webpack_require__(/*! ./WSCommand_I2C */ "./obniz/libs/wscommand/WSCommand_I2C.js"));
WSCommand.addCommandClass("WSCommand_LogicAnalyzer", __webpack_require__(/*! ./WSCommand_LogicAnalyzer */ "./obniz/libs/wscommand/WSCommand_LogicAnalyzer.js"));
WSCommand.addCommandClass("WSCommand_Display", __webpack_require__(/*! ./WSCommand_Display */ "./obniz/libs/wscommand/WSCommand_Display.js"));
WSCommand.addCommandClass("WSCommand_Switch", __webpack_require__(/*! ./WSCommand_Switch */ "./obniz/libs/wscommand/WSCommand_Switch.js"));
WSCommand.addCommandClass("WSCommand_Ble", __webpack_require__(/*! ./WSCommand_Ble */ "./obniz/libs/wscommand/WSCommand_Ble.js"));
WSCommand.addCommandClass("WSCommand_Measurement", __webpack_require__(/*! ./WSCommand_Measurement */ "./obniz/libs/wscommand/WSCommand_Measurement.js"));

module.exports = WSCommand;

/***/ }),

/***/ "./obniz/libs/wscommand/jsonBinaryConverter.js":
/*!*****************************************************!*\
  !*** ./obniz/libs/wscommand/jsonBinaryConverter.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class JsonBinaryConverter {

  static convertFromBinaryToJson(schema, binary) {
    var types = {
      hex: this.hexFromBinary.bind(this),
      uuid: this.uuidFromBinary.bind(this),
      number: this.numberFromBinary.bind(this),
      "signed number": this.signedNumberFromBinary.bind(this),
      int: this.numberFromBinary.bind(this),
      char: this.numberFromBinary.bind(this),
      enum: this.enumFromBinary.bind(this),
      dataArray: this.dataArrayFromBinary.bind(this)
    };
    var json = {};
    var count = 0;
    for (var i = 0; i < schema.length; i++) {
      var data = binary.slice(count, schema[i].length ? count + schema[i].length : undefined);
      json[schema[i].name] = types[schema[i].type](data, schema[i]);

      if (schema[i].length) {
        count += schema[i].length;
      } else {
        break;
      }
    }
    return json;
  }

  static hexFromBinary(data, schema) {
    var str = "";
    for (var i = 0; i < data.length; i++) {
      if (schema.endianness && schema.endianness === "little") {
        str = ("00" + data[i].toString(16)).slice(-2) + str;
      } else {
        str = str + ("00" + data[i].toString(16)).slice(-2);
      }
    }
    return str;
  }

  static uuidFromBinary(data) {
    var len = data[0] * 16 + data[1];
    if (len === 0) {
      return null;
    }
    var uuidData = data.slice(2);
    var str = "";
    for (var i = 0; i < len; i++) {
      str = ("00" + uuidData[i].toString(16)).slice(-2) + str;
    }
    return str;
  }

  static signedNumberFromBinary(data, schema) {
    //big adian
    var val = data[0] & 0x7F;
    for (var i = 1; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    if ((data[0] & 0x80) !== 0) {
      val = val - Math.pow(2, data.length * 8 - 1);
    }
    return val;
  }

  static numberFromBinary(data) {
    //big adian
    var val = 0;
    for (var i = 0; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    return val;
  }

  static keyForVal(enumvals, val) {
    return Object.keys(enumvals).filter(function (k) {
      return enumvals[k] === val;
    })[0];
    return undefined;
  }

  static enumFromBinary(data, schema) {
    var enumVals = schema.enum;
    var val = this.numberFromBinary(data);
    var tmp = this.keyForVal(enumVals, val);
    if (tmp) {
      val = tmp;
    }

    return val;
  }

  static dataArrayFromBinary(data) {
    var arr = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      arr[i] = data[i];
    }
    return arr;
  }

  static createSendBuffer(schema, data) {
    var array = [];
    for (var i = 0; i < schema.length; i++) {
      var schemaRow = schema[i];

      var row = undefined;
      if (Array.isArray(schemaRow)) {
        for (var key in schemaRow) {
          var customSchemaRow = Object.assign({}, schemaRow[key], { required: true });
          row = this.analyzeSchema(data, customSchemaRow);
          if (row) {
            break;
          }
        }
      } else {
        row = this.analyzeSchema(data, schemaRow);
      }

      Array.prototype.push.apply(array, row);
    }
    return new Uint8Array(array);
  }

  static analyzeSchema(allData, schemaRow) {
    var types = {
      hex: this.hexToBinary.bind(this),
      uuid: this.uuidToBinary.bind(this),
      int: this.intToBinary.bind(this),
      char: this.charToBinary.bind(this),
      dataArray: this.dataArrayToBinary.bind(this),
      enum: this.enumToBinary.bind(this),
      string: this.stringToBinary.bind(this),
      text: this.stringToBinary.bind(this),
      flag: this.flagToBinary.bind(this)
    };

    var val = undefined;
    if (schemaRow.path) {
      val = this.getProperty(allData, schemaRow.path);
    }
    if (val === undefined && schemaRow.required) {
      return null;
    }
    if (val === undefined && schemaRow.default) {
      val = schemaRow.default;
    }

    var row = types[schemaRow.type](val, schemaRow);

    if (schemaRow.length && row.length !== schemaRow.length) {
      console.log("JSON->BINARY SCHEMA ERROR: (", val, ")", schemaRow);
    }

    return row;
  }

  static getProperty(object, path) {
    if (path === "" || path === undefined) {
      return object;
    }
    if (typeof path === 'string') path = path.split('.');
    if (!Array.isArray(path)) path = [path];

    var index = 0,
        length = path.length;

    while (index < length) {
      object = object[path[index++]];
      if (object === undefined) {
        return undefined;
      }
    }
    return index && index === length ? object : undefined;
  }

  static hexToBinary(data, schema) {
    var array = [];
    var hex = data.toLowerCase().replace(/[^0-9abcdef]/g, '');
    for (var i = 0; i < hex.length / 2; i++) {
      array[i] = parseInt(hex[i * 2] + hex[i * 2 + 1], 16);
    }
    if (schema && schema.endianness && schema.endianness === "little") {
      array.reverse();
    }
    return array;
  }

  static intToBinary(data) {
    var array = [];
    array[0] = data >> 8 * 3 & 0xFF;
    array[1] = data >> 8 * 2 & 0xFF;
    array[2] = data >> 8 * 1 & 0xFF;
    array[3] = data >> 8 * 0 & 0xFF;
    return array;
  }

  static charToBinary(data) {
    var array = [];
    array[0] = data & 0xFF;
    return array;
  }

  static dataArrayToBinary(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return data;
  }
  static uuidToBinary(data) {

    var uuid = this.hexToBinary(data);
    uuid.reverse(); //big endianness -> little endianness;
    var length = uuid.length;

    var array = [];

    array[0] = length >> 8 * 1 & 0xFF;
    array[1] = length >> 8 * 0 & 0xFF;

    Array.prototype.push.apply(array, uuid);
    for (var i = array.length; i < 16 + 2; i++) {
      array[i] = 0;
    }

    return array;
  }

  static enumToBinary(data, schema) {
    var array = [];
    array.push(schema.enum[data]);
    return array;
  }

  static flagToBinary(data, schema) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    var flags = schema.flags;
    var value = 0;
    for (var key in flags) {
      if (data.includes(flags[key])) {
        value += parseInt(key);
      }
    }
    return [value];
  }

  static stringToBinary(data) {
    var array = [];
    if (isNode) {
      return new Uint8Array(Buffer(data, 'utf8'));
    } else if (TextEncoder) {
      return new Uint8Array(new TextEncoder("utf-8").encode(data));
    }
  }
}

module.exports = JsonBinaryConverter;

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, scripts, keywords, repository, author, homepage, license, devDependencies, dependencies, bugs, private, browser, default */
/***/ (function(module) {

module.exports = {"name":"obniz","version":"0.1.56","description":"Obniz Basic Library","main":"index.js","scripts":{"test":"./node_modules/.bin/nyc --reporter=text --reporter=html ./node_modules/.bin/mocha $NODE_DEBUG_OPTION -b ./test/index.js","realtest":"./node_modules/.bin/mocha $NODE_DEBUG_OPTION -b ./realtest/index.js","local":"./node_modules/.bin/gulp $NODE_DEBUG_OPTION --gulpfile ./_tools/server.js --cwd .","build":"./node_modules/.bin/gulp $NODE_DEBUG_OPTION --gulpfile ./_tools/server.js --cwd . build","version":"npm run build && git add obniz.js && git add obniz.node6_10.js"},"keywords":["obniz"],"repository":"obniz/obniz","author":"yukisato <yuki@yuki-sato.com>","homepage":"https://obniz.io/","license":"SEE LICENSE IN LICENSE.txt","devDependencies":{"babel-cli":"^6.26.0","babel-core":"^6.26.0","babel-loader":"^7.1.4","babel-polyfill":"^6.26.0","babel-preset-env":"^1.6.1","babel-preset-es2015":"^6.24.1","babel-preset-stage-3":"^6.24.1","chai":"^4.1.2","chai-like":"^1.1.1","child_process":"^1.0.2","chokidar":"^1.7.0","concat-with-sourcemaps":"^1.0.5","ejs":"^2.5.8","express":"^4.16.2","get-port":"^3.2.0","glob":"^7.1.2","gulp":"^3.9.1","gulp-babel":"^7.0.1","gulp-concat":"^2.6.1","gulp-ejs":"^3.1.2","gulp-filter":"^5.1.0","gulp-notify":"^3.2.0","gulp-plumber":"^1.2.0","gulp-sort":"^2.0.0","gulp-util":"^3.0.8","gulp-yaml":"^1.0.1","json-loader":"^0.5.7","mocha":"^5.0.5","mocha-chrome":"^1.0.3","mocha-directory":"^2.3.0","mocha-sinon":"^2.0.0","ncp":"^2.0.0","node-notifier":"^5.2.1","nyc":"^11.6.0","path":"^0.12.7","semver":"^5.5.0","sinon":"^4.5.0","svg-to-png":"^3.1.2","through2":"^2.0.3","tv4":"^1.3.0","uglifyjs-webpack-plugin":"^1.2.4","vinyl":"^2.1.0","webpack":"^4.5.0","webpack-cli":"^2.0.14","webpack-node-externals":"^1.7.2","webpack-stream":"^4.0.3","yaml-loader":"^0.5.0"},"dependencies":{"js-yaml":"^3.11.0","node-dir":"^0.1.17","ws":"^5.1.1"},"bugs":{"url":"https://github.com/obniz/obniz/issues"},"private":false,"browser":{"ws":"./obniz/libs/webpackReplace/ws.js","canvas":"./obniz/libs/webpackReplace/canvas.js","./obniz/libs/webpackReplace/require-context.js":"./obniz/libs/webpackReplace/require-context-browser.js"}};

/***/ }),

/***/ "./parts sync recursive \\.js$":
/*!**************************!*\
  !*** ./parts sync \.js$ ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./ADConverter/hx711/index.js": "./parts/ADConverter/hx711/index.js",
	"./Accessory/USB/index.js": "./parts/Accessory/USB/index.js",
	"./AudioSensor/AE-MICAMP/index.js": "./parts/AudioSensor/AE-MICAMP/index.js",
	"./Bluetooth/RN42/index.js": "./parts/Bluetooth/RN42/index.js",
	"./Bluetooth/XBee/index.js": "./parts/Bluetooth/XBee/index.js",
	"./Camera/JpegSerialCam/index.js": "./parts/Camera/JpegSerialCam/index.js",
	"./Display/7SegmentLED/index.js": "./parts/Display/7SegmentLED/index.js",
	"./Display/7SegmentLEDArray/index.js": "./parts/Display/7SegmentLEDArray/index.js",
	"./Display/MatrixLED_MAX7219/index.js": "./parts/Display/MatrixLED_MAX7219/index.js",
	"./DistanceSensor/HC-SR04/index.js": "./parts/DistanceSensor/HC-SR04/index.js",
	"./GyroSensor/ENC-03R_Module/index.js": "./parts/GyroSensor/ENC-03R_Module/index.js",
	"./InfraredSensor/EKMC160XXXX/index.js": "./parts/InfraredSensor/EKMC160XXXX/index.js",
	"./InfraredSensor/IRSensor/index.js": "./parts/InfraredSensor/IRSensor/index.js",
	"./Light/FullColorLED/index.js": "./parts/Light/FullColorLED/index.js",
	"./Light/InfraredLED/index.js": "./parts/Light/InfraredLED/index.js",
	"./Light/LED/index.js": "./parts/Light/LED/index.js",
	"./Light/WS2811/index.js": "./parts/Light/WS2811/index.js",
	"./Memory/24LC256/index.js": "./parts/Memory/24LC256/index.js",
	"./MovementSensor/Button/index.js": "./parts/MovementSensor/Button/index.js",
	"./MovementSensor/JoyStick/index.js": "./parts/MovementSensor/JoyStick/index.js",
	"./MovementSensor/KXSC7-2050/index.js": "./parts/MovementSensor/KXSC7-2050/index.js",
	"./MovementSensor/Potentiometer/index.js": "./parts/MovementSensor/Potentiometer/index.js",
	"./Moving/DCMotor/index.js": "./parts/Moving/DCMotor/index.js",
	"./Moving/ServoMotor/index.js": "./parts/Moving/ServoMotor/index.js",
	"./PressureSensor/FSR-40X/index.js": "./parts/PressureSensor/FSR-40X/index.js",
	"./SoilSensor/SEN0114/index.js": "./parts/SoilSensor/SEN0114/index.js",
	"./Sound/Speaker/index.js": "./parts/Sound/Speaker/index.js",
	"./TemperatureSensor/analog/AnalogTempratureSensor.js": "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js",
	"./TemperatureSensor/analog/LM35DZ/index.js": "./parts/TemperatureSensor/analog/LM35DZ/index.js",
	"./TemperatureSensor/analog/LM60/index.js": "./parts/TemperatureSensor/analog/LM60/index.js",
	"./TemperatureSensor/analog/LM61/index.js": "./parts/TemperatureSensor/analog/LM61/index.js",
	"./TemperatureSensor/analog/MCP9700/index.js": "./parts/TemperatureSensor/analog/MCP9700/index.js",
	"./TemperatureSensor/analog/MCP9701/index.js": "./parts/TemperatureSensor/analog/MCP9701/index.js",
	"./TemperatureSensor/analog/S8100B/index.js": "./parts/TemperatureSensor/analog/S8100B/index.js",
	"./TemperatureSensor/analog/S8120C/index.js": "./parts/TemperatureSensor/analog/S8120C/index.js",
	"./TemperatureSensor/i2c/ADT7410/index.js": "./parts/TemperatureSensor/i2c/ADT7410/index.js",
	"./TemperatureSensor/i2c/S-5851A/index.js": "./parts/TemperatureSensor/i2c/S-5851A/index.js",
	"./TemperatureSensor/i2c/SHT31/index.js": "./parts/TemperatureSensor/i2c/SHT31/index.js",
	"./TemperatureSensor/spi/ADT7310/index.js": "./parts/TemperatureSensor/spi/ADT7310/index.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./parts sync recursive \\.js$";

/***/ }),

/***/ "./parts/ADConverter/hx711/index.js":
/*!******************************************!*\
  !*** ./parts/ADConverter/hx711/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class hx711 {
  constructor() {
    this.keys = ["vcc", "gnd", "sck", "dout"];
    this.requiredKeys = ["sck", "dout"];
    this.offset = 0;
    this.scale = 1;
  }

  wired(obniz) {
    this.obniz = obniz;
    this.spi = obniz.getFreeSpi();
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    let ioKeys = ["clk", "dout"];
    for (let key of ioKeys) {
      if (this.params[key] && !this.obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }
    this.sck = obniz.getIO(this.params.sck);
    this.dout = obniz.getIO(this.params.dout);

    this.sck.output(true);
  }

  readWait() {
    var _this = this;

    return _asyncToGenerator(function* () {

      _this.sck.output(false);

      // while(true) {
      //   let val = await this.dout.inputWait();
      //   if (val == false) break;
      // }
      _this.spi.start({ mode: "master", clk: _this.params.sck, miso: _this.params.dout, frequency: 66 * 1000 });

      let ret = yield _this.spi.writeWait([0, 0, 0]);
      _this.spi.end(true);
      _this.sck.output(false);
      let flag = (ret[0] & 0x80) === 0 ? 1 : -1;
      return flag * (((ret[0] & 0x7F) << 16) + (ret[1] << 8) + (ret[2] << 0));
    })();
  }

  readAverageWait(times) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let results = [];
      for (let i = 0; i < times; i++) {
        results.push((yield _this2.readWait()));
      }
      return results.reduce(function (prev, current, i) {
        return prev + current;
      }, 0) / results.length;
    })();
  }

  powerDown() {
    this.sck.output(true);
  }

  powerUp() {
    this.sck.output(false);
  }

  zeroAdjust(times) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      times = parseInt(times) || 1;
      _this3.offset = yield _this3.readAverageWait(times);
    })();
  }

  getValueWait(times) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      times = parseInt(times) || 1;
      let val = yield _this4.readAverageWait(times);
      return (val - _this4.offset) / _this4.scale;
    })();
  }

}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("hx711", hx711);

/***/ }),

/***/ "./parts/Accessory/USB/index.js":
/*!**************************************!*\
  !*** ./parts/Accessory/USB/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var USB = function () {
  this.keys = ["vcc", "gnd"];
  this.requiredKeys = ["vcc", "gnd"];
};

USB.prototype.wired = function (obniz) {
  this.obniz = obniz;
  this.io_vdd = obniz.getIO(this.params.vcc);
  this.io_gnd = obniz.getIO(this.params.gnd);

  this.io_gnd.output(false);
};

USB.prototype.on = function () {
  this.io_vdd.output(true);
};

USB.prototype.off = function () {
  this.io_vdd.output(false);
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("USB", USB);

/***/ }),

/***/ "./parts/AudioSensor/AE-MICAMP/index.js":
/*!**********************************************!*\
  !*** ./parts/AudioSensor/AE-MICAMP/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var AE_MICAMP = function () {
  this.keys = ["vcc", "gnd", "out"];
  this.requiredKeys = ["out"];
};

AE_MICAMP.prototype.wired = (() => {
  var _ref = _asyncToGenerator(function* (obniz) {
    this.obniz = obniz;

    this.ad = obniz.getAD(this.params.out);

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    var self = this;
    this.ad.start(function (value) {
      self.voltage = value;
      if (self.onchange) {
        self.onchange(self.voltage);
      }
    });

    /*
      var self = this;
      var analogin = [];
      var cnt = 0;
      while(true){
        var sum = 0;
        if (cnt == 10) {
          cnt = 0;
        }
        analogin[cnt] = this.ad.value;
        cnt++;
        for (var i = 0; i < 10; i++) {
          if (typeof(analogin[i])=="number") {sum += analogin[i];}
        }
        var average = sum / 10;
        //console.log('average='+average);
        await obniz.wait(1);
      }
      self.voltage_ave = average;
      if (self.average) {
        self.average(self.voltage_ave);
      }
      */
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

/*
//移動平均を返す
AE_MICAMP.prototype.Average = function(callback) {
  this.average = callback;
};
*/

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("AE_MICAMP", AE_MICAMP);

/***/ }),

/***/ "./parts/Bluetooth/RN42/index.js":
/*!***************************************!*\
  !*** ./parts/Bluetooth/RN42/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var RN42 = function () {
  this.keys = ["tx", "rx", "gnd"];
  this.requiredKeys = ["tx", "rx"];
};

RN42.prototype.wired = function (obniz) {
  if (obniz.isValidIO(this.params.gnd)) {
    obniz.getIO(this.params.gnd).output(false);
  }

  this.uart = obniz.getFreeUart();

  this.uart.start({ tx: this.params.tx, rx: this.params.rx, baud: 115200, drive: "3v" });
  var self = this;
  this.uart.onreceive = function (data, text) {
    // this is not perfect. separation is possible.
    if (text.indexOf("CONNECT") >= 0) {
      console.log("connected");
    } else if (text.indexOf("DISCONNECT") >= 0) {
      console.log("disconnected");
    }
    if (typeof self.onreceive === "function") {
      self.onreceive(data, text);
    }
  };
};

RN42.prototype.send = function (data) {
  this.uart.send(data);
};

RN42.prototype.sendCommand = function (data) {
  this.uart.send(data + '\n');
  this.obniz.wait(100);
};

RN42.prototype.enterCommandMode = function () {
  this.send('$$$');
  this.obniz.wait(100);
};

RN42.prototype.config = function (json) {
  this.enterCommandMode();
  if (typeof json !== "object") {
    // TODO: warning
    return;
  }
  // remove noize data
  this.sendCommand("");

  if (json.master_slave) {
    this.config_masterslave(json.master_slave);
  }
  if (json.auth) {
    this.config_auth(json.auth);
  }
  if (json.hid_flag) {
    this.config_HIDflag(json.hid_flag);
  }
  if (json.profile) {
    this.config_profile(json.profile);
  }
  if (json.power) {
    this.config_power(json.power);
  }
  if (json.display_name) {
    this.config_displayName(json.display_name);
  }
  this.config_reboot();
};

RN42.prototype.config_reboot = function () {
  this.sendCommand('R,1');
};

RN42.prototype.config_masterslave = function (mode) {
  var val = -1;
  if (typeof mode === "number") {
    val = mode;
  } else if (typeof mode === "string") {
    var modes = ["slave", "master", "trigger", "auto-connect-master", "auto-connect-dtr", "auto-connect-any", "pairing"];
    for (var i = 0; i < modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('SM,' + val);
};

RN42.prototype.config_displayName = function (name) {
  this.sendCommand('SN,' + name);
};

// // SH,0200 HID Flag register. Descriptor=keyboard
RN42.prototype.config_HIDflag = function (flag) {
  this.sendCommand('SH,' + flag);
};

RN42.prototype.config_profile = function (mode) {
  var val = -1;
  if (typeof mode === "number") {
    val = mode;
  } else if (typeof mode === "string") {
    var modes = ["SPP", "DUN-DCE", "DUN-DTE", "MDM-SPP", "SPP-DUN-DCE", "APL", "HID"];
    for (var i = 0; i < modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('S~,' + val);
};

RN42.prototype.config_revert_localecho = function () {
  this.sendCommand('+');
};

RN42.prototype.config_auth = function (mode) {
  var val = -1;
  if (typeof mode === "number") {
    val = mode;
  } else if (typeof mode === "string") {
    var modes = ["open", "ssp-keyboard", "just-work", "pincode"];
    for (var i = 0; i < modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('SA,' + val);
};

RN42.prototype.config_power = function (dbm) {

  var val = "0010";
  if (16 > dbm && dbm >= 12) {
    val = "000C";
  } else if (12 > dbm && dbm >= 8) {
    val = "0008";
  } else if (8 > dbm && dbm >= 4) {
    val = "0004";
  } else if (4 > dbm && dbm >= 0) {
    val = "0000";
  } else if (0 > dbm && dbm >= -4) {
    val = "FFFC";
  } else if (-4 > dbm && dbm >= -8) {
    val = "FFF8";
  } else if (-8 > dbm) {
    val = "FFF4";
  }

  this.sendCommand('SY,' + val);
};

RN42.prototype.config_get_setting = function () {
  this.sendCommand('D');
};

RN42.prototype.config_get_extendSetting = function () {
  this.sendCommand('E');
};

// Module functions

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("RN42", RN42);

/***/ }),

/***/ "./parts/Bluetooth/XBee/index.js":
/*!***************************************!*\
  !*** ./parts/Bluetooth/XBee/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class XBee {

  constructor() {
    this.keys = ["tx", "rx", "gnd"];
    this.requiredKeys = ["tx", "rx"];

    this.displayIoNames = { "tx": "<tx", "rx": ">rx" };
  }

  wired(obniz) {

    this.uart = obniz.getFreeUart();
    this.currentCommand = null;
    this.commands = [];
    this.isAtMode = false;
    this.onFinishAtModeCallback = null;

    if (typeof this.params.gnd === "number") {
      obniz.getIO(this.params.gnd).output(false);
    }

    this.uart.start({ tx: this.params.tx, rx: this.params.rx, baud: 9600, drive: "3v" });

    this.uart.onreceive = function (data, text) {
      if (this.isAtMode) {
        this.onAtResultsRecieve(data, text);
      } else {
        if (typeof this.onreceive === "function") {
          this.onreceive(data, text);
        }
      }
    }.bind(this);
  }

  send(text) {
    if (this.isAtMode === false) {
      this.uart.send(text);
    } else {
      this.obniz.error("XBee is AT Command mode now. Wait for finish config.");
    }
  }

  onAtResultsRecieve(data, text) {
    if (!this.isAtMode) {
      return;
    }

    var next = function () {
      this.currentCommand = null;
      this.sendCommand();
    }.bind(this);

    if (text === "OK\r") {
      if (this.currentCommand === "ATCN") {
        this.isAtMode = false;
        this.currentCommand = null;
        if (typeof this.onFinishAtModeCallback === "function") {
          this.onFinishAtModeCallback();
          this.onFinishAtModeCallback = null;
        }
        return;
      }
      next();
    } else if (text === "ERROR\r") {
      this.obniz.error("XBee config error : " + this.currentCommand);
    } else {
      //response of at command.
      console.log("XBEE : no catch message", data);
      next();
    }
  }

  addCommand(command, value) {
    var str = command + (value ? " " + value : "");
    this.commands.push(str);
    if (this.isAtMode === true && this.currentCommand === null) {
      this.sendCommand();
    }
  }

  sendCommand() {
    if (this.isAtMode === true && this.currentCommand === null && this.commands.length > 0) {
      this.currentCommand = "AT" + this.commands.shift();
      this.uart.send(this.currentCommand + "\r");
    }
  }

  enterAtMode() {
    if (this.currentCommand !== null) return;
    this.isAtMode = true;
    this.obniz.wait(1000);
    var command = "+++";
    this.currentCommand = command;
    this.uart.send(this.currentCommand);
    this.obniz.wait(1000);
  }

  exitAtMode() {
    this.addCommand("CN");
  }

  configWait(config) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.isAtMode) {
        throw new Error("Xbee : duplicate config setting");
      };
      return new Promise(function (resolve, reject) {
        var standaloneKeys = {
          "destination_address_high": "DH",
          "destination_address_low": "DL",
          "source_address": "MY"
        };
        var highLowKeys = ["destination_address"];
        this.enterAtMode();
        for (var key in config) {
          if (key.length === 2) {
            this.addCommand(key, config[key]);
          } else if (standaloneKeys[key]) {
            this.addCommand(standaloneKeys[key], config[key]);
          } else if (highLowKeys.includes(key)) {
            var high = config[key].slice(0, -8);
            if (!high) {
              high = "0";
            }
            var low = config[key].slice(-8);

            this.addCommand(standaloneKeys[key + "_high"], high);
            this.addCommand(standaloneKeys[key + "_low"], low);
          }
        }
        this.exitAtMode();
        this.onFinishAtModeCallback = function () {
          resolve();
        };
      }.bind(_this));
    })();
  }
}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("XBee", XBee);

/***/ }),

/***/ "./parts/Camera/JpegSerialCam/index.js":
/*!*********************************************!*\
  !*** ./parts/Camera/JpegSerialCam/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class JpegSerialCam {

  constructor() {
    this.keys = ["vcc", "cam_tx", "cam_rx", "gnd"];
    this.requiredKeys = ["cam_tx", "cam_rx"];

    this.ioKeys = this.keys;
    this.displayName = "Jcam";
    this.displayIoNames = { "cam_tx": "camTx", "cam_rx": "camRx" };
  }

  wired() {
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.my_tx = this.params.cam_rx;
    this.my_rx = this.params.cam_tx;

    this.obniz.getIO(this.my_tx).drive("3v");

    this.uart = this.obniz.getFreeUart();
  }

  _drainUntil(uart, search, recv) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!recv) recv = [];
      while (true) {
        var readed = uart.readBytes();
        recv = recv.concat(readed);
        var tail = _this._seekTail(search, recv);
        if (tail >= 0) {
          recv.splice(0, tail);
          return recv;
        }
        yield _this.obniz.wait(10);
      }
    })();
  }

  _seekTail(search, src) {
    var f = 0;
    for (var i = 0; i < src.length; i++) {
      if (src[i] === search[f]) {
        f++;
        if (f === search.length) {
          return i + 1;
        }
      } else {
        f = 0;
      }
    }
    return -1;
  }

  arrayToBase64(buf) {
    if (typeof btoa === "function") {
      var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
      }).join('');
      return btoa(binstr);
    }
    // TODO: 
  }

  startwait(obj) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!obj) obj = {};
      _this2.uart.start({ tx: _this2.my_tx, rx: _this2.my_rx, baud: obj.baud || 38400 });
      _this2.obniz.display.setPinName(_this2.my_tx, "JpegSerialCam", "camRx");
      _this2.obniz.display.setPinName(_this2.my_rx, "JpegSerialCam", "camTx");
      yield _this2.obniz.wait(2500);
    })();
  }

  resetwait() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      _this3.uart.send([0x56, 0x00, 0x26, 0x00]);
      yield _this3._drainUntil(_this3.uart, [0x76, 0x00, 0x26, 0x00]);
      yield _this3.obniz.wait(2500);
    })();
  }

  setResolusionWait(resolution) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let val;
      if (resolution === "640*480") {
        val = 0x00;
      } else if (resolution === "320*240") {
        val = 0x11;
      } else if (resolution === "160*120") {
        val = 0x22;
      } else {
        throw new Error("invalid resolution");
      }
      _this4.uart.send([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, val]);
      yield _this4._drainUntil(_this4.uart, [0x76, 0x00, 0x31, 0x00]);
      yield _this4.resetwait();
    })();
  }

  setCompressibilityWait(compress) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let val = Math.floor(compress / 100 * 0xFF);
      _this5.uart.send([0x56, 0x00, 0x31, 0x05, 0x01, 0x01, 0x12, 0x04, val]);
      yield _this5._drainUntil(_this5.uart, [0x76, 0x00, 0x31, 0x00]);
      yield _this5.resetwait();
    })();
  }

  setBaudWait(baud) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      let val;
      switch (baud) {
        case 9600:
          val = [0xAE, 0xC8];
          break;
        case 19200:
          val = [0x56, 0xE4];
          break;
        case 38400:
          val = [0x2A, 0xF2];
          break;
        case 57600:
          val = [0x1C, 0x4C];
          break;
        case 115200:
          val = [0x0D, 0xA6];
          break;
        default:
          throw new Error("invalid baud rate");
      }
      _this6.uart.send([0x56, 0x00, 0x31, 0x06, 0x04, 0x02, 0x00, 0x08, val[0], val[1]]);
      yield _this6._drainUntil(_this6.uart, [0x76, 0x00, 0x31, 0x00]);
      //await this.obniz.wait(1000);
      yield _this6.startwait({
        baud
      });
    })();
  }

  takewait() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const uart = _this7.uart;
      //console.log("stop a photo")
      uart.send([0x56, 0x00, 0x36, 0x01, 0x02]);
      yield _this7._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);

      //console.log("take a photo")
      uart.send([0x56, 0x00, 0x36, 0x01, 0x00]);
      yield _this7._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);

      //console.log("read length")
      uart.send([0x56, 0x00, 0x34, 0x01, 0x00]); // read length of image data
      var recv = yield _this7._drainUntil(uart, [0x76, 0x00, 0x34, 0x00, 0x04, 0x00, 0x00]); // ack
      var XX;
      var YY;
      while (true) {
        var readed = uart.readBytes();
        //console.log(recv);
        recv = recv.concat(readed);
        if (recv.length >= 2) {
          XX = recv[0];
          YY = recv[1];
          break;
        }
        yield _this7.obniz.wait(1000);
      }
      let databytes = XX * 256 + YY;
      //console.log("image: " + databytes + " Bytes");
      const high = databytes >> 8 & 0xFF;
      const low = databytes & 0xFF;

      //console.log("start reading image")
      uart.send([0x56, 0x00, 0x32, 0x0C, 0x00, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, XX, YY, 0x00, 0xFF]);
      var recv = yield _this7._drainUntil(uart, [0x76, 0x00, 0x32, 0x00, 0x00]);
      //console.log("reading...");
      while (true) {
        var readed = uart.readBytes();
        recv = recv.concat(readed);
        //console.log(readed.length);
        if (recv.length >= databytes) {
          break;
        }
        yield _this7.obniz.wait(10);
      }
      //console.log("done");
      recv = recv.splice(0, databytes); // remove tail
      recv = recv.concat([0xFF, 0xD9]);
      return recv;
    })();
  }

}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("JpegSerialCam", JpegSerialCam);

/***/ }),

/***/ "./parts/Display/7SegmentLED/index.js":
/*!********************************************!*\
  !*** ./parts/Display/7SegmentLED/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _7SegmentLED = function () {
  this.requiredKeys = ["a", "b", "c", "d", "e", "f", "g", "dp", "common", "commonType"];
  this.keys = ["a", "b", "c", "d", "e", "f", "g", "dp", "common", "commonType"];

  this.digits = [0x3F, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f, 0x6f];
};

_7SegmentLED.prototype.wired = function (obniz) {
  this.obniz = obniz;
  this.ios = [];
  this.ios.push(obniz.getIO(this.params.a));
  this.ios.push(obniz.getIO(this.params.b));
  this.ios.push(obniz.getIO(this.params.c));
  this.ios.push(obniz.getIO(this.params.d));
  this.ios.push(obniz.getIO(this.params.e));
  this.ios.push(obniz.getIO(this.params.f));
  this.ios.push(obniz.getIO(this.params.g));

  this.dp = obniz.getIO(this.params.dp);
  this.common = obniz.getIO(this.params.common);
  this.isCathodeCommon = this.params.commonType === "anode" ? false : true;
};

_7SegmentLED.prototype.print = function (data) {
  if (typeof data === "number") {
    data = parseInt(data);
    data = data % 10;

    for (let i = 0; i < 7; i++) {
      if (this.ios[i]) {
        var val = this.digits[data] & 1 << i ? true : false;
        if (!this.isCathodeCommon) {
          val = ~val;
        }
        this.ios[i].output(val);
      }
    }
    this.on();
  }
};

_7SegmentLED.prototype.printRaw = function (data) {
  if (typeof data === "number") {
    for (let i = 0; i < 7; i++) {
      if (this.ios[i]) {
        var val = data & 1 << i ? true : false;
        if (!this.isCathodeCommon) {
          val = !val;
        }
        this.ios[i].output(val);
      }
    }
    this.on();
  }
};

_7SegmentLED.prototype.dpShow = function (show) {
  if (this.dp) {
    this.dp.output(this.isCathodeCommon ? show : !show);
  }
};

_7SegmentLED.prototype.on = function () {
  this.common.output(this.isCathodeCommon ? false : true);
};

_7SegmentLED.prototype.off = function () {
  this.common.output(this.isCathodeCommon ? true : false);
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("7SegmentLED", _7SegmentLED);

/***/ }),

/***/ "./parts/Display/7SegmentLEDArray/index.js":
/*!*************************************************!*\
  !*** ./parts/Display/7SegmentLEDArray/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _7SegmentLEDArray = function () {
  this.identifier = "" + new Date().getTime();

  this.keys = ["seg0", "seg1", "seg2", "seg3"];
  this.requiredKeys = ["seg0"];
};

_7SegmentLEDArray.prototype.wired = function (obniz) {
  this.obniz = obniz;

  this.segments = [];
  if (this.params.seg0) {
    this.segments.unshift(this.params.seg0);
  }
  if (this.params.seg1) {
    this.segments.unshift(this.params.seg1);
  }
  if (this.params.seg2) {
    this.segments.unshift(this.params.seg2);
  }
  if (this.params.seg3) {
    this.segments.unshift(this.params.seg3);
  }
};

_7SegmentLEDArray.prototype.print = function (data) {
  if (typeof data === "number") {
    data = parseInt(data);

    var segments = this.segments;
    var print = function (index) {
      let val = data;

      for (let i = 0; i < segments.length; i++) {
        console.log(val);
        if (index === i) {
          segments[i].print(val % 10);
        } else {
          segments[i].off();
        }
        val = val / 10;
      }
    };

    var animations = [];
    for (let i = 0; i < segments.length; i++) {
      animations.push({
        duration: 3,
        state: print
      });
    }

    var segments = this.segments;
    this.obniz.io.animation(this.identifier, "loop", animations);
  };
};

_7SegmentLEDArray.prototype.on = function () {
  this.obniz.io.animation(this.identifier, "resume");
};

_7SegmentLEDArray.prototype.off = function () {
  this.obniz.io.animation(this.identifier, "pause");
  for (let i = 0; i < this.segments.length; i++) {
    this.segments[i].off();
  }
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("7SegmentLEDArray", _7SegmentLEDArray);

/***/ }),

/***/ "./parts/Display/MatrixLED_MAX7219/index.js":
/*!**************************************************!*\
  !*** ./parts/Display/MatrixLED_MAX7219/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class MatrixLED_MAX7219 {

  constructor() {
    this.keys = ["vcc", "gnd", "din", "cs", "clk"];
    this.requiredKeys = ["din", "cs", "clk"];
  }

  wired(obniz) {
    this.cs = obniz.getIO(this.params.cs);
    // logich high must 3.5v <=
    if (obniz.isValidIO(this.params.vcc)) {
      obniz.getIO(this.params.vcc).output(true);
    }
    if (obniz.isValidIO(this.params.gnd)) {
      obniz.getIO(this.params.gnd).output(false);
    }

    // max 10Mhz but motor driver can't
    this.params.frequency = this.params.frequency || 10 * 1000 * 1000;
    this.params.mode = "master";
    this.params.mosi = this.params.din;
    this.params.drive = "3v";
    this.spi = this.obniz.getSpiWithConfig(this.params);

    // reset a onece
    this.cs.output(true);
    this.cs.output(false);
    this.cs.output(true);
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.preparevram(width, height);
    this.initModule();
  }

  initModule() {
    this.write([0x09, 0x00]); // Code B decode for digits 3–0 No decode for digits 7–4
    this.write([0x0a, 0x05]); // brightness 9/32 0 to f
    this.write([0x0b, 0x07]); // Display digits 0 1 2 3 4 567
    this.write([0x0c, 0x01]); // Shutdown to normal operation
    this.write([0x0f, 0x00]);
    this.passingCommands();
    obniz.wait(10);
  }

  test() {
    this.write([0x0f, 0x00]); // test command
    this.passingCommands();
  }

  passingCommands() {
    for (let i = 8; i < this.width; i += 8) {
      // this needed for number of unit
      this.write([0x00, 0x00]);
    }
  }

  brightness(val) {
    this.write([0x0a, val]); // 0 to 15;
    this.passingCommands();
  }

  preparevram(width, height) {
    this.vram = [];
    for (let i = 0; i < height; i++) {
      let dots = new Array(width / 8);
      for (let ii = 0; ii < dots.length; ii++) {
        dots[ii] = 0x00;
      }
      this.vram.push(dots);
    }
  }

  write(data) {
    this.cs.output(false);
    this.spi.write(data);
    this.cs.output(true);
  }

  writeVram() {
    for (let line_num = 0; line_num < this.height; line_num++) {
      let addr = line_num + 1;
      let line = this.vram[line_num];
      let data = [];
      for (let col = 0; col < line.length; col++) {
        data.push(addr);
        data.push(line[col]);
      }
      this.write(data);
    }
  }

  clear() {
    for (let line_num = 0; line_num < this.height; line_num++) {
      let line = this.vram[line_num];
      for (let col = 0; col < line.length; col++) {
        this.vram[line_num][col] = 0x00;
      }
      this.writeVram();
    }
  }

  draw(ctx) {
    let isNode = typeof window === 'undefined';
    if (isNode) {
      // TODO:
      throw new Error("node js mode is under working.");
    } else {
      const imageData = ctx.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        let index = parseInt(i / 4);
        let line = parseInt(index / this.width);
        let col = parseInt((index - line * this.width) / 8);
        let bits = parseInt(index - line * this.width) % 8;
        if (bits === 0) this.vram[line][col] = 0x00;
        if (brightness > 0x7F) this.vram[line][col] |= 0x80 >> bits;
      }
    }
    this.writeVram();
  }
}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("MatrixLED_MAX7219", MatrixLED_MAX7219);

/***/ }),

/***/ "./parts/DistanceSensor/HC-SR04/index.js":
/*!***********************************************!*\
  !*** ./parts/DistanceSensor/HC-SR04/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var HCSR04 = function () {
  this.keys = ["vcc", "triger", "echo", "gnd"];
  this.requiredKeys = ["vcc", "triger", "echo"];

  this._unit = "mm";
};

HCSR04.prototype.wired = function (obniz) {
  this.obniz = obniz;

  obniz.setVccGnd(null, this.params.gnd, "5v");

  this.vccIO = obniz.getIO(this.params.vcc);
  this.triger = this.params.triger;
  this.echo = this.params.echo;
};

HCSR04.prototype.measure = (() => {
  var _ref = _asyncToGenerator(function* (callback) {

    this.vccIO.drive("5v");
    this.vccIO.output(true);
    yield this.obniz.wait(10);

    var self = this;
    this.obniz.measure.echo({
      io_pulse: this.triger,
      io_echo: this.echo,
      pulse: "positive",
      pulse_width: 0.011,
      measure_edges: 3,
      timeout: 10 / 340 * 1000,
      callback: function (edges) {
        self.vccIO.output(false);
        var distance = null;
        for (var i = 0; i < edges.length - 1; i++) {
          // HCSR04's output of io_echo is initially high when triger is finshed
          if (edges[i].edge === true) {
            distance = (edges[i + 1].timing - edges[i].timing) * 1000;
            if (self._unit === "mm") {
              distance = distance / 5.8;
            } else if (self._unit === "inch") {
              distance = distance / 148.0;
            }
          }
        }
        if (typeof callback === "function") {
          callback(distance);
        }
      }
    });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

HCSR04.prototype.unit = function (unit) {
  if (unit === "mm") {
    this._unit = "mm";
  } else if (unit === "inch") {
    this._unit = "inch";
  } else {
    throw new Error("HCSR04: unknown unit " + unit);
  }
};

// Module functions

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("HC-SR04", HCSR04);

/***/ }),

/***/ "./parts/GyroSensor/ENC-03R_Module/index.js":
/*!**************************************************!*\
  !*** ./parts/GyroSensor/ENC-03R_Module/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ENC03R_Module = function () {

  this.keys = ["vcc", "out1", "out2", "gnd"];
  this.required = ["out1", "out2"];
  this.Sens = 0.00067; //Sensitivity, 0.67mV / deg/sec
};

ENC03R_Module.prototype.wired = function (obniz) {
  this.obniz = obniz;
  obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad0 = obniz.getAD(this.params.out1);
  this.ad1 = obniz.getAD(this.params.out2);

  this.io_pwr.output(true);

  var self = this;
  this.ad0.start(function (value) {
    self.sens1 = (value - 1.45) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
    //console.log('raw='+value);
    if (self.onchange1) {
      self.onchange1(self.sens1);
    }
  });

  this.ad1.start(function (value) {
    self.sens2 = (value - 1.35) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
    if (self.onchange2) {
      self.onchange2(self.sens2);
    }
  });
};

ENC03R_Module.prototype.onChangeSens1 = function (callback) {
  this.onchange1 = callback;
};
ENC03R_Module.prototype.onChangeSens2 = function (callback) {
  this.onchange2 = callback;
};

ENC03R_Module.prototype.getValueSens1 = _asyncToGenerator(function* () {
  return (this.ad0.value - 1.47) / Sens;
});

ENC03R_Module.prototype.getValueSens2 = _asyncToGenerator(function* () {
  return (this.ad1.value - 1.35) / Sens;
});

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("ENC03R_Module", ENC03R_Module);

/***/ }),

/***/ "./parts/InfraredSensor/EKMC160XXXX/index.js":
/*!***************************************************!*\
  !*** ./parts/InfraredSensor/EKMC160XXXX/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var PIR_ekmc = function () {
  this.keys = ["vcc", "gnd", "signal"];
  this.requiredKeys = ["signal"];
};

PIR_ekmc.prototype.wired = function (obniz) {
  this.obniz = obniz;
  this.io_signal = obniz.getIO(this.params.signal);
  this.io_signal.pull("0v");

  obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

  var self = this;
  this.io_signal.input(function (value) {
    self.isPressed = value === false;
    if (self.onchange) {
      self.onchange(value === false);
    }
  });
};

PIR_ekmc.prototype.isPressedWait = _asyncToGenerator(function* () {
  var self = this;
  var ret = yield this.io_signal.inputWait();
  return ret == false;
});

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("PIR_ekmc", PIR_ekmc);

/***/ }),

/***/ "./parts/InfraredSensor/IRSensor/index.js":
/*!************************************************!*\
  !*** ./parts/InfraredSensor/IRSensor/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class IRSensor {

  constructor() {
    this.keys = ["output", "vcc", "gnd"];
    this.requiredKeys = ["output"];

    this.dataSymbolLength = 0.07;
    this.duration = 200; // 200msec
    this.dataInverted = true;
    this.trigerSampleCount = 16; // If Signal arrives more than this count. then treat as signal
    this.cutTail = true;
    this.output_pullup = true;
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    if (!obniz.isValidIO(this.params.output)) {
      throw new Errro('output is not valid io');
    }
  }

  start(callback) {
    this.ondetect = callback;
    if (this.output_pullup) {
      obniz.getIO(this.params.output).pull('5v');
    }

    obniz.logicAnalyzer.start({ io: this.params.output, interval: this.dataSymbolLength, duration: this.duration, trigerValue: this.dataInverted ? false : true, trigerValueSamples: this.trigerSampleCount });
    obniz.logicAnalyzer.onmeasured = levels => {
      if (typeof this.ondetect === "function") {
        if (this.dataInverted) {
          let arr = new Uint8Array(levels);
          for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i] ? 0 : 1;
          }
          levels = Array.from(arr);
        }

        if (this.cutTail) {
          for (let i = levels.length - 1; i > 1; i--) {
            if (levels[i] === 0 && levels[i - 1] === 0) {
              levels.splice(i, 1);
            } else {
              break;
            }
          }
        }

        this.ondetect(levels);
      }
    };
  }
}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("IRSensor", IRSensor);

/***/ }),

/***/ "./parts/Light/FullColorLED/index.js":
/*!*******************************************!*\
  !*** ./parts/Light/FullColorLED/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class FullColorLed {
  constructor() {

    this.COMMON_TYPE_ANODE = 1;
    this.COMMON_TYPE_CATHODE = 0;

    this.anode_keys = ['anode', 'anode_common', 'anodeCommon', 'vcc'];
    this.cathode_keys = ['cathode', 'cathode_common', 'cathodeCommon', 'gnd'];
    this.animationName = "FullColorLed-" + Math.round(Math.random() * 1000);

    this.keys = ["r", "g", "b", "common", "commonType"];
    this.requiredKeys = ["r", "g", "b", "common", "commonType"];
  }

  wired(obniz) {
    var r = this.params.r;
    var g = this.params.g;
    var b = this.params.b;
    var common = this.params.common;
    var commontype = this.params.commonType;

    this.obniz = obniz;
    if (this.anode_keys.includes(commontype)) {
      this.commontype = this.COMMON_TYPE_ANODE;
    } else if (this.cathode_keys.includes(commontype)) {
      this.commontype = this.COMMON_TYPE_CATHODE;
    } else {
      this.obniz.error("FullColorLed param need common type [  anode_common or cathode_common ] ");
    }

    this.common = this.obniz.getIO(common);
    this.common.drive("3v");
    this.common.output(this.commontype);

    this.obniz.getIO(r).drive("3v");
    this.obniz.getIO(r).output(this.commontype);
    this.obniz.getIO(g).drive("3v");
    this.obniz.getIO(g).output(this.commontype);
    this.obniz.getIO(b).drive("3v");
    this.obniz.getIO(b).output(this.commontype);
    this.pwmR = this.obniz.getFreePwm();this.pwmR.start({ io: r });this.pwmR.freq(1000);
    this.pwmG = this.obniz.getFreePwm();this.pwmG.start({ io: g });this.pwmG.freq(1000);
    this.pwmB = this.obniz.getFreePwm();this.pwmB.start({ io: b });this.pwmB.freq(1000);
    this.rgb(0, 0, 0);
  }

  rgb(r, g, b) {
    r = Math.min(Math.max(parseInt(r), 0), 255);
    g = Math.min(Math.max(parseInt(g), 0), 255);
    b = Math.min(Math.max(parseInt(b), 0), 255);

    if (this.commontype === this.COMMON_TYPE_ANODE) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }
    this.pwmR.duty(r / 255 * 100);
    this.pwmG.duty(g / 255 * 100);
    this.pwmB.duty(b / 255 * 100);
  }

  hsv(h, s, v) {
    var C = v * s;
    var Hp = h / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));

    var R, G, B;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    };
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    };
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    };
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    };
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    };
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    };

    var m = v - C;
    [R, G, B] = [R + m, G + m, B + m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    this.rgb(R, G, B);
  }

  gradation(cycletime_ms) {

    var frames = [];
    var max = 36 / 2;
    var duration = Math.round(cycletime_ms / max);
    for (var i = 0; i < max; i++) {
      var oneFrame = {
        duration: duration,
        state: function (index) {
          // index = 0
          this.hsv(index * 10 * 2, 1, 1);
        }.bind(this)
      };
      frames.push(oneFrame);
    }
    this.obniz.io.animation(this.animationName, "loop", frames);
  }
  stopgradation() {
    this.obniz.io.animation(this.animationName, "pause");
  }
}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("FullColorLed", FullColorLed);

/***/ }),

/***/ "./parts/Light/InfraredLED/index.js":
/*!******************************************!*\
  !*** ./parts/Light/InfraredLED/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class InfraredLED {

  constructor() {
    this.keys = ["anode", "cathode"];
    this.requiredKeys = ["anode"];

    this.dataSymbolLength = 0.07;
  }

  wired(obniz) {
    this.obniz = obniz;
    if (!this.obniz.isValidIO(this.params.anode)) {
      throw new Error("anode is not valid io");
    }
    if (this.params.cathode) {
      if (!this.obniz.isValidIO(this.params.cathode)) {
        throw new Error("cathode is not valid io");
      }
      this.io_cathode = obniz.getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.pwm = this.obniz.getFreePwm();
    this.pwm.start({ io: this.params.anode });
    this.pwm.freq(38000);
  }

  send(arr) {
    this.pwm.modulate("am", this.dataSymbolLength, arr);
  }
}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("InfraredLED", InfraredLED);

/***/ }),

/***/ "./parts/Light/LED/index.js":
/*!**********************************!*\
  !*** ./parts/Light/LED/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LED = function () {
  this.keys = ["anode", "cathode"];
  this.requiredKeys = ["anode"];

  this.animationName = "Led-" + Math.round(Math.random() * 1000);
};

LED.prototype.wired = function (obniz) {
  this.obniz = obniz;
  this.io_anode = obniz.getIO(this.params.anode);
  if (this.params.cathode) {
    this.io_cathode = obniz.getIO(this.params.cathode);
    this.io_cathode.output(false);
  }
};

// Module functions

LED.prototype.on = function () {
  this.endBlink();
  this.io_anode.output(true);
};

LED.prototype.off = function () {
  this.endBlink();
  this.io_anode.output(false);
};

LED.prototype.endBlink = function () {
  this.obniz.io.animation(this.animationName, "pause");
};

LED.prototype.blink = function (interval) {
  if (!interval) {
    interval = 100;
  }
  var frames = [{
    duration: interval,
    state: function (index) {
      // index = 0
      this.io_anode.output(true); // on
    }.bind(this)
  }, {
    duration: interval,
    state: function (index) {
      // index = 0
      this.io_anode.output(false); //off
    }.bind(this)
  }];

  this.obniz.io.animation(this.animationName, "loop", frames);
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("LED", LED);

/***/ }),

/***/ "./parts/Light/WS2811/index.js":
/*!*************************************!*\
  !*** ./parts/Light/WS2811/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class WS2811 {

  constructor() {
    this.key = ["din", "vcc", "gnd"];
    this.requiredKey = ["din"];
  }

  wired(obniz) {

    this.obniz = obniz;

    this.params.mode = "master";
    this.params.frequency = 2 * 1000 * 1000;
    this.params.mosi = this.params.din;
    this.params.drive = "3v";
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  static _generateFromByte(val) {

    val = parseInt(val);
    const zero = 0x8;
    const one = 0xE;
    let ret = [];
    for (var i = 0; i < 8; i += 2) {
      let byte = 0;
      if (val & 0x80 >> i) {
        byte = one << 4;
      } else {
        byte = zero << 4;
      }
      if (val & 0x80 >> i + 1) {
        byte |= one;
      } else {
        byte |= zero;
      }
      ret.push(byte);
    }
    return ret;
  }

  static _generateColor(r, g, b) {

    let array = WS2811._generateFromByte(r);
    array = array.concat(WS2811._generateFromByte(g));
    array = array.concat(WS2811._generateFromByte(b));
    return array;
  }

  static _generateHsvColor(h, s, v) {
    var C = v * s;
    var Hp = h / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));

    var R, G, B;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    };
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    };
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    };
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    };
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    };
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    };

    var m = v - C;
    [R, G, B] = [R + m, G + m, B + m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    let array = WS2811._generateFromByte(R);
    array = array.concat(WS2811._generateFromByte(G));
    array = array.concat(WS2811._generateFromByte(B));
    return array;
  }

  rgb(r, g, b) {
    this.spi.write(WS2811._generateColor(r, g, b));
  }

  hsv(h, s, v) {
    this.spi.write(WS2811._generateHsvColor(h, s, v));
  }

  rgbs(array) {
    let bytes = [];
    for (var i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2811._generateColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (var i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2811._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("WS2811", WS2811);

/***/ }),

/***/ "./parts/Memory/24LC256/index.js":
/*!***************************************!*\
  !*** ./parts/Memory/24LC256/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _24LC256 = function () {
  this.requiredKeys = ["address"];
  this.keys = ["sda", "scl", "clock", "pullType", "i2c", "address"];
};

_24LC256.prototype.wired = function (obniz) {
  this.params.mode = this.params.mode || "master"; //for i2c
  this.params.clock = this.params.clock || 400 * 1000; //for i2c
  this.i2c = obniz.getI2CWithConfig(this.params);
};

// Module functions

_24LC256.prototype.set = function (address, data) {
  var array = [];
  array.push(address >> 8 & 0xFF);
  array.push(address & 0xFF);
  array.push.apply(array, data);
  this.i2c.write(0x50, array);
  this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
};

_24LC256.prototype.getWait = (() => {
  var _ref = _asyncToGenerator(function* (address, length) {
    var array = [];
    array.push(address >> 8 & 0xFF);
    array.push(address & 0xFF);
    this.i2c.write(0x50, array);
    return yield this.i2c.readWait(0x50, length);
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();
let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("_24LC256", _24LC256);

/***/ }),

/***/ "./parts/MovementSensor/Button/index.js":
/*!**********************************************!*\
  !*** ./parts/MovementSensor/Button/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Button = function () {
  this.keys = ["signal", "gnd"];
  this.required = ["signal"];
};

Button.prototype.wired = function (obniz) {
  this.io_signal = obniz.getIO(this.params.signal);

  if (obniz.isValidIO(this.params.gnd)) {
    this.io_supply = obniz.getIO(this.params.gnd);
    this.io_supply.output(false);
  }

  // start input
  this.io_signal.pull("5v");

  var self = this;
  this.io_signal.input(function (value) {
    self.isPressed = value === false;
    if (self.onchange) {
      self.onchange(value === false);
    }
  });
};

Button.prototype.isPressedWait = _asyncToGenerator(function* () {
  var ret = yield this.io_signal.inputWait();
  return ret === false;
});

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("Button", Button);

/***/ }),

/***/ "./parts/MovementSensor/JoyStick/index.js":
/*!************************************************!*\
  !*** ./parts/MovementSensor/JoyStick/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var JoyStick = function () {
  this.keys = ["sw", "y", "x", "vcc", "gnd", "i2c"];
  this.requiredKeys = ["sw", "y", "x"];
  this.pins = this.keys || ["sw", "y", "x", "vcc", "gnd"];
  this.pinname = { "sw": "sw12" };
  this.shortName = "joyS";
};

JoyStick.prototype.wired = function (obniz) {
  this.obniz = obniz;

  obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

  this.io_sig_sw = obniz.getIO(this.params.sw);
  this.ad_x = obniz.getAD(this.params.x);
  this.ad_y = obniz.getAD(this.params.y);

  this.io_sig_sw.pull("5v");

  var self = this;
  this.ad_x.start(function (value) {
    self.positionX = value / 5.0;
    if (self.onchangex) {
      self.onchangex(self.positionX * 2 - 1);
    }
  });

  this.ad_y.start(function (value) {
    self.positionY = value / 5.0;
    if (self.onchangey) {
      self.onchangey(self.positionY * 2 - 1);
    }
  });

  this.io_sig_sw.input(function (value) {
    self.isPressed = value === false;
    if (self.onchangesw) {
      self.onchangesw(value === false);
    }
  });
};

JoyStick.prototype.isPressedWait = _asyncToGenerator(function* () {
  var ret = yield this.io_sig_sw.inputWait();
  return ret === false;
});

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("JoyStick", JoyStick);

/***/ }),

/***/ "./parts/MovementSensor/KXSC7-2050/index.js":
/*!**************************************************!*\
  !*** ./parts/MovementSensor/KXSC7-2050/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var KXSC7_2050 = function () {
  this.keys = ["x", "y", "z", "vcc", "gnd"];
  this.requiredKeys = ["x", "y", "z"];
};

KXSC7_2050.prototype.wired = (() => {
  var _ref = _asyncToGenerator(function* (obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);
    this.ad_z = obniz.getAD(this.params.z);

    yield obniz.wait(500);
    var ad = obniz.getAD(this.params.vcc);
    var pwrVoltage = yield ad.getWait();
    var horizontalZ = yield this.ad_z.getWait();
    var sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
    var offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)

    var self = this;
    this.ad_x.start(function (value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangex) {
        self.onchangex(self.gravity);
      }
    });

    this.ad_y.start(function (value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangey) {
        self.onchangey(self.gravity);
      }
    });

    this.ad_z.start(function (value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangez) {
        self.onchangez(self.gravity);
      }
    });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("KXSC7_2050", KXSC7_2050);

/***/ }),

/***/ "./parts/MovementSensor/Potentiometer/index.js":
/*!*****************************************************!*\
  !*** ./parts/MovementSensor/Potentiometer/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Potentiometer = function () {
  this.keys = ["pin0", "pin1", "pin2"];
  this.reuiredKeys = ["pin0", "pin1", "pin2"];

  this.vcc_voltage = 5.0;
};

Potentiometer.prototype.wired = function (obniz) {
  this.obniz.setVccGnd(this.params.pin0, this.params.pin2, "5v");
  this.ad = obniz.getAD(this.params.pin1);

  var self = this;

  obniz.getAD(this.params.pin0).start(function (value) {
    self.vcc_voltage = value;
  });

  this.ad.start(function (value) {
    self.position = value / self.vcc_voltage;
    if (self.onchange) {
      self.onchange(self.position);
    }
  });
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("Potentiometer", Potentiometer);

/***/ }),

/***/ "./parts/Moving/DCMotor/index.js":
/*!***************************************!*\
  !*** ./parts/Moving/DCMotor/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DCMotor = function () {
  this.keys = ["forward", "back"];
  this.requiredKeys = ["forward", "back"];
};

DCMotor.prototype.wired = function (obniz) {
  this.status = {
    direction: null,
    power: null
  };

  this.pwm1_io_num = this.params.forward;
  this.pwm2_io_num = this.params.back;

  this.pwm1 = obniz.getFreePwm();
  this.pwm1.start({ io: this.pwm1_io_num });
  this.pwm1.freq(100000);
  this.pwm2 = obniz.getFreePwm();
  this.pwm2.start({ io: this.pwm2_io_num });
  this.pwm2.freq(100000);
  this.power(30);
};

// Module functions

DCMotor.prototype.forward = function () {
  this.move(true);
};

DCMotor.prototype.reverse = function () {
  this.move(false);
};

DCMotor.prototype.stop = function () {
  if (this.status.direction === null) {
    return;
  }
  this.status.direction = null;
  this.pwm1.duty(0);
  this.pwm2.duty(0);
};

DCMotor.prototype.move = function (forward) {
  if (forward) {
    if (this.status.direction === true) {
      return;
    }
    this.status.direction = true;
  } else {
    if (this.status.direction === false) {
      return;
    }
    this.status.direction = false;
  }
  var power = this.power();
  this.power(0);
  this.power(power);
};

DCMotor.prototype.power = function (power) {
  if (power === undefined) {
    return this.status.power;
  }
  this.status.power = power;
  if (this.status.direction === null) {
    this.pwm1.duty(0);
    this.pwm2.duty(0);
    return;
  }
  if (this.status.direction) {
    this.pwm1.duty(power);
    this.pwm2.duty(0);
  } else {
    this.pwm1.duty(0);
    this.pwm2.duty(power);
  }
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("DCMotor", DCMotor);

/***/ }),

/***/ "./parts/Moving/ServoMotor/index.js":
/*!******************************************!*\
  !*** ./parts/Moving/ServoMotor/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ServoMotor = function () {
  this.keys = ["gnd", "vcc", "signal"];
  this.requiredKeys = ["signal"];
};

ServoMotor.prototype.wired = function (obniz) {
  this.obniz = obniz;

  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

  this.pwm = obniz.getFreePwm();
  this.pwm_io_num = this.params.signal;

  this.pwm.start({ io: this.pwm_io_num });
  this.pwm.freq(50);
};

// Module functions

ServoMotor.prototype.angle = function (ratio) {
  var max = 2.4;
  var min = 0.5;
  var val = (max - min) * ratio / 180.0 + min;
  this.pwm.pulse(val);
};

ServoMotor.prototype.on = function () {
  if (this.io_power) {
    this.io_power.output(true);
  }
};

ServoMotor.prototype.off = function () {
  if (this.io_power) {
    this.io_power.output(false);
  }
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("ServoMotor", ServoMotor);

/***/ }),

/***/ "./parts/PressureSensor/FSR-40X/index.js":
/*!***********************************************!*\
  !*** ./parts/PressureSensor/FSR-40X/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//Todo:抵抗を追加して圧力(kg)を求められるように改造する
var FSR40X = function () {
  this.keys = ["pin0", "pin1"];
  this.requiredKeys = ["pin0", "pin1"];
};

FSR40X.prototype.wired = function (obniz) {
  this.obniz = obniz;

  this.io_pwr = obniz.getIO(this.params.pin0);
  this.ad = obniz.getAD(this.params.pin1);

  this.io_pwr.drive("5v");
  this.io_pwr.output(true);

  var self = this;
  this.ad.start(function (value) {
    pressure = value * 100;
    if (pressure >= 49) {
      pressure = 49;
    }
    self.press = pressure;
    if (self.onchange) {
      self.onchange(self.press);
    }
  });
};

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("FSR40X", FSR40X);

/***/ }),

/***/ "./parts/SoilSensor/SEN0114/index.js":
/*!*******************************************!*\
  !*** ./parts/SoilSensor/SEN0114/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var SEN0114 = function () {
  this.keys = ["vcc", "output", "gnd"];
  this.requiredKeys = ["output"];
};

SEN0114.prototype.wired = function (obniz) {
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);

  var self = this;
  this.ad.start(function (value) {
    self.temp = value; //Temp(Celsius) = [AD Voltage] * 100
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

SEN0114.prototype.getHumidityWait = _asyncToGenerator(function* () {
  return yield this.ad.getWait;
});

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("SEN0114", SEN0114);

/***/ }),

/***/ "./parts/Sound/Speaker/index.js":
/*!**************************************!*\
  !*** ./parts/Sound/Speaker/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class Speaker {

  constructor(obniz) {
    this.keys = ["signal", "gnd"];
    this.requiredKeys = ["gnd"];
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(null, this.params.gnd, "5v");
    this.pwm = obniz.getFreePwm();
    this.pwm.start({ io: this.params.signal });
  }

  play(freq) {
    if (freq > 0) {
      this.pwm.freq(freq);
      this.pwm.pulse(1 / freq / 2 * 1000);
    } else {
      this.pwm.pulse(0);
    }
  }

  stop() {
    this.play(0);
  }
}

let Obniz = __webpack_require__(/*! ../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("Speaker", Speaker);

/***/ }),

/***/ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js":
/*!******************************************************************!*\
  !*** ./parts/TemperatureSensor/analog/AnalogTempratureSensor.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class AnalogTemplatureSensor {
  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["signal"];
    this.drive = "5v";
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.signal);

    this.ad.start(function (voltage) {
      this.temp = this.calc(voltage);
      this.onchange(this.temp);
    }.bind(this));
  }

  onchange(temp) {}

  calc(voltage) {
    return 0;
  }

}

module.exports = AnalogTemplatureSensor;

/***/ }),

/***/ "./parts/TemperatureSensor/analog/LM35DZ/index.js":
/*!********************************************************!*\
  !*** ./parts/TemperatureSensor/analog/LM35DZ/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");
class LM35DZ extends AnalogTemplatureSensor {
  calc(voltage) {
    return voltage * 100; //Temp(Celsius) = [AD Voltage] * 100l;
  }
};

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("LM35DZ", LM35DZ);

/***/ }),

/***/ "./parts/TemperatureSensor/analog/LM60/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/analog/LM60/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LM60 = function () {
  this.keys = ["vcc", "gnd", "output"];
  this.requiredKeys = ["output"];
};

LM60.prototype.wired = function (obniz) {
  this.obniz = obniz;
  this.ad = obniz.getAD(this.params.output);

  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  var self = this;
  this.ad.start(function (value) {
    self.temp = Math.round((value - 0.424) / 0.00625 * 10) / 10; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("LM60", LM60);

/***/ }),

/***/ "./parts/TemperatureSensor/analog/LM61/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/analog/LM61/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

class LM61 extends AnalogTemplatureSensor {
  calc(voltage) {
    return Math.round((voltage - 0.6) / 0.01); //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]  
  }
};

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("LM61", LM61);

/***/ }),

/***/ "./parts/TemperatureSensor/analog/MCP9700/index.js":
/*!*********************************************************!*\
  !*** ./parts/TemperatureSensor/analog/MCP9700/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

class MCP9700 extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 0.5) / 0.01; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
};

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("MCP9700", MCP9700);

/***/ }),

/***/ "./parts/TemperatureSensor/analog/MCP9701/index.js":
/*!*********************************************************!*\
  !*** ./parts/TemperatureSensor/analog/MCP9701/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

class MCP9701 extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 0.4) / 0.0195; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
};

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("MCP9701", MCP9701);

/***/ }),

/***/ "./parts/TemperatureSensor/analog/S8100B/index.js":
/*!********************************************************!*\
  !*** ./parts/TemperatureSensor/analog/S8100B/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

//センサから出力が無い(出力インピーダンス高すぎ？)

class S8100B extends AnalogTemplatureSensor {
  calc(voltage) {
    return 30 + (1.508 - voltage) / -0.08; //Temp(Celsius) =
  }
};

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("S8100B", S8100B);

/***/ }),

/***/ "./parts/TemperatureSensor/analog/S8120C/index.js":
/*!********************************************************!*\
  !*** ./parts/TemperatureSensor/analog/S8120C/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

//不調, 正しく測れるときもある...
//原因1:obnizの入力インピーダンスが低すぎる?
//原因2:センサーが発振してる？（データシート通り抵抗を追加したが改善しない）

class S8120C extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 1.474) / -0.0082 + 30; //Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
  }
};

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("S8120C", S8120C);

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/ADT7410/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/ADT7410/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ADT7410 = function () {
  this.keys = ["vcc", "gnd", "sda", "scl", "addressMode"];
  this.requiredKey = ["addressMode"];
};

ADT7410.prototype.wired = function (obniz) {
  this.obniz = obniz;
  obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

  if (this.params.addressMode === 8) {
    this.address = 0x48;
  } else if (this.params.addressMode === 9) {
    this.address = 0x49;
  }

  this.params.clock = 400000;
  this.params.pull = "5v";
  this.params.mode = "master";

  this.i2c = obniz.getI2CWithConfig(this.params);
};

ADT7410.prototype.getTempWait = _asyncToGenerator(function* () {
  var ret = yield this.i2c.readWait(this.address, 2);
  var tempBin = ret[0] << 8;
  tempBin |= ret[1];
  tempBin = tempBin >> 3;

  if (tempBin & 0x1000) {
    //0度以下の時の処理
    tempBin = tempBin - 8192;
  }

  return tempBin / 16;
});

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("ADT7410", ADT7410);

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/S-5851A/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/S-5851A/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//センサからの反応なし
var S5851A = function () {
  this.requiredKeys = ["vcc", "gnd", "adr0", "adr1", "adr_select"];
  this.keys = ["sda", "scl", "adr0", "adr1", "adr_select", "i2c"];
};

S5851A.prototype.wired = function (obniz) {
  //params: pwr, gnd, sda, scl, adr0, adr1, adr_select
  this.io_adr0 = obniz.getIO(this.params.adr0);
  this.io_adr1 = obniz.getIO(this.params.adr1);

  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

  switch (this.params.adr_select) {
    case 8:
      this.io_adr0.output(false);
      this.io_adr1.output(false);
      this.address = 0x48;
      break;
    case 9:
      this.io_adr0.pull(null);
      this.io_adr1.output(false);
      this.address = 0x49;
      break;
    case 'A':
      this.io_adr0.output(true);
      this.io_adr1.output(false);
      this.address = 0x4A;
      break;
    case 'B':
      this.io_adr0.output(false);
      this.io_adr1.output(true);
      this.address = 0x4B;
      break;
    case 'C':
      this.io_adr0.pull(null);
      this.io_adr1.output(true);
      this.address = 0x4C;
      break;
    case 'D':
      this.io_adr0.output(true);
      this.io_adr1.output(true);
      this.address = 0x4D;
      break;
    case 'E':
      this.io_adr0.output(false);
      this.io_adr1.pull(null);
      this.address = 0x4E;
      break;
    case 'F':
      this.io_adr0.output(true);
      this.io_adr1.pull(null);
      this.address = 0x4F;
      break;
    default:
      this.io_adr0.output(false);
      this.io_adr1.output(false);
      this.address = 0x48;
      break;
  }
  console.log('i2c address=' + this.address);

  this.params.clock = this.params.clock || 400 * 1000; //for i2c
  this.params.mode = this.params.mode || "master"; //for i2c
  this.params.pull = this.params.pull || "5v"; //for i2c
  this.i2c = obniz.getI2CWithConfig(this.params);
  //obniz.i2c0.write(address, [0x20, 0x24]);
};

S5851A.prototype.getTempWait = _asyncToGenerator(function* () {
  //console.log("gettempwait");
  //obniz.i2c0.write(address, [0x20, 0x24]);
  //obniz.i2c0.write(address, [0xE0, 0x00]);
  var ret = yield this.i2c0.readWait(address, 2);
  //console.log('ret:' + ret);
  var tempBin = ret[0].toString(2) + ('00000000' + ret[1].toString(2)).slice(-8);
  var temperature = -45 + 175 * (parseInt(tempBin, 2) / (65536 - 1));
  return temperature;
});

S5851A.prototype.getHumdWait = _asyncToGenerator(function* () {
  this.i2c.write(address, [0x20, 0x24]);
  this.i2c.write(address, [0xE0, 0x00]);
  var ret = yield this.i2c.readWait(address, 4);
  var humdBin = ret[2].toString(2) + ('00000000' + ret[3].toString(2)).slice(-8);
  var humidity = 100 * (parseInt(humdBin, 2) / (65536 - 1));
  return humidity;
});

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("S5851A", S5851A);

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/SHT31/index.js":
/*!****************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/SHT31/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var SHT31 = function () {
  this.requiredKeys = ["adr", "addressmode"];
  this.keys = ["vcc", "sda", "scl", "gnd", "adr", "addressmode", "i2c"];
  this.ioKeys = ["vcc", "sda", "scl", "gnd", "adr"];

  this.commands = {};
  this.commands.softReset = [0x30, 0xA2];
  this.commands.highRepeatStreach = [0x2C, 0x06];
  this.commands.middleRepeatStreach = [0x2C, 0x0D];
  this.commands.lowRepeatStreach = [0x2C, 0x10];
  this.commands.highRepeat = [0x24, 0x00];
  this.commands.mediumRepeat = [0x24, 0x0B];
  this.commands.lowRepeat = [0x24, 0x16];

  this.waitTime = {};
  this.waitTime.wakeup = 1;
  this.waitTime.softReset = 1;
  this.waitTime.lowRepeat = 4;
  this.waitTime.mediumRepeat = 6;
  this.waitTime.highRepeat = 15;

  //not tested
  this.commands.readStatus = [0xF3, 0x2D];
};

SHT31.prototype.wired = function (obniz) {
  this.obniz = obniz;
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.io_adr = obniz.getIO(this.params.adr);

  if (this.params.addressmode === 4) {
    this.io_adr.output(false);
    this.address = 0x44;
  } else if (this.params.addressmode === 5) {
    this.io_adr.pull(null);
    this.address = 0x45;
  }

  this.params.clock = this.params.clock || 400 * 1000; //for i2c
  this.params.mode = this.params.mode || "master"; //for i2c
  this.params.pullType = this.params.pullType || "float"; //for i2c
  this.i2c = obniz.getI2CWithConfig(this.params);
  obniz.i2c0.write(this.address, this.commands.softReset);
};

SHT31.prototype.getData = _asyncToGenerator(function* () {
  this.i2c.write(this.address, this.commands.highRepeat);
  yield obniz.wait(this.waitTime.highRepeat);
  return yield this.i2c.readWait(this.address, 6);
});

SHT31.prototype.getTempWait = _asyncToGenerator(function* () {
  return (yield this.getAllWait()).temperature;
});

SHT31.prototype.getHumdWait = _asyncToGenerator(function* () {
  return (yield this.getAllWait()).humidity;
});

SHT31.prototype.getAllWait = _asyncToGenerator(function* () {
  let ret = yield this.getData();

  let tempBin = ret[0] * 256 + ret[1];
  let temperature = -45 + 175 * (tempBin / (65536 - 1));

  let humdBin = ret[3] * 256 + ret[4];
  let humidity = 100 * (humdBin / (65536 - 1));
  return { temperature, humidity };
});

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("SHT31", SHT31);

/***/ }),

/***/ "./parts/TemperatureSensor/spi/ADT7310/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/spi/ADT7310/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ADT7310 = function () {
  this.keys = ["vcc", "gnd", "frequency", "din", "dout", "clk", "spi"];
  this.requiredKeys = [];
};

ADT7310.prototype.wired = (() => {
  var _ref = _asyncToGenerator(function* (obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.params.mode = this.params.mode || "master";
    this.params.frequency = this.params.frequency || 500000;
    this.params.mosi = this.params.din;
    this.params.miso = this.params.dout;
    this.spi = this.obniz.getSpiWithConfig(this.params);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

ADT7310.prototype.getTempWait = _asyncToGenerator(function* () {
  yield this.spi.writeWait([0x54]); //毎回コマンドを送らないと安定しない
  yield this.obniz.wait(200); //適度な値でないと安定しない
  var ret = yield this.spi.writeWait([0x00, 0x00]);
  var tempBin = ret[0] << 8;
  tempBin |= ret[1];
  tempBin = tempBin >> 3;

  if (tempBin & 0x1000) {
    //0度以下の時の処理
    tempBin = tempBin - 8192;
  }

  return tempBin / 16;
});

let Obniz = __webpack_require__(/*! ../../../../obniz/index.js */ "./obniz/index.js");
Obniz.PartsRegistrate("ADT7310", ADT7310);

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "js-yaml":
/*!**************************!*\
  !*** external "js-yaml" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("js-yaml");

/***/ }),

/***/ "node-dir":
/*!***************************!*\
  !*** external "node-dir" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-dir");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("string_decoder");

/***/ }),

/***/ "tv4":
/*!**********************!*\
  !*** external "tv4" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tv4");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ })

/******/ });
});