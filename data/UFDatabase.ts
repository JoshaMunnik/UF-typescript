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

import {IUFDynamicObject} from "../types/IUFDynamicObject";
import {UFText} from "../tools/UFText";
import {IUFDatabase} from "./IUFDatabase";

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
 * The class defines several abstract methods subclasses must implement.
 *
 * @template TRow
 */
export abstract class UFDatabase<TRow> implements IUFDatabase {
  // region IUFDatabase

  /**
   * @inheritDoc
   */
  async fieldAs<T>(aSql: string, aParameterValues: IUFDynamicObject, aDefault: T): Promise<T> {
    return await this.field(aSql, aParameterValues, aDefault) as T;
  }

  /**
   * @inheritDoc
   */
  async fieldOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T> {
    const field = await this.field(aSql, aParameterValues);
    if (field === undefined) {
      throw new Error('no field for query');
    }
    return field as T;
  }

  /**
   * @inheritDoc
   */
  abstract insert(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

  /**
   * @inheritDoc
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
   * @inheritDoc
   */
  async rowAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T | undefined> {
    const result = await this.row(aSql, aParameterValues);
    return result == undefined ? undefined : this.convertRow<T>(result as TRow);
  }

  /**
   * @inheritDoc
   */
  async rowOrFailAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T> {
    const row = await this.rowAs<T>(aSql, aParameterValues);
    if (row == undefined) {
      throw new Error('no row for query ' + aSql + ' ' + JSON.stringify(aParameterValues));
    }
    return row;
  }

  /**
   * @inheritDoc
   */
  async rowsAs<T>(aSql: string, aParameterValues?: IUFDynamicObject): Promise<T[]> {
    const result = await this.rows(aSql, aParameterValues);
    return result.map(row => this.convertRow<T>(row));
  }

  /**
   * @inheritDoc
   */
  abstract transaction(aCallback: (aDatabase: IUFDatabase) => Promise<void>): Promise<void>;

  /**
   * @inheritDoc
   */
  abstract update(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number>;

  /**
   * @inheritDoc
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
   * @inheritDoc
   */
  async delete(aSql: string, aParameterValues?: IUFDynamicObject): Promise<number> {
    return await this.update(aSql, aParameterValues);
  }

  /**
   * @inheritDoc
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
    // @ts-ignore
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
