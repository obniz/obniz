/**
 * @packageDocumentation
 * @module ObnizCore
 */

export interface ObnizPartsDataPropertyBase {
  battery: number;
  battery_voltage: number;
  battery_energy_level: number;

  solar_cell_illumination: number;

  illumination: number;

  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  fall: boolean;
  temperature: number;
  humidity: number;

  acceleration_x: number;
  acceleration_y: number;
  acceleration_z: number;

  magnet_contact?: boolean;
}

export type ObnizPartsDataPropertyKey = keyof ObnizPartsDataPropertyBase;
export type ObnizPartsDataProperty<
  reqKey extends ObnizPartsDataPropertyKey,
  optionalKey extends ObnizPartsDataPropertyKey
> = Pick<ObnizPartsDataPropertyBase, reqKey> &
  Partial<Pick<ObnizPartsDataPropertyBase, optionalKey>>;
