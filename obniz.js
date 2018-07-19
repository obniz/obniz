var Obniz =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./obniz/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./json_schema sync recursive \\.yml$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./index.yml": "./json_schema/index.yml",
	"./request/ad/deinit.yml": "./json_schema/request/ad/deinit.yml",
	"./request/ad/index.yml": "./json_schema/request/ad/index.yml",
	"./request/ad/input.yml": "./json_schema/request/ad/input.yml",
	"./request/ble/central/characteristic_get.yml": "./json_schema/request/ble/central/characteristic_get.yml",
	"./request/ble/central/characteristic_read.yml": "./json_schema/request/ble/central/characteristic_read.yml",
	"./request/ble/central/characteristic_register_notify.yml": "./json_schema/request/ble/central/characteristic_register_notify.yml",
	"./request/ble/central/characteristic_unregister_notify.yml": "./json_schema/request/ble/central/characteristic_unregister_notify.yml",
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
	"./request/ble/peripheral/characteristic_notify.yml": "./json_schema/request/ble/peripheral/characteristic_notify.yml",
	"./request/ble/peripheral/characteristic_read.yml": "./json_schema/request/ble/peripheral/characteristic_read.yml",
	"./request/ble/peripheral/characteristic_write.yml": "./json_schema/request/ble/peripheral/characteristic_write.yml",
	"./request/ble/peripheral/descriptor_read.yml": "./json_schema/request/ble/peripheral/descriptor_read.yml",
	"./request/ble/peripheral/descriptor_write.yml": "./json_schema/request/ble/peripheral/descriptor_write.yml",
	"./request/ble/peripheral/index.yml": "./json_schema/request/ble/peripheral/index.yml",
	"./request/ble/peripheral/servie_start.yml": "./json_schema/request/ble/peripheral/servie_start.yml",
	"./request/ble/peripheral/servie_stop.yml": "./json_schema/request/ble/peripheral/servie_stop.yml",
	"./request/ble/peripheral/servie_stop_all.yml": "./json_schema/request/ble/peripheral/servie_stop_all.yml",
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
	"./response/ble/central/characteristic_get_finish.yml": "./json_schema/response/ble/central/characteristic_get_finish.yml",
	"./response/ble/central/characteristic_notify.yml": "./json_schema/response/ble/central/characteristic_notify.yml",
	"./response/ble/central/characteristic_read.yml": "./json_schema/response/ble/central/characteristic_read.yml",
	"./response/ble/central/characteristic_register_notify.yml": "./json_schema/response/ble/central/characteristic_register_notify.yml",
	"./response/ble/central/characteristic_unregister_notify.yml": "./json_schema/response/ble/central/characteristic_unregister_notify.yml",
	"./response/ble/central/characteristic_write.yml": "./json_schema/response/ble/central/characteristic_write.yml",
	"./response/ble/central/descriptor_get.yml": "./json_schema/response/ble/central/descriptor_get.yml",
	"./response/ble/central/descriptor_get_finish.yml": "./json_schema/response/ble/central/descriptor_get_finish.yml",
	"./response/ble/central/descriptor_read.yml": "./json_schema/response/ble/central/descriptor_read.yml",
	"./response/ble/central/descriptor_write.yml": "./json_schema/response/ble/central/descriptor_write.yml",
	"./response/ble/central/error.yml": "./json_schema/response/ble/central/error.yml",
	"./response/ble/central/index.yml": "./json_schema/response/ble/central/index.yml",
	"./response/ble/central/scan.yml": "./json_schema/response/ble/central/scan.yml",
	"./response/ble/central/scan_finish.yml": "./json_schema/response/ble/central/scan_finish.yml",
	"./response/ble/central/service_get.yml": "./json_schema/response/ble/central/service_get.yml",
	"./response/ble/central/service_get_finish.yml": "./json_schema/response/ble/central/service_get_finish.yml",
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
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/","definitions":{"pinSetting":{"id":"pinSetting","type":"integer","minimum":0,"maximum":11,"default":null},"bleAdvertiseData":{"id":"bleAdvertiseData","type":"array","default":null,"maxItems":31,"items":{"type":"integer","minimum":0,"maximum":255}},"dataArray32":{"id":"dataArray32","type":"array","default":null,"maxItems":32,"items":{"type":"integer","minimum":0,"maximum":255}},"dataArray1024":{"id":"dataArray1024","type":"array","default":null,"maxItems":1024,"items":{"type":"integer","minimum":0,"maximum":255}},"bitArray":{"id":"bitArray","type":"array","default":null,"items":{"type":"integer","minimum":0,"maximum":1}},"dataArray":{"id":"dataArray","type":"array","default":null,"items":{"type":"integer","minimum":0,"maximum":255}},"imageData128x64":{"id":"imageData128x64","type":"array","minItems":1024,"maxItems":1024,"items":{"type":"integer","minimum":0,"maximum":255}},"hexString":{"id":"hexString","type":"string","default":null,"pattern":"^([0-9a-fA-F]+)$"},"uuid":{"id":"uuid","type":"string","pattern":"^([-0-9a-fA-F]+)$","minLength":4,"maxLength":36},"uuidOrNull":{"id":"uuidOrNull","type":["string","null"],"pattern":"^([-0-9a-fA-F]+)$","minLength":4,"maxLength":36},"deviceAddress":{"id":"deviceAddress","type":"string","pattern":"^([0-9a-fA-F]+)$","minLength":12,"maxLength":12},"obnizId":{"id":"obnizId","type":["string","integer"],"pattern":"^[0-9]{4}-?[0-9]{4}$","minimum":0,"maximum":99999999}}}

/***/ }),

/***/ "./json_schema/request/ad/deinit.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/ad/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad","basePath":"ad0","anyOf":[{"$ref":"/request/ad/get"},{"$ref":"/request/ad/deinit"}]}

/***/ }),

/***/ "./json_schema/request/ad/input.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad/get","related":"/response/ad/get","desription":"enable & start ad module at io.","type":"object","required":["stream"],"properties":{"stream":{"type":"boolean","default":false}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_get","related":"/response/ble/central/characteristic_get","type":"object","required":["get_characteristics"],"properties":{"get_characteristics":{"type":"object","required":["address","service_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_read","related":"/response/ble/central/characteristic_read","type":"object","required":["read_characteristic"],"properties":{"read_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_register_notify.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_register_notify","related":"/response/ble/central/characteristic_register_notify","type":"object","required":["register_notify_characteristic"],"properties":{"register_notify_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_unregister_notify.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_unregister_notify","related":"/response/ble/central/characteristic_unregister_notify","type":"object","required":["unregister_notify_characteristic"],"properties":{"unregister_notify_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_write","related":"/response/ble/central/characteristic_write","type":"object","required":["write_characteristic"],"properties":{"write_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"needResponse":{"type":"boolean","default":true}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/connect.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/connect","related":"/response/ble/central/status_update","type":"object","required":["connect"],"properties":{"connect":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/descriptor_get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/descriptor_get","related":"/response/ble/central/descriptor_get","type":"object","required":["get_descriptors"],"properties":{"get_descriptors":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/descriptor_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/descriptor_read","related":"/response/ble/central/descriptor_read","type":"object","required":["read_descriptor"],"properties":{"read_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/descriptor_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/descriptor_write","related":"/response/ble/central/descriptor_write","type":"object","required":["write_descriptor"],"properties":{"write_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"needResponse":{"type":"boolean","default":true}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/disconnect.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/disconnect","type":"object","required":["disconnect"],"properties":{"disconnect":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central","basePath":"ble","anyOf":[{"$ref":"/request/ble/central/scan_start"},{"$ref":"/request/ble/central/scan_stop"},{"$ref":"/request/ble/central/connect"},{"$ref":"/request/ble/central/disconnect"},{"$ref":"/request/ble/central/service_get"},{"$ref":"/request/ble/central/characteristic_get"},{"$ref":"/request/ble/central/characteristic_read"},{"$ref":"/request/ble/central/characteristic_write"},{"$ref":"/request/ble/central/characteristic_register_notify"},{"$ref":"/request/ble/central/characteristic_unregister_notify"},{"$ref":"/request/ble/central/descriptor_get"},{"$ref":"/request/ble/central/descriptor_read"},{"$ref":"/request/ble/central/descriptor_write"}]}

/***/ }),

/***/ "./json_schema/request/ble/central/scan_start.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/scan_start","related":["/response/ble/central/scan","/response/ble/central/scan_finish"],"type":"object","required":["scan"],"properties":{"scan":{"type":"object","additionalProperties":false,"properties":{"duration":{"type":"integer","default":30}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/scan_stop.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/scan_stop","type":"object","required":["scan"],"properties":{"scan":{"type":"null"}}}

/***/ }),

/***/ "./json_schema/request/ble/central/service_get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/service_get","related":"/response/ble/central/service_get","type":"object","required":["get_services"],"properties":{"get_services":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble","basePath":"ble","anyOf":[{"$ref":"/request/ble/peripheral"},{"$ref":"/request/ble/central"}]}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/advertisement_start.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/advertisement_start","related":"/response/ble/peripheral/status","type":"object","required":["advertisement"],"properties":{"advertisement":{"type":"object","required":["adv_data"],"additionalProperties":false,"properties":{"adv_data":{"$ref":"/bleAdvertiseData"},"scan_resp":{"$ref":"/bleAdvertiseData"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/advertisement_stop.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/advertisement_stop","type":"object","required":["advertisement"],"properties":{"advertisement":{"type":"null"}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/characteristic_notify.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_notify","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["notify_characteristic"],"properties":{"notify_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/characteristic_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_read","related":"/response/ble/peripheral/characteristic_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["read_characteristic"],"properties":{"read_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/characteristic_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_write","related":"/response/ble/peripheral/characteristic_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["write_characteristic"],"properties":{"write_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/descriptor_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/descriptor_read","related":"/response/ble/peripheral/descriptor_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["read_descriptor"],"properties":{"read_descriptor":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/descriptor_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/descriptor_write","related":"/response/ble/peripheral/descriptor_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["write_descriptor"],"properties":{"write_descriptor":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral","basePath":"ble","anyOf":[{"$ref":"/request/ble/peripheral/advertisement_start"},{"$ref":"/request/ble/peripheral/advertisement_stop"},{"$ref":"/request/ble/peripheral/service_start"},{"$ref":"/request/ble/peripheral/service_stop"},{"$ref":"/request/ble/peripheral/service_stop_all"},{"$ref":"/request/ble/peripheral/characteristic_read"},{"$ref":"/request/ble/peripheral/characteristic_write"},{"$ref":"/request/ble/peripheral/descriptor_read"},{"$ref":"/request/ble/peripheral/descriptor_write"}]}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_start.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_start","related":["/response/ble/peripheral/status","/response/ble/peripheral/characteristic_notify_read","/response/ble/peripheral/characteristic_notify_write","/response/ble/peripheral/descriptor_notify_read","/response/ble/peripheral/descriptor_notify_write"],"type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["services"],"properties":{"services":{"type":"array","minItems":1,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"characteristics":{"type":"array","minItems":0,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"properties":{"type":"array","default":["read","write"],"items":{"type":"string","enum":["broadcast","read","write_without_response","write","notify","indicate","auth","extended_properties"]}},"permissions":{"type":"array","default":["read","write"],"items":{"default":["read","write"],"type":"string","enum":["read","write"]}},"descriptors":{"type":"array","minItems":0,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"permissions":{"type":"array","default":["read","write"],"items":{"default":["read","write"],"type":"string","enum":["read","write"]}}}}}}}}}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_stop.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_stop","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["stop_service"],"properties":{"stop_service":{"type":"object","required":["service_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_stop_all.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_stop_all","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"null"}}}

/***/ }),

/***/ "./json_schema/request/display/clear.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/clear","type":"object","required":["clear"],"properties":{"clear":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/display/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display","basePath":"display","anyOf":[{"$ref":"/request/display/text"},{"$ref":"/request/display/clear"},{"$ref":"/request/display/qr"},{"$ref":"/request/display/raw"},{"$ref":"/request/display/pin_assign"}]}

/***/ }),

/***/ "./json_schema/request/display/pin_assign.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/pin_assign","type":"object","required":["pin_assign"],"properties":{"pin_assign":{"type":"object","minProperties":1,"patternExample":[0,1,2,3],"patternProperties":{"^[0-9]$":{"type":"object","properties":{"module_name":{"type":"string"},"pin_name":{"type":"string"}}},"^1[0-1]$":{"type":"object","properties":{"module_name":{"type":"string"},"pin_name":{"type":"string"}}}}}}}

/***/ }),

/***/ "./json_schema/request/display/qr.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/qr","type":"object","required":["qr"],"properties":{"qr":{"type":"object","required":["text"],"additionalProperties":false,"properties":{"text":{"type":"string"},"correction":{"type":"string","enum":["L","M","Q","H"],"default":"M"}}}}}

/***/ }),

/***/ "./json_schema/request/display/raw.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/raw","type":"object","required":["raw"],"properties":{"raw":{"$ref":"/imageData128x64"}}}

/***/ }),

/***/ "./json_schema/request/display/text.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/text","type":"object","required":["text"],"properties":{"text":{"type":"string"}}}

/***/ }),

/***/ "./json_schema/request/i2c/deinit.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/i2c/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c","basePath":"i2c0","anyOf":[{"$ref":"/request/i2c/init_master"},{"$ref":"/request/i2c/init_slave"},{"$ref":"/request/i2c/write"},{"$ref":"/request/i2c/read"},{"$ref":"/request/i2c/deinit"}]}

/***/ }),

/***/ "./json_schema/request/i2c/init_master.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/init_master","type":"object","required":["mode","sda","scl","clock"],"uniqueKeys":["sda","scl"],"properties":{"mode":{"type":"string","enum":["master"]},"sda":{"$ref":"/pinSetting"},"scl":{"$ref":"/pinSetting"},"clock":{"type":"integer","minimum":1,"maximum":1000000}}}

/***/ }),

/***/ "./json_schema/request/i2c/init_slave.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/init_slave","related":"/response/i2c/slave","type":"object","required":["mode","sda","scl","slave_address"],"uniqueKeys":["sda","scl"],"properties":{"mode":{"type":"string","enum":["master","slave"]},"sda":{"$ref":"/pinSetting"},"scl":{"$ref":"/pinSetting"},"slave_address":{"type":"integer","minimum":0,"maximum":1023},"slave_address_length":{"type":"integer","enum":[7],"default":7},"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"data":{"$ref":"/dataArray"},"read":{"type":"integer","minimum":0}}}

/***/ }),

/***/ "./json_schema/request/i2c/read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/read","related":"/response/i2c/master","type":"object","required":["address","read"],"properties":{"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"read":{"type":"integer","minimum":0,"maximum":1024}}}

/***/ }),

/***/ "./json_schema/request/i2c/write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/write","type":"object","required":["address","data"],"properties":{"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"data":{"$ref":"/dataArray1024"}}}

/***/ }),

/***/ "./json_schema/request/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request","type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"patternProperties":{"^io[0-9]$":{"$ref":"/request/io"},"^io1[0-1]$":{"$ref":"/request/io"},"^ad[0-9]$":{"$ref":"/request/ad"},"^ad1[0-1]$":{"$ref":"/request/ad"},"^pwm[0-5]$":{"$ref":"/request/pwm"},"^uart[0-1]$":{"$ref":"/request/uart"},"^spi[0-1]$":{"$ref":"/request/spi"},"^i2c0$":{"$ref":"/request/i2c"}},"properties":{"io":{"$ref":"/request/ioAnimation"},"ble":{"$ref":"/request/ble"},"switch":{"$ref":"/request/switch"},"display":{"$ref":"/request/display"},"measure":{"$ref":"/request/measure"},"message":{"$ref":"/request/message"},"logic_analyzer":{"$ref":"/request/logicAnalyzer"},"system":{"$ref":"/request/system"},"ws":{"$ref":"/request/ws"}}}}

/***/ }),

/***/ "./json_schema/request/io/deinit.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/io/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io","basePath":"io0","anyOf":[{"$ref":"/request/io/input"},{"$ref":"/request/io/input_detail"},{"$ref":"/request/io/output"},{"$ref":"/request/io/output_detail"},{"$ref":"/request/io/output_type"},{"$ref":"/request/io/pull_type"},{"$ref":"/request/io/deinit"}]}

/***/ }),

/***/ "./json_schema/request/io/input.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/input","related":"/response/io/get","type":"string","enum":["get"]}

/***/ }),

/***/ "./json_schema/request/io/input_detail.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/input_detail","related":"/response/io/get","type":"object","required":["direction"],"properties":{"direction":{"type":"string","enum":["input"]},"stream":{"type":"boolean","default":false}}}

/***/ }),

/***/ "./json_schema/request/io/output.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/output","type":"boolean"}

/***/ }),

/***/ "./json_schema/request/io/output_detail.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/output_detail","type":"object","required":["direction","value"],"properties":{"direction":{"type":"string","enum":["output"]},"value":{"type":"boolean"}}}

/***/ }),

/***/ "./json_schema/request/io/output_type.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/output_type","type":"object","required":["output_type"],"properties":{"output_type":{"type":"string","enum":["push-pull5v","push-pull3v","open-drain"]}}}

/***/ }),

/***/ "./json_schema/request/io/pull_type.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/pull_type","type":"object","required":["pull_type"],"properties":{"pull_type":{"type":"string","enum":["pull-up5v","pull-up3v","pull-down","float"]}}}

/***/ }),

/***/ "./json_schema/request/ioanimation/changeState.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation/changeState","type":"object","required":["animation"],"properties":{"animation":{"type":"object","required":["name","status"],"additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":254},"status":{"type":"string","enum":["pause","resume"]}}}}}

/***/ }),

/***/ "./json_schema/request/ioanimation/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation","basePath":"io.animation","anyOf":[{"$ref":"/request/ioAnimation/init"},{"$ref":"/request/ioAnimation/changeState"}]}

/***/ }),

/***/ "./json_schema/request/ioanimation/init.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation/init","commandExample":{"io":{"animation":{"animation":{"name":"animation-1","status":"loop","states":[{"duration":500,"state":{"io0":true}},{"duration":500,"state":{"io0":false}}]}}}},"type":"object","required":["animation"],"properties":{"animation":{"type":"object","required":["name","status","states"],"additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":254},"status":{"type":"string","default":"loop","enum":["loop"]},"states":{"type":"array","default":[],"items":{"type":"object","required":["duration","state"],"additionalProperties":false,"properties":{"duration":{"type":"integer","minimum":0,"maximum":60000},"state":{"type":["object","array"],"filter":"pass_all"}}}}}}}}

/***/ }),

/***/ "./json_schema/request/logicanalyzer/deinit.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/logicanalyzer/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer","basePath":"logic_analyzer","anyOf":[{"$ref":"/request/logicAnalyzer/init"},{"$ref":"/request/logicAnalyzer/deinit"}]}

/***/ }),

/***/ "./json_schema/request/logicanalyzer/init.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer/init","exampleDescription":"With below sample code, you will receive only data which start with 'false, false, false' 3bit.","type":"object","required":["io","interval","duration"],"properties":{"io":{"type":"array","minItems":1,"maxItems":1,"items":{"$ref":"/pinSetting"}},"interval":{"type":"number","minimum":0,"exclusiveMinimum":true},"duration":{"type":"integer","minimum":0,"exclusiveMinimum":true},"trigger":{"type":"object","additionalProperties":false,"required":["value","samples"],"default":{"value":false,"samples":0},"properties":{"value":{"type":"boolean","default":false},"samples":{"type":"integer","minimum":0,"default":0}}}}}

/***/ }),

/***/ "./json_schema/request/measure/echo.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/measure/echo","related":"/response/measure/echo","type":"object","required":["echo"],"properties":{"echo":{"type":"object","required":["io_pulse","io_echo","pulse_width"],"properties":{"io_pulse":{"$ref":"/pinSetting"},"io_echo":{"$ref":"/pinSetting"},"pulse":{"type":"string","default":"positive","enum":["positive","negative"]},"pulse_width":{"type":"number","minimum":0.001,"maximum":1000},"measure_edges":{"type":"integer","minimum":1,"maximum":4},"timeout":{"type":"number","default":1000,"minimum":0.001,"maximum":1000}}}}}

/***/ }),

/***/ "./json_schema/request/measure/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/measure","basePath":"measure","anyOf":[{"$ref":"/request/measure/echo"}]}

/***/ }),

/***/ "./json_schema/request/message/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/message","basePath":"message","anyOf":[{"$ref":"/request/message/send"}]}

/***/ }),

/***/ "./json_schema/request/message/send.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/message/send","related":"/response/message/receive","type":"object","additionalProperties":false,"required":["data","to"],"properties":{"data":{},"to":{"type":"array","minItems":1,"items":{"$ref":"/obnizId"}}}}

/***/ }),

/***/ "./json_schema/request/pwm/deinit.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/pwm/freq.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/freq","type":"object","required":["freq"],"properties":{"freq":{"type":"integer","minimum":1,"maximum":80000000}}}

/***/ }),

/***/ "./json_schema/request/pwm/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm","basePath":"pwm0","anyOf":[{"$ref":"/request/pwm/init"},{"$ref":"/request/pwm/freq"},{"$ref":"/request/pwm/pulse"},{"$ref":"/request/pwm/modulate"},{"$ref":"/request/pwm/deinit"}]}

/***/ }),

/***/ "./json_schema/request/pwm/init.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/init","type":"object","required":["io"],"properties":{"io":{"$ref":"/pinSetting"}}}

/***/ }),

/***/ "./json_schema/request/pwm/modulate.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/modulate","type":"object","required":["modulate"],"properties":{"modulate":{"type":"object","required":["type","symbol_length","data"],"additionalProperties":false,"properties":{"type":{"type":"string","enum":["am"]},"symbol_length":{"type":"number","minimum":0.05,"maximum":1000},"data":{"$ref":"/bitArray"}}}}}

/***/ }),

/***/ "./json_schema/request/pwm/pulse.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/pulse","type":"object","required":["pulse"],"properties":{"pulse":{"type":"number","minimum":0}}}

/***/ }),

/***/ "./json_schema/request/spi/deinit.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/spi/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi","basePath":"spi0","anyOf":[{"$ref":"/request/spi/init_master"},{"$ref":"/request/spi/deinit"},{"$ref":"/request/spi/write"}]}

/***/ }),

/***/ "./json_schema/request/spi/init_master.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/init_master","type":"object","required":["mode","clock"],"uniqueKeys":["mosi","miso","clk"],"properties":{"mode":{"type":"string","enum":["master"]},"clk":{"$ref":"/pinSetting"},"mosi":{"$ref":"/pinSetting"},"miso":{"$ref":"/pinSetting"},"clock":{"type":"integer","default":115200,"minimum":1,"maximum":26000000,"desription":"frequency (Hz)"}}}

/***/ }),

/***/ "./json_schema/request/spi/write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/write","related":"/response/spi/read","type":"object","required":["data","read"],"properties":{"data":{"$ref":"/dataArray1024"},"read":{"type":"boolean","default":true}}}

/***/ }),

/***/ "./json_schema/request/switch/get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/switch/get","related":"/response/switch/change","type":"string","enum":["get"]}

/***/ }),

/***/ "./json_schema/request/switch/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/switch","basePath":"switch","anyOf":[{"$ref":"/request/switch/get"}]}

/***/ }),

/***/ "./json_schema/request/system/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system","basePath":"system","anyOf":[{"$ref":"/request/system/wait"},{"$ref":"/request/system/reset"},{"$ref":"/request/system/reboot"},{"$ref":"/request/system/selfCheck"},{"$ref":"/request/system/keepWorkingAtOffline"},{"$ref":"/request/system/ping"}]}

/***/ }),

/***/ "./json_schema/request/system/keep_working_at_offline.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/keepWorkingAtOffline","type":"object","required":["keep_working_at_offline"],"properties":{"keep_working_at_offline":{"type":"boolean"}}}

/***/ }),

/***/ "./json_schema/request/system/ping.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/ping","response":"/response/system/pong","type":"object","required":["ping"],"properties":{"ping":{"type":"object","required":["key"],"properties":{"key":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/request/system/reboot.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/reboot","type":"object","required":["reboot"],"properties":{"reboot":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/system/reset.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/reset","type":"object","required":["reset"],"properties":{"reset":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/system/self_check.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/selfCheck","type":"object","required":["self_check"],"properties":{"self_check":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/system/wait.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/wait","type":"object","required":["wait"],"properties":{"wait":{"type":"integer"}}}

/***/ }),

/***/ "./json_schema/request/uart/deinit.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/uart/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart","basePath":"uart0","anyOf":[{"$ref":"/request/uart/init"},{"$ref":"/request/uart/send"},{"$ref":"/request/uart/deinit"}]}

/***/ }),

/***/ "./json_schema/request/uart/init.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart/init","type":"object","required":["rx","tx"],"uniqueKeys":["rx","tx","rts","cts"],"properties":{"rx":{"$ref":"/pinSetting"},"tx":{"$ref":"/pinSetting"},"baud":{"type":"integer","default":115200,"minimum":1,"maximum":5000000},"stop":{"type":"number","enum":[1,1.5,2],"default":1},"bits":{"type":"integer","enum":[5,6,7,8],"default":8},"parity":{"type":"string","enum":["off","odd","even"],"default":"off"},"flowcontrol":{"type":"string","enum":["off","rts","cts","rts-cts"],"default":"off"},"rts":{"$ref":"/pinSetting"},"cts":{"$ref":"/pinSetting"}}}

/***/ }),

/***/ "./json_schema/request/uart/send.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart/send","type":"object","required":["data"],"properties":{"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/request/ws/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ws","basePath":"ws","anyOf":[{"$ref":"/request/ws/reset_obniz_on_ws_disconnection"}]}

/***/ }),

/***/ "./json_schema/request/ws/reset_obniz_on_ws_disconnection.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ws/reset_obniz_on_ws_disconnection","type":"object","required":["reset_obniz_on_ws_disconnection"],"properties":{"reset_obniz_on_ws_disconnection":{"type":"boolean","default":false}}}

/***/ }),

/***/ "./json_schema/response/ad/get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ad/get","type":"number","minimum":0,"maximum":5}

/***/ }),

/***/ "./json_schema/response/ad/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ad","basePath":"ad0","anyOf":[{"$ref":"/response/ad/get"}]}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_get","type":"object","required":["get_characteristic_result"],"properties":{"get_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","properties"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"properties":{"type":"array","items":{"type":"string","enum":["broadcast","read","write_without_response","write","notify","indicate","auth","extended_properties"]}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_get_finish.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_get_finish","type":"object","required":["get_characteristic_result_finish"],"properties":{"get_characteristic_result_finish":{"type":"object","required":["address","service_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_notify.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_notify","type":"object","required":["nofity_characteristic"],"properties":{"nofity_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_read","type":"object","required":["read_characteristic_result"],"properties":{"read_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]},"data":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_register_notify.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_register_notify","related":"/request/ble/central/characteristic_register_notify","type":"object","required":["characteristic_register_notify_result"],"properties":{"characteristic_register_notify_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"boolean"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_unregister_notify.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_unregister_notify","related":"/request/ble/central/characteristic_unregister_notify","type":"object","required":["unregister_notify_characteristic_result"],"properties":{"unregister_notify_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"boolean"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_write","type":"object","required":["write_characteristic_result"],"properties":{"write_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_get","type":"object","required":["get_descriptor_result"],"properties":{"get_descriptor_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_get_finish.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_get_finish","type":"object","required":["get_descriptor_result_finish"],"properties":{"get_descriptor_result_finish":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_read","type":"object","required":["read_descriptor_result"],"properties":{"read_descriptor_results":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","result","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]},"data":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_write","type":"object","required":["write_descriptor_result"],"properties":{"write_descriptor_results":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/error.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/error","type":"object","required":["error"],"properties":{"error":{"type":"object","required":["error_code","message"],"additionalProperties":false,"properties":{"error_code":{"type":"integer"},"message":{"type":"string"},"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuidOrNull"},"characteristic_uuid":{"$ref":"/uuidOrNull"},"descriptor_uuid":{"$ref":"/uuidOrNull"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central","basePath":"ble","anyOf":[{"$ref":"/response/ble/central/scan"},{"$ref":"/response/ble/central/scan_finish"},{"$ref":"/response/ble/central/status_update"},{"$ref":"/response/ble/central/service_get"},{"$ref":"/response/ble/central/service_get_finish"},{"$ref":"/response/ble/central/characteristic_get"},{"$ref":"/response/ble/central/characteristic_get_finish"},{"$ref":"/response/ble/central/characteristic_write"},{"$ref":"/response/ble/central/characteristic_read"},{"$ref":"/response/ble/central/characteristic_register_notify"},{"$ref":"/response/ble/central/characteristic_notify"},{"$ref":"/response/ble/central/characteristic_notify"},{"$ref":"/response/ble/central/descriptor_get"},{"$ref":"/response/ble/central/descriptor_get_finish"},{"$ref":"/response/ble/central/descriptor_write"},{"$ref":"/response/ble/central/descriptor_read"},{"$ref":"/response/ble/central/error"}]}

/***/ }),

/***/ "./json_schema/response/ble/central/scan.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/scan","type":"object","required":["scan_result"],"properties":{"scan_result":{"type":"object","required":["address","ble_event_type","device_type","address_type","flag","rssi"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"ble_event_type":{"type":"string","enum":["connectable_advertisemnt","connectable_directed_advertisemnt","scannable_advertising","non_connectable_advertising","scan_response"]},"device_type":{"type":"string","enum":["ble","dumo","breder"]},"address_type":{"type":"string","enum":["public","random","rpa_public","rpa_random"]},"flag":{"type":"integer","minimum":0},"rssi":{"type":"integer","maximum":0},"adv_data":{"$ref":"/bleAdvertiseData"},"scan_resp":{"$ref":"/bleAdvertiseData"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/scan_finish.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/scan_finish","type":"object","required":["scan_result_finish"],"properties":{"scan_result_finish":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/response/ble/central/service_get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/service_get","type":"object","required":["get_service_result"],"properties":{"get_service_result":{"type":"object","required":["address","service_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/service_get_finish.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/service_get_finish","type":"object","required":["get_service_result_finish"],"properties":{"get_service_result_finish":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/status_update.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/status_update","type":"object","required":["status_update"],"properties":{"status_update":{"type":"object","required":["address","status"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"status":{"type":"string","enum":["connected","disconnected"]}}}}}

/***/ }),

/***/ "./json_schema/response/ble/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble","basePath":"ble","anyOf":[{"$ref":"/response/ble/central"},{"$ref":"/response/ble/peripheral"}]}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_notify_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_notify_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_read_characteristic"],"properties":{"notify_read_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_notify_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_notify_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_write_characteristic"],"properties":{"notify_write_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["read_characteristic_result"],"properties":{"read_characteristic_result":{"type":"object","required":["service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["write_characteristic_result"],"properties":{"write_characteristic_result":{"type":"object","required":["service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_notify_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_notify_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_read_descriptor"],"properties":{"notify_read_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_notify_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_notify_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_write_descriptor"],"properties":{"notify_write_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["read_descriptor_result"],"properties":{"read_descriptor_result":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_write.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["write_descriptor_result"],"properties":{"write_descriptor_result":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral","basePath":"ble","anyOf":[{"$ref":"/response/ble/peripheral/status"},{"$ref":"/response/ble/peripheral/characteristic_read"},{"$ref":"/response/ble/peripheral/characteristic_write"},{"$ref":"/response/ble/peripheral/characteristic_notify_read"},{"$ref":"/response/ble/peripheral/characteristic_notify_write"},{"$ref":"/response/ble/peripheral/descriptor_read"},{"$ref":"/response/ble/peripheral/descriptor_write"},{"$ref":"/response/ble/peripheral/descriptor_notify_read"},{"$ref":"/response/ble/peripheral/descriptor_notify_write"}]}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/status.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/status","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["connection_status"],"properties":{"connection_status":{"type":"object","required":["address","status"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"status":{"type":"string","enum":["connected","disconnected"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/debug/error.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug/error","desccription":"global error","type":"object","required":["error"],"properties":{"error":{"type":"object","additionalProperties":true,"properties":{"message":{"type":"string"}}}}}

/***/ }),

/***/ "./json_schema/response/debug/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug","basePath":"debug","anyOf":[{"$ref":"/response/debug/warning"},{"$ref":"/response/debug/error"}]}

/***/ }),

/***/ "./json_schema/response/debug/warning.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug/warning","desccription":"global warnings","type":"object","required":["warning"],"properties":{"warning":{"type":"object","additionalProperties":true,"properties":{"message":{"type":"string"}}}}}

/***/ }),

/***/ "./json_schema/response/i2c/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/i2c","basePath":"i2c0","anyOf":[{"$ref":"/response/i2c/master"},{"$ref":"/response/i2c/slave"}]}

/***/ }),

/***/ "./json_schema/response/i2c/master.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/i2c/master","type":"object","required":["mode","address","data"],"properties":{"mode":{"type":"string","enum":["master"]},"address":{"type":"integer","minimum":0,"maximum":1023},"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/i2c/slave.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/i2c/slave","type":"object","required":["mode","address","is_fragmented","data"],"properties":{"mode":{"type":"string","enum":["slave"]},"address":{"type":"integer","minimum":0,"maximum":1023},"is_fragmented":{"type":"boolean"},"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response","type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"patternProperties":{"^io[0-9]$":{"$ref":"/response/io"},"^io1[0-1]$":{"$ref":"/response/io"},"^ad[0-9]$":{"$ref":"/response/ad"},"^ad1[0-1]$":{"$ref":"/response/ad"},"^uart[0-1]$":{"$ref":"/response/uart"},"^spi[0-1]$":{"$ref":"/response/spi"},"^i2c0$":{"$ref":"/response/i2c"}},"properties":{"switch":{"$ref":"/response/switch"},"ble":{"$ref":"/response/ble"},"measure":{"$ref":"/response/measure"},"message":{"$ref":"/response/message"},"logic_analyzer":{"$ref":"/response/logicAnalyzer"},"system":{"$ref":"/response/system"},"debug":{"$ref":"/response/debug"},"ws":{"$ref":"/response/ws"}}}}

/***/ }),

/***/ "./json_schema/response/io/get.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/io/get","type":"boolean"}

/***/ }),

/***/ "./json_schema/response/io/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/io","basePath":"io0","anyOf":[{"$ref":"/response/io/get"}]}

/***/ }),

/***/ "./json_schema/response/logicanalyzer/data.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/logicAnalyzer/data","type":"object","required":["data"],"properties":{"data":{"$ref":"/bitArray"}}}

/***/ }),

/***/ "./json_schema/response/logicanalyzer/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/logicAnalyzer","basePath":"logic_analyzer","anyOf":[{"$ref":"/response/logicAnalyzer/data"}]}

/***/ }),

/***/ "./json_schema/response/measure/echo.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/measure/echo","type":"object","required":["echo"],"properties":{"echo":{"type":"array","minItesm":1,"items":{"type":"object","required":["edge","timing"],"properties":{"edge":{"type":"boolean"},"timing":{"type":"number"}}}}}}

/***/ }),

/***/ "./json_schema/response/measure/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/measure","basePath":"measure","anyOf":[{"$ref":"/response/measure/echo"}]}

/***/ }),

/***/ "./json_schema/response/message/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/message","basePath":"message","anyOf":[{"$ref":"/response/message/receive"}]}

/***/ }),

/***/ "./json_schema/response/message/receive.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/message/receive","related":"/request/message/send","type":"object","required":["data","from"],"properties":{"data":{},"from":{"type":["string","null"]}}}

/***/ }),

/***/ "./json_schema/response/spi/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/spi","basePath":"spi0","anyOf":[{"$ref":"/response/spi/read"}]}

/***/ }),

/***/ "./json_schema/response/spi/read.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/spi/read","type":"object","required":["data"],"properties":{"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/switch/change.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/switch/change","desccription":"value changes are always notified.","type":"object","required":["state"],"properties":{"state":{"type":"string","enum":["none","push","left","right"]},"action":{"type":"string","enum":["get"]}}}

/***/ }),

/***/ "./json_schema/response/switch/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/switch","basePath":"switch","anyOf":[{"$ref":"/response/switch/change"}]}

/***/ }),

/***/ "./json_schema/response/system/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/system","basePath":"system","anyOf":[{"$ref":"/response/system/pong"}]}

/***/ }),

/***/ "./json_schema/response/system/pong.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/system/pong","desccription":"pong response with same key of ping request","type":"object","required":["pong"],"properties":{"pong":{"type":"object","required":["key"],"properties":{"key":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/uart/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/uart","basePath":"uart0","anyOf":[{"$ref":"/response/uart/receive"}]}

/***/ }),

/***/ "./json_schema/response/uart/receive.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/uart/receive","type":"object","properties":{"data":{"$ref":"/dataArray"}}}

/***/ }),

/***/ "./json_schema/response/ws/index.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws","basePath":"ws","anyOf":[{"$ref":"/response/ws/ready"},{"$ref":"/response/ws/redirect"}]}

/***/ }),

/***/ "./json_schema/response/ws/ready.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws/ready","type":"object","required":["ready"],"properties":{"ready":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/response/ws/redirect.yml":
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws/redirect","type":"object","required":["redirect"],"properties":{"redirect":{"type":"string"}}}

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__("./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__("./node_modules/ieee754/index.js")
var isArray = __webpack_require__("./node_modules/buffer/node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/buffer/node_modules/isarray/index.js":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/eventemitter3/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/node-fetch/browser.js":
/***/ (function(module, exports) {

module.exports = exports = window.fetch;

// Needed for TypeScript and Webpack.
exports.default = window.fetch.bind(window);

exports.Headers = window.Headers;
exports.Request = window.Request;
exports.Response = window.Response;


/***/ }),

/***/ "./node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/safe-buffer/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__("./node_modules/buffer/index.js")
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ "./node_modules/semver/semver.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {exports = module.exports = SemVer;

// The debug function is excluded entirely from the minified version.
/* nomin */ var debug;
/* nomin */ if (typeof process === 'object' &&
    /* nomin */ process.env &&
    /* nomin */ process.env.NODE_DEBUG &&
    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
  /* nomin */ debug = function() {
    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
    /* nomin */ args.unshift('SEMVER');
    /* nomin */ console.log.apply(console, args);
    /* nomin */ };
/* nomin */ else
  /* nomin */ debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16;

// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++;
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';

var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++;
src[LONECARET] = '(?:\\^)';

var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';

var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.parse = parse;
function parse(version, loose) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  if (version.length > MAX_LENGTH)
    return null;

  var r = loose ? re[LOOSE] : re[FULL];
  if (!r.test(version))
    return null;

  try {
    return new SemVer(version, loose);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;
function valid(version, loose) {
  var v = parse(version, loose);
  return v ? v.version : null;
}


exports.clean = clean;
function clean(version, loose) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose)
      return version;
    else
      version = version.version;
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH)
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

  if (!(this instanceof SemVer))
    return new SemVer(version, loose);

  debug('SemVer', version, loose);
  this.loose = loose;
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
    throw new TypeError('Invalid major version')

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
    throw new TypeError('Invalid minor version')

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
    throw new TypeError('Invalid patch version')

  // numberify any prerelease numeric ids
  if (!m[4])
    this.prerelease = [];
  else
    this.prerelease = m[4].split('.').map(function(id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER)
          return num;
      }
      return id;
    });

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
};

SemVer.prototype.toString = function() {
  return this.version;
};

SemVer.prototype.compare = function(other) {
  debug('SemVer.compare', this.version, this.loose, other);
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.length && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0)
        this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
        this.major++;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0)
        this.minor++;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0)
        this.patch++;
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0)
        this.prerelease = [0];
      else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1]))
            this.prerelease = [identifier, 0];
        } else
          this.prerelease = [identifier, 0];
      }
      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  this.raw = this.version;
  return this;
};

exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof(loose) === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    if (v1.prerelease.length || v2.prerelease.length) {
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return 'pre'+key;
          }
        }
      }
      return 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return key;
        }
      }
    }
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose));
}

exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;
function sort(list, loose) {
  return list.sort(function(a, b) {
    return exports.compare(a, b, loose);
  });
}

exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function(a, b) {
    return exports.rcompare(a, b, loose);
  });
}

exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b, loose) {
  var ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a !== b;
      break;
    case '': case '=': case '==': ret = eq(a, b, loose); break;
    case '!=': ret = neq(a, b, loose); break;
    case '>': ret = gt(a, b, loose); break;
    case '>=': ret = gte(a, b, loose); break;
    case '<': ret = lt(a, b, loose); break;
    case '<=': ret = lte(a, b, loose); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(comp, loose) {
  if (comp instanceof Comparator) {
    if (comp.loose === loose)
      return comp;
    else
      comp = comp.value;
  }

  if (!(this instanceof Comparator))
    return new Comparator(comp, loose);

  debug('comparator', comp, loose);
  this.loose = loose;
  this.parse(comp);

  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;

  debug('comp', this);
}

var ANY = {};
Comparator.prototype.parse = function(comp) {
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m)
    throw new TypeError('Invalid comparator: ' + comp);

  this.operator = m[1];
  if (this.operator === '=')
    this.operator = '';

  // if it literally is just '>' or '' then allow anything.
  if (!m[2])
    this.semver = ANY;
  else
    this.semver = new SemVer(m[2], this.loose);
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  debug('Comparator.test', version, this.loose);

  if (this.semver === ANY)
    return true;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  return cmp(version, this.operator, this.semver, this.loose);
};

Comparator.prototype.intersects = function(comp, loose) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required');
  }

  var rangeTmp;

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, loose);
    return satisfies(this.value, rangeTmp, loose);
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, loose);
    return satisfies(comp.semver, rangeTmp, loose);
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>');
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<');
  var sameSemVer = this.semver.version === comp.semver.version;
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=');
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, loose) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'));
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, loose) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'));

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};


exports.Range = Range;
function Range(range, loose) {
  if (range instanceof Range) {
    if (range.loose === loose) {
      return range;
    } else {
      return new Range(range.raw, loose);
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, loose);
  }

  if (!(this instanceof Range))
    return new Range(range, loose);

  this.loose = loose;

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  var loose = this.loose;
  range = range.trim();
  debug('range', range, loose);
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, re[COMPARATORTRIM]);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp, loose);
  }).join(' ').split(/\s+/);
  if (this.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function(comp) {
    return new Comparator(comp, loose);
  });

  return set;
};

Range.prototype.intersects = function(range, loose) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required');
  }

  return this.set.some(function(thisComparators) {
    return thisComparators.every(function(thisComparator) {
      return range.set.some(function(rangeComparators) {
        return rangeComparators.every(function(rangeComparator) {
          return thisComparator.intersects(rangeComparator, loose);
        });
      });
    });
  });
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, loose) {
  return new Range(range, loose).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, loose) {
  debug('comp', comp);
  comp = replaceCarets(comp, loose);
  debug('caret', comp);
  comp = replaceTildes(comp, loose);
  debug('tildes', comp);
  comp = replaceXRanges(comp, loose);
  debug('xrange', comp);
  comp = replaceStars(comp, loose);
  debug('stars', comp);
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceTilde(comp, loose);
  }).join(' ');
}

function replaceTilde(comp, loose) {
  var r = loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p))
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    else if (pr) {
      debug('replaceTilde pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0';
    } else
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0';

    debug('tilde return', ret);
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceCaret(comp, loose);
  }).join(' ');
}

function replaceCaret(comp, loose) {
  debug('caret', comp, loose);
  var r = loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p)) {
      if (M === '0')
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      else
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
    } else if (pr) {
      debug('replaceCaret pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + (+M + 1) + '.0.0';
    } else {
      debug('no pr');
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0';
    }

    debug('caret return', ret);
    return ret;
  });
}

function replaceXRanges(comp, loose) {
  debug('replaceXRanges', comp, loose);
  return comp.split(/\s+/).map(function(comp) {
    return replaceXRange(comp, loose);
  }).join(' ');
}

function replaceXRange(comp, loose) {
  comp = comp.trim();
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm)
          M = +M + 1;
        else
          m = +m + 1;
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    debug('xRange return', ret);

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, loose) {
  debug('replaceStars', comp, loose);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0,
                       from, fM, fm, fp, fpr, fb,
                       to, tM, tm, tp, tpr, tb) {

  if (isX(fM))
    from = '';
  else if (isX(fm))
    from = '>=' + fM + '.0.0';
  else if (isX(fp))
    from = '>=' + fM + '.' + fm + '.0';
  else
    from = '>=' + from;

  if (isX(tM))
    to = '';
  else if (isX(tm))
    to = '<' + (+tM + 1) + '.0.0';
  else if (isX(tp))
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  else if (tpr)
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  else
    to = '<=' + to;

  return (from + ' ' + to).trim();
}


// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  if (!version)
    return false;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (var i = 0; i < set.length; i++) {
      debug(set[i].semver);
      if (set[i].semver === ANY)
        continue;

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch)
          return true;
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

exports.satisfies = satisfies;
function satisfies(version, range, loose) {
  try {
    range = new Range(range, loose);
  } catch (er) {
    return false;
  }
  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, loose) {
  var max = null;
  var maxSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!max || maxSV.compare(v) === -1) { // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, loose);
      }
    }
  })
  return max;
}

exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, loose) {
  var min = null;
  var minSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!min || minSV.compare(v) === 1) { // compare(min, v, true)
        min = v;
        minSV = new SemVer(min, loose);
      }
    }
  })
  return min;
}

exports.validRange = validRange;
function validRange(range, loose) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, loose).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, loose) {
  return outside(version, range, '<', loose);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, loose) {
  return outside(version, range, '>', loose);
}

exports.outside = outside;
function outside(version, range, hilo, loose) {
  version = new SemVer(version, loose);
  range = new Range(range, loose);

  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, loose)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];

    var high = null;
    var low = null;

    comparators.forEach(function(comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, loose)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, loose)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}

exports.prerelease = prerelease;
function prerelease(version, loose) {
  var parsed = parse(version, loose);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;
}

exports.intersects = intersects;
function intersects(r1, r2, loose) {
  r1 = new Range(r1, loose)
  r2 = new Range(r2, loose)
  return r1.intersects(r2)
}

exports.coerce = coerce;
function coerce(version) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  var match = version.match(re[COERCE]);

  if (match == null)
    return null;

  return parse((match[1] || '0') + '.' + (match[2] || '0') + '.' + (match[3] || '0')); 
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/string_decoder/lib/string_decoder.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__("./node_modules/safe-buffer/index.js").Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ "./node_modules/tv4/tv4.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
Author: Geraint Luff and others
Year: 2013

This code is released into the "public domain" by its author(s).  Anybody may use, alter and distribute the code without restriction.  The author makes no guarantees, and takes no liability of any kind for use of this code.

If you find a bug or make an improvement, it would be courteous to let the author know, but it is not compulsory.
*/
(function (global, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function () {

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FObject%2Fkeys
if (!Object.keys) {
	Object.keys = (function () {
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [];

			for (var prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (var i=0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	})();
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create) {
	Object.create = (function(){
		function F(){}

		return function(o){
			if (arguments.length !== 1) {
				throw new Error('Object.create implementation only accepts one parameter.');
			}
			F.prototype = o;
			return new F();
		};
	})();
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2FisArray
if(!Array.isArray) {
	Array.isArray = function (vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	};
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2FindexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		if (this === null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;

		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n !== n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n !== 0 && n !== Infinity && n !== -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}

// Grungey Object.isFrozen hack
if (!Object.isFrozen) {
	Object.isFrozen = function (obj) {
		var key = "tv4_test_frozen_key";
		while (obj.hasOwnProperty(key)) {
			key += Math.random();
		}
		try {
			obj[key] = true;
			delete obj[key];
			return false;
		} catch (e) {
			return true;
		}
	};
}
// Based on: https://github.com/geraintluff/uri-templates, but with all the de-substitution stuff removed

var uriTemplateGlobalModifiers = {
	"+": true,
	"#": true,
	".": true,
	"/": true,
	";": true,
	"?": true,
	"&": true
};
var uriTemplateSuffices = {
	"*": true
};

function notReallyPercentEncode(string) {
	return encodeURI(string).replace(/%25[0-9][0-9]/g, function (doubleEncoded) {
		return "%" + doubleEncoded.substring(3);
	});
}

function uriTemplateSubstitution(spec) {
	var modifier = "";
	if (uriTemplateGlobalModifiers[spec.charAt(0)]) {
		modifier = spec.charAt(0);
		spec = spec.substring(1);
	}
	var separator = "";
	var prefix = "";
	var shouldEscape = true;
	var showVariables = false;
	var trimEmptyString = false;
	if (modifier === '+') {
		shouldEscape = false;
	} else if (modifier === ".") {
		prefix = ".";
		separator = ".";
	} else if (modifier === "/") {
		prefix = "/";
		separator = "/";
	} else if (modifier === '#') {
		prefix = "#";
		shouldEscape = false;
	} else if (modifier === ';') {
		prefix = ";";
		separator = ";";
		showVariables = true;
		trimEmptyString = true;
	} else if (modifier === '?') {
		prefix = "?";
		separator = "&";
		showVariables = true;
	} else if (modifier === '&') {
		prefix = "&";
		separator = "&";
		showVariables = true;
	}

	var varNames = [];
	var varList = spec.split(",");
	var varSpecs = [];
	var varSpecMap = {};
	for (var i = 0; i < varList.length; i++) {
		var varName = varList[i];
		var truncate = null;
		if (varName.indexOf(":") !== -1) {
			var parts = varName.split(":");
			varName = parts[0];
			truncate = parseInt(parts[1], 10);
		}
		var suffices = {};
		while (uriTemplateSuffices[varName.charAt(varName.length - 1)]) {
			suffices[varName.charAt(varName.length - 1)] = true;
			varName = varName.substring(0, varName.length - 1);
		}
		var varSpec = {
			truncate: truncate,
			name: varName,
			suffices: suffices
		};
		varSpecs.push(varSpec);
		varSpecMap[varName] = varSpec;
		varNames.push(varName);
	}
	var subFunction = function (valueFunction) {
		var result = "";
		var startIndex = 0;
		for (var i = 0; i < varSpecs.length; i++) {
			var varSpec = varSpecs[i];
			var value = valueFunction(varSpec.name);
			if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0)) {
				startIndex++;
				continue;
			}
			if (i === startIndex) {
				result += prefix;
			} else {
				result += (separator || ",");
			}
			if (Array.isArray(value)) {
				if (showVariables) {
					result += varSpec.name + "=";
				}
				for (var j = 0; j < value.length; j++) {
					if (j > 0) {
						result += varSpec.suffices['*'] ? (separator || ",") : ",";
						if (varSpec.suffices['*'] && showVariables) {
							result += varSpec.name + "=";
						}
					}
					result += shouldEscape ? encodeURIComponent(value[j]).replace(/!/g, "%21") : notReallyPercentEncode(value[j]);
				}
			} else if (typeof value === "object") {
				if (showVariables && !varSpec.suffices['*']) {
					result += varSpec.name + "=";
				}
				var first = true;
				for (var key in value) {
					if (!first) {
						result += varSpec.suffices['*'] ? (separator || ",") : ",";
					}
					first = false;
					result += shouldEscape ? encodeURIComponent(key).replace(/!/g, "%21") : notReallyPercentEncode(key);
					result += varSpec.suffices['*'] ? '=' : ",";
					result += shouldEscape ? encodeURIComponent(value[key]).replace(/!/g, "%21") : notReallyPercentEncode(value[key]);
				}
			} else {
				if (showVariables) {
					result += varSpec.name;
					if (!trimEmptyString || value !== "") {
						result += "=";
					}
				}
				if (varSpec.truncate != null) {
					value = value.substring(0, varSpec.truncate);
				}
				result += shouldEscape ? encodeURIComponent(value).replace(/!/g, "%21"): notReallyPercentEncode(value);
			}
		}
		return result;
	};
	subFunction.varNames = varNames;
	return {
		prefix: prefix,
		substitution: subFunction
	};
}

function UriTemplate(template) {
	if (!(this instanceof UriTemplate)) {
		return new UriTemplate(template);
	}
	var parts = template.split("{");
	var textParts = [parts.shift()];
	var prefixes = [];
	var substitutions = [];
	var varNames = [];
	while (parts.length > 0) {
		var part = parts.shift();
		var spec = part.split("}")[0];
		var remainder = part.substring(spec.length + 1);
		var funcs = uriTemplateSubstitution(spec);
		substitutions.push(funcs.substitution);
		prefixes.push(funcs.prefix);
		textParts.push(remainder);
		varNames = varNames.concat(funcs.substitution.varNames);
	}
	this.fill = function (valueFunction) {
		var result = textParts[0];
		for (var i = 0; i < substitutions.length; i++) {
			var substitution = substitutions[i];
			result += substitution(valueFunction);
			result += textParts[i + 1];
		}
		return result;
	};
	this.varNames = varNames;
	this.template = template;
}
UriTemplate.prototype = {
	toString: function () {
		return this.template;
	},
	fillFromObject: function (obj) {
		return this.fill(function (varName) {
			return obj[varName];
		});
	}
};
var ValidatorContext = function ValidatorContext(parent, collectMultiple, errorReporter, checkRecursive, trackUnknownProperties) {
	this.missing = [];
	this.missingMap = {};
	this.formatValidators = parent ? Object.create(parent.formatValidators) : {};
	this.schemas = parent ? Object.create(parent.schemas) : {};
	this.collectMultiple = collectMultiple;
	this.errors = [];
	this.handleError = collectMultiple ? this.collectError : this.returnError;
	if (checkRecursive) {
		this.checkRecursive = true;
		this.scanned = [];
		this.scannedFrozen = [];
		this.scannedFrozenSchemas = [];
		this.scannedFrozenValidationErrors = [];
		this.validatedSchemasKey = 'tv4_validation_id';
		this.validationErrorsKey = 'tv4_validation_errors_id';
	}
	if (trackUnknownProperties) {
		this.trackUnknownProperties = true;
		this.knownPropertyPaths = {};
		this.unknownPropertyPaths = {};
	}
	this.errorReporter = errorReporter || defaultErrorReporter('en');
	if (typeof this.errorReporter === 'string') {
		throw new Error('debug');
	}
	this.definedKeywords = {};
	if (parent) {
		for (var key in parent.definedKeywords) {
			this.definedKeywords[key] = parent.definedKeywords[key].slice(0);
		}
	}
};
ValidatorContext.prototype.defineKeyword = function (keyword, keywordFunction) {
	this.definedKeywords[keyword] = this.definedKeywords[keyword] || [];
	this.definedKeywords[keyword].push(keywordFunction);
};
ValidatorContext.prototype.createError = function (code, messageParams, dataPath, schemaPath, subErrors, data, schema) {
	var error = new ValidationError(code, messageParams, dataPath, schemaPath, subErrors);
	error.message = this.errorReporter(error, data, schema);
	return error;
};
ValidatorContext.prototype.returnError = function (error) {
	return error;
};
ValidatorContext.prototype.collectError = function (error) {
	if (error) {
		this.errors.push(error);
	}
	return null;
};
ValidatorContext.prototype.prefixErrors = function (startIndex, dataPath, schemaPath) {
	for (var i = startIndex; i < this.errors.length; i++) {
		this.errors[i] = this.errors[i].prefixWith(dataPath, schemaPath);
	}
	return this;
};
ValidatorContext.prototype.banUnknownProperties = function (data, schema) {
	for (var unknownPath in this.unknownPropertyPaths) {
		var error = this.createError(ErrorCodes.UNKNOWN_PROPERTY, {path: unknownPath}, unknownPath, "", null, data, schema);
		var result = this.handleError(error);
		if (result) {
			return result;
		}
	}
	return null;
};

ValidatorContext.prototype.addFormat = function (format, validator) {
	if (typeof format === 'object') {
		for (var key in format) {
			this.addFormat(key, format[key]);
		}
		return this;
	}
	this.formatValidators[format] = validator;
};
ValidatorContext.prototype.resolveRefs = function (schema, urlHistory) {
	if (schema['$ref'] !== undefined) {
		urlHistory = urlHistory || {};
		if (urlHistory[schema['$ref']]) {
			return this.createError(ErrorCodes.CIRCULAR_REFERENCE, {urls: Object.keys(urlHistory).join(', ')}, '', '', null, undefined, schema);
		}
		urlHistory[schema['$ref']] = true;
		schema = this.getSchema(schema['$ref'], urlHistory);
	}
	return schema;
};
ValidatorContext.prototype.getSchema = function (url, urlHistory) {
	var schema;
	if (this.schemas[url] !== undefined) {
		schema = this.schemas[url];
		return this.resolveRefs(schema, urlHistory);
	}
	var baseUrl = url;
	var fragment = "";
	if (url.indexOf('#') !== -1) {
		fragment = url.substring(url.indexOf("#") + 1);
		baseUrl = url.substring(0, url.indexOf("#"));
	}
	if (typeof this.schemas[baseUrl] === 'object') {
		schema = this.schemas[baseUrl];
		var pointerPath = decodeURIComponent(fragment);
		if (pointerPath === "") {
			return this.resolveRefs(schema, urlHistory);
		} else if (pointerPath.charAt(0) !== "/") {
			return undefined;
		}
		var parts = pointerPath.split("/").slice(1);
		for (var i = 0; i < parts.length; i++) {
			var component = parts[i].replace(/~1/g, "/").replace(/~0/g, "~");
			if (schema[component] === undefined) {
				schema = undefined;
				break;
			}
			schema = schema[component];
		}
		if (schema !== undefined) {
			return this.resolveRefs(schema, urlHistory);
		}
	}
	if (this.missing[baseUrl] === undefined) {
		this.missing.push(baseUrl);
		this.missing[baseUrl] = baseUrl;
		this.missingMap[baseUrl] = baseUrl;
	}
};
ValidatorContext.prototype.searchSchemas = function (schema, url) {
	if (Array.isArray(schema)) {
		for (var i = 0; i < schema.length; i++) {
			this.searchSchemas(schema[i], url);
		}
	} else if (schema && typeof schema === "object") {
		if (typeof schema.id === "string") {
			if (isTrustedUrl(url, schema.id)) {
				if (this.schemas[schema.id] === undefined) {
					this.schemas[schema.id] = schema;
				}
			}
		}
		for (var key in schema) {
			if (key !== "enum") {
				if (typeof schema[key] === "object") {
					this.searchSchemas(schema[key], url);
				} else if (key === "$ref") {
					var uri = getDocumentUri(schema[key]);
					if (uri && this.schemas[uri] === undefined && this.missingMap[uri] === undefined) {
						this.missingMap[uri] = uri;
					}
				}
			}
		}
	}
};
ValidatorContext.prototype.addSchema = function (url, schema) {
	//overload
	if (typeof url !== 'string' || typeof schema === 'undefined') {
		if (typeof url === 'object' && typeof url.id === 'string') {
			schema = url;
			url = schema.id;
		}
		else {
			return;
		}
	}
	if (url === getDocumentUri(url) + "#") {
		// Remove empty fragment
		url = getDocumentUri(url);
	}
	this.schemas[url] = schema;
	delete this.missingMap[url];
	normSchema(schema, url);
	this.searchSchemas(schema, url);
};

ValidatorContext.prototype.getSchemaMap = function () {
	var map = {};
	for (var key in this.schemas) {
		map[key] = this.schemas[key];
	}
	return map;
};

ValidatorContext.prototype.getSchemaUris = function (filterRegExp) {
	var list = [];
	for (var key in this.schemas) {
		if (!filterRegExp || filterRegExp.test(key)) {
			list.push(key);
		}
	}
	return list;
};

ValidatorContext.prototype.getMissingUris = function (filterRegExp) {
	var list = [];
	for (var key in this.missingMap) {
		if (!filterRegExp || filterRegExp.test(key)) {
			list.push(key);
		}
	}
	return list;
};

ValidatorContext.prototype.dropSchemas = function () {
	this.schemas = {};
	this.reset();
};
ValidatorContext.prototype.reset = function () {
	this.missing = [];
	this.missingMap = {};
	this.errors = [];
};

ValidatorContext.prototype.validateAll = function (data, schema, dataPathParts, schemaPathParts, dataPointerPath) {
	var topLevel;
	schema = this.resolveRefs(schema);
	if (!schema) {
		return null;
	} else if (schema instanceof ValidationError) {
		this.errors.push(schema);
		return schema;
	}

	var startErrorCount = this.errors.length;
	var frozenIndex, scannedFrozenSchemaIndex = null, scannedSchemasIndex = null;
	if (this.checkRecursive && data && typeof data === 'object') {
		topLevel = !this.scanned.length;
		if (data[this.validatedSchemasKey]) {
			var schemaIndex = data[this.validatedSchemasKey].indexOf(schema);
			if (schemaIndex !== -1) {
				this.errors = this.errors.concat(data[this.validationErrorsKey][schemaIndex]);
				return null;
			}
		}
		if (Object.isFrozen(data)) {
			frozenIndex = this.scannedFrozen.indexOf(data);
			if (frozenIndex !== -1) {
				var frozenSchemaIndex = this.scannedFrozenSchemas[frozenIndex].indexOf(schema);
				if (frozenSchemaIndex !== -1) {
					this.errors = this.errors.concat(this.scannedFrozenValidationErrors[frozenIndex][frozenSchemaIndex]);
					return null;
				}
			}
		}
		this.scanned.push(data);
		if (Object.isFrozen(data)) {
			if (frozenIndex === -1) {
				frozenIndex = this.scannedFrozen.length;
				this.scannedFrozen.push(data);
				this.scannedFrozenSchemas.push([]);
			}
			scannedFrozenSchemaIndex = this.scannedFrozenSchemas[frozenIndex].length;
			this.scannedFrozenSchemas[frozenIndex][scannedFrozenSchemaIndex] = schema;
			this.scannedFrozenValidationErrors[frozenIndex][scannedFrozenSchemaIndex] = [];
		} else {
			if (!data[this.validatedSchemasKey]) {
				try {
					Object.defineProperty(data, this.validatedSchemasKey, {
						value: [],
						configurable: true
					});
					Object.defineProperty(data, this.validationErrorsKey, {
						value: [],
						configurable: true
					});
				} catch (e) {
					//IE 7/8 workaround
					data[this.validatedSchemasKey] = [];
					data[this.validationErrorsKey] = [];
				}
			}
			scannedSchemasIndex = data[this.validatedSchemasKey].length;
			data[this.validatedSchemasKey][scannedSchemasIndex] = schema;
			data[this.validationErrorsKey][scannedSchemasIndex] = [];
		}
	}

	var errorCount = this.errors.length;
	var error = this.validateBasic(data, schema, dataPointerPath)
		|| this.validateNumeric(data, schema, dataPointerPath)
		|| this.validateString(data, schema, dataPointerPath)
		|| this.validateArray(data, schema, dataPointerPath)
		|| this.validateObject(data, schema, dataPointerPath)
		|| this.validateCombinations(data, schema, dataPointerPath)
		|| this.validateHypermedia(data, schema, dataPointerPath)
		|| this.validateFormat(data, schema, dataPointerPath)
		|| this.validateDefinedKeywords(data, schema, dataPointerPath)
		|| null;

	if (topLevel) {
		while (this.scanned.length) {
			var item = this.scanned.pop();
			delete item[this.validatedSchemasKey];
		}
		this.scannedFrozen = [];
		this.scannedFrozenSchemas = [];
	}

	if (error || errorCount !== this.errors.length) {
		while ((dataPathParts && dataPathParts.length) || (schemaPathParts && schemaPathParts.length)) {
			var dataPart = (dataPathParts && dataPathParts.length) ? "" + dataPathParts.pop() : null;
			var schemaPart = (schemaPathParts && schemaPathParts.length) ? "" + schemaPathParts.pop() : null;
			if (error) {
				error = error.prefixWith(dataPart, schemaPart);
			}
			this.prefixErrors(errorCount, dataPart, schemaPart);
		}
	}

	if (scannedFrozenSchemaIndex !== null) {
		this.scannedFrozenValidationErrors[frozenIndex][scannedFrozenSchemaIndex] = this.errors.slice(startErrorCount);
	} else if (scannedSchemasIndex !== null) {
		data[this.validationErrorsKey][scannedSchemasIndex] = this.errors.slice(startErrorCount);
	}

	return this.handleError(error);
};
ValidatorContext.prototype.validateFormat = function (data, schema) {
	if (typeof schema.format !== 'string' || !this.formatValidators[schema.format]) {
		return null;
	}
	var errorMessage = this.formatValidators[schema.format].call(null, data, schema);
	if (typeof errorMessage === 'string' || typeof errorMessage === 'number') {
		return this.createError(ErrorCodes.FORMAT_CUSTOM, {message: errorMessage}, '', '/format', null, data, schema);
	} else if (errorMessage && typeof errorMessage === 'object') {
		return this.createError(ErrorCodes.FORMAT_CUSTOM, {message: errorMessage.message || "?"}, errorMessage.dataPath || '', errorMessage.schemaPath || "/format", null, data, schema);
	}
	return null;
};
ValidatorContext.prototype.validateDefinedKeywords = function (data, schema, dataPointerPath) {
	for (var key in this.definedKeywords) {
		if (typeof schema[key] === 'undefined') {
			continue;
		}
		var validationFunctions = this.definedKeywords[key];
		for (var i = 0; i < validationFunctions.length; i++) {
			var func = validationFunctions[i];
			var result = func(data, schema[key], schema, dataPointerPath);
			if (typeof result === 'string' || typeof result === 'number') {
				return this.createError(ErrorCodes.KEYWORD_CUSTOM, {key: key, message: result}, '', '', null, data, schema).prefixWith(null, key);
			} else if (result && typeof result === 'object') {
				var code = result.code;
				if (typeof code === 'string') {
					if (!ErrorCodes[code]) {
						throw new Error('Undefined error code (use defineError): ' + code);
					}
					code = ErrorCodes[code];
				} else if (typeof code !== 'number') {
					code = ErrorCodes.KEYWORD_CUSTOM;
				}
				var messageParams = (typeof result.message === 'object') ? result.message : {key: key, message: result.message || "?"};
				var schemaPath = result.schemaPath || ("/" + key.replace(/~/g, '~0').replace(/\//g, '~1'));
				return this.createError(code, messageParams, result.dataPath || null, schemaPath, null, data, schema);
			}
		}
	}
	return null;
};

function recursiveCompare(A, B) {
	if (A === B) {
		return true;
	}
	if (A && B && typeof A === "object" && typeof B === "object") {
		if (Array.isArray(A) !== Array.isArray(B)) {
			return false;
		} else if (Array.isArray(A)) {
			if (A.length !== B.length) {
				return false;
			}
			for (var i = 0; i < A.length; i++) {
				if (!recursiveCompare(A[i], B[i])) {
					return false;
				}
			}
		} else {
			var key;
			for (key in A) {
				if (B[key] === undefined && A[key] !== undefined) {
					return false;
				}
			}
			for (key in B) {
				if (A[key] === undefined && B[key] !== undefined) {
					return false;
				}
			}
			for (key in A) {
				if (!recursiveCompare(A[key], B[key])) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}

ValidatorContext.prototype.validateBasic = function validateBasic(data, schema, dataPointerPath) {
	var error;
	if (error = this.validateType(data, schema, dataPointerPath)) {
		return error.prefixWith(null, "type");
	}
	if (error = this.validateEnum(data, schema, dataPointerPath)) {
		return error.prefixWith(null, "type");
	}
	return null;
};

ValidatorContext.prototype.validateType = function validateType(data, schema) {
	if (schema.type === undefined) {
		return null;
	}
	var dataType = typeof data;
	if (data === null) {
		dataType = "null";
	} else if (Array.isArray(data)) {
		dataType = "array";
	}
	var allowedTypes = schema.type;
	if (!Array.isArray(allowedTypes)) {
		allowedTypes = [allowedTypes];
	}

	for (var i = 0; i < allowedTypes.length; i++) {
		var type = allowedTypes[i];
		if (type === dataType || (type === "integer" && dataType === "number" && (data % 1 === 0))) {
			return null;
		}
	}
	return this.createError(ErrorCodes.INVALID_TYPE, {type: dataType, expected: allowedTypes.join("/")}, '', '', null, data, schema);
};

ValidatorContext.prototype.validateEnum = function validateEnum(data, schema) {
	if (schema["enum"] === undefined) {
		return null;
	}
	for (var i = 0; i < schema["enum"].length; i++) {
		var enumVal = schema["enum"][i];
		if (recursiveCompare(data, enumVal)) {
			return null;
		}
	}
	return this.createError(ErrorCodes.ENUM_MISMATCH, {value: (typeof JSON !== 'undefined') ? JSON.stringify(data) : data}, '', '', null, data, schema);
};

ValidatorContext.prototype.validateNumeric = function validateNumeric(data, schema, dataPointerPath) {
	return this.validateMultipleOf(data, schema, dataPointerPath)
		|| this.validateMinMax(data, schema, dataPointerPath)
		|| this.validateNaN(data, schema, dataPointerPath)
		|| null;
};

var CLOSE_ENOUGH_LOW = Math.pow(2, -51);
var CLOSE_ENOUGH_HIGH = 1 - CLOSE_ENOUGH_LOW;
ValidatorContext.prototype.validateMultipleOf = function validateMultipleOf(data, schema) {
	var multipleOf = schema.multipleOf || schema.divisibleBy;
	if (multipleOf === undefined) {
		return null;
	}
	if (typeof data === "number") {
		var remainder = (data/multipleOf)%1;
		if (remainder >= CLOSE_ENOUGH_LOW && remainder < CLOSE_ENOUGH_HIGH) {
			return this.createError(ErrorCodes.NUMBER_MULTIPLE_OF, {value: data, multipleOf: multipleOf}, '', '', null, data, schema);
		}
	}
	return null;
};

ValidatorContext.prototype.validateMinMax = function validateMinMax(data, schema) {
	if (typeof data !== "number") {
		return null;
	}
	if (schema.minimum !== undefined) {
		if (data < schema.minimum) {
			return this.createError(ErrorCodes.NUMBER_MINIMUM, {value: data, minimum: schema.minimum}, '', '/minimum', null, data, schema);
		}
		if (schema.exclusiveMinimum && data === schema.minimum) {
			return this.createError(ErrorCodes.NUMBER_MINIMUM_EXCLUSIVE, {value: data, minimum: schema.minimum}, '', '/exclusiveMinimum', null, data, schema);
		}
	}
	if (schema.maximum !== undefined) {
		if (data > schema.maximum) {
			return this.createError(ErrorCodes.NUMBER_MAXIMUM, {value: data, maximum: schema.maximum}, '', '/maximum', null, data, schema);
		}
		if (schema.exclusiveMaximum && data === schema.maximum) {
			return this.createError(ErrorCodes.NUMBER_MAXIMUM_EXCLUSIVE, {value: data, maximum: schema.maximum}, '', '/exclusiveMaximum', null, data, schema);
		}
	}
	return null;
};

ValidatorContext.prototype.validateNaN = function validateNaN(data, schema) {
	if (typeof data !== "number") {
		return null;
	}
	if (isNaN(data) === true || data === Infinity || data === -Infinity) {
		return this.createError(ErrorCodes.NUMBER_NOT_A_NUMBER, {value: data}, '', '/type', null, data, schema);
	}
	return null;
};

ValidatorContext.prototype.validateString = function validateString(data, schema, dataPointerPath) {
	return this.validateStringLength(data, schema, dataPointerPath)
		|| this.validateStringPattern(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateStringLength = function validateStringLength(data, schema) {
	if (typeof data !== "string") {
		return null;
	}
	if (schema.minLength !== undefined) {
		if (data.length < schema.minLength) {
			return this.createError(ErrorCodes.STRING_LENGTH_SHORT, {length: data.length, minimum: schema.minLength}, '', '/minLength', null, data, schema);
		}
	}
	if (schema.maxLength !== undefined) {
		if (data.length > schema.maxLength) {
			return this.createError(ErrorCodes.STRING_LENGTH_LONG, {length: data.length, maximum: schema.maxLength}, '', '/maxLength', null, data, schema);
		}
	}
	return null;
};

ValidatorContext.prototype.validateStringPattern = function validateStringPattern(data, schema) {
	if (typeof data !== "string" || (typeof schema.pattern !== "string" && !(schema.pattern instanceof RegExp))) {
		return null;
	}
	var regexp;
	if (schema.pattern instanceof RegExp) {
	  regexp = schema.pattern;
	}
	else {
	  var body, flags = '';
	  // Check for regular expression literals
	  // @see http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.5
	  var literal = schema.pattern.match(/^\/(.+)\/([img]*)$/);
	  if (literal) {
	    body = literal[1];
	    flags = literal[2];
	  }
	  else {
	    body = schema.pattern;
	  }
	  regexp = new RegExp(body, flags);
	}
	if (!regexp.test(data)) {
		return this.createError(ErrorCodes.STRING_PATTERN, {pattern: schema.pattern}, '', '/pattern', null, data, schema);
	}
	return null;
};

ValidatorContext.prototype.validateArray = function validateArray(data, schema, dataPointerPath) {
	if (!Array.isArray(data)) {
		return null;
	}
	return this.validateArrayLength(data, schema, dataPointerPath)
		|| this.validateArrayUniqueItems(data, schema, dataPointerPath)
		|| this.validateArrayItems(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateArrayLength = function validateArrayLength(data, schema) {
	var error;
	if (schema.minItems !== undefined) {
		if (data.length < schema.minItems) {
			error = this.createError(ErrorCodes.ARRAY_LENGTH_SHORT, {length: data.length, minimum: schema.minItems}, '', '/minItems', null, data, schema);
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	if (schema.maxItems !== undefined) {
		if (data.length > schema.maxItems) {
			error = this.createError(ErrorCodes.ARRAY_LENGTH_LONG, {length: data.length, maximum: schema.maxItems}, '', '/maxItems', null, data, schema);
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateArrayUniqueItems = function validateArrayUniqueItems(data, schema) {
	if (schema.uniqueItems) {
		for (var i = 0; i < data.length; i++) {
			for (var j = i + 1; j < data.length; j++) {
				if (recursiveCompare(data[i], data[j])) {
					var error = this.createError(ErrorCodes.ARRAY_UNIQUE, {match1: i, match2: j}, '', '/uniqueItems', null, data, schema);
					if (this.handleError(error)) {
						return error;
					}
				}
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateArrayItems = function validateArrayItems(data, schema, dataPointerPath) {
	if (schema.items === undefined) {
		return null;
	}
	var error, i;
	if (Array.isArray(schema.items)) {
		for (i = 0; i < data.length; i++) {
			if (i < schema.items.length) {
				if (error = this.validateAll(data[i], schema.items[i], [i], ["items", i], dataPointerPath + "/" + i)) {
					return error;
				}
			} else if (schema.additionalItems !== undefined) {
				if (typeof schema.additionalItems === "boolean") {
					if (!schema.additionalItems) {
						error = (this.createError(ErrorCodes.ARRAY_ADDITIONAL_ITEMS, {}, '/' + i, '/additionalItems', null, data, schema));
						if (this.handleError(error)) {
							return error;
						}
					}
				} else if (error = this.validateAll(data[i], schema.additionalItems, [i], ["additionalItems"], dataPointerPath + "/" + i)) {
					return error;
				}
			}
		}
	} else {
		for (i = 0; i < data.length; i++) {
			if (error = this.validateAll(data[i], schema.items, [i], ["items"], dataPointerPath + "/" + i)) {
				return error;
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateObject = function validateObject(data, schema, dataPointerPath) {
	if (typeof data !== "object" || data === null || Array.isArray(data)) {
		return null;
	}
	return this.validateObjectMinMaxProperties(data, schema, dataPointerPath)
		|| this.validateObjectRequiredProperties(data, schema, dataPointerPath)
		|| this.validateObjectProperties(data, schema, dataPointerPath)
		|| this.validateObjectDependencies(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateObjectMinMaxProperties = function validateObjectMinMaxProperties(data, schema) {
	var keys = Object.keys(data);
	var error;
	if (schema.minProperties !== undefined) {
		if (keys.length < schema.minProperties) {
			error = this.createError(ErrorCodes.OBJECT_PROPERTIES_MINIMUM, {propertyCount: keys.length, minimum: schema.minProperties}, '', '/minProperties', null, data, schema);
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	if (schema.maxProperties !== undefined) {
		if (keys.length > schema.maxProperties) {
			error = this.createError(ErrorCodes.OBJECT_PROPERTIES_MAXIMUM, {propertyCount: keys.length, maximum: schema.maxProperties}, '', '/maxProperties', null, data, schema);
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateObjectRequiredProperties = function validateObjectRequiredProperties(data, schema) {
	if (schema.required !== undefined) {
		for (var i = 0; i < schema.required.length; i++) {
			var key = schema.required[i];
			if (data[key] === undefined) {
				var error = this.createError(ErrorCodes.OBJECT_REQUIRED, {key: key}, '', '/required/' + i, null, data, schema);
				if (this.handleError(error)) {
					return error;
				}
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateObjectProperties = function validateObjectProperties(data, schema, dataPointerPath) {
	var error;
	for (var key in data) {
		var keyPointerPath = dataPointerPath + "/" + key.replace(/~/g, '~0').replace(/\//g, '~1');
		var foundMatch = false;
		if (schema.properties !== undefined && schema.properties[key] !== undefined) {
			foundMatch = true;
			if (error = this.validateAll(data[key], schema.properties[key], [key], ["properties", key], keyPointerPath)) {
				return error;
			}
		}
		if (schema.patternProperties !== undefined) {
			for (var patternKey in schema.patternProperties) {
				var regexp = new RegExp(patternKey);
				if (regexp.test(key)) {
					foundMatch = true;
					if (error = this.validateAll(data[key], schema.patternProperties[patternKey], [key], ["patternProperties", patternKey], keyPointerPath)) {
						return error;
					}
				}
			}
		}
		if (!foundMatch) {
			if (schema.additionalProperties !== undefined) {
				if (this.trackUnknownProperties) {
					this.knownPropertyPaths[keyPointerPath] = true;
					delete this.unknownPropertyPaths[keyPointerPath];
				}
				if (typeof schema.additionalProperties === "boolean") {
					if (!schema.additionalProperties) {
						error = this.createError(ErrorCodes.OBJECT_ADDITIONAL_PROPERTIES, {key: key}, '', '/additionalProperties', null, data, schema).prefixWith(key, null);
						if (this.handleError(error)) {
							return error;
						}
					}
				} else {
					if (error = this.validateAll(data[key], schema.additionalProperties, [key], ["additionalProperties"], keyPointerPath)) {
						return error;
					}
				}
			} else if (this.trackUnknownProperties && !this.knownPropertyPaths[keyPointerPath]) {
				this.unknownPropertyPaths[keyPointerPath] = true;
			}
		} else if (this.trackUnknownProperties) {
			this.knownPropertyPaths[keyPointerPath] = true;
			delete this.unknownPropertyPaths[keyPointerPath];
		}
	}
	return null;
};

ValidatorContext.prototype.validateObjectDependencies = function validateObjectDependencies(data, schema, dataPointerPath) {
	var error;
	if (schema.dependencies !== undefined) {
		for (var depKey in schema.dependencies) {
			if (data[depKey] !== undefined) {
				var dep = schema.dependencies[depKey];
				if (typeof dep === "string") {
					if (data[dep] === undefined) {
						error = this.createError(ErrorCodes.OBJECT_DEPENDENCY_KEY, {key: depKey, missing: dep}, '', '', null, data, schema).prefixWith(null, depKey).prefixWith(null, "dependencies");
						if (this.handleError(error)) {
							return error;
						}
					}
				} else if (Array.isArray(dep)) {
					for (var i = 0; i < dep.length; i++) {
						var requiredKey = dep[i];
						if (data[requiredKey] === undefined) {
							error = this.createError(ErrorCodes.OBJECT_DEPENDENCY_KEY, {key: depKey, missing: requiredKey}, '', '/' + i, null, data, schema).prefixWith(null, depKey).prefixWith(null, "dependencies");
							if (this.handleError(error)) {
								return error;
							}
						}
					}
				} else {
					if (error = this.validateAll(data, dep, [], ["dependencies", depKey], dataPointerPath)) {
						return error;
					}
				}
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateCombinations = function validateCombinations(data, schema, dataPointerPath) {
	return this.validateAllOf(data, schema, dataPointerPath)
		|| this.validateAnyOf(data, schema, dataPointerPath)
		|| this.validateOneOf(data, schema, dataPointerPath)
		|| this.validateNot(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateAllOf = function validateAllOf(data, schema, dataPointerPath) {
	if (schema.allOf === undefined) {
		return null;
	}
	var error;
	for (var i = 0; i < schema.allOf.length; i++) {
		var subSchema = schema.allOf[i];
		if (error = this.validateAll(data, subSchema, [], ["allOf", i], dataPointerPath)) {
			return error;
		}
	}
	return null;
};

ValidatorContext.prototype.validateAnyOf = function validateAnyOf(data, schema, dataPointerPath) {
	if (schema.anyOf === undefined) {
		return null;
	}
	var errors = [];
	var startErrorCount = this.errors.length;
	var oldUnknownPropertyPaths, oldKnownPropertyPaths;
	if (this.trackUnknownProperties) {
		oldUnknownPropertyPaths = this.unknownPropertyPaths;
		oldKnownPropertyPaths = this.knownPropertyPaths;
	}
	var errorAtEnd = true;
	for (var i = 0; i < schema.anyOf.length; i++) {
		if (this.trackUnknownProperties) {
			this.unknownPropertyPaths = {};
			this.knownPropertyPaths = {};
		}
		var subSchema = schema.anyOf[i];

		var errorCount = this.errors.length;
		var error = this.validateAll(data, subSchema, [], ["anyOf", i], dataPointerPath);

		if (error === null && errorCount === this.errors.length) {
			this.errors = this.errors.slice(0, startErrorCount);

			if (this.trackUnknownProperties) {
				for (var knownKey in this.knownPropertyPaths) {
					oldKnownPropertyPaths[knownKey] = true;
					delete oldUnknownPropertyPaths[knownKey];
				}
				for (var unknownKey in this.unknownPropertyPaths) {
					if (!oldKnownPropertyPaths[unknownKey]) {
						oldUnknownPropertyPaths[unknownKey] = true;
					}
				}
				// We need to continue looping so we catch all the property definitions, but we don't want to return an error
				errorAtEnd = false;
				continue;
			}

			return null;
		}
		if (error) {
			errors.push(error.prefixWith(null, "" + i).prefixWith(null, "anyOf"));
		}
	}
	if (this.trackUnknownProperties) {
		this.unknownPropertyPaths = oldUnknownPropertyPaths;
		this.knownPropertyPaths = oldKnownPropertyPaths;
	}
	if (errorAtEnd) {
		errors = errors.concat(this.errors.slice(startErrorCount));
		this.errors = this.errors.slice(0, startErrorCount);
		return this.createError(ErrorCodes.ANY_OF_MISSING, {}, "", "/anyOf", errors, data, schema);
	}
};

ValidatorContext.prototype.validateOneOf = function validateOneOf(data, schema, dataPointerPath) {
	if (schema.oneOf === undefined) {
		return null;
	}
	var validIndex = null;
	var errors = [];
	var startErrorCount = this.errors.length;
	var oldUnknownPropertyPaths, oldKnownPropertyPaths;
	if (this.trackUnknownProperties) {
		oldUnknownPropertyPaths = this.unknownPropertyPaths;
		oldKnownPropertyPaths = this.knownPropertyPaths;
	}
	for (var i = 0; i < schema.oneOf.length; i++) {
		if (this.trackUnknownProperties) {
			this.unknownPropertyPaths = {};
			this.knownPropertyPaths = {};
		}
		var subSchema = schema.oneOf[i];

		var errorCount = this.errors.length;
		var error = this.validateAll(data, subSchema, [], ["oneOf", i], dataPointerPath);

		if (error === null && errorCount === this.errors.length) {
			if (validIndex === null) {
				validIndex = i;
			} else {
				this.errors = this.errors.slice(0, startErrorCount);
				return this.createError(ErrorCodes.ONE_OF_MULTIPLE, {index1: validIndex, index2: i}, "", "/oneOf", null, data, schema);
			}
			if (this.trackUnknownProperties) {
				for (var knownKey in this.knownPropertyPaths) {
					oldKnownPropertyPaths[knownKey] = true;
					delete oldUnknownPropertyPaths[knownKey];
				}
				for (var unknownKey in this.unknownPropertyPaths) {
					if (!oldKnownPropertyPaths[unknownKey]) {
						oldUnknownPropertyPaths[unknownKey] = true;
					}
				}
			}
		} else if (error) {
			errors.push(error);
		}
	}
	if (this.trackUnknownProperties) {
		this.unknownPropertyPaths = oldUnknownPropertyPaths;
		this.knownPropertyPaths = oldKnownPropertyPaths;
	}
	if (validIndex === null) {
		errors = errors.concat(this.errors.slice(startErrorCount));
		this.errors = this.errors.slice(0, startErrorCount);
		return this.createError(ErrorCodes.ONE_OF_MISSING, {}, "", "/oneOf", errors, data, schema);
	} else {
		this.errors = this.errors.slice(0, startErrorCount);
	}
	return null;
};

ValidatorContext.prototype.validateNot = function validateNot(data, schema, dataPointerPath) {
	if (schema.not === undefined) {
		return null;
	}
	var oldErrorCount = this.errors.length;
	var oldUnknownPropertyPaths, oldKnownPropertyPaths;
	if (this.trackUnknownProperties) {
		oldUnknownPropertyPaths = this.unknownPropertyPaths;
		oldKnownPropertyPaths = this.knownPropertyPaths;
		this.unknownPropertyPaths = {};
		this.knownPropertyPaths = {};
	}
	var error = this.validateAll(data, schema.not, null, null, dataPointerPath);
	var notErrors = this.errors.slice(oldErrorCount);
	this.errors = this.errors.slice(0, oldErrorCount);
	if (this.trackUnknownProperties) {
		this.unknownPropertyPaths = oldUnknownPropertyPaths;
		this.knownPropertyPaths = oldKnownPropertyPaths;
	}
	if (error === null && notErrors.length === 0) {
		return this.createError(ErrorCodes.NOT_PASSED, {}, "", "/not", null, data, schema);
	}
	return null;
};

ValidatorContext.prototype.validateHypermedia = function validateCombinations(data, schema, dataPointerPath) {
	if (!schema.links) {
		return null;
	}
	var error;
	for (var i = 0; i < schema.links.length; i++) {
		var ldo = schema.links[i];
		if (ldo.rel === "describedby") {
			var template = new UriTemplate(ldo.href);
			var allPresent = true;
			for (var j = 0; j < template.varNames.length; j++) {
				if (!(template.varNames[j] in data)) {
					allPresent = false;
					break;
				}
			}
			if (allPresent) {
				var schemaUrl = template.fillFromObject(data);
				var subSchema = {"$ref": schemaUrl};
				if (error = this.validateAll(data, subSchema, [], ["links", i], dataPointerPath)) {
					return error;
				}
			}
		}
	}
};

// parseURI() and resolveUrl() are from https://gist.github.com/1088850
//   -  released as public domain by author ("Yaffle") - see comments on gist

function parseURI(url) {
	var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
	// authority = '//' + user + ':' + pass '@' + hostname + ':' port
	return (m ? {
		href     : m[0] || '',
		protocol : m[1] || '',
		authority: m[2] || '',
		host     : m[3] || '',
		hostname : m[4] || '',
		port     : m[5] || '',
		pathname : m[6] || '',
		search   : m[7] || '',
		hash     : m[8] || ''
	} : null);
}

function resolveUrl(base, href) {// RFC 3986

	function removeDotSegments(input) {
		var output = [];
		input.replace(/^(\.\.?(\/|$))+/, '')
			.replace(/\/(\.(\/|$))+/g, '/')
			.replace(/\/\.\.$/, '/../')
			.replace(/\/?[^\/]*/g, function (p) {
				if (p === '/..') {
					output.pop();
				} else {
					output.push(p);
				}
		});
		return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
	}

	href = parseURI(href || '');
	base = parseURI(base || '');

	return !href || !base ? null : (href.protocol || base.protocol) +
		(href.protocol || href.authority ? href.authority : base.authority) +
		removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
		(href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
		href.hash;
}

function getDocumentUri(uri) {
	return uri.split('#')[0];
}
function normSchema(schema, baseUri) {
	if (schema && typeof schema === "object") {
		if (baseUri === undefined) {
			baseUri = schema.id;
		} else if (typeof schema.id === "string") {
			baseUri = resolveUrl(baseUri, schema.id);
			schema.id = baseUri;
		}
		if (Array.isArray(schema)) {
			for (var i = 0; i < schema.length; i++) {
				normSchema(schema[i], baseUri);
			}
		} else {
			if (typeof schema['$ref'] === "string") {
				schema['$ref'] = resolveUrl(baseUri, schema['$ref']);
			}
			for (var key in schema) {
				if (key !== "enum") {
					normSchema(schema[key], baseUri);
				}
			}
		}
	}
}

function defaultErrorReporter(language) {
	language = language || 'en';

	var errorMessages = languages[language];

	return function (error) {
		var messageTemplate = errorMessages[error.code] || ErrorMessagesDefault[error.code];
		if (typeof messageTemplate !== 'string') {
			return "Unknown error code " + error.code + ": " + JSON.stringify(error.messageParams);
		}
		var messageParams = error.params;
		// Adapted from Crockford's supplant()
		return messageTemplate.replace(/\{([^{}]*)\}/g, function (whole, varName) {
			var subValue = messageParams[varName];
			return typeof subValue === 'string' || typeof subValue === 'number' ? subValue : whole;
		});
	};
}

var ErrorCodes = {
	INVALID_TYPE: 0,
	ENUM_MISMATCH: 1,
	ANY_OF_MISSING: 10,
	ONE_OF_MISSING: 11,
	ONE_OF_MULTIPLE: 12,
	NOT_PASSED: 13,
	// Numeric errors
	NUMBER_MULTIPLE_OF: 100,
	NUMBER_MINIMUM: 101,
	NUMBER_MINIMUM_EXCLUSIVE: 102,
	NUMBER_MAXIMUM: 103,
	NUMBER_MAXIMUM_EXCLUSIVE: 104,
	NUMBER_NOT_A_NUMBER: 105,
	// String errors
	STRING_LENGTH_SHORT: 200,
	STRING_LENGTH_LONG: 201,
	STRING_PATTERN: 202,
	// Object errors
	OBJECT_PROPERTIES_MINIMUM: 300,
	OBJECT_PROPERTIES_MAXIMUM: 301,
	OBJECT_REQUIRED: 302,
	OBJECT_ADDITIONAL_PROPERTIES: 303,
	OBJECT_DEPENDENCY_KEY: 304,
	// Array errors
	ARRAY_LENGTH_SHORT: 400,
	ARRAY_LENGTH_LONG: 401,
	ARRAY_UNIQUE: 402,
	ARRAY_ADDITIONAL_ITEMS: 403,
	// Custom/user-defined errors
	FORMAT_CUSTOM: 500,
	KEYWORD_CUSTOM: 501,
	// Schema structure
	CIRCULAR_REFERENCE: 600,
	// Non-standard validation options
	UNKNOWN_PROPERTY: 1000
};
var ErrorCodeLookup = {};
for (var key in ErrorCodes) {
	ErrorCodeLookup[ErrorCodes[key]] = key;
}
var ErrorMessagesDefault = {
	INVALID_TYPE: "Invalid type: {type} (expected {expected})",
	ENUM_MISMATCH: "No enum match for: {value}",
	ANY_OF_MISSING: "Data does not match any schemas from \"anyOf\"",
	ONE_OF_MISSING: "Data does not match any schemas from \"oneOf\"",
	ONE_OF_MULTIPLE: "Data is valid against more than one schema from \"oneOf\": indices {index1} and {index2}",
	NOT_PASSED: "Data matches schema from \"not\"",
	// Numeric errors
	NUMBER_MULTIPLE_OF: "Value {value} is not a multiple of {multipleOf}",
	NUMBER_MINIMUM: "Value {value} is less than minimum {minimum}",
	NUMBER_MINIMUM_EXCLUSIVE: "Value {value} is equal to exclusive minimum {minimum}",
	NUMBER_MAXIMUM: "Value {value} is greater than maximum {maximum}",
	NUMBER_MAXIMUM_EXCLUSIVE: "Value {value} is equal to exclusive maximum {maximum}",
	NUMBER_NOT_A_NUMBER: "Value {value} is not a valid number",
	// String errors
	STRING_LENGTH_SHORT: "String is too short ({length} chars), minimum {minimum}",
	STRING_LENGTH_LONG: "String is too long ({length} chars), maximum {maximum}",
	STRING_PATTERN: "String does not match pattern: {pattern}",
	// Object errors
	OBJECT_PROPERTIES_MINIMUM: "Too few properties defined ({propertyCount}), minimum {minimum}",
	OBJECT_PROPERTIES_MAXIMUM: "Too many properties defined ({propertyCount}), maximum {maximum}",
	OBJECT_REQUIRED: "Missing required property: {key}",
	OBJECT_ADDITIONAL_PROPERTIES: "Additional properties not allowed",
	OBJECT_DEPENDENCY_KEY: "Dependency failed - key must exist: {missing} (due to key: {key})",
	// Array errors
	ARRAY_LENGTH_SHORT: "Array is too short ({length}), minimum {minimum}",
	ARRAY_LENGTH_LONG: "Array is too long ({length}), maximum {maximum}",
	ARRAY_UNIQUE: "Array items are not unique (indices {match1} and {match2})",
	ARRAY_ADDITIONAL_ITEMS: "Additional items not allowed",
	// Format errors
	FORMAT_CUSTOM: "Format validation failed ({message})",
	KEYWORD_CUSTOM: "Keyword failed: {key} ({message})",
	// Schema structure
	CIRCULAR_REFERENCE: "Circular $refs: {urls}",
	// Non-standard validation options
	UNKNOWN_PROPERTY: "Unknown property (not in schema)"
};

function ValidationError(code, params, dataPath, schemaPath, subErrors) {
	Error.call(this);
	if (code === undefined) {
		throw new Error ("No error code supplied: " + schemaPath);
	}
	this.message = '';
	this.params = params;
	this.code = code;
	this.dataPath = dataPath || "";
	this.schemaPath = schemaPath || "";
	this.subErrors = subErrors || null;

	var err = new Error(this.message);
	this.stack = err.stack || err.stacktrace;
	if (!this.stack) {
		try {
			throw err;
		}
		catch(err) {
			this.stack = err.stack || err.stacktrace;
		}
	}
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;
ValidationError.prototype.name = 'ValidationError';

ValidationError.prototype.prefixWith = function (dataPrefix, schemaPrefix) {
	if (dataPrefix !== null) {
		dataPrefix = dataPrefix.replace(/~/g, "~0").replace(/\//g, "~1");
		this.dataPath = "/" + dataPrefix + this.dataPath;
	}
	if (schemaPrefix !== null) {
		schemaPrefix = schemaPrefix.replace(/~/g, "~0").replace(/\//g, "~1");
		this.schemaPath = "/" + schemaPrefix + this.schemaPath;
	}
	if (this.subErrors !== null) {
		for (var i = 0; i < this.subErrors.length; i++) {
			this.subErrors[i].prefixWith(dataPrefix, schemaPrefix);
		}
	}
	return this;
};

function isTrustedUrl(baseUrl, testUrl) {
	if(testUrl.substring(0, baseUrl.length) === baseUrl){
		var remainder = testUrl.substring(baseUrl.length);
		if ((testUrl.length > 0 && testUrl.charAt(baseUrl.length - 1) === "/")
			|| remainder.charAt(0) === "#"
			|| remainder.charAt(0) === "?") {
			return true;
		}
	}
	return false;
}

var languages = {};
function createApi(language) {
	var globalContext = new ValidatorContext();
	var currentLanguage;
	var customErrorReporter;
	var api = {
		setErrorReporter: function (reporter) {
			if (typeof reporter === 'string') {
				return this.language(reporter);
			}
			customErrorReporter = reporter;
			return true;
		},
		addFormat: function () {
			globalContext.addFormat.apply(globalContext, arguments);
		},
		language: function (code) {
			if (!code) {
				return currentLanguage;
			}
			if (!languages[code]) {
				code = code.split('-')[0]; // fall back to base language
			}
			if (languages[code]) {
				currentLanguage = code;
				return code; // so you can tell if fall-back has happened
			}
			return false;
		},
		addLanguage: function (code, messageMap) {
			var key;
			for (key in ErrorCodes) {
				if (messageMap[key] && !messageMap[ErrorCodes[key]]) {
					messageMap[ErrorCodes[key]] = messageMap[key];
				}
			}
			var rootCode = code.split('-')[0];
			if (!languages[rootCode]) { // use for base language if not yet defined
				languages[code] = messageMap;
				languages[rootCode] = messageMap;
			} else {
				languages[code] = Object.create(languages[rootCode]);
				for (key in messageMap) {
					if (typeof languages[rootCode][key] === 'undefined') {
						languages[rootCode][key] = messageMap[key];
					}
					languages[code][key] = messageMap[key];
				}
			}
			return this;
		},
		freshApi: function (language) {
			var result = createApi();
			if (language) {
				result.language(language);
			}
			return result;
		},
		validate: function (data, schema, checkRecursive, banUnknownProperties) {
			var def = defaultErrorReporter(currentLanguage);
			var errorReporter = customErrorReporter ? function (error, data, schema) {
				return customErrorReporter(error, data, schema) || def(error, data, schema);
			} : def;
			var context = new ValidatorContext(globalContext, false, errorReporter, checkRecursive, banUnknownProperties);
			if (typeof schema === "string") {
				schema = {"$ref": schema};
			}
			context.addSchema("", schema);
			var error = context.validateAll(data, schema, null, null, "");
			if (!error && banUnknownProperties) {
				error = context.banUnknownProperties(data, schema);
			}
			this.error = error;
			this.missing = context.missing;
			this.valid = (error === null);
			return this.valid;
		},
		validateResult: function () {
			var result = {toString: function () {
				return this.valid ? 'valid' : this.error.message;
			}};
			this.validate.apply(result, arguments);
			return result;
		},
		validateMultiple: function (data, schema, checkRecursive, banUnknownProperties) {
			var def = defaultErrorReporter(currentLanguage);
			var errorReporter = customErrorReporter ? function (error, data, schema) {
				return customErrorReporter(error, data, schema) || def(error, data, schema);
			} : def;
			var context = new ValidatorContext(globalContext, true, errorReporter, checkRecursive, banUnknownProperties);
			if (typeof schema === "string") {
				schema = {"$ref": schema};
			}
			context.addSchema("", schema);
			context.validateAll(data, schema, null, null, "");
			if (banUnknownProperties) {
				context.banUnknownProperties(data, schema);
			}
			var result = {toString: function () {
				return this.valid ? 'valid' : this.error.message;
			}};
			result.errors = context.errors;
			result.missing = context.missing;
			result.valid = (result.errors.length === 0);
			return result;
		},
		addSchema: function () {
			return globalContext.addSchema.apply(globalContext, arguments);
		},
		getSchema: function () {
			return globalContext.getSchema.apply(globalContext, arguments);
		},
		getSchemaMap: function () {
			return globalContext.getSchemaMap.apply(globalContext, arguments);
		},
		getSchemaUris: function () {
			return globalContext.getSchemaUris.apply(globalContext, arguments);
		},
		getMissingUris: function () {
			return globalContext.getMissingUris.apply(globalContext, arguments);
		},
		dropSchemas: function () {
			globalContext.dropSchemas.apply(globalContext, arguments);
		},
		defineKeyword: function () {
			globalContext.defineKeyword.apply(globalContext, arguments);
		},
		defineError: function (codeName, codeNumber, defaultMessage) {
			if (typeof codeName !== 'string' || !/^[A-Z]+(_[A-Z]+)*$/.test(codeName)) {
				throw new Error('Code name must be a string in UPPER_CASE_WITH_UNDERSCORES');
			}
			if (typeof codeNumber !== 'number' || codeNumber%1 !== 0 || codeNumber < 10000) {
				throw new Error('Code number must be an integer > 10000');
			}
			if (typeof ErrorCodes[codeName] !== 'undefined') {
				throw new Error('Error already defined: ' + codeName + ' as ' + ErrorCodes[codeName]);
			}
			if (typeof ErrorCodeLookup[codeNumber] !== 'undefined') {
				throw new Error('Error code already used: ' + ErrorCodeLookup[codeNumber] + ' as ' + codeNumber);
			}
			ErrorCodes[codeName] = codeNumber;
			ErrorCodeLookup[codeNumber] = codeName;
			ErrorMessagesDefault[codeName] = ErrorMessagesDefault[codeNumber] = defaultMessage;
			for (var langCode in languages) {
				var language = languages[langCode];
				if (language[codeName]) {
					language[codeNumber] = language[codeNumber] || language[codeName];
				}
			}
		},
		reset: function () {
			globalContext.reset();
			this.error = null;
			this.missing = [];
			this.valid = true;
		},
		missing: [],
		error: null,
		valid: true,
		normSchema: normSchema,
		resolveUrl: resolveUrl,
		getDocumentUri: getDocumentUri,
		errorCodes: ErrorCodes
	};
	api.language(language || 'en');
	return api;
}

var tv4 = createApi();
tv4.addLanguage('en-gb', ErrorMessagesDefault);

//legacy property
tv4.tv4 = tv4;

return tv4; // used by _header.js to globalise.

}));

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./obniz sync recursive":
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

/***/ "./obniz/ObnizApi.js":
/***/ (function(module, exports, __webpack_require__) {

const fetch = __webpack_require__("./node_modules/node-fetch/browser.js");

class ObnizApi {
  constructor(obnizId, options) {
    this.id = obnizId;
    options = options || {};
    this.options = {
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || 'https://obniz.io',
    };
    this.urlBase = this.options.obniz_server + '/obniz/' + this.id;
  }

  get apiVersion() {
    let packageJson = __webpack_require__("./package.json");
    let versionString = packageJson.version;
    return versionString.split('.').shift();
  }

  post(path, params, callback) {
    let url = this.urlBase + path;

    // let query = [];
    //query.push("XXX");
    // if(query.length > 0){
    //   url += "?" + query.join("&");
    // }

    let headers = {};
    headers['Content-Type'] = 'application/json';
    if (this.options.access_token) {
      headers['authorization'] = 'Bearer ' + this.options.access_token;
    }

    let fetchParams = {
      method: 'POST',
      headers,
    };
    if (params) {
      fetchParams['body'] = JSON.stringify(params);
    }

    return fetch(url, fetchParams)
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (typeof callback === 'function') {
          callback(json);
        }
        return new Promise(resolve => {
          resolve(json);
        });
      });
  }

  getState(callback) {
    return this.post('/state', null, callback);
  }

  postJson(json, callback) {
    return this.post('/api/' + this.apiVersion, json, callback); // 1 is api version
  }
}

module.exports = ObnizApi;


/***/ }),

/***/ "./obniz/ObnizComponents.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizBLE = __webpack_require__("./obniz/libs/embeds/ble/ble.js");
const Display = __webpack_require__("./obniz/libs/embeds/display.js");
const ObnizSwitch = __webpack_require__("./obniz/libs/embeds/switch.js");

const LogicAnalyzer = __webpack_require__("./obniz/libs/measurements/logicanalyzer.js");
const ObnizMeasure = __webpack_require__("./obniz/libs/measurements/measure.js");

const PeripheralAD = __webpack_require__("./obniz/libs/io_peripherals/ad.js");
const PeripheralI2C = __webpack_require__("./obniz/libs/io_peripherals/i2c.js");
const PeripheralIO = __webpack_require__("./obniz/libs/io_peripherals/io.js");
const PeripheralIO_ = __webpack_require__("./obniz/libs/io_peripherals/io_.js");
const PeripheralPWM = __webpack_require__("./obniz/libs/io_peripherals/pwm.js");
const PeripheralSPI = __webpack_require__("./obniz/libs/io_peripherals/spi.js");
const PeripheralUART = __webpack_require__("./obniz/libs/io_peripherals/uart.js");

const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");
const ObnizParts = __webpack_require__("./obniz/ObnizParts.js");

module.exports = class ObnizComponents extends ObnizParts {
  constructor(id, options) {
    super(id, options);
    this.pongObservers = [];
  }

  close() {
    super.close();
    if (this.options.reset_obniz_on_ws_disconnection) {
      this._resetComponents();
    }
  }

  _prepareComponents() {
    this.io = new PeripheralIO_(this);
    for (let i = 0; i < 12; i++) {
      this['io' + i] = new PeripheralIO(this, i);
    }
    for (let i = 0; i < 12; i++) {
      this['ad' + i] = new PeripheralAD(this, i);
    }
    for (let i = 0; i < 2; i++) {
      this['uart' + i] = new PeripheralUART(this, i);
    }
    for (let i = 0; i < 2; i++) {
      this['spi' + i] = new PeripheralSPI(this, i);
    }
    for (let i = 0; i < 1; i++) {
      this['i2c' + i] = new PeripheralI2C(this, i);
    }
    for (let i = 0; i < 6; i++) {
      this['pwm' + i] = new PeripheralPWM(this, i);
    }

    this.display = new Display(this);
    this.switch = new ObnizSwitch(this);
    this.logicAnalyzer = new LogicAnalyzer(this);
    this.ble = new ObnizBLE(this);
    this.measure = new ObnizMeasure(this);

    this.util = new ObnizUtil(this);
  }

  _resetComponents() {
    this.print_debug('components state resets');
    for (let i = 0; i < 12; i++) {
      this['io' + i]._reset();
    }
    for (let i = 0; i < 12; i++) {
      this['ad' + i]._reset();
    }
    for (let i = 0; i < 2; i++) {
      this['uart' + i]._reset();
    }
    for (let i = 0; i < 2; i++) {
      this['spi' + i]._reset();
    }
    for (let i = 0; i < 1; i++) {
      this['i2c' + i]._reset();
    }
    for (let i = 0; i < 6; i++) {
      this['pwm' + i]._reset();
    }

    this.display._reset();
    this.switch._reset();
    this.logicAnalyzer._reset();
    this.ble._reset();
    this.measure._reset();
  }

  notifyToModule(obj) {
    super.notifyToModule(obj);
    const notifyHandlers = ['io', 'uart', 'spi', 'i2c', 'ad'];
    for (
      let handerIndex = 0;
      handerIndex < notifyHandlers.length;
      handerIndex++
    ) {
      const peripheral = notifyHandlers[handerIndex];
      let i = -1;
      while (this[peripheral + '' + ++i]) {
        let module_value = obj[peripheral + '' + i];
        if (module_value === undefined) continue;
        this[peripheral + '' + i].notified(module_value);
      }
    }
    const names = ['switch', 'ble', 'measure'];
    for (let i = 0; i < names.length; i++) {
      if (obj[names[i]]) {
        this[names[i]].notified(obj[names[i]]);
      }
    }
    if (obj.logic_analyzer) {
      this.logicAnalyzer.notified(obj.logic_analyzer);
    }
  }

  handleSystemCommand(wsObj) {
    super.handleSystemCommand(wsObj);
    // ping pong
    if (wsObj.pong) {
      for (let callback of this.pongObservers) {
        callback(wsObj);
      }
    }
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

  isValidIO(io) {
    return typeof io === 'number' && io >= 0 && io < 12;
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
    return this['io' + io];
  }

  getAD(io) {
    if (!this.isValidIO(io)) {
      throw new Error('ad ' + io + ' is not valid io');
    }
    return this['ad' + io];
  }

  getFreePwm() {
    let i = 0;
    for (i = 0; i < 6; i++) {
      let pwm = this['pwm' + i];
      if (!pwm) {
        break;
      }
      if (!pwm.isUsed()) {
        pwm.used = true;
        return pwm;
      }
    }
    throw new Error('No More PWM Available. max = ' + i);
  }

  getFreeI2C() {
    let i = 0;
    for (i = 0; i < 1; i++) {
      let i2c = this['i2c' + i];
      if (!i2c) {
        break;
      }
      if (!i2c.isUsed()) {
        i2c.used = true;
        return i2c;
      }
    }
    throw new Error('No More I2C Available. max = ' + i);
  }

  getI2CWithConfig(config) {
    if (typeof config !== 'object') {
      throw new Error('getI2CWithConfig need config arg');
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
    for (i = 0; i < 2; i++) {
      let spi = this['spi' + i];
      if (!spi) {
        break;
      }
      if (!spi.isUsed()) {
        spi.used = true;
        return spi;
      }
    }
    throw new Error('No More SPI Available. max = ' + i);
  }

  getSpiWithConfig(config) {
    if (typeof config !== 'object') {
      throw new Error('getSpiWithConfig need config arg');
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
    for (i = 0; i < 2; i++) {
      let uart = this['uart' + i];
      if (!uart) {
        break;
      }
      if (!uart.isUsed()) {
        uart.used = true;
        return uart;
      }
    }
    throw new Error('No More uart Available. max = ' + i);
  }
};


/***/ }),

/***/ "./obniz/ObnizConnection.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/index.js");

const isNode = typeof window === 'undefined';

module.exports = class ObnizConnection {
  constructor(id, options) {
    this.isNode = isNode;
    this.id = id;
    this.socket = null;
    this.socket_local = null;
    this.debugprint = false;
    this.debugprintBinary = false;
    this.debugs = [];
    this.onConnectCalled = false;
    this.bufferdAmoundWarnBytes = 100 * 1000; // 100k bytes
    this._prepareComponents();
    if (!options) {
      options = {};
    }
    this.options = {
      binary: options.binary === false ? false : true,
      local_connect: options.local_connect === false ? false : true,
      debug_dom_id: options.debug_dom_id || 'obniz-debug',
      auto_connect: options.auto_connect === false ? false : true,
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || 'wss://obniz.io',
      reset_obniz_on_ws_disconnection:
        options.reset_obniz_on_ws_disconnection === false ? false : true,
    };
    if (this.options.binary) {
      this.wscommand = this.constructor.WSCommand;
      let classes = this.constructor.WSCommand.CommandClasses;
      this.wscommands = [];
      for (let class_name in classes) {
        this.wscommands.push(new classes[class_name]());
      }
    }
    if (this.options.auto_connect) {
      this.wsconnect();
    }
  }

  prompt(filled, callback) {
    let obnizid = prompt('Please enter obniz id', filled);
    if (obnizid) {
      callback(obnizid);
    }
  }

  static get version() {
    let packageJson = __webpack_require__("./package.json");
    return packageJson.version;
  }

  wsOnOpen() {
    this.print_debug('ws connected');
    // wait for {ws:{ready:true}} object
    if (typeof this.onopen === 'function') {
      this.onopen(this);
    }
  }

  wsOnMessage(data) {
    if (this.debugprintBinary && typeof data !== 'string') {
      this.print_debug('' + new Uint8Array(data).toString());
    }

    let json;
    if (typeof data === 'string') {
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

  wsOnClose(event) {
    this.print_debug('closed');
    this.close();
    if (typeof this.onclose === 'function') {
      this.onclose(this);
    }
    if (this.options.auto_connect) {
      setTimeout(() => {
        this.wsconnect(); // always connect to mainserver if ws lost
      }, 1000);
    }
  }

  wsOnError(event) {
    // console.error(event);
  }

  wsOnUnexpectedResponse(req, res) {
    let reconnectTime = 1000;
    if (res && res.statusCode == 404) {
      this.print_debug('obniz not online');
    } else {
      reconnectTime = 5000; // server error or someting
      this.print_debug( true ? res.statusCode : undefined);
    }
    this.clearSocket(this.socket);
    delete this.socket;
    if (this.options.auto_connect) {
      setTimeout(() => {
        this.wsconnect(); // always connect to mainserver if ws lost
      }, reconnectTime);
    }
  }

  wsconnect(desired_server) {
    let server = this.options.obniz_server;
    if (desired_server) {
      server = '' + desired_server;
    }

    if (this.socket && this.socket.readyState <= 1) {
      this.close();
    }

    let url = server + '/obniz/' + this.id + '/ws/1';

    let query = [];
    if (this.constructor.version) {
      query.push('obnizjs=' + this.constructor.version);
    }
    if (this.options.access_token) {
      query.push('access_token=' + this.options.access_token);
    }
    if (this.wscommand) {
      query.push('accept_binary=true');
    }
    if (query.length > 0) {
      url += '?' + query.join('&');
    }
    this.print_debug('connecting to ' + url);

    let socket;
    if (this.isNode) {
      const wsClient = __webpack_require__("./obniz/libs/webpackReplace/ws.js");
      socket = new wsClient(url);
      socket.on('open', this.wsOnOpen.bind(this));
      socket.on('message', this.wsOnMessage.bind(this));
      socket.on('close', this.wsOnClose.bind(this));
      socket.on('error', this.wsOnError.bind(this));
      socket.on('unexpected-response', this.wsOnUnexpectedResponse.bind(this));
    } else {
      socket = new WebSocket(url);
      socket.binaryType = 'arraybuffer';
      socket.onopen = this.wsOnOpen.bind(this);
      socket.onmessage = function(event) {
        this.wsOnMessage(event.data);
      }.bind(this);
      socket.onclose = this.wsOnClose.bind(this);
      socket.onerror = this.wsOnError.bind(this);
    }
    this.socket = socket;
  }

  _connectLocal(host) {
    const url = 'ws://' + host;
    this.print_debug('local connect to ' + url);
    let ws;
    if (this.isNode) {
      const wsClient = __webpack_require__("./obniz/libs/webpackReplace/ws.js");
      ws = new wsClient(url);
      ws.on('open', () => {
        this.print_debug('connected to ' + url);
        this._callOnConnect();
      });
      ws.on('message', data => {
        this.print_debug('recvd via local');
        this.wsOnMessage(data);
      });
      ws.on('close', event => {
        console.log('local websocket closed');
        this._disconnectLocal();
      });
      ws.on('error', err => {
        console.error('local websocket error.', err);
        this._disconnectLocal();
      });
      ws.on('unexpected-response', event => {
        console.log('local websocket closed');
        this._disconnectLocal();
      });
    } else {
      ws = new WebSocket(url);
      ws.binaryType = 'arraybuffer';
      ws.onopen = () => {
        this.print_debug('connected to ' + url);
        this._callOnConnect();
      };
      ws.onmessage = event => {
        this.print_debug('recvd via local');
        this.wsOnMessage(event.data);
      };
      ws.onclose = event => {
        console.log('local websocket closed');
        this._disconnectLocal();
      };
      ws.onerror = err => {
        console.log('local websocket error.', err);
        this._disconnectLocal();
      };
    }
    this.socket_local = ws;
  }

  _disconnectLocal() {
    if (this.socket_local) {
      if (this.socket.readyState <= 1) {
        this.socket_local.close();
      }
      this.clearSocket(this.socket_local);
      delete this.socket_local;
    }
    if (this._waitForLocalConnectReadyTimer) {
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = null;
      this._callOnConnect(); /* should call. onlyl local connect was lost. and waiting. */
    }
  }

  clearSocket(socket) {
    if (!socket) return;
    /* send queue */
    if (this._sendQueueTimer) {
      delete this._sendQueue;
      clearTimeout(this._sendQueueTimer);
      this._sendQueueTimer = null;
    }
    /* unbind */
    if (this.isNode) {
      let shouldRemoveObservers = [
        'open',
        'message',
        'close',
        'error',
        'unexpected-response',
      ];
      for (let i = 0; i < shouldRemoveObservers.length; i++) {
        socket.removeAllListeners(shouldRemoveObservers[i]);
      }
    } else {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    }
  }

  connect() {
    this.wsconnect();
  }

  close() {
    this._drainQueued();
    this._disconnectLocal();
    if (this.socket) {
      if (this.socket.readyState <= 1) {
        // Connecting & Connected
        this.socket.close(1000, 'close');
      }
      this.clearSocket(this.socket);
      delete this.socket;
    }
  }

  _callOnConnect() {
    let shouldCall = true;
    if (this._waitForLocalConnectReadyTimer) {
      /* obniz.js has wait local_connect */
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = null;
    } else {
      /* obniz.js hasn't wait local_connect */
      if (this.socket_local && this.socket_local.readyState === 1) {
        /* delayed connect */
        shouldCall = false;
      } else {
        /* local_connect is not used */
      }
    }

    if (shouldCall) {
      if (typeof this.onconnect !== 'function') return;
      const promise = this.onconnect(this);
      if (promise instanceof Promise) {
        promise.catch(err => {
          console.error(err);
        });
      }
      this.onConnectCalled = true;
    }
  }

  print_debug(str) {
    if (this.debugprint) {
      console.log('Obniz: ' + str);
    }
  }

  send(obj, options) {
    if (!obj || typeof obj !== 'object') {
      console.log('obnizjs. didnt send ', obj);
      return;
    }
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        this.send(obj[i]);
      }
      return;
    }
    if (this.sendPool) {
      this.sendPool.push(obj);
      return;
    }

    let sendData = JSON.stringify([obj]);
    if (this.debugprint) {
      this.print_debug('send: ' + sendData);
    }
    /* compress */
    if (
      this.wscommand &&
      (typeof options !== 'object' || options.local_connect !== false)
    ) {
      let compressed;
      try {
        compressed = this.wscommand.compress(
          this.wscommands,
          JSON.parse(sendData)[0]
        );
        if (compressed) {
          sendData = compressed;
          if (this.debugprintBinary) {
            this.print_debug(
              'binalized: ' + new Uint8Array(compressed).toString()
            );
          }
        }
      } catch (e) {
        this.error('------ errored json -------');
        this.error(sendData);
        throw e;
      }
    }

    /* queue sending */
    if (typeof sendData === 'string') {
      this._drainQueued();
      this._sendRouted(sendData);
    } else {
      if (this._sendQueue) {
        this._sendQueue.push(sendData);
      } else {
        this._sendQueue = [sendData];
        this._sendQueueTimer = setTimeout(this._drainQueued.bind(this), 0);
      }
    }
  }

  _sendRouted(data) {
    if (
      this.socket_local &&
      this.socket_local.readyState === 1 &&
      typeof data !== 'string'
    ) {
      this.print_debug('send via local');
      this.print_debug(data);
      this.socket_local.send(data);
      if (this.socket_local.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.error(
          'Warning: over ' + this.socket_local.bufferedAmount + ' bytes queued'
        );
      }
      return;
    }

    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(data);
      if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.error(
          'Warning: over ' + this.socket.bufferedAmount + ' bytes queued'
        );
      }
      return;
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
    this._sendRouted(sendData);
    delete this._sendQueue;
    clearTimeout(this._sendQueueTimer);
    this._sendQueueTimer = null;
  }

  _prepareComponents() {}

  notifyToModule(obj) {
    this.print_debug(JSON.stringify(obj));

    if (obj['ws']) {
      this.handleWSCommand(obj['ws']);
      return;
    }
    if (obj['system']) {
      this.handleSystemCommand(obj['system']);
      return;
    }
  }

  _canConnectToInsecure() {
    if (this.isNode) {
      return true;
    } else {
      return location.protocol != 'https:';
    }
  }

  handleWSCommand(wsObj) {
    if (wsObj.ready) {
      this.firmware_ver = wsObj.obniz.firmware;
      if (this.options.reset_obniz_on_ws_disconnection) {
        this.resetOnDisconnect(true);
      }
      if (
        wsObj.local_connect &&
        wsObj.local_connect.ip &&
        this.wscommand &&
        this.options.local_connect &&
        this._canConnectToInsecure()
      ) {
        this._connectLocal(wsObj.local_connect.ip);
        this._waitForLocalConnectReadyTimer = setTimeout(() => {
          this._callOnConnect();
        }, 3000);
      } else {
        this._callOnConnect();
      }
    }
    if (wsObj.redirect) {
      let server = wsObj.redirect;
      this.print_debug('WS connection changed to ' + server);

      /* close current ws immidiately */
      /*  */
      this.socket.close(1000, 'close');
      this.clearSocket(this.socket);
      delete this.socket;

      /* connect to new server */
      this.wsconnect(server);
    }
  }

  handleSystemCommand(wsObj) {}

  static get WSCommand() {
    return WSCommand;
  }

  binary2Json(binary) {
    let data = new Uint8Array(binary);
    let json = [];
    while (data !== null) {
      const frame = WSCommand.dequeueOne(data);
      if (!frame) break;
      let obj = {};
      for (let i = 0; i < this.wscommands.length; i++) {
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

  warning(msg) {
    console.log('warning:' + msg);
  }

  error(msg) {
    console.error('error:' + msg);
  }
};


/***/ }),

/***/ "./obniz/ObnizParts.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizConnection = __webpack_require__("./obniz/ObnizConnection.js");
const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");

let _parts = {};

module.exports = class ObnizParts extends ObnizConnection {
  constructor(id, options) {
    super(id, options);
  }

  static _parts() {
    return _parts;
  }

  static PartsRegistrate(arg0, arg1) {
    if (
      arg0 &&
      typeof arg0.info === 'function' &&
      typeof arg0.info().name === 'string'
    ) {
      _parts[arg0.info().name] = arg0;
    } else if (typeof arg0 === 'string' && typeof arg1 === 'object') {
      _parts[arg0] = arg1;
    }
  }

  static Parts(name) {
    if (!_parts[name]) {
      throw new Error(`unknown parts [${name}]`);
    }
    return new _parts[name]();
  }

  wired(partsname) {
    let parts = ObnizParts.Parts(partsname);
    if (!parts) {
      throw new Error('No such a parts [' + partsname + '] found');
    }
    let args = Array.from(arguments);
    args.shift();
    args.unshift(this);
    if (parts.keys) {
      if (parts.requiredKeys) {
        let err = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
        if (err) {
          throw new Error(
            partsname + " wired param '" + err + "' required, but not found "
          );
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
        if (this.isValidIO(io)) {
          if (parts.displayIoNames && parts.displayIoNames[pinName]) {
            pinName = parts.displayIoNames[pinName];
          }
          ioNames[io] = pinName;
        }
      }
      this.display.setPinNames(displayPartsName, ioNames);
    }
    return parts;
  }
};


/***/ }),

/***/ "./obniz/ObnizSystemMethods.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizComponents = __webpack_require__("./obniz/ObnizComponents.js");

module.exports = class ObnizSystemMethods extends ObnizComponents {
  constructor(id, options) {
    super(id, options);
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
    this.send({ system: { reset: true } });
    this._prepareComponents();
  }
  reboot() {
    this.send({ system: { reboot: true } });
    this._prepareComponents();
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

  pingWait(unixtime, rand, forceGlobalNetwork) {
    unixtime = unixtime || new Date().getTime();
    let upper = Math.floor(unixtime / Math.pow(2, 32));
    let lower = unixtime - upper * Math.pow(2, 32);
    rand = rand || Math.floor(Math.random() * Math.pow(2, 4));
    let buf = [];

    buf.push((upper >>> (8 * 3)) & 0xff);
    buf.push((upper >>> (8 * 2)) & 0xff);
    buf.push((upper >>> (8 * 1)) & 0xff);
    buf.push((upper >>> (8 * 0)) & 0xff);
    buf.push((lower >>> (8 * 3)) & 0xff);
    buf.push((lower >>> (8 * 2)) & 0xff);
    buf.push((lower >>> (8 * 1)) & 0xff);
    buf.push((lower >>> (8 * 0)) & 0xff);
    buf.push((rand >>> (8 * 3)) & 0xff);
    buf.push((rand >>> (8 * 2)) & 0xff);
    buf.push((rand >>> (8 * 1)) & 0xff);
    buf.push((rand >>> (8 * 0)) & 0xff);

    let obj = {
      system: {
        ping: {
          key: buf,
        },
      },
    };

    this.send(obj, { local_connect: forceGlobalNetwork ? false : true });

    return new Promise(resolve => {
      let callback = systemObj => {
        for (let i = 0; i < buf.length; i++) {
          if (buf[i] !== systemObj.pong.key[i]) {
            return;
          }
        }
        this.removePongObserver(callback);
        let upper =
          ((systemObj.pong.key[0] << (8 * 3)) >>> 0) +
          ((systemObj.pong.key[1] << (8 * 2)) >>> 0) +
          ((systemObj.pong.key[2] << (8 * 1)) >>> 0) +
          ((systemObj.pong.key[3] << (8 * 0)) >>> 0);
        let lower =
          ((systemObj.pong.key[4] << (8 * 3)) >>> 0) +
          ((systemObj.pong.key[5] << (8 * 2)) >>> 0) +
          ((systemObj.pong.key[6] << (8 * 1)) >>> 0) +
          ((systemObj.pong.key[7] << (8 * 0)) >>> 0);
        let obnizJsPingUnixtime = upper * Math.pow(2, 32) + lower;
        let obnizJsPongUnixtime = new Date().getTime();
        let allTime = obnizJsPongUnixtime - obnizJsPingUnixtime;
        let timeJs2server = systemObj.pong.pingServerTime - obnizJsPingUnixtime;
        let timeServer2Obniz =
          systemObj.pong.obnizTime - systemObj.pong.pingServerTime;
        let timeObniz2Server =
          systemObj.pong.pongServerTime - systemObj.pong.obnizTime;
        let timeServer2Js = obnizJsPongUnixtime - systemObj.pong.pongServerTime;
        let str = `ping ${allTime}ms (js --[${timeJs2server}ms]--> server --[${timeServer2Obniz}ms]--> obniz --[${timeObniz2Server}ms]--> server --[${timeServer2Js}ms]--> js)`;

        this.print_debug(str);
        resolve(str);
      };
      this.addPongObserver(callback);
    });
  }
};


/***/ }),

/***/ "./obniz/ObnizUIs.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizSystemMethods = __webpack_require__("./obniz/ObnizSystemMethods.js");

module.exports = class ObnizUIs extends ObnizSystemMethods {
  constructor(id, options) {
    super(id, options);
  }

  isValidObnizId(str) {
    if (typeof str != 'string' || str.length < 8) {
      return null;
    }
    str = str.replace('-', '');
    let id = parseInt(str);
    if (isNaN(id)) id = null;
    return id != null;
  }

  wsconnect(desired_server) {
    this.showOffLine();
    if (!this.isValidObnizId(this.id)) {
      if (this.isNode) {
        this.error('invalid obniz id');
      } else {
        let filled = _ReadCookie('obniz-last-used') || '';
        this.prompt(
          filled,
          function(obnizid) {
            this.id = obnizid;
            this.wsconnect(desired_server);
          }.bind(this)
        );
      }
      return;
    }
    super.wsconnect(desired_server);
  }

  showAlertUI(obj) {
    if (this.isNode || !document.getElementById(this.options.debug_dom_id)) {
      return;
    }
    let dom = `
    <div style="background-color:${
      obj.alert === 'warning' ? '#ffee35' : '#ff7b34'
    }">${obj.message}</div>`;
    document
      .getElementById(this.options.debug_dom_id)
      .insertAdjacentHTML('beforeend', dom);
  }

  getDebugDoms() {
    if (this.isNode) {
      return;
    }
    let loaderDom = document.querySelector('#loader');
    let debugDom = document.querySelector('#' + this.options.debug_dom_id);
    let statusDom = document.querySelector(
      '#' + this.options.debug_dom_id + ' #online-status'
    );
    if (debugDom && !statusDom) {
      statusDom = document.createElement('div');
      statusDom.id = 'online-status';
      statusDom.style.color = '#FFF';
      statusDom.style.padding = '5px';
      statusDom.style.textAlign = 'center';
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return { loaderDom: loaderDom, debugDom: debugDom, statusDom: statusDom };
  }

  /* online offline */

  _callOnConnect() {
    this.updateOnlineUI();
    super._callOnConnect();
  }

  close() {
    super.close();
    this.updateOnlineUI();
  }

  _disconnectLocal() {
    super._disconnectLocal();
    this.updateOnlineUI();
  }

  updateOnlineUI() {
    if (this.isNode) {
      return;
    }

    const isConnected = this.socket && this.socket.readyState === 1;
    const isConnectedLocally =
      this.socket_local && this.socket_local.readyState === 1;
    if (isConnected && isConnectedLocally) {
      this.showOnLine(true);
    } else if (isConnected) {
      this.showOnLine(false);
    } else {
      this.showOffLine();
    }
  }

  showOnLine(isConnectedLocally) {
    if (this.isNode) {
      return;
    }
    const doms = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = 'none';
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = isConnectedLocally
        ? '#0cd362'
        : '#31965d';
      doms.statusDom.style.color = '#FFF';
      doms.statusDom.innerHTML =
        (this.id ? 'online : ' + this.id : 'online') +
        (isConnectedLocally ? ' via local_connect' : ' via internet');
    }
  }

  showOffLine() {
    if (this.isNode) {
      return;
    }

    const doms = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = 'block';
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = '#d9534f';
      doms.statusDom.style.color = '#FFF';
      doms.statusDom.innerHTML = this.id ? 'offline : ' + this.id : 'offline';
    }
  }
};

function _ReadCookie(name) {
  let nameEQ = name + '=';
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


/***/ }),

/***/ "./obniz/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const ObnizUIs = __webpack_require__("./obniz/ObnizUIs.js");
const ObnizApi = __webpack_require__("./obniz/ObnizApi.js");

/* global showObnizDebugError  */

const isNode = typeof window === 'undefined';

class Obniz extends ObnizUIs {
  constructor(id, options) {
    super(id, options);
  }

  repeat(callback, interval) {
    if (this.looper) {
      this.looper = callback;
      return;
    }
    this.looper = callback;
    this.repeatInterval = interval || 100;

    if (this.onConnectCalled) {
      this.loop();
    }
    this.showOffLine();
  }

  _callOnConnect() {
    super._callOnConnect();
    this.loop();
  }

  async loop() {
    if (typeof this.looper === 'function') {
      let prom = this.looper();
      if (prom instanceof Promise) {
        await prom;
      }
      setTimeout(this.loop.bind(this), this.repeatInterval || 100);
    }
  }

  wsOnClose() {
    super.wsOnClose();
    if (this.looper) {
      this.looper = null;
    }
  }

  message(target, message) {
    let targets = [];
    if (typeof target === 'string') {
      targets.push(target);
    } else {
      targets = target;
    }
    this.send({
      message: {
        to: targets,
        data: message,
      },
    });
  }

  notifyToModule(obj) {
    super.notifyToModule(obj);
    // notify messaging
    if (typeof obj.message === 'object' && this.onmessage) {
      this.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof obj.debug === 'object') {
      if (obj.debug.warning) {
        let msg = 'Warning: ' + obj.debug.warning.message;
        this.warning({ alert: 'warning', message: msg });
      }

      if (obj.debug.error) {
        let msg = 'Error: ' + obj.debug.error.message;
        this.error({ alert: 'error', message: msg });
      }
      if (this.ondebug) {
        this.ondebug(obj.debug);
      }
    }
  }

  warning(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === 'object' && msg.alert) {
        this.showAlertUI(msg);
        console.log(msg.message);
        return;
      }
      if (typeof showObnizDebugError === 'function') {
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
      if (msg && typeof msg === 'object' && msg.alert) {
        this.showAlertUI(msg);
        msg = msg.message;
      }
      if (typeof showObnizDebugError === 'function') {
        showObnizDebugError(new Error(msg));
        console.error(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  /**
   *
   * @returns {ObnizApi}
   */
  static get api() {
    return ObnizApi;
  }
}

module.exports = Obniz;

/*===================*/
/* Utils */
/*===================*/
if (!isNode) {
  if (window && window.parent && window.parent.userAppLoaded) {
    window.parent.userAppLoaded(window);
  }

  function showObnizDebugError(err) {//eslint-disable-line
    if (window.parent && window.parent.logger) {
      window.parent.logger.onObnizError(err);
    } else {
      throw err;
    }
  }
}

/*===================*/
/* ReadParts */
/*===================*/

__webpack_require__("./obniz sync recursive").context = __webpack_require__("./obniz/libs/webpackReplace/require-context-browser.js");
if (__webpack_require__("./obniz sync recursive").context && __webpack_require__("./obniz sync recursive").context.setBaseDir) {
  __webpack_require__("./obniz sync recursive").context.setBaseDir(__dirname);
}

let context = __webpack_require__("./parts sync recursive \\.js$");
/* webpack loader */
for (let path of context.keys()) {
  const anParts = context(path);
  if (anParts.info) {
    Obniz.PartsRegistrate(anParts);
  }
}

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./obniz/libs/embeds/ble/ble.js":
/***/ (function(module, exports, __webpack_require__) {

const BlePeripheral = __webpack_require__("./obniz/libs/embeds/ble/blePeripheral.js");
const BleService = __webpack_require__("./obniz/libs/embeds/ble/bleService.js");
const BleCharacteristic = __webpack_require__("./obniz/libs/embeds/ble/bleCharacteristic.js");
const BleDescriptor = __webpack_require__("./obniz/libs/embeds/ble/bleDescriptor.js");
const BleRemotePeripheral = __webpack_require__("./obniz/libs/embeds/ble/bleRemotePeripheral.js");
const BleAdvertisement = __webpack_require__("./obniz/libs/embeds/ble/bleAdvertisement.js");
const BleScan = __webpack_require__("./obniz/libs/embeds/ble/bleScan.js");

class ObnizBLE {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.remotePeripherals = [];

    this.service = BleService;
    this.characteristic = BleCharacteristic;
    this.descriptor = BleDescriptor;
    this.peripheral = new BlePeripheral(Obniz);

    this.scanTarget = null;

    this.advertisement = new BleAdvertisement(Obniz);
    this.scan = new BleScan(Obniz);
    this._reset();
  }

  _reset() {}

  findPeripheral(address) {
    for (let key in this.remotePeripherals) {
      if (this.remotePeripherals[key].address === address) {
        return this.remotePeripherals[key];
      }
    }
    return null;
  }

  notified(obj) {
    if (obj.scan_result) {
      let val = this.findPeripheral(obj.scan_result.address);
      if (!val) {
        val = new BleRemotePeripheral(this.Obniz, obj.scan_result.address);
        this.remotePeripherals.push(val);
      }
      val.discoverdOnRemote = true;
      val.setParams(obj.scan_result);

      this.scan.notifyFromServer('onfind', val);
    }

    if (obj.scan_result_finish) {
      this.scan.notifyFromServer('onfinish');
    }

    let remotePeripheralCallbackFunc = function(val, func, type) {
      let obj = null;
      if (val === undefined) return;
      let p = this.findPeripheral(val.address);
      if (!p) {
        return;
      }
      if (type === 'peripheral') {
        obj = p;
      } else if (type === 'service') {
        obj = p.findService(val);
      } else if (type === 'characteristic') {
        obj = p.findCharacteristic(val);
      } else if (type === 'descriptor') {
        obj = p.findDescriptor(val);
      }
      if (!obj) {
        return;
      }
      func(val, obj);
    }.bind(this);

    const paramList = {
      status_update: { name: 'statusupdate', obj: 'peripheral' },
      get_service_result: { name: 'discover', obj: 'peripheral' },
      get_service_result_finish: {
        name: 'discoverfinished',
        obj: 'peripheral',
      },
      get_characteristic_result: { name: 'discover', obj: 'service' },
      get_characteristic_result_finish: {
        name: 'discoverfinished',
        obj: 'service',
      },
      write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
      read_characteristic_result: { name: 'onread', obj: 'characteristic' },
      register_notify_characteristic_result: {
        name: 'onregisternotify',
        obj: 'characteristic',
      },
      unregister_notify_characteristic_result: {
        name: 'onunregisternotify',
        obj: 'characteristic',
      },
      nofity_characteristic: { name: 'onnotify', obj: 'characteristic' },
      get_descriptor_result: { name: 'discover', obj: 'characteristic' },
      get_descriptor_result_finish: {
        name: 'discoverfinished',
        obj: 'characteristic',
      },
      write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
      read_descriptor_result: { name: 'onread', obj: 'descriptor' },
    };

    for (let key in paramList) {
      remotePeripheralCallbackFunc(
        obj[key],
        function(val, bleobj) {
          bleobj.notifyFromServer(paramList[key].name, val);
        }.bind(this),
        paramList[key].obj
      );
    }

    let callbackFunc = function(val, func, type) {
      let obj = null;
      if (val === undefined) return;
      if (type === 'peripheral') {
        obj = this.peripheral;
      } else if (type === 'service') {
        obj = this.peripheral.getService(val);
      } else if (type === 'characteristic') {
        obj = this.peripheral.findCharacteristic(val);
      } else if (type === 'descriptor') {
        obj = this.peripheral.findDescriptor(val);
      }
      if (!obj) {
        return;
      }
      func(val, obj);
    }.bind(this);

    if (obj.peripheral) {
      callbackFunc(
        obj.peripheral.connection_status,
        function(val) {
          this.peripheral.onconnectionupdates(val);
        }.bind(this),
        'peripheral'
      );

      const paramList = {
        read_characteristic_result: { name: 'onread', obj: 'characteristic' },
        write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
        notify_read_characteristic: {
          name: 'onreadfromremote',
          obj: 'characteristic',
        },
        notify_write_characteristic: {
          name: 'onwritefromremote',
          obj: 'characteristic',
        },
        read_descriptor_result: { name: 'onread', obj: 'descriptor' },
        write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
        notify_read_descriptor: { name: 'onreadfromremote', obj: 'descriptor' },
        notify_write_descriptor: {
          name: 'onwritefromremote',
          obj: 'descriptor',
        },
      };

      for (let key in paramList) {
        callbackFunc(
          obj.peripheral[key],
          function(val, bleobj) {
            bleobj.notifyFromServer(paramList[key].name, val);
          }.bind(this),
          paramList[key].obj
        );
      }
    }

    if (obj.error) {
      let params = obj.error;
      let handled = false;
      let peripheral, target;
      if (!params.address) {
        peripheral = this.peripheral;
      } else {
        peripheral = this.findPeripheral(params.address);
      }

      if (peripheral) {
        if (
          params.service_uuid &&
          params.characteristic_uuid &&
          params.descriptor_uuid
        ) {
          target = peripheral.findDescriptor(params);
        } else if (params.service_uuid && params.characteristic_uuid) {
          target = peripheral.findCharacteristic(params);
        } else if (params.service_uuid) {
          target = peripheral.findService(params);
        }
        if (target) {
          target.notifyFromServer('onerror', params);
          handled = true;
        } else {
          peripheral.onerror(params);
          handled = true;
        }
      }

      if (!handled) {
        this.Obniz.error(
          `ble ${params.message} service=${
            params.service_uuid
          } characteristic_uuid=${params.characteristic_uuid} descriptor_uuid=${
            params.descriptor_uuid
          }`
        );
      }
    }
  }

  static _dataArray2uuidHex(data, reverse) {
    let uuid = [];
    for (let i = 0; i < data.length; i++) {
      uuid.push(('00' + data[i].toString(16).toLowerCase()).slice(-2));
    }
    if (reverse) {
      uuid = uuid.reverse();
    }
    let str = uuid.join('');
    if (uuid.length >= 16) {
      str =
        str.slice(0, 8) +
        '-' +
        str.slice(8, 12) +
        '-' +
        str.slice(12, 16) +
        '-' +
        str.slice(16, 20) +
        '-' +
        str.slice(20);
    }
    return str;
  }
}

module.exports = ObnizBLE;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleAdvertisement.js":
/***/ (function(module, exports, __webpack_require__) {

const Builder = __webpack_require__("./obniz/libs/embeds/ble/bleAdvertisementBuilder.js");

class BleAdvertisement {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.adv_data = [];
    this.scan_resp = [];
  }

  start() {
    let obj = {};
    obj['ble'] = {};
    obj['ble']['advertisement'] = {
      adv_data: this.adv_data,
    };

    if (this.scan_resp.length > 0) {
      obj['ble']['advertisement']['scan_resp'] = this.scan_resp;
    }

    this.Obniz.send(obj);
  }

  end() {
    let obj = {};
    obj['ble'] = {};
    obj['ble']['advertisement'] = null;
    this.Obniz.send(obj);
  }

  setAdvDataRaw(adv_data) {
    this.adv_data = adv_data;
  }

  setAdvData(json) {
    let builder = this.advDataBulider(json);
    this.setAdvDataRaw(builder.build());
  }

  advDataBulider(jsonVal) {
    return new Builder(this.Obniz, jsonVal);
  }

  scanRespDataBuilder(json) {
    return new Builder(this.Obniz, json);
  }

  setScanRespDataRaw(scan_resp) {
    this.scan_resp = scan_resp;
  }

  setScanRespData(json) {
    this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
  }
}

module.exports = BleAdvertisement;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleAdvertisementBuilder.js":
/***/ (function(module, exports) {

class BleAdvertisementBuilder {
  constructor(Obniz, json) {
    this.Obniz = Obniz;
    this.rows = {};

    if (json) {
      if (json.localName) {
        this.setCompleteLocalName(json.localName);
      }
      if (
        json.manufacturerData &&
        json.manufacturerData.companyCode &&
        json.manufacturerData.data
      ) {
        this.setManufacturerSpecificData(
          json.manufacturerData.companyCode,
          json.manufacturerData.data
        );
      }
      if (json.serviceUuids) {
        for (let uuid of json.serviceUuids) {
          this.setUuid(uuid);
        }
      }
    }
    if (typeof this.extendEvalJson === 'function') {
      this.extendEvalJson(json);
    }
  }

  setRow(type, data) {
    this.rows[type] = data;
  }

  getRow(type) {
    return this.rows[type] || [];
  }

  build() {
    let data = [];
    for (let key in this.rows) {
      if (this.rows[key].length === 0) continue;

      data.push(this.rows[key].length + 1);
      data.push(parseInt(key));
      Array.prototype.push.apply(data, this.rows[key]);
    }
    if (data.length > 31) {
      this.Obniz.error(
        'Too large data. Advertise/ScanResponse data are must be less than 32 byte.'
      );
    }

    return data;
  }

  setStringData(type, string) {
    let data = [];

    for (let i = 0; i < string.length; i++) {
      data.push(string.charCodeAt(i));
    }

    this.setRow(type, data);
  }

  setShortenedLocalName(name) {
    this.setStringData(0x08, name);
  }

  setCompleteLocalName(name) {
    this.setStringData(0x09, name);
  }

  setManufacturerSpecificData(companyCode, data) {
    let row = [];
    row.push(companyCode & 0xff);
    row.push((companyCode >> 8) & 0xff);
    Array.prototype.push.apply(row, data);
    this.setRow(0xff, row);
  }

  setUuid(uuid) {
    let uuidData = this.convertUuid(uuid);
    let type = { 16: 0x06, 4: 0x04, 2: 0x02 }[uuidData.length];
    this.setRow(type, uuidData);
  }

  convertUuid(uuid) {
    let uuidNumeric = uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
    if (
      uuidNumeric.length !== 32 &&
      uuidNumeric.length !== 8 &&
      uuidNumeric.length !== 4
    ) {
      this.Obniz.error(
        'BLE uuid must be 16/32/128 bit . (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb for 128bit)'
      );
    }

    let data = [];
    for (let i = uuidNumeric.length; i > 1; i -= 2) {
      data.push(parseInt(uuidNumeric[i - 2] + uuidNumeric[i - 1], 16));
    }
    return data;
  }

  setIbeaconData(uuid, major, minor, txPower) {
    let data = [];
    data.push(0x02, 0x15); // fixed data

    let uuidData = this.convertUuid(uuid);
    Array.prototype.push.apply(data, uuidData);

    data.push((major >> 8) & 0xff);
    data.push((major >> 0) & 0xff);
    data.push((minor >> 8) & 0xff);
    data.push((minor >> 0) & 0xff);
    data.push((txPower >> 0) & 0xff);

    this.setManufacturerSpecificData(0x004c, data);
    return;
  }

  extendEvalJson(json) {
    if (json) {
      if (json.flags) {
        if (json.flags.includes('limited_discoverable_mode'))
          this.setLeLimitedDiscoverableModeFlag();
        if (json.flags.includes('general_discoverable_mode'))
          this.setLeGeneralDiscoverableModeFlag();
        if (json.flags.includes('br_edr_not_supported'))
          this.setBrEdrNotSupportedFlag();
        if (json.flags.includes('le_br_edr_controller'))
          this.setLeBrEdrControllerFlag();
        if (json.flags.includes('le_br_edr_host')) this.setLeBrEdrHostFlag();
      }
    }
  }

  setFlags(flag) {
    let data = this.getRow(0x01);
    data[0] = (data[0] || 0) | flag;
    this.setRow(0x01, data);
  }

  setLeLimitedDiscoverableModeFlag() {
    this.setFlags(0x01);
  }

  setLeGeneralDiscoverableModeFlag() {
    this.setFlags(0x02);
  }

  setBrEdrNotSupportedFlag() {
    this.setFlags(0x04);
  }

  setLeBrEdrControllerFlag() {
    this.setFlags(0x08);
  }

  setLeBrEdrHostFlag() {
    this.setFlags(0x10);
  }
}

module.exports = BleAdvertisementBuilder;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleAttributeAbstract.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");
const emitter = __webpack_require__("./node_modules/eventemitter3/index.js");

class BleAttributeAbstract {
  constructor(params) {
    this.uuid = params.uuid.toLowerCase();
    this.parent = null;
    this.children = [];

    this.isRemote = false;
    this.discoverdOnRemote = false;

    this.data = params.data || null;
    if (!this.data && params.text) {
      this.data = ObnizUtil.string2dataArray(params.text);
    }
    if (!this.data && params.value) {
      this.data = [params.value];
    }

    if (params[this.childrenName]) {
      for (let child of params[this.childrenName]) {
        this.addChild(child);
      }
    }

    this.setFunctions();

    this.emitter = new emitter();
  }

  setFunctions() {
    let childrenName = this.childrenName;
    if (childrenName) {
      childrenName =
        childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
      let childName = childrenName.slice(0, -1);

      let funcName = 'add' + childName;
      this[funcName] = this.addChild;

      funcName = 'get' + childName;
      this[funcName] = this.getChild;
    }

    let parentName = this.parentName;
    if (parentName) {
      Object.defineProperty(this, parentName, {
        get() {
          return this.parent;
        },
        set(newValue) {
          this.parent = newValue;
        },
      });
    }
  }

  get childrenClass() {
    return Object;
  }
  get childrenName() {
    return null;
  }
  get parentName() {
    return null;
  }

  addChild(child) {
    if (!(child instanceof this.childrenClass)) {
      let childrenClass = this.childrenClass;
      child = new childrenClass(child);
    }
    child.parent = this;

    this.children.push(child);
    return child;
  }

  getChild(uuid) {
    return this.children
      .filter(function(element) {
        return element.uuid.toLowerCase() === uuid.toLowerCase();
      })
      .shift();
  }

  toJSON() {
    let obj = { uuid: this.uuid.toLowerCase() };

    if (this.children.length > 0) {
      let key = this.childrenName;
      obj[key] = this.children;
    }
    if (this.data) {
      obj.data = this.data;
    }
    return obj;
  }

  /**
   * WS COMMANDS
   */

  read() {}
  write() {}

  writeNumber(val) {
    this.write([val]);
  }

  writeText(str) {
    this.write(ObnizUtil.string2dataArray(str));
  }

  readWait() {
    return new Promise(resolve => {
      this.emitter.once('onread', params => {
        if (params.result === 'success') {
          resolve(params.data);
        } else {
          resolve(undefined);
        }
      });
      this.read();
    });
  }

  writeWait(data) {
    return new Promise(resolve => {
      this.emitter.once('onwrite', params => {
        resolve(params.result === 'success');
      });
      this.write(data);
    });
  }

  writeTextWait(data) {
    return new Promise(resolve => {
      this.emitter.once('onwrite', params => {
        resolve(params.result === 'success');
      });
      this.writeText(data);
    });
  }

  writeNumberWait(data) {
    return new Promise(resolve => {
      this.emitter.once('onwrite', params => {
        resolve(params.result === 'success');
      });
      this.writeNumber(data);
    });
  }

  readFromRemoteWait() {
    return new Promise(resolve => {
      this.emitter.once('onreadfromremote', () => {
        resolve();
      });
    });
  }

  writeFromRemoteWait() {
    return new Promise(resolve => {
      this.emitter.once('onreadfromremote', params => {
        resolve(params.data);
      });
    });
  }

  /**
   * CALLBACKS
   */
  onwrite() {}
  onread() {}
  onwritefromremote() {}
  onreadfromremote() {}

  onerror(err) {
    console.error(err.message);
  }

  notifyFromServer(notifyName, params) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case 'onerror': {
        this.onerror(params);
        break;
      }
      case 'onwrite': {
        this.onwrite(params.result);
        break;
      }
      case 'onread': {
        this.onread(params.data);
        break;
      }
      case 'onwritefromremote': {
        this.onwritefromremote(params.address, params.data);
        break;
      }
      case 'onreadfromremote': {
        this.onreadfromremote(params.address);
        break;
      }
    }
  }
}

module.exports = BleAttributeAbstract;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleCharacteristic.js":
/***/ (function(module, exports, __webpack_require__) {

const BleDescriptor = __webpack_require__("./obniz/libs/embeds/ble/bleDescriptor.js");
const BleAttributeAbstract = __webpack_require__("./obniz/libs/embeds/ble/bleAttributeAbstract.js");

class BleCharacteristic extends BleAttributeAbstract {
  constructor(obj) {
    super(obj);

    this.addDescriptor = this.addChild;
    this.getDescriptor = this.getChild;

    this.properties = obj.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName() {
    return 'service';
  }

  get childrenClass() {
    return BleDescriptor;
  }

  get childrenName() {
    return 'descriptors';
  }

  toJSON() {
    let obj = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  addProperty(param) {
    if (!this.properties.includes(param)) {
      this.properties.push(param);
    }
  }

  removeProperty(param) {
    this.properties = this.properties.filter(elm => {
      return elm !== param;
    });
  }

  addPermission(param) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  removePermission(param) {
    this.permissions = this.permissions.filter(elm => {
      return elm !== param;
    });
  }

  write(data) {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          write_characteristic: {
            service_uuid: this.service.uuid.toLowerCase(),
            characteristic_uuid: this.uuid.toLowerCase(),
            data: data,
          },
        },
      },
    });
  }

  read() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_characteristic: {
            service_uuid: this.service.uuid.toLowerCase(),
            characteristic_uuid: this.uuid.toLowerCase(),
          },
        },
      },
    });
  }

  notify() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          notify_characteristic: {
            service_uuid: this.service.uuid.toLowerCase(),
            characteristic_uuid: this.uuid.toLowerCase(),
          },
        },
      },
    });
  }
}

module.exports = BleCharacteristic;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleDescriptor.js":
/***/ (function(module, exports, __webpack_require__) {

const BleAttributeAbstract = __webpack_require__("./obniz/libs/embeds/ble/bleAttributeAbstract.js");

class BleDescriptor extends BleAttributeAbstract {
  constructor(obj) {
    super(obj);

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName() {
    return 'characteristic';
  }

  addPermission(param) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  removePermission(param) {
    this.permissions = this.permissions.filter(elm => {
      return elm !== param;
    });
  }

  toJSON() {
    let obj = super.toJSON();

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
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
            data: dataArray,
          },
        },
      },
    });
  }

  read() {
    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_descriptor: {
            service_uuid: this.characteristic.service.uuid.toLowerCase(),
            characteristic_uuid: this.characteristic.uuid.toLowerCase(),
            descriptor_uuid: this.uuid,
          },
        },
      },
    });
  }
}

module.exports = BleDescriptor;


/***/ }),

/***/ "./obniz/libs/embeds/ble/blePeripheral.js":
/***/ (function(module, exports, __webpack_require__) {

const BleService = __webpack_require__("./obniz/libs/embeds/ble/bleService.js");

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
    if (json['services']) {
      for (let service of json['services']) {
        this.addService(service);
      }
    }
  }

  getService(uuid) {
    uuid = uuid.toLowerCase();
    return this.services
      .filter(function(element) {
        return element.uuid.toLowerCase() === uuid;
      })
      .shift();
  }

  removeService(uuid) {
    this.services = this.services.filter(function(element) {
      return element.uuid.toLowerCase() !== uuid;
    });
  }

  stopAllService() {
    this.Obniz.send({
      ble: {
        peripheral: null,
      },
    });
    this.services = [];
  }

  toJSON() {
    return {
      services: this.services,
    };
  }

  findCharacteristic(param) {
    let serviceUuid = param.service_uuid.toLowerCase();
    let characteristicUuid = param.characteristic_uuid.toLowerCase();
    let s = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  findDescriptor(param) {
    let descriptorUuid = param.descriptor_uuid.toLowerCase();
    let c = this.findCharacteristic(param);
    if (c) {
      return c.getDescriptor(descriptorUuid);
    }
    return null;
  }

  end() {
    this.Obniz.send({ ble: { peripheral: null } });
  }

  onconnectionupdates() {}

  onerror() {}
}

module.exports = BlePeripheral;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js":
/***/ (function(module, exports, __webpack_require__) {

const BleAttributeAbstract = __webpack_require__("./obniz/libs/embeds/ble/bleAttributeAbstract.js");

class BleRemoteAttributeAbstract extends BleAttributeAbstract {
  constructor(params) {
    super(params);

    this.isRemote = false;
    this.discoverdOnRemote = false;
  }

  get wsChildUuidName() {
    let childrenName = this.childrenName;
    if (!childrenName) {
      return null;
    }
    let childName = childrenName.slice(0, -1);
    return childName + '_uuid';
  }

  getChild(uuid) {
    let obj = super.getChild(uuid);
    if (!obj) {
      obj = this.addChild({ uuid });
    }
    return obj;
  }

  discoverChildren() {}

  discoverChildrenWait() {
    return new Promise(resolve => {
      this.emitter.once('discoverfinished', () => {
        let children = this.children.filter(elm => {
          return elm.discoverdOnRemote;
        });
        resolve(children);
      });
      this.discoverChildren();
    });
  }

  /**
   * CALLBACKS
   */
  ondiscover() {}

  ondiscoverfinished() {}

  notifyFromServer(notifyName, params) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case 'discover': {
        let child = this.getChild(params[this.wsChildUuidName]);
        child.discoverdOnRemote = true;
        child.properties = params.properties || [];
        this.ondiscover(child);
        break;
      }
      case 'discoverfinished': {
        let children = this.children.filter(elm => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverfinished(children);
        break;
      }
    }
  }
}

module.exports = BleRemoteAttributeAbstract;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemoteCharacteristic.js":
/***/ (function(module, exports, __webpack_require__) {

const BleRemoteDescriptor = __webpack_require__("./obniz/libs/embeds/ble/bleRemoteDescriptor.js");
const BleRemoteAttributeAbstract = __webpack_require__("./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js");

class BleRemoteCharacteristic extends BleRemoteAttributeAbstract {
  constructor(params) {
    super(params);

    this.properties = params.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }
  }

  get parentName() {
    return 'service';
  }

  get childrenClass() {
    return BleRemoteDescriptor;
  }

  get childrenName() {
    return 'descriptors';
  }

  addDescriptor(params) {
    return this.addChild(params);
  }

  //
  // getCharacteristic(params) {
  //   return this.getChild(params)
  // }

  getDescriptor(uuid) {
    let obj = this.getChild(uuid);
    if (obj) {
      return obj;
    }
    let newCharacteristic = new BleRemoteDescriptor(this.Obniz, this, uuid);
    this.addChild(newCharacteristic);
    return newCharacteristic;
  }

  registerNotify(callback) {
    this.onnotify = callback;
    const obj = {
      ble: {
        register_notify_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: this.service.uuid,
          characteristic_uuid: this.uuid,
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  unregisterNotify() {
    this.onnotify = function() {};
    const obj = {
      ble: {
        unregister_notify_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: this.service.uuid,
          characteristic_uuid: this.uuid,
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  read() {
    const obj = {
      ble: {
        read_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: this.service.uuid,
          characteristic_uuid: this.uuid,
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  write(array) {
    const obj = {
      ble: {
        write_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: this.service.uuid,
          characteristic_uuid: this.uuid,
          data: array,
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  discoverChildren() {
    const obj = {
      ble: {
        get_descriptors: {
          address: this.service.peripheral.address,
          service_uuid: this.service.uuid,
          characteristic_uuid: this.uuid,
        },
      },
    };
    this.service.peripheral.Obniz.send(obj);
  }

  discoverAllDescriptors() {
    return this.discoverChildren();
  }

  discoverAllDescriptorsWait() {
    return this.discoverChildrenWait();
  }

  toJSON() {
    let obj = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }
    return obj;
  }

  canBroadcast() {
    return this.properties.includes('broadcast');
  }

  canNotify() {
    return this.properties.includes('notify');
  }

  canRead() {
    return this.properties.includes('read');
  }

  canWrite() {
    return this.properties.includes('write');
  }

  canWriteWithoutResponse() {
    return this.properties.includes('write_without_response');
  }

  canIndicate() {
    return this.properties.includes('indicate');
  }

  ondiscover(descriptor) {
    this.ondiscoverdescriptor(descriptor);
  }

  ondiscoverfinished(descriptors) {
    this.ondiscoverdescriptorfinished(descriptors);
  }

  ondiscoverdescriptor() {}

  ondiscoverdescriptorfinished() {}

  onregisternofity() {}

  onunregisternofity() {}

  onnotify() {}

  notifyFromServer(notifyName, params) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case 'onregisternofity': {
        this.onregisternofity();
        break;
      }
      case 'onunregisternofity': {
        this.onunregisternofity();
        break;
      }
      case 'onnotify': {
        this.onnotify();
        break;
      }
    }
  }
}

module.exports = BleRemoteCharacteristic;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemoteDescriptor.js":
/***/ (function(module, exports, __webpack_require__) {

const BleRemoteAttributeAbstract = __webpack_require__("./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js");

class BleRemoteDescriptor extends BleRemoteAttributeAbstract {
  constructor(params) {
    super(params);
  }

  get parentName() {
    return 'characteristic';
  }

  read() {
    const obj = {
      ble: {
        read_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: this.characteristic.service.uuid,
          characteristic_uuid: this.characteristic.uuid,
          descriptor_uuid: this.uuid,
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }

  write(array) {
    const obj = {
      ble: {
        write_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: this.characteristic.service.uuid,
          characteristic_uuid: this.characteristic.uuid,
          descriptor_uuid: this.uuid,
          data: array,
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }
}

module.exports = BleRemoteDescriptor;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemotePeripheral.js":
/***/ (function(module, exports, __webpack_require__) {

const BleRemoteService = __webpack_require__("./obniz/libs/embeds/ble/bleRemoteService.js");
const emitter = __webpack_require__("./node_modules/eventemitter3/index.js");

class BleRemotePeripheral {
  constructor(Obniz, address) {
    this.Obniz = Obniz;
    this.address = address;
    this.connected = false;

    this.device_type = null;
    this.address_type = null;
    this.ble_event_type = null;
    this.rssi = null;
    this.adv_data = null;
    this.scan_resp = null;

    this.keys = [
      'device_type',
      'address_type',
      'ble_event_type',
      'rssi',
      'adv_data',
      'scan_resp',
    ];

    this.services = [];
    this.emitter = new emitter();
  }

  /**
   *
   * @return {String} json value
   */
  toString() {
    return JSON.stringify({
      address: this.address,
      addressType: this.address_type,
      advertisement: this.adv_data,
      scanResponse: this.scan_resp,
      rssi: this.rssi,
    });
  }

  setParams(dic) {
    this.advertise_data_rows = null;
    for (let key in dic) {
      if (dic.hasOwnProperty(key) && this.keys.includes(key)) {
        this[key] = dic[key];
      }
    }
    this.analyseAdvertisement();
  }

  analyseAdvertisement() {
    if (!this.advertise_data_rows) {
      this.advertise_data_rows = [];
      if (this.adv_data) {
        for (let i = 0; i < this.adv_data.length; i++) {
          let length = this.adv_data[i];
          let arr = new Array(length);
          for (let j = 0; j < length; j++) {
            arr[j] = this.adv_data[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
      if (this.scan_resp) {
        for (let i = 0; i < this.scan_resp.length; i++) {
          let length = this.scan_resp[i];
          let arr = new Array(length);
          for (let j = 0; j < length; j++) {
            arr[j] = this.scan_resp[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
      this.setLocalName();
      this.setIBeacon();
    }
  }

  searchTypeVal(type) {
    this.analyseAdvertisement();
    for (let i = 0; i < this.advertise_data_rows.length; i++) {
      if (this.advertise_data_rows[i][0] === type) {
        let results = [].concat(this.advertise_data_rows[i]);
        results.shift();
        return results;
      }
    }
    return undefined;
  }

  setLocalName() {
    let data = this.searchTypeVal(0x09);
    if (!data) {
      data = this.searchTypeVal(0x08);
    }
    if (!data) {
      this.localName = null;
    } else {
      this.localName = String.fromCharCode.apply(null, data);
    }
  }

  setIBeacon() {
    let data = this.searchTypeVal(0xff);
    if (
      !data ||
      data[0] !== 0x4c ||
      data[1] !== 0x00 ||
      data[2] !== 0x02 ||
      data[3] !== 0x15 ||
      data.length !== 25
    ) {
      this.iBeacon = null;
      return;
    }
    let uuidData = data.slice(4, 20);
    let uuid = '';
    for (let i = 0; i < uuidData.length; i++) {
      uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
      if (
        i === 4 - 1 ||
        i === 4 + 2 - 1 ||
        i === 4 + 2 * 2 - 1 ||
        i === 4 + 2 * 3 - 1
      ) {
        uuid += '-';
      }
    }

    let major = (data[20] << 8) + data[21];
    let minor = (data[22] << 8) + data[23];
    let power = data[24];

    this.iBeacon = {
      uuid: uuid,
      major: major,
      minor: minor,
      power: power,
      rssi: this.rssi,
    };
  }

  _addServiceUuids(results, data, bit) {
    if (!data) return;
    let uuidLength = bit / 4;
    for (let i = 0; i < data.length; i = i + uuidLength) {
      let one = data.slice(i, i + uuidLength);
      results.push(this.Obniz.ble.constructor._dataArray2uuidHex(one, true));
    }
  }

  advertisementServiceUuids() {
    let results = [];
    this._addServiceUuids(results, this.searchTypeVal(0x02), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x03), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x04), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x05), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x06), 64);
    this._addServiceUuids(results, this.searchTypeVal(0x07), 64);
    return results;
  }

  connect() {
    let obj = {
      ble: {
        connect: {
          address: this.address,
        },
      },
    };
    this.Obniz.send(obj);
  }

  connectWait() {
    return new Promise(resolve => {
      this.emitter.once('statusupdate', params => {
        resolve(params.status === 'connected');
      });
      this.connect();
    });
  }

  disconnect() {
    let obj = {
      ble: {
        disconnect: {
          address: this.address,
        },
      },
    };
    this.Obniz.send(obj);
  }

  disconnectWait() {
    return new Promise(resolve => {
      this.emitter.once('statusupdate', params => {
        resolve(params.status === 'disconnected');
      });
      this.disconnect();
    });
  }

  getService(uuid) {
    uuid = uuid.toLowerCase();
    for (let key in this.services) {
      if (this.services[key].uuid === uuid) {
        return this.services[key];
      }
    }
    let newService = new BleRemoteService({ uuid });
    newService.parent = this;
    this.services.push(newService);
    return newService;
  }

  findService(param) {
    let serviceUuid = param.service_uuid.toLowerCase();
    return this.getService(serviceUuid);
  }

  findCharacteristic(param) {
    let serviceUuid = param.service_uuid.toLowerCase();
    let characteristicUuid = param.characteristic_uuid.toLowerCase();
    let s = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  findDescriptor(param) {
    let descriptorUuid = param.descriptor_uuid.toLowerCase();
    let c = this.findCharacteristic(param);
    if (c) {
      return c.getDescriptor(descriptorUuid);
    }
    return null;
  }

  discoverAllServices() {
    let obj = {
      ble: {
        get_services: {
          address: this.address,
        },
      },
    };
    this.Obniz.send(obj);
  }

  discoverAllServicesWait() {
    return new Promise(resolve => {
      this.emitter.once('discoverfinished', () => {
        let children = this.services.filter(elm => {
          return elm.discoverdOnRemote;
        });
        resolve(children);
      });
      this.discoverAllServices();
    });
  }

  onconnect() {}

  ondisconnect() {}

  ondiscoverservice() {}

  ondiscoverservicefinished() {}

  ondiscover() {}

  ondiscoverfinished() {}

  notifyFromServer(notifyName, params) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case 'statusupdate': {
        if (params.status === 'connected') {
          this.connected = true;
          this.onconnect();
        }
        if (params.status === 'disconnected') {
          this.connected = false;
          this.ondisconnect();
        }
        break;
      }
      case 'discover': {
        let child = this.getService(params.service_uuid);
        child.discoverdOnRemote = true;
        this.ondiscoverservice(child);
        break;
      }
      case 'discoverfinished': {
        let children = this.services.filter(elm => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverservicefinished(children);
        break;
      }
    }
  }

  onerror() {}
}

module.exports = BleRemotePeripheral;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleRemoteService.js":
/***/ (function(module, exports, __webpack_require__) {

const BleRemoteCharacteristic = __webpack_require__("./obniz/libs/embeds/ble/bleRemoteCharacteristic.js");
const BleRemoteAttributeAbstract = __webpack_require__("./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js");

class BleRemoteService extends BleRemoteAttributeAbstract {
  constructor(obj) {
    super(obj);
  }

  get parentName() {
    return 'peripheral';
  }

  get childrenClass() {
    return BleRemoteCharacteristic;
  }

  get childrenName() {
    return 'characteristics';
  }

  addCharacteristic(params) {
    return this.addChild(params);
  }

  getCharacteristic(params) {
    return this.getChild(params);
  }

  discoverAllCharacteristics() {
    return this.discoverChildren();
  }

  discoverAllCharacteristicsWait() {
    return this.discoverChildrenWait();
  }

  discoverChildren() {
    const obj = {
      ble: {
        get_characteristics: {
          address: this.peripheral.address,
          service_uuid: this.uuid,
        },
      },
    };
    this.parent.Obniz.send(obj);
  }

  ondiscover(characteristic) {
    this.ondiscovercharacteristic(characteristic);
  }

  ondiscoverfinished(characteristics) {
    this.ondiscovercharacteristicfinished(characteristics);
  }

  ondiscovercharacteristic() {}

  ondiscovercharacteristicfinished() {}
}

module.exports = BleRemoteService;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleScan.js":
/***/ (function(module, exports, __webpack_require__) {

const emitter = __webpack_require__("./node_modules/eventemitter3/index.js");

class BleScan {
  constructor(Obniz) {
    this.scanTarget = null;
    this.Obniz = Obniz;
    this.emitter = new emitter();

    this.scanedPeripherals = [];
  }

  start(target, settings) {
    let obj = {};
    obj['ble'] = {};
    obj['ble']['scan'] = {
      //    "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
      //    "interval" : settings && settings.interval ? settings.interval : 30,
      duration: settings && settings.duration ? settings.duration : 30,
    };

    this.scanTarget = target;
    if (
      this.scanTarget &&
      this.scanTarget.uuids &&
      Array.isArray(this.scanTarget.uuids)
    ) {
      this.scanTarget.uuids = this.scanTarget.uuids.map(elm => {
        return elm.replace(/-/g, '').toLowerCase();
      });
    }
    this.scanedPeripherals = [];
    this.Obniz.send(obj);
  }

  startOneWait(target, settings) {
    let state = 0;

    return new Promise(resolve => {
      this.emitter.once('onfind', param => {
        if (state === 0) {
          state = 1;
          this.end();
          resolve(param);
        }
      });

      this.emitter.once('onfinish', () => {
        if (state === 0) {
          state = 1;
          resolve(null);
        }
      });

      this.start(target, settings);
    });
  }

  startAllWait(target, settings) {
    return new Promise(resolve => {
      this.emitter.once('onfinish', () => {
        resolve(this.scanedPeripherals);
      });

      this.start(target, settings);
    });
  }

  end() {
    let obj = {};
    obj['ble'] = {};
    obj['ble']['scan'] = null;
    this.Obniz.send(obj);
  }

  isTarget(peripheral) {
    if (
      this.scanTarget &&
      this.scanTarget.localName &&
      peripheral.localName !== this.scanTarget.localName
    ) {
      return false;
    }
    if (this.scanTarget && this.scanTarget.uuids) {
      let uuids = peripheral.advertisementServiceUuids().map(e => {
        return e.replace(/-/g, '').toLowerCase();
      });
      for (let uuid of this.scanTarget.uuids) {
        if (!uuids.includes(uuid)) {
          return false;
        }
      }
    }
    return true;
  }

  onfinish() {} //dummy
  onfind() {} //dummy

  notifyFromServer(notifyName, params) {
    switch (notifyName) {
      case 'onfind': {
        if (this.isTarget(params)) {
          this.scanedPeripherals.push(params);
          this.emitter.emit(notifyName, params);
          this.onfind(params);
        }
        break;
      }
      case 'onfinish': {
        this.emitter.emit(notifyName, this.scanedPeripherals);
        this.onfinish(this.scanedPeripherals);
        break;
      }
    }
  }
}

module.exports = BleScan;


/***/ }),

/***/ "./obniz/libs/embeds/ble/bleService.js":
/***/ (function(module, exports, __webpack_require__) {

const BleAttributeAbstract = __webpack_require__("./obniz/libs/embeds/ble/bleAttributeAbstract.js");
const BleCharacteristic = __webpack_require__("./obniz/libs/embeds/ble/bleCharacteristic.js");

class BleService extends BleAttributeAbstract {
  constructor(obj) {
    super(obj);

    this.addCharacteristic = this.addChild;
    this.getCharacteristic = this.getChild;
  }

  get parentName() {
    return 'peripheral';
  }

  get childrenName() {
    return 'characteristics';
  }

  get childrenClass() {
    return BleCharacteristic;
  }

  get advData() {
    return {
      flags: ['general_discoverable_mode', 'br_edr_not_supported'],
      serviceUuids: [this.uuid],
    };
  }

  end() {
    this.peripheral.Obniz.send({
      ble: {
        peripheral: {
          stop_service: {
            service_uuid: this.uuid.toLowerCase(),
          },
        },
      },
    });
    this.peripheral.removeService(this.uuid);
  }

  notify(notifyName, params) {
    //nothing
  }
}

module.exports = BleService;


/***/ }),

/***/ "./obniz/libs/embeds/display.js":
/***/ (function(module, exports, __webpack_require__) {

class Display {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.width = 128;
    this.height = 64;

    this._canvas = null;
    this._reset();
  }

  _reset() {
    this._pos = { x: 0, y: 0 };
  }

  warnCanvasAvailability() {
    if (this.Obniz.isNode) {
      throw new Error(
        'obniz.js require node-canvas to draw rich contents. see more detail on docs'
      );
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
        const { createCanvas } = __webpack_require__("./obniz/libs/webpackReplace/canvas.js");
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
        canvas.setAttribute('id', identifier);
        canvas.style.visibility = 'hidden';
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style['-webkit-font-smoothing'] = 'none';
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(canvas);
      }
      this._canvas = canvas;
    }
    const ctx = this._canvas.getContext('2d');
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
      return canvas.getContext('2d');
    }
  }

  font(font, size) {
    const ctx = this._ctx();
    if (typeof size !== 'number') {
      size = 16;
    }
    if (typeof font !== 'string') {
      font = 'Arial';
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
    let obj = {};
    obj['display'] = {
      clear: true,
    };
    this.Obniz.send(obj);
  }

  pos(x, y) {
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
      let obj = {};
      obj['display'] = {
        text: '' + text,
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
    let obj = {};
    obj['display'] = {
      qr: {
        text,
      },
    };
    if (correction) {
      obj['display'].qr.correction = correction;
    }
    this.Obniz.send(obj);
  }

  raw(data) {
    let obj = {};
    obj['display'] = {
      raw: data,
    };
    this.Obniz.send(obj);
  }

  setPinName(io, moduleName, funcName) {
    let obj = {};
    obj['display'] = {};
    obj['display']['pin_assign'] = {};
    obj['display']['pin_assign'][io] = {
      module_name: moduleName,
      pin_name: funcName,
    };

    this.Obniz.send(obj);
  }

  setPinNames(moduleName, data) {
    let obj = {};
    obj['display'] = {};
    obj['display']['pin_assign'] = {};
    let noAssignee = true;
    for (let key in data) {
      noAssignee = false;
      obj['display']['pin_assign'][key] = {
        module_name: moduleName,
        pin_name: data[key],
      };
    }
    if (!noAssignee) {
      this.Obniz.send(obj);
    }
  }

  draw(ctx) {
    const stride = this.width / 8;
    let vram = new Array(stride * 64);
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      let index = parseInt(i / 4);
      let line = parseInt(index / this.width);
      let col = parseInt((index - line * this.width) / 8);
      let bits = parseInt(index - line * this.width) % 8;
      if (bits == 0) vram[line * stride + col] = 0x00;
      if (brightness > 0x7f) vram[line * stride + col] |= 0x80 >> bits;
    }
    this.raw(vram);
  }
}

module.exports = Display;


/***/ }),

/***/ "./obniz/libs/embeds/switch.js":
/***/ (function(module, exports) {

class ObnizSwitch {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this._reset();
  }

  _reset() {
    this.observers = [];
    this.onChangeForStateWait = function() {};
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  getWait() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let obj = {};
      obj['switch'] = 'get';
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  stateWait(isPressed) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.onChangeForStateWait = function(pressed) {
        if (isPressed == pressed) {
          self.onChangeForStateWait = function() {};
          resolve();
        }
      };
    });
  }

  notified(obj) {
    this.state = obj.state;
    if (this.onchange) {
      this.onchange(this.state);
    }
    this.onChangeForStateWait(this.state);

    const callback = this.observers.shift();
    if (callback) {
      callback(this.state);
    }
  }
}

module.exports = ObnizSwitch;


/***/ }),

/***/ "./obniz/libs/io_peripherals/ad.js":
/***/ (function(module, exports) {

class PeripheralAD {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
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
    let obj = {};
    obj['ad' + this.id] = {
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  getWait() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['ad' + self.id] = {
        stream: false,
      };
      self.Obniz.send(obj);
    });
  }

  end() {
    this.onchange = null;
    let obj = {};
    obj['ad' + this.id] = null;
    this.Obniz.send(obj);
    return;
  }

  notified(obj) {
    this.value = obj;
    if (this.onchange) {
      this.onchange(obj);
    }
    let callback = this.observers.shift();
    if (callback) {
      callback(obj);
    }
  }
}

module.exports = PeripheralAD;


/***/ }),

/***/ "./obniz/libs/io_peripherals/i2c.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");

class PeripheralI2C {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
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
    let err = ObnizUtil._requiredKeys(arg, ['mode', 'sda', 'scl']);
    if (err) {
      throw new Error("I2C start param '" + err + "' required, but not found ");
    }
    this.state = ObnizUtil._keyFilter(arg, [
      'mode',
      'sda',
      'scl',
      'pull',
      'gnd',
    ]);

    let ioKeys = ['sda', 'scl', 'gnd'];
    for (let key of ioKeys) {
      if (this.state[key] && !this.Obniz.isValidIO(this.state[key])) {
        throw new Error("i2c start param '" + key + "' are to be valid io no");
      }
    }

    let mode = this.state.mode;
    let clock = typeof arg.clock === 'number' ? parseInt(arg.clock) : null;
    let slave_address =
      typeof arg.slave_address === 'number'
        ? parseInt(arg.slave_address)
        : null;
    let slave_address_length =
      typeof arg.slave_address_length === 'number'
        ? parseInt(arg.slave_address_length)
        : null;

    if (mode !== 'master' && mode !== 'slave') {
      throw new Error('i2c: invalid mode ' + mode);
    }
    if (mode === 'master') {
      if (clock === null) {
        throw new Error('i2c: please specify clock when master mode');
      }
      if (clock <= 0 || clock > 1 * 1000 * 1000) {
        throw new Error('i2c: invalid clock ' + clock);
      }
      if (arg.pull === '5v' && clock > 400 * 1000) {
        throw new Error(
          'i2c: please use under 400khz when internal 5v internal pull-up'
        );
      }
      if (arg.pull === '3v' && clock > 100 * 1000) {
        throw new Error(
          'i2c: please use under 100khz when internal 3v internal pull-up'
        );
      }
    } else {
      if (slave_address === null) {
        throw new Error('i2c: please specify slave_address');
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error('i2c: invalid slave_address');
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error('i2c: invalid slave_address');
      }
      if (slave_address_length !== null && slave_address_length !== 7) {
        throw new Error('i2c: invalid slave_address_length. please specify 7');
      }
    }

    this.Obniz.getIO(this.state.sda).drive('open-drain');
    this.Obniz.getIO(this.state.scl).drive('open-drain');

    if (this.state.pull) {
      this.Obniz.getIO(this.state.sda).pull(this.state.pull);
      this.Obniz.getIO(this.state.scl).pull(this.state.pull);
    } else {
      this.Obniz.getIO(this.state.sda).pull(null);
      this.Obniz.getIO(this.state.scl).pull(null);
    }

    if (this.state.gnd !== undefined) {
      this.Obniz.getIO(this.state.gnd).output(false);
      let ioNames = {};
      ioNames[this.state.gnd] = 'gnd';
      this.Obniz.display.setPinNames('i2c' + this.id, ioNames);
    }

    let startObj = ObnizUtil._keyFilter(this.state, ['mode', 'sda', 'scl']);
    if (mode === 'master') {
      startObj.clock = clock;
    } else {
      startObj.slave_address = slave_address;
      if (slave_address_length) {
        startObj.slave_address_length = slave_address_length;
      }
    }

    let obj = {};
    obj['i2c' + this.id] = startObj;
    this.used = true;
    this.Obniz.send(obj);
  }

  write(address, data) {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error('i2c: please specify address');
    }
    if (address < 0 || address > 0x7f) {
      throw new Error('i2c: invalid address');
    }
    if (!data) {
      throw new Error('i2c: please provide data');
    }
    if (data.length > 1024) {
      throw new Error('i2c: data should be under 1024 bytes');
    }
    let obj = {};
    obj['i2c' + this.id] = {
      address,
      data,
    };
    this.Obniz.send(obj);
  }

  readWait(address, length) {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error('i2c: please specify address');
    }
    if (address < 0 || address > 0x7f) {
      throw new Error('i2c: invalid address');
    }
    length = parseInt(length);
    if (isNaN(length) || length < 0) {
      throw new Error('i2c: invalid length to read');
    }
    if (length > 1024) {
      throw new Error('i2c: data length should be under 1024 bytes');
    }
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['i2c' + self.id] = {
        address,
        read: length,
      };
      self.Obniz.send(obj);
    });
  }

  notified(obj) {
    if (obj && typeof obj === 'object') {
      if (obj.data) {
        if (obj.mode === 'slave' && typeof this.onwritten === 'function') {
          this.onwritten(obj.data, obj.address);
        } else {
          // TODO: we should compare byte length from sent
          let callback = this.observers.shift();
          if (callback) {
            callback(obj.data);
          }
        }
      }
      if (obj.warning) {
        this.Obniz.warning({
          alert: 'warning',
          message: `i2c${this.id}: ${obj.warning.message}`,
        });
      }
      if (obj.error) {
        this.Obniz.error({
          alert: 'error',
          message: `i2c${this.id}: ${obj.error.message}`,
        });
      }
    }
  }

  isUsed() {
    return this.used;
  }

  end() {
    this.state = {};
    let obj = {};
    obj['i2c' + this.id] = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}

module.exports = PeripheralI2C;


/***/ }),

/***/ "./obniz/libs/io_peripherals/io.js":
/***/ (function(module, exports) {

class PeripheralIO {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
    this.value = 0;
    this.observers = [];
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  output(value) {
    value = value == true;
    let obj = {};
    obj['io' + this.id] = value;
    this.value = value;
    this.Obniz.send(obj);
  }

  drive(drive) {
    if (typeof drive !== 'string') {
      throw new Error('please specify drive methods in string');
    }
    let output_type = '';
    switch (drive) {
      case '5v':
        output_type = 'push-pull5v';
        break;
      case '3v':
        output_type = 'push-pull3v';
        break;
      case 'open-drain':
        output_type = 'open-drain';
        break;
      default:
        throw new Error('unknown drive method');
    }

    let obj = {};
    obj['io' + this.id] = {
      output_type: output_type,
    };
    this.Obniz.send(obj);
  }

  pull(updown) {
    if (typeof updown !== 'string' && updown !== null) {
      throw new Error('please specify pull methods in string');
    }
    let pull_type = '';
    switch (updown) {
      case '5v':
      case 'pull-up5v':
        pull_type = 'pull-up5v';
        break;
      case '3v':
      case 'pull-up3v':
        pull_type = 'pull-up3v';
        break;
      case '0v':
      case 'pull-down':
        pull_type = 'pull-down';
        break;
      case null:
      case 'float':
        pull_type = 'float';
        break;
      default:
        throw new Error('unknown pull_type method');
    }

    let obj = {};
    obj['io' + this.id] = {
      pull_type: pull_type,
    };
    this.Obniz.send(obj);
  }

  input(callback) {
    this.onchange = callback;
    let obj = {};
    obj['io' + this.id] = {
      direction: 'input',
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  inputWait() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['io' + self.id] = {
        direction: 'input',
        stream: false,
      };
      self.Obniz.send(obj);
    });
  }

  end() {
    let obj = {};
    obj['io' + this.id] = null;
    this.Obniz.send(obj);
  }

  notified(obj) {
    if (typeof obj === 'boolean') {
      this.value = obj;
      let callback = this.observers.shift();
      if (callback) {
        callback(obj);
      }
      if (typeof this.onchange === 'function') {
        this.onchange(obj);
      }
    } else if (obj && typeof obj === 'object') {
      if (obj.warning) {
        this.Obniz.warning({
          alert: 'warning',
          message: `io${this.id}: ${obj.warning.message}`,
        });
      }
      if (obj.error) {
        this.Obniz.error({
          alert: 'error',
          message: `io${this.id}: ${obj.error.message}`,
        });
      }
    }
  }
}
module.exports = PeripheralIO;


/***/ }),

/***/ "./obniz/libs/io_peripherals/io_.js":
/***/ (function(module, exports) {

class PeripheralIO_ {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
  }

  animation(name, status, array) {
    let obj = {};
    obj.io = {
      animation: {
        name: name,
        status: status,
      },
    };
    if (!array) array = [];

    let states = [];
    for (let i = 0; i < array.length; i++) {
      let state = array[i];
      let duration = state.duration;
      let operation = state.state;

      // dry run. and get json commands
      this.Obniz.sendPool = [];
      operation(i);
      let pooledJsonArray = this.Obniz.sendPool;
      this.Obniz.sendPool = null;
      states.push({
        duration: duration,
        state: pooledJsonArray,
      });
    }
    if (status === 'loop') {
      obj.io.animation.states = states;
    }
    this.Obniz.send(obj);
  }
}
module.exports = PeripheralIO_;


/***/ }),

/***/ "./obniz/libs/io_peripherals/pwm.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");

class PeripheralPWM {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
    this.state = {};
    this.used = false;
  }

  sendWS(obj) {
    let wsObj = {};
    wsObj['pwm' + this.id] = obj;
    this.Obniz.send(wsObj);
  }

  start(params) {
    const err = ObnizUtil._requiredKeys(params, ['io']);
    if (err) {
      throw new Error("pwm start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, ['io', 'drive', 'pull']);

    const io = this.params.io;
    const ioObj = this.Obniz.getIO(io);

    ioObj.drive(this.params.drive || '5v');
    ioObj.pull(this.params.pull || null);

    this.state = {
      io: io,
      freq: 1000,
    };
    this.sendWS({
      io: io,
    });
    this.used = true;
  }

  freq(freq) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    freq *= 1;
    if (typeof freq !== 'number') {
      throw new Error('please provide freq in number');
    }
    this.state.freq = freq;
    this.sendWS({
      freq: freq,
    });
    if (typeof this.state.duty === 'number') {
      this.duty(this.state.duty);
    }
  }

  pulse(pulse_width) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }

    this.state.pulse = pulse_width;
    delete this.state.duty;
    this.sendWS({
      pulse: pulse_width,
    });
  }

  duty(duty) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    duty *= 1;
    if (typeof this.state.freq !== 'number' || this.state.freq <= 0) {
      throw new Error('please provide freq first.');
    }
    if (typeof duty !== 'number') {
      throw new Error('please provide duty in number');
    }
    if (duty < 0) {
      duty = 0;
    }
    if (duty > 100) {
      duty = 100;
    }
    const pulse_width = (1.0 / this.state.freq) * 1000 * duty * 0.01;
    this.state.duty = duty;
    this.sendWS({
      pulse: pulse_width,
    });
  }

  isUsed() {
    return this.used;
  }

  end() {
    this.state = {};
    this.sendWS(null);
    this.used = false;
  }

  modulate(type, symbol_length, data) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    this.sendWS({
      modulate: {
        type: type,
        symbol_length: symbol_length,
        data: data,
      },
    });
  }
}
module.exports = PeripheralPWM;


/***/ }),

/***/ "./obniz/libs/io_peripherals/spi.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");
const semver = __webpack_require__("./node_modules/semver/semver.js");

class PeripheralSPI {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
    this.observers = [];
    this.used = false;
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  start(params) {
    let err = ObnizUtil._requiredKeys(params, ['mode', 'frequency']);
    if (err) {
      throw new Error("spi start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, [
      'mode',
      'clk',
      'mosi',
      'miso',
      'frequency',
      'drive',
      'pull',
      'gnd',
    ]);
    let obj = {};

    let ioKeys = ['clk', 'mosi', 'miso', 'gnd'];
    for (let key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }

    obj['spi' + this.id] = {
      mode: this.params.mode,
      clock: this.params.frequency, //name different
    };
    if (this.params.clk !== undefined) {
      obj['spi' + this.id].clk = this.params.clk;
    }
    if (this.params.mosi !== undefined) {
      obj['spi' + this.id].mosi = this.params.mosi;
    }
    if (this.params.miso !== undefined) {
      obj['spi' + this.id].miso = this.params.miso;
    }

    if (this.params.drive) {
      if (this.params.clk !== undefined)
        this.Obniz.getIO(this.params.clk).drive(this.params.drive);
      if (this.params.mosi !== undefined)
        this.Obniz.getIO(this.params.mosi).drive(this.params.drive);
      if (this.params.miso !== undefined)
        this.Obniz.getIO(this.params.miso).drive(this.params.drive);
    } else {
      if (this.params.clk !== undefined)
        this.Obniz.getIO(this.params.clk).drive('5v');
      if (this.params.mosi !== undefined)
        this.Obniz.getIO(this.params.mosi).drive('5v');
      if (this.params.miso !== undefined)
        this.Obniz.getIO(this.params.miso).drive('5v');
    }

    if (this.params.pull) {
      if (this.params.clk !== undefined)
        this.Obniz.getIO(this.params.clk).pull(this.params.pull);
      if (this.params.mosi !== undefined)
        this.Obniz.getIO(this.params.mosi).pull(this.params.pull);
      if (this.params.miso !== undefined)
        this.Obniz.getIO(this.params.miso).pull(this.params.pull);
    } else {
      if (this.params.clk !== undefined)
        this.Obniz.getIO(this.params.clk).pull(null);
      if (this.params.mosi !== undefined)
        this.Obniz.getIO(this.params.mosi).pull(null);
      if (this.params.miso !== undefined)
        this.Obniz.getIO(this.params.miso).pull(null);
    }

    if (this.params.gnd !== undefined) {
      this.Obniz.getIO(this.params.gnd).output(false);
      let ioNames = {};
      ioNames[this.params.gnd] = 'gnd';
      this.Obniz.display.setPinNames('spi' + this.id, ioNames);
    }
    this.used = true;
    this.Obniz.send(obj);
  }

  writeWait(data) {
    if (!this.used) {
      throw new Error(`spi${this.id} is not started`);
    }
    if (semver.lte(this.Obniz.firmware_ver, '1.0.2') && data.length > 32) {
      throw new Error(
        `with your obniz ${
          this.Obniz.firmware_ver
        }. spi max length=32byte but yours ${
          data.length
        }. Please update obniz firmware`
      );
    }

    let self = this;
    return new Promise(function(resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['spi' + self.id] = {
        data: data,
        read: true,
      };
      self.Obniz.send(obj);
    });
  }

  write(data) {
    if (!this.used) {
      throw new Error(`spi${this.id} is not started`);
    }
    if (semver.lte(this.Obniz.firmware_ver, '1.0.2') && data.length > 32) {
      throw new Error(
        `with your obniz ${
          this.Obniz.firmware_ver
        }. spi max length=32byte but yours ${
          data.length
        }. Please update obniz firmware`
      );
    }

    let self = this;
    let obj = {};
    obj['spi' + self.id] = {
      data: data,
      read: false,
    };
    self.Obniz.send(obj);
  }

  notified(obj) {
    // TODO: we should compare byte length from sent
    let callback = this.observers.shift();
    if (callback) {
      callback(obj.data);
    }
  }

  isUsed() {
    return this.used;
  }

  end(reuse) {
    let self = this;
    let obj = {};
    obj['spi' + self.id] = null;
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
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");
const isNode = typeof window === 'undefined';

class PeripheralUART {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
    this.received = new Uint8Array([]);
    this.used = false;
  }

  start(params) {
    let err = ObnizUtil._requiredKeys(params, ['tx', 'rx']);
    if (err) {
      throw new Error(
        "uart start param '" + err + "' required, but not found "
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      'tx',
      'rx',
      'baud',
      'stop',
      'bits',
      'parity',
      'flowcontrol',
      'rts',
      'cts',
      'drive',
      'pull',
      'gnd',
    ]);

    let ioKeys = ['rx', 'tx', 'rts', 'cts', 'gnd'];
    for (let key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("uart start param '" + key + "' are to be valid io no");
      }
    }

    if (this.params.hasOwnProperty('drive')) {
      this.Obniz.getIO(this.params.rx).drive(this.params.drive);
      this.Obniz.getIO(this.params.tx).drive(this.params.drive);
    } else {
      this.Obniz.getIO(this.params.rx).drive('5v');
      this.Obniz.getIO(this.params.tx).drive('5v');
    }

    if (this.params.hasOwnProperty('pull')) {
      this.Obniz.getIO(this.params.rx).pull(this.params.pull);
      this.Obniz.getIO(this.params.tx).pull(this.params.pull);
    } else {
      this.Obniz.getIO(this.params.rx).pull(null);
      this.Obniz.getIO(this.params.tx).pull(null);
    }

    if (this.params.hasOwnProperty('gnd')) {
      this.Obniz.getIO(this.params.gnd).output(false);
      let ioNames = {};
      ioNames[this.params.gnd] = 'gnd';
      this.Obniz.display.setPinNames('uart' + this.id, ioNames);
    }

    let obj = {};
    let sendParams = ObnizUtil._keyFilter(this.params, [
      'tx',
      'rx',
      'baud',
      'stop',
      'bits',
      'parity',
      'flowcontrol',
      'rts',
      'cts',
    ]);
    obj['uart' + this.id] = sendParams;
    this.Obniz.send(obj);
    this.received = [];
    this.used = true;
  }

  send(data) {
    if (!this.used) {
      throw new Error(`uart${this.id} is not started`);
    }
    let send_data = null;
    if (data === undefined) {
      return;
    }
    if (typeof data === 'number') {
      data = [data];
    }
    if (isNode && data instanceof Buffer) {
      send_data = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === 'string') {
      const buf = Buffer(data);
      send_data = [...buf];
    }
    let obj = {};
    obj['uart' + this.id] = {};
    obj['uart' + this.id].data = send_data;
    //  console.log(obj);
    this.Obniz.send(obj);
  }

  isDataExists() {
    return this.received && this.received.length > 0;
  }

  readBytes() {
    let results = [];
    if (this.isDataExists()) {
      for (let i = 0; i < this.received.length; i++) {
        results.push(this.received[i]);
      }
    }
    this.received = [];
    return results;
  }

  readText() {
    let string = null;
    if (this.isDataExists()) {
      let data = this.readBytes();
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
      let string = this.tryConvertString(obj.data);
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
    let obj = {};
    obj['uart' + this.id] = null;
    this.params = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}
module.exports = PeripheralUART;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./obniz/libs/measurements/logicanalyzer.js":
/***/ (function(module, exports, __webpack_require__) {

const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");

class LogicAnalyzer {
  constructor(obniz) {
    this.obniz = obniz;
    this._reset();
  }

  _reset() {
    this.onmeasured = undefined;
  }

  start(params) {
    let err = ObnizUtil._requiredKeys(params, ['io', 'interval', 'duration']);
    if (err) {
      throw new Error(
        "LogicAnalyzer start param '" + err + "' required, but not found "
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      'io',
      'interval',
      'duration',
      'triggerValue',
      'triggerValueSamples',
    ]);

    let obj = {};
    obj.logic_analyzer = {
      io: [this.params.io],
      interval: this.params.interval,
      duration: this.params.duration,
    };
    if (this.params.triggerValueSamples > 0) {
      obj.logic_analyzer.trigger = {
        value: !!this.params.triggerValue,
        samples: this.params.triggerValueSamples,
      };
    }

    this.obniz.send(obj);
    return;
  }

  end() {
    let obj = {};
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
/***/ (function(module, exports, __webpack_require__) {

const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");

class ObnizMeasure {
  constructor(obniz) {
    this.obniz = obniz;
    this._reset();
  }

  _reset() {
    this.observers = [];
  }

  echo(params) {
    let err = ObnizUtil._requiredKeys(params, [
      'io_pulse',
      'pulse',
      'pulse_width',
      'io_echo',
      'measure_edges',
    ]);
    if (err) {
      throw new Error(
        "Measure start param '" + err + "' required, but not found "
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      'io_pulse',
      'pulse',
      'pulse_width',
      'io_echo',
      'measure_edges',
      'timeout',
      'callback',
    ]);

    let echo = {};
    echo.io_pulse = this.params.io_pulse;
    echo.pulse = this.params.pulse;
    echo.pulse_width = this.params.pulse_width;
    echo.io_echo = this.params.io_echo;
    echo.measure_edges = this.params.measure_edges;
    if (typeof this.params.timeout === 'number') {
      echo.timeout = this.params.timeout;
    }

    this.obniz.send({
      measure: {
        echo: echo,
      },
    });

    if (this.params.callback) {
      this.observers.push(this.params.callback);
    }
  }

  notified(obj) {
    let callback = this.observers.shift();
    if (callback) {
      callback(obj.echo);
    }
  }
}
module.exports = ObnizMeasure;


/***/ }),

/***/ "./obniz/libs/utils/qr.js":
/***/ (function(module, exports) {

/* eslint-disable */

/* Thanks Kazuhiko Arase */
/* https://github.com/kazuhikoarase/qrcode-generator/tree/master/js */

//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = (function() {
  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {
    var PAD0 = 0xec;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {
      _moduleCount = _typeNumber * 4 + 17;
      _modules = (function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      })(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {
      for (var r = -1; r <= 7; r += 1) {
        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {
          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if (
            (0 <= r && r <= 6 && (c == 0 || c == 6)) ||
            (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)
          ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {
      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {
        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {
      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = r % 2 == 0;
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = c % 2 == 0;
      }
    };

    var setupPositionAdjustPattern = function() {
      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {
        for (var j = 0; j < pos.length; j += 1) {
          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {
            for (var c = -2; c <= 2; c += 1) {
              if (
                r == -2 ||
                r == 2 ||
                c == -2 ||
                c == 2 ||
                (r == 0 && c == 0)
              ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {
      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = !test && ((bits >> i) & 1) == 1;
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = !test && ((bits >> i) & 1) == 1;
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {
      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {
        var mod = !test && ((bits >> i) & 1) == 1;

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {
        var mod = !test && ((bits >> i) & 1) == 1;

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = !test;
    };

    var mapData = function(data, maskPattern) {
      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col -= 1;

        while (true) {
          for (var c = 0; c < 2; c += 1) {
            if (_modules[row][col - c] == null) {
              var dark = false;

              if (byteIndex < data.length) {
                dark = ((data[byteIndex] >>> bitIndex) & 1) == 1;
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {
      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(
          data.getLength(),
          QRUtil.getLengthInBits(data.getMode(), typeNumber)
        );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. (' +
          buffer.getLengthInBits() +
          '>' +
          totalDataCount * 8 +
          ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {
      mode = mode || 'Byte';

      var newData = null;

      switch (mode) {
        case 'Numeric':
          newData = qrNumber(data);
          break;
        case 'Alphanumeric':
          newData = qrAlphaNum(data);
          break;
        case 'Byte':
          newData = qr8BitByte(data);
          break;
        case 'Kanji':
          newData = qrKanji(data);
          break;
        default:
          throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.getModules = function() {
      return _modules;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(
            typeNumber,
            _errorCorrectionLevel
          );
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(
              data.getLength(),
              QRUtil.getLengthInBits(data.getMode(), typeNumber)
            );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern());
    };

    _this.createTableTag = function(cellSize, margin) {
      cellSize = cellSize || 2;
      margin = typeof margin == 'undefined' ? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {
        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c) ? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    default: function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    },
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {
    // create conversion map.

    var unicodeMap = (function() {
      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode((b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    })();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ((b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER: 1 << 0,
    MODE_ALPHA_NUM: 1 << 1,
    MODE_8BIT_BYTE: 1 << 2,
    MODE_KANJI: 1 << 3,
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2,
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7,
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = (function() {
    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170],
    ];
    var G15 =
      (1 << 10) |
      (1 << 8) |
      (1 << 5) |
      (1 << 4) |
      (1 << 2) |
      (1 << 1) |
      (1 << 0);
    var G18 =
      (1 << 12) |
      (1 << 11) |
      (1 << 10) |
      (1 << 9) |
      (1 << 8) |
      (1 << 5) |
      (1 << 2) |
      (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= G15 << (getBCHDigit(d) - getBCHDigit(G15));
      }
      return ((data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= G18 << (getBCHDigit(d) - getBCHDigit(G18));
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return function(i, j) {
            return (i + j) % 2 == 0;
          };
        case QRMaskPattern.PATTERN001:
          return function(i, j) {
            return i % 2 == 0;
          };
        case QRMaskPattern.PATTERN010:
          return function(i, j) {
            return j % 3 == 0;
          };
        case QRMaskPattern.PATTERN011:
          return function(i, j) {
            return (i + j) % 3 == 0;
          };
        case QRMaskPattern.PATTERN100:
          return function(i, j) {
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
          };
        case QRMaskPattern.PATTERN101:
          return function(i, j) {
            return (i * j) % 2 + (i * j) % 3 == 0;
          };
        case QRMaskPattern.PATTERN110:
          return function(i, j) {
            return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
          };
        case QRMaskPattern.PATTERN111:
          return function(i, j) {
            return ((i * j) % 3 + (i + j) % 2) % 2 == 0;
          };

        default:
          throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {
      if (1 <= type && type < 10) {
        // 1 - 9

        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw 'mode:' + mode;
        }
      } else if (type < 27) {
        // 10 - 26

        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 12;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 10;
          default:
            throw 'mode:' + mode;
        }
      } else if (type < 41) {
        // 27 - 40

        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 13;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw 'mode:' + mode;
        }
      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {
      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {
          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {
            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {
              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c)) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += 3 + sameCount - 5;
          }
        }
      }

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col)) count += 1;
          if (qrcode.isDark(row + 1, col)) count += 1;
          if (qrcode.isDark(row, col + 1)) count += 1;
          if (qrcode.isDark(row + 1, col + 1)) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (
            qrcode.isDark(row, col) &&
            !qrcode.isDark(row, col + 1) &&
            qrcode.isDark(row, col + 2) &&
            qrcode.isDark(row, col + 3) &&
            qrcode.isDark(row, col + 4) &&
            !qrcode.isDark(row, col + 5) &&
            qrcode.isDark(row, col + 6)
          ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (
            qrcode.isDark(row, col) &&
            !qrcode.isDark(row + 1, col) &&
            qrcode.isDark(row + 2, col) &&
            qrcode.isDark(row + 3, col) &&
            qrcode.isDark(row + 4, col) &&
            !qrcode.isDark(row + 5, col) &&
            qrcode.isDark(row + 6, col)
          ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col)) {
            darkCount += 1;
          }
        }
      }

      var ratio =
        Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  })();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = (function() {
    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] =
        EXP_TABLE[i - 4] ^
        EXP_TABLE[i - 5] ^
        EXP_TABLE[i - 6] ^
        EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i]] = i;
    }

    var _this = {};

    _this.glog = function(n) {
      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {
      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  })();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {
    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = (function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    })();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {
      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(
            QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j))
          );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {
      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));

      var num = new Array(_this.getLength());
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  }

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = (function() {
    var RS_BLOCK_TABLE = [
      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16],
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case QRErrorCorrectionLevel.L:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectionLevel.M:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectionLevel.Q:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectionLevel.H:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default:
          return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' +
          typeNumber +
          '/errorCorrectionLevel:' +
          errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {
        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount));
        }
      }

      return list;
    };

    return _this;
  })();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {
    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ((_buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit(((num >>> (length - i - 1)) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {
      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= 0x80 >>> (_length % 8);
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {
    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {
      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3)), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1)), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2)), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i));
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {
    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {
      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i)), 6);
      }
    };

    var getCode = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
          case ' ':
            return 36;
          case '$':
            return 37;
          case '%':
            return 38;
          case '*':
            return 39;
          case '+':
            return 40;
          case '-':
            return 41;
          case '.':
            return 42;
          case '/':
            return 43;
          case ':':
            return 44;
          default:
            throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {
    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {
    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !(function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ((test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    })('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {
      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {
        var c = ((0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9ffc) {
          c -= 0x8140;
        } else if (0xe040 <= c && c <= 0xebbf) {
          c -= 0xc140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ((c >>> 8) & 0xff) * 0xc0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {
    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i));
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {
    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f));
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {
      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6));
        _buflen -= 6;
      }
    };

    _this.flush = function() {
      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen));
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {
    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {
      while (_buflen < 8) {
        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/)) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0));
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8)) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
})();

// multibyte support
!(function() {
  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(
            0xe0 | (charcode >> 12),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f)
          );
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode =
            0x10000 +
            (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
          utf8.push(
            0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f)
          );
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };
})();

module.exports = qrcode;


/***/ }),

/***/ "./obniz/libs/utils/util.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {class ObnizUtil {
  constructor(obniz) {
    this.obniz = obniz;
  }

  createCanvasContext(width, height) {
    if (this.obniz.isNode) {
      try {
        const { createCanvas } = __webpack_require__("./obniz/libs/webpackReplace/canvas.js");
        return createCanvas(this.width, this.height);
      } catch (e) {
        throw new Error(
          'obniz.js require node-canvas to draw rich contents. see more detail on docs'
        );
      }
    } else {
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style['-webkit-font-smoothing'] = 'none';
      let body = document.getElementsByTagName('body')[0];
      body.appendChild(canvas);

      let ctx = canvas.getContext('2d');
      return ctx;
    }
  }

  static _keyFilter(params, keys) {
    let filterdParams = {};
    if (typeof params !== 'object') {
      return filterdParams;
    }
    filterdParams = Object.keys(params)
      .filter(key => keys.includes(key))
      .reduce((obj, key) => {
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
    if (typeof params !== 'object') {
      return keys[0];
    }

    for (let index in keys) {
      if (!(keys[index] in params)) {
        return keys[index];
      }
    }
    return null;
  }

  static dataArray2string(data) {
    let string = null;
    try {
      const StringDecoder = __webpack_require__("./node_modules/string_decoder/lib/string_decoder.js").StringDecoder;
      if (StringDecoder) {
        string = new StringDecoder('utf8').write(Buffer.from(data));
      }
    } catch (e) {
      //this.obniz.error(e);
    }
    return string;
  }

  static string2dataArray(str) {
    const buf = Buffer(str);
    return [...buf];
  }
}

module.exports = ObnizUtil;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./obniz/libs/webpackReplace/canvas.js":
/***/ (function(module, exports) {

// load from webpack

let canvas;

module.exports = canvas;


/***/ }),

/***/ "./obniz/libs/webpackReplace/require-context-browser.js":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "./obniz/libs/webpackReplace/ws.js":
/***/ (function(module, exports) {

// load from webpack

let ws;

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket;
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket; //eslint-disable-line
} else {
  ws = window.WebSocket || window.MozWebSocket;
}

module.exports = ws;


/***/ }),

/***/ "./obniz/libs/wscommand sync recursive":
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
/***/ (function(module, exports, __webpack_require__) {

const WSSchema = __webpack_require__("./obniz/libs/wscommand/WSSchema.js");

let commandClasses = {};

module.exports = class WSCommand {
  constructor(delegate) {
    this.delegate = delegate;

    //constants
    this.COMMAND_FUNC_ID_ERROR = 0xff;
    this.ioNotUsed = 0xff;
  }

  static get schema() {
    return WSSchema;
  }
  static get CommandClasses() {
    return commandClasses;
  }

  static addCommandClass(name, classObj) {
    commandClasses[name] = classObj;
  }

  static framed(module, func, payload) {
    let payload_length = 0;
    if (payload) {
      payload_length = payload.length;
    }
    let length_type;
    if (payload_length <= 0x3f) {
      length_type = 0;
    } else if (payload_length <= 0x3fff) {
      length_type = 1;
    } else if (payload_length <= 0x3fffffff) {
      length_type = 2;
    } else {
      throw new Error('too big payload');
    }
    let length_extra_bytse = length_type == 0 ? 0 : length_type == 1 ? 1 : 3;
    let header_length = 3 + length_extra_bytse;
    let result = new Uint8Array(header_length + payload_length);
    let index = 0;
    result[index++] = module & 0x7f;
    result[index++] = func;
    result[index++] =
      (length_type << 6) | (payload_length >> (length_extra_bytse * 8));
    while (length_extra_bytse > 0) {
      length_extra_bytse--;
      result[index++] = payload_length >> (length_extra_bytse * 8);
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
      throw new Error('something wrong. buf less than 3');
    }
    if (buf[0] & 0x80) {
      throw new Error('reserved bit 1');
    }
    let module = 0x7f & buf[0];
    let func = buf[1];
    let length_type = (buf[2] >> 6) & 0x3;
    let length_extra_bytse = length_type == 0 ? 0 : length_type == 1 ? 1 : 3;
    if (length_type == 4) {
      throw new Error('invalid length');
    }
    let length = (buf[2] & 0x3f) << (length_extra_bytse * 8);
    let index = 3;
    let shift = length_extra_bytse;
    while (shift > 0) {
      shift--;
      length += buf[index] << (shift * 8);
      index++;
    }

    return {
      module: module,
      func: func,
      payload: buf.slice(
        3 + length_extra_bytse,
        3 + length_extra_bytse + length
      ),
      next: buf.slice(3 + length_extra_bytse + length),
    };
  }

  static compress(wscommands, json) {
    let ret = null;
    function append(module, func, payload) {
      let frame = WSCommand.framed(module, func, payload);
      if (ret) {
        let combined = new Uint8Array(ret.length + frame.length);
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
    if (func === this.COMMAND_FUNC_ID_ERROR) {
      if (!objToSend.debug) objToSend.debug = {};
      let err = {
        module: this.module,
        _args: [...payload],
      };

      if (payload.byteLength == 3) {
        err.err0 = payload[0];
        err.err1 = payload[1];
        err.function = payload[2];
        err.message = `Error module=${this.module} func=${err.function} err0=${
          err.err0
        } returned=${err.err1}`;
      } else {
        err.message = `Error module=${this.module} with + ${err._args}`;
      }
      objToSend.debug.error = err;
    } else {
      // unknown
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
    return typeof io === 'number' && 0 <= io && io <= 11;
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

    let badErrorCodes = [
      WSSchema.errorCodes.ANY_OF_MISSING,
      WSSchema.errorCodes.ONE_OF_MISSING,
      WSSchema.errorCodes.ONE_OF_MULTIPLE,
      WSSchema.errorCodes.NOT_PASSED,
      WSSchema.errorCodes.OBJECT_REQUIRED,
      WSSchema.errorCodes.OBJECT_ADDITIONAL_PROPERTIES,
      WSSchema.errorCodes.CIRCULAR_REFERENCE,
      WSSchema.errorCodes.FORMAT_CUSTOM,
      WSSchema.errorCodes.KEYWORD_CUSTOM,
      WSSchema.errorCodes.UNKNOWN_PROPERTY,
    ];
    let messages = [];
    for (let error of validateError.errors) {
      if (error.code === WSSchema.errorCodes.INVALID_TYPE) {
        if (
          error.params.type === 'object' ||
          error.params.expected === 'object'
        ) {
          return false;
        }
      } else if (badErrorCodes.includes(error.code)) {
        return false;
      }

      let path = rootPath + error.dataPath.replace(/\//g, '.');
      messages.push(`[${path}]${error.message}`);
    }
    return messages.join(';');
  }

  filter(commandUri, json) {
    let schema = this.getSchema(commandUri);
    return this._filterSchema(schema, json);
  }

  _filterSchema(schema, json) {
    if (schema['$ref']) {
      let refSchema = WSSchema.getSchema(schema['$ref']);
      return this._filterSchema(refSchema, json);
    }

    if (json === undefined) {
      return schema.default;
    }

    if (
      schema.type === 'string' ||
      schema.type === 'integer' ||
      schema.type === 'boolean' ||
      schema.type === 'number' ||
      schema.type === 'null' ||
      schema.filter === 'pass_all'
    ) {
      return json;
    }

    if (schema.type === 'array') {
      let results = [];
      for (let key in json) {
        results[key] = this._filterSchema(schema.items, json[key]);
      }
      return results;
    }

    if (schema.type === 'object') {
      let results = {};
      for (let key in schema.properties) {
        results[key] = this._filterSchema(schema.properties[key], json[key]);
      }

      for (let pattern in schema.patternProperties) {
        let reg = new RegExp(pattern);
        for (let key of Object.keys(json)) {
          if (reg.test(key)) {
            results[key] = this._filterSchema(
              schema.patternProperties[pattern],
              json[key]
            );
          }
        }
      }
      return results;
    }

    throw Error('unknown json schema type');
  }

  get WSCommandNotFoundError() {
    return WSCommandNotFoundError;
  }
};

class WSCommandNotFoundError extends Error {}


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_AD.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

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
    let buf = new Uint8Array([no]);
    this.sendCommand(
      params.stream ? this._CommandInitNormalInterval : this._CommandDoOnece,
      buf
    );
  }

  deinit(params, no) {
    let buf = new Uint8Array([no]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  parseFromJson(json) {
    for (let i = 0; i < 12; i++) {
      let module = json['ad' + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        { uri: '/request/ad/deinit', onValid: this.deinit },
        { uri: '/request/ad/get', onValid: this.get },
      ];
      let res = this.validateCommandSchema(schemaData, module, 'ad' + i, i);

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
      for (let i = 0; i < payload.byteLength; i += 3) {
        let value = (payload[i + 1] << 8) + payload[i + 2];
        value = value / 100.0;
        objToSend['ad' + payload[i]] = value;
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_AD;


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Ble.js":
/***/ (function(module, exports, __webpack_require__) {

const JsonBinaryConverter = __webpack_require__("./obniz/libs/wscommand/jsonBinaryConverter.js");
const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

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
    this._CommandRegisterNotifyCharacteristic = 12;
    this._CommandUnregisterNotifyCharacteristic = 13;
    this._CommandDescriptors = 14;
    this._CommandWriteDescriptor = 15;
    this._CommandReadDescriptor = 16;
    this._CommandNotifyCharacteristic = 17;

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
    this._CommandServerNofityCharavteristic = 33;
    this._CommandServerStartStopService = 34;

    this._CommandScanResultsDevice = {
      breder: 0x01,
      ble: 0x02,
      dumo: 0x03,
    };

    /// BLE device address type
    this._CommandScanResultsDeviceAddress = {
      public: 0x00,
      random: 0x01,
      rpa_public: 0x02,
      rpa_random: 0x03,
    };

    this._CommandScanResultsEvet = {
      inquiry_result: 0 /*!< Inquiry result for a peer device. */,
      inquiry_complete: 1 /*!< Inquiry complete. */,
      discovery_result: 2 /*!< Discovery result for a peer device. */,
      discovery_ble_result: 3 /*!< Discovery result for BLE GATT based service on a peer device. */,
      discovery_cmoplete: 4 /*!< Discovery complete. */,
      discovery_di_cmoplete: 5 /*!< Discovery complete. */,
      cancelled: 6 /*!< Search cancelled */,
    };

    this._CommandScanResultsBleEvent = {
      connectable_advertisemnt: 0x00 /*!< Connectable undirected advertising (ADV_IND) */,
      connectable_directed_advertisemnt: 0x01 /*!< Connectable directed advertising (ADV_DIRECT_IND) */,
      scannable_advertising: 0x02 /*!< Scannable undirected advertising (ADV_SCAN_IND) */,
      non_connectable_advertising: 0x03 /*!< Non connectable undirected advertising (ADV_NONCONN_IND) */,
      scan_response: 0x04 /*!< Scan Response (SCAN_RSP) */,
    };

    this._CommandCharacteristicsProperties = {
      broadcast: 0x01,
      read: 0x02,
      write_without_response: 0x04,
      write: 0x08,
      notify: 0x10,
      indicate: 0x20,
      auth: 0x40,
      extended_properties: 0x80,
    };

    this._commandResults = {
      success: 0,
      failed: 1,
    };
  }

  /* CENTRAL   */

  centralScanStart(params) {
    let schema = [
      { path: 'scan.duration', length: 4, type: 'int', default: 30 },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandStartScan, buf);
  }

  centralScanStop(params) {
    this.sendCommand(this._CommandStopScan, null);
  }

  centralConnect(params) {
    let schema = [
      {
        path: 'connect.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      { path: null, length: 1, type: 'char', default: false }, //const val
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  centralDisconnect(params) {
    let schema = [
      {
        path: 'disconnect.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      { path: null, length: 1, type: 'char', default: true }, //const val
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  centralServiceGet(params) {
    let schema = [
      {
        path: 'get_services.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServices, buf);
  }

  centralCharacteristicGet(params) {
    let schema = [
      {
        path: 'get_characteristics.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'get_characteristics.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandCharacteristics, buf);
  }

  centralCharacteristicRead(params) {
    let schema = [
      {
        path: 'read_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'read_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'read_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadCharacteristics, buf);
  }

  centralCharacteristicWrite(params) {
    let schema = [
      {
        path: 'write_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'write_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_characteristic.needResponse',
        length: 1,
        type: 'char',
        default: 1,
      },
      { path: 'write_characteristic.data', length: null, type: 'dataArray' },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandWriteCharacteristics, buf);
  }

  centralCharacteristicRegisterNotify(params) {
    let schema = [
      {
        path: 'register_notify_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'register_notify_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'register_notify_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandRegisterNotifyCharacteristic, buf);
  }

  centralCharacteristicUnregisterNotify(params) {
    let schema = [
      {
        path: 'unregister_notify_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'unregister_notify_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'unregister_notify_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandUnregisterNotifyCharacteristic, buf);
  }

  centralDescriptorGet(params) {
    let schema = [
      {
        path: 'get_descriptors.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'get_descriptors.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'get_descriptors.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandDescriptors, buf);
  }

  centralDescriptorRead(params) {
    let schema = [
      {
        path: 'read_descriptor.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'read_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'read_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'read_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadDescriptor, buf);
  }

  centralDescriptorWrite(params) {
    let schema = [
      {
        path: 'write_descriptor.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'write_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_descriptor.needResponse',
        length: 1,
        type: 'char',
        default: 1,
      },
      { path: 'write_descriptor.data', length: null, type: 'dataArray' },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandWriteDescriptor, buf);
  }

  /* PERIPHERAL   */

  peripheralAdvertisementStart(params) {
    this.sendCommand(
      this._CommandSetAdvData,
      new Uint8Array(params.advertisement.adv_data)
    );

    if (params.advertisement.scan_resp) {
      this.sendCommand(
        this._CommandSetScanRespData,
        new Uint8Array(params.advertisement.scan_resp)
      );
    }

    this.sendCommand(this._CommandStartAdv, null);
  }

  peripheralAdvertisementStop(params) {
    this.sendCommand(this._CommandStopAdv, null);
  }

  peripheralServiceStart(params) {
    let val = params['peripheral'];
    let propFlags = {
      0x01: 'broadcast',
      0x02: 'read',
      0x04: 'write_without_response',
      0x08: 'write',
      0x10: 'notify',
      0x20: 'indiate',
      0x40: 'auth',
      0x80: 'ext_prop',
    };

    let permissionFlags = {
      0x001: 'read',
      0x002: 'read_encrypted',
      0x004: 'read_enc_mitm',
      0x010: 'write',
      0x020: 'write_encrypted',
      0x040: 'write_enc_mitm',
      0x080: 'write_signed',
      0x100: 'write_signed_mitm',
    };
    let schema = {
      service: {
        command: this._CommandServerAddService,
        schema: [{ path: 'uuid', length: 18, type: 'uuid', required: true }],
      },
      characteristic: {
        command: this._CommandServerAddCharacteristic,
        schema: [
          { path: 'service_uuid', length: 18, type: 'uuid', required: true },
          { path: 'uuid', length: 18, type: 'uuid', required: true },
          {
            path: 'permissions',
            length: 2,
            type: 'flag',
            default: ['write', 'read'],
            flags: permissionFlags,
          },
          {
            path: 'properties',
            length: 1,
            type: 'flag',
            default: ['write', 'read'],
            flags: propFlags,
          },
          { path: 'data', type: 'dataArray' },
        ],
      },
      descriptor: {
        command: this._CommandServerAddDescriptor,
        schema: [
          { path: 'service_uuid', length: 18, type: 'uuid', required: true },
          {
            path: 'characteristic_uuid',
            length: 18,
            type: 'uuid',
            required: true,
          },
          { path: 'uuid', length: 18, type: 'uuid', required: true },
          {
            path: 'permissions',
            length: 2,
            type: 'flag',
            default: ['write', 'read'],
            flags: permissionFlags,
          },
          { path: 'data', type: 'dataArray' },
        ],
      },
      startService: {
        command: this._CommandServerStartStopService,
        schema: [
          { path: 'uuid', length: 18, type: 'uuid', required: true },
          { path: null, length: 1, type: 'char', default: 0 }, //const val
        ],
      },
    };

    let sendBufs = [];
    let startServiceBufs = [];
    let buf;
    for (let serviceIndex in val['services']) {
      let service = val['services'][serviceIndex];
      buf = JsonBinaryConverter.createSendBuffer(
        schema['service'].schema,
        service
      );
      if (buf.length === 0) {
        return;
      }
      sendBufs.push({ command: schema['service'].command, buffer: buf });

      buf = JsonBinaryConverter.createSendBuffer(
        schema['startService'].schema,
        service
      );
      startServiceBufs.push({
        command: schema['startService'].command,
        buffer: buf,
      });

      for (let charaIndex in service['characteristics']) {
        let chara = service['characteristics'][charaIndex];
        chara.service_uuid = service.uuid;
        buf = JsonBinaryConverter.createSendBuffer(
          schema['characteristic'].schema,
          chara
        );
        if (buf.length === 0) {
          return;
        }
        sendBufs.push({
          command: schema['characteristic'].command,
          buffer: buf,
        });

        for (let descIndex in chara['descriptors']) {
          let desc = chara['descriptors'][descIndex];
          desc.service_uuid = service.uuid;
          desc.characteristic_uuid = chara.uuid;
          buf = JsonBinaryConverter.createSendBuffer(
            schema['descriptor'].schema,
            desc
          );
          if (buf.length === 0) {
            return;
          }
          sendBufs.push({ command: schema['descriptor'].command, buffer: buf });
        }
      }
    }
    for (let index in sendBufs) {
      this.sendCommand(sendBufs[index].command, sendBufs[index].buffer);
    }
    for (let index in startServiceBufs) {
      this.sendCommand(
        startServiceBufs[index].command,
        startServiceBufs[index].buffer
      );
    }
  }

  peripheralServiceStop(params) {
    let schema = [
      {
        path: 'peripheral.stop_service.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      { path: null, length: 1, type: 'char', default: 1 }, //const val
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerStartStopService, buf);
  }

  peripheralServiceStopAll() {
    this.sendCommand(this._CommandServerStartPeripheral, new Uint8Array([1]));
  }

  peripheralCharacteristicRead(params) {
    let schema = [
      {
        path: 'peripheral.read_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.read_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadCharavteristicValue, buf);
  }

  peripheralCharacteristicWrite(params) {
    let schema = [
      {
        path: 'peripheral.write_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.write_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      { path: 'peripheral.write_characteristic.data', type: 'dataArray' },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteCharavteristicValue, buf);
  }

  peripheralCharacteristicNotify(params) {
    let schema = [
      {
        path: 'peripheral.notify_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.notify_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerNofityCharavteristic, buf);
  }

  peripheralDescriptorRead(params) {
    let schema = [
      {
        path: 'peripheral.read_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.read_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.read_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadDescriptorValue, buf);
  }

  peripheralDescriptorWrite(params) {
    let schema = [
      {
        path: 'peripheral.write_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.write_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.write_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      { path: 'peripheral.write_descriptor.data', type: 'dataArray' },
    ];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteDescriptorValue, buf);
  }

  parseFromJson(json) {
    let module = json['ble'];
    if (module === undefined) {
      return;
    }
    let schemaData = [
      {
        uri: '/request/ble/central/scan_start',
        onValid: this.centralScanStart,
      },
      { uri: '/request/ble/central/scan_stop', onValid: this.centralScanStop },
      { uri: '/request/ble/central/connect', onValid: this.centralConnect },
      {
        uri: '/request/ble/central/disconnect',
        onValid: this.centralDisconnect,
      },
      {
        uri: '/request/ble/central/service_get',
        onValid: this.centralServiceGet,
      },
      {
        uri: '/request/ble/central/characteristic_get',
        onValid: this.centralCharacteristicGet,
      },
      {
        uri: '/request/ble/central/characteristic_read',
        onValid: this.centralCharacteristicRead,
      },
      {
        uri: '/request/ble/central/characteristic_write',
        onValid: this.centralCharacteristicWrite,
      },
      {
        uri: '/request/ble/central/characteristic_register_notify',
        onValid: this.centralCharacteristicRegisterNotify,
      },
      {
        uri: '/request/ble/central/characteristic_unregister_notify',
        onValid: this.centralCharacteristicUnregisterNotify,
      },
      {
        uri: '/request/ble/central/descriptor_get',
        onValid: this.centralDescriptorGet,
      },
      {
        uri: '/request/ble/central/descriptor_read',
        onValid: this.centralDescriptorRead,
      },
      {
        uri: '/request/ble/central/descriptor_write',
        onValid: this.centralDescriptorWrite,
      },
      {
        uri: '/request/ble/peripheral/advertisement_start',
        onValid: this.peripheralAdvertisementStart,
      },
      {
        uri: '/request/ble/peripheral/advertisement_stop',
        onValid: this.peripheralAdvertisementStop,
      },
      {
        uri: '/request/ble/peripheral/service_start',
        onValid: this.peripheralServiceStart,
      },
      {
        uri: '/request/ble/peripheral/service_stop',
        onValid: this.peripheralServiceStop,
      },
      {
        uri: '/request/ble/peripheral/service_stop_all',
        onValid: this.peripheralServiceStopAll,
      },
      {
        uri: '/request/ble/peripheral/characteristic_read',
        onValid: this.peripheralCharacteristicRead,
      },
      {
        uri: '/request/ble/peripheral/characteristic_write',
        onValid: this.peripheralCharacteristicWrite,
      },
      {
        uri: '/request/ble/peripheral/characteristic_notify',
        onValid: this.peripheralCharacteristicNotify,
      },
      {
        uri: '/request/ble/peripheral/descriptor_read',
        onValid: this.peripheralDescriptorRead,
      },
      {
        uri: '/request/ble/peripheral/descriptor_write',
        onValid: this.peripheralDescriptorWrite,
      },
    ];
    let res = this.validateCommandSchema(schemaData, module, 'ble');
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
    funcList[this._CommandScanResults] = this.notifyFromBinaryScanResponse.bind(
      this
    );
    funcList[this._CommandConnect] = this.notifyFromBinaryConnect.bind(this);
    funcList[this._CommandServices] = this.notifyFromBinaryServices.bind(this);
    funcList[
      this._CommandCharacteristics
    ] = this.notifyFromBinaryChacateristics.bind(this);
    funcList[
      this._CommandWriteCharacteristics
    ] = this.notifyFromBinaryWriteChacateristics.bind(this);
    funcList[
      this._CommandReadCharacteristics
    ] = this.notifyFromBinaryReadChacateristics.bind(this);
    funcList[
      this._CommandRegisterNotifyCharacteristic
    ] = this.notifyFromBinaryRegisterNotifyChacateristic.bind(this);
    funcList[
      this._CommandUnregisterNotifyCharacteristic
    ] = this.notifyFromBinaryUnregisterNotifyChacateristic.bind(this);
    funcList[
      this._CommandNotifyCharacteristic
    ] = this.notifyFromBinaryNotifyChacateristic.bind(this);
    funcList[this._CommandDescriptors] = this.notifyFromBinaryDescriptors.bind(
      this
    );
    funcList[
      this._CommandWriteDescriptor
    ] = this.notifyFromBinaryWriteDescriptor.bind(this);
    funcList[
      this._CommandReadDescriptor
    ] = this.notifyFromBinaryReadDescriptor.bind(this);

    funcList[
      this._CommandServerNotifyConnect
    ] = this.notifyFromBinaryServerConnectionState.bind(this);
    funcList[
      this._CommandServerReadCharavteristicValue
    ] = this.notifyFromBinaryServerReadCharavteristicValue.bind(this);
    funcList[
      this._CommandServerWriteCharavteristicValue
    ] = this.notifyFromBinaryServerWriteCharavteristicValue.bind(this);
    funcList[
      this._CommandServerNotifyReadCharavteristicValue
    ] = this.notifyFromBinaryServerNotifyReadCharavteristicValue.bind(this);
    funcList[
      this._CommandServerNotifyWriteCharavteristicValue
    ] = this.notifyFromBinaryServerNotifyWriteCharavteristicValue.bind(this);
    funcList[
      this._CommandServerReadDescriptorValue
    ] = this.notifyFromBinaryServerReadDescriptorValue.bind(this);
    funcList[
      this._CommandServerWriteDescriptorValue
    ] = this.notifyFromBinaryServerWriteDescriptorValue.bind(this);
    funcList[
      this._CommandServerNotifyReadDescriptorValue
    ] = this.notifyFromBinaryServerNotifyReadDescriptorValue.bind(this);
    funcList[
      this._CommandServerNotifyWriteDescriptorValue
    ] = this.notifyFromBinaryServerNotifyWriteDescriptorValue.bind(this);

    funcList[this.COMMAND_FUNC_ID_ERROR] = this.notifyFromBinaryError.bind(
      this
    );

    if (funcList[func]) {
      funcList[func](objToSend, payload);
    }
  }

  notifyFromBinaryScanResponse(objToSend, payload) {
    if (payload.byteLength > 1) {
      let schema = [
        {
          name: 'event_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsEvet,
        },
        { name: 'address', type: 'hex', length: 6, endianness: 'little' },
        {
          name: 'device_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsDevice,
        },
        {
          name: 'address_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsDeviceAddress,
        },
        {
          name: 'ble_event_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsBleEvent,
        },
        { name: 'rssi', type: 'signed number', length: 4 },
        { name: 'adv_data', type: 'dataArray', length: 31 * 2 },
        { name: 'flag', type: 'number', length: 4 },
        { name: 'num_response', type: 'number', length: 4 },
        { name: 'advertise_length', type: 'number', length: 1 },
        { name: 'scan_response_length', type: 'number', length: 1 },
      ];

      let results = JsonBinaryConverter.convertFromBinaryToJson(
        schema,
        payload
      );

      results.scan_resp = results.adv_data.slice(
        results.advertise_length,
        results.advertise_length + results.scan_response_length
      );
      results.adv_data = results.adv_data.slice(0, results.advertise_length);

      delete results.num_response;
      delete results.advertise_length;
      delete results.scan_response_length;
      delete results.advertise_data;

      if (results.event_type === 'inquiry_result') {
        delete results.event_type;
        this._addRowForPath(objToSend, 'ble.scan_result', results);
      } else if (results.event_type === 'inquiry_complete') {
        this._addRowForPath(objToSend, 'ble.scan_result_finish', true);
      }
    }
  }

  notifyFromBinaryConnect(objToSend, payload) {
    if (payload.length === 7) {
      let schema = [
        { name: 'address', type: 'hex', length: 6, endianness: 'little' },
        {
          name: 'status',
          type: 'enum',
          length: 1,
          enum: { connected: 0, disconnected: 1 },
        },
      ];

      let results = JsonBinaryConverter.convertFromBinaryToJson(
        schema,
        payload
      );
      this._addRowForPath(objToSend, 'ble.status_update', results);
    }
  }

  notifyFromBinaryServices(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    if (results.service_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_service_result', results);
    } else {
      delete results.service_uuid;
      this._addRowForPath(objToSend, 'ble.get_service_result_finish', results);
    }
  }

  notifyFromBinaryChacateristics(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      {
        name: 'properties',
        type: 'enum',
        length: 1,
        enum: this._CommandCharacteristicsProperties,
        flags: true,
      },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    if (results.characteristic_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_characteristic_result', results);
    } else {
      delete results.characteristic_uuid;
      delete results.properties;
      this._addRowForPath(
        objToSend,
        'ble.get_characteristic_result_finish',
        results
      );
    }
  }

  notifyFromBinaryReadChacateristics(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
      { name: 'data', type: 'dataArray', length: null },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.read_characteristic_result', results);
  }

  notifyFromBinaryWriteChacateristics(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.write_characteristic_result', results);
  }

  notifyFromBinaryRegisterNotifyChacateristic(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.register_nofity_characteristic_result',
      results
    );
  }

  notifyFromBinaryUnregisterNotifyChacateristic(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.unregister_nofity_characteristic_result',
      results
    );
  }
  notifyFromBinaryNotifyChacateristic(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'is_notify', type: 'int', length: 1 },
      { name: 'data', type: 'dataArray', length: null },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.is_notify = results.is_notify === 1;
    this._addRowForPath(objToSend, 'ble.nofity_characteristic', results);
  }

  notifyFromBinaryDescriptors(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    if (results.descriptor_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_descriptor_result', results);
    } else {
      delete results.descriptor_uuid;
      this._addRowForPath(
        objToSend,
        'ble.get_descriptor_result_finish',
        results
      );
    }
  }

  notifyFromBinaryReadDescriptor(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
      { name: 'data', type: 'dataArray', length: null },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.read_descriptor_result', results);
  }

  notifyFromBinaryWriteDescriptor(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.write_descriptor_result', results);
  }

  notifyFromBinaryServerConnectionState(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      {
        name: 'status',
        type: 'enum',
        length: 1,
        enum: { connected: 1, disconnected: 0 },
      },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, 'ble.peripheral.connection_status', results);
  }

  notifyFromBinaryServerWriteCharavteristicValue(objToSend, payload) {
    let schema = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.peripheral.write_characteristic_result',
      results
    );
  }

  notifyFromBinaryServerReadCharavteristicValue(objToSend, payload) {
    let schema = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(
      objToSend,
      'ble.peripheral.read_characteristic_result',
      results
    );
  }

  notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_read_characteristic',
      results
    );
  }

  notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_write_characteristic',
      results
    );
  }

  notifyFromBinaryServerReadDescriptorValue(objToSend, payload) {
    let schema = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(
      objToSend,
      'ble.peripheral.read_descriptor_result',
      results
    );
  }

  notifyFromBinaryServerWriteDescriptorValue(objToSend, payload) {
    let schema = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result =
      results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.peripheral.write_descriptor_result',
      results
    );
  }

  notifyFromBinaryServerNotifyReadDescriptorValue(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_read_descriptor',
      results
    );
  }

  notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend, payload) {
    let schema = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_write_descriptor',
      results
    );
  }

  notifyFromBinaryError(objToSend, payload) {
    let schema = [
      { name: 'esp_error_code', type: 'char', length: 1 },
      { name: 'error_code', type: 'char', length: 1 },
      { name: 'function_code', type: 'char', length: 1 },
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
    ];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    let errorMessage = {
      0x00: 'no error',
      0x01: 'device not connected',
      0x02: 'service not found',
      0x03: 'charavteristic not found',
      0x04: 'descriptor not found',
      0x05: 'no permission',
      0x06: 'device not found',
      0x07: 'ble is busy',
      0x08: 'service already running',
      0xff: 'error',
    };

    let functionMessage = {
      0: 'on setting advertisement data',
      1: 'on setting scan response data',
      2: 'on starting advertisement',
      3: 'on stopping advertisement',
      4: 'on starting scan',
      5: 'on stoping scan',
      6: '',
      7: 'on connecting device',
      8: 'on getting services',
      9: 'on getting characteristic',
      10: 'on writing characteristic',
      11: 'on reading characteristic',
      14: 'on getting descriptor',
      15: 'on writing descriptor',
      16: 'on reading descriptor',
      20: 'on start pheripheral',
      21: 'on notify connect',
      22: 'on adding service',
      23: 'on adding characteristic',
      24: 'on adding descriptor',
      25: 'on writing characteristic',
      26: 'on reading characteristic',
      27: 'on writing characteristic from remote',
      28: 'on reading characteristic from remote',
      29: 'on writing descriptor',
      30: 'on reading descriptor',
      31: 'on writing descriptor from remote',
      32: 'on reading descriptor from remote',
    };

    results.message =
      errorMessage[results.error_code] +
      ' ' +
      functionMessage[results.function_code];

    delete results.esp_error_code;
    delete results.function_code;

    this.envelopError(objToSend, 'ble', results);
  }

  _addRowForPath(sendObj, path, row) {
    let keys = path.split('.');
    let target = sendObj;
    for (let index = 0; index < keys.length - 1; index++) {
      target[keys[index]] = target[keys[index]] || {};
      target = target[keys[index]];
    }
    target[keys[keys.length - 1]] = row;
  }
}

module.exports = WSCommand_Ble;


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Directive.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");
const ObnizUtil = __webpack_require__("./obniz/libs/utils/util.js");

module.exports = class WSCommand_Directive extends WSCommand {
  constructor(delegate) {
    super(delegate);
    this.module = 1;

    this._CommandRegistrate = 0;
    this._CommandPause = 1;
    this._CommandResume = 2;

    const CommandIO = __webpack_require__("./obniz/libs/wscommand/WSCommand_IO.js");
    const CommandPWM = __webpack_require__("./obniz/libs/wscommand/WSCommand_PWM.js");

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


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Display.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");
const qrcode = __webpack_require__("./obniz/libs/utils/qr.js");

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
    let result;
    const buf = Buffer(text, 'utf8');
    result = new Uint8Array(buf);
    this.print(result);
  }

  text(params) {
    this.printText(params.text);
  }

  raw(params) {
    this.drawHorizonally(new Uint8Array(params.raw));
  }

  qr(params) {
    const text = params.qr.text;
    const correctionLevel = params.qr.correction || 'M';

    const typeNumber = 0; // auto detect type.
    const qr = qrcode(typeNumber, correctionLevel);
    qr.addData(text);
    qr.make();
    let size = qr.getModuleCount();
    if (size) {
      size *= 2;
      const modules = qr.getModules();
      let vram = new Uint8Array(1024);
      vram.fill(0);

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < size + 4; col++) {
          vram[parseInt(row * 16 + col / 8)] |= 0x80 >> col % 8;
          vram[parseInt((row + size + 2) * 16 + col / 8)] |= 0x80 >> col % 8;
        }
      }
      for (let row = 2; row < size + 2; row++) {
        for (let col = 0; col < 2; col++) {
          vram[parseInt(row * 16 + col / 8)] |= 0x80 >> col % 8;
        }
        for (let col = size + 2; col < size + 4; col++) {
          vram[parseInt(row * 16 + col / 8)] |= 0x80 >> col % 8;
        }
      }

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (!modules[parseInt(row / 2)][parseInt(col / 2)]) {
            vram[parseInt((row + 2) * 16 + (col + 2) / 8)] |=
              0x80 >> (col + 2) % 8;
          }
        }
      }
      this.drawHorizonally(vram);
    }
  }

  pinName(params) {
    for (let i = 0; i < 12; i++) {
      if (typeof params.pin_assign[i] === 'object') {
        this.setPinName(
          i,
          params.pin_assign[i].module_name || '?',
          params.pin_assign[i].pin_name || '?'
        );
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
    let buf = new Uint8Array([!val]);
    this.sendCommand(this._CommandDrawIOState, buf);
  }

  setPinName(no, moduleName, pinName) {
    let str = moduleName.slice(0, 4) + ' ' + pinName;
    str = str.slice(0, 9);

    let buf = new Uint8Array(1);
    buf[0] = no;

    let stringarray = new Uint8Array(Buffer(str, 'utf8'));
    let combined = new Uint8Array(buf.length + stringarray.length);
    combined.set(buf, 0);
    combined.set(stringarray, 1);

    this.sendCommand(this._CommandSetPinName, combined);
  }

  parseFromJson(json) {
    let module = json['display'];
    if (module === undefined) {
      return;
    }

    let schemaData = [
      { uri: '/request/display/clear', onValid: this.clear },
      { uri: '/request/display/text', onValid: this.text },
      { uri: '/request/display/raw', onValid: this.raw },
      { uri: '/request/display/pin_assign', onValid: this.pinName },
      { uri: '/request/display/qr', onValid: this.qr },
    ];
    let res = this.validateCommandSchema(schemaData, module, 'display');

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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_I2C.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

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
    let mode = 0;
    let sda = parseInt(params.sda);
    let scl = parseInt(params.scl);
    let clock = parseInt(params.clock);

    let buf = new Uint8Array(8);
    buf[0] = module;
    buf[1] = mode;
    buf[2] = sda;
    buf[3] = scl;
    buf[4] = clock >> (3 * 8);
    buf[5] = clock >> (2 * 8);
    buf[6] = clock >> (1 * 8);
    buf[7] = clock;

    this.sendCommand(this._CommandInit, buf);
  }

  initSlave(params, module) {
    let mode = 1;
    let sda = parseInt(params.sda);
    let scl = parseInt(params.scl);
    let clock = 0;

    let addressLength = params.slave_address_length;
    let address = params.slave_address;
    if (address > 0x7f) {
      addressLength = 10;
    }

    let buf = new Uint8Array(11);
    buf[0] = module;
    buf[1] = mode;
    buf[2] = sda;
    buf[3] = scl;
    buf[4] = clock >> (3 * 8);
    buf[5] = clock >> (2 * 8);
    buf[6] = clock >> (1 * 8);
    buf[7] = clock;
    buf[8] = addressLength;
    buf[9] = address >> 8;
    buf[10] = address;

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    let buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  write(params, module) {
    let address = parseInt(params.address);

    if (params.address_bits === 10 || address > 0x7f) {
      address = address | 0x8000; // mark 10bit mode
    }
    let buf = new Uint8Array(3 + params.data.length);
    buf[0] = module;
    buf[1] = address >> 8;
    buf[2] = address;
    buf.set(params.data, 3);
    this.sendCommand(this._CommandWrite, buf);
  }

  read(params, module) {
    let address = parseInt(params.address);

    if (params.address_bits === 10 || address > 0x7f) {
      address = address | 0x8000; // mark 10bit mode
    }
    let read_length = params.read;
    let buf = new Uint8Array(7);
    buf[0] = module;
    buf[1] = address >> 8;
    buf[2] = address;
    buf[3] = read_length >> (3 * 8);
    buf[4] = read_length >> (2 * 8);
    buf[5] = read_length >> (1 * 8);
    buf[6] = read_length;
    this.sendCommand(this._CommandRead, buf);
  }

  parseFromJson(json) {
    // 0
    for (let i = 0; i < 1; i++) {
      let module = json['i2c' + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        { uri: '/request/i2c/init_master', onValid: this.initMaster },
        { uri: '/request/i2c/init_slave', onValid: this.initSlave },
        { uri: '/request/i2c/write', onValid: this.write },
        { uri: '/request/i2c/read', onValid: this.read },
        { uri: '/request/i2c/deinit', onValid: this.deinit },
      ];
      let res = this.validateCommandSchema(schemaData, module, 'i2c' + i, i);

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
      let module_index = payload[0];
      let address = (payload[1] << 8) + payload[2];

      let arr = new Array(payload.byteLength - 3);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 3];
      }

      objToSend['i2c' + module_index] = {
        mode: 'master',
        address: address,
        data: arr,
      };
    } else if (func === this._CommandSlvWritten && payload.byteLength > 4) {
      let module_index = payload[0];
      // let address_bit_length = payload[1];
      let address = (payload[2] << 8) + payload[3];

      let arr = new Array(payload.byteLength - 4);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 4];
      }

      objToSend['i2c' + module_index] = {
        mode: 'slave',
        is_fragmented: true,
        address: address,
        data: arr,
      };
    } else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength > 2) {
      // const _esperr = payload[0];
      const err = payload[1];
      const ref_func_id = payload[2];

      if (
        ref_func_id === this._CommandWrite ||
        ref_func_id === this._CommandRead
      ) {
        let reason =
          '' +
          (ref_func_id === this._CommandWrite ? 'writing' : 'reading') +
          ' error. ';
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
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH = 1;
const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW = 2;
const COMMAND_IO_ERRORS_IO_TOO_LOW = 3;
const COMMAND_IO_ERRORS_IO_TOO_HIGH = 4;
const COMMAND_IO_ERRORS_IO_FORCE_RELEASED = 0xf0;

const COMMAND_IO_ERROR_MESSAGES = {
  0: 'unknown error',
  1: 'heavy output. output voltage is too low when driving high',
  2: 'heavy output. output voltage is too high when driving low',
  3: 'output voltage is too low when driving high. io state has changed output to input',
  4: 'output voltage is too high when driving low. io state has changed output to input',
};

const COMMAND_IO_MUTEX_NAMES = {
  1: 'io.input',
  2: 'io.output',
  3: 'pwm',
  4: 'uart',
  5: 'i2c',
  6: 'spi',
  7: 'LogicAnalyzer',
  8: 'Measure',
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
    let buf = new Uint8Array([id, value]);
    this.sendCommand(this._CommandOutput, buf);
  }

  outputDetail(params, id) {
    let buf = new Uint8Array([id, params.value]);
    this.sendCommand(this._CommandOutput, buf);
  }

  input(params, id) {
    let buf = new Uint8Array([id]);
    this.sendCommand(this._CommandInputOnece, buf);
  }

  inputDetail(params, id) {
    let buf = new Uint8Array([id]);
    this.sendCommand(
      params.stream ? this._CommandInputStream : this._CommandInputOnece,
      buf
    );
  }

  outputType(params, id) {
    let buf = new Uint8Array(2);
    buf[0] = id;
    if (params.output_type === 'push-pull5v') {
      buf[1] = 0;
    } else if (params.output_type === 'push-pull3v') {
      buf[1] = 2;
    } else if (params.output_type === 'open-drain') {
      buf[1] = 3;
    } else {
      return 'io unknown outputtype: ' + params.output_type;
    }
    this.sendCommand(this._CommandOutputType, buf);
  }

  pullType(params, id) {
    let buf = new Uint8Array(2);
    buf[0] = id;
    if (params.pull_type === 'float') {
      buf[1] = 0;
    } else if (params.pull_type === 'pull-up3v') {
      buf[1] = 1;
    } else if (params.pull_type === 'pull-down') {
      buf[1] = 2;
    } else if (params.pull_type === 'pull-up5v') {
      buf[1] = 3;
    } else {
      return 'io unknown pull_type: ' + params.pull_type;
    }
    this.sendCommand(this._CommandPullResisterType, buf);
  }

  deinit(params, id) {
    let buf = new Uint8Array([id]);
    this.sendCommand(this._CommandEnd, buf);
  }

  parseFromJson(json) {
    for (let i = 0; i <= 11; i++) {
      let module = json['io' + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        { uri: '/request/io/input', onValid: this.input },
        { uri: '/request/io/input_detail', onValid: this.inputDetail },
        { uri: '/request/io/output', onValid: this.output },
        { uri: '/request/io/output_detail', onValid: this.outputDetail },
        { uri: '/request/io/output_type', onValid: this.outputType },
        { uri: '/request/io/pull_type', onValid: this.pullType },
        { uri: '/request/io/deinit', onValid: this.deinit },
      ];
      let res = this.validateCommandSchema(schemaData, module, 'io' + i, i);

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
      for (let i = 0; i < payload.byteLength; i += 2) {
        objToSend['io' + payload[i]] = payload[i + 1] > 0;
      }
    } else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength >= 4) {
      // const esperr = payload[0];
      const err = payload[1];
      // const ref_func_id = payload[2];
      const module_index = payload[3];

      if (
        err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH ||
        err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW
      ) {
        this.envelopWarning(objToSend, `io${module_index}`, {
          message: COMMAND_IO_ERROR_MESSAGES[err],
        });
      } else if (
        err === COMMAND_IO_ERRORS_IO_TOO_LOW ||
        err === COMMAND_IO_ERRORS_IO_TOO_HIGH
      ) {
        this.envelopError(objToSend, `io${module_index}`, {
          message: COMMAND_IO_ERROR_MESSAGES[err],
        });
      } else if (
        err === COMMAND_IO_ERRORS_IO_FORCE_RELEASED &&
        payload.byteLength >= 6
      ) {
        const oldMutexOwner = payload[4];
        const newMutexOwner = payload[5];
        this.envelopWarning(objToSend, 'debug', {
          message: `io${module_index} binded "${
            COMMAND_IO_MUTEX_NAMES[oldMutexOwner]
          }" was stopped. "${
            COMMAND_IO_MUTEX_NAMES[newMutexOwner]
          }" have started using this io.`,
        });
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_IO;


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_LogicAnalyzer.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

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

    let matchValue = parseInt(params.trigger.value);
    let matchCount = params.trigger.samples;
    let buf = new Uint8Array(12);
    buf[0] = 1;
    buf[1] = io;
    buf[2] = intervalUsec >> (8 * 3);
    buf[3] = intervalUsec >> (8 * 2);
    buf[4] = intervalUsec >> (8 * 1);
    buf[5] = intervalUsec;
    buf[6] = durationUsec >> (8 * 3);
    buf[7] = durationUsec >> (8 * 2);
    buf[8] = durationUsec >> (8 * 1);
    buf[9] = durationUsec;
    buf[10] = matchValue;
    buf[11] = matchCount;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params) {
    let buf = new Uint8Array(0);
    this.sendCommand(this._CommandDeinit, buf);
  }

  parseFromJson(json) {
    let module = json['logic_analyzer'];
    if (module === undefined) {
      return;
    }
    let schemaData = [
      { uri: '/request/logicAnalyzer/init', onValid: this.init },
      { uri: '/request/logicAnalyzer/deinit', onValid: this.deinit },
    ];
    let res = this.validateCommandSchema(schemaData, module, 'logic_analyzer');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(
          `[logic_analyzer]unknown command`
        );
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
          arr[offset] = byte & (0x80 >>> bit) ? 1 : 0;
          offset++;
        }
      }
      objToSend['logic_analyzer'] = {
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_LogicAnalyzer;


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Measurement.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_Measurement extends WSCommand {
  constructor(delegate) {
    super(delegate);
    this.module = 12;

    this._CommandMeasurementEcho = 0;
  }

  // Commands

  echo(params) {
    let triggerIO = params.echo.io_pulse;
    let triggerPosNeg = params.echo.pulse === 'negative' ? false : true;
    let triggerWidthUs = parseInt(params.echo.pulse_width * 1000);
    let echoIO = params.echo.io_echo;
    let responseCount = params.echo.measure_edges;
    let timeoutUs = params.echo.timeout * 1000;
    timeoutUs = parseInt(timeoutUs);

    let buf = new Uint8Array(13);
    buf[0] = 0;
    buf[1] = triggerIO;
    buf[2] = triggerPosNeg ? 1 : 0;
    buf[3] = triggerWidthUs >> (8 * 3);
    buf[4] = triggerWidthUs >> (8 * 2);
    buf[5] = triggerWidthUs >> 8;
    buf[6] = triggerWidthUs;
    buf[7] = echoIO;
    buf[8] = responseCount;
    buf[9] = timeoutUs >> (8 * 3);
    buf[10] = timeoutUs >> (8 * 2);
    buf[11] = timeoutUs >> 8;
    buf[12] = timeoutUs;
    this.sendCommand(this._CommandMeasurementEcho, buf);
  }

  parseFromJson(json) {
    let module = json['measure'];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: '/request/measure/echo', onValid: this.echo }];
    let res = this.validateCommandSchema(schemaData, module, 'measure');

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
      let index = 0;
      let count = parseInt(payload[index++]);
      let array = [];
      for (let i = 0; i < count; i++) {
        let timing;
        let edge = payload[index++] > 0 ? true : false;
        timing = payload[index++] << (8 * 3);
        timing += payload[index++] << (8 * 2);
        timing += payload[index++] << 8;
        timing += payload[index++];
        timing = timing / 1000;
        array.push({
          edge,
          timing,
        });
      }
      objToSend['measure'] = {
        echo: array,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_Measurement;


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_PWM.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

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
    for (let i = 0; i < this.ModuleNum; i++) {
      this.pwms.push({});
    }
  }

  // Commands

  init(params, module) {
    let buf = new Uint8Array(2);
    buf[0] = module;
    buf[1] = params.io;
    this.pwms[module].io = params.io;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    let buf = new Uint8Array(1);
    buf[0] = module;
    this.pwms[module] = {};
    this.sendCommand(this._CommandDeinit, buf);
  }

  freq(params, module) {
    let buf = new Uint8Array(5);
    buf[0] = module;
    buf[1] = params.freq >> (8 * 3);
    buf[2] = params.freq >> (8 * 2);
    buf[3] = params.freq >> (8 * 1);
    buf[4] = params.freq;
    this.pwms[module].freq = params.freq;
    this.sendCommand(this._CommandSetFreq, buf);
  }

  pulse(params, module) {
    let buf = new Uint8Array(5);
    let pulseUSec = params.pulse * 1000;
    buf[0] = module;
    buf[1] = pulseUSec >> (8 * 3);
    buf[2] = pulseUSec >> (8 * 2);
    buf[3] = pulseUSec >> (8 * 1);
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
    buf[1] = symbol_length_usec >> (8 * 3);
    buf[2] = symbol_length_usec >> (8 * 2);
    buf[3] = symbol_length_usec >> (8 * 1);
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
    for (let i = 0; i < this.ModuleNum; i++) {
      let module = json['pwm' + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        { uri: '/request/pwm/init', onValid: this.init },
        { uri: '/request/pwm/freq', onValid: this.freq },
        { uri: '/request/pwm/pulse', onValid: this.pulse },
        { uri: '/request/pwm/modulate', onValid: this.amModulate },
        { uri: '/request/pwm/deinit', onValid: this.deinit },
      ];
      let res = this.validateCommandSchema(schemaData, module, 'pwm' + i, i);

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
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

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
    let mode = 0; //master mode

    let clk = params.clk;
    let mosi = params.mosi;
    let miso = params.miso;
    let cs = params.cs;

    let clock = params.clock;

    if (clk === null && mosi === null && miso === null) {
      throw new Error('spi: master mode require one of clk/mosi/miso');
    }

    if (clk === null) clk = this.ioNotUsed;
    if (mosi === null) mosi = this.ioNotUsed;
    if (miso === null) miso = this.ioNotUsed;
    if (cs === null) cs = this.ioNotUsed;

    let buf = new Uint8Array(11);
    buf[0] = module;
    buf[1] = mode;
    buf[2] = clk;
    buf[3] = mosi;
    buf[4] = miso;
    buf[5] = this.ioNotUsed; //wp
    buf[6] = this.ioNotUsed; // hd
    buf[7] = clock >> (3 * 8);
    buf[8] = clock >> (2 * 8);
    buf[9] = clock >> (1 * 8);
    buf[10] = clock;
    buf[11] = cs;

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    let buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  write(params, module) {
    let buf = new Uint8Array(1 + params.data.length);
    buf[0] = module;
    buf.set(params.data, 1);
    if (params.read) {
      this.sendCommand(this._CommandWriteRead, buf);
    } else {
      this.sendCommand(this._CommandWrite, buf);
    }
  }

  parseFromJson(json) {
    for (let i = 0; i < 2; i++) {
      let module = json['spi' + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        { uri: '/request/spi/init_master', onValid: this.initMaster },
        { uri: '/request/spi/write', onValid: this.write },
        { uri: '/request/spi/deinit', onValid: this.deinit },
      ];
      let res = this.validateCommandSchema(schemaData, module, 'spi' + i, i);

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
      let module_index = payload[0];
      // var received = payload.slice(1);

      let arr = new Array(payload.byteLength - 1);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 1];
      }
      objToSend['spi' + module_index] = {
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_SPI;


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_Switch.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_Switch extends WSCommand {
  constructor(delegate) {
    super(delegate);
    this.module = 9;

    this._CommandNotifyValue = 0;
    this._CommandOnece = 1;
  }

  // Commands

  get(params) {
    let buf = new Uint8Array(0);
    this.sendCommand(this._CommandOnece, buf);
  }

  parseFromJson(json) {
    let module = json['switch'];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: '/request/switch/get', onValid: this.get }];
    let res = this.validateCommandSchema(schemaData, module, 'switch');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[switch]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (
      (func === this._CommandOnece || func === this._CommandNotifyValue) &&
      payload.byteLength == 1
    ) {
      let state = parseInt(payload[0]);
      let states = ['none', 'push', 'left', 'right'];
      objToSend['switch'] = {
        state: states[state],
      };
      if (func === this._CommandOnece) {
        objToSend['switch'].action = 'get';
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_Switch;


/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_System.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

class WSCommand_System extends WSCommand {
  constructor(delegate) {
    super(delegate);
    this.module = 0;

    this._CommandReboot = 0;

    this._CommandReset = 2;
    this._CommandSelfCheck = 3;
    this._CommandWait = 4;
    this._CommandResetOnDisconnect = 5;

    this._CommandPingPong = 8;
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
    let buf = new Uint8Array([msec >> 8, msec]);
    this.sendCommand(this._CommandWait, buf);
  }

  keepWorkingAtOffline(params) {
    this.resetOnDisconnect(!params.keep_working_at_offline);
  }

  ping(params) {
    let unixtime = new Date().getTime();
    let buf = new Uint8Array(params.ping.key.length + 8);
    let upper = Math.floor(unixtime / Math.pow(2, 32));
    let lower = unixtime - upper * Math.pow(2, 32);
    buf[0] = upper >> (8 * 3);
    buf[1] = upper >> (8 * 2);
    buf[2] = upper >> (8 * 1);
    buf[3] = upper >> (8 * 0);
    buf[4] = lower >> (8 * 3);
    buf[5] = lower >> (8 * 2);
    buf[6] = lower >> (8 * 1);
    buf[7] = lower >> (8 * 0);
    for (let i = 0; i < params.ping.key.length; i++) {
      buf[8 + i] = params.ping.key[i];
    }

    this.sendCommand(this._CommandPingPong, buf);
  }

  resetOnDisconnect(mustReset) {
    let buf = new Uint8Array([mustReset ? 1 : 0]);
    this.sendCommand(this._CommandResetOnDisconnect, buf);
  }

  parseFromJson(json) {
    let module = json['system'];
    if (module === undefined) {
      return;
    }

    let schemaData = [
      { uri: '/request/system/reboot', onValid: this.reboot },
      { uri: '/request/system/reset', onValid: this.reset },
      { uri: '/request/system/wait', onValid: this.wait },
      { uri: '/request/system/selfCheck', onValid: this.selfCheck },
      {
        uri: '/request/system/keepWorkingAtOffline',
        onValid: this.keepWorkingAtOffline,
      },
      { uri: '/request/system/ping', onValid: this.ping },
    ];
    let res = this.validateCommandSchema(schemaData, module, 'system');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[system]unknown command`);
      }
    }
  }

  pong(objToSend, payload) {
    objToSend['system'] = objToSend['system'] || {};
    const pongServerTime = new Date().getTime();

    if (payload.length >= 16) {
      payload = Buffer(payload);
      let obnizTime =
        payload.readUIntBE(0, 4) * Math.pow(2, 32) + payload.readUIntBE(4, 4);
      let pingServerTime =
        payload.readUIntBE(8, 4) * Math.pow(2, 32) + payload.readUIntBE(12, 4);
      let key = [];
      for (let i = 16; i < payload.length; i++) {
        key.push(payload[i]);
      }
      objToSend['system'].pong = {
        key,
        obnizTime,
        pingServerTime,
        pongServerTime,
      };
    } else {
      objToSend['system'].pong = {
        pongServerTime,
      };
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    switch (func) {
      case this._CommandVCC:
        if (payload.byteLength === 3) {
          let value = (payload[1] << 8) + payload[2];
          value = value / 100.0;
          this.envelopWarning(objToSend, 'debug', {
            message: `Low Voltage ${value}v. connect obniz to more powerful USB.`,
          });
        }
        break;

      case this._CommandPingPong:
        this.pong(objToSend, payload);

        break;

      default:
        super.notifyFromBinary(objToSend, func, payload);
        break;
    }
  }
}

module.exports = WSCommand_System;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./obniz/libs/wscommand/WSCommand_UART.js":
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

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
    let buf = new Uint8Array(13);
    buf[0] = module;
    buf[1] = parseInt(params.tx);
    buf[2] = parseInt(params.rx);

    buf[3] = params.baud >> (3 * 8);
    buf[4] = params.baud >> (2 * 8);
    buf[5] = params.baud >> (1 * 8);
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
      throw new Error('uart: invalid stop bits');
    }

    buf[8] = params.bits;

    if (params.parity === 'even') {
      buf[9] = 2;
    } else if (params.parity === 'odd') {
      buf[9] = 3;
    }

    if (params.flowcontrol === 'rts') {
      buf[10] = 2;
    } else if (params.flowcontrol === 'cts') {
      buf[10] = 3;
    } else if (params.flowcontrol === 'rts-cts') {
      buf[10] = 4;
    }

    if (params.rts !== null) buf[11] = params.rts;
    if (params.cts !== null) buf[12] = params.cts;

    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    let buf = new Uint8Array(1);
    buf[0] = module;
    this.sendCommand(this._CommandDeinit, buf);
  }

  send(params, module) {
    let buf = new Uint8Array(1 + params.data.length);
    buf[0] = module;
    buf.set(params.data, 1);
    this.sendCommand(this._CommandSend, buf);
  }

  parseFromJson(json) {
    // 0~2
    for (let i = 0; i < 3; i++) {
      let module = json['uart' + i];
      if (module === undefined) {
        continue;
      }
      let schemaData = [
        { uri: '/request/uart/init', onValid: this.init },
        { uri: '/request/uart/send', onValid: this.send },
        { uri: '/request/uart/deinit', onValid: this.deinit },
      ];
      let res = this.validateCommandSchema(schemaData, module, 'uart' + i, i);

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
      let module_index = payload[0];
      let arr = new Array(payload.byteLength - 1);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 1];
      }

      objToSend['uart' + module_index] = {
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_UART;


/***/ }),

/***/ "./obniz/libs/wscommand/WSSchema.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const tv4 = __webpack_require__("./node_modules/tv4/tv4.js");

tv4.defineError('UNIQUE_KEYS', 10001, '{uniqueKeys} are must be unique value.');

tv4.defineKeyword('uniqueKeys', function(data, value, schema) {
  if (!Array.isArray(value)) {
    return null;
  }
  let targets = [];
  for (let key of value) {
    if (data[key] !== null && data[key] !== undefined) {
      targets.push(data[key]);
    }
  }
  let duplicated = targets.filter(function(x, i, self) {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });
  if (duplicated.length > 0) {
    return {
      code: tv4.errorCodes.UNIQUE_KEYS,
      message: { uniqueKeys: value.join(',') },
    };
  }
  return null;
});

//todo

let wsSchema = [];
__webpack_require__("./obniz/libs/wscommand sync recursive").context = __webpack_require__("./obniz/libs/webpackReplace/require-context-browser.js");
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
/***/ (function(module, exports, __webpack_require__) {

const WSCommand = __webpack_require__("./obniz/libs/wscommand/WSCommand_.js");

/* eslint-disable */
WSCommand.addCommandClass('WSCommand_System', __webpack_require__("./obniz/libs/wscommand/WSCommand_System.js"));
WSCommand.addCommandClass('WSCommand_Directive',  __webpack_require__("./obniz/libs/wscommand/WSCommand_Directive.js"));
WSCommand.addCommandClass('WSCommand_IO', __webpack_require__("./obniz/libs/wscommand/WSCommand_IO.js"));
WSCommand.addCommandClass('WSCommand_PWM', __webpack_require__("./obniz/libs/wscommand/WSCommand_PWM.js"));
WSCommand.addCommandClass('WSCommand_UART', __webpack_require__("./obniz/libs/wscommand/WSCommand_UART.js"));
WSCommand.addCommandClass('WSCommand_AD', __webpack_require__("./obniz/libs/wscommand/WSCommand_AD.js"));
WSCommand.addCommandClass('WSCommand_SPI', __webpack_require__("./obniz/libs/wscommand/WSCommand_SPI.js"));
WSCommand.addCommandClass('WSCommand_I2C', __webpack_require__("./obniz/libs/wscommand/WSCommand_I2C.js"));
WSCommand.addCommandClass('WSCommand_LogicAnalyzer',  __webpack_require__("./obniz/libs/wscommand/WSCommand_LogicAnalyzer.js"));
WSCommand.addCommandClass('WSCommand_Display', __webpack_require__("./obniz/libs/wscommand/WSCommand_Display.js"));
WSCommand.addCommandClass('WSCommand_Switch', __webpack_require__("./obniz/libs/wscommand/WSCommand_Switch.js"));
WSCommand.addCommandClass('WSCommand_Ble', __webpack_require__("./obniz/libs/wscommand/WSCommand_Ble.js"));
WSCommand.addCommandClass( 'WSCommand_Measurement',  __webpack_require__("./obniz/libs/wscommand/WSCommand_Measurement.js"));

module.exports = WSCommand;


/***/ }),

/***/ "./obniz/libs/wscommand/jsonBinaryConverter.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {class JsonBinaryConverter {
  static convertFromBinaryToJson(schema, binary) {
    let types = {
      hex: this.hexFromBinary.bind(this),
      uuid: this.uuidFromBinary.bind(this),
      number: this.numberFromBinary.bind(this),
      'signed number': this.signedNumberFromBinary.bind(this),
      int: this.numberFromBinary.bind(this),
      char: this.numberFromBinary.bind(this),
      enum: this.enumFromBinary.bind(this),
      dataArray: this.dataArrayFromBinary.bind(this),
    };
    let json = {};
    let count = 0;
    for (let i = 0; i < schema.length; i++) {
      let data = binary.slice(
        count,
        schema[i].length ? count + schema[i].length : undefined
      );
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
    let str = '';
    for (let i = 0; i < data.length; i++) {
      if (schema.endianness && schema.endianness === 'little') {
        str = ('00' + data[i].toString(16)).slice(-2) + str;
      } else {
        str = str + ('00' + data[i].toString(16)).slice(-2);
      }
    }
    return str;
  }

  static uuidFromBinary(data) {
    let len = data[0] * 16 + data[1];
    if (len === 0) {
      return null;
    }
    let uuidData = data.slice(2);
    let str = '';
    for (let i = 0; i < len; i++) {
      str = ('00' + uuidData[i].toString(16)).slice(-2) + str;
    }
    return str;
  }

  static signedNumberFromBinary(data) {
    //big adian
    let val = data[0] & 0x7f;
    for (let i = 1; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    if ((data[0] & 0x80) !== 0) {
      val = val - Math.pow(2, data.length * 8 - 1);
    }
    return val;
  }

  static numberFromBinary(data) {
    //big adian
    let val = 0;
    for (let i = 0; i < data.length; i++) {
      val = val * 256 + data[i];
    }
    return val;
  }

  static keyForVal(enumvals, val) {
    return Object.keys(enumvals).filter(function(k) {
      return enumvals[k] === val;
    })[0];
  }

  static enumFromBinary(data, schema) {
    let enumVals = schema.enum;
    let val = this.numberFromBinary(data);

    if (schema.flags === true) {
      let temp = [];
      for (let key of Object.keys(enumVals)) {
        let flag = enumVals[key] & val;
        if (flag) {
          temp.push(key);
        }
      }
      val = temp;
    } else {
      let tmp = this.keyForVal(enumVals, val);
      if (tmp) {
        val = tmp;
      }
    }
    return val;
  }

  static dataArrayFromBinary(data) {
    let arr = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      arr[i] = data[i];
    }
    return arr;
  }

  static createSendBuffer(schema, data) {
    let array = [];
    for (let i = 0; i < schema.length; i++) {
      let schemaRow = schema[i];

      let row = undefined;
      if (Array.isArray(schemaRow)) {
        for (let key in schemaRow) {
          let customSchemaRow = Object.assign({}, schemaRow[key], {
            required: true,
          });
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
    let types = {
      hex: this.hexToBinary.bind(this),
      uuid: this.uuidToBinary.bind(this),
      int: this.intToBinary.bind(this),
      char: this.charToBinary.bind(this),
      dataArray: this.dataArrayToBinary.bind(this),
      enum: this.enumToBinary.bind(this),
      string: this.stringToBinary.bind(this),
      text: this.stringToBinary.bind(this),
      flag: this.flagToBinary.bind(this),
    };

    let val = undefined;
    if (schemaRow.path) {
      val = this.getProperty(allData, schemaRow.path);
    }
    if (val === undefined && schemaRow.required) {
      return null;
    }
    if (val === undefined && schemaRow.default) {
      val = schemaRow.default;
    }

    let row = types[schemaRow.type](val, schemaRow);

    if (schemaRow.length && row.length !== schemaRow.length) {
      console.log('JSON->BINARY SCHEMA ERROR: (', val, ')', schemaRow);
    }

    return row;
  }

  static getProperty(object, path) {
    if (path === '' || path === undefined) {
      return object;
    }
    if (typeof path === 'string') path = path.split('.');
    if (!Array.isArray(path)) path = [path];

    let index = 0,
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
    let array = [];
    let hex = data.toLowerCase().replace(/[^0-9abcdef]/g, '');
    for (let i = 0; i < hex.length / 2; i++) {
      array[i] = parseInt(hex[i * 2] + hex[i * 2 + 1], 16);
    }
    if (schema && schema.endianness && schema.endianness === 'little') {
      array.reverse();
    }
    return array;
  }

  static intToBinary(data) {
    let array = [];
    array[0] = (data >> (8 * 3)) & 0xff;
    array[1] = (data >> (8 * 2)) & 0xff;
    array[2] = (data >> (8 * 1)) & 0xff;
    array[3] = (data >> (8 * 0)) & 0xff;
    return array;
  }

  static charToBinary(data) {
    let array = [];
    array[0] = data & 0xff;
    return array;
  }

  static dataArrayToBinary(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return data;
  }

  static uuidToBinary(data) {
    let uuid = this.hexToBinary(data);
    uuid.reverse(); //big endianness -> little endianness;
    let length = uuid.length;

    let array = [];

    array[0] = (length >> (8 * 1)) & 0xff;
    array[1] = (length >> (8 * 0)) & 0xff;

    Array.prototype.push.apply(array, uuid);
    for (let i = array.length; i < 16 + 2; i++) {
      array[i] = 0;
    }

    return array;
  }

  static enumToBinary(data, schema) {
    let array = [];
    array.push(schema.enum[data]);
    return array;
  }

  static flagToBinary(data, schema) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    let flags = schema.flags;
    let value = 0;
    for (let key in flags) {
      if (data.includes(flags[key])) {
        value += parseInt(key);
      }
    }
    let array = [];
    let length = schema.length || 1;
    for (let i = length - 1; i >= 0; i--) {
      array.push((value >> i) & 0xff);
    }

    return array;
  }

  static stringToBinary(data) {
    return new Uint8Array(Buffer(data, 'utf8'));
  }
}

module.exports = JsonBinaryConverter;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./package.json":
/***/ (function(module) {

module.exports = {"name":"obniz","version":"1.7.2","description":"obniz sdk for javascript","main":"index.js","scripts":{"test":"nyc --reporter=text --reporter=html mocha $NODE_DEBUG_OPTION  ./test/index.js","buildAndtest":"npm run build && npm test","realtest":"mocha $NODE_DEBUG_OPTION -b ./realtest/index.js","local":"gulp --gulpfile ./_tools/server.js --cwd .","build":"npm run lint && gulp $NODE_DEBUG_OPTION --gulpfile ./_tools/server.js --cwd . build","version":"npm run build && git add obniz.js && git add obniz.min.js && git add obniz.node6_10.js","lint":"eslint --fix .","precommit":"lint-staged"},"lint-staged":{"*.js":["eslint --fix","git add"]},"keywords":["obniz"],"repository":"obniz/obniz","author":"yukisato <yuki@yuki-sato.com>","homepage":"https://obniz.io/","license":"SEE LICENSE IN LICENSE.txt","devDependencies":{"babel-cli":"^6.26.0","babel-core":"^6.26.3","babel-loader":"^7.1.5","babel-polyfill":"^6.26.0","babel-preset-env":"^1.7.0","babel-preset-es2015":"^6.24.1","babel-preset-stage-3":"^6.24.1","chai":"^4.1.2","chai-like":"^1.1.1","child_process":"^1.0.2","chokidar":"^1.7.0","concat-with-sourcemaps":"^1.1.0","ejs":"^2.6.1","eslint":"^4.19.1","eslint-config-prettier":"^2.9.0","eslint-plugin-jasmine":"^2.10.1","eslint-plugin-prettier":"^2.6.2","express":"^4.16.2","get-port":"^3.2.0","glob":"^7.1.2","gulp":"^3.9.1","gulp-babel":"^7.0.1","gulp-concat":"^2.6.1","gulp-ejs":"^3.1.3","gulp-filter":"^5.1.0","gulp-notify":"^3.2.0","gulp-plumber":"^1.2.0","gulp-sort":"^2.0.0","gulp-util":"^3.0.8","gulp-yaml":"^1.0.1","husky":"^0.14.3","json-loader":"^0.5.7","lint-staged":"^7.2.0","mocha":"^5.2.0","mocha-chrome":"^1.1.0","mocha-directory":"^2.3.0","mocha-sinon":"^2.1.0","ncp":"^2.0.0","node-notifier":"^5.2.1","nyc":"^11.9.0","path":"^0.12.7","prettier":"^1.13.5","sinon":"^4.5.0","svg-to-png":"^3.1.2","through2":"^2.0.3","uglifyjs-webpack-plugin":"^1.2.7","vinyl":"^2.1.0","webpack":"^4.12.0","webpack-cli":"^2.1.5","webpack-node-externals":"^1.7.2","webpack-stream":"^4.0.3","yaml-loader":"^0.5.0"},"dependencies":{"eventemitter3":"^3.1.0","js-yaml":"^3.12.0","node-dir":"^0.1.17","node-fetch":"^2.1.2","semver":"^5.5.0","tv4":"^1.3.0","ws":"^5.2.2"},"bugs":{"url":"https://github.com/obniz/obniz/issues"},"private":false,"browser":{"ws":"./obniz/libs/webpackReplace/ws.js","canvas":"./obniz/libs/webpackReplace/canvas.js","./obniz/libs/webpackReplace/require-context.js":"./obniz/libs/webpackReplace/require-context-browser.js"}};

/***/ }),

/***/ "./parts sync recursive \\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./ADConverter/hx711/index.js": "./parts/ADConverter/hx711/index.js",
	"./Accessory/USB/index.js": "./parts/Accessory/USB/index.js",
	"./AudioSensor/AE_MICAMP/index.js": "./parts/AudioSensor/AE_MICAMP/index.js",
	"./Camera/JpegSerialCam/index.js": "./parts/Camera/JpegSerialCam/index.js",
	"./ColorSensor/S11059/index.js": "./parts/ColorSensor/S11059/index.js",
	"./Display/7SegmentLED/index.js": "./parts/Display/7SegmentLED/index.js",
	"./Display/7SegmentLEDArray/index.js": "./parts/Display/7SegmentLEDArray/index.js",
	"./Display/7SegmentLED_MAX7219/index.js": "./parts/Display/7SegmentLED_MAX7219/index.js",
	"./Display/MatrixLED_MAX7219/index.js": "./parts/Display/MatrixLED_MAX7219/index.js",
	"./DistanceSensor/GP2Y0A21YK0F/index.js": "./parts/DistanceSensor/GP2Y0A21YK0F/index.js",
	"./DistanceSensor/HC-SR04/index.js": "./parts/DistanceSensor/HC-SR04/index.js",
	"./Grove/Grove_EarHeartRate/index.js": "./parts/Grove/Grove_EarHeartRate/index.js",
	"./GyroSensor/ENC03R_Module/index.js": "./parts/GyroSensor/ENC03R_Module/index.js",
	"./InfraredSensor/IRSensor/index.js": "./parts/InfraredSensor/IRSensor/index.js",
	"./Light/FullColorLED/index.js": "./parts/Light/FullColorLED/index.js",
	"./Light/InfraredLED/index.js": "./parts/Light/InfraredLED/index.js",
	"./Light/LED/index.js": "./parts/Light/LED/index.js",
	"./Light/WS2811/index.js": "./parts/Light/WS2811/index.js",
	"./Light/WS2812/index.js": "./parts/Light/WS2812/index.js",
	"./Light/WS2812B/index.js": "./parts/Light/WS2812B/index.js",
	"./Logic/SNx4HC595/index.js": "./parts/Logic/SNx4HC595/index.js",
	"./Memory/24LC256/index.js": "./parts/Memory/24LC256/index.js",
	"./MovementSensor/Button/index.js": "./parts/MovementSensor/Button/index.js",
	"./MovementSensor/HC-SR505/index.js": "./parts/MovementSensor/HC-SR505/index.js",
	"./MovementSensor/JoyStick/index.js": "./parts/MovementSensor/JoyStick/index.js",
	"./MovementSensor/KXR94-2050/index.js": "./parts/MovementSensor/KXR94-2050/index.js",
	"./MovementSensor/KXSC7-2050/index.js": "./parts/MovementSensor/KXSC7-2050/index.js",
	"./MovementSensor/PaPIRsVZ/index.js": "./parts/MovementSensor/PaPIRsVZ/index.js",
	"./MovementSensor/Potentiometer/index.js": "./parts/MovementSensor/Potentiometer/index.js",
	"./Moving/DCMotor/index.js": "./parts/Moving/DCMotor/index.js",
	"./Moving/ServoMotor/index.js": "./parts/Moving/ServoMotor/index.js",
	"./Moving/Solenoid/index.js": "./parts/Moving/Solenoid/index.js",
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
	"./TemperatureSensor/i2c/BME280/index.js": "./parts/TemperatureSensor/i2c/BME280/index.js",
	"./TemperatureSensor/i2c/S-5851A/index.js": "./parts/TemperatureSensor/i2c/S-5851A/index.js",
	"./TemperatureSensor/i2c/SHT31/index.js": "./parts/TemperatureSensor/i2c/SHT31/index.js",
	"./TemperatureSensor/spi/ADT7310/index.js": "./parts/TemperatureSensor/spi/ADT7310/index.js",
	"./Wireless/RN42/index.js": "./parts/Wireless/RN42/index.js",
	"./Wireless/XBee/index.js": "./parts/Wireless/XBee/index.js"
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
/***/ (function(module, exports, __webpack_require__) {

class hx711 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'sck', 'dout'];
    this.requiredKeys = ['sck', 'dout'];
    this.offset = 0;
    this.scale = 1;
  }

  static info() {
    return {
      name: 'hx711',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.spi = obniz.getFreeSpi();
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    let ioKeys = ['clk', 'dout'];
    for (let key of ioKeys) {
      if (this.params[key] && !this.obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }
    this.sck = obniz.getIO(this.params.sck);
    this.dout = obniz.getIO(this.params.dout);

    this.sck.output(true);
  }

  async readWait() {
    this.sck.output(false);

    // while(true) {
    //   let val = await this.dout.inputWait();
    //   if (val == false) break;
    // }
    this.spi.start({
      mode: 'master',
      clk: this.params.sck,
      miso: this.params.dout,
      frequency: 66 * 1000,
    });

    let ret = await this.spi.writeWait([0, 0, 0]);
    this.spi.end(true);
    this.sck.output(false);
    let flag = (ret[0] & 0x80) === 0 ? 1 : -1;
    return flag * (((ret[0] & 0x7f) << 16) + (ret[1] << 8) + (ret[2] << 0));
  }

  async readAverageWait(times) {
    let results = [];
    for (let i = 0; i < times; i++) {
      results.push(await this.readWait());
    }
    return (
      results.reduce((prev, current, i) => {
        return prev + current;
      }, 0) / results.length
    );
  }

  powerDown() {
    this.sck.output(true);
  }

  powerUp() {
    this.sck.output(false);
  }

  async zeroAdjust(times) {
    times = parseInt(times) || 1;
    this.offset = await this.readAverageWait(times);
  }

  async getValueWait(times) {
    times = parseInt(times) || 1;
    let val = await this.readAverageWait(times);
    return (val - this.offset) / this.scale;
  }
}

if (true) {
  module.exports = hx711;
}


/***/ }),

/***/ "./parts/Accessory/USB/index.js":
/***/ (function(module, exports, __webpack_require__) {

class USB {
  constructor() {
    this.keys = ['vcc', 'gnd'];
    this.requiredKeys = ['vcc', 'gnd'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
    };
  }

  static info() {
    return {
      name: 'USB',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.io_vdd = obniz.getIO(this.params.vcc);
    this.io_gnd = obniz.getIO(this.params.gnd);

    this.io_gnd.output(false);
  }

  on() {
    this.io_vdd.output(true);
  }

  off() {
    this.io_vdd.output(false);
  }
}

if (true) {
  module.exports = USB;
}


/***/ }),

/***/ "./parts/AudioSensor/AE_MICAMP/index.js":
/***/ (function(module, exports, __webpack_require__) {

class AE_MICAMP {
  constructor() {
    this.keys = ['vcc', 'gnd', 'out'];
    this.requiredKeys = ['out'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      out: 'out',
    };
  }

  static info() {
    return {
      name: 'AE_MICAMP',
    };
  }

  async wired(obniz) {
    this.obniz = obniz;

    this.ad = obniz.getAD(this.params.out);

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    let self = this;
    this.ad.start(function(value) {
      self.voltage = value;
      if (self.onchange) {
        self.onchange(self.voltage);
      }
    });
  }
}

if (true) {
  module.exports = AE_MICAMP;
}

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

/*
AE_MICAMP.prototype.Average = function(callback) {
  this.average = callback;
};
*/


/***/ }),

/***/ "./parts/Camera/JpegSerialCam/index.js":
/***/ (function(module, exports, __webpack_require__) {

class JpegSerialCam {
  constructor() {
    this.keys = ['vcc', 'cam_tx', 'cam_rx', 'gnd'];
    this.requiredKeys = ['cam_tx', 'cam_rx'];

    this.ioKeys = this.keys;
    this.displayName = 'Jcam';
    this.displayIoNames = { cam_tx: 'camTx', cam_rx: 'camRx' };
  }

  static info() {
    return {
      name: 'JpegSerialCam',
    };
  }

  wired() {
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.my_tx = this.params.cam_rx;
    this.my_rx = this.params.cam_tx;

    this.obniz.getIO(this.my_tx).drive('3v');

    this.uart = this.obniz.getFreeUart();
  }

  async _drainUntil(uart, search, recv) {
    if (!recv) recv = [];
    while (true) {
      let readed = uart.readBytes();
      recv = recv.concat(readed);
      let tail = this._seekTail(search, recv);
      if (tail >= 0) {
        recv.splice(0, tail);
        return recv;
      }
      await this.obniz.wait(10);
    }
  }

  _seekTail(search, src) {
    let f = 0;
    for (let i = 0; i < src.length; i++) {
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
    if (typeof btoa === 'function') {
      let binstr = Array.prototype.map
        .call(buf, function(ch) {
          return String.fromCharCode(ch);
        })
        .join('');
      return btoa(binstr);
    }
    // TODO:
  }

  async startwait(obj) {
    if (!obj) obj = {};
    this.uart.start({
      tx: this.my_tx,
      rx: this.my_rx,
      baud: obj.baud || 38400,
    });
    this.obniz.display.setPinName(this.my_tx, 'JpegSerialCam', 'camRx');
    this.obniz.display.setPinName(this.my_rx, 'JpegSerialCam', 'camTx');
    await this.obniz.wait(2500);
  }

  async resetwait() {
    this.uart.send([0x56, 0x00, 0x26, 0x00]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x26, 0x00]);
    await this.obniz.wait(2500);
  }

  async setResolusionWait(resolution) {
    let val;
    if (resolution === '640*480') {
      val = 0x00;
    } else if (resolution === '320*240') {
      val = 0x11;
    } else if (resolution === '160*120') {
      val = 0x22;
    } else {
      throw new Error('invalid resolution');
    }
    this.uart.send([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, val]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    await this.resetwait();
  }

  async setCompressibilityWait(compress) {
    let val = Math.floor((compress / 100) * 0xff);
    this.uart.send([0x56, 0x00, 0x31, 0x05, 0x01, 0x01, 0x12, 0x04, val]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    await this.resetwait();
  }

  async setBaudWait(baud) {
    let val;
    switch (baud) {
      case 9600:
        val = [0xae, 0xc8];
        break;
      case 19200:
        val = [0x56, 0xe4];
        break;
      case 38400:
        val = [0x2a, 0xf2];
        break;
      case 57600:
        val = [0x1c, 0x4c];
        break;
      case 115200:
        val = [0x0d, 0xa6];
        break;
      default:
        throw new Error('invalid baud rate');
    }
    this.uart.send([
      0x56,
      0x00,
      0x31,
      0x06,
      0x04,
      0x02,
      0x00,
      0x08,
      val[0],
      val[1],
    ]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    //await this.obniz.wait(1000);
    await this.startwait({
      baud,
    });
  }

  async takewait() {
    const uart = this.uart;
    //console.log("stop a photo")
    uart.send([0x56, 0x00, 0x36, 0x01, 0x02]);
    await this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);

    //console.log("take a photo")
    uart.send([0x56, 0x00, 0x36, 0x01, 0x00]);
    await this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);

    //console.log("read length")
    uart.send([0x56, 0x00, 0x34, 0x01, 0x00]); // read length of image data
    let recv = await this._drainUntil(uart, [
      0x76,
      0x00,
      0x34,
      0x00,
      0x04,
      0x00,
      0x00,
    ]); // ack
    let XX;
    let YY;
    while (true) {
      let readed = uart.readBytes();
      //console.log(recv);
      recv = recv.concat(readed);
      if (recv.length >= 2) {
        XX = recv[0];
        YY = recv[1];
        break;
      }
      await this.obniz.wait(1000);
    }
    let databytes = XX * 256 + YY;
    //console.log("image: " + databytes + " Bytes");
    // const high = (databytes >> 8) & 0xff;
    // const low = databytes & 0xff;

    //console.log("start reading image")
    uart.send([
      0x56,
      0x00,
      0x32,
      0x0c,
      0x00,
      0x0a,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      XX,
      YY,
      0x00,
      0xff,
    ]);
    recv = await this._drainUntil(uart, [0x76, 0x00, 0x32, 0x00, 0x00]);
    //console.log("reading...");
    while (true) {
      let readed = uart.readBytes();
      recv = recv.concat(readed);
      //console.log(readed.length);
      if (recv.length >= databytes) {
        break;
      }
      await this.obniz.wait(10);
    }
    //console.log("done");
    recv = recv.splice(0, databytes); // remove tail
    recv = recv.concat([0xff, 0xd9]);
    return recv;
  }
}

if (true) {
  module.exports = JpegSerialCam;
}


/***/ }),

/***/ "./parts/ColorSensor/S11059/index.js":
/***/ (function(module, exports, __webpack_require__) {

class S11059 {
  constructor() {
    this.keys = ['vcc', 'sda', 'scl', 'i2c', 'gnd'];
    this.requiredKeys = [];

    this.address = 0x2a;
    this.regAdrs = {};
    this.regAdrs.ctrl = 0x00;
    this.regAdrs.manualTiming = 0x01;
    this.regAdrs.sensorRed = 0x03;
  }

  static info() {
    return {
      name: 'S11059',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
    this.obniz.wait(100);

    this.params.clock = 100000;
    this.params.pull = '3v';
    this.params.mode = 'master';
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(100);
  }

  init(gain, intTime) {
    this.i2c.write(this.address, [this.regAdrs.ctrl, 0x80]); // Reset
    let val = (gain << 3) | intTime;
    this.i2c.write(this.address, [this.regAdrs.ctrl, val]); // Set gain,interger time
  }

  async getVal() {
    this.i2c.write(this.address, [this.regAdrs.sensorRed]);
    let ret = await this.i2c.readWait(this.address, 8);
    let level = [0, 0, 0, 0];
    level[0] = (ret[0] << 8) | ret[1];
    level[1] = (ret[2] << 8) | ret[3];
    level[2] = (ret[4] << 8) | ret[5];
    level[3] = (ret[6] << 8) | ret[7];
    return level;
  }
}

if (true) {
  module.exports = S11059;
}


/***/ }),

/***/ "./parts/Display/7SegmentLED/index.js":
/***/ (function(module, exports, __webpack_require__) {

class _7SegmentLED {
  constructor() {
    this.keys = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'dp',
      'common',
      'commonType',
    ];
    this.requiredKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    this.digits = [
      0x3f,
      0x06,
      0x5b,
      0x4f,
      0x66,
      0x6d,
      0x7d,
      0x07,
      0x7f,
      0x6f,
      0x6f,
    ];

    this.displayIoNames = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      e: 'e',
      f: 'f',
      g: 'g',
      dp: 'dp',
      common: 'com',
    };
  }

  static info() {
    return {
      name: '7SegmentLED',
    };
  }

  wired(obniz) {
    function getIO(io) {
      if (io && typeof io === 'object') {
        if (typeof io['output'] === 'function') {
          return io;
        }
      }
      return obniz.getIO(io);
    }
    function isValidIO(io) {
      if (io && typeof io === 'object') {
        if (typeof io['output'] === 'function') {
          return true;
        }
      }
      return obniz.isValidIO(io);
    }

    this.obniz = obniz;
    this.ios = [];
    this.ios.push(getIO(this.params.a));
    this.ios.push(getIO(this.params.b));
    this.ios.push(getIO(this.params.c));
    this.ios.push(getIO(this.params.d));
    this.ios.push(getIO(this.params.e));
    this.ios.push(getIO(this.params.f));
    this.ios.push(getIO(this.params.g));

    for (let i = 0; i < this.ios.length; i++) {
      this.ios[i].output(false);
    }

    if (isValidIO(this.params.dp)) {
      this.dp = getIO(this.params.dp);
      this.dp.output(false);
    }
    if (isValidIO(this.params.common)) {
      this.common = getIO(this.params.common);
      this.on();
    }

    this.isCathodeCommon = this.params.commonType === 'anode' ? false : true;
  }

  print(data) {
    if (typeof data === 'number') {
      data = parseInt(data);
      data = data % 10;

      for (let i = 0; i < 7; i++) {
        if (this.ios[i]) {
          let val = this.digits[data] & (1 << i) ? true : false;
          if (!this.isCathodeCommon) {
            val = ~val;
          }
          this.ios[i].output(val);
        }
      }
      this.on();
    }
  }

  printRaw(data) {
    if (typeof data === 'number') {
      for (let i = 0; i < 7; i++) {
        if (this.ios[i]) {
          let val = data & (1 << i) ? true : false;
          if (!this.isCathodeCommon) {
            val = !val;
          }
          this.ios[i].output(val);
        }
      }
      this.on();
    }
  }

  dpState(show) {
    if (this.dp) {
      this.dp.output(this.isCathodeCommon ? show : !show);
    }
  }

  on() {
    this.common.output(this.isCathodeCommon ? false : true);
  }

  off() {
    this.common.output(this.isCathodeCommon ? true : false);
  }
}

if (true) {
  module.exports = _7SegmentLED;
}


/***/ }),

/***/ "./parts/Display/7SegmentLEDArray/index.js":
/***/ (function(module, exports, __webpack_require__) {

class _7SegmentLEDArray {
  constructor() {
    this.identifier = '' + new Date().getTime();

    this.keys = ['segments'];
    this.requiredKeys = this.keys;
  }

  static info() {
    return {
      name: '7SegmentLEDArray',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.segments = this.params.segments;
  }

  print(data) {
    if (typeof data === 'number') {
      data = parseInt(data);

      const print = index => {
        let val = data;

        for (let i = 0; i < this.segments.length; i++) {
          if (index === i) {
            this.segments[i].print(val % 10);
          } else {
            this.segments[i].off();
          }
          val = val / 10;
        }
      };

      let animations = [];
      for (let i = 0; i < this.segments.length; i++) {
        animations.push({
          duration: 3,
          state: print,
        });
      }

      this.obniz.io.animation(this.identifier, 'loop', animations);
    }
  }

  on() {
    this.obniz.io.animation(this.identifier, 'resume');
  }

  off() {
    this.obniz.io.animation(this.identifier, 'pause');
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].off();
    }
  }
}

if (true) {
  module.exports = _7SegmentLEDArray;
}


/***/ }),

/***/ "./parts/Display/7SegmentLED_MAX7219/index.js":
/***/ (function(module, exports, __webpack_require__) {

class _7SegmentLED_MAX7219 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'din', 'cs', 'clk'];
    this.requiredKeys = ['din', 'cs', 'clk'];
  }

  static info() {
    return {
      name: '7SegmentLED_MAX7219',
    };
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
    this.params.mode = 'master';
    this.params.mosi = this.params.din;
    this.params.drive = '3v';
    this.spi = this.obniz.getSpiWithConfig(this.params);

    // reset a onece
    this.cs.output(true);
    this.cs.output(false);
    this.cs.output(true);
  }

  init(numOfDisplay, digits) {
    this.numOfDisp = numOfDisplay;
    this.digits = digits;
    this.writeAllDisp([0x09, 0xff]); // Code B decode for digits 7-0
    this.writeAllDisp([0x0a, 0x05]); // brightness 11/32 0 to f
    this.writeAllDisp([0x0b, digits - 1]);
    this.writeAllDisp([0x0c, 0x01]); // Shutdown to normal operation
    this.writeAllDisp([0x0f, 0x00]);
    this.obniz.wait(10);
  }

  clear(disp) {
    for (let i = 0; i < this.digits; i++) {
      this.writeOneDisp(disp, [i + 1, 0x0f]);
    }
  }

  clearAll() {
    for (let i = 0; i < this.numOfDisp; i++) {
      for (let j = 0; j < this.digits; j++) {
        this.writeAllDisp([j + 1, 0x0f]);
      }
    }
  }

  test() {
    this.writeAllDisp([0x0f, 0x00]); // test command
  }

  brightness(disp, val) {
    this.writeOneDisp(disp, [0x0a, val]); // 0 to 15;
  }

  brightnessAll(val) {
    this.writeAllDisp([0x0a, val]); // 0 to 15;
  }

  writeAllDisp(data) {
    for (let i = 0; i < this.numOfDisp; i++) {
      this.writeOneDisp(i, data);
    }
  }

  writeOneDisp(disp, data) {
    this.cs.output(false);
    for (let i = 0; i < disp; i++) {
      this.spi.write([0x00, 0x00]);
    }
    this.spi.write(data);
    for (let i = 0; i < this.numOfDisp - (disp + 1); i++) {
      this.spi.write([0x00, 0x00]);
    }
    this.cs.output(true);
  }

  setNumber(disp, digit, number, dp) {
    if (digit >= 0 && digit <= this.digits - 1) {
      this.writeOneDisp(disp, [digit + 1, this.encodeBCD(number, dp)]);
    }
  }

  encodeBCD(decimal, dp) {
    let dpreg;
    if (dp == true) {
      dpreg = 0x80;
    } else {
      dpreg = 0x00;
    }
    if (decimal >= 0 && decimal <= 9) {
      return decimal | dpreg;
    } else if (decimal == '-' || decimal == 10) {
      return 0x0a | dpreg;
    } else if (decimal == 'e' || decimal == 11) {
      return 0x0b | dpreg;
    } else if (decimal == 'h' || decimal == 12) {
      return 0x0c | dpreg;
    } else if (decimal == 'l' || decimal == 13) {
      return 0x0d | dpreg;
    } else if (decimal == 'p' || decimal == 14) {
      return 0x0e | dpreg;
    } else if (decimal == 'on') {
      // light all segments
      return 0x88;
    } else if (decimal == 'off') {
      return 0x0f | dpreg;
    } else {
      return 0x0f | dpreg;
    }
  }
}

if (true) {
  module.exports = _7SegmentLED_MAX7219;
}


/***/ }),

/***/ "./parts/Display/MatrixLED_MAX7219/index.js":
/***/ (function(module, exports, __webpack_require__) {

class MatrixLED_MAX7219 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'din', 'cs', 'clk'];
    this.requiredKeys = ['din', 'cs', 'clk'];
  }

  static info() {
    return {
      name: 'MatrixLED_MAX7219',
    };
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
    this.params.mode = 'master';
    this.params.mosi = this.params.din;
    this.params.drive = '3v';
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
    this.obniz.wait(10);
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
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      let index = parseInt(i / 4);
      let line = parseInt(index / this.width);
      let col = parseInt((index - line * this.width) / 8);
      let bits = parseInt(index - line * this.width) % 8;
      if (bits === 0) this.vram[line][col] = 0x00;
      if (brightness > 0x7f) this.vram[line][col] |= 0x80 >> bits;
    }

    this.writeVram();
  }
}

if (true) {
  module.exports = MatrixLED_MAX7219;
}


/***/ }),

/***/ "./parts/DistanceSensor/GP2Y0A21YK0F/index.js":
/***/ (function(module, exports, __webpack_require__) {

class GP2Y0A21YK0F {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      signal: 'signal',
    };
    this._unit = 'mm';
  }

  static info() {
    return {
      name: 'GP2Y0A21YK0F',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.end();
    this.ad_signal = obniz.getAD(this.params.signal);
  }

  start(callback) {
    this.ad_signal.start(val => {
      if (val <= 0) {
        val = 0.001;
      }
      let distance = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
      if (this._unit === 'mm') {
        distance = parseInt(distance * 10) / 10;
      } else {
        distance *= 0.0393701;
        distance = parseInt(distance * 1000) / 1000;
      }

      if (typeof callback == 'function') {
        callback(distance);
      }
    });
  }

  unit(unit) {
    if (unit === 'mm') {
      this._unit = 'mm';
    } else if (unit === 'inch') {
      this._unit = 'inch';
    } else {
      throw new Error('unknown unit ' + unit);
    }
  }
}

if (true) {
  module.exports = GP2Y0A21YK0F;
}


/***/ }),

/***/ "./parts/DistanceSensor/HC-SR04/index.js":
/***/ (function(module, exports, __webpack_require__) {

class HCSR04 {
  constructor() {
    this.keys = ['vcc', 'trigger', 'echo', 'gnd'];
    this.requiredKeys = ['vcc', 'trigger', 'echo'];

    this._unit = 'mm';
    this.reset_alltime = false;

    this.temp = 15;
  }

  static info() {
    return {
      name: 'HC-SR04',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(null, this.params.gnd, '5v');

    this.vccIO = obniz.getIO(this.params.vcc);
    this.trigger = this.params.trigger;
    this.echo = this.params.echo;

    this.vccIO.drive('5v');
    this.vccIO.output(true);
    this.obniz.wait(100);
  }

  measure(callback) {
    let self = this;
    this.obniz.measure.echo({
      io_pulse: this.trigger,
      io_echo: this.echo,
      pulse: 'positive',
      pulse_width: 0.011,
      measure_edges: 3,
      timeout: (10 / 340) * 1000,
      callback: async edges => {
        if (this.reset_alltime) {
          this.vccIO.output(false);
          this.obniz.wait(100);
          this.vccIO.output(true);
          this.obniz.wait(100);
        }
        let distance = undefined;
        for (let i = 0; i < edges.length - 1; i++) {
          // HCSR04's output of io_echo is initially high when trigger is finshed
          if (edges[i].edge === true) {
            const time = (edges[i + 1].timing - edges[i].timing) / 1000; // (1/4000 * 8) + is needed??
            distance =
              (time / 2) * 20.055 * Math.sqrt(this.temp + 273.15) * 1000;
            if (self._unit === 'inch') {
              distance = distance * 0.0393701;
            }
          }
        }
        if (typeof callback === 'function') {
          callback(distance);
        }
      },
    });
  }

  async measureWait() {
    return new Promise(resolve => {
      this.measure(distance => {
        resolve(distance);
      });
    });
  }

  unit(unit) {
    if (unit === 'mm') {
      this._unit = 'mm';
    } else if (unit === 'inch') {
      this._unit = 'inch';
    } else {
      throw new Error('HCSR04: unknown unit ' + unit);
    }
  }
}

if (true) {
  module.exports = HCSR04;
}


/***/ }),

/***/ "./parts/Grove/Grove_EarHeartRate/index.js":
/***/ (function(module, exports, __webpack_require__) {

class Grove_EarHeartRate {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['vcc', 'gnd'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      signal: 'signal',
    };

    this.interval = 5;
    this.duration = 2.5 * 1000;
  }

  static info() {
    return {
      name: 'Grove_EarHeartRate',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
  }

  start(callback) {
    this.obniz.logicAnalyzer.start({
      io: this.params.signal,
      interval: this.interval,
      duration: this.duration,
    });

    this.obniz.logicAnalyzer.onmeasured = array => {
      let edges = [];
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === 0 && array[i + 1] === 1) {
          edges.push(i);
        }
      }
      if (edges.length >= 2) {
        let between = 0;
        let pulseMin = 0;
        between = ((edges[1] - edges[0]) * this.interval) / 1000.0;
        pulseMin = 60 / between;
        callback(pulseMin);
      }
    };
  }
}

if (true) {
  module.exports = Grove_EarHeartRate;
}


/***/ }),

/***/ "./parts/GyroSensor/ENC03R_Module/index.js":
/***/ (function(module, exports, __webpack_require__) {

class ENC03R_Module {
  constructor() {
    this.keys = ['vcc', 'out1', 'out2', 'gnd'];
    this.required = ['out1', 'out2'];
    this.Sens = 0.00067; //Sensitivity, 0.67mV / deg/sec
  }

  static info() {
    return {
      name: 'ENC03R_Module',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.ad0 = obniz.getAD(this.params.out1);
    this.ad1 = obniz.getAD(this.params.out2);

    this.ad0.start(value => {
      this.sens1 = (value - 1.45) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange1) {
        this.onchange1(this.sens1);
      }
    });

    this.ad1.start(value => {
      this.sens2 = (value - 1.35) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange2) {
        this.onchange2(this.sens2);
      }
    });
  }
}

if (true) {
  module.exports = ENC03R_Module;
}


/***/ }),

/***/ "./parts/InfraredSensor/IRSensor/index.js":
/***/ (function(module, exports, __webpack_require__) {

class IRSensor {
  constructor() {
    this.keys = ['output', 'vcc', 'gnd'];
    this.requiredKeys = ['output'];

    this.dataSymbolLength = 0.07;
    this.duration = 200; // 200msec
    this.dataInverted = true;
    this.triggerSampleCount = 16; // If Signal arrives more than this count. then treat as signal
    this.cutTail = true;
    this.output_pullup = true;
  }

  static info() {
    return {
      name: 'IRSensor',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    if (!obniz.isValidIO(this.params.output)) {
      throw new Error('output is not valid io');
    }
  }

  start(callback) {
    this.ondetect = callback;
    if (this.output_pullup) {
      this.obniz.getIO(this.params.output).pull('5v');
    }

    this.obniz.logicAnalyzer.start({
      io: this.params.output,
      interval: this.dataSymbolLength,
      duration: this.duration,
      triggerValue: this.dataInverted ? false : true,
      triggerValueSamples: this.triggerSampleCount,
    });
    this.obniz.logicAnalyzer.onmeasured = levels => {
      if (typeof this.ondetect === 'function') {
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

if (true) {
  module.exports = IRSensor;
}


/***/ }),

/***/ "./parts/Light/FullColorLED/index.js":
/***/ (function(module, exports, __webpack_require__) {

class FullColorLED {
  constructor() {
    this.COMMON_TYPE_ANODE = 1;
    this.COMMON_TYPE_CATHODE = 0;

    this.anode_keys = ['anode', 'anode_common', 'anodeCommon', 'vcc'];
    this.cathode_keys = ['cathode', 'cathode_common', 'cathodeCommon', 'gnd'];
    this.animationName = 'FullColorLED-' + Math.round(Math.random() * 1000);

    this.keys = ['r', 'g', 'b', 'common', 'commonType'];
    this.requiredKeys = ['r', 'g', 'b', 'common', 'commonType'];
  }

  static info() {
    return {
      name: 'FullColorLED',
    };
  }

  wired(obniz) {
    let r = this.params.r;
    let g = this.params.g;
    let b = this.params.b;
    let common = this.params.common;
    let commontype = this.params.commonType;

    this.obniz = obniz;
    if (this.anode_keys.includes(commontype)) {
      this.commontype = this.COMMON_TYPE_ANODE;
    } else if (this.cathode_keys.includes(commontype)) {
      this.commontype = this.COMMON_TYPE_CATHODE;
    } else {
      this.obniz.error(
        'FullColorLED param need common type [  anode_common or cathode_common ] '
      );
    }

    this.common = this.obniz.getIO(common);
    this.common.output(this.commontype);

    this.obniz.getIO(r).output(this.commontype);
    this.obniz.getIO(g).output(this.commontype);
    this.obniz.getIO(b).output(this.commontype);
    this.pwmR = this.obniz.getFreePwm();
    this.pwmR.start({ io: r });
    this.pwmR.freq(1000);
    this.pwmG = this.obniz.getFreePwm();
    this.pwmG.start({ io: g });
    this.pwmG.freq(1000);
    this.pwmB = this.obniz.getFreePwm();
    this.pwmB.start({ io: b });
    this.pwmB.freq(1000);
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
    this.pwmR.duty((r / 255) * 100);
    this.pwmG.duty((g / 255) * 100);
    this.pwmB.duty((b / 255) * 100);
  }

  hsv(h, s, v) {
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs((Hp % 2) - 1));

    let R, G, B;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    }
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    }
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    }
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    }
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    }
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    }

    let m = v - C;
    [R, G, B] = [R + m, G + m, B + m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    this.rgb(R, G, B);
  }

  gradation(cycletime_ms) {
    let frames = [];
    let max = 36 / 2;
    let duration = Math.round(cycletime_ms / max);
    for (let i = 0; i < max; i++) {
      let oneFrame = {
        duration: duration,
        state: function(index) {
          // index = 0
          this.hsv(index * 10 * 2, 1, 1);
        }.bind(this),
      };
      frames.push(oneFrame);
    }
    this.obniz.io.animation(this.animationName, 'loop', frames);
  }

  stopgradation() {
    this.obniz.io.animation(this.animationName, 'pause');
  }
}

if (true) {
  module.exports = FullColorLED;
}


/***/ }),

/***/ "./parts/Light/InfraredLED/index.js":
/***/ (function(module, exports, __webpack_require__) {

class InfraredLED {
  constructor() {
    this.keys = ['anode', 'cathode'];
    this.requiredKeys = ['anode'];

    this.dataSymbolLength = 0.07;
  }

  static info() {
    return {
      name: 'InfraredLED',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    if (!this.obniz.isValidIO(this.params.anode)) {
      throw new Error('anode is not valid io');
    }
    if (this.params.cathode) {
      if (!this.obniz.isValidIO(this.params.cathode)) {
        throw new Error('cathode is not valid io');
      }
      this.io_cathode = obniz.getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.pwm = this.obniz.getFreePwm();
    this.pwm.start({ io: this.params.anode });
    this.pwm.freq(38000);
  }

  send(arr) {
    if (arr && arr.length > 0 && arr[arr.length - 1] === 1) {
      arr.push(0);
    }
    this.pwm.modulate('am', this.dataSymbolLength, arr);
  }
}

if (true) {
  module.exports = InfraredLED;
}


/***/ }),

/***/ "./parts/Light/LED/index.js":
/***/ (function(module, exports, __webpack_require__) {

class LED {
  constructor() {
    this.keys = ['anode', 'cathode'];
    this.requiredKeys = ['anode'];
  }

  static info() {
    return {
      name: 'LED',
    };
  }

  wired(obniz) {
    function getIO(io) {
      if (io && typeof io === 'object') {
        if (typeof io['output'] === 'function') {
          return io;
        }
      }
      return obniz.getIO(io);
    }

    this.obniz = obniz;
    this.io_anode = getIO(this.params.anode);
    this.io_anode.output(false);
    if (this.params.cathode) {
      this.io_cathode = getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.animationName = 'Led-' + this.params.anode;
  }

  on() {
    this.endBlink();
    this.io_anode.output(true);
  }

  off() {
    this.endBlink();
    this.io_anode.output(false);
  }

  output(value) {
    if (value) {
      this.on();
    } else {
      this.off();
    }
  }

  endBlink() {
    this.obniz.io.animation(this.animationName, 'pause');
  }

  blink(interval) {
    if (!interval) {
      interval = 100;
    }
    let frames = [
      {
        duration: interval,
        state: function(index) {
          // index = 0
          this.io_anode.output(true); // on
        }.bind(this),
      },
      {
        duration: interval,
        state: function(index) {
          // index = 0
          this.io_anode.output(false); //off
        }.bind(this),
      },
    ];

    this.obniz.io.animation(this.animationName, 'loop', frames);
  }
}

if (true) {
  module.exports = LED;
}


/***/ }),

/***/ "./parts/Light/WS2811/index.js":
/***/ (function(module, exports, __webpack_require__) {

class WS2811 {
  constructor() {
    this.keys = ['din', 'vcc', 'gnd'];
    this.requiredKeys = ['din'];
  }

  static info() {
    return {
      name: 'WS2811',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.params.mode = 'master';
    this.params.frequency = 2 * 1000 * 1000;
    this.params.mosi = this.params.din;
    this.params.drive = '5v'; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  static _generateFromByte(val) {
    // T0H 0.5us+-0.15us
    // T1H 1.2us+-0.15us
    // T0L 2.0us+-0.15us
    // T1L 1.3us+-0.15us

    val = parseInt(val);
    const zero = 0x8;
    const one = 0xe;
    let ret = [];
    for (let i = 0; i < 8; i += 2) {
      let byte = 0;
      if (val & (0x80 >> i)) {
        byte = one << 4;
      } else {
        byte = zero << 4;
      }
      if (val & (0x80 >> (i + 1))) {
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
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs((Hp % 2) - 1));

    let R, G, B;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    }
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    }
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    }
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    }
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    }
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    }

    let m = v - C;
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
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(
        WS2811._generateColor(oneArray[0], oneArray[1], oneArray[2])
      );
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(
        WS2811._generateHsvColor(oneArray[0], oneArray[1], oneArray[2])
      );
    }
    this.spi.write(bytes);
  }
}

if (true) {
  module.exports = WS2811;
}


/***/ }),

/***/ "./parts/Light/WS2812/index.js":
/***/ (function(module, exports, __webpack_require__) {

class WS2812 {
  constructor() {
    this.keys = ['din', 'vcc', 'gnd'];
    this.requiredKeys = ['din'];
  }

  static info() {
    return {
      name: 'WS2812',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.params.mode = 'master';
    this.params.frequency = parseInt(3.33 * 1000 * 1000);
    this.params.mosi = this.params.din;
    this.params.drive = '5v'; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  static _generateFromByte(val) {
    // T0H 0.35us+-0.15us
    // T1H 0.7us+-0.15us
    // T0L 0.8us+-0.15us
    // T1L 0.6us+-0.15us

    // 0.3-0.9 and 0.6-0.6 at 3.33Mhz

    val = parseInt(val);
    const zero = 0x8;
    const one = 0xc;
    let ret = [];
    for (let i = 0; i < 8; i += 2) {
      let byte = 0;
      if (val & (0x80 >> i)) {
        byte = one << 4;
      } else {
        byte = zero << 4;
      }
      if (val & (0x80 >> (i + 1))) {
        byte |= one;
      } else {
        byte |= zero;
      }
      ret.push(byte);
    }
    return ret;
  }

  static _generateColor(r, g, b) {
    let array = WS2812._generateFromByte(g);
    array = array.concat(WS2812._generateFromByte(r));
    array = array.concat(WS2812._generateFromByte(b));
    return array;
  }

  static _generateHsvColor(h, s, v) {
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs((Hp % 2) - 1));

    let R, G, B;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    }
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    }
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    }
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    }
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    }
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    }

    let m = v - C;
    [R, G, B] = [R + m, G + m, B + m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return WS2812._generateColor(R, G, B);
  }

  rgb(r, g, b) {
    this.spi.write(WS2812._generateColor(r, g, b));
  }

  hsv(h, s, v) {
    this.spi.write(WS2812._generateHsvColor(h, s, v));
  }

  rgbs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(
        WS2812._generateColor(oneArray[0], oneArray[1], oneArray[2])
      );
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(
        WS2812._generateHsvColor(oneArray[0], oneArray[1], oneArray[2])
      );
    }
    this.spi.write(bytes);
  }
}

if (true) {
  module.exports = WS2812;
}


/***/ }),

/***/ "./parts/Light/WS2812B/index.js":
/***/ (function(module, exports, __webpack_require__) {

class WS2812B {
  constructor() {
    this.keys = ['din', 'vcc', 'gnd'];
    this.requiredKeys = ['din'];
  }

  static info() {
    return {
      name: 'WS2812B',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.params.mode = 'master';
    this.params.frequency = parseInt(3.33 * 1000 * 1000);
    this.params.mosi = this.params.din;
    this.params.drive = '5v'; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  static _generateFromByte(val) {
    // T0H 0.35us+-0.15us
    // T1H 0.9us+-0.15us
    // T0L 0.9us+-0.15us
    // T1L 0.35us+-0.15us

    // 0.3-0.9 and 0.9-0.3 at 3.33Mhz

    val = parseInt(val);
    const zero = 0x8;
    const one = 0xe;
    let ret = [];
    for (let i = 0; i < 8; i += 2) {
      let byte = 0;
      if (val & (0x80 >> i)) {
        byte = one << 4;
      } else {
        byte = zero << 4;
      }
      if (val & (0x80 >> (i + 1))) {
        byte |= one;
      } else {
        byte |= zero;
      }
      ret.push(byte);
    }
    return ret;
  }

  static _generateColor(r, g, b) {
    let array = WS2812B._generateFromByte(g);
    array = array.concat(WS2812B._generateFromByte(r));
    array = array.concat(WS2812B._generateFromByte(b));
    return array;
  }

  static _generateHsvColor(h, s, v) {
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs((Hp % 2) - 1));

    let R, G, B;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    }
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    }
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    }
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    }
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    }
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    }

    let m = v - C;
    [R, G, B] = [R + m, G + m, B + m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return WS2812B._generateColor(R, G, B);
  }

  rgb(r, g, b) {
    this.spi.write(WS2812B._generateColor(r, g, b));
  }

  hsv(h, s, v) {
    this.spi.write(WS2812B._generateHsvColor(h, s, v));
  }

  rgbs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(
        WS2812B._generateColor(oneArray[0], oneArray[1], oneArray[2])
      );
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(
        WS2812B._generateHsvColor(oneArray[0], oneArray[1], oneArray[2])
      );
    }
    this.spi.write(bytes);
  }
}

if (true) {
  module.exports = WS2812B;
}


/***/ }),

/***/ "./parts/Logic/SNx4HC595/index.js":
/***/ (function(module, exports, __webpack_require__) {

class SNx4HC595 {
  constructor() {
    /* http://www.ti.com/lit/ds/symlink/sn74hc595.pdf */
    this.keys = [
      'gnd',
      'vcc',
      'ser',
      'srclk',
      'rclk',
      'oe',
      'srclr',
      'io_num',
      'enabled',
    ];
    this.requiredKeys = ['ser', 'srclk', 'rclk'];

    this.autoFlash = true;
  }

  static info() {
    return {
      name: 'SNx4HC595',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.io_ser = this.obniz.getIO(this.params.ser);
    this.io_srclk = this.obniz.getIO(this.params.srclk);
    this.io_rclk = this.obniz.getIO(this.params.rclk);

    this.io_ser.output(false);
    this.io_srclk.output(false);
    this.io_rclk.output(false);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    if (this.obniz.isValidIO(this.params.srclr)) {
      this.io_srclr = this.obniz.getIO(this.params.srclr);
      this.io_srclr.output(true);
    }

    if (this.obniz.isValidIO(this.params.oe)) {
      this.io_oe = this.obniz.getIO(this.params.oe);
      this.io_oe.output(true);
    }

    if (
      this.obniz.isValidIO(this.params.vcc) ||
      this.obniz.isValidIO(this.params.gnd)
    ) {
      this.obniz.wait(100);
    }

    if (typeof this.params.io_num !== 'number') {
      this.params.io_num = 8;
    }
    this.ioNum(this.params.io_num);

    if (typeof this.params.enabled !== 'boolean') {
      this.params.enabled = true;
    }
    console.log(this.params.enabled);
    if (this.io_oe && this.params.enabled) {
      console.log('here');
      this.io_oe.output(false);
    }
  }

  ioNum(num) {
    class SNx4HC595_IO {
      constructor(chip, id) {
        this.chip = chip;
        this.id = id;
        this.value = 0;
      }

      output(value) {
        this.chip.output(this.id, value);
      }
    }

    if (typeof num === 'number' && this._io_num !== num) {
      this._io_num = num;
      this.io = [];
      for (let i = 0; i < num; i++) {
        this.io.push(new SNx4HC595_IO(this, i));
      }
      this.flush();
    } else {
      throw new Error('io num should be a number');
    }
  }

  isValidIO(io) {
    return typeof io === 'number' && io >= 0 && io < this._io_num;
  }

  getIO(io) {
    if (!this.isValidIO(io)) {
      throw new Error('io ' + io + ' is not valid io');
    }
    return this.io[io];
  }

  output(id, value) {
    value = value == true;
    this.io[id].value = value;
    if (this.autoFlash) {
      this.flush();
    }
  }

  onece(operation) {
    if (typeof operation !== 'function') {
      throw new Error('please provide function');
    }
    const lastValue = this.autoFlash;
    this.autoFlash = false;
    operation();
    this.flush();
    this.autoFlash = lastValue;
  }

  setEnable(enable) {
    if (!this.io_oe && enable == false) {
      throw new Error('pin "oe" is not specified');
    }
    this.io_oe.output(!enable);
  }

  flush() {
    /* this code will works with 5v. But you should pay more attention when 3v. Timing is more tight. see chip reference */
    this.io_rclk.output(false);
    for (let i = this.io.length - 1; i >= 0; i--) {
      this.io_ser.output(this.io[i].value);
      this.io_srclk.output(true);
      this.io_srclk.output(false);
    }
    this.io_rclk.output(true);
  }
}

if (true) {
  module.exports = SNx4HC595;
}


/***/ }),

/***/ "./parts/Memory/24LC256/index.js":
/***/ (function(module, exports, __webpack_require__) {

class _24LC256 {
  constructor() {
    this.requiredKeys = ['address'];
    this.keys = ['sda', 'scl', 'clock', 'pull', 'i2c', 'address'];
  }

  static info() {
    return {
      name: '24LC256',
    };
  }

  wired(obniz) {
    this.params.mode = this.params.mode || 'master'; //for i2c
    this.params.clock = this.params.clock || 400 * 1000; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  // Module functions

  set(address, data) {
    let array = [];
    array.push((address >> 8) & 0xff);
    array.push(address & 0xff);
    array.push.apply(array, data);
    this.i2c.write(0x50, array);
    this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
  }

  async getWait(address, length) {
    let array = [];
    array.push((address >> 8) & 0xff);
    array.push(address & 0xff);
    this.i2c.write(0x50, array);
    return await this.i2c.readWait(0x50, length);
  }
}

if (true) {
  module.exports = _24LC256;
}


/***/ }),

/***/ "./parts/MovementSensor/Button/index.js":
/***/ (function(module, exports, __webpack_require__) {

class Button {
  constructor() {
    this.keys = ['signal', 'gnd'];
    this.required = ['signal'];

    this.onChangeForStateWait = function() {};
  }

  static info() {
    return {
      name: 'Button',
    };
  }

  wired(obniz) {
    this.io_signal = obniz.getIO(this.params.signal);

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_supply = obniz.getIO(this.params.gnd);
      this.io_supply.output(false);
    }

    // start input
    this.io_signal.pull('5v');

    let self = this;
    this.io_signal.input(function(value) {
      self.isPressed = value === false;
      if (self.onchange) {
        self.onchange(value === false);
      }
      self.onChangeForStateWait(value === false);
    });
  }

  async isPressedWait() {
    let ret = await this.io_signal.inputWait();
    return ret === false;
  }

  stateWait(isPressed) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.onChangeForStateWait = function(pressed) {
        if (isPressed == pressed) {
          self.onChangeForStateWait = function() {};
          resolve();
        }
      };
    });
  }
}

if (true) {
  module.exports = Button;
}


/***/ }),

/***/ "./parts/MovementSensor/HC-SR505/index.js":
/***/ (function(module, exports, __webpack_require__) {

class HCSR505 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'HC-SR505',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.io_signal = obniz.getIO(this.params.signal);

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.io_signal.input(value => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }
}

if (true) {
  module.exports = HCSR505;
}


/***/ }),

/***/ "./parts/MovementSensor/JoyStick/index.js":
/***/ (function(module, exports, __webpack_require__) {

class JoyStick {
  constructor() {
    this.keys = ['sw', 'y', 'x', 'vcc', 'gnd', 'i2c'];
    this.requiredKeys = ['sw', 'y', 'x'];
    this.pins = this.keys || ['sw', 'y', 'x', 'vcc', 'gnd'];
    this.pinname = { sw: 'sw12' };
    this.shortName = 'joyS';
  }

  static info() {
    return {
      name: 'JoyStick',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.io_sig_sw = obniz.getIO(this.params.sw);
    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);

    this.io_sig_sw.pull('5v');

    let self = this;
    this.ad_x.start(function(value) {
      self.positionX = value / 5.0;
      if (self.onchangex) {
        self.onchangex(self.positionX * 2 - 1);
      }
    });

    this.ad_y.start(function(value) {
      self.positionY = value / 5.0;
      if (self.onchangey) {
        self.onchangey(self.positionY * 2 - 1);
      }
    });

    this.io_sig_sw.input(function(value) {
      self.isPressed = value === false;
      if (self.onchangesw) {
        self.onchangesw(value === false);
      }
    });
  }

  async isPressedWait() {
    let ret = await this.io_sig_sw.inputWait();
    return ret === false;
  }
}

if (true) {
  module.exports = JoyStick;
}


/***/ }),

/***/ "./parts/MovementSensor/KXR94-2050/index.js":
/***/ (function(module, exports, __webpack_require__) {

class KXR94_2050 {
  constructor() {
    this.keys = ['x', 'y', 'z', 'vcc', 'gnd', 'enable', 'self_test'];
    this.requiredKeys = ['x', 'y', 'z'];
  }

  static info() {
    return {
      name: 'KXR94_2050',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);
    this.ad_z = obniz.getAD(this.params.z);

    if (obniz.isValidIO(this.params.enable)) {
      obniz.getIO(this.params.enable).drive('5v');
      obniz.getIO(this.params.enable).output(true);
    }
    if (obniz.isValidIO(this.params.self_test)) {
      obniz.getIO(this.params.self_test).drive('5v');
      obniz.getIO(this.params.self_test).output(false);
    }

    return (async () => {
      if (obniz.isValidIO(this.params.vcc)) {
        let pwrVoltage = await obniz.getAD(this.params.vcc).getWait();
        this.changeVccVoltage(pwrVoltage);
      } else {
        this.changeVccVoltage(5);
      }

      this.ad_x.start(value => {
        if (this.onchangex) {
          this.onchangex(this.voltage2gravity(value));
        }
      });

      this.ad_y.start(value => {
        if (this.onchangey) {
          this.onchangey(this.voltage2gravity(value));
        }
      });

      this.ad_z.start(value => {
        if (this.onchangez) {
          this.onchangez(this.voltage2gravity(value));
        }
      });

      if (this.obniz.isValidIO(this.params.vcc)) {
        this.obniz.getAD(this.params.vcc).start(value => {
          this.changeVccVoltage(value);
        });
      }

      obniz.display.setPinName(this.params.x, 'KXR94_2050', 'x');
      obniz.display.setPinName(this.params.y, 'KXR94_2050', 'y');
      obniz.display.setPinName(this.params.z, 'KXR94_2050', 'z');

      if (this.obniz.isValidIO(this.params.vcc)) {
        obniz.display.setPinName(this.params.vcc, 'KXR94_2050', 'vcc');
      }
    })();
  }

  changeVccVoltage(pwrVoltage) {
    this.sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
    this.offsetVoltage = pwrVoltage / 2; //Set offset voltage (Output voltage at 0g, unit:V)
  }

  voltage2gravity(volt) {
    return (volt - this.offsetVoltage) / this.sensitivity;
  }

  async getWait() {
    let result = await Promise.all([
      this.ad_x.getWait(),
      this.ad_y.getWait(),
      this.ad_z.getWait(),
    ]);

    return {
      x: this.voltage2gravity(result[0]),
      y: this.voltage2gravity(result[1]),
      z: this.voltage2gravity(result[2]),
    };
  }
}

if (true) {
  module.exports = KXR94_2050;
}


/***/ }),

/***/ "./parts/MovementSensor/KXSC7-2050/index.js":
/***/ (function(module, exports, __webpack_require__) {

class KXSC7_2050 {
  constructor() {
    this.keys = ['x', 'y', 'z', 'vcc', 'gnd'];
    this.requiredKeys = ['x', 'y', 'z'];
  }

  static info() {
    return {
      name: 'KXSC7_2050',
    };
  }

  async wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);
    this.ad_z = obniz.getAD(this.params.z);

    await obniz.wait(500);
    let ad = obniz.getAD(this.params.vcc);
    let pwrVoltage = await ad.getWait();
    let horizontalZ = await this.ad_z.getWait();
    let sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
    let offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)

    let self = this;
    this.ad_x.start(function(value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangex) {
        self.onchangex(self.gravity);
      }
    });

    this.ad_y.start(function(value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangey) {
        self.onchangey(self.gravity);
      }
    });

    this.ad_z.start(function(value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangez) {
        self.onchangez(self.gravity);
      }
    });
  }
}

if (true) {
  module.exports = KXSC7_2050;
}


/***/ }),

/***/ "./parts/MovementSensor/PaPIRsVZ/index.js":
/***/ (function(module, exports, __webpack_require__) {

class PaPIRsVZ {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'PaPIRsVZ',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.pull('0v');

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.io_signal.input(value => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }
}

if (true) {
  module.exports = PaPIRsVZ;
}


/***/ }),

/***/ "./parts/MovementSensor/Potentiometer/index.js":
/***/ (function(module, exports, __webpack_require__) {

class Potentiometer {
  constructor() {
    this.keys = ['pin0', 'pin1', 'pin2'];
    this.reuiredKeys = ['pin0', 'pin1', 'pin2'];

    this.vcc_voltage = 5.0;
  }

  static info() {
    return {
      name: 'Potentiometer',
    };
  }

  wired(obniz) {
    this.obniz.setVccGnd(this.params.pin0, this.params.pin2, '5v');
    this.ad = obniz.getAD(this.params.pin1);

    let self = this;

    obniz.getAD(this.params.pin0).start(function(value) {
      self.vcc_voltage = value;
    });

    this.ad.start(function(value) {
      self.position = value / self.vcc_voltage;
      if (self.onchange) {
        self.onchange(self.position);
      }
    });
  }
}

if (true) {
  module.exports = Potentiometer;
}


/***/ }),

/***/ "./parts/Moving/DCMotor/index.js":
/***/ (function(module, exports, __webpack_require__) {

class DCMotor {
  constructor() {
    this.keys = ['forward', 'back'];
    this.requiredKeys = ['forward', 'back'];
  }

  static info() {
    return {
      name: 'DCMotor',
    };
  }

  wired(obniz) {
    this.status = {
      direction: null,
      power: null,
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
  }

  // Module functions

  forward() {
    this.move(true);
  }

  reverse() {
    this.move(false);
  }

  stop() {
    if (this.status.direction === null) {
      return;
    }
    this.status.direction = null;
    this.pwm1.duty(0);
    this.pwm2.duty(0);
  }

  move(forward) {
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
    let power = this.power();
    this.power(0);
    this.power(power);
  }

  power(power) {
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
  }
}

if (true) {
  module.exports = DCMotor;
}


/***/ }),

/***/ "./parts/Moving/ServoMotor/index.js":
/***/ (function(module, exports, __webpack_require__) {

class ServoMotor {
  constructor() {
    this.keys = ['gnd', 'vcc', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'ServoMotor',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    if (obniz.isValidIO(this.params.vcc)) {
      this.io_vcc = obniz.getIO(this.params.vcc);
    }

    this.pwm = obniz.getFreePwm();
    this.pwm_io_num = this.params.signal;

    this.pwm.start({ io: this.pwm_io_num });
    this.pwm.freq(50);
  }

  // Module functions

  angle(ratio) {
    let max = 2.4;
    let min = 0.5;
    let val = ((max - min) * ratio) / 180.0 + min;
    this.pwm.pulse(val);
  }

  on() {
    if (this.io_vcc) {
      this.io_vcc.output(true);
    }
  }

  off() {
    if (this.io_vcc) {
      this.io_vcc.output(false);
    }
  }
}

if (true) {
  module.exports = ServoMotor;
}


/***/ }),

/***/ "./parts/Moving/Solenoid/index.js":
/***/ (function(module, exports, __webpack_require__) {

class Solenoid {
  constructor() {
    this.keys = ['gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'Solenoid',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_gnd = obniz.getIO(this.params.gnd);
      this.io_gnd.output(false);
    }

    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.output(false);
  }

  on() {
    this.io_signal.output(true);
  }

  off() {
    this.io_signal.output(false);
  }

  click(time_msec) {
    this.on();
    if (typeof time_msec !== 'number') {
      time_msec = 100;
    }
    this.obniz.wait(time_msec);
    this.off();
  }

  doubleClick(time_msec) {
    if (typeof time_msec !== 'number') {
      time_msec = 100;
    }
    this.click(time_msec);
    this.obniz.wait(time_msec);
    this.click(time_msec);
  }
}

if (true) {
  module.exports = Solenoid;
}


/***/ }),

/***/ "./parts/PressureSensor/FSR-40X/index.js":
/***/ (function(module, exports, __webpack_require__) {

//Todo:抵抗を追加して圧力(kg)を求められるように改造する

class FSR40X {
  constructor() {
    this.keys = ['pin0', 'pin1'];
    this.requiredKeys = ['pin0', 'pin1'];
  }

  static info() {
    return {
      name: 'FSR40X',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.io_pwr = obniz.getIO(this.params.pin0);
    this.ad = obniz.getAD(this.params.pin1);

    this.io_pwr.drive('5v');
    this.io_pwr.output(true);

    let self = this;
    this.ad.start(function(value) {
      let pressure = value * 100;
      self.press = pressure;
      if (self.onchange) {
        self.onchange(self.press);
      }
    });
  }
}

if (true) {
  module.exports = FSR40X;
}


/***/ }),

/***/ "./parts/SoilSensor/SEN0114/index.js":
/***/ (function(module, exports, __webpack_require__) {

class SEN0114 {
  constructor() {
    this.keys = ['vcc', 'output', 'gnd'];
    this.requiredKeys = ['output'];
  }

  static info() {
    return {
      name: 'SEN0114',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.ad = obniz.getAD(this.params.output);

    this.ad.start(value => {
      this.value = value;
      if (this.onchange) {
        this.onchange(this.value);
      }
    });
  }

  async getHumidityWait() {
    this.value = await this.ad.getWait();
    return this.value;
  }
}

if (true) {
  module.exports = SEN0114;
}


/***/ }),

/***/ "./parts/Sound/Speaker/index.js":
/***/ (function(module, exports, __webpack_require__) {

class Speaker {
  constructor(obniz) {
    this.keys = ['signal', 'gnd'];
    this.requiredKeys = ['gnd'];
  }

  static info() {
    return {
      name: 'Speaker',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(null, this.params.gnd, '5v');
    this.pwm = obniz.getFreePwm();
    this.pwm.start({ io: this.params.signal });
  }

  play(freq) {
    if (freq > 0) {
      this.pwm.freq(freq);
      this.pwm.pulse((1 / freq / 2) * 1000);
    } else {
      this.pwm.pulse(0);
    }
  }

  stop() {
    this.play(0);
  }
}

if (true) {
  module.exports = Speaker;
}


/***/ }),

/***/ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js":
/***/ (function(module, exports) {

class AnalogTemplatureSensor {
  constructor() {
    this.keys = ['vcc', 'gnd', 'output'];
    this.requiredKeys = ['output'];
    this.drive = '5v';
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.output);

    this.ad.start(
      function(voltage) {
        this.temp = this.calc(voltage);
        this.onchange(this.temp);
      }.bind(this)
    );
  }

  onchange(temp) {}

  calc(voltage) {
    return 0;
  }
}

module.exports = AnalogTemplatureSensor;


/***/ }),

/***/ "./parts/TemperatureSensor/analog/LM35DZ/index.js":
/***/ (function(module, exports, __webpack_require__) {

const AnalogTemplatureSensor = __webpack_require__("./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");
class LM35DZ extends AnalogTemplatureSensor {
  calc(voltage) {
    return voltage * 100; //Temp(Celsius) = [AD Voltage] * 100l;
  }
  static info() {
    return {
      name: 'LM35DZ',
    };
  }
}

if (true) {
  module.exports = LM35DZ;
}


/***/ }),

/***/ "./parts/TemperatureSensor/analog/LM60/index.js":
/***/ (function(module, exports, __webpack_require__) {

class LM60 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'output'];
    this.requiredKeys = ['output'];
  }

  static info() {
    return {
      name: 'LM60',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.ad = obniz.getAD(this.params.output);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    let self = this;
    this.ad.start(function(value) {
      self.temp = Math.round(((value - 0.424) / 0.00625) * 10) / 10; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
      if (self.onchange) {
        self.onchange(self.temp);
      }
    });
  }
}

if (true) {
  module.exports = LM60;
}


/***/ }),

/***/ "./parts/TemperatureSensor/analog/LM61/index.js":
/***/ (function(module, exports, __webpack_require__) {

const AnalogTemplatureSensor = __webpack_require__("./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

class LM61 extends AnalogTemplatureSensor {
  calc(voltage) {
    return Math.round((voltage - 0.6) / 0.01); //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
  }
  static info() {
    return {
      name: 'LM61',
    };
  }
}

if (true) {
  module.exports = LM61;
}


/***/ }),

/***/ "./parts/TemperatureSensor/analog/MCP9700/index.js":
/***/ (function(module, exports, __webpack_require__) {

const AnalogTemplatureSensor = __webpack_require__("./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

class MCP9700 extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 0.5) / 0.01; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }

  static info() {
    return {
      name: 'MCP9700',
    };
  }
}

if (true) {
  module.exports = MCP9700;
}


/***/ }),

/***/ "./parts/TemperatureSensor/analog/MCP9701/index.js":
/***/ (function(module, exports, __webpack_require__) {

const AnalogTemplatureSensor = __webpack_require__("./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

class MCP9701 extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 0.4) / 0.0195; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
  static info() {
    return {
      name: 'MCP9701',
    };
  }
}

if (true) {
  module.exports = MCP9701;
}


/***/ }),

/***/ "./parts/TemperatureSensor/analog/S8100B/index.js":
/***/ (function(module, exports, __webpack_require__) {

const AnalogTemplatureSensor = __webpack_require__("./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

//センサから出力が無い(出力インピーダンス高すぎ？)

class S8100B extends AnalogTemplatureSensor {
  calc(voltage) {
    return 30 + (1.508 - voltage) / -0.08; //Temp(Celsius) =
  }
  static info() {
    return {
      name: 'S8100B',
    };
  }
}

if (true) {
  module.exports = S8100B;
}


/***/ }),

/***/ "./parts/TemperatureSensor/analog/S8120C/index.js":
/***/ (function(module, exports, __webpack_require__) {

const AnalogTemplatureSensor = __webpack_require__("./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

//不調, 正しく測れるときもある...
//原因1:obnizの入力インピーダンスが低すぎる?
//原因2:センサーが発振してる？（データシート通り抵抗を追加したが改善しない）

class S8120C extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 1.474) / -0.0082 + 30; //Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
  }
  static info() {
    return {
      name: 'S8120C',
    };
  }
}

if (true) {
  module.exports = S8120C;
}


/***/ }),

/***/ "./parts/TemperatureSensor/i2c/ADT7410/index.js":
/***/ (function(module, exports, __webpack_require__) {

class ADT7410 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'sda', 'scl', 'addressMode'];
    this.requiredKeys = ['addressMode'];
  }

  static info() {
    return {
      name: 'ADT7410',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    if (this.params.addressMode === 8) {
      this.address = 0x48;
    } else if (this.params.addressMode === 9) {
      this.address = 0x49;
    }

    this.params.clock = 400000;
    this.params.pull = '5v';
    this.params.mode = 'master';

    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  async getTempWait() {
    let ret = await this.i2c.readWait(this.address, 2);
    let tempBin = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if (tempBin & 0x1000) {
      //0度以下の時の処理
      tempBin = tempBin - 8192;
    }

    return tempBin / 16;
  }
}

if (true) {
  module.exports = ADT7410;
}


/***/ }),

/***/ "./parts/TemperatureSensor/i2c/BME280/index.js":
/***/ (function(module, exports, __webpack_require__) {

class BME280 {
  constructor() {
    this.requiredKeys = [];
    this.keys = [
      'vcore',
      'vio',
      'gnd',
      'csb',
      'sdi',
      'sck',
      'sdo',
      'i2c',
      'address',
    ];

    this.ioKeys = ['vcore', 'vio', 'gnd', 'csb', 'sdi', 'sdo', 'sck'];

    this.configration = {
      sampling: {
        temp: 1, // 0 never. 0b001 to 0b101
        hum: 1,
        pres: 1,
      },
      interval: 5, // 0b000 to 0b111
      iir_strength: 0, // 000 to 100 (0=disable)
      mode: 3,

      Modes: {
        sleep: 0,
        forced: 1, // or 2
        normal: 3,
      },
    };

    this.commands = {};

    this.commands.addresses = {
      config: 0xf5,
      ctrl_meas: 0xf4,
      ctrl_hum: 0xf2,
    };
  }

  static info() {
    return {
      name: 'BME280',
      datasheet:
        'https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BME280_DS001-12.pdf',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.csb)) {
      // selecting I2C mode before powerup
      this.io_csb = obniz.getIO(this.params.csb);
      this.io_csb.drive('3v');
      this.io_csb.output(true);
    }

    this.obniz.setVccGnd(this.params.vio, null, '3v');
    this.obniz.setVccGnd(this.params.vcore, null, '3v');
    this.obniz.setVccGnd(null, this.params.gnd, '5v');
    this.obniz.wait(10);

    this.address = 0x76;
    if (this.params.address === 0x76) {
      this.address = 0x76;
    } else if (this.params.address === 0x77) {
      this.address = 0x77;
    } else if (this.params.address !== undefined) {
      throw new Error('address must be 0x76 or 0x77');
    }

    if (obniz.isValidIO(this.params.sdo)) {
      this.io_sdo = obniz.getIO(this.params.sdo);
      this.io_sdo.drive('3v');
      this.io_sdo.output(this.address === 0x76 ? false : true);
    }

    this.params.sda = this.params.sda || this.params.sdi;
    this.params.scl = this.params.scl || this.params.sck;
    this.params.clock = this.params.clock || 100 * 1000;
    this.params.mode = 'master';
    this.params.pull = '3v';
    this.i2c = obniz.getI2CWithConfig(this.params);

    this.obniz.wait(10);

    this.config();

    this.obniz.wait(10);
  }

  async config() {
    this.write([
      this.commands.addresses.config,
      (this.configration.interval << 5) |
        (this.configration.iir_strength << 2) |
        0,
    ]);
    this.write([
      this.commands.addresses.ctrl_hum,
      this.configration.sampling.hum,
    ]);
    this.write([
      this.commands.addresses.ctrl_meas,
      (this.configration.sampling.temp << 5) |
        (this.configration.sampling.pres << 2) |
        this.configration.mode,
    ]);
  }

  async setIIRStrength(strengh) {
    this.configration.iir_strength = strengh;
    this.config();
  }

  async applyCalibration() {
    this.i2c.write(this.address, [0x88]);
    let data = await this.i2c.readWait(this.address, 24);
    this.i2c.write(this.address, [0xa1]);
    let data_next = await this.i2c.readWait(this.address, 1);
    data.push(...data_next);
    this.i2c.write(this.address, [0xe1]);
    data_next = await this.i2c.readWait(this.address, 7);
    data.push(...data_next);
    this._calibrated = {
      dig_T1: (data[1] << 8) | data[0],
      dig_T2: this._readSigned16((data[3] << 8) | data[2]),
      dig_T3: this._readSigned16((data[5] << 8) | data[4]),
      dig_P1: (data[7] << 8) | data[6],
      dig_P2: this._readSigned16((data[9] << 8) | data[8]),
      dig_P3: this._readSigned16((data[11] << 8) | data[10]),
      dig_P4: this._readSigned16((data[13] << 8) | data[12]),
      dig_P5: this._readSigned16((data[15] << 8) | data[14]),
      dig_P6: this._readSigned16((data[17] << 8) | data[16]),
      dig_P7: this._readSigned16((data[19] << 8) | data[18]),
      dig_P8: this._readSigned16((data[21] << 8) | data[20]),
      dig_P9: this._readSigned16((data[23] << 8) | data[22]),
      dig_H1: this._readSigned8(data[24]),
      dig_H2: this._readSigned16((data[26] << 8) | data[25]),
      dig_H3: this._readSigned8(data[27]),
      dig_H4: this._readSigned16((data[28] << 4) | (0x0f & data[29])),
      dig_H5: this._readSigned16((data[30] << 4) | ((data[29] >> 4) & 0x0f)),
      dig_H6: this._readSigned8(data[31]),
    };
    this._t_fine = 0;
  }

  _readSigned16(value) {
    if (value >= 0x8000) {
      value = value - 0x10000;
    }
    return value;
  }
  _readSigned8(value) {
    if (value >= 0x80) {
      value = value - 0x100;
    }
    return value;
  }

  write(data) {
    this.obniz.i2c0.write(this.address, data);
  }

  async getData() {
    this.i2c.write(this.address, [0xf7]);
    return await this.i2c.readWait(this.address, 8);
  }

  async getAllWait() {
    let data = await this.getData();

    const press_raw = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
    const temp_raw = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4);
    const hum_raw = (data[6] << 8) | data[7];

    let temperature = this.calibration_T(temp_raw) / 100.0;
    let pressure = this.calibration_P(press_raw) / 100.0;
    let humidity = this.calibration_H(hum_raw);

    return { temperature, humidity, pressure };
  }

  calibration_T(adc_T) {
    let var1, var2, T;
    var1 =
      (((adc_T >> 3) - (this._calibrated.dig_T1 << 1)) *
        this._calibrated.dig_T2) >>
      11;
    var2 =
      (((((adc_T >> 4) - this._calibrated.dig_T1) *
        ((adc_T >> 4) - this._calibrated.dig_T1)) >>
        12) *
        this._calibrated.dig_T3) >>
      14;

    this._t_fine = var1 + var2;
    T = (this._t_fine * 5 + 128) >> 8;
    return T;
  }

  calibration_P(adc_P) {
    let pvar1 = this._t_fine / 2 - 64000;
    let pvar2 = (pvar1 * pvar1 * this._calibrated.dig_P6) / 32768;
    pvar2 = pvar2 + pvar1 * this._calibrated.dig_P5 * 2;
    pvar2 = pvar2 / 4 + this._calibrated.dig_P4 * 65536;
    pvar1 =
      ((this._calibrated.dig_P3 * pvar1 * pvar1) / 524288 +
        this._calibrated.dig_P2 * pvar1) /
      524288;
    pvar1 = (1 + pvar1 / 32768) * this._calibrated.dig_P1;

    if (pvar1 !== 0) {
      let p = 1048576 - adc_P;
      p = ((p - pvar2 / 4096) * 6250) / pvar1;
      pvar1 = (this._calibrated.dig_P9 * p * p) / 2147483648;
      pvar2 = (p * this._calibrated.dig_P8) / 32768;
      p = p + (pvar1 + pvar2 + this._calibrated.dig_P7) / 16;
      return p;
    }
    return 0;
  }

  calibration_H(adc_H) {
    let h = this._t_fine - 76800;
    h =
      (adc_H -
        (this._calibrated.dig_H4 * 64 +
          (this._calibrated.dig_H5 / 16384) * h)) *
      ((this._calibrated.dig_H2 / 65536) *
        (1 +
          (this._calibrated.dig_H6 / 67108864) *
            h *
            (1 + (this._calibrated.dig_H3 / 67108864) * h)));
    h = h * (1 - (this._calibrated.dig_H1 * h) / 524288);
    return h;
  }

  async getTempWait() {
    return (await this.getAllWait()).temperature;
  }

  async getHumdWait() {
    return (await this.getAllWait()).humidity;
  }

  async getPressureWait() {
    return (await this.getAllWait()).pressure;
  }

  async getAltitudeWait() {
    const pressure = await this.getPressureWait();
    return this.calcAltitude(pressure);
  }

  calcAltitude(pressure, seaLevel) {
    if (!seaLevel) {
      seaLevel = 1013.25;
    }

    return (
      (1.0 - Math.pow(pressure / seaLevel, 1 / 5.2553)) * 145366.45 * 0.3048
    );
  }
}

if (true) {
  module.exports = BME280;
}


/***/ }),

/***/ "./parts/TemperatureSensor/i2c/S-5851A/index.js":
/***/ (function(module, exports, __webpack_require__) {

//センサからの反応なし
class S5851A {
  constructor() {
    this.requiredKeys = ['vcc', 'gnd', 'adr0', 'adr1', 'adr_select'];
    this.keys = ['sda', 'scl', 'adr0', 'adr1', 'adr_select', 'i2c'];
  }

  static info() {
    return {
      name: 'S5851A',
    };
  }

  wired(obniz) {
    //params: pwr, gnd, sda, scl, adr0, adr1, adr_select
    this.io_adr0 = obniz.getIO(this.params.adr0);
    this.io_adr1 = obniz.getIO(this.params.adr1);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

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
        this.address = 0x4a;
        break;
      case 'B':
        this.io_adr0.output(false);
        this.io_adr1.output(true);
        this.address = 0x4b;
        break;
      case 'C':
        this.io_adr0.pull(null);
        this.io_adr1.output(true);
        this.address = 0x4c;
        break;
      case 'D':
        this.io_adr0.output(true);
        this.io_adr1.output(true);
        this.address = 0x4d;
        break;
      case 'E':
        this.io_adr0.output(false);
        this.io_adr1.pull(null);
        this.address = 0x4e;
        break;
      case 'F':
        this.io_adr0.output(true);
        this.io_adr1.pull(null);
        this.address = 0x4f;
        break;
      default:
        this.io_adr0.output(false);
        this.io_adr1.output(false);
        this.address = 0x48;
        break;
    }
    console.log('i2c address=' + this.address);

    this.params.clock = this.params.clock || 400 * 1000; //for i2c
    this.params.mode = this.params.mode || 'master'; //for i2c
    this.params.pull = this.params.pull || '5v'; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    //obniz.i2c0.write(address, [0x20, 0x24]);
  }

  async getTempWait() {
    //console.log("gettempwait");
    //obniz.i2c0.write(address, [0x20, 0x24]);
    //obniz.i2c0.write(address, [0xE0, 0x00]);
    let ret = await this.i2c0.readWait(this.address, 2);
    //console.log('ret:' + ret);
    let tempBin =
      ret[0].toString(2) + ('00000000' + ret[1].toString(2)).slice(-8);
    let temperature = -45 + 175 * (parseInt(tempBin, 2) / (65536 - 1));
    return temperature;
  }

  async getHumdWait() {
    this.i2c.write(this.address, [0x20, 0x24]);
    this.i2c.write(this.address, [0xe0, 0x00]);
    let ret = await this.i2c.readWait(this.address, 4);
    let humdBin =
      ret[2].toString(2) + ('00000000' + ret[3].toString(2)).slice(-8);
    let humidity = 100 * (parseInt(humdBin, 2) / (65536 - 1));
    return humidity;
  }
}

if (true) {
  module.exports = S5851A;
}


/***/ }),

/***/ "./parts/TemperatureSensor/i2c/SHT31/index.js":
/***/ (function(module, exports, __webpack_require__) {

class SHT31 {
  constructor() {
    this.requiredKeys = ['adr', 'addressmode'];
    this.keys = [
      'vcc',
      'sda',
      'scl',
      'gnd',
      'adr',
      'addressmode',
      'i2c',
      'pull',
    ];

    this.ioKeys = ['vcc', 'sda', 'scl', 'gnd', 'adr'];
    this.commands = {};
    this.commands.softReset = [0x30, 0xa2];
    this.commands.highRepeatStreach = [0x2c, 0x06];
    this.commands.middleRepeatStreach = [0x2c, 0x0d];
    this.commands.lowRepeatStreach = [0x2c, 0x10];
    this.commands.highRepeat = [0x24, 0x00];
    this.commands.mediumRepeat = [0x24, 0x0b];
    this.commands.lowRepeat = [0x24, 0x16];

    this.waitTime = {};
    this.waitTime.wakeup = 1;
    this.waitTime.softReset = 1;
    this.waitTime.lowRepeat = 4;
    this.waitTime.mediumRepeat = 6;
    this.waitTime.highRepeat = 15;

    //not tested
    this.commands.readStatus = [0xf3, 0x2d];
  }

  static info() {
    return {
      name: 'SHT31',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.io_adr = obniz.getIO(this.params.adr);

    if (this.params.addressmode === 4) {
      this.io_adr.output(false);
      this.address = 0x44;
    } else if (this.params.addressmode === 5) {
      this.io_adr.pull(null);
      this.address = 0x45;
    }

    this.params.clock = this.params.clock || 100 * 1000; //for i2c
    this.params.mode = this.params.mode || 'master'; //for i2c
    this.params.pull = this.params.pull || '5v'; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    obniz.i2c0.write(this.address, this.commands.softReset);
  }

  async getData() {
    this.i2c.write(this.address, this.commands.highRepeat);
    await this.obniz.wait(this.waitTime.highRepeat);
    return await this.i2c.readWait(this.address, 6);
  }

  async getTempWait() {
    return (await this.getAllWait()).temperature;
  }

  async getHumdWait() {
    return (await this.getAllWait()).humidity;
  }

  async getAllWait() {
    let ret = await this.getData();

    let tempBin = ret[0] * 256 + ret[1];
    let temperature = -45 + 175 * (tempBin / (65536 - 1));

    let humdBin = ret[3] * 256 + ret[4];
    let humidity = 100 * (humdBin / (65536 - 1));
    return { temperature, humidity };
  }
}

if (true) {
  module.exports = SHT31;
}


/***/ }),

/***/ "./parts/TemperatureSensor/spi/ADT7310/index.js":
/***/ (function(module, exports, __webpack_require__) {

class ADT7310 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'frequency', 'din', 'dout', 'clk', 'spi'];
    this.requiredKeys = [];
  }

  static info() {
    return {
      name: 'ADT7310',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.params.mode = this.params.mode || 'master';
    this.params.frequency = this.params.frequency || 500000;
    this.params.mosi = this.params.din;
    this.params.miso = this.params.dout;
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  async getTempWait() {
    await this.spi.writeWait([0x54]); //毎回コマンドを送らないと安定しない
    await this.obniz.wait(200); //適度な値でないと安定しない
    let ret = await this.spi.writeWait([0x00, 0x00]);
    let tempBin = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if (tempBin & 0x1000) {
      //0度以下の時の処理
      tempBin = tempBin - 8192;
    }

    return tempBin / 16;
  }
}

if (true) {
  module.exports = ADT7310;
}


/***/ }),

/***/ "./parts/Wireless/RN42/index.js":
/***/ (function(module, exports, __webpack_require__) {

class RN42 {
  constructor() {
    this.keys = ['tx', 'rx', 'gnd'];
    this.requiredKeys = ['tx', 'rx'];
  }

  static info() {
    return {
      name: 'RN42',
    };
  }

  wired(obniz) {
    if (obniz.isValidIO(this.params.gnd)) {
      obniz.getIO(this.params.gnd).output(false);
    }

    this.uart = obniz.getFreeUart();

    this.uart.start({
      tx: this.params.tx,
      rx: this.params.rx,
      baud: 115200,
      drive: '3v',
    });
    let self = this;
    this.uart.onreceive = (data, text) => {
      // this is not perfect. separation is possible.
      if (text.indexOf('CONNECT') >= 0) {
        console.log('connected');
      } else if (text.indexOf('DISCONNECT') >= 0) {
        console.log('disconnected');
      }
      if (typeof self.onreceive === 'function') {
        self.onreceive(data, text);
      }
    };
  }

  send(data) {
    this.uart.send(data);
  }

  sendCommand(data) {
    this.uart.send(data + '\n');
    this.obniz.wait(100);
  }

  enterCommandMode() {
    this.send('$$$');
    this.obniz.wait(100);
  }

  config(json) {
    this.enterCommandMode();
    if (typeof json !== 'object') {
      // TODO: warning
      return;
    }
    // remove noize data
    this.sendCommand('');

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
  }

  config_reboot() {
    this.sendCommand('R,1');
  }

  config_masterslave(mode) {
    let val = -1;
    if (typeof mode === 'number') {
      val = mode;
    } else if (typeof mode === 'string') {
      let modes = [
        'slave',
        'master',
        'trigger',
        'auto-connect-master',
        'auto-connect-dtr',
        'auto-connect-any',
        'pairing',
      ];
      for (let i = 0; i < modes.length; i++) {
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
  }

  config_displayName(name) {
    this.sendCommand('SN,' + name);
  }

  // // SH,0200 HID Flag register. Descriptor=keyboard
  config_HIDflag(flag) {
    this.sendCommand('SH,' + flag);
  }

  config_profile(mode) {
    let val = -1;
    if (typeof mode === 'number') {
      val = mode;
    } else if (typeof mode === 'string') {
      let modes = [
        'SPP',
        'DUN-DCE',
        'DUN-DTE',
        'MDM-SPP',
        'SPP-DUN-DCE',
        'APL',
        'HID',
      ];
      for (let i = 0; i < modes.length; i++) {
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
  }

  config_revert_localecho() {
    this.sendCommand('+');
  }

  config_auth(mode) {
    let val = -1;
    if (typeof mode === 'number') {
      val = mode;
    } else if (typeof mode === 'string') {
      let modes = ['open', 'ssp-keyboard', 'just-work', 'pincode'];
      for (let i = 0; i < modes.length; i++) {
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
  }

  config_power(dbm) {
    let val = '0010';
    if (16 > dbm && dbm >= 12) {
      val = '000C';
    } else if (12 > dbm && dbm >= 8) {
      val = '0008';
    } else if (8 > dbm && dbm >= 4) {
      val = '0004';
    } else if (4 > dbm && dbm >= 0) {
      val = '0000';
    } else if (0 > dbm && dbm >= -4) {
      val = 'FFFC';
    } else if (-4 > dbm && dbm >= -8) {
      val = 'FFF8';
    } else if (-8 > dbm) {
      val = 'FFF4';
    }

    this.sendCommand('SY,' + val);
  }

  config_get_setting() {
    this.sendCommand('D');
  }

  config_get_extendSetting() {
    this.sendCommand('E');
  }
}

if (true) {
  module.exports = RN42;
}


/***/ }),

/***/ "./parts/Wireless/XBee/index.js":
/***/ (function(module, exports, __webpack_require__) {

class XBee {
  constructor() {
    this.keys = ['tx', 'rx', 'gnd'];
    this.requiredKeys = ['tx', 'rx'];

    this.displayIoNames = { tx: '<tx', rx: '>rx' };
  }

  static info() {
    return {
      name: 'XBee',
    };
  }

  wired(obniz) {
    this.uart = obniz.getFreeUart();
    this.currentCommand = null;
    this.commands = [];
    this.isAtMode = false;
    this.onFinishAtModeCallback = null;

    if (typeof this.params.gnd === 'number') {
      obniz.getIO(this.params.gnd).output(false);
    }

    this.uart.start({
      tx: this.params.tx,
      rx: this.params.rx,
      baud: 9600,
      drive: '3v',
    });

    this.uart.onreceive = function(data, text) {
      if (this.isAtMode) {
        this.onAtResultsRecieve(data, text);
      } else {
        if (typeof this.onreceive === 'function') {
          this.onreceive(data, text);
        }
      }
    }.bind(this);
  }

  send(text) {
    if (this.isAtMode === false) {
      this.uart.send(text);
    } else {
      this.obniz.error('XBee is AT Command mode now. Wait for finish config.');
    }
  }

  onAtResultsRecieve(data, text) {
    if (!this.isAtMode) {
      return;
    }

    let next = function() {
      this.currentCommand = null;
      this.sendCommand();
    }.bind(this);

    if (text === 'OK\r') {
      if (this.currentCommand === 'ATCN') {
        this.isAtMode = false;
        this.currentCommand = null;
        if (typeof this.onFinishAtModeCallback === 'function') {
          this.onFinishAtModeCallback();
          this.onFinishAtModeCallback = null;
        }
        return;
      }
      next();
    } else if (text === 'ERROR\r') {
      this.obniz.error('XBee config error : ' + this.currentCommand);
    } else {
      //response of at command.
      console.log('XBEE : no catch message', data);
      next();
    }
  }

  addCommand(command, value) {
    let str = command + (value ? ' ' + value : '');
    this.commands.push(str);
    if (this.isAtMode === true && this.currentCommand === null) {
      this.sendCommand();
    }
  }

  sendCommand() {
    if (
      this.isAtMode === true &&
      this.currentCommand === null &&
      this.commands.length > 0
    ) {
      this.currentCommand = 'AT' + this.commands.shift();
      this.uart.send(this.currentCommand + '\r');
    }
  }

  enterAtMode() {
    if (this.currentCommand !== null) return;
    this.isAtMode = true;
    this.obniz.wait(1000);
    let command = '+++';
    this.currentCommand = command;
    this.uart.send(this.currentCommand);
    this.obniz.wait(1000);
  }

  exitAtMode() {
    this.addCommand('CN');
  }

  async configWait(config) {
    if (this.isAtMode) {
      throw new Error('Xbee : duplicate config setting');
    }
    return new Promise(
      function(resolve, reject) {
        let standaloneKeys = {
          destination_address_high: 'DH',
          destination_address_low: 'DL',
          source_address: 'MY',
        };
        let highLowKeys = ['destination_address'];
        this.enterAtMode();
        for (let key in config) {
          if (key.length === 2) {
            this.addCommand(key, config[key]);
          } else if (standaloneKeys[key]) {
            this.addCommand(standaloneKeys[key], config[key]);
          } else if (highLowKeys.includes(key)) {
            let high = config[key].slice(0, -8);
            if (!high) {
              high = '0';
            }
            let low = config[key].slice(-8);

            this.addCommand(standaloneKeys[key + '_high'], high);
            this.addCommand(standaloneKeys[key + '_low'], low);
          }
        }
        this.exitAtMode();
        this.onFinishAtModeCallback = function() {
          resolve();
        };
      }.bind(this)
    );
  }
}

if (true) {
  module.exports = XBee;
}


/***/ })

/******/ });