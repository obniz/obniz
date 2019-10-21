class BlePdlpParameter {
  constructor(type, value) {
    this.id = type;
    this.value = Buffer.from(value).toJSON().data;
    this.length = this.value.length;
  }

  toArray() {
    return [this.id, this.length].concat(this.value);
  }
}

module.exports = BlePdlpParameter;
