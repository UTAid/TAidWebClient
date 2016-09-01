import { ValidatorResult } from './validator-result';

/**
* Represents a column within the table, for each specified property within T.
* Note that two columns are equal if their display names are equal.
*/
export class Column<T> {

  public static getCopy<T>(col: Column<T>) {
    return new Column(col.dispName, col.setter, col.getter, col.validator,
      col.show, col.disabled);
  }

  constructor (
    // The displayed name of this column
    public dispName: string,
    // Getter and setter functions for properties under this column
    public setter: (val: string, obj: T) => void,
    public getter: (obj: T) => string,
    // Validator for values within this column.
    public validator: (obj: T) => ValidatorResult,
    // Show this column by default if true. Hide otherwise.
    public show = true,
    // Column is not read only by defeault if true. Read only otherwise.
    public disabled = false
  ) { }
}

/**
* Enumeration of possible sort orders.
*/
export enum SortOrder {
  ASC,
  DEC,
  NONE
}
