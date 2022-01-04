// region imports

import {UFText} from "./UFText";

// endregion

// region types

/**
 * {@link UFDate} defines support methods for {@link Date}.
 */
class UFDate {
  /**
   * Gets the date formatted for use with mysql: "yyyy-mm-dd hh:mm:ss"
   *
   * @param {Date | null | undefined} aDate
   *   Date to format
   * @param {string} aDefault
   *   Default to return if aData is not a date.
   *
   * @returns {string} Formatted date or aDefault if data is null or undefined
   */
  static mysql(aDate: (Date | null | undefined), aDefault: string = ''): string {
    if (!aDate) {
      return aDefault;
    }
    return aDate.getFullYear().toString() + '-'
      + UFText.twoDigits(1 + aDate.getMonth()) + '-'
      + UFText.twoDigits(aDate.getDate()) + ' '
      + UFText.twoDigits(aDate.getHours()) + ':'
      + UFText.twoDigits(aDate.getMinutes()) + ':'
      + UFText.twoDigits(aDate.getSeconds());
  }
}

// endregion

// region exports

export {UFDate};

// endregion