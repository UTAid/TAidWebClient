import {Component, Directive, Input, Output, ElementRef, EventEmitter, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {Column} from '../shared/column';
import {KeyMap, getKeyMap} from '../shared/keymap';

/*
* Directive for an editable input field within a fse-cell.
* Binds to enter: confirm edit, and escape: cancel edit. Clicking anywhere
* outside the input box (blur event) will also confirm the edit.
*/
@Directive({
  selector: `[fse-table-input]`,
  host: {
    "(keydown)": "processKeydown($event)",
    "(click)": "$event.stopPropagation()",
    "(dblclick)": "$event.stopPropagation()"
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
  templateUrl: './fse-cell.component.html',
  styleUrls: ['./fse-cell.component.css']
})
export class FSECellComponent<T> implements OnInit{
  // Contents of this cell.
  @Input() value: string;
  // row and column index within table.
  @Input() row: number;
  @Input() col: number;
  // To observe for external requests to enable editing.
  @Input() editRequestSubject: Subject<[number, number]>;
  // Emitted when value changes are confirmed.
  @Output() valueChange = new EventEmitter<string>();
  // Emitted when exiting editing mode.
  @Output() editExit = new EventEmitter<[number, number]>();
  // Emitted when entering editing mode
  @Output() editEnter = new EventEmitter<[number, number]>();

  private edit = false; // Whether editing mode is enabled.

  constructor (private cd: ChangeDetectorRef) {};

  ngOnInit(){
    this.editRequestSubject.subscribe(event => {
      if (event[0] === this.row && event[1] === this.col){
        this.requestEdit();
        this.cd.markForCheck();
      }
    })
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
