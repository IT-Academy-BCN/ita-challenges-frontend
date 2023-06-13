import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceComponent } from './resource.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
 
describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceComponent],
      imports: [RouterTestingModule,
        HttpClientTestingModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
