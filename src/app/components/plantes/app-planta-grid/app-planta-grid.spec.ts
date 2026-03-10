import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPlantaGrid } from './app-planta-grid';

describe('AppItemsGrid', () => {
  let component: AppPlantaGrid;
  let fixture: ComponentFixture<AppPlantaGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPlantaGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPlantaGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
