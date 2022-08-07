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

import {IUFQueueableAction} from "./IUFQueueableAction";
import {IUFWeightedProgress} from "./IUFWeightedProgress";
import {IUFCancellationToken} from "./IUFCancellationToken";

// endregion

// region exports

/**
 * A base class implementation of {@link IUFQueueableAction} that can be used to implement actions. It adds support
 * for {@link IUFWeightedProgress}.
 *
 * Subclasses must implement the {@link run} method.
 */
export abstract class UFQueueableAction implements IUFQueueableAction, IUFWeightedProgress {
  // region IUFWeightedProgress

  /**
   * @inheritDoc
   */
  get progress(): number {
    return 0;
  }

  /**
   * @inheritDoc
   */
  get progressWeight(): number {
    return 1.0;
  }

  // endregion

  // region IUFQueueableAction

  /**
   * @inheritDoc
   */
  abstract run(aToken: IUFCancellationToken): Promise<boolean>;

  // endregion
}

// endregion