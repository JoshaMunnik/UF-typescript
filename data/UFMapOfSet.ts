// region types

/**
 * {@link UFMapOfSet} can be used to store groups of unique values. It uses a map that maps a value to a set. The
 * class takes care of managing the sets.
 *
 * @template TKey
 * @template TValue
 */
class UFMapOfSet<TKey, TValue> {
  // region private variables

  /**
   * Storage
   *
   * @private
   */
  private m_map: Map<TKey, Set<TValue>> = new Map<TKey, Set<TValue>>();

  // endregion

  // region public methods

  /**
   * Adds a value to the group for a key.
   *
   * @param {TKey} aKey
   *   Key to add for
   * @param {TValue} aValue
   *   Value to add to the group of aKey
   */
  add(aKey: TKey, aValue: TValue): void {
    if (!this.m_map.has(aKey)) {
      this.m_map.set(aKey, new Set<TValue>());
    }
    this.m_map.get(aKey)?.add(aValue);
  }

  /**
   * Removes a value from the group for a key.
   *
   * @param {TKey} aKey
   *   Key to remove for
   * @param {TValue} aValue
   *   Value to remove from the group of aKey
   */
  remove(aKey: TKey, aValue: TValue): void {
    if (this.m_map.has(aKey)) {
      const set = this.m_map.get(aKey) as Set<TValue>;
      set.delete(aValue);
      if (set.size == 0) {
        this.m_map.delete(aKey);
      }
    }
  }

  /**
   * Gets all values stored for a certain key.
   *
   * @param {TKey} aKey
   *   Key to get values for
   *
   * @returns {TValue[]} All values
   */
  get(aKey: TKey): TValue[] {
    if (this.m_map.has(aKey)) {
      const set = this.m_map.get(aKey) as Set<TValue>;
      return [...set.values()];
    }
    return [];
  }

  /**
   * Checks if the map has a certain key.
   *
   * @param {TKey} aKey
   *   Key to check
   *
   * @returns {boolean} True if the map contains the key.
   */
  has(aKey: TKey): boolean {
    return this.m_map.has(aKey);
  }

  /**
   * Checks if the instance has a certain value for a certain key.
   *
   * @param {TKey} aKey
   *   Key to check
   * @param {TValue} aValue
   *   Value to check
   *
   * @returns {boolean} True if the map contains the key and value.
   */
  hasValue(aKey: TKey, aValue: TValue): boolean {
    return this.m_map.has(aKey) && (this.m_map.get(aKey) as Set<TValue>).has(aValue);
  }

  /**
   * Checks if the map contains any sets.
   *
   * @returns {boolean} True if there are no sets.
   */
  isEmpty(): boolean {
    return this.m_map.size == 0;
  }

  // endregion
}

// endregion

// region exports

export {UFMapOfSet}

// endregion