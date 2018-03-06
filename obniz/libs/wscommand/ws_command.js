class WSCommand {

  constructor() {

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
      logger.error("cant convert to binary. too big payload");
      return null;
    }
    var length_extra_bytse = (length_type == 0) ? 0 : ( (length_type == 1) ? 1 : 3 );
    var header_length = 3 + length_extra_bytse;
    var result = new Uint8Array(header_length + payload_length);
    var index = 0;
    result[index++] = module & 0x7F;
    result[index++] = func;
    result[index++] = (length_type << 6) | (payload_length >> (length_extra_bytse*8));
    while(length_extra_bytse > 0) {
      length_extra_bytse--;
      result[index++] = payload_length >> (length_extra_bytse*8);
    }
    if (payload_length == 0) {
      return result;
    } else {
      result.set(payload, header_length);
      return result;
    }
  }
}