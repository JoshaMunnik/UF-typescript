/**
 * {@link IUFModel}} defines the minimal methods a model class should implement.
 */
export default interface IUFModel {
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