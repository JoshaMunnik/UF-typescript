// region imports

import {Connection, createConnection, RowDataPacket, OkPacket} from 'mysql2/promise';
import {UFText} from "../tools/UFText";
import {UFLog} from "../log/UFLog";

// endregion

// region private constants

const LOG_PREFIX: string = 'DATABASE';

// endregion

// region private types

type DynamicObject = {
  [name: string]: any
}

// endregion

// region class

/**
 * {@link UFMysqlDatabase} is a helper class to manage a mysql database connection and query it in various ways.
 */
class UFMysqlDatabase {
  // region private variables

  /**
   * The active connection.
   *
   * @private
   */
  private m_connection: (Connection|null) = null;

  /**
   * The server
   *
   * @private
   */
  private m_host: string = '';

  /**
   * The database
   *
   * @private
   */
  private m_database: string = '';

  /**
   * The user
   *
   * @private
   */
  private m_user: string = '';

  /**
   * Password for user
   *
   * @private
   */
  private m_password: string = '';

  /**
   * Log to use
   * 
   * @private
   */
  private m_log: UFLog;

  // endregion

  // region constructor

  /**
   * Constructs an instance of {@link UFMysqlDatabase}.
   *
   * @param {UFLog} aLog
   *   Log to use
   */
  constructor(aLog: UFLog) {
    this.m_log = aLog;
  }

  // endregion
  
  // region public methods

  /**
   * Initializes the database and create a connection.
   *
   * @param {string} aHost
   *   Server address
   * @param {string} aDatabase
   *   Name of database
   * @param {string} anUser
   *   Name of user to log in with
   * @param {string} aPassword
   *   Password to use with login
   */
  async init(aHost: string, aDatabase: string, anUser: string, aPassword: string) {
    this.m_host = aHost;
    this.m_database = aDatabase;
    this.m_user = anUser;
    this.m_password = aPassword;
    this.m_connection = await createConnection({
      host: aHost,
      database: aDatabase,
      user: anUser,
      password: aPassword
    });
    this.m_log.info(LOG_PREFIX, 'connected to database', `host:${aHost}`, `database:${aDatabase}`, `user:${anUser}`);
  }

  /**
   * Execute a sql to get multiple rows.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*[]} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {RowDataPacket[]} result from sql statement
   */
  async rows(aSql: string, aParameterValues: any[] = []): Promise<RowDataPacket[]> {
    const rows = await this.execute('rows', aSql, aParameterValues);
    return rows as RowDataPacket[];
  }

  /**
   * Execute a sql to get multiple rows as a certain type.
   *
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*[]} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {T[]} Result from sql statement
   */
  async rowsAs<T>(aSql: string, aParameterValues: any[] = []): Promise<T[]> {
    return await this.rows(aSql, aParameterValues) as T[];
  }

  /**
   * Execute a sql to get a row.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*[]} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {RowDataPacket|undefined} result from sql statement; undefined when no row could be found
   */
  async row(aSql: string, aParameterValues: any[] = []): Promise<RowDataPacket | undefined> {
    const rows = await this.execute('row', aSql, aParameterValues) as RowDataPacket[];
    return rows.length ? rows[0] : undefined;
  }

  /**
   * Execute a sql to get a row as a certain type.
   * 
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*[]} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {T|undefined} result from sql statement; undefined when no row could be found
   */
  async rowAs<T>(aSql: string, aParameterValues: any[] = []): Promise<T | undefined> {
    return await this.row(aSql, aParameterValues) as T;
  }

  /**
   * Execute a sql to get a row. If no row can be found, the method will throw an error.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {RowDataPacket} result from sql statement
   *
   * @throws an error if no row can be found
   */
  async rowOrFail(aSql: string, aParameterValues: any = []): Promise<RowDataPacket> {
    const row = await this.row(aSql, aParameterValues);
    if (row == undefined) {
      throw new Error('no row for query ' + aSql + ' ' + JSON.stringify(aParameterValues));
    }
    return row;
  }

  /**
   * Execute a sql to get a row as a certain type. If no row can be found, the method will throw an error.
   * 
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*[]} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {T} result from sql statement
   *
   * @throws an error if no row can be found
   */
  async rowOrFailAs<T>(aSql: string, aParameterValues: any[] = []): Promise<T> {
    return await this.rowOrFail(aSql, aParameterValues) as T;
  }

  /**
   * Execute a sql to get a single value. The method returns the value of the first field of the query.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*[]} aParameterValues
   *   Values to use in case the statement contains parameters
   * @param {*} aDefault
   *   Default value to return if the sql statement did not have any results
   *
   * @return {*} result from sql statement or aDefault
   */
  async field(aSql: string, aParameterValues: any[] = [], aDefault: any = undefined): Promise<any> {
    const rows = await this.execute('field', aSql, aParameterValues) as RowDataPacket[];
    if (rows.length) {
      const row = rows[0];
      const keys = Object.keys(row as object);
      if (keys.length) {
        return row[keys[0]];
      }
    }
    return aDefault;
  }

