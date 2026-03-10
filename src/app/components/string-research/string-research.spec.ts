import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringResearch } from './string-research';

describe('StringResearch', () => {
  let component: StringResearch;
  let fixture: ComponentFixture<StringResearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringResearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringResearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
