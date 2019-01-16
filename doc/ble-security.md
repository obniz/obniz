# BLE Security


## security.setModeLevel(mode, level)

(ref : Core Spec 4.2 Vol.3 Part.C 10)
This function use `setIndicateSecurityLevel`,`setAuth`,`setEnableKeyTypes`.

* LE Security Mode 1
  * Level 1 – No security. No authentication and no encryption.
  * Level 2 – Unauthenticated pairing with encryption.
  * Level 3 – Authenticated pairing with encryption.
  * Level 4 – Authenticated Secure Connections pairing with encryption.

* LE Security Mode 2
  * Level 1 – Unauthenticated pairing with data signing.
  * Level 2 – Authenticated pairing with data signing. (Mode 2 is only used for connection-based data signing.)


Now, we are support Mode1 level1,2 only.

This function can call once only.
If call more, call security.onerror.

To change setting, obniz require reboot.

```javascript

obniz.ble.security.onerror = function() {
    console.error('security set params error');
    obniz.reboot();
};
security.setModeLevel(1, 2); //LE Security Mode 1, Level 2

```

## security.setIndicateSecurityLevel(level)

When obniz is pheripheral mode and a central connected,
obniz require to the central paring request include security level which want to use.

This function set the security level request to central.
If set 0, don't send paring request.

```javascript
obniz.ble.security.setEncryptionLevel(1);
```

## security.setAuth([auth_type1, auth_type2 ...])

Set authorization type.


 - bonding <br/>
 - mitm <br/>man-in-the-middle authorization. not suppported
 - secure_connection <br/>  not suppported


```javascript
obniz.ble.security.setAuth(['bonding']);
```

```javascript
obniz.ble.security.setAuth(['bonding','mitm','secure_connection']);
```



## security.setEnableKeyTypes([key_type1, key_type2 ...])

Set security keys to use.


 - LTK<br/>
    Long-Term Key
 - IRK <br/>Identity Resolving Key
 - CSRK<br/>Connection Signature Resolving Key
 

This function can call once only.
If call more, call security.onerror.

To change setting, obniz require reboot.

```javascript

obniz.ble.security.onerror = function() {
    console.error('security set params error');
    obniz.reboot();
};

obniz.ble.security.setEnableKeyTypes(['IRK', 'LTK']);
```



## security.setKeyMaxSize(num)


```javascript

```


# security.onerror(param)

Call when error occured.

```javascript

obniz.ble.security.onerror = function() {
    console.error('security set params error');
    obniz.reboot();
};

obniz.ble.security.setEnableKeyTypes(['IRK', 'LTK']);
```
