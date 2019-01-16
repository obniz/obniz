# セキュリティの設定をする


## security.setModeLevel(mode, level)

BLEの仕様に基づいたセキュリティを設定します。(Core Spec 4.2 Vol.3 Part.C 10)
`setIndicateSecurityLevel`や`setAuth`、`setEnableKeyTypes`を一括で設定します

* LE Security Mode 1
  * Level 1 – No security. No authentication and no encryption.
  * Level 2 – Unauthenticated pairing with encryption.
  * Level 3 – Authenticated pairing with encryption.
  * Level 4 – Authenticated Secure Connections pairing with encryption.

* LE Security Mode 2
  * Level 1 – Unauthenticated pairing with data signing.
  * Level 2 – Authenticated pairing with data signing. (Mode 2 is only used for connection-based data signing.)


現状、対応しているのは Mode1 level1,2 のみです。

セキュリティの設定は1度しかできません。
再度設定しようとすると、security.onerrorが呼ばれます。
設定を変更するためにはobnizの再起動が必要です。

```javascript

obniz.ble.security.onerror = function() {
    console.error('security set params error');
    obniz.reboot();
};
security.setModeLevel(1, 2); //LE Security Mode 1, Level 2

```

## security.setIndicateSecurityLevel(level)

ペアリング要求時のセキュリティレベルを設定します。
0の場合、ペアリング要求を行いません

```javascript
obniz.ble.security.setEncryptionLevel(1);
```

## security.setAuth([auth_type1, auth_type2 ...])

認証の設定をします

引数で設定できる認証のパラメータは下記の通りです
複数書くことができます。
 - bonding <br/>ボンディング/ペアリングを行う
 - mitm <br/>man-in-the-middle認証（未対応）
 - secure_connection <br/> 


```javascript
obniz.ble.security.setAuth(['bonding']);
```

```javascript
obniz.ble.security.setAuth(['bonding','mitm','secure_connection']);
```



## security.setEnableKeyTypes([key_type1, key_type2 ...])

認証に使うキーの設定をします

引数で設定できる認証のパラメータは下記の通りです
複数書くことができます。
 - LTK<br/>
    Long-Term Key。ペアリング認証に使うためのキー
 - IRK <br/>Identity Resolving Key。固有のデバイスを認識するためのキー
 - CSRK<br/>Connection Signature Resolving Key。署名に使用するキー
 
認証キーの設定は1度しかできません。
再度設定しようとすると、security.onerrorが呼ばれます。
設定変更するためにはobnizの再起動が必要です。


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

エラーが発生したときに呼ばれます
現状、発生しうるエラーはsecurity.setEnableKeyTypesが失敗したときのみです。

```javascript

obniz.ble.security.onerror = function() {
    console.error('security set params error');
    obniz.reboot();
};

obniz.ble.security.setEnableKeyTypes(['IRK', 'LTK']);
```
