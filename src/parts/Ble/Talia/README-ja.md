# Talia

![](image.jpg)

## 対応モード
- ビーコンモード

## 使用例

2種類のad(UID、TLM)を発信する。  
UIDにTaliaを識別するデータ、TLMに測定データが含まれている。  
TLMのみではTaliaかどうか判断できないため、isDeviceFromUid()を使用してperipheralがTaliaかどうか判断し、返ってきたaddressをユーザー側で保持することで、peripheralがTLMか判断する必要がある。(以下コード参考)  


```javascript
obniz.onconnect = async function () {
  const talia = Obniz.getPartsClass('Talia');
  let taliaAddress = [];
  await obniz.ble.initWait();
  obniz.ble.scan.onfind = (p) => {
    if (talia.isDeviceFromUid(p)) {  // UID
      if(!taliaAddress.includes(p.address)){
        taliaAddress.push(p.address);
      }
    }else if(taliaAddress.includes(p.address)){ //TLM
        const data = talia.getData(p);
        console.log(data);
    }
  };
  await obniz.ble.scan.startWait(null, { duplicate: true, duration: 30 });
}
```