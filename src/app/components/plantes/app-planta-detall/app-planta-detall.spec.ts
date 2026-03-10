import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppItemDetall } from './app-planta-detall';

describe('AppItemDetall', () => {
  let component: AppItemDetall;
  let fixture: ComponentFixture<AppItemDetall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppItemDetall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppItemDetall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
