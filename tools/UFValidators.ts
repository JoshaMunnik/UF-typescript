/**
 * @version 1
 * @author Josha Munnik
 * @copyright Copyright (c) 2019 Ultra Force Development
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

import {IUFModel} from "../models/IUFModel";

// endregion

// region private constants

/**
 * Number of days in a month. The first month starts at 1.
 *
 * @type {number[]}
 */
const MONTH_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * A regular expression to test for integer numbers (without plus or minus sign)
 */
const INT_NUMBER: RegExp = /\d+/;

// endregion

// region types

/**
 * A function interface to validate a value.
 */
export interface IUFValidateValue {
  /**
   * Checks if a value is valid.
   *
   * @param aValue
   *   Value to check
   *
   * @returns True if the value is valid; false otherwise.
   */
  (aValue: any): boolean
}

/**
 * A object interface that defines a method to test if a value is valid.
 */
export interface IUFValueValidator {
  /**
   * Checks if a value is valid.
   *
   * @param aValue
   *   Value to check
   *
   * @returns True if the value is valid; false otherwise.
   */
  isValidValue(aValue: any): boolean;
}

/**
 * An object interface that defines a method to test if a property is valid.
 */
export interface IUFPropertyValidator {
  /**
   * Checks if a value is valid for a certain property.
   *
   * @param aPropertyName
   *   Name of property
   * @param aData
   *   Data that contains the property
   * @param aValue
   *   Value to check
   *
   * @returns True if the value is valid; false otherwise.
   */
  isValidPropertyValue(aPropertyName: string, aData: IUFModel, aValue: any): boolean;
}

/**
 * {@link UFValidators} defines various static methods to validate values.
 *
 * There are two form of validation methods:
 * - the isXXXX(*) methods perform an immediate validation of a value.
 * - the createXXXX methods create and return a validation function to validate a value.
 */
export class UFValidators {
  // region validator functions

  /**
   * Checks if a text contains at least one non space character.
   *
   * @param aValue
   *   Value to validate
   *
   * @returns True if the value contains one or more non-space chars; false if the string is null, empty or
   *   contains only spaces.
   */
  static isNonEmptyText(aValue: any): boolean {
    if (aValue) {
      const value = aValue.toString().trim();
      return value.length > 0;
    }
    return false;
  }

  /**
   * Checks if a value is valid number.
   *
   * @param aValue
   *   Value to test
   *
   * @returns the result of !isNaN(aValue)
   */
  static isNumber(aValue: any): boolean {
    return !isNaN(aValue);
  }

  /**
   * Checks if a value is a valid integer.
   *
   * @param aValue
   *   Value to test
   *
   * @returns true if aValue is a valid integer.
   */
  static isInteger(aValue: any): boolean {
    return /^\s*(\+|-)?\d+\s*$/.test(aValue.toString());
  }

  /**
   * Checks if a value is a valid email address.
   *
   * @param aValue
   *   Value to test
   *
   * @returns true if aValue is a valid email address.
   */
  static isEmail(aValue: any): boolean {
    return /(\w|[_.\-])+@((\w|-)+\.)+\w{2,32}/.test(aValue.toString());
  }

  /**
   * Checks if a value is a valid dutch zip code.
   *
   * @param aValue
   *   Value to test
   *
   * @returns true if aValue is a valid dutch zip code.
   */
  static isZipCodeDutch(aValue: any): boolean {
    return /\d\d\d\d\s?[A-Za-z][A-Za-z]/.test(aValue.toString());
  }

