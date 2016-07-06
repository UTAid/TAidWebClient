import {Component, Directive, Input, Output, ElementRef, EventEmitter}
  from '@angular/core';

import {Column} from './fse-table-content';

/*
* Directive to focus on a text box upon its creation.
*/
@Directive({
  selector: `[focus-on-edit]`
})

class FocusOnEditDirective {
  private _el: HTMLElement;

  constructor(private el: ElementRef) {
    this._el = el.nativeElement;
  }

  ngAfterViewInit() {
    this._el.focus();
  }
}


/*
* An editable cell within a FSETable.
*/
@Component({
  selector: '[fse-cell]',
  directives: [FocusOnEditDirective],
  template: `
    <input
      focus-on-edit
      *ngIf="edit"
      [(ngModel)]="value"
      (blur)="requestEditReset()">
    <p *ngIf="!edit" (dblclick)="requestEdit()">
      {{value}}
    </p>
  `
})

export class FSECell<T> {
  @Input() row: T
  @Input() col: Column<T>;

  // Emit edited event if this cell was edited.
  @Output() edited = new EventEmitter<FSECell<T>>();
  // Emit editing event when text-box is triggered.
  @Output() editing = new EventEmitter<FSECell<T>>();

  private edit = false;
  private previousValue: string;

  get value(){
    return this.col.getter(this.row);
  }

  set value(s: string){
    this.col.setter(s, this.row);
  }

  private requestEdit(){
    this.previousValue = this.value;
    this.edit = true;
    this.editing.emit(this);
  }

  private requestEditReset(){
    this.edit = false;
    // Only emit edited event when value changed.
    if (this.previousValue !== this.value) this.edited.emit(this);
  }
}
