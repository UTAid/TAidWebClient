import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';

import { Table } from '../shared/table';
import { Column } from '../shared/column';
import { Cell } from '../shared/cell';
import { SortEvent, CellEditEvent, CellEvent } from '../shared/events';

import { TableComponent } from '../table';

@Component({
  selector: 'row-adder',
  templateUrl: './row-adder.component.html',
  styleUrls: ['./row-adder.component.scss']
})
export class RowAdderComponent<T> implements OnInit, AfterViewChecked {

  @Input() table: Table<T>;
  @Input() factory: () => T; // Factory function to init a new row.
  @Input() currRow: number;

  private created_row : boolean = false;
  private first_cell : Cell<T>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewChecked(){
    if (this.created_row){
      if (this.currRow == 0){
        // console.log("Hi");
      }
      else{
        // this.table.deleteRow(0);
      }
    }
  }

  public addRow(){
    if (this.created_row == true){return ;}

    this.created_row = true;

    for (let col of this.table.cols){
      col.show = true;
      col.disabled = false;
    }

    this.table.addRowTop(this.factory());

    this.first_cell = this.table.cells(0)[0];
  }

}
