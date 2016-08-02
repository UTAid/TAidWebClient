/* tslint:disable:no-unused-variable */
import { By }           from '@angular/platform-browser';
import { DebugElement, ApplicationRef, provide } from '@angular/core';
import {
  beforeEach, addProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject, TestComponentBuilder,
  ComponentFixture
} from '@angular/core/testing';

import {MockApplicationRef} from '../shared/testing/mock-application-ref';

import {FSETComponent} from './fset.component';
import * as mock from './testing/mock-content';


describe('Component sanity test: FseTable', () => {
  it('should create an instance', () => {
    let component = new FSETComponent();
    expect(component).toBeTruthy();
  });
});


describe('Component: FSETable', () => {

  let fixture: ComponentFixture<FSETComponent<any>>;
  let comp: FSETComponent<any>;
  let elem: any;

  // Setup the fixture, and provide shortcuts to the component and
  // native element.
  beforeEach((done) => {
    addProviders([
      TestComponentBuilder,
      provide(ApplicationRef, {useClass: MockApplicationRef})
    ]);
    inject([TestComponentBuilder], (t) => {
      t.createAsync(FSETComponent).then(f => {
        fixture = f;
        comp = fixture.debugElement.componentInstance;
        elem = fixture.debugElement.nativeElement;
        comp.content = new mock.Content(mock.PROPERTY_MAP_SINGLE);
        fixture.detectChanges();
        done(); // Signal jasmine that beforeEach is complete.
      }).catch((e) => done.fail(e));
    })(); // Call the function that inject returns.
  });


  it('should have an add row button', () => {
    expect(elem.querySelector('#fset-btn-add')).not.toBeNull();
  });

  it('should have a remove row button', () => {
    expect(elem.querySelector('#fset-btn-remove')).not.toBeNull();
  });


});
