/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { FSETableComponent } from './fse-table.component';

describe('Component: FseTable', () => {
  it('should create an instance', () => {
    let component = new FSETableComponent();
    expect(component).toBeTruthy();
  });
});
