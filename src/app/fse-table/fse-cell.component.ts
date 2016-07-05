import {Component, Directive, Input, Output, ElementRef, EventEmitter} from "@angular/core";

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


@Component({
  selector: '[fse-cell]',
  directives: [FocusOnEditDirective],
  template: `
    <input
      focus-on-edit
      *ngIf="edit"
      [(ngModel)]="row[property]"
      (blur)="requestEditReset()">
    <p *ngIf="!edit" (dblclick)="requestEdit()">
      {{row[property]}}
    </p>
  `
})

export class FSECell<T> {
  @Input() row: T
  @Input() property: string;
  @Output() editRequest = new EventEmitter<FSECell<T>>();

  private edit = false;

  private requestEdit(){
    this.edit = true;
  }

  private requestEditReset(){
    this.edit = false;
    this.editRequest.emit(this);
  }
}
