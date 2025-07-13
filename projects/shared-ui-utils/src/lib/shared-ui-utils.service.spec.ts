import { TestBed } from '@angular/core/testing';

import { SharedUiUtilsService } from './shared-ui-utils.service';

describe('SharedUiUtilsService', () => {
  let service: SharedUiUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUiUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
