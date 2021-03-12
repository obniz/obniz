# AXP192 Power Management IC

[AXP192](https://github.com/m5stack/M5StickC/blob/master/src/AXP192.cpp) PMIC is used in M5StickC to charge battery and to route power to all the other components. Diagram on the power wiring can be found [here](https://docs.m5stack.com/assets/img/product_pics/core/minicore/m5stickc/m5stickc_05.jpg). Please be aware that there is an error with LDO2 powering the backlight LED not LDO3 as shown.

This library provides the basic initialization function for M5StickC and generic setter, getters and obviously can be used with any other device that makes use of the AXP192 PMIC.

## Usage

Connect to this as with any other peripheral via the *wired* method and provide the sda and scl pins.

```javascript
var pmic = obniz.wired("AXP192", {sda:21, scl:22});
```

### pmic.set(0x12, 0xcc);

set(address, value) method allows the user to set any of the configuration registers to the desired value. The whole register map can be found in the datasheet linked above.

### let settings = await pmic.getWait(0x28);

getWait(address) is an async method that allows the user to read any of the device's registers. 

### await setLDO2Voltage(3);

setLDO2Voltage(voltage) sets the output voltage level for LDO2 output. Voltage can be between 1.8V and 3V. On M5StickC this output drives the display backlight so it can be used to set the brightness for example.

### await setLDO3Voltage(3);

same as above expect for LDO3. Suspect on M5StickC it drives the ST7735S controller.

### set3VLDO2_3();

A quick way to set both LDO2 and LDO3 to 3V.

### enableLDO2_3();

A quick way to switch on both LDO2 and LDO3.

### await toggleLDO2(false);

toggleLDO2(bool) is a method that allows the user to turn on/off LDO2 output. On M5StickC this can be used to turn off display backlight when going to sleep to preserve battery power.

### await toggleLDO3(false);

same as above but for LDO3.

### initM5StickC();

A quick way to initiliaze power on M5StickC according to [original firmware](https://github.com/m5stack/M5StickC/blob/master/src/AXP192.cpp).

### let vbat = await getVbat();

getVbat() returns the battery voltage if there is one.

