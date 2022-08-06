import {IUFWeightedProgress} from "../actions/IUFWeightedProgress";
import {UFObject} from "./UFObject";

export class UFProgressTools {
  /**
   * Checks if the object has a {@link IUFWeightedProgress.progressWeight} property and return the value; else return
   * a default value.
   *
   * @param anObject
   * @param aDefault
   */
  public static getProgressWeight(anObject: object, aDefault: number = 1.0): number {
    return UFObject.getAs(anObject, 'progressWeight', aDefault);
  }

  /**
   * Checks if the object has a {@link IUFProgress.progress} property and return the value; else return
   * a default value.
   *
   * @param anObject
   * @param aDefault
   */
  public static getProgress(anObject: object, aDefault: number = 0.0): number {
    return UFObject.getAs(anObject, 'progress', aDefault);
  }

}
