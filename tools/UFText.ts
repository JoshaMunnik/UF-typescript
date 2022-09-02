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
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS`` AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

// region imports

import {UFMath} from "./UFMath";

// endregion

// region class

/**
 * {@link UFText} implements methods for supporting strings and characters.
 */
export class UFText {
  // region public methods

  /**
   * Appends a text to another text using a separator. If either texts are empty, the method just returns the other
   * texts without the separator.
   *
   * @param {string} aSource
   *   Source to add to
   * @param {string} aValue
   *   Value to append
   * @param {string} aSeparator
   *   Separator to use
   *
   * @return {string} aValue added to aSource with aSeparator if both aValue and aSource are not empty.
   */
  static append(aSource: string, aValue: string, aSeparator: string): string {
    if (aSource.length <= 0) {
      return aValue;
    }
    if (aValue.length <= 0) {
      return aSource;
    }
    return aSource + aSeparator + aValue;
  }

  /**
   * Generate a code existing of a random sequence of upper and lowercase and numbers.
   *
   * @param {number} aLength
   *   Number of characters the code exists of
   *
   * @return {string} The generated code.
   */
  static generateCode(aLength: number): string {
    let result = '';
    let numberCount = 1;
    for (let cnt = 0; cnt < aLength; cnt++) {
      // 00..09: '0'..'9'
      // 10..35: 'A'..'Z'
      // 36..61: 'a'..'z'
      let charCode;
      while (true) {
        // make sure every 3rd char is a number (also to prevent offensive words)
        charCode = (numberCount > 2) ? UFMath.randomInteger(0, 9) : UFMath.randomInteger(0, 61);
        // break loop if char code is not zero or uppercase O or one and lowercase l (too similar)
        if ((charCode !== 0) && (charCode !== 24) && (charCode !== 1) && (charCode !== 47)) {
          break;
        }
      }
      if (charCode < 10) {
        // reset number counter
        result += String.fromCharCode(charCode + 48);
        numberCount = 0;
      } else if (charCode < 36) {
        result += String.fromCharCode(charCode + 65 - 10);
        numberCount++;
      } else {
        result += String.fromCharCode(charCode + 97 - 10 - 26);
        numberCount++;
      }
    }
    return result;
  }

  /**
   * Converts a number to a string of 2 digits
   *
   * @param {number} aNumber
   *   A number between 0 and 99
   *
   * @return {string} aNumber as string, prefixed with a 0 if number exists of 1 digit
   *
   * @private
   */
  static twoDigits(aNumber: number): string {
    return aNumber < 10 ? '0' + aNumber : aNumber.toString();
  }

  /**
   * Converts a number to a string of 3 digits
   *
   * @param {number} aNumber
   *   A number between 0 and 999
   *
   * @return {string} aNumber as string, prefixed with a 0 if number exists of 1 digit
   *
   * @private
   */
  static threeDigits(aNumber: number): string {
    return ('000' + aNumber.toString()).substring(-3);
  }

  /**
   * Replace all keys by their value in a string.
   *
   * @param {string} aText
   *   Text to update
   * @param {Object} aMap
   *   Replace keys with their values
   *
   * @return {string} Updated aText
   */
  static replace(aText: string, aMap: object): string {
    for (const [key, value] of Object.entries(aMap)) {
      aText = aText.replace(key, value);
    }
    return aText;
  }

  /**
   * Returns a number converted to a hex number of two digits.
   *
   * @param {number} aNumber
   *   Number to convert (will be clamped between 0 and 255)
   *
   * @return {string} hexadecimal string of 2 digits
   */
  static hexTwoDigits(aNumber: number): string {
    return ('0' + Math.min(255, Math.max(0, aNumber)).toString(16)).substring(-2);
  }

  /**
   * Returns a number converted to a hex number of four digits.
   *
   * @param {number} aNumber
   *   Number to convert (will be clamped between 0 and 65535)
   *
   * @return {string} hexadecimal string of 4 digits
   */
  static hexFourDigits(aNumber: number): string {
    return ('000' + Math.min(65535, Math.max(0, aNumber)).toString(16)).substring(-4);
  }

  /**
   * Joins strings making sure there is one delimiter string between them.
   *
   * @param aDelimiter
   *   Delimiter to use
   * @param aTexts
   *   Texts to join
   *
   * @return aTexts joined together
   */
  static join(aDelimiter: string, ...aTexts: string[]): string {
    return aTexts.reduce((previous, current) => {
      if (current.startsWith(aDelimiter)) {
        current = current.substring(aDelimiter.length);
      }
      if (!previous.endsWith(aDelimiter) && previous.length) {
        previous += aDelimiter;
      }
      return previous + current;
    });
  }

  /**
   * Joins strings together using '/' as a delimiter.
   *
   * @param aTexts
   *   Texts to join
   *
   * @return aTexts joined together
   */
  static joinPath(...aTexts: string[]): string {
    return this.join('/', ...aTexts);
  }

  /**
   * Gets the text to convert a number to an english ordinal number.
   *
   * @param aNumber
   *   Number to convert.
   *
   * @return Text to add to the number.
   */
  static getOrdinalPost(aNumber: number): string {
    switch(aNumber % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  /**
   * Converts a number to an english ordinal number.
   *
   * @param aNumber
   *   Number to convert.
   *
   * @return number with shortened ordinal text added to it.
   */
  static getOrdinalNumber(aNumber: number): string {
    return aNumber.toString() + this.getOrdinalPost(aNumber);
  }
}

// endregion
