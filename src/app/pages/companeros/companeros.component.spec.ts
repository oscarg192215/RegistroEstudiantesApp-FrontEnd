import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanerosComponent } from './companeros.component';

describe('CompanerosComponent', () => {
  let component: CompanerosComponent;
  let fixture: ComponentFixture<CompanerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanerosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
