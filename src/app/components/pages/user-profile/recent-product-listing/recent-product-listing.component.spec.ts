import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentProductListingComponent } from './recent-product-listing.component';

describe('RecentProductListingComponent', () => {
  let component: RecentProductListingComponent;
  let fixture: ComponentFixture<RecentProductListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentProductListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentProductListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
