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
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize input correctly', () => {
    component.author = "John Doe";
    component.date = new Date;
    component.id = "x4815y162342z";
    component.description = "lorem ipsum";

    expect(component.author).toEqual('John Doe');
    expect(component.date).toBeDefined();
    expect(component.id).toEqual('x4815y162342z');
    expect(component.description).toEqual('lorem ipsum');



  })



});