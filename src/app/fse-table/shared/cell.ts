import { Column } from './column';
import { ValidatorResult } from './validator-result';

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

  /**
  * Validate the current cell using the given `newValue`. If not given,
  * `newValue` is set to current cell's value.
  *
  * Return: Tuple `[isValid: boolean, msg: string]`. `isValid` is true if cell
  *   contents are valid according to the column's validator. `msg` is the
  *   message returned by the column's validator to be displayed to user.
  */
  public validate(newVal: string = this.value) {
    let oldVal = this.value;
    this.value = newVal;

    let ret: ValidatorResult;
    if (this.col.validator) {
      ret = this._col.validator(this._model);
    } else {
      ret = new ValidatorResult(true, '');
    }

    this.value = oldVal;
    return ret;
  }

}