  /**
   * Execute a sql to get a single value as a certain type.
   * 
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*} aParameterValues
   *   Values to use in case the statement contains parameters
   * @param {T} aDefault
   *   Default value to return if the sql statement did not have any results
   *
   * @return {T} result from sql statement or aDefault
   */
  async fieldAs<T>(aSql: string, aParameterValues: any = [], aDefault: T): Promise<T> {
    return await this.field(aSql, aParameterValues, aDefault) as T;
  }

  /**
   * Execute a sql to get a single value. If no value can be found, the method will throw an error.
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {RowDataPacket} result from sql statement
   *
   * @throws an error if no row can be found
   */
  async fieldOrFail(aSql: string, aParameterValues: any = []): Promise<any> {
    const field = await this.field(aSql, aParameterValues);
    if (field === undefined) {
      throw new Error('no field for query');
    }
    return field;
  }

  /**
   * Execute a sql to get a single value as a certain type. If no value can be found, the method will throw an error.
   * 
   * @template T
   *
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {T} result from sql statement
   *
   * @throws an error if no row can be found
   */
  async fieldOrFailAs<T>(aSql: string, aParameterValues: any = []): Promise<T> {
    return await this.fieldOrFail(aSql, aParameterValues) as T;
  }

  /**
   * Performs an insert and returns the id of the created record.
   *
   * @param {string} aSql
   *   Sql insert statement
   * @param {*} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {number} id of created record.
   */
  async insert(aSql: string, aParameterValues: any = []): Promise<number> {
    const result = await this.execute('insert', aSql, aParameterValues) as OkPacket;
    return result.insertId;
  }

  /**
   * Inserts a data from a structure. The aData structure can contain a primary key field, when building the sql
   * statement it will be skipped. After the insert statement the generated id will be assigned to the primary key
   * field.
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
    const data: any[] = [];
    Object.entries(aData).forEach(([key, value]) => {
      if (key !== aPrimaryKey) {
        columns = UFText.append(columns, key, ',');
        values = UFText.append(values, '?', ',');
        data.push(value);
      }
    });
    const id = await this.insert(`insert into ${aTable} (${columns}) values (${values})`, data);
    if (id > 0) {
      (aData as DynamicObject)[aPrimaryKey] = id;
    }
    return aData;
  }

  /**
   * Performs an update and returns the number of changed records.
   *
   * @param {string} aSql
   *   Sql insert statement
   * @param {*} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {number} number of changed records.
   */
  async update(aSql: string, aParameterValues: any = []): Promise<number> {
    const result = await this.execute('update', aSql, aParameterValues) as OkPacket;
    return result.changedRows;
  }

  /**
   * Execute a function within a transaction.
   *
   * @param {function} aCallback
   *   A function that will be called with await.
   *
   * @throws any exception that occurred while calling aCallback
   */
  async transaction(aCallback: () => Promise<void>): Promise<void> {
    if (this.m_connection == null) {
      throw new Error('There is no connection to the database.')
    }
    await this.m_connection.beginTransaction();
    try {
      await aCallback();
      await this.m_connection.commit();
    }
    catch (error) {
      await this.m_connection.rollback();
      throw error;
    }
    finally {
    }
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
      const code = UFText.generateCode(aLength);
      if (await this.fieldAs<number>(`select count(*) from ${aTable} where ${aColumn} = ?`, [code], 0) === 0) {
        return code;
      }
    }
  }

  // endregion

  // region private methods

  /**
   * Execute a sql.
   *
   * @param {string }aDescription
   *   Description (used when an error occurs)
   * @param {string} aSql
   *   Sql statement to perform
   * @param {*[]} aParameterValues
   *   Values to use in case the statement contains parameters
   *
   * @return {RowDataPacket[]|OkPacket} result from sql statement
   *
   * @throws error
   */
  async execute(aDescription: string, aSql: string, aParameterValues: any[] = [])  {
    if (this.m_connection == null) {
      throw new Error('There is no connection to the database.')
    }
    // try to execute sql
    try {
      const [rows, fields] = await this.m_connection.execute(aSql, aParameterValues);
      return rows;
    }
    catch(error: any) {
      this.m_log.error(LOG_PREFIX, error, error.code);
    }
    // on failure try to reconnect to the database
    try {
      await this.m_connection.end();
    }
    catch(error: any) {
      this.m_log.error(LOG_PREFIX, error, error.code, 'ending connection');
    }
    try {
      this.m_connection = await createConnection({
        host: this.m_host,
        database: this.m_database,
        user: this.m_user,
        password: this.m_password
      });
      this.m_log.info(LOG_PREFIX, 'reconnected to database');
    }
    catch(error: any) {
      this.m_log.error(LOG_PREFIX, error, 'reconnecting', error.code, aDescription, aSql, aParameterValues);
      throw error;
    }
    // execute query again
    try {
      const [rows, fields] = await this.m_connection.execute(aSql, aParameterValues);
      return rows;
    }
    catch(error: any) {
      this.m_log.error(LOG_PREFIX, error, error.code, aDescription, aSql, aParameterValues);
      throw error;
    }
  }

  // endregion
}

// endregion

// region exports

export {UFMysqlDatabase};

// endregion
