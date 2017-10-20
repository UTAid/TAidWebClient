import { Column, SortOrder } from './column';
import { Cell } from './cell';

export class CellEvent<T> {
  private _cell: Cell<T>;
  private _rowi: number;
  private _coli: number;

  constructor(cell: Cell<T>, rowi: number, coli: number) {
    this._cell = cell;
    this._rowi = rowi;
    this._coli = coli;
  }

  get cell() { return this._cell; }
  get rowi() { return this._rowi; }
  get coli() { return this._coli; }
}

export class CellEditEvent<T> extends CellEvent<T> {

  private _newValue: string;

  constructor(cell: Cell<T>, rowi: number, coli: number, newValue: string) {
    super(cell, rowi, coli);
    this._newValue = newValue;
  }

  get newValue() { return this._newValue; }
}

export class SortEvent<T> {

  private _col: Column<T>;
  private _coli: number;
  private _sortOrder: SortOrder;

  constructor(col: Column<T>, coli: number, sortOrder: SortOrder) {
    this._col = col;
    this._coli = coli;
    this._sortOrder = sortOrder;
  }

  get col() { return this._col; }
  get coli() { return this._coli; }
  get sortOrder() { return this._sortOrder; }
}
