// var debug = require('debug')('bindings');
/* eslint-disable */

var events = require('events');
var util = require('util');

var AclStream = require('./acl-stream');
var Gatt = require('./gatt');
var Gap = require('./gap');
var Hci = require('./hci');
var Signaling = require('./signaling');


class NobleBindings extends events.EventEmitter {
  constructor(obnizHci) {
    super();
    this._state = null;

    this._addresses = {};
    this._addresseTypes = {};
    this._connectable = {};

    this._pendingConnectionUuid = null;
    this._connectionQueue = [];

    this._handles = {};
    this._gatts = {};
    this._aclStreams = {};
    this._signalings = {};

    this._hci = new Hci(obnizHci);
    this._gap = new Gap(this._hci);
  };


  startScanning(serviceUuids, allowDuplicates) {
    this._scanServiceUuids = serviceUuids || [];

    this._gap.startScanning(allowDuplicates);
  };


  stopScanning() {
    this._gap.stopScanning();
  };


  connect(peripheralUuid) {
    var address = this._addresses[peripheralUuid];
    var addressType = this._addresseTypes[peripheralUuid];

    if (!this._pendingConnectionUuid) {
      this._pendingConnectionUuid = peripheralUuid;

      this._hci.createLeConn(address, addressType);
    } else {
      this._connectionQueue.push(peripheralUuid);
    }
  };


  disconnect(peripheralUuid) {
    this._hci.disconnect(this._handles[peripheralUuid]);
  };


  updateRssi(peripheralUuid) {
    this._hci.readRssi(this._handles[peripheralUuid]);
  };


  init() {
    this.onSigIntBinded = this.onSigInt.bind(this);

    this._gap.on('scanStart', this.onScanStart.bind(this));
    this._gap.on('scanStop', this.onScanStop.bind(this));
    this._gap.on('discover', this.onDiscover.bind(this));

    this._hci.on('stateChange', this.onStateChange.bind(this));
    this._hci.on('addressChange', this.onAddressChange.bind(this));
    this._hci.on('leConnComplete', this.onLeConnComplete.bind(this));
    this._hci.on('leConnUpdateComplete', this.onLeConnUpdateComplete.bind(this));
    this._hci.on('rssiRead', this.onRssiRead.bind(this));
    this._hci.on('disconnComplete', this.onDisconnComplete.bind(this));
    this._hci.on('encryptChange', this.onEncryptChange.bind(this));
    this._hci.on('aclDataPkt', this.onAclDataPkt.bind(this));

    this._hci.init();

    /* Add exit handlers after `init()` has completed. If no adaptor
    is present it can throw an exception - in which case we don't
    want to try and clear up afterwards (issue #502) */
    process.on('SIGINT', this.onSigIntBinded);
    process.on('exit', this.onExit.bind(this));
  };

  onSigInt() {
    var sigIntListeners = process.listeners('SIGINT');

    if (sigIntListeners[sigIntListeners.length - 1] === this.onSigIntBinded) {
      // we are the last listener, so exit
      // this will trigger onExit, and clean up
      process.exit(1);
    }
  };

  onExit() {
    this.stopScanning();

    for (var handle in this._aclStreams) {
      this._hci.disconnect(handle);
    }
  };

  onStateChange(state) {
    if (this._state === state) {
      return;
    }
    this._state = state;


    if (state === 'unauthorized') {
      console.log('noble warning: adapter state unauthorized, please run as root or with sudo');
      console.log('               or see README for information on running without root/sudo:');
      console.log('               https://github.com/sandeepmistry/noble#running-on-linux');
    } else if (state === 'unsupported') {
      console.log('noble warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).');
      console.log('               Try to run with environment variable:');
      console.log('               [sudo] NOBLE_HCI_DEVICE_ID=x node ...');
    }

    this.emit('stateChange', state);
  };

  onAddressChange(address) {
    this.emit('addressChange', address);
  };

  onScanStart(filterDuplicates) {
    this.emit('scanStart', filterDuplicates);
  };

  onScanStop() {
    this.emit('scanStop');
  };

