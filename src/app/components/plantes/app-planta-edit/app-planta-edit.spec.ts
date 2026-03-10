import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFloatForm } from './app-planta-edit';

describe('AppFloatForm', () => {
  let component: AppFloatForm;
  let fixture: ComponentFixture<AppFloatForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFloatForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFloatForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
