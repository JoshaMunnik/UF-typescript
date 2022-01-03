// region imports

import {IUFDynamicObject} from "../types/IUFDynamicObject";
import {UFText} from "../tools/UFText";

// endregion

// region types

/**
 * Callback used by {@link UFDatabase.processSqlParameters}
 */
interface IUFSqlParameterCallback {
  (aName: string, aValue: any): string;
}

/**
 * {@link UFDatabase} can act as a base class for database implementations.
 *
 * It supports named parameters in sql queries, using ':name' where name can be a combination of letters, numbers
 * and underscores.
 *
 * The parameter values are contained in a dynamic object, where the property names match the named parameter.
 *
 * Subclasses can use {@link processSqlParameters} to convert the sql statement.
 *
 * @template TRow
 */
abstract class UFDatabase<TRow> {
  // region public methods

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
  async fieldAs<T>(aSql: string, aParameterValues: IUFDynamicObject, aDefault: T): Promise<T> {
    return await this.field(aSql, aParameterValues, aDefault) as T;
  }

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
  async fieldOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T> {
    const field = await this.field(aSql, aParameterValues);
    if (field === undefined) {
      throw new Error('no field for query');
    }
    return field as T;
  }

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
  abstract insert(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

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
  async insertObject<T extends object>(aTable: string, aData: T, aPrimaryKey: string = 'id'): Promise<T> {
    let columns = '';
    let values = '';
    const data: IUFDynamicObject = {};
    Object.entries(aData).forEach(([key, value]) => {
      if (key !== aPrimaryKey) {
        columns = UFText.append(columns, key, ',');
        values = UFText.append(values, ':' + key, ',');
        data[key] = value;
      }
    });
    const id = await this.insert(`insert into ${aTable} (${columns}) values (${values})`, data);
    if (id > 0) {
      (aData as IUFDynamicObject)[aPrimaryKey] = id;
    }
    return aData;
  }

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
  async rowAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T | undefined> {
    const result = await this.row(aSql, aParameterValues);
    return result == undefined ? undefined : this.convertRow<T>(result as TRow);
  }

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
  async rowOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T> {
    const row = await this.rowAs<T>(aSql, aParameterValues);
    if (row == undefined) {
      throw new Error('no row for query ' + aSql + ' ' + JSON.stringify(aParameterValues));
    }
    return row;
  }

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
  async rowsAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T[]> {
    const result = await this.rows(aSql, aParameterValues);
    return result.map(row => this.convertRow<T>(row));
  }

  /**
   * Execute a function within a transaction.
   *
   * @param {function} aCallback
   *   A function that will be called with await.
   *
   * @throws any exception that occurred while calling aCallback
   */
  abstract transaction(aCallback: () => Promise<void>): Promise<void>;

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
  abstract update(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

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
  async updateObject<T extends object>(
    aTable: string, aPrimaryValue: any, aData: T, aPrimaryKey: string = 'id'
  ): Promise<void> {
    let fields = '';
    const data: IUFDynamicObject = {};
    Object.entries(aData).forEach(([key, value]) => {
      if (key !== aPrimaryKey) {
        fields = UFText.append(fields, key + '=' + ':' + key, ',');
        data[key] = value;
      }
    });
    if (fields.length) {
      const sql = 'update ' + aTable + ' set ' + fields + ' where ' + aPrimaryKey + ' = :' + aPrimaryKey;
      data[aPrimaryKey] = aPrimaryValue;
      await this.update(sql, data);
    }
  }

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
  async delete(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number> {
    return await this.update(aSql, aParameterValues);
  }

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
  async getUniqueCode(aTable: string, aColumn: string, aLength: number): Promise<string> {
    while (true) {
      const values = {
        code: UFText.generateCode(aLength)
      }
      if (await this.fieldAs<number>(`select count(*) from ${aTable} where ${aColumn} = :code`, values, 0) === 0) {
        return values.code;
      }
    }
  }

  // endregion

  // region protected methods

  /**
   * Execute a sql to get a single value.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {IUFDynamicObject} aParameterValues
   *   Values to use in case the statement contains parameters
   * @param {*} aDefault
   *   Default value to return if the sql statement did not have any results
   *
   * @return {*} result from sql statement or aDefault
   */
  protected abstract field(aSql: string, aParameterValues?: IUFDynamicObject, aDefault?: any): Promise<any>;

  /**
   * Execute a sql to get a row.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {IUFDynamicObject} [aParameterValues]
   *   Values to use in case the statement contains parameters
   *
   * @return {TRow|undefined} result from sql statement; undefined when no row could be found
   */
  protected abstract row(aSql: string, aParameterValues?: IUFDynamicObject): Promise<TRow | undefined>;

  /**
   * Execute a sql to get multiple rows.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {IUFDynamicObject} [aParameterValues]
   *   Values to use in case the statement contains parameters
   *
   * @return {TRow[]} Result from sql statement
   */
  protected abstract rows(aSql: string, aParameterValues?: IUFDynamicObject): Promise<TRow[]>;

  /**
   * Converts a row from database type to an external type. The default implementation just uses a typecast.
   *
   * @template T
   * @template TRow
   *
   * @param {TRow} aRow
   *   Row to convert.
   *
   * @return {T} The data from aRow as new type.
   */
  protected convertRow<T>(aRow: TRow): T {
    return aRow as unknown as T;
  }

  /**
   * Processes a sql with named parameters and replaces the named parameters with values returned by the callback.
   *
   * @param {string} aSql
   *   Sql statement to process.
   * @param {IUFDynamicObject} aParameterValues
   *   An object that contains properties whose name match the named parameters
   * @param {IUFSqlParameterCallback} aCallback
   *   This callback is invoked for every found named parameter. The result will be used to replace the named parameter.
   *
   * @return {string} an updated SQL statement
   */
  protected processSqlParameters(
    aSql: string, aParameterValues: IUFDynamicObject, aCallback: IUFSqlParameterCallback
  ): string {
    const matches = aSql.matchAll(/(:[\w\d_]+)/g);
    let start = 0;
    let result = '';
    for (const match of matches) {
      if (match.index != undefined) {
        const currentName = match[0].substring(1);
        const newName = aCallback(currentName, aParameterValues[currentName]);
        result += aSql.substring(start, match.index);
        result += newName;
        start = match.index + match[0].length;
      }
    }
    result += aSql.substring(start);
    return result;
  }

  // endregion
}

// endregion

// region exports

export {UFDatabase};

// endregion
