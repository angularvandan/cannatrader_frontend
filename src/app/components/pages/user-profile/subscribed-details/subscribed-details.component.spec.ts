import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedDetailsComponent } from './subscribed-details.component';

describe('SubscribedDetailsComponent', () => {
  let component: SubscribedDetailsComponent;
  let fixture: ComponentFixture<SubscribedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribedDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