  /**
   * Checks if a value is a valid city name.
   *
   * @param aValue
   *   Value to test
   *
   * @returns true if aValue is a valid city name.
   */
  static isCityName(aValue: any): boolean {
    return /[A-Za-z\-\s'"\.]+/.test(aValue.toString());
  }

  /**
   * Checks if a value is an array.
   *
   * @param aValue
   *   Value to test
   *
   * @returns true if aValue is a valid city name.
   */
  static isArray(aValue: any): boolean {
    return Array.isArray(aValue);
  }

  // endregion

  // region validator creation functions

  /**
   * Creates a validator function that checks if a value matches a regular expression.
   *
   * @param aRegExp
   *   Regular expression to use for testing
   *
   * @returns validator function.
   */
  static createRegExp(aRegExp: RegExp): IUFValidateValue {
    return aValue => aRegExp.test(aValue.toString());
  }

  /**
   * Creates a validator function that checks if a value is string with a certain length.
   *
   * @param aMin
   *   Minimal number of characters allowed
   * @param [aMax=Number.MAX_VALUE]
   *   Maximum number of characters allowed
   *
   * @returns validator function.
   */
  createTextLength(aMin: number, aMax: number = Number.MAX_VALUE): IUFValidateValue {
    return aValue => {
      const charCount = aValue.toString().length;
      return (charCount >= aMin) && (charCount <= aMax);
    };
  }

  /**
   * Creates a validator that checks if a value is a valid number and within a certain value range.
   *
   * @param aMin
   *   Minimum value allowed (including this value)
   * @param [aMax=Number.MAX_VALUE]
   *   Maximum value allowed (including this value)
   *
   * @returns validator function.
   */
  createNumberRange(aMin: number, aMax: number = Number.MAX_VALUE): IUFValidateValue {
    return aValue => {
      if (!UFValidators.isNumber(aValue)) {
        return false;
      }
      const value = parseFloat(aValue + "");
      return (value >= aMin) && (value <= aMax);
    }
  }

  /**
   * Creates a validator that checks if a value is a valid integer and within a certain value range.
   *
   * @param aMin
   *   Minimum value allowed (including this value)
   * @param [aMax=Number.MAX_VALUE]
   *   Maximum value allowed (including this value)
   *
   * @returns validator function.
   */
  createIntegerRange(aMin: number, aMax: number = Number.MAX_VALUE): IUFValidateValue {
    return aValue => {
      if (!UFValidators.isInteger(aValue)) {
        return false;
      }
      const value = parseInt(aValue + "", 10);
      return (value >= aMin) && (value <= aMax);
    }
  }

  /**
   * Creates a validator that checks if a value is a valid integer and within a certain value range.
   *
   * @param aMin
   *   Minimum value allowed (including this value)
   * @param [aMax=Number.MAX_VALUE]
   *   Maximum value allowed (including this value)
   *
   * @returns validator function.
   */
  createArrayRange(aMin: number, aMax: number = Number.MAX_VALUE): IUFValidateValue {
    return aValue => {
      if (!UFValidators.isArray(aValue)) {
        return false;
      }
      return (aValue.length >= aMin) && (aValue.length <= aMax);
    }
  }

  /**
   * Creates a validator that checks if a value matches a boolean value.
   *
   * @param aValidValue
   *   Value to match
   *
   * @returns validator function.
   */
  static createBoolean(aValidValue: boolean): IUFValidateValue {
    return aValue => aValue === aValidValue;
  }

  /**
   * Creates a validator that checks if a property contains a valid value. The validator does not do
   * anything with the passed value.
   *
   * @param aProperty
   *   Property name
   * @param aData
   *   Data instance
   *
   * @returns validator function.
   */
  static createAnotherProperty(aProperty: string, aData: IUFModel): IUFValidateValue {
    return () => aData.isValidPropertyValue(aProperty, aData.getPropertyValue(aProperty));
  }

  /**
   * Creates a validator that checks if a value is equal to a property.
   *
   * @param aProperty
   *   Property name
   * @param aData
   *   Data instance
   *
   * @returns validator function.
   */
  static createEqualToProperty(aProperty: string, aData: IUFModel): IUFValidateValue {
    return aValue => aValue === aData.getPropertyValue(aProperty);
  }

  /**
   * Creates a validator that optionally validates a value. If a value is empty or '' then the validator
   * will return true else it will pass the value to another validator.
   *
   * @param aValidator
   *   Validator to use for non empty values.
   *
   * @returns validator function.
   */
  static createOptional(aValidator: IUFValidateValue|IUFValueValidator): IUFValidateValue {
    return aValue => aValue && aValue.toString().length ? UFValidators.isValidValue(aValue, aValidator) : true;
  }

  /**
   * Creates a validator to validate a day value.
   *
   * @param aMonthProperty
   *   Property name for month
   * @param aYearProperty
   *   Property name for year
   * @param aData
   *   UFModel instance
   *
   * @returns validator function.
   */
  createDay(aMonthProperty: string, aYearProperty: string, aData: IUFModel): IUFValidateValue {
    return aValue => {
      const value: string = aValue + "";
      if (!INT_NUMBER.test(value)) {
        return false;
      }
      const day: number = parseInt(value, 10);
      // day should be between 1 and 31 (at least)
      if ((day < 1) || (day > 31)) {
        return false;
      }
      let maxDay: number = 31;
      const yearValue: string = aData.getPropertyValue<any>(aYearProperty).toString();
      const monthValue: string = aData.getPropertyValue<any>(aMonthProperty).toString();
      if (INT_NUMBER.test(monthValue) && INT_NUMBER.test(yearValue)) {
        const year = parseInt(yearValue, 10);
        const month = parseInt(monthValue, 10);
        // valid month
        if ((month > 1) && (month < 13)) {
          // yes, get maximum day
          maxDay = MONTH_DAYS[month];
          // handle leap years and the month february
          if ((month === 2) && (((year % 400) === 0) || (((year % 100) !== 0) && ((year % 4) === 0)))) {
            maxDay = 29;
          }
        }
      }
      // there was already a check on day being 1 or more, so only check if day is small enough
      return day <= maxDay;
    }
  }

  // endregion

  // region support methods

  /**
   * Checks if value is valid.
   *
   * @param aValue
   *   Value to validate
   * @param aValidator
   *   Validator to use
   *
   * @returns result from validator or true if validator is not
   *   supported.
   */
  static isValidValue(aValue: any, aValidator: IUFValidateValue|IUFValueValidator) {
    // use validation function
    if (typeof aValidator === 'function') {
      return aValidator(aValue);
    }
    // use value validation
    if (aValidator.hasOwnProperty('isValidValue') && (typeof aValidator.isValidValue === 'function')) {
      return aValidator.isValidValue(aValue);
    }
    // unsupported validator, so value is always valid
    return true;
  }

  /**
   * Checks if a property has a valid value.
   *
   * @param aData
   *   Data to get property value from
   * @param aPropertyName
   *   Name of property
   * @param aValidator
   *   Validator to use
   * @param [aValue]
   *   Value to validate, when missing use the value of the property.
   *
   * @returns result from validator or true if validator is not
   *   supported.
   */
  static isValidProperty(
    aData: IUFModel,
    aPropertyName: string,
    aValidator: IUFValidateValue|IUFValueValidator|IUFPropertyValidator,
    aValue?: any
  ): boolean {
    // get value from property if none was specified
    if (aValue === undefined) {
      aValue = aData.getPropertyValue(aPropertyName);
    }
    // use validation function
    if (typeof aValidator === 'function') {
      return aValidator(aValue);
    }
    // use property validation
    // @ts-ignore
    if (aValidator.hasOwnProperty('isValidPropertyValue') && (typeof aValidator.isValidPropertyValue === 'function')) {
      // @ts-ignore
      return aValidator.isValidPropertyValue(aPropertyName, aData, aValue);
    }
    // use value validation
    // @ts-ignore
    if (typeof aValidator.isValidValue === 'function') {
      // @ts-ignore
      return aValidator.isValidValue(aValue);
    }
    // unsupported validator, so value is always valid
    return true;
  }

  // endregion
}

// endregion
