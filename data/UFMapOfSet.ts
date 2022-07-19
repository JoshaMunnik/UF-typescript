/**
 * @version 1
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
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

// region types

/**
 * {@link UFMapOfSet} can be used to store groups of unique values. It uses a map that maps a value to a set. The
 * class takes care of managing the sets.
 *
 * @template TKey
 * @template TValue
 */
export class UFMapOfSet<TKey, TValue> {
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
      return Array.from(set);
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
