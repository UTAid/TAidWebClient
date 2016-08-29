import {
  Component, OnInit, ViewChild,
  Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MODAL_DIRECTIVES, BS_VIEW_PROVIDERS } from 'ng2-bootstrap';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { TableComponent } from '../table';
import { Column } from '../shared/column';
import { Table } from '../shared/table';
import { DISABLE_OVERRIDE, SHOW_HIDDEN_COLS } from '../table';
import { CellEditEvent } from '../shared/events';

@Component({
  moduleId: module.id,
  selector: 'row-adder',
  // No deep changes should occur on any input.
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [MODAL_DIRECTIVES, TableComponent],
  viewProviders: [BS_VIEW_PROVIDERS],
  providers: [
    { provide: DISABLE_OVERRIDE, useValue: true },
    { provide: SHOW_HIDDEN_COLS, useValue: true }
  ],
  templateUrl: 'row-adder.component.html',
  styleUrls: ['row-adder.component.css']
})
/**
* Component that allows for bulk addition of rows to the FSET
*/
export class RowAdderComponent<T> implements OnInit {

  @Input() factory: () => T; // Factory function to init a new row.
  @Input() columns: Column<T>[];
  @Input() show: Subject<any>; // Parent component trigger to show the modal.

  // Emits the list of new rows.
  @Output() addRows: EventEmitter<Table<T>> = new EventEmitter();

  @ViewChild('adderModal') adderModal: ModalDirective;

  private table: Table<T>;
  private selRow: number;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.table = new Table(this.columns);
    this.table.pushRow(this.factory());
    this.show.subscribe(() => {
      this.showAdder();
    });
  }

  private hideAdder() {
    this.adderModal.hide();
  }

  private showAdder() {
    this.adderModal.show();
  }

  protected selectRow(index: [number, number]) {
    this.selRow = index[0];
  }

  private clearRows() {
    this.table.clearRows();
    this.table.pushRow(this.factory());
  }

  protected newRow() {
    this.table.pushRow(this.factory());
  }

  protected removeRow() {
    this.table.deleteRow(this.selRow);
  }

  protected rowValueChange(editInfo: CellEditEvent<T>) {
    let cell = this.table.cell(editInfo.rowi, editInfo.coli);
    cell.value = editInfo.newValue;
  }

  protected addAll() {
    this.addRows.emit(this.table);
    this.hideAdder();
    this.clearRows();
  }

  protected cancel() {
    this.hideAdder();
    this.clearRows();
  }

}
