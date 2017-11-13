import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RecentActions, Operations } from '../shared/recent_actions';

@Component({
  selector: 'undo-action',
  templateUrl: './undo-action.component.html',
  styleUrls: ['./undo-action.component.scss']
})
export class UndoActionComponent implements OnInit {

  @Input() actions: RecentActions;
  @Output() recentAction = new EventEmitter<Operations>();

  constructor() { }

  ngOnInit() {
  }

  undoAction() {
    this.recentAction.emit(this.actions.remove_action());
  }

  canUndoAction(){
    return this.actions.is_empty();
  }

}
