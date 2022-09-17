import { Brand } from './libs/utils/brand';

export type ObnizId = Brand<string, 'ObnizId'>;

export const isObnizId = (arg: any): arg is ObnizId => {
  if (typeof arg === 'string') {
    return !!/^\d{4}-\d{4}$/.test(arg);
  }
  return false;
};
