class LM35DZ extends AnalogTemplatureSensor {
  calc (voltage){
    return  voltage * 100; //Temp(Celsius) = [AD Voltage] * 100l;
  }
};


if (PartsRegistrate) {
  PartsRegistrate("LM35DZ", LM35DZ);
}
