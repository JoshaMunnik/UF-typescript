// region imports

import {IUFDynamicObject} from "../types/IUFDynamicObject";

// endregion

// region types

/**
 * {@link IUFDatabase} defines the methods a database will implement.
 */
export interface IUFDatabase {
  /**
   * Execute a sql to get a single value as a certain type.
   *
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {IUFDynamicObject} aParameterValues
   *   Values to use in case the statement contains parameters
   * @param {T} aDefault
   *   Default value to return if the sql statement did not have any results
   *
   * @return {T} result from sql statement or aDefault
   */
  fieldAs<T>(aSql: string, aParameterValues: IUFDynamicObject, aDefault: T): Promise<T>;

  /**
   * Execute a sql to get a single value as a certain type. If no value can be found, the method will throw an error.
   *
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {IUFDynamicObject} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {T} result from sql statement
   *
   * @throws {Error} if no row (and thus field) can be found
   */
  fieldOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T>;

  /**
   * Performs an insert and returns the id of the created record.
   *
   * @param {string} aSql
   *   Sql insert statement
   * @param {IUFDynamicObject} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {number} id of created record.
   */
  insert(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

  /**
   * Inserts a data from a structure. The method creates an insert into statement using the property names inside
   * the type.
   *
   * The aData structure can contain a primary key property, when building the sql statement it will be skipped.
   * After the insert statement the generated id will be assigned to the primary key field.
   *
   * @template T
   *
   * @param {string} aTable
   *   Name of table
   * @param {T} aData
   *   Data to insert (should be some form of object), the primary key value will be updated after the insert
   * @param {string} aPrimaryKey
   *   Name of primary key field
   *
   * @return {T} aData with primary key value updated
   */
  insertObject<T extends object>(aTable: string, aData: T, aPrimaryKey: string): Promise<T>;

  /**
   * Execute a sql to get a row as a certain type.
   *
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {object} [aParameterValues]
   *   Values to use in case the statement contains parameters
   *
   * @return {T|undefined} result from sql statement; undefined when no row could be found
   */
  rowAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T | undefined>;

  /**
   * Execute a sql to get a row as a certain type. If no row can be found, the method will throw an error.
   *
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {IUFDynamicObject} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {T} result from sql statement
   *
   * @throws {Error} if no row can be found
   */
  rowOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T>;

  /**
   * Execute a sql to get multiple rows as a certain type.
   *
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {IUFDynamicObject} [aParameterValues]
   *   Values to use in case the statement contains parameters
   *
   * @return {T[]} Result from sql statement
   */
  rowsAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T[]>;

  /**
   * Execute a function within a transaction.
   *
   * @param {function(IUFDatabase)} aCallback
   *   A function that will be called with await. It will be called with a single parameter, which can be used to
   *   communicate with the database. The parameter might be a different instance then the instance the transaction call
   *   originated from.
   *
   * @throws any exception that occurred while calling aCallback
   */
  transaction(aCallback: (aDatabase: IUFDatabase) => Promise<void>): Promise<void>;

  /**
   * Performs an update and returns the number of changed records.
   *
   * @param {string} aSql
   *   Sql update statement
   * @param {IUFDynamicObject} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {number} number of changed records.
   */
  update(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

  /**
   * Updates a record in a table assuming it has a single primary key column.
   *
   * @template T
   *
   * @param {string} aTable
   *   Name of table
   * @param {*} aPrimaryValue
   *   Primary key vale
   * @param {T} aData
   *   Object containing field names and their new values.
   * @param {string} aPrimaryKey
   *   Name of primary key
   */
  updateObject<T extends object>(aTable: string, aPrimaryValue: any, aData: T, aPrimaryKey: string): Promise<void>;

  /**
   * Performs a delete and returns the number of deleted records.
   *
   * The default implementation calls {@link update} assuming it is handled in the same way by the database
   * implementation.
   *
   * @param {string} aSql
   *   Sql delete statement
   * @param {IUFDynamicObject} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {number} number of deleted records.
   */
  delete(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

  /**
   * Generates a unique code to be used in some table.
   *
   * @param {string} aTable
   *   Table to use unique code with
   * @param {string} aColumn
   *   Name of column in table that contains the unique code
   * @param {number} aLength
   *   Number of characters the code should exist of
   *
   * @return {string} an unique code
   */
  getUniqueCode(aTable: string, aColumn: string, aLength: number): Promise<string>;
}

// endregion
