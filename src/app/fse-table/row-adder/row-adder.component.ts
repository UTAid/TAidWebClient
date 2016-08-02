import {
  Component, OnInit, ViewChild,
  Input, Output, EventEmitter
} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {MODAL_DIRECTIVES, BS_VIEW_PROVIDERS} from 'ng2-bootstrap';
import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';

import {TableComponent} from '../table';
import {Column} from '../shared/column';

@Component({
  moduleId: module.id,
  selector: 'row-adder',
  directives: [MODAL_DIRECTIVES, TableComponent],
  viewProviders: [BS_VIEW_PROVIDERS],
  templateUrl: 'row-adder.component.html',
  styleUrls: ['row-adder.component.css']
})
export class RowAdderComponent<T> implements OnInit {

  @Input() factory: () => T;
  @Input() columns: Column<T>[];
  @Input() show: Subject<any>

  @Output() addRows: EventEmitter<T[]> = new EventEmitter();

  @ViewChild('adderModal') adderModal: ModalDirective;

  private rows: T[];
  private selRow: number;

  constructor() {}

  ngOnInit() {
    this.clearRows();
    this.show.subscribe(() => this.showAdder());
  }

  private hideAdder(){
    this.adderModal.hide();
  }

  private showAdder(){
    this.adderModal.show();
  }

  private selectRow(index: [number, number]){
    this.selRow = index[0];
  }

  private clearRows() {
    this.rows = new Array(1);
    this.rows[0] = this.factory();
  }

  private newRow(){
    this.rows.push(this.factory());
  }

  private removeRow(){
    this.rows.splice(this.selRow, 1);
  }

  private addAll(){
    let isValid = true;
    for (let r of this.rows){
      for (let c of this.columns){
        if (c.validator == null) continue;
        let result = c.validator(r);
        if (!result[0]) {
          console.log(result[1]);
          isValid = false;
        }
      }
    }
    if (isValid){
      this.addRows.emit(this.rows);
      this.hideAdder();
      this.clearRows();
    }
  }

  private cancel(){
    this.hideAdder();
    this.clearRows();
  }

}