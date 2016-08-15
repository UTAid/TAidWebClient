import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { FsecComponent } from '../fse-cell';
import { Column, SortOrder } from '../shared/column';
import { getKeyMap } from '../shared/keymap';


@Component({
  moduleId: module.id,
  directives: [FsecComponent],
  selector: 'fse-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.css'],
})
/**
* Filterable, Sortable, Editable table component.
*
* ## Inputs
*
* `rows: T` - List of rows to display.
* `cols: Column<T>`` - List of columns.
*
* ## Outputs
*
* `search: none` - A search is requested.
* `sort: [column, sortOrder]` - Sort requested on specified column and order.
* `selection: [rowIndex, colIndex]` - A cell with given index is selected.
* `rowChange: [index, newValue, column]` - User has changed the value of row
*   at `index` to `newValue` at property `column`.
*/
export class TableComponent<T> implements OnInit {

  @Input() rows: T[];
  @Input() cols: Column<T>[];
  @ViewChild('navInput') navInput;

  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() sort: EventEmitter<[Column<T>, SortOrder]> = new EventEmitter();
  @Output() selection: EventEmitter<[number, number]> = new EventEmitter();
  @Output() rowChange: EventEmitter<[number, string, Column<T>]> = new EventEmitter();

  // Subject that cells listen to for edit-mode requests.
  private editRequestSubject: Subject<[number, number]> = new Subject();
  // Subject that cells listen to for selection changes.
  private selectionSubject: Subject<[number, number]> = new Subject();

  private sortCol: Column<T>;
  private sortOrder: SortOrder;
  // The selected cell index.
  private selRow: number;
  private selCol: number;

  ngOnInit() {
    this.sortCol = undefined;
    this.sortOrder = SortOrder.NONE;
    this.selRow = this.selCol = 0;
    if (this.rows == null) { this.rows = new Array<T>(); }
  }

  protected exitFocus() {
    this.selectionSubject.next([-1, -1]);
  }

  protected isSortedAsc(): boolean {
    return this.sortOrder === SortOrder.ASC;
  }

  protected sortOn(col: Column<T>) {
    if (this.sortCol === col) { // No new cols are created, so this should be ok.
      switch (this.sortOrder) {
        case SortOrder.ASC: this.sortOrder = SortOrder.DEC; break;
        case SortOrder.DEC: this.sortOrder = SortOrder.ASC; break;
        default: this.sortOrder = SortOrder.ASC; break;
      }
    } else {
      this.sortCol = col;
      this.sortOrder = SortOrder.ASC;
    }
    this.sort.emit([col, this.sortOrder]);
  }

  // Reset sort column, and sort direction.
  private resetSort() {
    this.sortCol = undefined;
    this.sortOrder = SortOrder.NONE;
  }

  protected selectCell(row: number, col: number) {
    this.selRow = row;
    this.selCol = col;
    this.selectionSubject.next([row, col]); // notify children
    this.selection.emit([row, col]); // notify parent
  }

  // Trigger edit-mode on currently selected cell.
  private triggerEdit() {
    this.editRequestSubject.next([this.selRow, this.selCol]);
  }

  protected rowValueChange(i: number, newVal: string, col: Column<T>) {
    this.rowChange.emit([i, newVal, col]);
    this.resetSort();
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
  protected navInputHandler(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    let nav = getKeyMap(event);

    if (nav.up) {
      this.navUp();
    } else if (nav.down) {
      this.navDown();
    } else if (nav.left) {
      this.navLeft();
    } else if (nav.right) {
      this.navRight();
    } else if (nav.enter) {
      this.triggerEdit();
    } else if (nav.tab) {
      if (nav.shift) {
        this.navLeftLoopover();
      } else {
        this.navRightLoopover();
      }
    } else if (nav.ctrl && event.key === 'f') {
      this.search.emit(undefined);
    }
  }

  protected navInputFocus() {
    this.navInput.nativeElement.focus();
    this.selectionSubject.next([this.selRow, this.selCol]);
  }

  private navUp() {
    if (this.selRow > 0) {
      this.selectCell(this.selRow - 1, this.selCol);
    }
  }

  private navDown() {
    if (this.selRow < this.height - 1) {
      this.selectCell(this.selRow + 1, this.selCol);
    }
  }

  private navLeft() {
    if (this.selCol > 0) {
      this.selectCell(this.selRow, this.selCol - 1);
    }
  }

  private navLeftLoopover() {
    let c = this.selCol - 1;
    let r = this.selRow;
    if (c < 0) {
      c = this.width - 1;
      r -= 1;
      if (r < 0) { r = this.height - 1; }
    }
    this.selectCell(r, c);
  }

  private navRight() {
    if (this.selCol < this.width - 1) {
      this.selectCell(this.selRow, this.selCol + 1);
    }
  }

  private navRightLoopover() {
    let c = this.selCol + 1;
    let r = this.selRow;
    if (c >= this.width) {
      c = 0;
      r += 1;
      if (r >= this.height) { r = 0; }
    }
    this.selectCell(r, c);
  }

}
