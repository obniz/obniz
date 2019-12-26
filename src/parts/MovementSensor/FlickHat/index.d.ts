export interface FlickHatOptions {
  vcc?: number;
  sda: number;
  scl: number;
  reset: number;
  ts: number;
  gnd: number;
  led1?: number;
  led2?: number;
}

export type FlickHat_Direction = 'west' | 'east' | 'north' | 'south';
export type FlickHat_Direction2 = 'west' | 'east' | 'north' | 'south' | 'center';

export interface FlickHat_XYZ {
  x: number;
  y: number;
  z: number;
  seq: number;
}

export interface FlickHat_Gesture {
  action: 'gesture';
  from: FlickHat_Direction;
  to: FlickHat_Direction;
  seq: number;
  raw: any;
}

export interface FlickHat_Touch {
  action: 'touch';
  positions: FlickHat_Direction2[];
  seq: number;
  raw: any;
}

export interface FlickHat_Tap {
  action: 'tap';
  positions: FlickHat_Direction2[];
  seq: number;
  raw: any;
}

export interface FlickHat_DoubleTap {
  action: 'doubletap';
  positions: FlickHat_Direction2[];
  seq: number;
  raw: any;
}

export interface FlickHat_AirWheel {
  delta: number;
  rotation: number;
  seq: number;
  raw: any;
}

export interface FlickHat {
  onxyz: (xyz: FlickHat_XYZ) => void;
  ongesture: (gesture: FlickHat_Gesture) => void;
  onontouch: (touch: FlickHat_Touch) => void;
  ontap: (tap: FlickHat_Tap) => void;
  ondoubletap: (doubletap: FlickHat_DoubleTap) => void;
  onairwheel: (airwheel: FlickHat_AirWheel) => void;
  start(callback: (fwInfo: any) => void): Promise<void>;
  polling(timeout: number): Promise<void>;
}
