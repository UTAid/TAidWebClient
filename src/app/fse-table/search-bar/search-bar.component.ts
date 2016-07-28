import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  moduleId: module.id,
  selector: 'search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input() focus: Subject<any>;
  @ViewChild('searchInput') searchInput;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() clear: EventEmitter<any> = new EventEmitter();

  private searchTerm = '';

  constructor() {}

  ngOnInit() {
    this.focus.subscribe(() => {
      this.searchInput.nativeElement.focus();
    });
  }

  private searchRequest(){
    this.search.emit(this.searchTerm);
  }

  private searchClear(){
    this.searchTerm = '';
    this.clear.emit(null);
  }

}
