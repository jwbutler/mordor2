import { checkState } from './preconditions';

type KeyFunction<T> = (t: T) => number;

export const sortBy = <T>(list: T[], keyFunction: KeyFunction<T>) =>
  list.sort((a, b) => keyFunction(a) - keyFunction(b));

export const sortByReversed = <T>(list: T[], keyFunction: KeyFunction<T>) =>
  list.sort((a, b) => keyFunction(b) - keyFunction(a));

export const comparing = <T>(keyFunction: KeyFunction<T>) =>
  (a: T, b: T) => keyFunction(a) - keyFunction(b);

export const comparingReversed = <T>(keyFunction: KeyFunction<T>) =>
  (a: T, b: T) => keyFunction(b) - keyFunction(a);

export const average = (list: number[]) => {
  const sum = list.reduce((a, b) => a + b);
  return sum / list.length;
};

export const min = (list: number[]): number => Math.min(...list);
export const max = (list: number[]): number => Math.max(...list);

export const minBy = <T> (list: T[], keyFunction: (t: T) => number): T => {
  checkState(list.length > 0);
  return sortBy(list, keyFunction)[0];
};

export const maxBy = <T> (list: T[], keyFunction: (t: T) => number): T => {
  checkState(list.length > 0);
  return sortBy(list, keyFunction)[list.length - 1];
};

export const replace = <T>(array: T[], contents: T[]) => {
  clear(array);
  array.push(...contents);
};

export const subtract = <T>(array: T[], toRemove: T[]) => {
  const updated = array.filter(element => toRemove.indexOf(element) === -1);
  replace(array, updated);
};

export const clear = (array: any[]) => {
  array.splice(0, array.length);
};

/**
 * @param max inclusive
 */
export const range = (min: number, max: number) => new Array(max - min + 1)
  .fill(null)
  .map((_, i) => i + min);

export const head = <T> (array: T[], count: number): T[] => array.slice(0, count);
export const tail = <T> (array: T[], count: number): T[] => array.slice(-count);

export const sum = (array: number[]) => array.reduce((a, b) => a + b);
