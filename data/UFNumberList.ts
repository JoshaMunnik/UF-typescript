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

/**
 * {@link UFNumberList} defines a list of numbers.
 */
export class UFNumberList {
  // region private variables

  /**
   * Contains the numbers
   *
   * @private
   */
  private readonly m_numbers: number[];

  // endregion

  // region public methods

  /**
   * Creates an instance of {@link UFNumberList}
   */
  public constructor() {
    this.m_numbers = [];
  }

  /**
   * Adds a number to the end of the list.
   *
   * @param aNumber
   *   Number to add
   */
  public add(aNumber: number) {
    this.m_numbers.push(aNumber);
  }

  /**
   * Adds a list of numbers to the end of the list.
   *
   * @param aNumbers
   *   Numbers to add
   */
  public addList(aNumbers: number[]) {
    aNumbers.forEach(value => this.add(value));
  }

  /**
   * Clears the list.
   */
  public clear() {
    this.m_numbers.length = 0;
  }

  /**
   * Gets a number at a certain index.
   *
   * @param anIndex
   *   Index of number
   *
   * @throws an error if index is invalid
   */
  public get(anIndex: number): number {
    if ((anIndex  < 0) || (anIndex >= this.size)) {
      throw new Error(`Invalid index ${anIndex} (size = ${this.size})`);
    }
    return this.m_numbers[anIndex];
  }

  /**
   * Gets the maximum number.
   *
   * @return maximum number
   */
  public max(): number {
    return Math.max(...this.m_numbers);
  }

  /**
   * Gets the minimum number.
   *
   * @return minimum number
   */
  public min(): number {
    return Math.min(...this.m_numbers);
  }

  /**
   * Gets all numbers added together.
   *
   * @return sum of all numbers
   */
  public sum(): number {
    return this.m_numbers.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  /**
   * Calculates the average.
   *
   * @return average value or 0 if the list is empty.
   */
  public average(): number {
    return this.size ? this.sum() / this.size : 0;
  }

  // endregion

  // region public properties

  /**
   * The current size of the list.
   */
  public get size(): number {
    return this.m_numbers.length;
  }

  /**
   * True is the list is empty.
   */
  public get empty(): boolean {
    return this.size === 0;
  }

  // endregion
}