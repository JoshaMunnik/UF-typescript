// region class

/**
 * {@link UFMath} implements methods supporting numbers.
 */
export class UFMath {
  // region public methods

  /**
   * Returns a random integer.
   *
   * @param {number} [aMinOrMax]
   *   Minimal or maximum value (if aMax is not specified)
   * @param {number} aMax
   *   Maximal value
   *
   * @return {number} random integer between aMin and aMax (inclusive)
   */
  static randomInteger(aMinOrMax: number, aMax?: number): number {
    if (aMax == undefined) {
      aMax = aMinOrMax;
      aMinOrMax = 0;
    }
    return Math.floor(aMinOrMax + Math.random() * (aMax - aMinOrMax + 1));
  }
}

// endregion
