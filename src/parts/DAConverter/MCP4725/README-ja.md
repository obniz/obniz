# MCP4725

アナログ電圧を生成できます。+と-の間に電位差を作り出します。

[http://ww1.microchip.com/downloads/en/DeviceDoc/22039d.pdf](http://ww1.microchip.com/downloads/en/DeviceDoc/22039d.pdf)

## wired(obniz, {[scl, sda, vcc, gnd, i2c]})
obnizデバイスと接続します。  

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はvcc, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
gnd | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はgnd, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
scl | `number(obniz Board io)` | no |  &nbsp; | I2Cのsclとなる端子です
sda | `number(obniz Board io)` | no | &nbsp;  | I2Cのsdaとなる端子です
i2c | `object` | no | &nbsp;  | obnizのi2cオブジェクトです

```javascript
// JavaScript Examples
var dac = obniz.wired("MCP4725", {sda:0, scl:26});
dac.setVoltage(1.5);
```

## setVCCVoltage(number)

電源電圧をチップに記憶させます。MCP4725に供給されている電圧がここの電圧と異なると正しい電圧を出力できません。
デフォルトでは5vとされています。

```javascript
// JavaScript Examples
var dac = obniz.wired("MCP4725", {sda:0, scl:26});
dac.setVCCVoltage(3.3);
dac.setVoltage(1.5);
```

## setVoltage(voltage)
指定した電位差を作り出します。  
0~3.3(mV)の間の値を指定してください。  

またチップに供給される電圧が5vでない場合は事前にsetVCCVoltage()関数で設定してください。

```javascript
// JavaScript Examples
var dac = obniz.wired("MCP4725", {sda:0, scl:26});
dac.setVoltage(1.5);
```