  onDiscover(status, address, addressType, connectable, advertisement, rssi) {
    if (this._scanServiceUuids === undefined) {
      return;
    }

    var serviceUuids = advertisement.serviceUuids || [];
    var serviceData = advertisement.serviceData || [];
    var hasScanServiceUuids = (this._scanServiceUuids.length === 0);

    if (!hasScanServiceUuids) {
      var i;

      serviceUuids = serviceUuids.slice();

      for (i in serviceData) {
        serviceUuids.push(serviceData[i].uuid);
      }

      for (i in serviceUuids) {
        hasScanServiceUuids = (this._scanServiceUuids.indexOf(serviceUuids[i]) !== -1);

        if (hasScanServiceUuids) {
          break;
        }
      }
    }

    if (hasScanServiceUuids) {
      var uuid = address.split(':').join('');
      this._addresses[uuid] = address;
      this._addresseTypes[uuid] = addressType;
      this._connectable[uuid] = connectable;

      this.emit('discover', uuid, address, addressType, connectable, advertisement, rssi);
    }
  };

  onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
    var uuid = null;

    var error = null;

    if (status === 0) {
      uuid = address.split(':').join('').toLowerCase();

      var aclStream = new AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
      var gatt = new Gatt(address, aclStream);
      var signaling = new Signaling(handle, aclStream);

      this._gatts[uuid] = this._gatts[handle] = gatt;
      this._signalings[uuid] = this._signalings[handle] = signaling;
      this._aclStreams[handle] = aclStream;
      this._handles[uuid] = handle;
      this._handles[handle] = uuid;

      this._gatts[handle].on('mtu', this.onMtu.bind(this));
      this._gatts[handle].on('servicesDiscover', this.onServicesDiscovered.bind(this));
      this._gatts[handle].on('includedServicesDiscover', this.onIncludedServicesDiscovered.bind(this));
      this._gatts[handle].on('characteristicsDiscover', this.onCharacteristicsDiscovered.bind(this));
      this._gatts[handle].on('read', this.onRead.bind(this));
      this._gatts[handle].on('write', this.onWrite.bind(this));
      this._gatts[handle].on('broadcast', this.onBroadcast.bind(this));
      this._gatts[handle].on('notify', this.onNotify.bind(this));
      this._gatts[handle].on('notification', this.onNotification.bind(this));
      this._gatts[handle].on('descriptorsDiscover', this.onDescriptorsDiscovered.bind(this));
      this._gatts[handle].on('valueRead', this.onValueRead.bind(this));
      this._gatts[handle].on('valueWrite', this.onValueWrite.bind(this));
      this._gatts[handle].on('handleRead', this.onHandleRead.bind(this));
      this._gatts[handle].on('handleWrite', this.onHandleWrite.bind(this));
      this._gatts[handle].on('handleNotify', this.onHandleNotify.bind(this));

      this._signalings[handle].on('connectionParameterUpdateRequest', this.onConnectionParameterUpdateRequest.bind(this));

      this._gatts[handle].exchangeMtu(256);
    } else {
      uuid = this._pendingConnectionUuid;
      var statusMessage = Hci.STATUS_MAPPER[status] || 'HCI Error: Unknown';
      var errorCode = ' (0x' + status.toString(16) + ')';
      statusMessage = statusMessage + errorCode;
      error = new Error(statusMessage);
    }

    this.emit('connect', uuid, error);

