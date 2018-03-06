class WSCommand_Ble extends WSCommand {

  constructor() {

    super();
    this.module = 11;
    
    this.uuidLength = 16+2;

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
    this._CommandNotifyCharacteristics = 12;
    this._CommandNotifyCharacteristicsResults = 13;
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

  setAdvData(data) {
    this.sendCommand(this._CommandSetAdvData, data);
  }

  setScanRespData(data) {
    this.sendCommand(this._CommandSetScanRespData, data);
  }

  startAdv() {
    this.sendCommand(this._CommandStartAdv, null);
  }

  stopAdv() {
    this.sendCommand(this._CommandStopAdv, null);
  }

  startScan(_duration) {
    var buf = new Uint8Array(4);
    var duration = parseInt(_duration);
    if (!isNaN(duration)) {
      buf[0] = duration >> (3 * 8);
      buf[1] = duration >> (2 * 8);
      buf[2] = duration >> (1 * 8);
      buf[3] = duration;
    }
    this.sendCommand(this._CommandStartScan, buf);
  }

  stopScan() {
    this.sendCommand(this._CommandStopScan, null);
  }
//
//  connect(addressBuf) {
//    addressBuf[6] = 0;
//    this.sendCommand(this._CommandConnect, addressBuf);
//  }
//
//  disconnect(addressBuf) {
//    addressBuf[6] = 1;
//    this.sendCommand(this._CommandConnect, addressBuf);
//  }
//  
//  getServices(addressBuf){
//    this.sendCommand(this._CommandServices, addressBuf);
//  }

  parseAdvertisement(val) {
    if(val === null){
      this.stopAdv();
      return;
    }
    if (typeof (val) !== "object") {
      return;
    }

    if (val.adv_data) {
      this.setAdvData(new Uint8Array(val.adv_data));
    }
    if (val.scan_resp) {
      this.setScanRespData(new Uint8Array(val.scan_resp));
    }

    this.startAdv();
  }

  parseScan(val) {
    if(val === null){
      this.sendCommand(this._CommandStopScan,null);
      return;
    }
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "duration" ,  length: 4, type: "int",   default:30 }
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    this.sendCommand(this._CommandStartScan, buf);
  }

  parseConnect(val, connect) {
    if (typeof (val) !== "object") {
      return;
    }
    
    var schema = [
      { path : "address" , length: 6, type: "hex",   required:true , endianness:"little"},
      { path : null  ,            length: 1, type: "char",  default:connect }   //const val
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandConnect, buf);
    }
  }
  
  parseServices(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "address" , length: 6, type: "hex", required:true , endianness:"little"},
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandServices, buf);
    }
  }
  
  parseCharacteristics(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "address" , length: 6, type: "hex", required:true , endianness:"little"},
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandCharacteristics, buf);
    }
  }
  
  parseWrite(val){
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "address" , length: 6, type: "hex", required:true, endianness:"little" },
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
      { path : "needResponse" , length: 1, type: "char", default:1 },
      { path : "data" , length: null, type: "dataArray", }
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandWriteCharacteristics, buf);
    }
  }
  
  parseRead(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "address" , length: 6, type: "hex", required:true, endianness:"little" },
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandReadCharacteristics, buf);
    }
  }

  parseDescriptors(val){
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "address" , length: 6, type: "hex", required:true, endianness:"little" },
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandDescriptors, buf);
    }
  }
  
  parseWriteDesc(val){
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "address" , length: 6, type: "hex", required:true, endianness:"little" },
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
      { path : "descriptor_uuid" , length: 18, type: "uuid", required:true },
      { path : "needResponse" , length: 1, type: "char", default:1 },
      { path : "data" , length: null, type: "dataArray" }
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandWriteDescriptor, buf);
    }
  }
  
  
  parseReadDesc(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "address" , length: 6, type: "hex", required:true, endianness:"little" },
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
      { path : "descriptor_uuid" , length: 18, type: "uuid", required:true },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandReadDescriptor, buf);
    }
  }
  
  
 parsePeripheral(val){
   if(val === undefined ){
     return;
   }
   if(val === null){
      this.sendCommand(this._CommandServerStartPeripheral, new Uint8Array([1])); //stop
     return;
     
   }
   var propFlags = {
     0x01 : "broadcast",
     0x02 : "read",
     0x04 : "write_no_response",
     0x08 : "write",
     0x10 : "notify",
     0x20 : "indiate",
     0x40 : "auth",
     0x80 : "ext_prop"
   };
   var schema = {
     service : {
       command : CommandServerAddService,
       schema: [
        { path : "uuid" , length: 18, type: "uuid", required:true }
        ]
      },
      characteristic : {
       command : CommandServerAddCharacteristic,
       schema: [
        { path : "service_uuid" , length: 18, type: "uuid", required:true },
        { path : "uuid" , length: 18, type: "uuid", required:true },
        { path : "property" , length: 1, type: "flag", default:["write","read"], flags:propFlags},   //read and write OK 
        { path : "data" , type: "dataArray" }
        ]
      },
      descriptor : {
       command : CommandServerAddDescriptor,
       schema: [
        { path : "service_uuid" , length: 18, type: "uuid", required:true },
        { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
        { path : "uuid" , length: 18, type: "uuid", required:true },
        { path : "property" , length: 1, type: "flag", default:["read"], flags:propFlags},   //read OK  
        { path : "data" , type: "dataArray" }
        ]
      }
   };

    var sendBufs = [];
    var buf;
    for (var serviceIndex in val["services"]) {
      var service = val["services"][serviceIndex];
      buf = JsonBinaryConverter.createSendBuffer(schema["service"].schema, service);
      if(buf.length === 0){return;}
      sendBufs.push({command: schema["service"].command, buffer: buf});
      
      for (var charaIndex in service["characteristics"]) {
        var chara = service["characteristics"][charaIndex];
        chara.service_uuid = service.uuid;
        buf = JsonBinaryConverter.createSendBuffer(schema["characteristic"].schema, chara);
      if(buf.length === 0){return;}
        sendBufs.push({command: schema["characteristic"].command, buffer: buf});

        for (var descIndex in chara["descriptors"]) {
          var desc = chara["descriptors"][descIndex];
          desc.service_uuid = service.uuid;
          desc.characteristic_uuid = chara.uuid;
          buf = JsonBinaryConverter.createSendBuffer(schema["descriptor"].schema, desc);
          if(buf.length === 0){return;}
          sendBufs.push({command: schema["descriptor"].command, buffer: buf});
        }
      }
    }
    if(sendBufs.length > 0){
      sendBufs.push({command:CommandServerStartPeripheral, buffer: new Uint8Array([0]) });
    }
   for(var index in sendBufs){
     this.sendCommand(sendBufs[index].command, sendBufs[index].buffer);
   }
 }
  
  
  parseServerCharWrite(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
      { path : "data" , type: "dataArray" },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandServerWriteCharavteristicValue, buf);
    }
  }
  
  parseServerCharRead(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandServerReadCharavteristicValue, buf);
    }
  }

  parseServerDescWrite(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
      { path : "descriptor_uuid" , length: 18, type: "uuid", required:true },
      { path : "data" , type: "dataArray" },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandServerWriteDescriptorValue, buf);
    }
  }
  
  parseServerDescRead(val) {
    if (typeof (val) !== "object") {
      return;
    }
    var schema = [
      { path : "service_uuid" , length: 18, type: "uuid", required:true },
      { path : "characteristic_uuid" , length: 18, type: "uuid", required:true },
      { path : "descriptor_uuid" , length: 18, type: "uuid", required:true },
    ];
    var buf = JsonBinaryConverter.createSendBuffer(schema,val);
    if(buf){
      this.sendCommand(this._CommandServerReadDescriptorValue, buf);
    }
  }

  parseFromJson(json) {

    try {
      var ble = json["ble"];
      if (typeof (ble) !== "object") {
        return;
      }
       
        this.parseScan(ble["scan"]);
        this.parseConnect(ble["connect"],false);
        this.parseConnect(ble["disconnect"],true);
        this.parseServices(ble["get_services"]);
        this.parseCharacteristics(ble["get_characteristics"]);
        this.parseWrite(ble["write_characteristic"]);
        this.parseRead(ble["read_characteristic"]);
        this.parseDescriptors(ble["get_descriptors"]);
        this.parseWriteDesc(ble["write_descriptor"]);
        this.parseReadDesc(ble["read_descriptor"]);
       
      
        this.parseAdvertisement(ble["advertisement"]);
        this.parsePeripheral(ble["peripheral"]);
        if(ble["peripheral"]){
          this.parseServerCharWrite(ble["peripheral"]["write_characteristic"]);
          this.parseServerCharRead(ble["peripheral"]["read_characteristic"]);
          this.parseServerDescWrite(ble["peripheral"]["write_descriptor"]);
          this.parseServerDescRead(ble["peripheral"]["read_descriptor"]);
        }

    } catch (err) {
      console.log("Error", err);
    }
  }

  notifyFromBinary(objToSend, module, func, payload) {
    let funcList = {}
    funcList[this._CommandScanResults] = this.notifyFromBinaryScanResponse.bind(this);
    funcList[this._CommandConnect]=this.notifyFromBinaryConnect.bind(this);
    funcList[this._CommandServices]   =this.notifyFromBinaryServices.bind(this);
    funcList[this._CommandCharacteristics]  = this.notifyFromBinaryChacateristics.bind(this);
    funcList[this._CommandWriteCharacteristics]  = this.notifyFromBinaryWriteChacateristics.bind(this);
    funcList[this._CommandReadCharacteristics]  = this.notifyFromBinaryReadChacateristics.bind(this);
    funcList[this._CommandDescriptors]  = this.notifyFromBinaryDescriptors.bind(this);
    funcList[this._CommandWriteDescriptor]  = this.notifyFromBinaryWriteDescriptor.bind(this);
    funcList[this._CommandReadDescriptor]  = this.notifyFromBinaryReadDescriptor.bind(this);
    
    funcList[this._CommandServerNotifyConnect] = this.notifyFromBinaryServerConnectionState.bind(this);
    funcList[this._CommandServerReadCharavteristicValue] = this.notifyFromBinaryServerReadCharavteristicValue.bind(this);
    funcList[this._CommandServerWriteCharavteristicValue] = this.notifyFromBinaryServerWriteCharavteristicValue.bind(this);
    funcList[this._CommandServerNotifyReadCharavteristicValue] = this.notifyFromBinaryServerNotifyReadCharavteristicValue.bind(this);
    funcList[this._CommandServerNotifyWriteCharavteristicValue] = this.notifyFromBinaryServerNotifyWriteCharavteristicValue.bind(this);
    funcList[this._CommandServerReadDescriptorValue] = this.notifyFromBinaryServerReadDescriptorValue.bind(this);
    funcList[this._CommandServerWriteDescriptorValue] = this.notifyFromBinaryServerWriteDescriptorValue.bind(this);
    funcList[this._CommandServerNotifyReadDescriptorValue] = this.notifyFromBinaryServerNotifyReadDescriptorValue.bind(this);
    funcList[this._CommandServerNotifyWriteDescriptorValue] = this.notifyFromBinaryServerNotifyWriteDescriptorValue.bind(this);
    
    funcList[this.COMMAND_FUNC_ID_ERROR]  = this.notifyFromBinaryError.bind(this);
   
    if(funcList[func]){
      funcList[func](objToSend, payload);
    }
  }

  notifyFromBinaryScanResponse(objToSend, payload) {
    if (payload.byteLength > 1) {
      
      var schema =  [
        { name:"event_type",           type : "enum",      length: 1, enum:this._CommandScanResultsEvet },
        { name:"address",              type : "hex",       length: 6 , endianness:"little"},
        { name:"device_type",          type : "enum",      length: 1, enum:this._CommandScanResultsDevice },
        { name:"address_type",         type : "enum",      length: 1, enum:this._CommandScanResultsDeviceAddress },
        { name:"ble_event_type",       type : "enum",      length: 1, enum:this._CommandScanResultsBleEvent },
        { name:"rssi",                 type : "signed number",    length: 4 },
        { name:"adv_data",             type : "dataArray", length: 31*2 },
        { name:"flag",                 type : "number",    length: 4 },
        { name:"num_response",         type : "number",    length: 4 },
        { name:"advertise_length",     type : "number",    length: 1 },
        { name:"scan_response_length", type : "number",    length: 1 }
      ];
    
      var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
      
      results.scan_resp = results.adv_data.slice(results.advertise_length,results.advertise_length+results.scan_response_length); 
      results.adv_data = results.adv_data.slice(0,results.advertise_length); 
      
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
      
      if(results.event_type === "inquiry_complete"){
          results = {event_type:  "inquiry_complete"};
      }
      
     this._addRowForPath(objToSend, "ble.scan_results", results);
    }
  }
  
  notifyFromBinaryConnect(objToSend, payload) {
    if(payload.length === 7){
      var schema =  [
        { name:"address",   type : "hex",       length: 6 , endianness:"little"},
        { name:"status",           type : "enum",      length: 1, enum:{"connected":0,"disconnected":1} }
      ];
      
      var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
      this._addRowForPath(objToSend, "ble.status_updates", results);
    }
  }
  
  notifyFromBinaryServices(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6 , endianness:"little"},
      { name:"service_uuid",   type : "uuid", length: this.uuidLength }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
     this._addRowForPath(objToSend, "ble.get_service_results", results);
  }
  
  notifyFromBinaryChacateristics(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
     this._addRowForPath(objToSend, "ble.get_characteristic_results", results);
  }
  
  notifyFromBinaryReadChacateristics(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"data",   type : "dataArray", length: null }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
     this._addRowForPath(objToSend, "ble.read_characteristic_results", results);
  }
  
  notifyFromBinaryWriteChacateristics(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"result",   type : "enum", length: 1 , enum:{"success":1,"failed":0}}
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
     this._addRowForPath(objToSend, "ble.write_characteristic_results", results);
  }
  
  notifyFromBinaryDescriptors(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: uuidLength }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
     this._addRowForPath(objToSend, "ble.get_descriptors_results", results);
  }
  
  notifyFromBinaryReadDescriptor(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: this.uuidLength },
      { name:"data",   type : "dataArray", length: null }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
     this._addRowForPath(objToSend, "ble.read_descriptor_results", results);
  }
  
  notifyFromBinaryWriteDescriptor(objToSend, payload) {
    var uuidLength = 16+2;
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: uuidLength },
      { name:"result",   type : "enum", length: 1 , enum:{"success":1,"failed":0}}
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
     this._addRowForPath(objToSend, "ble.write_descriptor_results", results);
  }
  
  notifyFromBinaryServerConnectionState(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
     { name:"status",   type : "enum", length: 1 , enum:{"connected":1,"disconnected":0}}
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.connection_status", results);
  }

  notifyFromBinaryServerWriteCharavteristicValue(objToSend, payload) {
    var schema =  [
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"result",   type : "enum", length: 1 , enum:{"success":1,"failed":0}}
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.write_characteristic_results", results);
  }

  notifyFromBinaryServerReadCharavteristicValue(objToSend, payload) {
    var schema =  [
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"data",   type : "dataArray", length: null }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.read_characteristic_results", results);
  }

  notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_read_characteristics", results);
  }

  notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"data",   type : "dataArray", length: null }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_write_characteristics", results);
  }

  notifyFromBinaryServerReadDescriptorValue(objToSend, payload) {
    var schema =  [
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: this.uuidLength },
      { name:"data",   type : "dataArray", length: null }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.read_descriptor_results", results);
  }

  notifyFromBinaryServerWriteDescriptorValue(objToSend, payload) {
    var schema =  [
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: this.uuidLength },
      { name:"result",   type : "enum", length: 1 , enum:{"success":1,"failed":0}}
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.write_descriptor_results", results);
  }

  notifyFromBinaryServerNotifyReadDescriptorValue(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: this.uuidLength }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_read_descriptors", results);
  }

  notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend, payload) {
    var schema =  [
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: this.uuidLength },
      { name:"data",   type : "dataArray", length: null }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    this._addRowForPath(objToSend, "ble.peripheral.notify_write_descriptors", results);
  }

  notifyFromBinaryError(objToSend, payload) {
    var schema =  [
      { name:"esp_error_code", type : "char", length: 1},
      { name:"error_code",    type : "char", length: 1 },
      { name:"function_code",    type : "char", length: 1 },
      { name:"address", type : "hex", length: 6, endianness:"little" },
      { name:"service_uuid",   type : "uuid", length: this.uuidLength },
      { name:"characteristic_uuid",   type : "uuid", length: this.uuidLength },
      { name:"descriptor_uuid",   type : "uuid", length: this.uuidLength }
    ];
    
    var results = JsonBinaryConverter.convertFromBinaryToJson(schema, payload);
    
    var errorMessage = {
      0x00 : "error",
      0x01 : "device not connected",
      0x02 : "service not found",
      0x03 : "charavteristic not found",
      0x04 : "descriptor not found",
      0x05 : "no permission",
      0x06 : "device not found",
      0x07 : "ble is busy",
      0x08 : "service already running",
    };
    
    var functionMessage = {
      0 : "on setting advertisement data",
      1 : "on setting scan response data",
      2 : "on starting advertisement",
      3 : "on stopping advertisement",
      4 : "on starting scan",
      5 : "on stoping scan",
      6 : "",
      7 : "on connecting device",
      8 : "on getting services",
      9 : "on getting characteristic",
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
      32: "on reading descriptor from remote",
    };
    const CommandServerStartPeripheral = 20;
    const CommandServerNotifyConnect = 21;
    const CommandServerAddService = 22;
    const CommandServerAddCharacteristic = 23;
    const CommandServerAddDescriptor = 24;
    const CommandServerWriteCharavteristicValue = 25;
    const CommandServerReadCharavteristicValue = 26;
    const CommandServerNotifyWriteCharavteristicValue = 27;
    const CommandServerNotifyReadCharavteristicValue = 28;
    const CommandServerWriteDescriptorValue = 29;
    const CommandServerReadDescriptorValue = 30;
    const CommandServerNotifyWriteDescriptorValue = 31;
    const CommandServerNotifyReadDescriptorValue = 32;
    
    results.message = errorMessage[results.error_code] + " " + functionMessage[results.function_code];
    
    delete results.esp_error_code;
    delete results.function_code;
    
    this.envelopError(objToSend, 'ble', results);
  }
  
  _addRowForPath(sendObj, path, row){
    var keys = path.split('.');
    var target = sendObj;
    for (var index = 0; index < keys.length - 1; index++) {
      target[keys[index]] = target[keys[index]] || {};
      target = target[keys[index]];
    }
    target[keys[keys.length - 1]] = target[keys[keys.length - 1]] || [];
    target = target[keys[keys.length - 1]];
    target.push(row);
  }
}
