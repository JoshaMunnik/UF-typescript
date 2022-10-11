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

import {UFParallelQueueAction} from "./UFParallelQueueAction";
import {IUFQueueableAction} from "./IUFQueueableAction";

// endregion

// region exports

/**
 * {@link UFSerialQueueAction} can be used to run one or more {@link IUFQueueableAction} sequentially.
 *
 * The class is a subclass of {@link UFParallelQueueAction} using a concurrent count of 1 (so only one action
 * is ran at the time).
 */
export class UFSerialQueueAction extends UFParallelQueueAction {
  // region public methods

  /**
   * Constructs an instance of {@link UFSerialQueueAction}.
   *
   * @param anActions
   *   One or more actions to run.
   */
  constructor(...anActions: IUFQueueableAction[]) {
    super(1, ...anActions);
  }

  // endregion

  // region public properties

  /**
   * Gets the current running action or null if there is none.
   */
  get currentAction(): IUFQueueableAction|null {
    const list = this.getRunningActions();
    return list.length > 0 ? list[0] : null;
  }

  // endregion
}

// endregion
