const mqtt = require('mqtt');

// 最もシンプルなMQTTの送信Example
// コネクション失敗や、タイムアウトの考慮が必要です。

module.exports = class MQTT {
  constructor(options) {
    let con = {
      host: options.host || 'localhost',
      port: options.port || 1883,
    };
    console.log(`MQTT try to connect ${con.host}:${con.port}`);
    this.client = mqtt.connect(con);
    this.client.on('connect', () => {
      console.log(`MQTT connected`);
    });
  }

  publish(topic, message) {
    console.log(`MQTT publish (${topic})(${message})`);
    return new Promise((resolve, reject) => {
      this.client.publish(
        topic,
        message,
        {
          qos: 2,
        },
        e => {
          if (e) {
            reject(e);
            return;
          }
          resolve();
        }
      );
    });
  }
};
