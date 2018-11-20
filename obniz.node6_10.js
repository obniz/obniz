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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/","definitions":{"pinSetting":{"id":"pinSetting","type":"integer","minimum":0,"maximum":11,"default":null},"bleAdvertiseData":{"id":"bleAdvertiseData","type":"array","default":null,"maxItems":31,"items":{"type":"integer","minimum":0,"maximum":255}},"dataArray32":{"id":"dataArray32","type":"array","default":null,"maxItems":32,"items":{"type":"integer","minimum":0,"maximum":255}},"dataArray1024":{"id":"dataArray1024","type":"array","default":null,"maxItems":1024,"items":{"type":"integer","minimum":0,"maximum":255}},"bitArray":{"id":"bitArray","type":"array","default":null,"items":{"type":"integer","minimum":0,"maximum":1}},"dataArray":{"id":"dataArray","type":"array","default":null,"items":{"type":"integer","minimum":0,"maximum":255}},"imageData128x64":{"id":"imageData128x64","type":"array","minItems":1024,"maxItems":1024,"items":{"type":"integer","minimum":0,"maximum":255}},"hexString":{"id":"hexString","type":"string","default":null,"pattern":"^([0-9a-fA-F]+)$"},"uuid":{"id":"uuid","type":"string","pattern":"^([-0-9a-fA-F]+)$","minLength":4,"maxLength":36},"uuidOrNull":{"id":"uuidOrNull","type":["string","null"],"pattern":"^([-0-9a-fA-F]+)$","minLength":4,"maxLength":36},"deviceAddress":{"id":"deviceAddress","type":"string","pattern":"^([0-9a-fA-F]+)$","minLength":12,"maxLength":12},"obnizId":{"id":"obnizId","type":["string","integer"],"pattern":"^[0-9]{4}-?[0-9]{4}$","minimum":0,"maximum":99999999}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad","basePath":"ad0","anyOf":[{"$ref":"/request/ad/get"},{"$ref":"/request/ad/deinit"}]}

/***/ }),

/***/ "./json_schema/request/ad/input.yml":
/*!******************************************!*\
  !*** ./json_schema/request/ad/input.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ad/get","related":"/response/ad/get","desription":"enable & start ad module at io.","type":"object","required":["stream"],"properties":{"stream":{"type":"boolean","default":false}}}

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

/***/ "./json_schema/request/ble/central/characteristic_register_notify.yml":
/*!****************************************************************************!*\
  !*** ./json_schema/request/ble/central/characteristic_register_notify.yml ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_register_notify","related":"/response/ble/central/characteristic_register_notify","type":"object","required":["register_notify_characteristic"],"properties":{"register_notify_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/request/ble/central/characteristic_unregister_notify.yml":
/*!******************************************************************************!*\
  !*** ./json_schema/request/ble/central/characteristic_unregister_notify.yml ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central/characteristic_unregister_notify","related":"/response/ble/central/characteristic_unregister_notify","type":"object","required":["unregister_notify_characteristic"],"properties":{"unregister_notify_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/central","basePath":"ble","anyOf":[{"$ref":"/request/ble/central/scan_start"},{"$ref":"/request/ble/central/scan_stop"},{"$ref":"/request/ble/central/connect"},{"$ref":"/request/ble/central/disconnect"},{"$ref":"/request/ble/central/service_get"},{"$ref":"/request/ble/central/characteristic_get"},{"$ref":"/request/ble/central/characteristic_read"},{"$ref":"/request/ble/central/characteristic_write"},{"$ref":"/request/ble/central/characteristic_register_notify"},{"$ref":"/request/ble/central/characteristic_unregister_notify"},{"$ref":"/request/ble/central/descriptor_get"},{"$ref":"/request/ble/central/descriptor_read"},{"$ref":"/request/ble/central/descriptor_write"}]}

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

/***/ "./json_schema/request/ble/peripheral/characteristic_notify.yml":
/*!**********************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/characteristic_notify.yml ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_notify","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["notify_characteristic"],"properties":{"notify_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/characteristic_read.yml":
/*!********************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/characteristic_read.yml ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_read","related":"/response/ble/peripheral/characteristic_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["read_characteristic"],"properties":{"read_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/characteristic_write.yml":
/*!*********************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/characteristic_write.yml ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/characteristic_write","related":"/response/ble/peripheral/characteristic_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["write_characteristic"],"properties":{"write_characteristic":{"type":"object","required":["service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/descriptor_read.yml":
/*!****************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/descriptor_read.yml ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/descriptor_read","related":"/response/ble/peripheral/descriptor_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["read_descriptor"],"properties":{"read_descriptor":{"type":"object","required":["service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/descriptor_write.yml":
/*!*****************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/descriptor_write.yml ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/descriptor_write","related":"/response/ble/peripheral/descriptor_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["write_descriptor"],"properties":{"write_descriptor":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/index.yml":
/*!******************************************************!*\
  !*** ./json_schema/request/ble/peripheral/index.yml ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral","basePath":"ble","anyOf":[{"$ref":"/request/ble/peripheral/advertisement_start"},{"$ref":"/request/ble/peripheral/advertisement_stop"},{"$ref":"/request/ble/peripheral/service_start"},{"$ref":"/request/ble/peripheral/service_stop"},{"$ref":"/request/ble/peripheral/service_stop_all"},{"$ref":"/request/ble/peripheral/characteristic_read"},{"$ref":"/request/ble/peripheral/characteristic_write"},{"$ref":"/request/ble/peripheral/descriptor_read"},{"$ref":"/request/ble/peripheral/descriptor_write"}]}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_start.yml":
/*!*************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/servie_start.yml ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_start","related":["/response/ble/peripheral/status","/response/ble/peripheral/characteristic_notify_read","/response/ble/peripheral/characteristic_notify_write","/response/ble/peripheral/descriptor_notify_read","/response/ble/peripheral/descriptor_notify_write"],"type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["services"],"properties":{"services":{"type":"array","minItems":1,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"characteristics":{"type":"array","minItems":0,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"properties":{"type":"array","default":["read","write"],"items":{"type":"string","enum":["broadcast","read","write_without_response","write","notify","indicate","auth","extended_properties"]}},"permissions":{"type":"array","default":["read","write"],"items":{"default":["read","write"],"type":"string","enum":["read","write"]}},"descriptors":{"type":"array","minItems":0,"items":{"type":"object","required":["uuid"],"additionalProperties":false,"properties":{"uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"permissions":{"type":"array","default":["read","write"],"items":{"default":["read","write"],"type":"string","enum":["read","write"]}}}}}}}}}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_stop.yml":
/*!************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/servie_stop.yml ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_stop","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","required":["stop_service"],"properties":{"stop_service":{"type":"object","required":["service_uuid"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/request/ble/peripheral/servie_stop_all.yml":
/*!****************************************************************!*\
  !*** ./json_schema/request/ble/peripheral/servie_stop_all.yml ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ble/peripheral/service_stop_all","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"null"}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/pin_assign","type":"object","required":["pin_assign"],"properties":{"pin_assign":{"type":"object","minProperties":1,"patternExample":[0,1,2,3],"patternProperties":{"^[0-9]$":{"type":"object","properties":{"module_name":{"type":"string"},"pin_name":{"type":"string"}}},"^1[0-1]$":{"type":"object","properties":{"module_name":{"type":"string"},"pin_name":{"type":"string"}}}}}}}

/***/ }),

/***/ "./json_schema/request/display/qr.yml":
/*!********************************************!*\
  !*** ./json_schema/request/display/qr.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/qr","type":"object","required":["qr"],"properties":{"qr":{"type":"object","required":["text"],"additionalProperties":false,"properties":{"text":{"type":"string"},"correction":{"type":"string","enum":["L","M","Q","H"],"default":"M"}}}}}

/***/ }),

/***/ "./json_schema/request/display/raw.yml":
/*!*********************************************!*\
  !*** ./json_schema/request/display/raw.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/raw","type":"object","required":["raw"],"properties":{"raw":{"$ref":"/imageData128x64"}}}

/***/ }),

/***/ "./json_schema/request/display/text.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/display/text.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/display/text","type":"object","required":["text"],"properties":{"text":{"type":"string"}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c","basePath":"i2c0","anyOf":[{"$ref":"/request/i2c/init_master"},{"$ref":"/request/i2c/init_slave"},{"$ref":"/request/i2c/write"},{"$ref":"/request/i2c/read"},{"$ref":"/request/i2c/deinit"}]}

/***/ }),

/***/ "./json_schema/request/i2c/init_master.yml":
/*!*************************************************!*\
  !*** ./json_schema/request/i2c/init_master.yml ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/init_master","type":"object","required":["mode","sda","scl","clock"],"uniqueKeys":["sda","scl"],"properties":{"mode":{"type":"string","enum":["master"]},"sda":{"$ref":"/pinSetting"},"scl":{"$ref":"/pinSetting"},"clock":{"type":"integer","minimum":1,"maximum":1000000}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/read","related":"/response/i2c/master","type":"object","required":["address","read"],"properties":{"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"read":{"type":"integer","minimum":0,"maximum":1024}}}

/***/ }),

/***/ "./json_schema/request/i2c/write.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/i2c/write.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/i2c/write","type":"object","required":["address","data"],"properties":{"address":{"type":"integer","minimum":0,"maximum":1023},"address_bits":{"type":"integer","enum":[7],"default":7},"data":{"$ref":"/dataArray1024"}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io","basePath":"io0","anyOf":[{"$ref":"/request/io/input"},{"$ref":"/request/io/input_detail"},{"$ref":"/request/io/output"},{"$ref":"/request/io/output_detail"},{"$ref":"/request/io/output_type"},{"$ref":"/request/io/pull_type"},{"$ref":"/request/io/deinit"}]}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/input_detail","related":"/response/io/get","type":"object","required":["direction"],"properties":{"direction":{"type":"string","enum":["input"]},"stream":{"type":"boolean","default":false}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/io/output_type","type":"object","required":["output_type"],"properties":{"output_type":{"type":"string","enum":["push-pull5v","push-pull3v","open-drain"]}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation/changeState","type":"object","required":["animation"],"properties":{"animation":{"type":"object","required":["name","status"],"additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":254},"status":{"type":"string","enum":["pause","resume"]}}}}}

/***/ }),

/***/ "./json_schema/request/ioanimation/index.yml":
/*!***************************************************!*\
  !*** ./json_schema/request/ioanimation/index.yml ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation","basePath":"io.animation","anyOf":[{"$ref":"/request/ioAnimation/init"},{"$ref":"/request/ioAnimation/changeState"}]}

/***/ }),

/***/ "./json_schema/request/ioanimation/init.yml":
/*!**************************************************!*\
  !*** ./json_schema/request/ioanimation/init.yml ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/ioAnimation/init","commandExample":{"io":{"animation":{"animation":{"name":"animation-1","status":"loop","states":[{"duration":500,"state":{"io0":true}},{"duration":500,"state":{"io0":false}}]}}}},"type":"object","required":["animation"],"properties":{"animation":{"type":"object","required":["name","status","states"],"additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":254},"status":{"type":"string","default":"loop","enum":["loop"]},"states":{"type":"array","default":[],"items":{"type":"object","required":["duration","state"],"additionalProperties":false,"properties":{"duration":{"type":"integer","minimum":0,"maximum":60000},"state":{"type":["object","array"],"filter":"pass_all"}}}}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer","basePath":"logic_analyzer","anyOf":[{"$ref":"/request/logicAnalyzer/init"},{"$ref":"/request/logicAnalyzer/deinit"}]}

/***/ }),

/***/ "./json_schema/request/logicanalyzer/init.yml":
/*!****************************************************!*\
  !*** ./json_schema/request/logicanalyzer/init.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/logicAnalyzer/init","exampleDescription":"With below sample code, you will receive only data which start with 'false, false, false' 3bit.","type":"object","required":["io","interval","duration"],"properties":{"io":{"type":"array","minItems":1,"maxItems":1,"items":{"$ref":"/pinSetting"}},"interval":{"type":"number","minimum":0,"exclusiveMinimum":true},"duration":{"type":"integer","minimum":0,"exclusiveMinimum":true},"trigger":{"type":"object","additionalProperties":false,"required":["value","samples"],"default":{"value":false,"samples":0},"properties":{"value":{"type":"boolean","default":false},"samples":{"type":"integer","minimum":0,"default":0}}}}}

/***/ }),

/***/ "./json_schema/request/measure/echo.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/measure/echo.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/measure/echo","related":"/response/measure/echo","type":"object","required":["echo"],"properties":{"echo":{"type":"object","required":["io_pulse","io_echo","pulse_width"],"properties":{"io_pulse":{"$ref":"/pinSetting"},"io_echo":{"$ref":"/pinSetting"},"pulse":{"type":"string","default":"positive","enum":["positive","negative"]},"pulse_width":{"type":"number","minimum":0.001,"maximum":1000},"measure_edges":{"type":"integer","minimum":1,"maximum":4},"timeout":{"type":"number","default":1000,"minimum":0.001,"maximum":1000}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/message","basePath":"message","anyOf":[{"$ref":"/request/message/send"}]}

/***/ }),

/***/ "./json_schema/request/message/send.yml":
/*!**********************************************!*\
  !*** ./json_schema/request/message/send.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/message/send","related":"/response/message/receive","type":"object","additionalProperties":false,"required":["data","to"],"properties":{"data":{},"to":{"type":"array","minItems":1,"items":{"$ref":"/obnizId"}}}}

/***/ }),

/***/ "./json_schema/request/pwm/deinit.yml":
/*!********************************************!*\
  !*** ./json_schema/request/pwm/deinit.yml ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/deinit","type":"null"}

/***/ }),

/***/ "./json_schema/request/pwm/freq.yml":
/*!******************************************!*\
  !*** ./json_schema/request/pwm/freq.yml ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/freq","type":"object","required":["freq"],"properties":{"freq":{"type":"integer","minimum":1,"maximum":80000000}}}

/***/ }),

/***/ "./json_schema/request/pwm/index.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/pwm/index.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm","basePath":"pwm0","anyOf":[{"$ref":"/request/pwm/init"},{"$ref":"/request/pwm/freq"},{"$ref":"/request/pwm/pulse"},{"$ref":"/request/pwm/modulate"},{"$ref":"/request/pwm/deinit"}]}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/modulate","type":"object","required":["modulate"],"properties":{"modulate":{"type":"object","required":["type","symbol_length","data"],"additionalProperties":false,"properties":{"type":{"type":"string","enum":["am"]},"symbol_length":{"type":"number","minimum":0.05,"maximum":1000},"data":{"$ref":"/bitArray"}}}}}

/***/ }),

/***/ "./json_schema/request/pwm/pulse.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/pwm/pulse.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/pwm/pulse","type":"object","required":["pulse"],"properties":{"pulse":{"type":"number","minimum":0}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi","basePath":"spi0","anyOf":[{"$ref":"/request/spi/init_master"},{"$ref":"/request/spi/deinit"},{"$ref":"/request/spi/write"}]}

/***/ }),

/***/ "./json_schema/request/spi/init_master.yml":
/*!*************************************************!*\
  !*** ./json_schema/request/spi/init_master.yml ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/init_master","type":"object","required":["mode","clock"],"uniqueKeys":["mosi","miso","clk"],"properties":{"mode":{"type":"string","enum":["master"]},"clk":{"$ref":"/pinSetting"},"mosi":{"$ref":"/pinSetting"},"miso":{"$ref":"/pinSetting"},"clock":{"type":"integer","default":115200,"minimum":1,"maximum":26000000,"desription":"frequency (Hz)"}}}

/***/ }),

/***/ "./json_schema/request/spi/write.yml":
/*!*******************************************!*\
  !*** ./json_schema/request/spi/write.yml ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/spi/write","related":"/response/spi/read","type":"object","required":["data","read"],"properties":{"data":{"$ref":"/dataArray1024"},"read":{"type":"boolean","default":true}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/switch","basePath":"switch","anyOf":[{"$ref":"/request/switch/get"}]}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/keepWorkingAtOffline","type":"object","required":["keep_working_at_offline"],"properties":{"keep_working_at_offline":{"type":"boolean"}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/selfCheck","type":"object","required":["self_check"],"properties":{"self_check":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/request/system/wait.yml":
/*!*********************************************!*\
  !*** ./json_schema/request/system/wait.yml ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/system/wait","type":"object","required":["wait"],"properties":{"wait":{"type":"integer"}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/request/uart/init","type":"object","required":["rx","tx"],"uniqueKeys":["rx","tx","rts","cts"],"properties":{"rx":{"$ref":"/pinSetting"},"tx":{"$ref":"/pinSetting"},"baud":{"type":"integer","default":115200,"minimum":1,"maximum":5000000},"stop":{"type":"number","enum":[1,1.5,2],"default":1},"bits":{"type":"integer","enum":[5,6,7,8],"default":8},"parity":{"type":"string","enum":["off","odd","even"],"default":"off"},"flowcontrol":{"type":"string","enum":["off","rts","cts","rts-cts"],"default":"off"},"rts":{"$ref":"/pinSetting"},"cts":{"$ref":"/pinSetting"}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ad/get","type":"number","minimum":0,"maximum":5}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_get","type":"object","required":["get_characteristic_result"],"properties":{"get_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","properties"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"properties":{"type":"array","items":{"type":"string","enum":["broadcast","read","write_without_response","write","notify","indicate","auth","extended_properties"]}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_get_finish.yml":
/*!************************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_get_finish.yml ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_get_finish","type":"object","required":["get_characteristic_result_finish"],"properties":{"get_characteristic_result_finish":{"type":"object","required":["address","service_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_notify.yml":
/*!********************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_notify.yml ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_notify","type":"object","required":["nofity_characteristic"],"properties":{"nofity_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_read.yml":
/*!******************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_read.yml ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_read","type":"object","required":["read_characteristic_result"],"properties":{"read_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]},"data":{"$ref":"/dataArray"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_register_notify.yml":
/*!*****************************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_register_notify.yml ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_register_notify","related":"/request/ble/central/characteristic_register_notify","type":"object","required":["characteristic_register_notify_result"],"properties":{"characteristic_register_notify_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"boolean"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/characteristic_unregister_notify.yml":
/*!*******************************************************************************!*\
  !*** ./json_schema/response/ble/central/characteristic_unregister_notify.yml ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/characteristic_unregister_notify","related":"/request/ble/central/characteristic_unregister_notify","type":"object","required":["unregister_notify_characteristic_result"],"properties":{"unregister_notify_characteristic_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"boolean"}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_get","type":"object","required":["get_descriptor_result"],"properties":{"get_descriptor_result":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_get_finish.yml":
/*!********************************************************************!*\
  !*** ./json_schema/response/ble/central/descriptor_get_finish.yml ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_get_finish","type":"object","required":["get_descriptor_result_finish"],"properties":{"get_descriptor_result_finish":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/descriptor_read.yml":
/*!**************************************************************!*\
  !*** ./json_schema/response/ble/central/descriptor_read.yml ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/descriptor_read","type":"object","required":["read_descriptor_result"],"properties":{"read_descriptor_results":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","result","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]},"data":{"$ref":"/dataArray"}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/error","type":"object","required":["error"],"properties":{"error":{"type":"object","required":["error_code","message"],"additionalProperties":false,"properties":{"error_code":{"type":"integer"},"module_error_code":{"type":"integer"},"function_code":{"type":"integer"},"message":{"type":"string"},"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuidOrNull"},"characteristic_uuid":{"$ref":"/uuidOrNull"},"descriptor_uuid":{"$ref":"/uuidOrNull"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/index.yml":
/*!****************************************************!*\
  !*** ./json_schema/response/ble/central/index.yml ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central","basePath":"ble","anyOf":[{"$ref":"/response/ble/central/scan"},{"$ref":"/response/ble/central/scan_finish"},{"$ref":"/response/ble/central/status_update"},{"$ref":"/response/ble/central/service_get"},{"$ref":"/response/ble/central/service_get_finish"},{"$ref":"/response/ble/central/characteristic_get"},{"$ref":"/response/ble/central/characteristic_get_finish"},{"$ref":"/response/ble/central/characteristic_write"},{"$ref":"/response/ble/central/characteristic_read"},{"$ref":"/response/ble/central/characteristic_register_notify"},{"$ref":"/response/ble/central/characteristic_notify"},{"$ref":"/response/ble/central/characteristic_notify"},{"$ref":"/response/ble/central/descriptor_get"},{"$ref":"/response/ble/central/descriptor_get_finish"},{"$ref":"/response/ble/central/descriptor_write"},{"$ref":"/response/ble/central/descriptor_read"},{"$ref":"/response/ble/central/error"}]}

/***/ }),

/***/ "./json_schema/response/ble/central/scan.yml":
/*!***************************************************!*\
  !*** ./json_schema/response/ble/central/scan.yml ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/scan","type":"object","required":["scan_result"],"properties":{"scan_result":{"type":"object","required":["address","ble_event_type","device_type","address_type","flag","rssi"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"ble_event_type":{"type":"string","enum":["connectable_advertisemnt","connectable_directed_advertisemnt","scannable_advertising","non_connectable_advertising","scan_response"]},"device_type":{"type":"string","enum":["ble","dumo","breder"]},"address_type":{"type":"string","enum":["public","random","rpa_public","rpa_random"]},"flag":{"type":"integer","minimum":0},"rssi":{"type":"integer","maximum":0},"adv_data":{"$ref":"/bleAdvertiseData"},"scan_resp":{"$ref":"/bleAdvertiseData"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/scan_finish.yml":
/*!**********************************************************!*\
  !*** ./json_schema/response/ble/central/scan_finish.yml ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/scan_finish","type":"object","required":["scan_result_finish"],"properties":{"scan_result_finish":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/response/ble/central/service_get.yml":
/*!**********************************************************!*\
  !*** ./json_schema/response/ble/central/service_get.yml ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/service_get","type":"object","required":["get_service_result"],"properties":{"get_service_result":{"type":"object","required":["address","service_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"}}}}}

/***/ }),

/***/ "./json_schema/response/ble/central/service_get_finish.yml":
/*!*****************************************************************!*\
  !*** ./json_schema/response/ble/central/service_get_finish.yml ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/central/service_get_finish","type":"object","required":["get_service_result_finish"],"properties":{"get_service_result_finish":{"type":"object","required":["address"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_notify_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_read_characteristic"],"properties":{"notify_read_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_notify_write.yml":
/*!*****************************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/characteristic_notify_write.yml ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_notify_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_write_characteristic"],"properties":{"notify_write_characteristic":{"type":"object","required":["address","service_uuid","characteristic_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_read.yml":
/*!*********************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/characteristic_read.yml ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["read_characteristic_result"],"properties":{"read_characteristic_result":{"type":"object","required":["service_uuid","characteristic_uuid","data","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/characteristic_write.yml":
/*!**********************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/characteristic_write.yml ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/characteristic_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["write_characteristic_result"],"properties":{"write_characteristic_result":{"type":"object","required":["service_uuid","characteristic_uuid","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_notify_read.yml":
/*!************************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_notify_read.yml ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_notify_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_read_descriptor"],"properties":{"notify_read_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_notify_write.yml":
/*!*************************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_notify_write.yml ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_notify_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["notify_write_descriptor"],"properties":{"notify_write_descriptor":{"type":"object","required":["address","service_uuid","characteristic_uuid","descriptor_uuid","data"],"additionalProperties":false,"properties":{"address":{"$ref":"/deviceAddress"},"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_read.yml":
/*!*****************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_read.yml ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_read","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["read_descriptor_result"],"properties":{"read_descriptor_result":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","data","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"data":{"$ref":"/dataArray"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

/***/ }),

/***/ "./json_schema/response/ble/peripheral/descriptor_write.yml":
/*!******************************************************************!*\
  !*** ./json_schema/response/ble/peripheral/descriptor_write.yml ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ble/peripheral/descriptor_write","type":"object","required":["peripheral"],"properties":{"peripheral":{"type":"object","additionalProperties":false,"required":["write_descriptor_result"],"properties":{"write_descriptor_result":{"type":"object","required":["service_uuid","characteristic_uuid","descriptor_uuid","result"],"additionalProperties":false,"properties":{"service_uuid":{"$ref":"/uuid"},"characteristic_uuid":{"$ref":"/uuid"},"descriptor_uuid":{"$ref":"/uuid"},"result":{"type":"string","enum":["success","failed"]}}}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug/error","desccription":"global error","type":"object","required":["error"],"properties":{"error":{"type":"object","additionalProperties":true,"properties":{"message":{"type":"string"}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/debug/warning","desccription":"global warnings","type":"object","required":["warning"],"properties":{"warning":{"type":"object","additionalProperties":true,"properties":{"message":{"type":"string"}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/logicAnalyzer/data","type":"object","required":["data"],"properties":{"data":{"$ref":"/bitArray"}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/measure/echo","type":"object","required":["echo"],"properties":{"echo":{"type":"array","minItesm":1,"items":{"type":"object","required":["edge","timing"],"properties":{"edge":{"type":"boolean"},"timing":{"type":"number"}}}}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/message/receive","related":"/request/message/send","type":"object","required":["data","from"],"properties":{"data":{},"from":{"type":["string","null"]}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/switch/change","desccription":"value changes are always notified.","type":"object","required":["state"],"properties":{"state":{"type":"string","enum":["none","push","left","right"]},"action":{"type":"string","enum":["get"]}}}

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

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws/ready","type":"object","required":["ready"],"properties":{"ready":{"type":"boolean","enum":[true]}}}

/***/ }),

/***/ "./json_schema/response/ws/redirect.yml":
/*!**********************************************!*\
  !*** ./json_schema/response/ws/redirect.yml ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema#","id":"/response/ws/redirect","type":"object","required":["redirect"],"properties":{"redirect":{"type":"string"}}}

/***/ }),

/***/ "./obniz sync recursive":
/*!********************!*\
  !*** ./obniz sync ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./obniz sync recursive";

/***/ }),

/***/ "./obniz/ObnizApi.js":
/*!***************************!*\
  !*** ./obniz/ObnizApi.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fetch = __webpack_require__(/*! node-fetch */ "node-fetch");

class ObnizApi {
  constructor(obnizId, options) {
    this.id = obnizId;
    options = options || {};
    this.options = {
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || 'https://obniz.io'
    };
    this.urlBase = this.options.obniz_server + '/obniz/' + this.id;
  }

  get apiVersion() {
    let packageJson = __webpack_require__(/*! ../package.json */ "./package.json");
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
      headers
    };
    if (params) {
      fetchParams['body'] = JSON.stringify(params);
    }

    return fetch(url, fetchParams).then(res => {
      return res.json();
    }).then(json => {
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
/*!**********************************!*\
  !*** ./obniz/ObnizComponents.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
const ObnizParts = __webpack_require__(/*! ./ObnizParts */ "./obniz/ObnizParts.js");

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
    for (let handerIndex = 0; handerIndex < notifyHandlers.length; handerIndex++) {
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
/*!**********************************!*\
  !*** ./obniz/ObnizConnection.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./libs/wscommand */ "./obniz/libs/wscommand/index.js");
const emitter = __webpack_require__(/*! eventemitter3 */ "eventemitter3");

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
    this.bufferdAmoundWarnBytes = 10 * 1000 * 1000; // 10M bytes
    this.emitter = new emitter();

    this._connectionRetryCount = 0;

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
      reset_obniz_on_ws_disconnection: options.reset_obniz_on_ws_disconnection === false ? false : true
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
    let packageJson = __webpack_require__(/*! ../package.json */ "./package.json");
    return packageJson.version;
  }

  wsOnOpen() {
    this.print_debug('ws connected');
    this._connectionRetryCount = 0;
    // wait for {ws:{ready:true}} object
    if (typeof this.onopen === 'function') {
      this.onopen(this);
    }
  }

