import {Component, Input, OnInit} from "@angular/core";

import {FSETableContent, Column, SortOrder} from './fse-table-content';

@Component({
  moduleId: module.id,
  selector: 'fse-table',
  templateUrl: 'fse-table.component.html',
})

// Filterable, Sortable, Editable table.
export class FSETableComponent<T> implements OnInit{

  @Input() content: FSETableContent<T>;
  private sortColumn: Column;
  private sortOrder: SortOrder;

  ngOnInit(){
    this.sortColumn = new Column('', '');
    this.sortOrder = SortOrder.NONE;
  }

  sortOn(col: Column){
    if (this.sortColumn.propName === col.propName){
      switch (this.sortOrder){
        case SortOrder.ASC: this.sortOrder = SortOrder.DEC; break;
        case SortOrder.DEC: this.sortOrder = SortOrder.NONE; break;
        default: this.sortOrder = SortOrder.ASC; break;
      }
    }
    else {
      this.sortColumn = col;
      this.sortOrder = SortOrder.ASC;
    }
    this.content.sort(this.sortColumn, this.sortOrder);
  }

}
