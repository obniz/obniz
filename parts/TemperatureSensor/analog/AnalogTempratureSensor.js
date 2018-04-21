class AnalogTemplatureSensor {
  constructor() {
    this.keys = ["vcc","gnd","output"];
    this.requiredKeys = ["output"];
    this.drive = "5v";
    
  } 
  
  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.output);

    
    this.ad.start(function(voltage){
      this.temp = this.calc(voltage);
      this.onchange(this.temp);
    }.bind(this));

  };
  
  onchange(temp){
    
  }
  
  calc(voltage){
    return 0;
  }
  
}

module.exports = AnalogTemplatureSensor;