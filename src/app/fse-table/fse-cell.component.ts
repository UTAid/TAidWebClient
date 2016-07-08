import {Component, Directive, Input, Output, ElementRef, EventEmitter, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {Column} from './fse-table-content';
import {KeyMap, getKeyMap} from './keymap';

/*
* Directive for an editable input field within a fse-cell.
* Binds to enter: confirm edit, and escape: cancel edit. Clicking anywhere
* outside the input box (blur event) will also confirm the edit.
*/
@Directive({
  selector: `[fse-table-input]`,
  host: {
    "(keydown)": "processKeydown($event)",
  }
})
class FSETableInputDirective {
  private _el: HTMLElement;
  private prevValue: string;

  constructor(private el: ElementRef) {
    this._el = el.nativeElement;
  }

  private processKeydown(event: KeyboardEvent){
    event.stopPropagation();
    let map = getKeyMap(event);
    if (map.enter) this._el.blur();
    if (map.escape) {
      this._el.textContent = this.prevValue;
      this._el.blur();
    }
  }

  // When view is initialized, focus and select all contents.
  ngAfterViewInit() {
    this.prevValue = this._el.textContent;
    this._el.focus();
    // Select the contents.
    let range = document.createRange();
    range.selectNodeContents(this._el);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/*
* An editable cell within a FSETable.
*/
@Component({
  moduleId: module.id,
  selector: '[fse-cell]',
  changeDetection: ChangeDetectionStrategy.OnPush, // All inputs immutable.
  directives: [FSETableInputDirective],
  template: `
    <div fse-table-input contenteditable
      *ngIf="edit"
      [textContent]="value"
      (blur)="requestEditReset($event)"></div>
    <div *ngIf="!edit"
      [class.novalue]="!value"
      (click)="processClick()"
      (dblclick)="processDblClick()">
      {{value ? value : "None"}}
    </div>
  `,
  styleUrls: ['fse-cell.component.css']
})
export class FSECell<T> implements OnInit{
  // Contents of this cell.
  @Input() value: string;
  // row and column index within table.
  @Input() row: number;
  @Input() col: number;
  // To observe for external requests to enable editing.
  @Input() editRequestSubject: Subject<[number, number]>;
  // Emitted when value changes are confirmed.
  @Output() valueChange = new EventEmitter<string>();
  // Emitted when cell is selected.
  @Output() select = new EventEmitter<[number, number]>();
  // Emitted when exiting editing mode.
  @Output() editExit = new EventEmitter<[number, number]>();
  // Emitted when entering editing model
  @Output() editEnter = new EventEmitter<[number, number]>();

  private edit = false; // Whether editing mode is enabled.

  // Timer and toggle to prevent 2 click events from being triggered during
  // dblclick.
  private timer = 0;
  private preventClick = false;

  constructor (private cd: ChangeDetectorRef) {};

  ngOnInit(){
    this.editRequestSubject.subscribe(event => {
      if (event[0] === this.row && event[1] === this.col){
        this.requestEdit();
        this.cd.markForCheck();
      }
    })
  }

  private processClick(){
    // Do not process click if actively preventing, or editing.
    if (this.preventClick || this.edit) return;

    this.preventClick = true;
    let payload: [number, number] = [this.row, this.col];
    this.select.emit(payload);
    console.log('emit select: ' + payload);
    // Disable click event for 500ms after first click.
    this.timer = setTimeout(() => {
      this.preventClick = false;
    }, 500);
  }

  private processDblClick(){
    clearTimeout(this.timer);
    this.preventClick = false;
    this.requestEdit();
  }

  private requestEdit(){
    this.edit = true;
    this.editEnter.emit([this.row, this.col]);
    console.log('emit editEnter');
  }

  private requestEditReset(event: any){
    this.edit = false;
    if (event.target.textContent !== this.value){
      this.value = event.target.textContent;
      this.valueChange.emit(this.value);
      console.log('emit valueChange');
    }
    this.editExit.emit([this.row, this.col]);
    console.log('emit editExit');
  }
}
