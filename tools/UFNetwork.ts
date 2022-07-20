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
   * @param aReceivedBody
   *   Body data received
   */
  static logApiResult(
    aResponse: Response,
    aMethod: UFFetchMethod,
    aPath: string,
    aReceivedBody: string | object | null = null
  ) {
    UFNetwork.startApiGroup('API result', aMethod, aPath);
    console.log('status', aResponse.status, aResponse.statusText);
    if (aReceivedBody) {
      console.log('received', aReceivedBody);
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
   *   Optional body data; if it is a {@link FormData} instance it just get set, else the data is sent as JSON.
   * @param anUpdateHeaders
   *   Optional callback to add additional headers.
   *
   * @returns options for use with {@link fetch}
   */
  static buildFetchOptions(
    aMethod: UFFetchMethod, anUrl: string, aBodyData?: object | FormData | null,
    anUpdateHeaders?: (headers: Headers) => any
  ): RequestInit {
    UFNetwork.startApiGroup('API', aMethod, anUrl);
    const headers = new Headers();
    const options: RequestInit = {
      method: aMethod
    };
    if (aBodyData) {
      if (aBodyData instanceof FormData) {
        options.body = aBodyData;
      }
      else {
        headers.append("Content-Type", 'application/json');
        headers.append("Accept", 'application/json');
        options.body = JSON.stringify(aBodyData);
      }
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