  wsOnMessage(data) {
    let json;
    if (typeof data === 'string') {
      json = JSON.parse(data);
    } else if (this.wscommands) {
      if (this.debugprintBinary) {
        this.print_debug('' + new Uint8Array(data).toString());
      }
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
    this.emitter.emit('closed');
    if (typeof this.onclose === 'function' && this.onConnectCalled == true) {
      this.onclose(this);
    }
    this.onConnectCalled = false;

    this._reconnect();
  }

  connectWait(option) {
    option = option || {};
    let timeout = option.timeout || null;

    return new Promise((resolve, reject) => {
      if (this.onConnectCalled) {
        resolve(true);
        return;
      }
      this.emitter.once('connected', () => {
        resolve(true);
      });
      if (!this.options.auto_connect) {
        this.emitter.once('closed', () => {
          resolve(false);
        });
      }
      if (timeout) {
        setTimeout(() => {
          resolve(false);
        }, timeout * 1000);
      }
      this.connect();
    });
  }

  _reconnect() {
    this._connectionRetryCount++;
    let tryAfter = 1000;
    if (this._connectionRetryCount > 15) {
      tryAfter = (this._connectionRetryCount - 15) * 1000;
      const Limit = isNode ? 60 * 1000 : 10 * 1000;
      if (tryAfter > Limit) {
        tryAfter = Limit;
      }
    }
    if (this.options.auto_connect) {
      setTimeout(() => {
        this.wsconnect(); // always connect to mainserver if ws lost
      }, tryAfter);
    }
  }

  wsOnError(event) {
    // console.error(event);
  }

  wsOnUnexpectedResponse(req, res) {
    if (res && res.statusCode == 404) {
      this.print_debug('obniz not online');
    } else {
      this.print_debug( true ? res.statusCode : undefined);
    }

    this.clearSocket(this.socket);
    delete this.socket;

    this._reconnect();
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
      const wsClient = __webpack_require__(/*! ws */ "ws");
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
      socket.onmessage = function (event) {
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
      const wsClient = __webpack_require__(/*! ws */ "ws");
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
      let shouldRemoveObservers = ['open', 'message', 'close', 'error', 'unexpected-response'];
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
    if (this.socket && this.socket.readyState <= 1) {
      return;
    }
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

    this.emitter.emit('connected');

    if (shouldCall) {
      if (typeof this.onconnect === 'function') {
        const promise = this.onconnect(this);
        if (promise instanceof Promise) {
          promise.catch(err => {
            console.error(err);
          });
        }
      }
      this.onConnectCalled = true;
    }
  }

  print_debug(str) {
    if (this.debugprint || this.debugprintBinary) {
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
    if (this.wscommand && (typeof options !== 'object' || options.local_connect !== false)) {
      let compressed;
      try {
        compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData)[0]);
        if (compressed) {
          sendData = compressed;
          if (this.debugprintBinary) {
            this.print_debug('binalized: ' + new Uint8Array(compressed).toString());
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
    if (this.socket_local && this.socket_local.readyState === 1 && typeof data !== 'string') {
      this.print_debug('send via local');
      this.socket_local.send(data);
      if (this.socket_local.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.warning('over ' + this.socket_local.bufferedAmount + ' bytes queued');
      }
      return;
    }

    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(data);
      if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.warning('over ' + this.socket.bufferedAmount + ' bytes queued');
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
    if (this.debugprint) {
      this.print_debug(JSON.stringify(obj));
    }

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
      if (wsObj.local_connect && wsObj.local_connect.ip && this.wscommand && this.options.local_connect && this._canConnectToInsecure()) {
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
/*!*****************************!*\
  !*** ./obniz/ObnizParts.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizConnection = __webpack_require__(/*! ./ObnizConnection */ "./obniz/ObnizConnection.js");
const ObnizUtil = __webpack_require__(/*! ./libs/utils/util */ "./obniz/libs/utils/util.js");

let _parts = {};

module.exports = class ObnizParts extends ObnizConnection {
  constructor(id, options) {
    super(id, options);
  }

  static _parts() {
    return _parts;
  }

  static PartsRegistrate(arg0, arg1) {
    if (arg0 && typeof arg0.info === 'function' && typeof arg0.info().name === 'string') {
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
          throw new Error(partsname + " wired param '" + err + "' required, but not found ");
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
/*!*************************************!*\
  !*** ./obniz/ObnizSystemMethods.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizComponents = __webpack_require__(/*! ./ObnizComponents */ "./obniz/ObnizComponents.js");

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

    buf.push(upper >>> 8 * 3 & 0xff);
    buf.push(upper >>> 8 * 2 & 0xff);
    buf.push(upper >>> 8 * 1 & 0xff);
    buf.push(upper >>> 8 * 0 & 0xff);
    buf.push(lower >>> 8 * 3 & 0xff);
    buf.push(lower >>> 8 * 2 & 0xff);
    buf.push(lower >>> 8 * 1 & 0xff);
    buf.push(lower >>> 8 * 0 & 0xff);
    buf.push(rand >>> 8 * 3 & 0xff);
    buf.push(rand >>> 8 * 2 & 0xff);
    buf.push(rand >>> 8 * 1 & 0xff);
    buf.push(rand >>> 8 * 0 & 0xff);

    let obj = {
      system: {
        ping: {
          key: buf
        }
      }
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

        this.print_debug(str);
        resolve(str);
      };
      this.addPongObserver(callback);
    });
  }
};

/***/ }),

/***/ "./obniz/ObnizUIs.js":
/*!***************************!*\
  !*** ./obniz/ObnizUIs.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizSystemMethods = __webpack_require__(/*! ./ObnizSystemMethods */ "./obniz/ObnizSystemMethods.js");

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
        this.prompt(filled, function (obnizid) {
          this.id = obnizid;
          this.wsconnect(desired_server);
        }.bind(this));
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
    <div style="background-color:${obj.alert === 'warning' ? '#ffee35' : '#ff7b34'}">${obj.message}</div>`;
    document.getElementById(this.options.debug_dom_id).insertAdjacentHTML('beforeend', dom);
  }

  getDebugDoms() {
    if (this.isNode) {
      return;
    }
    let loaderDom = document.querySelector('#loader');
    let debugDom = document.querySelector('#' + this.options.debug_dom_id);
    let statusDom = document.querySelector('#' + this.options.debug_dom_id + ' #online-status');
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
    const isConnectedLocally = this.socket_local && this.socket_local.readyState === 1;
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
      doms.statusDom.style.backgroundColor = isConnectedLocally ? '#0cd362' : '#31965d';
      doms.statusDom.style.color = '#FFF';
      doms.statusDom.innerHTML = (this.id ? 'online : ' + this.id : 'online') + (isConnectedLocally ? ' via local_connect' : ' via internet');
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
/*!************************!*\
  !*** ./obniz/index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ObnizUIs = __webpack_require__(/*! ./ObnizUIs */ "./obniz/ObnizUIs.js");
const ObnizApi = __webpack_require__(/*! ./ObnizApi */ "./obniz/ObnizApi.js");

/* global showObnizDebugError  */

const isNode = typeof window === 'undefined';

class Obniz extends ObnizUIs {
  constructor(id, options) {
    super(id, options);
  }

  repeat(callback, interval) {
    if (this.looper) {
      this.looper = callback;
      this.repeatInterval = interval || this.repeatInterval || 100;
      return;
    }
    this.looper = callback;
    this.repeatInterval = interval || 100;

    if (this.onConnectCalled) {
      this.loop();
    }
  }

  loop() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (typeof _this.looper === 'function' && _this.onConnectCalled) {
        let prom = _this.looper();
        if (prom instanceof Promise) {
          yield prom;
        }
        setTimeout(_this.loop.bind(_this), _this.repeatInterval || 100);
      }
    })();
  }

  _callOnConnect() {
    super._callOnConnect();
    this.loop();
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
        data: message
      }
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
      }
      console.log(`Warning: ${msg}`);
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

  function showObnizDebugError(err) {
    //eslint-disable-line
    if (window.parent && window.parent.logger) {
      window.parent.logger.onObnizError(err);
    }
  }
}

/*===================*/
/* ReadParts */
/*===================*/

__webpack_require__("./obniz sync recursive").context = __webpack_require__(/*! ./libs/webpackReplace/require-context */ "./obniz/libs/webpackReplace/require-context.js");
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
const BleAdvertisement = __webpack_require__(/*! ./bleAdvertisement */ "./obniz/libs/embeds/ble/bleAdvertisement.js");
const BleScan = __webpack_require__(/*! ./bleScan */ "./obniz/libs/embeds/ble/bleScan.js");

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

    let remotePeripheralCallbackFunc = function (val, func, type) {
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
        obj: 'peripheral'
      },
      get_characteristic_result: { name: 'discover', obj: 'service' },
      get_characteristic_result_finish: {
        name: 'discoverfinished',
        obj: 'service'
      },
      write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
      read_characteristic_result: { name: 'onread', obj: 'characteristic' },
      register_notify_characteristic_result: {
        name: 'onregisternotify',
        obj: 'characteristic'
      },
      unregister_notify_characteristic_result: {
        name: 'onunregisternotify',
        obj: 'characteristic'
      },
      nofity_characteristic: { name: 'onnotify', obj: 'characteristic' },
      get_descriptor_result: { name: 'discover', obj: 'characteristic' },
      get_descriptor_result_finish: {
        name: 'discoverfinished',
        obj: 'characteristic'
      },
      write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
      read_descriptor_result: { name: 'onread', obj: 'descriptor' }
    };

    for (let key in paramList) {
      remotePeripheralCallbackFunc(obj[key], function (val, bleobj) {
        bleobj.notifyFromServer(paramList[key].name, val);
      }.bind(this), paramList[key].obj);
    }

    let callbackFunc = function (val, func, type) {
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
      callbackFunc(obj.peripheral.connection_status, function (val) {
        this.peripheral.onconnectionupdates(val);
      }.bind(this), 'peripheral');

      const paramList = {
        read_characteristic_result: { name: 'onread', obj: 'characteristic' },
        write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
        notify_read_characteristic: {
          name: 'onreadfromremote',
          obj: 'characteristic'
        },
        notify_write_characteristic: {
          name: 'onwritefromremote',
          obj: 'characteristic'
        },
        read_descriptor_result: { name: 'onread', obj: 'descriptor' },
        write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
        notify_read_descriptor: { name: 'onreadfromremote', obj: 'descriptor' },
        notify_write_descriptor: {
          name: 'onwritefromremote',
          obj: 'descriptor'
        }
      };

      for (let key in paramList) {
        callbackFunc(obj.peripheral[key], function (val, bleobj) {
          bleobj.notifyFromServer(paramList[key].name, val);
        }.bind(this), paramList[key].obj);
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
        if (params.service_uuid && params.characteristic_uuid && params.descriptor_uuid) {
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
        this.Obniz.error(`ble ${params.message} service=${params.service_uuid} characteristic_uuid=${params.characteristic_uuid} descriptor_uuid=${params.descriptor_uuid}`);
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
      str = str.slice(0, 8) + '-' + str.slice(8, 12) + '-' + str.slice(12, 16) + '-' + str.slice(16, 20) + '-' + str.slice(20);
    }
    return str;
  }
}

module.exports = ObnizBLE;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleAdvertisement.js":
/*!***************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleAdvertisement.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Builder = __webpack_require__(/*! ./bleAdvertisementBuilder */ "./obniz/libs/embeds/ble/bleAdvertisementBuilder.js");

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
      adv_data: this.adv_data
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
/*!**********************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleAdvertisementBuilder.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

class BleAdvertisementBuilder {
  constructor(Obniz, json) {
    this.Obniz = Obniz;
    this.rows = {};

    if (json) {
      if (json.localName) {
        this.setCompleteLocalName(json.localName);
      }
      if (json.manufacturerData && json.manufacturerData.companyCode && json.manufacturerData.data) {
        this.setManufacturerSpecificData(json.manufacturerData.companyCode, json.manufacturerData.data);
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
      this.Obniz.error('Too large data. Advertise/ScanResponse data are must be less than 32 byte.');
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
    row.push(companyCode >> 8 & 0xff);
    Array.prototype.push.apply(row, data);
    this.setRow(0xff, row);
  }

  setUuid(uuid) {
    let uuidData = this.convertUuid(uuid);
    let type = { 16: 0x06, 4: 0x04, 2: 0x02 }[uuidData.length];
    this.setRow(type, uuidData);
  }

  convertUuid(uuid) {
    let uuidNumeric = BleHelper.uuidFilter(uuid);
    if (uuidNumeric.length !== 32 && uuidNumeric.length !== 8 && uuidNumeric.length !== 4) {
      this.Obniz.error('BLE uuid must be 16/32/128 bit . (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb for 128bit)');
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

    data.push(major >> 8 & 0xff);
    data.push(major >> 0 & 0xff);
    data.push(minor >> 8 & 0xff);
    data.push(minor >> 0 & 0xff);
    data.push(txPower >> 0 & 0xff);

    this.setManufacturerSpecificData(0x004c, data);
    return;
  }

  extendEvalJson(json) {
    if (json) {
      if (json.flags) {
        if (json.flags.includes('limited_discoverable_mode')) this.setLeLimitedDiscoverableModeFlag();
        if (json.flags.includes('general_discoverable_mode')) this.setLeGeneralDiscoverableModeFlag();
        if (json.flags.includes('br_edr_not_supported')) this.setBrEdrNotSupportedFlag();
        if (json.flags.includes('le_br_edr_controller')) this.setLeBrEdrControllerFlag();
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
/*!*******************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleAttributeAbstract.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ObnizUtil = __webpack_require__(/*! ../../utils/util */ "./obniz/libs/utils/util.js");
const emitter = __webpack_require__(/*! eventemitter3 */ "eventemitter3");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

class BleAttributeAbstract {
  constructor(params) {
    this.uuid = BleHelper.uuidFilter(params.uuid);
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
      childrenName = childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
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
        }
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
    uuid = BleHelper.uuidFilter(uuid);
    return this.children.filter(function (element) {
      return BleHelper.uuidFilter(element.uuid) === uuid;
    }).shift();
  }

  toJSON() {
    let obj = {
      uuid: BleHelper.uuidFilter(this.uuid)
    };

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

  writeNumber(val, needResponse) {
    this.write([val], needResponse);
  }

  writeText(str, needResponse) {
    this.write(ObnizUtil.string2dataArray(str), needResponse);
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

  writeWait(data, needResponse) {
    return new Promise(resolve => {
      this.emitter.once('onwrite', params => {
        resolve(params.result === 'success');
      });
      this.write(data, needResponse);
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
      case 'onerror':
        {
          this.onerror(params);
          break;
        }
      case 'onwrite':
        {
          this.onwrite(params.result);
          break;
        }
      case 'onread':
        {
          this.onread(params.data);
          break;
        }
      case 'onwritefromremote':
        {
          this.onwritefromremote(params.address, params.data);
          break;
        }
      case 'onreadfromremote':
        {
          this.onreadfromremote(params.address);
          break;
        }
    }
  }
}

module.exports = BleAttributeAbstract;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleCharacteristic.js":
/*!****************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleCharacteristic.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleDescriptor = __webpack_require__(/*! ./bleDescriptor */ "./obniz/libs/embeds/ble/bleDescriptor.js");
const BleAttributeAbstract = __webpack_require__(/*! ./bleAttributeAbstract */ "./obniz/libs/embeds/ble/bleAttributeAbstract.js");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid),
            data: data
          }
        }
      }
    });
  }

  read() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid)
          }
        }
      }
    });
  }

  notify() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          notify_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid)
          }
        }
      }
    });
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


const BleAttributeAbstract = __webpack_require__(/*! ./bleAttributeAbstract */ "./obniz/libs/embeds/ble/bleAttributeAbstract.js");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
            service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
            descriptor_uuid: this.uuid,
            data: dataArray
          }
        }
      }
    });
  }

  read() {
    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_descriptor: {
            service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
            descriptor_uuid: this.uuid
          }
        }
      }
    });
  }
}

module.exports = BleDescriptor;

/***/ }),

/***/ "./obniz/libs/embeds/ble/bleHelper.js":
/*!********************************************!*\
  !*** ./obniz/libs/embeds/ble/bleHelper.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleHelper = {
  uuidFilter: function (uuid) {
    return uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
  }
};

module.exports = BleHelper;

/***/ }),

/***/ "./obniz/libs/embeds/ble/blePeripheral.js":
/*!************************************************!*\
  !*** ./obniz/libs/embeds/ble/blePeripheral.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleService = __webpack_require__(/*! ./bleService */ "./obniz/libs/embeds/ble/bleService.js");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
    uuid = BleHelper.uuidFilter(uuid);
    return this.services.filter(function (element) {
      return BleHelper.uuidFilter(element.uuid) === uuid;
    }).shift();
  }

  removeService(uuid) {
    this.services = this.services.filter(function (element) {
      return BleHelper.uuidFilter(element.uuid) !== uuid;
    });
  }

  stopAllService() {
    this.Obniz.send({
      ble: {
        peripheral: null
      }
    });
    this.services = [];
  }

  toJSON() {
    return {
      services: this.services
    };
  }

  findCharacteristic(param) {
    let serviceUuid = BleHelper.uuidFilter(param.service_uuid);
    let characteristicUuid = BleHelper.uuidFilter(param.characteristic_uuid);
    let s = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  findDescriptor(param) {
    let descriptorUuid = BleHelper.uuidFilter(param.descriptor_uuid);
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
/*!*************************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleAttributeAbstract = __webpack_require__(/*! ./bleAttributeAbstract */ "./obniz/libs/embeds/ble/bleAttributeAbstract.js");

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
      case 'discover':
        {
          let child = this.getChild(params[this.wsChildUuidName]);
          child.discoverdOnRemote = true;
          child.properties = params.properties || [];
          this.ondiscover(child);
          break;
        }
      case 'discoverfinished':
        {
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
/*!**********************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleRemoteCharacteristic.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleRemoteDescriptor = __webpack_require__(/*! ./bleRemoteDescriptor */ "./obniz/libs/embeds/ble/bleRemoteDescriptor.js");
const BleRemoteAttributeAbstract = __webpack_require__(/*! ./bleRemoteAttributeAbstract */ "./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid)
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  unregisterNotify() {
    this.onnotify = function () {};
    const obj = {
      ble: {
        unregister_notify_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid)
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  read() {
    const obj = {
      ble: {
        read_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid)
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  write(array, needResponse) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    const obj = {
      ble: {
        write_characteristic: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid),
          data: array,
          needResponse
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  discoverChildren() {
    const obj = {
      ble: {
        get_descriptors: {
          address: this.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.uuid)
        }
      }
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
      case 'onregisternofity':
        {
          this.onregisternofity();
          break;
        }
      case 'onunregisternofity':
        {
          this.onunregisternofity();
          break;
        }
      case 'onnotify':
        {
          this.onnotify();
          break;
        }
    }
  }
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


const BleRemoteAttributeAbstract = __webpack_require__(/*! ./bleRemoteAttributeAbstract */ "./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
          service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
          descriptor_uuid: BleHelper.uuidFilter(this.uuid)
        }
      }
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }

  write(array, needResponse) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    const obj = {
      ble: {
        write_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
          descriptor_uuid: BleHelper.uuidFilter(this.uuid),
          data: array,
          needResponse
        }
      }
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }
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
const emitter = __webpack_require__(/*! eventemitter3 */ "eventemitter3");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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

    this.keys = ['device_type', 'address_type', 'ble_event_type', 'rssi', 'adv_data', 'scan_resp'];

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
      rssi: this.rssi
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
    if (!data || data[0] !== 0x4c || data[1] !== 0x00 || data[2] !== 0x02 || data[3] !== 0x15 || data.length !== 25) {
      this.iBeacon = null;
      return;
    }
    let uuidData = data.slice(4, 20);
    let uuid = '';
    for (let i = 0; i < uuidData.length; i++) {
      uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
      if (i === 4 - 1 || i === 4 + 2 - 1 || i === 4 + 2 * 2 - 1 || i === 4 + 2 * 3 - 1) {
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
      rssi: this.rssi
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
          address: this.address
        }
      }
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
          address: this.address
        }
      }
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
    uuid = BleHelper.uuidFilter(uuid);
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
    let serviceUuid = BleHelper.uuidFilter(param.service_uuid);
    return this.getService(serviceUuid);
  }

  findCharacteristic(param) {
    let serviceUuid = BleHelper.uuidFilter(param.service_uuid);
    let characteristicUuid = BleHelper.uuidFilter(param.characteristic_uuid);
    let s = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  findDescriptor(param) {
    let descriptorUuid = BleHelper.uuidFilter(param.descriptor_uuid);
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
          address: this.address
        }
      }
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
      case 'statusupdate':
        {
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
      case 'discover':
        {
          let child = this.getService(params.service_uuid);
          child.discoverdOnRemote = true;
          this.ondiscoverservice(child);
          break;
        }
      case 'discoverfinished':
        {
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
/*!***************************************************!*\
  !*** ./obniz/libs/embeds/ble/bleRemoteService.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleRemoteCharacteristic = __webpack_require__(/*! ./bleRemoteCharacteristic */ "./obniz/libs/embeds/ble/bleRemoteCharacteristic.js");
const BleRemoteAttributeAbstract = __webpack_require__(/*! ./bleRemoteAttributeAbstract */ "./obniz/libs/embeds/ble/bleRemoteAttributeAbstract.js");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
          service_uuid: BleHelper.uuidFilter(this.uuid)
        }
      }
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
/*!******************************************!*\
  !*** ./obniz/libs/embeds/ble/bleScan.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const emitter = __webpack_require__(/*! eventemitter3 */ "eventemitter3");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
      duration: settings && settings.duration ? settings.duration : 30
    };

    this.scanTarget = target;
    if (this.scanTarget && this.scanTarget.uuids && Array.isArray(this.scanTarget.uuids)) {
      this.scanTarget.uuids = this.scanTarget.uuids.map(elm => {
        return BleHelper.uuidFilter(elm);
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
    if (this.scanTarget && this.scanTarget.localName && peripheral.localName !== this.scanTarget.localName) {
      return false;
    }
    if (this.scanTarget && this.scanTarget.uuids) {
      let uuids = peripheral.advertisementServiceUuids().map(e => {
        return BleHelper.uuidFilter(e);
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
      case 'onfind':
        {
          if (this.isTarget(params)) {
            this.scanedPeripherals.push(params);
            this.emitter.emit(notifyName, params);
            this.onfind(params);
          }
          break;
        }
      case 'onfinish':
        {
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
/*!*********************************************!*\
  !*** ./obniz/libs/embeds/ble/bleService.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BleAttributeAbstract = __webpack_require__(/*! ./bleAttributeAbstract */ "./obniz/libs/embeds/ble/bleAttributeAbstract.js");
const BleCharacteristic = __webpack_require__(/*! ./bleCharacteristic */ "./obniz/libs/embeds/ble/bleCharacteristic.js");
const BleHelper = __webpack_require__(/*! ./bleHelper */ "./obniz/libs/embeds/ble/bleHelper.js");

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
      serviceUuids: [this.uuid]
    };
  }

  end() {
    this.peripheral.Obniz.send({
      ble: {
        peripheral: {
          stop_service: {
            service_uuid: BleHelper.uuidFilter(this.uuid)
          }
        }
      }
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

    this._canvas = null;
    this._reset();
  }

  _reset() {
    this._pos = { x: 0, y: 0 };
    this.autoFlush = true;
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
        const { createCanvas } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
    this._pos.x = 0;
    this._pos.y = 0;
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#FFF';
      this.draw(ctx);
    } else {
      let obj = {};
      obj['display'] = {
        clear: true
      };
      this.Obniz.send(obj);
    }
  }

  pos(x, y) {
    this._ctx(); //crete first
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
        text: '' + text
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
        text
      }
    };
    if (correction) {
      obj['display'].qr.correction = correction;
    }
    this.Obniz.send(obj);
  }

  raw(data) {
    let obj = {};
    obj['display'] = {
      raw: data
    };
    this.Obniz.send(obj);
  }

  setPinName(io, moduleName, funcName) {
    let obj = {};
    obj['display'] = {};
    obj['display']['pin_assign'] = {};
    obj['display']['pin_assign'][io] = {
      module_name: moduleName,
      pin_name: funcName
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
        pin_name: data[key]
      };
    }
    if (!noAssignee) {
      this.Obniz.send(obj);
    }
  }

  _draw(ctx) {
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

  draw(ctx) {
    if (this.autoFlush) {
      this._draw(ctx);
    }
  }

  drawing(autoFlush) {
    this.autoFlush = autoFlush == true;
    const ctx = this._ctx();
    if (ctx) {
      this.draw(ctx);
    }
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
    this._reset();
  }

  _reset() {
    this.observers = [];
    this.onChangeForStateWait = function () {};
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
      obj['switch'] = 'get';
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  stateWait(isPressed) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.onChangeForStateWait = function (pressed) {
        if (isPressed == pressed) {
          self.onChangeForStateWait = function () {};
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
      stream: true
    };
    this.Obniz.send(obj);
    return this.value;
  }

  getWait() {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['ad' + self.id] = {
        stream: false
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
    this._reset();
    this.onerror = undefined;
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
    this.state = ObnizUtil._keyFilter(arg, ['mode', 'sda', 'scl', 'pull', 'gnd']);

    let ioKeys = ['sda', 'scl', 'gnd'];
    for (let key of ioKeys) {
      if (this.state[key] && !this.Obniz.isValidIO(this.state[key])) {
        throw new Error("i2c start param '" + key + "' are to be valid io no");
      }
    }

    let mode = this.state.mode;
    let clock = typeof arg.clock === 'number' ? parseInt(arg.clock) : null;
    let slave_address = typeof arg.slave_address === 'number' ? parseInt(arg.slave_address) : null;
    let slave_address_length = typeof arg.slave_address_length === 'number' ? parseInt(arg.slave_address_length) : null;

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
        throw new Error('i2c: please use under 400khz when internal 5v internal pull-up');
      }
      if (arg.pull === '3v' && clock > 100 * 1000) {
        throw new Error('i2c: please use under 100khz when internal 3v internal pull-up');
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
      data
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
    return new Promise(function (resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['i2c' + self.id] = {
        address,
        read: length
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
          message: `i2c${this.id}: ${obj.warning.message}`
        });
      }
      if (obj.error) {
        const message = `i2c${this.id}: ${obj.error.message}`;
        if (typeof this.onerror === 'function') {
          this.onerror(new Error(message));
        } else {
          this.Obniz.error({
            alert: 'error',
            message: message
          });
        }
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
      output_type: output_type
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
      pull_type: pull_type
    };
    this.Obniz.send(obj);
  }

  input(callback) {
    this.onchange = callback;
    let obj = {};
    obj['io' + this.id] = {
      direction: 'input',
      stream: true
    };
    this.Obniz.send(obj);
    return this.value;
  }

  inputWait() {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['io' + self.id] = {
        direction: 'input',
        stream: false
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
          message: `io${this.id}: ${obj.warning.message}`
        });
      }
      if (obj.error) {
        this.Obniz.error({
          alert: 'error',
          message: `io${this.id}: ${obj.error.message}`
        });
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
    let obj = {};
    obj.io = {
      animation: {
        name: name,
        status: status
      }
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
        state: pooledJsonArray
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
      freq: 1000
    };
    this.sendWS({
      io: io
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
      freq: freq
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
      pulse: pulse_width
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
    const pulse_width = 1.0 / this.state.freq * 1000 * duty * 0.01;
    this.state.duty = duty;
    this.sendWS({
      pulse: pulse_width
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
const semver = __webpack_require__(/*! semver */ "semver");

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
    this.params = ObnizUtil._keyFilter(params, ['mode', 'clk', 'mosi', 'miso', 'frequency', 'drive', 'pull', 'gnd']);
    let obj = {};

    let ioKeys = ['clk', 'mosi', 'miso', 'gnd'];
    for (let key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }

    obj['spi' + this.id] = {
      mode: this.params.mode,
      clock: this.params.frequency //name different
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
      if (this.params.clk !== undefined) this.Obniz.getIO(this.params.clk).drive(this.params.drive);
      if (this.params.mosi !== undefined) this.Obniz.getIO(this.params.mosi).drive(this.params.drive);
      if (this.params.miso !== undefined) this.Obniz.getIO(this.params.miso).drive(this.params.drive);
    } else {
      if (this.params.clk !== undefined) this.Obniz.getIO(this.params.clk).drive('5v');
      if (this.params.mosi !== undefined) this.Obniz.getIO(this.params.mosi).drive('5v');
      if (this.params.miso !== undefined) this.Obniz.getIO(this.params.miso).drive('5v');
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
      throw new Error(`with your obniz ${this.Obniz.firmware_ver}. spi max length=32byte but yours ${data.length}. Please update obniz firmware`);
    }

    let self = this;
    return new Promise(function (resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['spi' + self.id] = {
        data: data,
        read: true
      };
      self.Obniz.send(obj);
    });
  }

  write(data) {
    if (!this.used) {
      throw new Error(`spi${this.id} is not started`);
    }
    if (semver.lte(this.Obniz.firmware_ver, '1.0.2') && data.length > 32) {
      throw new Error(`with your obniz ${this.Obniz.firmware_ver}. spi max length=32byte but yours ${data.length}. Please update obniz firmware`);
    }

    let self = this;
    let obj = {};
    obj['spi' + self.id] = {
      data: data,
      read: false
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
    this._reset();
  }

  _reset() {
    this.received = new Uint8Array([]);
    this.used = false;
  }

  start(params) {
    let err = ObnizUtil._requiredKeys(params, ['tx', 'rx']);
    if (err) {
      throw new Error("uart start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, ['tx', 'rx', 'baud', 'stop', 'bits', 'parity', 'flowcontrol', 'rts', 'cts', 'drive', 'pull', 'gnd']);

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
    let sendParams = ObnizUtil._keyFilter(this.params, ['tx', 'rx', 'baud', 'stop', 'bits', 'parity', 'flowcontrol', 'rts', 'cts']);
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
      const buf = Buffer.from(data);
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
    this._reset();
  }

  _reset() {
    this.onmeasured = undefined;
  }

  start(params) {
    let err = ObnizUtil._requiredKeys(params, ['io', 'interval', 'duration']);
    if (err) {
      throw new Error("LogicAnalyzer start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, ['io', 'interval', 'duration', 'triggerValue', 'triggerValueSamples']);

    let obj = {};
    obj.logic_analyzer = {
      io: [this.params.io],
      interval: this.params.interval,
      duration: this.params.duration
    };
    if (this.params.triggerValueSamples > 0) {
      obj.logic_analyzer.trigger = {
        value: !!this.params.triggerValue,
        samples: this.params.triggerValueSamples
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
    this._reset();
  }

  _reset() {
    this.observers = [];
  }

  echo(params) {
    let err = ObnizUtil._requiredKeys(params, ['io_pulse', 'pulse', 'pulse_width', 'io_echo', 'measure_edges']);
    if (err) {
      throw new Error("Measure start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, ['io_pulse', 'pulse', 'pulse_width', 'io_echo', 'measure_edges', 'timeout', 'callback']);

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
        echo: echo
      }
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
/*!********************************!*\
  !*** ./obniz/libs/utils/qr.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var qrcode = function () {
  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function (typeNumber, errorCorrectionLevel) {
    var PAD0 = 0xec;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function (test, maskPattern) {
      _moduleCount = _typeNumber * 4 + 17;
      _modules = function (moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

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

    var setupPositionProbePattern = function (row, col) {
      for (var r = -1; r <= 7; r += 1) {
        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {
          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function () {
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

    var setupTimingPattern = function () {
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

    var setupPositionAdjustPattern = function () {
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
              if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function (test) {
      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = !test && (bits >> i & 1) == 1;
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = !test && (bits >> i & 1) == 1;
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function (test, maskPattern) {
      var data = _errorCorrectionLevel << 3 | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {
        var mod = !test && (bits >> i & 1) == 1;

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
        var mod = !test && (bits >> i & 1) == 1;

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

    var mapData = function (data, maskPattern) {
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
                dark = (data[byteIndex] >>> bitIndex & 1) == 1;
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

    var createBytes = function (buffer, rsBlocks) {
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

    var createData = function (typeNumber, errorCorrectionLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')';
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

    _this.addData = function (data, mode) {
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

    _this.getModules = function () {
      return _modules;
    };

    _this.isDark = function (row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function () {
      return _moduleCount;
    };

    _this.make = function () {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
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

    _this.createTableTag = function (cellSize, margin) {
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

    _this.renderTo2dContext = function (context, cellSize) {
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
    default: function (s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
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
  qrcode.createStringToBytes = function (unicodeData, numChars) {
    // create conversion map.

    var unicodeMap = function () {
      var bin = base64DecodeInputStream(unicodeData);
      var read = function () {
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
        var k = String.fromCharCode(b0 << 8 | b1);
        var v = b2 << 8 | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function (s) {
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
    MODE_KANJI: 1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
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
    PATTERN111: 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function () {
    var PATTERN_POSITION_TABLE = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;

    var _this = {};

    var getBCHDigit = function (data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function (data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
      }
      return (data << 10 | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function (data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
      }
      return data << 12 | d;
    };

    _this.getPatternPosition = function (typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function (maskPattern) {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return function (i, j) {
            return (i + j) % 2 == 0;
          };
        case QRMaskPattern.PATTERN001:
          return function (i, j) {
            return i % 2 == 0;
          };
        case QRMaskPattern.PATTERN010:
          return function (i, j) {
            return j % 3 == 0;
          };
        case QRMaskPattern.PATTERN011:
          return function (i, j) {
            return (i + j) % 3 == 0;
          };
        case QRMaskPattern.PATTERN100:
          return function (i, j) {
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
          };
        case QRMaskPattern.PATTERN101:
          return function (i, j) {
            return i * j % 2 + i * j % 3 == 0;
          };
        case QRMaskPattern.PATTERN110:
          return function (i, j) {
            return (i * j % 2 + i * j % 3) % 2 == 0;
          };
        case QRMaskPattern.PATTERN111:
          return function (i, j) {
            return (i * j % 3 + (i + j) % 2) % 2 == 0;
          };

        default:
          throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function (errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    };

    _this.getLengthInBits = function (mode, type) {
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

    _this.getLostPoint = function (qrcode) {
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
          if (qrcode.isDark(row, col) && !qrcode.isDark(row, col + 1) && qrcode.isDark(row, col + 2) && qrcode.isDark(row, col + 3) && qrcode.isDark(row, col + 4) && !qrcode.isDark(row, col + 5) && qrcode.isDark(row, col + 6)) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col) && !qrcode.isDark(row + 1, col) && qrcode.isDark(row + 2, col) && qrcode.isDark(row + 3, col) && qrcode.isDark(row + 4, col) && !qrcode.isDark(row + 5, col) && qrcode.isDark(row + 6, col)) {
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

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function () {
    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i]] = i;
    }

    var _this = {};

    _this.glog = function (n) {
      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function (n) {
      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {
    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function () {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function (index) {
      return _num[index];
    };

    _this.getLength = function () {
      return _num.length;
    };

    _this.multiply = function (e) {
      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function (e) {
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

  var QRRSBlock = function () {
    var RS_BLOCK_TABLE = [
    // L
    // M
    // Q
    // H

    // 1
    [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],

    // 2
    [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],

    // 3
    [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],

    // 4
    [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],

    // 5
    [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],

    // 6
    [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],

    // 7
    [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],

    // 8
    [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],

    // 9
    [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],

    // 10
    [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16],

    // 11
    [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13],

    // 12
    [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15],

    // 13
    [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12],

    // 14
    [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13],

    // 15
    [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13],

    // 16
    [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16],

    // 17
    [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15],

    // 18
    [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15],

    // 19
    [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14],

    // 20
    [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16],

    // 21
    [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17],

    // 22
    [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13],

    // 23
    [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16],

    // 24
    [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17],

    // 25
    [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16],

    // 26
    [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17],

    // 27
    [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16],

    // 28
    [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16],

    // 29
    [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16],

    // 30
    [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16],

    // 31
    [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16],

    // 32
    [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16],

    // 33
    [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16],

    // 34
    [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17],

    // 35
    [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16],

    // 36
    [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16],

    // 37
    [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16],

    // 38
    [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16],

    // 39
    [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16],

    // 40
    [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];

    var qrRSBlock = function (totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function (typeNumber, errorCorrectionLevel) {
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

    _this.getRSBlocks = function (typeNumber, errorCorrectionLevel) {
      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber + '/errorCorrectionLevel:' + errorCorrectionLevel;
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
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function () {
    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function () {
      return _buffer;
    };

    _this.getAt = function (index) {
      var bufIndex = Math.floor(index / 8);
      return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
    };

    _this.put = function (num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit((num >>> length - i - 1 & 1) == 1);
      }
    };

    _this.getLengthInBits = function () {
      return _length;
    };

    _this.putBit = function (bit) {
      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= 0x80 >>> _length % 8;
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function (data) {
    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function () {
      return _mode;
    };

    _this.getLength = function (buffer) {
      return _data.length;
    };

    _this.write = function (buffer) {
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

    var strToNum = function (s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i));
      }
      return num;
    };

    var chatToNum = function (c) {
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

  var qrAlphaNum = function (data) {
    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function () {
      return _mode;
    };

    _this.getLength = function (buffer) {
      return _data.length;
    };

    _this.write = function (buffer) {
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

    var getCode = function (c) {
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

  var qr8BitByte = function (data) {
    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function () {
      return _mode;
    };

    _this.getLength = function (buffer) {
      return _bytes.length;
    };

    _this.write = function (buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function (data) {
    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function (c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function () {
      return _mode;
    };

    _this.getLength = function (buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function (buffer) {
      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {
        var c = (0xff & data[i]) << 8 | 0xff & data[i + 1];

        if (0x8140 <= c && c <= 0x9ffc) {
          c -= 0x8140;
        } else if (0xe040 <= c && c <= 0xebbf) {
          c -= 0xc140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = (c >>> 8 & 0xff) * 0xc0 + (c & 0xff);

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

  var byteArrayOutputStream = function () {
    var _bytes = [];

    var _this = {};

    _this.writeByte = function (b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function (i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function (b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function (s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i));
      }
    };

    _this.toByteArray = function () {
      return _bytes;
    };

    _this.toString = function () {
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

  var base64EncodeOutputStream = function () {
    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function (b) {
      _base64 += String.fromCharCode(encode(b & 0x3f));
    };

    var encode = function (n) {
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

    _this.writeByte = function (n) {
      _buffer = _buffer << 8 | n & 0xff;
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> _buflen - 6);
        _buflen -= 6;
      }
    };

    _this.flush = function () {
      if (_buflen > 0) {
        writeEncoded(_buffer << 6 - _buflen);
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

    _this.toString = function () {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function (str) {
    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function () {
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

        _buffer = _buffer << 6 | decode(c.charCodeAt(0));
        _buflen += 6;
      }

      var n = _buffer >>> _buflen - 8 & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function (c) {
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
}();

// multibyte support
!function () {
  qrcode.stringToBytesFuncs['UTF-8'] = function (s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);else if (charcode < 0x800) {
          utf8.push(0xc0 | charcode >> 6, 0x80 | charcode & 0x3f);
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | charcode >> 12, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + ((charcode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff);
            utf8.push(0xf0 | charcode >> 18, 0x80 | charcode >> 12 & 0x3f, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
          }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };
}();

module.exports = qrcode;

/***/ }),

/***/ "./obniz/libs/utils/util.js":
/*!**********************************!*\
  !*** ./obniz/libs/utils/util.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class ObnizUtil {
  constructor(obniz) {
    this.obniz = obniz;
  }

  createCanvasContext(width, height) {
    if (this.obniz.isNode) {
      try {
        const { createCanvas } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
        return createCanvas(this.width, this.height);
      } catch (e) {
        throw new Error('obniz.js require node-canvas to draw rich contents. see more detail on docs');
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
      const StringDecoder = __webpack_require__(/*! string_decoder */ "string_decoder").StringDecoder;
      if (StringDecoder) {
        string = new StringDecoder('utf8').write(Buffer.from(data));
      }
    } catch (e) {
      //this.obniz.error(e);
    }
    return string;
  }

  static string2dataArray(str) {
    const buf = Buffer.from(str);
    return [...buf];
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
	var e = new Error("Cannot find module '" + req + "'");
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
      throw new Error('unknown type');
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
	var e = new Error("Cannot find module '" + req + "'");
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
      throw new Error('something wrong. buf less than 3');
    }
    if (buf[0] & 0x80) {
      throw new Error('reserved bit 1');
    }
    let module = 0x7f & buf[0];
    let func = buf[1];
    let length_type = buf[2] >> 6 & 0x3;
    let length_extra_bytse = length_type == 0 ? 0 : length_type == 1 ? 1 : 3;
    if (length_type == 4) {
      throw new Error('invalid length');
    }
    let length = (buf[2] & 0x3f) << length_extra_bytse * 8;
    let index = 3;
    let shift = length_extra_bytse;
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

    let badErrorCodes = [WSSchema.errorCodes.ANY_OF_MISSING, WSSchema.errorCodes.ONE_OF_MISSING, WSSchema.errorCodes.ONE_OF_MULTIPLE, WSSchema.errorCodes.NOT_PASSED, WSSchema.errorCodes.OBJECT_REQUIRED, WSSchema.errorCodes.OBJECT_ADDITIONAL_PROPERTIES, WSSchema.errorCodes.CIRCULAR_REFERENCE, WSSchema.errorCodes.FORMAT_CUSTOM, WSSchema.errorCodes.KEYWORD_CUSTOM, WSSchema.errorCodes.UNKNOWN_PROPERTY];
    let messages = [];
    for (let error of validateError.errors) {
      if (error.code === WSSchema.errorCodes.INVALID_TYPE) {
        if (error.params.type === 'object' || error.params.expected === 'object') {
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

    if (schema.type === 'string' || schema.type === 'integer' || schema.type === 'boolean' || schema.type === 'number' || schema.type === 'null' || schema.filter === 'pass_all') {
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
            results[key] = this._filterSchema(schema.patternProperties[pattern], json[key]);
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
    let buf = new Uint8Array([no]);
    this.sendCommand(params.stream ? this._CommandInitNormalInterval : this._CommandDoOnece, buf);
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

      let schemaData = [{ uri: '/request/ad/deinit', onValid: this.deinit }, { uri: '/request/ad/get', onValid: this.get }];
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
      inquiry_result: 0 /*!< Inquiry result for a peer device. */
      , inquiry_complete: 1 /*!< Inquiry complete. */
      , discovery_result: 2 /*!< Discovery result for a peer device. */
      , discovery_ble_result: 3 /*!< Discovery result for BLE GATT based service on a peer device. */
      , discovery_cmoplete: 4 /*!< Discovery complete. */
      , discovery_di_cmoplete: 5 /*!< Discovery complete. */
      , cancelled: 6 /*!< Search cancelled */
    };

    this._CommandScanResultsBleEvent = {
      connectable_advertisemnt: 0x00 /*!< Connectable undirected advertising (ADV_IND) */
      , connectable_directed_advertisemnt: 0x01 /*!< Connectable directed advertising (ADV_DIRECT_IND) */
      , scannable_advertising: 0x02 /*!< Scannable undirected advertising (ADV_SCAN_IND) */
      , non_connectable_advertising: 0x03 /*!< Non connectable undirected advertising (ADV_NONCONN_IND) */
      , scan_response: 0x04 /*!< Scan Response (SCAN_RSP) */
    };

    this._CommandCharacteristicsProperties = {
      broadcast: 0x01,
      read: 0x02,
      write_without_response: 0x04,
      write: 0x08,
      notify: 0x10,
      indicate: 0x20,
      auth: 0x40,
      extended_properties: 0x80
    };

    this._commandResults = {
      success: 0,
      failed: 1
    };
  }

  /* CENTRAL   */

  centralScanStart(params) {
    let schema = [{ path: 'scan.duration', length: 4, type: 'int', default: 30 }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandStartScan, buf);
  }

  centralScanStop(params) {
    this.sendCommand(this._CommandStopScan, null);
  }

  centralConnect(params) {
    let schema = [{
      path: 'connect.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, { path: null, length: 1, type: 'char', default: false }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  centralDisconnect(params) {
    let schema = [{
      path: 'disconnect.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, { path: null, length: 1, type: 'char', default: true }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  centralServiceGet(params) {
    let schema = [{
      path: 'get_services.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServices, buf);
  }

  centralCharacteristicGet(params) {
    let schema = [{
      path: 'get_characteristics.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'get_characteristics.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandCharacteristics, buf);
  }

  centralCharacteristicRead(params) {
    let schema = [{
      path: 'read_characteristic.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'read_characteristic.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'read_characteristic.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadCharacteristics, buf);
  }

  centralCharacteristicWrite(params) {
    let schema = [{
      path: 'write_characteristic.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'write_characteristic.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'write_characteristic.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'write_characteristic.needResponse',
      length: 1,
      type: 'char',
      default: 1
    }, { path: 'write_characteristic.data', length: null, type: 'dataArray' }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandWriteCharacteristics, buf);
  }

  centralCharacteristicRegisterNotify(params) {
    let schema = [{
      path: 'register_notify_characteristic.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'register_notify_characteristic.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'register_notify_characteristic.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandRegisterNotifyCharacteristic, buf);
  }

  centralCharacteristicUnregisterNotify(params) {
    let schema = [{
      path: 'unregister_notify_characteristic.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'unregister_notify_characteristic.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'unregister_notify_characteristic.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandUnregisterNotifyCharacteristic, buf);
  }

  centralDescriptorGet(params) {
    let schema = [{
      path: 'get_descriptors.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'get_descriptors.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'get_descriptors.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandDescriptors, buf);
  }

  centralDescriptorRead(params) {
    let schema = [{
      path: 'read_descriptor.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'read_descriptor.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'read_descriptor.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'read_descriptor.descriptor_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadDescriptor, buf);
  }

  centralDescriptorWrite(params) {
    let schema = [{
      path: 'write_descriptor.address',
      length: 6,
      type: 'hex',
      required: true,
      endianness: 'little'
    }, {
      path: 'write_descriptor.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'write_descriptor.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'write_descriptor.descriptor_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'write_descriptor.needResponse',
      length: 1,
      type: 'char',
      default: 1
    }, { path: 'write_descriptor.data', length: null, type: 'dataArray' }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
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
    let val = params['peripheral'];
    let propFlags = {
      0x01: 'broadcast',
      0x02: 'read',
      0x04: 'write_without_response',
      0x08: 'write',
      0x10: 'notify',
      0x20: 'indiate',
      0x40: 'auth',
      0x80: 'ext_prop'
    };

    let permissionFlags = {
      0x001: 'read',
      0x002: 'read_encrypted',
      0x004: 'read_enc_mitm',
      0x010: 'write',
      0x020: 'write_encrypted',
      0x040: 'write_enc_mitm',
      0x080: 'write_signed',
      0x100: 'write_signed_mitm'
    };
    let schema = {
      service: {
        command: this._CommandServerAddService,
        schema: [{ path: 'uuid', length: 18, type: 'uuid', required: true }]
      },
      characteristic: {
        command: this._CommandServerAddCharacteristic,
        schema: [{ path: 'service_uuid', length: 18, type: 'uuid', required: true }, { path: 'uuid', length: 18, type: 'uuid', required: true }, {
          path: 'permissions',
          length: 2,
          type: 'flag',
          default: ['write', 'read'],
          flags: permissionFlags
        }, {
          path: 'properties',
          length: 1,
          type: 'flag',
          default: ['write', 'read'],
          flags: propFlags
        }, { path: 'data', type: 'dataArray' }]
      },
      descriptor: {
        command: this._CommandServerAddDescriptor,
        schema: [{ path: 'service_uuid', length: 18, type: 'uuid', required: true }, {
          path: 'characteristic_uuid',
          length: 18,
          type: 'uuid',
          required: true
        }, { path: 'uuid', length: 18, type: 'uuid', required: true }, {
          path: 'permissions',
          length: 2,
          type: 'flag',
          default: ['write', 'read'],
          flags: permissionFlags
        }, { path: 'data', type: 'dataArray' }]
      },
      startService: {
        command: this._CommandServerStartStopService,
        schema: [{ path: 'uuid', length: 18, type: 'uuid', required: true }, { path: null, length: 1, type: 'char', default: 0 }]
      }
    };

    let sendBufs = [];
    let startServiceBufs = [];
    let buf;
    for (let serviceIndex in val['services']) {
      let service = val['services'][serviceIndex];
      buf = JsonBinaryConverter.createSendBuffer(schema['service'].schema, service);
      if (buf.length === 0) {
        return;
      }
      sendBufs.push({ command: schema['service'].command, buffer: buf });

      buf = JsonBinaryConverter.createSendBuffer(schema['startService'].schema, service);
      startServiceBufs.push({
        command: schema['startService'].command,
        buffer: buf
      });

      for (let charaIndex in service['characteristics']) {
        let chara = service['characteristics'][charaIndex];
        chara.service_uuid = service.uuid;
        buf = JsonBinaryConverter.createSendBuffer(schema['characteristic'].schema, chara);
        if (buf.length === 0) {
          return;
        }
        sendBufs.push({
          command: schema['characteristic'].command,
          buffer: buf
        });

        for (let descIndex in chara['descriptors']) {
          let desc = chara['descriptors'][descIndex];
          desc.service_uuid = service.uuid;
          desc.characteristic_uuid = chara.uuid;
          buf = JsonBinaryConverter.createSendBuffer(schema['descriptor'].schema, desc);
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
      this.sendCommand(startServiceBufs[index].command, startServiceBufs[index].buffer);
    }
  }

  peripheralServiceStop(params) {
    let schema = [{
      path: 'peripheral.stop_service.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, { path: null, length: 1, type: 'char', default: 1 }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerStartStopService, buf);
  }

  peripheralServiceStopAll() {
    this.sendCommand(this._CommandServerStartPeripheral, new Uint8Array([1]));
  }

  peripheralCharacteristicRead(params) {
    let schema = [{
      path: 'peripheral.read_characteristic.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'peripheral.read_characteristic.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadCharavteristicValue, buf);
  }

  peripheralCharacteristicWrite(params) {
    let schema = [{
      path: 'peripheral.write_characteristic.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'peripheral.write_characteristic.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, { path: 'peripheral.write_characteristic.data', type: 'dataArray' }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteCharavteristicValue, buf);
  }

  peripheralCharacteristicNotify(params) {
    let schema = [{
      path: 'peripheral.notify_characteristic.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'peripheral.notify_characteristic.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerNofityCharavteristic, buf);
  }

  peripheralDescriptorRead(params) {
    let schema = [{
      path: 'peripheral.read_descriptor.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'peripheral.read_descriptor.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'peripheral.read_descriptor.descriptor_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadDescriptorValue, buf);
  }

  peripheralDescriptorWrite(params) {
    let schema = [{
      path: 'peripheral.write_descriptor.service_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'peripheral.write_descriptor.characteristic_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, {
      path: 'peripheral.write_descriptor.descriptor_uuid',
      length: 18,
      type: 'uuid',
      required: true
    }, { path: 'peripheral.write_descriptor.data', type: 'dataArray' }];
    let buf = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteDescriptorValue, buf);
  }

  parseFromJson(json) {
    let module = json['ble'];
    if (module === undefined) {
      return;
    }
    let schemaData = [{
      uri: '/request/ble/central/scan_start',
      onValid: this.centralScanStart
    }, { uri: '/request/ble/central/scan_stop', onValid: this.centralScanStop }, { uri: '/request/ble/central/connect', onValid: this.centralConnect }, {
      uri: '/request/ble/central/disconnect',
      onValid: this.centralDisconnect
    }, {
      uri: '/request/ble/central/service_get',
      onValid: this.centralServiceGet
    }, {
      uri: '/request/ble/central/characteristic_get',
      onValid: this.centralCharacteristicGet
    }, {
      uri: '/request/ble/central/characteristic_read',
      onValid: this.centralCharacteristicRead
    }, {
      uri: '/request/ble/central/characteristic_write',
      onValid: this.centralCharacteristicWrite
    }, {
      uri: '/request/ble/central/characteristic_register_notify',
      onValid: this.centralCharacteristicRegisterNotify
    }, {
      uri: '/request/ble/central/characteristic_unregister_notify',
      onValid: this.centralCharacteristicUnregisterNotify
    }, {
      uri: '/request/ble/central/descriptor_get',
      onValid: this.centralDescriptorGet
    }, {
      uri: '/request/ble/central/descriptor_read',
      onValid: this.centralDescriptorRead
    }, {
      uri: '/request/ble/central/descriptor_write',
      onValid: this.centralDescriptorWrite
    }, {
      uri: '/request/ble/peripheral/advertisement_start',
      onValid: this.peripheralAdvertisementStart
    }, {
      uri: '/request/ble/peripheral/advertisement_stop',
      onValid: this.peripheralAdvertisementStop
    }, {
      uri: '/request/ble/peripheral/service_start',
      onValid: this.peripheralServiceStart
    }, {
      uri: '/request/ble/peripheral/service_stop',
      onValid: this.peripheralServiceStop
    }, {
      uri: '/request/ble/peripheral/service_stop_all',
      onValid: this.peripheralServiceStopAll
    }, {
      uri: '/request/ble/peripheral/characteristic_read',
      onValid: this.peripheralCharacteristicRead
    }, {
      uri: '/request/ble/peripheral/characteristic_write',
      onValid: this.peripheralCharacteristicWrite
    }, {
      uri: '/request/ble/peripheral/characteristic_notify',
      onValid: this.peripheralCharacteristicNotify
    }, {
      uri: '/request/ble/peripheral/descriptor_read',
      onValid: this.peripheralDescriptorRead
    }, {
      uri: '/request/ble/peripheral/descriptor_write',
      onValid: this.peripheralDescriptorWrite
    }];
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
    funcList[this._CommandScanResults] = this.notifyFromBinaryScanResponse.bind(this);
    funcList[this._CommandConnect] = this.notifyFromBinaryConnect.bind(this);
    funcList[this._CommandServices] = this.notifyFromBinaryServices.bind(this);
    funcList[this._CommandCharacteristics] = this.notifyFromBinaryChacateristics.bind(this);
    funcList[this._CommandWriteCharacteristics] = this.notifyFromBinaryWriteChacateristics.bind(this);
    funcList[this._CommandReadCharacteristics] = this.notifyFromBinaryReadChacateristics.bind(this);
    funcList[this._CommandRegisterNotifyCharacteristic] = this.notifyFromBinaryRegisterNotifyChacateristic.bind(this);
    funcList[this._CommandUnregisterNotifyCharacteristic] = this.notifyFromBinaryUnregisterNotifyChacateristic.bind(this);
    funcList[this._CommandNotifyCharacteristic] = this.notifyFromBinaryNotifyChacateristic.bind(this);
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
      let schema = [{
        name: 'event_type',
        type: 'enum',
        length: 1,
        enum: this._CommandScanResultsEvet
      }, { name: 'address', type: 'hex', length: 6, endianness: 'little' }, {
        name: 'device_type',
        type: 'enum',
        length: 1,
        enum: this._CommandScanResultsDevice
      }, {
        name: 'address_type',
        type: 'enum',
        length: 1,
        enum: this._CommandScanResultsDeviceAddress
      }, {
        name: 'ble_event_type',
        type: 'enum',
        length: 1,
        enum: this._CommandScanResultsBleEvent
      }, { name: 'rssi', type: 'signed number', length: 4 }, { name: 'adv_data', type: 'dataArray', length: 31 * 2 }, { name: 'flag', type: 'number', length: 4 }, { name: 'num_response', type: 'number', length: 4 }, { name: 'advertise_length', type: 'number', length: 1 }, { name: 'scan_response_length', type: 'number', length: 1 }];

      let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

      results.scan_resp = results.adv_data.slice(results.advertise_length, results.advertise_length + results.scan_response_length);
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
      let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, {
        name: 'status',
        type: 'enum',
        length: 1,
        enum: { connected: 0, disconnected: 1 }
      }];

      let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
      this._addRowForPath(objToSend, 'ble.status_update', results);
    }
  }

  notifyFromBinaryServices(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    if (results.service_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_service_result', results);
    } else {
      delete results.service_uuid;
      this._addRowForPath(objToSend, 'ble.get_service_result_finish', results);
    }
  }

  notifyFromBinaryChacateristics(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, {
      name: 'properties',
      type: 'enum',
      length: 1,
      enum: this._CommandCharacteristicsProperties,
      flags: true
    }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    if (results.characteristic_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_characteristic_result', results);
    } else {
      delete results.characteristic_uuid;
      delete results.properties;
      this._addRowForPath(objToSend, 'ble.get_characteristic_result_finish', results);
    }
  }

  notifyFromBinaryReadChacateristics(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }, { name: 'data', type: 'dataArray', length: null }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.read_characteristic_result', results);
  }

  notifyFromBinaryWriteChacateristics(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.write_characteristic_result', results);
  }

  notifyFromBinaryRegisterNotifyChacateristic(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.register_nofity_characteristic_result', results);
  }

  notifyFromBinaryUnregisterNotifyChacateristic(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.unregister_nofity_characteristic_result', results);
  }
  notifyFromBinaryNotifyChacateristic(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'is_notify', type: 'int', length: 1 }, { name: 'data', type: 'dataArray', length: null }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.is_notify = results.is_notify === 1;
    this._addRowForPath(objToSend, 'ble.nofity_characteristic', results);
  }

  notifyFromBinaryDescriptors(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);

    if (results.descriptor_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_descriptor_result', results);
    } else {
      delete results.descriptor_uuid;
      this._addRowForPath(objToSend, 'ble.get_descriptor_result_finish', results);
    }
  }

  notifyFromBinaryReadDescriptor(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }, { name: 'data', type: 'dataArray', length: null }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.read_descriptor_result', results);
  }

  notifyFromBinaryWriteDescriptor(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.write_descriptor_result', results);
  }

  notifyFromBinaryServerConnectionState(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, {
      name: 'status',
      type: 'enum',
      length: 1,
      enum: { connected: 1, disconnected: 0 }
    }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, 'ble.peripheral.connection_status', results);
  }

  notifyFromBinaryServerWriteCharavteristicValue(objToSend, payload) {
    let schema = [{ name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.peripheral.write_characteristic_result', results);
  }

  notifyFromBinaryServerReadCharavteristicValue(objToSend, payload) {
    let schema = [{ name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'data', type: 'dataArray', length: null }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = 'success'; //always success
    this._addRowForPath(objToSend, 'ble.peripheral.read_characteristic_result', results);
  }

  notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, 'ble.peripheral.notify_read_characteristic', results);
  }

  notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'data', type: 'dataArray', length: null }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, 'ble.peripheral.notify_write_characteristic', results);
  }

  notifyFromBinaryServerReadDescriptorValue(objToSend, payload) {
    let schema = [{ name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }, { name: 'data', type: 'dataArray', length: null }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = 'success'; //always success
    this._addRowForPath(objToSend, 'ble.peripheral.read_descriptor_result', results);
  }

  notifyFromBinaryServerWriteDescriptorValue(objToSend, payload) {
    let schema = [{ name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }, { name: 'result', type: 'int', length: 1 }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    results.result = results.result === this._commandResults['success'] ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.peripheral.write_descriptor_result', results);
  }

  notifyFromBinaryServerNotifyReadDescriptorValue(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, 'ble.peripheral.notify_read_descriptor', results);
  }

  notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend, payload) {
    let schema = [{ name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }, { name: 'data', type: 'dataArray', length: null }];

    let results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, 'ble.peripheral.notify_write_descriptor', results);
  }

  notifyFromBinaryError(objToSend, payload) {
    let schema = [{ name: 'module_error_code', type: 'char', length: 1 }, { name: 'error_code', type: 'char', length: 1 }, { name: 'function_code', type: 'char', length: 1 }, { name: 'address', type: 'hex', length: 6, endianness: 'little' }, { name: 'service_uuid', type: 'uuid', length: this.uuidLength }, { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength }, { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength }];

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
      0xff: 'error'
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
      32: 'on reading descriptor from remote'
    };

    results.message = errorMessage[results.error_code] + ' ' + functionMessage[results.function_code];

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
/*!*****************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_Directive.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");
const ObnizUtil = __webpack_require__(/*! ../utils/util */ "./obniz/libs/utils/util.js");

module.exports = class WSCommand_Directive extends WSCommand {
  constructor(delegate) {
    super(delegate);
    this.module = 1;

    this._CommandRegistrate = 0;
    this._CommandPause = 1;
    this._CommandResume = 2;

    const CommandIO = __webpack_require__(/*! ./WSCommand_IO */ "./obniz/libs/wscommand/WSCommand_IO.js");
    const CommandPWM = __webpack_require__(/*! ./WSCommand_PWM */ "./obniz/libs/wscommand/WSCommand_PWM.js");

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
      for (let commandIndex = 0; commandIndex < parsedCommands.length; commandIndex++) {
        const frame = WSCommand.compress(this.availableCommands, parsedCommands[commandIndex]);
        if (!frame) {
          throw new Error('[io.animation.states.state]only io or pwm commands. Pleave provide state at least one of them.');
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
        throw new Error('[io.animation.states.state]only io or pwm commands. Pleave provide state at least one of them.');
      }
      const length = compressed.byteLength;

      let commandHeader = new Uint8Array(8);
      commandHeader[0] = length >> 8 * 3;
      commandHeader[1] = length >> 8 * 2;
      commandHeader[2] = length >> 8 * 1;
      commandHeader[3] = length;
      commandHeader[4] = duration >> 8 * 3;
      commandHeader[5] = duration >> 8 * 2;
      commandHeader[6] = duration >> 8 * 1;
      commandHeader[7] = duration;

      const combined = new Uint8Array(frame.byteLength + commandHeader.byteLength + compressed.byteLength);
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

    const schemaData = [{ uri: '/request/ioAnimation/init', onValid: this.init }, { uri: '/request/ioAnimation/changeState', onValid: this.changeState }];
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
/*!***************************************************!*\
  !*** ./obniz/libs/wscommand/WSCommand_Display.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WSCommand = __webpack_require__(/*! ./WSCommand_.js */ "./obniz/libs/wscommand/WSCommand_.js");
const qrcode = __webpack_require__(/*! ../utils/qr */ "./obniz/libs/utils/qr.js");

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
    const buf = Buffer.from(text, 'utf8');
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
            vram[parseInt((row + 2) * 16 + (col + 2) / 8)] |= 0x80 >> (col + 2) % 8;
          }
        }
      }
      this.drawHorizonally(vram);
    }
  }

  pinName(params) {
    for (let i = 0; i < 12; i++) {
      if (typeof params.pin_assign[i] === 'object') {
        this.setPinName(i, params.pin_assign[i].module_name || '?', params.pin_assign[i].pin_name || '?');
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

    let schemaData = [{ uri: '/request/display/clear', onValid: this.clear }, { uri: '/request/display/text', onValid: this.text }, { uri: '/request/display/raw', onValid: this.raw }, { uri: '/request/display/pin_assign', onValid: this.pinName }, { uri: '/request/display/qr', onValid: this.qr }];
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
    let mode = 0;
    let sda = parseInt(params.sda);
    let scl = parseInt(params.scl);
    let clock = parseInt(params.clock);

    let buf = new Uint8Array(8);
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
    buf[3] = read_length >> 3 * 8;
    buf[4] = read_length >> 2 * 8;
    buf[5] = read_length >> 1 * 8;
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

      let schemaData = [{ uri: '/request/i2c/init_master', onValid: this.initMaster }, { uri: '/request/i2c/init_slave', onValid: this.initSlave }, { uri: '/request/i2c/write', onValid: this.write }, { uri: '/request/i2c/read', onValid: this.read }, { uri: '/request/i2c/deinit', onValid: this.deinit }];
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
        data: arr
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
        data: arr
      };
    } else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength > 2) {
      // const _esperr = payload[0];
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
const COMMAND_IO_ERRORS_IO_FORCE_RELEASED = 0xf0;

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
    this.sendCommand(params.stream ? this._CommandInputStream : this._CommandInputOnece, buf);
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

      let schemaData = [{ uri: '/request/io/input', onValid: this.input }, { uri: '/request/io/input_detail', onValid: this.inputDetail }, { uri: '/request/io/output', onValid: this.output }, { uri: '/request/io/output_detail', onValid: this.outputDetail }, { uri: '/request/io/output_type', onValid: this.outputType }, { uri: '/request/io/pull_type', onValid: this.pullType }, { uri: '/request/io/deinit', onValid: this.deinit }];
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

      if (err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH || err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW) {
        this.envelopWarning(objToSend, `io${module_index}`, {
          message: COMMAND_IO_ERROR_MESSAGES[err]
        });
      } else if (err === COMMAND_IO_ERRORS_IO_TOO_LOW || err === COMMAND_IO_ERRORS_IO_TOO_HIGH) {
        this.envelopError(objToSend, `io${module_index}`, {
          message: COMMAND_IO_ERROR_MESSAGES[err]
        });
      } else if (err === COMMAND_IO_ERRORS_IO_FORCE_RELEASED && payload.byteLength >= 6) {
        const oldMutexOwner = payload[4];
        const newMutexOwner = payload[5];
        this.envelopWarning(objToSend, 'debug', {
          message: `io${module_index} binded "${COMMAND_IO_MUTEX_NAMES[oldMutexOwner]}" was stopped. "${COMMAND_IO_MUTEX_NAMES[newMutexOwner]}" have started using this io.`
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

    let matchValue = parseInt(params.trigger.value);
    let matchCount = params.trigger.samples;
    let buf = new Uint8Array(12);
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
    let buf = new Uint8Array(0);
    this.sendCommand(this._CommandDeinit, buf);
  }

  parseFromJson(json) {
    let module = json['logic_analyzer'];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: '/request/logicAnalyzer/init', onValid: this.init }, { uri: '/request/logicAnalyzer/deinit', onValid: this.deinit }];
    let res = this.validateCommandSchema(schemaData, module, 'logic_analyzer');

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
      objToSend['logic_analyzer'] = {
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
    buf[3] = triggerWidthUs >> 8 * 3;
    buf[4] = triggerWidthUs >> 8 * 2;
    buf[5] = triggerWidthUs >> 8;
    buf[6] = triggerWidthUs;
    buf[7] = echoIO;
    buf[8] = responseCount;
    buf[9] = timeoutUs >> 8 * 3;
    buf[10] = timeoutUs >> 8 * 2;
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
      objToSend['measure'] = {
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
    for (let i = 0; i < this.ModuleNum; i++) {
      let module = json['pwm' + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [{ uri: '/request/pwm/init', onValid: this.init }, { uri: '/request/pwm/freq', onValid: this.freq }, { uri: '/request/pwm/pulse', onValid: this.pulse }, { uri: '/request/pwm/modulate', onValid: this.amModulate }, { uri: '/request/pwm/deinit', onValid: this.deinit }];
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
    buf[7] = clock >> 3 * 8;
    buf[8] = clock >> 2 * 8;
    buf[9] = clock >> 1 * 8;
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

      let schemaData = [{ uri: '/request/spi/init_master', onValid: this.initMaster }, { uri: '/request/spi/write', onValid: this.write }, { uri: '/request/spi/deinit', onValid: this.deinit }];
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
    if ((func === this._CommandOnece || func === this._CommandNotifyValue) && payload.byteLength == 1) {
      let state = parseInt(payload[0]);
      let states = ['none', 'push', 'left', 'right'];
      objToSend['switch'] = {
        state: states[state]
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
    buf[0] = upper >> 8 * 3;
    buf[1] = upper >> 8 * 2;
    buf[2] = upper >> 8 * 1;
    buf[3] = upper >> 8 * 0;
    buf[4] = lower >> 8 * 3;
    buf[5] = lower >> 8 * 2;
    buf[6] = lower >> 8 * 1;
    buf[7] = lower >> 8 * 0;
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

    let schemaData = [{ uri: '/request/system/reboot', onValid: this.reboot }, { uri: '/request/system/reset', onValid: this.reset }, { uri: '/request/system/wait', onValid: this.wait }, { uri: '/request/system/selfCheck', onValid: this.selfCheck }, {
      uri: '/request/system/keepWorkingAtOffline',
      onValid: this.keepWorkingAtOffline
    }, { uri: '/request/system/ping', onValid: this.ping }];
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
      payload = Buffer.from(payload);
      let obnizTime = payload.readUIntBE(0, 4) * Math.pow(2, 32) + payload.readUIntBE(4, 4);
      let pingServerTime = payload.readUIntBE(8, 4) * Math.pow(2, 32) + payload.readUIntBE(12, 4);
      let key = [];
      for (let i = 16; i < payload.length; i++) {
        key.push(payload[i]);
      }
      objToSend['system'].pong = {
        key,
        obnizTime,
        pingServerTime,
        pongServerTime
      };
    } else {
      objToSend['system'].pong = {
        pongServerTime
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
            message: `Low Voltage ${value}v. connect obniz to more powerful USB.`
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
    let buf = new Uint8Array(13);
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
      let schemaData = [{ uri: '/request/uart/init', onValid: this.init }, { uri: '/request/uart/send', onValid: this.send }, { uri: '/request/uart/deinit', onValid: this.deinit }];
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
        data: arr
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

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

tv4.defineError('UNIQUE_KEYS', 10001, '{uniqueKeys} are must be unique value.');

tv4.defineKeyword('uniqueKeys', function (data, value, schema) {
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
    return {
      code: tv4.errorCodes.UNIQUE_KEYS,
      message: { uniqueKeys: value.join(',') }
    };
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

/* eslint-disable */
WSCommand.addCommandClass('WSCommand_System', __webpack_require__(/*! ./WSCommand_System */ "./obniz/libs/wscommand/WSCommand_System.js"));
WSCommand.addCommandClass('WSCommand_Directive', __webpack_require__(/*! ./WSCommand_Directive */ "./obniz/libs/wscommand/WSCommand_Directive.js"));
WSCommand.addCommandClass('WSCommand_IO', __webpack_require__(/*! ./WSCommand_IO */ "./obniz/libs/wscommand/WSCommand_IO.js"));
WSCommand.addCommandClass('WSCommand_PWM', __webpack_require__(/*! ./WSCommand_PWM */ "./obniz/libs/wscommand/WSCommand_PWM.js"));
WSCommand.addCommandClass('WSCommand_UART', __webpack_require__(/*! ./WSCommand_UART */ "./obniz/libs/wscommand/WSCommand_UART.js"));
WSCommand.addCommandClass('WSCommand_AD', __webpack_require__(/*! ./WSCommand_AD */ "./obniz/libs/wscommand/WSCommand_AD.js"));
WSCommand.addCommandClass('WSCommand_SPI', __webpack_require__(/*! ./WSCommand_SPI */ "./obniz/libs/wscommand/WSCommand_SPI.js"));
WSCommand.addCommandClass('WSCommand_I2C', __webpack_require__(/*! ./WSCommand_I2C */ "./obniz/libs/wscommand/WSCommand_I2C.js"));
WSCommand.addCommandClass('WSCommand_LogicAnalyzer', __webpack_require__(/*! ./WSCommand_LogicAnalyzer */ "./obniz/libs/wscommand/WSCommand_LogicAnalyzer.js"));
WSCommand.addCommandClass('WSCommand_Display', __webpack_require__(/*! ./WSCommand_Display */ "./obniz/libs/wscommand/WSCommand_Display.js"));
WSCommand.addCommandClass('WSCommand_Switch', __webpack_require__(/*! ./WSCommand_Switch */ "./obniz/libs/wscommand/WSCommand_Switch.js"));
WSCommand.addCommandClass('WSCommand_Ble', __webpack_require__(/*! ./WSCommand_Ble */ "./obniz/libs/wscommand/WSCommand_Ble.js"));
WSCommand.addCommandClass('WSCommand_Measurement', __webpack_require__(/*! ./WSCommand_Measurement */ "./obniz/libs/wscommand/WSCommand_Measurement.js"));

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
    let types = {
      hex: this.hexFromBinary.bind(this),
      uuid: this.uuidFromBinary.bind(this),
      number: this.numberFromBinary.bind(this),
      'signed number': this.signedNumberFromBinary.bind(this),
      int: this.numberFromBinary.bind(this),
      char: this.numberFromBinary.bind(this),
      enum: this.enumFromBinary.bind(this),
      dataArray: this.dataArrayFromBinary.bind(this)
    };
    let json = {};
    let count = 0;
    for (let i = 0; i < schema.length; i++) {
      let data = binary.slice(count, schema[i].length ? count + schema[i].length : undefined);
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
    return Object.keys(enumvals).filter(function (k) {
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
            required: true
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
      flag: this.flagToBinary.bind(this)
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
    array[0] = data >> 8 * 3 & 0xff;
    array[1] = data >> 8 * 2 & 0xff;
    array[2] = data >> 8 * 1 & 0xff;
    array[3] = data >> 8 * 0 & 0xff;
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

    array[0] = length >> 8 * 1 & 0xff;
    array[1] = length >> 8 * 0 & 0xff;

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
      array.push(value >> i & 0xff);
    }

    return array;
  }

  static stringToBinary(data) {
    return new Uint8Array(Buffer(data, 'utf8'));
  }
}

module.exports = JsonBinaryConverter;

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, scripts, lint-staged, keywords, repository, author, homepage, license, devDependencies, dependencies, bugs, private, browser, default */
/***/ (function(module) {

module.exports = {"name":"obniz","version":"1.13.1","description":"obniz sdk for javascript","main":"index.js","scripts":{"test":"nyc --reporter=text --reporter=html mocha $NODE_DEBUG_OPTION  ./test/index.js","buildAndtest":"npm run build && npm test","realtest":"mocha $NODE_DEBUG_OPTION -b ./realtest/index.js","local":"gulp --gulpfile ./_tools/server.js --cwd .","build":"npm run lint && gulp $NODE_DEBUG_OPTION --gulpfile ./_tools/server.js --cwd . build","version":"npm run build && git add obniz.js && git add obniz.min.js && git add obniz.node6_10.js","lint":"eslint --fix . --rulesdir eslint/rule","precommit":"lint-staged"},"lint-staged":{"*.js":["eslint --rulesdir eslint/rule --fix ","git add"]},"keywords":["obniz"],"repository":"obniz/obniz","author":"yukisato <yuki@yuki-sato.com>","homepage":"https://obniz.io/","license":"SEE LICENSE IN LICENSE.txt","devDependencies":{"babel-cli":"^6.26.0","babel-core":"^6.26.3","babel-loader":"^7.1.5","babel-polyfill":"^6.26.0","babel-preset-env":"^1.7.0","babel-preset-es2015":"^6.24.1","babel-preset-stage-3":"^6.24.1","chai":"^4.2.0","chai-like":"^1.1.1","child_process":"^1.0.2","chokidar":"^2.0.4","concat-with-sourcemaps":"^1.1.0","ejs":"^2.6.1","eslint":"^5.7.0","eslint-config-prettier":"^3.1.0","eslint-plugin-jasmine":"^2.10.1","eslint-plugin-prettier":"^2.7.0","express":"^4.16.4","get-port":"^4.0.0","glob":"^7.1.3","gulp":"^3.9.1","gulp-babel":"^8.0.0","gulp-concat":"^2.6.1","gulp-ejs":"^3.2.0","gulp-filter":"^5.1.0","gulp-notify":"^3.2.0","gulp-plumber":"^1.2.0","gulp-sort":"^2.0.0","gulp-util":"^3.0.8","gulp-yaml":"^2.0.2","husky":"^0.14.3","json-loader":"^0.5.7","lint-staged":"^7.3.0","mocha":"^5.2.0","mocha-chrome":"^1.1.0","mocha-directory":"^2.3.0","mocha-sinon":"^2.1.0","natives":"^1.1.6","ncp":"^2.0.0","node-notifier":"^5.3.0","nyc":"^12.0.2","path":"^0.12.7","prettier":"^1.14.3","sinon":"^6.3.5","svg-to-png":"^3.1.2","through2":"^2.0.3","uglifyjs-webpack-plugin":"^1.3.0","vinyl":"^2.2.0","webpack":"^4.20.2","webpack-cli":"^3.1.2","webpack-node-externals":"^1.7.2","webpack-stream":"^5.1.1","yaml-loader":"^0.5.0"},"dependencies":{"eventemitter3":"^3.1.0","js-yaml":"^3.12.0","node-dir":"^0.1.17","node-fetch":"^2.2.0","semver":"^5.6.0","tv4":"^1.3.0","ws":"^6.1.0"},"bugs":{"url":"https://github.com/obniz/obniz/issues"},"private":false,"browser":{"ws":"./obniz/libs/webpackReplace/ws.js","canvas":"./obniz/libs/webpackReplace/canvas.js","./obniz/libs/webpackReplace/require-context.js":"./obniz/libs/webpackReplace/require-context-browser.js"}};

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
	"./AudioSensor/AE_MICAMP/index.js": "./parts/AudioSensor/AE_MICAMP/index.js",
	"./Camera/ArduCAMMini/index.js": "./parts/Camera/ArduCAMMini/index.js",
	"./Camera/JpegSerialCam/index.js": "./parts/Camera/JpegSerialCam/index.js",
	"./ColorSensor/S11059/index.js": "./parts/ColorSensor/S11059/index.js",
	"./CompassSensor/HMC5883L/index.js": "./parts/CompassSensor/HMC5883L/index.js",
	"./Display/7SegmentLED/index.js": "./parts/Display/7SegmentLED/index.js",
	"./Display/7SegmentLEDArray/index.js": "./parts/Display/7SegmentLEDArray/index.js",
	"./Display/7SegmentLED_MAX7219/index.js": "./parts/Display/7SegmentLED_MAX7219/index.js",
	"./Display/MatrixLED_MAX7219/index.js": "./parts/Display/MatrixLED_MAX7219/index.js",
	"./Display/SainSmartTFT18LCD/index.js": "./parts/Display/SainSmartTFT18LCD/index.js",
	"./Display/SharpMemoryTFT/index.js": "./parts/Display/SharpMemoryTFT/index.js",
	"./DistanceSensor/GP2Y0A21YK0F/index.js": "./parts/DistanceSensor/GP2Y0A21YK0F/index.js",
	"./DistanceSensor/HC-SR04/index.js": "./parts/DistanceSensor/HC-SR04/index.js",
	"./GPS/GYSFDMAXB/index.js": "./parts/GPS/GYSFDMAXB/index.js",
	"./Grove/Grove_EarHeartRate/index.js": "./parts/Grove/Grove_EarHeartRate/index.js",
	"./Grove/Grove_MP3/index.js": "./parts/Grove/Grove_MP3/index.js",
	"./GyroSensor/ENC03R_Module/index.js": "./parts/GyroSensor/ENC03R_Module/index.js",
	"./Infrared/IRModule/index.js": "./parts/Infrared/IRModule/index.js",
	"./Infrared/IRSensor/index.js": "./parts/Infrared/IRSensor/index.js",
	"./Infrared/InfraredLED/index.js": "./parts/Infrared/InfraredLED/index.js",
	"./Light/FullColorLED/index.js": "./parts/Light/FullColorLED/index.js",
	"./Light/LED/index.js": "./parts/Light/LED/index.js",
	"./Light/WS2811/index.js": "./parts/Light/WS2811/index.js",
	"./Light/WS2812/index.js": "./parts/Light/WS2812/index.js",
	"./Light/WS2812B/index.js": "./parts/Light/WS2812B/index.js",
	"./Logic/SNx4HC595/index.js": "./parts/Logic/SNx4HC595/index.js",
	"./Memory/24LC256/index.js": "./parts/Memory/24LC256/index.js",
	"./MovementSensor/Button/index.js": "./parts/MovementSensor/Button/index.js",
	"./MovementSensor/FlickHat/index.js": "./parts/MovementSensor/FlickHat/index.js",
	"./MovementSensor/HC-SR505/index.js": "./parts/MovementSensor/HC-SR505/index.js",
	"./MovementSensor/JoyStick/index.js": "./parts/MovementSensor/JoyStick/index.js",
	"./MovementSensor/KXR94-2050/index.js": "./parts/MovementSensor/KXR94-2050/index.js",
	"./MovementSensor/KXSC7-2050/index.js": "./parts/MovementSensor/KXSC7-2050/index.js",
	"./MovementSensor/PaPIRsVZ/index.js": "./parts/MovementSensor/PaPIRsVZ/index.js",
	"./MovementSensor/Potentiometer/index.js": "./parts/MovementSensor/Potentiometer/index.js",
	"./Moving/DCMotor/index.js": "./parts/Moving/DCMotor/index.js",
	"./Moving/PCA9685/index.js": "./parts/Moving/PCA9685/index.js",
	"./Moving/ServoMotor/index.js": "./parts/Moving/ServoMotor/index.js",
	"./Moving/Solenoid/index.js": "./parts/Moving/Solenoid/index.js",
	"./PressureSensor/FSR-40X/index.js": "./parts/PressureSensor/FSR-40X/index.js",
	"./SoilSensor/SEN0114/index.js": "./parts/SoilSensor/SEN0114/index.js",
	"./Sound/Speaker/index.js": "./parts/Sound/Speaker/index.js",
	"./TemperatureSensor/analog/AnalogTempratureSensor.js": "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js",
	"./TemperatureSensor/analog/LM35DZ/index.js": "./parts/TemperatureSensor/analog/LM35DZ/index.js",
	"./TemperatureSensor/analog/LM60/index.js": "./parts/TemperatureSensor/analog/LM60/index.js",
	"./TemperatureSensor/analog/LM61/index.js": "./parts/TemperatureSensor/analog/LM61/index.js",
	"./TemperatureSensor/analog/LMT87/index.js": "./parts/TemperatureSensor/analog/LMT87/index.js",
	"./TemperatureSensor/analog/MCP9700/index.js": "./parts/TemperatureSensor/analog/MCP9700/index.js",
	"./TemperatureSensor/analog/MCP9701/index.js": "./parts/TemperatureSensor/analog/MCP9701/index.js",
	"./TemperatureSensor/analog/S8100B/index.js": "./parts/TemperatureSensor/analog/S8100B/index.js",
	"./TemperatureSensor/analog/S8120C/index.js": "./parts/TemperatureSensor/analog/S8120C/index.js",
	"./TemperatureSensor/i2c/ADT7410/index.js": "./parts/TemperatureSensor/i2c/ADT7410/index.js",
	"./TemperatureSensor/i2c/AMG8833/index.js": "./parts/TemperatureSensor/i2c/AMG8833/index.js",
	"./TemperatureSensor/i2c/BME280/index.js": "./parts/TemperatureSensor/i2c/BME280/index.js",
	"./TemperatureSensor/i2c/S-5851A/index.js": "./parts/TemperatureSensor/i2c/S-5851A/index.js",
	"./TemperatureSensor/i2c/SHT31/index.js": "./parts/TemperatureSensor/i2c/SHT31/index.js",
	"./TemperatureSensor/spi/ADT7310/index.js": "./parts/TemperatureSensor/spi/ADT7310/index.js",
	"./Wireless/RN42/index.js": "./parts/Wireless/RN42/index.js",
	"./Wireless/XBee/index.js": "./parts/Wireless/XBee/index.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
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
    this.keys = ['vcc', 'gnd', 'sck', 'dout'];
    this.requiredKeys = ['sck', 'dout'];
    this.offset = 0;
    this.scale = 1;
  }

  static info() {
    return {
      name: 'hx711'
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

  readWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.sck.output(false);

      // while(true) {
      //   let val = await this.dout.inputWait();
      //   if (val == false) break;
      // }
      _this.spi.start({
        mode: 'master',
        clk: _this.params.sck,
        miso: _this.params.dout,
        frequency: 66 * 1000
      });

      let ret = yield _this.spi.writeWait([0, 0, 0]);
      _this.spi.end(true);
      _this.sck.output(false);
      let flag = (ret[0] & 0x80) === 0 ? 1 : -1;
      return flag * (((ret[0] & 0x7f) << 16) + (ret[1] << 8) + (ret[2] << 0));
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

if (true) {
  module.exports = hx711;
}

/***/ }),

/***/ "./parts/Accessory/USB/index.js":
/*!**************************************!*\
  !*** ./parts/Accessory/USB/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class USB {
  constructor() {
    this.keys = ['vcc', 'gnd'];
    this.requiredKeys = ['vcc', 'gnd'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd'
    };
  }

  static info() {
    return {
      name: 'USB'
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
/*!**********************************************!*\
  !*** ./parts/AudioSensor/AE_MICAMP/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class AE_MICAMP {
  constructor() {
    this.keys = ['vcc', 'gnd', 'out'];
    this.requiredKeys = ['out'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      out: 'out'
    };
  }

  static info() {
    return {
      name: 'AE_MICAMP'
    };
  }

  wired(obniz) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.obniz = obniz;

      _this.ad = obniz.getAD(_this.params.out);

      obniz.setVccGnd(_this.params.vcc, _this.params.gnd, '5v');

      let self = _this;
      _this.ad.start(function (value) {
        self.voltage = value;
        if (self.onchange) {
          self.onchange(self.voltage);
        }
      });
    })();
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

/***/ "./parts/Camera/ArduCAMMini/index.js":
/*!*******************************************!*\
  !*** ./parts/Camera/ArduCAMMini/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ArduCAMMini {
  constructor() {
    this.keys = ['cs', 'mosi', 'miso', 'sclk', 'gnd', 'vcc', 'sda', 'scl', 'spi', 'i2c'];
    this.requiredKeys = ['cs'];

    this.ioKeys = this.keys;
    this.displayName = 'Cam';

    this.regs = {
      ARDUCHIP_TEST1: 0x00,
      ARDUCHIP_MODE: 0x02,
      ARDUCHIP_FIFO: 0x04,
      BURST_FIFO_READ: 0x3c,
      ARDUCHIP_TRIG: 0x41,
      FIFO_SIZE1: 0x42,
      FIFO_SIZE2: 0x43,
      FIFO_SIZE3: 0x44
    };

    this.configs = {
      OV2640_JPEG_INIT: [[0xff, 0x00], [0x2c, 0xff], [0x2e, 0xdf], [0xff, 0x01], [0x3c, 0x32], [0x11, 0x04], [0x09, 0x02], [0x04, 0x28], [0x13, 0xe5], [0x14, 0x48], [0x2c, 0x0c], [0x33, 0x78], [0x3a, 0x33], [0x3b, 0xfb], [0x3e, 0x00], [0x43, 0x11], [0x16, 0x10], [0x39, 0x92], [0x35, 0xda], [0x22, 0x1a], [0x37, 0xc3], [0x23, 0x00], [0x34, 0xc0], [0x36, 0x1a], [0x06, 0x88], [0x07, 0xc0], [0x0d, 0x87], [0x0e, 0x41], [0x4c, 0x00], [0x48, 0x00], [0x5b, 0x00], [0x42, 0x03], [0x4a, 0x81], [0x21, 0x99], [0x24, 0x40], [0x25, 0x38], [0x26, 0x82], [0x5c, 0x00], [0x63, 0x00], [0x61, 0x70], [0x62, 0x80], [0x7c, 0x05], [0x20, 0x80], [0x28, 0x30], [0x6c, 0x00], [0x6d, 0x80], [0x6e, 0x00], [0x70, 0x02], [0x71, 0x94], [0x73, 0xc1], [0x12, 0x40], [0x17, 0x11], [0x18, 0x43], [0x19, 0x00], [0x1a, 0x4b], [0x32, 0x09], [0x37, 0xc0], [0x4f, 0x60], [0x50, 0xa8], [0x6d, 0x00], [0x3d, 0x38], [0x46, 0x3f], [0x4f, 0x60], [0x0c, 0x3c], [0xff, 0x00], [0xe5, 0x7f], [0xf9, 0xc0], [0x41, 0x24], [0xe0, 0x14], [0x76, 0xff], [0x33, 0xa0], [0x42, 0x20], [0x43, 0x18], [0x4c, 0x00], [0x87, 0xd5], [0x88, 0x3f], [0xd7, 0x03], [0xd9, 0x10], [0xd3, 0x82], [0xc8, 0x08], [0xc9, 0x80], [0x7c, 0x00], [0x7d, 0x00], [0x7c, 0x03], [0x7d, 0x48], [0x7d, 0x48], [0x7c, 0x08], [0x7d, 0x20], [0x7d, 0x10], [0x7d, 0x0e], [0x90, 0x00], [0x91, 0x0e], [0x91, 0x1a], [0x91, 0x31], [0x91, 0x5a], [0x91, 0x69], [0x91, 0x75], [0x91, 0x7e], [0x91, 0x88], [0x91, 0x8f], [0x91, 0x96], [0x91, 0xa3], [0x91, 0xaf], [0x91, 0xc4], [0x91, 0xd7], [0x91, 0xe8], [0x91, 0x20], [0x92, 0x00], [0x93, 0x06], [0x93, 0xe3], [0x93, 0x05], [0x93, 0x05], [0x93, 0x00], [0x93, 0x04], [0x93, 0x00], [0x93, 0x00], [0x93, 0x00], [0x93, 0x00], [0x93, 0x00], [0x93, 0x00], [0x93, 0x00], [0x96, 0x00], [0x97, 0x08], [0x97, 0x19], [0x97, 0x02], [0x97, 0x0c], [0x97, 0x24], [0x97, 0x30], [0x97, 0x28], [0x97, 0x26], [0x97, 0x02], [0x97, 0x98], [0x97, 0x80], [0x97, 0x00], [0x97, 0x00], [0xc3, 0xed], [0xa4, 0x00], [0xa8, 0x00], [0xc5, 0x11], [0xc6, 0x51], [0xbf, 0x80], [0xc7, 0x10], [0xb6, 0x66], [0xb8, 0xa5], [0xb7, 0x64], [0xb9, 0x7c], [0xb3, 0xaf], [0xb4, 0x97], [0xb5, 0xff], [0xb0, 0xc5], [0xb1, 0x94], [0xb2, 0x0f], [0xc4, 0x5c], [0xc0, 0x64], [0xc1, 0x4b], [0x8c, 0x00], [0x86, 0x3d], [0x50, 0x00], [0x51, 0xc8], [0x52, 0x96], [0x53, 0x00], [0x54, 0x00], [0x55, 0x00], [0x5a, 0xc8], [0x5b, 0x96], [0x5c, 0x00], [0xd3, 0x00], //[ 0xd3, 0x7f ],
      [0xc3, 0xed], [0x7f, 0x00], [0xda, 0x00], [0xe5, 0x1f], [0xe1, 0x67], [0xe0, 0x00], [0xdd, 0x7f], [0x05, 0x00],
      //
      [0x12, 0x40], [0xd3, 0x04], //[ 0xd3, 0x7f ],
      [0xc0, 0x16], [0xc1, 0x12], [0x8c, 0x00], [0x86, 0x3d], [0x50, 0x00], [0x51, 0x2c], [0x52, 0x24], [0x53, 0x00], [0x54, 0x00], [0x55, 0x00], [0x5a, 0x2c], [0x5b, 0x24], [0x5c, 0x00], [0xff, 0xff]],

      OV2640_YUV422: [[0xff, 0x00], [0x05, 0x00], [0xda, 0x10], [0xd7, 0x03], [0xdf, 0x00], [0x33, 0x80], [0x3c, 0x40], [0xe1, 0x77], [0x00, 0x00], [0xff, 0xff]],

      OV2640_JPEG: [[0xe0, 0x14], [0xe1, 0x77], [0xe5, 0x1f], [0xd7, 0x03], [0xda, 0x10], [0xe0, 0x00], [0xff, 0x01], [0x04, 0x08], [0xff, 0xff]],

      OV2640_160x120_JPEG: [[0xff, 0x01], [0x12, 0x40], [0x17, 0x11], [0x18, 0x43], [0x19, 0x00], [0x1a, 0x4b], [0x32, 0x09], [0x4f, 0xca], [0x50, 0xa8], [0x5a, 0x23], [0x6d, 0x00], [0x39, 0x12], [0x35, 0xda], [0x22, 0x1a], [0x37, 0xc3], [0x23, 0x00], [0x34, 0xc0], [0x36, 0x1a], [0x06, 0x88], [0x07, 0xc0], [0x0d, 0x87], [0x0e, 0x41], [0x4c, 0x00], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0x64], [0xc1, 0x4b], [0x86, 0x35], [0x50, 0x92], [0x51, 0xc8], [0x52, 0x96], [0x53, 0x00], [0x54, 0x00], [0x55, 0x00], [0x57, 0x00], [0x5a, 0x28], [0x5b, 0x1e], [0x5c, 0x00], [0xe0, 0x00], [0xff, 0xff]],

      OV2640_176x144_JPEG: [[0xff, 0x01], [0x12, 0x40], [0x17, 0x11], [0x18, 0x43], [0x19, 0x00], [0x1a, 0x4b], [0x32, 0x09], [0x4f, 0xca], [0x50, 0xa8], [0x5a, 0x23], [0x6d, 0x00], [0x39, 0x12], [0x35, 0xda], [0x22, 0x1a], [0x37, 0xc3], [0x23, 0x00], [0x34, 0xc0], [0x36, 0x1a], [0x06, 0x88], [0x07, 0xc0], [0x0d, 0x87], [0x0e, 0x41], [0x4c, 0x00], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0x64], [0xc1, 0x4b], [0x86, 0x35], [0x50, 0x92], [0x51, 0xc8], [0x52, 0x96], [0x53, 0x00], [0x54, 0x00], [0x55, 0x00], [0x57, 0x00], [0x5a, 0x2c], [0x5b, 0x24], [0x5c, 0x00], [0xe0, 0x00], [0xff, 0xff]],

      OV2640_320x240_JPEG: [[0xff, 0x01], [0x12, 0x40], [0x17, 0x11], [0x18, 0x43], [0x19, 0x00], [0x1a, 0x4b], [0x32, 0x09], [0x4f, 0xca], [0x50, 0xa8], [0x5a, 0x23], [0x6d, 0x00], [0x39, 0x12], [0x35, 0xda], [0x22, 0x1a], [0x37, 0xc3], [0x23, 0x00], [0x34, 0xc0], [0x36, 0x1a], [0x06, 0x88], [0x07, 0xc0], [0x0d, 0x87], [0x0e, 0x41], [0x4c, 0x00], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0x64], [0xc1, 0x4b], [0x86, 0x35], [0x50, 0x89], [0x51, 0xc8], [0x52, 0x96], [0x53, 0x00], [0x54, 0x00], [0x55, 0x00], [0x57, 0x00], [0x5a, 0x50], [0x5b, 0x3c], [0x5c, 0x00], [0xe0, 0x00], [0xff, 0xff]],

      OV2640_352x288_JPEG: [[0xff, 0x01], [0x12, 0x40], [0x17, 0x11], [0x18, 0x43], [0x19, 0x00], [0x1a, 0x4b], [0x32, 0x09], [0x4f, 0xca], [0x50, 0xa8], [0x5a, 0x23], [0x6d, 0x00], [0x39, 0x12], [0x35, 0xda], [0x22, 0x1a], [0x37, 0xc3], [0x23, 0x00], [0x34, 0xc0], [0x36, 0x1a], [0x06, 0x88], [0x07, 0xc0], [0x0d, 0x87], [0x0e, 0x41], [0x4c, 0x00], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0x64], [0xc1, 0x4b], [0x86, 0x35], [0x50, 0x89], [0x51, 0xc8], [0x52, 0x96], [0x53, 0x00], [0x54, 0x00], [0x55, 0x00], [0x57, 0x00], [0x5a, 0x58], [0x5b, 0x48], [0x5c, 0x00], [0xe0, 0x00], [0xff, 0xff]],

      OV2640_640x480_JPEG: [[0xff, 0x01], [0x11, 0x01], [0x12, 0x00], // Bit[6:4]: Resolution selection//
      [0x17, 0x11], // HREFST[10:3]
      [0x18, 0x75], // HREFEND[10:3]
      [0x32, 0x36], // Bit[5:3]: HREFEND[2:0]; Bit[2:0]: HREFST[2:0]
      [0x19, 0x01], // VSTRT[9:2]
      [0x1a, 0x97], // VEND[9:2]
      [0x03, 0x0f], // Bit[3:2]: VEND[1:0]; Bit[1:0]: VSTRT[1:0]
      [0x37, 0x40], [0x4f, 0xbb], [0x50, 0x9c], [0x5a, 0x57], [0x6d, 0x80], [0x3d, 0x34], [0x39, 0x02], [0x35, 0x88], [0x22, 0x0a], [0x37, 0x40], [0x34, 0xa0], [0x06, 0x02], [0x0d, 0xb7], [0x0e, 0x01], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0xc8], [0xc1, 0x96], [0x86, 0x3d], [0x50, 0x89], [0x51, 0x90], [0x52, 0x2c], [0x53, 0x00], [0x54, 0x00], [0x55, 0x88], [0x57, 0x00], [0x5a, 0xa0], [0x5b, 0x78], [0x5c, 0x00], [0xd3, 0x04], [0xe0, 0x00], [0xff, 0xff]],

      OV2640_800x600_JPEG: [[0xff, 0x01], [0x11, 0x01], [0x12, 0x00], // Bit[6:4]: Resolution selection
      [0x17, 0x11], // HREFST[10:3]
      [0x18, 0x75], // HREFEND[10:3]
      [0x32, 0x36], // Bit[5:3]: HREFEND[2:0]; Bit[2:0]: HREFST[2:0]
      [0x19, 0x01], // VSTRT[9:2]
      [0x1a, 0x97], // VEND[9:2]
      [0x03, 0x0f], // Bit[3:2]: VEND[1:0]; Bit[1:0]: VSTRT[1:0]
      [0x37, 0x40], [0x4f, 0xbb], [0x50, 0x9c], [0x5a, 0x57], [0x6d, 0x80], [0x3d, 0x34], [0x39, 0x02], [0x35, 0x88], [0x22, 0x0a], [0x37, 0x40], [0x34, 0xa0], [0x06, 0x02], [0x0d, 0xb7], [0x0e, 0x01], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0xc8], [0xc1, 0x96], [0x86, 0x35], [0x50, 0x89], [0x51, 0x90], [0x52, 0x2c], [0x53, 0x00], [0x54, 0x00], [0x55, 0x88], [0x57, 0x00], [0x5a, 0xc8], [0x5b, 0x96], [0x5c, 0x00], [0xd3, 0x02], [0xe0, 0x00], [0xff, 0xff]],

      OV2640_1024x768_JPEG: [[0xff, 0x01], [0x11, 0x01], [0x12, 0x00], // Bit[6:4]: Resolution selection//0x02
      [0x17, 0x11], // HREFST[10:3]
      [0x18, 0x75], // HREFEND[10:3]
      [0x32, 0x36], // Bit[5:3]: HREFEND[2:0]; Bit[2:0]: HREFST[2:0]
      [0x19, 0x01], // VSTRT[9:2]
      [0x1a, 0x97], // VEND[9:2]
      [0x03, 0x0f], // Bit[3:2]: VEND[1:0]; Bit[1:0]: VSTRT[1:0]
      [0x37, 0x40], [0x4f, 0xbb], [0x50, 0x9c], [0x5a, 0x57], [0x6d, 0x80], [0x3d, 0x34], [0x39, 0x02], [0x35, 0x88], [0x22, 0x0a], [0x37, 0x40], [0x34, 0xa0], [0x06, 0x02], [0x0d, 0xb7], [0x0e, 0x01], [0xff, 0x00], [0xc0, 0xc8], [0xc1, 0x96], [0x8c, 0x00], [0x86, 0x3d], [0x50, 0x00], [0x51, 0x90], [0x52, 0x2c], [0x53, 0x00], [0x54, 0x00], [0x55, 0x88], [0x5a, 0x00], [0x5b, 0xc0], [0x5c, 0x01], [0xd3, 0x02], [0xff, 0xff]],

      OV2640_1280x960_JPEG: [[0xff, 0x01], [0x11, 0x01], [0x12, 0x00], // Bit[6:4]: Resolution selection//0x02
      [0x17, 0x11], // HREFST[10:3]
      [0x18, 0x75], // HREFEND[10:3]
      [0x32, 0x36], // Bit[5:3]: HREFEND[2:0]; Bit[2:0]: HREFST[2:0]
      [0x19, 0x01], // VSTRT[9:2]
      [0x1a, 0x97], // VEND[9:2]
      [0x03, 0x0f], // Bit[3:2]: VEND[1:0]; Bit[1:0]: VSTRT[1:0]
      [0x37, 0x40], [0x4f, 0xbb], [0x50, 0x9c], [0x5a, 0x57], [0x6d, 0x80], [0x3d, 0x34], [0x39, 0x02], [0x35, 0x88], [0x22, 0x0a], [0x37, 0x40], [0x34, 0xa0], [0x06, 0x02], [0x0d, 0xb7], [0x0e, 0x01], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0xc8], [0xc1, 0x96], [0x86, 0x3d], [0x50, 0x00], [0x51, 0x90], [0x52, 0x2c], [0x53, 0x00], [0x54, 0x00], [0x55, 0x88], [0x57, 0x00], [0x5a, 0x40], [0x5b, 0xf0], [0x5c, 0x01], [0xd3, 0x02], [0xe0, 0x00], [0xff, 0xff]],

      OV2640_1600x1200_JPEG: [[0xff, 0x01], [0x11, 0x01], [0x12, 0x00], // Bit[6:4]: Resolution selection//0x02
      [0x17, 0x11], // HREFST[10:3]
      [0x18, 0x75], // HREFEND[10:3]
      [0x32, 0x36], // Bit[5:3]: HREFEND[2:0]; Bit[2:0]: HREFST[2:0]
      [0x19, 0x01], // VSTRT[9:2]
      [0x1a, 0x97], // VEND[9:2]
      [0x03, 0x0f], // Bit[3:2]: VEND[1:0]; Bit[1:0]: VSTRT[1:0]
      [0x37, 0x40], [0x4f, 0xbb], [0x50, 0x9c], [0x5a, 0x57], [0x6d, 0x80], [0x3d, 0x34], [0x39, 0x02], [0x35, 0x88], [0x22, 0x0a], [0x37, 0x40], [0x34, 0xa0], [0x06, 0x02], [0x0d, 0xb7], [0x0e, 0x01], [0xff, 0x00], [0xe0, 0x04], [0xc0, 0xc8], [0xc1, 0x96], [0x86, 0x3d], [0x50, 0x00], [0x51, 0x90], [0x52, 0x2c], [0x53, 0x00], [0x54, 0x00], [0x55, 0x88], [0x57, 0x00], [0x5a, 0x90], [0x5b, 0x2c], [0x5c, 0x05], //bit2->1;bit[1:0]->1
      [0xd3, 0x02], [0xe0, 0x00], [0xff, 0xff]]
    };
  }

  static info() {
    return {
      name: 'ArduCAMMini'
    };
  }

  wired(obniz) {
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.io_cs = obniz.getIO(this.params.cs);
    this.io_cs.output(true);

    obniz.wait(100);

    this.sensor_addr = 0x30; // i2c

    this.params.mode = this.params.mode || 'master';
    this.params.drive = '3v';
    this.params.frequency = this.params.frequency || 4 * 1000 * 1000;
    this.params.clk = this.params.sclk;
    this.spi = this.obniz.getSpiWithConfig(this.params);

    this.params.sda = this.params.sda;
    this.params.scl = this.params.scl;
    this.params.clock = this.params.clock || 100 * 1000;
    this.params.mode = 'master';
    this.params.pull = '5v';
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  spi_write(addr, byteData) {
    let data = [];
    data.push(addr);
    data.push(byteData);
    this.io_cs.output(false);
    this.spi.write(data);
    this.io_cs.output(true);
  }

  spi_readWait(addr) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = [];
      data.push(addr);
      data.push(0x00);
      _this.io_cs.output(false);
      const recv = yield _this.spi.writeWait(data);
      _this.io_cs.output(true);
      return recv[1];
    })();
  }

  i2c_byte_write(addr, byteData) {
    this.i2c.write(this.sensor_addr, [addr, byteData]);
  }

  i2c_regs_write(regs) {
    for (let i = 0; i < regs.length; i++) {
      this.i2c.write(this.sensor_addr, regs[i]);
    }
  }

  spi_write_reg(addr, byteData) {
    this.spi_write(addr | 0x80, byteData);
  }

  spi_read_regWait(addr) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return yield _this2.spi_readWait(addr & 0x7f);
    })();
  }

  spi_pingpongWait() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const testVal = 0x55;
      _this3.spi_write_reg(_this3.regs.ARDUCHIP_TEST1, testVal);
      const val = yield _this3.spi_read_regWait(_this3.regs.ARDUCHIP_TEST1);
      if (val !== testVal) {
        throw new Error('spi bus fail');
      }
    })();
  }

  setMode(mode) {
    const modes = {
      MCU2LCD: 0x00,
      CAM2LCD: 0x01,
      LCD2MCU: 0x02
    };
    if (typeof modes[mode] !== 'number') {
      throw new Error('unknown mode. options are ' + modes);
    }
    this.spi_write_reg(this.regs.ARDUCHIP_MODE, modes[mode]);
  }

  getChipIdWait() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      _this4.i2c.write(_this4.sensor_addr, [0x0a]);
      const val0 = yield _this4.i2c.readWait(_this4.sensor_addr, 1);
      _this4.i2c.write(_this4.sensor_addr, [0x0b]);
      const val1 = yield _this4.i2c.readWait(_this4.sensor_addr, 1);
      return (val0[0] << 8) + val1[0];
    })();
  }

  init() {
    this.i2c_byte_write(0xff, 0x01);
    this.i2c_byte_write(0x12, 0x80);
    this.obniz.wait(100);

    this.i2c_regs_write(this.configs.OV2640_JPEG_INIT);
    this.i2c_regs_write(this.configs.OV2640_YUV422);
    this.i2c_regs_write(this.configs.OV2640_JPEG);
    this.i2c_byte_write(0xff, 0x01);
    this.i2c_byte_write(0x15, 0x00);
    this.setSize('320x240');
  }

  startupWait() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      yield _this5.spi_pingpongWait();
      _this5.setMode('MCU2LCD');
      const chipid = yield _this5.getChipIdWait();
      if (chipid != 0x2642) {
        throw new Error('unknown chip ' + chipid);
      }
      _this5.init();
    })();
  }

  takeWait(size) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (typeof size === 'string' && _this6._size !== size) {
        _this6.setSize(size);
        _this6.obniz.wait(1000);
      }

      _this6.flushFIFO();
      _this6.flushFIFO();
      _this6.startCapture();
      while (true) {
        if (yield _this6.isCaptureDoneWait()) {
          break;
        }
      }
      return yield _this6.readFIFOWait();
    })();
  }

  setSize(string) {
    if (this._size === string) {
      return;
    }
    const map = {
      '160x120': this.configs.OV2640_160x120_JPEG,
      '176x144': this.configs.OV2640_176x144_JPEG,
      '320x240': this.configs.OV2640_320x240_JPEG,
      '352x288': this.configs.OV2640_352x288_JPEG,
      '640x480': this.configs.OV2640_640x480_JPEG,
      '800x600': this.configs.OV2640_800x600_JPEG,
      '1024x768': this.configs.OV2640_1024x768_JPEG,
      '1280x960': this.configs.OV2640_1280x960_JPEG,
      '1600x1200': this.configs.OV2640_1600x1200_JPEG
    };
    if (map[string]) {
      this._size = string;
      this.i2c_regs_write(map[string]);
    } else {
      throw new Error('unsupported size options are ' + Object.keys(map));
    }
  }

  updateFIFO(data) {
    //  FIFO_CLEAR_MASK    		0x01
    //  FIFO_START_MASK    		0x02
    //  FIFO_RDPTR_RST_MASK     0x10
    //  FIFO_WRPTR_RST_MASK     0x20
    this.spi_write_reg(this.regs.ARDUCHIP_FIFO, data);
  }

  flushFIFO() {
    this.spi_write_reg(this.regs.ARDUCHIP_FIFO, 0x01);
  }

  readFIFOLengthWait() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const len1 = yield _this7.spi_read_regWait(_this7.regs.FIFO_SIZE1);
      const len2 = yield _this7.spi_read_regWait(_this7.regs.FIFO_SIZE2);
      const len3 = (yield _this7.spi_read_regWait(_this7.regs.FIFO_SIZE3)) & 0x07;
      return (len3 << 16 | len2 << 8 | len1) & 0x07ffff;
    })();
  }

  startCapture() {
    this.spi_write_reg(this.regs.ARDUCHIP_FIFO, 0x02);
  }

  isCaptureDoneWait() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const CAP_DONE_MASK = 0x08;
      const val = yield _this8.spi_read_regWait(_this8.regs.ARDUCHIP_TRIG);
      return val & CAP_DONE_MASK ? true : false;
    })();
  }

  readFIFOWait() {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      // get length of image data
      let length = yield _this9.readFIFOLengthWait();

      // start bust
      _this9.io_cs.output(false);
      _this9.spi.write([_this9.regs.BURST_FIFO_READ]);
      _this9.spi.write([0xff]); // dummy read

      let buf = [];

      while (buf.length < length) {
        let mustRead = length - buf.length;
        if (mustRead > 1024) {
          mustRead = 1024;
        }
        let arr = new Array(mustRead);
        arr.fill(0);
        const sliced = yield _this9.spi.writeWait(arr);
        buf.push(...sliced);
      }
      // end burst
      _this9.io_cs.output(true);

      return buf;
    })();
  }

  arrayToBase64(array) {
    return Buffer.from(array).toString('base64');
  }
}

if (true) {
  module.exports = ArduCAMMini;
}

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
    this.keys = ['vcc', 'cam_tx', 'cam_rx', 'gnd'];
    this.requiredKeys = ['cam_tx', 'cam_rx'];

    this.ioKeys = this.keys;
    this.displayName = 'Jcam';
    this.displayIoNames = { cam_tx: 'camTx', cam_rx: 'camRx' };
  }

  static info() {
    return {
      name: 'JpegSerialCam'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.my_tx = this.params.cam_rx;
    this.my_rx = this.params.cam_tx;

    this.obniz.getIO(this.my_tx).drive('3v');

    this.uart = this.obniz.getFreeUart();
  }

  _drainUntil(uart, search, recv) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!recv) recv = [];
      while (true) {
        let readed = uart.readBytes();
        recv = recv.concat(readed);
        let tail = _this._seekTail(search, recv);
        if (tail >= 0) {
          recv.splice(0, tail);
          return recv;
        }
        yield _this.obniz.wait(10);
      }
    })();
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

  arrayToBase64(array) {
    return Buffer.from(array).toString('base64');
  }

  startWait(obj) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!obj) obj = {};
      _this2.uart.start({
        tx: _this2.my_tx,
        rx: _this2.my_rx,
        baud: obj.baud || 38400
      });
      _this2.obniz.display.setPinName(_this2.my_tx, 'JpegSerialCam', 'camRx');
      _this2.obniz.display.setPinName(_this2.my_rx, 'JpegSerialCam', 'camTx');
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

  setSizeWait(resolution) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let val;
      if (resolution === '640x480') {
        val = 0x00;
      } else if (resolution === '320x240') {
        val = 0x11;
      } else if (resolution === '160x120') {
        val = 0x22;
      } else {
        throw new Error('unsupported size');
      }
      _this4.uart.send([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, val]);
      yield _this4._drainUntil(_this4.uart, [0x76, 0x00, 0x31, 0x00]);
      yield _this4.resetwait();
    })();
  }

  setCompressibilityWait(compress) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let val = Math.floor(compress / 100 * 0xff);
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
      _this6.uart.send([0x56, 0x00, 0x31, 0x06, 0x04, 0x02, 0x00, 0x08, val[0], val[1]]);
      yield _this6._drainUntil(_this6.uart, [0x76, 0x00, 0x31, 0x00]);
      //await this.obniz.wait(1000);
      yield _this6.startwait({
        baud
      });
    })();
  }

  takeWait() {
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
      let recv = yield _this7._drainUntil(uart, [0x76, 0x00, 0x34, 0x00, 0x04, 0x00, 0x00]); // ack
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
        yield _this7.obniz.wait(1000);
      }
      let databytes = XX * 256 + YY;
      //console.log("image: " + databytes + " Bytes");
      // const high = (databytes >> 8) & 0xff;
      // const low = databytes & 0xff;

      //console.log("start reading image")
      uart.send([0x56, 0x00, 0x32, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, XX, YY, 0x00, 0xff]);
      recv = yield _this7._drainUntil(uart, [0x76, 0x00, 0x32, 0x00, 0x00]);
      //console.log("reading...");
      while (true) {
        let readed = uart.readBytes();
        recv = recv.concat(readed);
        //console.log(readed.length);
        if (recv.length >= databytes) {
          break;
        }
        yield _this7.obniz.wait(10);
      }
      //console.log("done");
      recv = recv.splice(0, databytes); // remove tail
      recv = recv.concat([0xff, 0xd9]);
      return recv;
    })();
  }
}

if (true) {
  module.exports = JpegSerialCam;
}

/***/ }),

/***/ "./parts/ColorSensor/S11059/index.js":
/*!*******************************************!*\
  !*** ./parts/ColorSensor/S11059/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
      name: 'S11059'
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
    let val = gain << 3 | intTime;
    this.i2c.write(this.address, [this.regAdrs.ctrl, val]); // Set gain,interger time
  }

  getVal() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.i2c.write(_this.address, [_this.regAdrs.sensorRed]);
      let ret = yield _this.i2c.readWait(_this.address, 8);
      let level = [0, 0, 0, 0];
      level[0] = ret[0] << 8 | ret[1];
      level[1] = ret[2] << 8 | ret[3];
      level[2] = ret[4] << 8 | ret[5];
      level[3] = ret[6] << 8 | ret[7];
      return level;
    })();
  }
}

if (true) {
  module.exports = S11059;
}

/***/ }),

/***/ "./parts/CompassSensor/HMC5883L/index.js":
/*!***********************************************!*\
  !*** ./parts/CompassSensor/HMC5883L/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class HMC5883L {
  constructor() {
    this.keys = ['gnd', 'sda', 'scl', 'i2c'];

    this.address = {};
    this.address.device = 0x1e;
    this.address.reset = [0x02, 0x00]; // Continuous Measurment Mode
    this.address.xMSB = [0x03];
  }

  static info() {
    return {
      name: 'HMC5883L'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(null, this.params.gnd, '3v');

    this.params.clock = 100000;
    this.params.pull = '3v';
    this.params.mode = 'master';

    this.i2c = obniz.getI2CWithConfig(this.params);

    this.obniz.wait(500);
  }

  init() {
    this.i2c.write(this.address.device, this.address.reset);
    this.obniz.wait(500);
  }

  get() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.i2c.write(_this.address.device, _this.address.xMSB);
      let readed = yield _this.i2c.readWait(_this.address.device, 2 * 3);

      let obj = {};
      let keys = ['x', 'y', 'z'];
      for (let i = 0; i < 3; i++) {
        let val = readed[i * 2] << 8 | readed[i * 2 + 1];
        if (val & 0x8000) {
          val = val - 65536;
        }
        obj[keys[i]] = val;
      }

      return obj;
    })();
  }
}

if (true) {
  module.exports = HMC5883L;
}

/***/ }),

/***/ "./parts/Display/7SegmentLED/index.js":
/*!********************************************!*\
  !*** ./parts/Display/7SegmentLED/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class _7SegmentLED {
  constructor() {
    this.keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp', 'common', 'commonType'];
    this.requiredKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    this.digits = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f, 0x6f];

    this.displayIoNames = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      e: 'e',
      f: 'f',
      g: 'g',
      dp: 'dp',
      common: 'com'
    };
  }

  static info() {
    return {
      name: '7SegmentLED'
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
          let val = this.digits[data] & 1 << i ? true : false;
          if (!this.isCathodeCommon) {
            val = !val;
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
          let val = data & 1 << i ? true : false;
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
/*!*************************************************!*\
  !*** ./parts/Display/7SegmentLEDArray/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class _7SegmentLEDArray {
  constructor() {
    this.identifier = '' + new Date().getTime();

    this.keys = ['segments'];
    this.requiredKeys = this.keys;
  }

  static info() {
    return {
      name: '7SegmentLEDArray'
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
          state: print
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
/*!****************************************************!*\
  !*** ./parts/Display/7SegmentLED_MAX7219/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class _7SegmentLED_MAX7219 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'din', 'cs', 'clk'];
    this.requiredKeys = ['din', 'cs', 'clk'];
  }

  static info() {
    return {
      name: '7SegmentLED_MAX7219'
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
/*!**************************************************!*\
  !*** ./parts/Display/MatrixLED_MAX7219/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class MatrixLED_MAX7219 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'din', 'cs', 'clk'];
    this.requiredKeys = ['din', 'cs', 'clk'];
  }

  static info() {
    return {
      name: 'MatrixLED_MAX7219'
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
    this.write([0x09, 0x00]); // Code B decode for digits 3-0 No decode for digits 7-4
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

/***/ "./parts/Display/SainSmartTFT18LCD/index.js":
/*!**************************************************!*\
  !*** ./parts/Display/SainSmartTFT18LCD/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//SainSmart ST7735 1.8" TFT LCD 128x160 pixel
class SainSmartTFT18LCD {
  constructor() {
    this.keys = ['vcc', 'gnd', 'scl', 'sda', 'dc', 'res', 'cs'];
    this.required = ['scl', 'sda', 'dc', 'res', 'cs'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      scl: 'scl',
      sda: 'sda',
      dc: 'dc',
      res: 'res',
      cs: 'cs'
    };
  }

  static info() {
    return {
      name: 'SainSmartTFT18LCD'
    };
  }

  wired(obniz) {
    this.debugprint = false;
    this.obniz = obniz;
    this.io_dc = obniz.getIO(this.params.dc);
    this.io_res = obniz.getIO(this.params.res);
    this.io_cs = obniz.getIO(this.params.cs);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.params.frequency = 16 * 1000 * 1000; //16MHz
    this.params.mode = 'master';
    this.params.clk = this.params.scl;
    this.params.mosi = this.params.sda;
    this.params.drive = '3v';
    this.spi = this.obniz.getSpiWithConfig(this.params);

    this.io_dc.output(true);
    this.io_cs.output(false);

    this.width = ST7735_TFTWIDTH;
    this.height = ST7735_TFTHEIGHT;

    this.writeBuffer = []; //1024bytes bufferring

    this._setPresetColor();
    this.init();
  }

  print_debug(v) {
    if (this.debugprint) {
      console.log('SainSmartTFT18LCD: ' + Array.prototype.slice.call(arguments).join(''));
    }
  }
  _deadSleep(waitMsec) {
    let startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
  }
  _reset() {
    this.io_res.output(false);
    this._deadSleep(10);
    this.io_res.output(true);
    this._deadSleep(10);
  }

  writeCommand(cmd) {
    this.io_dc.output(false);
    this.io_cs.output(false);
    this.spi.write([cmd]);
    this.io_cs.output(true);
  }
  writeData(data) {
    this.io_dc.output(true);
    this.io_cs.output(false);
    this.spi.write(data);
    this.io_cs.output(true);
  }
  write(cmd, data) {
    if (data.length == 0) return;
    this.writeCommand(cmd);
    this.writeData(data);
  }
  asyncwait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      return yield _this.spi.writeWait([0x00]);
    })();
  }
  _writeFlush() {
    while (this.writeBuffer.length > 0) {
      if (this.writeBuffer.length > 1024) {
        let data = this.writeBuffer.slice(0, 1024);
        this.writeData(data);
        this.writeBuffer.splice(0, 1024);
      } else {
        if (this.writeBuffer.length > 0) this.writeData(this.writeBuffer);
        this.writeBuffer = [];
      }
    }
  }
  _writeBuffer(data) {
    if (data && data.length > 0) {
      this.writeBuffer = this.writeBuffer.concat(data);
    } else {
      this._writeFlush();
    }
  }

  color16(r, g, b) {
    //  1st byte  (r & 0xF8 | g >> 5)
    //  2nd byte  (g & 0xFC << 3 | b >> 3)
    return (r & 0xf8) << 8 | (g & 0xfc) << 3 | b >> 3;
  }

  _initG() {
    // initialize for Green Tab
    this.writeCommand(ST7735_SLPOUT); //Sleep out & booster on
    this.obniz.wait(120);
    this.write(ST7735_FRMCTR1, [0x01, 0x2c, 0x2d]);
    this.write(ST7735_FRMCTR2, [0x01, 0x2c, 0x2d]);
    this.write(ST7735_FRMCTR3, [0x01, 0x2c, 0x2d, 0x01, 0x2c, 0x2d]);
    this.write(ST7735_INVCTR, [0x07]);
    this.write(ST7735_PWCTR1, [0xa2, 0x02, 0x84]);
    this.write(ST7735_PWCTR2, [0xc5]);
    this.write(ST7735_PWCTR3, [0x0a, 0x00]);
    this.write(ST7735_PWCTR4, [0x8a, 0x2a]);
    this.write(ST7735_PWCTR5, [0x8a, 0xee]);
    this.write(ST7735_VMCTR1, [0x0e]);
    this.write(ST7735_GMCTRP1, [0x02, 0x1c, 0x07, 0x12, 0x37, 0x32, 0x29, 0x2d, 0x29, 0x25, 0x2b, 0x39, 0x00, 0x01, 0x03, 0x10]);
    this.write(ST7735_GMCTRN1, [0x03, 0x1d, 0x07, 0x06, 0x2e, 0x2c, 0x29, 0x2d, 0x2e, 0x2e, 0x37, 0x3f, 0x00, 0x00, 0x02, 0x10]);
    this.write(ST7735_COLMOD, [ST7735_16bit]); // color format: 16bit/pixel
  }

  init() {
    this._reset();
    this._initG();
    this.setDisplayOn();
    this.setRotation(0);
  }

  setDisplayOn() {
    this.writeCommand(ST7735_DISPON);
  }
  setDisplayOff() {
    this.writeCommand(ST7735_DISPOFF);
  }
  setDisplay(on) {
    if (on == true) this.setDisplayOn();else this.setDisplayOff();
  }

  setInversionOn() {
    this.writeCommand(ST7735_INVON);
  }
  setInversionOff() {
    this.writeCommand(ST7735_INVOFF);
  }
  setInversion(inversion) {
    if (inversion == true) this.setInversionOn();else this.setInversionOff();
  }

  setRotation(m) {
    const MADCTL_MY = 0x80;
    const MADCTL_MX = 0x40;
    const MADCTL_MV = 0x20;
    // const MADCTL_ML = 0x10;
    const MADCTL_RGB = 0x00; //always RGB, never BGR
    // const MADCTL_MH = 0x04;

    let data;
    let rotation = m % 4; // can't be higher than 3
    switch (rotation) {
      case 0:
        data = [MADCTL_MX | MADCTL_MY | MADCTL_RGB];
        this.width = ST7735_TFTWIDTH;
        this.height = ST7735_TFTHEIGHT;
        break;
      case 1:
        data = [MADCTL_MY | MADCTL_MV | MADCTL_RGB];
        this.width = ST7735_TFTHEIGHT;
        this.height = ST7735_TFTWIDTH;
        break;
      case 2:
        data = [MADCTL_RGB];
        this.width = ST7735_TFTWIDTH;
        this.height = ST7735_TFTHEIGHT;
        break;
      case 3:
        data = [MADCTL_MX | MADCTL_MV | MADCTL_RGB];
        this.width = ST7735_TFTHEIGHT;
        this.height = ST7735_TFTWIDTH;
        break;
    }
    this.write(ST7735_MADCTL, data);
    this.setAddrWindow(0, 0, this.width - 1, this.height - 1);
  }

  setAddrWindow(x0, y0, x1, y1) {
    this.print_debug(`setAddrWindow: (x0: ${x0}, y0: ${y0}) - (x1: ${x1}, y1: ${y1})`);

    if (x0 < 0) x0 = 0;
    if (y0 < 0) y0 = 0;
    if (x1 < 0) x1 = 0;
    if (y1 < 0) y1 = 0;

    // column addr set
    this.write(ST7735_CASET, [0x00, x0, 0x00, x1]); // XSTART-XEND
    // row addr set
    this.write(ST7735_RASET, [0x00, y0, 0x00, y1]); // YSTART-YEND
    // write to RAM
    this.writeCommand(ST7735_RAMWR);
    this.writeBuffer = [];
  }

  //__swap(a, b) { let t = a; a = b; b = t; }

  fillScreen(color) {
    this.fillRect(0, 0, this.width, this.height, color);
  }
  fillRect(x, y, w, h, color) {
    if (x >= this.width || y >= this.height) return;
    if (x + w - 1 >= this.width) w = this.width - x;
    if (y + h - 1 >= this.height) h = this.height - y;

    this.setAddrWindow(x, y, x + w - 1, y + h - 1);

    let hi = color >> 8,
        lo = color & 0xff;
    let data = [];

    for (y = h; y > 0; y--) {
      for (x = w; x > 0; x--) {
        data.push(hi);
        data.push(lo);
      }
    }
    this._writeBuffer(data);
    this._writeBuffer(); //for flush
  }
  drawRect(x, y, w, h, color) {
    this.drawHLine(x, y, w, color);
    this.drawHLine(x, y + h - 1, w, color);
    this.drawVLine(x, y, h, color);
    this.drawVLine(x + w - 1, y, h, color);
  }
  drawCircle(x0, y0, r, color) {
    let f = 1 - r;
    let ddF_x = 1;
    let ddF_y = -2 * r;
    let x = 0;
    let y = r;

    this.drawPixel(x0, y0 + r, color);
    this.drawPixel(x0, y0 - r, color);
    this.drawPixel(x0 + r, y0, color);
    this.drawPixel(x0 - r, y0, color);

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;

      this.drawPixel(x0 + x, y0 + y, color);
      this.drawPixel(x0 - x, y0 + y, color);
      this.drawPixel(x0 + x, y0 - y, color);
      this.drawPixel(x0 - x, y0 - y, color);
      this.drawPixel(x0 + y, y0 + x, color);
      this.drawPixel(x0 - y, y0 + x, color);
      this.drawPixel(x0 + y, y0 - x, color);
      this.drawPixel(x0 - y, y0 - x, color);
    }
  }
  _drawCircleHelper(x0, y0, r, cornername, color) {
    let f = 1 - r;
    let ddF_x = 1;
    let ddF_y = -2 * r;
    let x = 0;
    let y = r;

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;
      if (cornername & 0x4) {
        this.drawPixel(x0 + x, y0 + y, color);
        this.drawPixel(x0 + y, y0 + x, color);
      }
      if (cornername & 0x2) {
        this.drawPixel(x0 + x, y0 - y, color);
        this.drawPixel(x0 + y, y0 - x, color);
      }
      if (cornername & 0x8) {
        this.drawPixel(x0 - y, y0 + x, color);
        this.drawPixel(x0 - x, y0 + y, color);
      }
      if (cornername & 0x1) {
        this.drawPixel(x0 - y, y0 - x, color);
        this.drawPixel(x0 - x, y0 - y, color);
      }
    }
  }
  fillCircle(x0, y0, r, color) {
    this.drawVLine(x0, y0 - r, 2 * r + 1, color);
    this._fillCircleHelper(x0, y0, r, 3, 0, color);
  }
  _fillCircleHelper(x0, y0, r, cornername, delta, color) {
    let f = 1 - r;
    let ddF_x = 1;
    let ddF_y = -2 * r;
    let x = 0;
    let y = r;

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;

      if (cornername & 0x1) {
        this.drawVLine(x0 + x, y0 - y, 2 * y + 1 + delta, color);
        this.drawVLine(x0 + y, y0 - x, 2 * x + 1 + delta, color);
      }
      if (cornername & 0x2) {
        this.drawVLine(x0 - x, y0 - y, 2 * y + 1 + delta, color);
        this.drawVLine(x0 - y, y0 - x, 2 * x + 1 + delta, color);
      }
    }
  }
  drawRoundRect(x, y, w, h, r, color) {
    this.drawHLine(x + r, y, w - 2 * r, color); // Top
    this.drawHLine(x + r, y + h - 1, w - 2 * r, color); // Bottom
    this.drawVLine(x, y + r, h - 2 * r, color); // Left
    this.drawVLine(x + w - 1, y + r, h - 2 * r, color); // Right

    this._drawCircleHelper(x + r, y + r, r, 1, color);
    this._drawCircleHelper(x + w - r - 1, y + r, r, 2, color);
    this._drawCircleHelper(x + w - r - 1, y + h - r - 1, r, 4, color);
    this._drawCircleHelper(x + r, y + h - r - 1, r, 8, color);
  }
  fillRoundRect(x, y, w, h, r, color) {
    this.fillRect(x + r, y, w - 2 * r, h, color);

    this._fillCircleHelper(x + w - r - 1, y + r, r, 1, h - 2 * r - 1, color);
    this._fillCircleHelper(x + r, y + r, r, 2, h - 2 * r - 1, color);
  }
  drawTriangle(x0, y0, x1, y1, x2, y2, color) {
    this.drawLine(x0, y0, x1, y1, color);
    this.drawLine(x1, y1, x2, y2, color);
    this.drawLine(x2, y2, x0, y0, color);
  }
  fillTriangle(x0, y0, x1, y1, x2, y2, color) {
    let a, b, y, last;

    // Sort coordinates by Y order (y2 >= y1 >= y0)
    if (y0 > y1) {
      y1 = [y0, y0 = y1][0]; //this._swap(y0, y1);
      x1 = [x0, x0 = x1][0]; //this._swap(x0, x1);
    }
    if (y1 > y2) {
      y2 = [y1, y1 = y2][0]; //this._swap(y2, y1);
      x2 = [x1, x1 = x2][0]; //this._swap(x2, x1);
    }
    if (y0 > y1) {
      y1 = [y0, y0 = y1][0]; //this._swap(y0, y1);
      x1 = [x0, x0 = x1][0]; //this._swap(x0, x1);
    }

    if (y0 == y2) {
      // Handle awkward all-on-same-line case as its own thing
      a = b = x0;
      if (x1 < a) a = x1;else if (x1 > b) b = x1;
      if (x2 < a) a = x2;else if (x2 > b) b = x2;
      this.drawHLine(a, y0, b - a + 1, color);
      return;
    }

    let dx01 = x1 - x0,
        dy01 = y1 - y0,
        dx02 = x2 - x0,
        dy02 = y2 - y0,
        dx12 = x2 - x1,
        dy12 = y2 - y1,
        sa = 0,
        sb = 0;

    if (y1 == y2) last = y1;
    // include y1 scanline
    else last = y1 - 1; // skip it

    for (y = y0; y <= last; y++) {
      a = x0 + Math.floor(sa / dy01);
      b = x0 + Math.floor(sb / dy02);
      sa += dx01;
      sb += dx02;
      if (a > b) b = [a, a = b][0]; //this._swap(a,b);
      this.drawHLine(a, y, b - a + 1, color);
    }

    sa = dx12 * (y - y1);
    sb = dx02 * (y - y0);
    for (; y <= y2; y++) {
      a = x1 + Math.floor(sa / dy12);
      b = x0 + Math.floor(sb / dy02);
      sa += dx12;
      sb += dx02;
      if (a > b) b = [a, a = b][0]; //this._swap(a,b);
      this.drawHLine(a, y, b - a + 1, color);
    }
  }
  drawVLine(x, y, h, color) {
    if (x >= this.width || y >= this.height) return;
    if (y + h - 1 >= this.height) h = this.height - y;

    this.setAddrWindow(x, y, x, y + h - 1);

    let hi = color >> 8,
        lo = color & 0xff;
    let data = [];
    while (h--) {
      data.push(hi);
      data.push(lo);
    }
    this.writeData(data);
  }
  drawHLine(x, y, w, color) {
    if (x >= this.width || y >= this.height) return;
    if (x + w - 1 >= this.width) w = this.width - x;

    this.setAddrWindow(x, y, x + w - 1, y);

    let hi = color >> 8,
        lo = color & 0xff;
    let data = [];
    while (w--) {
      data.push(hi);
      data.push(lo);
    }
    this.writeData(data);
  }
  drawLine(x0, y0, x1, y1, color) {
    let step = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (step) {
      y0 = [x0, x0 = y0][0]; //this._swap(x0, y0);
      y1 = [x1, x1 = y1][0]; //this._swap(x1, y1);
    }
    if (x0 > x1) {
      x1 = [x0, x0 = x1][0]; //this._swap(x0, x1);
      y1 = [y0, y0 = y1][0]; //this._swap(y0, y1);
    }

    let dx = x1 - x0;
    let dy = Math.abs(y1 - y0);

    let err = dx / 2;
    let ystep = y0 < y1 ? 1 : -1;

    for (; x0 <= x1; x0++) {
      if (step) {
        this.drawPixel(y0, x0, color);
      } else {
        this.drawPixel(x0, y0, color);
      }
      err -= dy;
      if (err < 0) {
        y0 += ystep;
        err += dx;
      }
    }
  }
  drawPixel(x, y, color) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

    this.setAddrWindow(x, y, x + 1, y + 1);
    this.writeData([color >> 8, color & 0xff]);
  }
  drawChar(x, y, ch, color, bg, size) {
    //  bg = bg || color;
    size = size || 1;
    if (x >= this.width || // Clip right
    y >= this.height || // Clip bottom
    x + 6 * size - 1 < 0 || // Clip left
    y + 8 * size - 1 < 0)
      // Clip top
      return;

    if (color != bg) {
      this.drawChar2(x, y, ch, color, bg, size);
      return;
    }

    let c = ch.charCodeAt(0);
    for (let i = 0; i < 6; i++) {
      let line = i == 5 ? 0 : font[c * 5 + i];
      for (let j = 0; j < 8; j++) {
        if (line & 0x1) {
          if (size == 1)
            // default size
            this.drawPixel(x + i, y + j, color);else {
            // big size
            this.fillRect(x + i * size, y + j * size, size, size, color);
          }
        } else if (bg != color) {
          if (size == 1)
            // default size
            this.drawPixel(x + i, y + j, bg);else {
            // big size
            this.fillRect(x + i * size, y + j * size, size, size, bg);
          }
        }
        line >>= 1;
      }
    }
  }
  drawChar2(x, y, ch, color, bg, size) {
    //  bg = bg || color;
    size = size || 1;
    if (x >= this.width || // Clip right
    y >= this.height || // Clip bottom
    x + 6 * size - 1 < 0 || // Clip left
    y + 8 * size - 1 < 0 // Clip top
    ) return;

    let pixels = new Array(6 * 8 * size * size);
    let c = ch.charCodeAt(0);
    for (let i = 0; i < 6; i++) {
      let line = i == 5 ? 0 : font[c * 5 + i];
      for (let j = 0; j < 8; j++) {
        let cl = line & 0x1 ? color : bg;
        for (let w = 0; w < size; w++) {
          for (let h = 0; h < size; h++) {
            pixels[i * (1 * size) + w + (j * (6 * size * size) + h * (6 * size))] = cl;
          }
        }
        line >>= 1;
      }
    }
    this.rawBound16(x, y, 6 * size, 8 * size, pixels);
  }
  rawBound16(x, y, width, height, pixels) {
    let rgb = [];
    pixels.forEach(function (v) {
      rgb.push((v & 0xff00) >> 8);
      rgb.push(v & 0xff);
    });
    this.setAddrWindow(x, y, x + width - 1, y + height - 1);
    this._writeBuffer(rgb);
    this._writeBuffer(); //for flush
  }
  drawString(x, y, str, color, bg, size, wrap) {
    //  bg = bg || color;
    size = size || 1;
    //  wrap = wrap || true;
    for (let n = 0; n < str.length; n++) {
      let c = str.charAt(n);
      if (c == '\n') {
        y += size * 8;
        x = 0;
      } else if (c == '\r') {
        // skip em
      } else {
        this.drawChar(x, y, c, color, bg, size);
        x += size * 6;
        if (wrap && x > this.width - size * 6) {
          y += size * 8;
          x = 0;
        }
      }
    }
    return [x, y];
  }
  drawContextBound(context, x0, y0, width, height, x1, y1, gray) {
    x0 = x0 || 0;
    y0 = y0 || 0;
    width = width || context.canvas.clientWidth;
    height = height || context.canvas.clientHeight;
    x1 = x1 || 0;
    y1 = y1 || 0;
    gray = gray || false;
    this.write(ST7735_COLMOD, [ST7735_18bit]); //18bit/pixel
    let imageData = context.getImageData(x0, y0, width, height).data;
    let rgb = [];
    for (let n = 0; n < imageData.length; n += 4) {
      let r = imageData[n + 0];
      let g = imageData[n + 1];
      let b = imageData[n + 2];
      if (!gray) {
        rgb.push(r);
        rgb.push(g);
        rgb.push(b);
      } else {
        let gs = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        rgb.push(gs);
        rgb.push(gs);
        rgb.push(gs);
      }
    }
    this.write(ST7735_COLMOD, [ST7735_18bit]); //18bit/pixel
    this.setAddrWindow(x1, y1, x1 + width - 1, y1 + height - 1);
    this._writeBuffer(rgb);
    this._writeBuffer(); //for flush
    this.write(ST7735_COLMOD, [ST7735_16bit]); //16bit/pixel
  }
  drawContext(context, gray) {
    gray = gray || false;
    this.drawContextBound(context, 0, 0, this.width, this.height, 0, 0, gray);
  }
  rawBound(x, y, width, height, pixels) {
    let rgb = [];
    pixels.forEach(function (v) {
      rgb.push((v & 0xff0000) >> 16);
      rgb.push((v & 0xff00) >> 8);
      rgb.push(v & 0xff);
    });
    this.write(ST7735_COLMOD, [ST7735_18bit]); //18bit/pixel
    this.setAddrWindow(x, y, x + width - 1, y + height - 1);
    this._writeBuffer(rgb);
    this._writeBuffer(); //for flush
    this.write(ST7735_COLMOD, [ST7735_16bit]); //16bit/pixel
  }
  raw(pixels) {
    this.raw(0, 0, this.width, this.height, pixels);
  }

  _setPresetColor() {
    this.color = {
      AliceBlue: 0xf7df,
      AntiqueWhite: 0xff5a,
      Aqua: 0x07ff,
      Aquamarine: 0x7ffa,
      Azure: 0xf7ff,
      Beige: 0xf7bb,
      Bisque: 0xff38,
      Black: 0x0000,
      BlanchedAlmond: 0xff59,
      Blue: 0x001f,
      BlueViolet: 0x895c,
      Brown: 0xa145,
      BurlyWood: 0xddd0,
      CadetBlue: 0x5cf4,
      Chartreuse: 0x7fe0,
      Chocolate: 0xd343,
      Coral: 0xfbea,
      CornflowerBlue: 0x64bd,
      Cornsilk: 0xffdb,
      Crimson: 0xd8a7,
      Cyan: 0x07ff,
      DarkBlue: 0x0011,
      DarkCyan: 0x0451,
      DarkGoldenRod: 0xbc21,
      DarkGray: 0xad55,
      DarkGreen: 0x0320,
      DarkKhaki: 0xbdad,
      DarkMagenta: 0x8811,
      DarkOliveGreen: 0x5345,
      DarkOrange: 0xfc60,
      DarkOrchid: 0x9999,
      DarkRed: 0x8800,
      DarkSalmon: 0xecaf,
      DarkSeaGreen: 0x8df1,
      DarkSlateBlue: 0x49f1,
      DarkSlateGray: 0x2a69,
      DarkTurquoise: 0x067a,
      DarkViolet: 0x901a,
      DeepPink: 0xf8b2,
      DeepSkyBlue: 0x05ff,
      DimGray: 0x6b4d,
      DodgerBlue: 0x1c9f,
      FireBrick: 0xb104,
      FloralWhite: 0xffde,
      ForestGreen: 0x2444,
      Fuchsia: 0xf81f,
      Gainsboro: 0xdefb,
      GhostWhite: 0xffdf,
      Gold: 0xfea0,
      GoldenRod: 0xdd24,
      Gray: 0x8410,
      Green: 0x0400,
      GreenYellow: 0xafe5,
      HoneyDew: 0xf7fe,
      HotPink: 0xfb56,
      IndianRed: 0xcaeb,
      Indigo: 0x4810,
      Ivory: 0xfffe,
      Khaki: 0xf731,
      Lavender: 0xe73f,
      LavenderBlush: 0xff9e,
      LawnGreen: 0x7fe0,
      LemonChiffon: 0xffd9,
      LightBlue: 0xaedc,
      LightCoral: 0xf410,
      LightCyan: 0xe7ff,
      LightGoldenRodYellow: 0xffda,
      LightGray: 0xd69a,
      LightGreen: 0x9772,
      LightPink: 0xfdb8,
      LightSalmon: 0xfd0f,
      LightSeaGreen: 0x2595,
      LightSkyBlue: 0x867f,
      LightSlateGray: 0x7453,
      LightSteelBlue: 0xb63b,
      LightYellow: 0xfffc,
      Lime: 0x07e0,
      LimeGreen: 0x3666,
      Linen: 0xff9c,
      Magenta: 0xf81f,
      Maroon: 0x8000,
      MediumAquaMarine: 0x6675,
      MediumBlue: 0x0019,
      MediumOrchid: 0xbaba,
      MediumPurple: 0x939b,
      MediumSeaGreen: 0x3d8e,
      MediumSlateBlue: 0x7b5d,
      MediumSpringGreen: 0x07d3,
      MediumTurquoise: 0x4e99,
      MediumVioletRed: 0xc0b0,
      MidnightBlue: 0x18ce,
      MintCream: 0xf7ff,
      MistyRose: 0xff3c,
      Moccasin: 0xff36,
      NavajoWhite: 0xfef5,
      Navy: 0x0010,
      OldLace: 0xffbc,
      Olive: 0x8400,
      OliveDrab: 0x6c64,
      Orange: 0xfd20,
      OrangeRed: 0xfa20,
      Orchid: 0xdb9a,
      PaleGoldenRod: 0xef55,
      PaleGreen: 0x9fd3,
      PaleTurquoise: 0xaf7d,
      PaleVioletRed: 0xdb92,
      PapayaWhip: 0xff7a,
      PeachPuff: 0xfed7,
      Peru: 0xcc27,
      Pink: 0xfe19,
      Plum: 0xdd1b,
      PowderBlue: 0xb71c,
      Purple: 0x8010,
      RebeccaPurple: 0x6193,
      Red: 0xf800,
      RosyBrown: 0xbc71,
      RoyalBlue: 0x435c,
      SaddleBrown: 0x8a22,
      Salmon: 0xfc0e,
      SandyBrown: 0xf52c,
      SeaGreen: 0x2c4a,
      SeaShell: 0xffbd,
      Sienna: 0xa285,
      Silver: 0xc618,
      SkyBlue: 0x867d,
      SlateBlue: 0x6ad9,
      SlateGray: 0x7412,
      Snow: 0xffdf,
      SpringGreen: 0x07ef,
      SteelBlue: 0x4416,
      Tan: 0xd5b1,
      Teal: 0x0410,
      Thistle: 0xddfb,
      Tomato: 0xfb08,
      Turquoise: 0x471a,
      Violet: 0xec1d,
      Wheat: 0xf6f6,
      White: 0xffff,
      WhiteSmoke: 0xf7be,
      Yellow: 0xffe0,
      YellowGreen: 0x9e66
    };
  }
}

if (true) {
  module.exports = SainSmartTFT18LCD;
}

//----------------------------------------------------------

// commands
// const INITR_GREENTAB = 0x0;
// const INITR_REDTAB = 0x1;
// const INITR_BLACKTAB = 0x2;

const ST7735_TFTWIDTH = 128;
const ST7735_TFTHEIGHT = 160;

// const ST7735_NOP = 0x00;
// const ST7735_SWRESET = 0x01;
// const ST7735_RDDID = 0x04;
// const ST7735_RDDST = 0x09;
// const ST7735_RDDPM = 0x0a;

// const ST7735_SLPIN = 0x10;
const ST7735_SLPOUT = 0x11;
// const ST7735_PTLON = 0x12;
// const ST7735_NORON = 0x13;

const ST7735_INVOFF = 0x20;
const ST7735_INVON = 0x21;
const ST7735_DISPOFF = 0x28;
const ST7735_DISPON = 0x29;
const ST7735_CASET = 0x2a;
const ST7735_RASET = 0x2b;
const ST7735_RAMWR = 0x2c;
// const ST7735_RAMRD = 0x2e;

// const ST7735_PTLAR = 0x30;
const ST7735_COLMOD = 0x3a;
const ST7735_MADCTL = 0x36;

const ST7735_FRMCTR1 = 0xb1;
const ST7735_FRMCTR2 = 0xb2;
const ST7735_FRMCTR3 = 0xb3;
const ST7735_INVCTR = 0xb4;
// const ST7735_DISSET5 = 0xb6;

const ST7735_PWCTR1 = 0xc0;
const ST7735_PWCTR2 = 0xc1;
const ST7735_PWCTR3 = 0xc2;
const ST7735_PWCTR4 = 0xc3;
const ST7735_PWCTR5 = 0xc4;
const ST7735_VMCTR1 = 0xc5;

// const ST7735_RDID1 = 0xda;
// const ST7735_RDID2 = 0xdb;
// const ST7735_RDID3 = 0xdc;
// const ST7735_RDID4 = 0xdd;

// const ST7735_PWCTR6 = 0xfc;

const ST7735_GMCTRP1 = 0xe0;
const ST7735_GMCTRN1 = 0xe1;

// Color definitions
// const ST7735_BLACK = 0x0000;
// const ST7735_BLUE = 0x001f;
// const ST7735_RED = 0xf800;
// const ST7735_GREEN = 0x07e0;
// const ST7735_CYAN = 0x07ff;
// const ST7735_MAGENTA = 0xf81f;
// const ST7735_YELLOW = 0xffe0;
// const ST7735_WHITE = 0xffff;

const ST7735_18bit = 0x06; // 18bit/pixel
const ST7735_16bit = 0x05; // 16bit/pixel

// standard ascii 5x7 font
const font = [0x00, 0x00, 0x00, 0x00, 0x00, 0x3e, 0x5b, 0x4f, 0x5b, 0x3e, 0x3e, 0x6b, 0x4f, 0x6b, 0x3e, 0x1c, 0x3e, 0x7c, 0x3e, 0x1c, 0x18, 0x3c, 0x7e, 0x3c, 0x18, 0x1c, 0x57, 0x7d, 0x57, 0x1c, 0x1c, 0x5e, 0x7f, 0x5e, 0x1c, 0x00, 0x18, 0x3c, 0x18, 0x00, 0xff, 0xe7, 0xc3, 0xe7, 0xff, 0x00, 0x18, 0x24, 0x18, 0x00, 0xff, 0xe7, 0xdb, 0xe7, 0xff, 0x30, 0x48, 0x3a, 0x06, 0x0e, 0x26, 0x29, 0x79, 0x29, 0x26, 0x40, 0x7f, 0x05, 0x05, 0x07, 0x40, 0x7f, 0x05, 0x25, 0x3f, 0x5a, 0x3c, 0xe7, 0x3c, 0x5a, 0x7f, 0x3e, 0x1c, 0x1c, 0x08, 0x08, 0x1c, 0x1c, 0x3e, 0x7f, 0x14, 0x22, 0x7f, 0x22, 0x14, 0x5f, 0x5f, 0x00, 0x5f, 0x5f, 0x06, 0x09, 0x7f, 0x01, 0x7f, 0x00, 0x66, 0x89, 0x95, 0x6a, 0x60, 0x60, 0x60, 0x60, 0x60, 0x94, 0xa2, 0xff, 0xa2, 0x94, 0x08, 0x04, 0x7e, 0x04, 0x08, 0x10, 0x20, 0x7e, 0x20, 0x10, 0x08, 0x08, 0x2a, 0x1c, 0x08, 0x08, 0x1c, 0x2a, 0x08, 0x08, 0x1e, 0x10, 0x10, 0x10, 0x10, 0x0c, 0x1e, 0x0c, 0x1e, 0x0c, 0x30, 0x38, 0x3e, 0x38, 0x30, 0x06, 0x0e, 0x3e, 0x0e, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x5f, 0x00, 0x00, 0x00, 0x07, 0x00, 0x07, 0x00, 0x14, 0x7f, 0x14, 0x7f, 0x14, 0x24, 0x2a, 0x7f, 0x2a, 0x12, 0x23, 0x13, 0x08, 0x64, 0x62, 0x36, 0x49, 0x56, 0x20, 0x50, 0x00, 0x08, 0x07, 0x03, 0x00, 0x00, 0x1c, 0x22, 0x41, 0x00, 0x00, 0x41, 0x22, 0x1c, 0x00, 0x2a, 0x1c, 0x7f, 0x1c, 0x2a, 0x08, 0x08, 0x3e, 0x08, 0x08, 0x00, 0x80, 0x70, 0x30, 0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00, 0x60, 0x60, 0x00, 0x20, 0x10, 0x08, 0x04, 0x02, 0x3e, 0x51, 0x49, 0x45, 0x3e, 0x00, 0x42, 0x7f, 0x40, 0x00, 0x72, 0x49, 0x49, 0x49, 0x46, 0x21, 0x41, 0x49, 0x4d, 0x33, 0x18, 0x14, 0x12, 0x7f, 0x10, 0x27, 0x45, 0x45, 0x45, 0x39, 0x3c, 0x4a, 0x49, 0x49, 0x31, 0x41, 0x21, 0x11, 0x09, 0x07, 0x36, 0x49, 0x49, 0x49, 0x36, 0x46, 0x49, 0x49, 0x29, 0x1e, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00, 0x40, 0x34, 0x00, 0x00, 0x00, 0x08, 0x14, 0x22, 0x41, 0x14, 0x14, 0x14, 0x14, 0x14, 0x00, 0x41, 0x22, 0x14, 0x08, 0x02, 0x01, 0x59, 0x09, 0x06, 0x3e, 0x41, 0x5d, 0x59, 0x4e, 0x7c, 0x12, 0x11, 0x12, 0x7c, 0x7f, 0x49, 0x49, 0x49, 0x36, 0x3e, 0x41, 0x41, 0x41, 0x22, 0x7f, 0x41, 0x41, 0x41, 0x3e, 0x7f, 0x49, 0x49, 0x49, 0x41, 0x7f, 0x09, 0x09, 0x09, 0x01, 0x3e, 0x41, 0x41, 0x51, 0x73, 0x7f, 0x08, 0x08, 0x08, 0x7f, 0x00, 0x41, 0x7f, 0x41, 0x00, 0x20, 0x40, 0x41, 0x3f, 0x01, 0x7f, 0x08, 0x14, 0x22, 0x41, 0x7f, 0x40, 0x40, 0x40, 0x40, 0x7f, 0x02, 0x1c, 0x02, 0x7f, 0x7f, 0x04, 0x08, 0x10, 0x7f, 0x3e, 0x41, 0x41, 0x41, 0x3e, 0x7f, 0x09, 0x09, 0x09, 0x06, 0x3e, 0x41, 0x51, 0x21, 0x5e, 0x7f, 0x09, 0x19, 0x29, 0x46, 0x26, 0x49, 0x49, 0x49, 0x32, 0x03, 0x01, 0x7f, 0x01, 0x03, 0x3f, 0x40, 0x40, 0x40, 0x3f, 0x1f, 0x20, 0x40, 0x20, 0x1f, 0x3f, 0x40, 0x38, 0x40, 0x3f, 0x63, 0x14, 0x08, 0x14, 0x63, 0x03, 0x04, 0x78, 0x04, 0x03, 0x61, 0x59, 0x49, 0x4d, 0x43, 0x00, 0x7f, 0x41, 0x41, 0x41, 0x02, 0x04, 0x08, 0x10, 0x20, 0x00, 0x41, 0x41, 0x41, 0x7f, 0x04, 0x02, 0x01, 0x02, 0x04, 0x40, 0x40, 0x40, 0x40, 0x40, 0x00, 0x03, 0x07, 0x08, 0x00, 0x20, 0x54, 0x54, 0x78, 0x40, 0x7f, 0x28, 0x44, 0x44, 0x38, 0x38, 0x44, 0x44, 0x44, 0x28, 0x38, 0x44, 0x44, 0x28, 0x7f, 0x38, 0x54, 0x54, 0x54, 0x18, 0x00, 0x08, 0x7e, 0x09, 0x02, 0x18, 0xa4, 0xa4, 0x9c, 0x78, 0x7f, 0x08, 0x04, 0x04, 0x78, 0x00, 0x44, 0x7d, 0x40, 0x00, 0x20, 0x40, 0x40, 0x3d, 0x00, 0x7f, 0x10, 0x28, 0x44, 0x00, 0x00, 0x41, 0x7f, 0x40, 0x00, 0x7c, 0x04, 0x78, 0x04, 0x78, 0x7c, 0x08, 0x04, 0x04, 0x78, 0x38, 0x44, 0x44, 0x44, 0x38, 0xfc, 0x18, 0x24, 0x24, 0x18, 0x18, 0x24, 0x24, 0x18, 0xfc, 0x7c, 0x08, 0x04, 0x04, 0x08, 0x48, 0x54, 0x54, 0x54, 0x24, 0x04, 0x04, 0x3f, 0x44, 0x24, 0x3c, 0x40, 0x40, 0x20, 0x7c, 0x1c, 0x20, 0x40, 0x20, 0x1c, 0x3c, 0x40, 0x30, 0x40, 0x3c, 0x44, 0x28, 0x10, 0x28, 0x44, 0x4c, 0x90, 0x90, 0x90, 0x7c, 0x44, 0x64, 0x54, 0x4c, 0x44, 0x00, 0x08, 0x36, 0x41, 0x00, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x41, 0x36, 0x08, 0x00, 0x02, 0x01, 0x02, 0x04, 0x02, 0x3c, 0x26, 0x23, 0x26, 0x3c, 0x1e, 0xa1, 0xa1, 0x61, 0x12, 0x3a, 0x40, 0x40, 0x20, 0x7a, 0x38, 0x54, 0x54, 0x55, 0x59, 0x21, 0x55, 0x55, 0x79, 0x41, 0x21, 0x54, 0x54, 0x78, 0x41, 0x21, 0x55, 0x54, 0x78, 0x40, 0x20, 0x54, 0x55, 0x79, 0x40, 0x0c, 0x1e, 0x52, 0x72, 0x12, 0x39, 0x55, 0x55, 0x55, 0x59, 0x39, 0x54, 0x54, 0x54, 0x59, 0x39, 0x55, 0x54, 0x54, 0x58, 0x00, 0x00, 0x45, 0x7c, 0x41, 0x00, 0x02, 0x45, 0x7d, 0x42, 0x00, 0x01, 0x45, 0x7c, 0x40, 0xf0, 0x29, 0x24, 0x29, 0xf0, 0xf0, 0x28, 0x25, 0x28, 0xf0, 0x7c, 0x54, 0x55, 0x45, 0x00, 0x20, 0x54, 0x54, 0x7c, 0x54, 0x7c, 0x0a, 0x09, 0x7f, 0x49, 0x32, 0x49, 0x49, 0x49, 0x32, 0x32, 0x48, 0x48, 0x48, 0x32, 0x32, 0x4a, 0x48, 0x48, 0x30, 0x3a, 0x41, 0x41, 0x21, 0x7a, 0x3a, 0x42, 0x40, 0x20, 0x78, 0x00, 0x9d, 0xa0, 0xa0, 0x7d, 0x39, 0x44, 0x44, 0x44, 0x39, 0x3d, 0x40, 0x40, 0x40, 0x3d, 0x3c, 0x24, 0xff, 0x24, 0x24, 0x48, 0x7e, 0x49, 0x43, 0x66, 0x2b, 0x2f, 0xfc, 0x2f, 0x2b, 0xff, 0x09, 0x29, 0xf6, 0x20, 0xc0, 0x88, 0x7e, 0x09, 0x03, 0x20, 0x54, 0x54, 0x79, 0x41, 0x00, 0x00, 0x44, 0x7d, 0x41, 0x30, 0x48, 0x48, 0x4a, 0x32, 0x38, 0x40, 0x40, 0x22, 0x7a, 0x00, 0x7a, 0x0a, 0x0a, 0x72, 0x7d, 0x0d, 0x19, 0x31, 0x7d, 0x26, 0x29, 0x29, 0x2f, 0x28, 0x26, 0x29, 0x29, 0x29, 0x26, 0x30, 0x48, 0x4d, 0x40, 0x20, 0x38, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x38, 0x2f, 0x10, 0xc8, 0xac, 0xba, 0x2f, 0x10, 0x28, 0x34, 0xfa, 0x00, 0x00, 0x7b, 0x00, 0x00, 0x08, 0x14, 0x2a, 0x14, 0x22, 0x22, 0x14, 0x2a, 0x14, 0x08, 0xaa, 0x00, 0x55, 0x00, 0xaa, 0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x00, 0x00, 0x00, 0xff, 0x00, 0x10, 0x10, 0x10, 0xff, 0x00, 0x14, 0x14, 0x14, 0xff, 0x00, 0x10, 0x10, 0xff, 0x00, 0xff, 0x10, 0x10, 0xf0, 0x10, 0xf0, 0x14, 0x14, 0x14, 0xfc, 0x00, 0x14, 0x14, 0xf7, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0xff, 0x14, 0x14, 0xf4, 0x04, 0xfc, 0x14, 0x14, 0x17, 0x10, 0x1f, 0x10, 0x10, 0x1f, 0x10, 0x1f, 0x14, 0x14, 0x14, 0x1f, 0x00, 0x10, 0x10, 0x10, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x1f, 0x10, 0x10, 0x10, 0x10, 0x1f, 0x10, 0x10, 0x10, 0x10, 0xf0, 0x10, 0x00, 0x00, 0x00, 0xff, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xff, 0x10, 0x00, 0x00, 0x00, 0xff, 0x14, 0x00, 0x00, 0xff, 0x00, 0xff, 0x00, 0x00, 0x1f, 0x10, 0x17, 0x00, 0x00, 0xfc, 0x04, 0xf4, 0x14, 0x14, 0x17, 0x10, 0x17, 0x14, 0x14, 0xf4, 0x04, 0xf4, 0x00, 0x00, 0xff, 0x00, 0xf7, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0xf7, 0x00, 0xf7, 0x14, 0x14, 0x14, 0x17, 0x14, 0x10, 0x10, 0x1f, 0x10, 0x1f, 0x14, 0x14, 0x14, 0xf4, 0x14, 0x10, 0x10, 0xf0, 0x10, 0xf0, 0x00, 0x00, 0x1f, 0x10, 0x1f, 0x00, 0x00, 0x00, 0x1f, 0x14, 0x00, 0x00, 0x00, 0xfc, 0x14, 0x00, 0x00, 0xf0, 0x10, 0xf0, 0x10, 0x10, 0xff, 0x10, 0xff, 0x14, 0x14, 0x14, 0xff, 0x14, 0x10, 0x10, 0x10, 0x1f, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x10, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x38, 0x44, 0x44, 0x38, 0x44, 0x7c, 0x2a, 0x2a, 0x3e, 0x14, 0x7e, 0x02, 0x02, 0x06, 0x06, 0x02, 0x7e, 0x02, 0x7e, 0x02, 0x63, 0x55, 0x49, 0x41, 0x63, 0x38, 0x44, 0x44, 0x3c, 0x04, 0x40, 0x7e, 0x20, 0x1e, 0x20, 0x06, 0x02, 0x7e, 0x02, 0x02, 0x99, 0xa5, 0xe7, 0xa5, 0x99, 0x1c, 0x2a, 0x49, 0x2a, 0x1c, 0x4c, 0x72, 0x01, 0x72, 0x4c, 0x30, 0x4a, 0x4d, 0x4d, 0x30, 0x30, 0x48, 0x78, 0x48, 0x30, 0xbc, 0x62, 0x5a, 0x46, 0x3d, 0x3e, 0x49, 0x49, 0x49, 0x00, 0x7e, 0x01, 0x01, 0x01, 0x7e, 0x2a, 0x2a, 0x2a, 0x2a, 0x2a, 0x44, 0x44, 0x5f, 0x44, 0x44, 0x40, 0x51, 0x4a, 0x44, 0x40, 0x40, 0x44, 0x4a, 0x51, 0x40, 0x00, 0x00, 0xff, 0x01, 0x03, 0xe0, 0x80, 0xff, 0x00, 0x00, 0x08, 0x08, 0x6b, 0x6b, 0x08, 0x36, 0x12, 0x36, 0x24, 0x36, 0x06, 0x0f, 0x09, 0x0f, 0x06, 0x00, 0x00, 0x18, 0x18, 0x00, 0x00, 0x00, 0x10, 0x10, 0x00, 0x30, 0x40, 0xff, 0x01, 0x01, 0x00, 0x1f, 0x01, 0x01, 0x1e, 0x00, 0x19, 0x1d, 0x17, 0x12, 0x00, 0x3c, 0x3c, 0x3c, 0x3c, 0x00, 0x00, 0x00, 0x00, 0x00];

/***/ }),

/***/ "./parts/Display/SharpMemoryTFT/index.js":
/*!***********************************************!*\
  !*** ./parts/Display/SharpMemoryTFT/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class SharpMemoryTFT {
  constructor() {
    this.keys = ['vcc', 'gnd', 'vcc_a', 'gnd_a', 'sclk', 'mosi', 'cs', 'disp', 'extcomin', 'extmode', 'width', 'height'];

    this.requiredKeys = ['sclk', 'mosi', 'cs', 'width', 'height'];

    this.commands = {};
    this.commands.write = 0x80;
    this.commands.clear = 0x20;
    this.commands.vcom = 0x40;

    this._canvas = null;
    this._reset();
  }

  static info() {
    return {
      name: 'SharpMemoryTFT'
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.io_cs = obniz.getIO(this.params.cs);

    if (this.params.disp && this.params.extcomin && this.params.extmode) {
      this.io_disp = obniz.getIO(this.params.disp);
      this.io_extcomin = obniz.getIO(this.params.extcomin);
      this.io_extmode = obniz.getIO(this.params.extmode);
      this.io_disp.output(true);
      this.io_extcomin.output(false);
      this.io_extmode.output(false);
    }

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    obniz.setVccGnd(this.params.vcc_a, this.params.gnd_a, '5v');

    this.params.mode = 'master';
    this.params.frequency = parseInt(1000 * 1000);
    this.params.clk = this.params.sclk;
    this.params.drive = '5v'; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
    this.spi = this.obniz.getSpiWithConfig(this.params);

    this.width = this.params.width;
    this.height = this.params.height;

    this.obniz.wait(100);
  }

  _reverseBits(data) {
    let revData = 0;
    for (let i = 0; i < 8; i++) {
      revData += data & 0x01;
      data >>= 1;
      if (i < 7) revData <<= 1;
    }
    return revData;
  }

  sendLSB(data) {
    this.spi.write([this._reverseBits(data)]);
  }

  sendClear() {
    this.io_cs.output(true);
    this.spi.write([this.commands.clear | 0x00, 0x00]);
    this.io_cs.output(false);
  }

  raw(rawData) {
    let oldline, currentline;
    let totalbytes = this.width * this.height / 8;
    let array = new Array(1024);
    let index = 0;
    array[index++] = this.commands.write | this.commands.vcom;
    oldline = currentline = 1;
    array[index++] = this._reverseBits(currentline);
    this.io_cs.output(true);
    for (let i = 0; i < totalbytes; i++) {
      array[index++] = rawData[i]; //lsb
      currentline = parseInt((i + 1) / (this.width / 8) + 1, 10);
      if (currentline != oldline) {
        array[index++] = 0x00;
        if (currentline <= this.height) array[index++] = this._reverseBits(currentline);
        oldline = currentline;
      }
      if (index >= 1021) {
        // regarding SPI max.
        this.spi.write(array.slice(0, index));
        array = new Array(1024);
        index = 0;
      }
    }
    if (index > 0) {
      this.spi.write(array.slice(0, index));
    }
    this.spi.write([0x00]);
    this.io_cs.output(false);
  }

  // copy from display.js

  _reset() {
    this._pos = { x: 0, y: 0 };
    this.autoFlush = true;
  }

  warnCanvasAvailability() {
    if (this.obniz.isNode) {
      throw new Error('MemoryDisplay require node-canvas to draw rich contents. see more detail on docs');
    } else {
      throw new Error('MemoryDisplay cant create canvas element to body');
    }
  }

  _preparedCanvas() {
    if (this._canvas) {
      return this._canvas;
    }
    if (this.obniz.isNode) {
      try {
        const { createCanvas } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
        this._canvas = createCanvas(this.width, this.height);
      } catch (e) {
        // this.warnCanvasAvailability();
        return null;
      }
    } else {
      const identifier = 'MemoryDispCanvas-' + this.obniz.id;
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
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
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
    this._pos.x = 0;
    this._pos.y = 0;
    if (ctx) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#000';
      this.draw(ctx);
    } else {
      this.sendClear();
    }
  }

  pos(x, y) {
    this._ctx(); //crete first
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
      /*
      let obj = {};
      obj['display'] = {
        text: '' + text,
      };
      this.obniz.send(obj);
      */
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

  _draw(ctx) {
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
      if (brightness > 0x73) vram[line * stride + col] |= 0x80 >> bits;
    }
    this.raw(vram);
  }

  draw(ctx) {
    if (this.autoFlush) {
      this._draw(ctx);
    }
  }

  drawing(autoFlush) {
    this.autoFlush = autoFlush == true;
    const ctx = this._ctx();
    if (ctx) {
      this.draw(ctx);
    }
  }
}

if (true) {
  module.exports = SharpMemoryTFT;
}

/***/ }),

/***/ "./parts/DistanceSensor/GP2Y0A21YK0F/index.js":
/*!****************************************************!*\
  !*** ./parts/DistanceSensor/GP2Y0A21YK0F/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class GP2Y0A21YK0F {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      signal: 'signal'
    };
    this._unit = 'mm';
  }

  static info() {
    return {
      name: 'GP2Y0A21YK0F'
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
      let distance = this._volt2distance(val);
      if (typeof callback == 'function') {
        callback(distance);
      }
    });
  }

  _volt2distance(val) {
    if (val <= 0) {
      val = 0.001;
    }
    let distance = 19988.34 * Math.pow(val / 5.0 * 1024, -1.25214) * 10;
    if (this._unit === 'mm') {
      distance = parseInt(distance * 10) / 10;
    } else {
      distance *= 0.0393701;
      distance = parseInt(distance * 1000) / 1000;
    }
    return distance;
  }

  getWait() {
    var _this = this;

    return new Promise((() => {
      var _ref = _asyncToGenerator(function* (resolve) {
        let val = yield _this.ad_signal.getWait();
        let distance = _this._volt2distance(val);
        resolve(distance);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
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
/*!***********************************************!*\
  !*** ./parts/DistanceSensor/HC-SR04/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
      name: 'HC-SR04'
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
    var _this = this;

    let self = this;
    this.obniz.measure.echo({
      io_pulse: this.trigger,
      io_echo: this.echo,
      pulse: 'positive',
      pulse_width: 0.011,
      measure_edges: 3,
      timeout: 10 / 340 * 1000,
      callback: (() => {
        var _ref = _asyncToGenerator(function* (edges) {
          if (_this.reset_alltime) {
            _this.vccIO.output(false);
            _this.obniz.wait(100);
            _this.vccIO.output(true);
            _this.obniz.wait(100);
          }
          let distance = undefined;
          for (let i = 0; i < edges.length - 1; i++) {
            // HCSR04's output of io_echo is initially high when trigger is finshed
            if (edges[i].edge === true) {
              const time = (edges[i + 1].timing - edges[i].timing) / 1000; // (1/4000 * 8) + is needed??
              distance = time / 2 * 20.055 * Math.sqrt(_this.temp + 273.15) * 1000;
              if (self._unit === 'inch') {
                distance = distance * 0.0393701;
              }
            }
          }
          if (typeof callback === 'function') {
            callback(distance);
          }
        });

        return function callback(_x) {
          return _ref.apply(this, arguments);
        };
      })()
    });
  }

  measureWait() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve) {
        _this2.measure(function (distance) {
          resolve(distance);
        });
      });
    })();
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

/***/ "./parts/GPS/GYSFDMAXB/index.js":
/*!**************************************!*\
  !*** ./parts/GPS/GYSFDMAXB/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class GYSFDMAXB {
  constructor() {
    this.keys = ['vcc', 'txd', 'rxd', 'gnd', 'Opps'];
    this.requiredKeys = ['txd', 'rxd'];

    this.ioKeys = this.keys;
    this.displayName = 'gps';
    this.displayIoNames = { txd: 'txd', rxd: 'rxd', Opps: '1pps' };
  }

  static info() {
    return {
      name: 'GYSFDMAXB'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.tx = this.params.txd;
    this.rx = this.params.rxd;
    this.vcc = this.params.vcc;
    this.gnd = this.params.gnd;
    this.Opps = this.params.Opps;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.uart = obniz.getFreeUart();
    this.uart.start({
      tx: this.params.txd,
      rx: this.params.rxd,
      baud: 9600,
      drive: '3v'
    });

    this.editedData = {};
    this.editedData.enable = false;
    this.editedData.GPGSV = new Array(4);

    this.on1pps = null;
    this.last1pps = 0;

    this.gpsInfo = {};
    this.gpsInfo._sentenceType = {
      GPGGA: 0x0001, // GGA - Global Positioning System Fix Data
      GPGSA: 0x0002, // GSA - GNSS DOP and active satellites
      GPGSV: 0x0004, // GSV - Satellites in view
      GPRMC: 0x0008, // RMC - Recommended minimum specific GNSS data
      GPVTG: 0x0010, // VTG - Track made good and ground speed
      GPZDA: 0x0020 // ZDA - Date & Time
    };
    this.gpsInfo.status = 'V';
    this.gpsInfo.sentences = new Set(); // Set specifying sentence of MNEA from which data have been obtained
    this.gpsInfo.satelliteInfo = {
      satellites: [],
      inView: 0
    };
  }

  start1pps(callback) {
    this.on1pps = callback;
    if (callback) {
      this.last1pps = 2;
      this.obniz.getAD(this.Opps).self = this;
      this.obniz.getAD(this.Opps).start(function (voltage) {
        let vol = Math.round(voltage);
        if (vol != this.self.last1pps) {
          this.self.last1pps = vol;
          if (vol == 0 && this.self.on1pps) {
            this.self.on1pps();
          }
        }
      });
    } else {
      this.obniz.getAD(this.Opps).end();
    }
  }

  readSentence() {
    let results = [];
    if (this.uart.isDataExists()) {
      let pos = this.uart.received.indexOf(0x0a);
      if (pos >= 0) {
        results = this.uart.received.slice(0, pos - 1);
        this.uart.received.splice(0, pos + 1);
        return this.uart.tryConvertString(results);
      }
    }
    return '';
  }

  getEditedData() {
    let n, utc, format;
    let sentence = this.readSentence();
    this.editedData.enable = false;
    this.editedData.GPGSV = new Array(4);
    while (sentence.length > 0) {
      let part = sentence.split(',');
      if (sentence.slice(-4, -3) != ',') {
        let st = part[part.length - 1].slice(0, -3);
        part.push(part[part.length - 1].slice(-3));
        part[part.length - 2] = st;
      }
      this.editedData.sentence = part.join(',');
      switch (part[0]) {
        case '$GPGGA':
          this.editedData.GPGGA = part;
          break;
        case '$GPGLL':
          this.editedData.GPGLL = part;
          break;
        case '$GPGSA':
          this.editedData.GPGSA = part;
          break;
        case '$GPGSV':
          n = Number(part[2]);
          if (n > this.editedData.GPGSV.length) {
            while (n > this.editedData.GPGSV.length) {
              this.editedData.GPGSV.push([]);
            }
          }
          this.editedData.GPGSV[n - 1] = part;
          break;
        case '$GPRMC':
          this.editedData.GPRMC = part;
          break;
        case '$GPVTG':
          this.editedData.GPVTG = part;
          break;
        case '$GPZDA':
          this.editedData.GPZDA = part;
          utc = part[4] + '/' + part[3] + '/' + part[2] + ' ' + part[1].substring(0, 2) + ':' + part[1].substring(2, 4) + ':' + part[1].substring(4, 6) + ' +00:00';
          this.editedData.timestamp = new Date(utc);
          break;
        default:
          format = part[0].substr(1);
          this.editedData[format] = part;
      }

      this.editedData.enable = true;
      sentence = this.readSentence();
    }
    return this.editedData;
  }

  getGpsInfo(editedData) {
    const NMEA_SATINSENTENCE = 4,
          NMEA_MAXSAT = 12;
    editedData = editedData || this.getEditedData();
    this.gpsInfo.status = 'V';
    if (editedData.enable) {
      if (editedData.GPGGA) {
        const gga = editedData.GPGGA;
        this.gpsInfo.gpsQuality = parseFloat(gga[6]); //Fix Quality: 0 = Invalid, 1 = GPS fix, 2 = DGPS fix
        this.gpsInfo.hdop = parseFloat(gga[8]); //Horizontal Dilution of Precision (HDOP)
        this.gpsInfo.altitude = parseFloat(gga[9]); //Antenna Altitude meters above mean sea level
        const latitude = this.nmea2dd(parseFloat(gga[2]));
        this.gpsInfo.latitude = gga[3] == 'N' ? latitude : -latitude;
        const longitude = this.nmea2dd(parseFloat(gga[4]));
        this.gpsInfo.longitude = gga[5] == 'E' ? longitude : -longitude;
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPGGA);
      }
      if (editedData.GPGSV) {
        for (let n = 0; n < editedData.GPGSV.length; n++) if (editedData.GPGSV[n]) {
          const gsv = editedData.GPGSV[n].map(v => parseFloat(v));
          const pack_count = gsv[1],
                pack_index = gsv[2],
                sat_count = gsv[3];
          if (pack_index > pack_count) continue;

          this.gpsInfo.satelliteInfo.inView = sat_count;
          let nsat = (pack_index - 1) * NMEA_SATINSENTENCE;
          nsat = nsat + NMEA_SATINSENTENCE > sat_count ? sat_count - nsat : NMEA_SATINSENTENCE;

          for (let isat = 0; isat < nsat; ++isat) {
            const isi = (pack_index - 1) * NMEA_SATINSENTENCE + isat;
            if (this.gpsInfo.satelliteInfo.satellites.length <= isi) {
              this.gpsInfo.satelliteInfo.satellites.push({});
            }
            const isatn = isat * NMEA_SATINSENTENCE;
            this.gpsInfo.satelliteInfo.satellites[isi] = {
              id: gsv[isatn + 4], // SV PRN number
              elevation: gsv[isatn + 5], // Elevation in degrees, 90 maximum
              azimuth: gsv[isatn + 6], // Azimuth, degrees from true north, 000 to 359
              snr: gsv[isatn + 7], // SNR, 00-99 dB (null when not tracking)
              inUse: false
            };
          }
          this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPGSV);
        }
      }
      if (editedData.GPGSA) {
        const gsa = editedData.GPGSA;
        let nuse = 0;
        this.gpsInfo.fixMode = parseFloat(gsa[2]); // Fix Mode: 1=Fix not available, 2=2D, 3=3D
        this.gpsInfo.pdop = parseFloat(gsa[15]); // PDOP: Position Dilution of Precision
        this.gpsInfo.hdop = parseFloat(gsa[16]); // HDOP: Horizontal Dilution of Precision
        this.gpsInfo.vdop = parseFloat(gsa[17]); // VDOP: Vertical Dilution of Position
        for (let i = 0; i < NMEA_MAXSAT; ++i) {
          for (let j = 0; j < this.gpsInfo.satelliteInfo.inView; ++j) {
            if (this.gpsInfo.satelliteInfo.satellites[j] && gsa[i + 3] == this.gpsInfo.satelliteInfo.satellites[j].id) {
              this.gpsInfo.satelliteInfo.satellites[j].inUse = true;
              nuse++;
            }
          }
        }
        this.gpsInfo.satelliteInfo.inUse = nuse;
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPGSA);
      }
      if (editedData.GPRMC) {
        const rmc = editedData.GPRMC;
        this.gpsInfo.status = rmc[2]; // Status Active or Void
        const latitude = this.nmea2dd(parseFloat(rmc[3]));
        this.gpsInfo.latitude = rmc[4] == 'N' ? latitude : -latitude;
        const longitude = this.nmea2dd(parseFloat(rmc[5]));
        this.gpsInfo.longitude = rmc[6] == 'E' ? longitude : -longitude;
        const NMEA_TUD_KNOTS = 1.852; // 1knot=1.852km/h
        this.gpsInfo.speed = parseFloat(rmc[7]) * NMEA_TUD_KNOTS; //unit: km/h
        this.gpsInfo.direction = rmc[8];
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPRMC);
      }
      if (editedData.GPVTG) {
        const vtg = editedData.GPVTG;
        this.gpsInfo.direction = parseFloat(vtg[1]);
        this.gpsInfo.declination = parseFloat(vtg[3]);
        this.gpsInfo.speed = parseFloat(vtg[7]);
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPVTG);
      }
      if (editedData.GPZDA) {
        this.gpsInfo.utc = editedData.timestamp;
        this.gpsInfo.sentences.add(this.gpsInfo._sentenceType.GPZDA);
      }
    }
    return this.gpsInfo;
  }
  //-------------------
  get latitude() {
    return this.nmea2dd(this._latitude);
  }
  get longitude() {
    return this.nmea2dd(this._longitude);
  }
  _mneaTo(format, value) {
    let result = this.nmea2dd(value);
    if (typeof format == 'string') {
      switch (format.toUpperCase()) {
        case 'DMS':
          result = this.nmea2dms(value);
          break;
        case 'DM':
          result = this.nmea2dm(value);
          break;
        case 'S':
          result = this.nmea2s(value);
          break;
        default:
      }
    }
    return result;
  }
  latitudeTo(format) {
    return this._mneaTo(format, this._latitude);
  }
  longitudeTo(format) {
    return this._mneaTo(format, this._longitude);
  }
  status2string(status) {
    status = status || this.status;
    if (status == 'A') return 'Active';
    if (status == 'V') return 'Void';
    return status;
  }
  fixMode2string(fixMode) {
    fixMode = fixMode || this.fixMode;
    if (fixMode == 1) return 'Fix not available';
    if (fixMode == 2) return '2D';
    if (fixMode == 3) return '3D';
    return fixMode;
  }
  gpsQuality2string(gpsQuality) {
    gpsQuality = gpsQuality || this.gpsQuality;
    if (gpsQuality == 0) return 'Invalid';
    if (gpsQuality == 1) return 'GPS fix';
    if (gpsQuality == 2) return 'DGPS fix';
    return gpsQuality;
  }

  //--- latitude/longitude MNEA format change to each unit
  nmea2dms(val) {
    //NMEA format to DMS format string (999° 99'99.9")
    val = parseFloat(val);
    let d = Math.floor(val / 100);
    let m = Math.floor((val / 100.0 - d) * 100.0);
    let s = ((val / 100.0 - d) * 100.0 - m) * 60;
    return d + '°' + m + "'" + s.toFixed(1) + '"';
  }
  nmea2dm(val) {
    //NMEA format to DM format string (999° 99.9999')
    val = parseFloat(val);
    let d = Math.floor(val / 100.0);
    let m = (val / 100.0 - d) * 100.0;
    return d + '°' + m.toFixed(4) + "'";
  }
  nmea2dd(val) {
    //NMEA format to DD format decimal (999.999999)
    val = parseFloat(val);
    let d = Math.floor(val / 100.0);
    let m = Math.floor((val / 100.0 - d) * 100.0 / 60);
    let s = ((val / 100.0 - d) * 100.0 - m) * 60 / (60 * 60);
    return parseFloat((d + m + s).toFixed(6));
  }
  nmea2s(val) {
    //NMEA format to S format decimal (99999.9999)
    val = parseFloat(val);
    let d = Math.floor(val / 100.0);
    let m = Math.floor((val / 100.0 - d) * 100.0 / 60);
    let s = ((val / 100.0 - d) * 100.0 - m) * 60 / (60 * 60);
    return (d + m + s) / (1.0 / 60.0 / 60.0);
  }
}

if (true) {
  module.exports = GYSFDMAXB;
}

/***/ }),

/***/ "./parts/Grove/Grove_EarHeartRate/index.js":
/*!*************************************************!*\
  !*** ./parts/Grove/Grove_EarHeartRate/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class Grove_EarHeartRate {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['vcc', 'gnd'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      signal: 'signal'
    };

    this.interval = 5;
    this.duration = 2.5 * 1000;
  }

  static info() {
    return {
      name: 'Grove_EarHeartRate'
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
      duration: this.duration
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
        between = (edges[1] - edges[0]) * this.interval / 1000.0;
        pulseMin = 60 / between;
        callback(pulseMin);
      }
    };
  }

  getWait() {
    return new Promise(resolve => {
      this.start(rate => {
        resolve(rate);
      });
    });
  }
}

if (true) {
  module.exports = Grove_EarHeartRate;
}

/***/ }),

/***/ "./parts/Grove/Grove_MP3/index.js":
/*!****************************************!*\
  !*** ./parts/Grove/Grove_MP3/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Grove_MP3 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'mp3_rx', 'mp3_tx'];
    this.requiredKeys = ['mp3_rx', 'mp3_tx'];

    this.ioKeys = this.keys;
    this.displayName = 'MP3';
    this.displayIoNames = { mp3_rx: 'MP3Rx', mp3_tx: 'MP3Tx' };
  }

  static info() {
    return {
      name: 'Grove_MP3'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.my_tx = this.params.mp3_rx;
    this.my_rx = this.params.mp3_tx;

    this.uart = this.obniz.getFreeUart();
  }

  initWait(strage) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.uart.start({
        tx: _this.my_tx,
        rx: _this.my_rx,
        baud: 9600
      });
      yield _this.obniz.wait(100);
      _this.uartSend(0x0c, 0);
      yield _this.obniz.wait(500);
      _this.uartSend(0x0b, 0);
      yield _this.obniz.wait(100);

      if (strage) {
        if (strage == 'usb') {
          _this.uartSend(0x09, 1);
        } else if (strage == 'sd') {
          _this.uartSend(0x09, 2);
        }
      } else {
        _this.uartSend(0x09, 2);
      }
      yield _this.obniz.wait(200);
    })();
  }

  setVolume(vol) {
    if (vol >= 0 && vol <= 31) {
      this.uartSend(0x06, vol);
    }
  }

  volUp() {
    this.uartSend(0x04, 0);
  }

  volDown() {
    this.uartSend(0x05, 0);
  }

  play(track, folder) {
    //if (!folder) folder = {};
    if (folder) {
      this.uart.send([0x7e, 0xff, 0x06, 0x0f, 0x00, folder, track, 0xef]);
    } else {
      // Play 'MP3' folder
      this.uartSend(0x12, track);
    }
  }

  stop() {
    this.uartSend(0x16, 0);
  }

  pause() {
    this.uartSend(0x0e, 0);
  }

  resume() {
    this.uartSend(0x0d, 0);
  }

  next() {
    this.uartSend(0x01, 0);
  }

  prev() {
    this.uartSend(0x02, 0);
  }

  uartSend(command, param) {
    let paramM = param >> 8;
    let paramL = param & 0xff;
    this.uart.send([0x7e, 0xff, 0x06, command, 0x01, paramM, paramL, 0xef]);
    let response = this.uart.readBytes();
    return response;
    //return response;
  }
}
if (true) {
  module.exports = Grove_MP3;
}

/***/ }),

/***/ "./parts/GyroSensor/ENC03R_Module/index.js":
/*!*************************************************!*\
  !*** ./parts/GyroSensor/ENC03R_Module/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ENC03R_Module {
  constructor() {
    this.keys = ['vcc', 'out1', 'out2', 'gnd'];
    this.required = ['out1', 'out2'];
    this.Sens = 0.00067; //Sensitivity, 0.67mV / deg/sec
  }

  static info() {
    return {
      name: 'ENC03R_Module'
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

  get1Wait() {
    var _this = this;

    return new Promise((() => {
      var _ref = _asyncToGenerator(function* (resolve) {
        let value = _this.ad0.getWait();
        _this.sens1 = (value - 1.45) / _this.Sens;
        resolve(_this.sens1);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
  }

  get2Wait() {
    var _this2 = this;

    return new Promise((() => {
      var _ref2 = _asyncToGenerator(function* (resolve) {
        let value = _this2.ad1.getWait();
        _this2.sens2 = (value - 1.35) / _this2.Sens;
        resolve(_this2.sens2);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
  }
}

if (true) {
  module.exports = ENC03R_Module;
}

/***/ }),

/***/ "./parts/Infrared/IRModule/index.js":
/*!******************************************!*\
  !*** ./parts/Infrared/IRModule/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class IRModule {
  constructor() {
    this.keys = ['recv', 'vcc', 'send', 'gnd'];
    this.requiredKeys = ['recv', 'send'];
  }

  static info() {
    return {
      name: 'IRModule'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    if (!obniz.isValidIO(this.params.recv)) {
      throw new Error('recv is not valid io');
    }

    if (!obniz.isValidIO(this.params.send)) {
      throw new Error('send is not valid io');
    }

    this.sensor = obniz.wired('IRSensor', {
      output: this.params.recv
    });
    this.setGetterSetter('sensor', 'duration');
    this.setGetterSetter('sensor', 'dataInverted');
    this.setGetterSetter('sensor', 'cutTail');
    this.setGetterSetter('sensor', 'output_pullup');
    this.setGetterSetter('sensor', 'ondetect');

    this.led = obniz.wired('InfraredLED', {
      anode: this.params.send
    });
  }

  //link
  send(arr) {
    this.led.send(arr);
  }

  start(callback) {
    this.sensor.start(callback);
  }

  get dataSymbolLength() {
    return this.sensor.dataSymbolLength;
  }

  set dataSymbolLength(x) {
    this.sensor.dataSymbolLength = x;
    this.led.dataSymbolLength = x;
  }

  setGetterSetter(partsName, varName) {
    Object.defineProperty(this, varName, {
      get() {
        return this[partsName][varName];
      },
      set(x) {
        this[partsName][varName] = x;
      }
    });
  }
}

if (true) {
  module.exports = IRModule;
}

/***/ }),

/***/ "./parts/Infrared/IRSensor/index.js":
/*!******************************************!*\
  !*** ./parts/Infrared/IRSensor/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class IRSensor {
  constructor() {
    this.keys = ['output', 'vcc', 'gnd'];
    this.requiredKeys = ['output'];

    this.dataSymbolLength = 0.07;
    this.duration = 500; // 500msec
    this.dataInverted = true;
    this.triggerSampleCount = 16; // If Signal arrives more than this count. then treat as signal
    this.cutTail = false;
    this.output_pullup = true;
  }

  static info() {
    return {
      name: 'IRSensor'
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
      triggerValueSamples: this.triggerSampleCount
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

/***/ "./parts/Infrared/InfraredLED/index.js":
/*!*********************************************!*\
  !*** ./parts/Infrared/InfraredLED/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class InfraredLED {
  constructor() {
    this.keys = ['anode', 'cathode'];
    this.requiredKeys = ['anode'];

    this.dataSymbolLength = 0.07;
  }

  static info() {
    return {
      name: 'InfraredLED'
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
    this.obniz.wait(150); // TODO: this is instant fix for pwm start delay
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

/***/ "./parts/Light/FullColorLED/index.js":
/*!*******************************************!*\
  !*** ./parts/Light/FullColorLED/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
      name: 'FullColorLED'
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
      this.obniz.error('FullColorLED param need common type [  anode_common or cathode_common ] ');
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
    this.pwmR.duty(r / 255 * 100);
    this.pwmG.duty(g / 255 * 100);
    this.pwmB.duty(b / 255 * 100);
  }

  hsv(h, s, v) {
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs(Hp % 2 - 1));

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
        state: function (index) {
          // index = 0
          this.hsv(index * 10 * 2, 1, 1);
        }.bind(this)
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

/***/ "./parts/Light/LED/index.js":
/*!**********************************!*\
  !*** ./parts/Light/LED/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class LED {
  constructor() {
    this.keys = ['anode', 'cathode'];
    this.requiredKeys = ['anode'];
  }

  static info() {
    return {
      name: 'LED'
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
    let frames = [{
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

    this.obniz.io.animation(this.animationName, 'loop', frames);
  }
}

if (true) {
  module.exports = LED;
}

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
    this.keys = ['din', 'vcc', 'gnd'];
    this.requiredKeys = ['din'];
  }

  static info() {
    return {
      name: 'WS2811'
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
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs(Hp % 2 - 1));

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
      bytes = bytes.concat(WS2811._generateColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2811._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }
}

if (true) {
  module.exports = WS2811;
}

/***/ }),

/***/ "./parts/Light/WS2812/index.js":
/*!*************************************!*\
  !*** ./parts/Light/WS2812/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class WS2812 {
  constructor() {
    this.keys = ['din', 'vcc', 'gnd'];
    this.requiredKeys = ['din'];
  }

  static info() {
    return {
      name: 'WS2812'
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
    let array = WS2812._generateFromByte(g);
    array = array.concat(WS2812._generateFromByte(r));
    array = array.concat(WS2812._generateFromByte(b));
    return array;
  }

  static _generateHsvColor(h, s, v) {
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs(Hp % 2 - 1));

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
      bytes = bytes.concat(WS2812._generateColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2812._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }
}

if (true) {
  module.exports = WS2812;
}

/***/ }),

/***/ "./parts/Light/WS2812B/index.js":
/*!**************************************!*\
  !*** ./parts/Light/WS2812B/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class WS2812B {
  constructor() {
    this.keys = ['din', 'vcc', 'gnd'];
    this.requiredKeys = ['din'];
  }

  static info() {
    return {
      name: 'WS2812B'
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
    let array = WS2812B._generateFromByte(g);
    array = array.concat(WS2812B._generateFromByte(r));
    array = array.concat(WS2812B._generateFromByte(b));
    return array;
  }

  static _generateHsvColor(h, s, v) {
    let C = v * s;
    let Hp = h / 60;
    let X = C * (1 - Math.abs(Hp % 2 - 1));

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
      bytes = bytes.concat(WS2812B._generateColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

  hsvs(array) {
    let bytes = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray = array[i];
      bytes = bytes.concat(WS2812B._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }
}

if (true) {
  module.exports = WS2812B;
}

/***/ }),

/***/ "./parts/Logic/SNx4HC595/index.js":
/*!****************************************!*\
  !*** ./parts/Logic/SNx4HC595/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class SNx4HC595 {
  constructor() {
    /* http://www.ti.com/lit/ds/symlink/sn74hc595.pdf */
    this.keys = ['gnd', 'vcc', 'ser', 'srclk', 'rclk', 'oe', 'srclr', 'io_num', 'enabled'];
    this.requiredKeys = ['ser', 'srclk', 'rclk'];

    this.autoFlash = true;
  }

  static info() {
    return {
      name: 'SNx4HC595'
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

    if (this.obniz.isValidIO(this.params.vcc) || this.obniz.isValidIO(this.params.gnd)) {
      this.obniz.wait(100);
    }

    if (typeof this.params.io_num !== 'number') {
      this.params.io_num = 8;
    }
    this.ioNum(this.params.io_num);

    if (typeof this.params.enabled !== 'boolean') {
      this.params.enabled = true;
    }
    if (this.io_oe && this.params.enabled) {
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
/*!***************************************!*\
  !*** ./parts/Memory/24LC256/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class _24LC256 {
  constructor() {
    this.requiredKeys = ['address'];
    this.keys = ['sda', 'scl', 'clock', 'pull', 'i2c', 'address'];
  }

  static info() {
    return {
      name: '24LC256'
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
    array.push(address >> 8 & 0xff);
    array.push(address & 0xff);
    array.push.apply(array, data);
    this.i2c.write(0x50, array);
    this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
  }

  getWait(address, length) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let array = [];
      array.push(address >> 8 & 0xff);
      array.push(address & 0xff);
      _this.i2c.write(0x50, array);
      return yield _this.i2c.readWait(0x50, length);
    })();
  }
}

if (true) {
  module.exports = _24LC256;
}

/***/ }),

/***/ "./parts/MovementSensor/Button/index.js":
/*!**********************************************!*\
  !*** ./parts/MovementSensor/Button/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Button {
  constructor() {
    this.keys = ['signal', 'gnd'];
    this.required = ['signal'];

    this.onChangeForStateWait = function () {};
  }

  static info() {
    return {
      name: 'Button'
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
    this.io_signal.input(function (value) {
      self.isPressed = value === false;
      if (self.onchange) {
        self.onchange(value === false);
      }
      self.onChangeForStateWait(value === false);
    });
  }

  isPressedWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let ret = yield _this.io_signal.inputWait();
      return ret === false;
    })();
  }

  stateWait(isPressed) {
    return new Promise((resolve, reject) => {
      this.onChangeForStateWait = pressed => {
        if (isPressed == pressed) {
          this.onChangeForStateWait = function () {};
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

/***/ "./parts/MovementSensor/FlickHat/index.js":
/*!************************************************!*\
  !*** ./parts/MovementSensor/FlickHat/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class FlickHat {
  constructor() {
    this.keys = ['vcc', 'gnd', 'sda', 'scl', 'reset', 'ts', 'led1', 'led2'];
    this.requiredKeys = ['gnd', 'sda', 'scl', 'reset', 'ts'];

    this.displayIoNames = {
      //vcc: 'vcc', //5v
      sda: 'sda',
      scl: 'scl',
      gnd: 'gnd',
      reset: 'reset',
      ts: 'ts'
    };
  }

  static info() {
    return {
      name: 'FlickHat'
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.address = 0x42;

    if (this.obniz.isValidIO(this.params.vcc)) {
      this.obniz.getIO(this.params.vcc).drive('5v');
      this.obniz.getIO(this.params.vcc).output(true);
    }
    this.obniz.getIO(this.params.gnd).output(false);

    this.io_reset = this.obniz.getIO(this.params.reset);
    this.io_reset.drive('3v');

    this.io_ts = this.obniz.getIO(this.params.ts);
    this.io_ts.drive('open-drain');
    this.io_ts.pull('3v');

    this.params.mode = 'master';
    this.params.pull = '3v';
    this.params.clock = 100 * 1000; //100KHz

    //PeripheralI2C
    this.i2c = this.obniz.getI2CWithConfig(this.params);

    if (this.obniz.isValidIO(this.params.led1)) {
      this.led1 = this.obniz.wired('LED', { anode: this.params.led1 });
    }
    if (this.obniz.isValidIO(this.params.led2)) {
      this.led2 = this.obniz.wired('LED', { anode: this.params.led2 });
    }
  }

  start(callbackFwInfo) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.io_ts.pull('3v');

      _this.io_reset.output(false);
      yield _this.obniz.wait(50);
      _this.io_reset.output(true);
      yield _this.obniz.wait(50);

      _this.onfwinfo = callbackFwInfo;
      _this.fwInfo = {
        fwValid: 0,
        fwInfoReceived: false
      };
      _this.rotation = 0;
      _this.lastRotation = 0;
      _this.readSize = 132;

      yield _this.polling();
      yield _this.obniz.wait(200);

      _this.i2c.write(_this.address, [0x10, 0x00, 0x00, 0xa2, 0xa1, 0x00, 0x00, 0x00, 0x1f, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);
      yield _this.obniz.wait(100);

      _this.i2c.write(_this.address, [0x10, 0x00, 0x00, 0xa2, 0x80, 0x00, 0x00, 0x00, 0x3f, 0x00, 0x00, 0x00, 0x3f, 0x00, 0x00, 0x00]);
    })();
  }

  _dataArray2string(data) {
    let result = '';
    for (let n of data) {
      result += String.fromCharCode(n);
    }
    return result;
  }

  polling(timeout) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      timeout = timeout || 3000; //default: 3s

      //DataOutputConfigMask	2byte
      // const maskDSPStatus = 1;
      const maskGestureInfo = 1 << 1;
      const maskTouchInfo = 1 << 2;
      const maskAirWheelInfo = 1 << 3;
      const maskXYZPosition = 1 << 4;

      //SystemInfo	1byte
      const sysPositionValid = 1;
      const sysAirWheelValid = 1 << 1;
      // const sysDSPRunning = 1 << 7;

      let startTime = new Date();
      let ts = true;
      while (ts && new Date() - startTime < timeout) ts = yield _this2.io_ts.inputWait();
      if (!ts) {
        _this2.io_ts.pull('0v');
        //await this.obniz.wait(1);

        let data = yield _this2.i2c.readWait(_this2.address, _this2.readSize);
        let size = data[0];
        // let flag = data[1];
        let seq = data[2];
        let msgID = data[3];

        if (size != 0xff && size > 0) {
          if (_this2.debugprint || _this2.obniz.debugprint) {
            console.log('flickHat: ' + data.slice(0, size).map(function (v) {
              return '0x' + v.toString(16);
            }));
          }
          let configmask, sysinfo, gesture, touch, airwheel, statusInfo, fwInfo;
          switch (msgID) {
            case 0x91:
              //sensor data output
              configmask = data[4] | data[5] << 8; //little endian
              // let timestamp = data[6]; // 200hz, 8-bit counter, max ~1.25sec
              sysinfo = data[7];
              // let dspstatus = data.slice(8, 10);
              gesture = data.slice(10, 14);
              touch = data.slice(14, 18);
              airwheel = data.slice(18, 20);
              // let xyz = data.slice(20, 26);
              // let noisepow = data.slice(27, 30);
              if (gesture[0] == 255 && gesture[1] == 255 && gesture[2] == 255 && gesture[3] == 255) break;

              if (configmask & maskXYZPosition && sysinfo & sysPositionValid) {
                let xyz = {
                  //little endian
                  x: (data[20] | data[21] << 8) / 65536,
                  y: (data[22] | data[23] << 8) / 65536,
                  z: (data[24] | data[25] << 8) / 65536,
                  seq: seq
                };
                _this2.xyz = xyz;
                if (typeof _this2.onxyz == 'function') _this2.onxyz(xyz);
              }

              if (configmask & maskGestureInfo && gesture[0] > 0) {
                _this2.lastGesture = gesture[0];
                const gestures = [['', '', ''], //no gesture
                ['garbage', '', ''], ['flick', 'west', 'east'], //2
                ['flick', 'east', 'west'], //3
                ['flick', 'south', 'north'], //4
                ['flick', 'north', 'south'], //5
                ['circle', 'clockwise', ''], ['circle', 'counter-clockwise', ''][('wave', 'x', '')], ['wave', 'y', ''], ['hold', '', '']];
                for (let index in gestures) {
                  if (index == gesture[0] && typeof _this2.ongestureall == 'function') _this2.ongestureall({
                    action: gestures[index][0],
                    from: gestures[index][1],
                    to: gestures[index][2],
                    raw: gesture,
                    seq: seq
                  });
                  if (index == gesture[0] && gestures[index][0] == 'flick' && typeof _this2.ongesture == 'function') _this2.ongesture({
                    action: 'gesture',
                    from: gestures[index][1],
                    to: gestures[index][2],
                    raw: gesture,
                    seq: seq
                  });
                }
              }

              if (configmask & maskTouchInfo && !(touch[0] == 0 && touch[1] == 0) && touch[3] == 0) {
                //console.log('touch: ' + touch.map(v => '0x' + v.toString(16)));
                let touchAction = touch[0] | touch[1] << 8; //little endian
                if (touchAction == 0xffff) break;
                // let touchCount = touch[2] * 5; // touch counter value * 5[ms]
                const actions = [['touch', 'south'], //0
                ['touch', 'west'], //1
                ['touch', 'north'], //2
                ['touch', 'east'], //3
                ['touch', 'center'], //4
                ['tap', 'south'], //5
                ['tap', 'west'], //6
                ['tap', 'north'], //7
                ['tap', 'east'], //8
                ['tap', 'center'], //9
                ['doubletap', 'south'], //10
                ['doubletap', 'west'], //11
                ['doubletap', 'north'], //12
                ['doubletap', 'east'], //13
                ['doubletap', 'center']];

                let touches = [];
                let taps = [];
                let doubletaps = [];
                _this2.lastTouch = touchAction;

                let comp = 1;
                for (let index in actions) {
                  let value = actions[index];
                  if (touchAction & comp) {
                    //console.log(`touchAction:${touchAction.toString(16)}, comp:${comp.toString(16)}, index:${index}, group:${group}`);
                    switch (value[0]) {
                      case 'touch':
                        touches.push(value[1]);
                        break;
                      case 'tap':
                        taps.push(value[1]);
                        break;
                      case 'doubletap':
                        doubletaps.push(value[1]);
                        break;
                      default:
                    }
                  }
                  comp <<= 1;
                }

                if (touches.length > 0 && typeof _this2.ontouch == 'function') _this2.ontouch({
                  action: 'touch',
                  positions: touches,
                  raw: touch,
                  seq: seq
                });

                if (taps.length > 0 && typeof _this2.ontap == 'function') _this2.ontap({
                  action: 'tap',
                  positions: taps,
                  raw: touch,
                  seq: seq
                });

                if (doubletaps.length > 0 && typeof _this2.ondoubletap == 'function') _this2.ondoubletap({
                  action: 'doubletap',
                  positions: doubletaps,
                  raw: touch,
                  seq: seq
                });
              }

              if (configmask & maskAirWheelInfo && sysinfo & sysAirWheelValid) {
                let delta = (airwheel[0] - _this2.lastRotation) / 32.0;
                _this2.rotation += delta * 360.0;
                _this2.rotation %= 360;
                if (delta != 0 && delta > -0.5 && delta < 0.5) {
                  if (typeof _this2.onairwheel == 'function') _this2.onairwheel({
                    delta: delta * 360.0,
                    rotation: _this2.rotation,
                    raw: airwheel,
                    seq: seq
                  });
                }
                _this2.lastRotation = airwheel[0];
              }
              break;

            case 0x15:
              //system status
              statusInfo = {
                msgId: data[4],
                maxCmdSize: data[5],
                error: data[6] | data[7] << 8 //little endian
              };
              _this2.statusInfo = statusInfo;
              if (_this2.debugprint || _this2.obniz.debugprint) {
                console.log(`flickHat: system status: {msgId: ${statusInfo.msgId}, maxCmdSize: ${statusInfo.maxCmdSize}, error: ${statusInfo.error}}`);
              }
              break;

            case 0x83:
              // farmware information
              fwInfo = {
                fwValid: data[4] == 0xaa,
                hwRev: [data[5], data[6]],
                paramStartAddr: data[7] * 128,
                libLoaderVer: [data[8], data[9]],
                libLoaderPlatform: data[10],
                fwStartAddr: data[11] * 128,
                fwVersion: _this2._dataArray2string(data.slice(12, 132)).split('\0')[0],
                fwInfoReceived: true
              };
              _this2.fwInfo = fwInfo;
              if (typeof _this2.onfwinfo == 'function') _this2.onfwinfo(fwInfo);
              _this2.readSize = 26;
              break;

            default:
              console.error(`unknown message: 0x${msgID.toString(16)}, data:${data.slice(0, size).map(function (v) {
                return '0x' + v.toString(16);
              })}`);}
        }

        _this2.io_ts.pull('3v');
        //await this.obniz.wait(1);
      }
    })();
  }
}

if (true) {
  module.exports = FlickHat;
}

/***/ }),

/***/ "./parts/MovementSensor/HC-SR505/index.js":
/*!************************************************!*\
  !*** ./parts/MovementSensor/HC-SR505/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class HCSR505 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'HC-SR505'
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

  getWait() {
    return this.io_signal.inputWait();
  }
}

if (true) {
  module.exports = HCSR505;
}

/***/ }),

/***/ "./parts/MovementSensor/JoyStick/index.js":
/*!************************************************!*\
  !*** ./parts/MovementSensor/JoyStick/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
      name: 'JoyStick'
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
  }

  isPressedWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let ret = yield _this.io_sig_sw.inputWait();
      return ret === false;
    })();
  }

  getXWait() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let value = yield _this2.ad_x.getWait();
      _this2.positionX = value / 5.0;
      return _this2.positionX * 2 - 1;
    })();
  }

  getYWait() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let value = yield _this3.ad_y.getWait();
      _this3.positionY = value / 5.0;
      return _this3.positionY * 2 - 1;
    })();
  }
}

if (true) {
  module.exports = JoyStick;
}

/***/ }),

/***/ "./parts/MovementSensor/KXR94-2050/index.js":
/*!**************************************************!*\
  !*** ./parts/MovementSensor/KXR94-2050/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class KXR94_2050 {
  constructor() {
    this.keys = ['x', 'y', 'z', 'vcc', 'gnd', 'enable', 'self_test'];
    this.requiredKeys = ['x', 'y', 'z'];
  }

  static info() {
    return {
      name: 'KXR94-2050'
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
      obniz.display.setPinName(this.params.enable, 'KXR94_2050', 'E');
    }
    if (obniz.isValidIO(this.params.self_test)) {
      obniz.getIO(this.params.self_test).drive('5v');
      obniz.getIO(this.params.self_test).output(false);
      obniz.display.setPinName(this.params.self_test, 'KXR94_2050', 'T');
    }

    this.changeVccVoltage(5);

    this.ad_x.start(value => {
      this._x_val = value;
      if (this.onChangeX) {
        this.onChangeX(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    this.ad_y.start(value => {
      this._y_val = value;
      if (this.onChangeY) {
        this.onChangeY(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    this.ad_z.start(value => {
      this._z_val = value;
      if (this.onChangeZ) {
        this.onChangeZ(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
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
  }

  changeVccVoltage(pwrVoltage) {
    this.sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
    this.offsetVoltage = pwrVoltage / 2; //Set offset voltage (Output voltage at 0g, unit:V)
  }

  voltage2gravity(volt) {
    return (volt - this.offsetVoltage) / this.sensitivity;
  }

  get() {
    return this._get();
  }

  _get() {
    return {
      x: this.voltage2gravity(this._x_val),
      y: this.voltage2gravity(this._y_val),
      z: this.voltage2gravity(this._z_val)
    };
  }

  getWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._x_val = yield _this.ad_x.getWait();
      _this._y_val = yield _this.ad_y.getWait();
      _this._z_val = yield _this.ad_z.getWait();

      return _this._get();
    })();
  }
}

if (true) {
  module.exports = KXR94_2050;
}

/***/ }),

/***/ "./parts/MovementSensor/KXSC7-2050/index.js":
/*!**************************************************!*\
  !*** ./parts/MovementSensor/KXSC7-2050/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class KXSC7_2050 {
  constructor() {
    this.keys = ['x', 'y', 'z', 'vcc', 'gnd'];
    this.requiredKeys = ['x', 'y', 'z'];
  }

  static info() {
    return {
      name: 'KXSC7_2050'
    };
  }

  wired(obniz) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.obniz = obniz;

      obniz.setVccGnd(_this.params.vcc, _this.params.gnd, '3v');
      _this.ad_x = obniz.getAD(_this.params.x);
      _this.ad_y = obniz.getAD(_this.params.y);
      _this.ad_z = obniz.getAD(_this.params.z);

      yield obniz.wait(500);
      let ad = obniz.getAD(_this.params.vcc);
      let pwrVoltage = yield ad.getWait();
      let horizontalZ = yield _this.ad_z.getWait();
      let sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
      let offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)

      let self = _this;
      _this.ad_x.start(function (value) {
        self.gravity = (value - offsetVoltage) / sensitivity;
        if (self.onchangex) {
          self.onchangex(self.gravity);
        }
      });

      _this.ad_y.start(function (value) {
        self.gravity = (value - offsetVoltage) / sensitivity;
        if (self.onchangey) {
          self.onchangey(self.gravity);
        }
      });

      _this.ad_z.start(function (value) {
        self.gravity = (value - offsetVoltage) / sensitivity;
        if (self.onchangez) {
          self.onchangez(self.gravity);
        }
      });
    })();
  }
}

if (true) {
  module.exports = KXSC7_2050;
}

/***/ }),

/***/ "./parts/MovementSensor/PaPIRsVZ/index.js":
/*!************************************************!*\
  !*** ./parts/MovementSensor/PaPIRsVZ/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class PaPIRsVZ {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'PaPIRsVZ'
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
/*!*****************************************************!*\
  !*** ./parts/MovementSensor/Potentiometer/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class Potentiometer {
  constructor() {
    this.keys = ['pin0', 'pin1', 'pin2'];
    this.reuiredKeys = ['pin0', 'pin1', 'pin2'];

    this.vcc_voltage = 5.0;
  }

  static info() {
    return {
      name: 'Potentiometer'
    };
  }

  wired(obniz) {
    this.obniz.setVccGnd(this.params.pin0, this.params.pin2, '5v');
    this.ad = obniz.getAD(this.params.pin1);

    let self = this;

    obniz.getAD(this.params.pin0).start(function (value) {
      self.vcc_voltage = value;
    });

    this.ad.start(function (value) {
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
/*!***************************************!*\
  !*** ./parts/Moving/DCMotor/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class DCMotor {
  constructor() {
    this.keys = ['forward', 'back'];
    this.requiredKeys = ['forward', 'back'];
  }

  static info() {
    return {
      name: 'DCMotor'
    };
  }

  wired(obniz) {
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

/***/ "./parts/Moving/PCA9685/index.js":
/*!***************************************!*\
  !*** ./parts/Moving/PCA9685/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class PCA9685 {
  constructor() {
    /* https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf */
    this.keys = ['gnd', 'vcc', 'scl', 'sda', 'oe', 'i2c', 'enabled', 'address', 'drive'];
    this.requiredKeys = [];

    this.address = 0x40;

    this._commands = {
      MODE1: 0x00,
      MODE2: 0x01,
      SUBADR1: 0x02,
      SUBADR2: 0x03,
      SUBADR3: 0x04,
      PRESCALE: 0xfe,
      LED0_ON_L: 0x06,
      ALL_LED_ON_L: 0xfa,
      bits: {
        ALLCALL: 0x01,
        SLEEP_ENABLE: 0x10,
        AUTO_INCREMENT_ENABLED: 0x20,
        RESTART: 0x80,

        OUTDRV: 0x04,
        INVRT: 0x10
      }
    };

    this._regs = new Array(1);

    this.pwmNum = 16;
    this.pwms = [];
    this._preparePWM(this.pwmNum);
  }

  static info() {
    return {
      name: 'PCA9685'
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.oe)) {
      this.io_oe = obniz.getIO(this.params.oe);
    }

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    if (typeof this.params.address === 'number') {
      this.address = this.params.address;
    }

    this.params.clock = this.params.clock || 400 * 1000; //for i2c
    this.params.mode = this.params.mode || 'master'; //for i2c
    this.params.pull = this.params.pull || '5v'; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);

    if (this.obniz.isValidIO(this.params.srclr)) {
      this.io_srclr = this.obniz.getIO(this.params.srclr);
      this.io_srclr.output(true);
    }

    if (typeof this.params.enabled !== 'boolean') {
      this.params.enabled = true;
    }
    if (this.io_oe && this.params.enabled) {
      this.io_oe.output(false);
    }

    if (this.params.drive === 'open-drain') {
      this.i2c.write(this.address, [this._commands.MODE2, this._commands.bits.OUTDRV]);
    }

    let mode1 = this._commands.bits.AUTO_INCREMENT_ENABLED;
    mode1 = mode1 & ~this._commands.bits.SLEEP_ENABLE;
    this.i2c.write(this.address, [this._commands.MODE1, mode1]);
    this.i2c.write(this.address, [this._commands.MODE1, mode1 | this._commands.bits.RESTART]);

    this._regs[this._commands.MODE1] = mode1;

    obniz.wait(10);
  }

  _preparePWM(num) {
    class PCA9685_PWM {
      constructor(chip, id) {
        this.chip = chip;
        this.id = id;
        this.value = 0;
        this.state = {};
      }

      freq(frequency) {
        this.chip.freq(frequency);
      }
      pulse(value) {
        this.chip.pulse(this.id, value);
      }
      duty(value) {
        this.chip.duty(this.id, value);
      }
    }

    for (let i = 0; i < num; i++) {
      this.pwms.push(new PCA9685_PWM(this, i));
    }
  }

  isValidPWM(id) {
    return typeof id === 'number' && id >= 0 && id < this.pwmNum;
  }

  getPWM(id) {
    if (!this.isValidPWM(id)) {
      throw new Error('pwm ' + id + ' is not valid pwm');
    }
    return this.pwms[id];
  }

  freq(frequency) {
    if (typeof frequency !== 'number') {
      return;
    }
    if (frequency < 24 || 1526 < frequency) {
      throw new Error('freq must be within 24-1526 hz');
    }
    if (this._freq === frequency) {
      return;
    }
    let prescaleval = 25000000.0; // 25MHz
    prescaleval /= 4096.0; //12bit
    prescaleval /= frequency * 0.9;
    prescaleval -= 1.0;

    const prescale = parseInt(Math.floor(prescaleval + 0.5));
    const mode1 = this._regs[this._commands.MODE1];

    this.i2c.write(this.address, [this._commands.MODE1, mode1 & 0x7f | this._commands.bits.SLEEP_ENABLE]); // enter sleep
    this.i2c.write(this.address, [this._commands.PRESCALE, prescale]);
    this.i2c.write(this.address, [this._commands.MODE1, mode1]); // recover from sleep

    this.obniz.wait(5);

    // save
    this._freq = frequency;
    for (let i = 0; i < this.pwms.length; i++) {
      this.pwms[i].state.freq = this._freq;
    }
  }

  pulse(id, pulse_width) {
    if (typeof this._freq !== 'number' || this._freq <= 0) {
      throw new Error('please provide freq first.');
    }
    this.duty(id, pulse_width / 1000.0 / (1.0 / this._freq) * 100);
  }

  duty(id, duty) {
    duty *= 1.0;
    if (typeof this._freq !== 'number' || this._freq <= 0) {
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
    this.getPWM(id).state.duty = duty;
    this.writeSingleONOFF(id, 0, duty / 100.0 * 4095);
  }

  writeSingleONOFF(id, on, off) {
    this.i2c.write(this.address, [this._commands.LED0_ON_L + 4 * id, on & 0xff, on >> 8, off & 0xff, off >> 8]);
  }

  setEnable(enable) {
    if (!this.io_oe && enable == false) {
      throw new Error('pin "oe" is not specified');
    }
    this.io_oe.output(!enable);
  }
}

if (true) {
  module.exports = PCA9685;
}

/***/ }),

/***/ "./parts/Moving/ServoMotor/index.js":
/*!******************************************!*\
  !*** ./parts/Moving/ServoMotor/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class ServoMotor {
  constructor() {
    this.keys = ['gnd', 'vcc', 'signal', 'pwm'];
    this.requiredKeys = [];

    this.range = {
      min: 0.5,
      max: 2.4
    };
  }

  static info() {
    return {
      name: 'ServoMotor'
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    if (obniz.isValidIO(this.params.vcc)) {
      this.io_vcc = obniz.getIO(this.params.vcc);
    }

    if (this.params.pwm) {
      this.pwm = this.params.pwm;
    } else {
      this.pwm = obniz.getFreePwm();
      this.pwm_io_num = this.params.signal;
      this.pwm.start({ io: this.pwm_io_num });
    }
    this.pwm.freq(50);
  }

  // Module functions

  angle(ratio) {
    let max = this.range.max;
    let min = this.range.min;
    let val = (max - min) * ratio / 180.0 + min;
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
/*!****************************************!*\
  !*** ./parts/Moving/Solenoid/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class Solenoid {
  constructor() {
    this.keys = ['gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'Solenoid'
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
/*!***********************************************!*\
  !*** ./parts/PressureSensor/FSR-40X/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//Todo: add weight and calc pressure(kg)

class FSR40X {
  constructor() {
    this.keys = ['pin0', 'pin1'];
    this.requiredKeys = ['pin0', 'pin1'];
  }

  static info() {
    return {
      name: 'FSR40X'
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.io_pwr = obniz.getIO(this.params.pin0);
    this.ad = obniz.getAD(this.params.pin1);

    this.io_pwr.drive('5v');
    this.io_pwr.output(true);

    let self = this;
    this.ad.start(function (value) {
      let pressure = value * 100;
      self.press = pressure;
      if (self.onchange) {
        self.onchange(self.press);
      }
    });
  }

  getWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let value = yield _this.ad.getWait();
      let pressure = value * 100;
      _this.press = pressure;
      return _this.press;
    })();
  }
}

if (true) {
  module.exports = FSR40X;
}

/***/ }),

/***/ "./parts/SoilSensor/SEN0114/index.js":
/*!*******************************************!*\
  !*** ./parts/SoilSensor/SEN0114/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class SEN0114 {
  constructor() {
    this.keys = ['vcc', 'output', 'gnd'];
    this.requiredKeys = ['output'];
  }

  static info() {
    return {
      name: 'SEN0114'
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

  getHumidityWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.value = yield _this.ad.getWait();
      return _this.value;
    })();
  }
}

if (true) {
  module.exports = SEN0114;
}

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
    this.keys = ['signal', 'gnd'];
    this.requiredKeys = ['gnd'];
  }

  static info() {
    return {
      name: 'Speaker'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(null, this.params.gnd, '5v');
    this.pwm = obniz.getFreePwm();
    this.pwm.start({ io: this.params.signal });
  }

  play(freq) {
    if (typeof freq !== 'number') {
      throw new Error('freq must be a number');
    }
    freq = parseInt(freq); // temporary
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

if (true) {
  module.exports = Speaker;
}

/***/ }),

/***/ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js":
/*!******************************************************************!*\
  !*** ./parts/TemperatureSensor/analog/AnalogTempratureSensor.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

    this.ad.start(function (voltage) {
      this.temp = this.calc(voltage);
      this.onchange(this.temp);
    }.bind(this));
  }

  getWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let voltage = yield _this.ad.getWait();
      _this.temp = _this.calc(voltage);
      return _this.temp;
    })();
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
  static info() {
    return {
      name: 'LM35DZ'
    };
  }
}

if (true) {
  module.exports = LM35DZ;
}

/***/ }),

/***/ "./parts/TemperatureSensor/analog/LM60/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/analog/LM60/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class LM60 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'output'];
    this.requiredKeys = ['output'];
  }

  static info() {
    return {
      name: 'LM60'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.ad = obniz.getAD(this.params.output);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    let self = this;
    this.ad.start(function (value) {
      self.temp = Math.round((value - 0.424) / 0.00625 * 10) / 10; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
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
  static info() {
    return {
      name: 'LM61'
    };
  }
}

if (true) {
  module.exports = LM61;
}

/***/ }),

/***/ "./parts/TemperatureSensor/analog/LMT87/index.js":
/*!*******************************************************!*\
  !*** ./parts/TemperatureSensor/analog/LMT87/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");
class LMT87 extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage * 1000 - 2365) / -13.6 + 20; //20-50dc;
  }
  static info() {
    return {
      name: 'LMT87'
    };
  }
}

if (true) {
  module.exports = LMT87;
}

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

  static info() {
    return {
      name: 'MCP9700'
    };
  }
}

if (true) {
  module.exports = MCP9700;
}

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
  static info() {
    return {
      name: 'MCP9701'
    };
  }
}

if (true) {
  module.exports = MCP9701;
}

/***/ }),

/***/ "./parts/TemperatureSensor/analog/S8100B/index.js":
/*!********************************************************!*\
  !*** ./parts/TemperatureSensor/analog/S8100B/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

//sensor resopnse not found

class S8100B extends AnalogTemplatureSensor {
  calc(voltage) {
    return 30 + (1.508 - voltage) / -0.08; //Temp(Celsius) =
  }
  static info() {
    return {
      name: 'S8100B'
    };
  }
}

if (true) {
  module.exports = S8100B;
}

/***/ }),

/***/ "./parts/TemperatureSensor/analog/S8120C/index.js":
/*!********************************************************!*\
  !*** ./parts/TemperatureSensor/analog/S8120C/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AnalogTemplatureSensor = __webpack_require__(/*! ../AnalogTempratureSensor */ "./parts/TemperatureSensor/analog/AnalogTempratureSensor.js");

//this not work, but sometimes good
//resason1:too low of obniz input Impedance ?
//resoson2:Is the sensor oscillating?

class S8120C extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 1.474) / -0.0082 + 30; //Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
  }
  static info() {
    return {
      name: 'S8120C'
    };
  }
}

if (true) {
  module.exports = S8120C;
}

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/ADT7410/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/ADT7410/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ADT7410 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'sda', 'scl', 'addressMode'];
    this.requiredKeys = ['addressMode'];
  }

  static info() {
    return {
      name: 'ADT7410'
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

  getTempWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let ret = yield _this.i2c.readWait(_this.address, 2);
      let tempBin = ret[0] << 8;
      tempBin |= ret[1];
      tempBin = tempBin >> 3;

      if (tempBin & 0x1000) {
        tempBin = tempBin - 8192;
      }

      return tempBin / 16;
    })();
  }
}

if (true) {
  module.exports = ADT7410;
}

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/AMG8833/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/AMG8833/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class AMG8833 {
  constructor() {
    this.requiredKeys = [];
    this.keys = ['vcc', 'gnd', 'sda', 'scl', 'address'];

    this.ioKeys = ['vcc', 'gnd', 'sda', 'scl'];
    this.commands = {};
    this.commands.mode_normal = [0x00, 0x00];
    this.commands.reset_flag = [0x01, 0x30];
    this.commands.reset_initial = [0x01, 0x3f];
    this.commands.frameRate_10fps = [0x02, 0x00];
    this.commands.frameRate_1fps = [0x02, 0x01];
    this.commands.int_disable = [0x03, 0x00];
    this.commands.int_absVal = [0x03, 0x03];
    this.commands.int_diff = [0x03, 0x01];
    this.commands.stat = [0x04];
    this.commands.statClr_ovs = [0x05, 0x04];
    this.commands.statClr_int = [0x05, 0x02];
    this.commands.average_disable = [0x07, 0x00];
    this.commands.average_enable = [0x07, 0x10];
  }

  static info() {
    return {
      name: 'AMG8833'
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.address = 0x69;
    if (this.params.address === 0x69) {
      this.address = 0x69;
    } else if (this.params.addressmode === 0x68) {
      this.address = 0x68;
    } else if (this.params.address !== undefined) {
      throw new Error('address must be 0x68 or 0x69');
    }

    this.params.clock = this.params.clock || 400 * 1000; //for i2c
    this.params.mode = this.params.mode || 'master'; //for i2c
    this.params.pull = this.params.pull || null; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(50);

    obniz.i2c0.write(this.address, this.commands.mode_normal);
    obniz.i2c0.write(this.address, this.commands.reset_flag);
    obniz.i2c0.write(this.address, this.commands.frameRate_10fps);
    obniz.i2c0.write(this.address, this.commands.int_disable);
  }

  getOnePixWait(pixel) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let pixelAddrL = 0x80;
      let pixelAddrH = 0x81;
      if (pixel >= 0 && pixel <= 63) {
        pixelAddrL = 0x80 + pixel * 2;
        pixelAddrH = 0x81 + pixel * 2;
      } else {
        throw new Error('pixel number must be range of 0 to 63');
      }
      _this.i2c.write(_this.address, [pixelAddrL]);
      let dataL = yield _this.i2c.readWait(_this.address, 1);
      _this.i2c.write(_this.address, [pixelAddrH]);
      let dataH = yield _this.i2c.readWait(_this.address, 1);
      let temp12bit = dataH << 8 | dataL;
      if (dataH & 0x08) {
        // negative temperature
        temp12bit = temp12bit - 1;
        temp12bit = 0xfff - temp12bit; // bit inverting
        return temp12bit * -0.25;
      } else {
        // positive temperature
        return temp12bit * 0.25;
      }
    })();
  }

  getAllPixWait() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let tempArray = new Array(64);
      _this2.i2c.write(_this2.address, [0x80]);
      const datas = yield _this2.i2c.readWait(_this2.address, 64 * 2);

      for (let i = 0; i < 64; i++) {
        let temp12bit = datas[i * 2 + 1] << 8 | datas[i * 2];
        let temp = 0;
        if (datas[i * 2 + 1] & 0x08) {
          // negative temperature
          temp12bit = temp12bit - 1;
          temp12bit = 0xfff - temp12bit; // bit inverting
          temp = temp12bit * -0.25;
        } else {
          // positive temperature
          temp = temp12bit * 0.25;
        }
        tempArray[i] = temp;
      }

      return tempArray;
    })();
  }
}

if (true) {
  module.exports = AMG8833;
}

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/BME280/index.js":
/*!*****************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/BME280/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class BME280 {
  constructor() {
    this.requiredKeys = [];
    this.keys = ['vcore', 'vio', 'gnd', 'csb', 'sdi', 'sck', 'sdo', 'i2c', 'address'];

    this.ioKeys = ['vcore', 'vio', 'gnd', 'csb', 'sdi', 'sdo', 'sck'];

    this.configration = {
      sampling: {
        temp: 1, // 0 never. 0b001 to 0b101
        hum: 1,
        pres: 1
      },
      interval: 5, // 0b000 to 0b111
      iir_strength: 0, // 000 to 100 (0=disable)
      mode: 3,

      Modes: {
        sleep: 0,
        forced: 1, // or 2
        normal: 3
      }
    };

    this.commands = {};

    this.commands.addresses = {
      config: 0xf5,
      ctrl_meas: 0xf4,
      ctrl_hum: 0xf2
    };
  }

  static info() {
    return {
      name: 'BME280',
      datasheet: 'https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BME280_DS001-12.pdf'
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

  config() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.write([_this.commands.addresses.config, _this.configration.interval << 5 | _this.configration.iir_strength << 2 | 0]);
      _this.write([_this.commands.addresses.ctrl_hum, _this.configration.sampling.hum]);
      _this.write([_this.commands.addresses.ctrl_meas, _this.configration.sampling.temp << 5 | _this.configration.sampling.pres << 2 | _this.configration.mode]);
    })();
  }

  setIIRStrength(strengh) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.configration.iir_strength = strengh;
      _this2.config();
    })();
  }

  applyCalibration() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      _this3.i2c.write(_this3.address, [0x88]);
      let data = yield _this3.i2c.readWait(_this3.address, 24);
      _this3.i2c.write(_this3.address, [0xa1]);
      let data_next = yield _this3.i2c.readWait(_this3.address, 1);
      data.push(...data_next);
      _this3.i2c.write(_this3.address, [0xe1]);
      data_next = yield _this3.i2c.readWait(_this3.address, 7);
      data.push(...data_next);
      _this3._calibrated = {
        dig_T1: data[1] << 8 | data[0],
        dig_T2: _this3._readSigned16(data[3] << 8 | data[2]),
        dig_T3: _this3._readSigned16(data[5] << 8 | data[4]),
        dig_P1: data[7] << 8 | data[6],
        dig_P2: _this3._readSigned16(data[9] << 8 | data[8]),
        dig_P3: _this3._readSigned16(data[11] << 8 | data[10]),
        dig_P4: _this3._readSigned16(data[13] << 8 | data[12]),
        dig_P5: _this3._readSigned16(data[15] << 8 | data[14]),
        dig_P6: _this3._readSigned16(data[17] << 8 | data[16]),
        dig_P7: _this3._readSigned16(data[19] << 8 | data[18]),
        dig_P8: _this3._readSigned16(data[21] << 8 | data[20]),
        dig_P9: _this3._readSigned16(data[23] << 8 | data[22]),
        dig_H1: _this3._readSigned8(data[24]),
        dig_H2: _this3._readSigned16(data[26] << 8 | data[25]),
        dig_H3: _this3._readSigned8(data[27]),
        dig_H4: _this3._readSigned16(data[28] << 4 | 0x0f & data[29]),
        dig_H5: _this3._readSigned16(data[30] << 4 | data[29] >> 4 & 0x0f),
        dig_H6: _this3._readSigned8(data[31])
      };
      _this3._t_fine = 0;
    })();
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

  getData() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      _this4.i2c.write(_this4.address, [0xf7]);
      return yield _this4.i2c.readWait(_this4.address, 8);
    })();
  }

  getAllWait() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this5.getData();

      const press_raw = data[0] << 12 | data[1] << 4 | data[2] >> 4;
      const temp_raw = data[3] << 12 | data[4] << 4 | data[5] >> 4;
      const hum_raw = data[6] << 8 | data[7];

      let temperature = _this5.calibration_T(temp_raw) / 100.0;
      let pressure = _this5.calibration_P(press_raw) / 100.0;
      let humidity = _this5.calibration_H(hum_raw);

      return { temperature, humidity, pressure };
    })();
  }

  calibration_T(adc_T) {
    let var1, var2, T;
    var1 = ((adc_T >> 3) - (this._calibrated.dig_T1 << 1)) * this._calibrated.dig_T2 >> 11;
    var2 = (((adc_T >> 4) - this._calibrated.dig_T1) * ((adc_T >> 4) - this._calibrated.dig_T1) >> 12) * this._calibrated.dig_T3 >> 14;

    this._t_fine = var1 + var2;
    T = this._t_fine * 5 + 128 >> 8;
    return T;
  }

  calibration_P(adc_P) {
    let pvar1 = this._t_fine / 2 - 64000;
    let pvar2 = pvar1 * pvar1 * this._calibrated.dig_P6 / 32768;
    pvar2 = pvar2 + pvar1 * this._calibrated.dig_P5 * 2;
    pvar2 = pvar2 / 4 + this._calibrated.dig_P4 * 65536;
    pvar1 = (this._calibrated.dig_P3 * pvar1 * pvar1 / 524288 + this._calibrated.dig_P2 * pvar1) / 524288;
    pvar1 = (1 + pvar1 / 32768) * this._calibrated.dig_P1;

    if (pvar1 !== 0) {
      let p = 1048576 - adc_P;
      p = (p - pvar2 / 4096) * 6250 / pvar1;
      pvar1 = this._calibrated.dig_P9 * p * p / 2147483648;
      pvar2 = p * this._calibrated.dig_P8 / 32768;
      p = p + (pvar1 + pvar2 + this._calibrated.dig_P7) / 16;
      return p;
    }
    return 0;
  }

  calibration_H(adc_H) {
    let h = this._t_fine - 76800;
    h = (adc_H - (this._calibrated.dig_H4 * 64 + this._calibrated.dig_H5 / 16384 * h)) * (this._calibrated.dig_H2 / 65536 * (1 + this._calibrated.dig_H6 / 67108864 * h * (1 + this._calibrated.dig_H3 / 67108864 * h)));
    h = h * (1 - this._calibrated.dig_H1 * h / 524288);
    return h;
  }

  getTempWait() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return (yield _this6.getAllWait()).temperature;
    })();
  }

  getHumdWait() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      return (yield _this7.getAllWait()).humidity;
    })();
  }

  getPressureWait() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      return (yield _this8.getAllWait()).pressure;
    })();
  }

  getAltitudeWait() {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      const pressure = yield _this9.getPressureWait();
      return _this9.calcAltitude(pressure);
    })();
  }

  calcAltitude(pressure, seaLevel) {
    if (!seaLevel) {
      seaLevel = 1013.25;
    }

    return (1.0 - Math.pow(pressure / seaLevel, 1 / 5.2553)) * 145366.45 * 0.3048;
  }
}

if (true) {
  module.exports = BME280;
}

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/S-5851A/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/S-5851A/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//sensor response not found
class S5851A {
  constructor() {
    this.requiredKeys = ['vcc', 'gnd', 'adr0', 'adr1', 'adr_select'];
    this.keys = ['sda', 'scl', 'adr0', 'adr1', 'adr_select', 'i2c'];
  }

  static info() {
    return {
      name: 'S5851A'
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

  getTempWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      //console.log("gettempwait");
      //obniz.i2c0.write(address, [0x20, 0x24]);
      //obniz.i2c0.write(address, [0xE0, 0x00]);
      let ret = yield _this.i2c0.readWait(_this.address, 2);
      //console.log('ret:' + ret);
      let tempBin = ret[0].toString(2) + ('00000000' + ret[1].toString(2)).slice(-8);
      let temperature = -45 + 175 * (parseInt(tempBin, 2) / (65536 - 1));
      return temperature;
    })();
  }

  getHumdWait() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.i2c.write(_this2.address, [0x20, 0x24]);
      _this2.i2c.write(_this2.address, [0xe0, 0x00]);
      let ret = yield _this2.i2c.readWait(_this2.address, 4);
      let humdBin = ret[2].toString(2) + ('00000000' + ret[3].toString(2)).slice(-8);
      let humidity = 100 * (parseInt(humdBin, 2) / (65536 - 1));
      return humidity;
    })();
  }
}

if (true) {
  module.exports = S5851A;
}

/***/ }),

/***/ "./parts/TemperatureSensor/i2c/SHT31/index.js":
/*!****************************************************!*\
  !*** ./parts/TemperatureSensor/i2c/SHT31/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class SHT31 {
  constructor() {
    this.requiredKeys = ['adr', 'addressmode'];
    this.keys = ['vcc', 'sda', 'scl', 'gnd', 'adr', 'addressmode', 'i2c', 'pull'];

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
      name: 'SHT31'
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

  getData() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.i2c.write(_this.address, _this.commands.highRepeat);
      yield _this.obniz.wait(_this.waitTime.highRepeat);
      return yield _this.i2c.readWait(_this.address, 6);
    })();
  }

  getTempWait() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return (yield _this2.getAllWait()).temperature;
    })();
  }

  getHumdWait() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return (yield _this3.getAllWait()).humidity;
    })();
  }

  getAllWait() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let ret = yield _this4.getData();

      let tempBin = ret[0] * 256 + ret[1];
      let temperature = -45 + 175 * (tempBin / (65536 - 1));

      let humdBin = ret[3] * 256 + ret[4];
      let humidity = 100 * (humdBin / (65536 - 1));
      return { temperature, humidity };
    })();
  }
}

if (true) {
  module.exports = SHT31;
}

/***/ }),

/***/ "./parts/TemperatureSensor/spi/ADT7310/index.js":
/*!******************************************************!*\
  !*** ./parts/TemperatureSensor/spi/ADT7310/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ADT7310 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'frequency', 'din', 'dout', 'clk', 'spi'];
    this.requiredKeys = [];
  }

  static info() {
    return {
      name: 'ADT7310'
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

  getTempWait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.spi.writeWait([0x54]); //send before each commands for stable
      yield _this.obniz.wait(200);
      let ret = yield _this.spi.writeWait([0x00, 0x00]);
      let tempBin = ret[0] << 8;
      tempBin |= ret[1];
      tempBin = tempBin >> 3;

      if (tempBin & 0x1000) {
        tempBin = tempBin - 8192;
      }

      return tempBin / 16;
    })();
  }
}

if (true) {
  module.exports = ADT7310;
}

/***/ }),

/***/ "./parts/Wireless/RN42/index.js":
/*!**************************************!*\
  !*** ./parts/Wireless/RN42/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class RN42 {
  constructor() {
    this.keys = ['tx', 'rx', 'gnd'];
    this.requiredKeys = ['tx', 'rx'];
  }

  static info() {
    return {
      name: 'RN42'
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
      drive: '3v'
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
      let modes = ['slave', 'master', 'trigger', 'auto-connect-master', 'auto-connect-dtr', 'auto-connect-any', 'pairing'];
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
      let modes = ['SPP', 'DUN-DCE', 'DUN-DTE', 'MDM-SPP', 'SPP-DUN-DCE', 'APL', 'HID'];
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
/*!**************************************!*\
  !*** ./parts/Wireless/XBee/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class XBee {
  constructor() {
    this.keys = ['tx', 'rx', 'gnd'];
    this.requiredKeys = ['tx', 'rx'];

    this.displayIoNames = { tx: '<tx', rx: '>rx' };
  }

  static info() {
    return {
      name: 'XBee'
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
      drive: '3v'
    });

    this.uart.onreceive = function (data, text) {
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

    let next = function () {
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
    if (this.isAtMode === true && this.currentCommand === null && this.commands.length > 0) {
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

  configWait(config) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.isAtMode) {
        throw new Error('Xbee : duplicate config setting');
      }
      return new Promise(function (resolve, reject) {
        let standaloneKeys = {
          destination_address_high: 'DH',
          destination_address_low: 'DL',
          source_address: 'MY'
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
        this.onFinishAtModeCallback = function () {
          resolve();
        };
      }.bind(_this));
    })();
  }
}

if (true) {
  module.exports = XBee;
}

/***/ }),

/***/ "eventemitter3":
/*!********************************!*\
  !*** external "eventemitter3" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("eventemitter3");

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

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "semver":
/*!*************************!*\
  !*** external "semver" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("semver");

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