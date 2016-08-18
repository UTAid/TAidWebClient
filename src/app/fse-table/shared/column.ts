/**
* Represents a column within the table, for each specified property within T.
* Note that two columns are equal if their display names are equal.
*/
export class Column<T> {
  constructor (
    // The displayed name of this column
    public dispName: string,
    // Getter and setter functions for properties under this column
    public setter: (val: string, obj: T) => void,
    public getter: (obj: T) => string,
    // Validator for values within this column.
    public validator: (obj: T) => [boolean, string],
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
