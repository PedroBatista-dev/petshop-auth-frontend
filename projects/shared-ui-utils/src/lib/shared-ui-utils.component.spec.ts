import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiUtilsComponent } from './shared-ui-utils.component';

describe('SharedUiUtilsComponent', () => {
  let component: SharedUiUtilsComponent;
  let fixture: ComponentFixture<SharedUiUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiUtilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedUiUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
