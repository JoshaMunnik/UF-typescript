/**
 * @version 1
 * @author Josha Munnik
 * @copyright Copyright (c) 2016 Ultra Force Development
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

/**
 * Support methods for canvas.
 */
export class UFCanvas {
  /**
   * Creates a canvas from an image, scaling it down if necessary.
   *
   * @param {CanvasImageSource} anImage
   * @param {number} aMaxWidth
   * @param {number} aMaxHeight
   * @param {number} anImageWidth
   * @param {number} anImageHeight
   *
   * @returns {HTMLCanvasElement}
   */
  static createFromImage(
    anImage: CanvasImageSource, aMaxWidth: number, aMaxHeight: number, anImageWidth?: number, anImageHeight?: number
  ): HTMLCanvasElement {
    const sourceWidth = anImageWidth || anImage.width as number;
    const sourceHeight = anImageHeight || anImage.height as number;
    const scale = Math.max(sourceWidth / aMaxWidth, sourceHeight / aMaxHeight);
    const targetWidth = scale < 0 ? aMaxWidth * scale : sourceWidth;
    const targetHeight = scale < 0 ? aMaxHeight * scale : sourceHeight;
    const result = document.createElement('canvas');
    result.width = targetWidth;
    result.height = targetHeight;
    result.getContext('2d')!.drawImage(anImage, 0, 0, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    return result;
  }

  /**
   * Gets the contents of a canvas as base64 encoded jpeg image.
   *
   * @param {HTMLCanvasElement} aCanvas
   * @param {number} aQuality A value between 0 (0%) and 1 (100%)
   *
   * @returns {string}
   */
  static getAsJpegBase64(aCanvas: HTMLCanvasElement, aQuality: number = 0.85): string {
    const result = aCanvas.toDataURL('image/jpeg', aQuality);
    return result.replace('data:image/jpeg;base64,', '');
  }

  /**
   * Gets the contents of a canvas as base64 encoded png image.
   *
   * @param {HTMLCanvasElement} aCanvas
   *
   * @returns {string}
   */
  static getAsPngBase64(aCanvas: HTMLCanvasElement): string {
    const result = aCanvas.toDataURL('image/png');
    return result.replace('data:image/png;base64,', '');
  }
}