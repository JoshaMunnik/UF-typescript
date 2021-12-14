/**
 * @version 1
 * @author Josha Munnik
 * @copyright Copyright (c) 2016 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of conditions and
 *     the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from this
 *     software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

// region Imports

import {UFMath} from './UFMath';
import {UFObject} from './UFObject';

// endregion

// region Default export

/**
 * Defines a static class {@link UFArray}, a utility library with static methods for Array instances.
 */
export default class UFArray {
  // region Public methods

  /**
   * Swaps two elements in an array.
   *
   * @param anArray
   *   Array to update
   * @param aFirst
   *   Index to first element
   * @param aSecond
   *   Index to second element
   *
   * @returns value of anArray
   */
  static swap<T>(anArray: T[], aFirst: number, aSecond: number): T[] {
    const temp: T = anArray[aFirst];
    anArray[aFirst] = anArray[aSecond];
    anArray[aSecond] = temp;
    return anArray;
  }

  /**
   * Randomly swaps elements in array, shuffling the contents of the array.
   *
   * @template T
   *
   * @param {T[]} anArray
   *   Array to shuffle
   * @param [anIterations]
   *   Number of times to perform swap. If the value is not set, it will be set to 1.5 * length of the array.
   *
   * @returns {T[]} value of anArray
   */
  static shuffle<T>(anArray: T[], anIterations?: number): T[] {
    // arrays with 0 or 1 elements do need shuffling
    if (anArray.length < 2) {
      return anArray;
    }
    // default is 1.5 the length of the array
    anIterations = anIterations || Math.ceil(anArray.length * 1.5);
    // swap to random items
    for(let index: number = anIterations; index >= 0; index--) {
      // get two random positions in array
      let index0: number = UFMath.randomInteger(anArray.length);
      let index1: number = UFMath.randomInteger(anArray.length);
      // repeat for second index in case the random indexes point to the same index assuming the chance
      // to get the same number for the third time is very low)
      if (index0 === index1) {
        index1 = UFMath.randomInteger(anArray.length);
      }
      // swap items
      UFArray.swap(anArray, index0, index1);
    }
    return anArray;
  }

  /**
   * Creates an array filled with a certain value.
   *
   * @param anItem
   *   Item to fill with or a function that returns a value of the correct type
   * @param aCount
   *   Number of items
   * @param anArray
   *   Array to use, when missing create a new array.
   *
   * @returns created array or the value of anArray.
   */
  static createFilled<T>(anItem: T | (() => T), aCount: number, anArray?: T[]) {
    const result = anArray || new Array<T>(aCount);
    result.length = aCount;
    if (typeof anItem !== 'function') {
      for (let index: number = 0; index < aCount; index++) {
        result[index] = anItem;
      }
    }
    else {
      for (let index: number = 0; index < aCount; index++) {
        result[index] = (anItem as () => T)();
      }
    }
    return result;
  }

  /**
   * Creates an array filled with a sequence of integer numbers.
   *
   * @param aCount
   *   Number of numbers to fill with
   * @param aStart
   *   Starting number (default 0)
   * @param aStep
   *   Stepping size (default 1)
   * @param anArray
   *   Array to use, when missing create a new array.
   *
   * @returns created array or the value of anArray filled with sequence of integer numbers
   */
  static createNumberRange(aCount: number, aStart: number = 0, aStep: number = 1, anArray?: number[]): number[] {
    const result = anArray || new Array<number>(aCount);
    result.length = aCount;
    for (let index: number = 0; index < aCount; index++) {
      result[index] = index * aStep + aStart;
    }
    return result;
  }

  /**
   * Returns a random item from an array.
   *
   * @param anArray
   *   Array to get item from
   *
   * @returns random item
   */
  static randomItem<T>(anArray: T[]): T {
    return anArray[UFMath.randomInteger(anArray.length)];
  }

  /**
   * Removes all occurrences of an item from an array.
   *
   * @param anArray
   *   Array to remove item from
   * @param anItem
   *   Item to remove
   * @param [aFromIndex=0]
   *   Remove items starting at from this index (0 is first item)
   *
   * @returns value of anArray
   */
  static removeItem<T>(anArray: T[], anItem: T, aFromIndex: number = 0): T[] {
    // look for first occurrence and remove it, keep looking till no more occurrences are found
    for (
      let index = anArray.indexOf(anItem, aFromIndex);
      index >= 0;
      index = anArray.indexOf(anItem, aFromIndex)
    ) {
      anArray.splice(index, 1);
      aFromIndex = index;
    }
    return anArray;
  }

  /**
   * Removes duplicate entries.
   *
   * @param anArray
   *   Array to go through
   *
   * @returns anArray with duplicates removed.
   */
  static removeDuplicates<T>(anArray: T[]): T[]
  {
    // don't cache length, since it might change with every loop
    for (let index: number = 0; index < anArray.length; index++) {
      UFArray.removeItem(anArray, anArray[index], index + 1);
    }
    return anArray;
  }

  /**
   * Removes one or more items from a certain index.
   *
   * @param anArray
   *   Array to remove item(s) from
   * @param anIndex
   *   Index to start removing at
   * @param aCount
   *   Number of items
   *
   * @returns Value of anArray.
   */
  static removeAt<T>(anArray: T[], anIndex: number, aCount: number = 1): T[] {
    anArray.splice(anIndex, aCount);
    return anArray;
  }

  /**
   * Finds an item in the array that matched all properties in the aMatch object.
   *
   * This method uses the UF.tools.UFObject.equalProperties to compare properties.
   *
   * @param anArray
   *   Array to look trough
   * @param aMatch
   *   An object with one or more properties that must be matched.
   * @param anIgnoreCase
   *   When true with string types ignore casing when comparing, false casing should match
   *
   * @returns index of entry or -1 if none was found
   */
  static findByProperty(anArray: object[], aMatch: object, anIgnoreCase: boolean) {
    return anArray.findIndex(item => UFObject.equalProperties(item, aMatch, anIgnoreCase));
  }

