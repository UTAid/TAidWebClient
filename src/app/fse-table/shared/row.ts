import { Cell } from './cell';

export class Row<T> {

  private _cells: Cell<T>[];

  constructor (public show: boolean, cells: Cell<T>[]) {
    this._cells = cells;
  }

  get cells() {
    return this._cells;
  }

}
