import {Column, SortOrder} from './shared/column';

/*
* Template for a property map used to display models within the FSETable.
*
* dispName: The name of a column as displayed to the user; the column's unique
*   identifier.
* setter: Function used to set the property that this column is displaying.
* getter: Function used to get the property that this column is displaying.
*/
export interface FSETPropertyMap<T> {
  [dispName: string]: {
    setter: (v: string, o: T) => void,
    getter: (o: T) => string
  };
}

// Used by array of filtered rows to keep track of original indicies.
class BackRef<T> {
  constructor(public content: T, public index: number) { }
}

/*
* Model for the contents of the FSE table.
* Rows contain the list of T's to display, and cols specifies the displayed
* property.
*/
export class FSETContent<T>{
  private _cols: { [dispName: string]: Column<T> };
  private _rows: BackRef<T>[];
  private filtered_rows: BackRef<T>[];

  constructor(
    // Maps a display name of a column to a property within T.
    propertyMap: FSETPropertyMap<T>,
    // List of T's being displayed.
    rows: T[]
  ){
    this.initColumns(propertyMap);
    if (Object.keys(this._cols).length === 0){
      throw new Error(
        "Can not create FSETable content with no displayed properties.");
    }
    this._rows = new Array<BackRef<T>>(rows.length);
    rows.forEach((r, i) => this._rows[i] = new BackRef(r, i));
    this.filtered_rows = this._rows.slice(0);
  }

  public push(row: T){
    this._rows.push(new BackRef(row, this._rows.length));
    this.filtered_rows.push(this._rows[this._rows.length-1]);
  }

  public remove(index: number){
    let backRef = this.filtered_rows.splice(index, 1)[0].index;
    this._rows.splice(backRef, 1);
  }

  public applyFilter(filter: (o: T) => boolean){
    this.filtered_rows = this._rows.filter((r) => filter(r.content));
  }

  public removeFilter(){
    this.filtered_rows = this._rows.slice(0);
  }

  public applyFilterAll(val: string){
    this.filtered_rows = this._rows.filter((r) => {
      for (let col of this.columns)
        if (col.getter(r.content).toLowerCase().indexOf(val.toLowerCase()) >= 0)
          return true;
      return false;
    });
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
  private initColumns(pMap: FSETPropertyMap<T>)
  {
    this._cols = {};
    for (let dispName in pMap){
      this._cols[dispName] =
        new Column<T>(dispName, pMap[dispName].setter, pMap[dispName].getter);
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
    return this.filtered_rows.map((r) => r.content);
  }

  get height(){
    return this.filtered_rows.length;
  }

  /*
  * Sort according to the given column, in the specified direction.
  */
  sort(c: string, order: SortOrder){
    let col: Column<T> = this._cols[c];
    switch (order) {
      case SortOrder.ASC:
        this.filtered_rows.sort((a, b) => sort(
          col.getter(a.content).toLowerCase(),
          col.getter(b.content).toLowerCase()));
        break;
      case SortOrder.DEC:
        this.filtered_rows.sort((a, b) => -1*sort(
          col.getter(a.content).toLowerCase(),
          col.getter(b.content).toLowerCase()));
        break;
    }
  }
}

function sort(a: string, b: string){
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
