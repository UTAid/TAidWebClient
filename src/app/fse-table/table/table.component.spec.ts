/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement, provide, ApplicationRef } from '@angular/core';

import {
  beforeEach, addProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject,
  TestComponentBuilder, ComponentFixture
} from '@angular/core/testing';

import { TableComponent } from './table.component';
import { Column, SortOrder } from '../shared/column';
import * as mock from '../testing/mock-content';


describe('Component: Table', () => {
  it('should create an instance', () => {
    let component = new TableComponent<any>();
    expect(component).toBeTruthy();
  });
});

describe('Component: FSETable', () => {

  let fixture: ComponentFixture<TableComponent<any>>;
  let comp: TableComponent<any>;
  let elem: any;

  // Setup the fixture, and provide shortcuts to the component and
  // native element.
  beforeEach((done) => {
    addProviders([TestComponentBuilder]);
    inject([TestComponentBuilder], (t) => {
      t.createAsync(TableComponent).then(f => {
        fixture = f;
        comp = fixture.debugElement.componentInstance;
        elem = fixture.debugElement.nativeElement;
        done(); // Signal jasmine that beforeEach is complete.
      }).catch((e) => done.fail(e));
    })(); // Call the function that inject returns.
  });


  describe('with empty columns', () => {

    beforeEach(() => {
      comp.rows = new Array<mock.Model>();
      comp.rows.push(new mock.Model('testing', 'is', 'fun@cscc01.com'));
    })

    it('should not display the table on null columns', () => {
      fixture.detectChanges();
      expect(elem.querySelector('#fset')).toBeNull();
    });

    it('should not display the table on empty columns', () => {
      comp.cols = [];
      fixture.detectChanges();
      expect(elem.querySelector('#fset-empty-text')).not.toBeNull();
    });

  });


  describe('with empty rows', () => {

    beforeEach(() => {
      comp.cols = mock.generateColumns(mock.PROPERTY_MAP_MULTI);
      comp.rows = [];
      fixture.detectChanges();
    });

    it('should display empty table with empty content.', () => {
      expect(elem.querySelector('#fset-empty-text')).not.toBeNull();
    });

    it('should have the right headers', () => {
      expect(elem.querySelector('#fset-col-0').innerText.trim()).toEqual('id');
      expect(elem.querySelector('#fset-col-1').innerText.trim()).toEqual('name');
      expect(elem.querySelector('#fset-col-2').innerText.trim()).toEqual('email');
    });

    describe("header cell sorting", () => {
      let sortArrow: any;

      beforeEach(() => {
        sortArrow = elem.querySelector('#fset-col-0 > .fa');
      });

      it('should not display arrow when not clicked', () => {
        expect(sortArrow.style.visibility).toEqual('hidden');
      });

      it('should display up arrow when clicked once', () => {
        sortArrow.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('inherit');
        expect(sortArrow.className).toContain('fa-chevron-up');
      });

      it('should display down arrow when clicked twice', () => {
        sortArrow.click(); sortArrow.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('inherit');
        expect(sortArrow.className).toContain('fa-chevron-down');
      });

      it('should display up arrow when clicked thrice', () => {
        sortArrow.click(); sortArrow.click(); sortArrow.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('inherit');
        expect(sortArrow.className).toContain('fa-chevron-up');
      });

      it('should remove arrow when other header cell is clicked', () => {
        sortArrow.click();
        fixture.detectChanges();
        let otherCell = elem.querySelector('#fset-col-1');
        otherCell.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('hidden');
      });
    });

  });


  describe('with single row', () => {

    beforeEach(() => {
      comp.cols = mock.generateColumns(mock.PROPERTY_MAP_MULTI);
      comp.rows = new Array<mock.Model>();
      comp.rows.push(new mock.Model('testing', 'is', 'fun@cscc01.com'));
      fixture.detectChanges();
    });

    it('should display the right row', () => {
      let cell = elem.querySelector('#fset-cell-0-0').innerText.trim();
      expect(cell).toEqual('testing');
      cell = elem.querySelector('#fset-cell-0-1').innerText.trim();
      expect(cell).toEqual('is');
      cell = elem.querySelector('#fset-cell-0-2').innerText.trim();
      expect(cell).toEqual('fun@cscc01.com');
    });

    it('should only display one row', () => {
      expect(elem.querySelectorAll('tbody > tr').length).toEqual(1);
    });
  });


  describe('with multiple rows', () => {

    beforeEach(() => {
      comp.cols = mock.generateColumns(mock.PROPERTY_MAP_MULTI);
      comp.rows = new Array<mock.Model>();
      comp.rows.push(new mock.Model('testing', 'is fun!', null));
      comp.rows.push(new mock.Model('joke', 'Why couldnt the bicycle', 'stand up?'));
      comp.rows.push(new mock.Model('jokeAns', 'Becuse it was', 'two tired.'));
      fixture.detectChanges();
    });

    it('should display the right rows', () => {
      let cell = elem.querySelector('#fset-cell-0-0').innerText.trim();
      expect(cell).toEqual('testing');
      cell = elem.querySelector('#fset-cell-0-1').innerText.trim();
      expect(cell).toEqual('is fun!');
      cell = elem.querySelector('#fset-cell-0-2').innerText.trim();
      expect(cell).toEqual('None');

      cell = elem.querySelector('#fset-cell-1-0').innerText.trim();
      expect(cell).toEqual('joke');
      cell = elem.querySelector('#fset-cell-1-1').innerText.trim();
      expect(cell).toEqual('Why couldnt the bicycle');
      cell = elem.querySelector('#fset-cell-1-2').innerText.trim();
      expect(cell).toEqual('stand up?');

      cell = elem.querySelector('#fset-cell-2-0').innerText.trim();
      expect(cell).toEqual('jokeAns');
      cell = elem.querySelector('#fset-cell-2-1').innerText.trim();
      expect(cell).toEqual('Becuse it was');
      cell = elem.querySelector('#fset-cell-2-2').innerText.trim();
      expect(cell).toEqual('two tired.');
    });

    it('should only display three rows', () => {
      expect(elem.querySelectorAll('tbody > tr').length).toEqual(3);
    });
  });

});
