import {
  Component, Input, OnInit, Inject
} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import { ColumnSelectorComponent } from './column-selector';
import { SearchBarComponent } from './search-bar';
import { TableComponent } from './table';
import { RowAdderComponent } from './row-adder';
import { Column, SortOrder } from './shared/column';
import { IFSETConfig, FSETConfig } from './shared/fset-config';
import { IFSETService, FSETService } from './shared/fset.service';

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

export class FSETComponent<T> implements OnInit{

  private factory: () => T;

  private _cols: Array<Column<T>>;
  private _rows: Array<T>;
  private filteredRows: Array<T>;

  private searchFocusSubject: Subject<any> = new Subject();
  private showRowAdderSubject: Subject<any> = new Subject();

  private selRow: number;

  constructor(
    @Inject(FSETConfig) public config: IFSETConfig<T>,
    @Inject(FSETService) private service: IFSETService<T>) {}

  ngOnInit(){
    this.factory = this.config.factory;
    this._cols = new Array();
    this._rows = new Array();
    this.filteredRows = new Array();

    for (let m of this.config.propertyMap){
      this._cols.push(
        new Column(
          m.display, m.setter, m.getter,
          m.validator, !Boolean(m.hide)));
    }

    this.service.readAll().subscribe(
      (rows) => {this._rows = rows; this.filteredRows = rows.slice()},
      (err) => console.error("Error initializing rows: " + err),
      () => console.log("readall completed")
    );
  }

  get shownRows() {
    return this.filteredRows;
  }

  get shownCols() {
    return this._cols.filter((c) => c.show);
  }

  get height() {
    return this.filteredRows.length;
  }

  get width() {
    return this._cols.filter((c) => c.show);
  }

  private indexOfRow(row: T){
    let rowKey = this.service.key(row);
    return this._rows.findIndex((c) => this.service.key(c) === rowKey);
  }

  private selectRow(index: [number, number]){
    this.selRow = index[0];
  }

  private showRowAdder(){
    this.showRowAdderSubject.next(undefined);
  }

  private focusSearch(){
    this.searchFocusSubject.next(undefined);
  }

  private applySearch(term: string){
    if (term) {
      this.filteredRows = this._rows.filter((r) => {
        for (let col of this._cols)
          if (nullToEmpty(col.getter(r)).toLowerCase()
              .indexOf(term.toLowerCase()) >= 0)
            return true;
        return false;
      });
    } else {
      this.removeSearch();
    }
  }

  private removeSearch(){
    this.filteredRows = this._rows.slice(0);
  }

  private sortContent(s: [Column<T>, SortOrder]){
    let col = s[0];
    switch (s[1]) {
      case SortOrder.ASC:
        this.filteredRows.sort((a, b) => sort(
          nullToEmpty(col.getter((a))).toLowerCase(),
          nullToEmpty(col.getter((b))).toLowerCase()));
        break;
      case SortOrder.DEC:
        this.filteredRows.sort((a, b) => -1*sort(
          nullToEmpty(col.getter((a))).toLowerCase(),
          nullToEmpty(col.getter((b))).toLowerCase()));
        break;
    }
  }

  private addRows(rows: T[]) {
    for (let r of rows)
    this.service.create(r).subscribe(() => {
      this._rows.push(r);
      this.filteredRows.push(this._rows[this._rows.length-1]);
    }, (err) => console.log("error creating row " + err));
  }

  /*
  * Edit the row's properties.
  * editInfo: [rowIndex, newValue, rowProperty]
  */
  private editRow(editInfo: [number, string, Column<T>]){
    let row = this.filteredRows[editInfo[0]];
    this.service.update(row).subscribe(() => {
      // rows in filteredRows reference ones in _rows.
      editInfo[2].setter(editInfo[1], row);
    }, (err) => console.log("error editing row " + err),
    () => console.log('edit completed'));
  }

  private removeRow() {
    this.service.delete(this.filteredRows[this.selRow])
      .subscribe(() => {
        let row = this.filteredRows.splice(this.selRow, 1)[0];
        console.log(this._rows.splice(this.indexOfRow(row), 1));
      }, (err) => console.log("error deleting row " + err));
  }
}

function sort(a: string, b: string){
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

function nullToEmpty(str: string){
  if (str == null) return '';
  return str;
}
