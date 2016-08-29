import { Column } from './column';
import { Row } from './row';


export class Table<T> {

  constructor(
    private _cols: Column<T>[],
    private _rows: Row<T>[]
  ) {}

  public getRow(index: number) {
    return this._rows[index]
  }

  public getCells(index: number) {
    return this.getRow(index).cells;
  }

  public getCell(rowi: number, coli: number) {
    return this.getCells(rowi)[coli];
  }

  get columns() {
    return this._cols;
  }

  get rows() {
    return this._rows;
  }
}
