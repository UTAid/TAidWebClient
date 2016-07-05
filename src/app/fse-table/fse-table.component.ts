import {Component, Input, OnInit, Directive, ElementRef, EventEmitter}
  from "@angular/core";

import {FSETableContent, Column, SortOrder} from './fse-table-content';
import {FSECell} from './fse-cell.component';

/*
* Filterable, Sortable, Editable table component.
*/
@Component({
  moduleId: module.id,
  directives: [FSECell],
  selector: 'fse-table',
  templateUrl: 'fse-table.component.html',
})

export class FSETableComponent<T> implements OnInit{

  @Input() content: FSETableContent<T>;

  private sortColumn: Column;
  private sortOrder: SortOrder;

  ngOnInit(){
    this.sortColumn = new Column('', '');
    this.sortOrder = SortOrder.NONE;
  }

  private isSortedAsc(): boolean {
    return this.sortOrder === SortOrder.ASC;
  }

  private sortOn(col: Column){
    if (this.sortColumn.propName === col.propName){
      switch (this.sortOrder){
        case SortOrder.ASC: this.sortOrder = SortOrder.DEC; break;
        case SortOrder.DEC: this.sortOrder = SortOrder.ASC; break;
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
