import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCreateForm } from './app-planta-create';

describe('AppCreateForm', () => {
  let component: AppCreateForm;
  let fixture: ComponentFixture<AppCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCreateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCreateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
