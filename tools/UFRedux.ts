// region imports

import {ThunkAction} from "redux-thunk";

// endregion

// region types

/**
 * Helper type to get the type signature of a thunk action function for use within Props. It combines
 * the original function parameters with the return type of the dispatch function.
 *
 * Based on comment of topic:
 * https://github.com/reduxjs/redux-thunk/issues/213
 */
export type UFThunkPropsType<T extends (...args: any[]) => ThunkAction<any, any, any, any>> =
  (...args: Parameters<T>) => ReturnType<ReturnType<T>>;

// endregion
