// region types

/**
 * Helper type to replace a return type of a function with a new type
 *
 * References:
 * https://stackoverflow.com/a/50014868/968451
 * https://github.com/reduxjs/redux-thunk/issues/213
 */
export type UFReplaceReturnType<T extends (...args: any[]) => any, TNewReturn> =
  (...args: Parameters<T>) => TNewReturn;

/**
 * Returns the type of a property.
 */
export type UFPropType<TObj, TProp extends keyof TObj> = TObj[TProp];

// endregion

// region class

export class UFTypescript {
  /**
   * A helper method for use with async/await to wait for a certain amount of time.
   *
   * @param {number} aTime
   *   Time to wait in milliseconds.
   *
   * @returns {Promise<void>}
   */
  static async delay(aTime: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, aTime));
  }
}