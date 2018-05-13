// load from webpack

let ws;

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket;
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket; //eslint-disable-line
} else {
  ws = window.WebSocket || window.MozWebSocket;
}

module.exports = ws;
