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
 * {@link IUFModel} defines the minimal methods a model class should implement.
 */
export interface IUFModel {
  /**
   * Gets a value of a property.
   *
   * @param aName
   *   Name of property
   *
   * @returns Value of property
   */
  getPropertyValue<T>(aName: string): T;

  /**
   * Sets a property to a value.
   *
   * @param aName
   *   Property name
   * @param aValue
   *   Value to assign
   */
  setPropertyValue<T>(aName: string, aValue: T): void;

  /**
   * Checks if a value is valid for a property.
   *
   * If the property is unknown or does not have any validator attached to it, the method returns true.
   *
   * @param aPropertyName
   *   Property name
   * @param aValue
   *   Value to test
   *
   * @return True if the value is valid for property, otherwise false.
   */
  isValidPropertyValue(aPropertyName: string, aValue: any): boolean;
}