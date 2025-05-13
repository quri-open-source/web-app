import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLabComponent } from './design-lab.component';

describe('DesignLabComponent', () => {
  let component: DesignLabComponent;
  let fixture: ComponentFixture<DesignLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
