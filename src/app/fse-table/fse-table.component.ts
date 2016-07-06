import {Component, Input, OnInit, Directive, ElementRef, EventEmitter}
  from "@angular/core";

import {FSETableContent, SortOrder} from './fse-table-content';
import {FSECell} from './fse-cell.component';

/*
* Filterable, Sortable, Editable table component.
* Must be initialized with a FSETableContent object, which provides the Data
* to display within this table.
*/
@Component({
  moduleId: module.id,
  directives: [FSECell],
  selector: 'fse-table',
  templateUrl: 'fse-table.component.html',
})

export class FSETableComponent<T> implements OnInit{

  @Input() content: FSETableContent<T>;

  private sortColumn: string;
  private sortOrder: SortOrder;

  ngOnInit(){
    this.sortColumn = null;
    this.sortOrder = SortOrder.NONE;
  }

  get isSortedAsc(): boolean {
    return this.sortOrder === SortOrder.ASC;
  }

  private sortOn(col: string){
    if (this.sortColumn === col){
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

  private resetSort(){
    this.sortColumn = null
    this.sortOrder = SortOrder.NONE;
  }

}
