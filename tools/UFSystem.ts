// region class

/**
 * {@link UFSystem} implements system related methods.
 */
export class UFSystem {
  // region public methods

  /**
   * Returns the current time measured in the number of seconds since the Unix Epoch (January 1 1970 00:00:00 UTC).
   *
   * See: https://locutus.io/php/datetime/time/
   *
   * @return {number} seconds
   */
  static time(): number {
    return Math.floor(new Date().getTime() / 1000);
  }
}

// endregion
