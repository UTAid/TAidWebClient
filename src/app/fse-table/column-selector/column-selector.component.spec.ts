/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { ColumnSelectorComponent } from './column-selector.component';

describe('Component: ColumnSelector', () => {
  it('should create an instance', () => {
    let component = new ColumnSelectorComponent();
    expect(component).toBeTruthy();
  });
});
