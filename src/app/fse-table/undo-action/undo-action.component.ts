import { Component, OnInit } from '@angular/core';

import { RecentActions } from '../shared/recent_actions';

@Component({
  selector: 'undo-action',
  templateUrl: './undo-action.component.html',
  styleUrls: ['./undo-action.component.scss']
})
export class UndoActionComponent implements OnInit {

  actions = new RecentActions();

  constructor() { }

  ngOnInit() {
  }

  undoAction() {
    console.log("Hi");
  }

  canUndoAction(){
    this.actions.is_empty();
  }

}
