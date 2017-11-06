import { Column, SortOrder } from './column';
import { Cell } from './cell';
import { SortEvent } from './events';
import { nullToEmpty } from './utils';

class Row<T> {

  public cells: Cell<T>[];
  public show: boolean;
  private _underlyingModel: T;

  /**
  * - `model`: The model represented by this row.
  * - `columns`: List of columns specifying what each cell in this row should
  *   display.
  * - `show?`: If true, this row will be shown (default). Hidden otherwise.
  */
  constructor (model: T, columns: Column<T>[], show = true) {
    this.cells = [];
    this._underlyingModel = model;
    for (let col of columns) {
      this.cells.push(new Cell(this._underlyingModel, col));
    }
    this.show = show;
  }

  get underlyingModel() { return this._underlyingModel; }

}

export class Table<T> {

  public rows: Row<T>[];
  public cols: Column<T>[];

  /**
  * Create an empty table with the specified array of columns.
  */
  constructor(cols: Column<T>[]) {
    this.cols = cols;
    this.rows = [];
  }

  public addRowTop(m: T){
    this.rows.unshift(new Row(m, this.cols, true));
  }

  public pushRow(m: T) {
    this.rows.push(new Row(m, this.cols, true));
  }

  public updateRow(index: number, m: T) {
    this.rows[index] = new Row(m, this.cols, true);
  }

  public deleteRow(index: number) {
    this.rows.splice(index, 1);
  }

  /**
  * Delete all rows within this table.
  */
  public clearRows() {
    this.rows = new Array();
  }

  /** Get row at specified index. */
  public row(index: number) {
    return this.rows[index];
  }

  /** Get column at specified index. */
  public col(index: number) {
    return this.cols[index];
  }

  /** Get list of cells at the specified row index. */
  public cells(index: number) {
    return this.rows[index].cells;
  }

  /** Get the cell at the specified coordinates. */
  public cell(rowi: number, coli: number) {
    return this.rows[rowi].cells[coli];
  }

  /** The length of rows within this table. */
  get rowLen() {
    return this.rows.length;
  }

  /** The length of columns within this table. */
  get colLen() {
    return this.cols.length;
  }

  /** The number of visible rows within this table. */
  get height() {
    let h = 0;
    for (let r of this.rows) {
      if (r.show) { h += 1; }
    }
    return h;
  }

  /** The number of visible columns within this table. */
  get width() {
    let w = 0;
    for (let c of this.cols) {
      if (c.show) { w += 1; }
    }
    return w;
  }

  /** Apply a filter to the list of rows. Filtered rows are marked as hidden. */
  public filterRows(filter: (m: T) => boolean) {
    for (let r of this.rows){ r.show = filter(r.underlyingModel); }
  }

  /** Set all rows as visible */
  public removeFilter() {
    for (let r of this.rows) { r.show = true; }
  }

  public sort(s: SortEvent<T>) {
    switch (s.sortOrder) {
      case SortOrder.ASC:
        this.rows.sort((a, b) => sort(
          nullToEmpty(a.cells[s.coli].value).toLowerCase(),
          nullToEmpty(b.cells[s.coli].value).toLowerCase()));
        break;
      case SortOrder.DEC:
        this.rows.sort((a, b) => -1 * sort(
          nullToEmpty(a.cells[s.coli].value).toLowerCase(),
          nullToEmpty(b.cells[s.coli].value).toLowerCase()));
        break;
    }
  }
}


function sort(a: string, b: string) {
  if (a > b) { return 1; }
  if (a < b) { return -1; }
  return 0;
}
