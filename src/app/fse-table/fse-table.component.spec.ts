/* tslint:disable:no-unused-variable */
import {FSETContent, FSETPropertyMap} from "./fse-table-content";

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject, TestComponentBuilder,
  ComponentFixture
} from '@angular/core/testing';

import { FSETComponent } from './fse-table.component';

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

  beforeEachProviders(() => [TestComponentBuilder]);

  // Setup the fixture, and provide shortcuts to the component and
  // native element.
  beforeEach((done) => {
    inject([TestComponentBuilder], (t) => {
      t.createAsync(FSETComponent).then(f => {
        fixture = f;
        comp = fixture.debugElement.componentInstance;
        elem = fixture.debugElement.nativeElement;
        done(); // Signal jasmine that beforeEach is complete.
      }).catch((e) => done.fail(e));
    })(); // Call the function that inject returns.
  });


  describe('with no content', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not display the table.', () => {
      expect(elem.querySelector('table')).toBeNull();
    });

    it('should not display the search bar.', () => {
      expect(elem.querySelector('#fset-search-bar')).toBeNull();
    });

  });


  describe('with empty content', () => {

    beforeEach(() => {
      comp.content = new MockContent();
      fixture.detectChanges();
    });

    it('should display empty table with empty content.', () => {
      expect(elem.querySelector('tbody > tr')).toBeNull();
    });

    it('should display the search bar', () => {
      expect(elem.querySelector('#fset-search-bar')).not.toBeNull();
    });

    it('should have the right headers', () => {
      let header: string = elem.querySelector('thead > tr').innerText;
      expect(header).toContain('id');
      expect(header).toContain('name');
    });

  });


});


class MockContent extends FSETContent<any> {

  static propertyMap: FSETPropertyMap<any> =
  {
    id: {
      getter: (o: any):string => o.id,
      setter: (v: string, o: any) => o.id = v
    },
    name: {
      getter: (o: any):string => o.name,
      setter: (v: string, o: any) => o.name = v
    }
  };

  constructor (){
    super(MockContent.propertyMap, []);
  }
}
