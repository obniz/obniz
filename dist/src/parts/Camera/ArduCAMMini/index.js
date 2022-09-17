"use strict";
/**
 * @packageDocumentation
 * @module Parts.ArduCAMMini
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ArduCAMMini {
    constructor() {
        this.keys = [
            'cs',
            'mosi',
            'miso',
            'sclk',
            'gnd',
            'vcc',
            'sda',
            'scl',
            'spi',
            'i2c',
            'spi_frequency',
            'spi_drive',
            'module_version',
        ];
        this.requiredKeys = ['cs'];
        this.ioKeys = this.keys;
        this.displayName = 'Cam';
        this.regs = {
            ARDUCHIP_TEST1: 0x00,
            ARDUCHIP_MODE: 0x02,
            ARDUCHIP_FIFO: 0x04,
            BURST_FIFO_READ: 0x3c,
            ARDUCHIP_TRIG: 0x41,
            FIFO_SIZE1: 0x42,
            FIFO_SIZE2: 0x43,
            FIFO_SIZE3: 0x44,
        };
        this.configs = {
            OV2640_JPEG_INIT: [
                [0xff, 0x00],
                [0x2c, 0xff],
                [0x2e, 0xdf],
                [0xff, 0x01],
                [0x3c, 0x32],
                [0x11, 0x04],
                [0x09, 0x02],
                [0x04, 0x28],
                [0x13, 0xe5],
                [0x14, 0x48],
                [0x2c, 0x0c],
                [0x33, 0x78],
                [0x3a, 0x33],
                [0x3b, 0xfb],
                [0x3e, 0x00],
                [0x43, 0x11],
                [0x16, 0x10],
                [0x39, 0x92],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0x48, 0x00],
                [0x5b, 0x00],
                [0x42, 0x03],
                [0x4a, 0x81],
                [0x21, 0x99],
                [0x24, 0x40],
                [0x25, 0x38],
                [0x26, 0x82],
                [0x5c, 0x00],
                [0x63, 0x00],
                [0x61, 0x70],
                [0x62, 0x80],
                [0x7c, 0x05],
                [0x20, 0x80],
                [0x28, 0x30],
                [0x6c, 0x00],
                [0x6d, 0x80],
                [0x6e, 0x00],
                [0x70, 0x02],
                [0x71, 0x94],
                [0x73, 0xc1],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x37, 0xc0],
                [0x4f, 0x60],
                [0x50, 0xa8],
                [0x6d, 0x00],
                [0x3d, 0x38],
                [0x46, 0x3f],
                [0x4f, 0x60],
                [0x0c, 0x3c],
                [0xff, 0x00],
                [0xe5, 0x7f],
                [0xf9, 0xc0],
                [0x41, 0x24],
                [0xe0, 0x14],
                [0x76, 0xff],
                [0x33, 0xa0],
                [0x42, 0x20],
                [0x43, 0x18],
                [0x4c, 0x00],
                [0x87, 0xd5],
                [0x88, 0x3f],
                [0xd7, 0x03],
                [0xd9, 0x10],
                [0xd3, 0x82],
                [0xc8, 0x08],
                [0xc9, 0x80],
                [0x7c, 0x00],
                [0x7d, 0x00],
                [0x7c, 0x03],
                [0x7d, 0x48],
                [0x7d, 0x48],
                [0x7c, 0x08],
                [0x7d, 0x20],
                [0x7d, 0x10],
                [0x7d, 0x0e],
                [0x90, 0x00],
                [0x91, 0x0e],
                [0x91, 0x1a],
                [0x91, 0x31],
                [0x91, 0x5a],
                [0x91, 0x69],
                [0x91, 0x75],
                [0x91, 0x7e],
                [0x91, 0x88],
                [0x91, 0x8f],
                [0x91, 0x96],
                [0x91, 0xa3],
                [0x91, 0xaf],
                [0x91, 0xc4],
                [0x91, 0xd7],
                [0x91, 0xe8],
                [0x91, 0x20],
                [0x92, 0x00],
                [0x93, 0x06],
                [0x93, 0xe3],
                [0x93, 0x05],
                [0x93, 0x05],
                [0x93, 0x00],
                [0x93, 0x04],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x96, 0x00],
                [0x97, 0x08],
                [0x97, 0x19],
                [0x97, 0x02],
                [0x97, 0x0c],
                [0x97, 0x24],
                [0x97, 0x30],
                [0x97, 0x28],
                [0x97, 0x26],
                [0x97, 0x02],
                [0x97, 0x98],
                [0x97, 0x80],
                [0x97, 0x00],
                [0x97, 0x00],
                [0xc3, 0xed],
                [0xa4, 0x00],
                [0xa8, 0x00],
                [0xc5, 0x11],
                [0xc6, 0x51],
                [0xbf, 0x80],
                [0xc7, 0x10],
                [0xb6, 0x66],
                [0xb8, 0xa5],
                [0xb7, 0x64],
                [0xb9, 0x7c],
                [0xb3, 0xaf],
                [0xb4, 0x97],
                [0xb5, 0xff],
                [0xb0, 0xc5],
                [0xb1, 0x94],
                [0xb2, 0x0f],
                [0xc4, 0x5c],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x8c, 0x00],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x5a, 0xc8],
                [0x5b, 0x96],
                [0x5c, 0x00],
                [0xd3, 0x00],
                [0xc3, 0xed],
                [0x7f, 0x00],
                [0xda, 0x00],
                [0xe5, 0x1f],
                [0xe1, 0x67],
                [0xe0, 0x00],
                [0xdd, 0x7f],
                [0x05, 0x00],
                //
                [0x12, 0x40],
                [0xd3, 0x04],
                [0xc0, 0x16],
                [0xc1, 0x12],
                [0x8c, 0x00],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x2c],
                [0x52, 0x24],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x5a, 0x2c],
                [0x5b, 0x24],
                [0x5c, 0x00],
                [0xff, 0xff],
            ],
            OV2640_YUV422: [
                [0xff, 0x00],
                [0x05, 0x00],
                [0xda, 0x10],
                [0xd7, 0x03],
                [0xdf, 0x00],
                [0x33, 0x80],
                [0x3c, 0x40],
                [0xe1, 0x77],
                [0x00, 0x00],
                [0xff, 0xff],
            ],
            OV2640_JPEG: [
                [0xe0, 0x14],
                [0xe1, 0x77],
                [0xe5, 0x1f],
                [0xd7, 0x03],
                [0xda, 0x10],
                [0xe0, 0x00],
                [0xff, 0x01],
                [0x04, 0x08],
                [0xff, 0xff],
            ],
            OV2640_160x120_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x92],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x28],
                [0x5b, 0x1e],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_176x144_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x92],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x2c],
                [0x5b, 0x24],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_320x240_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x89],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x50],
                [0x5b, 0x3c],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_352x288_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x89],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x58],
                [0x5b, 0x48],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_640x480_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x3d],
                [0x50, 0x89],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0xa0],
                [0x5b, 0x78],
                [0x5c, 0x00],
                [0xd3, 0x04],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_800x600_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x35],
                [0x50, 0x89],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0xc8],
                [0x5b, 0x96],
                [0x5c, 0x00],
                [0xd3, 0x02],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_1024x768_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x8c, 0x00],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x5a, 0x00],
                [0x5b, 0xc0],
                [0x5c, 0x01],
                [0xd3, 0x02],
                [0xff, 0xff],
            ],
            OV2640_1280x960_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0x40],
                [0x5b, 0xf0],
                [0x5c, 0x01],
                [0xd3, 0x02],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_1600x1200_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0x90],
                [0x5b, 0x2c],
                [0x5c, 0x05],
                [0xd3, 0x02],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
        };
    }
    static info() {
        return {
            name: 'ArduCAMMini',
        };
    }
    wired(obniz) {
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.io_cs = obniz.getIO(this.params.cs);
        this.io_cs.output(true);
        obniz.wait(100);
        this.sensor_addr = 0x30; // i2c
        this.params.module_version = this.params.module_version || 0;
        this.params.mode = this.params.mode || 'master';
        this.params.drive = this.params.spi_drive || '3v';
        this.params.frequency = this.params.spi_frequency || 4 * 1000 * 1000;
        this.params.clk = this.params.sclk;
        this.spi = this.obniz.getSpiWithConfig(this.params);
        this.params.clock = this.params.clock || 100 * 1000;
        this.params.mode = 'master';
        this.params.pull = '5v';
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    spi_write(addr, byteData) {
        const data = [];
        data.push(addr);
        data.push(byteData);
        this.io_cs.output(false);
        this.spi.write(data);
        this.io_cs.output(true);
    }
    async spi_readWait(addr) {
        const data = [];
        data.push(addr);
        data.push(0x00);
        this.io_cs.output(false);
        const recv = await this.spi.writeWait(data);
        this.io_cs.output(true);
        return recv[1];
    }
    i2c_byte_write(addr, byteData) {
        this.i2c.write(this.sensor_addr, [addr, byteData]);
    }
    i2c_regs_write(regs) {
        for (let i = 0; i < regs.length; i++) {
            this.i2c.write(this.sensor_addr, regs[i]);
        }
    }
    spi_write_reg(addr, byteData) {
        this.spi_write(addr | 0x80, byteData);
    }
    async spi_read_regWait(addr) {
        return await this.spi_readWait(addr & 0x7f);
    }
    async spi_pingpongWait() {
        const testVal = 0x55;
        this.spi_write_reg(this.regs.ARDUCHIP_TEST1, testVal);
        const val = await this.spi_read_regWait(this.regs.ARDUCHIP_TEST1);
        if (val !== testVal) {
            throw new Error('spi bus fail');
        }
    }
    setMode(mode) {
        const modes = {
            MCU2LCD: 0x00,
            CAM2LCD: 0x01,
            LCD2MCU: 0x02,
        };
        if (typeof modes[mode] !== 'number') {
            throw new Error('unknown mode. options are ' + modes);
        }
        this.spi_write_reg(this.regs.ARDUCHIP_MODE, modes[mode]);
    }
    async getChipIdWait() {
        this.i2c.write(this.sensor_addr, [0x0a]);
        const val0 = await this.i2c.readWait(this.sensor_addr, 1);
        this.i2c.write(this.sensor_addr, [0x0b]);
        const val1 = await this.i2c.readWait(this.sensor_addr, 1);
        return (val0[0] << 8) + val1[0];
    }
    init() {
        this.i2c_byte_write(0xff, 0x01);
        this.i2c_byte_write(0x12, 0x80);
        this.obniz.wait(100).catch(() => {
            // ignore error
        });
        this.i2c_regs_write(this.configs.OV2640_JPEG_INIT);
        this.i2c_regs_write(this.configs.OV2640_YUV422);
        this.i2c_regs_write(this.configs.OV2640_JPEG);
        this.i2c_byte_write(0xff, 0x01);
        this.i2c_byte_write(0x15, 0x00);
        this.setSize('320x240');
    }
    async startupWait() {
        await this.spi_pingpongWait();
        this.setMode('MCU2LCD');
        const chipid = await this.getChipIdWait();
        if (chipid !== 0x2642 && chipid !== 0x2641) {
            throw new Error('unknown chip ' + chipid);
        }
        this.init();
    }
    async takeWait(size) {
        if (typeof size === 'string' && this._size !== size) {
            this.setSize(size);
            await this.obniz.wait(1000);
        }
        this.flushFIFO();
        this.flushFIFO();
        this.startCapture();
        while (true) {
            if (await this.isCaptureDoneWait()) {
                break;
            }
        }
        return await this.readFIFOWait();
    }
    setSize(string) {
        if (this._size === string) {
            return;
        }
        const map = {
            '160x120': this.configs.OV2640_160x120_JPEG,
            '176x144': this.configs.OV2640_176x144_JPEG,
            '320x240': this.configs.OV2640_320x240_JPEG,
            '352x288': this.configs.OV2640_352x288_JPEG,
            '640x480': this.configs.OV2640_640x480_JPEG,
            '800x600': this.configs.OV2640_800x600_JPEG,
            '1024x768': this.configs.OV2640_1024x768_JPEG,
            '1280x960': this.configs.OV2640_1280x960_JPEG,
            '1600x1200': this.configs.OV2640_1600x1200_JPEG,
        };
        if (map[string]) {
            this._size = string;
            this.i2c_regs_write(map[string]);
        }
        else {
            throw new Error('unsupported size options are ' + Object.keys(map));
        }
    }
    updateFIFO(data) {
        //  FIFO_CLEAR_MASK    		0x01
        //  FIFO_START_MASK    		0x02
        //  FIFO_RDPTR_RST_MASK     0x10
        //  FIFO_WRPTR_RST_MASK     0x20
        this.spi_write_reg(this.regs.ARDUCHIP_FIFO, data);
    }
    flushFIFO() {
        this.spi_write_reg(this.regs.ARDUCHIP_FIFO, 0x01);
    }
    async readFIFOLengthWait() {
        const len1 = await this.spi_read_regWait(this.regs.FIFO_SIZE1);
        const len2 = await this.spi_read_regWait(this.regs.FIFO_SIZE2);
        const len3 = (await this.spi_read_regWait(this.regs.FIFO_SIZE3)) & 0x07;
        return ((len3 << 16) | (len2 << 8) | len1) & 0x07ffff;
    }
    startCapture() {
        this.spi_write_reg(this.regs.ARDUCHIP_FIFO, 0x02);
    }
    async isCaptureDoneWait() {
        const CAP_DONE_MASK = 0x08;
        const val = await this.spi_read_regWait(this.regs.ARDUCHIP_TRIG);
        return val & CAP_DONE_MASK ? true : false;
    }
    async readFIFOWait() {
        // get length of image data
        const length = await this.readFIFOLengthWait();
        // start bust
        this.io_cs.output(false);
        this.spi.write([this.regs.BURST_FIFO_READ]);
        if (this.params.module_version === 0) {
            this.spi.write([0xff]); // dummy read
        }
        const buf = [];
        while (buf.length < length) {
            let mustRead = length - buf.length;
            if (mustRead > 1024) {
                mustRead = 1024;
            }
            const arr = new Array(mustRead);
            arr.fill(0);
            const sliced = await this.spi.writeWait(arr);
            buf.push(...sliced);
        }
        // end burst
        this.io_cs.output(true);
        return buf;
    }
    arrayToBase64(array) {
        return Buffer.from(array).toString('base64');
    }
}
exports.default = ArduCAMMini;
