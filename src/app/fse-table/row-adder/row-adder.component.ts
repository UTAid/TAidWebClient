import { Component, OnInit, AfterContentChecked, Input, Output, EventEmitter } from '@angular/core';

import { Table, Row } from '../shared/table';
import { Column } from '../shared/column';
import { Cell } from '../shared/cell';
import { SortEvent, CellEditEvent, CellEvent } from '../shared/events';

import { TableComponent } from '../table';

@Component({
  selector: 'row-adder',
  templateUrl: './row-adder.component.html',
  styleUrls: ['./row-adder.component.scss']
})
export class RowAdderComponent<T> implements OnInit, AfterContentChecked {

  @Input() table: Table<T>;
  @Input() factory: () => T; // Factory function to init a new row.
  @Input() currRow: number;

  @Output() row_adder_active = new EventEmitter<boolean>();
  @Output() addCreatedRow: EventEmitter<Row<T>> = new EventEmitter();

  private created_row: boolean = false;
  private first_cell: Cell<T>;
  private original_col_info:boolean[][] = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentChecked(){
    if (this.created_row == true){
      if (this.table.get_sel_row_index() != 0){
        this.created_row = false;
        this.validate_row();
        this.table.deleteRow(0);
        this.restoreColumnInfo();
        this.row_adder_active.emit(this.isRowCreated());
      }
    }
  }

  public addRow():void{
    this.created_row = true;
    this.row_adder_active.emit(this.isRowCreated());

    this.storeColumnInfo();

    this.table.addRowTop(this.factory());
    this.table.set_sel_row_index(0);
    this.table.set_sel_col_index(0);
  }

  public isRowCreated():boolean{ return this.created_row; }

  private storeColumnInfo():void{
    for (let col of this.table.cols){
      this.original_col_info.push([col.show, col.disabled]);
      col.show = true;
      col.disabled = false;
    }
    console.log(this.original_col_info);
  }

  private restoreColumnInfo():void{
    let col_num:number = 0;
    for (let col of this.table.cols){
      col.show = this.original_col_info[col_num][0];
      col.disabled = this.original_col_info[col_num][1];
      col_num++;
    }
  }

  private validate_row():void{
    let isAllValid = true;

    let row = this.table.cells(0);
    for (let cell of row){
      if (!cell.validate().isValid) {
        isAllValid = false;
      }
    }

    if (isAllValid){
      this.addCreatedRow.emit(this.table.row(0));
      console.log("Row has been added");
    }
    else{
      console.log("Row has not been added. There were errors");
    }
  }


}
