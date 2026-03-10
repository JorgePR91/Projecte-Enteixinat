import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPlantaMapa } from './app-planta-mapa';

describe('AppPlantesMapa', () => {
  let component: AppPlantaMapa;
  let fixture: ComponentFixture<AppPlantaMapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPlantaMapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPlantaMapa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
