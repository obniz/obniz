# M5StickC_FINGER

The fingerprint authentication module for StickC with a built-in fingerprint sensor F1020SC.  
It is possible to register, delete and match fingerprints with the module alone, which helps to improve security.  

![](./image.jpg)

## wired(obniz, {tx, rx, gnd})

When using M5StickC, You do not need to assign pins. 

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER");
```




name | type | required | default | description
--- | --- | --- | --- | ---
tx | `number(obniz Board io)` | no |  &nbsp; | tx of uart
rx | `number(obniz Board io)` | no | &nbsp;  | rx of uart
gnd | `number(obniz Board io)` | no | &nbsp;  | Power Supply

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
```

Some of the following functions return `ACK`.  
`ACK` has the following types.
ACK |content |description
---|---|---
`SUCCESS` |`0x00` |Successful execution
`FULL` |`0x04` |Internal data is full
`NOUSER` |`0x05` |No matching fingerprint data exists
`USER_EXIST` |`0x07` |Fingerprint data already exists
`TIMEOUT` |`0x08` |Communication timed out

You can access these values as in the example below:
```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
console.log(sensor.ack.SUCCESS); // 0
```


## [await] getUserNumWait()
get the number of fingerprints registered in the module only once.  
If it failed to get, `255(0xFF)` is returned.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
var userNum = await sensor.getUserNumWait();
console.log("userNum: " + userNum);
```


## [await] addUserWait(userNum, userPermission)
add the fingerprint read by the sensor to the module.  
To increase the validity of the fingerprint, read the fingerprint three times inside the function. Therefore, it takes time to execute.  
Set the value got by `getUserNumWait()` in the `userNum` argument.  
Set an integer between `1` and `3` in the `userPermission` argument. This is registered in the module as a user authority along with the fingerprint, but the meaning of the number is defined by you.  
The return value is either `SUCCESS` or `TIMEOUT` of `ACK`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
var userNum = await sensor.getUserNumWait();
console.log("userNum: " + userNum);
var res = await sensor.addUserWait(userNum, 1);
if (res == sensor.ack.SUCCESS) {
    console.log("successfully registered.")
}
```


## [await] deleteUserWait(userNum)
delete the specified fingerprint from the module.  
Specify the fingerprint by the argument `userNum`.  
If successful, it returns `SUCCESS`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
await sensor.deleteUserWait(0);
if (res == sensor.ack.SUCCESS) {
    console.log("fingerprint " + 0 + " was successfully deleted.");
}
```


## [await] deleteAllUserWait()
delete all fingerprints in the module.  
If successful, it returns `SUCCESS`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
await sensor.deleteAllUserWait();
if (res == sensor.ack.SUCCESS) {
    console.log("all fingerprints were successfully deleted.");
}
```


## [await] compareFingerWait()
compare whether the fingerprint read by the sensor matches any of the fingerprints registered in the module.  
If there is a matching fingerprint, the user authority `1`-`3` is returned.  
If there is no matching fingerprint, it returns either `NOUSER` or `TIMEOUT` of `ACK`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
var res = await compareFingerWait();
if (res == 1 || res == 2 || res == 3) {
    console.log("you are registered user. welcome!");
}
```


## [await] getUserPermissionWait(userNum)
get the user authority of the specified fingerprint.  
Specify the fingerprint by the argument `userNum`.  
It returns the user authority `1`-`3`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
var perm = await getUserPermissionWait(0)
console.log("user permission: " + perm);
```


## [await] setAddModeWait(mode)
This module has two fingerprint addition modes: "duplicate permission mode (`0`) ", which allows you to add the same fingerprint any number of times, and" duplicate prohibition mode (`1`)", which prohibits the addition of duplicate fingerprints. By default, it is set to the duplicate prohibition mode.  
You can change the fingerprint addition mode by setting the `mode` argument to `0` or `1`.  
If successful, it returns `SUCCESS`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
sensor.setAddModeWait(0);
```


## [await] readAddModeWait()
get the current fingerprint addition mode.
It returns `0` indicating the duplicate permission mode, or `1` indicating the duplicate prohibition mode.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
var mode = sensor.readAddModeWait();
console.log("mode: " + mode);
```


## [await] setSecurityLevelWait(level)
This module has security levels from `0` to `9` and the higher the value, the stricter the fingerprint comparison. The default level is `5`.  
You can change the security level by setting the `level` argument to `0`-`9`.  
If successful, it returns `SUCCESS`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
sensor.setSecurityLevel(6);
```


## [await] readSecurityLevelWait()
get the current security level.  
It returns an integer from `0` to `9`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
var level = sensor.readSecurityLevelWait();
console.log("security level: " + level);
```


## [await] sleepWait()
put the module to sleep mode.  
If successful, it returns `SUCCESS`.  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_FINGER", {tx:0, rx:26});
sensor.sleepWait();
```