/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, addProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject,
  TestComponentBuilder, ComponentFixture
} from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';

describe('Component: SearchBar', () => {
  it('should create an instance', () => {
    let component = new SearchBarComponent();
    expect(component).toBeTruthy();
  });
});

describe('Component: FSETable', () => {

  let fixture: ComponentFixture<SearchBarComponent>;
  let comp: SearchBarComponent;
  let elem: any;

  // Setup the fixture, and provide shortcuts to the component and
  // native element.
  beforeEach((done) => {
    addProviders([TestComponentBuilder]);
    inject([TestComponentBuilder], (t) => {
      t.createAsync(SearchBarComponent).then(f => {
        fixture = f;
        comp = fixture.debugElement.componentInstance;
        elem = fixture.debugElement.nativeElement;
        done(); // Signal jasmine that beforeEach is complete.
      }).catch((e) => done.fail(e));
    })(); // Call the function that inject returns.
  });

  it('should have a search input', () => {
    expect(elem.querySelector('#fset-input-search')).not.toBeNull();
  });

  it('should have a search button', () => {
    expect(elem.querySelector('#fset-btn-search')).not.toBeNull();
  });

  it('should have a clear search button', () => {
    expect(elem.querySelector('#fset-btn-clear')).not.toBeNull();
  });

});
