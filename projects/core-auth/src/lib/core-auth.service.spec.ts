import { TestBed } from '@angular/core/testing';

import { CoreAuthService } from './core-auth.service';

describe('CoreAuthService', () => {
  let service: CoreAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