    if (this._connectionQueue.length > 0) {
      var peripheralUuid = this._connectionQueue.shift();

      address = this._addresses[peripheralUuid];
      addressType = this._addresseTypes[peripheralUuid];

      this._pendingConnectionUuid = peripheralUuid;

      this._hci.createLeConn(address, addressType);
    } else {
      this._pendingConnectionUuid = null;
    }
  };

  onLeConnUpdateComplete(handle, interval, latency, supervisionTimeout) {
    // no-op
  };

  onDisconnComplete(handle, reason) {
    var uuid = this._handles[handle];

    if (uuid) {
      this._aclStreams[handle].push(null, null);
      this._gatts[handle].removeAllListeners();
      this._signalings[handle].removeAllListeners();

      delete this._gatts[uuid];
      delete this._gatts[handle];
      delete this._signalings[uuid];
      delete this._signalings[handle];
      delete this._aclStreams[handle];
      delete this._handles[uuid];
      delete this._handles[handle];

      this.emit('disconnect', uuid); // TODO: handle reason?
    } else {
      console.warn('noble warning: unknown handle ' + handle + ' disconnected!');
    }
  };

  onEncryptChange(handle, encrypt) {
    var aclStream = this._aclStreams[handle];

    if (aclStream) {
      aclStream.pushEncrypt(encrypt);
    }
  };

  onMtu(address, mtu) {

  };

  onRssiRead(handle, rssi) {
    this.emit('rssiUpdate', this._handles[handle], rssi);
  };


  onAclDataPkt(handle, cid, data) {
    var aclStream = this._aclStreams[handle];

    if (aclStream) {
      aclStream.push(cid, data);
    }
  };

  discoverServices(peripheralUuid, uuids) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.discoverServices(uuids || []);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onServicesDiscovered(address, serviceUuids) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('servicesDiscover', uuid, serviceUuids);
  };

  discoverIncludedServices(peripheralUuid, serviceUuid, serviceUuids) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.discoverIncludedServices(serviceUuid, serviceUuids || []);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onIncludedServicesDiscovered(address, serviceUuid, includedServiceUuids) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('includedServicesDiscover', uuid, serviceUuid, includedServiceUuids);
  };

  discoverCharacteristics(peripheralUuid, serviceUuid, characteristicUuids) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.discoverCharacteristics(serviceUuid, characteristicUuids || []);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onCharacteristicsDiscovered(address, serviceUuid, characteristics) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('characteristicsDiscover', uuid, serviceUuid, characteristics);
  };

  read(peripheralUuid, serviceUuid, characteristicUuid) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.read(serviceUuid, characteristicUuid);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onRead(address, serviceUuid, characteristicUuid, data) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('read', uuid, serviceUuid, characteristicUuid, data, false);
  };

  write(peripheralUuid, serviceUuid, characteristicUuid, data, withoutResponse) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.write(serviceUuid, characteristicUuid, data, withoutResponse);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onWrite(address, serviceUuid, characteristicUuid) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('write', uuid, serviceUuid, characteristicUuid);
  };

  broadcast(peripheralUuid, serviceUuid, characteristicUuid, broadcast) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.broadcast(serviceUuid, characteristicUuid, broadcast);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onBroadcast(address, serviceUuid, characteristicUuid, state) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('broadcast', uuid, serviceUuid, characteristicUuid, state);
  };

  notify(peripheralUuid, serviceUuid, characteristicUuid, notify) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.notify(serviceUuid, characteristicUuid, notify);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onNotify(address, serviceUuid, characteristicUuid, state) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('notify', uuid, serviceUuid, characteristicUuid, state);
  };

  onNotification(address, serviceUuid, characteristicUuid, data) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('read', uuid, serviceUuid, characteristicUuid, data, true);
  };

  discoverDescriptors(peripheralUuid, serviceUuid, characteristicUuid) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.discoverDescriptors(serviceUuid, characteristicUuid);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onDescriptorsDiscovered(address, serviceUuid, characteristicUuid, descriptorUuids) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('descriptorsDiscover', uuid, serviceUuid, characteristicUuid, descriptorUuids);
  };

  readValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.readValue(serviceUuid, characteristicUuid, descriptorUuid);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onValueRead(address, serviceUuid, characteristicUuid, descriptorUuid, data) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('valueRead', uuid, serviceUuid, characteristicUuid, descriptorUuid, data);
  };

  writeValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.writeValue(serviceUuid, characteristicUuid, descriptorUuid, data);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onValueWrite(address, serviceUuid, characteristicUuid, descriptorUuid) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('valueWrite', uuid, serviceUuid, characteristicUuid, descriptorUuid);
  };

  readHandle(peripheralUuid, attHandle) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.readHandle(attHandle);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onHandleRead(address, handle, data) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('handleRead', uuid, handle, data);
  };

  writeHandle(peripheralUuid, attHandle, data, withoutResponse) {
    var handle = this._handles[peripheralUuid];
    var gatt = this._gatts[handle];

    if (gatt) {
      gatt.writeHandle(attHandle, data, withoutResponse);
    } else {
      console.warn('noble warning: unknown peripheral ' + peripheralUuid);
    }
  };

  onHandleWrite(address, handle) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('handleWrite', uuid, handle);
  };

  onHandleNotify(address, handle, data) {
    var uuid = address.split(':').join('').toLowerCase();

    this.emit('handleNotify', uuid, handle, data);
  };

  onConnectionParameterUpdateRequest(handle, minInterval, maxInterval, latency, supervisionTimeout) {
    this._hci.connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout);
  };
}

module.exports = NobleBindings;
