import { Column, SortOrder } from './column';
import { Cell } from './cell';

export class CellEditEvent<T> {

  private _cell: Cell<T>;
  private _newValue: string;

  constructor(cell: Cell<T>, newValue: string) {
    this._cell = cell;
    this._newValue = newValue;
  }

  get cell() { return this._cell; }
  get newValue() { return this._newValue; }
}

export class SortEvent<T> {

  private _col: Column<T>;
  private _sortOrder: SortOrder;

  constructor(col: Column<T>, sortOrder: SortOrder) {
    this._col = col;
    this._sortOrder = sortOrder;
  }

  get col() { return this._col; }
  get sortOrder() { return this._sortOrder; }
}
