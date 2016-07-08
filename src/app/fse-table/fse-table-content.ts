import {Column, SortOrder} from "./shared/column";
/*
* Model for the contents of the FSE table.
* Rows contain the list of T's to display, and cols specifies the displayed
* property.
*/
export class FSETableContent<T>{
  private _cols: { [dispName: string]: Column<T> };
  private _rows: T[];

  constructor(
    // Maps a display name of a column to a property within T.
    propertyMap: { [dispName: string]: {
        setter: (v: string, o: T) => void,
        getter: (o: T) => string } },
    // List of T's being displayed.
    rows: T[]
  ){
    this.initColumns(propertyMap);
    if (Object.keys(this._cols).length === 0){
      throw new Error(
        "Can not create FSETable content with no displayed properties.");
    }
    this._rows = rows;
  }

  /*
  * For each column that is shown, do the specified func.
  */
  private forShownColumns(func: (col: Column<T>) => void){
    for (let dispName in this._cols){
      let col = this._cols[dispName]
      if (col.show) func(col);
    }
  }

  // Initialize the column hashmap according to the specified mapping.
  private initColumns(
    map: { [dispName: string]: {
        setter: (v: string, o: T) => void,
        getter: (o: T) => string } })
  {
    this._cols = {};
    for (let dispName in map){
      this._cols[dispName] =
        new Column<T>(dispName, map[dispName].setter, map[dispName].getter);
    }
  }

  /*
  * Return list of displayed columns
  */
  get columns(): Column<T>[] {
    let ret: Column<T>[] = [];
    this.forShownColumns(col => ret.push(col));
    return ret;
  }

  get width(): number {
    let ret = 0;
    this.forShownColumns(() => ret += 1);
    return ret;
  }

  get rows(): T[]{
    return this._rows;
  }

  get height(){
    return this._rows.length;
  }

  /*
  * Sort according to the given column, in the specified direction.
  */
  sort(c: string, order: SortOrder){
    let col: Column<T> = this._cols[c];
    switch (order) {
      case SortOrder.ASC:
        this._rows.sort((a, b) => sort(
          col.getter(a).toLowerCase(), col.getter(b).toLowerCase()));
        break;
      case SortOrder.DEC:
        this._rows.sort((a, b) => -1*sort(
          col.getter(a).toLowerCase(), col.getter(b).toLowerCase()));
        break;
    }
  }
}

function sort(a: string, b: string){
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
