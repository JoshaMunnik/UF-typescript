// region imports

import {UFMath} from "./UFMath";

// endregion

// region class

/**
 * {@link UFText} implements methods for supporting strings and characters.
 */
class UFText {
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
        if ((charCode != 0) && (charCode != 24) && (charCode != 1) && (charCode != 47)) {
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
    return ('000' + aNumber.toString()).substr(-3);
  }

}

// endregion

// region exports

export {UFText};

// endregion
