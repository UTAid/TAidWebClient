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
    public validator: (obj: T) => [boolean, string],
    public show = true
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
