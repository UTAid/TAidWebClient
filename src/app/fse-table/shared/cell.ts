import { Column } from './column';

export class Cell<T> {

  private _row: T;
  private _col: Column<T>;
  private _rowi: number;
  private _coli: number;

  constructor (row: T, col: Column<T>, rowi: number, coli: number) {
    this._row = row;
    this._col = col;
    this._rowi = rowi;
    this._coli = coli;
    console.log(':(');
  }

  get row() { return this._row; }
  get col() { return this._col; }
  get rowi() { return this._rowi; }
  get coli() {return this._coli; }

  get value() { return this._col.getter(this._row); }
  set value(o: string) { this._col.setter(o, this._row); }

}
