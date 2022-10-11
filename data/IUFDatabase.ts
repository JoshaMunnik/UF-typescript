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
   * @param aSql
   *   Sql statement to perform
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   * @param aDefault
   *   Default value to return if the sql statement did not have any results
   *
   * @return result from sql statement or aDefault
   */
  fieldAs<T>(aSql: string, aParameterValues: IUFDynamicObject, aDefault: T): Promise<T>;

  /**
   * Execute a sql to get a single value as a certain type. If no value can be found, the method will throw an error.
   *
   * @template T
   *
   * @param aSql
   *   Sql statement to perform
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return result from sql statement
   *
   * @throws if no row (and thus field) can be found
   */
  fieldOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T>;

  /**
   * Performs an insert and returns the id of the created record.
   *
   * @param aSql
   *   Sql insert statement
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return id of created record.
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
   * @param aTable
   *   Name of table
   * @param aData
   *   Data to insert (should be some form of object), the primary key value will be updated after the insert
   * @param aPrimaryKey
   *   Name of primary key field
   *
   * @return aData with primary key value updated
   */
  insertObject<T extends object>(aTable: string, aData: T, aPrimaryKey: string): Promise<T>;

  /**
   * Execute a sql to get a row as a certain type.
   *
   * @template T
   *
   * @param aSql
   *   Sql statement to perform
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return result from sql statement; undefined when no row could be found
   */
  rowAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T | undefined>;

  /**
   * Execute a sql to get a row as a certain type. If no row can be found, the method will throw an error.
   *
   * @template T
   *
   * @param aSql
   *   Sql statement to perform
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return result from sql statement
   *
   * @throws error if no row can be found
   */
  rowOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T>;

  /**
   * Execute a sql to get multiple rows as a certain type.
   *
   * @template T
   *
   * @param aSql
   *   Sql statement to perform
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return result from sql statement
   */
  rowsAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T[]>;

  /**
   * Execute a function within a transaction.
   *
   * @param aCallback
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
   * @param aSql
   *   Sql update statement
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return number of changed records.
   */
  update(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

  /**
   * Updates a record in a table assuming it has a single primary key column.
   *
   * @template T
   *
   * @param aTable
   *   Name of table
   * @param aPrimaryValue
   *   Primary key vale
   * @param aData
   *   Object containing field names and their new values.
   * @param aPrimaryKey
   *   Name of primary key
   */
  updateObject<T extends object>(aTable: string, aPrimaryValue: any, aData: T, aPrimaryKey: string): Promise<void>;

  /**
   * Performs a database delete and returns the number of deleted records.
   *
   * @param aSql
   *   Sql delete statement
   * @param aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return number of deleted records.
   */
  delete(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

  /**
   * Generates a unique code with {@link UFText.generateCode} to be used in some table.
   *
   * @param aTable
   *   Table to use unique code with
   * @param aColumn
   *   Name of column in table that contains the unique code
   * @param aLength
   *   Number of characters the code should exist of
   *
   * @return an unique code
   */
  getUniqueCode(aTable: string, aColumn: string, aLength: number): Promise<string>;
}

// endregion
