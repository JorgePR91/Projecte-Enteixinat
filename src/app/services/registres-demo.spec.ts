import { TestBed } from '@angular/core/testing';

import { RegistresDemo } from './registres-demo';

describe('RegistresDemo', () => {
  let service: RegistresDemo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistresDemo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
