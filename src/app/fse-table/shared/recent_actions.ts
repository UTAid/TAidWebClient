import { Cell } from '../shared/cell';
import { Row } from '../shared/table';

export class RecentActions {

  private actions: Array<Operations> = [];
  private number_of_actions:number = 10;

  constructor(){
  }

  add_action(action:Operations){
    if (this.is_full()){
      this.actions.pop();
    }
    this.actions.unshift(action);
  }

  remove_action(){
    if (!this.is_empty()){
      return this.actions.shift();
    }
    return null;
  }

  is_empty(){ return this.actions.length <= 0; }
  is_full(){ return this.actions.length >= 10; }

  print_action(){ console.log(this.actions); }

}

export abstract class Operations {
}

export abstract class RowOperations<T> extends Operations {
  row: Row<T>;

  constructor(row:Row<T>){
    super();
    this.row = row;
  }
}

export class EditCellOperation<T> extends Operations {

  cell: Cell<T>;
  cell_info:any;
  row_num: number;
  col_num: number;

  constructor(cell:Cell<T>, cell_info:any, row_num:number, col_num:number) {
    super();
    this.cell = cell;
    this.cell_info = cell_info;
    this.row_num = row_num;
    this.col_num = col_num;
  }
}

export class DeleteRowOperation<T> extends RowOperations<T> {
  // Row was deleted. Re-add it
}

export class AddRowOperation<T> extends RowOperations<T> {
  // Row was added. Delete it
}

export class EditRowOperation<T> extends RowOperations<T> {
  // Row was added. Delete it
}
