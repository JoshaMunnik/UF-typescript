// region imports

import {UFText} from "./UFText";
import {UFFetchMethod} from "../types/UFFetchMethod";

// endregion

/**
 * Support methods related to network communication.
 */
export class UFNetwork {
  /**
   * Starts console group.
   *
   * @param aTitle
   *   Opening title
   * @param aMethod
   *   Method used
   * @param aPath
   *   Path to API call
   */
  static startApiGroup(aTitle: string, aMethod: UFFetchMethod, aPath: string) {
    const now = new Date();
    const minutes = UFText.twoDigits(now.getMinutes());
    const seconds = UFText.twoDigits(now.getSeconds());
    const timeStamp = `${now.getHours()}:${minutes}:${seconds}.${now.getMilliseconds()}`;
    console.group(
      '%c' + aTitle + ' %c' + aMethod + ' %c' + aPath + ' %c @ ' + timeStamp,
      'color: gray; font-weight: normal;',
      'color: teal',
      'color: black',
      'color: gray; font-weight: normal;'
    );
  }

  /**
   * Closes the group.
   *
   * @param aPath
   *   Path to API call
   */
  static endApiGroup(aPath: string) {
    console.groupEnd();
  }

  /**
   * Send the IO result to the console and closes the group.
   *
   * @param aResponse
   * @param aMethod
   *   Method used
   * @param aPath
   *   Path to API call
   * @param [aBody=null]
   *   Body data
   */
  static logApiResult(aResponse: Response, aMethod: UFFetchMethod, aPath: string, aBody: string | object | null = null) {
    UFNetwork.startApiGroup('API result', aMethod, aPath);
    console.log('status', aResponse.status, aResponse.statusText);
    if (aBody) {
      console.log('body', aBody);
    }
    UFNetwork.endApiGroup(aPath);
  }

  /**
   * Sends an IO error to the console and closes the group.
   *
   * @param anError
   *   Exception error
   * @param aMethod
   *   Method used
   * @param aPath
   *   Path to API call
   */
  static logApiError(anError: Error, aMethod: UFFetchMethod, aPath: string) {
    UFNetwork.startApiGroup('API server error', aMethod, aPath);
    console.log('error', anError.message);
    UFNetwork.endApiGroup(aPath);
  }

  /**
   * Build the options for {@link fetch}.
   *
   * @param aMethod
   *   Method to use
   * @param anUrl
   *   Url to call
   * @param aBodyData
   *   Optional body data, when set it will be converted to JSON and the content type is updated.
   * @param anUpdateHeaders
   *   Optional callback to add additional headers.
   *
   * @returns options for use with {@link fetch}
   */
  static buildFetchOptions(
    aMethod: UFFetchMethod, anUrl: string, aBodyData?: object | null, anUpdateHeaders?: (headers: Headers) => any
  ): RequestInit {
    UFNetwork.startApiGroup('API', aMethod, anUrl);
    const headers = new Headers();
    const options: RequestInit = {
      method: aMethod
    };
    if (aBodyData) {
      headers.append("Content-Type", 'application/json');
      options.body = JSON.stringify(aBodyData);
      console.log('body', aBodyData);
    }
    if (anUpdateHeaders) {
      anUpdateHeaders(headers);
    }
    options.headers = headers;
    UFNetwork.endApiGroup(anUrl);
    return options;
  }

}