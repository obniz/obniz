"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.params.sda = this.params.sda;
        this.params.scl = this.params.scl;
        this.params.clock = this.params.clock || 100 * 1000;
        this.params.mode = 'master';
        this.params.pull = '5v';
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    spi_write(addr, byteData) {
        let data = [];
        data.push(addr);
        data.push(byteData);
        this.io_cs.output(false);
        this.spi.write(data);
        this.io_cs.output(true);
    }
    spi_readWait(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            data.push(addr);
            data.push(0x00);
            this.io_cs.output(false);
            const recv = yield this.spi.writeWait(data);
            this.io_cs.output(true);
            return recv[1];
        });
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
    spi_read_regWait(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.spi_readWait(addr & 0x7f);
        });
    }
    spi_pingpongWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const testVal = 0x55;
            this.spi_write_reg(this.regs.ARDUCHIP_TEST1, testVal);
            const val = yield this.spi_read_regWait(this.regs.ARDUCHIP_TEST1);
            if (val !== testVal) {
                throw new Error('spi bus fail');
            }
        });
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
    getChipIdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.sensor_addr, [0x0a]);
            const val0 = yield this.i2c.readWait(this.sensor_addr, 1);
            this.i2c.write(this.sensor_addr, [0x0b]);
            const val1 = yield this.i2c.readWait(this.sensor_addr, 1);
            return (val0[0] << 8) + val1[0];
        });
    }
    init() {
        this.i2c_byte_write(0xff, 0x01);
        this.i2c_byte_write(0x12, 0x80);
        this.obniz.wait(100);
        this.i2c_regs_write(this.configs.OV2640_JPEG_INIT);
        this.i2c_regs_write(this.configs.OV2640_YUV422);
        this.i2c_regs_write(this.configs.OV2640_JPEG);
        this.i2c_byte_write(0xff, 0x01);
        this.i2c_byte_write(0x15, 0x00);
        this.setSize('320x240');
    }
    startupWait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.spi_pingpongWait();
            this.setMode('MCU2LCD');
            const chipid = yield this.getChipIdWait();
            if (chipid != 0x2642 && chipid != 0x2641) {
                throw new Error('unknown chip ' + chipid);
            }
            this.init();
        });
    }
    takeWait(size) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof size === 'string' && this._size !== size) {
                this.setSize(size);
                this.obniz.wait(1000);
            }
            this.flushFIFO();
            this.flushFIFO();
            this.startCapture();
            while (true) {
                if (yield this.isCaptureDoneWait()) {
                    break;
                }
            }
            return yield this.readFIFOWait();
        });
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
    readFIFOLengthWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const len1 = yield this.spi_read_regWait(this.regs.FIFO_SIZE1);
            const len2 = yield this.spi_read_regWait(this.regs.FIFO_SIZE2);
            const len3 = (yield this.spi_read_regWait(this.regs.FIFO_SIZE3)) & 0x07;
            return ((len3 << 16) | (len2 << 8) | len1) & 0x07ffff;
        });
    }
    startCapture() {
        this.spi_write_reg(this.regs.ARDUCHIP_FIFO, 0x02);
    }
    isCaptureDoneWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const CAP_DONE_MASK = 0x08;
            const val = yield this.spi_read_regWait(this.regs.ARDUCHIP_TRIG);
            return val & CAP_DONE_MASK ? true : false;
        });
    }
    readFIFOWait() {
        return __awaiter(this, void 0, void 0, function* () {
            // get length of image data
            let length = yield this.readFIFOLengthWait();
            // start bust
            this.io_cs.output(false);
            this.spi.write([this.regs.BURST_FIFO_READ]);
            if (this.params.module_version == 0) {
                this.spi.write([0xff]); // dummy read
            }
            let buf = [];
            while (buf.length < length) {
                let mustRead = length - buf.length;
                if (mustRead > 1024) {
                    mustRead = 1024;
                }
                let arr = new Array(mustRead);
                arr.fill(0);
                const sliced = yield this.spi.writeWait(arr);
                buf.push(...sliced);
            }
            // end burst
            this.io_cs.output(true);
            return buf;
        });
    }
    arrayToBase64(array) {
        return Buffer.from(array).toString('base64');
    }
}
if (typeof module === 'object') {
    module.exports = ArduCAMMini;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9DYW1lcmEvQXJkdUNBTU1pbmkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sV0FBVztJQUNmO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRztZQUNWLElBQUk7WUFDSixNQUFNO1lBQ04sTUFBTTtZQUNOLE1BQU07WUFDTixLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxlQUFlO1lBQ2YsV0FBVztZQUNYLGdCQUFnQjtTQUNqQixDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsY0FBYyxFQUFFLElBQUk7WUFDcEIsYUFBYSxFQUFFLElBQUk7WUFDbkIsYUFBYSxFQUFFLElBQUk7WUFDbkIsZUFBZSxFQUFFLElBQUk7WUFDckIsYUFBYSxFQUFFLElBQUk7WUFDbkIsVUFBVSxFQUFFLElBQUk7WUFDaEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixnQkFBZ0IsRUFBRTtnQkFDaEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLEVBQUU7Z0JBQ0YsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ2I7WUFFRCxhQUFhLEVBQUU7Z0JBQ2IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ2I7WUFFRCxXQUFXLEVBQUU7Z0JBQ1gsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELG1CQUFtQixFQUFFO2dCQUNuQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELG1CQUFtQixFQUFFO2dCQUNuQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELG1CQUFtQixFQUFFO2dCQUNuQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELG1CQUFtQixFQUFFO2dCQUNuQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELG1CQUFtQixFQUFFO2dCQUNuQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUVaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ2I7WUFFRCxtQkFBbUIsRUFBRTtnQkFDbkIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFFWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUVaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1lBRUQsb0JBQW9CLEVBQUU7Z0JBQ3BCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBRVosQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBRVosQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ2I7WUFFRCxvQkFBb0IsRUFBRTtnQkFDcEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFFWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUVaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1lBRUQscUJBQXFCLEVBQUU7Z0JBQ3JCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FB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QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztDQUM5QiIsImZpbGUiOiJwYXJ0cy9DYW1lcmEvQXJkdUNBTU1pbmkvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcmR1Q0FNTWluaSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcbiAgICAgICdjcycsXG4gICAgICAnbW9zaScsXG4gICAgICAnbWlzbycsXG4gICAgICAnc2NsaycsXG4gICAgICAnZ25kJyxcbiAgICAgICd2Y2MnLFxuICAgICAgJ3NkYScsXG4gICAgICAnc2NsJyxcbiAgICAgICdzcGknLFxuICAgICAgJ2kyYycsXG4gICAgICAnc3BpX2ZyZXF1ZW5jeScsXG4gICAgICAnc3BpX2RyaXZlJyxcbiAgICAgICdtb2R1bGVfdmVyc2lvbicsXG4gICAgXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnY3MnXTtcblxuICAgIHRoaXMuaW9LZXlzID0gdGhpcy5rZXlzO1xuICAgIHRoaXMuZGlzcGxheU5hbWUgPSAnQ2FtJztcblxuICAgIHRoaXMucmVncyA9IHtcbiAgICAgIEFSRFVDSElQX1RFU1QxOiAweDAwLFxuICAgICAgQVJEVUNISVBfTU9ERTogMHgwMixcbiAgICAgIEFSRFVDSElQX0ZJRk86IDB4MDQsXG4gICAgICBCVVJTVF9GSUZPX1JFQUQ6IDB4M2MsXG4gICAgICBBUkRVQ0hJUF9UUklHOiAweDQxLFxuICAgICAgRklGT19TSVpFMTogMHg0MixcbiAgICAgIEZJRk9fU0laRTI6IDB4NDMsXG4gICAgICBGSUZPX1NJWkUzOiAweDQ0LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3MgPSB7XG4gICAgICBPVjI2NDBfSlBFR19JTklUOiBbXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4MmMsIDB4ZmZdLFxuICAgICAgICBbMHgyZSwgMHhkZl0sXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4M2MsIDB4MzJdLFxuICAgICAgICBbMHgxMSwgMHgwNF0sXG4gICAgICAgIFsweDA5LCAweDAyXSxcbiAgICAgICAgWzB4MDQsIDB4MjhdLFxuICAgICAgICBbMHgxMywgMHhlNV0sXG4gICAgICAgIFsweDE0LCAweDQ4XSxcbiAgICAgICAgWzB4MmMsIDB4MGNdLFxuICAgICAgICBbMHgzMywgMHg3OF0sXG4gICAgICAgIFsweDNhLCAweDMzXSxcbiAgICAgICAgWzB4M2IsIDB4ZmJdLFxuICAgICAgICBbMHgzZSwgMHgwMF0sXG4gICAgICAgIFsweDQzLCAweDExXSxcbiAgICAgICAgWzB4MTYsIDB4MTBdLFxuICAgICAgICBbMHgzOSwgMHg5Ml0sXG4gICAgICAgIFsweDM1LCAweGRhXSxcbiAgICAgICAgWzB4MjIsIDB4MWFdLFxuICAgICAgICBbMHgzNywgMHhjM10sXG4gICAgICAgIFsweDIzLCAweDAwXSxcbiAgICAgICAgWzB4MzQsIDB4YzBdLFxuICAgICAgICBbMHgzNiwgMHgxYV0sXG4gICAgICAgIFsweDA2LCAweDg4XSxcbiAgICAgICAgWzB4MDcsIDB4YzBdLFxuICAgICAgICBbMHgwZCwgMHg4N10sXG4gICAgICAgIFsweDBlLCAweDQxXSxcbiAgICAgICAgWzB4NGMsIDB4MDBdLFxuICAgICAgICBbMHg0OCwgMHgwMF0sXG4gICAgICAgIFsweDViLCAweDAwXSxcbiAgICAgICAgWzB4NDIsIDB4MDNdLFxuICAgICAgICBbMHg0YSwgMHg4MV0sXG4gICAgICAgIFsweDIxLCAweDk5XSxcbiAgICAgICAgWzB4MjQsIDB4NDBdLFxuICAgICAgICBbMHgyNSwgMHgzOF0sXG4gICAgICAgIFsweDI2LCAweDgyXSxcbiAgICAgICAgWzB4NWMsIDB4MDBdLFxuICAgICAgICBbMHg2MywgMHgwMF0sXG4gICAgICAgIFsweDYxLCAweDcwXSxcbiAgICAgICAgWzB4NjIsIDB4ODBdLFxuICAgICAgICBbMHg3YywgMHgwNV0sXG4gICAgICAgIFsweDIwLCAweDgwXSxcbiAgICAgICAgWzB4MjgsIDB4MzBdLFxuICAgICAgICBbMHg2YywgMHgwMF0sXG4gICAgICAgIFsweDZkLCAweDgwXSxcbiAgICAgICAgWzB4NmUsIDB4MDBdLFxuICAgICAgICBbMHg3MCwgMHgwMl0sXG4gICAgICAgIFsweDcxLCAweDk0XSxcbiAgICAgICAgWzB4NzMsIDB4YzFdLFxuICAgICAgICBbMHgxMiwgMHg0MF0sXG4gICAgICAgIFsweDE3LCAweDExXSxcbiAgICAgICAgWzB4MTgsIDB4NDNdLFxuICAgICAgICBbMHgxOSwgMHgwMF0sXG4gICAgICAgIFsweDFhLCAweDRiXSxcbiAgICAgICAgWzB4MzIsIDB4MDldLFxuICAgICAgICBbMHgzNywgMHhjMF0sXG4gICAgICAgIFsweDRmLCAweDYwXSxcbiAgICAgICAgWzB4NTAsIDB4YThdLFxuICAgICAgICBbMHg2ZCwgMHgwMF0sXG4gICAgICAgIFsweDNkLCAweDM4XSxcbiAgICAgICAgWzB4NDYsIDB4M2ZdLFxuICAgICAgICBbMHg0ZiwgMHg2MF0sXG4gICAgICAgIFsweDBjLCAweDNjXSxcbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlNSwgMHg3Zl0sXG4gICAgICAgIFsweGY5LCAweGMwXSxcbiAgICAgICAgWzB4NDEsIDB4MjRdLFxuICAgICAgICBbMHhlMCwgMHgxNF0sXG4gICAgICAgIFsweDc2LCAweGZmXSxcbiAgICAgICAgWzB4MzMsIDB4YTBdLFxuICAgICAgICBbMHg0MiwgMHgyMF0sXG4gICAgICAgIFsweDQzLCAweDE4XSxcbiAgICAgICAgWzB4NGMsIDB4MDBdLFxuICAgICAgICBbMHg4NywgMHhkNV0sXG4gICAgICAgIFsweDg4LCAweDNmXSxcbiAgICAgICAgWzB4ZDcsIDB4MDNdLFxuICAgICAgICBbMHhkOSwgMHgxMF0sXG4gICAgICAgIFsweGQzLCAweDgyXSxcbiAgICAgICAgWzB4YzgsIDB4MDhdLFxuICAgICAgICBbMHhjOSwgMHg4MF0sXG4gICAgICAgIFsweDdjLCAweDAwXSxcbiAgICAgICAgWzB4N2QsIDB4MDBdLFxuICAgICAgICBbMHg3YywgMHgwM10sXG4gICAgICAgIFsweDdkLCAweDQ4XSxcbiAgICAgICAgWzB4N2QsIDB4NDhdLFxuICAgICAgICBbMHg3YywgMHgwOF0sXG4gICAgICAgIFsweDdkLCAweDIwXSxcbiAgICAgICAgWzB4N2QsIDB4MTBdLFxuICAgICAgICBbMHg3ZCwgMHgwZV0sXG4gICAgICAgIFsweDkwLCAweDAwXSxcbiAgICAgICAgWzB4OTEsIDB4MGVdLFxuICAgICAgICBbMHg5MSwgMHgxYV0sXG4gICAgICAgIFsweDkxLCAweDMxXSxcbiAgICAgICAgWzB4OTEsIDB4NWFdLFxuICAgICAgICBbMHg5MSwgMHg2OV0sXG4gICAgICAgIFsweDkxLCAweDc1XSxcbiAgICAgICAgWzB4OTEsIDB4N2VdLFxuICAgICAgICBbMHg5MSwgMHg4OF0sXG4gICAgICAgIFsweDkxLCAweDhmXSxcbiAgICAgICAgWzB4OTEsIDB4OTZdLFxuICAgICAgICBbMHg5MSwgMHhhM10sXG4gICAgICAgIFsweDkxLCAweGFmXSxcbiAgICAgICAgWzB4OTEsIDB4YzRdLFxuICAgICAgICBbMHg5MSwgMHhkN10sXG4gICAgICAgIFsweDkxLCAweGU4XSxcbiAgICAgICAgWzB4OTEsIDB4MjBdLFxuICAgICAgICBbMHg5MiwgMHgwMF0sXG4gICAgICAgIFsweDkzLCAweDA2XSxcbiAgICAgICAgWzB4OTMsIDB4ZTNdLFxuICAgICAgICBbMHg5MywgMHgwNV0sXG4gICAgICAgIFsweDkzLCAweDA1XSxcbiAgICAgICAgWzB4OTMsIDB4MDBdLFxuICAgICAgICBbMHg5MywgMHgwNF0sXG4gICAgICAgIFsweDkzLCAweDAwXSxcbiAgICAgICAgWzB4OTMsIDB4MDBdLFxuICAgICAgICBbMHg5MywgMHgwMF0sXG4gICAgICAgIFsweDkzLCAweDAwXSxcbiAgICAgICAgWzB4OTMsIDB4MDBdLFxuICAgICAgICBbMHg5MywgMHgwMF0sXG4gICAgICAgIFsweDkzLCAweDAwXSxcbiAgICAgICAgWzB4OTYsIDB4MDBdLFxuICAgICAgICBbMHg5NywgMHgwOF0sXG4gICAgICAgIFsweDk3LCAweDE5XSxcbiAgICAgICAgWzB4OTcsIDB4MDJdLFxuICAgICAgICBbMHg5NywgMHgwY10sXG4gICAgICAgIFsweDk3LCAweDI0XSxcbiAgICAgICAgWzB4OTcsIDB4MzBdLFxuICAgICAgICBbMHg5NywgMHgyOF0sXG4gICAgICAgIFsweDk3LCAweDI2XSxcbiAgICAgICAgWzB4OTcsIDB4MDJdLFxuICAgICAgICBbMHg5NywgMHg5OF0sXG4gICAgICAgIFsweDk3LCAweDgwXSxcbiAgICAgICAgWzB4OTcsIDB4MDBdLFxuICAgICAgICBbMHg5NywgMHgwMF0sXG4gICAgICAgIFsweGMzLCAweGVkXSxcbiAgICAgICAgWzB4YTQsIDB4MDBdLFxuICAgICAgICBbMHhhOCwgMHgwMF0sXG4gICAgICAgIFsweGM1LCAweDExXSxcbiAgICAgICAgWzB4YzYsIDB4NTFdLFxuICAgICAgICBbMHhiZiwgMHg4MF0sXG4gICAgICAgIFsweGM3LCAweDEwXSxcbiAgICAgICAgWzB4YjYsIDB4NjZdLFxuICAgICAgICBbMHhiOCwgMHhhNV0sXG4gICAgICAgIFsweGI3LCAweDY0XSxcbiAgICAgICAgWzB4YjksIDB4N2NdLFxuICAgICAgICBbMHhiMywgMHhhZl0sXG4gICAgICAgIFsweGI0LCAweDk3XSxcbiAgICAgICAgWzB4YjUsIDB4ZmZdLFxuICAgICAgICBbMHhiMCwgMHhjNV0sXG4gICAgICAgIFsweGIxLCAweDk0XSxcbiAgICAgICAgWzB4YjIsIDB4MGZdLFxuICAgICAgICBbMHhjNCwgMHg1Y10sXG4gICAgICAgIFsweGMwLCAweDY0XSxcbiAgICAgICAgWzB4YzEsIDB4NGJdLFxuICAgICAgICBbMHg4YywgMHgwMF0sXG4gICAgICAgIFsweDg2LCAweDNkXSxcbiAgICAgICAgWzB4NTAsIDB4MDBdLFxuICAgICAgICBbMHg1MSwgMHhjOF0sXG4gICAgICAgIFsweDUyLCAweDk2XSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4YzhdLFxuICAgICAgICBbMHg1YiwgMHg5Nl0sXG4gICAgICAgIFsweDVjLCAweDAwXSxcbiAgICAgICAgWzB4ZDMsIDB4MDBdLCAvL1sgMHhkMywgMHg3ZiBdLFxuICAgICAgICBbMHhjMywgMHhlZF0sXG4gICAgICAgIFsweDdmLCAweDAwXSxcbiAgICAgICAgWzB4ZGEsIDB4MDBdLFxuICAgICAgICBbMHhlNSwgMHgxZl0sXG4gICAgICAgIFsweGUxLCAweDY3XSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuICAgICAgICBbMHhkZCwgMHg3Zl0sXG4gICAgICAgIFsweDA1LCAweDAwXSxcbiAgICAgICAgLy9cbiAgICAgICAgWzB4MTIsIDB4NDBdLFxuICAgICAgICBbMHhkMywgMHgwNF0sIC8vWyAweGQzLCAweDdmIF0sXG4gICAgICAgIFsweGMwLCAweDE2XSxcbiAgICAgICAgWzB4YzEsIDB4MTJdLFxuICAgICAgICBbMHg4YywgMHgwMF0sXG4gICAgICAgIFsweDg2LCAweDNkXSxcbiAgICAgICAgWzB4NTAsIDB4MDBdLFxuICAgICAgICBbMHg1MSwgMHgyY10sXG4gICAgICAgIFsweDUyLCAweDI0XSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4MmNdLFxuICAgICAgICBbMHg1YiwgMHgyNF0sXG4gICAgICAgIFsweDVjLCAweDAwXSxcbiAgICAgICAgWzB4ZmYsIDB4ZmZdLFxuICAgICAgXSxcblxuICAgICAgT1YyNjQwX1lVVjQyMjogW1xuICAgICAgICBbMHhmZiwgMHgwMF0sXG4gICAgICAgIFsweDA1LCAweDAwXSxcbiAgICAgICAgWzB4ZGEsIDB4MTBdLFxuICAgICAgICBbMHhkNywgMHgwM10sXG4gICAgICAgIFsweGRmLCAweDAwXSxcbiAgICAgICAgWzB4MzMsIDB4ODBdLFxuICAgICAgICBbMHgzYywgMHg0MF0sXG4gICAgICAgIFsweGUxLCAweDc3XSxcbiAgICAgICAgWzB4MDAsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfSlBFRzogW1xuICAgICAgICBbMHhlMCwgMHgxNF0sXG4gICAgICAgIFsweGUxLCAweDc3XSxcbiAgICAgICAgWzB4ZTUsIDB4MWZdLFxuICAgICAgICBbMHhkNywgMHgwM10sXG4gICAgICAgIFsweGRhLCAweDEwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHgwMV0sXG4gICAgICAgIFsweDA0LCAweDA4XSxcbiAgICAgICAgWzB4ZmYsIDB4ZmZdLFxuICAgICAgXSxcblxuICAgICAgT1YyNjQwXzE2MHgxMjBfSlBFRzogW1xuICAgICAgICBbMHhmZiwgMHgwMV0sXG4gICAgICAgIFsweDEyLCAweDQwXSxcbiAgICAgICAgWzB4MTcsIDB4MTFdLFxuICAgICAgICBbMHgxOCwgMHg0M10sXG4gICAgICAgIFsweDE5LCAweDAwXSxcbiAgICAgICAgWzB4MWEsIDB4NGJdLFxuICAgICAgICBbMHgzMiwgMHgwOV0sXG4gICAgICAgIFsweDRmLCAweGNhXSxcbiAgICAgICAgWzB4NTAsIDB4YThdLFxuICAgICAgICBbMHg1YSwgMHgyM10sXG4gICAgICAgIFsweDZkLCAweDAwXSxcbiAgICAgICAgWzB4MzksIDB4MTJdLFxuICAgICAgICBbMHgzNSwgMHhkYV0sXG4gICAgICAgIFsweDIyLCAweDFhXSxcbiAgICAgICAgWzB4MzcsIDB4YzNdLFxuICAgICAgICBbMHgyMywgMHgwMF0sXG4gICAgICAgIFsweDM0LCAweGMwXSxcbiAgICAgICAgWzB4MzYsIDB4MWFdLFxuICAgICAgICBbMHgwNiwgMHg4OF0sXG4gICAgICAgIFsweDA3LCAweGMwXSxcbiAgICAgICAgWzB4MGQsIDB4ODddLFxuICAgICAgICBbMHgwZSwgMHg0MV0sXG4gICAgICAgIFsweDRjLCAweDAwXSxcbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwNF0sXG4gICAgICAgIFsweGMwLCAweDY0XSxcbiAgICAgICAgWzB4YzEsIDB4NGJdLFxuICAgICAgICBbMHg4NiwgMHgzNV0sXG4gICAgICAgIFsweDUwLCAweDkyXSxcbiAgICAgICAgWzB4NTEsIDB4YzhdLFxuICAgICAgICBbMHg1MiwgMHg5Nl0sXG4gICAgICAgIFsweDUzLCAweDAwXSxcbiAgICAgICAgWzB4NTQsIDB4MDBdLFxuICAgICAgICBbMHg1NSwgMHgwMF0sXG4gICAgICAgIFsweDU3LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4MjhdLFxuICAgICAgICBbMHg1YiwgMHgxZV0sXG4gICAgICAgIFsweDVjLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfMTc2eDE0NF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTIsIDB4NDBdLFxuICAgICAgICBbMHgxNywgMHgxMV0sXG4gICAgICAgIFsweDE4LCAweDQzXSxcbiAgICAgICAgWzB4MTksIDB4MDBdLFxuICAgICAgICBbMHgxYSwgMHg0Yl0sXG4gICAgICAgIFsweDMyLCAweDA5XSxcbiAgICAgICAgWzB4NGYsIDB4Y2FdLFxuICAgICAgICBbMHg1MCwgMHhhOF0sXG4gICAgICAgIFsweDVhLCAweDIzXSxcbiAgICAgICAgWzB4NmQsIDB4MDBdLFxuICAgICAgICBbMHgzOSwgMHgxMl0sXG4gICAgICAgIFsweDM1LCAweGRhXSxcbiAgICAgICAgWzB4MjIsIDB4MWFdLFxuICAgICAgICBbMHgzNywgMHhjM10sXG4gICAgICAgIFsweDIzLCAweDAwXSxcbiAgICAgICAgWzB4MzQsIDB4YzBdLFxuICAgICAgICBbMHgzNiwgMHgxYV0sXG4gICAgICAgIFsweDA2LCAweDg4XSxcbiAgICAgICAgWzB4MDcsIDB4YzBdLFxuICAgICAgICBbMHgwZCwgMHg4N10sXG4gICAgICAgIFsweDBlLCAweDQxXSxcbiAgICAgICAgWzB4NGMsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHgwMF0sXG4gICAgICAgIFsweGUwLCAweDA0XSxcbiAgICAgICAgWzB4YzAsIDB4NjRdLFxuICAgICAgICBbMHhjMSwgMHg0Yl0sXG4gICAgICAgIFsweDg2LCAweDM1XSxcbiAgICAgICAgWzB4NTAsIDB4OTJdLFxuICAgICAgICBbMHg1MSwgMHhjOF0sXG4gICAgICAgIFsweDUyLCAweDk2XSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDAwXSxcbiAgICAgICAgWzB4NTcsIDB4MDBdLFxuICAgICAgICBbMHg1YSwgMHgyY10sXG4gICAgICAgIFsweDViLCAweDI0XSxcbiAgICAgICAgWzB4NWMsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwMF0sXG4gICAgICAgIFsweGZmLCAweGZmXSxcbiAgICAgIF0sXG5cbiAgICAgIE9WMjY0MF8zMjB4MjQwX0pQRUc6IFtcbiAgICAgICAgWzB4ZmYsIDB4MDFdLFxuICAgICAgICBbMHgxMiwgMHg0MF0sXG4gICAgICAgIFsweDE3LCAweDExXSxcbiAgICAgICAgWzB4MTgsIDB4NDNdLFxuICAgICAgICBbMHgxOSwgMHgwMF0sXG4gICAgICAgIFsweDFhLCAweDRiXSxcbiAgICAgICAgWzB4MzIsIDB4MDldLFxuICAgICAgICBbMHg0ZiwgMHhjYV0sXG4gICAgICAgIFsweDUwLCAweGE4XSxcbiAgICAgICAgWzB4NWEsIDB4MjNdLFxuICAgICAgICBbMHg2ZCwgMHgwMF0sXG4gICAgICAgIFsweDM5LCAweDEyXSxcbiAgICAgICAgWzB4MzUsIDB4ZGFdLFxuICAgICAgICBbMHgyMiwgMHgxYV0sXG4gICAgICAgIFsweDM3LCAweGMzXSxcbiAgICAgICAgWzB4MjMsIDB4MDBdLFxuICAgICAgICBbMHgzNCwgMHhjMF0sXG4gICAgICAgIFsweDM2LCAweDFhXSxcbiAgICAgICAgWzB4MDYsIDB4ODhdLFxuICAgICAgICBbMHgwNywgMHhjMF0sXG4gICAgICAgIFsweDBkLCAweDg3XSxcbiAgICAgICAgWzB4MGUsIDB4NDFdLFxuICAgICAgICBbMHg0YywgMHgwMF0sXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDRdLFxuICAgICAgICBbMHhjMCwgMHg2NF0sXG4gICAgICAgIFsweGMxLCAweDRiXSxcbiAgICAgICAgWzB4ODYsIDB4MzVdLFxuICAgICAgICBbMHg1MCwgMHg4OV0sXG4gICAgICAgIFsweDUxLCAweGM4XSxcbiAgICAgICAgWzB4NTIsIDB4OTZdLFxuICAgICAgICBbMHg1MywgMHgwMF0sXG4gICAgICAgIFsweDU0LCAweDAwXSxcbiAgICAgICAgWzB4NTUsIDB4MDBdLFxuICAgICAgICBbMHg1NywgMHgwMF0sXG4gICAgICAgIFsweDVhLCAweDUwXSxcbiAgICAgICAgWzB4NWIsIDB4M2NdLFxuICAgICAgICBbMHg1YywgMHgwMF0sXG4gICAgICAgIFsweGUwLCAweDAwXSxcbiAgICAgICAgWzB4ZmYsIDB4ZmZdLFxuICAgICAgXSxcblxuICAgICAgT1YyNjQwXzM1MngyODhfSlBFRzogW1xuICAgICAgICBbMHhmZiwgMHgwMV0sXG4gICAgICAgIFsweDEyLCAweDQwXSxcbiAgICAgICAgWzB4MTcsIDB4MTFdLFxuICAgICAgICBbMHgxOCwgMHg0M10sXG4gICAgICAgIFsweDE5LCAweDAwXSxcbiAgICAgICAgWzB4MWEsIDB4NGJdLFxuICAgICAgICBbMHgzMiwgMHgwOV0sXG4gICAgICAgIFsweDRmLCAweGNhXSxcbiAgICAgICAgWzB4NTAsIDB4YThdLFxuICAgICAgICBbMHg1YSwgMHgyM10sXG4gICAgICAgIFsweDZkLCAweDAwXSxcbiAgICAgICAgWzB4MzksIDB4MTJdLFxuICAgICAgICBbMHgzNSwgMHhkYV0sXG4gICAgICAgIFsweDIyLCAweDFhXSxcbiAgICAgICAgWzB4MzcsIDB4YzNdLFxuICAgICAgICBbMHgyMywgMHgwMF0sXG4gICAgICAgIFsweDM0LCAweGMwXSxcbiAgICAgICAgWzB4MzYsIDB4MWFdLFxuICAgICAgICBbMHgwNiwgMHg4OF0sXG4gICAgICAgIFsweDA3LCAweGMwXSxcbiAgICAgICAgWzB4MGQsIDB4ODddLFxuICAgICAgICBbMHgwZSwgMHg0MV0sXG4gICAgICAgIFsweDRjLCAweDAwXSxcbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwNF0sXG4gICAgICAgIFsweGMwLCAweDY0XSxcbiAgICAgICAgWzB4YzEsIDB4NGJdLFxuICAgICAgICBbMHg4NiwgMHgzNV0sXG4gICAgICAgIFsweDUwLCAweDg5XSxcbiAgICAgICAgWzB4NTEsIDB4YzhdLFxuICAgICAgICBbMHg1MiwgMHg5Nl0sXG4gICAgICAgIFsweDUzLCAweDAwXSxcbiAgICAgICAgWzB4NTQsIDB4MDBdLFxuICAgICAgICBbMHg1NSwgMHgwMF0sXG4gICAgICAgIFsweDU3LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4NThdLFxuICAgICAgICBbMHg1YiwgMHg0OF0sXG4gICAgICAgIFsweDVjLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfNjQweDQ4MF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTEsIDB4MDFdLFxuICAgICAgICBbMHgxMiwgMHgwMF0sIC8vIEJpdFs2OjRdOiBSZXNvbHV0aW9uIHNlbGVjdGlvbi8vXG4gICAgICAgIFsweDE3LCAweDExXSwgLy8gSFJFRlNUWzEwOjNdXG4gICAgICAgIFsweDE4LCAweDc1XSwgLy8gSFJFRkVORFsxMDozXVxuICAgICAgICBbMHgzMiwgMHgzNl0sIC8vIEJpdFs1OjNdOiBIUkVGRU5EWzI6MF07IEJpdFsyOjBdOiBIUkVGU1RbMjowXVxuICAgICAgICBbMHgxOSwgMHgwMV0sIC8vIFZTVFJUWzk6Ml1cbiAgICAgICAgWzB4MWEsIDB4OTddLCAvLyBWRU5EWzk6Ml1cbiAgICAgICAgWzB4MDMsIDB4MGZdLCAvLyBCaXRbMzoyXTogVkVORFsxOjBdOyBCaXRbMTowXTogVlNUUlRbMTowXVxuICAgICAgICBbMHgzNywgMHg0MF0sXG4gICAgICAgIFsweDRmLCAweGJiXSxcbiAgICAgICAgWzB4NTAsIDB4OWNdLFxuICAgICAgICBbMHg1YSwgMHg1N10sXG4gICAgICAgIFsweDZkLCAweDgwXSxcbiAgICAgICAgWzB4M2QsIDB4MzRdLFxuICAgICAgICBbMHgzOSwgMHgwMl0sXG4gICAgICAgIFsweDM1LCAweDg4XSxcbiAgICAgICAgWzB4MjIsIDB4MGFdLFxuICAgICAgICBbMHgzNywgMHg0MF0sXG4gICAgICAgIFsweDM0LCAweGEwXSxcbiAgICAgICAgWzB4MDYsIDB4MDJdLFxuICAgICAgICBbMHgwZCwgMHhiN10sXG4gICAgICAgIFsweDBlLCAweDAxXSxcblxuICAgICAgICBbMHhmZiwgMHgwMF0sXG4gICAgICAgIFsweGUwLCAweDA0XSxcbiAgICAgICAgWzB4YzAsIDB4YzhdLFxuICAgICAgICBbMHhjMSwgMHg5Nl0sXG4gICAgICAgIFsweDg2LCAweDNkXSxcbiAgICAgICAgWzB4NTAsIDB4ODldLFxuICAgICAgICBbMHg1MSwgMHg5MF0sXG4gICAgICAgIFsweDUyLCAweDJjXSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDg4XSxcbiAgICAgICAgWzB4NTcsIDB4MDBdLFxuICAgICAgICBbMHg1YSwgMHhhMF0sXG4gICAgICAgIFsweDViLCAweDc4XSxcbiAgICAgICAgWzB4NWMsIDB4MDBdLFxuICAgICAgICBbMHhkMywgMHgwNF0sXG4gICAgICAgIFsweGUwLCAweDAwXSxcbiAgICAgICAgWzB4ZmYsIDB4ZmZdLFxuICAgICAgXSxcblxuICAgICAgT1YyNjQwXzgwMHg2MDBfSlBFRzogW1xuICAgICAgICBbMHhmZiwgMHgwMV0sXG4gICAgICAgIFsweDExLCAweDAxXSxcbiAgICAgICAgWzB4MTIsIDB4MDBdLCAvLyBCaXRbNjo0XTogUmVzb2x1dGlvbiBzZWxlY3Rpb25cbiAgICAgICAgWzB4MTcsIDB4MTFdLCAvLyBIUkVGU1RbMTA6M11cbiAgICAgICAgWzB4MTgsIDB4NzVdLCAvLyBIUkVGRU5EWzEwOjNdXG4gICAgICAgIFsweDMyLCAweDM2XSwgLy8gQml0WzU6M106IEhSRUZFTkRbMjowXTsgQml0WzI6MF06IEhSRUZTVFsyOjBdXG4gICAgICAgIFsweDE5LCAweDAxXSwgLy8gVlNUUlRbOToyXVxuICAgICAgICBbMHgxYSwgMHg5N10sIC8vIFZFTkRbOToyXVxuICAgICAgICBbMHgwMywgMHgwZl0sIC8vIEJpdFszOjJdOiBWRU5EWzE6MF07IEJpdFsxOjBdOiBWU1RSVFsxOjBdXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4NGYsIDB4YmJdLFxuICAgICAgICBbMHg1MCwgMHg5Y10sXG4gICAgICAgIFsweDVhLCAweDU3XSxcbiAgICAgICAgWzB4NmQsIDB4ODBdLFxuICAgICAgICBbMHgzZCwgMHgzNF0sXG4gICAgICAgIFsweDM5LCAweDAyXSxcbiAgICAgICAgWzB4MzUsIDB4ODhdLFxuICAgICAgICBbMHgyMiwgMHgwYV0sXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4MzQsIDB4YTBdLFxuICAgICAgICBbMHgwNiwgMHgwMl0sXG4gICAgICAgIFsweDBkLCAweGI3XSxcbiAgICAgICAgWzB4MGUsIDB4MDFdLFxuXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDRdLFxuICAgICAgICBbMHhjMCwgMHhjOF0sXG4gICAgICAgIFsweGMxLCAweDk2XSxcbiAgICAgICAgWzB4ODYsIDB4MzVdLFxuICAgICAgICBbMHg1MCwgMHg4OV0sXG4gICAgICAgIFsweDUxLCAweDkwXSxcbiAgICAgICAgWzB4NTIsIDB4MmNdLFxuICAgICAgICBbMHg1MywgMHgwMF0sXG4gICAgICAgIFsweDU0LCAweDAwXSxcbiAgICAgICAgWzB4NTUsIDB4ODhdLFxuICAgICAgICBbMHg1NywgMHgwMF0sXG4gICAgICAgIFsweDVhLCAweGM4XSxcbiAgICAgICAgWzB4NWIsIDB4OTZdLFxuICAgICAgICBbMHg1YywgMHgwMF0sXG4gICAgICAgIFsweGQzLCAweDAyXSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuXG4gICAgICAgIFsweGZmLCAweGZmXSxcbiAgICAgIF0sXG5cbiAgICAgIE9WMjY0MF8xMDI0eDc2OF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTEsIDB4MDFdLFxuICAgICAgICBbMHgxMiwgMHgwMF0sIC8vIEJpdFs2OjRdOiBSZXNvbHV0aW9uIHNlbGVjdGlvbi8vMHgwMlxuICAgICAgICBbMHgxNywgMHgxMV0sIC8vIEhSRUZTVFsxMDozXVxuICAgICAgICBbMHgxOCwgMHg3NV0sIC8vIEhSRUZFTkRbMTA6M11cbiAgICAgICAgWzB4MzIsIDB4MzZdLCAvLyBCaXRbNTozXTogSFJFRkVORFsyOjBdOyBCaXRbMjowXTogSFJFRlNUWzI6MF1cbiAgICAgICAgWzB4MTksIDB4MDFdLCAvLyBWU1RSVFs5OjJdXG4gICAgICAgIFsweDFhLCAweDk3XSwgLy8gVkVORFs5OjJdXG4gICAgICAgIFsweDAzLCAweDBmXSwgLy8gQml0WzM6Ml06IFZFTkRbMTowXTsgQml0WzE6MF06IFZTVFJUWzE6MF1cbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHg0ZiwgMHhiYl0sXG4gICAgICAgIFsweDUwLCAweDljXSxcbiAgICAgICAgWzB4NWEsIDB4NTddLFxuICAgICAgICBbMHg2ZCwgMHg4MF0sXG4gICAgICAgIFsweDNkLCAweDM0XSxcbiAgICAgICAgWzB4MzksIDB4MDJdLFxuICAgICAgICBbMHgzNSwgMHg4OF0sXG4gICAgICAgIFsweDIyLCAweDBhXSxcbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHgzNCwgMHhhMF0sXG4gICAgICAgIFsweDA2LCAweDAyXSxcbiAgICAgICAgWzB4MGQsIDB4YjddLFxuICAgICAgICBbMHgwZSwgMHgwMV0sXG5cbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhjMCwgMHhjOF0sXG4gICAgICAgIFsweGMxLCAweDk2XSxcbiAgICAgICAgWzB4OGMsIDB4MDBdLFxuICAgICAgICBbMHg4NiwgMHgzZF0sXG4gICAgICAgIFsweDUwLCAweDAwXSxcbiAgICAgICAgWzB4NTEsIDB4OTBdLFxuICAgICAgICBbMHg1MiwgMHgyY10sXG4gICAgICAgIFsweDUzLCAweDAwXSxcbiAgICAgICAgWzB4NTQsIDB4MDBdLFxuICAgICAgICBbMHg1NSwgMHg4OF0sXG4gICAgICAgIFsweDVhLCAweDAwXSxcbiAgICAgICAgWzB4NWIsIDB4YzBdLFxuICAgICAgICBbMHg1YywgMHgwMV0sXG4gICAgICAgIFsweGQzLCAweDAyXSxcblxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfMTI4MHg5NjBfSlBFRzogW1xuICAgICAgICBbMHhmZiwgMHgwMV0sXG4gICAgICAgIFsweDExLCAweDAxXSxcbiAgICAgICAgWzB4MTIsIDB4MDBdLCAvLyBCaXRbNjo0XTogUmVzb2x1dGlvbiBzZWxlY3Rpb24vLzB4MDJcbiAgICAgICAgWzB4MTcsIDB4MTFdLCAvLyBIUkVGU1RbMTA6M11cbiAgICAgICAgWzB4MTgsIDB4NzVdLCAvLyBIUkVGRU5EWzEwOjNdXG4gICAgICAgIFsweDMyLCAweDM2XSwgLy8gQml0WzU6M106IEhSRUZFTkRbMjowXTsgQml0WzI6MF06IEhSRUZTVFsyOjBdXG4gICAgICAgIFsweDE5LCAweDAxXSwgLy8gVlNUUlRbOToyXVxuICAgICAgICBbMHgxYSwgMHg5N10sIC8vIFZFTkRbOToyXVxuICAgICAgICBbMHgwMywgMHgwZl0sIC8vIEJpdFszOjJdOiBWRU5EWzE6MF07IEJpdFsxOjBdOiBWU1RSVFsxOjBdXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4NGYsIDB4YmJdLFxuICAgICAgICBbMHg1MCwgMHg5Y10sXG4gICAgICAgIFsweDVhLCAweDU3XSxcbiAgICAgICAgWzB4NmQsIDB4ODBdLFxuICAgICAgICBbMHgzZCwgMHgzNF0sXG4gICAgICAgIFsweDM5LCAweDAyXSxcbiAgICAgICAgWzB4MzUsIDB4ODhdLFxuICAgICAgICBbMHgyMiwgMHgwYV0sXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4MzQsIDB4YTBdLFxuICAgICAgICBbMHgwNiwgMHgwMl0sXG4gICAgICAgIFsweDBkLCAweGI3XSxcbiAgICAgICAgWzB4MGUsIDB4MDFdLFxuXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDRdLFxuICAgICAgICBbMHhjMCwgMHhjOF0sXG4gICAgICAgIFsweGMxLCAweDk2XSxcbiAgICAgICAgWzB4ODYsIDB4M2RdLFxuICAgICAgICBbMHg1MCwgMHgwMF0sXG4gICAgICAgIFsweDUxLCAweDkwXSxcbiAgICAgICAgWzB4NTIsIDB4MmNdLFxuICAgICAgICBbMHg1MywgMHgwMF0sXG4gICAgICAgIFsweDU0LCAweDAwXSxcbiAgICAgICAgWzB4NTUsIDB4ODhdLFxuICAgICAgICBbMHg1NywgMHgwMF0sXG4gICAgICAgIFsweDVhLCAweDQwXSxcbiAgICAgICAgWzB4NWIsIDB4ZjBdLFxuICAgICAgICBbMHg1YywgMHgwMV0sXG4gICAgICAgIFsweGQzLCAweDAyXSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuXG4gICAgICAgIFsweGZmLCAweGZmXSxcbiAgICAgIF0sXG5cbiAgICAgIE9WMjY0MF8xNjAweDEyMDBfSlBFRzogW1xuICAgICAgICBbMHhmZiwgMHgwMV0sXG4gICAgICAgIFsweDExLCAweDAxXSxcbiAgICAgICAgWzB4MTIsIDB4MDBdLCAvLyBCaXRbNjo0XTogUmVzb2x1dGlvbiBzZWxlY3Rpb24vLzB4MDJcbiAgICAgICAgWzB4MTcsIDB4MTFdLCAvLyBIUkVGU1RbMTA6M11cbiAgICAgICAgWzB4MTgsIDB4NzVdLCAvLyBIUkVGRU5EWzEwOjNdXG4gICAgICAgIFsweDMyLCAweDM2XSwgLy8gQml0WzU6M106IEhSRUZFTkRbMjowXTsgQml0WzI6MF06IEhSRUZTVFsyOjBdXG4gICAgICAgIFsweDE5LCAweDAxXSwgLy8gVlNUUlRbOToyXVxuICAgICAgICBbMHgxYSwgMHg5N10sIC8vIFZFTkRbOToyXVxuICAgICAgICBbMHgwMywgMHgwZl0sIC8vIEJpdFszOjJdOiBWRU5EWzE6MF07IEJpdFsxOjBdOiBWU1RSVFsxOjBdXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4NGYsIDB4YmJdLFxuICAgICAgICBbMHg1MCwgMHg5Y10sXG4gICAgICAgIFsweDVhLCAweDU3XSxcbiAgICAgICAgWzB4NmQsIDB4ODBdLFxuICAgICAgICBbMHgzZCwgMHgzNF0sXG4gICAgICAgIFsweDM5LCAweDAyXSxcbiAgICAgICAgWzB4MzUsIDB4ODhdLFxuICAgICAgICBbMHgyMiwgMHgwYV0sXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4MzQsIDB4YTBdLFxuICAgICAgICBbMHgwNiwgMHgwMl0sXG4gICAgICAgIFsweDBkLCAweGI3XSxcbiAgICAgICAgWzB4MGUsIDB4MDFdLFxuXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDRdLFxuICAgICAgICBbMHhjMCwgMHhjOF0sXG4gICAgICAgIFsweGMxLCAweDk2XSxcbiAgICAgICAgWzB4ODYsIDB4M2RdLFxuICAgICAgICBbMHg1MCwgMHgwMF0sXG4gICAgICAgIFsweDUxLCAweDkwXSxcbiAgICAgICAgWzB4NTIsIDB4MmNdLFxuICAgICAgICBbMHg1MywgMHgwMF0sXG4gICAgICAgIFsweDU0LCAweDAwXSxcbiAgICAgICAgWzB4NTUsIDB4ODhdLFxuICAgICAgICBbMHg1NywgMHgwMF0sXG4gICAgICAgIFsweDVhLCAweDkwXSxcbiAgICAgICAgWzB4NWIsIDB4MmNdLFxuICAgICAgICBbMHg1YywgMHgwNV0sIC8vYml0Mi0+MTtiaXRbMTowXS0+MVxuICAgICAgICBbMHhkMywgMHgwMl0sXG4gICAgICAgIFsweGUwLCAweDAwXSxcblxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0FyZHVDQU1NaW5pJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgJzV2Jyk7XG5cbiAgICB0aGlzLmlvX2NzID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuY3MpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KHRydWUpO1xuXG4gICAgb2JuaXoud2FpdCgxMDApO1xuXG4gICAgdGhpcy5zZW5zb3JfYWRkciA9IDB4MzA7IC8vIGkyY1xuXG4gICAgdGhpcy5wYXJhbXMubW9kdWxlX3ZlcnNpb24gPSB0aGlzLnBhcmFtcy5tb2R1bGVfdmVyc2lvbiB8fCAwO1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSB0aGlzLnBhcmFtcy5tb2RlIHx8ICdtYXN0ZXInO1xuICAgIHRoaXMucGFyYW1zLmRyaXZlID0gdGhpcy5wYXJhbXMuc3BpX2RyaXZlIHx8ICczdic7XG4gICAgdGhpcy5wYXJhbXMuZnJlcXVlbmN5ID0gdGhpcy5wYXJhbXMuc3BpX2ZyZXF1ZW5jeSB8fCA0ICogMTAwMCAqIDEwMDA7XG4gICAgdGhpcy5wYXJhbXMuY2xrID0gdGhpcy5wYXJhbXMuc2NsaztcbiAgICB0aGlzLnNwaSA9IHRoaXMub2JuaXouZ2V0U3BpV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG5cbiAgICB0aGlzLnBhcmFtcy5zZGEgPSB0aGlzLnBhcmFtcy5zZGE7XG4gICAgdGhpcy5wYXJhbXMuc2NsID0gdGhpcy5wYXJhbXMuc2NsO1xuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gdGhpcy5wYXJhbXMuY2xvY2sgfHwgMTAwICogMTAwMDtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gJ21hc3Rlcic7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9ICc1dic7XG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgfVxuXG4gIHNwaV93cml0ZShhZGRyLCBieXRlRGF0YSkge1xuICAgIGxldCBkYXRhID0gW107XG4gICAgZGF0YS5wdXNoKGFkZHIpO1xuICAgIGRhdGEucHVzaChieXRlRGF0YSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuc3BpLndyaXRlKGRhdGEpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KHRydWUpO1xuICB9XG5cbiAgYXN5bmMgc3BpX3JlYWRXYWl0KGFkZHIpIHtcbiAgICBsZXQgZGF0YSA9IFtdO1xuICAgIGRhdGEucHVzaChhZGRyKTtcbiAgICBkYXRhLnB1c2goMHgwMCk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuICAgIGNvbnN0IHJlY3YgPSBhd2FpdCB0aGlzLnNwaS53cml0ZVdhaXQoZGF0YSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQodHJ1ZSk7XG4gICAgcmV0dXJuIHJlY3ZbMV07XG4gIH1cblxuICBpMmNfYnl0ZV93cml0ZShhZGRyLCBieXRlRGF0YSkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuc2Vuc29yX2FkZHIsIFthZGRyLCBieXRlRGF0YV0pO1xuICB9XG5cbiAgaTJjX3JlZ3Nfd3JpdGUocmVncykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVncy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5pMmMud3JpdGUodGhpcy5zZW5zb3JfYWRkciwgcmVnc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgc3BpX3dyaXRlX3JlZyhhZGRyLCBieXRlRGF0YSkge1xuICAgIHRoaXMuc3BpX3dyaXRlKGFkZHIgfCAweDgwLCBieXRlRGF0YSk7XG4gIH1cblxuICBhc3luYyBzcGlfcmVhZF9yZWdXYWl0KGFkZHIpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5zcGlfcmVhZFdhaXQoYWRkciAmIDB4N2YpO1xuICB9XG5cbiAgYXN5bmMgc3BpX3Bpbmdwb25nV2FpdCgpIHtcbiAgICBjb25zdCB0ZXN0VmFsID0gMHg1NTtcbiAgICB0aGlzLnNwaV93cml0ZV9yZWcodGhpcy5yZWdzLkFSRFVDSElQX1RFU1QxLCB0ZXN0VmFsKTtcbiAgICBjb25zdCB2YWwgPSBhd2FpdCB0aGlzLnNwaV9yZWFkX3JlZ1dhaXQodGhpcy5yZWdzLkFSRFVDSElQX1RFU1QxKTtcbiAgICBpZiAodmFsICE9PSB0ZXN0VmFsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NwaSBidXMgZmFpbCcpO1xuICAgIH1cbiAgfVxuXG4gIHNldE1vZGUobW9kZSkge1xuICAgIGNvbnN0IG1vZGVzID0ge1xuICAgICAgTUNVMkxDRDogMHgwMCxcbiAgICAgIENBTTJMQ0Q6IDB4MDEsXG4gICAgICBMQ0QyTUNVOiAweDAyLFxuICAgIH07XG4gICAgaWYgKHR5cGVvZiBtb2Rlc1ttb2RlXSAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBtb2RlLiBvcHRpb25zIGFyZSAnICsgbW9kZXMpO1xuICAgIH1cbiAgICB0aGlzLnNwaV93cml0ZV9yZWcodGhpcy5yZWdzLkFSRFVDSElQX01PREUsIG1vZGVzW21vZGVdKTtcbiAgfVxuXG4gIGFzeW5jIGdldENoaXBJZFdhaXQoKSB7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5zZW5zb3JfYWRkciwgWzB4MGFdKTtcbiAgICBjb25zdCB2YWwwID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5zZW5zb3JfYWRkciwgMSk7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5zZW5zb3JfYWRkciwgWzB4MGJdKTtcbiAgICBjb25zdCB2YWwxID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5zZW5zb3JfYWRkciwgMSk7XG4gICAgcmV0dXJuICh2YWwwWzBdIDw8IDgpICsgdmFsMVswXTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5pMmNfYnl0ZV93cml0ZSgweGZmLCAweDAxKTtcbiAgICB0aGlzLmkyY19ieXRlX3dyaXRlKDB4MTIsIDB4ODApO1xuICAgIHRoaXMub2JuaXoud2FpdCgxMDApO1xuXG4gICAgdGhpcy5pMmNfcmVnc193cml0ZSh0aGlzLmNvbmZpZ3MuT1YyNjQwX0pQRUdfSU5JVCk7XG4gICAgdGhpcy5pMmNfcmVnc193cml0ZSh0aGlzLmNvbmZpZ3MuT1YyNjQwX1lVVjQyMik7XG4gICAgdGhpcy5pMmNfcmVnc193cml0ZSh0aGlzLmNvbmZpZ3MuT1YyNjQwX0pQRUcpO1xuICAgIHRoaXMuaTJjX2J5dGVfd3JpdGUoMHhmZiwgMHgwMSk7XG4gICAgdGhpcy5pMmNfYnl0ZV93cml0ZSgweDE1LCAweDAwKTtcbiAgICB0aGlzLnNldFNpemUoJzMyMHgyNDAnKTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0dXBXYWl0KCkge1xuICAgIGF3YWl0IHRoaXMuc3BpX3Bpbmdwb25nV2FpdCgpO1xuICAgIHRoaXMuc2V0TW9kZSgnTUNVMkxDRCcpO1xuICAgIGNvbnN0IGNoaXBpZCA9IGF3YWl0IHRoaXMuZ2V0Q2hpcElkV2FpdCgpO1xuICAgIGlmIChjaGlwaWQgIT0gMHgyNjQyICYmIGNoaXBpZCAhPSAweDI2NDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBjaGlwICcgKyBjaGlwaWQpO1xuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGFzeW5jIHRha2VXYWl0KHNpemUpIHtcbiAgICBpZiAodHlwZW9mIHNpemUgPT09ICdzdHJpbmcnICYmIHRoaXMuX3NpemUgIT09IHNpemUpIHtcbiAgICAgIHRoaXMuc2V0U2l6ZShzaXplKTtcbiAgICAgIHRoaXMub2JuaXoud2FpdCgxMDAwKTtcbiAgICB9XG5cbiAgICB0aGlzLmZsdXNoRklGTygpO1xuICAgIHRoaXMuZmx1c2hGSUZPKCk7XG4gICAgdGhpcy5zdGFydENhcHR1cmUoKTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGF3YWl0IHRoaXMuaXNDYXB0dXJlRG9uZVdhaXQoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucmVhZEZJRk9XYWl0KCk7XG4gIH1cblxuICBzZXRTaXplKHN0cmluZykge1xuICAgIGlmICh0aGlzLl9zaXplID09PSBzdHJpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWFwID0ge1xuICAgICAgJzE2MHgxMjAnOiB0aGlzLmNvbmZpZ3MuT1YyNjQwXzE2MHgxMjBfSlBFRyxcbiAgICAgICcxNzZ4MTQ0JzogdGhpcy5jb25maWdzLk9WMjY0MF8xNzZ4MTQ0X0pQRUcsXG4gICAgICAnMzIweDI0MCc6IHRoaXMuY29uZmlncy5PVjI2NDBfMzIweDI0MF9KUEVHLFxuICAgICAgJzM1MngyODgnOiB0aGlzLmNvbmZpZ3MuT1YyNjQwXzM1MngyODhfSlBFRyxcbiAgICAgICc2NDB4NDgwJzogdGhpcy5jb25maWdzLk9WMjY0MF82NDB4NDgwX0pQRUcsXG4gICAgICAnODAweDYwMCc6IHRoaXMuY29uZmlncy5PVjI2NDBfODAweDYwMF9KUEVHLFxuICAgICAgJzEwMjR4NzY4JzogdGhpcy5jb25maWdzLk9WMjY0MF8xMDI0eDc2OF9KUEVHLFxuICAgICAgJzEyODB4OTYwJzogdGhpcy5jb25maWdzLk9WMjY0MF8xMjgweDk2MF9KUEVHLFxuICAgICAgJzE2MDB4MTIwMCc6IHRoaXMuY29uZmlncy5PVjI2NDBfMTYwMHgxMjAwX0pQRUcsXG4gICAgfTtcbiAgICBpZiAobWFwW3N0cmluZ10pIHtcbiAgICAgIHRoaXMuX3NpemUgPSBzdHJpbmc7XG4gICAgICB0aGlzLmkyY19yZWdzX3dyaXRlKG1hcFtzdHJpbmddKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBzaXplIG9wdGlvbnMgYXJlICcgKyBPYmplY3Qua2V5cyhtYXApKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVGSUZPKGRhdGEpIHtcbiAgICAvLyAgRklGT19DTEVBUl9NQVNLICAgIFx0XHQweDAxXG4gICAgLy8gIEZJRk9fU1RBUlRfTUFTSyAgICBcdFx0MHgwMlxuICAgIC8vICBGSUZPX1JEUFRSX1JTVF9NQVNLICAgICAweDEwXG4gICAgLy8gIEZJRk9fV1JQVFJfUlNUX01BU0sgICAgIDB4MjBcbiAgICB0aGlzLnNwaV93cml0ZV9yZWcodGhpcy5yZWdzLkFSRFVDSElQX0ZJRk8sIGRhdGEpO1xuICB9XG5cbiAgZmx1c2hGSUZPKCkge1xuICAgIHRoaXMuc3BpX3dyaXRlX3JlZyh0aGlzLnJlZ3MuQVJEVUNISVBfRklGTywgMHgwMSk7XG4gIH1cblxuICBhc3luYyByZWFkRklGT0xlbmd0aFdhaXQoKSB7XG4gICAgY29uc3QgbGVuMSA9IGF3YWl0IHRoaXMuc3BpX3JlYWRfcmVnV2FpdCh0aGlzLnJlZ3MuRklGT19TSVpFMSk7XG4gICAgY29uc3QgbGVuMiA9IGF3YWl0IHRoaXMuc3BpX3JlYWRfcmVnV2FpdCh0aGlzLnJlZ3MuRklGT19TSVpFMik7XG4gICAgY29uc3QgbGVuMyA9IChhd2FpdCB0aGlzLnNwaV9yZWFkX3JlZ1dhaXQodGhpcy5yZWdzLkZJRk9fU0laRTMpKSAmIDB4MDc7XG4gICAgcmV0dXJuICgobGVuMyA8PCAxNikgfCAobGVuMiA8PCA4KSB8IGxlbjEpICYgMHgwN2ZmZmY7XG4gIH1cblxuICBzdGFydENhcHR1cmUoKSB7XG4gICAgdGhpcy5zcGlfd3JpdGVfcmVnKHRoaXMucmVncy5BUkRVQ0hJUF9GSUZPLCAweDAyKTtcbiAgfVxuXG4gIGFzeW5jIGlzQ2FwdHVyZURvbmVXYWl0KCkge1xuICAgIGNvbnN0IENBUF9ET05FX01BU0sgPSAweDA4O1xuICAgIGNvbnN0IHZhbCA9IGF3YWl0IHRoaXMuc3BpX3JlYWRfcmVnV2FpdCh0aGlzLnJlZ3MuQVJEVUNISVBfVFJJRyk7XG4gICAgcmV0dXJuIHZhbCAmIENBUF9ET05FX01BU0sgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBhc3luYyByZWFkRklGT1dhaXQoKSB7XG4gICAgLy8gZ2V0IGxlbmd0aCBvZiBpbWFnZSBkYXRhXG4gICAgbGV0IGxlbmd0aCA9IGF3YWl0IHRoaXMucmVhZEZJRk9MZW5ndGhXYWl0KCk7XG5cbiAgICAvLyBzdGFydCBidXN0XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuc3BpLndyaXRlKFt0aGlzLnJlZ3MuQlVSU1RfRklGT19SRUFEXSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubW9kdWxlX3ZlcnNpb24gPT0gMCkge1xuICAgICAgdGhpcy5zcGkud3JpdGUoWzB4ZmZdKTsgLy8gZHVtbXkgcmVhZFxuICAgIH1cblxuICAgIGxldCBidWYgPSBbXTtcblxuICAgIHdoaWxlIChidWYubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgICBsZXQgbXVzdFJlYWQgPSBsZW5ndGggLSBidWYubGVuZ3RoO1xuICAgICAgaWYgKG11c3RSZWFkID4gMTAyNCkge1xuICAgICAgICBtdXN0UmVhZCA9IDEwMjQ7XG4gICAgICB9XG4gICAgICBsZXQgYXJyID0gbmV3IEFycmF5KG11c3RSZWFkKTtcbiAgICAgIGFyci5maWxsKDApO1xuICAgICAgY29uc3Qgc2xpY2VkID0gYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KGFycik7XG4gICAgICBidWYucHVzaCguLi5zbGljZWQpO1xuICAgIH1cbiAgICAvLyBlbmQgYnVyc3RcbiAgICB0aGlzLmlvX2NzLm91dHB1dCh0cnVlKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBhcnJheVRvQmFzZTY0KGFycmF5KSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGFycmF5KS50b1N0cmluZygnYmFzZTY0Jyk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gQXJkdUNBTU1pbmk7XG59XG4iXX0=
