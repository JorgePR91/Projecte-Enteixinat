import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppItemsTable } from './app-planta-table';

describe('AppItemsTable', () => {
  let component: AppItemsTable;
  let fixture: ComponentFixture<AppItemsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppItemsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppItemsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
