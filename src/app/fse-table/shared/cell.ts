import { Column } from './column';

/**
* A cell within the FSETable.
* Stores the model, and the column specifying the property of the model to
* display.
*/
export class Cell<T> {

  private _model: T;
  private _col: Column<T>;

  /**
  * `obj`: Model displayed within this cell.
  * `col`: Column specifying the property of `obj` to display.
  */
  constructor (obj: T, col: Column<T>) {
    this._model = obj;
    this._col = col;
  }

  get model() { return this._model; }
  get col() { return this._col; }
  get value() { return this._col.getter(this._model); }
  set value(o: string) { this._col.setter(o, this._model); }

}
