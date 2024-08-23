import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationstatusComponent } from './applicationstatus.component';

describe('ApplicationstatusComponent', () => {
  let component: ApplicationstatusComponent;
  let fixture: ComponentFixture<ApplicationstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationstatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
