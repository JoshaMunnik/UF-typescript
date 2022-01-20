// region class

/**
 * Possible angle units
 */
export enum UFAngleUnit {
  degrees, radians
}

/**
 * {@link UFMath} implements methods supporting numbers.
 */
export class UFMath {
  // region public methods

  // region Static private variables

  /**
   * See property definitions
   */
  private static s_angleUnit: UFAngleUnit = UFAngleUnit.degrees;

  // endregion

  // region Static properties

  /**
   * Determines how to treat angle parameters or which unit to use when returning angles.
   */
  static get angleUnit(): UFAngleUnit {
    return UFMath.s_angleUnit;
  }
  static set angleUnit(value: UFAngleUnit) {
    UFMath.s_angleUnit = value;
  }

  // endregion

  // region Static methods

  /**
   * Convert angle to radians, use angleUnit to determine unit of input parameter.
   *
   * @param anAngle
   *   Angle to convert
   *
   * @returns Converted angle.
   */
  static toRadians(anAngle: number): number {
    return (UFMath.angleUnit === UFAngleUnit.degrees) ? anAngle * Math.PI / 180 : anAngle;
  }

  /**
   * Convert angle from radians to unit as specified by m_angleUnit
   *
   * @param anAngle
   *   Angle to convert
   *
   * @returns Converted angle.
   */
  static fromRadians(anAngle: number): number {
    return (UFMath.angleUnit === UFAngleUnit.degrees) ? anAngle * 180 / Math.PI : anAngle;
  }

  // endregion

  // region Public methods

  /**
   * Rotates a 2D coordinate around a certain point.
   *
   * @param anAngle
   *   Angle
   * @param aX
   *   X coordinate of point to rotate
   * @param aY
   *   Y coordinate of point to rotate
   * @param [anOriginX=0]
   *   X coordinate of point to rotate around
   * @param [anOriginY=0]
   *   Y coordinate of point to rotate around
   *
   * @returns {{x:Number,y:Number}} An object with x and y property.
   */
  static rotate(
    anAngle: number, aX: number, aY: number, anOriginX: number = 0, anOriginY: number = 0
  ): { x: number, y: number } {
    anAngle = UFMath.toRadians(anAngle);
    const transX = aX - anOriginX;
    const transY = aY - anOriginY;
    const sin = Math.sin(anAngle);
    const cos = Math.cos(anAngle);
    return {
      x: transX * cos - transY * sin + anOriginX,
      y: transX * sin + transY * cos + anOriginY
    };
  }

  /**
   * Calculates the angle between two points
   *
   * @param aX1
   *  First X coordinate of point
   * @param aY1
   *  First Y coordinate of point
   * @param aX2
   *  Second X coordinate of point
   * @param aY2
   *  Second Y coordinate of point
   *
   * @returns Angle in degrees (0..360)
   */
  static angle(aX1: number, aY1: number, aX2: number, aY2: number): number {
    return UFMath.fromRadians(Math.atan2(aY2 - aY1, aX2 - aX1));
  }

  /**
   * Calculates distance between two points.
   *
   * @param aX1
   *  First X coordinate of point
   * @param aY1
   *  First Y coordinate of point
   * @param aX2
   *  Second X coordinate of point
   * @param aY2
   *  Second Y coordinate of point
   *
   * @returns Distance between two points
   */
  static distance(aX1: number, aY1: number, aX2: number, aY2: number): number {
    const dX: number = aX1 - aX2;
    const dY: number = aY1 - aY2;
    return Math.sqrt(dX * dX + dY * dY);
  }

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
    if (aMax === undefined) {
      aMax = aMinOrMax;
      aMinOrMax = 0;
    }
    return Math.floor(aMinOrMax + Math.random() * (aMax - aMinOrMax + 1));
  }

  /**
   * Increases or decreases value so it gets nearer to a target value
   *
   * @param aTarget: value to reach
   * @param aCurrent: current value
   * @param aStepSize: value to move with
   *
   * @returns aCurrent +/- aStep or aTarget if aCurrent was closer
   *   to aTarget then aStep distance
   */
  static moveTo(aTarget: number, aCurrent: number, aStepSize: number): number {
    return (aTarget > aCurrent) ? Math.min(aTarget, aCurrent + aStepSize)
      : Math.max(aTarget, aCurrent - aStepSize);
  }

  /**
   * Calculates a position based on movement over time. The method makes
   * sure the returned value is between the specified target and starting
   * values.
   *
   * @param aTarget
   *   Target to move to
   * @param aStart
   *   Starting position moving from
   * @param aCurrentTime
   *   Current time
   * @param aTotalTime
   *   Total time movement should take place
   * @returns {Number} a value between aStart and aTarget (both inclusive)
   */
  static moveOverTime(aTarget: number, aStart: number, aCurrentTime: number, aTotalTime: number): number {
    return aStart + (aTarget - aStart) *
      Math.max(0, Math.min(aCurrentTime, aTotalTime)) / aTotalTime;
  }

  /**
   * Makes sure a value is within a range.
   *
   * @param aMin
   *   Minimum value
   * @param aMax
   *   Maximum value
   * @param aValue
   *   Value to test
   *
   * @returns aValue if it is within range or aMin or aMax
   */
  static minmax(aMin: number, aMax: number, aValue: number): number {
    return Math.max(aMin, Math.min(aMax, aValue));
  }

  /**
   * Checks if two rectangles overlap.
   *
   * @param aX0
   *   Left of first rectangle
   * @param aY0
   *   Left of first rectangle
   * @param aWidth0
   *   Left of first rectangle
   * @param anHeight0
   *   Left of first rectangle
   * @param aX1
   *   Left of second rectangle
   * @param aY1
   *   Left of second rectangle
   * @param aWidth1
   *   Left of second rectangle
   * @param anHeight1
   *   Left of second rectangle
   *
   * @returns {boolean} True if two rectangles overlap
   */
  static isOverlapping(
    aX0: number, aY0: number, aWidth0: number, anHeight0: number,
    aX1: number, aY1: number, aWidth1: number, anHeight1: number
  ): boolean {
    // just check if minimum value in one direction is equal or larger then the maximum value in
    // that direction
    return !(
      (aX0 >= aX1 + aWidth1) ||
      (aX1 >= aX0 + aWidth0) ||
      (aY0 >= aY1 + anHeight1) ||
      (aY1 >= aY0 + anHeight0)
    );
  }

  /**
   * Checks if a value is a number.
   *
   * Copy from:
   * https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/isNumeric.ts
   *
   * @param aValue
   *   Value to check
   *
   * @returns True if value is a valid, otherwise false
   */
  static isNumeric(aValue: any): aValue is number | string {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat (#15100)
    return !Array.isArray(aValue) && (aValue - parseFloat(aValue) + 1) >= 0;
  }

  // endregion
}

// endregion
