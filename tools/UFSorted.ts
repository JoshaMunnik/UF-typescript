// region imports

import {IUFSorted} from "../models/IUFSorted";

// endregion

// region types

/**
 * {@link UFSorted} implements various static support methods for {@link IUFSorted}.
 */
export class UFSorted {
  // region public methods

  /**
   * Either sort an array or dictionary.
   *
   * @param aData
   *   Object or array.
   *
   * @returns sorted values
   */
  static sort<T extends IUFSorted>(aData: T[] | {[key: string]: T} | Set<T> | Map<any, T>): T[] {
    return UFSorted.getValues(aData).sort((item0, item1) => item0.sortOrder - item1.sortOrder);
  }

  /**
   * Gets the maximum {@link IUFSorted.sortOrder} value.
   *
   * @param aData
   *   Data to process
   *
   * @returns {number} maximum value or Number.MIN_VALUE if none was found.
   */
  static getMax(aData: IUFSorted[] | {[key: string]: IUFSorted} | Set<IUFSorted> | Map<any, IUFSorted>): number {
    const list: IUFSorted[] = UFSorted.getValues(aData);
    return list.reduce(
      (previous: number, current) => Math.max(previous, current.sortOrder), Number.MIN_VALUE
    );
  }

  /**
   * Gets the minimum {@link IUFSorted.sortOrder} value.
   *
   * @param aData
   *   Data to process
   *
   * @returns {number} minimum value or Number.MAX_VALUE if none was found.
   */
  static getMin(aData: IUFSorted[] | {[key: string]: IUFSorted} | Set<IUFSorted> | Map<any, IUFSorted>): number {
    const list: IUFSorted[] = UFSorted.getValues(aData);
    return list.reduce(
      (previous: number, current) => Math.min(previous, current.sortOrder), Number.MAX_VALUE
    );
  }

  // endregion

  // region private methods

  /**
   * Gets the values of a collection as an array.
   * @param aData
   *   Data to get values from
   *
   * @returns list of values
   */
  private static getValues<T extends IUFSorted>(aData: T[] | {[key: string]: T} | Set<T> | Map<any, T>): T[] {
    if (Array.isArray(aData)) {
      return aData;
    }
    if (aData instanceof Set) {
      return Array.from(aData);
    }
    if (aData instanceof Map) {
      return Array.from(aData.values());
    }
    return Object.values(aData);
  }

  // endregion
}

// endregion