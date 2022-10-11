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

import {UFQueueableAction} from "./UFQueueableAction";
import {IUFCancellationToken} from "./IUFCancellationToken";

// endregion

// region exports

/**
 * A simple action that waits a certain time before finishing.
 */
export class UFDelayAction extends UFQueueableAction {
  // region private variables

  /**
   * Delay to wait.
   *
   * @private
   */
  private readonly m_delay: number;

  /**
   * See {@link progress}
   *
   * @private
   */
  private m_progress: number = 0.0;

  // region public methods

  /**
   * Constructs an instance of {@link UFDelayAction}.
   *
   * @param aDelay
   *   Delay in milliseconds
   */
  constructor(aDelay: number) {
    super();
    this.m_delay = aDelay;
  }

  // endregion

  // region UFQueueableAction

  /**
   * @inheritDoc
   */
  run(aToken: IUFCancellationToken): Promise<boolean> {
    this.m_progress = 0.0;
    return new Promise(
      resolve => setTimeout(
        () => {
          this.m_progress = 1.0;
          resolve(true)
        },
        this.m_delay
      )
    );
  }

  // endregion

  // region IUFProgress

  /**
   * @inheritDoc
   */
  get progress(): number {
    return this.m_progress;
  }

  // endregion
}

// endregion