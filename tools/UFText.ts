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

// region imports

import {UFMath} from "./UFMath";

// endregion

// region class

/**
 * {@link UFText} implements methods for supporting strings and characters.
 */
export class UFText {
  // region private vars

  /**
   * Maps certain characters to their entity or special html tag or empty string if it has no use in html
   */
  static s_escapeHtmlMap: Map<string, string> = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#039;'],
    ['\n', '<br/>'],
    ['\t', ''],
    ['\r', '']
  ]);

  // endregion

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
   * Converts plain text to html by replacing certain characters with their entity equivalent and
   * replacing \n with <br/> tags.
   *
   * Based on code from answer: https://stackoverflow.com/a/4835406/968451
   *
   * @param {string} aText
   *   Text to convert
   *
   * @return {string} Html formatted plain text
   */
  static escapeHtml(aText: string): string {
    return aText.replace(/[&<>"'\n\t\r]/g, character => UFText.s_escapeHtmlMap.get(character) as string);
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
   * Converts a html formatted text to a plain text.
   *
   * Based on code from:
   * https://javascript.plainenglish.io/3-ways-to-convert-html-text-to-plain-text-strip-off-the-tags-from-the-string-4c947feb8a8c
   *
   * @param {string} aHtmlText
   *   Html text to format
   *
   * @returns {string} plain version of the text
   */
  static convertToPlain(aHtmlText: string): string {
    // Create a new div element
    const tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = aHtmlText;
    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  /**
   * Joins strings making sure there is one delimiter string between them.
   *
   * @param aDelimiter
   *   Delimiter to use
   * @param aTexts
   *   Texts to join
   *
   * @return {string} aTexts joined together
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
   * @return {string} aTexts joined together
   */
  static joinPath(...aTexts: string[]): string {
    return this.join('/', ...aTexts);
  }
}

// endregion