  /**
   * Gets an item in an array for a certain index. If the index is outside the array boundary, return
   * a default value instead.
   *
   * @param anArray
   *   Array to get item from
   * @param anIndex
   *   Index of item
   * @param aDefault
   *   Default value to return if anIndex is outside the valid boundary.
   *
   * @returns item or aDefault if anIndex is invalid.
   */
  static getItem<T>(anArray: T[], anIndex: number, aDefault: T): T {
    return ((anIndex >= 0) && (anIndex < anArray.length)) ? anArray[anIndex] : aDefault;
  }

  /**
   * Replaces all values that matches aSearchValue with aNewValue.
   *
   * @param anArray
   *   Array to search trough
   * @param aSearchValue
   *   Value to match
   * @param aNewValue
   *   Value to replace matching value's with
   * @param [aFromIndex=0]
   *   Starting index
   *
   * @returns anArray value
   */
  static replace<T>(anArray: T[], aSearchValue: T, aNewValue: T, aFromIndex: number = 0): T[] {
    for (
      let index: number = anArray.indexOf(aSearchValue, aFromIndex);
      index >= 0;
      index = anArray.indexOf(aSearchValue, aFromIndex)
    ) {
      anArray[index] = aNewValue;
      aFromIndex = index + 1;
    }
    return anArray;
  }

  /**
   * Replaces an item at a certain index with a new value.
   *
   * @param anArray
   *   Array to replace item in
   * @param anIndex
   *   Index of item
   * @param aNewValue
   *   New value to use
   *
   * @return The value of anArray
   */
  static replaceAt<T>(anArray: T[], anIndex: number, aNewValue: T): T[] {
    anArray[anIndex] = aNewValue;
    return anArray;
  }

  /**
   * Replaces multiple search values with a new value. If a value from aSearchValues is found, it is
   * replaced with the value from aNewValues. For each value in aSearchValues, aNewValues must contain
   * a matching new value (in other words aNewValues contains the same number of
   * elements as aSearchValues).
   *
   * @param anArray
   *   Array to search trough
   * @param aSearchValues
   *   Array of values to find
   * @param aNewValues
   *   Array of new values to replace found values with.
   *
   * @returns anArray value
   */
  static replaceMultiple<T>(anArray: T[], aSearchValues: T[], aNewValues: T[]): T[] {
    for (let index = anArray.length - 1; index >= 0; index--) {
      const findIndex = aSearchValues.indexOf(anArray[index]);
      if (findIndex >= 0) {
        anArray[index] = aNewValues[findIndex];
      }
    }
    return anArray;
  }

  /**
   * Adds elements from one array to another.
   *
   * @param aTarget
   *   Array to add to
   * @param aSource
   *   Array to add from
   *
   * @returns value of aTarget
   */
  static add<T>(aTarget: T[], aSource: T[]): T[] {
    aTarget.splice.apply(null, [0, aTarget.length, ...aSource]);
    return aTarget;
  }

  /**
   * Converts all values to int.
   *
   * @param anArray
   *   Array to update
   *
   * @returns anArray value
   */
  static toInt(anArray: any[]): number[] {
    for (let index = anArray.length - 1; index >= 0; index--) {
      anArray[index] = parseInt(anArray[index], 10);
    }
    return anArray;
  }

  /**
   * Converts all values to Number.
   *
   * @param anArray
   *   Array to update
   *
   * @returns anArray value
   */
  static toNumber(anArray: any[]): number[] {
    for (let index = anArray.length - 1; index >= 0; index--) {
      anArray[index] = parseFloat(anArray[index]);
    }
    return anArray;
  }

  /**
   * Checks if an array contains a certain value or an object contains a certain key. It is possible to
   * specify multiple values.
   *
   * @param aList
   *   An array (values are checked) or an object (keys are checked)
   * @param aValue
   *   One or more values to check
   *
   * @returns {boolean} True if the array contains one of the values or the object has a key that
   *   matches one of the values.
   */
  static contains(aList: (object|[]), ...aValue: any[]): boolean {
    // default is not found
    let result = false;
    // process all values in aList
    if (Array.isArray(aList)) {
      aList.every(function(value) {
        result = aValue.indexOf(value) >= 0;
        return !result;
      });
    }
    else {
      for(let propertyName in aList) {
        if (aList.hasOwnProperty(propertyName)) {
          result = aValue.indexOf(propertyName) >= 0;
        }
        if (!result) {
          break;
        }
      }
    }
    return result;
  }

  /**
   * Assumes an array contains only numeric values, sorts the array based on the value.
   *
   * @param anArray
   *   Array of numbers
   * @param [aReverse=false]
   *   When true sort in reverse order.
   *
   * @returns {number[]} anArray with sorted items
   */
  static sortNumeric(anArray: number[], aReverse: boolean = false): number[] {
    return anArray.sort((item0, item1) => aReverse ? item1 - item0 : item0 - item1);
  }

  /**
   * Returns the sum of all values in the number array.
   *
   * @param anArray
   *   Array of numbers
   * @param aStart
   *   Starting index, default is 0
   * @param aCount
   *   Count, when missing process all entries in the array
   *
   * @returns sum of all values in the array
   */
  static sum(anArray: number[], aStart: number = 0, aCount?: number) {
    let result = 0;
    aCount = aCount || anArray.length;
    for(let index = aStart + aCount - 1; index >= aStart; index--) {
      result += anArray[index];
    }
    return result;
  }

  // endregion
}

// endregion