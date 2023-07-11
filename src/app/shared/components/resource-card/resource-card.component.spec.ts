import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceCardComponent } from './resource-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
 
describe('ResourceComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceCardComponent],
      imports: [RouterTestingModule,
        HttpClientTestingModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});