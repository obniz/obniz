<div align="center">
  <h1>⚡ obniz.js</h1>
  <p><strong>The TypeScript SDK for IoT Hardware Control</strong></p>
  <p>Control real-world hardware from Node.js with just a few lines of TypeScript</p>

  <p>
    <a href="https://www.npmjs.com/package/obniz"><img src="https://img.shields.io/npm/v/obniz.svg?style=flat-square&logo=npm" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/obniz"><img src="https://img.shields.io/npm/dm/obniz.svg?style=flat-square&logo=npm" alt="npm downloads"></a>
    <a href="https://github.com/obniz/obniz/actions/workflows/node.js.yml"><img src="https://img.shields.io/github/actions/workflow/status/obniz/obniz/node.js.yml?style=flat-square&logo=github" alt="Build Status"></a>
    <a href="https://github.com/obniz/obniz/blob/master/LICENSE.txt"><img src="https://img.shields.io/npm/l/obniz.svg?style=flat-square" alt="License"></a>
    <a href="https://github.com/obniz/obniz"><img src="https://img.shields.io/github/stars/obniz/obniz?style=flat-square&logo=github" alt="GitHub Stars"></a>
  </p>

  <p>
    <a href="./README-ja.md">日本語</a> •
    <a href="https://docs.obniz.io/guides/">Documentation</a> •
    <a href="https://obniz.github.io/obniz/obnizjs/index.html">API Reference</a> •
    <a href="./examples">Examples</a> •
    <a href="https://obniz.com/">Website</a>
  </p>
</div>

---

## ✨ Features

- 🚀 **TypeScript First** — Built with TypeScript, full type definitions included
- 🔌 **Hardware Abstraction** — Control GPIOs, PWM, I2C, SPI, UART, and more
- 📦 **Parts Library** — 100+ pre-built components (sensors, motors, displays)
- 🖥️ **Server-Side** — Perfect for Node.js backend applications
- ☁️ **Cloud Connected** — Control devices remotely via WebSocket
- ⚡ **Real-time** — Low latency hardware control over the internet

## 🚀 Quick Start

### Installation

```bash
npm install obniz
```

### Hello World

Control hardware with just a few lines of TypeScript:

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // Display a message
  obniz.display.print("Hello, World!");
  
  // Control an LED
  const led = obniz.wired("LED", { anode: 0, cathode: 1 });
  led.blink();
};
```

### Run

```bash
npx ts-node index.ts
```

## 📖 Usage Examples

<details>
<summary><b>🔌 Basic Hardware Control</b></summary>

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // Display message
  obniz.display.print("hello!");
  
  // Switch event handling
  obniz.switch.onchange = (state: string): void => {
    console.log(`Switch state: ${state}`);
  };

  // Servo motor control
  const servo = obniz.wired("ServoMotor", { gnd: 0, vcc: 1, signal: 2 });
  servo.angle(90);
  
  // UART communication
  const uart = obniz.getFreeUart();
  uart.start({ tx: 5, rx: 6, baud: 9600 });
  uart.send("Hello from TypeScript!");

  // GPIO control
  obniz.io7.drive("5v");
  obniz.io7.output(true);
  obniz.io8.pull("3v");
  obniz.io8.drive("open-drain");
  obniz.io8.output(false);
};
```

</details>

<details>
<summary><b>🎚️ Servo Motor Control</b></summary>

```typescript
import Obniz from 'obniz';
import * as readline from 'readline';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  const servo = obniz.wired("ServoMotor", { gnd: 0, vcc: 1, signal: 2 });
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input: string): void => {
    const angle = parseInt(input, 10);
    if (angle >= 0 && angle <= 180) {
      servo.angle(angle);
      console.log(`Servo angle set to: ${angle}`);
    }
  });

  console.log('Enter angle (0-180):');
};
```

</details>

<details>
<summary><b>☁️ Cloud Service Integration</b></summary>

```typescript
import Obniz from 'obniz';
import { Dropbox } from 'dropbox';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  const dbx = new Dropbox({ accessToken: '<YOUR ACCESS TOKEN>' });
  const button = obniz.wired("Button", { signal: 0, gnd: 1 });
  
  button.onchange = async (pressed: boolean): Promise<void> => {
    if (pressed) {
      await dbx.filesUpload({
        path: '/obniz.txt', 
        contents: `[Button Pressed]\n${new Date().toISOString()}`, 
        mode: { '.tag': 'overwrite' }
      });
      console.log('Data uploaded to Dropbox');
    }
  };
};
```

</details>

<details>
<summary><b>🔗 Multi-Device Control</b></summary>

