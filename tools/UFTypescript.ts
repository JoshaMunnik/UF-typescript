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