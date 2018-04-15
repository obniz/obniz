const ObnizSystemMethods = require('./ObnizSystemMethods')

module.exports = class ObnizUIs extends ObnizSystemMethods {

  constructor(id, options) {
    super(id, options)
  }
  
  showAlertUI(obj) {
    if (this.isNode || !document.getElementById(this.options.debug_dom_id)) {
      return;
    }
    const alerts = {
      warning: 'alert-warning alert-dismissible',
      error: 'alert-danger'
    };
    let dom = `
    <div style="background-color:${obj.alert === "warning" ? "#ffee35" : "#ff7b34"  }">${obj.message}</div>`;
    document.getElementById(this.options.debug_dom_id).insertAdjacentHTML('beforeend', dom);
  }

  getDebugDoms(){
    if (this.isNode){return;}
    let loaderDom = document.querySelector("#loader");
    let debugDom = document.querySelector("#" + this.options.debug_dom_id);
    let statusDom = document.querySelector("#"+this.options.debug_dom_id +" #online-status");
    if(debugDom && !statusDom){
      statusDom = document.createElement("div");
      statusDom.id = 'online-status';
      statusDom.style.color =  "#FFF";
      statusDom.style.padding =  "5px";
      statusDom.style.textAlign =  "center";
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return { loaderDom:loaderDom, debugDom:debugDom, statusDom:statusDom };
  }

  showOnLine() {
    if (this.isNode){return;}
    let doms = this.getDebugDoms();
    if(doms.loaderDom){
      doms.loaderDom.style.display="none";
    }
    if(doms.statusDom){
      doms.statusDom.style.backgroundColor =  "#449d44";
      doms.statusDom.style.color =  "#FFF";
      doms.statusDom.innerHTML = this.id ? "online : "+ this.id : "online";
    }
  }

  showOffLine() {
    if (this.isNode){return;}

    let doms = this.getDebugDoms();
    if(doms.loaderDom){
      doms.loaderDom.style.display="block";
    }
    if(doms.statusDom){
      doms.statusDom.style.backgroundColor =  "#d9534f";
      doms.statusDom.style.color =  "#FFF";
      doms.statusDom.innerHTML = this.id  ? "offline : "+ this.id : "offline";
    }
  }
}