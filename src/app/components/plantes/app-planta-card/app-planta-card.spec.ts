import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppItemCard } from './app-planta-card';

describe('AppItemCard', () => {
  let component: AppItemCard;
  let fixture: ComponentFixture<AppItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppItemCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppItemCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
