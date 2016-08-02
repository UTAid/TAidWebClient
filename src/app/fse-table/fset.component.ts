import {Component, Input} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {FSETContent} from './fset-content';
import {ColumnSelectorComponent} from './column-selector';
import {SearchBarComponent} from "./search-bar";
import {TableComponent} from "./table";
import {RowAdderComponent} from "./row-adder";
import {Column, SortOrder} from "./shared/column";

/*
* Filterable, Sortable, Editable table component.
* Must be initialized with a FSETContent object, which provides the Data
* to display within this table.
*/
@Component({
  moduleId: module.id,
  directives: [ColumnSelectorComponent, SearchBarComponent,
    TableComponent, RowAdderComponent],
  selector: '[fse-table]',
  templateUrl: 'fset.component.html',
  styleUrls: ['fset.component.css'],
})

export class FSETComponent<T>{

  @Input() content: FSETContent<T>;

  private searchFocusSubject: Subject<any> = new Subject();
  private showRowAdderSubject: Subject<any> = new Subject();

  private selRow: number;

  private focusSearch(){
    this.searchFocusSubject.next(null);
  }

  private applySearch(term: string){
    if (term) this.content.applyFilterAll(term);
    else this.content.removeFilter();
  }

  private removeSearch(){
    this.content.removeFilter();
  }

  private selectRow(index: [number, number]){
    this.selRow = index[0];
  }

  private sortContent(s: [Column<T>, SortOrder]){
    this.content.sort(s[0].dispName, s[1]);
  }

  private showRowAdder(){
    this.showRowAdderSubject.next(null);
  }

  private addRows(rows: T[]) {
    for (let r of rows){
      this.content.push(r);
    }
  }

  private removeRow() {
    this.content.remove(this.selRow);
  }

}