```typescript
import { App, AppInstanceType, Worker } from 'obniz-app-sdk'
import Obniz from 'obniz';

class MyWorker extends Worker {

  async onObnizConnect(obniz){
    console.log(`obniz ${obniz.id} connected`);
    await obniz.ble!.initWait();
  }

  async onObnizLoop(obniz){
    if (!obniz.ble!.isInitialized) return;
    const peripherals = await obniz.ble.scan.startAllWait(null, {
      duration : 20
    });
    console.log(`founded BLE Devices by obniz ${obniz.id} count=${peripherals.length}`)
  }

}

const app = new App({
  appToken: process.env.APPTOKEN,
  workerClass: MyWorker,
  instanceType: AppInstanceType.Master,
  obnizClass: Obniz
})

app.start();
```

</details>

<details>
<summary><b>🌡️ Temperature Monitoring</b></summary>

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  const tempSensor = obniz.wired("LM35DZ", { gnd: 0, output: 1, vcc: 2 });
  
  setInterval(async (): Promise<void> => {
    const temp = await tempSensor.getWait();
    console.log(`Temperature: ${temp.toFixed(1)}°C`);
    obniz.display.clear();
    obniz.display.print(`${temp.toFixed(1)} C`);
  }, 1000);
};
```

</details>

<details>
<summary><b>📡 Express.js API Server</b></summary>

```typescript
import Obniz from 'obniz';
import express, { Request, Response } from 'express';

const app = express();
const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

let led: ReturnType<typeof obniz.wired<"LED">> | null = null;

obniz.onconnect = async (): Promise<void> => {
  led = obniz.wired("LED", { anode: 0, cathode: 1 });
  console.log('obniz connected');
};

app.get('/led/on', (req: Request, res: Response): void => {
  if (led) {
    led.on();
    res.json({ status: 'LED is ON' });
  } else {
    res.status(503).json({ error: 'Device not connected' });
  }
});

app.get('/led/off', (req: Request, res: Response): void => {
  if (led) {
    led.off();
    res.json({ status: 'LED is OFF' });
  } else {
    res.status(503).json({ error: 'Device not connected' });
  }
});

app.listen(3000, (): void => {
  console.log('Server running on http://localhost:3000');
});
```

</details>

## 🔧 Core Features

### Connection Lifecycle

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // Called when connected successfully
  obniz.display.print("Connected!");
};

obniz.onloop = async (): Promise<void> => {
  // Called continuously while connected
};

obniz.onclose = async (): Promise<void> => {
  // Called when connection is lost
  console.log('Connection closed');
};
```

### GPIO & Peripherals

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // Digital I/O
  obniz.io0.drive("5v");
  obniz.io0.output(true);
  
  // Analog Input
  obniz.ad3.start((voltage: number): void => {
    console.log(`Voltage: ${voltage}V`);
  });

  // PWM
  const pwm = obniz.getFreePwm();
  pwm.start({ io: 4 });
  pwm.freq(1000);
  pwm.duty(50);

  // UART
  const uart = obniz.getFreeUart();
  uart.start({ tx: 5, rx: 6, baud: 9600 });
  uart.send("Hello");
};
```

## 🧩 Parts Library

100+ pre-built components ready to use. [View Full Library →](https://obniz.com/sdk/parts/)

| Category | Examples |
|----------|----------|
| 💡 **LED & Display** | LED, OLED, LCD, 7-Segment |
| 🔊 **Sensors** | Temperature, Humidity, Distance, Motion |
| ⚙️ **Motors** | Servo, DC Motor, Stepper |
| 📡 **Communication** | Bluetooth, GPS, RFID |

**Example: Distance Sensor (HC-SR04)**

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000");

obniz.onconnect = async (): Promise<void> => {
  const hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
  hcsr04.unit("inch");
  
  hcsr04.measure((distance: number): void => {
    console.log(`Distance: ${distance} inch`);
  });
};
```

## 📚 Documentation

| Resource | Description |
|----------|-------------|
| [📖 Guides](https://docs.obniz.io/guides/) | Step-by-step tutorials |
| [📘 API Reference](https://obniz.github.io/obniz/obnizjs/index.html) | Complete class documentation |
| [🔌 Parts Library](https://obniz.com/sdk/parts/) | Component documentation |
| [💻 Examples](./examples) | Sample projects |

## 🛠️ Requirements

- **Node.js**: 10.23.0 or higher
- **TypeScript**: 4.0 or higher (recommended)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./devtools/docs/README.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](./LICENSE.txt) file for details.

## 🔗 Links

- [obniz Website](https://obniz.com/)
- [obniz Devices](https://iot.obniz.com/product-comparison)

---

<div align="center">
  <p>Made with ❤️ by the <a href="https://obniz.com/">obniz</a> team</p>
  <p>
    <a href="https://twitter.com/obniz_jp">Twitter</a> •
    <a href="https://github.com/obniz">GitHub</a>
  </p>
</div>