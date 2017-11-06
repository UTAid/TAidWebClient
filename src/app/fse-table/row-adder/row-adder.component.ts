import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Table } from '../shared/table';
import { Column } from '../shared/column';
import { Cell } from '../shared/cell';

@Component({
  selector: 'row-adder',
  templateUrl: './row-adder.component.html',
  styleUrls: ['./row-adder.component.scss']
})
export class RowAdderComponent<T> implements OnInit {

  @Input() table: Table<T>;
  @Input() factory: () => T; // Factory function to init a new row.

  private created_row : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public addRow(){
    if (this.created_row == true){return ;}

    this.created_row = true;

    for (let col of this.table.cols){
      col.show = true;
      col.disabled = false;
    }

    this.table.addRowTop(this.factory());
  }

}
