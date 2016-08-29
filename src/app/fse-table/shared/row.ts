import { Cell } from './cell';
import { Column } from './column';

/**
* A row within the FSETable.
* Stores a list of cells, and whether or not it should be shown.
*/
export class Row<T> {

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
