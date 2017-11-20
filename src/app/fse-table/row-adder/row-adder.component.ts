import { Component, OnInit, AfterContentChecked, Input, Output, EventEmitter } from '@angular/core';

import { Table, Row } from '../shared/table';
import { Column } from '../shared/column';
import { Cell } from '../shared/cell';
import { SortEvent, CellEditEvent, CellEvent } from '../shared/events';

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
  @Output() keyStatus = new EventEmitter<boolean>();

  private created_row: boolean = false;
  private original_col_info:boolean[][] = [];
  private oldKey:string = '';

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
      else if (this.table.get_sel_row_index() == 0){
        if (this.table.cell(0,0).validate().isValid && this.table.cell(0,0).value != this.oldKey){
          this.oldKey = this.table.cell(0,0).value;
          this.keyStatus.emit(true);
        }
        else{
          this.keyStatus.emit(false);
        }
      }
    }
  }

  public addRow():void{
    // scroll document to top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

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
    }
  }
}
