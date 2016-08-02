import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter
} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {FSETContent} from '../fset-content';
import {FSECComponent} from '../fse-cell';
import {Column, SortOrder} from '../shared/column'
import {KeyMap, getKeyMap} from '../shared/keymap'

/*
* Filterable, Sortable, Editable table component.
* Must be initialized with a FSETContent object, which provides the Data
* to display within this table.
*/
@Component({
  moduleId: module.id,
  directives: [FSECComponent],
  selector: 'fse-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.css'],
})

export class TableComponent<T> implements OnInit{

  @Input() rows: T[];
  @Input() cols: Column<T>[];
  @ViewChild('navInput') navInput;

  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() sort: EventEmitter<[Column<T>, SortOrder]> = new EventEmitter();
  @Output() selection: EventEmitter<[number, number]> = new EventEmitter();

  // Observer that cells listen to for edit-mode requests.
  private editRequestSubject: Subject<[number, number]> = new Subject();

  private sortCol: string;
  private sortOrder: SortOrder;
  // The selected cell index.
  private selRow: number;
  private selCol: number;

  ngOnInit(){
    this.sortCol = null;
    this.sortOrder = SortOrder.NONE;
    this.selRow = this.selCol = 0;
  }

  private isSortedAsc(): boolean {
    return this.sortOrder === SortOrder.ASC;
  }

  private sortOn(col: Column<T>){
    if (this.sortCol === col.dispName){
      switch (this.sortOrder){
        case SortOrder.ASC: this.sortOrder = SortOrder.DEC; break;
        case SortOrder.DEC: this.sortOrder = SortOrder.ASC; break;
        default: this.sortOrder = SortOrder.ASC; break;
      }
    }
    else {
      this.sortCol = col.dispName;
      this.sortOrder = SortOrder.ASC;
    }
    this.sort.emit([col, this.sortOrder]);
  }

  // Reset sort column, and sort direction.
  private resetSort(){
    this.sortCol = null;
    this.sortOrder = SortOrder.NONE;
  }

  private selectCell(row: number, col: number){
    this.selRow = row;
    this.selCol = col;
    this.selection.emit([row, col]);
  }

  private isCellSelected(row: number, col: number){
    return this.selRow === row && this.selCol === col;
  }

  // Trigger edit-mode on currently selected cell.
  private triggerEdit(){
    this.editRequestSubject.next([this.selRow, this.selCol]);
  }

  get height() {
    return this.rows.length;
  }

  get width() {
    return this.cols.length;
  }

  /////////////////////////////////////////////////////////////////////////////
  // The below are methods to navigate the selected cell.
  /////////////////////////////////////////////////////////////////////////////

  // Navigation handler for changing the selected cell.
  private navInputHandler(event:KeyboardEvent){
    event.preventDefault();
    event.stopPropagation();
    let nav = getKeyMap(event);

    if (nav.up) this.navUp();
    else if (nav.down) this.navDown();
    else if (nav.left) this.navLeft();
    else if (nav.right) this.navRight();
    else if (nav.enter) this.triggerEdit();
    else if (nav.tab){
      if (nav.shift) this.navLeftLoopover();
      else this.navRightLoopover();
    }
    else if (nav.ctrl && event.key === 'f')
      this.search.emit(null);
  }

  private navInputFocus(){
    this.navInput.nativeElement.focus();
  }

  private navUp(){
    return ifCondDoFunc(this.selRow > 0,
      () => this.selRow -= 1);
  }

  private navDown(){
    return ifCondDoFunc(
      this.selRow < this.height-1,
      () => this.selRow += 1);
  }

  private navLeft(){
    return ifCondDoFunc(this.selCol > 0,
      () => this.selCol -= 1);
  }

  private navLeftLoopover(){
    if (!this.navLeft()){
      this.selCol = this.width - 1;
      if (!this.navUp())
        this.selRow = this.height - 1;
    }
  }

  private navRight(){
    return ifCondDoFunc(this.selCol < this.width-1,
      () => this.selCol += 1);
  }

  private navRightLoopover(){
    if (!this.navRight()){
      this.selCol = 0;
      if (!this.navDown())
        this.selRow = 0;
    }
  }

}

// Helper function to keep nav functions cleaner.
function ifCondDoFunc(cond: boolean, func: Function){
  if (cond) {
    func()
    return true;
  }
  return false
}