/**
 * A simple interface to allow access to an objects properties by name when the properties are not known.
 */
interface IUFDynamicObject {
  [key: string]: any
}

export {IUFDynamicObject};