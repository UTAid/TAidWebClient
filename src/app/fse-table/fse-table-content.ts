/*
* Represents a column within the table
*/
export class Column {
  show: boolean = true; // Is this column displayed?
  constructor (
    public dispName: string, // The displayed name of this column
    public propName: string // The property of the obj that this col displays.
  ) { }
}

// Define the possible sort orders.
export enum SortOrder {
  ASC,
  DEC,
  NONE
}

/*
* Model for the contents of the FSE table
*/
export class FSETableContent<T>{
  private _cols: Column[];
  private _rows: T[];

  constructor(
    // Maps T's properties to a display name. Defines the columns.
    propertyMap: {[property: string]: string; },
    // Data to display within the table.
    rows: T[]
  ){
    this.initColumns(propertyMap);
    if (this._cols.length === 0){
      throw new Error(
        "Can not create FSETable content with no displayed properties.");
    }
    this._rows = rows;
  }

  /*
  * For each column that is shown, do the specified func.
  */
  private forShownColumns(func: (col: Column) => void){
    for (let pair in this._cols){
      let col = this._cols[pair]
      if (col.show) func(col);
    }
  }

  private initColumns(map: {[id: string]: string; }){
    this._cols = [];
    for (let pair in map)
      this._cols.push(new Column(map[pair], pair));
  }

  get columns(): Column[] {
    let ret: Column[] = [];
    this.forShownColumns(col => ret.push(col));
    return ret;
  }

  get rows(): T[]{
    return this._rows;
  }

  /*
  * Sort according to the given column, in the specified direction.
  */
  sort(col: Column, order: SortOrder){
    switch (order) {
      case SortOrder.ASC:
        this._rows.sort((a, b) => sort(a[col.propName], b[col.propName]));
        break;
      case SortOrder.DEC:
        this._rows.sort((a, b) => -1*sort(a[col.propName], b[col.propName]));
        break;
    }
  }
}

function sort(a: any, b: any){
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
