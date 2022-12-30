/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

export class ObjectSet<T> extends Set<T | string> {
  add(elem: T) {
    return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
  has(elem: T | string) {
    return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
  intersection(other: ObjectSet<T>): ObjectSet<T> {
    return new ObjectSet([...this].filter(x => other.has(x)));
  }
  union(other: ObjectSet<T>): ObjectSet<T> {
    return new ObjectSet([...this, ...other]);
  }
  difference(other: ObjectSet<T>): ObjectSet<T> {
    return new ObjectSet([...this].filter(x => !other.has(x)));
  }
}

export const range = function* (end: number) {
  for (let i = 0; i < end; i++) yield i;
}

export const combinations = function* (end: number) {
  for (const i of range(end)) {
    for (const j of range(end)) yield [i, j] as [number, number];
  }
}

export const combinations2 = function* (row: number, col: number) {
  for (const i of range(row)) {
    for (const j of range(col)) yield [i, j] as [number, number];
  }
}

export function* pairwise<T> (iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]()
  let current = iterator.next()
  let next = iterator.next()
  while (!next.done) {
      yield [current.value, next.value] as [T, T]
      current = next
      next = iterator.next()
  }
}